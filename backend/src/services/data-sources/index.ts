/**
 * 统一数据服务 - 数据源聚合
 */

import { getDataSourceStatus } from './config';
import { aliAuctionService } from './aliAuction';
import { jdAuctionService } from './jdAuction';
import { fangGuguService } from './fangGugu';
import { huiFaWangService } from './huiFaWang';
import { tushareService } from './tushare';
import type { AuctionProperty, ValuationRequest, LegalInfo, CustomerDemand, MacroData, ApiResponse } from './types';

/**
 * 统一数据服务类
 */
export class DataService {
  /**
   * 获取所有数据源状态
   */
  getStatus() {
    return {
      ...getDataSourceStatus(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 从多个数据源获取法拍资产列表
   */
  async getProperties(params: {
    province?: string;
    city?: string;
    district?: string;
    type?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<AuctionProperty[]>> {
    const results: AuctionProperty[] = [];
    const errors: string[] = [];

    // 并行从各数据源获取
    const promises = [
      aliAuctionService.getProperties(params).then(r => {
        if (r.success && r.data) results.push(...r.data);
        else if (r.error) errors.push(`阿里: ${r.error.message}`);
      }),
      jdAuctionService.getProperties(params).then(r => {
        if (r.success && r.data) results.push(...r.data);
        else if (r.error) errors.push(`京东: ${r.error.message}`);
      }),
    ];

    await Promise.all(promises);

    if (results.length === 0 && errors.length > 0) {
      return {
        success: false,
        error: {
          code: 'ALL_SOURCES_FAILED',
          message: errors.join('; '),
        },
      };
    }

    // 按价格排序
    results.sort((a, b) => a.startPrice - b.startPrice);

    return {
      success: true,
      data: results,
      meta: {
        total: results.length,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        source: 'aggregated',
      },
    };
  }

  /**
   * 搜索法拍资产
   */
  async searchProperties(keyword: string, searchParams?: {
    province?: string;
    city?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    district?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<AuctionProperty[]>> {
    const results: AuctionProperty[] = [];

    const params: any = searchParams || {};
    const options: any = {
      province: params.province,
      city: params.city,
      district: params.district,
      type: params.type,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
    };

    const promises = [
      aliAuctionService.getProperties(options).then((r: any) => {
        if (r.success && r.data) results.push(...r.data);
      }),
      jdAuctionService.getProperties(options).then((r: any) => {
        if (r.success && r.data) results.push(...r.data);
      }),
    ];

    await Promise.all(promises);

    return {
      success: true,
      data: results,
      meta: {
        total: results.length,
        source: 'aggregated',
      },
    };
  }

  /**
   * 房产估值
   */
  async valuateProperty(request: ValuationRequest): Promise<ApiResponse<any>> {
    // 优先使用房估估
    if (fangGuguService.isConfigured()) {
      return fangGuguService.valuate(request);
    }

    // TODO: 可以添加其他估值源作为备选

    return {
      success: false,
      error: {
        code: 'NO_VALUATION_SOURCE',
        message: '暂无可用的估值服务，请配置房估估API',
      },
    };
  }

  /**
   * 司法数据查询
   */
  async getLegalInfo(name: string, idCard?: string): Promise<ApiResponse<LegalInfo[]>> {
    if (huiFaWangService.isConfigured()) {
      return huiFaWangService.getLegalInfo(name, idCard);
    }

    return {
      success: false,
      error: {
        code: 'NO_LEGAL_SOURCE',
        message: '暂无可用的司法数据服务，请配置汇法网API',
      },
    };
  }

  /**
   * 获取宏观金融数据
   */
  async getMacroData(): Promise<ApiResponse<MacroData>> {
    if (tushareService.isConfigured()) {
      return tushareService.getMacroData() as any;
    }

    return {
      success: false,
      error: {
        code: 'NO_MACRO_SOURCE',
        message: '暂无可用的宏观数据服务，请配置Tushare API',
      },
    };
  }

  /**
   * 智能匹配 - 根据客户需求推荐资产
   */
  async matchPropertiesForCustomer(demand: CustomerDemand): Promise<ApiResponse<AuctionProperty[]>> {
    // 获取所有资产
    const propertiesResult = await this.getProperties({
      city: demand.preferredCity,
      pageSize: 100,
    });

    if (!propertiesResult.success || !propertiesResult.data) {
      return propertiesResult as any;
    }

    const properties = propertiesResult.data;
    const matched: Array<{ property: AuctionProperty; score: number; reasons: string[] }> = [];

    for (const property of properties) {
      let score = 0;
      const reasons: string[] = [];

      // 区域匹配
      if (demand.preferredAreas?.includes(property.district)) {
        score += 30;
        reasons.push('区域匹配');
      }

      // 类型匹配
      if (demand.preferredTypes?.includes(property.type as any)) {
        score += 20;
        reasons.push('类型匹配');
      }

      // 预算匹配
      if (demand.budgetMin && demand.budgetMax) {
        if (property.startPrice >= demand.budgetMin && property.startPrice <= demand.budgetMax) {
          score += 30;
          reasons.push('预算合适');
        }
      }

      // 面积匹配
      if (demand.minBuildingArea && demand.maxBuildingArea) {
        if (property.buildingArea >= demand.minBuildingArea && property.buildingArea <= demand.maxBuildingArea) {
          score += 20;
          reasons.push('面积合适');
        }
      }

      if (score > 0) {
        matched.push({ property, score, reasons });
      }
    }

    // 按匹配度排序
    matched.sort((a, b) => b.score - a.score);

    return {
      success: true,
      data: matched.slice(0, 10).map(m => m.property),
      meta: {
        total: matched.length,
        source: 'smartMatch',
      },
    };
  }
}

export const dataService = new DataService();
