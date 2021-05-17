import React, { useState } from 'react';
import { Form, Drawer, Input, Button, Select } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useDispatch } from 'umi';
import Editor from 'for-editor';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { BasicFormItem } from '@/components-compatible/Form/BasicForm';
import { GET_USER_TOKEN } from '@/utils/auth';
const { Option } = Select;
interface ICreateSquarePanelProps extends DrawerProps {
  visible: boolean;
  onClose: () => void;
}

function CreateSquarePanel(props: ICreateSquarePanelProps): any {
  const { visible, onClose } = props;
  const CurrentUserID = GET_USER_TOKEN();

  const dispatch = useDispatch<any>();
  const [createLoading, ChangeCreateLoaidng] = useState<boolean>(false);

  const [editorValue, changeEditorValue] = useState<string>('');
  let ImageArr: any = [];
  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose();
    }
    form.resetFields();
  }

  function handleCreateSquare(ev: any) {
    // ev.preventDefault();
    form.submit();
  }

  async function onFormFinish(formvalues: any) {
    ChangeCreateLoaidng(true);

    const id = await dispatch({
      type: 'square/CreateSMoment',
      payload: {
        essayType: formvalues?.SquareType || '',
        essayContent:
          editorValue + ',ImageUrl,' + JSON.stringify(ImageArr) || '',
        essayRange: 2,
        title: formvalues?.SquareName || '',
      },
    });

    if (id) {
      ChangeCreateLoaidng(false);
      onClose();
    }
  }
  const uploadHandler = (file: File) => {
    if (file) {
      dispatch({
        type: 'community/UploadImage',
        payload: {
          name: file,
          CurrentUserID,
        },
      }).then((response: any) => {
        if (response?.data?.data) {
          ImageArr.push('119.3.249.45:7070/file/image/' + response?.data?.data);
        }
      });
    }
  };
  const handleChange = (value: any) => {
    changeEditorValue(value);
  };

  const drawerFooter = (
    <div id="create-instance-panel-footer">
      <Button type="primary" onClick={handleCreateSquare}>
        发布动态
      </Button>
    </div>
  );

  const toolBar = {
    h1: true, // h1
    h2: true, // h2
    h3: true, // h3
    h4: true, // h4
    img: true, // 图片
    link: false, // 链接
    code: false, // 代码块
    preview: true, // 预览
    expand: true, // 全屏
    undo: true, // 撤销
    redo: true, // 重做
    save: true, // 保存
    subfield: true, // 单双栏模式
    addImgLink: false,
  };
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
            name="SquareName"
            initialValue=""
            required={true}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </BasicFormItem>
          <BasicFormItem
            label="动态类型"
            name="SquareType"
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
              <Option value="1">领养</Option>
              <Option value="2">配对</Option>
              <Option value="3">寻宠启事</Option>
            </Select>
          </BasicFormItem>
        </BasicForm>
        <Editor
          subfield={true}
          preview={true}
          addImg={(file, fileList) => uploadHandler(file)}
          value={editorValue}
          onChange={(value) => handleChange(value)}
          toolbar={toolBar}
        />
      </>
    </Drawer>
  );
}
export default CreateSquarePanel;
