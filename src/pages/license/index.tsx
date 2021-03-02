import React, { useCallback, useEffect, useMemo } from 'react';
import { PlatformLicensesTable } from './components/PlatformLicensesTable';
import { FormattedMessage, useDispatch, useSelector } from 'umi';
import { IPlatformLicenseRecord, SupportProductType } from '@/type';
import { EnumSupportProducts } from '@/variable';
import Card, { CardBody, CardHeader } from '@/components/card';

const LicenseDisplayInfoArr = [
  EnumSupportProducts.USM,
  EnumSupportProducts.WAF,
  EnumSupportProducts.NGFW,
];

const defaultPlatformLicenses: IPlatformLicenseRecord[] = LicenseDisplayInfoArr.map(
  (product: SupportProductType) => {
    return {
      customer: '-',
      issuer: '-',
      notAfter: 0,
      notBefore: 0,
      productId: product,
      quotaFree: 0,
      quotaSize: 0,
      serialNumber: '',
      specificationId: 'trial',
      status: 'NORMAL',
      version: '1.0.0',
    };
  },
);

export default function () {
  const dispatch = useDispatch();
  const PlatformLicenses: IPlatformLicenseRecord[] = useSelector(
    (state: any) => state.global.PlatformLicenses,
  );
  const ListPlatformLicensesLoading: boolean = useSelector(
    (state: any) => state.loading.effects['global/ListPlatformLicenses'],
  );

  const RefreshPlatformLicenses = useCallback(() => {
    dispatch({
      type: 'global/ListPlatformLicenses',
    });
  }, [dispatch]);
  useEffect(() => {
    RefreshPlatformLicenses();
  }, [RefreshPlatformLicenses]);

  const ComputePlatformLicenses: IPlatformLicenseRecord[] = useMemo(() => {
    const result: IPlatformLicenseRecord[] = [];
    for (let product of LicenseDisplayInfoArr) {
      const target = PlatformLicenses.find(
        (item: IPlatformLicenseRecord) => item.productId === product,
      );

      if (target) {
        result.push(target);
      } else {
        const defaultLicense = defaultPlatformLicenses.find(
          (item: IPlatformLicenseRecord) => item.productId === product,
        );
        result.push(defaultLicense!);
      }
    }
    return result;
  }, [PlatformLicenses]);

  return (
    <Card bordered>
      <CardHeader
        title={
          <FormattedMessage
            id="settings.menu.licese"
            defaultMessage="许可管理"
          />
        }
      />
      <CardBody>
        <PlatformLicensesTable
          PlatformLicenses={ComputePlatformLicenses}
          RefreshPlatformLicenses={RefreshPlatformLicenses}
          loading={ListPlatformLicensesLoading}
        />
      </CardBody>
    </Card>
  );
}
