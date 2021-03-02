import React, { useEffect } from 'react';
import { Select } from 'antd';
import { defineMessages, useDispatch, useSelector } from 'umi';
import { MessageDescriptor, useIntl } from 'react-intl';
import { SelectProps } from 'antd/lib/select';
import { IPlatformLicenseRecord, SupportProductType } from '@/type';

interface PlatformLicenseSpecListProps<T> extends SelectProps<T> {}

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<SupportProductType, MessageDescriptor>
>({
  USM: {
    id: 'common.product.USM',
    defaultMessage: '堡垒机',
  },
  WAF: {
    id: 'common.product.WAF',
    defaultMessage: 'Web应用防火墙',
  },
  NGFW: {
    id: 'common.product.NGFW',
    defaultMessage: '下一代防火墙',
  },
});

export function PlatformLicenseProductList(
  props: PlatformLicenseSpecListProps<string>,
) {
  const { ...restProps } = props;
  const dispatch = useDispatch();
  const intl = useIntl();
  const PlatformLicenses: IPlatformLicenseRecord[] = useSelector(
    (state: any) => state.global.PlatformLicenses,
  );
  // const [originPlaceHolder, ChangeOriginPlaceHolder] = useState<any>('');

  useEffect(() => {
    dispatch({
      type: 'global/ListPlatformLicenses',
    });
  }, [dispatch]);

  return (
    <Select {...restProps}>
      {PlatformLicenses.map((item: IPlatformLicenseRecord) => {
        const { productId } = item;
        const value = productId;
        return (
          <Select.Option key={value} value={value}>
            {`${
              intlMessages[productId]
                ? intl.formatMessage(intlMessages[productId])
                : productId
            }`}
          </Select.Option>
        );
      })}
    </Select>
  );
}
