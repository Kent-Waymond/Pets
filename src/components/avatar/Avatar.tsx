import React, { useMemo } from 'react';
import { ComponentStateType } from '../_common/type';
import { ComputeTypeClasses } from '../_util/classes';
import classNames from 'classnames';

export interface IAvatarProps {
  status?: ComponentStateType;
  light?: boolean;
  children?: React.ReactNode;
}

function computeAvatarTypeClasses(type?: ComponentStateType, light?: boolean) {
  const suffix = light ? 'light' : '';
  return ComputeTypeClasses('symbol', suffix, type);
}

export function Avatar(props: IAvatarProps) {
  const { status, light, children } = props;

  const statusClasses = useMemo(() => {
    return classNames('symbol', ...computeAvatarTypeClasses(status, light));
  }, [status, light]);

  return <div className={statusClasses}>{children}</div>;
}
