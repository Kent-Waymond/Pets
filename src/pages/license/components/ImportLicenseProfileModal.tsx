import { BasicForm } from '@/components-compatible/Form/BasicForm';
import {
  CommonProductItemInfo,
  CommonProductItemMap,
} from '@/pages/_common/product';
import { SupportProductType } from '@/type';
import { Form, Input, Modal } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { ModalProps } from 'antd/lib/modal';
import React from 'react';
import { FormattedMessage, MessageDescriptor, useIntl } from 'react-intl';
import { defineMessages, formatMessage, useDispatch } from 'umi';

interface ImportLicenseProfileModalProps extends ModalProps {
  productId: SupportProductType;
}

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  PlaceHolder: {
    id: 'license.table.PlaceHolder',
    defaultMessage: '请输入平台许可包',
  },
});

export default function ImportLicenseProfileModal(
  props: ImportLicenseProfileModalProps,
) {
  const { productId, visible, onCancel, ...restProps } = props;
  const [form] = Form.useForm();
  const intl = useIntl();

  const dispatch = useDispatch<any>();

  function handleDrawerClose(ev: any) {
    if (onCancel) {
      onCancel(ev);
    }
    form.resetFields();
  }

  const sendLicense = (ev: any) => {
    form.submit();
  };

  function onFormFinish(formvalues: any) {
    dispatch({
      type: 'license/ImportLicense',
      payload: {
        license: formvalues.license,
        productId: productId,
      },
    }).then(() => {
      handleDrawerClose(undefined);
    });
  }

  function renderModalTitle() {
    const product: CommonProductItemInfo = CommonProductItemMap[productId];
    const label = product?.label ? intl.formatMessage(product?.label) : '';
    return (
      <FormattedMessage
        id="license.table.PlatformLicenseImport"
        defaultMessage="{product}平台许可包导入"
        values={{
          product: label || productId,
        }}
      />
    );
  }

  return (
    <Modal
      visible={visible}
      maskClosable={false}
      onOk={sendLicense}
      onCancel={onCancel}
      title={renderModalTitle()}
      {...restProps}
    >
      <BasicForm form={form} layout="vertical" onFinish={onFormFinish}>
        <FormItem
          name="license"
          initialValue=""
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea
            placeholder={intl.formatMessage(intlMessages.PlaceHolder)}
            autoSize={{ minRows: 4, maxRows: 8 }}
          />
        </FormItem>
      </BasicForm>
    </Modal>
  );
}
