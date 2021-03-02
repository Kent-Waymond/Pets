import React, { useMemo } from 'react';

export interface ITableCellProps {
  children?: React.ReactNode;
  cellType?: 'body' | 'head' | 'footer';
  className?: string;
}

export function TableCell(props: ITableCellProps) {
  const { children, cellType, className } = props;
  const Component = useMemo(() => {
    if (cellType === 'head') {
      return 'th';
    } else {
      return 'td';
    }
  }, [cellType]);
  return <Component className={className}>{children}</Component>;
}
