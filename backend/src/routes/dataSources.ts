import { Router, Request, Response } from 'express';
import { dataService } from '../services/data-sources';

const router = Router();

/**
 * 获取数据源状态
 * GET /api/data-sources/status
 */
router.get('/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: dataService.getStatus(),
  });
});

/**
 * 获取法拍资产列表
 * GET /api/data-sources/properties
 */
router.get('/properties', async (req: Request, res: Response) => {
  try {
    const { province, city, district, type, page, pageSize } = req.query;
    
    const result = await dataService.getProperties({
      province: province as string,
      city: city as string,
      district: district as string,
      type: type as string,
      page: page ? parseInt(page as string) : 1,
      pageSize: pageSize ? parseInt(pageSize as string) : 20,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : '获取资产列表失败',
      },
    });
  }
});

/**
 * 搜索法拍资产
 * GET /api/data-sources/search
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { keyword, province, city, type, minPrice, maxPrice } = req.query;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_KEYWORD',
          message: '请提供搜索关键词',
        },
      });
    }

    const result = await dataService.searchProperties(keyword as string, {
      province: province as string,
      city: city as string,
      type: type as string,
      minPrice: minPrice ? parseInt(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : '搜索失败',
      },
    });
  }
});

/**
 * 房产估值
 * POST /api/data-sources/valuate
 */
router.post('/valuate', async (req: Request, res: Response) => {
  try {
    const result = await dataService.valuateProperty(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : '估值失败',
      },
    });
  }
});

/**
 * 司法数据查询
 * GET /api/data-sources/legal/:name
 */
router.get('/legal/:name', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const { idCard } = req.query;
    
    const result = await dataService.getLegalInfo(name, idCard as string);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : '查询失败',
      },
    });
  }
});

/**
 * 宏观金融数据
 * GET /api/data-sources/macro
 */
router.get('/macro', async (req: Request, res: Response) => {
  try {
    const result = await dataService.getMacroData();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : '获取数据失败',
      },
    });
  }
});

/**
 * 智能匹配 - 客户需求推荐
 * POST /api/data-sources/match
 */
router.post('/match', async (req: Request, res: Response) => {
  try {
    const result = await dataService.matchPropertiesForCustomer(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : '匹配失败',
      },
    });
  }
});

export default router;
