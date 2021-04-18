import React, { CSSProperties, useMemo } from 'react';
import classNames from 'classnames';
import { ComponentStateType } from '../_common/type';
import { ComputeTypeClasses } from '../_util/classes';
export interface ICardProps {
  children?: React.ReactNode;
  height?: string | number;
  flexbox?: boolean;
  cardClassNames?: string[];
  compact?: boolean;
  type?: ComponentStateType;
  bordered?: boolean;
}

export interface ICardChartProps {
  children?: React.ReactNode;
  chartStyle?: CSSProperties;
  chartClassNames?: string[];
}

function computeCardTypeClasses(type?: ComponentStateType) {
  return ComputeTypeClasses('bg', '', type);
}

const DefaultCardHeight = 300;

export function NewCard(props: ICardProps) {
  const {
    cardClassNames,
    height,
    flexbox,
    compact,
    type,
    bordered,
    children,
  } = props;

  const cardHeight = useMemo(() => {
    return height ? height : DefaultCardHeight;
  }, [height]);

  // card classes
  const computedCardClassNames = useMemo(() => {
    const extendscardClassNames = cardClassNames ? cardClassNames : [];
    return classNames(
      'card',
      { 'card-flex-v': flexbox },
      {
        'card-compact': compact,
      },
      {
        'card-bordered': bordered,
      },
      ...computeCardTypeClasses(type),
      ...extendscardClassNames,
    );
  }, [compact, bordered, type, flexbox, cardClassNames]);

  return (
    <div
      className={computedCardClassNames}
      style={{ height: height ? cardHeight : 'unset' }}
    >
      {/* card header , card body , card chart */}
      {children}
    </div>
  );
}
