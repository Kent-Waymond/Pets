import React, { useMemo } from 'react';
import { ComputeClassesType, ComputeTypeClasses } from '../_util/classes';
import { tuple } from '../_util/type';
import classNames from 'classnames';

export const RowSizes = tuple('hg', 'lg', 'sm', 'md');
export type RowSize = typeof RowSizes[number];

export const RowFlexJustifyTypes = tuple('center', 'balance', 'stretch');
export type RowFlexJustifyType = typeof RowFlexJustifyTypes[number];

export interface IRowProps {
  children?: React.ReactNode;
  size?: RowSize;
  flex?: boolean;
  justify?: RowFlexJustifyType;
}

function computeRowSizeClasses(size: RowSize) {
  return ComputeTypeClasses('row', '', size, RowSizes);
}
function computeRowFlexJustifyClasses(justify: RowFlexJustifyType) {
  return ComputeTypeClasses('row-flex', '', justify, RowFlexJustifyTypes);
}
export function NewRow(props: IRowProps) {
  const { children, size, flex, justify } = props;

  const computeTextClassnames = useMemo(() => {
    const classes: ComputeClassesType[] = [];
    if (size) {
      const sizeclasses = computeRowSizeClasses(size);
      classes.push(...sizeclasses);
    }
    if (flex && justify) {
      const justifyclasses = computeRowFlexJustifyClasses(justify);
      classes.push(...justifyclasses);
    }

    return classNames(
      'row',
      {
        'row-flex': flex,
      },
      ...classes,
    );
  }, [flex, justify, size]);

  return <div className={computeTextClassnames}>{children}</div>;
}
