import React from 'react';
import { connect, FormattedMessage } from 'umi';
import {
  MessageDescriptor,
  defineMessages,
  injectIntl,
  IntlShape,
} from 'react-intl';
import { IBHRawListDataRecord } from '@/type';
import {
  InstanceRecord,
  InstanceProfileType,
  InstanceLicenseConfig,
  InstanceStatusType,
} from '../type.d';
import {
  PauseOutlined,
  CaretRightOutlined,
  RedoOutlined,
  SearchOutlined,
  MenuOutlined,
  SecurityScanTwoTone,
} from '@ant-design/icons';
import { ServiceInstanceProfile } from '../profile/ServiceInstanceProfile';
// import CreateInstancePanel from '../form/CreateInstancePanel';
import Button from '@/components/button';
import Card, { CardBody } from '@/components/card';
import { BasicTable, IColumnType } from '@/components/table/BasicTable';
import Avatar from '@/components/avatar';
import Grid, { Row } from '@/components/grid';
import Text from '@/components/text';
import { stringSlice } from '@/utils/string';
import Tag from '@/components/tag';
import Space from '@/components/space';
import { Drawer, Popconfirm } from 'antd';
import CreateServiceInstancePanel from '../form/CreateServiceInstancePanel';
import Pagination from '@/components/pagination';
import { TABLE_PAGE_SIZE } from '@/variable';
import { ComponentStateType } from '@/components/_common/type';
import {
  CommonProductItemInfo,
  CommonProductItemMap,
} from '@/pages/_common/product';
import { parseLicenseRemainDaysToCommonState } from '@/utils/string';

interface InstanceTableProps {
  intl: IntlShape;
  Instance: IBHRawListDataRecord<InstanceRecord>;
  InstanceLoading: boolean;
  InstanceModelLoading: boolean;
  dispatch: any;
}

interface InstanceTableState {
  Instances: InstanceRecord[];
  InstancesCount: number;

  InstanceProfile: InstanceProfileType | null;

  Keyword: string;
  PageNumber: number;
  PageSize: number;

  InstanceProfileVisible: boolean;
  CreateInstanceVisible: boolean;
}

const stateMap: { [key in InstanceStatusType]: ComponentStateType } = {
  running: 'success',
  stopped: 'danger',
  starting: 'primary',
  transferring: 'warning',
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
  transferring: {
    id: 'instance.table.Transferring',
    defaultMessage: '迁移中',
  },
  unknown: {
    id: 'instance.table.Unknown',
    defaultMessage: '未知',
  },
  stopMsg: {
    id: 'instance.table.stopInstanceMsg',
    defaultMessage: '是否确认停用该实例？',
  },
  searchPlaceHolder: {
    id: 'instance.table.searchPlaceHolder',
    defaultMessage: '输入实例名称搜索',
  },
  Days: {
    id: 'instance.table.Days',
    defaultMessage: '{days}天',
  },
  refresh: {
    id: 'common.refresh',
    defaultMessage: '刷新',
  },
});

class InstanceTable extends React.PureComponent<
  InstanceTableProps,
  InstanceTableState
