import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Badge, Typography, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios, { AxiosResponse } from 'axios';
import * as moment from 'moment';
const { Text } = Typography;

const stateMap: any = {
  running: 'success',
  stopped: 'error',
  unknown: 'warning',
};

const protocols = ['HTTPS', 'SSH', 'RDP'];

const columns = [
  {
    title: '实例名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '控制台入口',
    dataIndex: 'address',
    key: 'entry',
    render: (address: string, record: any) => (
      <Text>
        {address}:{record.consolePort}
      </Text>
    ),
  },
  {
    title: '运维入口',
    dataIndex: 'protocolPorts',
    key: 'protocolPort',
    render: (protocolPorts: any, record: any) => {
      return (
        <>
          {protocolPorts
            .filter((port1: any) => port1.protocolName != 'web')
            .map((port: any) => {
              return (
                <Tag key={port.protocolName}>
                  {`${port.protocolName}: ${port.port}`}
                </Tag>
              );
            })}
        </>
      );
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createAt',
    key: 'created',
    render: (time: string) => {
      return moment.unix(Number(time)).format('YYYY-MM-DD hh:mm:ss');
    },
  },
  {
    title: '运行状态',
    dataIndex: 'status',
    key: 'state',
    render: (text: string) => (
      <>
        <Badge status={stateMap[text]} text={text}></Badge>
      </>
    ),
  },
  {
    title: '许可数',
    dataIndex: 'maxHostCount',
    key: 'maxHostCount',
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <>
        {/* <a>停用</a> */}
        {/* <Divider type="vertical" />  */}
        <a>释放</a>
      </>
    ),
  },
];

export default () => {
  const [instances, changInstances] = useState([]);
  useEffect(() => {
    axios({
      method: 'post',
      url: '/v1/listInstances',
      data: {},
    }).then((response: AxiosResponse) => {
      if (response.data.data && response.data.data.instances instanceof Array) {
        const result = response.data.data.instances;
        changInstances(result);
      }
    });
  }, []);

  return (
    <div className="ami-main">
      <div className="ami-action">
        <div className="ami-action-item">
          <Button icon={<PlusOutlined />} type="primary" ghost>
            创建实例
          </Button>
        </div>
        <div className="ami-action-item">
          <Input.Search placeholder="输入实例名称搜索" style={{ width: 300 }} />
        </div>
      </div>
      <div className="ami-content">
        <Table columns={columns} dataSource={instances} />
      </div>
    </div>
  );
};
