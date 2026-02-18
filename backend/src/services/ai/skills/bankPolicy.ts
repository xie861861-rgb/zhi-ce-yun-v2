/**
 * 银行政策技能模块
 * 智策云V2 - 企业资产匹配平台
 * 
 * 功能：银行产品匹配、利率计算、审批预测
 */

import type { BankProduct, EnterpriseAnalysis } from '../types';

export class BankPolicySkill {
  // 银行产品数据库
  private readonly BANK_PRODUCTS: BankProduct[] = [
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
      propertyTypes: ['residential', 'office', 'commercial', 'industrial', 'factory', 'apartment'],
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
      propertyTypes: ['residential', 'office', 'industrial', 'factory'],
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
    },
    {
      id: '6',
      bankName: '平安银行',
      productName: '新微贷',
      maxLoanRatio: 0.70,
      minLoanAmount: 1000000,
      maxLoanAmount: 20000000,
      interestRate: 4.45,
      loanTermMonths: 360,
      processingDays: 12,
      propertyTypes: ['residential', 'office', 'commercial'],
      requirements: '企业信用记录良好'
    },
    {
      id: '7',
      bankName: '浦发银行',
      productName: '房抵贷',
      maxLoanRatio: 0.70,
      minLoanAmount: 1000000,
      maxLoanAmount: 25000000,
      interestRate: 4.10,
      loanTermMonths: 300,
      processingDays: 18,
      propertyTypes: ['residential', 'office', 'commercial', 'apartment'],
      requirements: '企业成立满2年'
    },
    {
      id: '8',
      bankName: '邮储银行',
      productName: '小企业经营贷款',
      maxLoanRatio: 0.65,
      minLoanAmount: 500000,
      maxLoanAmount: 15000000,
      interestRate: 4.20,
      loanTermMonths: 240,
      processingDays: 20,
      propertyTypes: ['residential', 'commercial'],
      requirements: '企业成立满1年，经营稳定'
    },
    {
      id: '9',
      bankName: '交通银行',
      productName: '抵押e贷',
      maxLoanRatio: 0.70,
      minLoanAmount: 1000000,
      maxLoanAmount: 20000000,
      interestRate: 3.98,
      loanTermMonths: 360,
      processingDays: 14,
      propertyTypes: ['residential', 'office', 'commercial'],
      requirements: '企业信用良好，有房产抵押'
    },
    {
      id: '10',
      bankName: '民生银行',
      productName: '抵押贷款',
      maxLoanRatio: 0.70,
      minLoanAmount: 1000000,
      maxLoanAmount: 30000000,
      interestRate: 4.30,
      loanTermMonths: 360,
      processingDays: 16,
      propertyTypes: ['residential', 'office', 'commercial', 'industrial'],
      requirements: '企业成立满2年，资产负债率不超过70%'
    }
  ];
  
  /**
   * 获取所有银行产品
   */
  getAllProducts(): BankProduct[] {
    return this.BANK_PRODUCTS;
  }
  
  /**
   * 根据资产类型获取适用产品
   */
  getProductsByPropertyType(propertyType: string): BankProduct[] {
    return this.BANK_PRODUCTS.filter(p => 
      p.propertyTypes.includes(propertyType)
    );
  }
  
  /**
   * 匹配最优银行产品
   */
  matchBestProduct(
    loanAmount: number,
    propertyType: string,
    enterprise?: EnterpriseAnalysis
  ): BankProduct | null {
    // 过滤符合条件的产品的适用
    let candidates = this.BANK_PRODUCTS.filter(p => 
      p.propertyTypes.includes(propertyType) &&
      loanAmount >= p.minLoanAmount &&
      loanAmount <= p.maxLoanAmount
    );
    
    // 如果企业提供，根据风险等级调整
    if (enterprise) {
      // 高风险企业排除部分银行
      if (enterprise.riskLevel === 'D' || enterprise.riskLevel === 'E') {
        candidates = candidates.filter(p => 
          p.bankName !== '建设银行' && 
          p.bankName !== '招商银行'
        );
      }
    }
    
    if (candidates.length === 0) {
      return null;
    }
    
    // 评分排序
    candidates = candidates.map(p => ({
      product: p,
      score: this.scoreProduct(p, loanAmount, enterprise)
    })).sort((a, b) => b.score - a.score)
      .map(item => item.product);
    
    return candidates[0];
  }
  
  /**
   * 评分产品
   */
  private scoreProduct(
    product: BankProduct,
    loanAmount: number,
    enterprise?: EnterpriseAnalysis
  ): number {
    let score = 100;
    
    // 利率评分 (权重40%)
    if (product.interestRate <= 3.9) score -= 0;
    else if (product.interestRate <= 4.2) score -= 10;
    else if (product.interestRate <= 4.5) score -= 20;
    else score -= 30;
    
    // 审批速度评分 (权重25%)
    if (product.processingDays <= 10) score -= 0;
    else if (product.processingDays <= 15) score -= 5;
    else if (product.processingDays <= 20) score -= 10;
    else score -= 15;
    
    // 贷款成数评分 (权重20%)
    if (product.maxLoanRatio >= 0.7) score -= 0;
    else if (product.maxLoanRatio >= 0.65) score -= 5;
    else score -= 10;
    
    // 额度范围评分 (权重15%)
    if (product.maxLoanAmount >= loanAmount * 1.5) score -= 0;
    else if (product.maxLoanAmount >= loanAmount) score -= 5;
    else score -= 10;
    
    return score;
  }
  
  /**
   * 预测审批概率
   */
  predictApprovalProbability(
    product: BankProduct,
    enterprise: EnterpriseAnalysis
  ): {
    probability: number;  // 0-100
    factors: string[];
    recommendations: string[];
  } {
    const factors: string[] = [];
    const recommendations: string[] = [];
    let probability = 80; // 基础概率
    
    // 信用评分影响
    if (enterprise.creditScore >= 80) {
      probability += 10;
      factors.push('企业信用评分优秀');
    } else if (enterprise.creditScore < 60) {
      probability -= 20;
      factors.push('企业信用评分较低');
    }
    
    // 风险等级影响
    if (enterprise.riskLevel === 'A') {
      probability += 10;
      factors.push('企业风险等级A');
    } else if (enterprise.riskLevel === 'B') {
      probability += 5;
    } else if (enterprise.riskLevel === 'C') {
      probability -= 10;
      factors.push('企业风险等级C');
    } else if (enterprise.riskLevel === 'D' || enterprise.riskLevel === 'E') {
      probability -= 30;
      factors.push('企业风险等级较低，审批困难');
      recommendations.push('建议先优化企业资质');
    }
    
    // 负债率影响
    if (enterprise.debtRatio <= 50) {
      probability += 5;
    } else if (enterprise.debtRatio > 70) {
      probability -= 20;
      factors.push('负债率超过70%');
      recommendations.push('建议降低负债率后再申请');
    }
    
    // 贷款金额影响
    if (enterprise.maxLoanAmount >= product.maxLoanAmount * 0.8) {
      probability += 5;
    }
    
    probability = Math.max(10, Math.min(95, probability));
    
    return { probability, factors, recommendations };
  }
  
  /**
   * 计算贷款月供
   */
  calculateMonthlyPayment(
    loanAmount: number,
    interestRate: number,
    termMonths: number
  ): {
    monthlyPayment: number;
    totalInterest: number;
    totalRepayment: number;
  } {
    const monthlyRate = interestRate / 100 / 12;
    
    let monthlyPayment = 0;
    let totalInterest = 0;
    
    if (monthlyRate > 0) {
      monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / 
                       (Math.pow(1 + monthlyRate, termMonths) - 1);
      totalInterest = monthlyPayment * termMonths - loanAmount;
    } else {
      monthlyPayment = loanAmount / termMonths;
    }
    
    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalRepayment: Math.round(loanAmount + totalInterest)
    };
  }
  
  /**
   * 获取推荐银行列表（返回多个选项）
   */
  getRecommendedBanks(
    loanAmount: number,
    propertyType: string,
    enterprise?: EnterpriseAnalysis,
    topN: number = 3
  ): Array<{
    product: BankProduct;
    approvalProbability: number;
    monthlyPayment: number;
  }> {
    const candidates = this.BANK_PRODUCTS.filter(p => 
      p.propertyTypes.includes(propertyType) &&
      loanAmount >= p.minLoanAmount &&
      loanAmount <= p.maxLoanAmount
    );
    
    const results = candidates.map(product => {
      const approval = enterprise 
        ? this.predictApprovalProbability(product, enterprise)
        : { probability: 70, factors: [], recommendations: [] };
      
      const payment = this.calculateMonthlyPayment(
        loanAmount,
        product.interestRate,
        product.loanTermMonths
      );
      
      return {
        product,
        approvalProbability: approval.probability,
        monthlyPayment: payment.monthlyPayment
      };
    });
    
    // 按综合评分排序
    results.sort((a, b) => {
      const scoreA = a.approvalProbability * 0.6 - a.monthlyPayment * 0.00001;
      const scoreB = b.approvalProbability * 0.6 - b.monthlyPayment * 0.00001;
      return scoreB - scoreA;
    });
    
    return results.slice(0, topN);
  }
}

export default BankPolicySkill;
