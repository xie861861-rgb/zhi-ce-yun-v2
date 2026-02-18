'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock steps
const steps = [
  { id: 1, name: '企业信息', icon: '🏢' },
  { id: 2, name: '上传资料', icon: '📤' },
  { id: 3, name: 'AI审核', icon: '🤖' },
  { id: 4, name: '报告生成', icon: '📊' },
]

// Mock audit result - 更详细的AI分析
const mockAuditResult = {
  score: 85,
  level: 'A级',
  loanLimit: 5000000,
  riskLevel: '低风险',
  // 基础分析
  creditProfile: {
    taxCompliance: 95,
    financialHealth: 80,
    businessStability: 85,
    industryProspects: 90,
  },
  // 水母报告分析
  jimuReport: {
    score: 88,
    analysis: '企业经营状况良好，营收稳定增长',
    risks: ['行业竞争加剧', '应收账款周转略慢'],
    suggestions: ['建议优化现金流管理', '可考虑扩大融资规模'],
  },
  // 企业征信分析
  enterpriseCredit: {
    score: 82,
    debtRatio: 45,
    creditInquiries: 12,
    overdueRecords: 0,
    analysis: '企业信用记录良好，无逾期记录',
  },
  // 个人征信分析
  personalCredit: {
    score: 90,
    creditAge: 36,
    creditLimit: 500000,
    overdueRecords: 0,
    analysis: '个人信用优秀，负债率低',
  },
}

