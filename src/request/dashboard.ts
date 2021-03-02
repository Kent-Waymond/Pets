import {
  GraphQueryContainerResultSeries,
  NormalizeGraphQueryNodeMultipleResult,
  NormalizeGraphQueryContainerResult,
} from '@/utils/dbquery';
import {
  GetDashboardInstancesStatisticRecords,
  GetDashboardNodesStatisticRecords,
} from './dbquery/graphQuery';
import { ListInstances } from './instance';
import { InstanceRecord } from '@/pages/instance/type.d';
import {
  IDashboardInstanceRecord,
  IDashboardNodeRecord,
  IDashboardRecordStatisticType,
} from '@/pages/dashboard/type';
import { formatStringToTimestamp } from '@/utils/date';
import { ListHosts } from './host';
import { INodeRecord } from '@/pages/node/type.d';
import {
  mergeArrayColumnAndValues,
  computeNodeStatistic,
  computeInstanceStatistic,
  IDBQueryNodeStatisticRecord,
} from './dbquery/dashboardutil';
import axios from './basicRequest';

// 获取dashboard 实例统计数据列表
export async function ListDashboardInstanceRecords() {
  // 获取实例列表，并筛选出running状态以及id列表
  const InstanceResponse = await ListInstances({ ListAll: true });
  const InstanceList: InstanceRecord[] =
    InstanceResponse.data?.data?.instances || [];
  if (InstanceList instanceof Array && InstanceList.length > 0) {
    const RunningInstances = InstanceList.filter(
      (item: InstanceRecord) => item.status == 'running',
    );
    const InstanceIds = RunningInstances.map((item: InstanceRecord) => item.id);

    // 获取实例监控数据
    const instanceQueryResponse = await GetDashboardInstancesStatisticRecords();

    // 解析实例监控数据
    const instanceQueryResult: GraphQueryContainerResultSeries | null = NormalizeGraphQueryContainerResult(
      instanceQueryResponse,
    );
    // console.log('instanceQueryResult ', instanceQueryResult, InstanceIds);

    // 根据实例id将监控数据分类
    const statisticResult: any = {};
    if (instanceQueryResult) {
      const values = instanceQueryResult.values;
      values.forEach((item: string[]) => {
        const InstanceId = item[6];
        if (InstanceIds.indexOf(InstanceId) > -1) {
          if (!statisticResult[InstanceId]) {
            statisticResult[InstanceId] = [];
          }
          statisticResult[InstanceId].push(item);
        }
      });
    }
    // console.log('ress ', statisticResult);
    /// 将整理好的实例数据与实例列表合并
    const DashboardInstanceRecords = RunningInstances.map(
      (item: InstanceRecord): IDashboardInstanceRecord => {
        const statisticData = statisticResult[item.id];
        const computedStatisticResult = computeInstanceStatistic(statisticData);
        return {
          ...item,
          ...computedStatisticResult,
        };
      },
    );

    // console.log("DashboardInstanceRecords", DashboardInstanceRecords)
    return DashboardInstanceRecords;
  }

  return [];
}

// 获取dashboard 节点统计数据列表
export async function ListDashboardNodeRecords() {
  // 获取节点列表，并筛选出ready状态以及id列表
  const NodeResponse = await ListHosts({ ListAll: true });
  const NodeList: INodeRecord[] = NodeResponse.data?.data?.hosts || [];
  if (NodeList instanceof Array && NodeList.length > 0) {
    const RunningNodes = NodeList.filter(
      (item: INodeRecord) => item.status == 'ready',
    );
    const NodeIds = RunningNodes.map((item: INodeRecord) => item.id);

    // 获取节点监控数据
    const nodeQueryResponse = await GetDashboardNodesStatisticRecords();

    // 解析节点监控数据
    const seriesMap = NormalizeGraphQueryNodeMultipleResult(nodeQueryResponse);

    // console.log("seriesMap ", seriesMap)
    if (seriesMap) {
      const { net, mem, disk, cpu } = seriesMap;
      const netValues = net?.values || [];
      const netColumns = net?.columns || [];
      const netName = net?.name;

      const memValues = mem?.values || [];
      const memColumns = mem?.columns || [];
      const memName = mem?.name;

      const diskValues = disk?.values || [];
      const diskColumns = disk?.columns || [];
      const diskName = disk?.name;

      const cpuValues = cpu?.values || [];
      const cpuColumns = cpu?.columns || [];
      const cpuName = cpu?.name;
      const result: any = {};
      // 根据节点id将监控数据分类
      for (let nodeId of NodeIds) {
        result[nodeId] = [];
        let netValueObjArr = mergeArrayColumnAndValues(
          netName,
          netColumns,
          netValues.filter((item) => nodeId === item[9]),
        );
        let memValueObjArr = mergeArrayColumnAndValues(
          memName,
          memColumns,
          memValues.filter((item) => nodeId === item[9]),
        );
        let diskValueObjArr = mergeArrayColumnAndValues(
          diskName,
          diskColumns,
          diskValues.filter((item) => nodeId === item[9]),
        );
        let cpuValueObjArr = mergeArrayColumnAndValues(
          cpuName,
          cpuColumns,
          cpuValues.filter((item) => nodeId === item[9]),
        );

        result[nodeId].push(...netValueObjArr);
        result[nodeId].push(...memValueObjArr);
        result[nodeId].push(...diskValueObjArr);
        result[nodeId].push(...cpuValueObjArr);
      }

      // console.log("www ", result)
      // 将节点下的数据，按照相同时间，将不同的监控数据（cpu，mem，disk，net）合并为一条，
      // 并按顺序组装为数组
      const statisticResult: any = {};
      for (let nodeId in result) {
        const records = result[nodeId];

        const resultTimeObj: any = {};
        for (let record of records) {
          const time = record.time;
          if (!resultTimeObj[time]) {
            resultTimeObj[time] = [];
          }

          resultTimeObj[time] = { ...resultTimeObj[time], ...record };
        }

        // 根据时间先后将对象中的时间生成一个排序数组，(从新到旧)
        const resultTimeObjKeys = Object.keys(resultTimeObj).sort(
          (a: string, b: string) => {
            return formatStringToTimestamp(b) - formatStringToTimestamp(a);
          },
        );

        // console.log(resultTimeObjKeys)
        // 根据排序好的时间顺序，将对应时间下的监控数据填入数组中
        const resultTimeObjArr = resultTimeObjKeys.map((item: string) => {
          return resultTimeObj[item];
        });
        statisticResult[nodeId] = resultTimeObjArr;
      }

      // console.log('res ', statisticResult);
      // 将整理好的节点数据与节点列表合并
      const DashboardNodeRecords = RunningNodes.map(
        (node: INodeRecord): IDashboardNodeRecord => {
          const statisticData = statisticResult[node.id];
          const computedStatisticResult = computeNodeStatistic(statisticData);
          return {
            ...node,
            ...computedStatisticResult,
          };
        },
      );

      return DashboardNodeRecords;
    }

    return [];
  }
}

