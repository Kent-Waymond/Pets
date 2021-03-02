import React from 'react';
import { Form, Input } from 'antd';
import { ILable, IName, InitialValue } from './type.d';
import { ICreateFormRecord } from '@/pages/network/type.d';
export interface IDoubleInputProps {
  form: any;
  labelObj: ILable;
  nameObj: IName;
  initialValueObj: InitialValue;
  required: boolean;
  rules: any;
  onFormFinish: (values: ICreateFormRecord) => void;
}

export function DoubleInput(props: IDoubleInputProps) {
  const {
    form,
    labelObj,
    nameObj,
    initialValueObj,
    required,
    rules,
    onFormFinish,
  } = props;

  const onFinish = (values: ICreateFormRecord) => {
    onFormFinish(values);
  };

  return (
    <Form form={form} layout="inline" onFinish={onFinish}>
      <Form.Item
        label={labelObj.LeftLabel}
        name={nameObj.LeftName}
        initialValue={initialValueObj.LeftInitialValue}
        required={required}
        rules={rules}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={labelObj.RightLabel}
        name={nameObj.RightName}
        initialValue={initialValueObj.RightInitialValue}
        required={required}
        rules={rules}
      >
        <Input />
      </Form.Item>
    </Form>
  );
}
