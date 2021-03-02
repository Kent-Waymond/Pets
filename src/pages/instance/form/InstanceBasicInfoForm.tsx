import React from 'react';
import { FormattedMessage } from 'umi';
import { BasicFormItem } from '@/components-compatible/Form/BasicForm';
import { Input } from 'antd';
import { InstanceLicenseSpecList } from '@/pages/license/components/InstanceLicenseSpecList';
import moment from 'moment';
import { PlatformLicenseProductList } from '@/pages/license/components/PlatformLicenseProductList';
import { FormInstance } from 'antd/lib/form';
import { EnumSupportProducts } from '@/variable';

interface InstanceBasicInfoFormProps {}

function disabledDate(current: any) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

export function InstanceBasicInfoForm(props: InstanceBasicInfoFormProps) {
  return (
    <>
      <BasicFormItem
        label={
          <FormattedMessage
            id="instance.table.InstanceName"
            defaultMessage="实例名称"
          />
        }
        name="name"
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
        label={
          <FormattedMessage
            id="license.table.ProductImage"
            defaultMessage="镜像"
          />
        }
        name="product"
        initialValue={EnumSupportProducts.USM}
        required={true}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <PlatformLicenseProductList
          placeholder={
            <FormattedMessage
              id="instance.placeholder.productImageSelect"
              defaultMessage="请选择镜像"
            />
          }
        />
      </BasicFormItem>
      <BasicFormItem noStyle={true} dependencies={['product']}>
        {({ getFieldValue }: FormInstance) => {
          const productId = getFieldValue('product');

          return (
            <BasicFormItem
              label={
                <FormattedMessage
                  id="license.table.Specifications"
                  defaultMessage="规格"
                />
              }
              name="specifications"
              required={true}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InstanceLicenseSpecList
                productId={productId}
                disabled={!productId}
                placeholder={
                  <FormattedMessage
                    id="instance.placeholder.specificationsSelect"
                    defaultMessage="请选择许可规格"
                  />
                }
              />
            </BasicFormItem>
          );
        }}
      </BasicFormItem>

      <BasicFormItem
        label={<FormattedMessage id="common.Comment" defaultMessage="备注" />}
        name="comment"
        initialValue=""
      >
        <Input />
      </BasicFormItem>

      <BasicFormItem name="imageId" initialValue="" hidden={true}>
        <Input />
      </BasicFormItem>
    </>
  );
}
