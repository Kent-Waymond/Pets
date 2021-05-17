import React from 'react';
import { connect, FormattedMessage } from 'umi';
import { injectIntl, IntlShape } from 'react-intl';
import { IBHRawListDataRecord } from '@/type';
import { FeedbackProfile, FeedbackRecord } from '../type.d';
import { DeleteTwoTone, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import FeedbackProfilePanel from '../profile/FeedbackProfilePanel';
import Button from '@/components/button';
import NewCard, { CardBody } from '@/components/card';
import { BasicTable, IColumnType } from '@/components/table/BasicTable';
import Grid, { NewRow } from '@/components/grid';
import { Card, Col, Row } from 'antd';
import Text from '@/components/text';
import { stringSlice } from '@/utils/string';
import Tag from '@/components/tag';
import Space from '@/components/space';
import { Drawer, Popconfirm } from 'antd';
import CreateFeedbackPanel from '../form/CreateFeedbackPanel';
import Pagination from '@/components/pagination';
import { TABLE_PAGE_SIZE } from '@/variable';
import DealFeedbackPanel from '../profile/DealFeedbackPanel';
import { GET_IDENTITY } from '@/utils/auth';
const { Meta } = Card;

interface FeedbackCardProps {
  intl: IntlShape;
  Feedback: IBHRawListDataRecord<FeedbackRecord>;
  FeedbackLoading: boolean;
  FeedbackModelLoading: boolean;
  dispatch: any;
}

interface FeedbackCardState {
  Feedbacks: FeedbackRecord[];
  FeedbacksCount: number;

  FeedbackProfile: FeedbackProfile | null;

  Keyword: string;
  PageNumber: number;
  PageSize: number;

  FeedbackProfileVisible: boolean;
  CreateFeedbackVisible: boolean;
}

const stateMap: any = {
  Vaccinated: 'success',
  Unvaccinated: 'danger',
  Auditing: 'primary',
};

class FeedbackCard extends React.PureComponent<
  FeedbackCardProps,
  FeedbackCardState
> {
  private currentUser = GET_IDENTITY();
  private TableColumns: IColumnType<FeedbackRecord>[];
  constructor(props: FeedbackCardProps) {
    super(props);
    this.state = {
      Feedbacks: [],
      FeedbacksCount: 0,
      FeedbackProfile: null,

      Keyword: '',

      PageNumber: 1,
      PageSize: TABLE_PAGE_SIZE,

      FeedbackProfileVisible: false,
      CreateFeedbackVisible: false,
    };

    this.TableColumns = [
      {
        title: (
          <FormattedMessage id="common.text.Name" defaultMessage="疫苗名称" />
        ),
        key: 'Name',
        dataIndex: 'name',
        render: (text: string, record: FeedbackRecord) => {
          return <Text title={text}>{stringSlice(text)}</Text>;
        },
      },
      {
        title: (
          <FormattedMessage id="common.text.Node" defaultMessage="疫苗类型" />
        ),
        key: 'Node',
        dataIndex: 'address',
        render: (text: string, record: FeedbackRecord) => (
          <Text title={text}>{stringSlice(text)}</Text>
        ),
      },
      {
        title: (
          <FormattedMessage
            id="common.text.Network"
            defaultMessage="宠物类型"
          />
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
          <FormattedMessage id="common.text.Status" defaultMessage="接种状态" />
        ),
        key: 'Status',
        dataIndex: 'status',
        render: (text: string) => {
          return (
            <Tag status={stateMap[text]}>
              {text === 'Unvaccinated ' ? '未接种' : '已接种'}
            </Tag>
          );
        },
      },
      {
        key: 'Action',
        dataIndex: 'id',
        className: 'th-w-action-2',
        render: (FeedbackId: string, record: FeedbackRecord) => {
          return (
            <Space>
              {/* <Button
                icon={<MenuOutlined />}
                onClick={() => this.gotoRecordProfile(record)}
              /> */}
            </Space>
          );
        },
      },
    ];
  }

  static getDerivedStateFromProps(
    nextProps: FeedbackCardProps,
    prevState: FeedbackCardState,
  ) {
    const { Feedback } = nextProps;
    if (Feedback && Feedback['Feedbacks'] instanceof Array) {
      return {
        Feedbacks: Feedback['Feedbacks'],
        FeedbacksCount: Feedback.count,
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

  public ReuploadProof = (FeedbackId: string) => {
    // 打开上传页，传入参数和图片即可
  };

  public UploadProof = (FeedbackId: string) => {};

  public openCreatePanel = () => {
    this.setState({
      CreateFeedbackVisible: true,
    });
  };
  public closeCreatePanel = () => {
    this.setState(
      {
        CreateFeedbackVisible: false,
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
      type: 'feedback/ListFeedbacks',
      payload: {
        Keyword,
        PageNumber,
        PageSize,
      },
    });
  };

  public gotoRecordProfile = (record: FeedbackRecord) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'feedback/GetFeedback',
      payload: {
        FeedbackId: record.complainId,
      },
    }).then((profile: FeedbackProfile | null) => {
      if (profile) {
        this.setState({
          FeedbackProfile: profile,
          FeedbackProfileVisible: true,
        });
      }
    });
  };

  public closeRecordProfile = () => {
    this.setState(
      {
        FeedbackProfile: null,
        FeedbackProfileVisible: false,
      },
      () => {
        this.ListRecords();
      },
    );
  };

  public RemoveFeedback = (record: FeedbackRecord) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'feedback/RemoveFeedback',
      payload: {
        complainId: record?.complainId,
      },
    }).then(() => {
      this.ListRecords();
    });
  };

  componentDidMount() {
    this.ListRecords();
  }

  render() {
    const { intl, FeedbackModelLoading } = this.props;
    const {
      Keyword,
      Feedbacks,
      FeedbacksCount,
      FeedbackProfile,
      PageNumber,
      PageSize,
      FeedbackProfileVisible,
      CreateFeedbackVisible,
    } = this.state;
    return (
      <>
        {this.currentUser !== 'admin' ? (
          <>
            <div style={{ marginTop: 30, marginLeft: 20 }}>
              <NewRow size="md" flex justify="balance">
                <Button type="primary" onClick={this.openCreatePanel}>
                  发布反馈
                </Button>
                <Space>
                  <div className="control search">
                    <input
                      type="text"
                      value={Keyword}
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
                    total={FeedbacksCount}
                    simple={true}
                    onChange={this.onPageChange}
                  />
                  <div className="pagination-lite" title="刷新">
                    <Button
                      icon={<RedoOutlined />}
                      onClick={this.refreshInfo}
                    />
                  </div>
                </Space>
              </NewRow>
            </div>
            <NewCard>
              <CardBody>
                <div className="site-card-wrapper">
                  <Row gutter={24}>
                    <Col span={2}></Col>
                    <Col span={8}>
                      {/* TODO 根据返回的数据渲染Card */}
                      {Feedbacks &&
                        Feedbacks.map((item: FeedbackRecord) => {
                          return (
                            <Col
                              span={20}
                              style={{ marginLeft: 60, marginBottom: 20 }}
                              key={item?.complainId}
                            >
                              <Card
                                onClick={() => this.gotoRecordProfile(item)}
                                title={item.title}
                                hoverable
                                bordered={true}
                                // style={{ width: 200, height: 300 }}
                                cover={
                                  <img
                                    alt="example"
                                    src={`http://119.3.249.45:7070/file/image/${item.image}`}
                                    height="250"
                                  />
                                }
                              >
                                <Meta description={stringSlice(item.content)} />
                              </Card>
                            </Col>
                          );
                        })}
                    </Col>
                    <Col span={2}></Col>
                  </Row>
                </div>
              </CardBody>
            </NewCard>

            {/* TODO 住户才能发布反馈 */}
            {this.currentUser !== 'admin' && CreateFeedbackVisible && (
              <CreateFeedbackPanel
                visible={CreateFeedbackVisible}
                onClose={this.closeCreatePanel}
                width={800}
              />
            )}

            <Drawer
              title="反馈详情"
              visible={FeedbackProfileVisible}
              // visible={true}
              width={850}
              onClose={this.closeRecordProfile}
              destroyOnClose={true}
            >
              {/* TODO 若反馈已在处理阶段  不能进行修改 */}
              <FeedbackProfilePanel
                profile={FeedbackProfile ?? null}
                visible={FeedbackProfileVisible}
                onClose={this.closeRecordProfile}
              />
            </Drawer>
          </>
        ) : (
          <></>
        )}
        {this.currentUser === 'admin' ? (
          <>
            <DealFeedbackPanel />
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
}

function mapStateToProps({ feedback, loading }: any) {
  return {
    Feedback: feedback.Feedback,
    FeedbackLoading: loading.effects['feedback/ListFeedbacks'],
    FeedbackModelLoading: loading.models.Feedback,
  };
}
const connectedFeedbackCard = connect(mapStateToProps)(FeedbackCard);
export default injectIntl<'intl', any>(connectedFeedbackCard);
