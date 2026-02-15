import { Router, Request, Response } from 'express'

const router = Router()

// Mock audit results
const auditResults: any[] = [
  {
    id: '1',
    userId: '1',
    companyId: '1',
    status: 'completed',
    score: 85,
    creditLevel: 'A级',
    loanLimit: 5000000,
    riskLevel: '低风险',
    taxCompliance: 95,
    financialHealth: 80,
    businessStability: 85,
    industryProspects: 90,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

// Get audit status
router.get('/status', (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || '1'
    const audit = auditResults.find(a => a.userId === userId)
    
    res.json({
      success: true,
      data: audit || null
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取审核状态失败'
    })
  }
})

// Submit audit application
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { userId, companyId, taxProof, financialReport } = req.body

    // Create audit record
    const newAudit = {
      id: String(auditResults.length + 1),
      userId: userId || '1',
      companyId,
      status: 'processing',
      score: null,
      creditLevel: null,
      loanLimit: null,
      riskLevel: null,
      taxCompliance: null,
      financialHealth: null,
      businessStability: null,
      industryProspects: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    auditResults.push(newAudit)

    // Simulate async processing
    setTimeout(() => {
      const index = auditResults.findIndex(a => a.id === newAudit.id)
      if (index !== -1) {
        auditResults[index] = {
          ...auditResults[index],
          status: 'completed',
          score: Math.floor(Math.random() * 30) + 70, // 70-100
          creditLevel: Math.random() > 0.5 ? 'A级' : 'B级',
          loanLimit: Math.floor(Math.random() * 3000000) + 3000000, // 300-600万
          riskLevel: Math.random() > 0.3 ? '低风险' : '中风险',
          taxCompliance: Math.floor(Math.random() * 20) + 80,
          financialHealth: Math.floor(Math.random() * 25) + 70,
          businessStability: Math.floor(Math.random() * 20) + 75,
          industryProspects: Math.floor(Math.random() * 15) + 85,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    }, 10000) // 10 seconds delay for demo

    res.status(202).json({
      success: true,
      message: '资质预审已提交，请稍候...',
      data: newAudit
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '提交审核失败'
    })
  }
})

// OCR processing (mock)
router.post('/ocr', (req: Request, res: Response) => {
  try {
    const { image } = req.body

    // Mock OCR result
    const ocrResult = {
      companyName: '深圳市智策云科技有限公司',
      taxNumber: '91440300MA5FXXXXX',
      annualTax: 1250000,
      revenue: 85000000,
      profit: 12500000,
      confidence: 0.95,
    }

    res.json({
      success: true,
      data: ocrResult
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'OCR处理失败'
    })
  }
})

// Cross validation (mock)
router.post('/validate', (req: Request, res: Response) => {
  try {
    const { taxNumber } = req.body

    // Mock validation result
    const validationResult = {
      valid: true,
      taxStatus: '正常',
      taxArrears: 0,
      lastTaxPayment: '2026-01-15',
      creditScore: 85,
      riskLevel: '低风险',
    }

    res.json({
      success: true,
      data: validationResult
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '核验失败'
    })
  }
})

export default router
