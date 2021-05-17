import React from 'react';
import { connect } from 'umi';
import { injectIntl, IntlShape } from 'react-intl';
import { IBHRawListDataRecord } from '@/type';
import { VaccineRecord } from '../type.d';
import {
  MenuOutlined,
  RedoOutlined,
  SearchOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import VaccineProfilePanel from '../profile/VaccineProfilePanel';
import Button from '@/components/button';
import NewCard, { CardBody, CardHeader } from '@/components/card';
import { BasicTable, IColumnType } from '@/components/table/BasicTable';
import { formatStringTime } from '@/utils/date';
import Grid, { NewRow } from '@/components/grid';
import Text from '@/components/text';
import { stringSlice } from '@/utils/string';
import Tag from '@/components/tag';
import Space from '@/components/space';
import { Drawer, Popconfirm, Select } from 'antd';
import CreateVaccinePanel from '../form/CreateVaccinePanel';
import Pagination from '@/components/pagination';
import UploadLicensePanel from '../form/UploadLicensePanel';
import PetsTable from '@/pages/info/table/PetsTable';
import AuditVaccineCard from '../card/AuditVaccineCard';
import { GET_IDENTITY } from '@/utils/auth';
import { history } from 'umi';
const { Option } = Select;

let currentUser = '';

interface VaccineTableProps {
  intl: IntlShape;
  VaccineProps: IBHRawListDataRecord<VaccineRecord>;
  VaccineLoading: boolean;
  VaccineModelLoading: boolean;
  dispatch: any;
}

interface VaccineTableState {
  Vaccines: VaccineRecord[];
  VaccinesCount: number;

  VaccineProfile: VaccineRecord | null;
  SelectKeyword: string;
  Keyword: string;
  VaccineId: string;
  PetProfileId: string;
  PageNumber: number;
  PageSize: number;

  VaccineProfileVisible: boolean;
  CreateVaccineVisible: boolean;
  UploadLicenseVisible: boolean;
}

const stateMap: any = {
  Vaccinated: 'success',
  Unvaccinated: 'danger',
  Auditing: 'primary',
};

class VaccineTable extends React.PureComponent<
  VaccineTableProps,
  VaccineTableState
> {
  private AdminTableColumns: IColumnType<VaccineRecord>[];
  private PetmasterTableColumns: IColumnType<VaccineRecord>[];
  private keyword: any = history.location.query?.keyword;
  constructor(props: VaccineTableProps) {
    super(props);
    this.state = {
      Vaccines: [],
      VaccinesCount: 0,
      VaccineProfile: null,
      Keyword: '',
      SelectKeyword: '',
      VaccineId: '',
      PetProfileId: '',

      PageNumber: 1,
      PageSize: 20,

      VaccineProfileVisible: false,
      CreateVaccineVisible: false,
      UploadLicenseVisible: false,
    };

    this.AdminTableColumns = [
      {
        title: '疫苗名称',
        key: 'vaccineName',
        dataIndex: 'vaccineName',
        render: (text: string, record: VaccineRecord) => {
          return <Text title={text}>{stringSlice(text)}</Text>;
        },
      },
      {
        title: '疫苗类型',
        key: 'vaccineType',
        dataIndex: 'vaccineType',
        render: (text: string, record: VaccineRecord) => {
          return <Text title={text}>{stringSlice(text)}</Text>;
        },
      },
      {
        title: '宠物类型',
        key: 'vaccinePetType',
        dataIndex: 'vaccinePetType',
        render: (text: string) => {
          return <Text>{text}</Text>;
        },
      },
      {
        title: '添加时间',
        key: 'createTime',
        dataIndex: 'createTime',
        render: (text: string) => {
          return (
            <>
              <Text>{text ? formatStringTime(text) : ''}</Text>
            </>
          );
        },
      },
      {
        title: '备注',
        key: 'remarks',
        dataIndex: 'remarks',
        render: (text: string) => {
          return (
            <>
              <Text>{text}</Text>
            </>
          );
        },
      },
      {
        key: 'Action',
        dataIndex: 'id',
        className: 'th-w-action-2',
        render: (vaccineId: string, record: VaccineRecord) => {
          return (
            <Space>
              <Button
                icon={<MenuOutlined />}
                onClick={() => this.gotoRecordProfile(record)}
              />
              <Popconfirm
                title="确认删除？"
                onConfirm={() => this.DeleteVaccine(record?.vaccineId)}
              >
                <Button icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          );
        },
      },
    ];

    this.PetmasterTableColumns = [
      {
        title: '疫苗名称',
        key: 'vaccineName',
        dataIndex: 'vaccineName',
        render: (text: string, record: VaccineRecord) => {
          return <Text title={text}>{stringSlice(text)}</Text>;
        },
      },
      {
        title: '疫苗类型',
        key: 'vaccineType',
        dataIndex: 'vaccineType',
        render: (text: string, record: VaccineRecord) => {
          return <Text title={text}>{stringSlice(text)}</Text>;
        },
      },
      {
        title: '宠物类型',
        key: 'vaccinePetType',
        dataIndex: 'vaccinePetType',
        render: (text: string) => {
          return <Text>{text}</Text>;
        },
      },
      {
        title: '添加时间',
        key: 'createTime',
        dataIndex: 'createTime',
        render: (text: string) => {
          return (
            <>
              <Text>{text ? formatStringTime(text) : ''}</Text>
            </>
          );
        },
      },
      {
        title: '备注',
        key: 'remarks',
        dataIndex: 'remarks',
        render: (text: string) => {
          return (
            <>
              <Text>{text}</Text>
            </>
          );
        },
      },
      {
        title: '接种状态',
        key: 'vaccineStatus',
        dataIndex: 'vaccineStatus',
        render: (text: string, record: VaccineRecord) => {
          return (
            <>
              <Tag status={stateMap[text]}>
                {text === 'Unvaccinated ' ? '未接种' : '已接种'}
              </Tag>
              {text === 'Unvaccinated' && (
                <Button
                  type="primary"
                  onClick={() => this.openUploadLicensePanel(record?.vaccineId)}
                >
                  上传疫苗证明
                </Button>
              )}
            </>
          );
        },
      },
    ];
  }

  public DeleteVaccine = (vaccineId: string) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'vaccine/DeleteVaccine',
      payload: {
        vaccineId,
      },
    });
    this.ListVaccineRecords();
  };
  public onPageChange = (page: number, pageSize?: number) => {
    this.setState(
      {
        PageNumber: page,
        PageSize: pageSize ? pageSize : 20,
      },
      () => {
        this.ListVaccineRecords();
      },
    );
  };

  public refreshInfo = () => {
    this.setState(
      {
        Keyword: '',
        PageNumber: 1,
        PageSize: 20,
      },
      () => {
        this.ListVaccineRecords();
      },
    );
  };

  public resetPageInfo = () => {
    this.onPageChange(1, 20);
  };

  public handleSearch = (ev: any) => {
    // console.log('search');

    const { dispatch } = this.props;
    const { Keyword } = this.state;
    if (Keyword) {
      dispatch({
        type: 'vaccine/SearchVaccines',
        payload: {
          Keyword,
        },
      });
    } else {
      this.resetPageInfo();
    }
  };

  public onKeyDownchange = (e: any) => {
    if (e.key == 'Enter') {
      this.handleSearch(null);
    }
  };

  public handleChange = (ev: any) => {
    const value = ev.target.value;
    const { dispatch } = this.props;

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
    dispatch({
      type: 'vaccine/SearchVaccine',
      payload: {
        vaccineName: value,
      },
    });
  };

  public openCreatePanel = () => {
    this.setState({
      CreateVaccineVisible: true,
    });
  };
  public closeCreatePanel = () => {
    this.setState(
      {
        CreateVaccineVisible: false,
      },
      () => {
        this.ListVaccineRecords();
      },
    );
  };

  public ListVaccineRecords = () => {
    const { Keyword, PageNumber, PageSize } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'vaccine/ListVaccines',
      payload: {
        Keyword,
        PageNumber: 1,
        PageSize: 20,
      },
    }).then((Count: number) => {
      this.setState({
        VaccinesCount: Count,
      });
    });
  };

  public gotoRecordProfile = (record: VaccineRecord) => {
    const { Vaccines } = this.state;
    const profile = Vaccines.filter(
      (item: VaccineRecord) => item.vaccineId === record?.vaccineId,
    );
    this.setState({
      VaccineProfile: profile[0],
      VaccineProfileVisible: true,
    });
  };

  public closeRecordProfile = () => {
    this.setState(
      {
        VaccineProfile: null,
        VaccineProfileVisible: false,
      },
      () => {
        this.ListVaccineRecords();
      },
    );
  };

  public RemoveVaccine = (record: VaccineRecord) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'vaccine/RemoveVaccines',
      payload: {
        vaccineId: record.vaccineId,
      },
    }).then(() => {
      this.ListVaccineRecords();
    });
  };

  public openUploadLicensePanel = (vaccineId: string) => {
    this.setState({
      UploadLicenseVisible: true,
      VaccineId: vaccineId,
    });
  };
  public closeUploadLicensePanel = () => {
    this.setState({
      UploadLicenseVisible: false,
    });
  };

  public SearchVaccineRecords = (keyword?: string) => {
    const { SelectKeyword } = this.state;
    const { dispatch } = this.props;
    console.log(keyword, 'keyword111');
    dispatch({
      type: 'vaccine/SearchVaccineRecords',
      payload: {
        species: keyword ?? SelectKeyword,
      },
    });
  };
  public handleSelect = (value: string) => {
    this.setState(
      {
        SelectKeyword: value,
      },
      () => {
        if (value == '') {
          this.resetPageInfo();
        } else {
          this.SearchVaccineRecords();
        }
      },
    );
  };

  componentDidMount() {
    console.log(this.keyword);

    currentUser = GET_IDENTITY();
    if (this.keyword) {
      this.setState({
        SelectKeyword: this.keyword,
      });
      // TODO 根据宠物类型
      this.SearchVaccineRecords();
    } else {
      this.ListVaccineRecords();
    }
  }

  static getDerivedStateFromProps(
    nextProps: VaccineTableProps,
    prevState: VaccineTableState,
  ) {
    const { VaccineProps } = nextProps;
    console.log(VaccineProps, 'props');
    if (VaccineProps) {
      return {
        Vaccines: VaccineProps,
      };
    }
    return null;
  }

  render() {
    const { VaccineModelLoading, VaccineLoading } = this.props;
    const {
      Keyword,
      Vaccines,
      VaccinesCount,
      VaccineProfile,
      PageNumber,
      PageSize,
      VaccineProfileVisible,
      CreateVaccineVisible,
      UploadLicenseVisible,
      SelectKeyword,
    } = this.state;

    return (
      <>
        {currentUser === 'admin' ? (
          <>
            <NewRow size="md" flex justify="balance">
              <Button type="primary" onClick={this.openCreatePanel}>
                添加疫苗
              </Button>
              <Space>
                <Select
                  showSearch
                  style={{ width: 300 }}
                  allowClear
                  placeholder="宠物类型搜索"
                  onSelect={this.handleSelect}
                  value={SelectKeyword}
                  // onKeyDown={this.onKeyDownchange}
                >
                  {/* <Option value="" title="">
                    宠物类型搜索
                    </Option> */}
                  <Option value="汪星人" title="汪星人">
                    汪星人
                  </Option>
                  <Option value="喵星人" title="喵星人">
                    喵星人
                  </Option>
                  <Option value="啮齿动物" title="啮齿动物">
                    啮齿动物
                  </Option>
                  <Option value="猛禽" title="猛禽">
                    猛禽
                  </Option>
                  <Option value="爬行动物" title="爬行动物">
                    爬行动物
                  </Option>
                </Select>
                <div className="control search">
                  <input
                    type="text"
                    value={Keyword}
                    placeholder="疫苗搜索"
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
                  total={VaccinesCount}
                  simple={true}
                  onChange={this.onPageChange}
                />
                <div className="pagination-lite" title="刷新">
                  <Button icon={<RedoOutlined />} onClick={this.refreshInfo} />
                </div>
              </Space>
            </NewRow>
            <NewCard>
              <CardHeader title="宠物防疫"></CardHeader>
              <CardBody>
                <BasicTable<VaccineRecord>
                  columns={this.AdminTableColumns}
                  rowKey="vaccineId"
                  dataSource={Vaccines}
                  loading={VaccineLoading}
                />
              </CardBody>
            </NewCard>
            <div style={{ margin: 20 }}></div>
            <NewCard>
              <CardBody>
                {/* TODO 疫苗审核 */}
                <AuditVaccineCard />
              </CardBody>
            </NewCard>

            {CreateVaccineVisible && (
              <CreateVaccinePanel
                visible={CreateVaccineVisible}
                onClose={this.closeCreatePanel}
                // width={800}
              />
            )}
            <Drawer
              title="疫苗详情"
              visible={VaccineProfileVisible}
              // visible={true}
              width={850}
              onClose={this.closeRecordProfile}
              destroyOnClose={true}
            >
              <VaccineProfilePanel
                VaccineProfile={VaccineProfile ?? null}
                visible={VaccineProfileVisible}
                onClose={this.closeRecordProfile}
              />
            </Drawer>
          </>
        ) : (
          <></>
        )}
        <div style={{ margin: 18 }}></div>
        {currentUser === 'petMaster' ? (
          <>
            {/* // TODO如果是养宠用户  则展示  并且上传接种证明  表格项不一样 */}
            <PetsTable type="vaccine" />
            <div style={{ margin: 15 }}></div>
            <NewCard>
              <CardHeader title="疫苗总览"></CardHeader>
              <CardBody>
                <>
                  <BasicTable<VaccineRecord>
                    columns={this.PetmasterTableColumns}
                    rowKey="vaccineId"
                    dataSource={Vaccines}
                    // loading={VaccineModelLoading}
                  />
                </>
              </CardBody>
            </NewCard>
          </>
        ) : (
          <></>
        )}
        {/* TODO 上传证明 在宠主的宠物列表  */}
        {UploadLicenseVisible && (
          <>
            {/* <UploadLicensePanel VaccineId={VaccineId} PetProfileId={PetProfileId} visible={UploadLicenseVisible} onClose={this.closeUploadLicensePanel} /> */}
          </>
        )}
      </>
    );
  }
}

function mapStateToProps({ vaccine, loading }: any) {
  return {
    VaccineProps: vaccine.Vaccine,
    VaccineLoading: loading.effects['vaccine/ListVaccines'],
  };
}
const connectedVaccineTable = connect(mapStateToProps)(VaccineTable);
export default injectIntl<'intl', any>(connectedVaccineTable);