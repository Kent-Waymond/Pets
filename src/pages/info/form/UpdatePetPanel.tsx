import React, { useState } from 'react';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { Button, Drawer, Form } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { FormattedMessage, useDispatch } from 'umi';
import { PetForm } from './PetForm';
import { PetProfile } from '../type';

interface IUpdatePetPanelProps extends DrawerProps {
  PetProfile: PetProfile;
  visible: boolean;
  onClose: (ev: any) => void;
}

export default function UpdatePetPanel(props: IUpdatePetPanelProps) {
  const { visible, PetProfile, onClose } = props;
  const dispatch = useDispatch<any>();
  const [UpdatePetLoading, ChangeUpdatePetLoading] = useState<boolean>(false);
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

  function onFormFinish(formvalues: any) {
    console.log(formvalues, 'update');

    ChangeUpdatePetLoading(true);
    dispatch({
      type: 'info/ModifyPet',
      payload: {
        id: PetProfile?.petId,
        petName: formvalues?.petName,
        petImage: formvalues?.petImage,
        age: formvalues?.age,
        status: formvalues?.status,
      },
    }).then(() => {
      handleDrawerClose(undefined);
      ChangeUpdatePetLoading(false);
    });
  }

  const drawerFooter = (
    <Button type="primary" onClick={handleUpdatePet}>
      更新宠物信息
    </Button>
  );
  return (
    <Drawer
      title="更新宠物信息"
      visible={visible}
      onClose={handleDrawerClose}
      footer={drawerFooter}
      width={500}
    >
      <BasicForm
        loading={UpdatePetLoading}
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
      >
        <PetForm
          type="update"
          form={form}
          onFormFinish={onFormFinish}
          PetProfile={PetProfile}
        />
      </BasicForm>
    </Drawer>
  );
}
