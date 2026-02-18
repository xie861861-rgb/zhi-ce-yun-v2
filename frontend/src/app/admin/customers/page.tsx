'use client'

import { useState } from 'react'

// CRM数据类型
type DealStage = 'potential' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'

type Customer = {
  id: string
  name: string
  contact: string
  phone: string
  email: string
  industry: string
  registerTime: string
  status: 'verified' | 'pending' | 'rejected'
  // CRM字段
  assignedTo: string  // 跟进人
  dealStage: DealStage  // 商机阶段
  dealAmount: number  // 意向金额
  lastFollowUp: string | null  // 最后跟进时间
  nextFollowUp: string | null  // 下次跟进时间
  followUpCount: number  // 跟进次数
  notes: string  // 备注
  tags: string[]  // 标签
}

type FollowUpRecord = {
  id: string
  customerId: string
  date: string
  type: 'call' | 'visit' | 'meeting' | 'wechat'
  content: string
  result: string
  staff: string
}

// 服务人员
const staffList = [
  { id: '1', name: '张经理', department: '销售部', phone: '138****1234' },
  { id: '2', name: '李经理', department: '销售部', phone: '139****5678' },
  { id: '3', name: '王经理', department: '客服部', phone: '136****9012' },
  { id: '4', name: '赵经理', department: '客服部', phone: '135****3456' },
]

// 模拟客户数据（带CRM）
const mockCustomers: Customer[] = [
  { id: '1', name: '华创科技有限公司', contact: '张总', phone: '138****1234', email: 'zhang@huachuang.com', industry: '科技', registerTime: '2026-02-10', status: 'verified', assignedTo: '张经理', dealStage: 'proposal', dealAmount: 5000000, lastFollowUp: '2026-02-17', nextFollowUp: '2026-02-20', followUpCount: 5, notes: '意向强烈，需要方案', tags: ['重点客户', '深圳'] },
  { id: '2', name: '瑞丰银行', contact: '李总监', phone: '139****5678', email: 'li@ruifeng.com', industry: '金融', registerTime: '2026-02-09', status: 'verified', assignedTo: '李经理', dealStage: 'qualified', dealAmount: 8000000, lastFollowUp: '2026-02-16', nextFollowUp: '2026-02-19', followUpCount: 3, notes: '大型客户，需总经办审批', tags: ['重点客户', '上市公司'] },
  { id: '3', name: '鼎盛实业集团', contact: '王总', phone: '136****9012', email: 'wang@dingsheng.com', industry: '制造', registerTime: '2026-02-08', status: 'pending', assignedTo: '张经理', dealStage: 'contacted', dealAmount: 3000000, lastFollowUp: '2026-02-15', nextFollowUp: '2026-02-18', followUpCount: 2, notes: '刚接触，需进一步沟通', tags: ['新客户'] },
  { id: '4', name: '阳光新能源', contact: '赵经理', phone: '135****3456', email: 'zhao@yangguang.com', industry: '能源', registerTime: '2026-02-07', status: 'verified', assignedTo: '王经理', dealStage: 'won', dealAmount: 12000000, lastFollowUp: '2026-02-14', nextFollowUp: null, followUpCount: 8, notes: '已签约！首年服务费12万', tags: ['成交客户', 'VIP'] },
  { id: '5', name: '创新资本', contact: '陈总监', phone: '137****7890', email: 'chen@chuangxin.com', industry: '金融', registerTime: '2026-02-06', status: 'rejected', assignedTo: '李经理', dealStage: 'lost', dealAmount: 0, lastFollowUp: '2026-02-12', nextFollowUp: null, followUpCount: 1, notes: '客户流失，预算不足', tags: ['已流失'] },
  { id: '6', name: '环球贸易', contact: '刘经理', phone: '132****2345', email: 'liu@huanqiu.com', industry: '贸易', registerTime: '2026-02-05', status: 'verified', assignedTo: '赵经理', dealStage: 'negotiation', dealAmount: 2000000, lastFollowUp: '2026-02-17', nextFollowUp: '2026-02-21', followUpCount: 4, notes: '合同条款洽谈中', tags: ['重点客户'] },
]

// 跟进记录
const mockFollowUps: FollowUpRecord[] = [
  { id: '1', customerId: '1', date: '2026-02-17', type: 'visit', content: '上门拜访，介绍产品功能', result: '客户认可，需要提供详细方案', staff: '张经理' },
  { id: '2', customerId: '1', date: '2026-02-15', type: 'call', content: '电话沟通需求', result: '有融资需求，预算500万', staff: '张经理' },
  { id: '3', customerId: '4', date: '2026-02-14', type: 'meeting', content: '签约洽谈', result: '成功签约！', staff: '王经理' },
]

