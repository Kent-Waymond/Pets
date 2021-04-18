import React, { useState } from 'react';
import { Form, Drawer, Input, Button, Select } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useDispatch } from 'umi';
import Editor from 'for-editor';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { BasicFormItem } from '@/components-compatible/Form/BasicForm';
import axios from '@/request/basicRequest';
const { Option } = Select;

interface ICreateCommunityPanelProps extends DrawerProps {
  visible: boolean;
  onClose: () => void;
}

function CreateCommunityPanel(props: ICreateCommunityPanelProps): any {
  const { visible, onClose } = props;

  const dispatch = useDispatch<any>();
  const [createLoading, ChangeCreateLoaidng] = useState<boolean>(false);

  const [editorValue, changeEditorValue] = useState<string>('');
  const [ImageUrl, changeImageUrl] = useState<string>('');

  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose();
    }
    form.resetFields();
  }

  function handleCreateCommunity(ev: any) {
    // ev.preventDefault();
    form.submit();
  }

  async function onFormFinish(formvalues: any) {
    ChangeCreateLoaidng(true);
    // TODO 提交editor  一起作为参数传过去

    const id = await dispatch({
      type: 'community/CreateCMoment',
      payload: {
        essayType: formvalues?.CommunityName || '',
        essayContent: editorValue || '',
        essayRange: formvalues?.CommunityType || '',
        title: formvalues?.CommunityName || '',
      },
    });

    if (id) {
      ChangeCreateLoaidng(false);
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
      <Button type="primary" onClick={handleCreateCommunity}>
        发布动态
      </Button>
    </div>
  );
  return (
    <Drawer
      title="发布动态"
      visible={visible}
      onClose={handleDrawerClose}
      footer={drawerFooter}
      width={900}
      closable={true}
      // destroyOnClose={true}
      maskClosable={false}
    >
      <>
        <BasicForm
          loading={createLoading}
          form={form}
          layout="vertical"
          onFinish={onFormFinish}
          // onValuesChange={onValuesChange}
        >
          <BasicFormItem
            label="动态标题"
            name="CommunityName"
            initialValue=""
            required={true}
            rules={[
              {
                required: true,
                message: '请输入动态标题',
              },
            ]}
          >
            <Input />
          </BasicFormItem>
          <BasicFormItem
            label="动态类型"
            name="CommunityType"
            initialValue=""
            required={true}
            rules={[
              {
                required: true,
                message: '请选择动态类型',
              },
            ]}
          >
            <Select>
              <Option value="1">寄养</Option>
              <Option value="2">好物转让</Option>
              <Option value="3">寻宠启示</Option>
              <Option value="4">好物推荐</Option>
              <Option value="5">美容推荐</Option>
              <Option value="6">医院推荐</Option>
            </Select>
          </BasicFormItem>
        </BasicForm>
        <Editor
          subfield={true}
          preview={true}
          addImg={(file) => uploadHandler(file)}
          value={editorValue}
          onChange={(value) => changeEditorValue(value)}
        />
      </>
    </Drawer>
  );
}
export default CreateCommunityPanel;
