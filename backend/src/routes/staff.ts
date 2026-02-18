import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// 获取所有员工列表
router.get('/', async (req: Request, res: Response) => {
  try {
    const staff = await prisma.staff.findMany({
      include: {
        customers: {
          include: {
            customer: true
          }
        },
        followUps: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, data: staff })
  } catch (error) {
    console.error('获取员工列表失败:', error)
    res.status(500).json({ success: false, message: '获取员工列表失败' })
  }
})

// 获取单个员工详情
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        customers: {
          include: {
            customer: true
          }
        },
        followUps: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!staff) {
      return res.status(404).json({ success: false, message: '员工不存在' })
    }
    
    res.json({ success: true, data: staff })
  } catch (error) {
    console.error('获取员工详情失败:', error)
    res.status(500).json({ success: false, message: '获取员工详情失败' })
  }
})

// 创建员工
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, position, department, avatar } = req.body
    
    // 检查邮箱是否已存在
    const existingStaff = await prisma.staff.findUnique({
      where: { email }
    })
    
    if (existingStaff) {
      return res.status(400).json({ success: false, message: '邮箱已被使用' })
    }
    
    const staff = await prisma.staff.create({
      data: {
        name,
        email,
        phone,
        position,
        department,
        avatar
      }
    })
    
    res.json({ success: true, data: staff })
  } catch (error) {
    console.error('创建员工失败:', error)
    res.status(500).json({ success: false, message: '创建员工失败' })
  }
})

// 更新员工
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, email, phone, position, department, avatar, status } = req.body
    
    const staff = await prisma.staff.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        position,
        department,
        avatar,
        status
      }
    })
    
    res.json({ success: true, data: staff })
  } catch (error) {
    console.error('更新员工失败:', error)
    res.status(500).json({ success: false, message: '更新员工失败' })
  }
})

// 删除员工
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    await prisma.staff.delete({
      where: { id }
    })
    
    res.json({ success: true, message: '员工已删除' })
  } catch (error) {
    console.error('删除员工失败:', error)
    res.status(500).json({ success: false, message: '删除员工失败' })
  }
})

// 分配客户给员工
router.post('/:id/customers', async (req: Request, res: Response) => {
  try {
    const { id: staffId } = req.params
    const { customerId, notes } = req.body
    
    const staffCustomer = await prisma.staffCustomer.create({
      data: {
        staffId,
        customerId,
        notes
      }
    })
    
    res.json({ success: true, data: staffCustomer })
  } catch (error) {
    console.error('分配客户失败:', error)
    res.status(500).json({ success: false, message: '分配客户失败' })
  }
})

// 移除员工客户
router.delete('/:id/customers/:customerId', async (req: Request, res: Response) => {
  try {
    const { id: staffId, customerId } = req.params
    
    await prisma.staffCustomer.deleteMany({
      where: {
        staffId,
        customerId
      }
    })
    
    res.json({ success: true, message: '客户已从员工移除' })
  } catch (error) {
    console.error('移除客户失败:', error)
    res.status(500).json({ success: false, message: '移除客户失败' })
  }
})

// 添加跟进记录
router.post('/:id/followups', async (req: Request, res: Response) => {
  try {
    const { id: staffId } = req.params
    const { customerId, type, content, nextAction, nextDate } = req.body
    
    const followUp = await prisma.staffFollowUp.create({
      data: {
        staffId,
        customerId,
        type,
        content,
        nextAction,
        nextDate: nextDate ? new Date(nextDate) : null
      }
    })
    
    res.json({ success: true, data: followUp })
  } catch (error) {
    console.error('添加跟进记录失败:', error)
    res.status(500).json({ success: false, message: '添加跟进记录失败' })
  }
})

// 获取所有客户列表（用于分配）
router.get('/customers/list', async (req: Request, res: Response) => {
  try {
    const customers = await prisma.user.findMany({
      where: {
        role: 'user'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json({ success: true, data: customers })
  } catch (error) {
    console.error('获取客户列表失败:', error)
    res.status(500).json({ success: false, message: '获取客户列表失败' })
  }
})

// 获取员工统计
router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const totalStaff = await prisma.staff.count()
    const activeStaff = await prisma.staff.count({
      where: { status: 'active' }
    })
    
    const staffWithCustomers = await prisma.staffCustomer.groupBy({
      by: ['staffId'],
      _count: true
    })
    
    const totalCustomers = await prisma.staffCustomer.count()
    
    const recentFollowUps = await prisma.staffFollowUp.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })
    
    res.json({
      success: true,
      data: {
        totalStaff,
        activeStaff,
        totalCustomers,
        recentFollowUps,
        staffWithCustomers: staffWithCustomers.length
      }
    })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    res.status(500).json({ success: false, message: '获取统计数据失败' })
  }
})

export default router
