import React, { useMemo } from 'react';
import classNames from 'classnames';

export interface IColProps {
  children?: React.ReactNode;
  // TODO:确认grid属性名称
  grid?: boolean;
}
export function Col(props: IColProps) {
  const { children, grid } = props;

  const computeColClasses = useMemo(() => {
    return classNames({
      grid: grid,
    });
  }, [grid]);
  return <div className={computeColClasses}>{children}</div>;
}
