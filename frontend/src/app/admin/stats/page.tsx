'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// 模拟客户增长数据
const customerGrowthData = [
  { month: '1月', newCustomers: 120, totalCustomers: 850 },
  { month: '2月', newCustomers: 145, totalCustomers: 995 },
  { month: '3月', newCustomers: 180, totalCustomers: 1175 },
  { month: '4月', newCustomers: 165, totalCustomers: 1340 },
  { month: '5月', newCustomers: 210, totalCustomers: 1550 },
  { month: '6月', newCustomers: 195, totalCustomers: 1745 },
  { month: '7月', newCustomers: 230, totalCustomers: 1975 },
  { month: '8月', newCustomers: 280, totalCustomers: 2255 },
  { month: '9月', newCustomers: 260, totalCustomers: 2515 },
  { month: '10月', newCustomers: 310, totalCustomers: 2825 },
  { month: '11月', newCustomers: 350, totalCustomers: 3175 },
  { month: '12月', newCustomers: 385, totalCustomers: 3560 },
]

// 模拟报告生成统计
const reportStatsData = [
  { type: '信用报告', count: 856, percentage: 45 },
  { type: '资产报告', count: 624, percentage: 33 },
  { type: '决策报告', count: 420, percentage: 22 },
]

// 模拟资产匹配成功率
const matchRateData = [
  { month: '1月', rate: 72 },
  { month: '2月', rate: 75 },
  { month: '3月', rate: 78 },
  { month: '4月', rate: 76 },
  { month: '5月', rate: 82 },
  { month: '6月', rate: 85 },
  { month: '7月', rate: 83 },
  { month: '8月', rate: 88 },
  { month: '9月', rate: 87 },
  { month: '10月', rate: 90 },
  { month: '11月', rate: 91 },
  { month: '12月', rate: 92 },
]

// 模拟营收统计
const revenueData = [
  { month: '1月', revenue: 1850000, orders: 45 },
  { month: '2月', revenue: 2100000, orders: 52 },
  { month: '3月', revenue: 2450000, orders: 61 },
  { month: '4月', revenue: 2280000, orders: 55 },
  { month: '5月', revenue: 2750000, orders: 68 },
  { month: '6月', revenue: 2920000, orders: 72 },
  { month: '7月', revenue: 3180000, orders: 78 },
  { month: '8月', revenue: 3450000, orders: 85 },
  { month: '9月', revenue: 3320000, orders: 82 },
  { month: '10月', revenue: 3780000, orders: 92 },
  { month: '11月', revenue: 4150000, orders: 105 },
  { month: '12月', revenue: 4520000, orders: 118 },
]

const COLORS = ['#1e3a5f', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据统计</h1>
          <p className="text-gray-500 mt-1">平台运营数据概览</p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent">
            <option>最近12个月</option>
            <option>最近6个月</option>
            <option>最近30天</option>
          </select>
          <button className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] transition-colors flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            导出报表
          </button>
        </div>
      </div>

      {/* 选项卡 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="flex">
            {[
              { id: 'overview', label: '数据概览' },
              { id: 'customers', label: '客户分析' },
              { id: 'revenue', label: '营收分析' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#1e3a5f]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e3a5f]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* 数据概览 */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <p className="text-sm opacity-80">客户总数</p>
                  <p className="text-3xl font-bold mt-2">3,560</p>
                  <p className="text-sm mt-2 opacity-80">↑ 12.5% 较去年</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <p className="text-sm opacity-80">报告生成数</p>
                  <p className="text-3xl font-bold mt-2">1,900</p>
                  <p className="text-sm mt-2 opacity-80">↑ 23.1% 较去年</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                  <p className="text-sm opacity-80">资产匹配率</p>
                  <p className="text-3xl font-bold mt-2">92%</p>
                  <p className="text-sm mt-2 opacity-80">↑ 8% 较去年</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                  <p className="text-sm opacity-80">年度营收</p>
                  <p className="text-3xl font-bold mt-2">¥3,876万</p>
                  <p className="text-sm mt-2 opacity-80">↑ 35.2% 较去年</p>
                </div>
              </div>

              {/* 客户增长趋势图 */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">客户增长趋势</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={customerGrowthData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="totalCustomers"
                      stroke="#1e3a5f"
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                      name="累计客户"
                    />
                    <Area
                      type="monotone"
                      dataKey="newCustomers"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#colorNew)"
                      name="新增客户"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* 报告类型分布和资产匹配率 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">报告类型分布</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={reportStatsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="type"
                        label={({ type, percentage }) => `${type} ${percentage}%`}
                      >
                        {reportStatsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">资产匹配成功率</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={matchRateData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} domain={[60, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#1e3a5f"
                        strokeWidth={3}
                        dot={{ fill: '#1e3a5f', strokeWidth: 2 }}
                        name="匹配成功率(%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* 客户分析 */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <p className="text-sm text-gray-500">本月新增客户</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">385</p>
                  <p className="text-sm text-green-600 mt-1">↑ 10.0% 较上月</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <p className="text-sm text-gray-500">客户留存率</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">94.5%</p>
                  <p className="text-sm text-green-600 mt-1">↑ 2.3% 较上月</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <p className="text-sm text-gray-500">活跃客户数</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">2,856</p>
                  <p className="text-sm text-gray-500 mt-1">占比 80.2%</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">月度新增客户趋势</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customerGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="newCustomers" fill="#1e3a5f" name="新增客户" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 营收分析 */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <p className="text-sm text-gray-500">本月营收</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">¥452万</p>
                  <p className="text-sm text-green-600 mt-1">↑ 8.9% 较上月</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <p className="text-sm text-gray-500">年度累计营收</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">¥3,876万</p>
                  <p className="text-sm text-green-600 mt-1">↑ 35.2% 较去年</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <p className="text-sm text-gray-500">本月订单数</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">118</p>
                  <p className="text-sm text-green-600 mt-1">↑ 12.4% 较上月</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <p className="text-sm text-gray-500">客单价</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">¥3.83万</p>
                  <p className="text-sm text-gray-500 mt-1">较稳定</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">月度营收趋势</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(value) => `¥${value / 10000}万`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`¥${value.toLocaleString()}`, '营收']}
                    />
                    <Bar dataKey="revenue" fill="#1e3a5f" name="营收" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 营收明细表格 */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">营收明细</h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">月份</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">订单数</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">营收金额</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">环比增长</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.map((item, index) => (
                      <tr key={item.month} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{item.month}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{item.orders}</td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          ¥{(item.revenue / 10000).toFixed(2)}万
                        </td>
                        <td className="py-3 px-4 text-right">
                          {index > 0 ? (
                            <span className={`text-sm ${item.revenue > revenueData[index - 1].revenue ? 'text-green-600' : 'text-red-600'}`}>
                              {item.revenue > revenueData[index - 1].revenue ? '↑' : '↓'}{' '}
                              {Math.abs(Math.round((item.revenue - revenueData[index - 1].revenue) / revenueData[index - 1].revenue * 100))}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
