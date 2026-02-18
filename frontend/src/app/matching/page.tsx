'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { aiAPI, assetAPI, companyAPI } from '@/lib/api'

// Mock assets data (fallback when API unavailable)
const mockAssets = [
  {
    id: '1',
    title: '深圳市南山区华润城住宅',
    type: '住宅',
    area: '南山',
    address: '深圳市南山区科技园路',
    price: 8500000,
    marketPrice: 10900000,
    discount: 0.78,
    financingSpace: 2100000,
    mortgageRate: 0.65,
    disposalCost: 150000,
    source: '阿里法拍',
    status: '进行中',
    endTime: '2026-02-20',
    image: '🏠',
    buildingArea: 120,
  },
  {
    id: '2',
    title: '福田区CBD写字楼',
    type: '商业',
    area: '福田',
    address: '深圳市福田区中心商务区',
    price: 15000000,
    marketPrice: 20800000,
    discount: 0.72,
    financingSpace: 4200000,
    mortgageRate: 0.60,
    disposalCost: 300000,
    source: '京东法拍',
    status: '进行中',
    endTime: '2026-02-18',
    image: '🏢',
    buildingArea: 200,
  },
  {
    id: '3',
    title: '前海工业厂房',
    type: '工业',
    area: '前海',
    address: '深圳市前海深港合作区',
    price: 5200000,
    marketPrice: 6930000,
    discount: 0.75,
    financingSpace: 1300000,
    mortgageRate: 0.55,
    disposalCost: 100000,
    source: '深圳法院',
    status: '即将开始',
    endTime: '2026-02-25',
    image: '🏭',
    buildingArea: 500,
  },
  {
    id: '4',
    title: '罗湖区东门商业旺铺',
    type: '商业',
    area: '罗湖',
    address: '深圳市罗湖区东门步行街',
    price: 3200000,
    marketPrice: 4570000,
    discount: 0.70,
    financingSpace: 800000,
    mortgageRate: 0.60,
    disposalCost: 80000,
    source: '阿里法拍',
    status: '进行中',
    endTime: '2026-02-22',
    image: '🏪',
    buildingArea: 80,
  },
  {
    id: '5',
    title: '宝安区西乡住宅',
    type: '住宅',
    area: '宝安',
    address: '深圳市宝安区西乡大道',
    price: 4500000,
    marketPrice: 6000000,
    discount: 0.75,
    financingSpace: 1100000,
    mortgageRate: 0.70,
    disposalCost: 100000,
    source: '京东法拍',
    status: '进行中',
    endTime: '2026-02-19',
    image: '🏘️',
    buildingArea: 95,
  },
  {
    id: '6',
    title: '龙岗区坂田科技园厂房',
    type: '工业',
    area: '龙岗',
    address: '深圳市龙岗区坂田华为基地附近',
    price: 6800000,
    marketPrice: 9070000,
    discount: 0.75,
    financingSpace: 1700000,
    mortgageRate: 0.55,
    disposalCost: 150000,
    source: '深圳法院',
    status: '即将开始',
    endTime: '2026-02-28',
    image: '🏗️',
    buildingArea: 600,
  },
]

// Types
interface EnterpriseAnalysis {
  id: string
  creditScore: number
  maxLoanAmount: number
  riskRating: string
  analysis: {
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
  }
}

interface PropertyMatch {
  property: typeof mockAssets[0]
  matchScore: number
  aiRecommendation: string
  loanAmount: number
  cashOutAmount: number
  riskLevel: 'low' | 'medium' | 'high'
  reasons: string[]
}

// Filters
const areas = ['全部', '南山', '福田', '前海', '罗湖', '宝安', '龙岗']
const types = ['全部', '住宅', '商业', '工业']
const sources = ['全部', '阿里法拍', '京东法拍', '深圳法院']

