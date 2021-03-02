import React, { useState } from 'react';
import { BasicTable, IColumnType } from '@/components/table/BasicTable';
import { stringSlice } from '@/utils/string';
import Pagination from '@/components/pagination';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import Text from '@/components/text';
import { NetworkRecord, NetworkProfile } from '../type.d';
import { Drawer } from 'antd';
import { EditOutlined, GoldTwoTone } from '@ant-design/icons';
import Avatar from '@/components/avatar';
import Grid, { Row } from '@/components/grid';
import { NetworkProfilePanel } from '../profile/NetworkProfilePanel';
import { EnumIPModes } from '@/variable';
import Tag from '@/components/tag';
import Button from '@/components/button';

interface INetworkTableProps {
  NetworkRecord: NetworkRecord[];
  TotalCount: number;
  RefreshNetworks: (params: any) => void;
  loading: boolean;
}
export const IPModeMap: { [key in EnumIPModes]: string | React.ReactNode } = {
  [EnumIPModes.dhcp]: 'DHCP',
  [EnumIPModes.manual]: (
    <FormattedMessage id="network.ipmode.manual" defaultMessage="手动设置" />
  ),
};

export function NetworkTable(props: INetworkTableProps) {
  const { NetworkRecord, TotalCount, loading, RefreshNetworks } = props;
  const Intl = useIntl();
  const [PageNumber, ChangePageNumber] = useState<number>(1);
  const [PageSize, ChangePageSize] = useState<number>(20);
  const [NetworkProfileVisible, ChangeNetworkProfileVisible] = useState(false);
  const [
    NetworkProfile,
    ChangeNetworkProfile,
  ] = useState<NetworkProfile | null>(null);
  const [TargetPanel, ChangeTargetPanel] = useState<string>('');

  const OpenNetworkProfilePanel = (
    record: NetworkRecord,
    panelKey?: string,
  ) => {
    ChangeNetworkProfileVisible(true);
    ChangeNetworkProfile(record as NetworkProfile);
    if (panelKey) {
      ChangeTargetPanel(panelKey);
    }
  };

  const CloseNetworkProfilePanel = () => {
    ChangeNetworkProfileVisible(false);
    RefreshNetworks({ PageNumber, PageSize });
  };

  const columns: IColumnType<NetworkRecord>[] = [
    {
      title: (
        <FormattedMessage
          id="network.table.NameAndIPMode"
          defaultMessage="名称/IP设置"
        />
      ),
      key: 'name',
      dataIndex: 'name',
      render: (text: number, record: NetworkRecord) => {
        return (
          <Row flex>
            <Avatar
              status={
                record.ipMode !== EnumIPModes.dhcp ? 'warning' : 'primary'
              }
            >
              <GoldTwoTone
                twoToneColor={
                  record.ipMode !== EnumIPModes.dhcp ? '#ffa800' : '#2a92fc'
                }
              />
            </Avatar>
            <Grid.Col grid>
              <Text>{stringSlice(record.name)}</Text>
              <Text type="gray">
                {IPModeMap[record.ipMode] ?? record.ipMode}
              </Text>
            </Grid.Col>
          </Row>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="network.table.GatewayAndSubnetMask"
          defaultMessage="网关/掩码"
        />
      ),
      key: 'gateway',
      dataIndex: 'gateway',
      render: (text: string, record: NetworkRecord) => {
        return (
          <Grid.Col grid>
            <Text>
              {record.ipMode !== EnumIPModes.dhcp
                ? stringSlice(record.gateway)
                : '-'}
            </Text>
            <Text type="gray">
              {record.ipMode !== EnumIPModes.dhcp ? record.subnetMask : '-'}
            </Text>
          </Grid.Col>
        );
      },
    },
    {
      title: (
        <FormattedMessage id="network.table.IpPool" defaultMessage="IP池" />
      ),
      key: 'ipPool',
      dataIndex: 'ipPool',
      render: (text: string, record: NetworkRecord) => {
        return (
          <Text title={text}>
            {record.ipMode !== EnumIPModes.dhcp
              ? record.ipPool.replace(',', ' - ')
              : '-'}
          </Text>
        );
      },
    },
    {
      title: (
        <FormattedMessage id="network.table.ethernets" defaultMessage="网卡" />
      ),
      key: 'ethernetPortCount',
      dataIndex: 'ethernetPortCount',
      render: (text: number, record: NetworkRecord) => {
        return (
          <Tag
            status="primary"
            onClick={() => OpenNetworkProfilePanel(record, 'ethernets')}
            pointer
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: (
        <FormattedMessage id="network.table.instances" defaultMessage="实例" />
      ),
      key: 'instanceCount',
      dataIndex: 'instanceCount',
      render: (text: number, record: NetworkRecord) => {
        return (
          <Tag
            status="primary"
            onClick={() => OpenNetworkProfilePanel(record, 'instances')}
            pointer
          >
            {text}
          </Tag>
        );
      },
    },
    {
      key: 'Action',
      dataIndex: 'id',
      className: 'th-w-action-2',
      render: (networkId: string, record: NetworkRecord) => {
        return (
          <Button
            icon={<EditOutlined />}
            onClick={() => OpenNetworkProfilePanel(record)}
          ></Button>
        );
      },
    },
  ];
  const onPageChange = (pageNumber: number, pageSize: number = 20) => {
    ChangePageNumber(pageNumber);
    ChangePageSize(pageSize);
    RefreshNetworks({ pageNumber, pageSize });
  };
  return (
    <>
      <BasicTable<NetworkRecord>
        columns={columns}
        rowKey="id"
        dataSource={NetworkRecord ?? []}
        loading={loading}
        showHeader={false}
      />
      <div className="pagination-position">
        {NetworkRecord && (
          <Pagination
            current={PageNumber}
            pageSize={PageSize}
            total={isNaN(TotalCount) ? 0 : TotalCount}
            simple={true}
            onChange={onPageChange}
          />
        )}
      </div>
      <Drawer
        title={
          <FormattedMessage
            id="network.table.NetworkProfile"
            defaultMessage="网络详情"
          />
        }
        visible={NetworkProfileVisible}
        width={850}
        onClose={CloseNetworkProfilePanel}
        destroyOnClose={true}
      >
        <NetworkProfilePanel
          profile={NetworkProfile ?? null}
          onClose={CloseNetworkProfilePanel}
          panelKey={TargetPanel}
        />
        {/* {NetworkProfile && (<NetworkProfilePanel profile={NetworkProfile} onClose={CloseNetworkProfilePanel} />)} */}
      </Drawer>
    </>
  );
}
