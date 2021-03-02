import React from 'react';
import { connect, FormattedMessage, formatMessage } from 'umi';
import { MessageDescriptor, defineMessages } from 'react-intl';
import { IBHRawListDataRecord } from '@/type';
import {
  InstanceRecord,
  InstanceProtocol,
  InstanceProfileType,
} from '@/pages/instance/type.d';
import { Table, Typography, Tag, Badge, Button, Input, Drawer } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { RedoOutlined } from '@ant-design/icons';
import { ServiceInstanceProfile } from '@/pages/instance/profile/ServiceInstanceProfile';
import { formatTimestamp } from '@/utils/date';
import { TABLE_PAGE_SIZE } from '@/variable';

interface InstanceForNodeTableProps {
  NodeId: string;
  ServiceInstanceForHost: IBHRawListDataRecord<InstanceRecord>;
  ServiceInstanceForHostLoading: boolean;
  dispatch: any;
}

interface IInstanceForNodeTableState {
  ServiceInstances: InstanceRecord[];
  ServiceInstancesCount: number;

  InstanceProfile: InstanceProfileType | null;

  Keyword: string;
  PageNumber: number;
  PageSize: number;

  InstanceProfileVisible: boolean;
}

const Text = Typography.Text;
const stateMap: any = {
  running: 'success',
  stopped: 'error',
  unknown: 'warning',
  starting: 'processing',
};

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  starting: {
    id: 'instance.table.Starting',
    defaultMessage: '启动中',
  },
  running: {
    id: 'instance.table.Running',
    defaultMessage: '运行中',
  },
  stopped: {
    id: 'instance.table.Stopped',
    defaultMessage: '已停止',
  },
  unknown: {
    id: 'instance.table.Unknown',
    defaultMessage: '未知',
  },
  searchPlaceHolder: {
    id: 'instance.table.searchPlaceHolder',
    defaultMessage: '输入实例名称搜索',
  },
});

class InstanceForNodeTable extends React.PureComponent<
  InstanceForNodeTableProps,
  IInstanceForNodeTableState
