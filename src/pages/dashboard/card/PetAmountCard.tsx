import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import Card, { CardBody, CardChart } from '@/components/card';
import { Chart, Area, Line, Tooltip, Axis } from 'bizcharts';
import Text from '@/components/text';
import { formatTimestamp } from '@/utils/date';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import { ScaleOption } from 'bizcharts/lib/interface';
import { BasicDashboardChartCard } from './BasicDashboardChartCard';
import { useDynamicChartData } from '../hooks/chart';

type IncrementRecordType = {
  time: number;
  value: number;
};
interface IDashboardCPUCardProps {
  IncrementRecords: IncrementRecordType[];
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

function TimeSecondsLabelFormatter(text: string) {
  return formatTimestamp(text, 'HH:mm:ss');
}
function PercentLabelFormatter(text: string | number) {
  return `${text}%`;
}

export function DashboardCPUCard(props: IDashboardCPUCardProps) {
  const { IncrementRecords } = props;
  const { chartState, changeChartState } = useDynamicChartData();
  const intl = useIntl();

  useEffect(() => {
    if (IncrementRecords.length == 0) {
      return;
    }
    const IncrementReco = IncrementRecords.map(
      (record: IncrementRecordType) => {
        return {
          time: record.time.toString(),
          value: record.value,
        };
      },
    );

    changeChartState({
      type: 'add',
      payload: {
        IncrementRecords: IncrementReco,
      },
    });
    // console.log('dat212121212a --------', IncrementRecords)
  }, [changeChartState, IncrementRecords]);

  const lastestRecord: IncrementRecordType = useMemo(() => {
    return IncrementRecords[IncrementRecords.length - 1];
  }, [IncrementRecords]);

  const scale: { [field: string]: ScaleOption } = {
    value: {
      type: 'linear',
      min: 0,
      nice: true,
      formatter: PercentLabelFormatter,
      alias: '社区宠物数量',
    },
    time: {
      range: [0, 1],
      tickCount: 10,
      formatter: TimeSecondsLabelFormatter,
    },
  };

  return (
    <BasicDashboardChartCard
      chartData={chartState.chartData.slice(0)}
      type={'primary'}
      chartScale={scale}
      ChartTitle={
        <Text type="gray" block>
          {intl.formatMessage(intlMessages.CPUUsage)}
        </Text>
      }
      ChartOverview={
        <Text size="lg" block>
          {PercentLabelFormatter(lastestRecord?.value || 0)}
        </Text>
      }
    />
  );
}
