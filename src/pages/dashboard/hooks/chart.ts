import React, { useReducer } from 'react';
import { IDashboardCardChartData } from '../type';

type DynamicChartDataStateType = {
  chartData: IDashboardCardChartData[];
};
type DynamicChartDataActionype = {
  type: 'add';
  payload: {
    IncrementRecords: IDashboardCardChartData[];
  };
};

const InitDynamicChartData: IDashboardCardChartData[] = [];
for (let i = 0; i < 10; i++) {
  InitDynamicChartData.push({
    time: `${i}`,
    value: 0,
  });
}

function dynamicChartDataReducer(
  state: DynamicChartDataStateType,
  action: DynamicChartDataActionype,
): DynamicChartDataStateType {
  const { type, payload } = action;
  const { IncrementRecords } = payload;
  const { chartData } = state;

  if (type == 'add') {
    if (
      chartData instanceof Array &&
      IncrementRecords instanceof Array &&
      chartData.length > 9
    ) {
      for (let IncrementRecord of IncrementRecords) {
        chartData.shift();
        chartData.push(IncrementRecord);
      }

      return { ...state, chartData };
    }
  }

  return state;
}
export function useDynamicChartData() {
  const [chartState, changeChartState] = useReducer(dynamicChartDataReducer, {
    chartData: InitDynamicChartData.slice(0),
  });

  return { chartState, changeChartState };
}
