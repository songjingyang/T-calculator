"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardContent } from "./ui/Card";
import Input from "./ui/Input";
import Select from "./ui/Select";
import CalculationResult from "./CalculationResult";
import { useAppStore } from "@/lib/store";
import { BROKERS } from "@/lib/brokers";

export default function LiveCalculator() {
  const { selectedBroker } = useAppStore();

  // 定义部分表单类型
  type PartialTradeForm = {
    stockCode?: string;
    buyPrice?: number;
    sellPrice?: number;
    quantity?: number;
    brokerId?: string;
    tradeDate?: string;
  };

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<PartialTradeForm>({
    defaultValues: {
      stockCode: "",
      buyPrice: undefined,
      sellPrice: undefined,
      quantity: undefined,
      brokerId: selectedBroker,
      tradeDate: new Date().toISOString().split("T")[0],
    },
    mode: "onChange", // 实时验证
  });

  // 监听表单变化 - 分别监听各个字段避免对象引用问题
  const stockCode = watch("stockCode");
  const buyPrice = watch("buyPrice");
  const sellPrice = watch("sellPrice");
  const quantity = watch("quantity");
  const brokerId = watch("brokerId");

  // 使用 useMemo 计算数据，避免不必要的状态更新
  const calculationData = useMemo(
    () => ({
      stockCode: stockCode || "",
      buyPrice: Number(buyPrice) || 0,
      sellPrice: Number(sellPrice) || 0,
      quantity: Number(quantity) || 0,
      brokerId: brokerId || selectedBroker,
    }),
    [stockCode, buyPrice, sellPrice, quantity, brokerId, selectedBroker]
  );

  // 移除券商状态管理，让TradeForm负责券商选择
  // LiveCalculator 只负责实时计算，不管理全局状态

  const brokerOptions = BROKERS.map((broker) => ({
    value: broker.id,
    label: broker.name,
  }));

  return (
    <div className="space-y-6">
      {/* 实时计算表单 */}
      <Card variant="elevated">
        <CardHeader
          title="实时计算器"
          subtitle="输入交易信息，实时查看盈亏计算结果"
        />
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 股票代码 */}
              <Input
                label="股票代码"
                placeholder="例如: 000001"
                error={errors.stockCode?.message}
                {...register("stockCode")}
              />

              {/* 券商选择 */}
              <Select
                label="选择券商"
                options={brokerOptions}
                placeholder="请选择券商"
                error={errors.brokerId?.message}
                {...register("brokerId")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 买入价格 */}
              <Input
                label="买入价格（元）"
                type="number"
                step="0.01"
                min="0.01"
                max="9999.99"
                placeholder="0.00"
                error={errors.buyPrice?.message}
                {...register("buyPrice", {
                  valueAsNumber: true,
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {/* 卖出价格 */}
              <Input
                label="卖出价格（元）"
                type="number"
                step="0.01"
                min="0.01"
                max="9999.99"
                placeholder="0.00"
                error={errors.sellPrice?.message}
                {...register("sellPrice", {
                  valueAsNumber: true,
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {/* 交易数量 */}
              <Input
                label="交易数量（股）"
                type="number"
                step="100"
                min="100"
                placeholder="100"
                helperText="必须是100的整数倍"
                error={errors.quantity?.message}
                {...register("quantity", {
                  valueAsNumber: true,
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 实时计算结果 */}
      <CalculationResult {...calculationData} />
    </div>
  );
}
