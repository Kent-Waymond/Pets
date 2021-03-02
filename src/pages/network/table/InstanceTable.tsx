import React from 'react';
import { NetworkInstanceRecord } from '../type.d';
import { BasicTable, IColumnType } from '@/components/table/BasicTable';
import { Text } from '@/components/text/Text';
import { stringSlice } from '@/utils/string';
import { FormattedMessage } from 'react-intl';
import { formatTimestamp } from '@/utils/date';
interface InstanceTableProps {
  Instances: NetworkInstanceRecord[] | null;
  loading: boolean;
}

export function InstanceTable(props: InstanceTableProps) {
  const { Instances, loading } = props;
  const columns: IColumnType<NetworkInstanceRecord>[] = [
    {
      title: (
        <FormattedMessage
          id="network.table.InstanceName"
          defaultMessage="实例名称"
        />
      ),
      key: 'name',
      render: (text: string, record: NetworkInstanceRecord) => {
        return <Text>{stringSlice(text)}</Text>;
      },
    },
    {
      title: (
        <FormattedMessage
          id="network.table.Address"
          defaultMessage="实例地址"
        />
      ),
      key: 'address',
      render: (text: string, record: NetworkInstanceRecord) => {
        return <Text>{stringSlice(text)}</Text>;
      },
    },
    {
      title: (
        <FormattedMessage
          id="network.table.CreatTime"
          defaultMessage="创建时间"
        />
      ),
      key: 'createAt',
      render: (text: string, record: NetworkInstanceRecord) => {
        return <Text>{formatTimestamp(text)}</Text>;
      },
    },
    {
      title: (
        <FormattedMessage id="network.table.Status" defaultMessage="状态" />
      ),
      key: 'status',
      render: (text: string, record: NetworkInstanceRecord) => {
        return <Text>{stringSlice(text)}</Text>;
      },
    },
  ];

  return (
    <>
      <BasicTable<NetworkInstanceRecord>
        columns={columns}
        rowKey="id"
        dataSource={Instances ?? []}
        showHeader={false}
        loading={loading}
        compact
      />
    </>
  );
}
