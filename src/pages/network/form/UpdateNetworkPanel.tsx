import React, { useState } from 'react';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { Button, Drawer, Form } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { FormattedMessage, useDispatch } from 'umi';
import NetworkForm from './NetworkForm';
import { ICreateFormRecord, NetworkProfile } from '../type';

interface IUpdateNetworkPanelProps extends DrawerProps {
  NetworkProfile: NetworkProfile;
  visible: boolean;
  onClose: (ev: any) => void;
}

export default function UpdateNetworkPanel(props: IUpdateNetworkPanelProps) {
  const { visible, NetworkProfile, onClose } = props;
  const dispatch = useDispatch<any>();
  const [UpdateNetworkLoading, ChangeUpdateNetworkLoading] = useState<boolean>(
    false,
  );
  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function handleUpdateNetwork(ev: any) {
    form.submit();
  }

  function onFormFinish(formvalues: ICreateFormRecord) {
    console.log(formvalues, 'update');

    ChangeUpdateNetworkLoading(true);
    dispatch({
      type: 'network/ModifyNetwork',
      payload: {
        id: NetworkProfile?.id,
        name: NetworkProfile?.name,
        comment: formvalues.comment ?? '',
        ipPool: formvalues?.ipPool ?? '',
        subnetMask: formvalues.subnetMask ?? '',
        gateway: formvalues.gateway ?? '',
      },
    }).then(() => {
      handleDrawerClose(undefined);
      ChangeUpdateNetworkLoading(false);
    });
  }

  const drawerLable = (
    <FormattedMessage
      id="network.table.UpdateNetwork"
      defaultMessage="更新网络"
    />
  );

  const drawerFooter = (
    <Button type="primary" onClick={handleUpdateNetwork}>
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
        loading={UpdateNetworkLoading}
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
      >
        <NetworkForm
          form={form}
          type="update"
          onFormFinish={onFormFinish}
          NetworkProfile={NetworkProfile}
        />
      </BasicForm>
    </Drawer>
  );
}
