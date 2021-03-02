import React, { useEffect } from 'react';
import Card, { CardBody, CardChart } from '@/components/card';
import { Chart, Area, Line, Tooltip, Axis } from 'bizcharts';
import Text from '@/components/text';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import { formatTimestamp } from '@/utils/date';
import { ScaleOption } from 'bizcharts/lib/interface';
import { useDynamicChartData } from '../hooks/chart';
import { BasicDashboardChartCard } from './BasicDashboardChartCard';
import { formatByteSize } from '@/utils/size';
type IncrementRecordType = {
  time: number;
  value: number;
};
interface IDashboardMEMCardProps {
  IncrementRecords: IncrementRecordType[];
}

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  MEMUsage: {
    id: 'dashboard.text.MEMUsage',
    defaultMessage: '内存占用',
  },
});

function TimeSecondsLabelFormatter(text: string) {
  return formatTimestamp(text, 'HH:mm:ss');
}
function UsageLabelFormatter(text: string | number) {
  return formatByteSize(text);
}
export function DashboardMEMCard(props: IDashboardMEMCardProps) {
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
  }, [changeChartState, IncrementRecords]);

  const scale: { [field: string]: ScaleOption } = {
    value: {
      type: 'linear',
      min: 0,
      nice: true,
      formatter: UsageLabelFormatter,
      alias: intl.formatMessage(intlMessages.MEMUsage),
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
      chartScale={scale}
      chartColor={'#8950fc'}
      ChartTitle={
        <Text type="gray" block>
          {intl.formatMessage(intlMessages.MEMUsage)}
        </Text>
      }
      ChartOverview={
        <Text size="lg" block>
          {UsageLabelFormatter(IncrementRecords[0]?.value || 0)}
        </Text>
      }
    />
  );
}
