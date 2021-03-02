import React from 'react';

export interface ITableHeadProps {
  children?: React.ReactNode;
}

export function TableHead(props: ITableHeadProps) {
  const { children } = props;
  return <thead>{children}</thead>;
}
