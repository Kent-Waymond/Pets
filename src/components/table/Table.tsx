import React, { useMemo } from 'react';
import { ComponentSizeType } from '../_common/type';
import classNames from 'classnames';

export interface ITableProps {
  size?: ComponentSizeType;
  children?: React.ReactNode;
  showHeader?: boolean;
  compact?: boolean;
}

// function computeTableSizeClasses(size: ComponentSizeType) {
//   return ComputeTypeClasses('table', '', size, CommonComponentSizes);
// }

export function Table(props: ITableProps) {
  const { children, showHeader, compact } = props;
  const computeTableClasses = useMemo(() => {
    return classNames('table', {
      'table-headless': showHeader === false,
      'table-compact': compact,
    });
  }, [showHeader, compact]);
  return <table className={computeTableClasses}>{children}</table>;
}
