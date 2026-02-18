'use client'

import { useState } from 'react'

type AdminRole = 'super_admin' | 'asset_manager' | 'audit_manager' | 'customer_manager' | 'viewer'

type Admin = {
  id: string
  name: string
  email: string
  role: AdminRole
  status: 'active' | 'inactive'
  lastLogin: string | null
  createdAt: string
}

type Staff = {
  id: string
  name: string
  department: string
  phone: string
  email: string
  status: 'active' | 'inactive'
  role: 'sales' | 'service' | 'manager'
  joinDate: string
}

const mockAdmins: Admin[] = [
  { id: '1', name: '超级管理员', email: 'admin@zhicelyun.com', role: 'super_admin', status: 'active', lastLogin: '2026-02-18 02:00:00', createdAt: '2026-01-01' },
  { id: '2', name: '张经理', email: 'zhang@zhicelyun.com', role: 'asset_manager', status: 'active', lastLogin: '2026-02-17 15:30:00', createdAt: '2026-01-15' },
  { id: '3', name: '李审核', email: 'li@zhicelyun.com', role: 'audit_manager', status: 'active', lastLogin: '2026-02-18 09:00:00', createdAt: '2026-01-20' },
]

const mockStaff: Staff[] = [
  { id: '1', name: '张经理', department: '销售部', phone: '13812341234', email: 'zhang@zhicelyun.com', status: 'active', role: 'sales', joinDate: '2026-01-01' },
  { id: '2', name: '李经理', department: '销售部', phone: '13912345678', email: 'li@zhicelyun.com', status: 'active', role: 'sales', joinDate: '2026-01-05' },
  { id: '3', name: '王经理', department: '客服部', phone: '13612349012', email: 'wang@zhicelyun.com', status: 'active', role: 'service', joinDate: '2026-01-10' },
  { id: '4', name: '赵经理', department: '客服部', phone: '13512343456', email: 'zhao@zhicelyun.com', status: 'active', role: 'service', joinDate: '2026-01-15' },
]

const roleMap: Record<AdminRole, { label: string; desc: string; class: string }> = {
  super_admin: { label: '超级管理员', desc: '拥有所有权限', class: 'bg-red-100 text-red-700' },
  asset_manager: { label: '资产管理', desc: '负责资产和来源管理', class: 'bg-blue-100 text-blue-700' },
  audit_manager: { label: '审核管理', desc: '负责企业审核和工单', class: 'bg-green-100 text-green-700' },
  customer_manager: { label: '客户管理', desc: '负责客户管理', class: 'bg-purple-100 text-purple-700' },
  viewer: { label: '只读权限', desc: '仅能查看数据', class: 'bg-gray-100 text-gray-700' },
}

