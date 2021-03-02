import React, { CSSProperties, useMemo } from 'react';
import classNames from 'classnames';

export interface ICardHeaderProps {
  title: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  headerStyle?: CSSProperties;
  headerClassNames?: string[];
}

export function CardHeader(props: ICardHeaderProps) {
  const { title, action, children, headerClassNames, headerStyle } = props;

  // card header classes
  const computedHeaderClassNames = useMemo(() => {
    if (headerClassNames) {
      return classNames('card-header', ...headerClassNames);
    }
    return 'card-header';
  }, [headerClassNames]);

  return (
    <div className={computedHeaderClassNames} style={headerStyle}>
      <div className="card-title">{title}</div>
      {/* {children} */}
      <div className="card-action">{action}</div>
    </div>
  );
}
