import moment from 'moment';

// 格式化为字符串时间
export function formatTimestamp(
  timestamp: string | number,
  format: string = 'YYYY-MM-DD HH:mm:ss',
) {
  timestamp = Number(timestamp);
  if (isNaN(timestamp)) {
    return '-';
  }
  return moment.unix(timestamp).format(format);
}

// 格式化为国际化时间
export function formatLoacleTimestamp(timestamp: string | number) {
  return formatTimestamp(timestamp, 'LL LTS');
}

// 格式化moment为timestamp
export function formatMomentToTimestamp(date: moment.Moment) {
  return date.unix();
}

// 格式化timestamp为moment
export function formatTimestampMoment(timestamp: number | string) {
  timestamp = Number(timestamp) || 0;
  return moment.unix(timestamp);
}
// 格式化string为timestamp
export function formatStringToTimestamp(time: string) {
  return moment(time).unix();
}

export function formatStringTime(
  time: string,
  format: string = 'YYYY-MM-DD HH:mm:ss',
) {
  return moment(time).format(format);
}
export function formatLocaleStringTime(time: string) {
  return formatStringTime(time, 'LL LTS');
}

export function computeTimeDistance(time1: string, time2: string) {
  return formatStringToTimestamp(time1) - formatStringToTimestamp(time2);
}
