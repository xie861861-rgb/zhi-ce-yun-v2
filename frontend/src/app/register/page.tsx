'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('两次密码输入不一致')
      return
    }

    setLoading(true)
    
    // Simulate registration
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        name: formData.name,
        company: formData.company,
      }))
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary-600">智策云V2</Link>
          <p className="text-gray-600 mt-2">智能融资决策平台</p>
        </div>

        {/* Register Form */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">企业注册</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系人姓名
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
                placeholder="请输入联系人姓名"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                企业名称
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="input-field"
                placeholder="请输入企业名称"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="input-field"
                placeholder="请输入邮箱地址"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手机号码
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="input-field"
                placeholder="请输入手机号码"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="input-field"
                placeholder="请输入密码（至少6位）"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认密码
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="input-field"
                placeholder="请再次输入密码"
                required
              />
            </div>

            <div className="flex items-start">
              <input type="checkbox" className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500" required />
              <span className="ml-2 text-sm text-gray-600">
                我已阅读并同意
                <a href="#" className="text-primary-600 hover:text-primary-700">《服务条款》</a>
                和
                <a href="#" className="text-primary-600 hover:text-primary-700">《隐私政策》</a>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '注册中...' : '立即注册'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              已有账号？
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium ml-1">
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
