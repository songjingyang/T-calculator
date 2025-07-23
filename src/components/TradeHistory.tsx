'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import Button from './ui/Button';
import { useAppStore } from '@/lib/store';
import { getBrokerById } from '@/lib/brokers';
import { calculateTradeResult } from '@/lib/calculator';
import { formatCurrency, formatPercentage, formatStockCode } from '@/lib/validation';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';

export default function TradeHistory() {
  const { trades, removeTrade, clearTrades } = useAppStore();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  if (trades.length === 0) {
    return (
      <Card>
        <CardHeader title="交易历史" subtitle="您的做T交易记录" />
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>暂无交易记录</p>
            <p className="text-sm mt-2">添加您的第一笔交易记录开始使用</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const handleClearAll = () => {
    if (showConfirmClear) {
      clearTrades();
      setShowConfirmClear(false);
    } else {
      setShowConfirmClear(true);
      // 3秒后自动取消确认状态
      setTimeout(() => setShowConfirmClear(false), 3000);
    }
  };
  
  return (
    <Card variant="elevated">
      <CardHeader 
        title="交易历史" 
        subtitle={`共 ${trades.length} 笔交易记录`}
      />
      <CardContent>
        <div className="space-y-4">
          {/* 操作按钮 */}
          <div className="flex justify-end">
            <Button
              variant={showConfirmClear ? 'danger' : 'outline'}
              size="sm"
              onClick={handleClearAll}
            >
              {showConfirmClear ? '确认清空' : '清空记录'}
            </Button>
          </div>
          
          {/* 交易记录列表 */}
          <div className="space-y-3">
            {trades.map((trade) => {
              const broker = getBrokerById(trade.brokerId);
              if (!broker) return null;
              
              const result = calculateTradeResult(
                trade.buyPrice,
                trade.sellPrice,
                trade.quantity,
                broker
              );
              
              const isProfit = result.netProfit > 0;
              const profitColor = isProfit 
                ? 'text-green-600 dark:text-green-400' 
                : result.netProfit < 0 
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400';
              
              return (
                <div
                  key={trade.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* 股票信息 */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatStockCode(trade.stockCode)}
                        </span>
                        {trade.stockName && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {trade.stockName}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(trade.tradeDate).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      
                      {/* 交易详情 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-2">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">买入:</span>
                          <span className="ml-1 font-medium">¥{trade.buyPrice}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">卖出:</span>
                          <span className="ml-1 font-medium">¥{trade.sellPrice}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">数量:</span>
                          <span className="ml-1 font-medium">{trade.quantity}股</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">券商:</span>
                          <span className="ml-1 font-medium">{broker.name}</span>
                        </div>
                      </div>
                      
                      {/* 盈亏结果 */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {isProfit ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : result.netProfit < 0 ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : null}
                          <span className={`font-semibold ${profitColor}`}>
                            {result.netProfit >= 0 ? '+' : ''}{formatCurrency(result.netProfit)}
                          </span>
                        </div>
                        <span className={`text-sm ${profitColor}`}>
                          {result.profitRate >= 0 ? '+' : ''}{formatPercentage(result.profitRate)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          费用: {formatCurrency(result.fees.totalFees)}
                        </span>
                      </div>
                    </div>
                    
                    {/* 删除按钮 */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTrade(trade.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
