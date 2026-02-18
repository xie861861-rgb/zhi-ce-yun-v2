'use client'

import { useState } from 'react'

// 默认提示词配置
const defaultPrompts = {
  masterAgent: {
    name: '主智能体',
    description: '协调所有子智能体进行综合分析',
    prompt: `你是一个智能融资决策助手，负责为深圳科创企业匹配优质低价资产。

核心任务：
1. 分析企业财务状况和融资需求
2. 评估资产价值和套现空间
3. 匹配最合适的银行产品
4. 生成综合融资方案

分析原则：
- 保守估计资产价值，确保融资安全
- 优先推荐深圳地区法拍房和笋盘
- 考虑企业科创属性和负债率
- 提供多种方案选择`
  },
  enterpriseAnalysis: {
    name: '企业分析',
    description: '分析企业财务状况和科创属性',
    prompt: `分析企业财务状况，输出：
- 信用评分（满分100）
- 风险等级（低/中/高）
- 最大可融资额度
- 优势和劣势分析
- 建议的融资策略

关键指标：
- 负债率（超过70%为高风险）
- 营收增长趋势
- 科创属性（高新技术企业/专精特新）
- 行业前景`
  },
  propertyValuation: {
    name: '资产评估',
    description: '评估资产价值和套现空间',
    prompt: `评估资产价值，输出：
- 市场评估价
- 可贷款金额
- 套现空间
- 风险评估
- 推荐理由

计算公式：
- 可贷款 = 评估价 × 贷款成数
- 套现空间 = 可贷款 - 购入价 - 税费`
  },
  smartMatch: {
    name: '智能匹配',
    description: '匹配最适合的资产和银行产品',
    prompt: `进行智能匹配，输出：
- 匹配度评分（0-100）
- 推荐资产列表
- 匹配理由
- 风险提示
- 预期收益

匹配规则：
1. 预算匹配：资产价格 < 企业预算
2. 区域偏好：优先深圳
3. 收益最大化：套现空间最大化
4. 风险可控：负债率+贷款成数合理`
  }
}

export default function AIPromptSettingsPage() {
  const [prompts, setPrompts] = useState(defaultPrompts)
  const [activeTab, setActiveTab] = useState('masterAgent')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // 保存到本地存储（模拟）
    localStorage.setItem('aiPrompts', JSON.stringify(prompts))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (confirm('确定恢复默认提示词吗？')) {
      setPrompts(defaultPrompts)
    }
  }

  const handlePromptChange = (key: string, value: string) => {
    setPrompts({ ...prompts, [key]: { ...prompts[key as keyof typeof prompts], prompt: value } })
  }

  const tabs = [
    { key: 'masterAgent', label: '主智能体' },
    { key: 'enterpriseAnalysis', label: '企业分析' },
    { key: 'propertyValuation', label: '资产评估' },
    { key: 'smartMatch', label: '智能匹配' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI提示词配置</h1>
          <p className="text-gray-500 mt-1">配置智能体提示词，优化匹配效果</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            恢复默认
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] transition-colors flex items-center"
          >
            {saved ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                已保存
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                保存配置
              </>
            )}
          </button>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium">提示词配置说明</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>提示词用于指导AI智能体进行企业分析和资产匹配</li>
              <li>修改提示词后，AI的分析逻辑和匹配规则会相应改变</li>
              <li>建议根据实际业务需求逐步调整优化</li>
              <li>点击"保存配置"后，新配置立即生效</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tab导航 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex space-x-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-[#1e3a5f] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 提示词编辑区 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {prompts[activeTab as keyof typeof prompts]?.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {prompts[activeTab as keyof typeof prompts]?.description}
          </p>
        </div>
        <div className="p-6">
          <textarea
            value={prompts[activeTab as keyof typeof prompts]?.prompt || ''}
            onChange={(e) => handlePromptChange(activeTab, e.target.value)}
            className="w-full h-96 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent font-mono text-sm"
            placeholder="请输入提示词..."
          />
          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <span>字符数：{prompts[activeTab as keyof typeof prompts]?.prompt?.length || 0}</span>
            <span>支持Markdown格式</span>
          </div>
        </div>
      </div>

      {/* 变量说明 */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-medium text-gray-900 mb-3">可用变量</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { var: '{companyName}', desc: '企业名称' },
            { var: '{budget}', desc: '预算范围' },
            { var: '{propertyType}', desc: '资产类型' },
            { var: '{preferredArea}', desc: '偏好区域' },
            { var: '{creditScore}', desc: '信用评分' },
            { var: '{debtRatio}', desc: '负债率' },
            { var: '{propertyPrice}', desc: '资产价格' },
            { var: '{marketPrice}', desc: '市场评估价' },
          ].map(item => (
            <div key={item.var} className="bg-white rounded-lg p-3 border border-gray-200">
              <code className="text-sm text-blue-600 font-mono">{item.var}</code>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
