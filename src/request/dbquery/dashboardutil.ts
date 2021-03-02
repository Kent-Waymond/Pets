import { IDashboardRecordStatisticType } from '@/pages/dashboard/type';
import { computeTimeDistance, formatStringToTimestamp } from '@/utils/date';

export interface IDBQueryNodeStatisticRecord {
  time: string;
  nodeId: string;
  bytes_recv?: number;
  bytes_sent?: number;
  cpu_percent?: number;
  disk_percent?: number;
  disk_used?: number;
  mem_percent?: number;
  mem_used?: number;
}

// 生成实例网络监控数据
function computeInstanceBound(
  newestData: (string | number)[],
  olderData: (string | number)[],
): { Inbound: number; Outbound: number } {
  if (newestData instanceof Array && olderData instanceof Array) {
    const newestTime = (newestData[0] as string) || '0';
    const newestNetReceivedMb = (newestData[9] as number) || 0;
    const newestNetTransmittedMb = (newestData[10] as number) || 0;

    const olderTime = (olderData[0] as string) || '0';
    const olderNetReceivedMb = (olderData[9] as number) || 0;
    const olderTransmittedMb = (olderData[10] as number) || 0;

    if (newestTime !== '0' && olderTime !== '0') {
      const distanceTime = computeTimeDistance(newestTime, olderTime);
      const distanceRecieveByte =
        (newestNetReceivedMb - olderNetReceivedMb) * 1024 * 1024;
      const distanceTransmitByte =
        (newestNetTransmittedMb - olderTransmittedMb) * 1024 * 1024;

      const Inbound =
        Number(Math.abs(distanceRecieveByte / distanceTime).toFixed(2)) || 0;
      const Outbound =
        Number(Math.abs(distanceTransmitByte / distanceTime).toFixed(2)) || 0;

      return {
        Inbound,
        Outbound,
      };
    }
  }

  return {
    Inbound: 0,
    Outbound: 0,
  };
}

// 生成节点网络监控数据
function computeNodeBound(
  newestData: IDBQueryNodeStatisticRecord,
  olderData: IDBQueryNodeStatisticRecord,
): { Inbound: number; Outbound: number } {
  if (newestData && olderData) {
    const newestTime = newestData.time || '0';
    const newestNetReceivedByte = newestData.bytes_recv || 0;
    const newestNetTransmittedByte = newestData.bytes_sent || 0;

    const olderTime = olderData.time || '0';
    const olderNetReceivedByte = olderData.bytes_recv || 0;
    const olderTransmittedByte = olderData.bytes_sent || 0;

    if (newestTime !== '0' && olderTime !== '0') {
      const distanceTime = computeTimeDistance(newestTime, olderTime);
      const distanceRecieveByte = newestNetReceivedByte - olderNetReceivedByte;
      const distanceTransmitByte =
        newestNetTransmittedByte - olderTransmittedByte;

      const Inbound =
        Number(Math.abs(distanceRecieveByte / distanceTime).toFixed(2)) || 0;
      const Outbound =
        Number(Math.abs(distanceTransmitByte / distanceTime).toFixed(2)) || 0;

      return {
        Inbound,
        Outbound,
      };
    }
  }

  return {
    Inbound: 0,
    Outbound: 0,
  };
}

// 生成实例监控展示数据
export function computeInstanceStatistic(
  statisticData: Array<string | number>[],
): IDashboardRecordStatisticType {
  if (statisticData instanceof Array && statisticData.length > 1) {
    const [newestData = [], olderData = []] = statisticData;
    const { Inbound, Outbound } = computeInstanceBound(newestData, olderData);
    const StatisticTime = (newestData[0] as string) || '0';
    const CPUPercent = parseInt(newestData[2] as string) || 0;
    const StoragePercent = parseInt(newestData[5] as string) || 0;
    const MEMPercent = parseInt(newestData[8] as string) || 0;
    const MEMUsed = parseInt(newestData[7] as string) || 0;
    const StorageUsed = parseInt(newestData[4] as string) || 0;
    return {
      StatisticTime: formatStringToTimestamp(StatisticTime),
      Inbound,
      Outbound,
      CPUPercent,
      MEMPercent,
      MEMUsed,
      StoragePercent,
      StorageUsed,
    };
  }

  return {
    StatisticTime: 0,
    Inbound: 0,
    Outbound: 0,
    CPUPercent: 0,
    MEMPercent: 0,
    StoragePercent: 0,
    MEMUsed: 0,
    StorageUsed: 0,
  };
}

