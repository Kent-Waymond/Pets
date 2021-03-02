import { Button, Popconfirm, Table, Typography } from 'antd';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'umi';
import TableTdDoubleSpan from '@/components/table/TableTdDoubleSpan';
import { MessageDescriptor, useIntl } from 'react-intl';
import {
  INodeProfileEthernetPorts,
  NodeEthernetNetworkStateType,
  NodeEthernetType,
} from '../type.d';
import {
  EnumNodeEthernetNetworkState,
  EnumNodeEthernetType,
} from '../variable';
import EthernetPortProfilePanel from './EthernetPortProfilePanel';
import Tag from '@/components/tag';
import { stringSlice } from '@/utils/string';
interface IEthernetPortsProps {
  EthernetPorts: INodeProfileEthernetPorts[];
  NodeId: string;
  loading: boolean;
  handleDeleteBond: (name: string) => void;
  RefreshNodeEthernetPorts: () => void;
}
const defaultProfile: INodeProfileEthernetPorts = {
  id: '',
  name: '',
  type: 'device',
  state: 'up',
  connection: false,
  addrs: [],
  slaveType: 'bond',
  master: '',
  createAt: '',
  remark: '',
};

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  confirmDeleteBond: {
    id: 'node.table.confirmDeleteBond',
    defaultMessage: '您确认移除该节点吗？',
  },
  device: {
    id: 'node.ethernetType.device',
    defaultMessage: '物理网口',
  },
  bond: {
    id: 'node.ethernetType.bond',
    defaultMessage: 'bond网口',
  },
  vlan: {
    id: 'node.ethernetType.vlan',
    defaultMessage: 'vlan网口',
  },
  connected: {
    id: 'node.networkstate.connected',
    defaultMessage: '已连接',
  },
  disconnected: {
    id: 'node.networkstate.disconnected',
    defaultMessage: '已断开',
  },
});

export const EthernetTypeMap: {
  [key in NodeEthernetType]: MessageDescriptor;
} = {
  [EnumNodeEthernetType.device]: intlMessages.device,
  [EnumNodeEthernetType.bond]: intlMessages.bond,
  [EnumNodeEthernetType.vlan]: intlMessages.vlan,
};

export const EthernetNetworkStateMap: {
  [key in NodeEthernetNetworkStateType]: MessageDescriptor;
} = {
  [EnumNodeEthernetNetworkState.up]: intlMessages.connected,
  [EnumNodeEthernetNetworkState.down]: intlMessages.disconnected,
};

