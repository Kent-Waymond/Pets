import React, { useEffect, useMemo, useState } from 'react';
import { AppRouteComponentProps } from '@/type';
import { Col, Row } from 'antd';
import { PetsCard } from './card/PetsCard';
import { VaccineCard } from './card/VaccineCard';
import { DashboardPetCard } from './card/DashboardPetCard';
import { DashboardVaccineCard } from './card/DashboardVaccineCard';
import Avatar from '@/components/avatar';
import { NoticeCard } from './card/NoticeCard';
import { useDispatch, useSelector } from 'umi';
import moment from 'moment';

// 刷新页面请求
function refreshDashboardData(dispatch: any) {
  dispatch({
    type: 'dashboard/ListNoticeRecords',
  });
  dispatch({
    type: 'dashboard/GetAllDataForDashboard',
  });
  intervalGetDashboardData(dispatch);
}

// 定时轮询请求
function intervalGetDashboardData(dispatch: any) {
  dispatch({
    type: 'dashboard/GetAllDataForDashboard',
  });
  dispatch({
    type: 'dashboard/ListNoticeRecords',
  });
}
export default function (props: AppRouteComponentProps) {
  const dispatch = useDispatch();
  let PetTotalCount: number = 0;
  let VaccinedCount: number = 0;
  let NeedVaccineCount: number = 0;
  let AllData: any;

  const AllDataForDashboard: any = useSelector(
    (state: any) => state.dashboard.AllDataForDashboard,
  );

  const NoticeRecord: any = useSelector(
    (state: any) => state.dashboard.NoticeRecord,
  );
  console.log(NoticeRecord, 'NoticeRecord');

  const NoticeRecordLoading: boolean = useSelector(
    (state: any) => state.loading.effects['dashboard/ListNoticeRecords'],
  );

  useEffect(() => {
    refreshDashboardData(dispatch);
    const Timer = setInterval(() => {
      intervalGetDashboardData(dispatch);
    }, 60000);
    return () => {
      clearInterval(Timer);
    };
  }, [dispatch]);

  if (AllDataForDashboard) {
    AllData = AllDataForDashboard?.data?.data;
    if (AllData) {
      let petObj: any = {};
      AllData.forEach((item: any) => {
        PetTotalCount += item.pets;
        VaccinedCount += item.counts;
        NeedVaccineCount += item.pets * item.vaccines;
      });
      // console.log(PetTotalCount, 'PetTotalCount')
      // console.log(VaccinedCount, 'VaccinedCount')
      // console.log(NeedVaccineCount, 'NeedVaccineCount')

      //
      // VaccinedRecord = AllData.map((item: any) => {
      // let vaccinedObj: any = {}
      //   return vaccinedObj[item.petSpecies] = item.counts
      // })
      // console.log(VaccinedRecord, 'VaccinedRecord')
    }
  }

  return (
    <>
      <div className="row-lg" style={{ margin: '0 auto' }}>
        {/* 公告 */}
        <NoticeCard
          records={NoticeRecord}
          loading={NoticeRecordLoading}
          refresh={refreshDashboardData}
        />
      </div>
      <Row gutter={24} className="row-lg" style={{ marginTop: 20 }}>
        <Col span={3}></Col>
        <Col span={4}>
          {/* 宠物数量 */}
          <div className="row-lg">
            <PetsCard PetCount={PetTotalCount} />
          </div>
          {/* 接种率 */}
          <div className="row-lg">
            <VaccineCard
              VaccinedCount={VaccinedCount}
              VaccineAllCount={NeedVaccineCount}
            />
          </div>
        </Col>
        <Col span={14}>
          {/* 宠物总览 */}
          <DashboardPetCard
            type="pets"
            PetStatistic={AllData}
            PetCount={PetTotalCount}
          />
        </Col>
        <Col span={3}></Col>
      </Row>

      <div className="row-lg">
        {/* 接种总览 */}
        <DashboardVaccineCard
          type="vaccine"
          VaccineStatistic={AllData}
          VaccinedCount={VaccinedCount}
        />
      </div>
    </>
  );
}
