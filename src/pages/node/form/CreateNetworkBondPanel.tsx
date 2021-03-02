import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { Button, Drawer, Form } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import React, { useState } from 'react';
import { FormattedMessage, useDispatch } from 'umi';
import CreateNetworkBondForm from './CreateNetworkBondForm';
import { INodeProfileEthernetPorts } from '../type.d';
interface ICreateNetworkBondPanelProps extends DrawerProps {
  HostId: string | null;
  EthernetPorts: INodeProfileEthernetPorts[] | null;
}

export default function CreateNetworkBondPanel(
  props: ICreateNetworkBondPanelProps,
) {
  const { HostId, EthernetPorts, visible, onClose } = props;
  const dispatch = useDispatch<any>();
  const [BondLoading, ChangeBondLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function handleBondNetwork(ev: any) {
    form.submit();
  }

  function onFormFinish(formvalues: any) {
    ChangeBondLoading(true);
    dispatch({
      type: 'node/CreateNetworkBond',
      payload: {
        id: HostId,
        ...formvalues,
      },
    }).then(() => {
      handleDrawerClose(undefined);
      ChangeBondLoading(false);
    });
  }

  const drawerLable = (
    <FormattedMessage
      id="host.table.BondNetwork"
      defaultMessage="创建链路聚合"
    />
  );

  const draerFooter = (
    <Button type="primary" onClick={handleBondNetwork}>
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
        loading={BondLoading}
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
      >
        <CreateNetworkBondForm EthernetPorts={EthernetPorts || []} />
      </BasicForm>
    </Drawer>
  );
}