const stageMap: Record<DealStage, { label: string; color: string; order: number }> = {
  potential: { label: '潜在客户', color: 'bg-gray-100 text-gray-700', order: 0 },
  contacted: { label: '已联系', color: 'bg-blue-100 text-blue-700', order: 1 },
  qualified: { label: '已筛选', color: 'bg-indigo-100 text-indigo-700', order: 2 },
  proposal: { label: '方案中', color: 'bg-yellow-100 text-yellow-700', order: 3 },
  negotiation: { label: '谈判中', color: 'bg-orange-100 text-orange-700', order: 4 },
  won: { label: '已成交', color: 'bg-green-100 text-green-700', order: 5 },
  lost: { label: '已流失', color: 'bg-red-100 text-red-700', order: 6 },
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [followUps, setFollowUps] = useState(mockFollowUps)
  const [activeTab, setActiveTab] = useState<'list' | 'pipeline' | 'staff'>('list')
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState<DealStage | 'all'>('all')
  const [staffFilter, setStaffFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showFollowUpModal, setShowFollowUpModal] = useState(false)
  const [newFollowUp, setNewFollowUp] = useState({ type: 'call', content: '', result: '' })

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.contact.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = stageFilter === 'all' || c.dealStage === stageFilter
    const matchesStaff = staffFilter === 'all' || c.assignedTo === staffFilter
    return matchesSearch && matchesStage && matchesStaff
  })

  // 统计数据
  const stats = {
    total: customers.length,
    potential: customers.filter(c => c.dealStage === 'potential' || c.dealStage === 'contacted').length,
    inProgress: customers.filter(c => ['qualified', 'proposal', 'negotiation'].includes(c.dealStage)).length,
    won: customers.filter(c => c.dealStage === 'won').length,
    lost: customers.filter(c => c.dealStage === 'lost').length,
    totalAmount: customers.filter(c => c.dealStage !== 'lost').reduce((sum, c) => sum + c.dealAmount, 0),
  }

  const handleStageChange = (customerId: string, stage: DealStage) => {
    setCustomers(customers.map(c => c.id === customerId ? { ...c, dealStage: stage } : c))
  }

  const handleAssignStaff = (customerId: string, staff: string) => {
    setCustomers(customers.map(c => c.id === customerId ? { ...c, assignedTo: staff } : c))
  }

  const handleAddFollowUp = () => {
    if (!selectedCustomer || !newFollowUp.content) return
    const followUp: FollowUpRecord = {
      id: String(followUps.length + 1),
      customerId: selectedCustomer.id,
      date: new Date().toISOString().split('T')[0],
      ...newFollowUp,
      staff: selectedCustomer.assignedTo
    }
    setFollowUps([followUp, ...followUps])
    setCustomers(customers.map(c => c.id === selectedCustomer.id ? {
      ...c,
      lastFollowUp: followUp.date,
      followUpCount: c.followUpCount + 1
    } : c))
    setShowFollowUpModal(false)
    setNewFollowUp({ type: 'call', content: '', result: '' })
  }

  const getCustomerFollowUps = (customerId: string) => followUps.filter(f => f.customerId === customerId)

  const formatMoney = (amount: number) => {
    if (amount >= 10000) return `${(amount / 10000).toFixed(1)}万`
    return amount.toString()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">客户管理 CRM</h1>
          <p className="text-gray-500 mt-1">完整的客户关系管理，从线索到成交</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex space-x-1">
        <button onClick={() => setActiveTab('list')} className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          📋 客户列表
        </button>
        <button onClick={() => setActiveTab('pipeline')} className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pipeline' ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          📈 销售漏斗
        </button>
        <button onClick={() => setActiveTab('staff')} className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'staff' ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          👥 员工跟进
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">客户总数</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">潜在客户</p>
          <p className="text-2xl font-bold text-blue-600">{stats.potential}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">跟进中</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">已成交</p>
          <p className="text-2xl font-bold text-green-600">{stats.won}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">已流失</p>
          <p className="text-2xl font-bold text-red-600">{stats.lost}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">总意向金额</p>
          <p className="text-2xl font-bold text-purple-600">{formatMoney(stats.totalAmount)}</p>
        </div>
      </div>

      {/* 客户列表 */}
      {activeTab === 'list' && (
        <>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input type="text" placeholder="搜索客户名称或联系人..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
            </div>
            <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value as DealStage | 'all')} className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
              <option value="all">全部阶段</option>
              {Object.entries(stageMap).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
            </select>
            <select value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
              <option value="all">全部员工</option>
              {staffList.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">客户</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">跟进人</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">阶段</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">意向金额</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">跟进</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">下次跟进</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-400">{customer.contact} · {customer.industry}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select value={customer.assignedTo} onChange={(e) => handleAssignStaff(customer.id, e.target.value)} className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]">
                        {staffList.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <select value={customer.dealStage} onChange={(e) => handleStageChange(customer.id, e.target.value as DealStage)} className={`text-sm border-0 rounded px-2 py-1 ${stageMap[customer.dealStage].color}`}>
                        {Object.entries(stageMap).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                      </select>
                    </td>
                    <td className="py-4 px-6 text-gray-900 font-medium">{formatMoney(customer.dealAmount)}</td>
                    <td className="py-4 px-6 text-gray-500 text-sm">
                      <span className="text-gray-900">{customer.followUpCount}</span> 次
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {customer.nextFollowUp ? (
                        <span className={new Date(customer.nextFollowUp) <= new Date() ? 'text-red-600' : 'text-gray-500'}>
                          {customer.nextFollowUp}
                        </span>
                      ) : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => { setSelectedCustomer(customer); setShowDetailModal(true); }} className="text-blue-600 hover:underline text-sm">详情</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 销售漏斗 */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Object.entries(stageMap).sort((a, b) => a[1].order - b[1].order).map(([stage, info]) => {
            const stageCustomers = customers.filter(c => c.dealStage === stage)
            const amount = stageCustomers.reduce((sum, c) => sum + c.dealAmount, 0)
            return (
              <div key={stage} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${info.color}`}>{info.label}</span>
                  <span className="text-lg font-bold text-gray-900">{stageCustomers.length}</span>
                </div>
                <p className="text-sm text-gray-500">{formatMoney(amount)}</p>
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                  {stageCustomers.map(c => (
                    <div key={c.id} onClick={() => { setSelectedCustomer(c); setShowDetailModal(true); }} className="text-sm p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                      <p className="font-medium truncate">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.assignedTo}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 员工跟进 */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {staffList.map(staff => {
            const staffCustomers = customers.filter(c => c.assignedTo === staff.name)
            const wonCount = staffCustomers.filter(c => c.dealStage === 'won').length
            const followingCount = staffCustomers.filter(c => !['won', 'lost'].includes(c.dealStage)).length
            const totalAmount = staffCustomers.filter(c => c.dealStage !== 'lost').reduce((sum, c) => sum + c.dealAmount, 0)
            return (
              <div key={staff.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-medium">{staff.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{staff.name}</p>
                    <p className="text-sm text-gray-500">{staff.department}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold text-gray-900">{staffCustomers.length}</p>
                    <p className="text-xs text-gray-500">客户数</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xl font-bold text-green-600">{wonCount}</p>
                    <p className="text-xs text-green-600">成交</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xl font-bold text-yellow-600">{followingCount}</p>
                    <p className="text-xs text-yellow-600">跟进中</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">总意向金额: <span className="font-medium text-gray-900">{formatMoney(totalAmount)}</span></p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {staffCustomers.slice(0, 5).map(c => (
                      <div key={c.id} className="flex items-center justify-between text-sm">
                        <span className="truncate flex-1">{c.name}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${stageMap[c.dealStage].color}`}>{stageMap[c.dealStage].label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 客户详情弹窗 */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">客户详情</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                  <p className="text-gray-500">{selectedCustomer.contact} · {selectedCustomer.industry}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${stageMap[selectedCustomer.dealStage].color}`}>
                  {stageMap[selectedCustomer.dealStage].label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">手机</p><p className="font-medium">{selectedCustomer.phone}</p></div>
                <div><p className="text-sm text-gray-500">邮箱</p><p className="font-medium">{selectedCustomer.email}</p></div>
                <div><p className="text-sm text-gray-500">跟进人</p><p className="font-medium">{selectedCustomer.assignedTo}</p></div>
                <div><p className="text-sm text-gray-500">意向金额</p><p className="font-medium text-purple-600">{formatMoney(selectedCustomer.dealAmount)}</p></div>
              </div>

              <div><p className="text-sm text-gray-500 mb-1">标签</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.tags.map(tag => <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">{tag}</span>)}
                </div>
              </div>

              <div><p className="text-sm text-gray-500 mb-1">备注</p><p className="text-gray-700">{selectedCustomer.notes}</p></div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">跟进记录</h4>
                  <button onClick={() => setShowFollowUpModal(true)} className="text-sm text-blue-600 hover:underline">+ 添加跟进</button>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {getCustomerFollowUps(selectedCustomer.id).length > 0 ? getCustomerFollowUps(selectedCustomer.id).map(f => (
                    <div key={f.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{f.staff}</span>
                        <span className="text-xs text-gray-500">{f.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{f.content}</p>
                      <p className="text-sm text-green-600 mt-1">{f.result}</p>
                    </div>
                  )) : <p className="text-gray-400 text-sm">暂无跟进记录</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 添加跟进弹窗 */}
      {showFollowUpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">添加跟进记录</h2>
              <button onClick={() => setShowFollowUpModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">跟进方式</label>
                <select value={newFollowUp.type} onChange={(e) => setNewFollowUp({...newFollowUp, type: e.target.value as any})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                  <option value="call">电话</option>
                  <option value="visit">上门拜访</option>
                  <option value="meeting">线下会议</option>
                  <option value="wechat">微信</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">跟进内容</label>
                <textarea value={newFollowUp.content} onChange={(e) => setNewFollowUp({...newFollowUp, content: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" rows={3} placeholder="请输入跟进内容" />
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">跟进结果</label>
                <input type="text" value={newFollowUp.result} onChange={(e) => setNewFollowUp({...newFollowUp, result: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" placeholder="请输入跟进结果" />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowFollowUpModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">取消</button>
              <button onClick={handleAddFollowUp} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a]">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
