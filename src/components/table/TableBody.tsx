import React from 'react';

export interface ITableBodyProps {
  children?: React.ReactNode;
}

export function TableBody(props: ITableBodyProps) {
  const { children } = props;

  return <tbody>{children}</tbody>;
}
