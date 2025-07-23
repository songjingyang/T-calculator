"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import Button from "./ui/Button";
import { Sun, Moon, Calculator } from "lucide-react";

export default function Header() {
  const { theme, setTheme } = useAppStore();

  // 初始化主题
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo和标题 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                A股做T计算器
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                专业的股票日内交易成本计算工具
              </p>
            </div>
          </div>

          {/* 主题切换按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
            aria-label={`切换到${theme === "light" ? "深色" : "浅色"}主题`}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
