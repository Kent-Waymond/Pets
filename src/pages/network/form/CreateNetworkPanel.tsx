import React, { useContext, useMemo, useState } from 'react';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { Button, Drawer, Form } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { FormattedMessage, useDispatch } from 'umi';
import NetworkForm from './NetworkForm';
import { ICreateFormRecord } from '../type.d';

interface ICreateNetworkPanelProps extends DrawerProps {
  visible: boolean;
  onClose: (ev: any) => void;
}

export default function CreateNetworkPanel(props: ICreateNetworkPanelProps) {
  const { visible, onClose } = props;
  const dispatch = useDispatch<any>();
  const [CreateNetworkLoading, ChangeCreateNetworkLoading] = useState<boolean>(
    false,
  );
  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function handleCreateNetwork(ev: any) {
    form.submit();
  }

  function onFormFinish(formvalues: ICreateFormRecord) {
    // console.log(formvalues)
    ChangeCreateNetworkLoading(true);
    dispatch({
      type: 'network/CreateNetwork',
      payload: {
        name: formvalues.name,
        ipMode: formvalues.ipMode,
        type: Number(formvalues.type),
        comment: formvalues.comment ?? '',
        ipPool: formvalues.ipPool ?? '',
        subnetMask: formvalues.subnetMask ?? '',
        gateway: formvalues.gateway ?? '',
      },
    }).then(() => {
      handleDrawerClose(undefined);
      ChangeCreateNetworkLoading(false);
    });
  }

  const drawerLable = (
    <FormattedMessage
      id="network.table.CreateNetwork"
      defaultMessage="创建网络"
    />
  );

  const drawerFooter = (
    <Button type="primary" onClick={handleCreateNetwork}>
      {drawerLable}
    </Button>
  );
  return (
    <Drawer
      title={drawerLable}
      visible={visible}
      onClose={handleDrawerClose}
      footer={drawerFooter}
      width={500}
    >
      <BasicForm
        loading={CreateNetworkLoading}
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
      >
        <NetworkForm form={form} type="create" onFormFinish={onFormFinish} />
      </BasicForm>
    </Drawer>
  );
}
