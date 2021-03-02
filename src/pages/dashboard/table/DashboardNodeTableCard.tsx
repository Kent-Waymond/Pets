import { BasicTable, IColumnType } from '@/components/table/BasicTable';
import React from 'react';
import { IDashboardNodeRecord } from '../type.d';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  HddTwoTone,
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

export interface IDashboardNodeTableCardProps {
  records: IDashboardNodeRecord[];
  loading: boolean;
}

export function DashboardNodeTableCard(props: IDashboardNodeTableCardProps) {
  const { records, loading } = props;
  const columns: IColumnType<IDashboardNodeRecord>[] = [
    {
      key: 'Icon',
      className: 'th-w-symbol',
      render: () => (
        <Avatar status="success">
          <HddTwoTone twoToneColor="#1bc5bd" />
        </Avatar>
      ),
    },
    {
      key: 'name',
      className: 'th-w-main',
      render: (text: string, record: IDashboardNodeRecord, index: number) => {
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
            id="dashboard.text.NodeRunningMonitor"
            defaultMessage="节点运行监控"
          />
        }
      />
      <CardBody overflow>
        <BasicTable<IDashboardNodeRecord>
          rowKey={'id'}
          dataSource={records}
          columns={columns}
          showHeader={false}
          loading={loading}
          emptyText={
            <FormattedMessage
              id="dashboard.text.NoRunningNode"
              defaultMessage="暂无运行中的节点"
            />
          }
        />
      </CardBody>
    </Card>
  );
}
