/**
 * 财务分析技能模块
 * 智策云V2 - 企业资产匹配平台
 * 
 * 功能：分析企业财务状况，计算可贷款额度
 */

import type { EnterpriseAnalysis, EnterpriseFinancialData } from '../types';

export class FinancialAnalysisSkill {
  /**
   * 分析企业财务状况
   */
  async analyze(
    financialData: EnterpriseFinancialData,
    enterpriseInfo: {
      id: string;
      industryCategory?: string;
      techClassification?: string;
      operatingYears?: number;
    }
  ): Promise<EnterpriseAnalysis> {
    
    // 1. 计算关键财务指标
    const metrics = this.calculateMetrics(financialData);
    
    // 2. 计算负债率
    const debtRatio = this.calculateDebtRatio(financialData);
    
    // 3. 评估信用状况
    const creditScore = this.assessCredit(financialData, metrics);
    
    // 4. 计算最大可贷款金额
    const maxLoanAmount = this.calculateMaxLoan(financialData, debtRatio);
    
    // 5. 计算可承受的最高购入价格
    const maxAffordablePrice = this.calculateMaxAffordablePrice(
      financialData, 
      maxLoanAmount
    );
    
    // 6. 确定风险等级
    const riskLevel = this.determineRiskLevel(debtRatio, creditScore, metrics);
    
    // 7. 推荐资产类型
    const recommendedPropertyTypes = this.recommendPropertyTypes(
      enterpriseInfo,
      debtRatio,
      maxAffordablePrice
    );
    
    // 8. 生成分析报告
    const analysisReport = this.generateReport({
      debtRatio,
      creditScore,
      maxLoanAmount,
      maxAffordablePrice,
      riskLevel,
      metrics
    });
    
    return {
      enterpriseId: enterpriseInfo.id,
      financialScore: metrics.score,
      creditScore,
      riskLevel,
      maxLoanAmount,
      maxAffordablePrice,
      debtRatio,
      recommendedPropertyTypes,
      analysisReport
    };
  }
  
  /**
   * 计算财务指标
   */
  private calculateMetrics(data: EnterpriseFinancialData) {
    const {
      totalAssets,
      totalLiabilities,
      ownersEquity,
      currentAssets,
      currentLiabilities,
      totalRevenue,
      netProfit,
      operatingCashFlow
    } = data;
    
    // 资产负债率
    const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
    
    // 流动比率
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    
    // 速动比率（简化版）
    const quickRatio = currentLiabilities > 0 
      ? (currentAssets * 0.8) / currentLiabilities  // 假设存货占流动资产20%
      : 0;
    
    // 净资产收益率 ROE
    const roe = ownersEquity > 0 ? (netProfit / ownersEquity) * 100 : 0;
    
    // 净利润率
    const netProfitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    
    // 现金流健康度
    const cashFlowHealth = operatingCashFlow > 0 ? '良好' : '紧张';
    
    // 综合评分 (0-100)
    let score = 100;
    
    // 负债率扣分
    if (debtRatio > 70) score -= 25;
    else if (debtRatio > 60) score -= 15;
    else if (debtRatio > 50) score -= 8;
    
    // 流动比率扣分
    if (currentRatio < 1) score -= 15;
    else if (currentRatio < 1.5) score -= 8;
    
    // 盈利能力扣分
    if (netProfit < 0) score -= 20;
    else if (netProfitMargin < 5) score -= 10;
    
    // 现金流扣分
    if (operatingCashFlow < 0) score -= 15;
    
    score = Math.max(0, Math.min(100, score));
    
    return {
      debtRatio,
      currentRatio,
      quickRatio,
      roe,
      netProfitMargin,
      cashFlowHealth,
      score
    };
  }
  
  /**
   * 计算负债率
   */
  private calculateDebtRatio(data: EnterpriseFinancialData): number {
    if (data.totalAssets <= 0) return 0;
    return (data.totalLiabilities / data.totalAssets) * 100;
  }
  
