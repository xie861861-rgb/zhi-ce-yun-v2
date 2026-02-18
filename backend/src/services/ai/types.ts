/**
 * AI 服务类型定义
 * 智策云V2 - 低买高贷智能匹配系统
 */

// ============= 企业分析类型 =============

export interface EnterpriseAnalysis {
  enterpriseId: string;
  financialScore: number;        // 财务评分 0-100
  creditScore: number;          // 信用评分 0-100
  riskLevel: 'A' | 'B' | 'C' | 'D' | 'E';  // 风险等级
  maxLoanAmount: number;         // 最大可贷款金额
  maxAffordablePrice: number;   // 可承受的最高购入价格
  debtRatio: number;            // 负债率
  recommendedPropertyTypes: string[];  // 推荐的资产类型
  analysisReport: string;        // 分析报告
}

export interface EnterpriseFinancialData {
  totalAssets: number;          // 总资产
  totalLiabilities: number;    // 总负债
  ownersEquity: number;         // 所有者权益
  currentAssets: number;       // 流动资产
  currentLiabilities: number;  // 流动负债
  totalRevenue: number;        // 总收入
  netProfit: number;           // 净利润
  operatingCashFlow: number;    // 经营现金流
}

// ============= 资产评估类型 =============

export interface PropertyValuation {
  propertyId: string;
  estimatedMarketPrice: number; // 预估市场价
  estimatedUnitPrice: number;  // 预估单价
  discountRate: number;        // 折扣率
  priceGap: number;           // 与市场价差
  rentalYield: number;        // 租金回报率
  investmentScore: number;     // 投资评分 0-100
  valuationReport: string;     // 评估报告
  confidence: 'high' | 'medium' | 'low';  // 置信度
}

export interface ComparableTransaction {
  communityName: string;
  transactionPrice: number;
  unitPrice: number;
  transactionDate: string;
  buildingArea: number;
  floor: number;
  decoration: string;
}

// ============= 银行产品类型 =============

export interface BankProduct {
  id: string;
  bankName: string;           // 银行名称
  productName: string;        // 产品名称
  maxLoanRatio: number;       // 最高贷款成数
  minLoanAmount: number;      // 最低贷款金额
  maxLoanAmount: number;      // 最高贷款金额
  interestRate: number;       // 利率
  loanTermMonths: number;     // 贷款期限（月）
  processingDays: number;      // 审批天数
  propertyTypes: string[];     // 适用物业类型
  requirements: string;       // 申请要求
}

// ============= 低买高贷核心类型 =============

export interface LowBuyHighLoanResult {
  propertyId: string;
  enterpriseId: string;
  
  // 资产信息
  propertyPrice: number;       // 购入价
  marketValue: number;        // 市场评估价
  discountRate: number;       // 折扣率
  
  // 成本计算
  purchaseCost: number;       // 购入总成本（含税费）
  taxAndFees: number;         // 税费
  agentFee: number;           // 中介费
  
  // 贷款方案
  bankValuation: number;      // 银行评估价
  loanAmount: number;         // 贷款金额
  loanRatio: number;          // 贷款成数
  interestRate: number;       // 利率
  monthlyPayment: number;     // 月供
  totalInterest: number;      // 总利息
  
  // 套现分析
  netCashOut: number;         // 净套现金额
  cashOutRatio: number;       // 套现比例
  
  // 租金收益（如果有租约）
  monthlyRent: number;        // 月租金
  annualRentIncome: number;   // 年租金收入
  monthlyNetIncome: number;   // 月净收入（月租 - 月供）
  
  // 推荐银行
  recommendedBank: BankProduct;
  
  // 综合评估
  isViable: boolean;          // 是否可行
  viabilityScore: number;     // 可行性评分
  recommendation: string;     // 推荐理由
  riskWarnings: string[];     // 风险提示
}

// ============= 匹配结果类型 =============

export interface MatchingResult {
  id: string;
  enterpriseId: string;
  propertyId: string;
  
  // 匹配度
  matchScore: number;         // 匹配评分 0-100
  matchReasons: string[];      // 匹配原因
  
  // 方案详情
  lowBuyHighLoan: LowBuyHighLoanResult | any;
  
  // 状态
  status: 'recommended' | 'viewed' | 'interested' | 'negotiating' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

// ============= AI 分析请求/响应 =============

export interface AnalyzeEnterpriseRequest {
  enterpriseId: string;
  financialData?: EnterpriseFinancialData;
}

export interface AnalyzeEnterpriseResponse {
  success: boolean;
  analysis?: EnterpriseAnalysis;
  error?: string;
}

export interface ValuatePropertyRequest {
  propertyId: string;
  propertyData?: any;
}

export interface ValuatePropertyResponse {
  success: boolean;
  valuation?: PropertyValuation;
  error?: string;
}

export interface SmartMatchRequest {
  enterpriseId: string;
  options?: {
    propertyTypes?: string[];
    districts?: string[];
    maxPrice?: number;
    minDiscount?: number;
    topN?: number;
  };
}

export interface SmartMatchResponse {
  success: boolean;
  results?: MatchingResult[];
  error?: string;
}

export interface CalculateLowBuyHighLoanRequest {
  enterpriseId: string;
  propertyId: string;
}

export interface CalculateLowBuyHighLoanResponse {
  success: boolean;
  result?: LowBuyHighLoanResult;
  error?: string;
}

// ============= 记忆系统类型 =============

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface EnterpriseContext {
  enterpriseId: string;
  // 已了解的信息
  knownInfo: {
    companyName?: string;
    industry?: string;
    budget?: number;
    loanAmount?: number;
    propertyTypePrefs?: string[];
    districtPrefs?: string[];
    contactPerson?: string;
    contactPhone?: string;
    urgency?: string;
  };
  // 服务阶段
  serviceStage: 'initial' | 'analyzing' | 'matching' | 'negotiating' | 'completed';
  // 待解决问题
  pendingQuestions: string[];
  // 历史对话摘要
  conversationSummary: string;
}

export interface ChatWithMemoryRequest {
  enterpriseId: string;
  userId?: string;
  message: string;
  sessionId?: string;
}

export interface ChatWithMemoryResponse {
  success: boolean;
  reply: string;
  context?: EnterpriseContext;
  questionsToAsk?: string[];
  serviceStageUpdated?: string;
  error?: string;
}
