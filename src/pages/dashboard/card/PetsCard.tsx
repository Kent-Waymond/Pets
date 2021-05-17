import React, { useMemo } from 'react';
import Text from '@/components/text';
import { formatTimestamp } from '@/utils/date';
import { ScaleOption } from 'bizcharts/lib/interface';
import { BasicDashboardChartCard } from './BasicDashboardChartCard';
import { Link } from 'umi';
import { GET_IDENTITY } from '@/utils/auth';

interface IPetsCardProps {
  PetCount: number;
}

function TimeSecondsLabelFormatter(text: string) {
  return formatTimestamp(text, 'HH:mm:ss');
}

export function PetsCard(props: IPetsCardProps) {
  const { PetCount } = props;
  const currentUser = GET_IDENTITY();

  const lastestPetCount: number = useMemo(() => {
    return PetCount;
  }, [PetCount]);

  const scale: { [field: string]: ScaleOption } = {
    value: {
      type: 'linear',
      min: 0,
      nice: true,
      alias: '社区宠物数量',
    },
    time: {
      range: [0, 1],
      tickCount: 10,
      formatter: TimeSecondsLabelFormatter,
    },
  };

  return (
    <BasicDashboardChartCard
      // lastestPetCount ??
      chartData={52}
      type={'primary'}
      chartScale={scale}
      ChartTitle={
        <Text type="gray" block>
          社区宠物数量
        </Text>
      }
      ChartOverview={
        // 只有管理员可以跳转到所有宠物表页面
        <Link to={currentUser === 'admin' ? '/info' : '#'}>
          <h1 style={{ color: 'white' }}> {/* {lastestPetCount ?? 52} */}52</h1>
        </Link>
      }
    />
  );
}
