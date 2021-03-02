import React, { useMemo } from 'react';
import Card, { CardBody, CardChart } from '@/components/card';
import { Chart, Area, Line, Tooltip, Axis } from 'bizcharts';
import { formatTimestamp } from '@/utils/date';
import { ScaleOption } from 'bizcharts/lib/interface';
import { ComponentStateType } from '@/components/_common/type';
import classNames from 'classnames';

interface IBasicDashboardChartCardProps {
  chartData: any[];
  ChartTitle?: React.ReactNode;
  ChartOverview?: React.ReactNode;
  xAxisKey?: string;
  yAxisKey?: string;
  chartScale?: { [field: string]: ScaleOption };
  type?: ComponentStateType;
  chartColor?: string;
}

function TimeSecondsLabelFormatter(text: string) {
  // console.log(formatTimestamp(text, 'HH:mm:ss'));
  return formatTimestamp(text, 'HH:mm:ss');
}
function PercentLabelFormatter(text: string | number) {
  return `${text}%`;
}

const DefaultChartScale: { [field: string]: ScaleOption } = {
  time: {
    range: [0, 1],
    tickCount: 10,
    formatter: TimeSecondsLabelFormatter,
  },
  value: {
    type: 'linear',
    min: 0,
    nice: true,
    formatter: PercentLabelFormatter,
  },
};
export function BasicDashboardChartCard(props: IBasicDashboardChartCardProps) {
  const {
    chartData,
    xAxisKey,
    yAxisKey,
    chartScale,
    type,
    chartColor,
    ...restProps
  } = props;

  const DashboardChartScale = {
    ...DefaultChartScale,
    ...chartScale,
  };

  const ChartPosition = useMemo(() => {
    const xKey = xAxisKey || 'time';
    const yKey = yAxisKey || 'value';

    return `${xKey}*${yKey}`;
  }, [xAxisKey, yAxisKey]);

  return (
    <Card compact={true} flexbox type={type} height={138}>
      <CardBody>
        <>{restProps.ChartTitle}</>
        <>{restProps.ChartOverview}</>
      </CardBody>
      <CardChart>
        <Chart scale={DashboardChartScale} data={chartData.slice(0)} autoFit>
          <Tooltip shared />
          <Axis name={xAxisKey || 'time'} visible={false} />
          <Axis name={yAxisKey || 'value'} visible={false} />
          <Area
            shape="smooth"
            color={chartColor || 'rgba(255, 255, 255, .5)'}
            position={ChartPosition}
          />
          <Line
            shape="smooth"
            color={chartColor || 'rgba(255, 255, 255, .5)'}
            position={ChartPosition}
          />
        </Chart>
      </CardChart>
    </Card>
  );
}
