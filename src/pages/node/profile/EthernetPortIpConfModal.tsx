import React, { useEffect } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { ModalProps } from 'antd/lib/modal';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import {
  BasicForm,
  BasicFormItem,
} from '@/components-compatible/Form/BasicForm';
import { FormattedMessage } from 'umi';
import { RegexIPv4 } from '@/utils/regex';
import { INodeProfileEthernetPorts } from '../type';

interface IEthernetPortIpConfModalProps extends ModalProps {
  profile: INodeProfileEthernetPorts;
  onConfigChange: (values: any) => void;
}
export function EthernetPortIpConfModal(props: IEthernetPortIpConfModalProps) {
  const { profile, onConfigChange, ...restProps } = props;
  const [form] = useForm();

  function onFormFinish(values: any) {
    onConfigChange(values);
  }

  function onFormSubmit() {
    form.submit();
  }

  return (
    <Modal
      {...restProps}
      footer={
        <Button onClick={onFormSubmit}>
          <FormattedMessage id="common.modalok" defaultMessage="确定" />
        </Button>
      }
    >
      <BasicForm form={form} layout="vertical" onFinish={onFormFinish}>
        <BasicFormItem
          label={
            <FormattedMessage
              id="node.table.EthernetPortName"
              defaultMessage="网口名"
            />
          }
          name="ethernetPort"
          initialValue={profile?.name}
        >
          <Input disabled={true} />
        </BasicFormItem>
        <BasicFormItem
          label={
            <FormattedMessage
              id="node.table.EthernetIp"
              defaultMessage="网口IP"
            />
          }
          name="ip"
          initialValue=""
          required={true}
          rules={[
            {
              pattern: RegexIPv4,
              message: (
                <FormattedMessage
                  id="instance.form.IPMsg"
                  defaultMessage="请输入格式正确的IPv4地址"
                />
              ),
            },
          ]}
        >
          <Input />
        </BasicFormItem>
        <BasicFormItem
          label={
            <FormattedMessage
              id="node.table.EthernetNetmask"
              defaultMessage="网口掩码"
            />
          }
          name="mask"
          initialValue={16}
          required={true}
          rules={[{ required: true }]}
        >
          <InputNumber min={0} max={32} />
        </BasicFormItem>
      </BasicForm>
    </Modal>
  );
}
