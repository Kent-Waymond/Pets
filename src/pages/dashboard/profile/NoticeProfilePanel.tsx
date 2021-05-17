import React, { useState, useEffect } from 'react';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { Form, Drawer, Input, Select, Upload, Button, Image } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useDispatch } from 'umi';
import { InboxOutlined } from '@ant-design/icons';
import { INoticeProfile } from '../type';
import { formatStringTime } from '@/utils/date';

const FormItem = Form.Item;
const { Option } = Select;

interface INoticeProfilePanelProps extends DrawerProps {
  profile: INoticeProfile | null;
  visible: boolean;
  currentUser: string;
  refresh: (dispatch: any) => void;
  onClose: (ev: any) => void;
}

export default function NoticeProfilePanel(props: INoticeProfilePanelProps) {
  const { visible, profile, refresh, currentUser, onClose } = props;
  const dispatch = useDispatch<any>();
  const [ImageUrl, ChangeImageUrl] = useState('');
  const [Content, ChangeContent] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    if (profile) {
      const ImageArr: string[] = profile?.content?.split('119.3.249.45:7070');
      if (ImageArr?.length) {
        ChangeContent(ImageArr[0]);
        ChangeImageUrl('http://119.3.249.45:7070' + ImageArr[1]);
      }
      form.setFieldsValue({
        // TODO 详情赋值
        title: profile?.title,
        noticeType: profile?.noticeType,
        content: Content,
        publishTime: formatStringTime(profile?.createTime),
      });
    }
  }, [form, Content, profile]);

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  const DeleteNotice = (ev: any) => {
    if (profile) {
      dispatch({
        type: 'dashboard/DeleteNotice',
        payload: {
          noticeId: profile?.noticeId,
        },
      }).then((res: boolean) => {
        if (res) {
          onClose(ev);
          refresh(dispatch);
        }
      });
    }
  };

  const drawerFooter = (
    <Button type="primary" onClick={DeleteNotice}>
      删除
    </Button>
  );

  return (
    <Drawer
      title="公告详情"
      visible={visible}
      footer={currentUser === 'admin' ? drawerFooter : null}
      onClose={handleDrawerClose}
      width={700}
    >
      <BasicForm
        // loading={AddFeedbackLoading}
        form={form}
        layout="vertical"
        // onFinish={onFormFinish}
        // onValuesChange={onValuesChange}
      >
        <FormItem label="公告标题" name="title" initialValue="">
          <Input readOnly />
        </FormItem>
        <FormItem label="发布时间" name="publishTime" initialValue={''}>
          <Input readOnly />
        </FormItem>

        <FormItem label="公告类型" name="noticeType" initialValue="">
          <Select>
            <Option value="1">法律法规</Option>
            <Option value="2">饲养手册</Option>
            <Option value="3">公益宣传</Option>
            <Option value="4">应急措施</Option>
            <Option value="5">禁养种类</Option>
          </Select>
        </FormItem>
        <FormItem label="图片" name="name" initialValue="">
          <Image
            // width={1200}
            height={300}
            // src={profile?.firstPicture}
            src={ImageUrl}
          />
        </FormItem>
        <FormItem label="公告内容" name="content" initialValue={''}>
          <Input.TextArea readOnly />
        </FormItem>
      </BasicForm>
    </Drawer>
  );
}
