/**
 * 主智能体 - 企业资产匹配
 * 智策云V2 - 低买高贷智能匹配系统
 * 
 * 协调所有子智能体和技能，完成企业-资产的智能匹配
 */

import type { 
  EnterpriseAnalysis,
  PropertyValuation,
  MatchingResult,
  LowBuyHighLoanResult,
  SmartMatchRequest,
  SmartMatchResponse
} from '../types';

import { FinancialAnalysisSkill } from '../skills/financialAnalysis';
import { PropertyValuationSkill } from '../skills/propertyValuation';
import { BankPolicySkill } from '../skills/bankPolicy';
import { LowBuyHighLoanSkill } from '../skills/lowBuyHighLoan';

export class MasterAgent {
  private financialSkill: FinancialAnalysisSkill;
  private propertySkill: PropertyValuationSkill;
  private bankSkill: BankPolicySkill;
  private lowBuyHighLoanSkill: LowBuyHighLoanSkill;
  
  constructor() {
    this.financialSkill = new FinancialAnalysisSkill();
    this.propertySkill = new PropertyValuationSkill();
    this.bankSkill = new BankPolicySkill();
    this.lowBuyHighLoanSkill = new LowBuyHighLoanSkill();
  }
  
  /**
   * 企业分析
   * 分析企业财务状况，确定可贷款额度和风险等级
   */
  async analyzeEnterprise(enterpriseData: {
    id: string;
    financialData?: {
      totalAssets: number;
      totalLiabilities: number;
      ownersEquity: number;
      currentAssets: number;
      currentLiabilities: number;
      totalRevenue: number;
      netProfit: number;
      operatingCashFlow: number;
    };
    industryCategory?: string;
    techClassification?: string;
  }): Promise<EnterpriseAnalysis> {
    // 如果有财务数据，进行深度分析
    if (enterpriseData.financialData) {
      return await this.financialSkill.analyze(
        enterpriseData.financialData,
        {
          id: enterpriseData.id,
          industryCategory: enterpriseData.industryCategory,
          techClassification: enterpriseData.techClassification
        }
      );
    }
    
    // 如果没有财务数据，返回默认分析
    return {
      enterpriseId: enterpriseData.id,
      financialScore: 70,
      creditScore: 70,
      riskLevel: 'B',
      maxLoanAmount: 10000000, // 默认1000万
      maxAffordablePrice: 15000000, // 默认1500万
      debtRatio: 50,
      recommendedPropertyTypes: ['residential', 'office', 'commercial'],
      analysisReport: '基于有限信息的初步评估，建议补充财务数据以获得更精确的分析'
    };
  }
  
  /**
   * 资产评估
   * 评估资产市场价值、折扣率、投资评分
   */
  async valuateProperty(propertyData: {
    id: string;
    district?: string;
    communityName?: string;
    buildingArea: number;
    propertyType: string;
    listingPrice?: number;
    floorNumber?: number;
    totalFloors?: number;
    buildingAge?: number;
    hasLease?: boolean;
    monthlyRent?: number;
    sourceType?: string;
  }): Promise<PropertyValuation> {
    return await this.propertySkill.evaluate(propertyData);
  }
  
