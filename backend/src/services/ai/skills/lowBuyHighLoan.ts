/**
 * 低买高贷核心技能模块 ⭐
 * 智策云V2 - 企业资产匹配平台
 * 
 * 核心功能：计算企业购入资产的套现空间
 * 商业模式：低买高贷 = 购入价(7成) + 税费 → 银行贷款(评估价9成×70%)
 */

import type { 
  LowBuyHighLoanResult, 
  BankProduct,
  EnterpriseAnalysis,
  PropertyValuation 
} from '../types';

// 默认银行产品数据
const DEFAULT_BANK_PRODUCTS: BankProduct[] = [
  {
    id: '1',
    bankName: '中国银行',
    productName: '企业经营贷',
    maxLoanRatio: 0.70,
    minLoanAmount: 1000000,
    maxLoanAmount: 30000000,
    interestRate: 3.85,
    loanTermMonths: 360,
    processingDays: 15,
    propertyTypes: ['residential', 'office', 'commercial'],
    requirements: '企业成立满2年，负债率不超过70%'
  },
  {
    id: '2',
    bankName: '工商银行',
    productName: '抵押经营贷',
    maxLoanRatio: 0.70,
    minLoanAmount: 500000,
    maxLoanAmount: 50000000,
    interestRate: 3.95,
    loanTermMonths: 360,
    processingDays: 20,
    propertyTypes: ['residential', 'office', 'commercial', 'industrial'],
    requirements: '企业成立满1年，有固定经营场所'
  },
  {
    id: '3',
    bankName: '建设银行',
    productName: '房抵快贷',
    maxLoanRatio: 0.65,
    minLoanAmount: 1000000,
    maxLoanAmount: 20000000,
    interestRate: 3.75,
    loanTermMonths: 240,
    processingDays: 10,
    propertyTypes: ['residential', 'office'],
    requirements: '企业信用良好，有稳定流水'
  },
  {
    id: '4',
    bankName: '农业银行',
    productName: '科创贷',
    maxLoanRatio: 0.75,
    minLoanAmount: 2000000,
    maxLoanAmount: 50000000,
    interestRate: 4.15,
    loanTermMonths: 360,
    processingDays: 25,
    propertyTypes: ['residential', 'office', 'industrial'],
    requirements: '高新技术企业或专精特新企业'
  },
  {
    id: '5',
    bankName: '招商银行',
    productName: '周转易',
    maxLoanRatio: 0.70,
    minLoanAmount: 500000,
    maxLoanAmount: 30000000,
    interestRate: 4.25,
    loanTermMonths: 360,
    processingDays: 15,
    propertyTypes: ['residential', 'office', 'commercial'],
    requirements: '企业纳税等级A/B级'
  }
];

