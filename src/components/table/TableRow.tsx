import React from 'react';

export interface ITableRowProps {
  children?: React.ReactNode;
}

export function TableRow(props: ITableRowProps) {
  const { children } = props;

  return <tr>{children}</tr>;
}
