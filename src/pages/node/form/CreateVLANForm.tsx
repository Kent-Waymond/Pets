import React from 'react';
import { Input, Select } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { FormattedMessage } from 'umi';
import { EnumNodeEthernetType } from '../variable';
import { INodeProfileEthernetPorts } from '../type.d';
import { useIntl, defineMessages } from 'react-intl';
const { Option } = Select;
interface ICreateVLANFormProps {
  EthernetPorts: INodeProfileEthernetPorts[];
}
const intlMessages = defineMessages({
  VLANName: {
    id: 'node.form.VLANName',
    defaultMessage: '请输入VLAN名称',
  },
  VLANID: {
    id: 'node.form.VLANID',
    defaultMessage: '请输入VLAN ID',
  },
  EthernetPort: {
    id: 'node.form.EthernetPort',
    defaultMessage: '请选择以太网口',
  },
});

export default function CreateVLANForm(props: ICreateVLANFormProps) {
  const { EthernetPorts } = props;
  const Intl = useIntl();
  return (
    <>
      <FormItem
        label={
          <FormattedMessage
            id="node.form.EthernetPort"
            defaultMessage="主机以太网口"
          />
        }
        name="ethernetPort"
        required={true}
        rules={[
          {
            required: true,
            message: Intl.formatMessage(intlMessages.EthernetPort),
          },
        ]}
      >
        <Select mode="multiple">
          {EthernetPorts.map((item: INodeProfileEthernetPorts) => {
            return item.type === EnumNodeEthernetType.device ? (
              <Option value={item.name} key={item.id}>
                {item.name}
              </Option>
            ) : (
              ''
            );
          })}
        </Select>
      </FormItem>
      <FormItem
        label="VLAN ID"
        name="vlanId"
        initialValue=""
        required={true}
        rules={[
          {
            required: true,
            message: Intl.formatMessage(intlMessages.VLANID),
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label={
          <FormattedMessage id="node.form.vlanName" defaultMessage="VLAN名称" />
        }
        name="vlanName"
        initialValue=""
        required={true}
        rules={[
          {
            required: true,
            message: Intl.formatMessage(intlMessages.VLANName),
          },
        ]}
      >
        <Input />
      </FormItem>
    </>
  );
}
