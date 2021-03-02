import React from 'react';
import {
  DeleteOutlined,
  RedoOutlined,
  MenuOutlined,
  SearchOutlined,
  HddTwoTone,
} from '@ant-design/icons';
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  IntlShape,
  MessageDescriptor,
} from 'react-intl';
import { connect } from 'umi';
import { IBHRawListDataRecord } from '@/type';
import { INodeRecord } from '../type.d';
import { formatTimestamp } from '@/utils/date';
import CreateNodePanel from '../form/CreateNodePanel';
import NodeProfile from '../profile/NodeProfile';
import Button from '@/components/button';
import Avatar from '@/components/avatar';
import Grid, { Row } from '@/components/grid';
import Text from '@/components/text';
import { stringSlice } from '@/utils/string';
import Tag from '@/components/tag';
import Space from '@/components/space';
import Card, { CardBody } from '@/components/card';
import { BasicTable, IColumnType } from '@/components/table/BasicTable';
import { Popconfirm } from 'antd';
import Pagination from '@/components/pagination';
import { TABLE_PAGE_SIZE } from '@/variable';

interface INodeTableProps {
  Nodes: IBHRawListDataRecord<INodeRecord>;
  NodeLoading: boolean;
  dispatch: any;
  intl: IntlShape;
}

interface INodeTableStates {
  NodesCount: number;
  NodeRecords: INodeRecord[];

  CreateNodeVisible: boolean;
  ProfileNodeVisible: boolean;
  ProfileId: string;

  Keyword: string;
  PageNumber: number;
  PageSize: number;
}

const stateMap: any = {
  ready: 'success',
  down: 'error',
};

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  ready: {
    id: 'instance.table.Running',
    defaultMessage: '运行中',
  },
  down: {
    id: 'instance.table.Stopped',
    defaultMessage: '已停止',
  },
  searchPlaceHolder: {
    id: 'node.table.searchPlaceHolder',
    defaultMessage: '输入节点名称搜索',
  },
  confirmRemove: {
    id: 'node.table.confirmRemove',
    defaultMessage: '是否确认删除该节点？',
  },
  refresh: {
    id: 'common.refresh',
    defaultMessage: '刷新',
  },
});

class NodeTable extends React.PureComponent<INodeTableProps, INodeTableStates> {
  private TableColumns: IColumnType<INodeRecord>[];

  constructor(props: INodeTableProps) {
    super(props);
    this.state = {
      NodesCount: 0,
      NodeRecords: [],

      CreateNodeVisible: false,
      ProfileNodeVisible: false,
      ProfileId: '',

      Keyword: '',
      PageNumber: 1,
      PageSize: TABLE_PAGE_SIZE,
    };

    this.TableColumns = [
      {
        title: <FormattedMessage id="common.text.Name" defaultMessage="名称" />,
        key: 'Name',
        dataIndex: 'name',
        render: (text: string) => (
          <Row flex>
            <Avatar status="success">
              <HddTwoTone twoToneColor="#1bc5bd" />
            </Avatar>
            <Grid.Col grid>
              <Text title={text}>{stringSlice(text)}</Text>
            </Grid.Col>
          </Row>
        ),
      },
      {
        title: (
          <FormattedMessage id="node.table.ipAddr" defaultMessage="IP地址" />
        ),
        key: 'IpAddress',
        dataIndex: 'address',
        render: (address: string) => (
          <Text title={address}>{stringSlice(address)}</Text>
        ),
      },
      {
        title: (
          <FormattedMessage
            id="node.table.createdTime"
            defaultMessage="创建时间"
          />
        ),
        key: 'CreateTime',
        dataIndex: 'createAt',
        render: (time: number) => formatTimestamp(time),
      },
      {
        title: (
          <FormattedMessage id="common.text.Status" defaultMessage="状态" />
        ),
        key: 'Status',
        dataIndex: 'status',
        render: (text: string) => {
          return (
            <Tag status={stateMap[text]}>
              {intlMessages[text]
                ? props.intl.formatMessage(intlMessages[text])
                : text}
            </Tag>
          );
        },
      },
      {
        key: 'Action',
        dataIndex: 'Id',
        className: 'th-w-action-2',
        render: (instanceId: string, record: INodeRecord) => {
          return (
            <Space>
              <Button
                icon={<MenuOutlined />}
                onClick={() => this.OpenProfile(record.id)}
              />
              <Popconfirm
                title={props.intl.formatMessage(intlMessages.confirmRemove)}
                onConfirm={() => this.RemoveNode(record.id)}
              >
                <Button icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          );
        },
      },
    ];
  }

