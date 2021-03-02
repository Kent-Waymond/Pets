import Form, { FormInstance, useForm } from 'antd/lib/form/Form';
import React, { useEffect, useMemo, useState } from 'react';
import {
  BasicForm,
  BasicFormItem,
} from '@/components-compatible/Form/BasicForm';
import { FormattedMessage, useDispatch, useSelector } from 'umi';
import { NodeEthernetPortList } from '@/pages/node/profile/NodeEthernetPortList';
import { INodeRecord } from '@/pages/node/type';
import { IBHRawListDataRecord } from '@/type';
import { Select } from 'antd';
import Modal, { ModalProps } from 'antd/lib/modal/Modal';
import Button from '@/components/button';
import { NetworkEthernetPortRecord } from '../type';

interface INetworkEthernetPortAddPanelProps extends ModalProps {
  NetworkId: string;
  CurrentEthernetPortRecords: NetworkEthernetPortRecord[] | null;
}

function useFetchAllNodes(filterNodeIds: string[]): [boolean, INodeRecord[]] {
  const dispatch = useDispatch<any>();

  const [Nodes, ChangeNodes] = useState<INodeRecord[]>([]);
  const loading = useSelector(
    (state: any) => !!state.loading.effects['node/ListAllNodes'],
  );

  useEffect(() => {
    dispatch({
      type: 'node/ListAllNodes',
    }).then((response: IBHRawListDataRecord<INodeRecord>) => {
      const Records = response ? response['hosts'] : [];
      const FilterRecords = Records.filter(
        (record: INodeRecord) => !filterNodeIds.includes(record?.id),
      );
      ChangeNodes(FilterRecords);
    });
  }, [dispatch, filterNodeIds]);

  return [loading, Nodes];
}

export function NetworkEthernetPortAddPanel(
  props: INetworkEthernetPortAddPanelProps,
) {
  const { NetworkId, CurrentEthernetPortRecords, ...restProps } = props;
  const [form] = useForm();
  const dispatch = useDispatch<any>();
  const filterNodeIds = useMemo(() => {
    if (CurrentEthernetPortRecords instanceof Array) {
      return CurrentEthernetPortRecords.map(
        (record: NetworkEthernetPortRecord) => record?.hostId,
      );
    }
    return [];
  }, [CurrentEthernetPortRecords]);
  const [NodesLoading, Nodes] = useFetchAllNodes(filterNodeIds);

  function handleAddEthernetPort(ev: any) {
    form.submit();
  }
  function onFormFinished(values: any) {
    // console.log('values ', values);
    let ethernetPorts: any[] = [];

    if (values?.ethernetPorts instanceof Array && values?.nodeId) {
      const ports = values?.ethernetPorts.map((item: string) => {
        return {
          hostId: values.nodeId,
          ethernetPort: item,
        };
      });

      ethernetPorts.push(...ports);
    }
    dispatch({
      type: 'network/AttachEthernetPorts',
      payload: {
        networkId: NetworkId,
        ethernetPorts,
      },
    });
  }

  return (
    <Modal
      title={
        <FormattedMessage
          id="network.form.AddEthernetPort"
          defaultMessage="添加网口"
        />
      }
      {...restProps}
      footer={
        <Button type="primary" onClick={handleAddEthernetPort}>
          <FormattedMessage
            id="network.form.AddEthernetPort"
            defaultMessage="添加网口"
          />
        </Button>
      }
    >
      <BasicForm form={form} onFinish={onFormFinished} layout="vertical">
        <BasicFormItem
          label={
            <FormattedMessage
              id="network.form.NodeList"
              defaultMessage="节点列表"
            />
          }
          name="nodeId"
          required={true}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            loading={NodesLoading}
            placeholder={
              <FormattedMessage
                id="instance.placeholder.nodeIdSelect"
                defaultMessage="请选择节点"
              />
            }
          >
            {Nodes instanceof Array &&
              Nodes.map((node: INodeRecord) => {
                return (
                  <Select.Option key={node?.id} value={node?.id}>
                    {node?.name}
                  </Select.Option>
                );
              })}
          </Select>
        </BasicFormItem>
        <BasicFormItem noStyle={true} dependencies={['nodeId']}>
          {({ getFieldValue }: FormInstance) => {
            const nodeId = getFieldValue('nodeId');

            return (
              <BasicFormItem
                label={
                  <FormattedMessage
                    id="network.form.EthernetPortList"
                    defaultMessage="网口列表"
                  />
                }
                name="ethernetPorts"
                required={true}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <NodeEthernetPortList
                  NodeId={nodeId}
                  FilterUnAttach={true}
                  mode="multiple"
                  placeholder={
                    <FormattedMessage
                      id="network.form.SelectEthernetPorts"
                      defaultMessage="请选择网口"
                    />
                  }
                />
              </BasicFormItem>
            );
          }}
        </BasicFormItem>
      </BasicForm>
    </Modal>
  );
}
