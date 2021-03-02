import React from 'react';
import { FormInstance } from 'antd/lib/form/Form';
import { Form, Select } from 'antd';
import { FormattedMessage } from 'umi';
import { Input, InputNumber } from 'antd';

interface ICreateNodeFormProps {
  type: 'create' | 'update';
  form: FormInstance;
}
const FormItem = Form.Item;
export function CreateNodeForm(props: ICreateNodeFormProps) {
  return (
    <>
      <FormItem
        label={
          <FormattedMessage id="node.table.HostName" defaultMessage="节点名" />
        }
        name="name"
        initialValue=""
        required={true}
        rules={[
          {
            required: true,
            message: '这是一个必填字段',
          },
        ]}
      >
        <Input />
      </FormItem>

      <FormItem
        label={
          <FormattedMessage id="node.table.IpAddress" defaultMessage="IP地址" />
        }
        name="address"
        initialValue=""
        required={true}
        rules={[
          {
            required: true,
            message: '这是一个必填字段',
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: (
              <FormattedMessage
                id="node.form.IPMsg"
                defaultMessage="请输入格式正确的IPv4地址"
              />
            ),
          },
        ]}
      >
        <Input />
      </FormItem>

      <FormItem
        label={
          <FormattedMessage id="node.table.SSHPort" defaultMessage="SSH端口" />
        }
        name="sshPort"
        initialValue={22}
        required={true}
        rules={[
          {
            required: true,
            message: '这是一个必填字段',
          },
        ]}
      >
        <InputNumber />
      </FormItem>
      <FormItem
        label={
          <FormattedMessage
            id="node.table.AccountName"
            defaultMessage="账号名"
          />
        }
        name="accountName"
        initialValue={''}
        required={true}
        rules={[
          {
            required: true,
            message: '这是一个必填字段',
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label={
          <FormattedMessage
            id="node.table.PasswordType"
            defaultMessage="认证类型"
          />
        }
        name="PasswordType"
        initialValue={1}
        shouldUpdate={true}
      >
        <Select>
          <Select.Option value={1}>
            <FormattedMessage id="node.table.password" defaultMessage="密码" />
          </Select.Option>
          <Select.Option value={2}>
            <FormattedMessage
              id="node.table.passwordKey"
              defaultMessage="密钥"
            />
          </Select.Option>
        </Select>
      </FormItem>
      <FormItem noStyle={true} dependencies={['PasswordType']}>
        {({ getFieldValue }: FormInstance) => {
          if (
            getFieldValue('PasswordType') &&
            getFieldValue('PasswordType') != 1
          ) {
            return (
              <>
                <FormItem
                  label={
                    <FormattedMessage
                      id="node.table.AccountPrivateKey"
                      defaultMessage="账号私钥"
                    />
                  }
                  name="accountPrivatekey"
                  initialValue={''}
                >
                  <Input.TextArea />
                </FormItem>
                <FormItem
                  label={
                    <FormattedMessage
                      id="node.table.Passphrase"
                      defaultMessage="加密口令"
                    />
                  }
                  name="accountPrivatekeyPass"
                  initialValue={''}
                >
                  <Input.Password />
                </FormItem>
              </>
            );
          } else {
            return (
              <FormItem
                label={
                  <FormattedMessage
                    id="node.table.AccountPassword"
                    defaultMessage="账号密码"
                  />
                }
                name="accountPassword"
                initialValue={''}
              >
                <Input.Password />
              </FormItem>
            );
          }
        }}
      </FormItem>
    </>
  );
}
