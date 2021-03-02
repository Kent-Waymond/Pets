import React from 'react';
import { Chart, Axis, Tooltip, Interval } from 'bizcharts';
import { Spin } from 'antd';
import { CharToolTip } from './CharToolTip';
import { AxisLabelCfg } from '@antv/component/lib/types';
import styles from './chart.less';
import { stringSlice } from '@/utils/string';
import { FormattedMessage } from 'umi';

interface IBasicDashboardStackedChartProps {
  chartData: any[];
  XAxisKey: string;
  YAxisKey: string;
  width?: number;
  height?: number;
  chartScale?: any;
  XAxisKeyLabel?: AxisLabelCfg;
  YAxisKeyLabel?: AxisLabelCfg;
  formatTooltipLabel?: (...args: any[]) => TooltipLabelObject;
}

interface TooltipLabelObject {
  name: string;
  value: string | number;
  [key: string]: string | number;
}

const DefaultXAxisKeyLabel = {
  rotate: Math.PI * 0.5,
  autoRotate: false,
  formatter: (text: string) => stringSlice(text, 15),
  offset: 38,
};
const DefaultYAxisKeyLabel = {
  formatter: (text: string) => text + '%',
};

const DefaultchartScale = {
  Percent: {
    type: 'linear',
    min: 0,
    max: 100,
    tickCount: 10,
  },
};
export function BasicDashboardStackedChart(
  props: IBasicDashboardStackedChartProps,
) {
  const {
    chartData,
    XAxisKey,
    YAxisKey,
    chartScale,
    width,
    height,
    XAxisKeyLabel,
    YAxisKeyLabel,
    formatTooltipLabel,
  } = props;

  const postion = `${XAxisKey}*${YAxisKey}`;

  const DisplayXAxisKeyLabel = XAxisKeyLabel
    ? XAxisKeyLabel
    : DefaultXAxisKeyLabel;
  const DisplayYAxisKeyLabel = YAxisKeyLabel
    ? YAxisKeyLabel
    : DefaultYAxisKeyLabel;
  const DisplaychartScale = chartScale ? chartScale : DefaultchartScale;

  const ToolTipTitle = (title: string) => (
    <FormattedMessage
      id="dashboard.chart.NodeTitle"
      defaultMessage="节点:  {title}"
      values={{ title }}
    />
  );

  return (
    <div className={styles.chart}>
      <Spin spinning={false}>
        <Chart
          data={chartData}
          width={width ? width : undefined}
          height={height ? height : 300}
          padding={[20, 20, 100, 50]}
          autoFit
          scale={DisplaychartScale}
        >
          {/* x 轴 */}
          <Axis name={XAxisKey} label={DisplayXAxisKeyLabel} />
          {/* y 轴 */}
          <Axis name={YAxisKey} label={DisplayYAxisKeyLabel} />
          <Interval
            position={postion}
            label={[
              YAxisKey,
              (xValue) => {
                return {
                  content: '',
                };
              },
            ]}
            color={[
              YAxisKey,
              (yVal) => {
                if (yVal >= 90) {
                  return '#ff4d4f';
                } else if (yVal >= 70 && yVal < 90) {
                  return '#ffe58f';
                }
                return '#1890ff';
              },
            ]}
            tooltip={{
              fields: [XAxisKey, YAxisKey],
              callback: formatTooltipLabel,
            }}
          />

          <Tooltip showCrosshairs={true} showMarkers={true}>
            {(title, items) => {
              return (
                <CharToolTip title={ToolTipTitle(title || '')} items={items} />
              );
            }}
          </Tooltip>
        </Chart>
      </Spin>
    </div>
  );
}
