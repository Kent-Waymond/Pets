import React from 'react';
import { connect } from 'umi';
import { injectIntl, IntlShape } from 'react-intl';
import { IBHRawListDataRecord } from '@/type';
import { CommunityProfile, CommunityRecord } from '@/pages/community/type.d';
import { DeleteTwoTone } from '@ant-design/icons';
import Button from '@/components/button';
import { stringSlice } from '@/utils/string';
import { CommunityProfilePanel } from '@/pages/community/profile/CommunityProfilePanel';
import NewCard, { CardBody, CardHeader } from '@/components/card';
import { Card, Col, Row } from 'antd';
import { Drawer, Popconfirm } from 'antd';
import { TABLE_PAGE_SIZE } from '@/variable';
const { Meta } = Card;

interface MyMomentPanelProps {
  intl: IntlShape;
  MomentProps: IBHRawListDataRecord<CommunityRecord>;
  MomentLoading: boolean;
  dispatch: any;
}

interface MyMomentPanelState {
  Moment: CommunityRecord[];
  MomentCount: number;

  MomentProfile: CommunityProfile | null;

  Keyword: string;
  PageNumber: number;
  PageSize: number;

  MomentProfileVisible: boolean;
  CreateCommunityVisible: boolean;
}

class MyMomentPanel extends React.PureComponent<
  MyMomentPanelProps,
  MyMomentPanelState
> {
  constructor(props: MyMomentPanelProps) {
    super(props);
    this.state = {
      Moment: [],
      MomentCount: 0,
      MomentProfile: null,

      Keyword: '',

      PageNumber: 1,
      PageSize: TABLE_PAGE_SIZE,

      MomentProfileVisible: false,
      CreateCommunityVisible: false,
    };
  }

  static getDerivedStateFromProps(
    nextProps: MyMomentPanelProps,
    prevState: MyMomentPanelState,
  ) {
    const { MomentProps } = nextProps;
    if (MomentProps) {
      return {
        Moment: MomentProps.data,
        MomentCount: MomentProps.total,
      };
    }
    return null;
  }

  public ListMomentRecords = () => {
    const { Keyword, PageNumber, PageSize } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'community/ListMyMoments',
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
      type: 'community/GetMyMomentProfile',
      payload: {
        momentId: record.essayId,
      },
    }).then((profile: CommunityProfile | null) => {
      if (profile) {
        this.setState({
          MomentProfile: profile,
          MomentProfileVisible: true,
        });
      }
    });
  };

  public closeRecordProfile = () => {
    this.setState(
      {
        MomentProfile: null,
        MomentProfileVisible: false,
      },
      () => {
        this.ListMomentRecords();
      },
    );
  };

  public RemoveMoment = (momentId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'community/RemoveMoment',
      payload: {
        momentId,
      },
    }).then(() => {
      this.ListMomentRecords();
    });
  };

  componentDidMount() {
    this.ListMomentRecords();
  }

  render() {
    const { intl } = this.props;
    const {
      Keyword,
      Moment,
      MomentCount,
      MomentProfile,
      PageNumber,
      PageSize,
      MomentProfileVisible,
      CreateCommunityVisible,
    } = this.state;
    return (
      <>
        <div style={{ marginTop: 30, marginLeft: 20, minWidth: 800 }}></div>
        <NewCard>
          <CardHeader title="我的动态" />
          <CardBody>
            <div className="site-card-wrapper">
              <Row gutter={24}>
                {Moment &&
                  Moment.map((item: CommunityRecord) => {
                    return (
                      <Col
                        span={20}
                        style={{ marginLeft: 60, marginBottom: 20 }}
                        key={item?.essayId}
                      >
                        <Card
                          title={item.title}
                          onClick={() => this.gotoRecordProfile(item)}
                          extra={
                            <Popconfirm
                              placement="top"
                              title="删除"
                              onConfirm={() => this.RemoveMoment(item.essayId)}
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
                                JSON.parse(item?.firstPicture)?.length
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

        <Drawer
          title="动态详情"
          visible={MomentProfileVisible}
          // visible={true}
          width={850}
          onClose={this.closeRecordProfile}
          destroyOnClose={true}
        >
          <CommunityProfilePanel
            profile={MomentProfile ?? null}
            visible={MomentProfileVisible}
            onClose={this.closeRecordProfile}
          />
        </Drawer>
      </>
    );
  }
}

function mapStateToProps({ community, loading }: any) {
  return {
    MomentProps: community.MyMoment,
    MomentLoading: loading.effects['community/ListMyMoments'],
  };
}
const connectedMyMomentPanel = connect(mapStateToProps)(MyMomentPanel);
export default injectIntl<'intl', any>(connectedMyMomentPanel);
