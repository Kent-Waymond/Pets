import React, { useMemo } from 'react';
import classNames from 'classnames';
import { ComputeClassesType, ComputeTypeClasses } from '../_util/classes';
import { tuple } from '../_util/type';
import { CommonComponentStates } from '../_common/variable';

export const TextTypes = tuple(...CommonComponentStates, 'gray');
export type TextType = typeof TextTypes[number];

export const TextSizes = tuple('lg', 'sm', 'md');
export type TextSize = typeof TextSizes[number];

function computeTextTypeClasses(type: TextType) {
  return ComputeTypeClasses('text', '', type, TextTypes);
}
function computeTextSizeClasses(type: TextSize) {
  return ComputeTypeClasses('text', '', type, TextSizes);
}

export interface ITextProps {
  block?: boolean;
  type?: TextType;
  size?: TextSize;
  underline?: boolean;
  children?: React.ReactNode;
  title?: string;
}

export function Text(props: ITextProps) {
  const { block, type, size, title, underline, children } = props;

  const computeTextClassnames = useMemo(() => {
    const classes: ComputeClassesType[] = [];
    if (type) {
      const typeclasses = computeTextTypeClasses(type);
      classes.push(...typeclasses);
    }
    if (size) {
      const sizeclasses = computeTextSizeClasses(size);
      classes.push(...sizeclasses);
    }

    return classNames(...classes);
  }, [type, size]);
  return (
    <span
      title={title}
      className={computeTextClassnames}
      style={{
        display: block ? 'block' : 'inline',
        textDecoration: underline ? 'underline' : '',
      }}
    >
      {children}
    </span>
  );
}
