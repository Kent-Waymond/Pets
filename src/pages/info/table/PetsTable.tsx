import React from 'react';
import {
  DeleteOutlined,
  RedoOutlined,
  MenuOutlined,
  SearchOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import { injectIntl, IntlShape } from 'react-intl';
import { connect, history } from 'umi';
import { IBHRawListDataRecord } from '@/type';
import { PetRecord, UserRecord, UserProfile, PetProfile } from '../type.d';
import UploadLicensePanel from '@/pages/vaccine/form/UploadLicensePanel';
import CreatePetPanel from '../form/CreatePetPanel';
import Button from '@/components/button';
import Grid, { NewRow } from '@/components/grid';
import Text from '@/components/text';
import { stringSlice } from '@/utils/string';
import Space from '@/components/space';
import NewCard, { CardBody, CardHeader } from '@/components/card';
import { BasicTable, IColumnType } from '@/components/table/BasicTable';
import { Popconfirm, Select } from 'antd';
import Pagination from '@/components/pagination';
import { TABLE_PAGE_SIZE } from '@/variable';
import { GET_IDENTITY } from '@/utils/auth';
import PetProfilePanel from '../profile/PetProfilePanel';

const { Option } = Select;
interface IPetsTableProps {
  PetRecord: IBHRawListDataRecord<PetRecord>;
  PetsLoading: boolean;
  UserRecord: IBHRawListDataRecord<UserRecord>;
  UsersLoading: boolean;
  dispatch: any;
  intl: IntlShape;
  type: 'vaccine' | 'admin' | 'petMaster';
  SearchKeyword: string;
}

interface IPetsTableStates {
  PetCount: number;
  PetRecords: PetRecord[];
  UserRecords: UserRecord[];

  VaccineId: string;

  AddPetVisible: boolean;
  PetProfileVisible: boolean;
  PetProfileId: string;
  PetProfile: any;
  UploadLicenseVisible: boolean;

  Keyword: string;
  PageNumber: number;
  PageSize: number;
}

const stateMap: any = {
  ready: 'success',
  down: 'error',
};

class PetsTable extends React.PureComponent<IPetsTableProps, IPetsTableStates> {
  private TableColumns: IColumnType<PetRecord>[];
  private CurrentUser = GET_IDENTITY();
  constructor(props: IPetsTableProps) {
    super(props);
    this.state = {
      PetCount: 0,
      PetRecords: [],
      UserRecords: [],

      VaccineId: '',

      AddPetVisible: false,
      PetProfileVisible: false,
      PetProfileId: '',
      PetProfile: '',
      UploadLicenseVisible: false,

      Keyword: '',
      PageNumber: 1,
      PageSize: TABLE_PAGE_SIZE,
    };

    console.log(this.CurrentUser, 'currentUser');
    this.TableColumns = [
      {
        title: '宠物名称',
        key: 'petName',
        dataIndex: 'petName',
        render: (text: string, record: PetRecord) => (
          <NewRow flex>
            <Button
              icon={<MenuOutlined />}
              onClick={() => this.OpenPetProfile(record.petId)}
            />
            &nbsp;&nbsp;
            <Grid.NewCol grid>
              <Text title={text}>{stringSlice(text)}</Text>
            </Grid.NewCol>
          </NewRow>
        ),
      },
      {
        title: '宠物种类',
        key: 'petSpecies',
        dataIndex: 'petSpecies',
        render: (petSpecies: string) => (
          <Text title={petSpecies}>{stringSlice(petSpecies)}</Text>
        ),
      },
      {
        title: '年龄',
        key: 'age',
        dataIndex: 'age',
        render: (age: string) => <Text title={age}>{stringSlice(age)}</Text>,
      },
      {
        title: '性别',
        key: 'gender',
        dataIndex: 'gender',
        render: (gender: number) => <Text>{gender ? '雄性' : '雌性'}</Text>,
      },
      {
        title: '成年状态',
        key: 'status',
        dataIndex: 'status',
        render: (status: string) => (
          <Text title={status}>{stringSlice(status)}</Text>
        ),
      },
      {
        title: '宠物主人',
        key: 'userName',
        dataIndex: 'userName',
        render: (userName: string) => (
          <Text title={userName}>{stringSlice(userName)}</Text>
        ),
      },
      {
        title: '接种状态',
        key: 'petImage',
        dataIndex: 'petImage',
        render: (petImage: string) => (
          <Text title={petImage}>{petImage ? '已接种' : '未接种'}</Text>
        ),
      },
      {
        title: '联系电话',
        key: 'phone',
        dataIndex: 'phone',
        render: (phone: string) => (
          <Text title={phone}>{stringSlice(phone)}</Text>
        ),
      },
      {
        title: '操作',
        key: 'Action',
        dataIndex: 'Id',
        className: 'th-w-action-2',
        render: (petId: string, record: PetRecord) => {
          // TODO 接种状态
          const status = record?.vaccineImage ? 'Vaccinated' : 'Unvaccinated';
          return (
            <Space>
              {status === 'Unvaccinated' && this.CurrentUser !== 'admin' && (
                <Button onClick={() => this.UploadVaccineLicense(record)}>
                  上传证明
                </Button>
              )}
              {status === 'Vaccinated' && this.CurrentUser !== 'admin' && (
                <Popconfirm
                  title="确认重新上传？"
                  onConfirm={() => this.ReuploadProof(record)}
                >
                  (<Button icon={<CaretRightOutlined />}> 重新上传</Button>)
                </Popconfirm>
              )}
              {this.CurrentUser === 'admin' && (
                <Popconfirm
                  title="确认提醒接种？"
                  onConfirm={() => this.Notification(record.petId)}
                >
                  <Button>提醒接种</Button>
                </Popconfirm>
              )}
            </Space>
          );
        },
      },
    ];
  }

  static getDerivedStateFromProps(nextProps: IPetsTableProps) {
    const { PetRecord, UserRecord } = nextProps;
    if (PetRecord) {
      return {
        PetRecords: PetRecord,
        PetCount: PetRecord.length,
      };
    }
    return null;
  }

  public handleSearch = (ev: any) => {
    // console.log('search');
    this.resetPageInfo();
  };

  public handleSelect = (value: string) => {
    this.setState(
      {
        Keyword: value,
      },
      () => {
        if (value == '') {
          this.resetPageInfo();
        } else {
          this.SearchPetRecords();
        }
      },
    );
  };

  public SearchPetRecords = (keyword?: string) => {
    const { Keyword } = this.state;
    const { dispatch } = this.props;
    console.log(keyword, 'keyword111');
    dispatch({
      type: 'info/SearchPetRecords',
      payload: {
        species: keyword ?? Keyword,
      },
    });
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
        this.ListPetRecords();
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
        this.ListPetRecords();
      },
    );
  };

  public openAddPetPanel = () => {
    this.setState({
      AddPetVisible: true,
    });
  };

  public closeAddPetPanel = () => {
    this.setState(
      {
        AddPetVisible: false,
      },
      () => {
        // this.ListPetRecords();
      },
    );
  };
  public closeUpdatePetPanel = () => {
    this.setState(
      {
        PetProfileVisible: false,
      },
      () => {
        this.ListPetRecords();
      },
    );
  };

  public OpenPetProfile = (id: string) => {
    const { dispatch } = this.props;
    this.setState({
      PetProfileVisible: true,
      PetProfileId: id,
    });
    dispatch({
      type: 'info/GetPetProfile',
      payload: {
        petId: id,
      },
    }).then((profile: any) => {
      this.setState({
        PetProfile: profile,
      });
    });
  };

  public ClosePetProfile = () => {
    this.setState(
      {
        PetProfileVisible: false,
        PetProfileId: '',
      },
      () => {
        this.ListPetRecords();
      },
    );
  };

  public UploadVaccineLicense = (record: any) => {
    // TODO 宠物id  和 疫苗id
    this.setState({
      UploadLicenseVisible: true,
      PetProfileId: record.petId,
      VaccineId: record.vaccineId,
    });
  };

  public ReuploadProof = (record: any) => {
    this.UploadVaccineLicense(record);
  };

  public ListPetRecords = () => {
    const { Keyword, PageNumber, PageSize } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'info/ListPetRecords',
      payload: {
        Keyword,
        PageNumber,
        PageSize,
      },
    });
  };

  public RemovePet = (id: string) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'info/RemovePet',
      payload: {
        id,
      },
    }).then(() => {
      this.refreshInfo();
    });
  };

  public Notification = (id: string) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'info/RemovePet',
      payload: {
        id,
      },
    }).then(() => {
      this.refreshInfo();
    });
  };

  public openUploadLicensePanel = () => {
    this.setState({
      UploadLicenseVisible: true,
    });
  };
  public closeUploadLicensePanel = () => {
    this.setState({
      UploadLicenseVisible: false,
    });
  };
  componentDidMount() {
    const { SearchKeyword } = this.props;
    console.log(SearchKeyword, 'SearchKeyword');

    if (SearchKeyword) {
      // TODO 参数形式
      this.setState({
        Keyword: SearchKeyword,
      });
      this.SearchPetRecords(SearchKeyword);
    } else {
      this.ListPetRecords();
    }
  }

  render() {
    const { intl, PetsLoading, type } = this.props;
    const {
      PetRecords,
      AddPetVisible,
      PetProfileVisible,
      PetProfileId,
      PetProfile,
      VaccineId,
      UploadLicenseVisible,

      Keyword,
      PageNumber,
      PageSize,
      UserRecords,
      PetCount,
    } = this.state;

    return (
      <>
        <NewCard>
          <CardBody>
            <NewRow size="md" flex justify="balance">
              {type === 'petMaster' && this.CurrentUser === 'petMaster' && (
                <Button type="primary" onClick={this.openAddPetPanel}>
                  新增宠物
                </Button>
              )}

              <Space>
                <div>
                  <Select
                    showSearch
                    style={{ width: 300 }}
                    allowClear
                    placeholder="宠物搜索"
                    onSelect={this.handleSelect}
                    value={Keyword}
                    // onKeyDown={this.onKeyDownchange}
                  >
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
                  {/* <Button
                    icon={<SearchOutlined />}
                    transparent
                    onClick={this.handleSearch}
                  /> */}
                </div>
                <Pagination
                  current={PageNumber}
                  pageSize={PageSize}
                  total={PetCount}
                  simple={true}
                  onChange={this.onPageChange}
                />
                <div className="pagination-lite" title="刷新">
                  <Button icon={<RedoOutlined />} onClick={this.refreshInfo} />
                </div>
              </Space>
            </NewRow>
            <BasicTable<PetRecord>
              loading={PetsLoading}
              columns={this.TableColumns}
              rowKey="petId"
              dataSource={PetRecords}
            />
          </CardBody>
        </NewCard>
        {AddPetVisible && (
          <CreatePetPanel
            visible={AddPetVisible}
            onClose={this.closeAddPetPanel}
          />
        )}
        {PetProfileVisible && (
          <PetProfilePanel
            PetProfile={PetProfile}
            visible={PetProfileVisible}
            onClose={this.closeUpdatePetPanel}
          />
        )}

        {/* 上传证明 */}
        {UploadLicenseVisible && (
          <>
            <UploadLicensePanel
              VaccineId={VaccineId}
              PetProfileId={PetProfileId}
              visible={UploadLicenseVisible}
              onClose={this.closeUploadLicensePanel}
            />
          </>
        )}
      </>
    );
  }
}

function mapStateToProps({ info, loading }: any) {
  return {
    PetRecord: info.PetRecord,
    PetsLoading: loading.effects['info/ListPets'],
    UserRecord: info.UserRecord,
    UsersLoading: loading.effects['info/ListUsers'],
  };
}

const connectedPetsTable = connect(mapStateToProps)(PetsTable);
export default injectIntl<'intl', any>(connectedPetsTable);
