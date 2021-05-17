import React, { useEffect, useState } from 'react';
import Text from '@/components/text';
import { formatTimestamp } from '@/utils/date';
import { ScaleOption } from 'bizcharts/lib/interface';
import { BasicDashboardChartCard } from './BasicDashboardChartCard';
import { Link } from 'umi';
import { GET_IDENTITY } from '@/utils/auth';

interface IVaccineCardProps {
  VaccinedCount: number;
  VaccineAllCount: number;
}

function TimeSecondsLabelFormatter(text: string) {
  return formatTimestamp(text, 'HH:mm:ss');
}

export function VaccineCard(props: IVaccineCardProps) {
  const { VaccinedCount, VaccineAllCount } = props;
  const currentUser = GET_IDENTITY();

  const [VaccinedRate, changeVaccinedRate] = useState<number>(0);
  useEffect(() => {
    if (VaccinedCount == 0) {
      return;
    }
    const Rate = (VaccinedCount / VaccineAllCount) * 100;
    changeVaccinedRate(Rate);
  }, [VaccinedCount, VaccineAllCount]);

  const scale: { [field: string]: ScaleOption } = {
    value: {
      type: 'linear',
      min: 0,
      nice: true,
      alias: '疫苗接种率',
    },
    time: {
      range: [0, 1],
      tickCount: 10,
      formatter: TimeSecondsLabelFormatter,
    },
  };

  return (
    <BasicDashboardChartCard
      chartData={30.8 + '%'}
      chartScale={scale}
      chartColor={'#8950fc'}
      ChartTitle={
        <Text type="gray" block>
          疫苗接种率
        </Text>
      }
      ChartOverview={
        <Link to={currentUser === 'admin' ? '/vaccine' : '#'}>
          {/* {VaccinedRate ?? 30.8 + '%'} */}
          <h1 style={{ color: 'gray' }}> {30.8 + '%'}</h1>
        </Link>
      }
    />
  );
}
