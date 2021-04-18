import React, { useEffect } from 'react';
import { Input, Select, Avatar } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { UserProfile } from '../type';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;
interface IUserFormProps {
  form: any;
  UserProfile?: UserProfile;
  onFormFinish: (values: any) => void;
}

export default function UserForm(props: IUserFormProps) {
  const { form, UserProfile } = props;

  useEffect(() => {
    if (UserProfile) {
      form.setFieldsValue({
        userName: UserProfile?.userName,
        nickname: UserProfile?.nickname,
        avatar: UserProfile?.avatar,
      });
    }
  }, [form, UserProfile]);

  return (
    <>
      <FormItem label="用户名字" name="userName" initialValue="">
        <Input />
      </FormItem>
      <FormItem label="昵称" name="nickname" initialValue="">
        <Input />
      </FormItem>
      <FormItem label="头像" name="avatar" initialValue="">
        <Avatar shape="square" size={64} />
      </FormItem>
    </>
  );
}