const staffRoleMap = {
  sales: { label: '销售', class: 'bg-blue-100 text-blue-700' },
  service: { label: '客服', class: 'bg-green-100 text-green-700' },
  manager: { label: '管理', class: 'bg-purple-100 text-purple-700' },
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState(mockAdmins)
  const [staff, setStaff] = useState(mockStaff)
  const [activeTab, setActiveTab] = useState<'admins' | 'staff'>('admins')
  const [showAddAdminModal, setShowAddAdminModal] = useState(false)
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'viewer' as AdminRole })
  const [newStaff, setNewStaff] = useState({ name: '', department: '', phone: '', email: '', role: 'sales' as Staff['role'] })

  const handleAddAdmin = () => {
    const newId = Math.max(...admins.map(a => parseInt(a.id))) + 1
    const admin: Admin = { id: String(newId), ...newAdmin, status: 'active', lastLogin: null, createdAt: new Date().toISOString().split('T')[0] }
    setAdmins([...admins, admin])
    setShowAddAdminModal(false)
    setNewAdmin({ name: '', email: '', role: 'viewer' })
  }

  const handleAddStaff = () => {
    const newId = String(Math.max(...staff.map(s => parseInt(s.id))) + 1)
    const newItem: Staff = { id: newId, ...newStaff, status: 'active', joinDate: new Date().toISOString().split('T')[0] }
    setStaff([...staff, newItem])
    setShowAddStaffModal(false)
    setNewStaff({ name: '', department: '', phone: '', email: '', role: 'sales' })
  }

  const handleToggleAdminStatus = (id: string) => {
    setAdmins(admins.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a))
  }

  const handleToggleStaffStatus = (id: string) => {
    setStaff(staff.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">管理员与员工管理</h1>
          <p className="text-gray-500 mt-1">管理后台管理员账号和服务人员</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex space-x-1">
        <button onClick={() => setActiveTab('admins')} className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'admins' ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          👤 管理员
        </button>
        <button onClick={() => setActiveTab('staff')} className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'staff' ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          👥 员工（销售/客服）
        </button>
      </div>

      {/* 管理员 */}
      {activeTab === 'admins' && (
        <>
          <div className="flex justify-end">
            <button onClick={() => setShowAddAdminModal(true)} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] flex items-center cursor-pointer">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              添加管理员
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><p className="text-sm text-gray-500">管理员总数</p><p className="text-2xl font-bold text-gray-900">{admins.length}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><p className="text-sm text-gray-500">超级管理员</p><p className="text-2xl font-bold text-red-600">{admins.filter(a => a.role === 'super_admin').length}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><p className="text-sm text-gray-500">在职</p><p className="text-2xl font-bold text-green-600">{admins.filter(a => a.status === 'active').length}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><p className="text-sm text-gray-500">禁用</p><p className="text-2xl font-bold text-gray-400">{admins.filter(a => a.status === 'inactive').length}</p></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">管理员</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">角色</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">状态</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">最后登录</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">创建时间</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">操作</th>
              </tr></thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center mr-3"><span className="text-white font-medium">{admin.name.charAt(0)}</span></div>
                        <div><p className="font-medium text-gray-900">{admin.name}</p><p className="text-sm text-gray-400">{admin.email}</p></div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleMap[admin.role].class}`}>{roleMap[admin.role].label}</span></td>
                    <td className="py-4 px-6"><button onClick={() => handleToggleAdminStatus(admin.id)} className={`px-3 py-1 rounded-full text-sm font-medium ${admin.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{admin.status === 'active' ? '启用' : '禁用'}</button></td>
                    <td className="py-4 px-6 text-gray-500 text-sm">{admin.lastLogin || '-'}</td>
                    <td className="py-4 px-6 text-gray-500 text-sm">{admin.createdAt}</td>
                    <td className="py-4 px-6 text-right">{admin.role !== 'super_admin' && <button className="text-red-600 hover:underline text-sm">删除</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 员工 */}
      {activeTab === 'staff' && (
        <>
          <div className="flex justify-end">
            <button onClick={() => setShowAddStaffModal(true)} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] flex items-center cursor-pointer">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              添加员工
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><p className="text-sm text-gray-500">员工总数</p><p className="text-2xl font-bold text-gray-900">{staff.length}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><p className="text-sm text-gray-500">销售</p><p className="text-2xl font-bold text-blue-600">{staff.filter(s => s.role === 'sales').length}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><p className="text-sm text-gray-500">客服</p><p className="text-2xl font-bold text-green-600">{staff.filter(s => s.role === 'service').length}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><p className="text-sm text-gray-500">在职</p><p className="text-2xl font-bold text-purple-600">{staff.filter(s => s.status === 'active').length}</p></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">员工</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">部门</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">职位</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">联系方式</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">入职时间</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">状态</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">操作</th>
              </tr></thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center mr-3"><span className="text-white font-medium">{s.name.charAt(0)}</span></div>
                        <div><p className="font-medium text-gray-900">{s.name}</p><p className="text-sm text-gray-400">{s.email}</p></div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{s.department}</td>
                    <td className="py-4 px-6"><span className={`px-2 py-1 rounded text-xs font-medium ${staffRoleMap[s.role].class}`}>{staffRoleMap[s.role].label}</span></td>
                    <td className="py-4 px-6 text-gray-600">{s.phone}</td>
                    <td className="py-4 px-6 text-gray-500">{s.joinDate}</td>
                    <td className="py-4 px-6"><button onClick={() => handleToggleStaffStatus(s.id)} className={`px-3 py-1 rounded-full text-sm font-medium ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{s.status === 'active' ? '在职' : '离职'}</button></td>
                    <td className="py-4 px-6 text-right"><button className="text-red-600 hover:underline text-sm">删除</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 添加管理员弹窗 */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">添加管理员</h2>
              <button onClick={() => setShowAddAdminModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label><input type="text" value={newAdmin.name} onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" placeholder="请输入姓名" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">邮箱 *</label><input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" placeholder="请输入邮箱" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">角色 *</label><select value={newAdmin.role} onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value as AdminRole})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">{Object.entries(roleMap).map(([key, val]) => <option key={key} value={key}>{val.label} - {val.desc}</option>)}</select></div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowAddAdminModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">取消</button>
              <button onClick={handleAddAdmin} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a]">添加</button>
            </div>
          </div>
        </div>
      )}

      {/* 添加员工弹窗 */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">添加员工</h2>
              <button onClick={() => setShowAddStaffModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label><input type="text" value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" placeholder="请输入姓名" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">部门 *</label><input type="text" value={newStaff.department} onChange={(e) => setNewStaff({...newStaff, department: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" placeholder="如：销售部" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">职位 *</label><select value={newStaff.role} onChange={(e) => setNewStaff({...newStaff, role: e.target.value as Staff['role']})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"><option value="sales">销售</option><option value="service">客服</option><option value="manager">管理</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">手机 *</label><input type="tel" value={newStaff.phone} onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" placeholder="请输入手机号" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">邮箱 *</label><input type="email" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" placeholder="请输入邮箱" /></div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowAddStaffModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">取消</button>
              <button onClick={handleAddStaff} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a]">添加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
