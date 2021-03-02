import React from 'react';
import { FormInstance } from 'antd/lib/form';
import Form from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { FormattedMessage } from 'umi';
import { Input } from 'antd';

interface IServiceNetworkFormProps {
  type: 'create' | 'update';
  form: FormInstance;
}

export function ServiceNetworkForm(props: IServiceNetworkFormProps) {
  const { form } = props;

  return (
    <>
      <FormItem
        label={
          <FormattedMessage
            id="network.table.NetworkName"
            defaultMessage="网络名称"
          />
        }
        name="name"
        initialValue=""
        required={true}
      >
        <Input />
      </FormItem>

      <FormItem
        label={
          <FormattedMessage id="network.table.Subnet" defaultMessage="子网" />
        }
        name="subnet"
        initialValue=""
        required={true}
        rules={[
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(?:3[0-1]|2[0-9]|[1-9])$/,
            message: (
              <FormattedMessage
                id="network.form.ipmsg"
                defaultMessage="请输入正确格式子网, eg: 10.0.83.0/24"
              />
            ),
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label={
          <FormattedMessage id="network.table.Gateway" defaultMessage="网关" />
        }
        name="gateway"
        initialValue=""
        // required={true}
        rules={[
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: (
              <FormattedMessage
                id="network.form.gateway"
                defaultMessage="请输入正确格式网关，eg: 0.0.83.1"
              />
            ),
          },
        ]}
      >
        <Input />
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
