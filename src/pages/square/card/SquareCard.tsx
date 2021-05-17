import React from 'react';
import { connect } from 'umi';
import { injectIntl, IntlShape } from 'react-intl';
import { IBHRawListDataRecord } from '@/type';
import { SquareProfile, SquareRecord } from '../type';
import { DeleteTwoTone, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { SquareProfilePanel } from '../profile/SquareProfilePanel';
import Button from '@/components/button';
import NewCard, { CardBody } from '@/components/card';
import { NewRow } from '@/components/grid';
import { Card, Col, Row } from 'antd';
import { stringSlice } from '@/utils/string';
import Space from '@/components/space';
import { Drawer, Popconfirm } from 'antd';
import CreateSquarePanel from '../form/CreateSquarePanel';
import Pagination from '@/components/pagination';
import { TABLE_PAGE_SIZE } from '@/variable';
import { CommentRecord } from '@/pages/community/type.d';
const { Meta } = Card;

interface SquareCardProps {
  intl: IntlShape;
  SquareProps: IBHRawListDataRecord<SquareRecord>;
  CommentProps: IBHRawListDataRecord<CommentRecord>;

  SquareLoading: boolean;
  SquareModelLoading: boolean;
  dispatch: any;
}

interface SquareCardState {
  Squares: SquareRecord[];
  Comments: CommentRecord[];
  SquaresCount: number;

  SquareProfile: SquareProfile | null;

  Keyword: string;
  PageNumber: number;
  PageSize: number;

  SquareProfileVisible: boolean;
  CreateSquareVisible: boolean;
}

const stateMap: any = {
  Vaccinated: 'success',
  Unvaccinated: 'danger',
  Auditing: 'primary',
};

class SquareCard extends React.PureComponent<SquareCardProps, SquareCardState> {
  constructor(props: SquareCardProps) {
    super(props);
    this.state = {
      Squares: [],
      Comments: [],
      SquaresCount: 0,
      SquareProfile: null,

      Keyword: '',

      PageNumber: 1,
      PageSize: TABLE_PAGE_SIZE,

      SquareProfileVisible: false,
      CreateSquareVisible: false,
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
          this.SearchSquares();
        } else {
          this.ListSquareRecords();
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
        this.ListSquareRecords();
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
      CreateSquareVisible: true,
    });
  };
  public closeCreatePanel = () => {
    this.setState(
      {
        CreateSquareVisible: false,
      },
      () => {
        this.ListSquareRecords();
      },
    );
  };

  public ListSquareRecords = () => {
    const { Keyword, PageNumber, PageSize } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'square/ListSquares',
      payload: {
        pageNumber: PageNumber,
        pageSize: PageSize,
      },
    });
  };
  public SearchSquares = () => {
    const { Keyword, PageNumber, PageSize } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'square/SearchSquares',
      payload: {
        Keyword,
        pageNumber: PageNumber,
        pageSize: PageSize,
      },
    });
  };

  public gotoRecordProfile = (record: SquareRecord) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'square/GetSquareProfile',
      payload: {
        SquareId: record.essayId,
      },
    }).then((profile: SquareProfile | null) => {
      if (profile) {
        this.setState({
          SquareProfile: profile,
          SquareProfileVisible: true,
        });
      }
    });
  };

  public closeRecordProfile = () => {
    this.setState(
      {
        SquareProfile: null,
        SquareProfileVisible: false,
      },
      () => {
        this.ListSquareRecords();
      },
    );
  };

  public Removesquare = (essayId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'square/RemoveSquare',
      payload: {
        essayId,
      },
    }).then(() => {
      this.ListSquareRecords();
    });
  };

  static getDerivedStateFromProps(
    nextProps: SquareCardProps,
    prevState: SquareCardState,
  ) {
    const { SquareProps, CommentProps } = nextProps;
    if (SquareProps && CommentProps) {
      return {
        Squares: SquareProps?.data,
        SquaresCount: SquareProps.total,
        Comments: CommentProps,
      };
    }
    return null;
  }

  componentDidMount() {
    this.ListSquareRecords();
  }

  render() {
    const { intl, SquareModelLoading } = this.props;
    const {
      Keyword,
      Squares,
      Comments,
      SquaresCount,
      SquareProfile,
      PageNumber,
      PageSize,
      SquareProfileVisible,
      CreateSquareVisible,
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
                total={SquaresCount}
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
                {Squares &&
                  Squares.map((item: SquareRecord) => {
                    return (
                      <Col
                        span={20}
                        style={{ marginLeft: 60, marginBottom: 20 }}
                        key={item?.essayId}
                      >
                        <Card
                          title={item.title}
                          extra={
                            <Popconfirm
                              placement="top"
                              title="删除"
                              onConfirm={() => this.Removesquare(item.essayId)}
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

        {CreateSquareVisible && (
          <CreateSquarePanel
            visible={CreateSquareVisible}
            onClose={this.closeCreatePanel}
            // width={800}
          />
        )}

        <Drawer
          title="动态详情"
          visible={SquareProfileVisible}
          // visible={true}
          width={850}
          onClose={this.closeRecordProfile}
          destroyOnClose={true}
        >
          <SquareProfilePanel
            Comments={Comments ?? null}
            profile={SquareProfile ?? null}
            visible={SquareProfileVisible}
            onClose={this.closeRecordProfile}
          />
        </Drawer>
      </>
    );
  }
}

function mapStateToProps({ square, loading }: any) {
  return {
    SquareProps: square.Square,
    CommentProps: square.Comments,
    SquareLoading: loading.effects['square/ListSquares'],
    SquareModelLoading: loading.models.Square,
  };
}
const connectedSquareCard = connect(mapStateToProps)(SquareCard);
export default injectIntl<'intl', any>(connectedSquareCard);
