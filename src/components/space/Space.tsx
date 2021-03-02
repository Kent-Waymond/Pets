import React, { useMemo } from 'react';
import { ComputeClassesType, ComputeTypeClasses } from '../_util/classes';
import { tuple } from '../_util/type';
import classNames from 'classnames';

export const SpaceSizes = tuple('sm');
export type SpaceSize = typeof SpaceSizes[number];

export interface ISpaceProps {
  children?: React.ReactNode;
  size?: SpaceSize;
}

function computeSpaceSizeClasses(size: SpaceSize) {
  return ComputeTypeClasses('space', '', size, SpaceSizes);
}

export function Space(props: ISpaceProps) {
  const { size, children } = props;

  const computeSpaceClassnames = useMemo(() => {
    const classes: ComputeClassesType[] = [];
    if (size) {
      const sizeclasses = computeSpaceSizeClasses(size);
      classes.push(...sizeclasses);
    }

    return classNames('space', ...classes);
  }, [size]);
  return <div className={computeSpaceClassnames}>{children}</div>;
}
