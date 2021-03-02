import React from 'react';
import { BasicNewLineOverviewChart } from '@/components-compatible/Chart/BasicNewLineOverviewChart';
import { useIntl } from 'umi';
import { MessageDescriptor, defineMessages } from 'react-intl';
import moment from 'moment';
import { AxiosPromise } from 'axios';
import { GetServiceNodeStats } from '@/request/dbquery/graphQuery';

interface INodeCPULineOverviewChartProps {
  NodeId: string;
}

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  CPUUsage: {
    id: 'instance.table.CPUUsage',
    defaultMessage: 'CPU使用率',
  },
  CPUNums: {
    id: 'instance.table.CPUNums',
    defaultMessage: 'CPU核数',
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
    table: 'cpu',
  });
}

export function TimeSecondsLabelFormatter(text: string) {
  return moment(text).format('YYYY-MM-DD HH:mm:ss');
}

export function NodeCPULineOverviewChart(
  props: INodeCPULineOverviewChartProps,
) {
  const { NodeId } = props;

  const intl = useIntl();
  const xAxisKey = 'time';
  const yAxisKey = 'cpu_percent';

  function formatTooltipLabel(...args: any[]) {
    const [_, cpuUsage] = args;

    return {
      name: intl.formatMessage(intlMessages.CPUUsage),
      value: `${cpuUsage}%`,
      // extraName: intl.formatMessage(intlMessages.CPUNums),
      // extra: `${cpuNums}`,
    };
  }

  const chartScale = {
    cpu_percent: {
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
      ResourceName="cpu"
      ResourceId={NodeId}
      XAxisKey={xAxisKey}
      YAxisKey={yAxisKey}
      GetChartRawDataRecord={GetChartRawDataRecord}
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
