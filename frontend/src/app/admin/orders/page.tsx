'use client'

import { useState } from 'react'

// 模拟工单数据
const mockOrders = [
  { id: 'TKT20260212001', company: '华创科技有限公司', type: '贷款进度咨询', status: 'pending', priority: 'high', submitTime: '2026-02-12 10:30', assignee: null },
  { id: 'TKT20260212002', company: '瑞丰银行股份有限公司', type: '系统问题反馈', status: 'processing', priority: 'medium', submitTime: '2026-02-12 09:15', assignee: '客服小王' },
  { id: 'TKT20260211003', company: '鼎盛实业集团有限公司', type: '资质认证协助', status: 'pending', priority: 'high', submitTime: '2026-02-11 16:45', assignee: null },
  { id: 'TKT20260211004', company: '阳光新能源科技', type: '报告导出问题', status: 'completed', priority: 'low', submitTime: '2026-02-11 14:20', assignee: '客服小李' },
  { id: 'TKT20260210005', company: '创新资本管理', type: '功能建议', status: 'completed', priority: 'low', submitTime: '2026-02-10 11:30', assignee: '客服小王' },
  { id: 'TKT20260210006', company: '环球贸易进出口', type: '数据同步异常', status: 'processing', priority: 'urgent', submitTime: '2026-02-10 08:45', assignee: '技术部小张' },
]

const statusMap: Record<string, { label: string; class: string }> = {
  pending: { label: '待处理', class: 'bg-yellow-100 text-yellow-700' },
  processing: { label: '处理中', class: 'bg-blue-100 text-blue-700' },
  completed: { label: '已完成', class: 'bg-green-100 text-green-700' },
}

const priorityMap: Record<string, { label: string; class: string }> = {
  urgent: { label: '紧急', class: 'bg-red-100 text-red-700' },
  high: { label: '高', class: 'bg-orange-100 text-orange-700' },
  medium: { label: '中', class: 'bg-blue-100 text-blue-700' },
  low: { label: '低', class: 'bg-gray-100 text-gray-700' },
}

const typeOptions = ['贷款进度咨询', '系统问题反馈', '资质认证协助', '报告导出问题', '功能建议', '数据同步异常', '其他']

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAssign = (orderId: string) => {
    setSelectedOrder(orders.find(o => o.id === orderId) || null)
    setShowAssignModal(true)
  }

  const handleComplete = (orderId: string) => {
    if (confirm('确定标记为完成吗？')) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'completed' } : o))
    }
  }

  const handleAssignSubmit = () => {
    if (selectedOrder) {
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: 'processing', assignee: '客服小王' } : o))
      setShowAssignModal(false)
      setSelectedOrder(null)
      alert('工单已分配（模拟）')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">工单管理</h1>
          <p className="text-gray-500 mt-1">处理客户工单和反馈</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">待处理</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">处理中</p>
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'processing').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已完成</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'completed').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">紧急工单</p>
              <p className="text-2xl font-bold text-red-600">
                {orders.filter(o => o.priority === 'urgent').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="搜索工单编号或企业名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
          >
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="completed">已完成</option>
          </select>
        </div>
      </div>

      {/* 工单列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">工单编号</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">企业名称</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">工单类型</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">优先级</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">状态</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">提交时间</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">处理人</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <span className="font-mono text-sm text-gray-600">{order.id}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="font-medium text-gray-900">{order.company}</span>
                </td>
                <td className="py-4 px-6 text-gray-600">{order.type}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priorityMap[order.priority].class}`}>
                    {priorityMap[order.priority].label}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusMap[order.status].class}`}>
                    {statusMap[order.status].label}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600">{order.submitTime}</td>
                <td className="py-4 px-6">
                  {order.assignee ? (
                    <span className="text-gray-900">{order.assignee}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="查看详情"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleAssign(order.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="分配客服"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => handleComplete(order.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="标记完成"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

      {/* 工单详情模态框 */}
      {selectedOrder && !showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">工单详情</h2>
                <p className="text-sm text-gray-500 mt-1 font-mono">{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">企业名称</label>
                  <p className="text-gray-900 font-medium">{selectedOrder.company}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">工单类型</label>
                  <p className="text-gray-900 font-medium">{selectedOrder.type}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">优先级</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priorityMap[selectedOrder.priority].class}`}>
                    {priorityMap[selectedOrder.priority].label}
                  </span>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">状态</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusMap[selectedOrder.status].class}`}>
                    {statusMap[selectedOrder.status].label}
                  </span>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">提交时间</label>
                  <p className="text-gray-900 font-medium">{selectedOrder.submitTime}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">处理人</label>
                  <p className="text-gray-900 font-medium">{selectedOrder.assignee || '未分配'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">问题描述</label>
                <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
                  {selectedOrder.type === '贷款进度咨询' && '客户咨询贷款审批进度，希望了解当前状态和预计完成时间。'}
                  {selectedOrder.type === '系统问题反馈' && '系统在使用过程中出现页面加载缓慢的问题，特别是在生成报告时。'}
                  {selectedOrder.type === '资质认证协助' && '客户在提交资质认证时遇到问题，部分材料上传失败。'}
                  {selectedOrder.type === '报告导出问题' && '导出的PDF报告格式有问题，部分中文显示乱码。'}
                  {selectedOrder.type === '功能建议' && '希望增加批量导出功能，提高工作效率。'}
                  {selectedOrder.type === '数据同步异常' && '系统数据与银行接口不同步，导致数据不一致。'}
                  {selectedOrder.type === '其他' && '客户反馈其他问题。'}
                </div>
              </div>

              {/* 处理记录 */}
              <div>
                <label className="block text-sm text-gray-500 mb-2">处理记录</label>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3" />
                    <div>
                      <p className="text-sm text-gray-900">工单已提交</p>
                      <p className="text-xs text-gray-400">{selectedOrder.submitTime}</p>
                    </div>
                  </div>
                  {selectedOrder.assignee && (
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3" />
                      <div>
                        <p className="text-sm text-gray-900">分配给 {selectedOrder.assignee}</p>
                        <p className="text-xs text-gray-400">开始处理</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
              {selectedOrder.status === 'pending' && (
                <button
                  onClick={() => { setShowAssignModal(true); }}
                  className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] transition-colors"
                >
                  分配客服
                </button>
              )}
              {selectedOrder.status === 'processing' && (
                <button
                  onClick={() => { handleComplete(selectedOrder.id); setSelectedOrder(null); }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  标记完成
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 分配客服模态框 */}
      {showAssignModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">分配客服</h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">工单编号</p>
                <p className="font-mono text-gray-900">{selectedOrder.id}</p>
                <p className="text-sm text-gray-500 mt-2">企业名称</p>
                <p className="text-gray-900">{selectedOrder.company}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择客服</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent">
                  <option value="1">客服小王</option>
                  <option value="2">客服小李</option>
                  <option value="3">客服小张</option>
                  <option value="4">技术部小张</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAssignSubmit}
                className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] transition-colors"
              >
                确定分配
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
