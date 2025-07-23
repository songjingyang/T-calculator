"use client";

import Header from "@/components/Header";
import TradeForm from "@/components/TradeForm";
import LiveCalculator from "@/components/LiveCalculator";
import TradeHistory from "@/components/TradeHistory";
import Statistics from "@/components/Statistics";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 顶部介绍 */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              A股做T成本计算器
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              专业的股票日内交易（做T）成本计算工具，支持多家券商费率，
              精确计算交易成本、盈亏和收益率，帮助您做出更明智的投资决策。
            </p>
          </div>

          {/* 主要功能区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左侧：交易表单和实时计算 */}
            <div className="space-y-6">
              <TradeForm />
              <LiveCalculator />
            </div>

            {/* 右侧：统计和历史 */}
            <div className="space-y-6">
              <Statistics />
              <TradeHistory />
            </div>
          </div>

          {/* 功能说明 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              功能特点
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    精确费率计算
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    支持主流券商费率，包含佣金、印花税、过户费等
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    实时计算
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    输入交易信息即时显示盈亏和收益率
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    交易记录
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    保存交易历史，支持统计分析
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    响应式设计
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    完美支持手机、平板和桌面设备
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 A股做T计算器. 仅供参考，投资有风险，入市需谨慎。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
