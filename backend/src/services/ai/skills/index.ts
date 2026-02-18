/**
 * 技能模块导出
 * 智策云V2 - AI智能服务
 */

export { LowBuyHighLoanSkill } from './lowBuyHighLoan';
export { FinancialAnalysisSkill } from './financialAnalysis';
export { PropertyValuationSkill } from './propertyValuation';
export { BankPolicySkill } from './bankPolicy';

// 创建技能实例的工厂函数
import { LowBuyHighLoanSkill } from './lowBuyHighLoan';
import { FinancialAnalysisSkill } from './financialAnalysis';
import { PropertyValuationSkill } from './propertyValuation';
import { BankPolicySkill } from './bankPolicy';

export const createSkills = () => ({
  lowBuyHighLoan: new LowBuyHighLoanSkill(),
  financialAnalysis: new FinancialAnalysisSkill(),
  propertyValuation: new PropertyValuationSkill(),
  bankPolicy: new BankPolicySkill()
});

// 默认导出
export default {
  LowBuyHighLoanSkill,
  FinancialAnalysisSkill,
  PropertyValuationSkill,
  BankPolicySkill
};