  static getDerivedStateFromProps(nextProps: INodeTableProps) {
    const { Nodes } = nextProps;
    if (Nodes && Nodes['hosts'] instanceof Array) {
      return {
        NodeRecords: Nodes['hosts'],
        NodesCount: Nodes.count,
      };
    }
    return null;
  }

  public handleSearch = (ev: any) => {
    // console.log('search');
    this.resetPageInfo();
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

  public onKeyDownchange = (e: any) => {
    if (e.key == 'Enter') {
      this.handleSearch(null);
    }
  };

  public refreshInfo = () => {
    this.setState(
      {
        Keyword: '',
        PageNumber: 1,
        PageSize: TABLE_PAGE_SIZE,
      },
      () => {
        this.ListRecords();
      },
    );
  };

  public resetPageInfo = () => {
    this.onPageChange(1, TABLE_PAGE_SIZE);
  };

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

  public openCreatePanel = () => {
    this.setState({
      CreateNodeVisible: true,
    });
  };

  public closeCreatePanel = () => {
    this.setState(
      {
        CreateNodeVisible: false,
      },
      () => {
        this.ListRecords();
      },
    );
  };

  public OpenProfile = (id: string) => {
    this.setState({
      ProfileNodeVisible: true,
      ProfileId: id,
    });
  };

  public ClosedProfile = () => {
    this.setState(
      {
        ProfileNodeVisible: false,
        ProfileId: '',
      },
      () => {
        this.ListRecords();
      },
    );
  };

  public ListRecords = () => {
    const { Keyword, PageNumber, PageSize } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'node/ListNodes',
      payload: {
        Keyword,
        PageNumber,
        PageSize,
      },
    });
  };

  public RemoveNode = (id: string) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'node/RemoveNode',
      payload: {
        id,
      },
    }).then(() => {
      this.refreshInfo();
    });
  };

  componentDidMount() {
    this.ListRecords();
  }

  render() {
    const { intl, NodeLoading } = this.props;
    const {
      NodeRecords,
      CreateNodeVisible,
      ProfileNodeVisible,
      ProfileId,
      Keyword,
      PageNumber,
      PageSize,
      NodesCount,
    } = this.state;
    const CreateTitle = (
      <FormattedMessage id="node.table.CreateNode" defaultMessage="创建节点" />
    );

    return (
      <>
        <Row size="md" flex justify="balance">
          <Button type="primary" onClick={this.openCreatePanel}>
            {CreateTitle}
          </Button>
          <Space>
            <div className="control search">
              <input
                type="text"
                value={Keyword}
                placeholder={intl.formatMessage(intlMessages.searchPlaceHolder)}
                onChange={this.handleChange}
                onKeyDown={this.onKeyDownchange}
              />
              <Button
                icon={<SearchOutlined />}
                transparent
                onClick={this.handleSearch}
              />
            </div>
            <Pagination
              current={PageNumber}
              pageSize={PageSize}
              total={NodesCount}
              simple={true}
              onChange={this.onPageChange}
            />
            <div
              className="pagination-lite"
              title={intl.formatMessage(intlMessages.refresh)}
            >
              <Button icon={<RedoOutlined />} onClick={this.refreshInfo} />
            </div>
          </Space>
        </Row>
        <Card>
          <CardBody>
            <BasicTable<INodeRecord>
              loading={NodeLoading}
              columns={this.TableColumns}
              rowKey="Id"
              dataSource={NodeRecords}
            />
          </CardBody>
        </Card>
        {CreateNodeVisible && (
          <CreateNodePanel
            title={CreateTitle}
            visible={CreateNodeVisible}
            onClose={this.closeCreatePanel}
          />
        )}
        {ProfileNodeVisible && ProfileId && (
          <NodeProfile
            NodeId={ProfileId}
            visible={ProfileNodeVisible}
            onClose={this.ClosedProfile}
          />
        )}
      </>
    );
  }
}

function mapStateToProps({ node, loading }: any) {
  return {
    Nodes: node.Nodes,
    NodeLoading: loading.effects['node/ListNodes'],
  };
}

const connectedNodeTable = connect(mapStateToProps)(NodeTable);

export default injectIntl<'intl', any>(connectedNodeTable);
