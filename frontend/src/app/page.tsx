'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">智策云V2</span>
              <span className="ml-2 text-sm text-gray-500">智能融资决策平台</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">核心功能</a>
              <a href="#workflow" className="text-gray-600 hover:text-primary-600 transition-colors">操作流程</a>
              <a href="#contact" className="text-gray-600 hover:text-primary-600 transition-colors">联系我们</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-primary-600 transition-colors">登录</Link>
              <Link href="/register" className="btn-primary">免费注册</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            智能融资决策平台
            <span className="block text-primary-600 mt-2">智策云V2</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 animate-fade-in" style={{animationDelay: '0.1s'}}>
            基于AI技术的智能资质预审、资产匹配与融资决策分析。10分钟生成专业报告，
            让企业融资更高效、更精准。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              立即开始
            </Link>
            <a href="#features" className="btn-secondary text-lg px-8 py-4">
              了解更多
            </a>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-20">
            <div className="stat-card">
              <div className="stat-value text-primary-600">10分钟</div>
              <div className="stat-label">快速资质预审</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-primary-600">60%-70%</div>
              <div className="stat-label">银行抵押率</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-primary-600">Top 3</div>
              <div className="stat-label">高性价比推荐</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-primary-600">1小时</div>
              <div className="stat-label">生成专业报告</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            三大核心模块
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
            智策云V2为您提供从资质预审到资产匹配再到融资决策的全方位智能服务
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card group hover:border-primary-200">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
                <svg className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Audit</h3>
              <p className="text-gray-600 mb-6">极简资质预审，AI智能分析企业资质，10分钟内生成企业信用画像、可贷额度预估和风险评级报告。</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  企业注册/登录
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  OCR图文识别
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  税务API交叉核验
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="card group hover:border-primary-200">
              <div className="w-16 h-16 bg-accent-gold/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-gold transition-colors">
                <svg className="w-8 h-8 text-accent-gold group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Value Matching</h3>
              <p className="text-gray-600 mb-6">高融资空间匹配，智能筛选法拍资产，计算净融资空间，推荐Top 3高性价比标的。</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  阿里法拍、京东法拍数据
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  智能筛选地区、价格、折价率
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  净融资空间计算
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="card group hover:border-primary-200">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <svg className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Decision Report</h3>
              <p className="text-gray-600 mb-6">融资分析简报，全方位分析首付门槛、杠杆率、放款周期、月供压力和潜在风险。</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  首付门槛测算
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  杠杆率计算
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  潜在风险提示
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            简单四步，快速完成融资决策
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
            只需简单的四个步骤，智策云V2为您快速生成专业的融资分析报告
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: '企业注册', desc: '完成企业信息注册和实名认证', icon: '📝' },
              { step: '02', title: '上传资料', desc: '上传纳税证明和财务报表', icon: '📤' },
              { step: '03', title: 'AI预审', desc: 'AI自动进行资质预审和信用评估', icon: '🤖' },
              { step: '04', title: '获取报告', desc: '生成专业融资分析报告', icon: '📊' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  {item.icon}
                </div>
                <div className="text-primary-600 font-bold text-sm mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            立即开始您的智能融资之旅
          </h2>
          <p className="text-primary-100 text-lg mb-10">
            注册智策云V2，享受智能融资决策带来的高效与便捷
          </p>
          <Link href="/register" className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
            免费注册，开启智能融资
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-2xl font-bold text-white">智策云V2</span>
              <p className="mt-4">智能融资决策平台，让企业融资更高效</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">产品功能</h4>
              <ul className="space-y-2">
                <li>Smart Audit</li>
                <li>Value Matching</li>
                <li>Decision Report</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">技术支持</h4>
              <ul className="space-y-2">
                <li>帮助中心</li>
                <li>API文档</li>
                <li>联系我们</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">关于我们</h4>
              <ul className="space-y-2">
                <li>公司简介</li>
                <li>新闻动态</li>
                <li>加入我们</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>© 2026 智策云V2 版权所有</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
