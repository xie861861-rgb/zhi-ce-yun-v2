/**
 * 数据源类型定义
 */

// 法拍资产基础信息
export interface AuctionProperty {
  id: string;
  title: string;
  type: '住宅' | '商业' | '工业' | '其他';
  province: string;
  city: string;
  district: string;
  address: string;
  
  // 价格信息
  startPrice: number;
  currentPrice: number;
  evalPrice: number;
  discount: number;
  
  // 拍卖信息
  auctionHouse: string; // 阿里/京东/法院
  auctionStatus: '即将开始' | '进行中' | '已成交' | '已流拍' | '撤回';
  startTime: string;
  endTime: string;
  bidCount: number;
  
  // 资产详情
  buildingArea: number;
  landArea?: number;
  yearBuilt?: number;
  floor?: string;
  propertyRightsYears: number;
  
  // 权利状态
  mortgageStatus: '已注销' | '未注销' | '未知';
  seizureStatus: '已解封' | '查封中' | '未知';
  hasDispute: boolean;
  disputeContent?: string;
  
  // 租赁情况
  hasRent: boolean;
  rentAmount?: number;
  arrearsAmount?: number;
  
  // 周边情况
  surroundings?: string;
  commercialSurroundings?: string;
  
  // 图片视频
  images?: string[];
  videos?: string[];
  
  // 元数据
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// 房产估值请求
export interface ValuationRequest {
  province: string;
  city: string;
  district: string;
  address: string;
  buildingArea: number;
  buildingType?: '住宅' | '商业' | '工业';
  floor?: number;
  totalFloor?: number;
  yearBuilt?: number;
  direction?: string;
  decoration?: '精装' | '简装' | '毛坯';
}

// 房产估值结果
export interface ValuationResult {
  property: ValuationRequest;
  evalPrice: number;
  unitPrice: number;
  priceRange: {
    low: number;
    high: number;
  };
  factors: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  confidence: number;
  generatedAt: string;
}

// 司法涉诉信息
export interface LegalInfo {
  personName: string;
  idCard?: string;
  caseType: '诉讼' | '被执行' | '失信' | '限制高消费' | '行政处罚';
  caseNumber?: string;
  court?: string;
  amount?: number;
  status: '未履行' | '已履行' | '审理中';
  publishDate: string;
  source: string;
}

// 客户需求
export interface CustomerDemand {
  customerId: string;
  customerName: string;
  phone: string;
  
  // 偏好
  preferredProvince?: string;
  preferredCity?: string;
  preferredAreas?: string[];
  preferredTypes?: ('住宅' | '商业' | '工业')[];
  budgetMin?: number;
  budgetMax?: number;
  
  // 特殊要求
  minBuildingArea?: number;
  maxBuildingArea?: number;
  requiredFeatures?: string[];
  excludeFeatures?: string[];
  
  // 匹配资产
  matchedProperties?: AuctionProperty[];
  matchScore?: number;
  matchReason?: string;
  
  createdAt: string;
  updatedAt: string;
}

// 金融宏观数据
export interface MacroData {
  // 利率数据
  interestRates?: {
    type: string;
    rate: number;
    change: number;
    effectiveDate: string;
  }[];
  
  // 信贷数据
  creditData?: {
    indicator: string;
    value: number;
    growth: number;
    period: string;
  }[];
  
  // 房地产数据
  realEstateData?: {
    indicator: string;
    value: number;
    growth: number;
    period: string;
  }[];
  
  // 政策信息
  policies?: {
    title: string;
    department: string;
    publishDate: string;
    summary: string;
    sourceUrl?: string;
  }[];
  
  updatedAt: string;
}

// API响应封装
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    source?: string;
  };
}
