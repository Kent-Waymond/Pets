import React, { CSSProperties, useMemo } from 'react';
import classNames from 'classnames';

export interface ICardBodyProps {
  children?: React.ReactNode;
  bodyStyle?: CSSProperties;
  bodyClassNames?: string[];
  overflow?: boolean;
}

export function CardBody(props: ICardBodyProps) {
  const { children, overflow, bodyClassNames, bodyStyle } = props;

  // card body classes
  const computedCardbodyClassNames = useMemo(() => {
    let computeClasses: any[] = [];
    if (bodyClassNames) {
      computeClasses = [...bodyClassNames];
      return;
    }
    return classNames(
      'card-body',
      {
        'card-overflow': overflow,
      },
      ...computeClasses,
    );
  }, [overflow, bodyClassNames]);

  return (
    <div className={computedCardbodyClassNames} style={bodyStyle}>
      {children}
    </div>
  );
}
