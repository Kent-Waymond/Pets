import React, { CSSProperties, useMemo } from 'react';
import classNames from 'classnames';

export interface ICardRowProps {
  children?: React.ReactNode;
  rowStyle?: CSSProperties;
  rowClassNames?: string[];
}

export function CardRow(props: ICardRowProps) {
  const { children, rowClassNames, rowStyle } = props;

  // card row classes
  const computedCardRowClassNames = useMemo(() => {
    if (rowClassNames) {
      return classNames('card-row', ...rowClassNames);
    }
    return 'card-row';
  }, [rowClassNames]);

  return (
    <div className={computedCardRowClassNames} style={rowStyle}>
      {children}
    </div>
  );
}
