'use client'

import { useState } from 'react'

// 模拟配置数据
const defaultConfig = {
  llm: {
    apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx',
    model: 'gpt-4',
    endpoint: 'https://api.openai.com/v1',
  },
  tax: {
    apiKey: 'tax_xxxxxxxxxxxxxxxxxx',
    endpoint: 'https://api.tax.gov.cn/v2',
  },
  banks: [
    { id: 1, name: '工商银行', rate: '3.65%', status: 'active' },
    { id: 2, name: '建设银行', rate: '3.70%', status: 'active' },
    { id: 3, name: '农业银行', rate: '3.75%', status: 'active' },
    { id: 4, name: '中国银行', rate: '3.68%', status: 'inactive' },
    { id: 5, name: '招商银行', rate: '3.72%', status: 'active' },
  ],
  // 数据源配置
  dataSources: {
    aliAuction: { enabled: false, apiKey: '', apiSecret: '' },
    jdAuction: { enabled: false, apiKey: '', apiSecret: '' },
    fangGugu: { enabled: false, apiKey: '' },
    huiFaWang: { enabled: false, apiKey: '' },
    tushare: { enabled: false, token: '' },
  },
}

const modelOptions = [
  // 🥇 OpenAI
  { value: 'gpt-4', label: 'GPT-4', provider: 'OpenAI' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', provider: 'OpenAI' },
  { value: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', provider: 'OpenAI' },
  
  // 🥇 Anthropic Claude
  { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus', provider: 'Anthropic' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet', provider: 'Anthropic' },
  
  // 🇨🇳 百度
  { value: 'ernie-4-8k', label: '文心一言 4.0 (8K)', provider: '百度' },
  { value: 'ernie-4-32k', label: '文心一言 4.0 (32K)', provider: '百度' },
  { value: 'ernie-3-5-8k', label: '文心一言 3.5', provider: '百度' },
  
  // 🇨🇳 阿里
  { value: 'qwen-long', label: '通义千问 Long', provider: '阿里云' },
  { value: 'qwen-turbo', label: '通义千问 Turbo', provider: '阿里云' },
  { value: 'qwen-plus', label: '通义千问 Plus', provider: '阿里云' },
  { value: 'qwen-max', label: '通义千问 Max', provider: '阿里云' },
  
  // 🇨🇳 月之暗面 (Kimi)
  { value: 'moonshot-v1-8k', label: 'Kimi Turbo (8K)', provider: '月之暗面' },
  { value: 'moonshot-v1-32k', label: 'Kimi Pro (32K)', provider: '月之暗面' },
  { value: 'moonshot-v1-128k', label: 'Kimi Max (128K)', provider: '月之暗面' },
  
  // 🇨🇳 智谱AI
  { value: 'glm-4', label: 'GLM-4', provider: '智谱AI' },
  { value: 'glm-4-flash', label: 'GLM-4 Flash', provider: '智谱AI' },
  { value: 'glm-4-plus', label: 'GLM-4 Plus', provider: '智谱AI' },
  { value: 'glm-4-long', label: 'GLM-4 Long', provider: '智谱AI' },
  { value: 'glm-4-flashx', label: 'GLM-4 FlashX', provider: '智谱AI' },
  
  // 🇨🇳 字节跳动 (豆包)
  { value: 'doubao-pro-32k', label: '豆包 Pro (32K)', provider: '字节跳动' },
  { value: 'doubao-lite-32k', label: '豆包 Lite (32K)', provider: '字节跳动' },
  { value: 'doubao-pro-128k', label: '豆包 Pro (128K)', provider: '字节跳动' },
  
  // 🇨🇳 DeepSeek
  { value: 'deepseek-chat', label: 'DeepSeek Chat', provider: 'DeepSeek' },
  { value: 'deepseek-coder', label: 'DeepSeek Coder', provider: 'DeepSeek' },
  
  // 🇨🇳 腾讯
  { value: 'hunyuan', label: '腾讯混元', provider: '腾讯' },
  
  // 🇨🇳 讯飞
  { value: 'spark-v3.5', label: '星火大模型 V3.5', provider: '讯飞' },
  { value: 'spark-v4.0', label: '星火大模型 V4.0', provider: '讯飞' },
  
  // 🇨🇳 MiniMax
  { value: 'abab6.5s-chat', label: 'MiniMax abab6.5s', provider: 'MiniMax' },
  { value: 'abab6.5-chat', label: 'MiniMax abab6.5', provider: 'MiniMax' },
]

// 模型分组
const modelGroups = {
  'OpenAI': modelOptions.filter(m => m.provider === 'OpenAI'),
  'Anthropic': modelOptions.filter(m => m.provider === 'Anthropic'),
  '百度': modelOptions.filter(m => m.provider === '百度'),
  '阿里云': modelOptions.filter(m => m.provider === '阿里云'),
  '月之暗面': modelOptions.filter(m => m.provider === '月之暗面'),
  '智谱AI': modelOptions.filter(m => m.provider === '智谱AI'),
  '字节跳动': modelOptions.filter(m => m.provider === '字节跳动'),
  'DeepSeek': modelOptions.filter(m => m.provider === 'DeepSeek'),
  '腾讯': modelOptions.filter(m => m.provider === '腾讯'),
  '讯飞': modelOptions.filter(m => m.provider === '讯飞'),
  'MiniMax': modelOptions.filter(m => m.provider === 'MiniMax'),
}

export default function SettingsPage() {
  const [config, setConfig] = useState(defaultConfig)
  const [saved, setSaved] = useState(false)
  const [editingBank, setEditingBank] = useState<typeof config.banks[0] | null>(null)
  const [editingDs, setEditingDs] = useState<string | null>(null)

  const handleSave = () => {
    // 模拟保存
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleUpdateBankRate = () => {
    if (editingBank) {
      setConfig({
        ...config,
        banks: config.banks.map(b =>
          b.id === editingBank.id ? { ...b, rate: editingBank.rate } : b
        ),
      })
      setEditingBank(null)
      alert('银行利率已更新（模拟）')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API配置</h1>
          <p className="text-gray-500 mt-1">配置第三方服务接口</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          保存配置
        </button>
      </div>

      {/* 保存成功提示 */}
      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-700">配置已保存成功</span>
          </div>
        </div>
      )}

      {/* 大模型API配置 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">大模型API</h2>
              <p className="text-sm text-gray-500">配置AI生成报告所需的API</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <input
              type="password"
              value={config.llm.apiKey}
              onChange={(e) => setConfig({ ...config, llm: { ...config.llm, apiKey: e.target.value } })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent font-mono"
              placeholder="请输入API Key"
            />
            <p className="text-xs text-gray-400 mt-1">请妥善保管API Key，不要泄露给他人</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">模型选择</label>
              <select
                value={config.llm.model}
                onChange={(e) => {
                  const model = modelOptions.find(m => m.value === e.target.value)
                  // 自动设置对应的API端点
                  const endpointMap: Record<string, string> = {
                    // OpenAI
                    'gpt-4': 'https://api.openai.com/v1',
                    'gpt-4-turbo': 'https://api.openai.com/v1',
                    'gpt-4o': 'https://api.openai.com/v1',
                    'gpt-3.5-turbo': 'https://api.openai.com/v1',
                    // Anthropic
                    'claude-3-5-sonnet': 'https://api.anthropic.com',
                    'claude-3-opus': 'https://api.anthropic.com',
                    'claude-3-sonnet': 'https://api.anthropic.com',
                    // 百度
                    'ernie-4-8k': 'https://qianfan.utf8api.com/v2',
                    'ernie-4-32k': 'https://qianfan.utf8api.com/v2',
                    'ernie-3.5-8k': 'https://qianfan.utf8api.com/v2',
                    // 阿里
                    'qwen-long': 'https://dashscope.aliyuncs.com/compatible-mode/v1',
                    'qwen-turbo': 'https://dashscope.aliyuncs.com/compatible-mode/v1',
                    'qwen-plus': 'https://dashscope.aliyuncs.com/compatible-mode/v1',
                    'qwen-max': 'https://dashscope.aliyuncs.com/compatible-mode/v1',
                    // Kimi
                    'moonshot-v1-8k': 'https://api.moonshot.cn/v1',
                    'moonshot-v1-32k': 'https://api.moonshot.cn/v1',
                    'moonshot-v1-128k': 'https://api.moonshot.cn/v1',
                    // 智谱
                    'glm-4': 'https://open.bigmodel.cn/api/paas/v4',
                    'glm-4-flash': 'https://open.bigmodel.cn/api/paas/v4',
                    'glm-4-plus': 'https://open.bigmodel.cn/api/paas/v4',
                    'glm-4-long': 'https://open.bigmodel.cn/api/paas/v4',
                    'glm-4-flashx': 'https://open.bigmodel.cn/api/paas/v4',
                    // 豆包
                    'doubao-pro-32k': 'https://ark.cn-beijing.volces.com/api/v3',
                    'doubao-lite-32k': 'https://ark.cn-beijing.volces.com/api/v3',
                    'doubao-pro-128k': 'https://ark.cn-beijing.volces.com/api/v3',
                    // DeepSeek
                    'deepseek-chat': 'https://api.deepseek.com/v1',
                    'deepseek-coder': 'https://api.deepseek.com/v1',
                    // 腾讯
                    'hunyuan': 'https://hunyuan.cloud.tencent.com',
                    // 讯飞
                    'spark-v3.5': 'https://spark-api.xf-yun.com/v3.5',
                    'spark-v4.0': 'https://spark-api.xf-yun.com/v4.0',
                    // MiniMax
                    'abab6.5s-chat': 'https://api.minimax.chat/v1',
                    'abab6.5-chat': 'https://api.minimax.chat/v1',
                  }
                  setConfig({ 
                    ...config, 
                    llm: { 
                      ...config.llm, 
                      model: e.target.value,
                      endpoint: endpointMap[e.target.value] || config.llm.endpoint
                    } 
                  })
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              >
                <optgroup label="🌐 OpenAI">
                  {modelGroups['OpenAI'].map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </optgroup>
                <optgroup label="🌐 Anthropic">
                  {modelGroups['Anthropic'].map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </optgroup>
                <optgroup label="🇨🇳 百度">
                  {modelGroups['百度'].map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </optgroup>
                <optgroup label="🇨🇳 阿里云">
                  {modelGroups['阿里云'].map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </optgroup>
                <optgroup label="🇨🇳 月之暗面 (Kimi)">
                  {modelGroups['月之暗面'].map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </optgroup>
                <optgroup label="🇨🇳 智谱AI">
                  {modelGroups['智谱AI'].map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </optgroup>
                <optgroup label="🇨🇳 字节跳动 (豆包)">
                  {modelGroups['字节跳动'].map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </optgroup>
                <optgroup label="🇨🇳 DeepSeek">
                  {modelGroups['DeepSeek'].map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </optgroup>
                <optgroup label="🇨🇳 腾讯">
                  {modelGroups['腾讯'].map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </optgroup>
                <optgroup label="🇨🇳 讯飞">
                  {modelGroups['讯飞'].map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </optgroup>
                <optgroup label="🇨🇳 MiniMax">
                  {modelGroups['MiniMax'].map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API端点</label>
              <input
                type="text"
                value={config.llm.endpoint}
                onChange={(e) => setConfig({ ...config, llm: { ...config.llm, endpoint: e.target.value } })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                placeholder="https://api.example.com/v1"
              />
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-blue-700">模型选择指南</p>
                <div className="mt-2 space-y-1 text-blue-600">
                  <p>🌐 <strong>OpenAI:</strong> platform.openai.com</p>
                  <p>🌐 <strong>Anthropic:</strong> console.anthropic.com</p>
                  <p>🇨🇳 <strong>百度:</strong> qianfan.utf8.com (文心一言)</p>
                  <p>🇨🇳 <strong>阿里云:</strong> dashscope.aliyuncs.com (通义千问)</p>
                  <p>🇨🇳 <strong>Kimi:</strong> platform.moonshot.cn</p>
                  <p>🇨🇳 <strong>智谱AI:</strong> open.bigmodel.cn (GLM)</p>
                  <p>🇨🇳 <strong>豆包:</strong> console.volcengine.com</p>
                  <p>🇨🇳 <strong>DeepSeek:</strong> platform.deepseek.com</p>
                  <p>🇨🇳 <strong>腾讯:</strong> console.cloud.tencent.com (混元)</p>
                  <p>🇨🇳 <strong>讯飞:</strong> console.xfyun.cn (星火)</p>
                  <p>🇨🇳 <strong>MiniMax:</strong> api.minimax.chat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 税务API配置 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">税务API</h2>
              <p className="text-sm text-gray-500">配置企业税务信息查询接口</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API密钥</label>
            <input
              type="password"
              value={config.tax.apiKey}
              onChange={(e) => setConfig({ ...config, tax: { ...config.tax, apiKey: e.target.value } })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent font-mono"
              placeholder="请输入税务API密钥"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">接口地址</label>
            <input
              type="text"
              value={config.tax.endpoint}
              onChange={(e) => setConfig({ ...config, tax: { ...config.tax, endpoint: e.target.value } })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              placeholder="https://api.tax.gov.cn/v2"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3" />
              <span className="text-sm text-gray-700">API服务状态：正常运行</span>
            </div>
            <span className="text-sm text-gray-500">最后检查：2026-02-12 16:00</span>
          </div>
        </div>
      </div>

      {/* 银行接口配置 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">银行接口配置</h2>
              <p className="text-sm text-gray-500">管理合作银行及贷款利率配置</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 rounded-lg">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">银行名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">贷款利率</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {config.banks.map((bank) => (
                <tr key={bank.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-600">
                          {bank.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{bank.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-lg font-bold text-[#1e3a5f]">{bank.rate}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      bank.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {bank.status === 'active' ? '已启用' : '已禁用'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setEditingBank(bank)}
                      className="text-[#1e3a5f] hover:underline text-sm"
                    >
                      编辑利率
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 编辑利率模态框 */}
      {editingBank && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">编辑利率</h2>
              <button
                onClick={() => setEditingBank(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">银行名称</p>
                <p className="font-medium text-gray-900">{editingBank.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">贷款利率</label>
                <input
                  type="text"
                  value={editingBank.rate}
                  onChange={(e) => setEditingBank({ ...editingBank, rate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  placeholder="请输入贷款利率，如：3.65%"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setEditingBank(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleUpdateBankRate}
                className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 数据源API配置 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">数据源API配置</h2>
              <p className="text-sm text-gray-500">管理法拍数据、估值、司法数据等外部API</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* 阿里拍卖 */}
          <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-orange-600 font-bold">阿里</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">阿里拍卖</h3>
                <p className="text-sm text-gray-500">法拍房源数据、成交记录</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${config.dataSources.aliAuction.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                {config.dataSources.aliAuction.enabled ? '已启用' : '未配置'}
              </span>
              <button
                onClick={() => setEditingDs(editingDs === 'aliAuction' ? null : 'aliAuction')}
                className="text-[#1e3a5f] hover:underline text-sm"
              >
                {config.dataSources.aliAuction.enabled ? '编辑' : '配置'}
              </button>
            </div>
          </div>

          {/* 京东法拍 */}
          <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold">京东</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">京东法拍</h3>
                <p className="text-sm text-gray-500">法拍房源、竞价数据</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${config.dataSources.jdAuction.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                {config.dataSources.jdAuction.enabled ? '已启用' : '未配置'}
              </span>
              <button
                onClick={() => setEditingDs(editingDs === 'jdAuction' ? null : 'jdAuction')}
                className="text-[#1e3a5f] hover:underline text-sm"
              >
                {config.dataSources.jdAuction.enabled ? '编辑' : '配置'}
              </button>
            </div>
          </div>

          {/* 房估估 */}
          <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">房估估</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">房估估估值</h3>
                <p className="text-sm text-gray-500">房产估值、法拍定价建议</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${config.dataSources.fangGugu.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                {config.dataSources.fangGugu.enabled ? '已启用' : '未配置'}
              </span>
              <button
                onClick={() => setEditingDs(editingDs === 'fangGugu' ? null : 'fangGugu')}
                className="text-[#1e3a5f] hover:underline text-sm"
              >
                {config.dataSources.fangGugu.enabled ? '编辑' : '配置'}
              </button>
            </div>
          </div>

          {/* 汇法网 */}
          <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-yellow-600 font-bold">汇法网</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">汇法网司法数据</h3>
                <p className="text-sm text-gray-500">涉诉信息、失信被执行人、抵押查封</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${config.dataSources.huiFaWang.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                {config.dataSources.huiFaWang.enabled ? '已启用' : '未配置'}
              </span>
              <button
                onClick={() => setEditingDs(editingDs === 'huiFaWang' ? null : 'huiFaWang')}
                className="text-[#1e3a5f] hover:underline text-sm"
              >
                {config.dataSources.huiFaWang.enabled ? '编辑' : '配置'}
              </button>
            </div>
          </div>

          {/* Tushare */}
          <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold">Tushare</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Tushare 金融数据</h3>
                <p className="text-sm text-gray-500">利率数据、宏观金融指标</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${config.dataSources.tushare.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                {config.dataSources.tushare.enabled ? '已启用' : '未配置'}
              </span>
              <button
                onClick={() => setEditingDs(editingDs === 'tushare' ? null : 'tushare')}
                className="text-[#1e3a5f] hover:underline text-sm"
              >
                {config.dataSources.tushare.enabled ? '编辑' : '配置'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 数据源配置模态框 */}
      {editingDs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingDs === 'aliAuction' && '阿里拍卖 API 配置'}
                {editingDs === 'jdAuction' && '京东法拍 API 配置'}
                {editingDs === 'fangGugu' && '房估估 API 配置'}
                {editingDs === 'huiFaWang' && '汇法网 API 配置'}
                {editingDs === 'tushare' && 'Tushare API 配置'}
              </h2>
              <button
                onClick={() => setEditingDs(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.dataSources[editingDs as keyof typeof config.dataSources].enabled}
                    onChange={(e) => setConfig({
                      ...config,
                      dataSources: {
                        ...config.dataSources,
                        [editingDs]: { ...config.dataSources[editingDs as keyof typeof config.dataSources], enabled: e.target.checked }
                      }
                    })}
                    className="w-5 h-5 text-[#1e3a5f] rounded focus:ring-[#1e3a5f]"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">启用此数据源</span>
                </label>
              </div>
              
              {(editingDs === 'aliAuction' || editingDs === 'jdAuction') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">App Key</label>
                    <input
                      type="text"
                      value={config.dataSources[editingDs as keyof typeof config.dataSources].apiKey as string || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        dataSources: {
                          ...config.dataSources,
                          [editingDs]: { ...config.dataSources[editingDs as keyof typeof config.dataSources], apiKey: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      placeholder="请输入 App Key"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">App Secret</label>
                    <input
                      type="password"
                      value={config.dataSources[editingDs as keyof typeof config.dataSources].apiSecret as string || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        dataSources: {
                          ...config.dataSources,
                          [editingDs]: { ...config.dataSources[editingDs as keyof typeof config.dataSources], apiSecret: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      placeholder="请输入 App Secret"
                    />
                  </div>
                </>
              )}

              {(editingDs === 'fangGugu' || editingDs === 'huiFaWang') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                  <input
                    type="password"
                    value={config.dataSources[editingDs as keyof typeof config.dataSources].apiKey as string || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      dataSources: {
                        ...config.dataSources,
                        [editingDs]: { ...config.dataSources[editingDs as keyof typeof config.dataSources], apiKey: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    placeholder="请输入 API Key"
                  />
                </div>
              )}

              {editingDs === 'tushare' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Token</label>
                  <input
                    type="password"
                    value={config.dataSources.tushare.token || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      dataSources: {
                        ...config.dataSources,
                        tushare: { ...config.dataSources.tushare, token: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    placeholder="请输入 Tushare Token"
                  />
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 申请地址：<br/>
                  {editingDs === 'aliAuction' && '阿里云市场 → 特殊资产处置评估API'}<br/>
                  {editingDs === 'jdAuction' && '京东云市场 → 法拍数据API'}<br/>
                  {editingDs === 'fangGugu' && '房估估官网 fanggugu.com'}<br/>
                  {editingDs === 'huiFaWang' && '汇法网 huifawang.com'}<br/>
                  {editingDs === 'tushare' && 'Tushare Pro tushare.pro'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setEditingDs(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => { alert('保存成功（模拟）'); setEditingDs(null); }}
                className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
