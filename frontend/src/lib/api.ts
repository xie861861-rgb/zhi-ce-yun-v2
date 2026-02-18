import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: {
    name: string
    email: string
    password: string
    phone?: string
    company?: string
  }) => api.post('/auth/register', data),
  
  logout: () => api.post('/auth/logout'),
  
  getMe: () => api.get('/auth/me'),
}

// Company APIs
export const companyAPI = {
  get: (userId?: string) => api.get('/company', { params: { userId } }),
  
  create: (data: any) => api.post('/company', data),
  
  update: (id: string, data: any) => api.put(`/company/${id}`, data),
}

// Audit APIs
export const auditAPI = {
  getStatus: (userId?: string) => api.get('/audit/status', { params: { userId } }),
  
  submit: (data: {
    userId?: string
    companyId?: string
    taxProof?: File
    financialReport?: File
  }) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value)
      } else if (value !== undefined) {
        formData.append(key, String(value))
      }
    })
    return api.post('/audit/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  
  ocr: (image: File) => {
    const formData = new FormData()
    formData.append('image', image)
    return api.post('/audit/ocr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  
  validate: (taxNumber: string) =>
    api.post('/audit/validate', { taxNumber }),
}

// Asset APIs
export const assetAPI = {
  list: (params?: {
    area?: string
    type?: string
    source?: string
    minPrice?: number
    maxPrice?: number
    minDiscount?: number
    maxDiscount?: number
    sortBy?: string
    page?: number
    pageSize?: number
  }) => api.get('/asset', { params }),
  
  getRecommended: () => api.get('/asset/recommended'),
  
  get: (id: string) => api.get(`/asset/${id}`),
  
  calculate: (params: {
    price: number
    marketPrice: number
    mortgageRate: number
    disposalCost: number
  }) => api.post('/asset/calculate', params),
}

// Report APIs
export const reportAPI = {
  list: (params?: {
    userId?: string
    type?: string
    status?: string
    page?: number
    pageSize?: number
  }) => api.get('/report', { params }),
  
  get: (id: string) => api.get(`/report/${id}`),
  
  generateCredit: (data: { userId?: string; auditId?: string }) =>
    api.post('/report/generate/credit', data),
  
  generateAsset: (data: { userId?: string; assetId?: string }) =>
    api.post('/report/generate/asset', data),
  
  generateDecision: (data: { userId?: string; assetId?: string; auditId?: string }) =>
    api.post('/report/generate/decision', data),
}

// Work Order APIs
export const workOrderAPI = {
  list: (params?: { status?: string; page?: number; pageSize?: number }) =>
    api.get('/work-order', { params }),
  
  get: (id: string) => api.get(`/work-order/${id}`),
  
  create: (data: { type: string; title: string; description?: string }) =>
    api.post('/work-order', data),
  
  update: (id: string, data: any) => api.put(`/work-order/${id}`, data),
}

// AI APIs - 智策云V2 智能匹配核心
export const aiAPI = {
  // 企业分析 - 分析企业财务状况，确定可贷款额度
  analyzeEnterprise: (data: {
    enterpriseId: string
    financialData?: {
      annualRevenue: number
      netProfit: number
      totalAssets: number
      totalLiabilities: number
    }
    industryCategory?: string
    techClassification?: string
  }) => api.post('/ai/analyze-enterprise', data),
  
  // 资产评估 - 评估资产市场价值、折扣率、投资评分
  valuateProperty: (data: {
    id: string
    propertyType: string
    buildingArea: number
    address?: string
    region?: string
  }) => api.post('/ai/valuate-property', data),
  
  // 智能匹配 - 核心功能！为企业匹配最优资产
  smartMatch: (data: {
    enterpriseId: string
    enterpriseData?: {
      financialData?: {
        annualRevenue: number
        netProfit: number
        totalAssets: number
        totalLiabilities: number
      }
      industryCategory?: string
      techClassification?: string
    }
    properties: Array<{
      id: string
      propertyType: string
      buildingArea: number
      price: number
      marketPrice: number
      address?: string
      region?: string
    }>
    options?: {
      minFinancingSpace?: number
      maxPrice?: number
      propertyTypes?: string[]
    }
  }) => api.post('/ai/smart-match', data),
  
  // 低买高贷计算 - 计算单个资产的套现方案
  calculateLoan: (data: {
    enterpriseId: string
    enterpriseData?: {
      financialData?: {
        annualRevenue: number
        netProfit: number
        totalAssets: number
        totalLiabilities: number
      }
      industryCategory?: string
      techClassification?: string
    }
    property: {
      id: string
      propertyType: string
      buildingArea: number
      price: number
      marketPrice: number
      address?: string
      region?: string
    }
  }) => api.post('/ai/calculate-loan', data),
  
  // 获取银行产品列表
  getBankProducts: (params?: { propertyType?: string; loanAmount?: number }) =>
    api.get('/ai/bank-products', { params }),
  
  // 获取匹配结果
  getMatchResult: (matchId: string) => api.get(`/ai/match-result/${matchId}`),
}

export default api
