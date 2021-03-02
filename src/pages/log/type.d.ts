export interface OperationLog {
  id: string;
  operatorName: string; //操作员名
  actionId: string; //操作名id
  detail: string; //日志详情
  result: number; //操作结果
  operateAt: number; //操作时间
  sourceIp: string; //来源IP
}

export interface OperationLogRecord {
  operateLogs: OperationLog[];
  count: number;
}

export interface OperationLogSearchForm {
  startTime: number;
  endTime: number;
  actionType: string;
  result: number;
  keywords: string;
}
export interface OperationLogSearchParams extends OperationLogSearchForm {
  pageNumber: number;
  pageSize: number;
}
