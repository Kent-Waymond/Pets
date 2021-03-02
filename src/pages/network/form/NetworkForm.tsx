import React, { useEffect } from 'react';
import { Input, Select } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { FormattedMessage } from 'umi';
import { useIntl, defineMessages } from 'react-intl';
import { RegexIPv4, RegexSubNetMask } from '@/utils/regex';
import { ICreateFormRecord, NetworkProfile } from '../type';
import { FormInstance } from 'antd/lib/form';
import { EnumIPModes, EnumNetworkTypes } from '@/variable';
import { IpPoolInput } from './IpPoolInput';

const { Option } = Select;
interface INetworkFormProps {
  type: 'create' | 'update';
  form: any;
  NetworkProfile?: NetworkProfile;
  onFormFinish: (values: ICreateFormRecord) => void;
}
const intlMessages = defineMessages({
  NetworkName: {
    id: 'network.form.NetworkName',
    defaultMessage: '请输入网络名称',
  },
  NetWorkType: {
    id: 'network.form.NetWorkType',
    defaultMessage: '请输入网络类型',
  },
  IPMode: {
    id: 'network.form.IPMode',
    defaultMessage: '请输入IP设置模式',
  },
  IPPoolTips: {
    id: 'network.form.IPPoolTips',
    defaultMessage: '请输入起始IP',
  },
  InputStartIp: {
    id: 'network.form.InputStartIp',
    defaultMessage: '请输入开始IP',
  },
  InputEndIp: {
    id: 'network.form.InputEndIp',
    defaultMessage: '请输入结束IP',
  },
  SubnetMask: {
    id: 'network.form.SubnetMask',
    defaultMessage: '请输入掩码',
  },
  Gateway: {
    id: 'network.form.Gateway',
    defaultMessage: '请输入网关',
  },
});

export default function NetworkForm(props: INetworkFormProps) {
  const Intl = useIntl();
  const { form, type, NetworkProfile } = props;

  useEffect(() => {
    if (type === 'update' && NetworkProfile) {
      form.setFieldsValue({
        name: NetworkProfile?.name,
        type: NetworkProfile?.type,
        ipMode: NetworkProfile?.ipMode,
        comment: NetworkProfile?.comment,
        gateway: NetworkProfile?.gateway,
        subnetMask: NetworkProfile?.subnetMask,
        ipPool: NetworkProfile?.ipPool,
      });
    }
  }, [form, NetworkProfile, type]);

  function checkIpPool(rule: any, value: string) {
    if (value) {
      const [start = '', end = ''] = value.split(',');
      if (RegexIPv4.test(start) && RegexIPv4.test(end)) {
        return Promise.resolve();
      }
      return Promise.reject(Intl.formatMessage(intlMessages.IPPoolTips));
    }
  }

  return (
    <>
      <FormItem
        label={
          <FormattedMessage id="network.form.name" defaultMessage="网络名" />
        }
        name="name"
        initialValue=""
        required={true}
        rules={[
          {
            required: true,
            message: Intl.formatMessage(intlMessages.NetworkName),
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label={
          <FormattedMessage id="network.form.type" defaultMessage="网络类型" />
        }
        name="type"
        initialValue={EnumNetworkTypes.macvlan}
        required={true}
        rules={[
          {
            required: true,
            message: Intl.formatMessage(intlMessages.NetWorkType),
          },
        ]}
      >
        <Select disabled={type === 'update'}>
          <Option value={EnumNetworkTypes.macvlan}>MACVLAN</Option>
          <Option value={EnumNetworkTypes.ipvlan}>IPVLAN</Option>
        </Select>
      </FormItem>

      <FormItem noStyle={true} dependencies={['type']}>
        {/* <Select disabled={type === 'update'}>
          <Option key="dhcp" value="dhcp">
            DHCP
          </Option>
          <Option key="manual" value="manual">
            <FormattedMessage id="network.form.manual" defaultMessage="手动设置" />
          </Option>
        </Select> */}
        {({ getFieldValue, setFieldsValue }: FormInstance) => {
          if (getFieldValue('type') === EnumNetworkTypes.ipvlan) {
            setFieldsValue({
              ipMode: EnumIPModes.manual,
            });
          } else {
            setFieldsValue({
              ipMode: EnumIPModes.dhcp,
            });
          }
          return (
            <FormItem
              label={
                <FormattedMessage
                  id="network.form.ipMode"
                  defaultMessage="IP设置模式"
                />
              }
              name="ipMode"
              required={true}
              rules={[
                {
                  required: true,
                  message: Intl.formatMessage(intlMessages.IPMode),
                },
              ]}
            >
              <Select disabled={type === 'update'}>
                {getFieldValue('type') != EnumNetworkTypes.ipvlan && (
                  <Option key="dhcp" value="dhcp">
                    DHCP
                  </Option>
                )}
                <Option key="manual" value="manual">
                  <FormattedMessage
                    id="network.form.manual"
                    defaultMessage="手动设置"
                  />
                </Option>
              </Select>
            </FormItem>
          );
        }}
      </FormItem>

      <FormItem
        shouldUpdate={type === 'update' ?? false}
        dependencies={type !== 'update' ? ['ipMode'] : undefined}
        noStyle={true}
      >
        {({ getFieldValue }: FormInstance) => {
          return getFieldValue('ipMode') === 'manual' ? (
            <>
              <FormItem
                label={
                  <FormattedMessage
                    id="network.table.IpPool"
                    defaultMessage="IP池"
                  />
                }
                name="ipPool"
                required={true}
                rules={[
                  {
                    validator: checkIpPool,
                  },
                ]}
              >
                <IpPoolInput
                  PlaceHolder={{
                    start: Intl.formatMessage(intlMessages.InputStartIp),
                    end: Intl.formatMessage(intlMessages.InputEndIp),
                  }}
                />
              </FormItem>

              <FormItem
                label={
                  <FormattedMessage
                    id="network.form.subnetMask"
                    defaultMessage="掩码"
                  />
                }
                name="subnetMask"
                initialValue=""
                required={true}
                rules={[
                  {
                    required: true,
                    message: Intl.formatMessage(intlMessages.SubnetMask),
                  },
                  {
                    pattern: RegexSubNetMask,
                    message: (
                      <FormattedMessage
                        id="network.form.SubnetMask"
                        defaultMessage="请输入格式正确的掩码"
                      />
                    ),
                  },
                ]}
              >
                <Input disabled={type === 'update'} />
              </FormItem>
              <FormItem
                label={
                  <FormattedMessage
                    id="network.form.CreateGateway"
                    defaultMessage="网关"
                  />
                }
                name="gateway"
                initialValue=""
                required={true}
                rules={[
                  {
                    required: true,
                    message: Intl.formatMessage(intlMessages.Gateway),
                  },
                ]}
              >
                <Input disabled={type === 'update'} />
              </FormItem>
            </>
          ) : (
            ''
          );
        }}
      </FormItem>

      <FormItem
        label={
          <FormattedMessage id="network.table.Comment" defaultMessage="备注" />
        }
        name="comment"
        initialValue=""
      >
        <Input />
      </FormItem>
    </>
  );
}