> {
  constructor(props: InstanceForNodeTableProps) {
    super(props);
    this.state = {
      ServiceInstances: [],
      ServiceInstancesCount: 0,
      InstanceProfile: null,

      Keyword: '',

      PageNumber: 1,
      PageSize: TABLE_PAGE_SIZE,

      InstanceProfileVisible: false,
    };
  }

  static getDerivedStateFromProps(
    nextProps: InstanceForNodeTableProps,
    prevState: IInstanceForNodeTableState,
  ) {
    const { ServiceInstanceForHost } = nextProps;
    if (
      ServiceInstanceForHost &&
      ServiceInstanceForHost['instances'] instanceof Array
    ) {
      return {
        ServiceInstances: ServiceInstanceForHost['instances'],
        ServiceInstancesCount: ServiceInstanceForHost.Count,
      };
    }
    return null;
  }

  public onPageChange = (page: number, pageSize?: number) => {
    this.setState(
      {
        PageNumber: page,
        PageSize: pageSize ? pageSize : TABLE_PAGE_SIZE,
      },
      () => {
        this.ListRecords();
      },
    );
  };

  public resetPageInfo = () => {
    this.onPageChange(1, TABLE_PAGE_SIZE);
  };

  public handleSearch = (value: string) => {
    this.setState(
      {
        Keyword: value,
      },
      () => {
        this.resetPageInfo();
      },
    );
  };

  public handleChange = (ev: any) => {
    const value = ev.target.value;

    this.setState(
      {
        Keyword: value,
      },
      () => {
        if (value == '') {
          this.resetPageInfo();
        }
      },
    );
  };

  public ListRecords = () => {
    const { Keyword, PageNumber, PageSize } = this.state;
    const { dispatch, NodeId } = this.props;

    dispatch({
      type: 'node/ListInstancesOnNode',
      payload: {
        NodeId,
        Keyword,
        PageNumber,
        PageSize,
      },
    });
  };

  public gotoRecordProfile = (record: InstanceRecord) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'instance/GetInstance',
      payload: {
        InstanceId: record.id,
      },
    }).then((profile: InstanceProfileType | null) => {
      if (profile) {
        this.setState({
          InstanceProfile: profile,
          InstanceProfileVisible: true,
        });
      }
    });
  };

  public closeRecordProfile = () => {
    this.setState(
      {
        InstanceProfile: null,
        InstanceProfileVisible: false,
      },
      () => {
        this.ListRecords();
      },
    );
  };

  componentDidMount() {
    this.ListRecords();
  }

  render() {
    const {
      ServiceInstances,
      ServiceInstancesCount,
      InstanceProfile,
      InstanceProfileVisible,
      Keyword,
    } = this.state;

    const { ServiceInstanceForHostLoading } = this.props;
    const TableColumns: ColumnsType<InstanceRecord> = [
      {
        title: (
          <FormattedMessage
            id="instance.table.InstanceName"
            defaultMessage="实例名称"
          />
        ),
        dataIndex: 'name',
        key: 'InstanceName',
        width: '15%',
        ellipsis: true,
        render: (name: string, record: InstanceRecord) => {
          return (
            <Typography.Link onClick={() => this.gotoRecordProfile(record)}>
              {name}
            </Typography.Link>
          );
        },
      },
      {
        title: (
          <FormattedMessage
            id="instance.table.ConsoleEntry"
            defaultMessage="控制台入口"
          />
        ),
        dataIndex: 'address',
        key: 'ConsoleEntry',
        width: '20%',
        render: (address: string, record: InstanceRecord) => {
          const entry = `${address}:${record.consolePort}`;
          return (
            <Text copyable={{ text: entry }} ellipsis={true}>
              {entry}
            </Text>
          );
        },
      },
      {
        title: (
          <FormattedMessage
            id="instance.table.OperationEntry"
            defaultMessage="运维入口"
          />
        ),
        dataIndex: 'protocolPorts',
        key: 'OperationEntry',
        width: '20%',
        render: (protocolPorts: InstanceProtocol[], record: InstanceRecord) => {
          return (
            <>
              <Text
                copyable={{ text: record.operationAddress }}
                ellipsis={true}
              >
                {record.operationAddress}
              </Text>
              <br />
              {protocolPorts
                .filter(
                  (port1: InstanceProtocol) => port1.protocolName != 'web',
                )
                .map((port: any) => {
                  return (
                    <Tag
                      key={port.protocolName}
                    >{`${port.protocolName.toUpperCase()}: ${port.port}`}</Tag>
                  );
                })}
            </>
          );
        },
      },
      {
        title: (
          <FormattedMessage
            id="instance.table.CreateTime"
            defaultMessage="创建时间"
          />
        ),
        dataIndex: 'createAt',
        key: 'CreateTime',
        width: '20%',
        render: (time: number) => {
          return formatTimestamp(time);
        },
      },
      {
        title: (
          <FormattedMessage
            id="instance.table.RunningStatus"
            defaultMessage="运行状态"
          />
        ),
        dataIndex: 'status',
        key: 'RunningStatus',
        width: '10%',
        ellipsis: true,
        render: (text: string) => (
          <>
            <Badge
              status={stateMap[text]}
              text={
                intlMessages[text] ? formatMessage(intlMessages[text]) : text
              }
            ></Badge>
          </>
        ),
      },
    ];

    const PaginationConf: TablePaginationConfig = {
      showTotal: (total: number) => {
        return `共 ${total}`;
      },
      total: ServiceInstancesCount,
      onChange: this.onPageChange,
    };

    return (
      <>
        <div className="ami-action">
          <div className="ami-action-item"></div>
          <div className="ami-action-item">
            <Input.Search
              value={Keyword}
              placeholder={formatMessage(intlMessages.searchPlaceHolder)}
              onChange={this.handleChange}
              onSearch={this.handleSearch}
              allowClear={true}
              style={{ width: 300, marginRight: 5 }}
            />
            <Button type="default" onClick={this.ListRecords}>
              <RedoOutlined />
            </Button>
          </div>
        </div>
        <Table
          columns={TableColumns}
          dataSource={ServiceInstances}
          rowKey="id"
          loading={ServiceInstanceForHostLoading}
          scroll={{
            y: window.innerHeight - 250,
          }}
          pagination={PaginationConf}
        />

        <Drawer
          title={
            <FormattedMessage
              id="instance.table.InstanceProfile"
              defaultMessage="实例详情"
            />
          }
          visible={InstanceProfileVisible}
          // visible={true}
          width={850}
          onClose={this.closeRecordProfile}
          destroyOnClose={true}
        >
          <ServiceInstanceProfile
            profile={InstanceProfile}
            onClose={this.closeRecordProfile}
          />
        </Drawer>
      </>
    );
  }
}
function mapStateToProps({ node, loading }: any) {
  return {
    ServiceInstanceForHost: node.InstanceForNodes,
    ServiceInstanceForHostLoading: loading.effects['node/ListInstancesOnNode'],
  };
}

export default connect(mapStateToProps)(InstanceForNodeTable);
