'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Mock user data
const mockUser = {
  name: '测试用户',
  company: '测试企业科技有限公司',
  email: 'demo@zhicelyun.com',
}

// Mock audit status
const mockAuditStatus = {
  status: 'completed',
  score: 85,
  creditLevel: 'A级',
  loanLimit: 5000000,
  completedAt: '2026-02-12 10:30',
}

// Mock recent reports
const mockReports = [
  { id: 1, title: '企业信用画像报告', status: 'completed', createdAt: '2026-02-12 10:30' },
  { id: 2, title: '资产匹配分析报告', status: 'completed', createdAt: '2026-02-12 11:00' },
  { id: 3, title: '融资决策分析简报', status: 'processing', createdAt: '2026-02-12 14:00' },
]

// Mock recommended assets
const mockAssets = [
  {
    id: 1,
    title: '深圳市南山区华润城住宅',
    type: '住宅',
    area: '南山',
    price: 8500000,
    discount: 0.78,
    financingSpace: 2100000,
    source: '阿里法拍',
  },
  {
    id: 2,
    title: '福田区CBD写字楼',
    type: '商业',
    area: '福田',
    price: 15000000,
    discount: 0.72,
    financingSpace: 4200000,
    source: '京东法拍',
  },
  {
    id: 3,
    title: '前海工业厂房',
    type: '工业',
    area: '前海',
    price: 5200000,
    discount: 0.75,
    financingSpace: 1300000,
    source: '深圳法院',
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<typeof mockUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(storedUser))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">智策云V2</Link>
              <span className="ml-2 text-sm text-gray-500">工作台</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="text-gray-600 hover:text-primary-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-primary-600">
                退出
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            欢迎回来，{user?.name}
          </h1>
          <p className="text-gray-600 mt-1">{user?.company}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/audit" className="card hover:border-primary-200 group">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary-600 transition-colors">
                <svg className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">资质预审</h3>
                <p className="text-sm text-gray-500">AI智能资质评估</p>
              </div>
            </div>
          </Link>

          <Link href="/matching" className="card hover:border-primary-200 group">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent-gold/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-accent-gold transition-colors">
                <svg className="w-6 h-6 text-accent-gold group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">资产匹配</h3>
                <p className="text-sm text-gray-500">法拍资产智能推荐</p>
              </div>
            </div>
          </Link>

          <Link href="/report" className="card hover:border-primary-200 group">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                <svg className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">报告查看</h3>
                <p className="text-sm text-gray-500">融资分析报告</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Audit Status */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-6">资质预审状态</h3>
            
            {mockAuditStatus.status === 'completed' ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">审核状态</p>
                      <p className="text-xl font-bold text-green-600">已通过</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">信用评分</p>
                    <p className="text-3xl font-bold text-primary-600">{mockAuditStatus.score}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">信用等级</p>
                    <p className="text-xl font-bold text-gray-900">{mockAuditStatus.creditLevel}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">可贷额度</p>
                    <p className="text-xl font-bold text-primary-600">¥{(mockAuditStatus.loanLimit / 10000).toFixed(0)}万</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">资质预审进行中...</p>
                <Link href="/audit" className="btn-primary inline-block">
                  查看详情
                </Link>
              </div>
            )}
          </div>

          {/* Recent Reports */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">最近报告</h3>
              <Link href="/report" className="text-primary-600 hover:text-primary-700 text-sm">
                查看全部
              </Link>
            </div>
            
            <div className="space-y-4">
              {mockReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      report.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <svg className={`w-5 h-5 ${
                        report.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{report.title}</p>
                      <p className="text-sm text-gray-500">{report.createdAt}</p>
                    </div>
                  </div>
                  <span className={`badge ${
                    report.status === 'completed' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {report.status === 'completed' ? '已完成' : '处理中'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Assets */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">推荐资产</h3>
            <Link href="/matching" className="text-primary-600 hover:text-primary-700 text-sm">
              查看更多
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockAssets.map((asset) => (
              <div key={asset.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <span className="badge badge-info">{asset.type}</span>
                  <span className={`badge ${asset.source === '阿里法拍' ? 'badge-warning' : asset.source === '京东法拍' ? 'badge-danger' : 'badge-info'}`}>
                    {asset.source}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{asset.title}</h4>
                <p className="text-sm text-gray-500 mb-4">{asset.area}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">起拍价</p>
                    <p className="font-bold text-gray-900">¥{(asset.price / 10000).toFixed(0)}万</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">折价率</p>
                    <p className="font-bold text-green-600">{asset.discount * 10}折</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-500">净融资空间</p>
                  <p className="text-xl font-bold text-primary-600">¥{(asset.financingSpace / 10000).toFixed(0)}万</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
