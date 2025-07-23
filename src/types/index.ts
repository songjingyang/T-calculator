// A股做T计算器类型定义

// 券商信息
export interface Broker {
  id: string;
  name: string;
  commissionRate: number; // 佣金费率（万分之几）
  minCommission: number; // 最低佣金（元）
}

// 交易记录
export interface TradeRecord {
  id: string;
  stockCode: string; // 股票代码
  stockName?: string; // 股票名称
  buyPrice: number; // 买入价格
  sellPrice: number; // 卖出价格
  quantity: number; // 交易数量（股）
  brokerId: string; // 券商ID
  tradeDate: string; // 交易日期
  createdAt: string; // 创建时间
}

// 费用明细
export interface FeeDetails {
  buyCommission: number; // 买入佣金
  sellCommission: number; // 卖出佣金
  stampTax: number; // 印花税
  transferFee: number; // 过户费
  totalFees: number; // 总费用
}

// 计算结果
export interface CalculationResult {
  buyAmount: number; // 买入金额
  sellAmount: number; // 卖出金额
  grossProfit: number; // 毛利润
  fees: FeeDetails; // 费用明细
  netProfit: number; // 净利润
  profitRate: number; // 收益率（%）
}

// 统计数据
export interface Statistics {
  totalTrades: number; // 总交易次数
  totalProfit: number; // 总盈利
  totalFees: number; // 总费用
  winRate: number; // 胜率（%）
  avgProfit: number; // 平均盈利
}

// 主题类型
export type Theme = 'light' | 'dark';

// 应用状态
export interface AppState {
  trades: TradeRecord[];
  selectedBroker: string;
  theme: Theme;
  addTrade: (trade: Omit<TradeRecord, 'id' | 'createdAt'>) => void;
  removeTrade: (id: string) => void;
  updateTrade: (id: string, trade: Partial<TradeRecord>) => void;
  setBroker: (brokerId: string) => void;
  setTheme: (theme: Theme) => void;
  clearTrades: () => void;
}
