'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { useAppStore } from '@/lib/store';
import { getBrokerById } from '@/lib/brokers';
import { calculateStatistics } from '@/lib/calculator';
import { formatCurrency, formatPercentage } from '@/lib/validation';
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, Calculator } from 'lucide-react';

export default function Statistics() {
  const { trades } = useAppStore();
  
  // 计算统计数据
  const stats = useMemo(() => {
    return calculateStatistics(trades, getBrokerById);
  }, [trades]);
  
  if (trades.length === 0) {
    return (
      <Card>
        <CardHeader title="统计概览" subtitle="您的交易统计数据" />
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>暂无统计数据</p>
            <p className="text-sm mt-2">添加交易记录后查看统计信息</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const isOverallProfit = stats.totalProfit > 0;
  const profitColor = isOverallProfit 
    ? 'text-green-600 dark:text-green-400' 
    : stats.totalProfit < 0 
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-600 dark:text-gray-400';
  
  const winRateColor = stats.winRate >= 60 
    ? 'text-green-600 dark:text-green-400'
    : stats.winRate >= 40
    ? 'text-yellow-600 dark:text-yellow-400'
    : 'text-red-600 dark:text-red-400';
  
  return (
    <Card variant="elevated">
      <CardHeader title="统计概览" subtitle="您的交易表现分析" />
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 总盈亏 */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">总盈亏</h4>
              {isOverallProfit ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : stats.totalProfit < 0 ? (
                <TrendingDown className="w-5 h-5 text-red-500" />
              ) : (
                <DollarSign className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <p className={`text-2xl font-bold ${profitColor}`}>
              {stats.totalProfit >= 0 ? '+' : ''}{formatCurrency(stats.totalProfit)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              基于 {stats.totalTrades} 笔交易
            </p>
          </div>
          
          {/* 胜率 */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">胜率</h4>
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <p className={`text-2xl font-bold ${winRateColor}`}>
              {stats.winRate.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {Math.round(stats.totalTrades * stats.winRate / 100)} 胜 / {stats.totalTrades - Math.round(stats.totalTrades * stats.winRate / 100)} 负
            </p>
          </div>
          
          {/* 平均盈利 */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">平均盈利</h4>
              <Calculator className="w-5 h-5 text-green-500" />
            </div>
            <p className={`text-2xl font-bold ${
              stats.avgProfit >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {stats.avgProfit >= 0 ? '+' : ''}{formatCurrency(stats.avgProfit)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              每笔交易平均
            </p>
          </div>
          
          {/* 总交易次数 */}
          <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">交易次数</h4>
              <BarChart3 className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.totalTrades}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              累计交易笔数
            </p>
          </div>
          
          {/* 总费用 */}
          <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">总费用</h4>
              <DollarSign className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(stats.totalFees)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              平均每笔: {formatCurrency(stats.totalFees / stats.totalTrades)}
            </p>
          </div>
          
          {/* 费用占比 */}
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">费用影响</h4>
              <Target className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.totalProfit !== 0 
                ? formatPercentage((stats.totalFees / Math.abs(stats.totalProfit)) * 100)
                : '0%'
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              费用占盈亏比例
            </p>
          </div>
        </div>
        
        {/* 交易表现评价 */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            交易表现评价
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stats.winRate >= 60 && stats.totalProfit > 0 && (
              <p className="text-green-600 dark:text-green-400">
                🎉 表现优秀！高胜率且盈利稳定，继续保持这种交易策略。
              </p>
            )}
            {stats.winRate >= 40 && stats.winRate < 60 && stats.totalProfit > 0 && (
              <p className="text-yellow-600 dark:text-yellow-400">
                👍 表现良好！胜率适中但整体盈利，可以考虑优化交易时机。
              </p>
            )}
            {stats.winRate < 40 || stats.totalProfit <= 0 && (
              <p className="text-red-600 dark:text-red-400">
                ⚠️ 需要改进！建议重新评估交易策略，控制风险。
              </p>
            )}
            <p className="mt-1">
              费用占比 {(stats.totalFees / Math.abs(stats.totalProfit || 1) * 100).toFixed(1)}%，
              {stats.totalFees / Math.abs(stats.totalProfit || 1) > 0.1 
                ? '建议选择佣金更低的券商以降低交易成本。'
                : '交易成本控制良好。'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
