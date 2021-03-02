import React, { useMemo } from 'react';
import { ComponentStateType } from '../_common/type';
import { ComputeTypeClasses } from '../_util/classes';
import classNames from 'classnames';
import { normalizeProgressNumber } from '@/utils/string';

export interface IProgressProps {
  percent: number;
  status?: ComponentStateType;
  light?: boolean;
  showInfo?: boolean;
  format?: (percent: number) => string;
}
function computeProgressTypeClasses(
  type?: ComponentStateType,
  light?: boolean,
) {
  const suffix = light ? 'light' : '';
  return ComputeTypeClasses('progress', suffix, type);
}

export function Progress(props: IProgressProps) {
  const { percent, status, light, showInfo, format } = props;

  const progressText = useMemo(() => {
    const realPercent = normalizeProgressNumber(percent);
    if (format) {
      return format(realPercent);
    } else {
      return `${realPercent}%`;
    }
  }, [percent, format]);

  const processBarClassNames = useMemo(() => {
    return classNames(
      'progress-bar',
      ...computeProgressTypeClasses(status, light),
    );
  }, [status, light]);

  const showProcessText = useMemo(() => {
    return showInfo ?? true;
  }, [showInfo]);

  return (
    <div className="progress" title={progressText}>
      <div className="progress-bg">
        <div
          className={processBarClassNames}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      {showProcessText && <div className="progress-text">{progressText}</div>}
    </div>
  );
}
