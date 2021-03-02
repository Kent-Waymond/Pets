import React, { useMemo } from 'react';
import classNames from 'classnames';

export interface ISpinProps {
  spinning: boolean;
  children?: React.ReactNode;
  wrapperClassName?: string;
  indicator?: React.ReactNode;
}

function renderIndicator(
  prefixCls: string,
  props: ISpinProps,
): React.ReactNode {
  const { indicator } = props;
  const dotClassName = `${prefixCls}-dot`;
  if (React.isValidElement(indicator)) {
    return React.cloneElement(indicator, {
      className: classNames(indicator.props.className, dotClassName),
    });
  }

  return (
    <span className={classNames(dotClassName, `${prefixCls}-dot-spin`)}>
      <i className={`${prefixCls}-dot-item`} />
      <i className={`${prefixCls}-dot-item`} />
      <i className={`${prefixCls}-dot-item`} />
      <i className={`${prefixCls}-dot-item`} />
    </span>
  );
}

export function Spin(props: ISpinProps) {
  const { spinning, children } = props;

  const ComputeContainerClasses = useMemo(() => {
    return classNames('spin-container', {
      'spin-blur': spinning,
    });
  }, [spinning]);

  return (
    <div className="spin">
      {spinning && (
        <div className="spin-loading">{renderIndicator('spin', props)}</div>
      )}
      <div className={ComputeContainerClasses}>{children}</div>
    </div>
  );
}
