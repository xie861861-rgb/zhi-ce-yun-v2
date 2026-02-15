import { Router, Request, Response } from 'express'

const router = Router()

// Mock companies database
const companies: any[] = [
  {
    id: '1',
    name: '深圳市智策云科技有限公司',
    taxNumber: '91440300MA5FXXXXXX',
    legalPerson: '张三',
    registeredCapital: 1000,
    establishedDate: '2018-06-15',
    address: '深圳市南山区科技园路XX号XX大厦',
    status: 'verified',
    userId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

// Get company by user
router.get('/', (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || '1'
    const company = companies.find(c => c.userId === userId)
    
    if (!company) {
      return res.json({
        success: true,
        data: null
      })
    }

    res.json({
      success: true,
      data: company
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取企业信息失败'
    })
  }
})

// Create company
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, taxNumber, legalPerson, registeredCapital, establishedDate, address, userId } = req.body

    const newCompany = {
      id: String(companies.length + 1),
      name,
      taxNumber,
      legalPerson,
      registeredCapital,
      establishedDate,
      address,
      status: 'pending',
      userId: userId || '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    companies.push(newCompany)

    res.status(201).json({
      success: true,
      message: '企业信息创建成功',
      data: newCompany
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建企业信息失败'
    })
  }
})

// Update company
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const index = companies.findIndex(c => c.id === id)

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '企业不存在'
      })
    }

    companies[index] = {
      ...companies[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    }

    res.json({
      success: true,
      message: '企业信息更新成功',
      data: companies[index]
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新企业信息失败'
    })
  }
})

export default router
