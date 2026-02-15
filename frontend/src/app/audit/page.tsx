'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Mock steps
const steps = [
  { id: 1, name: '企业信息', icon: '🏢' },
  { id: 2, name: '上传资料', icon: '📤' },
  { id: 3, name: 'AI审核', icon: '🤖' },
  { id: 4, name: '报告生成', icon: '📊' },
]

// Mock OCR result
const mockOCRResult = {
  companyName: '深圳市智策云科技有限公司',
  taxNumber: '91440300MA5FXXXXX',
  annualTax: 1250000,
  revenue: 85000000,
  profit: 12500000,
}

// Mock audit result
const mockAuditResult = {
  score: 85,
  level: 'A级',
  loanLimit: 5000000,
  riskLevel: '低风险',
  creditProfile: {
    taxCompliance: 95,
    financialHealth: 80,
    businessStability: 85,
    industryProspects: 90,
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
  })
  const [files, setFiles] = useState({
    taxProof: null as File | null,
    financialReport: null as File | null,
  })
  const [auditResult, setAuditResult] = useState<typeof mockAuditResult | null>(null)
  const router = useRouter()

  const handleFileUpload = async (type: 'taxProof' | 'financialReport', file: File) => {
    setUploading(true)
    
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setFiles(prev => ({ ...prev, [type]: file }))
    setUploading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    // Simulate AI audit
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setAuditResult(mockAuditResult)
    setLoading(false)
    setCurrentStep(4)
  }

  const handleNext = () => {
    // 验证必填字段
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
      // 简单验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(formData.legalPersonPhone.trim())) {
        alert('请输入正确的手机号格式')
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
      {/* Navigation */}
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
                    currentStep >= step.id 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.id ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className={`mt-2 text-sm ${currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'}`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="card">
          {/* Step 1: Company Info */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">企业基本信息</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    企业名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="input-field"
                    placeholder="请输入企业名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    统一社会信用代码 *
                  </label>
                  <input
                    type="text"
                    value={formData.taxNumber}
                    onChange={(e) => setFormData({...formData, taxNumber: e.target.value})}
                    className="input-field"
                    placeholder="请输入统一社会信用代码"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    法定代表人 *
                  </label>
                  <input
                    type="text"
                    value={formData.legalPerson}
                    onChange={(e) => setFormData({...formData, legalPerson: e.target.value})}
                    className="input-field"
                    placeholder="请输入法定代表人"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    法人手机号 *
                  </label>
                  <input
                    type="tel"
                    value={formData.legalPersonPhone}
                    onChange={(e) => setFormData({...formData, legalPersonPhone: e.target.value})}
                    className="input-field"
                    placeholder="请输入法人手机号"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    注册资本（万元）
                  </label>
                  <input
                    type="number"
                    value={formData.registeredCapital}
                    onChange={(e) => setFormData({...formData, registeredCapital: e.target.value})}
                    className="input-field"
                    placeholder="请输入注册资本"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    成立日期
                  </label>
                  <input
                    type="date"
                    value={formData.establishedDate}
                    onChange={(e) => setFormData({...formData, establishedDate: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    注册地址
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="input-field"
                    placeholder="请输入注册地址"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Upload Files */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">上传资质材料</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tax Proof */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="font-medium text-gray-900 mb-2">纳税证明</h3>
                  <p className="text-sm text-gray-500 mb-4">支持 JPG、PNG、PDF 格式</p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('taxProof', e.target.files[0])}
                    className="hidden"
                    id="tax-proof"
                    disabled={uploading}
                  />
                  <label htmlFor="tax-proof" className="btn-secondary inline-block cursor-pointer">
                    {uploading ? '上传中...' : '选择文件'}
                  </label>
                  {files.taxProof && (
                    <p className="mt-4 text-sm text-green-600 flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {files.taxProof.name}
                    </p>
                  )}
                </div>

                {/* Financial Report */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="font-medium text-gray-900 mb-2">财务报表摘要</h3>
                  <p className="text-sm text-gray-500 mb-4">支持 JPG、PNG、PDF 格式</p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('financialReport', e.target.files[0])}
                    className="hidden"
                    id="financial-report"
                    disabled={uploading}
                  />
                  <label htmlFor="financial-report" className="btn-secondary inline-block cursor-pointer">
                    {uploading ? '上传中...' : '选择文件'}
                  </label>
                  {files.financialReport && (
                    <p className="mt-4 text-sm text-green-600 flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {files.financialReport.name}
                    </p>
                  )}
                </div>
              </div>

              {/* OCR Preview */}
              {files.taxProof && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">OCR 识别结果（模拟）</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">企业名称</p>
                      <p className="font-medium">{mockOCRResult.companyName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">税号</p>
                      <p className="font-medium">{mockOCRResult.taxNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">年纳税额</p>
                      <p className="font-medium">¥{(mockOCRResult.annualTax / 10000).toFixed(0)}万</p>
                    </div>
                    <div>
                      <p className="text-gray-500">营业收入</p>
                      <p className="font-medium">¥{(mockOCRResult.revenue / 10000).toFixed(0)}万</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: AI Review */}
          {currentStep === 3 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">AI 资质审核中</h2>
              <p className="text-gray-600 mb-4">正在进行税务API交叉核验...</p>
              <p className="text-sm text-gray-500">预计剩余时间：约 2 分钟</p>
              
              <div className="mt-8 max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">企业信息验证</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">纳税记录查询</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                    </div>
                    <span className="text-gray-600">财务健康分析</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    </div>
                    <span className="text-gray-400">风险评估计算</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    </div>
                    <span className="text-gray-400">生成审核报告</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {currentStep === 4 && auditResult && (
            <div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">资质预审通过</h2>
                <p className="text-gray-600">您的企业已通过智能资质审核</p>
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
                <div className="text-center p-6 bg-accent-gold/10 rounded-xl">
                  <div className="text-5xl font-bold text-gray-900 mb-2">¥{(auditResult.loanLimit / 10000).toFixed(0)}万</div>
                  <div className="text-sm text-gray-600">可贷额度</div>
                </div>
              </div>

              {/* Credit Profile */}
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
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${value}%`}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Level */}
              <div className="p-4 bg-green-50 rounded-lg mb-8">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-medium text-green-700">风险评级：{auditResult.riskLevel}</span>
                </div>
                <p className="text-sm text-green-600 mt-2">
                  您的企业信用状况良好，符合银行优质客户标准。建议可申请最高 500 万元的信用贷款。
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1 || loading}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一步
            </button>
            
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="btn-primary"
              >
                下一步
              </button>
            ) : currentStep === 3 ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '审核中...' : '开始审核'}
              </button>
            ) : (
              <Link href="/matching" className="btn-accent inline-block text-center">
                前往资产匹配
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
