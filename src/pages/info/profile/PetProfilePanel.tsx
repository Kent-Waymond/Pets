import React, { useState } from 'react';
import { Form, Button, Drawer } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useDispatch } from 'umi';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { PetForm } from '../form/PetForm';

interface IPetProfilePanelProps extends DrawerProps {
  // title: React.ReactNode;
}

function PetProfilePanel(props: IPetProfilePanelProps) {
  const { visible, onClose } = props;

  const dispatch = useDispatch<any>();
  const [UpdateLoading, ChangeUpdateLoaidng] = useState<boolean>(false);

  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function handleUpdatePet(ev: any) {
    form.submit();
  }

  async function onFormFinish(formvalues: any) {
    ChangeUpdateLoaidng(true);
    const id = await dispatch({
      type: 'info/UpdatePet',
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
      ChangeUpdateLoaidng(false);
    } else {
      handleDrawerClose(undefined);
    }
  }

  const drawerFooter = (
    <Button type="primary" onClick={handleUpdatePet}>
      更新
    </Button>
  );
  return (
    <Drawer
      title="更新信息"
      visible={visible}
      onClose={handleDrawerClose}
      footer={drawerFooter}
      width={500}
    >
      <BasicForm
        loading={UpdateLoading}
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
      >
        <PetForm type="update" form={form} />
      </BasicForm>
    </Drawer>
  );
}

export default PetProfilePanel;
