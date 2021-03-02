import React, { useState } from 'react';
import { Form, Button, Drawer } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useDispatch } from 'umi';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import CreateProgress from '@/components-compatible/Progress/CreateProgress';
import { CreateNodeForm } from './CreateNodeForm';

interface ICreateServiceHostPanelProps extends DrawerProps {
  title: React.ReactNode;
}

function CreateServiceHostPanel(props: ICreateServiceHostPanelProps) {
  const { title, visible, onClose } = props;

  const dispatch = useDispatch<any>();
  const [createLoading, ChangeCreateLoaidng] = useState<boolean>(false);

  const [isCreating, ChangeIsCreating] = useState<boolean>(false);
  const [hostId, ChangeHostId] = useState<string>('');

  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function handleCreateDatabase(ev: any) {
    form.submit();
  }

  async function onFormFinish(formvalues: any) {
    ChangeCreateLoaidng(true);
    const id = await dispatch({
      type: 'node/CreateNode',
      payload: {
        ...formvalues,
      },
    });

    if (id) {
      ChangeHostId(id);
      ChangeIsCreating(true);
      ChangeCreateLoaidng(false);

      dispatch({
        type: 'createrate/IdObjPush',
        payload: {
          id: id,
          name: formvalues.name,
          type: 'node/GetCreateHostProgress',
        },
      });
    } else {
      handleDrawerClose(undefined);
    }
  }

  function InCreating(creating: boolean) {
    ChangeIsCreating(creating);
    handleDrawerClose(undefined);
  }

  const drawerFooter = (
    <Button type="primary" onClick={handleCreateDatabase}>
      {title}
    </Button>
  );
  return (
    <Drawer
      title={title}
      visible={visible}
      onClose={handleDrawerClose}
      footer={isCreating ? false : drawerFooter}
      width={500}
    >
      {isCreating ? (
        <CreateProgress
          id={hostId}
          title={title}
          dispatchType={'node/GetCreateNodeProgress'}
          InCreating={InCreating}
        />
      ) : (
        <BasicForm
          loading={createLoading}
          form={form}
          layout="vertical"
          onFinish={onFormFinish}
        >
          <CreateNodeForm type="create" form={form} />
        </BasicForm>
      )}
    </Drawer>
  );
}

export default CreateServiceHostPanel;
