import React from 'react';
import { Form, Input, Button } from 'antd';
import { useIntl, defineMessages, useDispatch, useHistory } from 'umi';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { SET_IDENTITY, GET_IDENTITY, SET_USER_TOKEN } from '@/utils/auth';

export default function LoginIndex() {
  const [form] = Form.useForm();
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useDispatch<any>();

  function handleLogin() {
    form.submit();
  }

  function handlePassbyLogin() {
    dispatch({
      type: 'account/Login',
      payload: {
        phone: '123',
        password: '1234567',
      },
    }).then((pass: boolean) => {
      if (pass) {
        history.push('/settings/feedback');
      }
    });
  }

  function onFormSubmitFinish(formvalues: any) {
    console.log('values ', formvalues);
    if (formvalues?.phone === 'root') {
      SET_IDENTITY('admin');
    } else if (formvalues?.phone !== 'root' || formvalues?.phone !== '123') {
      SET_IDENTITY('petMaster');
    }
    dispatch({
      type: 'account/Login',
      payload: {
        ...formvalues,
      },
    }).then((userId: string) => {
      if (userId) {
        SET_USER_TOKEN(userId);
        history.push('/');
        // window.location.reload()
      } else {
        form.setFieldsValue({
          ...formvalues,
          Password: '',
        });
      }
    });
  }

  return (
    <div className="ami-login">
      <div className="ami-login-container">
        <div className="ami-brand">爱宠云社区</div>
        <BasicForm form={form} onFinish={onFormSubmitFinish}>
          <Form.Item
            initialValue=""
            name="phone"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          >
            <Input size="large" placeholder="用户名" />
          </Form.Item>
          <Form.Item
            initialValue=""
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          >
            <Input.Password size="large" placeholder="密码" />
          </Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            block
            // onClick={handleLogin}
          >
            登录
          </Button>
        </BasicForm>
        <br />
        <Button
          type="default"
          size="large"
          htmlType="submit"
          block
          onClick={handlePassbyLogin}
        >
          游客登录
        </Button>
      </div>
    </div>
  );
}
