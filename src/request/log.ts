import axios from './basicRequest';

// 获取操作日志列表 ListOperateLogs
export function ListOperateLogs({
  pageNumber,
  pageSize,
  startTime,
  endTime,
  actionType = '',
  result = 0,
  keywords = '',
}: any) {
  return axios.appPost('/operateLog/listOperateLogs', {
    pageNumber,
    pageSize,
    startTime,
    endTime,
    actionType,
    result,
    keywords,
  });
}
