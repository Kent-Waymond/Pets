import React from 'react';
import { IBHRawListDataRecord } from '@/type';
import { IServiceNetworkRecord } from '../index.d';
import { connect, FormattedMessage } from 'umi';
import Table, { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { Typography, Input, Button } from 'antd';
import { formatTimestamp } from '@/utils/date';
import { RedoOutlined, PlusOutlined } from '@ant-design/icons';
import { CreateServiceNetworkPanel } from '../form/CreateServiceNetworkPanel';
import { TABLE_PAGE_SIZE } from '@/variable';

interface IServiceNetworkTableProps {
  ServiceNetwork: IBHRawListDataRecord<IServiceNetworkRecord>;
  ServiceNetworkLoading: boolean;

  dispatch: any;
}

interface IServiceNetworkTableState {
  ServiceNetworks: IServiceNetworkRecord[];
  ServiceNetworksCount: number;

  CreateNetworkVisible: boolean;

  Keyword: string;
  PageNumber: number;
  PageSize: number;
}

class ServiceNetworkTable extends React.PureComponent<
  IServiceNetworkTableProps,
  IServiceNetworkTableState
> {
  constructor(props: IServiceNetworkTableProps) {
    super(props);
    this.state = {
      ServiceNetworks: [],
      ServiceNetworksCount: 0,

      CreateNetworkVisible: false,

      Keyword: '',

      PageNumber: 1,
      PageSize: TABLE_PAGE_SIZE,
    };
  }

  static getDerivedStateFromProps(
    nextProps: IServiceNetworkTableProps,
    prevState: IServiceNetworkTableState,
  ) {
    const { ServiceNetwork } = nextProps;
    if (ServiceNetwork && ServiceNetwork['networks'] instanceof Array) {
      return {
        ServiceNetworks: ServiceNetwork['networks'],
        ServiceNetworksCount: ServiceNetwork.count,
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
    const { dispatch } = this.props;

    dispatch({
      type: 'network/ListNetworks',
      payload: {
        Keyword,
        PageNumber,
        PageSize,
      },
    });
  };

  public OpenCreateNetworkPanel = (ev: any) => {
    this.setState({
      CreateNetworkVisible: true,
    });
  };

  public CloseCreateNetworkPanel = (ev: any) => {
    this.setState(
      {
        CreateNetworkVisible: false,
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
      ServiceNetworks,
      ServiceNetworksCount,
      Keyword,
      CreateNetworkVisible,
    } = this.state;

    const { ServiceNetworkLoading } = this.props;
    const TableColumns: ColumnsType<IServiceNetworkRecord> = [
      {
        title: (
          <FormattedMessage
            id="network.table.NetworkName"
            defaultMessage="网络名称"
          />
        ),
        dataIndex: 'name',
        key: 'NetworkName',
        render: (name: string, record: IServiceNetworkRecord) => {
          return <Typography.Text ellipsis={true}>{name}</Typography.Text>;
        },
      },
      {
        title: (
          <FormattedMessage id="network.table.Subnet" defaultMessage="子网" />
        ),
        dataIndex: 'subnet',
        key: 'Subnet',
        render: (subnet: string, record: IServiceNetworkRecord) => {
          return <Typography.Text ellipsis={true}>{subnet}</Typography.Text>;
        },
      },
      {
        title: (
          <FormattedMessage id="network.table.Gateway" defaultMessage="网关" />
        ),
        dataIndex: 'gateway',
        key: 'Gateway',
        render: (gateway: string, record: IServiceNetworkRecord) => {
          return <Typography.Text ellipsis={true}>{gateway}</Typography.Text>;
        },
      },
      {
        title: (
          <FormattedMessage
            id="host.table.CreateTime"
            defaultMessage="创建时间"
          />
        ),
        dataIndex: 'createAt',
        key: 'CreateTime',
        render: (time: number) => {
          return formatTimestamp(time);
        },
      },
      {
        title: (
          <FormattedMessage id="network.table.Comment" defaultMessage="备注" />
        ),
        dataIndex: 'comment',
        key: 'Comment',
        render: (comment: string) => {
          return <Typography.Text ellipsis={true}>{comment}</Typography.Text>;
        },
      },
    ];

    const PaginationConf: TablePaginationConfig = {
      showTotal: (total: number) => {
        return `共 ${total}`;
      },
      total: ServiceNetworksCount,
      onChange: this.onPageChange,
      hideOnSinglePage: true,
    };

    return (
      <>
        <div className="ami-action">
          <div className="ami-action-item">
            <Button
              icon={<PlusOutlined />}
              onClick={this.OpenCreateNetworkPanel}
            >
              <FormattedMessage
                id="network.table.CreateNetwork"
                defaultMessage="创建网络"
              />
            </Button>
          </div>
          <div className="ami-action-item">
            <Input.Search
              value={Keyword}
              placeholder="输入网络名称搜索"
              onChange={this.handleChange}
              onSearch={this.handleSearch}
              allowClear={true}
              style={{ width: 300 }}
            />
            &nbsp; &nbsp;
            <Button type="default" onClick={this.ListRecords}>
              <RedoOutlined />
            </Button>
          </div>
        </div>
        <Table
          columns={TableColumns}
          dataSource={ServiceNetworks}
          rowKey="id"
          loading={ServiceNetworkLoading}
          scroll={{
            y: window.innerHeight - 250,
          }}
          pagination={PaginationConf}
        />
        <CreateServiceNetworkPanel
          visible={CreateNetworkVisible}
          onClose={this.CloseCreateNetworkPanel}
        />
      </>
    );
  }
}

function mapStateToProps({ network, loading }: any) {
  return {
    ServiceNetwork: network.ServiceNetwork,
    ServiceNetworkLoading: loading.effects['network/ListNetworks'],
  };
}

export default connect(mapStateToProps)(ServiceNetworkTable);