export default function EthernetPortsTable(props: IEthernetPortsProps) {
  const {
    EthernetPorts,
    NodeId,
    loading,
    handleDeleteBond,
    RefreshNodeEthernetPorts,
  } = props;
  const intl = useIntl();

  const [
    EthernetPortProfileVisible,
    ChangeEthernetPortProfileVisible,
  ] = useState(false);

  const [
    EthernetPortProfile,
    changeEthernetPortProfile,
  ] = useState<INodeProfileEthernetPorts | null>(defaultProfile);
  const [EthernetPortSlaves, changeEthernetPortSlaves] = useState<
    INodeProfileEthernetPorts[]
  >();

  const GetEthernetPortSlaves = useCallback(
    (record: INodeProfileEthernetPorts) => {
      let EthernetPortSlaves;
      if (EthernetPorts && record.type === 'bond') {
        EthernetPortSlaves = EthernetPorts.filter(
          (item: INodeProfileEthernetPorts) =>
            item.master === record.name && item.slaveType == 'bond',
        );
      }
      const newEthernetPortSlaves = EthernetPortSlaves
        ? EthernetPortSlaves
        : [];
      changeEthernetPortSlaves(newEthernetPortSlaves);
    },
    [EthernetPorts],
  );
  const OpenEthernetPortProfilePanel = useCallback(
    (record: INodeProfileEthernetPorts) => {
      ChangeEthernetPortProfileVisible(true);
      changeEthernetPortProfile(record);
      GetEthernetPortSlaves(record);
    },
    [GetEthernetPortSlaves],
  );

  const CloseEthernetPortProfilePanel = useCallback(() => {
    ChangeEthernetPortProfileVisible(false);
    changeEthernetPortProfile(null);
    RefreshNodeEthernetPorts();
  }, [RefreshNodeEthernetPorts]);

  useEffect(() => {
    if (EthernetPortProfile) {
      const record = EthernetPorts.find(
        (item: INodeProfileEthernetPorts) =>
          item.name === EthernetPortProfile?.name,
      );
      if (record) {
        OpenEthernetPortProfilePanel(record);
      }
    }
  }, [EthernetPorts, EthernetPortProfile, OpenEthernetPortProfilePanel]);

  if (EthernetPorts instanceof Array) {
    const TableColumns = [
      {
        title: (
          <FormattedMessage
            id="node.table.EthernetPortName"
            defaultMessage="网口名"
          />
        ),
        dataIndex: 'name',
        key: 'name',
        width: '15%',
        ellipsis: true,
        render: (name: string, record: INodeProfileEthernetPorts) => {
          return (
            <TableTdDoubleSpan
              MainSpan={
                <span
                  onClick={(ev: any) => OpenEthernetPortProfilePanel(record)}
                  title={name}
                >
                  {name}
                </span>
              }
              MainSpanPointer={true}
            />
          );
        },
      },
      {
        title: (
          <FormattedMessage
            id="node.table.EthernetType"
            defaultMessage="网口类型"
          />
        ),
        dataIndex: 'type',
        key: 'type',
        width: '12%',
        ellipsis: true,
        render: (type: NodeEthernetType) => {
          const displayLabel = EthernetTypeMap[type]
            ? intl.formatMessage(EthernetTypeMap[type])
            : type;

          return (
            <Typography.Text title={displayLabel}>
              {displayLabel}
            </Typography.Text>
          );
        },
      },
      {
        title: (
          <FormattedMessage
            id="node.table.networkState"
            defaultMessage="联网状态"
          />
        ),
        dataIndex: 'state',
        key: 'state',
        width: '12%',
        ellipsis: true,
        render: (state: NodeEthernetNetworkStateType) => {
          const displayLabel = EthernetNetworkStateMap[state]
            ? intl.formatMessage(EthernetNetworkStateMap[state])
            : state;

          return (
            <Typography.Text title={displayLabel}>
              {displayLabel}
            </Typography.Text>
          );
        },
      },
      {
        title: (
          <FormattedMessage
            id="node.table.masterNode"
            defaultMessage="所属节点"
          />
        ),
        dataIndex: 'master',
        key: 'master',
        width: '15%',
        ellipsis: true,
        render: (text: string) => {
          return (
            <Typography.Text title={text}>
              {stringSlice(text, 12)}
            </Typography.Text>
          );
        },
      },
      {
        title: (
          <FormattedMessage id="node.table.addrs" defaultMessage="地址列表" />
        ),
        dataIndex: 'addrs',
        key: 'addrs',
        width: '20%',
        ellipsis: true,
        render: (addrs: string[]) => {
          if (addrs instanceof Array && addrs?.length > 0) {
            const address = addrs.map((item: string) => {
              return (
                <Typography.Text code key={item} title={item}>
                  {stringSlice(item, 12)} <br />{' '}
                </Typography.Text>
              );
            });
            return address;
          } else {
            return null;
          }
        },
      },
      {
        title: (
          <FormattedMessage id="common.text.Comment" defaultMessage="备注" />
        ),
        dataIndex: 'remark',
        // width: '20%',
        ellipsis: true,
        render: (text: string) => {
          if (text) {
            return <Tag title={text}>{stringSlice(text, 10)}</Tag>;
          }
          return null;
        },
      },
      {
        key: 'Action',
        width: '12%',
        render: (name: string, record: INodeProfileEthernetPorts) => (
          <Popconfirm
            title={intl.formatMessage(intlMessages.confirmDeleteBond)}
            onConfirm={() => handleDeleteBond(record.name)}
            disabled={record.type == 'bond' ? false : true}
          >
            <Button
              size="small"
              disabled={record.type == 'bond' ? false : true}
            >
              <FormattedMessage id="common.text.Delete" defaultMessage="删除" />
            </Button>
          </Popconfirm>
        ),
      },
    ];

    return (
      <>
        <Table
          loading={loading}
          columns={TableColumns}
          dataSource={EthernetPorts}
          rowKey="name"
          scroll={{
            y: window.innerHeight - 250,
          }}
        />
        {EthernetPortProfileVisible && (
          <EthernetPortProfilePanel
            visible={EthernetPortProfileVisible}
            profile={EthernetPortProfile ? EthernetPortProfile : defaultProfile}
            EthernetPortSlaves={EthernetPortSlaves ? EthernetPortSlaves : []}
            onClose={CloseEthernetPortProfilePanel}
          />
        )}
      </>
    );
  }
  return null;
}
