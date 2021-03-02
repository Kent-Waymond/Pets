import React, { useContext, useMemo, useState } from 'react';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { Button, Drawer, Form } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { FormattedMessage, useDispatch } from 'umi';
import CreateVLANForm from './CreateVLANForm';
import { INodeProfileEthernetPorts } from '../type.d';
import { NodeProfileContext } from '../profile/NodeProfile';
interface ICreateVLANPanelProps extends DrawerProps {
  HostId: string | null;
  EthernetPorts: INodeProfileEthernetPorts[];
}

export default function CreateVLANPanel(props: ICreateVLANPanelProps) {
  const { HostId, EthernetPorts, visible, onClose } = props;
  const dispatch = useDispatch<any>();
  const [CreateVLANLoading, ChangeCreateVLANLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const NodeProfileCtx = useContext(NodeProfileContext);
  const FilterEthernetPorts = useMemo(() => {
    const { NodeProfile } = NodeProfileCtx;

    return EthernetPorts.filter((item: INodeProfileEthernetPorts) => {
      const { addrs, slaveType, master } = item;

      return !(
        addrs?.includes(NodeProfile?.address) ||
        (slaveType === 'bond' && !!master)
      );
    });
  }, [EthernetPorts, NodeProfileCtx]);

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function handleCreateVLAN(ev: any) {
    form.submit();
  }

  function onFormFinish(formvalues: any) {
    // console.log(formvalues, 'formvalues');
    ChangeCreateVLANLoading(true);
    dispatch({
      type: 'node/CreateVLAN',
      payload: {
        hostId: HostId,
        ...formvalues,
      },
    }).then(() => {
      handleDrawerClose(undefined);
      ChangeCreateVLANLoading(false);
    });
  }

  const drawerLable = (
    <FormattedMessage id="node.table.CreateVLAN" defaultMessage="创建VLAN" />
  );

  const draerFooter = (
    <Button type="primary" onClick={handleCreateVLAN}>
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
        loading={CreateVLANLoading}
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
      >
        <CreateVLANForm EthernetPorts={FilterEthernetPorts} />
      </BasicForm>
    </Drawer>
  );
}
