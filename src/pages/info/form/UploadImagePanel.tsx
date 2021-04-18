import React, { useState } from 'react';
import { Form, Upload, message, Button, Select } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useDispatch } from 'umi';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { BasicFormItem } from '@/components-compatible/Form/BasicForm';
import axios from '@/request/basicRequest';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
interface IUploadImagePanelProps extends DrawerProps {
  visible: boolean;
  onClose: () => void;
}

function UploadImagePanel(props: IUploadImagePanelProps): any {
  const { visible, onClose } = props;

  const dispatch = useDispatch<any>();
  const [createLoading, ChangeCreateLoaidng] = useState<boolean>(false);

  const [form] = Form.useForm();
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
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose();
    }
    form.resetFields();
  }

  function handleCreateUser(ev: any) {
    form.submit();
  }

  async function onFormFinish(formvalues: any) {
    ChangeCreateLoaidng(true);
    const id = await dispatch({
      type: 'info/CreatePet',
      payload: {
        petName: formvalues.petName,
        petSpecies: formvalues.petSpecies,
        petImage: formvalues.petImage.file.response.data,
        age: formvalues.age,
        gender: formvalues.gender,
        status: formvalues.status,
      },
    });

    if (id) {
      ChangeCreateLoaidng(false);
    } else {
      handleDrawerClose(undefined);
    }
  }
  return (
    <>
      <BasicForm
        loading={createLoading}
        form={form}
        layout="vertical"
        // onFinish={onFormFinish}
        // onValuesChange={onValuesChange}
      >
        <BasicFormItem
          label="宠物图片"
          name="Image"
          initialValue=""
          required={true}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Dragger {...ImageProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传</p>
          </Dragger>
        </BasicFormItem>
      </BasicForm>
    </>
  );
}
export default UploadImagePanel;
