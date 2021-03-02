import React from 'react';
import { BasicLineOverviewChart } from '@/components-compatible/Chart/BasicLineOverviewChart';
import { useIntl } from 'umi';
import { TimeSecondsLabelFormatter } from './CPULineOverviewChart';
import { MessageDescriptor, defineMessages } from 'react-intl';
import { GetServiceContainerStats } from '@/request/dbquery/graphQuery';
import { AxiosPromise } from 'axios';
import { formatByteSize } from '@/utils/size';

interface INetworkLineOverviewChartProps {
  InstanceId: string;
}

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  ReceiveData: {
    id: 'instance.table.ReceiveData',
    defaultMessage: '接收数据',
  },
  SendData: {
    id: 'instance.table.SendData',
    defaultMessage: '发送数据',
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

export function NetworkLineOverviewChart(
  props: INetworkLineOverviewChartProps,
) {
  const { InstanceId } = props;

  const intl = useIntl();
  const xAxisKey = 'time';
  const yAxisKey = 'networkData';
  const columns = ['time', 'netReceivedMb', 'netTransmittedMb'];

  function normalizeCharData(values: Array<string>[]) {
    let result = [];
    for (let item of values) {
      let receiveMap: any = {};
      let transmap: any = {};
      const [time, receive, trans] = item;
      receiveMap[xAxisKey] = time;
      receiveMap[yAxisKey] = Number(receive) * 1024 * 1024;
      receiveMap['type'] = 'receive';
      transmap[xAxisKey] = time;
      transmap[yAxisKey] = Number(trans) * 1024 * 1024;
      transmap['type'] = 'send';
      result.push(receiveMap, transmap);
    }
    return result;
  }

  function formatTooltipLabel(...args: any[]) {
    const [type, _, networkData] = args;
    return {
      name:
        type == 'receive'
          ? intl.formatMessage(intlMessages.ReceiveData)
          : intl.formatMessage(intlMessages.SendData),
      value: formatByteSize(networkData),
    };
  }

  const chartScale = {
    networkData: {
      type: 'linear',
      // tickCount: 5,
      min: 0,
      // max: 100,
      formatter: formatByteSize,
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
      QueryColumns={columns}
      XAxisKey={xAxisKey}
      YAxisKey={yAxisKey}
      GetChartRawDataRecord={GetChartRawDataRecord}
      normalizeCharData={normalizeCharData}
      formatTooltipLabel={formatTooltipLabel}
      chartScale={chartScale}
      XAxisKeyLabel={XAxisKeyLabel}
      width={800}
      height={300}
      multipleLineName={'type'}
      LineTooltipFields={['type', xAxisKey, yAxisKey]}
    />
  );
}
