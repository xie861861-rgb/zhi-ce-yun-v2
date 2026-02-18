'use client'

import { useState } from 'react'

type QualityRule = {
  id: string
  name: string
  field: string
  rule: string
  status: 'active' | 'inactive'
  failCount: number
}

type AssetSource = {
  id: string
  name: string
  type: 'manual' | 'api' | 'ai'
  status: 'active' | 'inactive'
  description: string
  config: Record<string, any>
  lastSyncTime: string | null
  assetCount: number
  qualityScore: number
}

const mockSources: AssetSource[] = [
  { id: '1', name: '手动录入', type: 'manual', status: 'active', description: '管理员手动添加资产信息', config: {}, lastSyncTime: null, assetCount: 156, qualityScore: 98 },
  { id: '2', name: '阿里法拍API', type: 'api', status: 'active', description: '对接阿里拍卖平台API获取法拍房源', config: { apiUrl: 'https://api.aliyun.com/auction', refreshInterval: 60 }, lastSyncTime: '2026-02-18 01:30:00', assetCount: 892, qualityScore: 85 },
  { id: '3', name: '京东法拍API', type: 'api', status: 'active', description: '对接京东拍卖平台API获取法拍房源', config: { apiUrl: 'https://api.jd.com/auction', refreshInterval: 60 }, lastSyncTime: '2026-02-18 01:35:00', assetCount: 567, qualityScore: 82 },
  { id: '4', name: '智能体采集', type: 'ai', status: 'active', description: 'AI智能体自动从各大房产网站采集优质房源', config: { keywords: ['深圳', '法拍', '笋盘'], minPrice: 1000000 }, lastSyncTime: '2026-02-18 01:40:00', assetCount: 234, qualityScore: 78 },
]

const mockRules: QualityRule[] = [
  { id: '1', name: '价格不能为0', field: 'price', rule: '> 0', status: 'active', failCount: 12 },
  { id: '2', name: '面积必须>10㎡', field: 'area', rule: '> 10', status: 'active', failCount: 5 },
  { id: '3', name: '地址必须包含深圳', field: 'address', rule: 'contains:深圳', status: 'active', failCount: 28 },
  { id: '4', name: '必须有产权信息', field: 'propertyRights', rule: 'not null', status: 'active', failCount: 15 },
  { id: '5', name: '评估价>=售价', field: 'evalPrice', rule: '>= price', status: 'active', failCount: 8 },
  { id: '6', name: '不能有查封记录', field: 'seizureStatus', rule: '!= 已查封', status: 'inactive', failCount: 0 },
]

const sourceTypeMap = {
  manual: { label: '手动', class: 'bg-blue-100 text-blue-700', icon: '✏️' },
  api: { label: 'API对接', class: 'bg-green-100 text-green-700', icon: '🔗' },
  ai: { label: 'AI采集', class: 'bg-purple-100 text-purple-700', icon: '🤖' },
}