export default function MatchingPage() {
  const [filters, setFilters] = useState({
    area: '全部',
    type: '全部',
    source: '全部',
    minPrice: '',
    maxPrice: '',
    minDiscount: '',
    maxDiscount: '',
  })
  const [sortBy, setSortBy] = useState('financingSpace')
  const [selectedAsset, setSelectedAsset] = useState<typeof mockAssets[0] | null>(null)
  
  // AI Integration States
  const [isAILoading, setIsAILoading] = useState(false)
  const [enterpriseAnalysis, setEnterpriseAnalysis] = useState<EnterpriseAnalysis | null>(null)
  const [propertyMatches, setPropertyMatches] = useState<PropertyMatch[]>([])
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [company, setCompany] = useState<any>(null)

  // Load user and company data
  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        
        try {
          const companyRes = await companyAPI.get(userData.id)
          if (companyRes.data.success && companyRes.data.data) {
            setCompany(companyRes.data.data)
          }
        } catch (error) {
          console.error('Failed to load company:', error)
        }
      }
    }
    loadUserData()
  }, [])

  // Filter assets
  const filteredAssets = mockAssets.filter(asset => {
    if (filters.area !== '全部' && asset.area !== filters.area) return false
    if (filters.type !== '全部' && asset.type !== filters.type) return false
    if (filters.source !== '全部' && asset.source !== filters.source) return false
    if (filters.minPrice && asset.price < parseInt(filters.minPrice) * 10000) return false
    if (filters.maxPrice && asset.price > parseInt(filters.maxPrice) * 10000) return false
    if (filters.minDiscount && asset.discount < parseFloat(filters.minDiscount) / 10) return false
    if (filters.maxDiscount && asset.discount > parseFloat(filters.maxDiscount) / 10) return false
    return true
  }).sort((a, b) => {
    if (sortBy === 'price') return b.price - a.price
    if (sortBy === 'discount') return a.discount - b.discount
    if (sortBy === 'financingSpace') return b.financingSpace - a.financingSpace
    return 0
  })

  // AI Smart Match Function
  const handleAIMatch = async () => {
    if (!company?.id) {
      alert('请先完成企业认证！')
      return
    }

    setIsAILoading(true)
    setShowAIPanel(true)

    try {
      // Prepare enterprise data
      const enterpriseData = {
        enterpriseId: company.id,
        enterpriseData: {
          financialData: company.financialData || {
            annualRevenue: company.annualRevenue || 0,
            netProfit: company.netProfit || 0,
            totalAssets: company.totalAssets || 0,
            totalLiabilities: company.totalLiabilities || 0,
          },
          industryCategory: company.industryCategory,
          techClassification: company.techClassification,
        },
        properties: filteredAssets.map(asset => ({
          id: asset.id,
          propertyType: asset.type,
          buildingArea: asset.buildingArea,
          price: asset.price,
          marketPrice: asset.marketPrice,
          address: asset.address,
          region: asset.area,
        })),
        options: {
          minFinancingSpace: 500000,
        },
      }

      // Call AI Smart Match API
      const response = await aiAPI.smartMatch(enterpriseData)

      if (response.data.success) {
        setEnterpriseAnalysis(response.data.data.enterpriseAnalysis)
        
        // Transform matches
        const matches: PropertyMatch[] = response.data.data.matches.map((match: any, index: number) => ({
          property: mockAssets.find(a => a.id === match.propertyId) || mockAssets[index],
          matchScore: match.matchScore,
          aiRecommendation: match.recommendation,
          loanAmount: match.estimatedLoanAmount,
          cashOutAmount: match.cashOutAmount,
          riskLevel: match.riskLevel,
          reasons: match.reasons || [],
        }))
        
        setPropertyMatches(matches)
      }
    } catch (error) {
      console.error('AI Match failed:', error)
      // Fallback: generate local matches
      const localMatches: PropertyMatch[] = filteredAssets.slice(0, 3).map((asset, index) => ({
        property: asset,
        matchScore: 95 - index * 10,
        aiRecommendation: index === 0 ? '⭐ 强烈推荐 - 最高融资空间' : '推荐',
        loanAmount: Math.floor(asset.marketPrice * asset.mortgageRate),
        cashOutAmount: asset.financingSpace,
        riskLevel: index === 0 ? 'low' : index === 1 ? 'low' : 'medium',
        reasons: ['折价率高', '融资空间大', '风险可控'],
      }))
      setPropertyMatches(localMatches)
      
      // Mock enterprise analysis
      setEnterpriseAnalysis({
        id: company.id,
        creditScore: 85,
        maxLoanAmount: 5000000,
        riskRating: 'A级',
        analysis: {
          strengths: ['经营稳定', '资产负债率合理', '行业前景良好'],
          weaknesses: ['需要完善财务数据'],
          recommendations: ['建议选择住宅类资产', '贷款期限建议3-5年'],
        },
      })
    } finally {
      setIsAILoading(false)
    }
  }

  // Handle asset selection with AI calculation
  const handleAssetSelect = async (asset: typeof mockAssets[0]) => {
    setSelectedAsset(asset)
    
    if (company?.id) {
      try {
        const response = await aiAPI.calculateLoan({
          enterpriseId: company.id,
          enterpriseData: {
            financialData: company.financialData || {
              annualRevenue: company.annualRevenue || 0,
              netProfit: company.netProfit || 0,
              totalAssets: company.totalAssets || 0,
              totalLiabilities: company.totalLiabilities || 0,
            },
          },
          property: {
            id: asset.id,
            propertyType: asset.type,
            buildingArea: asset.buildingArea,
            price: asset.price,
            marketPrice: asset.marketPrice,
            address: asset.address,
            region: asset.area,
          },
        })
        
        if (response.data.success) {
          // Update selected asset with AI calculated values
          const aiResult = response.data.data
          console.log('AI Loan Calculation:', aiResult)
        }
      } catch (error) {
        console.error('AI calculation failed:', error)
      }
    }
  }

  const formatPrice = (price: number) => {
    return `¥${(price / 10000).toFixed(0)}万`
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <span className="badge badge-success">低风险</span>
      case 'medium':
        return <span className="badge badge-warning">中等风险</span>
      case 'high':
        return <span className="badge badge-danger">高风险</span>
      default:
        return null
    }
  }

  // Get TOP assets from AI matches or fallback to default
  const getTopAssets = () => {
    if (propertyMatches.length > 0) {
      return propertyMatches.slice(0, 3).map(m => m.property)
    }
    return mockAssets.slice(0, 3)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">智策云V2</Link>
              <span className="ml-4 text-gray-600 flex items-center">
                资产匹配
                {enterpriseAnalysis && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    🤖 AI已就绪
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center">
              <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 mr-4">
                返回工作台
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* AI Match Panel */}
        {showAIPanel && enterpriseAnalysis && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <span className="mr-2">🤖</span>
                AI企业分析报告
              </h2>
              <button 
                onClick={() => setShowAIPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">信用评分</p>
                <p className="text-3xl font-bold text-primary-600">{enterpriseAnalysis.creditScore}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">最高可贷</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(enterpriseAnalysis.maxLoanAmount)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">风险等级</p>
                <p className="text-xl font-bold text-blue-600">{enterpriseAnalysis.riskRating}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">匹配资产</p>
                <p className="text-2xl font-bold text-purple-600">{propertyMatches.length}套</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700 mb-2">💪 优势</p>
                <ul className="space-y-1">
                  {enterpriseAnalysis.analysis.strengths.map((s, i) => (
                    <li key={i} className="text-green-600">✓ {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">⚠️ 需改进</p>
                <ul className="space-y-1">
                  {enterpriseAnalysis.analysis.weaknesses.map((w, i) => (
                    <li key={i} className="text-orange-600">• {w}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">💡 建议</p>
                <ul className="space-y-1">
                  {enterpriseAnalysis.analysis.recommendations.map((r, i) => (
                    <li key={i} className="text-blue-600">→ {r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Header with AI Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">法拍资产匹配</h1>
            <p className="text-gray-600">智能筛选高融资空间法拍资产，推荐最优投资标的</p>
          </div>
          <button
            onClick={handleAIMatch}
            disabled={isAILoading}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isAILoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            {isAILoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI智能分析中...
              </span>
            ) : (
              <span className="flex items-center">
                <span className="mr-2">⚡</span>
                AI智能匹配
              </span>
            )}
          </button>
        </div>

        {/* TOP 3 Recommendations - AI Powered */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-accent-gold text-white rounded-lg flex items-center justify-center mr-2 text-sm">TOP</span>
            {propertyMatches.length > 0 ? 'AI推荐 · 最优匹配标的' : '编辑部精选 · 高融资空间标的'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getTopAssets().map((asset, index) => {
              const match = propertyMatches.find(m => m.property.id === asset.id)
              return (
                <div 
                  key={asset.id} 
                  className="card bg-gradient-to-br from-primary-50 to-white border-2 border-primary-100 hover:border-primary-300 cursor-pointer transition-all relative"
                  onClick={() => handleAssetSelect(asset)}
                >
                  {match && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow">
                      AI推荐 #{index + 1}
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <span className="badge badge-info">{asset.type}</span>
                    <span className="text-2xl">{asset.image}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{asset.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{asset.area} · {asset.source}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">起拍价</p>
                      <p className="font-bold text-gray-900">{formatPrice(asset.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">折价率</p>
                      <p className="font-bold text-green-600">{asset.discount * 10}折</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-primary-200 pt-3">
                    <p className="text-xs text-gray-500">净融资空间</p>
                    <p className="text-2xl font-bold text-primary-600">{formatPrice(asset.financingSpace)}</p>
                  </div>
                  
                  {match && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">匹配度</span>
                        <span className="font-bold text-blue-600">{match.matchScore}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">预估套现</span>
                        <span className="font-bold text-green-600">{formatPrice(match.cashOutAmount)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <h3 className="font-bold text-gray-900 mb-4">筛选条件</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">地区</label>
              <select 
                value={filters.area}
                onChange={(e) => setFilters({...filters, area: e.target.value})}
                className="input-field"
              >
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">类型</label>
              <select 
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="input-field"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">来源</label>
              <select 
                value={filters.source}
                onChange={(e) => setFilters({...filters, source: e.target.value})}
                className="input-field"
              >
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">最低价</label>
              <input 
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                placeholder="万元"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">最高价</label>
              <input 
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                placeholder="万元"
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">排序方式：</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-40"
              >
                <option value="financingSpace">净融资空间</option>
                <option value="price">起拍价格</option>
                <option value="discount">折价率</option>
              </select>
            </div>
            <span className="text-sm text-gray-500">
              共找到 <span className="font-bold text-primary-600">{filteredAssets.length}</span> 个符合条件的资产
            </span>
          </div>
        </div>

        {/* Assets List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredAssets.map(asset => {
              const match = propertyMatches.find(m => m.property.id === asset.id)
              return (
                <div 
                  key={asset.id} 
                  className={`card cursor-pointer transition-all ${
                    selectedAsset?.id === asset.id 
                      ? 'border-2 border-primary-500 shadow-lg' 
                      : 'hover:shadow-md'
                  } ${match ? 'border-l-4 border-l-blue-500' : ''}`}
                  onClick={() => handleAssetSelect(asset)}
                >
                  <div className="flex">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl mr-4">
                      {asset.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">{asset.title}</h3>
                            {match && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                AI匹配度 {match.matchScore}%
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{asset.address}</p>
                        </div>
                        <span className={`badge ${
                          asset.source === '阿里法拍' ? 'badge-warning' : 
                          asset.source === '京东法拍' ? 'badge-danger' : 'badge-info'
                        }`}>
                          {asset.source}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">起拍价</p>
                          <p className="font-bold text-gray-900">{formatPrice(asset.price)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">市场价</p>
                          <p className="font-bold text-gray-500">{formatPrice(asset.marketPrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">折价率</p>
                          <p className="font-bold text-green-600">{asset.discount * 10}折</p>
                        </div>
                        <div>
                          <p className="text-gray-500">净融资空间</p>
                          <p className="font-bold text-primary-600">{formatPrice(asset.financingSpace)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Asset Detail */}
          <div className="lg:col-span-1">
            {selectedAsset ? (
              <div className="card sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{selectedAsset.image}</div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedAsset.title}</h2>
                  <p className="text-gray-500">{selectedAsset.address}</p>
                </div>

                {/* AI Analysis for selected asset */}
                {(() => {
                  const match = propertyMatches.find(m => m.property.id === selectedAsset.id)
                  return match ? (
                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                      <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                        <span className="mr-2">🤖</span>
                        AI分析
                      </h3>
                      <div className="space-y-2 text-sm mb-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">匹配度</span>
                          <span className="font-bold text-blue-600">{match.matchScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">风险等级</span>
                          {getRiskBadge(match.riskLevel)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">可贷款额</span>
                          <span className="font-bold text-green-600">{formatPrice(match.loanAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">预估套现</span>
                          <span className="font-bold text-primary-600">{formatPrice(match.cashOutAmount)}</span>
                        </div>
                      </div>
                      <div className="border-t border-blue-200 pt-3">
                        <p className="text-sm font-medium text-blue-800 mb-2">推荐理由：</p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          {match.reasons.map((reason, i) => (
                            <li key={i}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null
                })()}

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">资产类型</span>
                    <span className="font-medium">{selectedAsset.type}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">所在地区</span>
                    <span className="font-medium">{selectedAsset.area}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">起拍价格</span>
                    <span className="font-bold text-primary-600">{formatPrice(selectedAsset.price)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">市场价格</span>
                    <span className="font-medium">{formatPrice(selectedAsset.marketPrice)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">折价率</span>
                    <span className="font-bold text-green-600">{selectedAsset.discount * 10}折</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">银行抵押率</span>
                    <span className="font-medium">{selectedAsset.mortgageRate * 100}%</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">预估处置成本</span>
                    <span className="font-medium">{formatPrice(selectedAsset.disposalCost)}</span>
                  </div>
                </div>

                {/* Financing Space Calculation */}
                <div className="bg-primary-50 rounded-xl p-4 mb-6">
                  <h3 className="font-bold text-primary-900 mb-3">净融资空间计算</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">银行评估价 × 抵押率</span>
                      <span className="font-medium">
                        {formatPrice(selectedAsset.marketPrice)} × {selectedAsset.mortgageRate * 100}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">可贷金额</span>
                      <span className="font-bold">
                        {formatPrice(Math.floor(selectedAsset.marketPrice * selectedAsset.mortgageRate))}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-primary-200 pt-2">
                      <span className="text-gray-600">减：起拍价</span>
                      <span className="font-medium">-{formatPrice(selectedAsset.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">减：处置成本</span>
                      <span className="font-medium">-{formatPrice(selectedAsset.disposalCost)}</span>
                    </div>
                    <div className="flex justify-between border-t border-primary-200 pt-2">
                      <span className="font-bold text-primary-900">净融资空间</span>
                      <span className="font-bold text-2xl text-primary-600">
                        {formatPrice(selectedAsset.financingSpace)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/report" 
                  className="btn-primary w-full text-center block"
                >
                  生成融资分析报告
                </Link>
              </div>
            ) : (
              <div className="card text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <p className="text-gray-500">点击左侧资产查看详情</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
