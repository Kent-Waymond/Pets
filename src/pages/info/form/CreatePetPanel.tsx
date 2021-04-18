import React, { useState } from 'react';
import { Form, Button, Drawer } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useDispatch } from 'umi';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { PetForm } from './PetForm';

interface ICreatePetPanelProps extends DrawerProps {
  // title: React.ReactNode;
}

function CreatePetPanel(props: ICreatePetPanelProps) {
  const { visible, onClose } = props;

  const dispatch = useDispatch<any>();
  const [createLoading, ChangeCreateLoaidng] = useState<boolean>(false);

  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function handleCreateUser(ev: any) {
    form.submit();
  }

  async function onFormFinish(formvalues: any) {
    ChangeCreateLoaidng(true);
    const id = await dispatch({
      type: 'info/CreatePet',
      payload: {
        petName: formvalues.petName,
        petSpecies: formvalues.petSpecies,
        petImage: formvalues.petImage.file.response.data,
        age: formvalues.age,
        gender: formvalues.gender,
        status: formvalues.status,
      },
    });

    if (id) {
      ChangeCreateLoaidng(false);
    } else {
      handleDrawerClose(undefined);
    }
  }

  const drawerFooter = (
    <Button type="primary" onClick={handleCreateUser}>
      添加宠物
    </Button>
  );
  return (
    <Drawer
      title="添加宠物"
      visible={visible}
      onClose={handleDrawerClose}
      footer={drawerFooter}
      width={500}
    >
      <BasicForm
        loading={createLoading}
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
      >
        <PetForm type="create" form={form} />
      </BasicForm>
    </Drawer>
  );
}

export default CreatePetPanel;