export default function AssetSourcesPage() {
  const [sources, setSources] = useState(mockSources)
  const [rules, setRules] = useState(mockRules)
  const [activeTab, setActiveTab] = useState<'sources' | 'quality' | 'cleaning'>('sources')

  const handleToggleStatus = (id: string) => {
    setSources(sources.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s))
  }

  const handleSync = (id: string) => {
    setSources(sources.map(s => s.id === id ? { ...s, lastSyncTime: new Date().toISOString().replace('T', ' ').substring(0, 19) } : s))
    alert('同步完成！（模拟）')
  }

  const handleCleanData = () => {
    if (confirm('确定执行数据清洗吗？将根据质量规则自动处理异常数据。')) {
      alert('数据清洗完成！共处理 68 条异常数据')
    }
  }

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">资产来源与数据质量</h1>
          <p className="text-gray-500 mt-1">管理数据来源，数据清洗和质量监控（深圳房产为主）</p>
        </div>
        <button onClick={handleCleanData} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center cursor-pointer">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.247 3.414H4.828c-1.614 0-2.507-2.154-1.247-3.414l5-5A2 2 0 009 7.828V5L8 4z" />
          </svg>
          一键清洗数据
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex space-x-1">
        <button onClick={() => setActiveTab('sources')} className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'sources' ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          📊 数据来源
        </button>
        <button onClick={() => setActiveTab('quality')} className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'quality' ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          ✅ 质量规则
        </button>
        <button onClick={() => setActiveTab('cleaning')} className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'cleaning' ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          🔧 数据清洗
        </button>
      </div>

      {activeTab === 'sources' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">数据源总数</p>
              <p className="text-2xl font-bold text-gray-900">{sources.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">资产总数</p>
              <p className="text-2xl font-bold text-purple-600">{sources.reduce((sum, s) => sum + s.assetCount, 0)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">平均质量分</p>
              <p className="text-2xl font-bold text-green-600">{Math.round(sources.reduce((sum, s) => sum + s.qualityScore, 0) / sources.length)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">待清洗数据</p>
              <p className="text-2xl font-bold text-orange-600">68</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">数据源</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">类型</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">质量分</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">资产数量</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">最后同步</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr key={source.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div><p className="font-medium text-gray-900">{source.name}</p><p className="text-sm text-gray-400">{source.description}</p></div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${sourceTypeMap[source.type].class}`}>
                        {sourceTypeMap[source.type].icon} {sourceTypeMap[source.type].label}
                      </span>
                    </td>
                    <td className="py-4 px-6"><span className={`font-bold ${getQualityColor(source.qualityScore)}`}>{source.qualityScore}分</span></td>
                    <td className="py-4 px-6 text-gray-900 font-medium">{source.assetCount}</td>
                    <td className="py-4 px-6 text-gray-500 text-sm">{source.lastSyncTime || '从未同步'}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleToggleStatus(source.id)} className={`px-3 py-1 rounded-full text-sm font-medium ${source.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {source.status === 'active' ? '启用' : '禁用'}
                        </button>
                        {source.type !== 'manual' && (
                          <button onClick={() => handleSync(source.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="同步">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'quality' && (
        <>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-orange-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <div className="text-sm text-orange-800">
                <p className="font-medium">质量规则说明</p>
                <p className="mt-1">规则用于自动检测资产数据的真实性和有效性，当前深圳房产数据需要重点验证：价格、面积、地址、产权状态、查封情况等。</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">规则名称</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">验证字段</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">规则</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">状态</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">失败数</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{rule.name}</td>
                    <td className="py-4 px-6 text-gray-600">{rule.field}</td>
                    <td className="py-4 px-6"><code className="text-sm bg-gray-100 px-2 py-1 rounded">{rule.rule}</code></td>
                    <td className="py-4 px-6">
                      <button onClick={() => setRules(rules.map(r => r.id === rule.id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r))} className={`px-3 py-1 rounded-full text-sm font-medium ${rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {rule.status === 'active' ? '启用' : '禁用'}
                      </button>
                    </td>
                    <td className="py-4 px-6">{rule.failCount > 0 ? <span className="text-red-600 font-medium">{rule.failCount}条异常</span> : <span className="text-green-600">正常</span>}</td>
                    <td className="py-4 px-6 text-right"><button className="text-blue-600 hover:underline text-sm">编辑</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-medium text-gray-900 mb-4">添加质量规则</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="规则名称" className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
              <input type="text" placeholder="验证字段" className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
              <input type="text" placeholder="规则表达式，如 > 0" className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
            </div>
            <button className="mt-4 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a]">添加规则</button>
          </div>
        </>
      )}

      {activeTab === 'cleaning' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">待处理数据</h3>
                <span className="text-2xl font-bold text-orange-600">68</span>
              </div>
              <p className="text-sm text-gray-500">不符合质量规则的数据</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">自动修复</h3>
                <span className="text-2xl font-bold text-green-600">45</span>
              </div>
              <p className="text-sm text-gray-500">可自动修复的数据</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">需人工审核</h3>
                <span className="text-2xl font-bold text-red-600">23</span>
              </div>
              <p className="text-sm text-gray-500">需要人工确认的数据</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-medium text-gray-900 mb-4">清洗任务</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3"><span className="text-green-600">✓</span></div>
                  <div><p className="font-medium text-gray-900">价格数据清洗</p><p className="text-sm text-gray-500">处理价格为空或异常的数据</p></div>
                </div>
                <span className="text-green-600 font-medium">已完成</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3"><span className="text-blue-600">⟳</span></div>
                  <div><p className="font-medium text-gray-900">地址标准化</p><p className="text-sm text-gray-500">统一地址格式，添加深圳前缀</p></div>
                </div>
                <span className="text-blue-600 font-medium">进行中</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3"><span className="text-orange-600">⏳</span></div>
                  <div><p className="font-medium text-gray-900">产权状态验证</p><p className="text-sm text-gray-500">验证房产查封、抵押状态</p></div>
                </div>
                <span className="text-gray-500 font-medium">待执行</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
