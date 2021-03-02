import { InstanceRecord } from '@/pages/instance/type';
import { INodeRecord } from '../node/type.d';

export interface IDashboardRecordStatisticType {
  StatisticTime: number;
  CPUPercent: number;
  MEMPercent: number;
  MEMUsed: number;
  StoragePercent: number;
  StorageUsed: number;
  Inbound: number;
  Outbound: number;
}

export interface IDashboardNodeRecord
  extends INodeRecord,
    IDashboardRecordStatisticType {}

export interface IDashboardInstanceRecord
  extends InstanceRecord,
    IDashboardRecordStatisticType {}

export interface IDashboardCardChartData {
  time: string;
  value: number;
}

export interface IDashboardStorageStatisticStatRecord {
  date: string;
  size: number;
}

export interface IDashboardStorageStatistic {
  total: number;
  used: number;
  avg: number;
  predictDays: number;
  free: number;
  stats: IDashboardStorageStatisticStatRecord[];
}
