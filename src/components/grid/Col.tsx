import React, { useMemo } from 'react';
import classNames from 'classnames';

export interface IColProps {
  children?: React.ReactNode;
  grid?: boolean;
}
export function NewCol(props: IColProps) {
  const { children, grid } = props;

  const computeColClasses = useMemo(() => {
    return classNames({
      grid: grid,
    });
  }, [grid]);
  return <div className={computeColClasses}>{children}</div>;
}
