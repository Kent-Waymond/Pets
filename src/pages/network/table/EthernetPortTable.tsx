import React from 'react';
import { NetworkEthernetPortRecord } from '../type.d';
import { BasicTable, IColumnType } from '@/components/table/BasicTable';
import { Text } from '@/components/text/Text';
import { stringSlice } from '@/utils/string';
import { FormattedMessage } from 'react-intl';
import { Button, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'umi';

interface EthernetPortTableProps {
  EthernetPorts: NetworkEthernetPortRecord[] | null;
  ProfileId: string;
  RefreshEthernetPorts: () => void;
  loading: boolean;
}

export function EthernetPortTable(props: EthernetPortTableProps) {
  const { EthernetPorts, RefreshEthernetPorts, loading, ProfileId } = props;
  const dispatch = useDispatch<any>();

  const DeleteEthernetPort = (record: NetworkEthernetPortRecord) => {
    Modal.confirm({
      title: (
        <FormattedMessage
          id="network.table.delete"
          defaultMessage="您确认删除吗？"
        />
      ),
      cancelText: (
        <FormattedMessage id="common.modalcancel" defaultMessage="取消" />
      ),
      okText: <FormattedMessage id="common.modalok" defaultMessage="确定" />,
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'network/DetachEthernetPorts',
          payload: {
            networkId: ProfileId,
            ethernetPorts: [
              {
                hostId: record.hostId,
                ethernetPort: record.ethernetPort,
              },
            ],
          },
        }).then((success: boolean) => {
          if (success) {
            RefreshEthernetPorts();
          }
        });
      },
    });
  };

  const columns: IColumnType<NetworkEthernetPortRecord>[] = [
    {
      title: (
        <FormattedMessage
          id="network.table.EthernetPort"
          defaultMessage="网卡"
        />
      ),
      key: 'ethernetPort',
      render: (text: string, record: NetworkEthernetPortRecord) => {
        return <Text>{stringSlice(text)}</Text>;
      },
    },
    {
      title: (
        <FormattedMessage id="network.table.HostID" defaultMessage="主机ID" />
      ),
      key: 'hostId',
      render: (text: string, record: NetworkEthernetPortRecord) => {
        return <Text>{stringSlice(text)}</Text>;
      },
    },
    {
      title: (
        <FormattedMessage id="network.table.HostName" defaultMessage="主机名" />
      ),
      key: 'hostName',
      render: (text: string, record: NetworkEthernetPortRecord) => {
        return <Text>{stringSlice(text)}</Text>;
      },
    },
    {
      title: (
        <FormattedMessage id="network.table.Action" defaultMessage="操作" />
      ),
      key: 'Action',
      render: (text: string, record: NetworkEthernetPortRecord) => {
        return (
          <Button onClick={() => DeleteEthernetPort(record)}>
            <DeleteOutlined />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <BasicTable<NetworkEthernetPortRecord>
        columns={columns}
        rowKey="hostId"
        dataSource={EthernetPorts ?? []}
        showHeader={false}
        loading={loading}
        compact
      />
    </>
  );
}
