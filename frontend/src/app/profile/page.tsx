'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface StaffInfo {
  id: string
  name: string
  email: string
  phone?: string
  position: string
  department?: string
}

interface FollowUp {
  id: string
  type: string
  content: string
  nextAction?: string
  nextDate?: string
  createdAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [staffInfo, setStaffInfo] = useState<StaffInfo | null>(null)
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [loadingStaff, setLoadingStaff] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }
    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    if (parsedUser.id) {
      fetchStaffInfo(parsedUser.id)
    }
  }, [router])

  const fetchStaffInfo = async (userId: string) => {
    setLoadingStaff(true)
    try {
      // Find staff that has this user as a customer
      const res = await axios.get(`${API_URL}/api/staff`)
      const allStaff = res.data.data
      
      for (const staff of allStaff) {
        const customer = staff.customers?.find((c: any) => c.customerId === userId)
        if (customer) {
          setStaffInfo(staff)
          setFollowUps(staff.followUps?.filter((f: any) => f.customerId === userId) || [])
          break
        }
      }
    } catch (error) {
      console.error('获取员工信息失败:', error)
    } finally {
      setLoadingStaff(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) {
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
              <span className="ml-4 text-gray-600">个人中心</span>
            </div>
            <div className="flex items-center">
              <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 mr-4">
                返回工作台
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-primary-600">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.company}</p>
              </div>

              {/* Menu */}
              <nav className="space-y-1">
                {[
                  { key: 'profile', label: '个人信息', icon: '👤' },
                  { key: 'company', label: '企业信息', icon: '🏢' },
                  { key: 'security', label: '账号安全', icon: '🔒' },
                  { key: 'notifications', label: '消息通知', icon: '🔔' },
                  { key: 'billing', label: '账单记录', icon: '💳' },
                  { key: 'service', label: '专属服务', icon: '👨‍💼' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.key 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 mt-6 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <span className="mr-3">🚪</span>
                退出登录
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">个人信息</h2>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        姓名
                      </label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        邮箱
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="input-field"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        手机号
                      </label>
                      <input
                        type="tel"
                        defaultValue="138****8888"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        职位
                      </label>
                      <input
                        type="text"
                        defaultValue="总经理"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="btn-primary">
                      保存修改
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">企业信息</h2>
                
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-green-700">企业已认证</span>
                  </div>
                </div>

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      企业名称
                    </label>
                    <input
                      type="text"
                      defaultValue={user.company}
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        统一社会信用代码
                      </label>
                      <input
                        type="text"
                        defaultValue="91440300MA5FXXXXXX"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        法定代表人
                      </label>
                      <input
                        type="text"
                        defaultValue="张三"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        注册资本
                      </label>
                      <input
                        type="text"
                        defaultValue="1000万人民币"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        成立日期
                      </label>
                      <input
                        type="text"
                        defaultValue="2018-06-15"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      注册地址
                    </label>
                    <input
                      type="text"
                      defaultValue="深圳市南山区科技园路XX号XX大厦"
                      className="input-field"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="btn-primary">
                      保存修改
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">账号安全</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">登录密码</h3>
                      <p className="text-sm text-gray-500">定期更换密码，保障账号安全</p>
                    </div>
                    <button className="btn-secondary">修改</button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">手机绑定</h3>
                      <p className="text-sm text-gray-500">已绑定：138****8888</p>
                    </div>
                    <button className="btn-secondary">更换</button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">邮箱绑定</h3>
                      <p className="text-sm text-gray-500">已绑定：{user.email}</p>
                    </div>
                    <button className="btn-secondary">更换</button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">两步验证</h3>
                      <p className="text-sm text-gray-500">未开启</p>
                    </div>
                    <button className="btn-primary">开启</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">消息通知</h2>
                
                <div className="space-y-4">
                  {[
                    { title: '资质预审完成', time: '2026-02-12 10:30', read: false },
                    { title: '新资产推荐', time: '2026-02-12 09:00', read: true },
                    { title: '报告生成提醒', time: '2026-02-11 15:30', read: true },
                  ].map((notification, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-primary-50'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{notification.title}</h3>
                          <p className="text-sm text-gray-500">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <span className="badge badge-info">新消息</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">账单记录</h2>
                
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无账单记录</h3>
                  <p className="text-gray-500">您还没有任何账单记录</p>
                </div>
              </div>
            )}

            {activeTab === 'service' && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">专属服务</h2>
                
                {loadingStaff ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">加载中...</p>
                  </div>
                ) : staffInfo ? (
                  <div className="space-y-6">
                    {/* 专属顾问信息 */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">🎯 您的专属顾问</h3>
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                          {staffInfo.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="font-bold text-xl text-gray-900">{staffInfo.name}</div>
                          <div className="text-gray-600">{staffInfo.position} {staffInfo.department ? `· ${staffInfo.department}` : ''}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            📧 {staffInfo.email} {staffInfo.phone ? ` | 📞 ${staffInfo.phone}` : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 服务记录 */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">📋 服务记录</h3>
                      {followUps.length > 0 ? (
                        <div className="space-y-4">
                          {followUps.map((followUp) => (
                            <div key={followUp.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  followUp.type === 'call' ? 'bg-blue-100 text-blue-700' :
                                  followUp.type === 'visit' ? 'bg-green-100 text-green-700' :
                                  followUp.type === 'meeting' ? 'bg-purple-100 text-purple-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {followUp.type === 'call' ? '📞 电话' :
                                   followUp.type === 'visit' ? '🏠 拜访' :
                                   followUp.type === 'meeting' ? '🤝 会议' : '📝 备注'}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {new Date(followUp.createdAt).toLocaleString('zh-CN')}
                                </span>
                              </div>
                              <p className="text-gray-700">{followUp.content}</p>
                              {followUp.nextAction && (
                                <div className="mt-3 pt-3 border-t text-sm">
                                  <span className="text-orange-600">📌 下次行动：</span>
                                  <span className="text-gray-700">{followUp.nextAction}</span>
                                  {followUp.nextDate && (
                                    <span className="text-gray-500 ml-2">
                                      (计划日期: {new Date(followUp.nextDate).toLocaleDateString('zh-CN')})
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p>暂无服务记录</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">暂未分配专属顾问</h3>
                    <p className="text-gray-500">系统将为您自动分配专属服务顾问，请耐心等待</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
