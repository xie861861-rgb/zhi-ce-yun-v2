// Shared types for both frontend and backend

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  company?: string
  companyId?: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

export interface Company {
  id: string
  name: string
  taxNumber: string
  legalPerson: string
  registeredCapital: number
  establishedDate: string
  address: string
  status: 'pending' | 'verified' | 'rejected'
  userId: string
  createdAt: string
  updatedAt: string
}

export interface AuditResult {
  id: string
  userId: string
  status: 'processing' | 'completed' | 'failed'
  score: number
  creditLevel: 'A' | 'B' | 'C' | 'D'
  loanLimit: number
  riskLevel: 'low' | 'medium' | 'high'
  taxCompliance: number
  financialHealth: number
  businessStability: number
  industryProspects: number
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Asset {
  id: string
  title: string
  type: 'residential' | 'commercial' | 'industrial'
  area: string
  address: string
  price: number
  marketPrice: number
  discount: number
  financingSpace: number
  mortgageRate: number
  disposalCost: number
  source: 'ali' | 'jd' | 'court'
  status: 'upcoming' | 'ongoing' | 'ended'
  endTime: string
  image?: string
  createdAt: string
  updatedAt: string
}

export interface Report {
  id: string
  userId: string
  type: 'credit' | 'asset' | 'decision'
  title: string
  status: 'processing' | 'completed' | 'failed'
  assetId?: string
  auditId?: string
  data?: any
  createdAt: string
  updatedAt: string
}

export interface FinancingAnalysis {
  totalInvestment: number
  downPayment: number
  bankLoan: number
  monthlyPayment: number
  loanTerm: number
  interestRate: number
  loanToValue: number
  leverage: number
  dtiRatio: number
  cashOnCash: number
}

export interface RiskItem {
  level: 'low' | 'medium' | 'high'
  title: string
  description: string
  suggestion: string
}

export interface ProcessPhase {
  phase: string
  duration: string
  description: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone?: string
  company?: string
}

// Filter types
export interface AssetFilters {
  area?: string
  type?: string
  source?: string
  minPrice?: number
  maxPrice?: number
  minDiscount?: number
  maxDiscount?: number
}
