import React from 'react';
import { connect, FormattedMessage } from 'umi';
import { defineMessages, injectIntl, IntlShape } from 'react-intl';
import { IBHRawListDataRecord } from '@/type';
import { VaccineProfile, VaccineRecord } from '../type';
import Button from '@/components/button';
import NewCard, { CardBody, CardHeader } from '@/components/card';
import { Card, Col, Row } from 'antd';

import { TABLE_PAGE_SIZE } from '@/variable';
const { Meta } = Card;

interface AuditVaccineCardProps {
  intl: IntlShape;
  AuditVaccineProps: IBHRawListDataRecord<VaccineRecord>;
  AuditVaccineLoading: boolean;
  dispatch: any;
}

interface AuditVaccineCardState {
  AuditVaccines: VaccineRecord[];
  AuditVaccinesCount: number;

  VaccineProfile: VaccineProfile | null;

  Keyword: string;
  PageNumber: number;
  PageSize: number;

  VaccineProfileVisible: boolean;
  CreateVaccineVisible: boolean;
}

const stateMap: any = {
  Vaccinated: 'success',
  Unvaccinated: 'danger',
  Auditing: 'primary',
};

class AuditVaccineCard extends React.PureComponent<
  AuditVaccineCardProps,
  AuditVaccineCardState
> {
  constructor(props: AuditVaccineCardProps) {
    super(props);
    this.state = {
      AuditVaccines: [],
      AuditVaccinesCount: 0,
      VaccineProfile: null,

      Keyword: '',

      PageNumber: 1,
      PageSize: TABLE_PAGE_SIZE,

      VaccineProfileVisible: false,
      CreateVaccineVisible: false,
    };
  }

  static getDerivedStateFromProps(
    nextProps: AuditVaccineCardProps,
    prevState: AuditVaccineCardState,
  ) {
    const { AuditVaccineProps } = nextProps;
    if (AuditVaccineProps) {
      return {
        AuditVaccines: AuditVaccineProps,
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
        this.ListAuditRecords();
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
        this.ListAuditRecords();
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

  public ListAuditRecords = () => {
    const { Keyword, PageNumber, PageSize } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'vaccine/ListAuditVaccines',
      payload: {
        Keyword,
        PageNumber,
        PageSize,
      },
    }).then((count: number) => {
      this.setState({
        AuditVaccinesCount: count,
      });
    });
  };

  public gotoRecordProfile = (record: VaccineRecord) => {};

  public closeRecordProfile = () => {
    this.setState(
      {
        VaccineProfile: null,
        VaccineProfileVisible: false,
      },
      () => {
        this.ListAuditRecords();
      },
    );
  };

  public AuditVaccineSuccess = (vaccineId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'vaccine/AuditVaccine',
      payload: {
        id: vaccineId,
        status: 1,
      },
    }).then(() => {
      this.ListAuditRecords();
    });
  };

  public AuditVaccineFail = (vaccineId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'vaccine/AuditVaccine',
      payload: {
        id: vaccineId,
        status: 0,
      },
    }).then(() => {
      this.ListAuditRecords();
    });
  };

  componentDidMount() {
    this.ListAuditRecords();
  }

  render() {
    const { intl } = this.props;
    const { AuditVaccines, AuditVaccinesCount } = this.state;
    console.log(AuditVaccines, 'AuditVaccines');
    return (
      <>
        <div style={{ marginTop: 30, marginLeft: 20, minWidth: 800 }}></div>
        <NewCard>
          <CardHeader title="疫苗审查" />
          <CardBody>
            <div className="site-card-wrapper">
              <Row gutter={24} style={{ marginLeft: 80 }}>
                <Col span={10}>
                  <Card
                    hoverable
                    bordered={true}
                    style={{ marginBottom: 10 }}
                    cover={
                      <img
                        alt="example"
                        src="https://tiebapic.baidu.com/forum/pic/item/d788d43f8794a4c2eb10f66519f41bd5ad6e3948.jpg"
                        width="200"
                        height="250"
                      />
                    }
                    actions={[
                      <Button
                        type="danger"
                        onClick={() => this.AuditVaccineFail('id')}
                      >
                        驳回
                      </Button>,
                      <Button
                        type="success"
                        onClick={() => this.AuditVaccineSuccess('id')}
                      >
                        通过
                      </Button>,
                    ]}
                  >
                    <Meta
                      title="宠物医院推荐"
                      description="证书齐全、细致..."
                    />
                  </Card>
                </Col>
                <Col span={1}></Col>
              </Row>
            </div>
          </CardBody>
        </NewCard>
      </>
    );
  }
}

function mapStateToProps({ vaccine, loading }: any) {
  return {
    AuditVaccineProps: vaccine.AuditVaccine,
    AuditVaccineLoading: loading.effects['vaccine/ListAuditVaccines'],
  };
}
const connectedAuditVaccineCard = connect(mapStateToProps)(AuditVaccineCard);
export default injectIntl<'intl', any>(connectedAuditVaccineCard);
