import { Table } from 'antd';
import React from 'react';
import { FormattedMessage } from 'umi';
import TableTdDoubleSpan from '@/components/table/TableTdDoubleSpan';
import { INodeProfileDataDisk } from '../type.d';
import Tag from '@/components/tag';
import { stringSlice } from '@/utils/string';
interface IDataDiskTableProps {
  DataDiskProfile: INodeProfileDataDisk[];
}
// const defaultProfile: INodeProfileDataDisk = {
//   name: '',
//   mountPoint: '',
//   filesystem: '',
// };

export default function DataDiskTable(props: IDataDiskTableProps) {
  const { DataDiskProfile } = props;

  if (DataDiskProfile instanceof Array) {
    const TableColumns = [
      {
        title: (
          <FormattedMessage
            id="node.table.DataDiskName"
            defaultMessage="数据盘名"
          />
        ),
        dataIndex: 'name',
        key: 'name',
        width: '35%',
        ellipsis: true,
        render: (name: string, record: INodeProfileDataDisk) => {
          return (
            <TableTdDoubleSpan
              MainSpan={<span title={name}>{name}</span>}
              MainSpanPointer={true}
            />
          );
        },
      },
      {
        title: (
          <FormattedMessage
            id="node.table.MountPoint"
            defaultMessage="数据盘挂载点"
          />
        ),
        dataIndex: 'mountPoint',
        key: 'mountPoint',
        width: '35%',
        ellipsis: true,
        render: (text: string) => {
          if (text) {
            return <Tag title={text}>{stringSlice(text, 10)}</Tag>;
          }
          return null;
        },
      },
      {
        title: (
          <FormattedMessage
            id="node.table.FileSystem"
            defaultMessage="文件系统"
          />
        ),
        dataIndex: 'filesystem',
        key: 'filesystem',
        // width: '20%',
        ellipsis: true,
        render: (text: string) => {
          if (text) {
            return <Tag title={text}>{stringSlice(text, 10)}</Tag>;
          }
          return null;
        },
      },
    ];

    return (
      <>
        <Table
          columns={TableColumns}
          dataSource={DataDiskProfile}
          rowKey="name"
          scroll={{
            y: window.innerHeight - 250,
          }}
        />
      </>
    );
  }
  return null;
}
