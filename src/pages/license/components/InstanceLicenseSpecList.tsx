import { Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { defineMessages, useDispatch, useSelector } from 'umi';
import { InstanceLicenseSpecsRecord } from '../type.d';
import { MessageDescriptor, useIntl } from 'react-intl';
import { SelectProps } from 'antd/lib/select';
import { IPlatformLicenseRecord } from '@/type';

interface InstanceLicenseSpecListProps<T> extends SelectProps<T> {
  productId: string;
}

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  AssetCount: {
    id: 'instance.table.AssetCount',
    defaultMessage: '资产数',
  },
  ConcurrencyCount: {
    id: 'instance.table.ConcurrencyCount',
    defaultMessage: '并发数',
  },
});

export function InstanceLicenseSpecList(
  props: InstanceLicenseSpecListProps<string>,
) {
  const { productId, value, onChange, ...restProps } = props;
  const dispatch = useDispatch();
  const intl = useIntl();
  const PlatformLicenseProfile: IPlatformLicenseRecord = useSelector(
    (state: any) => state.license.PlatformLicenseProfile,
  );
  const InstanceLicenseSpecs: InstanceLicenseSpecsRecord[] = useSelector(
    (state: any) => state.license.InstanceLicenseSpecs,
  );
  const [selectValue, ChangeSelectValue] = useState<string>('');

  useEffect(() => {
    if (productId) {
      dispatch({
        type: 'license/ListInstanceLicenseSpecs',
        payload: {
          productId,
        },
      });
      dispatch({
        type: 'license/GetPlatformLicenseInfo',
        payload: {
          productId,
        },
      });
    }
  }, [dispatch, productId]);

  const FilterSpecs = useMemo(() => {
    const realInstanceLicenseSpecs =
      InstanceLicenseSpecs instanceof Array ? InstanceLicenseSpecs : [];
    const newInstanceLicenseSpecs = realInstanceLicenseSpecs.filter(
      (item: InstanceLicenseSpecsRecord) => {
        const { occupyQuota } = item;
        if (PlatformLicenseProfile) {
          const { quotaFree } = PlatformLicenseProfile;
          if (occupyQuota > quotaFree) {
            return false;
          }
        }
        return true;
      },
    );
    // 进行一次排序
    const sortByProperty = (property: string) => {
      return function (a: any, b: any) {
        return a[property] - b[property];
      };
    };
    if (newInstanceLicenseSpecs.length > 0) {
      newInstanceLicenseSpecs.sort(sortByProperty('occupyQuota'));
      const OriginOne: InstanceLicenseSpecsRecord = newInstanceLicenseSpecs[0];
      const { specificationId } = OriginOne;
      const expiredAt = PlatformLicenseProfile?.notAfter;
      const value = [specificationId, expiredAt].join('$');
      ChangeSelectValue(value);
    }
    return newInstanceLicenseSpecs;
  }, [InstanceLicenseSpecs, PlatformLicenseProfile]);

  function onSelectChange(value: any, option: any) {
    ChangeSelectValue(value);

    if (onChange) {
      onChange(value, option);
    }
  }

  return (
    <Select onChange={onSelectChange} {...restProps}>
      {FilterSpecs.map((item: InstanceLicenseSpecsRecord) => {
        const { specificationId, occupyQuota } = item;
        const expiredAt = PlatformLicenseProfile?.notAfter;
        // const
        const value = [specificationId, expiredAt].join('$');
        return (
          <Select.Option key={specificationId} value={value}>
            {`${intl.formatMessage(
              intlMessages.AssetCount,
            )}: ${occupyQuota} - ${intl.formatMessage(
              intlMessages.ConcurrencyCount,
            )}: ${occupyQuota}`}
            {/* {} */}
          </Select.Option>
        );
      })}
    </Select>
  );
}
