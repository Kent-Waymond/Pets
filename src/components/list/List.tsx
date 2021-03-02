import React from 'react';

export interface IListProps {
  children?: React.ReactNode;
}

export function List(props: IListProps) {
  const { children } = props;
  return <div className="list">{children}</div>;
}
