import { Router, Request, Response } from 'express'

const router = Router()

// Mock work orders
const workOrders: any[] = [
  {
    id: '1',
    type: 'consultation',
    status: 'pending',
    title: '资质预审咨询',
    description: '想了解企业信用评分的具体计算方式',
    createdAt: '2026-02-12 09:00',
    updatedAt: '2026-02-12 09:00',
  },
  {
    id: '2',
    type: 'feedback',
    status: 'completed',
    title: '功能建议',
    description: '希望增加批量导出报告功能',
    response: '感谢您的建议，我们会在下一版本中考虑',
    createdAt: '2026-02-10 14:30',
    updatedAt: '2026-02-11 10:00',
  },
]

// Get all work orders
router.get('/', (req: Request, res: Response) => {
  try {
    const { status, page, pageSize } = req.query

    let filtered = [...workOrders]

    if (status && status !== 'all') {
      filtered = filtered.filter(w => w.status === status)
    }

    // Pagination
    const pageNum = Number(page) || 1
    const size = Number(pageSize) || 10
    const start = (pageNum - 1) * size
    const paginated = filtered.slice(start, start + size)

    res.json({
      success: true,
      data: {
        workOrders: paginated,
        total: filtered.length,
        page: pageNum,
        pageSize: size,
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取工单列表失败'
    })
  }
})

// Create work order
router.post('/', (req: Request, res: Response) => {
  try {
    const { type, title, description } = req.body

    const newWorkOrder = {
      id: String(workOrders.length + 1),
      type,
      status: 'pending',
      title,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    workOrders.push(newWorkOrder)

    res.status(201).json({
      success: true,
      message: '工单提交成功',
      data: newWorkOrder
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '提交工单失败'
    })
  }
})

// Get single work order
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const workOrder = workOrders.find(w => w.id === id)

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: '工单不存在'
      })
    }

    res.json({
      success: true,
      data: workOrder
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取工单详情失败'
    })
  }
})

// Update work order (admin only in production)
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const index = workOrders.findIndex(w => w.id === id)

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '工单不存在'
      })
    }

    workOrders[index] = {
      ...workOrders[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    }

    res.json({
      success: true,
      message: '工单更新成功',
      data: workOrders[index]
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新工单失败'
    })
  }
})

export default router
