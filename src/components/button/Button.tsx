import React, { useMemo } from 'react';
import classNames from 'classnames';
import { ComputeTypeClasses } from '../_util/classes';
import { ComponentSizeType, ComponentStateType } from '../_common/type';

export interface IButtonProps {
  children?: React.ReactNode;
  block?: boolean;
  transparent?: boolean;
  type?: ComponentStateType;
  light?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode | string;
  size?: ComponentSizeType;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

function computeButtonTypeClasses(type?: ComponentStateType, light?: boolean) {
  const suffix = light ? 'light' : '';
  return ComputeTypeClasses('btn', suffix, type);
}

export function Button(props: IButtonProps) {
  const {
    block,
    type,
    disabled,
    icon,
    transparent,
    size,
    light,
    loading,
    children,
    onClick,
  } = props;

  const typeClasses = useMemo(() => {
    return computeButtonTypeClasses(type, light);
  }, [type, light]);
  const buttonClasses = classNames(
    'btn',
    {
      'btn-block': block,
    },
    {
      'btn-disabled': disabled,
    },
    {
      'btn-icon': icon,
    },
    {
      'btn-transparent': transparent,
    },
    ...typeClasses,
  );

  function renderIcon() {
    if (loading) {
      return <>...</>;
    }
    if (icon) {
      return icon;
    }

    return null;
  }

  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled}>
      {renderIcon()}
      {children}
    </button>
  );
}
