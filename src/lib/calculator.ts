import { Broker, FeeDetails, CalculationResult, TradeRecord, Statistics } from '@/types';

// A股交易费率常量
export const TRADING_RATES = {
  STAMP_TAX_RATE: 0.001, // 印花税：千分之1（仅卖出收取）
  TRANSFER_FEE_RATE: 0.00002, // 过户费：万分之0.2（双向收取）
  REGULATORY_FEE_RATE: 0.00002, // 规费：万分之0.2（双向收取）
} as const;

/**
 * 计算佣金
 * @param amount 交易金额
 * @param broker 券商信息
 * @returns 佣金金额
 */
export function calculateCommission(amount: number, broker: Broker): number {
  const commission = amount * (broker.commissionRate / 10000);
  return Math.max(commission, broker.minCommission);
}

/**
 * 计算印花税（仅卖出收取）
 * @param sellAmount 卖出金额
 * @returns 印花税金额
 */
export function calculateStampTax(sellAmount: number): number {
  return sellAmount * TRADING_RATES.STAMP_TAX_RATE;
}

/**
 * 计算过户费（双向收取）
 * @param amount 交易金额
 * @returns 过户费金额
 */
export function calculateTransferFee(amount: number): number {
  return amount * TRADING_RATES.TRANSFER_FEE_RATE;
}

/**
 * 计算规费（双向收取）
 * @param amount 交易金额
 * @returns 规费金额
 */
export function calculateRegulatoryFee(amount: number): number {
  return amount * TRADING_RATES.REGULATORY_FEE_RATE;
}

/**
 * 计算费用明细
 * @param buyAmount 买入金额
 * @param sellAmount 卖出金额
 * @param broker 券商信息
 * @returns 费用明细
 */
export function calculateFees(
  buyAmount: number,
  sellAmount: number,
  broker: Broker
): FeeDetails {
  // 买入佣金
  const buyCommission = calculateCommission(buyAmount, broker);
  
  // 卖出佣金
  const sellCommission = calculateCommission(sellAmount, broker);
  
  // 印花税（仅卖出）
  const stampTax = calculateStampTax(sellAmount);
  
  // 过户费（双向）
  const buyTransferFee = calculateTransferFee(buyAmount);
  const sellTransferFee = calculateTransferFee(sellAmount);
  const transferFee = buyTransferFee + sellTransferFee;
  
  // 规费（双向）
  const buyRegulatoryFee = calculateRegulatoryFee(buyAmount);
  const sellRegulatoryFee = calculateRegulatoryFee(sellAmount);
  const regulatoryFee = buyRegulatoryFee + sellRegulatoryFee;
  
  // 总费用
  const totalFees = buyCommission + sellCommission + stampTax + transferFee + regulatoryFee;
  
  return {
    buyCommission: Math.round(buyCommission * 100) / 100,
    sellCommission: Math.round(sellCommission * 100) / 100,
    stampTax: Math.round(stampTax * 100) / 100,
    transferFee: Math.round(transferFee * 100) / 100,
    totalFees: Math.round(totalFees * 100) / 100,
  };
}

/**
 * 计算做T结果
 * @param buyPrice 买入价格
 * @param sellPrice 卖出价格
 * @param quantity 交易数量
 * @param broker 券商信息
 * @returns 计算结果
 */
export function calculateTradeResult(
  buyPrice: number,
  sellPrice: number,
  quantity: number,
  broker: Broker
): CalculationResult {
  // 交易金额
  const buyAmount = buyPrice * quantity;
  const sellAmount = sellPrice * quantity;
  
  // 毛利润
  const grossProfit = sellAmount - buyAmount;
  
  // 费用明细
  const fees = calculateFees(buyAmount, sellAmount, broker);
  
  // 净利润
  const netProfit = grossProfit - fees.totalFees;
  
  // 收益率（基于买入金额）
  const profitRate = buyAmount > 0 ? (netProfit / buyAmount) * 100 : 0;
  
  return {
    buyAmount: Math.round(buyAmount * 100) / 100,
    sellAmount: Math.round(sellAmount * 100) / 100,
    grossProfit: Math.round(grossProfit * 100) / 100,
    fees,
    netProfit: Math.round(netProfit * 100) / 100,
    profitRate: Math.round(profitRate * 10000) / 10000, // 保留4位小数
  };
}

/**
 * 计算统计数据
 * @param trades 交易记录列表
 * @param brokers 券商映射
 * @returns 统计数据
 */
export function calculateStatistics(
  trades: TradeRecord[],
  getBroker: (id: string) => Broker | undefined
): Statistics {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      totalProfit: 0,
      totalFees: 0,
      winRate: 0,
      avgProfit: 0,
    };
  }
  
  let totalProfit = 0;
  let totalFees = 0;
  let winCount = 0;
  
  trades.forEach(trade => {
    const broker = getBroker(trade.brokerId);
    if (broker) {
      const result = calculateTradeResult(
        trade.buyPrice,
        trade.sellPrice,
        trade.quantity,
        broker
      );
      totalProfit += result.netProfit;
      totalFees += result.fees.totalFees;
      if (result.netProfit > 0) {
        winCount++;
      }
    }
  });
  
  const winRate = (winCount / trades.length) * 100;
  const avgProfit = totalProfit / trades.length;
  
  return {
    totalTrades: trades.length,
    totalProfit: Math.round(totalProfit * 100) / 100,
    totalFees: Math.round(totalFees * 100) / 100,
    winRate: Math.round(winRate * 100) / 100,
    avgProfit: Math.round(avgProfit * 100) / 100,
  };
}
