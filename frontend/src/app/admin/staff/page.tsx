'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface Staff {
  id: string
  name: string
  email: string
  phone?: string
  position: string
  department?: string
  avatar?: string
  status: string
  joinedAt: string
  customers: Array<{
    id: string
    customerId: string
    status: string
    customer: {
      id: string
      name: string
      email: string
      phone?: string
    }
  }>
  followUps: Array<{
    id: string
    type: string
    content: string
    nextAction?: string
    nextDate?: string
    createdAt: string
    customerId: string
  }>
}

interface Stats {
  totalStaff: number
  activeStaff: number
  totalCustomers: number
  recentFollowUps: number
  staffWithCustomers: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
}

export default function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showFollowUpModal, setShowFollowUpModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: ''
  })
  const [followUpData, setFollowUpData] = useState({
    customerId: '',
    type: 'note',
    content: '',
    nextAction: '',
    nextDate: ''
  })

  useEffect(() => {
    fetchStaff()
    fetchStats()
    fetchCustomers()
  }, [])

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/staff`)
      setStaff(res.data.data)
    } catch (error) {
      console.error('获取员工列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/staff/stats/overview`)
      setStats(res.data.data)
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/staff/customers/list`)
      setCustomers(res.data.data)
    } catch (error) {
      console.error('获取客户列表失败:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/api/staff`, formData)
      setShowModal(false)
      setFormData({ name: '', email: '', phone: '', position: '', department: '' })
      fetchStaff()
      fetchStats()
    } catch (error: any) {
      alert(error.response?.data?.message || '创建失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该员工吗？')) return
    try {
      await axios.delete(`${API_URL}/api/staff/${id}`)
      fetchStaff()
      fetchStats()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const staffMember = staff.find(s => s.id === id)
      await axios.put(`${API_URL}/api/staff/${id}`, {
        ...staffMember,
        status
      })
      fetchStaff()
      fetchStats()
    } catch (error) {
      console.error('更新状态失败:', error)
    }
  }

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStaff) return
    try {
      await axios.post(`${API_URL}/api/staff/${selectedStaff.id}/customers`, {
        customerId: followUpData.customerId,
        notes: ''
      })
      setShowCustomerModal(false)
      setFollowUpData({ ...followUpData, customerId: '' })
      fetchStaff()
      fetchStats()
    } catch (error) {
      console.error('分配客户失败:', error)
    }
  }

  const handleAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStaff) return
    try {
      await axios.post(`${API_URL}/api/staff/${selectedStaff.id}/followups`, {
        customerId: followUpData.customerId || selectedStaff.customers[0]?.customerId,
        type: followUpData.type,
        content: followUpData.content,
        nextAction: followUpData.nextAction,
        nextDate: followUpData.nextDate || null
      })
      setShowFollowUpModal(false)
      setFollowUpData({ customerId: '', type: 'note', content: '', nextAction: '', nextDate: '' })
      fetchStaff()
    } catch (error) {
      console.error('添加跟进记录失败:', error)
    }
  }

  const openCustomerModal = (staffMember: Staff) => {
    setSelectedStaff(staffMember)
    setShowCustomerModal(true)
  }

  const openFollowUpModal = (staffMember: Staff) => {
    setSelectedStaff(staffMember)
    setShowFollowUpModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">员工总数</div>
          <div className="text-2xl font-bold text-blue-600">{stats?.totalStaff || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">在职员工</div>
          <div className="text-2xl font-bold text-green-600">{stats?.activeStaff || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">跟进客户</div>
          <div className="text-2xl font-bold text-purple-600">{stats?.totalCustomers || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">有客户员工</div>
          <div className="text-2xl font-bold text-orange-600">{stats?.staffWithCustomers || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">本周跟进</div>
          <div className="text-2xl font-bold text-red-600">{stats?.recentFollowUps || 0}</div>
        </div>
      </div>

      {/* 操作栏 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">员工管理</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + 添加员工
        </button>
      </div>

      {/* 员工列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">员工</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">职位</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">部门</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">跟进客户</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">最近跟进</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{member.position}</td>
                <td className="px-6 py-4">{member.department || '-'}</td>
                <td className="px-6 py-4">
                  <span className="text-purple-600 font-medium">{member.customers.length}</span> 人
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {member.followUps[0] 
                    ? new Date(member.followUps[0].createdAt).toLocaleDateString('zh-CN')
                    : '-'
                  }
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    member.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.status === 'active' ? '在职' : '离职'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openCustomerModal(member)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      分配客户
                    </button>
                    <button
                      onClick={() => openFollowUpModal(member)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      跟进记录
                    </button>
                    <button
                      onClick={() => handleStatusChange(
                        member.id, 
                        member.status === 'active' ? 'inactive' : 'active'
                      )}
                      className="text-orange-600 hover:text-orange-800 text-sm"
                    >
                      {member.status === 'active' ? '离职' : '复职'}
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {staff.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            暂无员工数据
          </div>
        )}
      </div>

      {/* 添加员工弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">添加员工</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">姓名 *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">邮箱 *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">电话</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">职位 *</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">部门</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 分配客户弹窗 */}
      {showCustomerModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">分配客户 - {selectedStaff.name}</h2>
            <form onSubmit={handleAddCustomer}>
              <div>
                <label className="block text-sm font-medium mb-1">选择客户</label>
                <select
                  required
                  value={followUpData.customerId}
                  onChange={(e) => setFollowUpData({ ...followUpData, customerId: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">请选择客户</option>
                  {customers
                    .filter(c => !selectedStaff.customers.some(sc => sc.customerId === c.id))
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))
                  }
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  分配
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 添加跟进记录弹窗 */}
      {showFollowUpModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">添加跟进记录 - {selectedStaff.name}</h2>
            <form onSubmit={handleAddFollowUp}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">选择客户</label>
                  <select
                    required
                    value={followUpData.customerId}
                    onChange={(e) => setFollowUpData({ ...followUpData, customerId: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">请选择客户</option>
                    {selectedStaff.customers.map(sc => (
                      <option key={sc.customerId} value={sc.customerId}>
                        {sc.customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">跟进类型</label>
                  <select
                    value={followUpData.type}
                    onChange={(e) => setFollowUpData({ ...followUpData, type: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="note">备注</option>
                    <option value="call">电话</option>
                    <option value="visit">拜访</option>
                    <option value="meeting">会议</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">跟进内容 *</label>
                  <textarea
                    required
                    rows={3}
                    value={followUpData.content}
                    onChange={(e) => setFollowUpData({ ...followUpData, content: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">下次行动</label>
                  <input
                    type="text"
                    value={followUpData.nextAction}
                    onChange={(e) => setFollowUpData({ ...followUpData, nextAction: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">下次跟进日期</label>
                  <input
                    type="date"
                    value={followUpData.nextDate}
                    onChange={(e) => setFollowUpData({ ...followUpData, nextDate: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  添加记录
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
