import {
  BasicForm,
  BasicFormItem,
} from '@/components-compatible/Form/BasicForm';
import { InstanceLicenseSpecList } from '@/pages/license/components/InstanceLicenseSpecList';
import { ModalProps } from 'antd/lib/modal';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment';
import React from 'react';
import { FormattedMessage, useDispatch } from 'umi';
import { DatePicker, Form } from 'antd';
import { formatMomentToTimestamp, formatTimestampMoment } from '@/utils/date';
import { InstanceProfileType } from '../type';

interface SpecificationChangeProps extends ModalProps {
  profile: InstanceProfileType | null;
}

// 获取原来信息，重新进行选择

export default function SpecificationChange(props: SpecificationChangeProps) {
  const { title, visible, profile, onCancel } = props;
  const InstanceId = profile?.id || '';
  const specId = profile?.LicenseConfig?.specId || '';
  const productId = profile?.LicenseConfig?.productId || '';
  const version = profile?.LicenseConfig?.version || '';
  const expireAt = profile?.LicenseConfig?.expireAt || 0;
  const specDescription = profile?.LicenseConfig?.specDescription || '';

  const originTime = formatTimestampMoment(expireAt);
  // console.log(restProps)

  const [form] = Form.useForm();
  const dispatch = useDispatch<any>();

  function disabledDate(current: any) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  function handleCancel(ev: any) {
    if (onCancel) {
      onCancel(ev);
    }
  }

  function handleSubmit() {
    form.submit();
  }

  function onFormFinish(formvalues: any) {
    // console.log(formvalues);
    if (profile) {
      const [specId = '', expired] = formvalues?.specId?.split('$');
      const expireTime = Number(expired);
      dispatch({
        type: 'instance/SpecificationChange',
        payload: {
          id: InstanceId,
          expireAt: expireTime || undefined,
          specId,
        },
      }).then(() => {
        handleCancel(null);
      });
    }
  }

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      cancelText={
        <FormattedMessage id="common.modalcancel" defaultMessage="取消" />
      }
      okText={<FormattedMessage id="common.modalok" defaultMessage="确定" />}
    >
      <BasicForm form={form} layout="vertical" onFinish={onFormFinish}>
        <BasicFormItem
          label={
            <FormattedMessage
              id="license.table.Specifications"
              defaultMessage="规格"
            />
          }
          name="specId"
          required={true}
          initialValue={''}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InstanceLicenseSpecList
            productId={productId}
            placeholder={
              <FormattedMessage
                id="instance.placeholder.specificationsSelect"
                defaultMessage="请选择许可规格"
              />
            }
          />
        </BasicFormItem>
        {/* <BasicFormItem
          label={<FormattedMessage id="instance.table.ExpireTime" defaultMessage="过期时间" />}
          name="expireAt"
          required={true}
          initialValue={originTime}
          rules={[
            {
              required: true,
            },
          ]}
          style={{ width: 200 }}
          hidden={true}
        >
          <DatePicker showNow={false} format={'L'} disabledDate={disabledDate} />
        </BasicFormItem> */}
      </BasicForm>
    </Modal>
  );
}
