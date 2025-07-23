'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { useAppStore } from '@/lib/store';
import { getBrokerById } from '@/lib/brokers';
import { calculateTradeResult } from '@/lib/calculator';
import { formatCurrency, formatPercentage } from '@/lib/validation';

interface CalculationResultProps {
  stockCode?: string;
  buyPrice?: number;
  sellPrice?: number;
  quantity?: number;
  brokerId?: string;
}

export default function CalculationResult({
  stockCode = '',
  buyPrice = 0,
  sellPrice = 0,
  quantity = 0,
  brokerId,
}: CalculationResultProps) {
  const { selectedBroker } = useAppStore();
  
  // 使用传入的券商ID或默认选中的券商
  const currentBrokerId = brokerId || selectedBroker;
  const broker = getBrokerById(currentBrokerId);
  
  // 计算结果
  const result = useMemo(() => {
    if (!broker || buyPrice <= 0 || sellPrice <= 0 || quantity <= 0) {
      return null;
    }
    
    return calculateTradeResult(buyPrice, sellPrice, quantity, broker);
  }, [buyPrice, sellPrice, quantity, broker]);
  
  if (!result) {
    return (
      <Card>
        <CardHeader title="计算结果" subtitle="请输入完整的交易信息查看计算结果" />
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>等待输入交易数据...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const isProfit = result.netProfit > 0;
  const profitColor = isProfit 
    ? 'text-green-600 dark:text-green-400' 
    : result.netProfit < 0 
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-600 dark:text-gray-400';
  
  return (
    <Card variant="elevated">
      <CardHeader 
        title="计算结果" 
        subtitle={stockCode ? `股票代码: ${stockCode}` : '实时计算结果'}
      />
      <CardContent>
        <div className="space-y-6">
          {/* 交易概览 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">买入金额</p>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {formatCurrency(result.buyAmount)}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">卖出金额</p>
              <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                {formatCurrency(result.sellAmount)}
              </p>
            </div>
          </div>
          
          {/* 盈亏结果 */}
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">净盈亏</p>
            <p className={`text-3xl font-bold ${profitColor}`}>
              {result.netProfit >= 0 ? '+' : ''}{formatCurrency(result.netProfit)}
            </p>
            <p className={`text-lg font-medium ${profitColor} mt-1`}>
              收益率: {result.profitRate >= 0 ? '+' : ''}{formatPercentage(result.profitRate)}
            </p>
          </div>
          
          {/* 费用明细 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              费用明细
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">买入佣金:</span>
                <span className="font-medium">{formatCurrency(result.fees.buyCommission)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">卖出佣金:</span>
                <span className="font-medium">{formatCurrency(result.fees.sellCommission)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">印花税:</span>
                <span className="font-medium">{formatCurrency(result.fees.stampTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">过户费:</span>
                <span className="font-medium">{formatCurrency(result.fees.transferFee)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>总费用:</span>
                  <span className="text-red-600 dark:text-red-400">
                    {formatCurrency(result.fees.totalFees)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 毛利润 */}
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">毛利润（未扣费用）</p>
            <p className={`text-lg font-semibold ${
              result.grossProfit >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {result.grossProfit >= 0 ? '+' : ''}{formatCurrency(result.grossProfit)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
