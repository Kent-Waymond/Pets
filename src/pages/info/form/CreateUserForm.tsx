import React from 'react';
import { FormInstance } from 'antd/lib/form/Form';
import { Form, Button, Input } from 'antd';

interface ICreateUserFormProps {
  type: 'create' | 'update';
  form: FormInstance;
}
const FormItem = Form.Item;
export function CreateUserForm(props: ICreateUserFormProps) {
  return (
    <>
      <FormItem
        label="用户姓名"
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
        label="用户住址"
        name="address"
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
        label="手机号"
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
        label="邮箱"
        name="email"
        initialValue=""
        required={true}
        rules={[
          {
            required: true,
            message: '这是一个必填字段',
          },
        ]}
      >
        <Input style={{ width: 400, marginRight: 15 }} />
      </FormItem>
      <FormItem
        label="验证码"
        name="code"
        initialValue=""
        required={true}
        rules={[
          {
            required: true,
            message: '这是一个必填字段',
          },
        ]}
      >
        <Input style={{ width: 200 }} />
      </FormItem>
    </>
  );
}
