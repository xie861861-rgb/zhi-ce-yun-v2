import { Router, Request, Response } from 'express'

const router = Router()

// Mock reports database
const reports: any[] = [
  {
    id: '1',
    userId: '1',
    type: 'credit',
    title: '企业信用画像报告',
    status: 'completed',
    data: JSON.stringify({
      score: 85,
      level: 'A级',
      loanLimit: 5000000,
      riskLevel: '低风险',
      keyMetrics: {
        taxCompliance: 95,
        financialHealth: 80,
        businessStability: 85,
        industryProspects: 90,
      }
    }),
    createdAt: '2026-02-12 10:30',
    updatedAt: '2026-02-12 10:35',
  },
  {
    id: '2',
    userId: '1',
    assetId: '1',
    type: 'asset',
    title: '资产匹配分析报告 - 华润城住宅',
    status: 'completed',
    data: JSON.stringify({
      asset: {
        title: '深圳市南山区华润城住宅',
        price: 8500000,
        marketPrice: 10900000,
        financingSpace: 2100000,
      },
      analysis: {
        downPayment: 2550000,
        loanAmount: 5950000,
        monthlyPayment: 38500,
        loanToValue: 0.65,
        leverage: 2.35,
      }
    }),
    createdAt: '2026-02-12 11:00',
    updatedAt: '2026-02-12 11:15',
  },
  {
    id: '3',
    userId: '1',
    type: 'decision',
    title: '融资决策分析简报',
    status: 'processing',
    createdAt: '2026-02-12 14:00',
    updatedAt: '2026-02-12 14:00',
  },
]

// Get all reports
router.get('/', (req: Request, res: Response) => {
  try {
    const { userId, type, status, page, pageSize } = req.query

    let filtered = reports.filter(r => r.userId === (userId || '1'))

    if (type && type !== 'all') {
      filtered = filtered.filter(r => r.type === type)
    }
    if (status && status !== 'all') {
      filtered = filtered.filter(r => r.status === status)
    }

    // Sort by createdAt desc
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Pagination
    const pageNum = Number(page) || 1
    const size = Number(pageSize) || 10
    const start = (pageNum - 1) * size
    const paginated = filtered.slice(start, start + size)

    res.json({
      success: true,
      data: {
        reports: paginated,
        total: filtered.length,
        page: pageNum,
        pageSize: size,
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取报告列表失败'
    })
  }
})

// Get single report
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const report = reports.find(r => r.id === id)

    if (!report) {
      return res.status(404).json({
        success: false,
        message: '报告不存在'
      })
    }

    res.json({
      success: true,
      data: {
        ...report,
        data: report.data ? JSON.parse(report.data) : null
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取报告详情失败'
    })
  }
})

// Generate credit report
router.post('/generate/credit', (req: Request, res: Response) => {
  try {
    const { userId, auditId } = req.body

    const newReport = {
      id: String(reports.length + 1),
      userId: userId || '1',
      type: 'credit',
      title: '企业信用画像报告',
      status: 'completed',
      data: JSON.stringify({
        score: 85,
        level: 'A级',
        loanLimit: 5000000,
        riskLevel: '低风险',
        keyMetrics: {
          taxCompliance: 95,
          financialHealth: 80,
          businessStability: 85,
          industryProspects: 90,
        }
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    reports.push(newReport)

    res.status(201).json({
      success: true,
      message: '报告生成成功',
      data: {
        ...newReport,
        data: JSON.parse(newReport.data)
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '生成报告失败'
    })
  }
})

// Generate asset analysis report
router.post('/generate/asset', (req: Request, res: Response) => {
  try {
    const { userId, assetId } = req.body

    const asset = {
      title: '深圳市南山区华润城住宅',
      price: 8500000,
      marketPrice: 10900000,
      financingSpace: 2100000,
    }

    const newReport = {
      id: String(reports.length + 1),
      userId: userId || '1',
      assetId,
      type: 'asset',
      title: `资产匹配分析报告 - ${asset.title}`,
      status: 'completed',
      data: JSON.stringify({
        asset,
        analysis: {
          downPayment: 2550000,
          loanAmount: 5950000,
          monthlyPayment: 38500,
          loanToValue: 0.65,
          leverage: 2.35,
        }
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    reports.push(newReport)

    res.status(201).json({
      success: true,
      message: '报告生成成功',
      data: {
        ...newReport,
        data: JSON.parse(newReport.data)
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '生成报告失败'
    })
  }
})

// Generate decision report
router.post('/generate/decision', (req: Request, res: Response) => {
  try {
    const { userId, assetId, auditId } = req.body

    const newReport = {
      id: String(reports.length + 1),
      userId: userId || '1',
      type: 'decision',
      title: '融资决策分析简报',
      status: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    reports.push(newReport)

    // Simulate async generation
    setTimeout(() => {
      const index = reports.findIndex(r => r.id === newReport.id)
      if (index !== -1) {
        reports[index] = {
          ...reports[index],
          status: 'completed',
          data: JSON.stringify({
            asset: {
              title: '深圳市南山区华润城住宅',
              price: 8500000,
              marketPrice: 10900000,
              discount: 0.78,
            },
            financing: {
              totalInvestment: 8500000,
              downPayment: 2550000,
              bankLoan: 5950000,
              monthlyPayment: 38500,
              loanTerm: 20,
              interestRate: 0.049,
            },
            analysis: {
              loanToValue: 0.55,
              leverage: 2.35,
              dtiRatio: 0.35,
              cashOnCash: 0.12,
            },
            risks: [
              {
                level: 'medium',
                title: '市场波动风险',
                description: '房产市场存在一定波动性',
                suggestion: '建议关注市场走势',
              },
              {
                level: 'low',
                title: '法拍过户风险',
                description: '可能存在产权不清',
                suggestion: '建议进行详细产权调查',
              },
            ],
            timeline: [
              { phase: '竞拍成功', duration: '1-3天', description: '支付尾款' },
              { phase: '法院裁定', duration: '7-15天', description: '获取裁定书' },
              { phase: '过户登记', duration: '15-30天', description: '办理过户' },
              { phase: '抵押贷款', duration: '7-14天', description: '银行放款' },
            ],
            summary: '综合评估，该资产具有较好的融资空间和投资价值',
          }),
          updatedAt: new Date().toISOString(),
        }
      }
    }, 3600000) // 1 hour for demo

    res.status(202).json({
      success: true,
      message: '报告生成中，预计1小时内完成',
      data: newReport
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '生成报告失败'
    })
  }
})

export default router
