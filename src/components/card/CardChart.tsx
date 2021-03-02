import React, { CSSProperties, useMemo } from 'react';
import classNames from 'classnames';

export interface ICardChartProps {
  children?: React.ReactNode;
  chartStyle?: CSSProperties;
  chartClassNames?: string[];
}

export function CardChart(props: ICardChartProps) {
  const { children, chartClassNames, chartStyle } = props;

  // card chart classes
  const computedCardChartClassNames = useMemo(() => {
    if (chartClassNames) {
      return classNames('card-chart', ...chartClassNames);
    }
    return 'card-chart';
  }, [chartClassNames]);

  return (
    <div className={computedCardChartClassNames} style={chartStyle}>
      {children}
    </div>
  );
}