// 获取dashboard 近一段时间的统计数据(时间维度)
export async function ListDashboardPlatformStatisticRecords() {
  // 获取节点监控数据
  const nodeQueryResponse = await GetDashboardNodesStatisticRecords();

  // 解析节点监控数据
  const seriesMap = NormalizeGraphQueryNodeMultipleResult(nodeQueryResponse);

  // console.log("seriesMap ", seriesMap)
  if (seriesMap) {
    const { net, mem, disk, cpu } = seriesMap;

    const cpuValues = cpu?.values || [];
    const cpuColumns = cpu?.columns || [];
    const cpuName = cpu?.name;

    const memValues = mem?.values || [];
    const memColumns = mem?.columns || [];
    const memName = mem?.name;

    // const diskValues = disk?.values;
    // const diskColumns = disk?.columns;
    // const diskName = disk?.name;

    // const netValues = net?.values;
    // const netColumns = net?.columns;
    // const netName = net?.name;

    // 根据数据类型 结合column以及value 生成对应的object
    let cpuValueObjArr = mergeArrayColumnAndValues(
      cpuName,
      cpuColumns,
      cpuValues,
    );
    let memValueObjArr = mergeArrayColumnAndValues(
      memName,
      memColumns,
      memValues,
    );
    // let diskValueObjArr = mergeArrayColumnAndValues(
    //   diskName,
    //   diskColumns,
    //   diskValues,
    // );
    // let netValueObjArr = mergeArrayColumnAndValues(
    //   netName,
    //   netColumns,
    //   netValues,
    // );

    // console.log("cpuValueObjArr ", cpuValueObjArr)
    // console.log("memValueObjArr ", memValueObjArr)
    // console.log("diskValueObjArr ", diskValueObjArr)
    // console.log("netValueObjArr ", netValueObjArr)

    let maxArr: any[] = [];
    const valuesArr = [
      cpuValueObjArr,
      memValueObjArr,
      // diskValueObjArr, netValueObjArr
    ];
    // 使用数据最多的统计数据
    valuesArr.forEach((item: IDBQueryNodeStatisticRecord[]) => {
      if (item.length > maxArr.length) {
        maxArr = item.slice(0);
      }
    });

    // 将最多的统计数据中的时间取出
    const times = Array.from(
      new Set(maxArr.map((item: IDBQueryNodeStatisticRecord) => item.time)),
    );
    const result: IDashboardRecordStatisticType[] = [];
    // 遍历时间数组，生成对应时间下的统计数据
    for (let time of times) {
      const value: IDashboardRecordStatisticType = {
        StatisticTime: formatStringToTimestamp(time),
        CPUPercent: 0,
        MEMUsed: 0,
        MEMPercent: 0,
        StoragePercent: 0,
        StorageUsed: 0,
        Inbound: 0,
        Outbound: 0,
      };
      let cputimefound = 0;
      let memtimefound = 0;
      // 计算出当前时间的平均cpu使用率
      cpuValueObjArr.forEach((item: IDBQueryNodeStatisticRecord) => {
        if (item.time === time) {
          cputimefound = cputimefound + 1;
          const cpu_percent = item.cpu_percent ?? 0;
          value.CPUPercent = Number(
            (
              (value.CPUPercent * (cputimefound - 1) + cpu_percent) /
              cputimefound
            ).toFixed(2),
          );
        }
      });
      // 计算出当前时间的内存使用量
      memValueObjArr.forEach((item: IDBQueryNodeStatisticRecord) => {
        if (item.time === time) {
          memtimefound = memtimefound + 1;
          const mem_used = item.mem_used ?? 0;
          value.MEMUsed = Number((value.MEMUsed + mem_used).toFixed(2));
        }
      });

      result.push(value);
    }

    // console.log('qqqq ', result)

    return result;
  }

  return [];
}

// 获取平台存储状况统计 /v1/metrics/platformStorage
export function GetPlatformStorageStatistic({ startTime }: any) {
  return axios.appPost('/metrics/platformStorage', { startTime });
}
