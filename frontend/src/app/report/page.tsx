'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock report data
const mockReports = [
  {
    id: 1,
    title: '企业信用画像报告',
    type: 'credit',
    status: 'completed',
    createdAt: '2026-02-12 10:30',
    companyName: '深圳市智策云科技有限公司',
    score: 85,
    level: 'A级',
    loanLimit: 5000000,
    riskLevel: '低风险',
    keyMetrics: {
      taxCompliance: 95,
      financialHealth: 80,
      businessStability: 85,
      industryProspects: 90,
    },
  },
  {
    id: 2,
    title: '资产匹配分析报告 - 华润城住宅',
    type: 'asset',
    status: 'completed',
    createdAt: '2026-02-12 11:00',
    asset: {
      title: '深圳市南山区华润城住宅',
      price: 8500000,
      marketPrice: 10900000,
      financingSpace: 2100000,
    },
    analysis: {
      downPayment: 2550000,
      loanAmount: 5950000,
      monthlyPayment: 38500,
      loanToValue: 0.65,
      leverage: 2.35,
    },
  },
  {
    id: 3,
    title: '融资决策分析简报',
    type: 'decision',
    status: 'processing',
    createdAt: '2026-02-12 14:00',
    estimatedTime: '30分钟',
  },
]

// Mock decision report
const mockDecisionReport = {
  asset: {
    title: '深圳市南山区华润城住宅',
    price: 8500000,
    marketPrice: 10900000,
    discount: 0.78,
  },
  financing: {
    totalInvestment: 8500000,
    downPayment: 2550000,
    bankLoan: 5950000,
    monthlyPayment: 38500,
    loanTerm: 20,
    interestRate: 0.049,
  },
  analysis: {
    loanToValue: 0.55,
    leverage: 2.35,
    dtiRatio: 0.35,
    cashOnCash: 0.12,
  },
  risks: [
    {
      level: 'medium',
      title: '市场波动风险',
      description: '房产市场存在一定波动性，可能影响资产变现能力',
      suggestion: '建议关注深圳房产市场走势，适时调整投资策略',
    },
    {
      level: 'low',
      title: '法拍过户风险',
      description: '法拍房产可能存在产权不清或租赁纠纷',
      suggestion: '建议在竞拍前进行详细的产权调查和现场查看',
    },
    {
      level: 'low',
      title: '资金流动性风险',
      description: '大额资金投入可能影响企业流动性',
      suggestion: '建议预留足够的流动资金，确保企业正常运营',
    },
  ],
  timeline: [
    { phase: '竞拍成功', duration: '1-3天', description: '支付尾款和保证金' },
    { phase: '法院裁定', duration: '7-15天', description: '获取法院裁定书' },
    { phase: '过户登记', duration: '15-30天', description: '办理产权过户手续' },
    { phase: '抵押贷款', duration: '7-14天', description: '银行抵押放款' },
  ],
  summary: '综合评估，该资产具有较好的融资空间和投资价值，建议在充分尽调后参与竞拍。',
}

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | typeof mockDecisionReport | null>(null)

  const filteredReports = mockReports.filter(report => {
    if (activeTab === 'all') return true
    if (activeTab === 'processing') return report.status === 'processing'
    return report.type === activeTab
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">智策云V2</Link>
              <span className="ml-4 text-gray-600">报告查看</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reports List */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-4">报告列表</h2>
              
              {/* Tabs */}
              <div className="flex space-x-2 mb-4 overflow-x-auto">
                {[
                  { key: 'all', label: '全部' },
                  { key: 'credit', label: '信用报告' },
                  { key: 'asset', label: '资产报告' },
                  { key: 'decision', label: '决策报告' },
                  { key: 'processing', label: '处理中' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.key 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Reports */}
              <div className="space-y-3">
                {filteredReports.map(report => (
                  <div
                    key={report.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedReport?.id === report.id 
                        ? 'bg-primary-50 border-2 border-primary-300' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`badge ${
                        report.type === 'credit' ? 'badge-info' :
                        report.type === 'asset' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {report.type === 'credit' ? '信用' : report.type === 'asset' ? '资产' : '决策'}
                      </span>
                      <span className={`badge ${
                        report.status === 'completed' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {report.status === 'completed' ? '已完成' : '处理中'}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{report.title}</h3>
                    <p className="text-sm text-gray-500">{report.createdAt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report Detail */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="card">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedReport.title}
                    </h1>
                    <p className="text-gray-500">
                      生成时间：{selectedReport.createdAt}
                    </p>
                  </div>
                  <button className="btn-secondary flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    下载PDF
                  </button>
                </div>

                {/* Content based on report type */}
                {'keyMetrics' in selectedReport ? (
                  // Credit Report
                  <div>
                    {/* Score */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="text-center p-6 bg-primary-50 rounded-xl">
                        <div className="text-5xl font-bold text-primary-600 mb-2">
                          {selectedReport.score}
                        </div>
                        <div className="text-sm text-gray-600">综合评分</div>
                      </div>
                      <div className="text-center p-6 bg-green-50 rounded-xl">
                        <div className="text-5xl font-bold text-green-600 mb-2">
                          {selectedReport.level}
                        </div>
                        <div className="text-sm text-gray-600">信用等级</div>
                      </div>
                      <div className="text-center p-6 bg-accent-gold/10 rounded-xl">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                          ¥{(selectedReport.loanLimit / 10000).toFixed(0)}万
                        </div>
                        <div className="text-sm text-gray-600">可贷额度</div>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <h3 className="font-bold text-gray-900 mb-4">企业信用画像</h3>
                    <div className="space-y-4 mb-8">
                      {Object.entries(selectedReport.keyMetrics).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">
                              {key === 'taxCompliance' && '纳税合规度'}
                              {key === 'financialHealth' && '财务健康度'}
                              {key === 'businessStability' && '经营稳定性'}
                              {key === 'industryProspects' && '行业发展前景'}
                            </span>
                            <span className="text-sm font-medium text-gray-900">{value}分</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{width: `${value}%`}}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Risk Level */}
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="font-medium text-green-700">
                          风险评级：{selectedReport.riskLevel}
                        </span>
                      </div>
                      <p className="text-sm text-green-600">
                        您的企业信用状况良好，符合银行优质客户标准。
                      </p>
                    </div>
                  </div>
                ) : 'analysis' in selectedReport ? (
                  // Asset Report
                  <div>
                    {/* Asset Info */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <h3 className="font-bold text-gray-900 mb-4">资产信息</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">资产名称</p>
                          <p className="font-medium">{selectedReport.asset.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">起拍价格</p>
                          <p className="font-medium text-primary-600">
                            ¥{(selectedReport.asset.price / 10000).toFixed(0)}万
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">市场价格</p>
                          <p className="font-medium">
                            ¥{(selectedReport.asset.marketPrice / 10000).toFixed(0)}万
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">净融资空间</p>
                          <p className="font-medium text-primary-600">
                            ¥{(selectedReport.asset.financingSpace / 10000).toFixed(0)}万
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Analysis */}
                    <h3 className="font-bold text-gray-900 mb-4">融资分析</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">
                          ¥{(selectedReport.analysis.downPayment / 10000).toFixed(0)}万
                        </div>
                        <div className="text-sm text-gray-500">首付门槛</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">
                          {selectedReport.analysis.loanToValue}
                        </div>
                        <div className="text-sm text-gray-500">贷价值比</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">
                          {selectedReport.analysis.leverage}倍
                        </div>
                        <div className="text-sm text-gray-500">杠杆率</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">
                          ¥{(selectedReport.analysis.monthlyPayment / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-gray-500">月供金额</div>
                      </div>
                    </div>
                  </div>
                ) : 'risks' in selectedReport ? (
                  // Decision Report
                  <div>
                    {/* Summary */}
                    <div className="bg-primary-50 rounded-xl p-6 mb-6">
                      <div className="flex items-center mb-4">
                        <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="font-bold text-primary-900">投资建议</h3>
                      </div>
                      <p className="text-primary-800">
                        {mockDecisionReport.summary}
                      </p>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600">
                          ¥{(mockDecisionReport.financing.downPayment / 10000).toFixed(0)}万
                        </div>
                        <div className="text-sm text-gray-500">首付门槛</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600">
                          {mockDecisionReport.analysis.leverage}倍
                        </div>
                        <div className="text-sm text-gray-500">杠杆率</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600">
                          {mockDecisionReport.financing.loanTerm}年
                        </div>
                        <div className="text-sm text-gray-500">预计放款周期</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600">
                          ¥{(mockDecisionReport.financing.monthlyPayment / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-gray-500">月供压力</div>
                      </div>
                    </div>

                    {/* Risks */}
                    <h3 className="font-bold text-gray-900 mb-4">潜在风险提示</h3>
                    <div className="space-y-4 mb-6">
                      {mockDecisionReport.risks.map((risk, index) => (
                        <div 
                          key={index}
                          className={`p-4 rounded-lg ${
                            risk.level === 'high' ? 'bg-red-50' :
                            risk.level === 'medium' ? 'bg-yellow-50' : 'bg-green-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{risk.title}</h4>
                            <span className={`badge ${
                              risk.level === 'high' ? 'badge-danger' :
                              risk.level === 'medium' ? 'badge-warning' : 'badge-success'
                            }`}>
                              {risk.level === 'high' ? '高风险' : 
                               risk.level === 'medium' ? '中风险' : '低风险'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                          <p className="text-sm text-primary-600">
                            <span className="font-medium">建议：</span>{risk.suggestion}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Timeline */}
                    <h3 className="font-bold text-gray-900 mb-4">预计流程周期</h3>
                    <div className="space-y-4">
                      {mockDecisionReport.timeline.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 text-primary-600 font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.phase}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                          <span className="text-sm text-gray-600">{item.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Processing
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">报告生成中</h2>
                    <p className="text-gray-600 mb-4">预计剩余时间：约 {selectedReport.estimatedTime}</p>
                    <p className="text-sm text-gray-500">系统正在分析您的数据和资产信息...</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
                  <button className="btn-secondary">
                    分享报告
                  </button>
                  <button className="btn-primary">
                    生成PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="card text-center py-16">
                <svg className="w-20 h-20 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900 mb-2">选择报告查看</h2>
                <p className="text-gray-500">点击左侧列表中的报告查看详情</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
