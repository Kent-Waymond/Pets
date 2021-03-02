import React, { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { useDispatch, FormattedMessage } from 'umi';
import { DrawerProps } from 'antd/lib/drawer';
import { Drawer, Button } from 'antd';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { ServiceNetworkForm } from './ServiceNetworkForm';

interface ICreateServiceNetworkPanelProps extends DrawerProps {}

export function CreateServiceNetworkPanel(
  props: ICreateServiceNetworkPanelProps,
) {
  const { visible, onClose, ...resetProps } = props;
  const [CreateLoading, ChangeCreateLoading] = useState<boolean>(false);

  const [form] = useForm();
  const dispatch = useDispatch<any>();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function handleCreateNetwork(ev: any) {
    form.submit();
  }

  function onFormSubmit(values: any) {
    // console.log('formvalues ', values);
    ChangeCreateLoading(true);
    dispatch({
      type: 'network/CreateNetwork',
      payload: {
        ...values,
      },
    }).then(() => {
      handleDrawerClose(undefined);
      ChangeCreateLoading(false);
    });
  }

  const drawerLabel = (
    <FormattedMessage
      id="network.table.CreateNetwork"
      defaultMessage="创建网络"
    />
  );

  const drawerFooter = (
    <Button
      type="primary"
      onClick={handleCreateNetwork}
      // htmlType="submit"
    >
      {drawerLabel}
    </Button>
  );

  return (
    <Drawer
      title={drawerLabel}
      visible={visible}
      onClose={handleDrawerClose}
      footer={drawerFooter}
      width={700}
    >
      <BasicForm
        loading={CreateLoading}
        form={form}
        layout="vertical"
        onFinish={onFormSubmit}
        // onValuesChange={onValuesChange}
      >
        <ServiceNetworkForm type="create" form={form} />
      </BasicForm>
    </Drawer>
  );
}
