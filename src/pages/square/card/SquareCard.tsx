import React from 'react';
import { connect, FormattedMessage } from 'umi';
import { defineMessages, injectIntl, IntlShape } from 'react-intl';
import { IBHRawListDataRecord } from '@/type';
import { SquareProfile, SquareRecord } from '../type';
import {
  CaretRightOutlined,
  RedoOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { SquareProfilePanel } from '../profile/SquareProfilePanel';
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
import CreateSquarePanel from '../form/CreateSquarePanel';
import Pagination from '@/components/pagination';
import { TABLE_PAGE_SIZE } from '@/variable';
const { Meta } = Card;

interface SquareCardProps {
  intl: IntlShape;
  Square: IBHRawListDataRecord<SquareRecord>;
  SquareLoading: boolean;
  SquareModelLoading: boolean;
  dispatch: any;
}

interface SquareCardState {
  Squares: SquareRecord[];
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
      SquaresCount: 0,
      SquareProfile: null,

      Keyword: '',

      PageNumber: 1,
      PageSize: TABLE_PAGE_SIZE,

      SquareProfileVisible: false,
      CreateSquareVisible: false,
    };
  }

  static getDerivedStateFromProps(
    nextProps: SquareCardProps,
    prevState: SquareCardState,
  ) {
    const { Square } = nextProps;
    if (Square && Square['Squares'] instanceof Array) {
      return {
        Squares: Square['Squares'],
        SquaresCount: Square.count,
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
          this.SearchSquares();
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
      CreateSquareVisible: true,
    });
  };
  public closeCreatePanel = () => {
    this.setState(
      {
        CreateSquareVisible: false,
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
        SquareId: record.essay_id,
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
        this.ListRecords();
      },
    );
  };

  public Removesquare = (record: SquareRecord) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'square/RemoveSquares',
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
    const { intl, SquareModelLoading } = this.props;
    const {
      Keyword,
      Squares,
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
                <Col span={2}></Col>
                <Col span={5}>
                  <Card
                    hoverable
                    bordered={true}
                    style={{ width: 200, height: 300 }}
                    cover={
                      <img
                        alt="example"
                        src="https://i.loli.net/2021/03/11/DxuUI2VhK5RqBba.png"
                        width="200"
                        height="250"
                      />
                    }
                  >
                    <Meta title="英短领养" description="自家产崽..." />
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
                        src="https://i.loli.net/2021/03/11/gExs7z9irBpcVjk.png"
                        width="200"
                        height="250"
                      />
                    }
                  >
                    <Meta title="英短配对" description="纯种英短寻配偶..." />
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
                        src="https://i.loli.net/2021/03/11/FxB95vrtCLPTIZ2.png"
                        width="200"
                        height="250"
                      />
                    }
                  >
                    <Meta title="寻物启事" description="猫咪走失...." />
                  </Card>
                </Col>
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
    Square: square.Square,
    SquareLoading: loading.effects['square/ListSquares'],
    SquareModelLoading: loading.models.Square,
  };
}
const connectedSquareCard = connect(mapStateToProps)(SquareCard);
export default injectIntl<'intl', any>(connectedSquareCard);
