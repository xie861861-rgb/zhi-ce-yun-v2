import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

// Routes
import authRoutes from './routes/auth'
import companyRoutes from './routes/company'
import auditRoutes from './routes/audit'
import assetRoutes from './routes/asset'
import reportRoutes from './routes/report'
import workOrderRoutes from './routes/workOrder'
import dataSourcesRoutes from './routes/dataSources'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/company', companyRoutes)
app.use('/api/audit', auditRoutes)
app.use('/api/asset', assetRoutes)
app.use('/api/report', reportRoutes)
app.use('/api/work-order', workOrderRoutes)
app.use('/api/data-sources', dataSourcesRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '智策云V2 API 服务运行中' })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: '服务器错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.listen(PORT, () => {
  console.log(`🚀 智策云V2 API 服务已启动: http://localhost:${PORT}`)
  console.log(`📁 API 文档: http://localhost:${PORT}/api`)
})

export default app
