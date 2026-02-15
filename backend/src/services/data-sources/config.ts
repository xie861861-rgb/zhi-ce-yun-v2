/**
 * 数据源配置
 * 在 .env 中配置各平台 API Key
 */

// 阿里拍卖配置
export const aliAuction = {
  appKey: process.env.ALI_AUCTION_APP_KEY || '',
  appSecret: process.env.ALI_AUCTION_APP_SECRET || '',
  apiUrl: 'https://api.alicdn.com',
  enabled: !!(process.env.ALI_AUCTION_APP_KEY && process.env.ALI_AUCTION_APP_SECRET),
};

// 京东法拍配置
export const jdAuction = {
  appKey: process.env.JD_AUCTION_APP_KEY || '',
  appSecret: process.env.JD_AUCTION_APP_SECRET || '',
  apiUrl: 'https://api.jd.com',
  enabled: !!(process.env.JD_AUCTION_APP_KEY && process.env.JD_AUCTION_APP_SECRET),
};

// 房估估估值API配置
export const fangGugu = {
  appKey: process.env.FANGGUGU_APP_KEY || '',
  apiUrl: 'https://api.fang估估.com', // 待确认实际API地址
  enabled: !!process.env.FANGGUGU_APP_KEY,
};

// 汇法网司法数据配置
export const huiFaWang = {
  appKey: process.env.HUIFAWANG_APP_KEY || '',
  apiUrl: 'https://api.huifawang.com',
  enabled: !!process.env.HUIFAWANG_APP_KEY,
};

// Tushare金融数据配置
export const tushare = {
  token: process.env.TUSHARE_TOKEN || '',
  apiUrl: 'http://api.tushare.pro',
  enabled: !!process.env.TUSHARE_TOKEN,
};

// 央行利率数据（免费接口）
export const pbc = {
  apiUrl: 'http://www.pbc.gov.cn',
  enabled: true,
};

// 数据源状态检查
export function getDataSourceStatus() {
  return {
    aliAuction: aliAuction.enabled,
    jdAuction: jdAuction.enabled,
    fangGugu: fangGugu.enabled,
    huiFaWang: huiFaWang.enabled,
    tushare: tushare.enabled,
    pbc: pbc.enabled,
  };
}
