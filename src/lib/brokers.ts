import { Broker } from '@/types';

// 主流券商费率配置
export const BROKERS: Broker[] = [
  {
    id: 'huatai',
    name: '华泰证券',
    commissionRate: 2.5, // 万分之2.5
    minCommission: 5, // 最低5元
  },
  {
    id: 'guotai',
    name: '国泰君安',
    commissionRate: 2.5,
    minCommission: 5,
  },
  {
    id: 'zhongxin',
    name: '中信证券',
    commissionRate: 3.0,
    minCommission: 5,
  },
  {
    id: 'zhaoshang',
    name: '招商证券',
    commissionRate: 2.5,
    minCommission: 5,
  },
  {
    id: 'guangfa',
    name: '广发证券',
    commissionRate: 2.5,
    minCommission: 5,
  },
  {
    id: 'pingan',
    name: '平安证券',
    commissionRate: 2.5,
    minCommission: 5,
  },
  {
    id: 'shenwan',
    name: '申万宏源',
    commissionRate: 3.0,
    minCommission: 5,
  },
  {
    id: 'haitong',
    name: '海通证券',
    commissionRate: 3.0,
    minCommission: 5,
  },
  {
    id: 'dongfang',
    name: '东方财富',
    commissionRate: 2.5,
    minCommission: 5,
  },
  {
    id: 'tonghuashun',
    name: '同花顺',
    commissionRate: 2.5,
    minCommission: 5,
  },
  {
    id: 'custom',
    name: '自定义券商',
    commissionRate: 2.5,
    minCommission: 5,
  },
];

// 根据ID获取券商信息
export function getBrokerById(id: string): Broker | undefined {
  return BROKERS.find(broker => broker.id === id);
}

// 获取默认券商
export function getDefaultBroker(): Broker {
  return BROKERS[0]; // 华泰证券作为默认
}
