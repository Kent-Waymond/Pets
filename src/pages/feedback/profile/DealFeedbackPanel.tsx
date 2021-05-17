import React from 'react';
import { connect, FormattedMessage } from 'umi';
import { injectIntl, IntlShape } from 'react-intl';
import { IBHRawListDataRecord } from '@/type';
import { FeedbackProfile, FeedbackRecord } from '../type.d';
import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
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
import { GET_IDENTITY } from '@/utils/auth';
const currentUser = GET_IDENTITY();
const { Meta } = Card;

interface DealFeedbackPanelProps {
  intl: IntlShape;
  Feedback: IBHRawListDataRecord<FeedbackRecord>;
  FeedbackLoading: boolean;
  FeedbackModelLoading: boolean;
  dispatch: any;
}

interface DealFeedbackPanelState {
  FeedbacksToDeal: FeedbackRecord[];
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

class DealFeedbackPanel extends React.PureComponent<
  DealFeedbackPanelProps,
  DealFeedbackPanelState
> {
  constructor(props: DealFeedbackPanelProps) {
    super(props);
    this.state = {
      FeedbacksToDeal: [],
      FeedbacksCount: 0,
      FeedbackProfile: null,

      Keyword: '',

      PageNumber: 1,
      PageSize: TABLE_PAGE_SIZE,

      FeedbackProfileVisible: false,
      CreateFeedbackVisible: false,
    };
  }

  static getDerivedStateFromProps(
    nextProps: DealFeedbackPanelProps,
    prevState: DealFeedbackPanelState,
  ) {
    const { Feedback } = nextProps;
    if (Feedback && Feedback['Feedbacks'] instanceof Array) {
      return {
        FeedbacksToDeal: Feedback['Feedbacks'],
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
        this.ListFeedbacksToDeal();
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
        this.ListFeedbacksToDeal();
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

  public DealFeedback = (FeedbackId: string) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'feedback/DealFeedback',
      payload: {
        complainId: FeedbackId,
      },
    });
  };

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
        this.ListFeedbacksToDeal();
      },
    );
  };

  public ListFeedbacksToDeal = () => {
    const { Keyword, PageNumber, PageSize } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'feedback/ListFeedbacksToDeal',
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
        this.ListFeedbacksToDeal();
      },
    );
  };

  public RemoveFeedback = (record: FeedbackRecord) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'feedback/RemoveFeedbacks',
      payload: {
        Ids: [record?.complainId],
      },
    }).then(() => {
      this.ListFeedbacksToDeal();
    });
  };
  public DealFeedbackSuccess = (Id: string) => {};
  componentDidMount() {
    this.ListFeedbacksToDeal();
  }

  render() {
    const { intl, FeedbackModelLoading } = this.props;
    const {
      Keyword,
      FeedbacksToDeal,
      FeedbacksCount,
      FeedbackProfile,
      PageNumber,
      PageSize,
      FeedbackProfileVisible,
      CreateFeedbackVisible,
    } = this.state;
    return (
      <>
        {currentUser === 'admin' ? (
          <>
            <div style={{ marginTop: 30, marginLeft: 20 }}>
              <NewRow size="md" flex justify="balance">
                <Space>
                  <h3>反馈处理</h3>
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
                    <Col span={20}>
                      {FeedbacksToDeal &&
                        FeedbacksToDeal.map((item: FeedbackRecord) => {
                          return (
                            <Col
                              span={20}
                              style={{ marginLeft: 60, marginBottom: 20 }}
                              key={item?.complainId}
                            >
                              <Card
                                onClick={() => this.gotoRecordProfile(item)}
                                title={item.title}
                                extra={
                                  <Popconfirm
                                    placement="top"
                                    title="处理完成"
                                    onConfirm={() =>
                                      this.DealFeedbackSuccess(item.complainId)
                                    }
                                    okText="确定"
                                    cancelText="取消"
                                  >
                                    <Button type="success">处理完成</Button>
                                  </Popconfirm>
                                }
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
      </>
    );
  }
}

function mapStateToProps({ feedback, loading }: any) {
  return {
    Instance: feedback.Feedback,
    FeedbackLoading: loading.effects['feedback/ListFeedbacks'],
    FeedbackModelLoading: loading.models.Feedback,
  };
}
const connectedDealFeedbackPanel = connect(mapStateToProps)(DealFeedbackPanel);
export default injectIntl<'intl', any>(connectedDealFeedbackPanel);
