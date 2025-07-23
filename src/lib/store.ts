/*
 * @Author: songjingyang songjingyang@meishubao.com
 * @Date: 2025-07-23 17:12:13
 * @LastEditors: songjingyang songjingyang@meishubao.com
 * @LastEditTime: 2025-07-23 17:37:54
 * @FilePath: /T-calculator/src/lib/store.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState, TradeRecord } from "@/types";
import { getDefaultBroker } from "./brokers";

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 创建应用状态管理
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      trades: [],
      selectedBroker: getDefaultBroker().id,
      theme: "light",

      // 添加交易记录
      addTrade: (trade) => {
        const newTrade: TradeRecord = {
          ...trade,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          trades: [newTrade, ...state.trades],
        }));
      },

      // 删除交易记录
      removeTrade: (id) => {
        set((state) => ({
          trades: state.trades.filter((trade) => trade.id !== id),
        }));
      },

      // 更新交易记录
      updateTrade: (id, updatedTrade) => {
        set((state) => ({
          trades: state.trades.map((trade) =>
            trade.id === id ? { ...trade, ...updatedTrade } : trade
          ),
        }));
      },

      // 设置券商
      setBroker: (brokerId) => {
        const currentState = get();
        // 防止重复设置相同的券商
        if (currentState.selectedBroker !== brokerId) {
          set({ selectedBroker: brokerId });
        }
      },

      // 设置主题
      setTheme: (theme) => {
        set({ theme });
        // 更新HTML类名以应用主题
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },

      // 清空所有交易记录
      clearTrades: () => {
        set({ trades: [] });
      },
    }),
    {
      name: "t-calculator-storage", // localStorage key
      partialize: (state) => ({
        trades: state.trades,
        selectedBroker: state.selectedBroker,
        theme: state.theme,
      }),
    }
  )
);

// 初始化主题 - 移除自动初始化，由组件负责