export default function AuditPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    taxNumber: '',
    legalPerson: '',
    legalPersonPhone: '',
    registeredCapital: '',
    establishedDate: '',
    address: '',
    // 水母报告URL
    jimuReportUrl: '',
  })
  const [files, setFiles] = useState({
    // 企业征信
    enterpriseCredit: null as File | null,
    // 个人征信
    personalCredit: null as File | null,
  })
  const [auditResult, setAuditResult] = useState<typeof mockAuditResult | null>(null)

  // 处理文件上传
  const handleFileUpload = async (type: 'enterpriseCredit' | 'personalCredit', file: File) => {
    setUploading(true)
    // 模拟文件上传
    await new Promise(resolve => setTimeout(resolve, 1500))
    setFiles(prev => ({ ...prev, [type]: file }))
    setUploading(false)
  }

  // 提交审核
  const handleSubmit = async () => {
    setLoading(true)
    // 模拟AI审核（包含三件套分析）
    await new Promise(resolve => setTimeout(resolve, 3000))
    setAuditResult(mockAuditResult)
    setLoading(false)
    setCurrentStep(4)
  }

  // 下一步
  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.companyName.trim()) {
        alert('请输入企业名称')
        return
      }
      if (!formData.taxNumber.trim()) {
        alert('请输入税号')
        return
      }
      if (!formData.legalPerson.trim()) {
        alert('请输入法定代表人')
        return
      }
      if (!formData.legalPersonPhone.trim()) {
        alert('请输入法人手机号')
        return
      }
      if (!/^1[3-9]\d{9}$/.test(formData.legalPersonPhone.trim())) {
        alert('请输入正确的手机号格式')
        return
      }
    }
    
    // 验证第二步：上传资料
    if (currentStep === 2) {
      if (!formData.jimuReportUrl.trim()) {
        alert('请输入水母报告链接')
        return
      }
      if (!files.enterpriseCredit) {
        alert('请上传企业征信报告')
        return
      }
      if (!files.personalCredit) {
        alert('请上传个人征信报告')
        return
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">智策云V2</Link>
              <span className="ml-4 text-gray-600">资质预审</span>
            </div>
            <div className="flex items-center">
              <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 mr-4">
                返回工作台
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'w-24' : ''}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    currentStep >= step.id ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.id ? '✓' : step.icon}
                  </div>
                  <span className={`mt-2 text-sm ${currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'}`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          {/* Step 1: Company Info */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">企业基本信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">企业名称 *</label>
                  <input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} className="input-field" placeholder="请输入企业名称" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">统一社会信用代码 *</label>
                  <input type="text" value={formData.taxNumber} onChange={(e) => setFormData({...formData, taxNumber: e.target.value})} className="input-field" placeholder="请输入统一社会信用代码" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">法定代表人 *</label>
                  <input type="text" value={formData.legalPerson} onChange={(e) => setFormData({...formData, legalPerson: e.target.value})} className="input-field" placeholder="请输入法定代表人" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">法人手机号 *</label>
                  <input type="tel" value={formData.legalPersonPhone} onChange={(e) => setFormData({...formData, legalPersonPhone: e.target.value})} className="input-field" placeholder="请输入法人手机号" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">注册资本（万元）</label>
                  <input type="number" value={formData.registeredCapital} onChange={(e) => setFormData({...formData, registeredCapital: e.target.value})} className="input-field" placeholder="请输入注册资本" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">成立日期</label>
                  <input type="date" value={formData.establishedDate} onChange={(e) => setFormData({...formData, establishedDate: e.target.value})} className="input-field" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">注册地址</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="input-field" placeholder="请输入注册地址" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Upload Files - 三件套 */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">上传资质材料</h2>
              <p className="text-gray-500 mb-6">请上传以下三件套材料，用于AI综合分析</p>
              
              {/* 三件套说明 */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">📋 三件套说明</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">🔗</span>
                    <div><p className="font-medium">水母报告</p><p className="text-blue-700">从第三方复制链接</p></div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">🏢</span>
                    <div><p className="font-medium">企业征信</p><p className="text-blue-700">企业信用报告文件</p></div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">👤</span>
                    <div><p className="font-medium">个人征信</p><p className="text-blue-700">法人个人信用报告</p></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. 水母报告 - URL链接 */}
                <div className="md:col-span-2 border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50/50">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🔗</span>
                    <div>
                      <h3 className="font-medium text-gray-900">水母报告链接 *</h3>
                      <p className="text-sm text-gray-500">请从水母报告官网复制完整链接</p>
                    </div>
                  </div>
                  <input
                    type="url"
                    value={formData.jimuReportUrl}
                    onChange={(e) => setFormData({...formData, jimuReportUrl: e.target.value})}
                    className="input-field w-full"
                    placeholder="https://www.jimu.com/report/xxxxx"
                  />
                  <p className="mt-2 text-xs text-gray-500">💡 提示：登录水母报告官网，点击"分享报告"，复制链接地址</p>
                </div>

                {/* 2. 企业征信 */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="font-medium text-gray-900 mb-2">企业征信报告 *</h3>
                  <p className="text-sm text-gray-500 mb-4">支持 JPG、PNG、PDF 格式</p>
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => e.target.files?.[0] && handleFileUpload('enterpriseCredit', e.target.files[0])} className="hidden" id="enterprise-credit" disabled={uploading} />
                  <label htmlFor="enterprise-credit" className="btn-secondary inline-block cursor-pointer">{uploading ? '上传中...' : '选择文件'}</label>
                  {files.enterpriseCredit && <p className="mt-4 text-sm text-green-600">✓ {files.enterpriseCredit.name}</p>}
                </div>

                {/* 3. 个人征信 */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="font-medium text-gray-900 mb-2">个人征信报告 *</h3>
                  <p className="text-sm text-gray-500 mb-4">支持 JPG、PNG、PDF 格式</p>
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => e.target.files?.[0] && handleFileUpload('personalCredit', e.target.files[0])} className="hidden" id="personal-credit" disabled={uploading} />
                  <label htmlFor="personal-credit" className="btn-secondary inline-block cursor-pointer">{uploading ? '上传中...' : '选择文件'}</label>
                  {files.personalCredit && <p className="mt-4 text-sm text-green-600">✓ {files.personalCredit.name}</p>}
                </div>
              </div>

              {/* 材料状态 */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">📝 材料提交状态</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">🔗 水母报告链接</span>
                    <span className={formData.jimuReportUrl ? 'text-green-600' : 'text-red-500'}>{formData.jimuReportUrl ? '✓ 已提交' : '✗ 未提交'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">🏢 企业征信报告</span>
                    <span className={files.enterpriseCredit ? 'text-green-600' : 'text-red-500'}>{files.enterpriseCredit ? '✓ 已上传' : '✗ 未上传'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">👤 个人征信报告</span>
                    <span className={files.personalCredit ? 'text-green-600' : 'text-red-500'}>{files.personalCredit ? '✓ 已上传' : '✗ 未上传'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: AI Review */}
          {currentStep === 3 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">AI 资质审核中</h2>
              <p className="text-gray-600 mb-4">正在分析三件套材料...</p>
              <p className="text-sm text-gray-500">预计剩余时间：约 2 分钟</p>
              
              <div className="mt-8 max-w-md mx-auto space-y-4">
                <div className="flex items-center"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">✓</div><span className="text-gray-600">企业信息验证</span></div>
                <div className="flex items-center"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">✓</div><span className="text-gray-600">水母报告分析</span></div>
                <div className="flex items-center"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">✓</div><span className="text-gray-600">企业征信分析</span></div>
                <div className="flex items-center"><div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div></div><span className="text-gray-600">个人征信分析</span></div>
                <div className="flex items-center"><div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3"></div><span className="text-gray-400">综合风险评估</span></div>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {currentStep === 4 && auditResult && (
            <div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">资质预审通过</h2>
                <p className="text-gray-600">基于三件套材料的AI综合分析</p>
              </div>

              {/* Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-primary-50 rounded-xl">
                  <div className="text-5xl font-bold text-primary-600 mb-2">{auditResult.score}</div>
                  <div className="text-sm text-gray-600">综合评分</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <div className="text-5xl font-bold text-green-600 mb-2">{auditResult.level}</div>
                  <div className="text-sm text-gray-600">信用等级</div>
                </div>
                <div className="text-center p-6 bg-yellow-50 rounded-xl">
                  <div className="text-5xl font-bold text-yellow-600 mb-2">¥{(auditResult.loanLimit / 10000).toFixed(0)}万</div>
                  <div className="text-sm text-gray-600">可贷额度</div>
                </div>
              </div>

              {/* 三件套分析结果 */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 AI分析详情</h3>
                
                {/* 水母报告 */}
                <div className="mb-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-900">🔗 水母报告分析</h4>
                    <span className="px-2 py-1 bg-blue-200 text-blue-800 text-sm rounded">评分: {auditResult.jimuReport.score}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{auditResult.jimuReport.analysis}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-gray-500">风险提示:</p><ul className="text-orange-600">{auditResult.jimuReport.risks.map((risk, i) => <li key={i}>• {risk}</li>)}</ul></div>
                    <div><p className="text-gray-500">建议:</p><ul className="text-green-600">{auditResult.jimuReport.suggestions.map((s, i) => <li key={i}>• {s}</li>)}</ul></div>
                  </div>
                </div>

                {/* 企业征信 */}
                <div className="mb-4 p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-900">🏢 企业征信分析</h4>
                    <span className="px-2 py-1 bg-green-200 text-green-800 text-sm rounded">评分: {auditResult.enterpriseCredit.score}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                    <div><p className="text-gray-500">负债率</p><p className="font-medium">{auditResult.enterpriseCredit.debtRatio}%</p></div>
                    <div><p className="text-gray-500">征信查询</p><p className="font-medium">{auditResult.enterpriseCredit.creditInquiries}次</p></div>
                    <div><p className="text-gray-500">逾期记录</p><p className="font-medium text-green-600">{auditResult.enterpriseCredit.overdueRecords}次</p></div>
                  </div>
                  <p className="text-sm text-gray-700">{auditResult.enterpriseCredit.analysis}</p>
                </div>

                {/* 个人征信 */}
                <div className="mb-4 p-4 border border-purple-200 rounded-lg bg-purple-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-purple-900">👤 个人征信分析</h4>
                    <span className="px-2 py-1 bg-purple-200 text-purple-800 text-sm rounded">评分: {auditResult.personalCredit.score}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                    <div><p className="text-gray-500">信用年限</p><p className="font-medium">{auditResult.personalCredit.creditAge}月</p></div>
                    <div><p className="text-gray-500">信贷总额</p><p className="font-medium">¥{(auditResult.personalCredit.creditLimit / 10000).toFixed(0)}万</p></div>
                    <div><p className="text-gray-500">逾期记录</p><p className="font-medium text-green-600">{auditResult.personalCredit.overdueRecords}次</p></div>
                  </div>
                  <p className="text-sm text-gray-700">{auditResult.personalCredit.analysis}</p>
                </div>
              </div>

              {/* 企业信用画像 */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">企业信用画像</h3>
                <div className="space-y-4">
                  {Object.entries(auditResult.creditProfile).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">
                          {key === 'taxCompliance' && '纳税合规度'}
                          {key === 'financialHealth' && '财务健康度'}
                          {key === 'businessStability' && '经营稳定性'}
                          {key === 'industryProspects' && '行业发展前景'}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{value}分</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-primary-600 h-2 rounded-full" style={{width: `${value}%`}}></div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button onClick={handlePrev} disabled={currentStep === 1 || loading} className="btn-secondary disabled:opacity-50">上一步</button>
            {currentStep < 3 ? <button onClick={handleNext} className="btn-primary">下一步</button> : currentStep === 3 ? <button onClick={handleSubmit} disabled={loading} className="btn-primary disabled:opacity-50">{loading ? '审核中...' : '开始审核'}</button> : <Link href="/matching" className="btn-accent">前往资产匹配</Link>}
          </div>
        </div>
      </div>
    </div>
  )
}
