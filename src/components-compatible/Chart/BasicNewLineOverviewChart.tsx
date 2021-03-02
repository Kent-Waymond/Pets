import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Chart, Line, Slider, Axis, Tooltip, Legend } from 'bizcharts';
import { Spin, Radio } from 'antd';
import { AxiosResponse } from 'axios';
import moment from 'moment';
import { CharToolTip } from './CharToolTip';
import { AxisLabelCfg } from '@antv/component/lib/types';
import styles from './chart.less';
import { NormalizeGraphQueryNodeMultipleResult } from '@/utils/dbquery';
import { FormattedMessage } from 'umi';
import {
  IDBQueryNodeStatisticRecord,
  mergeArrayColumnAndValues,
} from '@/request/dbquery/dashboardutil';

interface IBasicNewLineOverviewChartProps {
  ResourceId: string;
  XAxisKey: string;
  YAxisKey: string;
  ResourceName: string;
  normalizeCharData?: (values: any[]) => any[];
  formatTooltipLabel: (...args: any[]) => TooltipLabelObject;
  GetChartRawDataRecord: (
    Id: string,
    Type: 'hour' | 'day',
    Value: number,
    Columns: string[],
  ) => Promise<AxiosResponse>;
  width?: number;
  height?: number;

  multipleLineName?: string; // 用户表示多条line时，line之间的差异字段
  chartScale?: any;
  QueryColumns?: string[]; // 查询字段，默认使用[XAxisKey, YAxisKey]
  LineTooltipFields?: string[]; // 用于对应normalizeCharData返回的数据字段（LineTooltipFields需要为返回数据字段的子集）
  // 定义需要返回给formatTooltipLabel的字段，默认使用[XAxisKey, YAxisKey]
  XAxisKeyLabel?: AxisLabelCfg;
  YAxisKeyLabel?: AxisLabelCfg;
}

interface TooltipLabelObject {
  name: string;
  value: string | number;
  [key: string]: string | number;
}
export function BasicNewLineOverviewChart(
  props: IBasicNewLineOverviewChartProps,
) {
  const {
    ResourceId,
    QueryColumns,
    ResourceName,
    XAxisKey,
    YAxisKey,
    chartScale,
    width,
    height,
    multipleLineName,
    LineTooltipFields,
    XAxisKeyLabel,
    YAxisKeyLabel,
    GetChartRawDataRecord,
    normalizeCharData,
    formatTooltipLabel,
  } = props;

  const [ResultValues, ChangeResultValues] = useState<
    Array<IDBQueryNodeStatisticRecord>
  >([]);
  const [DataLoading, ChangeDataLoading] = useState(false);
  const [RecentCount, ChangeRecentCount] = useState<number>(1);

  const currentRef: any = useRef();
  const columnsRef: any = useRef();

  useEffect(() => {
    if (QueryColumns) {
      if (JSON.stringify(QueryColumns) !== JSON.stringify(columnsRef.current)) {
        const Columns = QueryColumns ? QueryColumns : [];
        columnsRef.current = Columns;
      }
    } else {
      columnsRef.current = [XAxisKey, YAxisKey];
    }
  }, [QueryColumns, XAxisKey, YAxisKey]);

  useEffect(() => {
    function getChartRawData() {
      GetChartRawDataRecord(ResourceId, 'hour', RecentCount, columnsRef.current)
        .then((response: AxiosResponse) => {
          const seriesMap = NormalizeGraphQueryNodeMultipleResult(response);
          if (!seriesMap) {
            return;
          }
          const seriers = seriesMap[ResourceName];

          let ValueObjArr = mergeArrayColumnAndValues(
            seriers.name,
            seriers.columns,
            seriers.values,
          );

          if (ValueObjArr) {
            ChangeResultValues(ValueObjArr);
          }
        })
        .finally(() => {
          ChangeDataLoading(false);
        });
    }
    ChangeDataLoading(true);
    getChartRawData();
    window.clearInterval(currentRef.current);

    currentRef.current = window.setInterval(() => {
      getChartRawData();
    }, 10000);
    return () => {
      window.clearInterval(currentRef.current);
    };
  }, [
    GetChartRawDataRecord,
    ResourceId,
    RecentCount,
    ResourceName,
    // currentRef,
    columnsRef,
  ]);

  const chartData = useMemo(() => {
    return normalizeCharData ? normalizeCharData(ResultValues) : ResultValues;
  }, [ResultValues, normalizeCharData]);

  function TimeLabelFormatter(text: string) {
    return moment(text).format(moment.HTML5_FMT.TIME);
  }

  const postion = `${XAxisKey}*${YAxisKey}`;

  function handleRecentTimeChange(ev: any) {
    const value = ev.target.value;
    ChangeRecentCount(value);
  }

  return (
    <div className={styles.chart}>
      <Spin spinning={DataLoading}>
        <Radio.Group
          defaultValue={RecentCount}
          onChange={handleRecentTimeChange}
          buttonStyle="solid"
          className={styles.toolbar}
        >
          <Radio.Button value={1}>
            <FormattedMessage
              id="common.time.RecentOneHour"
              defaultMessage="最近1小时"
            />
          </Radio.Button>
          <Radio.Button value={6}>
            <FormattedMessage
              id="common.time.RecentSixHour"
              defaultMessage="最近6小时"
            />
          </Radio.Button>
          <Radio.Button value={12}>
            <FormattedMessage
              id="common.time.RecentTwelveHour"
              defaultMessage="最近12小时"
            />
          </Radio.Button>
          <Radio.Button value={24}>
            <FormattedMessage
              id="common.time.RecentOneDay"
              defaultMessage="最近一天"
            />
          </Radio.Button>
        </Radio.Group>
        <Chart
          data={chartData}
          width={width ? width : 500}
          height={height ? height : 300}
          padding={[10, 20, 50, 40]}
          autoFit
          scale={chartScale}
        >
          {/* 默认关闭Legend */}
          <Legend visible={false} />
          {/* x 轴 */}
          <Axis name={XAxisKey} label={XAxisKeyLabel} />
          {/* y 轴 */}
          <Axis name={YAxisKey} label={YAxisKeyLabel} />
          <Line
            shape="line"
            smooth={false}
            size={1}
            point
            area
            position={postion}
            tooltip={{
              fields: LineTooltipFields
                ? LineTooltipFields
                : [XAxisKey, YAxisKey],
              callback: formatTooltipLabel,
            }}
            color={multipleLineName}
          />

          <Tooltip showCrosshairs={true} shared={true}>
            {(title, items) => {
              return <CharToolTip title={title} items={items} />;
            }}
          </Tooltip>

          <Slider
            formatter={TimeLabelFormatter}
            textStyle={{
              color: '#222',
            }}
          />
        </Chart>
      </Spin>
    </div>
  );
}
