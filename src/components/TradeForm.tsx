"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardContent } from "./ui/Card";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";
import { tradeFormSchema, TradeFormData } from "@/lib/validation";
import { useAppStore } from "@/lib/store";
import { BROKERS } from "@/lib/brokers";

export default function TradeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTrade, selectedBroker, setBroker } = useAppStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<TradeFormData>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      brokerId: selectedBroker,
      tradeDate: new Date().toISOString().split("T")[0], // 今天的日期
    },
  });

  // 监听券商变化 - 使用更稳定的依赖
  const watchedBroker = watch("brokerId");

  useEffect(() => {
    // 只在有明确变化且不为空时更新
    if (
      watchedBroker &&
      watchedBroker !== selectedBroker &&
      watchedBroker.trim() !== ""
    ) {
      setBroker(watchedBroker);
    }
  }, [watchedBroker, selectedBroker, setBroker]);

  const onSubmit = async (data: TradeFormData) => {
    setIsSubmitting(true);

    try {
      // 添加交易记录
      addTrade({
        stockCode: data.stockCode,
        stockName: data.stockName || "",
        buyPrice: data.buyPrice,
        sellPrice: data.sellPrice,
        quantity: data.quantity,
        brokerId: data.brokerId,
        tradeDate: data.tradeDate,
      });

      // 重置表单
      reset({
        stockCode: "",
        stockName: "",
        buyPrice: 0,
        sellPrice: 0,
        quantity: 100,
        brokerId: data.brokerId, // 保持券商选择
        tradeDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("添加交易记录失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const brokerOptions = BROKERS.map((broker) => ({
    value: broker.id,
    label: broker.name,
  }));

  return (
    <Card variant="elevated">
      <CardHeader title="添加交易记录" subtitle="输入做T交易的详细信息" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 股票代码 */}
            <Input
              label="股票代码"
              placeholder="例如: 000001"
              error={errors.stockCode?.message}
              {...register("stockCode")}
            />

            {/* 股票名称 */}
            <Input
              label="股票名称（可选）"
              placeholder="例如: 平安银行"
              error={errors.stockName?.message}
              {...register("stockName")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 买入价格 */}
            <Input
              label="买入价格（元）"
              type="number"
              step="0.01"
              min="0.01"
              max="9999.99"
              placeholder="0.00"
              error={errors.buyPrice?.message}
              {...register("buyPrice", { valueAsNumber: true })}
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
              {...register("sellPrice", { valueAsNumber: true })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* 交易日期 */}
            <Input
              label="交易日期"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              error={errors.tradeDate?.message}
              {...register("tradeDate")}
            />
          </div>

          {/* 券商选择 */}
          <Select
            label="选择券商"
            options={brokerOptions}
            placeholder="请选择券商"
            error={errors.brokerId?.message}
            {...register("brokerId")}
          />

          {/* 提交按钮 */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "添加中..." : "添加交易记录"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
