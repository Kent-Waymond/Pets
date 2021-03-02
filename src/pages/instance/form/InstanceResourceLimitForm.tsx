import React from 'react';
import { FormattedMessage } from 'umi';
import { BasicFormItem } from '@/components-compatible/Form/BasicForm';
import { Input } from 'antd';

interface InstanceResourceLimitFormProps {}

export function InstanceResourceLimitForm(
  props: InstanceResourceLimitFormProps,
) {
  return (
    <>
      <BasicFormItem
        label="CPU"
        name="cpu"
        required={true}
        initialValue={2}
        style={{ width: 200 }}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input type="number" addonAfter={'CPU'} />
      </BasicFormItem>
      <BasicFormItem
        label={
          <FormattedMessage id="instance.table.Memory" defaultMessage="内存" />
        }
        name="memory"
        initialValue={4}
        required={true}
        style={{ width: 200 }}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input type="number" addonAfter={'GB'} />
      </BasicFormItem>
      <BasicFormItem
        label={
          <FormattedMessage
            id="instance.table.DiskSize"
            defaultMessage="数据盘"
          />
        }
        name="diskSize"
        initialValue={100}
        required={true}
        style={{ width: 200 }}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input type="number" addonAfter={'GB'} />
      </BasicFormItem>
    </>
  );
}
