'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('profile')
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(storedUser))
  }, [router])

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
          </div>
        </div>
      </div>
    </div>
  )
}