  /**
   * 智能匹配
   * 核心功能：为企业匹配最优资产组合
   */
  async smartMatch(
    enterprise: EnterpriseAnalysis,
    properties: Array<{
      id: string;
      district?: string;
      communityName?: string;
      buildingArea: number;
      propertyType: string;
      listingPrice?: number;
      floorNumber?: number;
      totalFloors?: number;
      buildingAge?: number;
      hasLease?: boolean;
      monthlyRent?: number;
      sourceType?: string;
    }>,
    options?: {
      topN?: number;
      minDiscount?: number;
      maxPrice?: number;
    }
  ): Promise<MatchingResult[]> {
    const topN = options?.topN || 10;
    const minDiscount = options?.minDiscount || 0;
    const maxPrice = options?.maxPrice || enterprise.maxAffordablePrice * 2;
    
    // 1. 过滤符合条件的产品
    let candidates = properties.filter(p => {
      // 价格过滤
      if (p.listingPrice && p.listingPrice > maxPrice) return false;
      // 类型过滤
      if (!enterprise.recommendedPropertyTypes.includes(p.propertyType)) return false;
      return true;
    });
    
    // 2. 对每个资产进行评估和计算
    const results: MatchingResult[] = [];
    
    for (const property of candidates) {
      try {
        // 资产评估
        const valuation = await this.propertySkill.evaluate(property);
        
        // 跳过折扣率太低的
        if (valuation.discountRate < minDiscount) continue;
        
        // 低买高贷计算
        const lowBuyHighLoan = await this.lowBuyHighLoanSkill.calculate(
          {
            id: property.id,
            price: property.listingPrice || valuation.estimatedMarketPrice * 0.8,
            buildingArea: property.buildingArea,
            propertyType: property.propertyType,
            hasLease: property.hasLease,
            monthlyRent: property.monthlyRent,
            sourceType: property.sourceType
          },
          enterprise
        );
        
        // 3. 计算综合匹配评分
        const matchScore = this.calculateMatchScore(enterprise, valuation, lowBuyHighLoan);
        
        // 4. 生成匹配原因
        const matchReasons = this.generateMatchReasons(enterprise, valuation, lowBuyHighLoan);
        
        results.push({
          id: `match_${property.id}_${Date.now()}`,
          enterpriseId: enterprise.enterpriseId,
          propertyId: property.id,
          matchScore,
          matchReasons,
          lowBuyHighLoan: {
            ...lowBuyHighLoan,
            isViable: lowBuyHighLoan.isViable !== undefined ? lowBuyHighLoan.isViable : false
          },
          status: 'recommended',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } catch (error) {
        console.error(`匹配资产 ${property.id} 失败:`, error);
      }
    }
    
    // 5. 按匹配度排序
    results.sort((a, b) => b.matchScore - a.matchScore);
    
    // 6. 返回Top N
    return results.slice(0, topN);
  }
  
  /**
   * 计算匹配评分
   */
  private calculateMatchScore(
    enterprise: EnterpriseAnalysis,
    valuation: PropertyValuation,
    lowBuyHighLoan: LowBuyHighLoanResult
  ): number {
    let score = 50; // 基础分
    
    // 投资评分 (权重30%)
    score += (valuation.investmentScore / 100) * 30;
    
    // 套现比例 (权重40%)
    if (lowBuyHighLoan.cashOutRatio >= 25) {
      score += 40;
    } else if (lowBuyHighLoan.cashOutRatio >= 15) {
      score += 30;
    } else if (lowBuyHighLoan.cashOutRatio >= 10) {
      score += 20;
    } else if (lowBuyHighLoan.cashOutRatio > 0) {
      score += 10;
    } else {
      score -= 20; // 负套现
    }
    
    // 贷款可行性 (权重20%)
    const approvalProb = lowBuyHighLoan.recommendedBank.interestRate <= 4 ? 20 : 10;
    score += approvalProb;
    
    // 企业适配度 (权重10%)
    const priceRatio = lowBuyHighLoan.propertyPrice / enterprise.maxAffordablePrice;
    if (priceRatio <= 1) {
      score += 10;
    } else if (priceRatio <= 1.3) {
      score += 5;
    }
    
    return Math.round(Math.min(100, Math.max(0, score)));
  }
  
  /**
   * 生成匹配原因
   */
  private generateMatchReasons(
    enterprise: EnterpriseAnalysis,
    valuation: PropertyValuation,
    lowBuyHighLoan: LowBuyHighLoanResult
  ): string[] {
    const reasons: string[] = [];
    
    // 折扣原因
    if (valuation.discountRate >= 20) {
      reasons.push(`低于市场价${valuation.discountRate.toFixed(0)}%`);
    }
    
    // 套现原因
    if (lowBuyHighLoan.netCashOut > 0) {
      reasons.push(`预计可套现${(lowBuyHighLoan.netCashOut / 10000).toFixed(0)}万`);
    }
    
    // 租金收益
    if (lowBuyHighLoan.monthlyRent > 0) {
      const coverage = (lowBuyHighLoan.monthlyRent / lowBuyHighLoan.monthlyPayment * 100).toFixed(0);
      reasons.push(`租金可覆盖月供${coverage}%`);
    }
    
    // 银行优惠
    if (lowBuyHighLoan.recommendedBank.interestRate <= 4) {
      reasons.push(`${lowBuyHighLoan.recommendedBank.bankName}利率仅${lowBuyHighLoan.recommendedBank.interestRate}%`);
    }
    
    // 风险匹配
    if (enterprise.riskLevel === 'A' || enterprise.riskLevel === 'B') {
      reasons.push('企业资质良好，贷款审批通过率高');
    }
    
    return reasons;
  }
  
  /**
   * 快速计算低买高贷（单资产）
   */
  async calculateLowBuyHighLoan(
    property: any,
    enterprise: EnterpriseAnalysis
  ): Promise<LowBuyHighLoanResult> {
    return await this.lowBuyHighLoanSkill.calculate(
      {
        id: property.id,
        price: property.listingPrice,
        buildingArea: property.buildingArea,
        propertyType: property.propertyType,
        hasLease: property.hasLease,
        monthlyRent: property.monthlyRent,
        sourceType: property.sourceType
      },
      enterprise
    );
  }
}

export default MasterAgent;
