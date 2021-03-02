// function formatByteSize 单位限制
const ByteLimitSize = 1 * 1024;
const KiloByteLimitSize = ByteLimitSize * 1024;
const MegaByteLimitSize = KiloByteLimitSize * 1024;
const GigaByteLimitSize = MegaByteLimitSize * 1024;
// const TeraByteLimitSize = GigaByteLimitSize * 1024;

// byte转换为B,KB,MB,GB
export function formatByteSize(
  bytesize: number | string,
  maxUnit: 'B' | 'KB' | 'MB' | 'GB' | 'TB' = 'TB',
): string {
  if (!bytesize) {
    return '0B';
  }
  if (typeof bytesize == 'string') {
    bytesize = parseInt(bytesize);
    if (isNaN(bytesize)) {
      return '0B';
    }
  }

  let size = '';
  if (maxUnit == 'B' || bytesize < ByteLimitSize) {
    // 如果小于1KB转化成B 或最大单位为B
    size = bytesize.toFixed(2) + 'B';
  } else if (maxUnit == 'KB' || bytesize < KiloByteLimitSize) {
    // 如果小于1MB转化成KB 或最大单位为KB
    size = (bytesize / 1024).toFixed(2) + 'KB';
  } else if (maxUnit == 'MB' || bytesize < MegaByteLimitSize) {
    // 如果小于1GB转化成MB 或最大单位为MB
    size = (bytesize / (1024 * 1024)).toFixed(2) + 'MB';
  } else if (maxUnit == 'GB' || bytesize < GigaByteLimitSize) {
    // 如果小于1TB转化成GB  或最大单位为GB
    size = (bytesize / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  } else {
    // 其他转化成TB
    size = (bytesize / (1024 * 1024 * 1024 * 1024)).toFixed(2) + 'TB';
  }

  const sizestr = size + '';
  const len = sizestr.indexOf('.');
  const dec = sizestr.substr(len + 1, 2);
  if (dec == '00') {
    // 当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}

export function formatMegabyteSize(
  megabyte: number | string,
  maxUnit: 'MB' | 'GB' | 'TB' = 'TB',
) {
  if (!megabyte) {
    return '0MB';
  }
  if (typeof megabyte == 'string') {
    megabyte = parseInt(megabyte);
    if (isNaN(megabyte)) {
      return '0MB';
    }
  }

  megabyte = megabyte * 1024 * 1024;
  return formatByteSize(megabyte, maxUnit);
}
