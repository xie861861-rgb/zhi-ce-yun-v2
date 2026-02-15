'use client'

import { useState } from 'react'

// 模拟报告数据
const mockReports = [
  { id: 'RPT20260212001', company: '华创科技有限公司', type: '信用报告', generateTime: '2026-02-12 14:30', status: 'completed', pages: 15 },
  { id: 'RPT20260212002', company: '瑞丰银行股份有限公司', type: '资产报告', generateTime: '2026-02-12 13:15', status: 'completed', pages: 28 },
  { id: 'RPT20260211003', company: '鼎盛实业集团有限公司', type: '决策报告', generateTime: '2026-02-11 16:45', status: 'completed', pages: 42 },
  { id: 'RPT20260211004', company: '阳光新能源科技', type: '信用报告', generateTime: '2026-02-11 11:20', status: 'completed', pages: 18 },
  { id: 'RPT20260210005', company: '创新资本管理', type: '决策报告', generateTime: '2026-02-10 09:30', status: 'completed', pages: 35 },
  { id: 'RPT20260210006', company: '环球贸易进出口', type: '资产报告', generateTime: '2026-02-10 08:45', status: 'processing', pages: 0 },
  { id: 'RPT20260209007', company: '智慧物流集团', type: '信用报告', generateTime: '2026-02-09 17:00', status: 'completed', pages: 16 },
  { id: 'RPT20260209008', company: '未来建筑设计院', type: '决策报告', generateTime: '2026-02-09 14:20', status: 'failed', pages: 0 },
]

const typeMap: Record<string, { label: string; class: string; color: string }> = {
  信用报告: { label: '信用报告', class: 'bg-blue-100 text-blue-700', color: '#3B82F6' },
  资产报告: { label: '资产报告', class: 'bg-green-100 text-green-700', color: '#10B981' },
  决策报告: { label: '决策报告', class: 'bg-purple-100 text-purple-700', color: '#8B5CF6' },
}

const statusMap: Record<string, { label: string; class: string }> = {
  completed: { label: '已完成', class: 'bg-green-100 text-green-700' },
  processing: { label: '生成中', class: 'bg-yellow-100 text-yellow-700' },
  failed: { label: '失败', class: 'bg-red-100 text-red-700' },
}

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null)

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || report.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleExport = (report: typeof mockReports[0]) => {
    alert(`正在导出报告 ${report.id}（模拟）`)
  }

  const handleRegenerate = (reportId: string) => {
    alert(`正在重新生成报告 ${reportId}（模拟）`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">报告管理</h1>
          <p className="text-gray-500 mt-1">管理AI生成的各类报告</p>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="搜索报告ID或企业名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
          >
            <option value="all">全部类型</option>
            <option value="信用报告">信用报告</option>
            <option value="资产报告">资产报告</option>
            <option value="决策报告">决策报告</option>
          </select>
        </div>
      </div>

      {/* 报告列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">报告ID</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">企业名称</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">报告类型</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">生成时间</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">页数</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">状态</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <span className="font-mono text-sm text-gray-600">{report.id}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-gray-600">
                        {report.company.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{report.company}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: typeMap[report.type].color }}
                    />
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeMap[report.type].class}`}>
                      {typeMap[report.type].label}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-600">{report.generateTime}</td>
                <td className="py-4 px-6 text-gray-600">
                  {report.status === 'completed' ? `${report.pages}页` : '-'}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusMap[report.status].class}`}>
                    {statusMap[report.status].label}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="查看详情"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    {report.status === 'completed' && (
                      <button
                        onClick={() => handleExport(report)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="导出PDF"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    )}
                    {report.status === 'failed' && (
                      <button
                        onClick={() => handleRegenerate(report.id)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="重新生成"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 报告详情模态框 */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 animate-fade-in max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">报告详情</h2>
                <p className="text-sm text-gray-500 mt-1 font-mono">{selectedReport.id}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">企业名称</label>
                  <p className="text-gray-900 font-medium">{selectedReport.company}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">报告类型</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeMap[selectedReport.type].class}`}>
                    {typeMap[selectedReport.type].label}
                  </span>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">生成时间</label>
                  <p className="text-gray-900 font-medium">{selectedReport.generateTime}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">状态</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusMap[selectedReport.status].class}`}>
                    {statusMap[selectedReport.status].label}
                  </span>
                </div>
              </div>

              {/* 报告预览（模拟） */}
              {selectedReport.status === 'completed' && (
                <div>
                  <label className="block text-sm text-gray-500 mb-3">报告预览</label>
                  <div className="bg-gray-100 rounded-xl p-8 min-h-64 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500">报告预览区域</p>
                      <p className="text-sm text-gray-400 mt-2">共 {selectedReport.pages} 页</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 生成失败原因 */}
              {selectedReport.status === 'failed' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-700 font-medium">生成失败</span>
                  </div>
                  <p className="text-sm text-red-600 mt-2">可能原因：企业数据不完整，请补充相关信息后重试。</p>
                </div>
              )}

              {/* 生成中状态 */}
              {selectedReport.status === 'processing' && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="animate-spin w-5 h-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-yellow-700 font-medium">正在生成报告...</span>
                  </div>
                  <p className="text-sm text-yellow-600 mt-2">AI正在分析企业数据，预计还需要2-3分钟。</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
              {selectedReport.status === 'completed' && (
                <button
                  onClick={() => handleExport(selectedReport)}
                  className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  导出PDF
                </button>
              )}
              {selectedReport.status === 'failed' && (
                <button
                  onClick={() => { handleRegenerate(selectedReport.id); setSelectedReport(null); }}
                  className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重新生成
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
