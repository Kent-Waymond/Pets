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

export interface INoticeRecord {
  noticeId: string;
  noticeType: string;
  locationId: string;
  content: string;
  title: string;
  createTime: string;
  firstPicture: string;
}

export interface INoticeProfile extends INoticeRecord {}
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
export interface VaccineCountType {
  VaccinedCount: number;
  VaccineAllCount: number;
}
