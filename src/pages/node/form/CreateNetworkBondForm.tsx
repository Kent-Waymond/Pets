import { Input, Select } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage } from 'umi';
import { NodeProfileContext } from '../profile/NodeProfile';
import { INodeProfileEthernetPorts } from '../type.d';
import { EnumNodeEthernetType } from '../variable';
import { useIntl, defineMessages } from 'react-intl';

interface ICreateNetworkBondFormProps {
  EthernetPorts: INodeProfileEthernetPorts[];
}
const intlMessages = defineMessages({
  BondName: {
    id: 'nodeBond.table.BondName',
    defaultMessage: '请输入链路聚合名称',
  },
  BondSlave: {
    id: 'nodeBond.table.BondSlave',
    defaultMessage: '请选择网口名称',
  },
  BondMode: {
    id: 'nodeBond.table.BondMode',
    defaultMessage: '请选择链路聚合类型',
  },
});

export default function CreateNetworkBondForm(
  props: ICreateNetworkBondFormProps,
) {
  const { EthernetPorts } = props;
  const Intl = useIntl();

  const BondModels: any[] = [
    {
      id: 0,
      mode: (
        <FormattedMessage
          id="nodeBond.table.mode0"
          defaultMessage="平均轮询策略"
        />
      ),
    },
    {
      id: 1,
      mode: (
        <FormattedMessage id="nodeBond.table.mode1" defaultMessage="主备策略" />
      ),
    },
    {
      id: 2,
      mode: (
        <FormattedMessage id="nodeBond.table.mode2" defaultMessage="平衡策略" />
      ),
    },
    {
      id: 3,
      mode: (
        <FormattedMessage id="nodeBond.table.mode3" defaultMessage="广播策略" />
      ),
    },
    {
      id: 4,
      mode: (
        <FormattedMessage
          id="nodeBond.table.mode4"
          defaultMessage="动态链接聚合策略"
        />
      ),
    },
    {
      id: 5,
      mode: (
        <FormattedMessage
          id="nodeBond.table.mode5"
          defaultMessage="适配器传输负载均衡策略"
        />
      ),
    },
    {
      id: 6,
      mode: (
        <FormattedMessage
          id="nodeBond.table.mode6"
          defaultMessage="适配器适应性负载均衡策略"
        />
      ),
    },
  ];
  const NodeProfileCtx = useContext(NodeProfileContext);
  const FilterEthernetPorts = useMemo(() => {
    const { NodeProfile } = NodeProfileCtx;

    return EthernetPorts.filter((item: INodeProfileEthernetPorts) => {
      const { addrs, slaveType, master } = item;

      return !(
        addrs?.includes(NodeProfile?.address) ||
        (slaveType === 'bond' && !!master)
      );
    });
  }, [EthernetPorts, NodeProfileCtx]);
  return (
    <>
      <FormItem
        label={
          <FormattedMessage
            id="nodeBond.table.name"
            defaultMessage="链路聚合名称"
          />
        }
        name="name"
        initialValue=""
        required={true}
        rules={[
          {
            required: true,
            message: Intl.formatMessage(intlMessages.BondName),
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label={
          <FormattedMessage
            id="nodeBond.table.slave"
            defaultMessage="网口名称列表"
          />
        }
        name="slave"
        initialValue={[]}
        required={true}
        rules={[
          {
            required: true,
            message: Intl.formatMessage(intlMessages.BondSlave),
          },
        ]}
      >
        <Select mode="multiple">
          {FilterEthernetPorts.map((item: INodeProfileEthernetPorts) => {
            return (
              <Select.Option value={item.name} key={item.name}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </FormItem>
      <FormItem
        label={
          <FormattedMessage
            id="nodeBond.table.mode"
            defaultMessage="链路聚合类型"
          />
        }
        name="mode"
        initialValue={1}
        required={true}
      >
        <Select>
          {BondModels.map((mitem: any) => {
            return (
              <Select.Option value={mitem.id} key={mitem.id}>
                {mitem.mode}
              </Select.Option>
            );
          })}
        </Select>
      </FormItem>
    </>
  );
}
