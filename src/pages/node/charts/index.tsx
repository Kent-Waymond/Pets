import React from 'react';
import { NodeCPULineOverviewChart } from './NodeCPULineOverviewChart';
import { NodeMemLineOverviewChart } from './NodeMemLineOverviewChart';
import { NodeStorageLineOverviewChart } from './NodeStorageLineOverviewChart';

interface IChartIndexPanelProps {
  NodeId: string;
}

export function NodeChartIndexPanel(props: IChartIndexPanelProps) {
  return (
    <>
      <div>
        <fieldset>
          <legend>CPU使用率</legend>
          {/* <CPUOverviewChart InstanceId={props.InstanceId} /> */}
          <NodeCPULineOverviewChart NodeId={props.NodeId} />
        </fieldset>
      </div>
      <div>
        <fieldset>
          <legend>内存使用率</legend>
          <NodeMemLineOverviewChart NodeId={props.NodeId} />
        </fieldset>
      </div>
      <div>
        <fieldset>
          <legend>磁盘使用率</legend>
          <NodeStorageLineOverviewChart NodeId={props.NodeId} />
        </fieldset>
      </div>
    </>
  );
}
