import React, { useEffect } from 'react';
import { FormattedMessage } from 'umi';
import { BasicFormItem } from '@/components-compatible/Form/BasicForm';
import { Input, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { VaccineProfile, VaccineRecord } from '../type';
const { Option } = Select;

interface VaccineFormProps {
  type: 'create' | 'update';
  form: any;
  VaccineProfile?: VaccineRecord | null;
  onFormFinish?: (values: any) => void;
}

export function VaccineForm(props: VaccineFormProps) {
  const { form, type, VaccineProfile } = props;

  useEffect(() => {
    if (type === 'update' && VaccineProfile) {
      form.setFieldsValue({
        vaccineName: VaccineProfile?.vaccineName,
        vaccineType: VaccineProfile?.vaccineType,
        vaccinePetType: VaccineProfile?.vaccinePetType,
        comment: VaccineProfile?.remarks,
      });
    }
  }, [form, VaccineProfile, type]);
  return (
    <>
      <BasicFormItem
        label="疫苗名称"
        name="vaccineName"
        initialValue=""
        required={type === 'update' ? false : true}
        rules={[
          {
            required: type === 'update' ? false : true,
          },
        ]}
      >
        <Input disabled={type === 'update'} />
      </BasicFormItem>
      <BasicFormItem
        label="疫苗类型"
        name="vaccineType"
        initialValue=""
        required={type === 'update' ? false : true}
        rules={[
          {
            required: type === 'update' ? false : true,
          },
        ]}
      >
        <Input disabled={type === 'update'} />
      </BasicFormItem>
      <BasicFormItem
        label="宠物类型"
        name="vaccinePetType"
        initialValue=""
        required={type === 'update' ? false : true}
        rules={[
          {
            required: type === 'update' ? false : true,
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
      </BasicFormItem>
      <BasicFormItem
        label={<FormattedMessage id="common.Comment" defaultMessage="备注" />}
        name="comment"
        initialValue=""
      >
        <Input disabled={type === 'update'} />
      </BasicFormItem>

      <BasicFormItem name="imageId" initialValue="" hidden={true}>
        <Input />
      </BasicFormItem>
    </>
  );
}
