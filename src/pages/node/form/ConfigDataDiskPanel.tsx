import React, { useState } from 'react';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { Button, Drawer, Form } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { FormattedMessage, useDispatch } from 'umi';
import ConfigDataDiskForm from './ConfigDataDiskForm';

interface IConfigDataDiskPanelProps extends DrawerProps {
  HostId: string | null;
}

export default function ConfigDataDiskPanel(props: IConfigDataDiskPanelProps) {
  const { HostId, visible, onClose } = props;
  const dispatch = useDispatch<any>();
  const [ConfigLoading, ChangeConfigLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function handleConfigDataDisk(ev: any) {
    form.submit();
  }

  function onFormFinish(formvalues: any) {
    ChangeConfigLoading(true);
    dispatch({
      type: 'node/ConfigDataDisk',
      payload: {
        hostId: HostId,
        ...formvalues,
      },
    }).then(() => {
      handleDrawerClose(undefined);
      ChangeConfigLoading(false);
    });
  }

  const drawerLable = (
    <FormattedMessage
      id="node.table.ConfigDataDisk"
      defaultMessage="配置主机数据盘"
    />
  );

  const draerFooter = (
    <Button type="primary" onClick={handleConfigDataDisk}>
      {drawerLable}
    </Button>
  );
  return (
    <Drawer
      title={drawerLable}
      visible={visible}
      onClose={handleDrawerClose}
      footer={draerFooter}
      width={500}
    >
      <BasicForm
        loading={ConfigLoading}
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
      >
        <ConfigDataDiskForm />
      </BasicForm>
    </Drawer>
  );
}
