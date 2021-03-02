import React, { useMemo } from 'react';
import List, { ListItem } from '@/components/list';
import { IPlatformLicenseRecord } from '@/type';
import Text from '@/components/text';
import Card, { CardBody, CardHeader } from '@/components/card';
import { EnumSupportProducts } from '@/variable';
import {
  CommonProductItemInfo,
  CommonProductItemMap,
} from '@/pages/_common/product';
import { FormattedMessage, useIntl } from 'umi';

export interface ProductLicenseInfo extends CommonProductItemInfo {
  total: number;
  current: number;
}
interface IDashboardLicenseCardProps {
  PlatformLicenses: IPlatformLicenseRecord[];
}

const LicenseDisplayInfoArr = [
  EnumSupportProducts.USM,
  EnumSupportProducts.WAF,
  EnumSupportProducts.NGFW,
];

const DefaultProductLicens: { [key: string]: ProductLicenseInfo } = {
  [EnumSupportProducts.USM]: {
    ...CommonProductItemMap[EnumSupportProducts.USM],
    total: 0,
    current: 0,
  },
  [EnumSupportProducts.WAF]: {
    ...CommonProductItemMap[EnumSupportProducts.WAF],
    total: 0,
    current: 0,
  },
  [EnumSupportProducts.NGFW]: {
    ...CommonProductItemMap[EnumSupportProducts.NGFW],
    total: 0,
    current: 0,
  },
};

export function DashboardLicenseCard(props: IDashboardLicenseCardProps) {
  const { PlatformLicenses } = props;
  const intl = useIntl();

  const ProductLicenses: ProductLicenseInfo[] = useMemo(() => {
    if (PlatformLicenses instanceof Array) {
      const currentMap = {
        ...DefaultProductLicens,
      };
      PlatformLicenses.forEach((item: IPlatformLicenseRecord) => {
        currentMap[item.productId] = {
          ...currentMap[item.productId],
          name: item.productId,
          total: item.quotaSize,
          current: item.quotaSize - item.quotaFree,
        };
      });

      return Object.keys(currentMap).map((item: string) => {
        return currentMap[item];
      });
    } else {
      return Object.keys(DefaultProductLicens).map((item: string) => {
        return DefaultProductLicens[item];
      });
    }
  }, [PlatformLicenses]);

  return (
    <Card height={300}>
      <CardHeader
        title={
          <FormattedMessage id="common.text.License" defaultMessage="许可" />
        }
      />
      <CardBody overflow bodyStyle={{ height: 300 - 55 }}>
        <List>
          {ProductLicenses &&
            ProductLicenses.map((license: ProductLicenseInfo) => {
              return (
                <ListItem key={license.name} avatar={license?.icon || ''}>
                  <div>
                    {license?.label
                      ? intl.formatMessage(license?.label)
                      : 'Unknown'}
                  </div>
                  <Text type="gray">
                    {license.current} / {license.total}
                  </Text>
                </ListItem>
              );
            })}
          {/* <ListItem>
            <Button block>查看许可包</Button>
          </ListItem> */}
        </List>
      </CardBody>
    </Card>
  );
}
