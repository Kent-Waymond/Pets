import React from 'react';
import { Form, Input, Button } from 'antd';
import { useIntl, defineMessages, useDispatch, useHistory } from 'umi';
import { BasicForm } from '@/components-compatible/Form/BasicForm';

const intlMessages = defineMessages({
  Username: {
    id: 'account.form.Username',
    defaultMessage: '用户名',
  },
  Password: {
    id: 'account.form.Password',
    defaultMessage: '密码',
  },
  Login: {
    id: 'account.form.Login',
    defaultMessage: '登录',
  },
  ProductName: {
    id: 'common.ProductName',
    defaultMessage: '爱宠云社区',
  },
});
export default function LoginIndex() {
  const [form] = Form.useForm();
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useDispatch<any>();

  function handleLogin() {
    form.submit();
  }

  function onFormSubmitFinish(formvalues: any) {
    console.log('values ', formvalues);
    dispatch({
      type: 'account/Login',
      payload: {
        ...formvalues,
      },
    }).then((pass: boolean) => {
      if (pass) {
        history.push('/');
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
        <div className="ami-brand">
          {intl.formatMessage(intlMessages.ProductName)}
        </div>
        <BasicForm form={form} onFinish={onFormSubmitFinish}>
          <Form.Item
            initialValue=""
            name="Username"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              size="large"
              placeholder={intl.formatMessage(intlMessages.Username)}
            />
          </Form.Item>
          <Form.Item
            initialValue=""
            name="Password"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder={intl.formatMessage(intlMessages.Password)}
            />
          </Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            block
            // onClick={handleLogin}
          >
            {intl.formatMessage(intlMessages.Login)}
          </Button>
        </BasicForm>
      </div>
    </div>
  );
}
