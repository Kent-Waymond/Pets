import React, { useMemo } from 'react';
import { ComponentStateType } from '../_common/type';
import { ComputeTypeClasses } from '../_util/classes';
import classNames from 'classnames';

export interface ITagProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  title?: string;
  children?: React.ReactNode;
  status?: ComponentStateType;
  pointer?: boolean;
}
function computeTagTypeClasses(type?: ComponentStateType) {
  return ComputeTypeClasses('tag', '', type);
}

export function Tag(props: ITagProps) {
  const { children, status, title, pointer, ...restProps } = props;

  const computeTagClasss = useMemo(() => {
    return classNames(
      'tag',
      {
        'tag-pointer': pointer,
      },
      ...computeTagTypeClasses(status),
    );
  }, [status, pointer]);

  return (
    <div title={title} className={computeTagClasss} {...restProps}>
      {children}
    </div>
  );
}
