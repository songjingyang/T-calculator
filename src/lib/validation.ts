import { z } from 'zod';

// 交易表单验证模式
export const tradeFormSchema = z.object({
  stockCode: z
    .string()
    .min(1, '请输入股票代码')
    .regex(/^[0-9]{6}$/, '股票代码必须是6位数字')
    .refine((code) => {
      // 验证股票代码格式（沪深股市）
      const firstDigit = code.charAt(0);
      return ['0', '1', '2', '3', '6', '7', '8', '9'].includes(firstDigit);
    }, '请输入有效的股票代码'),
  
  stockName: z
    .string()
    .optional(),
  
  buyPrice: z
    .number()
    .min(0.01, '买入价格必须大于0.01')
    .max(9999.99, '买入价格不能超过9999.99')
    .refine((price) => {
      // 验证价格精度（最多2位小数）
      return Number.isInteger(price * 100);
    }, '价格最多保留2位小数'),
  
  sellPrice: z
    .number()
    .min(0.01, '卖出价格必须大于0.01')
    .max(9999.99, '卖出价格不能超过9999.99')
    .refine((price) => {
      return Number.isInteger(price * 100);
    }, '价格最多保留2位小数'),
  
  quantity: z
    .number()
    .int('交易数量必须是整数')
    .min(100, '最少交易100股')
    .max(999999900, '交易数量过大')
    .refine((qty) => {
      // A股必须是100的整数倍
      return qty % 100 === 0;
    }, '交易数量必须是100的整数倍'),
  
  brokerId: z
    .string()
    .min(1, '请选择券商'),
  
  tradeDate: z
    .string()
    .min(1, '请选择交易日期')
    .refine((date) => {
      // 验证日期格式和有效性
      const parsedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // 设置为今天的最后一刻
      
      return !isNaN(parsedDate.getTime()) && parsedDate <= today;
    }, '请选择有效的日期，不能超过今天'),
});

// 自定义券商验证模式
export const customBrokerSchema = z.object({
  name: z
    .string()
    .min(1, '请输入券商名称')
    .max(50, '券商名称不能超过50个字符'),
  
  commissionRate: z
    .number()
    .min(0.1, '佣金费率不能低于万分之0.1')
    .max(30, '佣金费率不能超过万分之30'),
  
  minCommission: z
    .number()
    .min(0.1, '最低佣金不能低于0.1元')
    .max(100, '最低佣金不能超过100元'),
});

// 导出类型
export type TradeFormData = z.infer<typeof tradeFormSchema>;
export type CustomBrokerData = z.infer<typeof customBrokerSchema>;

// 验证股票代码格式
export function validateStockCode(code: string): boolean {
  if (!/^[0-9]{6}$/.test(code)) {
    return false;
  }
  
  const firstDigit = code.charAt(0);
  return ['0', '1', '2', '3', '6', '7', '8', '9'].includes(firstDigit);
}

// 格式化股票代码显示
export function formatStockCode(code: string): string {
  if (!code || code.length !== 6) {
    return code;
  }
  
  const firstDigit = code.charAt(0);
  let prefix = '';
  
  if (['0', '1', '2', '3'].includes(firstDigit)) {
    prefix = 'SZ'; // 深圳
  } else if (['6', '7', '8', '9'].includes(firstDigit)) {
    prefix = 'SH'; // 上海
  }
  
  return prefix ? `${prefix}${code}` : code;
}

// 验证交易时间（工作日）
export function isValidTradingDay(date: Date): boolean {
  const day = date.getDay();
  // 0 = 周日, 6 = 周六
  return day !== 0 && day !== 6;
}

// 格式化金额显示
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// 格式化百分比显示
export function formatPercentage(rate: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(rate / 100);
}
