import React, { useState } from 'react';
import { Form, Drawer, Input, Select, Upload, Button, message } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useDispatch } from 'umi';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { InboxOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Dragger } = Upload;
const FormItem = Form.Item;

interface INewNoticePanelProps extends DrawerProps {
  visible: boolean;
  onClose: () => void;
}

function NewNoticePanel(props: INewNoticePanelProps): any {
  const { visible, onClose } = props;
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
      type: 'dashboard/CreateNotice',
      payload: {
        title: formvalues?.title || '',
        noticeType: formvalues?.noticeType,
        // 把图片插入到content中即可
        content: formvalues?.content || '',
      },
    });

    if (id) {
      ChangeAddFeedbackLoaidng(false);
      onClose();
    }
  }

  const ImageProps = {
    name: 'name',
    multiple: true,
    action:
      'http://119.3.249.45:7070/file/upload/60ecf97c-c157-4201-8e7d-e2bf896d3119',
    // headers: {
    //   'Content-Type': 'application/octet-stream',
    // },
    onChange(info: any) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name}上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name}上传失败`);
      }
    },
  };
  const drawerFooter = (
    <div id="create-instance-panel-footer">
      <Button type="primary" onClick={handleCreateFeedback}>
        发布公告
      </Button>
    </div>
  );
  return (
    <Drawer
      title="发布公告"
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
          <FormItem
            label="公告标题"
            name="title"
            initialValue=""
            required={true}
            rules={[
              {
                required: true,
                message: '请填写公告标题',
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            label="公告类型"
            name="noticeType"
            initialValue=""
            required={true}
            rules={[
              {
                required: true,
                message: '请填写公告类型',
              },
            ]}
          >
            <Select>
              <Option value="1">法律法规</Option>
              <Option value="2">饲养手册</Option>
              <Option value="3">公益宣传</Option>
              <Option value="4">应急措施</Option>
              <Option value="5">禁养种类</Option>
            </Select>
          </FormItem>
          <FormItem label="图片" name="name" initialValue="">
            <Dragger {...ImageProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽上传</p>
            </Dragger>
          </FormItem>
          <FormItem label="公告内容" name="content" initialValue={''}>
            <Input.TextArea />
          </FormItem>
        </BasicForm>
      </>
    </Drawer>
  );
}
export default NewNoticePanel;
