# 智策云V2 - 智能融资决策平台

## 项目简介

智策云V2是一个基于AI技术的智能融资决策平台，提供从资质预审到资产匹配再到融资决策的全方位智能服务。

## 核心功能

### 1. Smart Audit（极简资质预审）
- 企业注册/登录
- 纳税证明上传（图片/PDF）
- 财务报表摘要上传
- OCR图文识别（模拟）
- 税务API交叉核验（模拟）
- 10分钟内生成：
  - 企业信用画像
  - 可贷额度预估
  - 风险评级报告

### 2. Value Matching（高融资空间匹配）
- 法拍资产数据展示
  - 阿里法拍、京东法拍
  - 深圳法院司法公开平台
- 资产搜索和筛选：
  - 地区（南山、福田、前海等）
  - 类型（住宅、商业、工业）
  - 价格范围
  - 折价率
- 净融资空间计算：
  - 资产评估价 - 起拍价
  - 银行抵押率（60%-70%）
  - 处置成本
- 推荐Top 3高性价比标的

### 3. Decision Report（融资分析简报）
- 首付门槛测算
- 杠杆率计算
- 预计放款周期
- 月供压力测试
- 潜在风险提示
- 1小时生成专业报告

## 技术架构

### 前端（Next.js 14+ App Router）
- TypeScript
- TailwindCSS（蓝白专业配色）
- 页面结构：
  - 首页 Landing Page
  - 登录/注册
  - 工作台 Dashboard
  - 资质预审页面
  - 资产匹配页面
  - 报告查看页面
  - 个人中心

### 后端（Express.js）
- TypeScript
- Prisma ORM
- SQLite/PostgreSQL
- API模块：
  - 认证模块
  - 企业管理
  - 资质预审
  - 资产管理
  - 报告生成
  - 工单管理

## 项目结构

```
zhi-ce-yun-v2/
├── frontend/                 # Next.js 前端
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx    # 首页
│   │   │   ├── login/      # 登录
│   │   │   ├── register/   # 注册
│   │   │   ├── dashboard/  # 工作台
│   │   │   ├── audit/       # 资质预审
│   │   │   ├── matching/    # 资产匹配
│   │   │   ├── report/      # 报告查看
│   │   │   └── profile/     # 个人中心
│   │   ├── components/      # 组件
│   │   ├── lib/             # 工具库
│   │   ├── hooks/           # 自定义hooks
│   │   └── types/           # 类型定义
│   └── ...
├── backend/                  # Express 后端
│   ├── src/
│   │   ├── routes/         # API路由
│   │   ├── controllers/    # 控制器
│   │   ├── services/       # 业务逻辑
│   │   ├── models/         # 数据模型
│   │   ├── middleware/     # 中间件
│   │   └── utils/          # 工具函数
│   ├── prisma/             # 数据库Schema
│   └── ...
├── shared/                  # 共享类型定义
└── docs/                    # 文档
```

## 快速开始

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端将在 http://localhost:3000 运行

### 后端启动

```bash
cd backend
npm install
npm run dev
```

后端将在 http://localhost:3001 运行

## API 接口

### 认证模块
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户
- `POST /api/auth/logout` - 退出登录

### 企业管理
- `GET /api/company` - 获取企业信息
- `POST /api/company` - 创建企业信息
- `PUT /api/company/:id` - 更新企业信息

### 资质预审
- `GET /api/audit/status` - 获取审核状态
- `POST /api/audit/submit` - 提交审核申请
- `POST /api/audit/ocr` - OCR图文识别
- `POST /api/audit/validate` - 税务核验

### 资产管理
- `GET /api/asset` - 获取资产列表
- `GET /api/asset/recommended` - 获取推荐资产
- `GET /api/asset/:id` - 获取资产详情
- `POST /api/asset/calculate` - 计算融资空间

### 报告生成
- `GET /api/report` - 获取报告列表
- `GET /api/report/:id` - 获取报告详情
- `POST /api/report/generate/credit` - 生成信用报告
- `POST /api/report/generate/asset` - 生成资产分析报告
- `POST /api/report/generate/decision` - 生成决策报告

### 工单管理
- `GET /api/work-order` - 获取工单列表
- `POST /api/work-order` - 创建工单
- `GET /api/work-order/:id` - 获取工单详情

## UI设计要求

### 配色方案
- 主题色：蓝色 #2563EB / #3B82F6
- 背景色：白色 #FFFFFF
- 辅助色：灰色系
- 强调色：金色/橙色（可选）

### 设计风格
- 简洁专业
- 数据可视化（图表展示）
- 表格展示资产列表
- 表单用于信息录入
- 响应式设计

## 交付标准

1. ✅ 完整的项目结构
2. ✅ 可运行的前后端
3. ✅ 所有核心页面UI
4. ✅ 模拟数据（无需真实API对接）
5. ✅ 响应式设计

## 演示账号

- 邮箱：demo@zhicelyun.com
- 密码：demo123

## License

MIT