// 生成节点监控展示数据
export function computeNodeStatistic(
  statisticData: IDBQueryNodeStatisticRecord[],
): IDashboardRecordStatisticType {
  if (statisticData instanceof Array && statisticData.length > 1) {
    const [newestData, olderData] = statisticData;
    const { Inbound, Outbound } = computeNodeBound(newestData, olderData);
    const {
      time,
      cpu_percent,
      mem_percent,
      disk_percent,
      mem_used,
      disk_used,
    } = newestData;
    const StatisticTime = time || '0';
    const CPUPercent = Number(cpu_percent) || 0;
    const StoragePercent = Number(disk_percent) || 0;
    const MEMPercent = Number(mem_percent) || 0;
    const MEMUsed = Number(mem_used) || 0;
    const StorageUsed = Number(disk_used) || 0;

    return {
      StatisticTime: formatStringToTimestamp(StatisticTime),
      Inbound,
      Outbound,
      CPUPercent,
      MEMPercent,
      MEMUsed,
      StoragePercent,
      StorageUsed,
    };
  }

  return {
    StatisticTime: 0,
    Inbound: 0,
    Outbound: 0,
    CPUPercent: 0,
    MEMPercent: 0,
    StoragePercent: 0,
    MEMUsed: 0,
    StorageUsed: 0,
  };
}

// 结合name,key数组以及value数组来合并生成对象数组
export function mergeArrayColumnAndValues(
  name: string,
  columns: string[],
  values: any[][],
): IDBQueryNodeStatisticRecord[] {
  let valueObjArr = [];
  if (columns instanceof Array && values instanceof Array) {
    for (let value of values) {
      if (value instanceof Array) {
        let obj: IDBQueryNodeStatisticRecord = {
          time: '0',
          nodeId: '',
        };
        // 是否注入value中的所有内容
        // columns.forEach((column: string, index: number) => {
        //   if (value[index] !== null) {
        //     obj[column] = value[index]
        //   }
        // })
        obj['time'] = value[columns.indexOf('time')] || '0';
        obj['nodeId'] = value[columns.indexOf('nodeId')] || '0';
        if (name == 'cpu') {
          let usage_user = Number(value[columns.indexOf('usage_user')]) || 0;
          let usage_system =
            Number(value[columns.indexOf('usage_system')]) || 0;
          let usage_irq = Number(value[columns.indexOf('usage_irq')]) || 0;
          let usage_softirq =
            Number(value[columns.indexOf('usage_softirq')]) || 0;
          obj['cpu_percent'] =
            Number(
              Number(
                usage_user + usage_system + usage_irq + usage_softirq,
              ).toFixed(2),
            ) || 0;
        } else if (name === 'mem') {
          let used_percent =
            Number(value[columns.indexOf('used_percent')]) || 0;
          let used = Number(value[columns.indexOf('used')]) || 0;
          obj['mem_percent'] = Number(used_percent.toFixed(2)) || 0;
          obj['mem_used'] = Number(used.toFixed(2)) || 0;
        } else if (name === 'disk') {
          let used_percent =
            Number(value[columns.indexOf('used_percent')]) || 0;
          let used = Number(value[columns.indexOf('used')]) || 0;
          obj['disk_percent'] = Number(used_percent.toFixed(2)) || 0;
          obj['disk_used'] = Number(used.toFixed(2)) || 0;
        } else if (name === 'net') {
          let bytes_recv = Number(value[columns.indexOf('bytes_recv')]) || 0;
          let bytes_sent = Number(value[columns.indexOf('bytes_sent')]) || 0;
          obj['bytes_recv'] = Number(bytes_recv.toFixed(2)) || 0;
          obj['bytes_sent'] = Number(bytes_sent.toFixed(2)) || 0;
        }
        valueObjArr.push(obj);
      }
    }
  }

  return valueObjArr;
}
