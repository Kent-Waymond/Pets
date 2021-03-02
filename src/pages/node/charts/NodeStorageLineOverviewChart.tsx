import React from 'react';
import { BasicNewLineOverviewChart } from '@/components-compatible/Chart/BasicNewLineOverviewChart';
import { useIntl } from 'umi';
import { TimeSecondsLabelFormatter } from './NodeCPULineOverviewChart';
import { MessageDescriptor, defineMessages } from 'react-intl';
import { GetServiceNodeStats } from '@/request/dbquery/graphQuery';
import { AxiosPromise } from 'axios';

interface INodeStorageLineOverviewChartProps {
  NodeId: string;
}

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  StorageUsage: {
    id: 'instance.table.StorageUsage',
    defaultMessage: '磁盘使用率',
  },
  DiskStatus: {
    id: 'instance.table.DiskStatus',
    defaultMessage: '磁盘状态',
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
    table: 'disk',
  });
}

export function NodeStorageLineOverviewChart(
  props: INodeStorageLineOverviewChartProps,
) {
  const { NodeId } = props;

  const intl = useIntl();
  const xAxisKey = 'time';
  const yAxisKey = 'disk_percent';

  function formatTooltipLabel(...args: any[]) {
    const [_, storageUsage] = args;
    return {
      name: intl.formatMessage(intlMessages.StorageUsage),
      value: `${storageUsage}%`,
    };
  }

  const chartScale = {
    disk_percent: {
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
      ResourceName="disk"
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
