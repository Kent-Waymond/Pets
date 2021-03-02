import React from 'react';
import { CPULineOverviewChart } from './CPULineOverviewChart';
import { MemLineOverviewChart } from './MemLineOverviewChart';
import { PidLineOverviewChart } from './PidLineOverviewChart';
import { NetworkLineOverviewChart } from './NetworkLineOverviewChart';
import { FormattedMessage } from 'umi';

interface IChartIndexPanelProps {
  InstanceId: string;
}

export function ChartIndexPanel(props: IChartIndexPanelProps) {
  return (
    <>
      <div>
        <fieldset>
          <legend>
            <FormattedMessage
              id="instance.chart.CPUUsage"
              defaultMessage="CPU使用率"
            />
          </legend>
          <CPULineOverviewChart InstanceId={props.InstanceId} />
        </fieldset>
      </div>
      <div>
        <fieldset>
          <legend>
            <FormattedMessage
              id="instance.chart.MEMUsage"
              defaultMessage="内存使用率"
            />
          </legend>
          <MemLineOverviewChart InstanceId={props.InstanceId} />
        </fieldset>
      </div>
      <div>
        <fieldset>
          <legend>
            <FormattedMessage
              id="instance.chart.PIDCount"
              defaultMessage="线程数"
            />
          </legend>
          <PidLineOverviewChart InstanceId={props.InstanceId} />
        </fieldset>
      </div>
      <div>
        <fieldset>
          <legend>
            <FormattedMessage
              id="instance.chart.Network"
              defaultMessage="网络"
            />
          </legend>
          <NetworkLineOverviewChart InstanceId={props.InstanceId} />
        </fieldset>
      </div>
    </>
  );
}
