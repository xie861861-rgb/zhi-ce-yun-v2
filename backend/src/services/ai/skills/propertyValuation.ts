/**
 * 资产评估技能模块
 * 智策云V2 - 企业资产匹配平台
 * 
 * 功能：评估资产市场价值、折扣率、投资评分
 */

import type { PropertyValuation, ComparableTransaction } from '../types';

export class PropertyValuationSkill {
  // 深圳各区域单价参考（元/㎡）
  private readonly DISTRICT_PRICES: Record<string, number> = {
    '南山': 80000,
    '福田': 70000,
    '宝安': 55000,
    '龙华': 50000,
    '龙岗': 40000,
    '罗湖': 45000,
    '光明': 42000,
    '坪山': 35000,
    '盐田': 38000,
    '大鹏': 30000
  };
  
  // 物业类型单价调整系数
  private readonly PROPERTY_TYPE_MULTIPLIER: Record<string, number> = {
    'residential': 1.0,   // 住宅基准
    'apartment': 0.85,    // 公寓
    'office': 0.9,        // 写字楼
    'commercial': 0.95,   // 商铺
    'industrial': 0.5,    // 工业厂房
    'factory': 0.45       // 工厂
  };
  
  /**
   * 评估资产价值
   */
  async evaluate(
    property: {
      id: string;
      district?: string;        // 区域
      communityName?: string;   // 小区名称
      buildingArea: number;     // 建筑面积
      propertyType: string;     // 物业类型
      listingPrice?: number;   // 挂牌价/起拍价
      floorNumber?: number;    // 所在楼层
      totalFloors?: number;    // 总楼层
      buildingAge?: number;    // 楼龄
      orientation?: string;     // 朝向
      decoration?: string;      // 装修状况
      hasLease?: boolean;      // 是否有租约
      monthlyRent?: number;    // 月租金
      sourceType?: string;     // 来源类型
    },
    comparables?: ComparableTransaction[]
  ): Promise<PropertyValuation> {
    
    const district = property.district || '南山';
    const basePrice = this.DISTRICT_PRICES[district] || 50000;
    const typeMultiplier = this.PROPERTY_TYPE_MULTIPLIER[property.propertyType] || 1.0;
    
    // 1. 估算市场价（市场比较法）
    const estimatedUnitPrice = this.estimateUnitPrice(
      basePrice,
      typeMultiplier,
      property
    );
    const estimatedMarketPrice = estimatedUnitPrice * property.buildingArea;
    
    // 2. 计算折扣率
    let discountRate = 0;
    if (property.listingPrice && property.listingPrice > 0) {
      discountRate = ((estimatedMarketPrice - property.listingPrice) / estimatedMarketPrice) * 100;
    } else if (property.sourceType === 'auction') {
      // 法拍房默认折扣
      discountRate = 30 + Math.random() * 15; // 30-45%
    }
    
    // 3. 计算与市场价差
    const priceGap = estimatedMarketPrice - (property.listingPrice || estimatedMarketPrice * 0.8);
    
    // 4. 计算租金回报率
    const rentalYield = this.calculateRentalYield(
      property.monthlyRent,
      property.listingPrice || estimatedMarketPrice * 0.8
    );
    
    // 5. 计算投资评分
    const investmentScore = this.calculateInvestmentScore({
      discountRate,
      rentalYield,
      district,
      propertyType: property.propertyType,
      hasLease: property.hasLease,
      buildingAge: property.buildingAge
    });
    
    // 6. 确定置信度
    const confidence = this.determineConfidence(comparables, district);
    
    // 7. 生成评估报告
    const valuationReport = this.generateReport({
      property,
      estimatedMarketPrice,
      estimatedUnitPrice,
      discountRate,
      rentalYield,
      investmentScore,
      district,
      comparables
    });
    
    return {
      propertyId: property.id,
      estimatedMarketPrice: Math.round(estimatedMarketPrice),
      estimatedUnitPrice: Math.round(estimatedUnitPrice),
      discountRate: Math.round(discountRate * 100) / 100,
      priceGap: Math.round(priceGap),
      rentalYield: Math.round(rentalYield * 100) / 100,
      investmentScore: Math.round(investmentScore),
      valuationReport,
      confidence
    };
  }
  
  /**
   * 估算单价
   */
  private estimateUnitPrice(
    basePrice: number,
    typeMultiplier: number,
    property: any
  ): number {
    let unitPrice = basePrice * typeMultiplier;
    
    // 楼层调整
    if (property.floorNumber && property.totalFloors) {
      const floorRatio = property.floorNumber / property.totalFloors;
      if (floorRatio > 0.7) {
        unitPrice *= 1.05; // 高楼层加价
      } else if (floorRatio < 0.3) {
        unitPrice *= 0.95; // 低楼层降价
      }
    }
    
    // 楼龄调整
    if (property.buildingAge) {
      if (property.buildingAge < 5) {
        unitPrice *= 1.1; // 新房加价
      } else if (property.buildingAge > 20) {
        unitPrice *= 0.9; // 老楼降价
      }
    }
    
    // 装修调整
    if (property.decoration === 'luxury') {
      unitPrice *= 1.15;
    } else if (property.decoration === 'simple') {
      unitPrice *= 0.95;
    }
    
    // 朝向调整
    const goodOrientations = ['南', '东南', '西南'];
    if (property.orientation && goodOrientations.includes(property.orientation)) {
      unitPrice *= 1.05;
    }
    
    return unitPrice;
  }
  
