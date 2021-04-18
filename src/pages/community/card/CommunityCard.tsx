import React from 'react';
import { connect, FormattedMessage } from 'umi';
import { defineMessages, injectIntl, IntlShape } from 'react-intl';
import { IBHRawListDataRecord } from '@/type';
import { CommunityProfile, CommunityRecord } from '../type';
import {
  CaretRightOutlined,
  RedoOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { CommunityProfilePanel } from '../profile/CommunityProfilePanel';
import Button from '@/components/button';
import NewCard, { CardBody } from '@/components/card';
import { BasicTable, IColumnType } from '@/components/table/BasicTable';
import Avatar from '@/components/avatar';
import Grid, { NewRow } from '@/components/grid';
import { Card, Col, Row } from 'antd';
import Text from '@/components/text';
import { stringSlice } from '@/utils/string';
import Tag from '@/components/tag';
import Space from '@/components/space';
import { Drawer, Popconfirm } from 'antd';
import CreateCommunityPanel from '../form/CreateCommunityPanel';
import Pagination from '@/components/pagination';
import { TABLE_PAGE_SIZE } from '@/variable';
const { Meta } = Card;

interface CommunityCardProps {
  intl: IntlShape;
  Community: IBHRawListDataRecord<CommunityRecord>;
  CommunityLoading: boolean;
  CommunityModelLoading: boolean;
  dispatch: any;
}

interface CommunityCardState {
  Communitys: CommunityRecord[];
  CommunitysCount: number;

  CommunityProfile: CommunityProfile | null;

  Keyword: string;
  PageNumber: number;
  PageSize: number;

  CommunityProfileVisible: boolean;
  CreateCommunityVisible: boolean;
}

const stateMap: any = {
  Vaccinated: 'success',
  Unvaccinated: 'danger',
  Auditing: 'primary',
};

class CommunityCard extends React.PureComponent<
  CommunityCardProps,
  CommunityCardState
> {
  constructor(props: CommunityCardProps) {
    super(props);
    this.state = {
      Communitys: [],
      CommunitysCount: 0,
      CommunityProfile: null,

      Keyword: '',

      PageNumber: 1,
      PageSize: TABLE_PAGE_SIZE,

      CommunityProfileVisible: false,
      CreateCommunityVisible: false,
    };
  }

  static getDerivedStateFromProps(
    nextProps: CommunityCardProps,
    prevState: CommunityCardState,
  ) {
    const { Community } = nextProps;
    if (Community && Community['Communitys'] instanceof Array) {
      return {
        Communitys: Community['Communitys'],
        CommunitysCount: Community.count,
      };
    }
    return null;
  }

  public onPageChange = (page: number, pageSize?: number, type?: string) => {
    this.setState(
      {
        PageNumber: page,
        PageSize: pageSize ? pageSize : TABLE_PAGE_SIZE,
      },
      () => {
        if (type === 'search') {
          this.SearchCommunitys();
        } else {
          this.ListRecords();
        }
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

  public resetPageInfo = (type?: string) => {
    this.onPageChange(1, TABLE_PAGE_SIZE, type);
  };

  public handleSearch = (ev: any) => {
    // console.log('search');
    this.resetPageInfo('search');
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
      CreateCommunityVisible: true,
    });
  };
  public closeCreatePanel = () => {
    this.setState(
      {
        CreateCommunityVisible: false,
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
      type: 'community/ListCommunitys',
      payload: {
        Keyword,
        pageNumber: PageNumber,
        pageSize: PageSize,
      },
    });
  };

  public SearchCommunitys = () => {
    const { Keyword, PageNumber, PageSize } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'community/SearchCommunitys',
      payload: {
        Keyword,
        pageNumber: PageNumber,
        pageSize: PageSize,
      },
    });
  };

  public gotoRecordProfile = (record: CommunityRecord) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'community/GetCommunityProfile',
      payload: {
        CommunityId: record.essay_id,
      },
    }).then((profile: CommunityProfile | null) => {
      if (profile) {
        this.setState({
          CommunityProfile: profile,
          CommunityProfileVisible: true,
        });
      }
    });
  };

  public closeRecordProfile = () => {
    this.setState(
      {
        CommunityProfile: null,
        CommunityProfileVisible: false,
      },
      () => {
        this.ListRecords();
      },
    );
  };

  public Removecommunity = (record: CommunityRecord) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'community/RemoveCommunitys',
      payload: {
        Ids: [record?.essay_id],
      },
    }).then(() => {
      this.ListRecords();
    });
  };

  componentDidMount() {
    this.ListRecords();
  }

  render() {
    const { intl, CommunityModelLoading } = this.props;
    const {
      Keyword,
      Communitys,
      CommunitysCount,
      CommunityProfile,
      PageNumber,
      PageSize,
      CommunityProfileVisible,
      CreateCommunityVisible,
    } = this.state;
    return (
      <>
        <div style={{ marginTop: 30, marginLeft: 20, minWidth: 800 }}>
          <NewRow size="md" flex justify="balance">
            <Button type="primary" onClick={this.openCreatePanel}>
              发布动态
            </Button>
            <Space>
              <div className="control search">
                <input
                  type="text"
                  value={Keyword}
                  style={{
                    border: '1px solid black',
                    borderRadius: 10,
                    height: 30,
                  }}
                  placeholder="搜索"
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
                total={CommunitysCount}
                simple={true}
                onChange={this.onPageChange}
              />
              <div className="pagination-lite" title="刷新">
                <Button icon={<RedoOutlined />} onClick={this.refreshInfo} />
              </div>
            </Space>
          </NewRow>
        </div>
        <NewCard>
          <CardBody>
            <div className="site-card-wrapper">
              <Row gutter={24}>
                <Col span={2}></Col>
                <Col span={5}>
                  <Card
                    hoverable
                    bordered={true}
                    style={{ width: 200, height: 300 }}
                    cover={
                      <img
                        alt="example"
                        src="https://tiebapic.baidu.com/forum/pic/item/7aec54e736d12f2e96d9a72e58c2d5628435689b.jpg"
                        width="200"
                        height="250"
                      />
                    }
                  >
                    <Meta title="大橘寄养" description="公司出差..." />
                  </Card>
                </Col>
                <Col span={2}></Col>
                <Col span={5}>
                  <Card
                    hoverable
                    bordered={true}
                    style={{ width: 200, height: 300 }}
                    cover={
                      <img
                        alt="example"
                        src="https://tiebapic.baidu.com/forum/pic/item/08f790529822720ee013ebb46ccb0a46f31fab9b.jpg"
                        width="200"
                        height="250"
                      />
                    }
                  >
                    <Meta
                      title="宠物医院推荐"
                      description="证书齐全、细致..."
                    />
                  </Card>
                </Col>
                <Col span={2}></Col>
                <Col span={5}>
                  <Card
                    hoverable
                    bordered={true}
                    style={{ width: 200, height: 300 }}
                    cover={
                      <img
                        alt="example"
                        src="https://tiebapic.baidu.com/forum/pic/item/b7fd5266d016092420f9ab55c30735fae7cd349b.jpg"
                        width="200"
                        height="250"
                      />
                    }
                  >
                    <Meta
                      title="猫粮推荐"
                      description="xxx性价比高，猫咪十分喜欢..."
                    />
                  </Card>

                  {/* 左右布局  或 上下布局  只能有一级评论  用List和Comment配合使用（Coment中只传入数据） */}
                </Col>
              </Row>
            </div>
          </CardBody>
        </NewCard>

        {CreateCommunityVisible && (
          <CreateCommunityPanel
            visible={CreateCommunityVisible}
            onClose={this.closeCreatePanel}
            // width={800}
          />
        )}

        <Drawer
          title="动态详情"
          visible={CommunityProfileVisible}
          // visible={true}
          width={850}
          onClose={this.closeRecordProfile}
          destroyOnClose={true}
        >
          <CommunityProfilePanel
            profile={CommunityProfile ?? null}
            visible={CommunityProfileVisible}
            onClose={this.closeRecordProfile}
          />
        </Drawer>
      </>
    );
  }
}

function mapStateToProps({ community, loading }: any) {
  return {
    Community: community.Community,
    CommunityLoading: loading.effects['community/ListCommunitys'],
    CommunityModelLoading: loading.models.Community,
  };
}
const connectedCommunityCard = connect(mapStateToProps)(CommunityCard);
export default injectIntl<'intl', any>(connectedCommunityCard);
