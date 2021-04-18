import React, { useState } from 'react';
import { Form, Button, Drawer, Input } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useDispatch } from 'umi';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { CreateUserForm } from './CreateUserForm';
import UploadImagePanel from './UploadImagePanel';
const FormItem = Form.Item;

interface ICreateUserPanelProps extends DrawerProps {
  // title: React.ReactNode;
}

function CreateUserPanel(props: ICreateUserPanelProps) {
  const { visible, onClose } = props;

  const dispatch = useDispatch<any>();
  const [createLoading, ChangeCreateLoaidng] = useState<boolean>(false);

  const [isCreating, ChangeIsCreating] = useState<boolean>(false);
  const [UploadImageVisible, ChangeUploadImageVisible] = useState<boolean>(
    false,
  );

  const [CodeBtn, ChangeCodeBtn] = useState<boolean>(true);
  const [RegisterBtn, ChangeRegisterBtn] = useState<boolean>(true);

  const [hostId, ChangeHostId] = useState<string>('');

  const [form] = Form.useForm();
  const { getFieldValue } = form;
  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function SendCode() {
    console.log(getFieldValue('email'));
    dispatch({
      type: 'info/sendCode',
      payload: {
        email: getFieldValue('email'),
      },
    });
  }

  function handleCreateUser(ev: any) {
    form.submit();
  }

  async function onFormFinish(formvalues: any) {
    console.log(formvalues, '111111');
    ChangeCreateLoaidng(true);

    const id = await dispatch({
      type: 'info/CreateUser',
      payload: {
        phone: formvalues.phone,
        detailAddress: formvalues.detailAddress,
        userName: formvalues.userName,
        email: formvalues.email,
        code: formvalues.code,
      },
    }).then((UserId: string) => {
      if (UserId) {
        ChangeHostId(UserId);
        ChangeIsCreating(true);
        ChangeCreateLoaidng(false);

        ChangeUploadImageVisible(true);
      } else {
        handleDrawerClose(undefined);
      }
    });
  }
  // 1094792473@qq.com
  const closeUploadImagePanel = () => {
    ChangeUploadImageVisible(false);
  };

  const ChangeEmailBtn = () => {
    ChangeCodeBtn(false);
  };

  const ChangeRegisterUserBtn = () => {
    if (!CodeBtn && getFieldValue('code')) {
      ChangeRegisterBtn(false);
    }
  };

  const PetDrawerFooter = (
    <Button type="primary" onClick={handleCreateUser}>
      上传宠物图片
    </Button>
  );
  const UserDrawerFooter = (
    <>
      <Button
        type="primary"
        disabled={CodeBtn}
        style={{ marginRight: 15 }}
        onClick={SendCode}
      >
        发送验证码
      </Button>
      <Button type="primary" disabled={RegisterBtn} onClick={handleCreateUser}>
        注册用户
      </Button>
    </>
  );
  return (
    <>
      <Drawer
        title="注册用户"
        visible={visible}
        onClose={handleDrawerClose}
        footer={UserDrawerFooter}
        width={600}
      >
        {/* 当邮箱验证码验证通过后 重新跳转到一个表单进行信息填写   填写完成后才上传图片 */}
        <BasicForm
          loading={createLoading}
          form={form}
          layout="vertical"
          onFinish={onFormFinish}
        >
          <FormItem
            label="邮箱"
            name="email"
            initialValue=""
            required={true}
            rules={[
              {
                required: true,
                message: '这是一个必填字段',
              },
            ]}
          >
            <Input
              style={{ width: 400, marginRight: 15 }}
              onChange={ChangeEmailBtn}
            />
          </FormItem>
          <FormItem
            label="验证码"
            name="code"
            initialValue=""
            // required={true}
            rules={
              [
                // {
                //   required: true,
                //   message: '这是一个必填字段',
                // },
              ]
            }
          >
            <Input style={{ width: 200 }} onChange={ChangeRegisterUserBtn} />
          </FormItem>
          {getFieldValue('code') && (
            <>
              <FormItem
                label="用户姓名"
                name="userName"
                initialValue=""
                required={true}
                rules={[
                  {
                    required: true,
                    message: '这是一个必填字段',
                  },
                ]}
              >
                <Input />
              </FormItem>

              <FormItem
                label="用户住址"
                name="detailAddress"
                initialValue=""
                required={true}
                rules={[
                  {
                    required: true,
                    message: '这是一个必填字段',
                  },
                ]}
              >
                <Input />
              </FormItem>
              <FormItem
                label="手机号"
                name="phone"
                initialValue={''}
                required={true}
                rules={[
                  {
                    required: true,
                    message: '这是一个必填字段',
                  },
                ]}
              >
                <Input />
              </FormItem>
            </>
          )}
        </BasicForm>
      </Drawer>
      {UploadImageVisible && (
        <Drawer
          title="上传宠物图片"
          visible={visible}
          onClose={handleDrawerClose}
          // footer={PetDrawerFooter}
          width={600}
        >
          <BasicForm
            loading={createLoading}
            form={form}
            layout="vertical"
            onFinish={onFormFinish}
          >
            <UploadImagePanel
              visible={UploadImageVisible}
              onClose={closeUploadImagePanel}
            />
          </BasicForm>
        </Drawer>
      )}
    </>
  );
}

export default CreateUserPanel;
