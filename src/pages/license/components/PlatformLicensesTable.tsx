import React, { useState } from 'react';
import { BasicTable, IColumnType } from '@/components/table/BasicTable';
import { IPlatformLicenseRecord, SupportProductType } from '@/type';
import { FormattedMessage, useIntl } from 'react-intl';
import { CommonProductItemMap } from '@/pages/_common/product';
import Grid from '@/components/grid';
import Text from '@/components/text';
import Progress from '@/components/progress';
import { parseProgressNumberToCommonState } from '@/utils/string';
import moment from 'moment';
import { formatTimestamp, formatTimestampMoment } from '@/utils/date';
import Button from '@/components/button';
import { EditOutlined } from '@ant-design/icons';
import ImportLicenseProfileModal from './ImportLicenseProfileModal';
import { parseLicenseRemainDaysToCommonState } from '@/utils/string';

interface IPlatformLicensesTableProps {
  PlatformLicenses: IPlatformLicenseRecord[];
  RefreshPlatformLicenses: () => void;
  loading: boolean;
}

export function PlatformLicensesTable(props: IPlatformLicensesTableProps) {
  const { PlatformLicenses, loading, RefreshPlatformLicenses } = props;
  const [ImportLicenseVisible, ChangeImportLicenseVisible] = useState<boolean>(
    false,
  );
  const [
    currentProductId,
    ChangeCurrentProductId,
  ] = useState<null | SupportProductType>(null);

  const intl = useIntl();

  const columns: IColumnType<IPlatformLicenseRecord>[] = [
    {
      key: 'productId',
      className: 'th-w-symbol',
      render: (productId: SupportProductType) => {
        const product = CommonProductItemMap[productId];
        return product?.icon ?? productId;
      },
    },
    {
      key: 'ProductName',
      render: (text: string, record: IPlatformLicenseRecord, index: number) => {
        const product = CommonProductItemMap[record?.productId];

        return (
          <Grid.Col grid>
            <Text>{intl.formatMessage(product?.label)}</Text>
            <Text type="gray">{product?.description}</Text>
          </Grid.Col>
        );
      },
    },
    {
      key: 'quotaFree',
      className: 'th-w-progress',
      render: (quotaFree: number, record: IPlatformLicenseRecord) => {
        const { quotaSize } = record;
        let quotaUsed = Number(quotaSize) - Number(quotaFree);
        quotaUsed = quotaUsed > 0 ? quotaUsed : 0;
        const percent = Math.floor(
          (Number(quotaUsed) / Number(quotaSize)) * 100,
        );
        const product = CommonProductItemMap[record?.productId];

        return (
          <>
            <Text type="gray">
              <FormattedMessage
                id="license.table.LicenseUsage"
                defaultMessage="已分配{used}{unit}，共{total}{unit}"
                values={{
                  used: quotaUsed,
                  total: quotaSize,
                  unit: product?.unit ? intl.formatMessage(product.unit) : '',
                }}
              />
            </Text>
            <Progress
              showInfo={false}
              percent={percent}
              status={parseProgressNumberToCommonState(percent)}
            />
          </>
        );
      },
    },
    {
      key: 'notAfter',
      className: 'th-w-action',
      render: (notAfter: number) => {
        const current = moment();
        const expired = formatTimestampMoment(notAfter);
        let remainDays = expired.diff(current, 'days');
        remainDays = remainDays > 0 ? remainDays : 0;

        return (
          <Grid.Col grid>
            <Text type={parseLicenseRemainDaysToCommonState(remainDays)}>
              <FormattedMessage
                id="license.table.RemainDays"
                defaultMessage="剩余{day}天"
                values={{
                  day: remainDays,
                }}
              />
            </Text>
            <Text type="gray">
              <FormattedMessage
                id="license.table.ExpiredTime"
                defaultMessage="过期时间: {expired}"
                values={{
                  expired: notAfter > 0 ? formatTimestamp(notAfter, 'LL') : '-',
                }}
              />
            </Text>
          </Grid.Col>
        );
      },
    },
    {
      key: 'Action',
      dataIndex: 'id',
      className: 'th-w-action-2',
      render: (instanceId: string, record: IPlatformLicenseRecord) => {
        const productId = record?.productId;
        return (
          <Button
            icon={<EditOutlined />}
            onClick={() => handleImportLicense(productId)}
          ></Button>
        );
      },
    },
  ];

  function handleImportLicense(productId: SupportProductType) {
    ChangeImportLicenseVisible(true);
    if (productId) {
      ChangeCurrentProductId(productId);
    }
  }

  function CloseImportLicense() {
    ChangeCurrentProductId(null);
    ChangeImportLicenseVisible(false);
    RefreshPlatformLicenses();
  }

  return (
    <>
      <BasicTable<IPlatformLicenseRecord>
        columns={columns}
        rowKey="productId"
        dataSource={PlatformLicenses}
        loading={loading}
        showHeader={false}
      />

      {ImportLicenseVisible && currentProductId && (
        <ImportLicenseProfileModal
          productId={currentProductId}
          visible={ImportLicenseVisible}
          onCancel={CloseImportLicense}
        />
      )}
    </>
  );
}
