import React, { useEffect, useMemo, useState } from 'react';
import { AppRouteComponentProps, IPlatformLicenseRecord } from '@/type';
import { Col, Row } from 'antd';
import { DashboardCPUCard } from './card/DashboardCPUCard';
import { DashboardMEMCard } from './card/DashboardMEMCard';
import { DashboardStorageCard } from './card/DashboardStorageCard';
import { ProductLicenseInfo } from './card/DashboardLicenseCard';
import { DashboardLicenseCard } from './card/DashboardLicenseCard';
import Avatar from '@/components/avatar';
import {
  SecurityScanTwoTone,
  RocketTwoTone,
  CrownTwoTone,
} from '@ant-design/icons';
import { DashboardNodeTableCard } from './table/DashboardNodeTableCard';
import { DashboardInstanceTableCard } from './table/DashboardInstanceTableCard';
import { useDispatch, useSelector } from 'umi';
import {
  IDashboardInstanceRecord,
  IDashboardNodeRecord,
  IDashboardRecordStatisticType,
  IDashboardStorageStatistic,
} from './type.d';
import moment from 'moment';

// 刷新页面请求
function refreshDashboardData(dispatch: any) {
  dispatch({
    type: 'dashboard/GetPlatformStorageStatistic',
    payload: {
      startTime: moment().subtract(14, 'days').startOf('day').unix(),
    },
  });
  dispatch({
    type: 'global/ListPlatformLicenses',
  });
  dispatch({
    type: 'dashboard/ListDashboardInstanceRecords',
  });
  dispatch({
    type: 'dashboard/ListDashboardNodeRecords',
  });
  intervalGetDashboardData(dispatch);
}

// 定时轮询请求
function intervalGetDashboardData(dispatch: any) {
  dispatch({
    type: 'dashboard/ListDashboardPlatformStatisticRecords',
  });
}
export default function (props: AppRouteComponentProps) {
  const dispatch = useDispatch();

  const NodeRecords: IDashboardNodeRecord[] = useSelector(
    (state: any) => state.dashboard.DashboardNodeRecords,
  );
  const InstanceRecords: IDashboardInstanceRecord[] = useSelector(
    (state: any) => state.dashboard.DashboardInstanceRecords,
  );
  const StorageStatistic: IDashboardStorageStatistic = useSelector(
    (state: any) => state.dashboard.DashboardStorageStatistic,
  );
  const PlatformStatisticRecords: IDashboardRecordStatisticType[] = useSelector(
    (state: any) => state.dashboard.DashboardPlatformStatisticRecords,
  );
  const PlatformLicenses: IPlatformLicenseRecord[] = useSelector(
    (state: any) => state.global.PlatformLicenses,
  );

  const NodeRecordLoading: boolean = useSelector(
    (state: any) => state.loading.effects['dashboard/ListDashboardNodeRecords'],
  );
  const InstanceRecordLoading: boolean = useSelector(
    (state: any) =>
      state.loading.effects['dashboard/ListDashboardInstanceRecords'],
  );

  // console.log("------- node ----------")
  // console.log("NodeRecords ", NodeRecords)

  // console.log("------- instance ----------")
  // console.log("PlatformLicenses ", PlatformLicenses)

  useEffect(() => {
    refreshDashboardData(dispatch);
    const Timer = setInterval(() => {
      intervalGetDashboardData(dispatch);
    }, 10000);
    return () => {
      clearInterval(Timer);
    };
  }, [dispatch]);

  const IncrementRecord = useMemo(() => {
    if (PlatformStatisticRecords.length > 0) {
      const CPURecords = PlatformStatisticRecords.map(
        (record: IDashboardRecordStatisticType) => {
          return {
            time: record.StatisticTime,
            value: record.CPUPercent,
          };
        },
      ).reverse();

      const MEMRecords = PlatformStatisticRecords.map(
        (record: IDashboardRecordStatisticType) => {
          return {
            time: record.StatisticTime,
            value: record.MEMUsed,
          };
        },
      ).reverse();

      return {
        CPURecords,
        MEMRecords,
      };
    }
    return {
      CPURecords: [],
      MEMRecords: [],
    };
  }, [PlatformStatisticRecords]);
  // console.log("IncrementRecord ", IncrementRecord)
  return (
    <>
      <Row gutter={24} className="row-lg">
        <Col span={6}>
          <div className="row-lg">
            <DashboardCPUCard IncrementRecords={IncrementRecord.CPURecords} />
          </div>
          <div className="row-lg">
            <DashboardMEMCard IncrementRecords={IncrementRecord.MEMRecords} />
          </div>
        </Col>
        <Col span={12}>
          <DashboardStorageCard StorageStatistic={StorageStatistic} />
        </Col>
        <Col span={6}>
          <DashboardLicenseCard PlatformLicenses={PlatformLicenses} />
        </Col>
      </Row>
      <div className="row-lg">
        <DashboardNodeTableCard
          records={NodeRecords}
          loading={NodeRecordLoading}
        />
      </div>
      <div className="row-lg">
        <DashboardInstanceTableCard
          records={InstanceRecords}
          loading={InstanceRecordLoading}
        />
      </div>
    </>
  );
}
