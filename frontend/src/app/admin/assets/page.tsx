'use client'

import { useState } from 'react'

// 模拟客户数据
const mockCustomers = [
  { id: 1, name: '张先生', phone: '13800138000', preferredArea: '南山', preferredType: '住宅', budget: 8000000 },
  { id: 2, name: '李女士', phone: '13900139000', preferredArea: '福田', preferredType: '商业', budget: 15000000 },
  { id: 3, name: '王总', phone: '13700137000', preferredArea: '宝安', preferredType: '工业', budget: 20000000 },
  { id: 4, name: '刘总', phone: '13600136000', preferredArea: '罗湖', preferredType: '商业', budget: 5000000 },
  { id: 5, name: '陈先生', phone: '13500135000', preferredArea: '南山', preferredType: '住宅', budget: 10000000 },
]

// 模拟资产数据 - 增强版（带图片视频+优先匹配）
const mockAssets = [
  { 
    id: 1, 
    name: '阳光花园别墅', 
    type: '住宅', 
    location: '北京市朝阳区', 
    startPrice: 12000000, 
    evalPrice: 15000000, 
    status: 'active', 
    views: 256,
    buildingArea: 350,
    landArea: 500,
    yearBuilt: 2018,
    floor: '1-3/共3层',
    propertyRightsYears: 70,
    hasDispute: false,
    hasRent: true,
    rentAmount: 15000,
    mortgageStatus: '已注销',
    seizureStatus: '已解封',
    arrearsAmount: 0,
    surroundings: '小区内配套完善，有游泳池、健身房、儿童游乐区',
    commercialSurroundings: '周边有大型商超、银行、医院、学校',
    detailedAddress: '北京市朝阳区阳光路88号阳光花园小区8栋',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    ],
    videos: [],
    // 优先匹配
    isRecommended: true,
    recommendedTo: [1, 5], // 匹配给张先生、陈先生
    matchReason: '客户预算匹配，区域偏好一致',
  },
  { 
    id: 2, 
    name: 'CBD中心写字楼', 
    type: '商业', 
    location: '上海市浦东新区', 
    startPrice: 50000000, 
    evalPrice: 65000000, 
    status: 'active', 
    views: 512,
    buildingArea: 1200,
    landArea: 0,
    yearBuilt: 2015,
    floor: '15/共30层',
    propertyRightsYears: 50,
    hasDispute: true,
    disputeContent: '涉及合同纠纷',
    hasRent: true,
    rentAmount: 180000,
    mortgageStatus: '未注销',
    seizureStatus: '已解封',
    arrearsAmount: 50000,
    surroundings: '甲级写字楼，大堂气派，电梯快速',
    commercialSurroundings: '陆家嘴核心商圈，金融机构总部聚集',
    detailedAddress: '上海市浦东新区世纪大道100号CBD中心大厦',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    ],
    videos: ['https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'],
  },
  { 
    id: 3, 
    name: '工业园厂房', 
    type: '工业', 
    location: '深圳市南山区', 
    startPrice: 25000000, 
    evalPrice: 32000000, 
    status: 'inactive', 
    views: 128,
    buildingArea: 5000,
    landArea: 8000,
    yearBuilt: 2010,
    floor: '1-3/共3层',
    propertyRightsYears: 50,
    hasDispute: false,
    hasRent: false,
    mortgageStatus: '已注销',
    seizureStatus: '已解封',
    arrearsAmount: 0,
    surroundings: '园区内道路宽阔，货车通行便利',
    commercialSurroundings: '临近高速入口，物流便捷',
    detailedAddress: '深圳市南山区科技园北区高新中一道',
    images: [
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800',
    ],
    videos: [],
  },
  { 
    id: 4, 
    name: '海滨度假公寓', 
    type: '住宅', 
    location: '三亚市海棠区', 
    startPrice: 8000000, 
    evalPrice: 10000000, 
    status: 'active', 
    views: 384,
    buildingArea: 120,
    landArea: 0,
    yearBuilt: 2020,
    floor: '8/共25层',
    propertyRightsYears: 70,
    hasDispute: false,
    hasRent: true,
    rentAmount: 8000,
    mortgageStatus: '已注销',
    seizureStatus: '已解封',
    arrearsAmount: 0,
    surroundings: '海景房，视野开阔，通风采光好',
    commercialSurroundings: '亚特兰蒂斯、海昌梦幻海洋世界旁',
    detailedAddress: '三亚市海棠湾海岸大道168号',
  },
  { 
    id: 5, 
    name: '科技园研发大楼', 
    type: '商业', 
    location: '广州市天河区', 
    startPrice: 35000000, 
    evalPrice: 42000000, 
    status: 'active', 
    views: 256,
    buildingArea: 2800,
    landArea: 0,
    yearBuilt: 2016,
    floor: '10/共22层',
    propertyRightsYears: 50,
    hasDispute: false,
    hasRent: true,
    rentAmount: 120000,
    mortgageStatus: '已注销',
    seizureStatus: '已解封',
    arrearsAmount: 0,
    surroundings: '高新技术企业聚集，人才充足',
    commercialSurroundings: '天河软件园核心区，配套完善',
    detailedAddress: '广州市天河区软件路11号',
  },
  { 
    id: 6, 
    name: '物流仓储中心', 
    type: '工业', 
    location: '杭州市萧山区', 
    startPrice: 18000000, 
    evalPrice: 22000000, 
    status: 'pending', 
    views: 64,
    buildingArea: 6000,
    landArea: 10000,
    yearBuilt: 2012,
    floor: '1/共1层',
    propertyRightsYears: 50,
    hasDispute: true,
    disputeContent: '债务纠纷',
    hasRent: false,
    mortgageStatus: '未注销',
    seizureStatus: '查封中',
    arrearsAmount: 120000,
    surroundings: '厂房结构稳固，层高6米',
    commercialSurroundings: '靠近杭州萧山机场，物流便利',
    detailedAddress: '杭州市萧山区经开区望江路168号',
  },
]

