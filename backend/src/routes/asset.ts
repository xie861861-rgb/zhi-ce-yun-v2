import { Router, Request, Response } from 'express'

const router = Router()

// Mock assets database - 增强版
const assets: any[] = [
  {
    id: '1',
    title: '深圳市南山区华润城住宅',
    type: '住宅',
    area: '南山',
    address: '深圳市南山区科技园路',
    detailedAddress: '深圳市南山区科技园路88号华润城一期',
    price: 8500000,
    marketPrice: 10900000,
    discount: 0.78,
    financingSpace: 2100000,
    mortgageRate: 0.65,
    disposalCost: 150000,
    source: '阿里法拍',
    status: '进行中',
    endTime: '2026-02-20',
    // 新增字段
    buildingArea: 120,
    landArea: 0,
    yearBuilt: 2019,
    floor: '25/共32层',
    propertyRightsYears: 70,
    hasDispute: false,
    disputeContent: '',
    hasRent: true,
    rentAmount: 8500,
    mortgageStatus: '已注销',
    seizureStatus: '已解封',
    arrearsAmount: 0,
    surroundings: '小区配套完善，有游泳池、健身房、儿童游乐区，物业管理规范',
    commercialSurroundings: '周边有华润万象天地、地铁1号线高新园站、南外科创学校',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '福田区CBD写字楼',
    type: '商业',
    area: '福田',
    address: '深圳市福田区中心商务区',
    detailedAddress: '深圳市福田区中心区福华一路CBD中心大厦',
    price: 15000000,
    marketPrice: 20800000,
    discount: 0.72,
    financingSpace: 4200000,
    mortgageRate: 0.60,
    disposalCost: 300000,
    source: '京东法拍',
    status: '进行中',
    endTime: '2026-02-18',
    // 新增字段
    buildingArea: 350,
    landArea: 0,
    yearBuilt: 2015,
    floor: '15/共30层',
    propertyRightsYears: 50,
    hasDispute: true,
    disputeContent: '涉及租赁合同纠纷，租户拒搬离',
    hasRent: true,
    rentAmount: 35000,
    mortgageStatus: '未注销',
    seizureStatus: '已解封',
    arrearsAmount: 150000,
    surroundings: '甲级写字楼，大堂气派，电梯快速，中央空调，物业管理专业',
    commercialSurroundings: '陆家嘴核心商圈，金融机构总部聚集，地铁2号线直达',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '前海工业厂房',
    type: '工业',
    area: '前海',
    address: '深圳市前海深港合作区',
    detailedAddress: '深圳市前海深港合作区前湾一路',
    price: 5200000,
    marketPrice: 6930000,
    discount: 0.75,
    financingSpace: 1300000,
    mortgageRate: 0.55,
    disposalCost: 100000,
    source: '深圳法院',
    status: '即将开始',
    endTime: '2026-02-25',
    // 新增字段
    buildingArea: 2000,
    landArea: 3500,
    yearBuilt: 2018,
    floor: '1-3/共3层',
    propertyRightsYears: 50,
    hasDispute: false,
    disputeContent: '',
    hasRent: false,
    rentAmount: 0,
    mortgageStatus: '已注销',
    seizureStatus: '已解封',
    arrearsAmount: 0,
    surroundings: '园区内道路宽阔，货车通行便利，厂房结构稳固，层高6米',
    commercialSurroundings: '临近深圳前海自贸区，物流便捷，距离深圳机场30分钟车程',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: '罗湖区东门商业旺铺',
    type: '商业',
    area: '罗湖',
    address: '深圳市罗湖区东门步行街',
    detailedAddress: '深圳市罗湖区东门中路123号太阳百货',
    price: 3200000,
    marketPrice: 4570000,
    discount: 0.70,
    financingSpace: 800000,
    mortgageRate: 0.60,
    disposalCost: 80000,
    source: '阿里法拍',
    status: '进行中',
    endTime: '2026-02-22',
    // 新增字段
    buildingArea: 85,
    landArea: 0,
    yearBuilt: 2010,
    floor: '1/共5层',
    propertyRightsYears: 40,
    hasDispute: false,
    disputeContent: '',
    hasRent: true,
    rentAmount: 28000,
    mortgageStatus: '已注销',
    seizureStatus: '已解封',
    arrearsAmount: 0,
    surroundings: '东门商圈核心位置，人流量大，适合商业经营',
    commercialSurroundings: '东门步行街核心商圈，周边有茂业百货、太阳广场，人流量极大',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: '宝安区西乡住宅',
    type: '住宅',
    area: '宝安',
    address: '深圳市宝安区西乡大道',
    detailedAddress: '深圳市宝安区西乡大道168号圣淘沙骏园',
    price: 4500000,
    marketPrice: 6000000,
    discount: 0.75,
    financingSpace: 1100000,
    mortgageRate: 0.70,
    disposalCost: 100000,
    source: '京东法拍',
    status: '进行中',
    endTime: '2026-02-19',
    // 新增字段
    buildingArea: 98,
    landArea: 0,
    yearBuilt: 2016,
    floor: '18/共25层',
    propertyRightsYears: 70,
    hasDispute: false,
    disputeContent: '',
    hasRent: false,
    rentAmount: 0,
    mortgageStatus: '已注销',
    seizureStatus: '已解封',
    arrearsAmount: 0,
    surroundings: '小区环境优美，绿化率高，安静舒适',
    commercialSurroundings: '近地铁1号线西乡站，周边有天虹商场、港隆城',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: '龙岗区坂田科技园厂房',
    type: '工业',
    area: '龙岗',
    address: '深圳市龙岗区坂田华为基地附近',
    detailedAddress: '深圳市龙岗区坂田街道雪象社区宝吉路',
    price: 6800000,
    marketPrice: 9070000,
    discount: 0.75,
    financingSpace: 1700000,
    mortgageRate: 0.55,
    disposalCost: 150000,
    source: '深圳法院',
    status: '即将开始',
    endTime: '2026-02-28',
    // 新增字段
    buildingArea: 4500,
    landArea: 8000,
    yearBuilt: 2012,
    floor: '1-4/共4层',
    propertyRightsYears: 50,
    hasDispute: true,
    disputeContent: '债务纠纷，涉及银行抵押贷款',
    hasRent: false,
    rentAmount: 0,
    mortgageStatus: '未注销',
    seizureStatus: '查封中',
    arrearsAmount: 380000,
    surroundings: '厂房结构稳固，层高5.5米，配有独立办公楼',
    commercialSurroundings: '靠近华为总部基地，周边科技企业聚集，人才充足',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Get all assets with filters
router.get('/', (req: Request, res: Response) => {
  try {
    const { area, type, source, minPrice, maxPrice, minDiscount, maxDiscount, sortBy, page, pageSize } = req.query

    let filtered = [...assets]

    // Apply filters
    if (area && area !== '全部') {
      filtered = filtered.filter(a => a.area === area)
    }
    if (type && type !== '全部') {
      filtered = filtered.filter(a => a.type === type)
    }
    if (source && source !== '全部') {
      filtered = filtered.filter(a => a.source === source)
    }
    if (minPrice) {
      filtered = filtered.filter(a => a.price >= Number(minPrice))
    }
    if (maxPrice) {
      filtered = filtered.filter(a => a.price <= Number(maxPrice))
    }
    if (minDiscount) {
      filtered = filtered.filter(a => a.discount >= Number(minDiscount))
    }
    if (maxDiscount) {
      filtered = filtered.filter(a => a.discount <= Number(maxDiscount))
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 'price':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'discount':
          filtered.sort((a, b) => a.discount - b.discount)
          break
        case 'financingSpace':
          filtered.sort((a, b) => b.financingSpace - a.financingSpace)
          break
      }
    }

    // Pagination
    const pageNum = Number(page) || 1
    const size = Number(pageSize) || 10
    const start = (pageNum - 1) * size
    const paginated = filtered.slice(start, start + size)

    res.json({
      success: true,
      data: {
        assets: paginated,
        total: filtered.length,
        page: pageNum,
        pageSize: size,
        totalPages: Math.ceil(filtered.length / size),
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取资产列表失败'
    })
  }
})

// Get recommended assets (Top 3)
router.get('/recommended', (req: Request, res: Response) => {
  try {
    // Sort by financing space and get top 3
    const recommended = [...assets]
      .sort((a, b) => b.financingSpace - a.financingSpace)
      .slice(0, 3)

    res.json({
      success: true,
      data: recommended
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取推荐资产失败'
    })
  }
})

// Get single asset
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const asset = assets.find(a => a.id === id)

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: '资产不存在'
      })
    }

    res.json({
      success: true,
      data: asset
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取资产详情失败'
    })
  }
})

// Calculate financing space
router.post('/calculate', (req: Request, res: Response) => {
  try {
    const { price, marketPrice, mortgageRate, disposalCost } = req.body

    const loanAmount = marketPrice * mortgageRate
    const financingSpace = loanAmount - price - disposalCost

    res.json({
      success: true,
      data: {
        marketPrice,
        mortgageRate,
        loanAmount,
        price,
        disposalCost,
        financingSpace: Math.max(0, financingSpace),
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '计算失败'
    })
  }
})

export default router
