import React from 'react';
import { BasicLineOverviewChart } from '@/components-compatible/Chart/BasicLineOverviewChart';
import { useIntl } from 'umi';
import { MessageDescriptor, defineMessages } from 'react-intl';
import moment from 'moment';
import { AxiosPromise } from 'axios';
import { GetServiceContainerStats } from '@/request/dbquery/graphQuery';

interface ICPULineOverviewChartProps {
  InstanceId: string;
}

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  CPUUsage: {
    id: 'instance.table.CPUUsage',
    defaultMessage: 'CPU使用率',
  },
});

function GetChartRawDataRecord(
  Id: string,
  Type: 'hour' | 'day',
  Value: number,
  Columns: string[],
): AxiosPromise<any> {
  return GetServiceContainerStats({
    InstanceId: Id,
    Type,
    Value,
    Columns: Columns,
  });
}

export function TimeSecondsLabelFormatter(text: string) {
  return moment(text).format('YYYY-MM-DD HH:mm:ss');
}

export function CPULineOverviewChart(props: ICPULineOverviewChartProps) {
  const { InstanceId } = props;

  const intl = useIntl();
  const xAxisKey = 'time';
  const yAxisKey = 'cpuUsagePercent';

  function normalizeCharData(values: Array<string>[]) {
    let result = [];
    for (let item of values) {
      let itemmap: any = {};
      [xAxisKey, yAxisKey].forEach((key: string, index: number) => {
        if (key == yAxisKey) {
          itemmap[key] = parseInt(item[index]);
        } else if (key == xAxisKey) {
          itemmap[key] = item[index];
        } else {
          itemmap[key] = item[index];
        }
      });
      result.push(itemmap);
    }
    return result;
  }

  function formatTooltipLabel(...args: any[]) {
    const [_, cpuUsage] = args;
    return {
      name: intl.formatMessage(intlMessages.CPUUsage),
      value: `${cpuUsage}%`,
    };
  }

  const chartScale = {
    cpuUsagePercent: {
      type: 'linear',
      tickCount: 5,
      min: 0,
      // max: 100,
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
    <BasicLineOverviewChart
      ResourceId={InstanceId}
      XAxisKey={xAxisKey}
      YAxisKey={yAxisKey}
      GetChartRawDataRecord={GetChartRawDataRecord}
      normalizeCharData={normalizeCharData}
      formatTooltipLabel={formatTooltipLabel}
      chartScale={chartScale}
      XAxisKeyLabel={XAxisKeyLabel}
      width={800}
      height={300}
    />
  );
}
