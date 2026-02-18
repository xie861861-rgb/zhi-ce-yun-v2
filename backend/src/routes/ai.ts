/**
 * AI 智能匹配 API 路由
 * 智策云V2 - 低买高贷核心功能
 * 
 * POST /api/ai/analyze-enterprise  - 企业分析
 * POST /api/ai/valuate-property    - 资产评估
 * POST /api/ai/smart-match         - 智能匹配（核心）
 * POST /api/ai/calculate-loan      - 低买高贷计算
 */

import { Router, Request, Response } from 'express';
import { MasterAgent } from '../services/ai/agents/masterAgent';
import type {
  EnterpriseAnalysis,
  PropertyValuation,
  MatchingResult,
  LowBuyHighLoanResult
} from '../services/ai/types';

const router = Router();
const masterAgent = new MasterAgent();

/**
 * POST /api/ai/analyze-enterprise
 * 企业分析 - 分析企业财务状况，确定可贷款额度
 */
router.post('/analyze-enterprise', async (req: Request, res: Response) => {
  try {
    const { enterpriseId, financialData, industryCategory, techClassification } = req.body;
    
    if (!enterpriseId) {
      return res.status(400).json({
        success: false,
        error: '缺少企业ID'
      });
    }
    
    const analysis = await masterAgent.analyzeEnterprise({
      id: enterpriseId,
      financialData,
      industryCategory,
      techClassification
    });
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('企业分析失败:', error);
    res.status(500).json({
      success: false,
      error: '企业分析失败'
    });
  }
});

/**
 * POST /api/ai/valuate-property
 * 资产评估 - 评估资产市场价值、折扣率、投资评分
 */
router.post('/valuate-property', async (req: Request, res: Response) => {
  try {
    const propertyData = req.body;
    
    if (!propertyData.id || !propertyData.buildingArea || !propertyData.propertyType) {
      return res.status(400).json({
        success: false,
        error: '缺少必要的资产信息'
      });
    }
    
    const valuation = await masterAgent.valuateProperty(propertyData);
    
    res.json({
      success: true,
      data: valuation
    });
  } catch (error) {
    console.error('资产评估失败:', error);
    res.status(500).json({
      success: false,
      error: '资产评估失败'
    });
  }
});

/**
 * POST /api/ai/smart-match
 * 智能匹配 - 核心功能！为企业匹配最优资产
 */
router.post('/smart-match', async (req: Request, res: Response) => {
  try {
    const { 
      enterpriseId, 
      enterpriseData, 
      properties,
      options 
    } = req.body;
    
    if (!enterpriseId) {
      return res.status(400).json({
        success: false,
        error: '缺少企业ID'
      });
    }
    
    if (!properties || properties.length === 0) {
      return res.status(400).json({
        success: false,
        error: '缺少资产列表'
      });
    }
    
    // 1. 分析企业
    const enterpriseAnalysis = await masterAgent.analyzeEnterprise({
      id: enterpriseId,
      financialData: enterpriseData?.financialData,
      industryCategory: enterpriseData?.industryCategory,
      techClassification: enterpriseData?.techClassification
    });
    
    // 2. 智能匹配
    const matches = await masterAgent.smartMatch(
      enterpriseAnalysis,
      properties,
      options
    );
    
    res.json({
      success: true,
      data: {
        enterpriseAnalysis,
        matches,
        total: matches.length
      }
    });
  } catch (error) {
    console.error('智能匹配失败:', error);
    res.status(500).json({
      success: false,
      error: '智能匹配失败'
    });
  }
});

/**
 * POST /api/ai/calculate-loan
 * 低买高贷计算 - 计算单个资产的套现方案
 */
router.post('/calculate-loan', async (req: Request, res: Response) => {
  try {
    const { enterpriseId, enterpriseData, property } = req.body;
    
    if (!enterpriseId || !property) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数'
      });
    }
    
    // 分析企业
    const enterpriseAnalysis = await masterAgent.analyzeEnterprise({
      id: enterpriseId,
      financialData: enterpriseData?.financialData,
      industryCategory: enterpriseData?.industryCategory,
      techClassification: enterpriseData?.techClassification
    });
    
    // 计算低买高贷
    const result = await masterAgent.calculateLowBuyHighLoan(property, enterpriseAnalysis);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('贷款计算失败:', error);
    res.status(500).json({
      success: false,
      error: '贷款计算失败'
    });
  }
});

/**
 * GET /api/ai/bank-products
 * 获取银行产品列表
 */
router.get('/bank-products', async (req: Request, res: Response) => {
  try {
    const { BankPolicySkill } = await import('../services/ai/skills/bankPolicy');
    const bankSkill = new BankPolicySkill();
    
    const { propertyType, loanAmount } = req.query;
    
    let products;
    if (propertyType) {
      products = bankSkill.getProductsByPropertyType(propertyType as string);
    } else {
      products = bankSkill.getAllProducts();
    }
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('获取银行产品失败:', error);
    res.status(500).json({
      success: false,
      error: '获取银行产品失败'
    });
  }
});