export class LowBuyHighLoanSkill {
  /**
   * 计算低买高贷方案（核心方法）
   * 
   * @param property 资产信息
   * @param enterprise 企业分析结果
   * @returns 低买高贷计算结果
   */
  async calculate(
    property: {
      id: string;
      price: number;           // 购入价/挂牌价
      buildingArea: number;    // 建筑面积
      propertyType: string;    // 物业类型
      hasLease: boolean;       // 是否有租约
      monthlyRent?: number;   // 月租金
      sourceType?: string;    // 来源类型 (auction/secondhand)
    },
    enterprise: EnterpriseAnalysis
  ): Promise<LowBuyHighLoanResult> {
    
    const purchasePrice = property.price;
    const sourceType = property.sourceType || 'secondhand';
    
    // 1. 预估市场价值（通常是购入价的1.25-1.4倍）
    const marketValue = this.estimateMarketValue(purchasePrice, sourceType);
    
    // 2. 计算折扣率
    const discountRate = ((marketValue - purchasePrice) / marketValue) * 100;
    
    // 3. 计算税费（法拍房vs二手房不同）
    const { taxAndFees, taxRate } = this.calculateTaxAndFees(
      purchasePrice, 
      property.propertyType,
      sourceType
    );
    
    // 4. 计算中介费
    const agentFee = purchasePrice * 0.015; // 1.5%
    
    // 5. 购入总成本
    const purchaseCost = purchasePrice + taxAndFees + agentFee;
    
    // 6. 银行评估价（通常是市场价的85-95%）
    const bankValuation = marketValue * 0.90;
    
    // 7. 计算可贷款金额（取最大值，但不超过企业承受能力）
    const maxLoanByEnterprise = enterprise.maxLoanAmount || 0;
    const maxLoanByProperty = bankValuation * 0.70; // 住宅7成
    
    // 取两者的较小值，但至少保证正值
    let loanAmount = Math.min(maxLoanByEnterprise, maxLoanByProperty);
    loanAmount = Math.max(0, loanAmount);
    
    // 8. 确定贷款成数
    const loanRatio = purchasePrice > 0 ? (loanAmount / purchasePrice) : 0;
    
    // 9. 选择最优银行产品
    const recommendedBank = this.findBestBank(
      loanAmount, 
      property.propertyType,
      enterprise
    );
    
    // 10. 计算月供（等额本息）
    const interestRate = recommendedBank.interestRate / 100 / 12;
    const termMonths = recommendedBank.loanTermMonths;
    let monthlyPayment = 0;
    let totalInterest = 0;
    
    if (interestRate > 0 && loanAmount > 0 && termMonths > 0) {
      monthlyPayment = loanAmount * interestRate * Math.pow(1 + interestRate, termMonths) / 
                       (Math.pow(1 + interestRate, termMonths) - 1);
      totalInterest = monthlyPayment * termMonths - loanAmount;
    } else if (loanAmount > 0 && termMonths > 0) {
      // 简化计算（无息或利率为0）
      monthlyPayment = loanAmount / termMonths;
    }
    
    // 11. 计算净套现金额
    const netCashOut = loanAmount - purchaseCost;
    const cashOutRatio = purchaseCost > 0 ? (netCashOut / purchaseCost) * 100 : 0;
    
    // 12. 租金收益计算
    let monthlyRent = property.monthlyRent || 0;
    let annualRentIncome = monthlyRent * 12;
    let monthlyNetIncome = monthlyRent - monthlyPayment;
    
    // 13. 评估可行性
    const { isViable, viabilityScore, riskWarnings } = this.assessViability({
      discountRate,
      cashOutRatio,
      netCashOut,
      loanRatio,
      enterprise,
      property
    });
    
    // 14. 生成推荐理由
    const recommendation = this.generateRecommendation({
      purchasePrice,
      marketValue,
      discountRate,
      loanAmount,
      netCashOut,
      cashOutRatio,
      monthlyRent,
      monthlyPayment,
      monthlyNetIncome,
      isViable,
      recommendedBank
    });
    
    return {
      propertyId: property.id,
      enterpriseId: enterprise.enterpriseId,
      propertyPrice: purchasePrice,
      marketValue,
      discountRate: Math.round(discountRate * 100) / 100,
      purchaseCost: Math.round(purchaseCost),
      taxAndFees: Math.round(taxAndFees),
      agentFee: Math.round(agentFee),
      bankValuation: Math.round(bankValuation),
      loanAmount: Math.round(loanAmount),
      loanRatio: Math.round(loanRatio * 10000) / 100,
      interestRate: recommendedBank.interestRate,
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      netCashOut: Math.round(netCashOut),
      cashOutRatio: Math.round(cashOutRatio * 100) / 100,
      monthlyRent,
      annualRentIncome: Math.round(annualRentIncome),
      monthlyNetIncome: Math.round(monthlyNetIncome),
      recommendedBank,
      isViable,
      viabilityScore,
      recommendation,
      riskWarnings
    };
  }
  
  /**
   * 预估市场价值
   * 法拍房通常5-6折，二手房7-8折
   */
  private estimateMarketValue(price: number, sourceType: string): number {
    if (sourceType === 'auction') {
      // 法拍房：购入价通常是市场价的50-60%
      return price / 0.55;
    } else {
      // 二手房：购入价通常是市场价的70-80%
      return price / 0.75;
    }
  }
  
  /**
   * 计算税费
   * 住宅vs非住宅，法拍vs二手不同
   */
  private calculateTaxAndFees(
    price: number, 
    propertyType: string,
    sourceType: string
  ): { taxAndFees: number; taxRate: number } {
    let taxRate: number;
    
    if (sourceType === 'auction') {
      // 法拍房税费较高
      taxRate = propertyType === 'residential' ? 0.08 : 0.12;
    } else {
      // 二手房
      taxRate = propertyType === 'residential' ? 0.05 : 0.08;
    }
    
    return {
      taxAndFees: price * taxRate,
      taxRate
    };
  }
  
  /**
   * 找到最优银行
   */
  private findBestBank(
    loanAmount: number,
    propertyType: string,
    enterprise: EnterpriseAnalysis
  ): BankProduct {
    // 过滤出符合条件的银行产品
    const eligible = DEFAULT_BANK_PRODUCTS.filter(p => 
      p.propertyTypes.includes(propertyType) &&
      loanAmount >= p.minLoanAmount &&
      loanAmount <= p.maxLoanAmount
    );
    
    if (eligible.length === 0) {
      // 返回默认产品
      return DEFAULT_BANK_PRODUCTS[0];
    }
    
    // 按利率排序（选最低的）
    eligible.sort((a, b) => a.interestRate - b.interestRate);
    
    return eligible[0];
  }
  