  /**
   * 计算租金回报率
   */
  private calculateRentalYield(monthlyRent?: number, price?: number): number {
    if (!monthlyRent || !price || price <= 0) return 0;
    
    const annualRent = monthlyRent * 12;
    return (annualRent / price) * 100;
  }
  
  /**
   * 计算投资评分
   */
  private calculateInvestmentScore(params: {
    discountRate: number;
    rentalYield: number;
    district: string;
    propertyType: string;
    hasLease?: boolean;
    buildingAge?: number;
  }): number {
    let score = 50; // 基础分
    
    // 折扣率评分 (权重40%)
    if (params.discountRate >= 30) {
      score += 40;
    } else if (params.discountRate >= 25) {
      score += 35;
    } else if (params.discountRate >= 20) {
      score += 28;
    } else if (params.discountRate >= 15) {
      score += 20;
    } else if (params.discountRate >= 10) {
      score += 10;
    }
    
    // 租金回报率评分 (权重25%)
    if (params.rentalYield >= 5) {
      score += 25;
    } else if (params.rentalYield >= 4) {
      score += 20;
    } else if (params.rentalYield >= 3) {
      score += 15;
    } else if (params.rentalYield >= 2) {
      score += 10;
    }
    
    // 区域评分 (权重15%)
    const topDistricts = ['南山', '福田', '宝安', '龙华'];
    if (topDistricts.includes(params.district)) {
      score += 15;
    } else {
      score += 10;
    }
    
    // 租约加分 (权重10%)
    if (params.hasLease) {
      score += 10;
    }
    
    // 楼龄加分 (权重10%)
    if (params.buildingAge && params.buildingAge <= 10) {
      score += 10;
    } else if (params.buildingAge && params.buildingAge <= 20) {
      score += 5;
    }
    
    return Math.min(100, score);
  }
  
  /**
   * 确定置信度
   */
  private determineConfidence(
    comparables?: ComparableTransaction[],
    district?: string
  ): 'high' | 'medium' | 'low' {
    if (!comparables || comparables.length === 0) {
      // 无可比交易时，根据区域活跃度判断
      const activeDistricts = ['南山', '福田', '宝安', '龙华'];
      if (district && activeDistricts.includes(district)) {
        return 'medium';
      }
      return 'low';
    }
    
    if (comparables.length >= 10) return 'high';
    if (comparables.length >= 5) return 'medium';
    return 'low';
  }
  
  /**
   * 生成评估报告
   */
  private generateReport(params: any): string {
    const {
      property,
      estimatedMarketPrice,
      estimatedUnitPrice,
      discountRate,
      rentalYield,
      investmentScore,
      district,
      comparables
    } = params;
    
    const marketInWan = (estimatedMarketPrice / 10000).toFixed(0);
    const unitPriceInWan = (estimatedUnitPrice / 10000).toFixed(2);
    
    let report = `# 资产评估报告\n\n`;
    
    report += `## 📍 资产概况\n`;
    report += `- 区域：${district}\n`;
    report += `- 建筑面积：${property.buildingArea}㎡\n`;
    report += `- 物业类型：${property.propertyType}\n`;
    if (property.listingPrice) {
      report += `- 挂牌价：${(property.listingPrice / 10000).toFixed(0)}万\n`;
    }
    
    report += `\n## 💰 估值结果\n`;
    report += `- 预估市场价：${marketInWan}万\n`;
    report += `- 预估单价：${unitPriceInWan}万/㎡\n`;
    report += `- 折扣率：${discountRate.toFixed(1)}%\n`;
    
    if (property.monthlyRent) {
      report += `\n## 🏠 租金收益\n`;
      report += `- 月租金：${property.monthlyRent}元\n`;
      report += `- 年租金回报率：${rentalYield.toFixed(2)}%\n`;
    }
    
    report += `\n## 📊 投资评分\n`;
    report += `- 综合评分：${investmentScore}分\n`;
    report += `- 置信度：${this.getScoreLevel(investmentScore)}\n`;
    
    if (comparables && comparables.length > 0) {
      report += `\n## 📈 可比交易\n`;
      report += `- 参考案例：${comparables.length}套\n`;
    }
    
    return report;
  }
  
  private getScoreLevel(score: number): string {
    if (score >= 80) return '⭐⭐⭐ 优质投资';
    if (score >= 60) return '⭐⭐ 良好';
    if (score >= 40) return '⭐ 一般';
    return '⚠️ 建议观望';
  }
  
  /**
   * 批量评估
   */
  async evaluateBatch(
    properties: any[]
  ): Promise<PropertyValuation[]> {
    const results: PropertyValuation[] = [];
    
    for (const property of properties) {
      try {
        const valuation = await this.evaluate(property);
        results.push(valuation);
      } catch (error) {
        console.error(`评估资产 ${property.id} 失败:`, error);
      }
    }
    
    // 按投资评分排序
    results.sort((a, b) => b.investmentScore - a.investmentScore);
    
    return results;
  }
}

export default PropertyValuationSkill;
