import React, { useState } from 'react';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { Button, Drawer, Form } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { FormattedMessage, useDispatch } from 'umi';
import FeedbackForm from '../form/FeedbackForm';
import { FeedbackProfile } from '../type';

interface IFeedbackProfilePanelProps extends DrawerProps {
  profile: FeedbackProfile | null;
  visible: boolean;
  onClose: (ev: any) => void;
}

export default function FeedbackProfilePanel(
  props: IFeedbackProfilePanelProps,
) {
  const { visible, profile, onClose } = props;
  const dispatch = useDispatch<any>();
  const [
    UpdateFeedbackLoading,
    ChangeUpdateFeedbackLoading,
  ] = useState<boolean>(false);
  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function handleUpdateFeedback(ev: any) {
    form.submit();
  }

  function onFormFinish(formvalues: any) {
    console.log(formvalues, 'update');
    const { profile } = props;
    ChangeUpdateFeedbackLoading(true);
    dispatch({
      type: 'network/ModifyFeedback',
      payload: {
        // TODO 更新反馈详情
        complainId: profile?.complainId,
        complainType: formvalues?.type || '',
        content: formvalues?.content || '',
        phone: formvalues?.phone || '',
        title: formvalues?.title || '',
        image: formvalues?.image || '',
      },
    }).then(() => {
      handleDrawerClose(undefined);
      ChangeUpdateFeedbackLoading(false);
    });
  }

  const drawerFooter = (
    <Button type="primary" onClick={handleUpdateFeedback}>
      更新反馈
    </Button>
  );
  return (
    <Drawer
      title="更新反馈"
      visible={visible}
      onClose={handleDrawerClose}
      footer={drawerFooter}
      width={500}
    >
      <BasicForm
        loading={UpdateFeedbackLoading}
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
      >
        <FeedbackForm
          form={form}
          type="update"
          onFormFinish={onFormFinish}
          FeedbackProfile={profile ?? null}
        />
      </BasicForm>
    </Drawer>
  );
}
