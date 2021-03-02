/**
 * 解析实例监控返回数据
 * */

import { AxiosResponse } from 'axios';

export interface GraphQueryContainerResult {
  statement_id: string;
  series: GraphQueryContainerResultSeries[];
}

export interface GraphQueryContainerResultSeries {
  name: string;
  columns: string[];
  values: Array<string>[];
}

export function NormalizeGraphQueryContainerResult(
  response: AxiosResponse,
): GraphQueryContainerResultSeries | null {
  if (response.data?.data && response.data?.data?.results instanceof Array) {
    const dataResults = response.data?.data?.results;
    const results: GraphQueryContainerResult =
      dataResults instanceof Array ? dataResults[0] : null;
    const series: GraphQueryContainerResultSeries | null =
      results.series instanceof Array ? results.series[0] : null;
    return series;
  }
  return null;
}

export function NormalizeGraphQueryNodeMultipleResult(
  response: AxiosResponse,
): { [key: string]: GraphQueryContainerResultSeries } | null {
  if (response.data?.data && response.data?.data?.results instanceof Array) {
    const dataResults = response.data?.data?.results;
    const results: GraphQueryContainerResult =
      dataResults instanceof Array ? dataResults[0] : null;
    const series: GraphQueryContainerResultSeries[] = results.series;
    const result: { [key: string]: GraphQueryContainerResultSeries } = {};
    if (series instanceof Array) {
      series.forEach((item: GraphQueryContainerResultSeries) => {
        result[item.name] = item;
      });
      return result;
    }
  }
  return null;
}