> {
  private TableColumns: IColumnType<InstanceRecord>[];
  constructor(props: InstanceTableProps) {
    super(props);
    this.state = {
      Instances: [],
      InstancesCount: 0,
      InstanceProfile: null,

      Keyword: '',

      PageNumber: 1,
      PageSize: TABLE_PAGE_SIZE,

      InstanceProfileVisible: false,
      CreateInstanceVisible: false,
    };

    this.TableColumns = [
      {
        title: <FormattedMessage id="common.text.Name" defaultMessage="名称" />,
        key: 'Name',
        dataIndex: 'name',
        render: (text: string, record: InstanceRecord) => {
          const ProductItem: CommonProductItemInfo =
            CommonProductItemMap[record?.productId];

          return (
            <Row flex>
              <span
                title={
                  props.intl.formatMessage(ProductItem?.label) ||
                  record?.productId
                }
              >
                {ProductItem?.icon ?? (
                  <Avatar>
                    <SecurityScanTwoTone twoToneColor="#8950fc" />
                  </Avatar>
                )}
              </span>
              <Grid.Col grid>
                <Text title={text}>{stringSlice(text)}</Text>
                <Text type="gray" title={text}>
                  {stringSlice(record.comment)}
                </Text>
              </Grid.Col>
            </Row>
          );
        },
      },
      {
        title: <FormattedMessage id="common.text.Node" defaultMessage="节点" />,
        key: 'Node',
        dataIndex: 'address',
        render: (text: string, record: InstanceRecord) => (
          <Text title={text}>{stringSlice(text)}</Text>
        ),
      },
      {
        title: (
          <FormattedMessage id="common.text.Network" defaultMessage="网络" />
        ),
        key: 'Network',
        dataIndex: 'networkName',
        render: (text: string) => {
          return (
            <>
              <Text>{text}</Text>
            </>
          );
        },
      },
      {
        title: (
          <FormattedMessage id="common.text.Status" defaultMessage="状态" />
        ),
        key: 'Status',
        dataIndex: 'status',
        render: (text: InstanceStatusType) => {
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
        title: (
          <FormattedMessage
            id="common.text.Specification"
            defaultMessage="规格"
          />
        ),
        key: 'Specification',
        dataIndex: 'licenseConfig',
        render: (license: InstanceLicenseConfig) => {
          return (
            <Grid.Col grid>
              {/* <Text>{license?.productId || '-'}</Text> */}
              <Text>{license?.specDescription || '-'}</Text>
            </Grid.Col>
          );
        },
      },
      {
        title: (
          <FormattedMessage id="common.text.License" defaultMessage="许可" />
        ),
        key: 'License',
        dataIndex: 'licenseRemainDays',
        render: (days: number) => {
          return (
            <Text type={parseLicenseRemainDaysToCommonState(days)}>
              {props.intl.formatMessage(intlMessages.Days, { days })}
            </Text>
          );
        },
      },
      {
        key: 'Action',
        dataIndex: 'id',
        className: 'th-w-action-2',
        render: (instanceId: string, record: InstanceRecord) => {
          const status = record?.status || '';
          return (
            <Space>
              <Button
                icon={<MenuOutlined />}
                onClick={() => this.gotoRecordProfile(record)}
              />
              {status === 'stopped' && (
                <Button
                  icon={<CaretRightOutlined />}
                  onClick={() => this.StartInstance(instanceId)}
                />
              )}
              {(status === 'running' || status === 'starting') && (
                <Popconfirm
                  title={props.intl.formatMessage(intlMessages.stopMsg)}
                  onConfirm={() => this.StopInstance(instanceId)}
                >
                  <Button
                    icon={<PauseOutlined />}
                    disabled={status !== 'running'}
                  />
                </Popconfirm>
              )}
            </Space>
          );
        },
      },
    ];
  }

  static getDerivedStateFromProps(
    nextProps: InstanceTableProps,
    prevState: InstanceTableState,
  ) {
    const { Instance } = nextProps;
    if (Instance && Instance['instances'] instanceof Array) {
      return {
        Instances: Instance['instances'],
        InstancesCount: Instance.count,
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

  public handleSearch = (ev: any) => {
    // console.log('search');
    this.resetPageInfo();
  };

  public onKeyDownchange = (e: any) => {
    if (e.key == 'Enter') {
      this.handleSearch(null);
    }
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

  public openCreatePanel = () => {
    this.setState({
      CreateInstanceVisible: true,
    });
  };
  public closeCreatePanel = () => {
    this.setState(
      {
        CreateInstanceVisible: false,
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
      type: 'instance/ListInstances',
      payload: {
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

  public RemoveInstance = (record: InstanceRecord) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'instance/RemoveInstances',
      payload: {
        Ids: [record.id],
      },
    }).then(() => {
      this.ListRecords();
    });
  };

  public StopInstance = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'instance/StopInstance',
      payload: {
        id: id,
      },
    }).then(() => {
      this.ListRecords();
    });
  };

  public StartInstance = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'instance/StartInstance',
      payload: {
        id: id,
      },
    }).then(() => {
      this.ListRecords();
    });
  };

  componentDidMount() {
    this.ListRecords();
  }

  render() {
    const { intl, InstanceModelLoading } = this.props;
    const {
      Keyword,
      Instances,
      InstancesCount,
      InstanceProfile,
      PageNumber,
      PageSize,
      InstanceProfileVisible,
      CreateInstanceVisible,
    } = this.state;
    return (
      <>
        <Row size="md" flex justify="balance">
          <Button type="primary" onClick={this.openCreatePanel}>
            <FormattedMessage
              id="instance.table.CreateInstance"
              defaultMessage="创建实例"
            />
          </Button>
          <Space>
            <div className="control search">
              <input
                type="text"
                value={Keyword}
                placeholder={intl.formatMessage(intlMessages.searchPlaceHolder)}
                onChange={this.handleChange}
                onKeyDown={(e) => this.onKeyDownchange(e)}
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
              total={InstancesCount}
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
            <BasicTable<InstanceRecord>
              columns={this.TableColumns}
              rowKey="id"
              dataSource={Instances}
              loading={InstanceModelLoading}
            />
          </CardBody>
        </Card>

        {CreateInstanceVisible && (
          <CreateServiceInstancePanel
            visible={CreateInstanceVisible}
            onClose={this.closeCreatePanel}
            // width={800}
          />
        )}

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

function mapStateToProps({ instance, loading }: any) {
  return {
    Instance: instance.Instance,
    InstanceLoading: loading.effects['instance/ListInstances'],
    InstanceModelLoading: loading.models.instance,
  };
}
const connectedIntanceTable = connect(mapStateToProps)(InstanceTable);
export default injectIntl<'intl', any>(connectedIntanceTable);
