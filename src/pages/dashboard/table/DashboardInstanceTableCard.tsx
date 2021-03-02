import { BasicTable, IColumnType } from '@/components/table/BasicTable';
import React from 'react';
import { IDashboardInstanceRecord } from '../type.d';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  MenuOutlined,
  ContainerTwoTone,
  DatabaseTwoTone,
} from '@ant-design/icons';
import Text from '@/components/text';
import Progress from '@/components/progress';
import { parseProgressNumberToCommonState, stringSlice } from '@/utils/string';
import { FormattedMessage } from 'umi';
import Button from '@/components/button';
import Card, { CardBody, CardHeader } from '@/components/card';
import Avatar from '@/components/avatar';
import { formatByteSize } from '@/utils/size';
import { SupportProductType } from '@/type';
import { CommonProductItemMap } from '@/pages/_common/product';

export interface IDashboardInstanceTableCardProps {
  records: IDashboardInstanceRecord[];

  loading: boolean;
}

export function DashboardInstanceTableCard(
  props: IDashboardInstanceTableCardProps,
) {
  const { records, loading } = props;
  const columns: IColumnType<IDashboardInstanceRecord>[] = [
    {
      key: 'Icon',
      className: 'th-w-symbol',
      dataIndex: 'productId',
      render: (productId: SupportProductType) => {
        const product = CommonProductItemMap[productId];

        return (
          product?.icon ?? (
            <Avatar>
              <DatabaseTwoTone color="#f64e60" />
            </Avatar>
          )
        );
      },
    },
    {
      key: 'name',
      className: 'th-w-main',
      render: (
        text: string,
        record: IDashboardInstanceRecord,
        index: number,
      ) => {
        return (
          <>
            <Text block title={text}>
              {stringSlice(text)}
            </Text>
            {/* <Text type="gray" block>
              {'# ' + index}
            </Text> */}
          </>
        );
      },
    },
    {
      key: 'CPUPercent',
      className: 'th-w-progress',
      render: (percent: number) => {
        return (
          <>
            <Text type="gray">CPU</Text>
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
      key: 'MEMPercent',
      className: 'th-w-progress',
      render: (percent: number) => {
        return (
          <>
            <Text type="gray">
              <FormattedMessage
                id="dashboard.text.Memory"
                defaultMessage="内存"
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
      key: 'StoragePercent',
      className: 'th-w-progress',
      render: (percent: number) => {
        return (
          <>
            <Text type="gray">
              <FormattedMessage
                id="dashboard.text.Storage"
                defaultMessage="存储"
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
      key: 'Inbound',
      render: (speed: number) => {
        return (
          <>
            <Text type="gray" block>
              <FormattedMessage
                id="dashboard.text.Inbound"
                defaultMessage="入方向"
              />
            </Text>
            <ArrowUpOutlined className="text-warning" />
            <Text>{formatByteSize(speed)}</Text>
          </>
        );
      },
    },
    {
      key: 'Outbound',
      render: (speed: number) => {
        return (
          <>
            <Text type="gray" block>
              <FormattedMessage
                id="dashboard.text.Outbound"
                defaultMessage="出方向"
              />
            </Text>
            <ArrowDownOutlined className="text-success" />
            <Text>{formatByteSize(speed)}</Text>
          </>
        );
      },
    },
  ];
  return (
    <Card flexbox>
      <CardHeader
        title={
          <FormattedMessage
            id="dashboard.text.InstanceRunningMonitor"
            defaultMessage="实例运行监控"
          />
        }
      />
      <CardBody overflow>
        <BasicTable<IDashboardInstanceRecord>
          rowKey={'id'}
          dataSource={records}
          columns={columns}
          loading={loading}
          showHeader={false}
          emptyText={
            <FormattedMessage
              id="dashboard.text.NoRunningInstance"
              defaultMessage="暂无运行中的实例"
            />
          }
        />
      </CardBody>
    </Card>
  );
}
