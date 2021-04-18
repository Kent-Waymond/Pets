import React, { useState } from 'react';
import { Form, Drawer, Input, Button } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useDispatch } from 'umi';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import axios from '@/request/basicRequest';
import FeedbackForm from './FeedbackForm';
interface ICreateMomentPanelProps extends DrawerProps {
  visible: boolean;
  onClose: () => void;
}

function CreateMomentPanel(props: ICreateMomentPanelProps): any {
  const { visible, onClose } = props;
  console.log(visible, 'visi');
  const dispatch = useDispatch<any>();
  const [AddFeedbackLoading, ChangeAddFeedbackLoaidng] = useState<boolean>(
    false,
  );

  const [editorValue, changeEditorValue] = useState<string>('');
  const [ImageUrl, changeImageUrl] = useState<string>('');

  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose();
    }
    form.resetFields();
  }

  function handleCreateFeedback(ev: any) {
    // ev.preventDefault();
    form.submit();
  }

  async function onFormFinish(formvalues: any) {
    ChangeAddFeedbackLoaidng(true);
    // TODO 提交editor  一起作为参数传过去

    const id = await dispatch({
      type: 'feedback/CreateFeedback',
      payload: {
        complainType: formvalues?.type || '',
        content: formvalues?.content || '',
        phone: formvalues?.phone || '',
        title: formvalues?.title || '',
        image: formvalues?.image || '',
      },
    });

    if (id) {
      ChangeAddFeedbackLoaidng(false);
    }
  }

  const uploadHandler = (file: File) => {
    axios.appPost('/uploadImg', { file }).then((res: any) => {
      // TODO 路径
      changeImageUrl('http://100.0.01//' + res);
      let str = editorValue + '![alt](http://100.0.01//' + res + ')';
      changeEditorValue(str);
    });
  };

  const drawerFooter = (
    <div id="create-instance-panel-footer">
      <Button type="primary" onClick={handleCreateFeedback}>
        发布反馈
      </Button>
    </div>
  );
  return (
    <Drawer
      title="发布反馈"
      visible={visible}
      onClose={handleDrawerClose}
      footer={drawerFooter}
      width={800}
      closable={true}
      // destroyOnClose={true}
      maskClosable={false}
    >
      <>
        <BasicForm
          loading={AddFeedbackLoading}
          form={form}
          layout="vertical"
          onFinish={onFormFinish}
          // onValuesChange={onValuesChange}
        >
          <FeedbackForm type="create" form={form} />
        </BasicForm>
      </>
    </Drawer>
  );
}
export default CreateMomentPanel;