/**
 * GET /api/ai/match-result/:matchId
 * 获取匹配结果详情
 */
router.get('/match-result/:matchId', async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    
    // TODO: 从数据库获取匹配结果
    // 这里返回模拟数据
    res.json({
      success: true,
      data: {
        id: matchId,
        message: '请使用 smart-match API 获取实时匹配结果'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取匹配结果失败'
    });
  }
});

/**
 * POST /api/ai/chat
 * 智能对话 - 带记忆功能
 * 
 * 支持上下文记忆，避免重复询问相同问题
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { enterpriseId, userId, message, sessionId } = req.body;
    
    if (!enterpriseId || !message) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数 (enterpriseId, message)'
      });
    }
    
    // 简单回复生成（待接入大模型）
    const reply = generateSimpleReply(message);
    
    res.json({
      success: true,
      reply,
      context: {
        enterpriseId,
        knownInfo: {},
        serviceStage: 'initial',
        pendingQuestions: [],
        conversationSummary: '新会话'
      },
      questionsToAsk: ['您的融资预算大概是多少？', '您对资产类型有什么偏好？', '您期望在哪个区域？'],
      serviceStageUpdated: undefined
    });
  } catch (error) {
    console.error('智能对话失败:', error);
    res.status(500).json({
      success: false,
      error: '智能对话失败'
    });
  }
});

/**
 * GET /api/ai/context/:enterpriseId
 * 获取企业上下文记忆
 */
router.get('/context/:enterpriseId', async (req: Request, res: Response) => {
  try {
    const { enterpriseId } = req.params;
    
    res.json({
      success: true,
      data: {
        enterpriseId,
        extractedInfo: {},
        serviceStage: 'initial',
        pendingQuestions: [],
        conversationCount: 0,
        questionsToAsk: [],
        serviceHistory: []
      }
    });
  } catch (error) {
    console.error('获取上下文失败:', error);
    res.status(500).json({
      success: false,
      error: '获取上下文失败'
    });
  }
});

/**
 * POST /api/ai/context/:enterpriseId/clear
 * 清除企业记忆
 */
router.post('/context/:enterpriseId/clear', async (req: Request, res: Response) => {
  try {
    const { enterpriseId } = req.params;
    
    // 注意：这会删除所有相关记忆，请谨慎使用
    res.json({
      success: true,
      message: '记忆清除功能需要进一步确认'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '操作失败'
    });
  }
});

/**
 * 简单回复生成函数
 * 这里可以接入大模型，当前使用规则+模板
 */
function generateSimpleReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  // 问候
  if (msg.includes('你好') || msg.includes('您好') || msg.includes('hi') || msg.includes('hello')) {
    return '您好！我是智策云的智能融资助手，很高兴为您服务！请问您目前有明确的融资预算吗？';
  }
  
  // 预算/贷款需求
  if (msg.includes('预算') || msg.includes('贷款') || msg.includes('融资') || msg.includes('钱')) {
    return '明白，请问您计划投入多少资金？或者期望贷款多少金额？';
  }
  
  // 资产类型
  if (msg.includes('类型') || msg.includes('什么') || msg.includes('推荐')) {
    return '请问您倾向于哪种类型的资产？住宅、商铺、写字楼、厂房还是其他？';
  }
  
  // 区域
  if (msg.includes('区域') || msg.includes('位置') || msg.includes('哪里')) {
    return '请问您对区域位置有什么要求吗？比如浦东、徐汇、静安等区域。';
  }
  
  // 分析/评估请求
  if (msg.includes('分析') || msg.includes('评估') || msg.includes('测算')) {
    return '好的，我可以帮您进行企业分析和资产评估。请提供以下信息：\n1. 企业财务数据（总资产、负债、营收等）\n2. 或者直接告诉我您想了解的资产信息';
  }
  
  // 匹配请求
  if (msg.includes('匹配') || msg.includes('推荐') || msg.includes('找')) {
    return '好的，我现在为您进行智能匹配！\n\n';
  }
  
  // 联系方式
  if (msg.includes('电话') || msg.includes('联系') || msg.includes('方式')) {
    return '您可以拨打我们的服务热线或留下您的联系方式，我们的专业顾问会尽快与您联系。';
  }
  
  // 感谢
  if (msg.includes('谢谢') || msg.includes('感谢')) {
    return '不客气！很高兴能帮到您。如果还有其他问题，随时告诉我。';
  }
  
  // 默认回复
  return '明白了。请问还有什么我可以帮您的？';
}

export default router;
