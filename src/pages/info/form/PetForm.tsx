import React, { useEffect } from 'react';
import { FormInstance } from 'antd/lib/form/Form';
import { Form, Select, Radio, Upload, message } from 'antd';
import { Input, InputNumber } from 'antd';
import { PetProfile } from '../type.d';
import { InboxOutlined } from '@ant-design/icons';
import { GET_USER_TOKEN } from '@/utils/auth';

const { Option } = Select;
const { Dragger } = Upload;

interface IPetFormProps {
  type: 'create' | 'update';
  form: FormInstance;
  onFormFinish?: (formvalues: any) => void;
  PetProfile?: PetProfile;
}
const FormItem = Form.Item;
export function PetForm(props: IPetFormProps) {
  const CurrentUserID = GET_USER_TOKEN();

  const { type, PetProfile, form, onFormFinish } = props;

  const ImageProps = {
    name: 'name',
    multiple: true,
    action: `http://119.3.249.45:7070/file/upload/${CurrentUserID}`,
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

  useEffect(() => {
    if (type === 'update' && PetProfile) {
      form.setFieldsValue({
        petName: PetProfile?.petName,
        petSpecies: PetProfile?.petSpecies,
        petImage: PetProfile?.petImage,
        age: PetProfile?.age,
        gender: PetProfile?.gender,
        status: PetProfile?.status,
      });
    }
  }, [form, PetProfile, type]);

  return (
    <>
      <FormItem
        label="宠物名称"
        name="petName"
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
        label="宠物种类"
        name="petSpecies"
        initialValue=""
        required={true}
        rules={[
          {
            required: true,
            message: '这是一个必填字段',
          },
        ]}
      >
        <Select disabled={type === 'update'}>
          <Option value="汪星人" title="汪星人">
            汪星人
          </Option>
          <Option value="喵星人" title="喵星人">
            喵星人
          </Option>
          <Option value="啮齿动物" title="啮齿动物">
            啮齿动物
          </Option>
          <Option value="猛禽" title="猛禽">
            猛禽
          </Option>
          <Option value="爬行动物" title="爬行动物">
            爬行动物
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="宠物照片"
        name="petImage"
        initialValue={''}
        required={true}
        rules={[
          {
            required: true,
            message: '这是一个必填字段',
          },
        ]}
      >
        <Dragger {...ImageProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽上传</p>
        </Dragger>
      </FormItem>
      <FormItem
        label="年龄"
        name="age"
        initialValue={0}
        required={true}
        rules={[
          {
            required: true,
            message: '这是一个必填字段',
          },
        ]}
      >
        <InputNumber />
      </FormItem>
      <FormItem
        label="性别"
        name="gender"
        initialValue={22}
        required={true}
        rules={[
          {
            required: true,
            message: '这是一个必填字段',
          },
        ]}
      >
        <Radio.Group disabled={type === 'update'}>
          <Radio value="1">雄性</Radio>
          <Radio value="0">雌性</Radio>
        </Radio.Group>
      </FormItem>
      <FormItem
        label="成年状态"
        name="status"
        initialValue={22}
        required={true}
        rules={[
          {
            required: true,
            message: '这是一个必填字段',
          },
        ]}
      >
        <Radio.Group>
          <Radio value="1">成年</Radio>
          <Radio value="0">幼崽</Radio>
        </Radio.Group>
      </FormItem>
    </>
  );
}