  /**
   * 评估信用状况
   */
  private assessCredit(
    data: EnterpriseFinancialData, 
    metrics: any
  ): number {
    let score = 100;
    
    // 负债率影响
    if (metrics.debtRatio > 70) score -= 30;
    else if (metrics.debtRatio > 60) score -= 20;
    else if (metrics.debtRatio > 50) score -= 10;
    
    // 现金流影响
    if (data.operatingCashFlow < 0) score -= 25;
    else if (data.operatingCashFlow < data.netProfit * 0.5) score -= 15;
    
    // 盈利能力影响
    if (data.netProfit < 0) score -= 25;
    else if (metrics.netProfitMargin < 0) score -= 15;
    
    // 流动比率影响
    if (metrics.currentRatio < 1) score -= 20;
    else if (metrics.currentRatio < 1.5) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * 计算最大可贷款金额
   */
  private calculateMaxLoan(
    data: EnterpriseFinancialData,
    debtRatio: number
  ): number {
    if (data.totalAssets <= 0) return 0;
    
    // 银行一般要求负债率不超过70%
    const maxTotalLiabilities = data.totalAssets * 0.70;
    const availableDebtCapacity = maxTotalLiabilities - data.totalLiabilities;
    
    // 考虑企业的现金流能力
    // 假设月供不超过月收入的50%
    const monthlyIncome = data.operatingCashFlow / 12;
    const maxMonthlyPayment = monthlyIncome * 0.5;
    
    // 按30年贷款计算最大贷款额（简化）
    const maxLoanByCashFlow = maxMonthlyPayment * 200; // 粗略估算
    
    // 取两者的较小值
    const maxLoan = Math.min(
      availableDebtCapacity > 0 ? availableDebtCapacity * 0.8 : 0,
      maxLoanByCashFlow
    );
    
    return Math.max(0, Math.round(maxLoan));
  }
  
  /**
   * 计算可承受的最高购入价格
   */
  private calculateMaxAffordablePrice(
    data: EnterpriseFinancialData,
    maxLoan: number
  ): number {
    // 假设首付30%，贷款70%
    const downPaymentRatio = 0.30;
    
    // 企业自有资金（所有者权益的一部分）
    const availableFunds = data.ownersEquity * 0.3; // 假设可用30%
    
    // 按贷款能力计算
    const maxPriceByLoan = maxLoan / (1 - downPaymentRatio);
    
    // 按自有资金计算
    const maxPriceByFunds = availableFunds / downPaymentRatio;
    
    // 取较小值
    const maxPrice = Math.min(maxPriceByLoan, maxPriceByFunds * 2); // 放宽限制
    
    return Math.round(maxPrice);
  }
  
  /**
   * 确定风险等级
   */
  private determineRiskLevel(
    debtRatio: number, 
    creditScore: number,
    metrics: any
  ): 'A' | 'B' | 'C' | 'D' | 'E' {
    if (debtRatio <= 40 && creditScore >= 80) return 'A';
    if (debtRatio <= 50 && creditScore >= 70) return 'B';
    if (debtRatio <= 60 && creditScore >= 60) return 'C';
    if (debtRatio <= 70 && creditScore >= 50) return 'D';
    return 'E';
  }
  
  /**
   * 推荐资产类型
   */
  private recommendPropertyTypes(
    enterpriseInfo: any,
    debtRatio: number,
    maxPrice: number
  ): string[] {
    const types: string[] = [];
    
    // 根据预算推荐
    if (maxPrice >= 10000000) { // 1000万以上
      types.push('office');     // 写字楼
      types.push('commercial'); // 商铺
    }
    
    if (maxPrice >= 5000000) { // 500万以上
      types.push('residential'); // 住宅
    }
    
    if (maxPrice >= 3000000) { // 300万以上
      types.push('apartment');   // 公寓
    }
    
    // 高负债率企业推荐小额资产
    if (debtRatio > 60) {
      return types.filter(t => t === 'residential' || t === 'apartment');
    }
    
    return types.length > 0 ? types : ['residential'];
  }
  
  /**
   * 生成分析报告
   */
  private generateReport(params: any): string {
    const { debtRatio, creditScore, maxLoanAmount, maxAffordablePrice, riskLevel, metrics } = params;
    
    const loanInWan = (maxLoanAmount / 10000).toFixed(0);
    const priceInWan = (maxAffordablePrice / 10000).toFixed(0);
    
    let report = `# 企业财务分析报告\n\n`;
    
    report += `## 📊 财务指标\n`;
    report += `- 资产负债率：${debtRatio.toFixed(1)}%\n`;
    report += `- 流动比率：${metrics.currentRatio.toFixed(2)}\n`;
    report += `- 净资产收益率：${metrics.roe.toFixed(1)}%\n`;
    report += `- 净利润率：${metrics.netProfitMargin.toFixed(1)}%\n`;
    report += `- 现金流状态：${metrics.cashFlowHealth}\n\n`;
    
    report += `## 💳 信用评估\n`;
    report += `- 信用评分：${creditScore}分\n`;
    report += `- 风险等级：${riskLevel}\n\n`;
    
    report += `## 💰 贷款能力\n`;
    report += `- 最大可贷款金额：${loanInWan}万\n`;
    report += `- 可承受最高购入价：${priceInWan}万\n\n`;
    
    report += `## 🎯 建议\n`;
    if (riskLevel === 'A' || riskLevel === 'B') {
      report += `- 企业财务状况良好，建议积极配置优质资产\n`;
    } else if (riskLevel === 'C') {
      report += `- 企业财务状况一般，建议选择风险较低的资产\n`;
    } else {
      report += `- 企业负债率较高，建议先优化负债结构\n`;
    }
    
    return report;
  }
}

export default FinancialAnalysisSkill;
