import { INodeProfileEthernetPorts } from '@/pages/node/type';
import Select, { SelectProps } from 'antd/lib/select';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'umi';

interface INodeEthernetPortListProps extends SelectProps<any> {
  NodeId: string;
  FilterUnAttach?: boolean;
}

// 获取节点网口列表
function useFetchNodeEthernetPorts(
  NodeId: string,
  FilterUnAttach?: boolean,
): [boolean, INodeProfileEthernetPorts[], () => void] {
  const dispatch = useDispatch<any>();
  const [EthernetPorts, ChangeEthernetPorts] = useState<
    INodeProfileEthernetPorts[]
  >([]);

  const ActionName = useMemo(() => {
    return FilterUnAttach
      ? 'node/ListUnattachedEthernetPorts'
      : 'node/ListEthernetPorts';
  }, [FilterUnAttach]);

  const loading = useSelector((state: any) => state.loading);
  const GetNodeEthernetPortsLoading = loading?.effects?.[ActionName] || false;

  const GetNodeEthernetPorts = useCallback(async () => {
    if (NodeId) {
      const ports: INodeProfileEthernetPorts[] = await dispatch({
        type: ActionName,
        payload: {
          hostId: NodeId,
        },
      });
      // console.log(ports);
      if (ports instanceof Array) {
        ChangeEthernetPorts(ports);
      } else {
        ChangeEthernetPorts([]);
      }
    }
    return null;
  }, [NodeId, ActionName, dispatch]);

  useEffect(() => {
    GetNodeEthernetPorts();
  }, [GetNodeEthernetPorts]);

  return [GetNodeEthernetPortsLoading, EthernetPorts, GetNodeEthernetPorts];
}

export function NodeEthernetPortList(props: INodeEthernetPortListProps) {
  const { NodeId, FilterUnAttach, ...restProps } = props;
  const [
    EthernetPortsLoading,
    EthernetPorts,
    ChangeEthernetPorts,
  ] = useFetchNodeEthernetPorts(NodeId, FilterUnAttach);

  return (
    <Select loading={EthernetPortsLoading} {...restProps}>
      {EthernetPorts instanceof Array &&
        EthernetPorts.map((port: INodeProfileEthernetPorts) => {
          return (
            <Select.Option key={port?.name} value={port?.name}>
              {port?.name}
            </Select.Option>
          );
        })}
    </Select>
  );
}
