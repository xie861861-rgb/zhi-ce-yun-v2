'use client'

import { useState } from 'react'

// 模拟审核数据
const mockAuditList = [
  { id: 1, company: '华创科技有限公司', contact: '张经理', submitTime: '2026-02-12 10:30', riskLevel: 'low', type: '企业认证', documents: 5 },
  { id: 2, company: '鼎盛实业集团有限公司', contact: '王总', submitTime: '2026-02-12 09:15', riskLevel: 'medium', type: '企业认证', documents: 8 },
  { id: 3, company: '智慧物流集团', contact: '周总', submitTime: '2026-02-11 16:45', riskLevel: 'high', type: '资质更新', documents: 12 },
  { id: 4, company: '创新建筑设计院', contact: '吴总监', submitTime: '2026-02-11 14:20', riskLevel: 'low', type: '企业认证', documents: 4 },
  { id: 5, company: '未来科技发展', contact: '陈经理', submitTime: '2026-02-11 11:30', riskLevel: 'medium', type: '资质更新', documents: 6 },
]

// 已审核历史
const auditHistory = [
  { id: 101, company: '瑞丰银行股份有限公司', submitTime: '2026-02-10', auditTime: '2026-02-10', result: 'approved', auditor: '管理员' },
  { id: 102, company: '阳光新能源科技', submitTime: '2026-02-09', auditTime: '2026-02-09', result: 'approved', auditor: '管理员' },
  { id: 103, company: '创新资本管理', submitTime: '2026-02-08', auditTime: '2026-02-08', result: 'rejected', auditor: '管理员' },
  { id: 104, company: '环球贸易进出口', submitTime: '2026-02-07', auditTime: '2026-02-07', result: 'approved', auditor: '管理员' },
]

const riskLevelMap: Record<string, { label: string; class: string }> = {
  low: { label: '低风险', class: 'bg-green-100 text-green-700' },
  medium: { label: '中风险', class: 'bg-yellow-100 text-yellow-700' },
  high: { label: '高风险', class: 'bg-red-100 text-red-700' },
}

const resultMap: Record<string, { label: string; class: string }> = {
  approved: { label: '已通过', class: 'bg-green-100 text-green-700' },
  rejected: { label: '已拒绝', class: 'bg-red-100 text-red-700' },
}

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending')
  const [auditList, setAuditList] = useState(mockAuditList)
  const [selectedAudit, setSelectedAudit] = useState<typeof mockAuditList[0] | null>(null)

  const handleApprove = (id: number) => {
    if (confirm('确定通过该审核吗？')) {
      setAuditList(auditList.filter(item => item.id !== id))
    }
  }

  const handleReject = (id: number) => {
    if (confirm('确定拒绝该审核吗？')) {
      setAuditList(auditList.filter(item => item.id !== id))
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">审核管理</h1>
          <p className="text-gray-500 mt-1">管理企业资质审核</p>
        </div>
      </div>

      {/* 选项卡 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === 'pending'
                  ? 'text-[#1e3a5f]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              待审核
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                {auditList.length}
              </span>
              {activeTab === 'pending' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e3a5f]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === 'history'
                  ? 'text-[#1e3a5f]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              审核历史
              {activeTab === 'history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e3a5f]" />
              )}
            </button>
          </nav>
        </div>

        {/* 待审核列表 */}
        {activeTab === 'pending' && (
          <div className="p-6">
            {auditList.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500">暂无待审核内容</p>
              </div>
            ) : (
              <div className="space-y-4">
                {auditList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">
                          {item.company.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.company}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{item.type}</span>
                          <span className="text-sm text-gray-400">|</span>
                          <span className="text-sm text-gray-500">提交时间：{item.submitTime}</span>
                          <span className="text-sm text-gray-400">|</span>
                          <span className="text-sm text-gray-500">文档数：{item.documents}份</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${riskLevelMap[item.riskLevel].class}`}>
                        {riskLevelMap[item.riskLevel].label}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedAudit(item)}
                          className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          通过
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          拒绝
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 审核历史 */}
        {activeTab === 'history' && (
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 rounded-lg">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">企业名称</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">提交时间</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">审核时间</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">审核人</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">结果</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {auditHistory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {item.company.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{item.company}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{item.submitTime}</td>
                    <td className="py-4 px-4 text-gray-600">{item.auditTime}</td>
                    <td className="py-4 px-4 text-gray-600">{item.auditor}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${resultMap[item.result].class}`}>
                        {resultMap[item.result].label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-[#1e3a5f] hover:underline text-sm">查看详情</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 审核详情模态框 */}
      {selectedAudit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">审核详情</h2>
              <button
                onClick={() => setSelectedAudit(null)}
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
                  <p className="text-gray-900 font-medium">{selectedAudit.company}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">联系人</label>
                  <p className="text-gray-900 font-medium">{selectedAudit.contact}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">提交时间</label>
                  <p className="text-gray-900 font-medium">{selectedAudit.submitTime}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">风险等级</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${riskLevelMap[selectedAudit.riskLevel].class}`}>
                    {riskLevelMap[selectedAudit.riskLevel].label}
                  </span>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">审核类型</label>
                  <p className="text-gray-900 font-medium">{selectedAudit.type}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">文档数量</label>
                  <p className="text-gray-900 font-medium">{selectedAudit.documents}份</p>
                </div>
              </div>

              {/* 文档列表 */}
              <div>
                <label className="block text-sm text-gray-500 mb-3">提交文档</label>
                <div className="space-y-2">
                  {['营业执照.pdf', '税务登记证.jpg', '银行流水.pdf', '财务报表.xlsx', '法人身份证.pdf'].map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-gray-700">{doc}</span>
                      </div>
                      <button className="text-[#1e3a5f] hover:underline text-sm">查看</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 备注 */}
              <div>
                <label className="block text-sm text-gray-500 mb-1">审核备注</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  rows={3}
                  placeholder="请输入审核备注..."
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setSelectedAudit(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => { handleReject(selectedAudit.id); setSelectedAudit(null); }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                拒绝
              </button>
              <button
                onClick={() => { handleApprove(selectedAudit.id); setSelectedAudit(null); }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                通过
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
