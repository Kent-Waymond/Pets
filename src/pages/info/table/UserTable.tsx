import React from 'react';
import {
  DeleteOutlined,
  RedoOutlined,
  MenuOutlined,
  SearchOutlined,
  HddTwoTone,
  UserOutlined,
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
import { PetRecord, UserRecord, UserProfile, PetProfile } from '../type.d';
import CreateUserPanel from '../form/CreateUserPanel';
import { UserProfilePanel } from '../profile/UserProfile';
import Button from '@/components/button';
import Avatar from '@/components/avatar';
import Grid, { NewRow } from '@/components/grid';
import Text from '@/components/text';
import { stringSlice } from '@/utils/string';
import Tag from '@/components/tag';
import Space from '@/components/space';
import NewCard, { CardBody } from '@/components/card';
import { BasicTable, IColumnType } from '@/components/table/BasicTable';
import { Popconfirm } from 'antd';
import Pagination from '@/components/pagination';
import { TABLE_PAGE_SIZE } from '@/variable';

interface IUserTableProps {
  PetRecord: IBHRawListDataRecord<PetRecord>;
  PetsLoading: boolean;
  UserRecordProps: IBHRawListDataRecord<UserRecord>;
  UsersLoading: boolean;
  dispatch: any;
  intl: IntlShape;
}

interface IUserTableStates {
  PetCount: number;
  PetRecords: PetRecord[];
  UserCount: number;
  UserRecords: UserRecord[];

  CreateUserVisible: boolean;
  UserProfileVisible: boolean;
  CurrentUserProfile: any;
  UserProfileId: string;

  Keyword: string;
  PageNumber: number;
  PageSize: number;
}

const stateMap: any = {
  ready: 'success',
  down: 'error',
};

class UserTable extends React.PureComponent<IUserTableProps, IUserTableStates> {
  private TableColumns: IColumnType<UserRecord>[];

  constructor(props: IUserTableProps) {
    super(props);
    this.state = {
      PetCount: 0,
      PetRecords: [],
      UserCount: 0,
      UserRecords: [],

      CreateUserVisible: false,
      UserProfileVisible: false,
      CurrentUserProfile: null,
      UserProfileId: '',

      Keyword: '',
      PageNumber: 1,
      PageSize: TABLE_PAGE_SIZE,
    };

    this.TableColumns = [
      {
        title: '用户名字',
        key: 'userName',
        dataIndex: 'userName',
        render: (text: string) => (
          <NewRow flex>
            <Avatar status="success">
              <UserOutlined twoToneColor="#1bc5bd" />
            </Avatar>
            <Grid.NewCol grid>
              <Text title={text}>{stringSlice(text)}</Text>
            </Grid.NewCol>
          </NewRow>
        ),
      },
      {
        title: '昵称',
        key: 'nickname',
        dataIndex: 'nickname',
        render: (nickname: string) => (
          <Text title={nickname}>{stringSlice(nickname)}</Text>
        ),
      },
      {
        title: '用户类型',
        key: 'type',
        dataIndex: 'type',
        render: (type: number) => <Text>{type === 0 ? '养宠住户' : ''}</Text>,
      },
      {
        title: '手机号',
        key: 'phone',
        dataIndex: 'phone',
        render: (phone: string) => (
          <Text title={phone}>{stringSlice(phone)}</Text>
        ),
      },
      {
        title: '详细住址',
        key: 'detailAddress',
        dataIndex: 'detailAddress',
        render: (detailAddress: string) => (
          <Text title={detailAddress}>{stringSlice(detailAddress)}</Text>
        ),
      },
      {
        title: '邮箱',
        key: 'email',
        dataIndex: 'email',
        render: (Email: string) => (
          <Text title={Email}>{stringSlice(Email)}</Text>
        ),
      },
      {
        title: '操作',
        key: 'Action',
        dataIndex: 'Id',
        className: 'th-w-action-2',
        render: (instanceId: string, record: UserRecord) => {
          return (
            <Space>
              <Button
                icon={<MenuOutlined />}
                onClick={() => this.OpenProfile(record.userId)}
              />
            </Space>
          );
        },
      },
    ];
  }

  static getDerivedStateFromProps(nextProps: IUserTableProps) {
    const { UserRecordProps } = nextProps;
    if (UserRecordProps) {
      return {
        UserRecords: UserRecordProps,
        UserCount: UserRecordProps.length,
      };
    }
    return null;
  }

  public handleSearch = (ev: any) => {
    const { Keyword, PageNumber, PageSize } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'info/SearchUserRecords',
      payload: {
        name: Keyword,
      },
    });
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
        this.ListUserRecords();
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
        this.ListUserRecords();
      },
    );
  };

  public openCreateUserPanel = () => {
    this.setState({
      CreateUserVisible: true,
    });
  };

  public closeCreatePanel = () => {
    this.setState(
      {
        CreateUserVisible: false,
      },
      () => {
        this.ListUserRecords();
      },
    );
  };

  public OpenProfile = (id: string) => {
    const { UserRecords } = this.state;

    const profile = UserRecords.filter(
      (item: UserProfile) => item.userId === id,
    );
    this.setState({
      UserProfileVisible: true,
      UserProfileId: id,
      CurrentUserProfile: profile[0],
    });
  };

  public ClosedProfile = () => {
    this.setState(
      {
        UserProfileVisible: false,
        UserProfileId: '',
      },
      () => {
        this.ListUserRecords();
      },
    );
  };

  public ListUserRecords = () => {
    const { Keyword, PageNumber, PageSize } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'info/ListAllUsers',
      payload: {
        Keyword,
        PageNumber,
        PageSize,
      },
    });
  };

  public DeleteUser = (id: string) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'node/DeleteUser',
      payload: {
        id,
      },
    }).then(() => {
      this.refreshInfo();
    });
  };

  componentDidMount() {
    this.refreshInfo();
    this.ListUserRecords();
  }

  render() {
    const { intl, PetsLoading } = this.props;
    const {
      PetRecords,
      PetCount,
      CreateUserVisible,
      UserProfileVisible,
      CurrentUserProfile,
      UserProfileId,
      Keyword,
      PageNumber,
      PageSize,
      UserRecords,
      UserCount,
    } = this.state;
    return (
      <>
        <NewRow size="md" flex justify="balance">
          <Button type="primary" onClick={this.openCreateUserPanel}>
            用户注册
          </Button>
          <Space>
            <div className="control search">
              <input
                type="text"
                value={Keyword}
                placeholder="搜索用户"
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
              total={UserCount}
              simple={true}
              onChange={this.onPageChange}
            />
            <div className="pagination-lite" title="刷新">
              <Button icon={<RedoOutlined />} onClick={this.refreshInfo} />
            </div>
          </Space>
        </NewRow>
        <NewCard>
          <CardBody>
            <BasicTable<UserRecord>
              loading={PetsLoading}
              columns={this.TableColumns}
              rowKey="userId"
              dataSource={UserRecords}
            />
          </CardBody>
        </NewCard>
        {CreateUserVisible && (
          <CreateUserPanel
            visible={CreateUserVisible}
            onClose={this.closeCreatePanel}
          />
        )}
        {UserProfileVisible && UserProfileId && (
          <UserProfilePanel
            profile={CurrentUserProfile}
            visible={UserProfileVisible}
            onClose={this.ClosedProfile}
          />
        )}
      </>
    );
  }
}

function mapStateToProps({ info, loading }: any) {
  return {
    PetRecord: info.PetRecord,
    PetsLoading: loading.effects['info/ListPets'],
    UserRecordProps: info.UserRecord,
    UsersLoading: loading.effects['info/ListUsers'],
  };
}

const connectedUserTable = connect(mapStateToProps)(UserTable);
export default injectIntl<'intl', any>(connectedUserTable);
