'use client'

import { useState } from 'react'

// 模拟客户数据
const mockCustomers = [
  { id: 1, name: '华创科技有限公司', contact: '张经理', email: 'zhang@huachuang.com', phone: '138****1234', registerTime: '2026-02-10', status: 'verified', industry: '科技' },
  { id: 2, name: '瑞丰银行股份有限公司', contact: '李总监', email: 'li@ruifeng.com', phone: '139****5678', registerTime: '2026-02-09', status: 'verified', industry: '金融' },
  { id: 3, name: '鼎盛实业集团有限公司', contact: '王总', email: 'wang@dingsheng.com', phone: '136****9012', registerTime: '2026-02-08', status: 'pending', industry: '制造' },
  { id: 4, name: '阳光新能源科技', contact: '赵经理', email: 'zhao@yangguang.com', phone: '135****3456', registerTime: '2026-02-07', status: 'verified', industry: '能源' },
  { id: 5, name: '创新资本管理', contact: '陈总监', email: 'chen@chuangxin.com', phone: '137****7890', registerTime: '2026-02-06', status: 'rejected', industry: '金融' },
  { id: 6, name: '环球贸易进出口', contact: '刘经理', email: 'liu@huanqiu.com', phone: '132****2345', registerTime: '2026-02-05', status: 'verified', industry: '贸易' },
  { id: 7, name: '智慧物流集团', contact: '周总', email: 'zhou@zhihui.com', phone: '131****6789', registerTime: '2026-02-04', status: 'pending', industry: '物流' },
  { id: 8, name: '未来建筑设计院', contact: '吴总监', email: 'wu@weilai.com', phone: '130****0123', registerTime: '2026-02-03', status: 'verified', industry: '建筑' },
]

const statusMap: Record<string, { label: string; class: string }> = {
  verified: { label: '已认证', class: 'bg-green-100 text-green-700' },
  pending: { label: '待审核', class: 'bg-yellow-100 text-yellow-700' },
  rejected: { label: '已拒绝', class: 'bg-red-100 text-red-700' },
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null)

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contact.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: number) => {
    if (confirm('确定要删除该客户吗？')) {
      setCustomers(customers.filter(c => c.id !== id))
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">客户管理</h1>
          <p className="text-gray-500 mt-1">管理企业客户信息</p>
        </div>
        <button className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] transition-colors flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          添加客户
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="搜索企业名称或联系人..."
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
            <option value="verified">已认证</option>
            <option value="pending">待审核</option>
            <option value="rejected">已拒绝</option>
          </select>
        </div>
      </div>

      {/* 客户列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">企业名称</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">联系人</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">注册时间</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">认证状态</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">行业</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-blue-600">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-400">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="text-gray-900">{customer.contact}</p>
                  <p className="text-sm text-gray-400">{customer.phone}</p>
                </td>
                <td className="py-4 px-6 text-gray-600">{customer.registerTime}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusMap[customer.status].class}`}>
                    {statusMap[customer.status].label}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600">{customer.industry}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="查看详情"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 分页 */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            显示 {filteredCustomers.length} 条结果，共 {customers.length} 条
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              上一页
            </button>
            <button className="px-3 py-1 bg-[#1e3a5f] text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* 客户详情模态框 */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">客户详情</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedCustomer.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedCustomer.name}</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${statusMap[selectedCustomer.status].class}`}>
                    {statusMap[selectedCustomer.status].label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">联系人</label>
                  <p className="text-gray-900 font-medium">{selectedCustomer.contact}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">邮箱</label>
                  <p className="text-gray-900 font-medium">{selectedCustomer.email}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">手机号</label>
                  <p className="text-gray-900 font-medium">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">注册时间</label>
                  <p className="text-gray-900 font-medium">{selectedCustomer.registerTime}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">行业</label>
                  <p className="text-gray-900 font-medium">{selectedCustomer.industry}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">客户ID</label>
                  <p className="text-gray-900 font-medium">#{selectedCustomer.id.toString().padStart(6, '0')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
              <button className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] transition-colors">
                编辑客户
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
