'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// 模拟统计数据
const statsData = {
  totalCustomers: 1286,
  pendingAudit: 23,
  weeklyReports: 156,
  totalRevenue: 2850000,
}

// 模拟快捷入口
const quickActions = [
  {
    name: '待审核客户',
    count: 23,
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'bg-yellow-500',
    href: '/admin/audit'
  },
  {
    name: '新增客户',
    count: 12,
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    color: 'bg-blue-500',
    href: '/admin/customers'
  },
  {
    name: '待处理工单',
    count: 8,
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    color: 'bg-red-500',
    href: '/admin/orders'
  },
  {
    name: '今日报告',
    count: 34,
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    color: 'bg-green-500',
    href: '/admin/reports'
  },
]

// 模拟最近活动
const recentActivities = [
  { id: 1, type: 'audit', message: '新企业「华创科技」提交资质审核', time: '10分钟前' },
  { id: 2, type: 'report', message: '系统自动生成「瑞丰银行」信用报告', time: '25分钟前' },
  { id: 3, type: 'order', message: '新工单「贷款进度咨询」待处理', time: '1小时前' },
  { id: 4, type: 'customer', message: '新企业「鼎盛实业」注册成功', time: '2小时前' },
  { id: 5, type: 'asset', message: '资产「阳光花园别墅」已上架', time: '3小时前' },
]

// 模拟系统通知
const systemNotifications = [
  { id: 1, title: 'API调用次数提醒', message: '本月大模型API调用已达80%', level: 'warning' },
  { id: 2, title: '系统更新', message: '新版本v2.3.0已发布', level: 'info' },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(statsData)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">管理后台首页</h1>
          <p className="text-gray-500 mt-1">欢迎回来，管理员</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] transition-colors">
            刷新数据
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 客户总数 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">客户总数</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.totalCustomers.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-2">
                <span className="font-medium">↑ 12.5%</span>
                <span className="text-gray-400 ml-1">较上周</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 待审核 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">待审核数量</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.pendingAudit}
              </p>
              <p className="text-sm text-yellow-600 mt-2">
                <span className="font-medium">需尽快处理</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 本周报告 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">本周报告数</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.weeklyReports}
              </p>
              <p className="text-sm text-green-600 mt-2">
                <span className="font-medium">↑ 8.3%</span>
                <span className="text-gray-400 ml-1">较上周</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 成交金额 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">成交金额</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ¥{(stats.totalRevenue / 10000).toFixed(0)}万
              </p>
              <p className="text-sm text-green-600 mt-2">
                <span className="font-medium">↑ 23.1%</span>
                <span className="text-gray-400 ml-1">较上周</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 快捷入口和最近活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 快捷入口 */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷入口</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={action.icon}
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">{action.name}</span>
                <span className="text-2xl font-bold text-gray-900 mt-1">{action.count}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 系统通知 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">系统通知</h2>
          <div className="space-y-4">
            {systemNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg ${
                  notification.level === 'warning'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    notification.level === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <svg
                      className={`w-4 h-4 ${
                        notification.level === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">最近活动</h2>
          <button className="text-sm text-[#1e3a5f] hover:underline">查看全部</button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center py-3 border-b border-gray-100 last:border-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'audit' ? 'bg-yellow-100' :
                activity.type === 'report' ? 'bg-green-100' :
                activity.type === 'order' ? 'bg-red-100' :
                activity.type === 'customer' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                <svg
                  className={`w-5 h-5 ${
                    activity.type === 'audit' ? 'text-yellow-600' :
                    activity.type === 'report' ? 'text-green-600' :
                    activity.type === 'order' ? 'text-red-600' :
                    activity.type === 'customer' ? 'text-blue-600' : 'text-purple-600'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