const typeMap: Record<string, { label: string; class: string }> = {
  住宅: { label: '住宅', class: 'bg-blue-100 text-blue-700' },
  商业: { label: '商业', class: 'bg-purple-100 text-purple-700' },
  工业: { label: '工业', class: 'bg-orange-100 text-orange-700' },
}

const statusMap: Record<string, { label: string; class: string }> = {
  active: { label: '上架', class: 'bg-green-100 text-green-700' },
  inactive: { label: '下架', class: 'bg-gray-100 text-gray-700' },
  pending: { label: '待上架', class: 'bg-yellow-100 text-yellow-700' },
}

export default function AssetsPage() {
  const [assets, setAssets] = useState(mockAssets)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAsset, setEditingAsset] = useState<typeof mockAssets[0] | null>(null)

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || asset.type === typeFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'recommended' ? asset.isRecommended : asset.status === statusFilter)
    return matchesSearch && matchesType && matchesStatus
  })

  const handleDelete = (id: number) => {
    if (confirm('确定要删除该资产吗？')) {
      setAssets(assets.filter(a => a.id !== id))
    }
  }

  const handleToggleStatus = (id: number) => {
    setAssets(assets.map(a => {
      if (a.id === id) {
        return { ...a, status: a.status === 'active' ? 'inactive' : 'active' }
      }
      return a
    }))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">资产管理</h1>
          <p className="text-gray-500 mt-1">管理拍卖资产信息</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => alert('批量导入功能（模拟）')}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            批量导入
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            添加资产
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="搜索资产名称或地区..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
          >
            <option value="all">全部类型</option>
            <option value="住宅">住宅</option>
            <option value="商业">商业</option>
            <option value="工业">工业</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
          >
            <option value="all">全部状态</option>
            <option value="active">上架</option>
            <option value="inactive">下架</option>
            <option value="pending">待上架</option>
            <option value="recommended">推荐资产</option>
          </select>
        </div>
      </div>

      {/* 资产列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">资产名称</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">类型</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">地区</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">起拍价</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">评估价</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">状态</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">浏览</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      asset.type === '住宅' ? 'bg-blue-100' :
                      asset.type === '商业' ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                      <svg className={`w-5 h-5 ${
                        asset.type === '住宅' ? 'text-blue-600' :
                        asset.type === '商业' ? 'text-purple-600' : 'text-orange-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900">{asset.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeMap[asset.type].class}`}>
                    {typeMap[asset.type].label}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600">{asset.location}</td>
                <td className="py-4 px-6 text-gray-900 font-medium">
                  ¥{(asset.startPrice / 10000).toFixed(0)}万
                </td>
                <td className="py-4 px-6 text-gray-600">
                  ¥{(asset.evalPrice / 10000).toFixed(0)}万
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusMap[asset.status].class}`}>
                      {statusMap[asset.status].label}
                    </span>
                    {asset.isRecommended && (
                      <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-medium rounded-full">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        推荐
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-500">{asset.views}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => setEditingAsset(asset)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleToggleStatus(asset.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title={asset.status === 'active' ? '下架' : '上架'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 添加/编辑资产模态框 - 增强版 */}
      {(showAddModal || editingAsset) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 my-8 animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingAsset ? '编辑资产' : '添加新资产'}
              </h2>
              <button
                onClick={() => { setShowAddModal(false); setEditingAsset(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  基本信息
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">资产名称 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      defaultValue={editingAsset?.name}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      placeholder="请输入资产名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">资产类型 <span className="text-red-500">*</span></label>
                    <select
                      defaultValue={editingAsset?.type}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    >
                      <option value="住宅">住宅</option>
                      <option value="商业">商业</option>
                      <option value="工业">工业</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">详细地址 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      defaultValue={editingAsset?.detailedAddress}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      placeholder="请输入详细地址"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">地区</label>
                    <input
                      type="text"
                      defaultValue={editingAsset?.location}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      placeholder="如：北京市朝阳区"
                    />
                  </div>
                </div>
              </div>

              {/* 价格信息 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  价格信息
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">起拍价（¥）</label>
                    <input
                      type="number"
                      defaultValue={editingAsset?.startPrice}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      placeholder="请输入起拍价"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">评估价（¥）</label>
                    <input
                      type="number"
                      defaultValue={editingAsset?.evalPrice}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      placeholder="请输入评估价"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">建筑面积（㎡）</label>
                    <input
                      type="number"
                      defaultValue={editingAsset?.buildingArea}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      placeholder="请输入建筑面积"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">土地面积（㎡）</label>
                    <input
                      type="number"
                      defaultValue={editingAsset?.landArea}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      placeholder="请输入土地面积"
                    />
                  </div>
                </div>
              </div>

              {/* 资产详情 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  资产详情
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">建成年份</label>
                    <input
                      type="number"
                      defaultValue={editingAsset?.yearBuilt}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      placeholder="如：2020"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">楼层</label>
                    <input
                      type="text"
                      defaultValue={editingAsset?.floor}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      placeholder="如：10/共22层"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">产权年限</label>
                    <select
                      defaultValue={editingAsset?.propertyRightsYears}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="40">40年</option>
                      <option value="50">50年</option>
                      <option value="70">70年</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">当前状态</label>
                    <select
                      defaultValue={editingAsset?.status}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    >
                      <option value="active">上架</option>
                      <option value="inactive">下架</option>
                      <option value="pending">待上架</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 权利状态 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  权利状态
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">抵押状态</label>
                    <select
                      defaultValue={editingAsset?.mortgageStatus}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="已注销">已注销</option>
                      <option value="未注销">未注销</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">查封状态</label>
                    <select
                      defaultValue={editingAsset?.seizureStatus}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="已解封">已解封</option>
                      <option value="查封中">查封中</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">是否有纠纷</label>
                    <select
                      defaultValue={editingAsset?.hasDispute ? 'true' : 'false'}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    >
                      <option value="false">无</option>
                      <option value="true">有</option>
                    </select>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">纠纷详情</label>
                    <textarea
                      defaultValue={editingAsset?.disputeContent}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      rows={2}
                      placeholder="如有纠纷，请详细描述纠纷情况"
                    />
                  </div>
                </div>
              </div>

              {/* 租赁情况 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  租赁情况
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">是否带租</label>
                    <select
                      defaultValue={editingAsset?.hasRent ? 'true' : 'false'}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    >
                      <option value="false">不带租</option>
                      <option value="true">带租</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">月租金（元）</label>
                    <input
                      type="number"
                      defaultValue={editingAsset?.rentAmount}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      placeholder="请输入月租金"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">欠费金额（元）</label>
                    <input
                      type="number"
                      defaultValue={editingAsset?.arrearsAmount}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      placeholder="请输入欠费金额"
                    />
                  </div>
                </div>
              </div>

              {/* 周边情况 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  周边情况
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">资产周边情况</label>
                    <textarea
                      defaultValue={editingAsset?.surroundings}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      rows={3}
                      placeholder="如：小区内配套完善，有游泳池、健身房、儿童游乐区等"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">商业周边情况</label>
                    <textarea
                      defaultValue={editingAsset?.commercialSurroundings}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      rows={3}
                      placeholder="如：周边有大型商超、银行、医院、学校等"
                    />
                  </div>
                </div>
              </div>

              {/* 图片视频 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  图片视频
                </h3>
                
                {/* 图片上传 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">资产图片（最多10张）</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[#1e3a5f] transition-colors cursor-pointer">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      className="hidden" 
                      id="image-upload"
                      onChange={(e) => {
                        const files = e.target.files
                        if (files) {
                          alert(`已选择 ${files.length} 张图片（模拟上传）`)
                        }
                      }}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 mb-1">点击或拖拽图片到这里上传</p>
                      <p className="text-gray-400 text-sm">支持 JPG、PNG 格式</p>
                    </label>
                  </div>
                  {/* 图片预览 */}
                  {editingAsset?.images && editingAsset.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-3">
                      {editingAsset.images.map((img: string, idx: number) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`资产图片${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                          <button
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => alert('删除图片（模拟）')}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 视频上传 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">资产视频（最多3个）</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[#1e3a5f] transition-colors cursor-pointer">
                    <input 
                      type="file" 
                      multiple 
                      accept="video/*"
                      className="hidden" 
                      id="video-upload"
                      onChange={(e) => {
                        const files = e.target.files
                        if (files) {
                          alert(`已选择 ${files.length} 个视频（模拟上传）`)
                        }
                      }}
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 mb-1">点击或拖拽视频到这里上传</p>
                      <p className="text-gray-400 text-sm">支持 MP4、MOV 格式</p>
                    </label>
                  </div>
                  {/* 视频预览 */}
                  {editingAsset?.videos && editingAsset.videos.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {editingAsset.videos.map((video: string, idx: number) => (
                        <div key={idx} className="relative flex items-center bg-gray-50 rounded-lg p-3 group">
                          <video className="w-24 h-16 object-cover rounded" src={video} />
                          <span className="ml-3 text-gray-600 flex-1">视频 {idx + 1}</span>
                          <button
                            className="p-2 text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => alert('删除视频（模拟）')}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 优先匹配 */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    优先匹配客户
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="isRecommended"
                        defaultChecked={editingAsset?.isRecommended}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="isRecommended" className="ml-2 text-sm font-medium text-gray-700">
                        设为推荐资产（优先展示给客户）
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">匹配给指定客户</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {mockCustomers.map(customer => (
                          <label key={customer.id} className="flex items-center p-2 border rounded-lg hover:bg-white cursor-pointer">
                            <input 
                              type="checkbox" 
                              defaultChecked={editingAsset?.recommendedTo?.includes(customer.id)}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{customer.name}</span>
                            <span className="ml-auto text-xs text-gray-400">{customer.preferredArea}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">匹配原因</label>
                      <textarea
                        defaultValue={editingAsset?.matchReason}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder="如：客户预算匹配，区域偏好一致"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-xl">
              <button
                onClick={() => { setShowAddModal(false); setEditingAsset(null); }}
                className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => { alert(editingAsset ? '资产更新成功（模拟）' : '资产添加成功（模拟）'); setShowAddModal(false); setEditingAsset(null); }}
                className="px-6 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152d4a] transition-colors"
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
