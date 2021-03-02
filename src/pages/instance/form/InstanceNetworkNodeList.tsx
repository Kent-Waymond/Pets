import { INodeRecord } from '@/pages/node/type.d';
import { Badge, message, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { OptionType, SelectProps } from 'antd/lib/select';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MessageDescriptor } from 'react-intl';
import {
  defineMessages,
  formatMessage,
  FormattedMessage,
  useDispatch,
  useSelector,
} from 'umi';

interface InstanceNetworkNodeListProps extends SelectProps<any> {
  networkId: string;
  formInstance: FormInstance;
}

export function useFetchNodeList(
  networkId: string,
): [boolean, boolean, INodeRecord[]] {
  const dispacth = useDispatch();
  const [NodeList, ChangeNodeList] = useState<INodeRecord[]>([]);
  const [Finished, ChangeFinished] = useState<boolean>(false);
  const loading = useSelector(
    (state: any) =>
      state.loading.effects['instance/ListInstanceNetworkAttachedNodes'],
  );

  const fetchData = useCallback(async () => {
    if (networkId) {
      const response = await dispacth({
        type: 'instance/ListInstanceNetworkAttachedNodes',
        payload: {
          networkId,
        },
      });
      if (response instanceof Array) {
        ChangeNodeList(response);
      }
      ChangeFinished(true);
    }
  }, [dispacth, networkId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [loading, Finished, NodeList];
}

const NodeStateMap: any = {
  unknown: 'warning',
  down: 'error',
  ready: 'success',
  disconnected: 'error',
};
const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  unknown: {
    id: 'instance.table.Unknown',
    defaultMessage: '未知',
  },
  down: {
    id: 'instance.table.Stopped',
    defaultMessage: '已停止',
  },
  ready: {
    id: 'instance.table.Ready',
    defaultMessage: '就绪',
  },
  disconnected: {
    id: 'instance.table.Disconnected',
    defaultMessage: '已断开',
  },
});
function parseStatus(status: string) {
  if (!status) {
    return formatMessage(intlMessages.unknown);
  }
  if (intlMessages[status]) {
    return formatMessage(intlMessages[status]);
  }
  return status;
}

export function InstanceNetworkNodeList(props: InstanceNetworkNodeListProps) {
  const { networkId, formInstance, ...restProps } = props;
  const [FetchLoading, Finished, NodeList] = useFetchNodeList(networkId);

  const NodeSortedList: INodeRecord[] = useMemo(() => {
    return NodeList.sort((node1: INodeRecord, node2: INodeRecord) => {
      if (node1?.status === 'ready') {
        return -1;
      } else {
        return 1;
      }
    });
  }, [NodeList]);

  useEffect(() => {
    if (networkId && props.value === 'auto' && Finished) {
      const avaliableNodes = NodeSortedList.filter((item: INodeRecord) => {
        return item.status === 'ready';
      });
      const avaliableNode =
        avaliableNodes[Math.floor(Math.random() * avaliableNodes.length)];
      if (avaliableNode) {
        formInstance.setFieldsValue({
          autoNodeId: avaliableNode?.id,
        });
      } else {
        message.error(
          <FormattedMessage
            id="instance.form.AutoSelectNodeFailed"
            defaultMessage="自动选择节点失败，该网络下无可用节点，请切换其他网络"
          />,
        );
      }
    }
  }, [props.value, formInstance, NodeSortedList, Finished, networkId]);

  function onSelectChange(value: any, option: any) {
    if (props.onChange) {
      props.onChange(value, option);
    }
  }

  return (
    <Select
      loading={FetchLoading}
      optionLabelProp="label"
      showArrow={false}
      {...restProps}
      onChange={onSelectChange}
    >
      <Select.Option
        value={'auto'}
        label={
          <FormattedMessage
            id="node.table.AutoSelectNode"
            defaultMessage="自动选择节点"
          />
        }
      >
        <FormattedMessage
          id="node.table.AutoSelectNode"
          defaultMessage="自动选择节点"
        />
      </Select.Option>
      {NodeSortedList?.length > 0 &&
        NodeSortedList.map((node: INodeRecord) => {
          return (
            <Select.Option
              value={node.id}
              key={node.id}
              label={node.name}
              disabled={node.status != 'ready' ? true : false}
            >
              <Space size="middle">
                <strong>{node.name}</strong>
                <FormattedMessage
                  id="host.table.showIpAddress"
                  defaultMessage="IP地址: {ip}"
                  values={{ ip: node.address }}
                />
                <Badge
                  status={NodeStateMap[node.status]}
                  text={parseStatus(node.status)}
                />
              </Space>
            </Select.Option>
          );
        })}
    </Select>
  );
}
