import React from 'react';
import { connect } from 'umi';
import { injectIntl, IntlShape } from 'react-intl';
import { IBHRawListDataRecord } from '@/type';
import { CommunityProfile, CommunityRecord, CommentRecord } from '../type';
import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { CommunityProfilePanel } from '../profile/CommunityProfilePanel';
import Button from '@/components/button';
import NewCard, { CardBody } from '@/components/card';
import { NewRow } from '@/components/grid';
import { Card, Col, Row } from 'antd';
import Space from '@/components/space';
import { Drawer, Popconfirm } from 'antd';
import CreateCommunityPanel from '../form/CreateCommunityPanel';
import Pagination from '@/components/pagination';
import { TABLE_PAGE_SIZE } from '@/variable';
import { stringSlice } from '@/utils/string';
import { DeleteTwoTone } from '@ant-design/icons';
const { Meta } = Card;

interface CommunityCardProps {
  intl: IntlShape;
  CommunityProps: IBHRawListDataRecord<CommunityRecord>;
  CommentProps: IBHRawListDataRecord<CommentRecord>;
  CommunityLoading: boolean;
  CommunityModelLoading: boolean;
  dispatch: any;
}

interface CommunityCardState {
  Communitys: CommunityRecord[];
  Comments: CommentRecord[];
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
      Comments: [],
      CommunitysCount: 0,
      CommunityProfile: null,

      Keyword: '',

      PageNumber: 1,
      PageSize: TABLE_PAGE_SIZE,

      CommunityProfileVisible: false,
      CreateCommunityVisible: false,
    };
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
          this.ListCommunityRecords();
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
        this.ListCommunityRecords();
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
          this.resetPageInfo('');
        }
      },
    );
  };

  public openCreatePanel = () => {
    this.setState({
      CreateCommunityVisible: true,
    });
  };
  public CloseCreatePanel = () => {
    this.setState(
      {
        CreateCommunityVisible: false,
      },
      () => {
        this.ListCommunityRecords();
      },
    );
  };

  public ListCommunityRecords = () => {
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
        CommunityId: record.essayId,
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
        this.ListCommunityRecords();
      },
    );
  };

  public Removecommunity = (essayId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'community/RemoveCommunity',
      payload: {
        essayId: essayId,
      },
    }).then(() => {
      this.ListCommunityRecords();
    });
  };

  static getDerivedStateFromProps(
    nextProps: CommunityCardProps,
    prevState: CommunityCardState,
  ) {
    const { CommunityProps, CommentProps } = nextProps;

    if (CommunityProps && CommentProps) {
      return {
        Communitys: CommunityProps?.data,
        CommunitysCount: CommunityProps?.total,
        Comments: CommentProps,
      };
    }
    return null;
  }

  componentDidMount() {
    this.ListCommunityRecords();
  }

  render() {
    const { intl, CommunityModelLoading } = this.props;
    const {
      Keyword,
      Communitys,
      Comments,
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
                {Communitys &&
                  Communitys.map((item: CommunityRecord) => {
                    return (
                      <Col
                        span={20}
                        style={{ marginLeft: 60, marginBottom: 20 }}
                        key={item?.essayId}
                      >
                        <Card
                          onClick={() => this.gotoRecordProfile(item)}
                          title={item.title}
                          extra={
                            <Popconfirm
                              placement="top"
                              title="删除"
                              onConfirm={() =>
                                this.Removecommunity(item.essayId)
                              }
                              okText="确定"
                              cancelText="取消"
                            >
                              <Button
                                icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                              />
                            </Popconfirm>
                          }
                          hoverable
                          bordered={true}
                          // style={{ width: 200, height: 300 }}
                          cover={
                            <img
                              alt="example"
                              src={
                                JSON.parse(item?.firstPicture).length
                                  ? `http://${
                                      JSON.parse(item?.firstPicture)[0]
                                    }`
                                  : 'http://119.3.249.45:7070/file/image/984165236451/2021-04-24-21-00-24-826default.png'
                              }
                              height="250"
                            />
                          }
                        >
                          <Meta description={stringSlice(item.essayContent)} />
                        </Card>
                      </Col>
                    );
                  })}
                <Col span={2}></Col>

                {/* 左右布局  或 上下布局  只能有一级评论  用List和Comment配合使用（Coment中只传入数据） */}
              </Row>
            </div>
          </CardBody>
        </NewCard>

        {CreateCommunityVisible && (
          <CreateCommunityPanel
            visible={CreateCommunityVisible}
            onClose={this.CloseCreatePanel}
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
            Comments={Comments ?? null}
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
    CommunityProps: community.Community,
    CommentProps: community.Comments,
    CommunityLoading: loading.effects['community/ListCommunitys'],
    CommunityModelLoading: loading.models.Community,
  };
}
const connectedCommunityCard = connect(mapStateToProps)(CommunityCard);
export default injectIntl<'intl', any>(connectedCommunityCard);
