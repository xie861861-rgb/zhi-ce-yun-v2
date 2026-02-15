'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 模拟登录验证
    setTimeout(() => {
      if (email === 'admin@zhicelyun.com' && password === 'admin123') {
        // 登录成功
        localStorage.setItem('adminUser', JSON.stringify({
          email: 'admin@zhicelyun.com',
          name: '超级管理员',
          avatar: ''
        }))
        router.push('/admin')
      } else {
        setError('邮箱或密码错误')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* 登录卡片 */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1e3a5f] rounded-xl mx-auto flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">智策云管理后台</h1>
          <p className="text-gray-500 mt-2">请登录管理员账号</p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 登录表单 */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
                placeholder="请输入管理员邮箱"
                required
              />
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
                placeholder="请输入密码"
                required
              />
            </div>

            {/* 记住我 */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#1e3a5f] border-gray-300 rounded focus:ring-[#1e3a5f]"
                />
                <span className="ml-2 text-sm text-gray-600">记住我</span>
              </label>
              <a href="#" className="text-sm text-[#1e3a5f] hover:underline">
                忘记密码？
              </a>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-[#1e3a5f] text-white rounded-lg font-medium transition-all duration-300 ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-[#152d4a] hover:shadow-lg'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  登录中...
                </span>
              ) : (
                '登录'
              )}
            </button>
          </div>
        </form>

        {/* 底部信息 */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-center text-sm text-gray-500">
            模拟管理员账号：<br />
            <span className="text-[#1e3a5f] font-medium">admin@zhicelyun.com</span> / <span className="font-medium">admin123</span>
          </p>
        </div>

        {/* 返回前台链接 */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-[#1e3a5f] transition-colors"
          >
            返回前台
          </a>
        </div>
      </div>
    </div>
  )
}