  /**
   * 评估可行性
   */
  private assessViability(params: {
    discountRate: number;
    cashOutRatio: number;
    netCashOut: number;
    loanRatio: number;
    enterprise: EnterpriseAnalysis;
    property: any;
  }): { 
    isViable: boolean; 
    viabilityScore: number;
    riskWarnings: string[];
  } {
    const { discountRate, cashOutRatio, netCashOut, loanRatio, enterprise, property } = params;
    
    let score = 100;
    const warnings: string[] = [];
    
    // 折扣率评估 (权重30%)
    if (discountRate < 15) {
      score -= 20;
      warnings.push('折扣率较低，投资价值有限');
    } else if (discountRate < 20) {
      score -= 10;
    }
    
    // 套现比例评估 (权重30%)
    if (cashOutRatio < 0) {
      score -= 30;
      warnings.push('净套现为负，不建议操作');
    } else if (cashOutRatio < 10) {
      score -= 15;
      warnings.push('套现比例较低');
    } else if (cashOutRatio >= 25) {
      // 优质项目
    }
    
    // 负债率评估 (权重20%)
    if (enterprise.debtRatio > 70) {
      score -= 20;
      warnings.push('企业负债率较高，银行审批有风险');
    } else if (enterprise.debtRatio > 60) {
      score -= 10;
    }
    
    // 租金覆盖评估 (权重20%)
    if (property.hasLease && property.monthlyRent) {
      // 如果有租约，检查租金能否覆盖月供
      const coverage = property.monthlyRent / (params.netCashOut > 0 ? 1 : 1);
      if (coverage < 0.5) {
        score -= 10;
        warnings.push('租金难以覆盖月供');
      }
    }
    
    score = Math.max(0, Math.min(100, score));
    
    // 可行性判断：套现比例为正且评分>=60
    const isViable = netCashOut > 0 && score >= 60;
    
    return {
      isViable,
      viabilityScore: score,
      riskWarnings: warnings
    };
  }
  
  /**
   * 生成推荐理由
   */
  private generateRecommendation(params: any): string {
    const {
      purchasePrice,
      marketValue,
      discountRate,
      loanAmount,
      netCashOut,
      cashOutRatio,
      monthlyRent,
      monthlyPayment,
      monthlyNetIncome,
      isViable,
      recommendedBank
    } = params;
    
    const priceInWan = (purchasePrice / 10000).toFixed(0);
    const marketInWan = (marketValue / 10000).toFixed(0);
    const cashOutInWan = (netCashOut / 10000).toFixed(0);
    
    let recommendation = '';
    
    if (isViable) {
      recommendation = `✅ 推荐该方案！`;
    } else {
      recommendation = `⚠️ 该方案需要谨慎考虑。`;
    }
    
    recommendation += `\n\n📊 方案概览：
• 购入价：${priceInWan}万（低于市场价${discountRate.toFixed(0)}%）
• 市场评估价：${marketInWan}万
• 预计贷款：${(loanAmount / 10000).toFixed(0)}万（${recommendedBank.bankName}）
• 净套现金额：${cashOutInWan}万（套现比例${cashOutRatio.toFixed(1)}%）`;
    
    if (monthlyRent > 0) {
      recommendation += `\n\n🏠 租金收益：
• 月租金：${monthlyRent}元
• 月供：${monthlyPayment.toFixed(0)}元
• 月净收入：${monthlyNetIncome.toFixed(0)}元`;
    }
    
    recommendation += `\n\n🏦 推荐银行：${recommendedBank.bankName}
• 产品：${recommendedBank.productName}
• 利率：${recommendedBank.interestRate}%
• 审批周期：${recommendedBank.processingDays}天`;
    
    return recommendation;
  }
  
  /**
   * 批量计算（用于匹配多个资产）
   */
  async calculateBatch(
    properties: any[],
    enterprise: EnterpriseAnalysis
  ): Promise<LowBuyHighLoanResult[]> {
    const results: LowBuyHighLoanResult[] = [];
    
    for (const property of properties) {
      try {
        const result = await this.calculate(property, enterprise);
        results.push(result);
      } catch (error) {
        console.error(`计算资产 ${property.id} 失败:`, error);
      }
    }
    
    // 按套现比例排序
    results.sort((a, b) => b.cashOutRatio - a.cashOutRatio);
    
    return results;
  }
}

export default LowBuyHighLoanSkill;
