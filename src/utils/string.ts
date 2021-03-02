import { ComponentStateType } from '@/components/_common/type';
import { CommonComponentStates } from '@/components/_common/variable';

export function stringSlice(str: string, len: number = 20) {
  if (str && str.length > len) {
    return str.slice(0, len - 3) + '...';
  }
  return str;
}

export function stringArraySlice(
  strArr: string[],
  len: number,
  separator: string = ',',
) {
  return stringSlice(strArr.join(separator), len);
}

export function normalizeProgressNumber(
  progressNumber: number | string,
): number {
  let percent = Number(progressNumber);
  if (isNaN(percent)) {
    return 0;
  }
  if (percent < 0) {
    return 0;
  }
  if (percent > 100) {
    return 100;
  }

  return percent;
}

export function parseProgressNumberToCommonState(
  progressNumber: number,
): ComponentStateType {
  let percent = normalizeProgressNumber(progressNumber);

  if (percent > 90) {
    return 'danger';
  } else if (percent > 70) {
    return 'warning';
  } else {
    return 'default';
  }
}

export function parseLicenseRemainDaysToCommonState(
  LicenseNumber: number,
): ComponentStateType {
  if (!isNaN(LicenseNumber) && LicenseNumber < 0) {
    return 'default';
  }
  if (LicenseNumber > 15) {
    return 'success';
  } else if (LicenseNumber > 7 && LicenseNumber <= 15) {
    return 'warning';
  } else {
    return 'danger';
  }
}
