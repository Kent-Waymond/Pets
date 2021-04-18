import React, { useState } from 'react';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { Button, Drawer, Form } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { FormattedMessage, useDispatch } from 'umi';
import UserForm from './UserForm';
import { UserProfile } from '../type';

interface IUpdateUserPanelProps extends DrawerProps {
  UserProfile: UserProfile;
  visible: boolean;
  onClose: (ev: any) => void;
}

export default function UpdateUserPanel(props: IUpdateUserPanelProps) {
  const { visible, UserProfile, onClose } = props;
  const dispatch = useDispatch<any>();
  const [UpdateUserLoading, ChangeUpdateUserLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function handleUpdateUser(ev: any) {
    form.submit();
  }

  function onFormFinish(formvalues: any) {
    console.log(formvalues, 'update');

    ChangeUpdateUserLoading(true);
    dispatch({
      type: 'info/ModifyUser',
      payload: {
        id: UserProfile?.userId,
        userName: formvalues.userName ?? '',
        nickname: formvalues?.nickname ?? '',
        avatar: formvalues.avatar ?? '',
      },
    }).then(() => {
      handleDrawerClose(undefined);
      ChangeUpdateUserLoading(false);
    });
  }

  const drawerFooter = (
    <Button type="primary" onClick={handleUpdateUser}>
      更新用户
    </Button>
  );
  return (
    <Drawer
      title="更新用户"
      visible={visible}
      onClose={handleDrawerClose}
      footer={drawerFooter}
      width={500}
    >
      <BasicForm
        loading={UpdateUserLoading}
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
      >
        <UserForm
          form={form}
          onFormFinish={onFormFinish}
          UserProfile={UserProfile}
        />
      </BasicForm>
    </Drawer>
  );
}
