import React from 'react';
import { BasicNewLineOverviewChart } from '@/components-compatible/Chart/BasicNewLineOverviewChart';
import { useIntl } from 'umi';
import { TimeSecondsLabelFormatter } from './NodeCPULineOverviewChart';
import { MessageDescriptor, defineMessages } from 'react-intl';
import {
  GetServiceContainerStats,
  GetServiceNodeStats,
} from '@/request/dbquery/graphQuery';
import { AxiosPromise } from 'axios';

interface INodeMemLineOverviewChartProps {
  NodeId: string;
}

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  MemUsage: {
    id: 'instance.table.MemUsage',
    defaultMessage: '内存使用率',
  },
  MemStatus: {
    id: 'instance.table.MemStatus',
    defaultMessage: '内存状态',
  },
});

function GetChartRawDataRecord(
  Id: string,
  Type: 'hour' | 'day',
  Value: number,
  Columns: string[],
): AxiosPromise<any> {
  return GetServiceNodeStats({
    NodeId: Id,
    Type,
    Value,
    Columns: Columns,
    table: 'mem',
  });
}

export function NodeMemLineOverviewChart(
  props: INodeMemLineOverviewChartProps,
) {
  const { NodeId } = props;

  const intl = useIntl();
  const xAxisKey = 'time';
  const yAxisKey = 'mem_percent';
  // const memoryLimit = 'memoryLimit';
  // const memoryUsage = 'memoryUsage';

  function formatTooltipLabel(...args: any[]) {
    const [_, memUsage] = args;
    return {
      name: intl.formatMessage(intlMessages.MemUsage),
      value: `${memUsage}%`,
      // extraName: intl.formatMessage(intlMessages.MemStatus),
      // extra: `${memused}/${memlimit}`,
    };
  }

  const chartScale = {
    mem_percent: {
      type: 'linear',
      tickCount: 5,
      min: 0,
      max: 100,
    },
    time: {
      type: 'time',
      tickCount: 12,
      formatter: TimeSecondsLabelFormatter,
    },
  };

  const XAxisKeyLabel = {
    formatter: (text: string) => text.split(' ')[1].slice(0, -3),
  };

  return (
    <BasicNewLineOverviewChart
      ResourceName="mem"
      ResourceId={NodeId}
      XAxisKey={xAxisKey}
      YAxisKey={yAxisKey}
      GetChartRawDataRecord={GetChartRawDataRecord}
      // normalizeCharData={normalizeCharData}
      formatTooltipLabel={formatTooltipLabel}
      chartScale={chartScale}
      XAxisKeyLabel={XAxisKeyLabel}
      QueryColumns={[xAxisKey, yAxisKey]}
      LineTooltipFields={[xAxisKey, yAxisKey]}
      width={800}
      height={300}
    />
  );
}
