import React from 'react';
import { BasicLineOverviewChart } from '@/components-compatible/Chart/BasicLineOverviewChart';
import { useIntl } from 'umi';
import { TimeSecondsLabelFormatter } from './CPULineOverviewChart';
import { MessageDescriptor, defineMessages } from 'react-intl';
import { GetServiceContainerStats } from '@/request/dbquery/graphQuery';
import { AxiosPromise } from 'axios';

interface IPidLineOverviewChartProps {
  InstanceId: string;
}

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  PidNums: {
    id: 'instance.table.PidNums',
    defaultMessage: '线程数',
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

export function PidLineOverviewChart(props: IPidLineOverviewChartProps) {
  const { InstanceId } = props;

  const intl = useIntl();
  const xAxisKey = 'time';
  const yAxisKey = 'pidNums';

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
    const [_, pidNums] = args;
    return {
      name: intl.formatMessage(intlMessages.PidNums),
      value: pidNums,
    };
  }

  const chartScale = {
    pidNums: {
      type: 'linear',
      // tickCount: 5,
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
