import React, { useEffect } from 'react';
import { Input, Select, Upload, Button, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { FeedbackRecord, FeedbackProfile } from '../type';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
interface IFeedbackFormProps {
  type: 'create' | 'update';
  form: any;
  FeedbackProfile?: FeedbackProfile | null;
  onFormFinish?: (values: any) => void;
}

export default function FeedbackForm(props: IFeedbackFormProps) {
  const { form, type, FeedbackProfile } = props;

  useEffect(() => {
    if (type === 'update' && FeedbackProfile) {
      form.setFieldsValue({
        // TODO 详情赋值
        title: FeedbackProfile?.title,
        photo: FeedbackProfile?.phone,
        content: FeedbackProfile?.content,
        type: FeedbackProfile?.complainType,
        image: FeedbackProfile?.image,
      });
    }
  }, [form, FeedbackProfile, type]);

  const action = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };
  return (
    <>
      <FormItem
        label="反馈标题"
        name="title"
        initialValue=""
        required={true}
        rules={[
          {
            required: true,
            message: '请填写反馈标题',
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem label="图片" name="image" initialValue="">
        <Upload {...action}>
          <Button icon={<UploadOutlined />}>点击上传</Button>
        </Upload>
      </FormItem>
      <FormItem
        label="反馈类型"
        name="type"
        initialValue="advice"
        required={true}
        rules={[
          {
            required: true,
            message: '请选择反馈类型',
          },
        ]}
      >
        <Select disabled={type === 'update'}>
          <Option value="advice">建议</Option>
          <Option value="report">举报</Option>
          <Option value="complain">投诉</Option>
        </Select>
      </FormItem>
      <FormItem label="联系电话" name="phone" initialValue={''}>
        <Input />
      </FormItem>
      <FormItem label="反馈内容" name="content" initialValue={''}>
        <Input.TextArea />
      </FormItem>
    </>
  );
}
