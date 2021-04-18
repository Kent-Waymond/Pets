import React, { useState } from 'react';
import { Form, Upload, message, Drawer, Button } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useDispatch } from 'umi';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { BasicFormItem } from '@/components-compatible/Form/BasicForm';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
interface IUploadLicensePanelProps extends DrawerProps {
  visible: boolean;
  PetProfileId: string;
  VaccineId: string;
  onClose: () => void;
}

function UploadLicensePanel(props: IUploadLicensePanelProps): any {
  const { VaccineId, PetProfileId, visible, onClose } = props;

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
        message.error(`${info.file.name}上传失败`);
      }
    },
  };

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose();
    }
    form.resetFields();
  }

  function handleUpload(ev: any) {
    form.submit();
  }

  async function onFormFinish(formvalues: any) {
    const { VaccineId, PetProfileId } = props;
    ChangeCreateLoaidng(true);
    const id = await dispatch({
      type: 'vaccine/UploadLicense',
      payload: {
        VaccineId: VaccineId,
        PetProfileId: PetProfileId,
        petImage: formvalues.petImage.file.response.data,
      },
    });

    if (id) {
      ChangeCreateLoaidng(false);
    } else {
      handleDrawerClose(undefined);
    }
  }

  const LicenseDrawerFooter = (
    <Button type="primary" onClick={handleUpload}>
      上传证明
    </Button>
  );
  return (
    <>
      <Drawer
        title="上传证明"
        visible={visible}
        onClose={handleDrawerClose}
        footer={LicenseDrawerFooter}
        width={600}
      >
        <BasicForm
          loading={createLoading}
          form={form}
          layout="vertical"
          onFinish={onFormFinish}
          // onValuesChange={onValuesChange}
        >
          <BasicFormItem
            label="接种证明"
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
      </Drawer>
    </>
  );
}
export default UploadLicensePanel;
