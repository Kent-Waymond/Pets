import React from 'react';
import { connect, FormattedMessage } from 'umi';
import { defineMessages, injectIntl, IntlShape } from 'react-intl';
import { IBHRawListDataRecord } from '@/type';
import { CommunityProfile, CommunityRecord } from '@/pages/community/type.d';

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

  CommunityProfileVisible: boolean;
  CreateCommunityVisible: boolean;
}

const stateMap: any = {
  Vaccinated: 'success',
  Unvaccinated: 'danger',
  Auditing: 'primary',
};

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

      CommunityProfileVisible: false,
      CreateCommunityVisible: false,
    };
  }

  static getDerivedStateFromProps(
    nextProps: MyMomentPanelProps,
    prevState: MyMomentPanelState,
  ) {
    const { MomentProps } = nextProps;
    if (MomentProps && MomentProps['Moments'] instanceof Array) {
      return {
        Moment: MomentProps['Moments'],
        MomentCount: MomentProps.count,
      };
    }
    return null;
  }

  public ListRecords = () => {
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
        momentId: record.essay_id,
      },
    }).then((profile: CommunityProfile | null) => {
      if (profile) {
        this.setState({
          MomentProfile: profile,
          CommunityProfileVisible: true,
        });
      }
    });
  };

  public closeRecordProfile = () => {
    this.setState(
      {
        MomentProfile: null,
        CommunityProfileVisible: false,
      },
      () => {
        this.ListRecords();
      },
    );
  };

  public RemoveMoment = (record: CommunityRecord) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'community/RemoveMoment',
      payload: {
        momentId: [record?.essay_id],
      },
    }).then(() => {
      this.ListRecords();
    });
  };

  componentDidMount() {
    this.ListRecords();
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
      CommunityProfileVisible,
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
                <Col span={2}></Col>
                <Col span={20}>
                  <Card
                    hoverable
                    bordered={true}
                    style={{ width: 200, height: 300 }}
                    cover={
                      <img
                        alt="example"
                        src="https://i.loli.net/2021/03/11/gExs7z9irBpcVjk.png"
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
              </Row>
            </div>
          </CardBody>
        </NewCard>

        <Drawer
          title="动态详情"
          visible={CommunityProfileVisible}
          // visible={true}
          width={850}
          onClose={this.closeRecordProfile}
          destroyOnClose={true}
        >
          <CommunityProfilePanel
            profile={MomentProfile ?? null}
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
    MomentProps: community.MyMoment,
    MomentLoading: loading.effects['community/ListMyMoments'],
  };
}
const connectedMyMomentPanel = connect(mapStateToProps)(MyMomentPanel);
export default injectIntl<'intl', any>(connectedMyMomentPanel);
