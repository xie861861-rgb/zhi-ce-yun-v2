import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'zhi-ce-yun-v2-secret-key'

// Mock users database (in production, use Prisma)
const users: any[] = [
  {
    id: '1',
    email: 'demo@zhicelyun.com',
    password: '$2a$10$X7.Y.Y.Y.Y.Y.Y.Y.Y.Y.Y.Y.Y.Y.Y.Y.Y.Y.Y.Y.Y', // demo123
    name: '测试用户',
    phone: '13800138000',
    company: '测试企业科技有限公司',
    role: 'user',
    createdAt: new Date().toISOString(),
  }
]

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, company } = req.body

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = {
      id: String(users.length + 1),
      email,
      password: hashedPassword,
      name,
      phone,
      company,
      role: 'user',
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          company: newUser.company,
        },
        token
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '注册失败',
      error: (error as Error).message
    })
  }
})

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      })
    }

    // Check password (for demo, accept any password)
    const isValid = await bcrypt.compare(password, user.password) || password === 'demo123'
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      })
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          company: user.company,
        },
        token
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: (error as Error).message
    })
  }
})

// Get current user
router.get('/me', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: '未登录'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const user = users.find(u => u.id === decoded.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        company: user.company,
        role: user.role,
      }
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token无效'
    })
  }
})

// Logout
router.post('/logout', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '退出成功'
  })
})

export default router
