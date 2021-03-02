import React, { useMemo } from 'react';
import Card, {
  CardBody,
  CardChart,
  CardHeader,
  CardRow,
} from '@/components/card';
import { Chart, Area, Line, Tooltip, Axis, Interval } from 'bizcharts';
import Text from '@/components/text';
import Progress from '@/components/progress';
import { IDashboardStorageStatistic } from '../type';
import { FormattedMessage, useIntl } from 'umi';
import { formatByteSize } from '@/utils/size';
import { defineMessages, MessageDescriptor } from 'react-intl';
import { formatStringTime, formatTimestamp } from '@/utils/date';
import { parseLicenseRemainDaysToCommonState } from '@/utils/string';

interface IDashboardStorageCardProps {
  StorageStatistic: IDashboardStorageStatistic | null;
}

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  UsedStorage: {
    id: 'dashboard.table.UsedStorage',
    defaultMessage: '已使用存储',
  },
});

const DefaultStorageStatistic: IDashboardStorageStatistic = {
  total: 0,
  used: 0,
  avg: 0,
  predictDays: 0,
  free: 0,
  stats: [],
};

function DateLabelFormatter(text: string) {
  return formatStringTime(text, 'HH:mm:ss');
}

export function DashboardStorageCard(props: IDashboardStorageCardProps) {
  const { StorageStatistic } = props;

  const DisplayStorageStatistic = {
    ...DefaultStorageStatistic,
    ...StorageStatistic,
  };

  const {
    total,
    used,
    avg,
    predictDays,
    free,
    stats,
  } = DisplayStorageStatistic;

  const percent = useMemo(() => {
    let res = 0;
    if (typeof total === 'number' && typeof used === 'number' && total > 0) {
      res = Number(Number(used / total).toFixed(2));
      res = res === 0 && used > 0 ? 1 : res;
    }
    return res;
  }, [total, used]);

  const intl = useIntl();

  const scale = {
    size: {
      min: 0,
      nice: true,
      formatter: formatByteSize,
      alias: intl.formatMessage(intlMessages.UsedStorage),
    },
    date: {
      range: [0, 0.95],
      // formatter: DateLabelFormatter,
    },
  };

  return (
    <Card height={300} flexbox>
      <CardHeader
        title={
          <FormattedMessage
            id="dashboard.text.StorageSpace"
            defaultMessage="存储空间"
          />
        }
        headerClassNames={['bg-success']}
      />
      <CardChart chartClassNames={['bg-success']}>
        <Chart scale={scale} padding={[0, 0, 0, 0]} data={stats} autoFit>
          <Tooltip shared />
          <Axis name="date" visible={false} />
          <Axis name="size" visible={false} />
          <Interval
            position="date*size"
            size={8}
            color="rgba(255, 255, 255, 0.85)"
          />
        </Chart>
      </CardChart>
      <CardBody>
        <CardRow>
          <div>
            <Text type="gray" block>
              <FormattedMessage
                id="dashboard.text.TotalCount"
                defaultMessage="总计"
              />
            </Text>
            <Text block>{formatByteSize(total)}</Text>
          </div>

          <div>
            <Text type="gray" block>
              <FormattedMessage
                id="dashboard.text.Used"
                defaultMessage="已用"
              />
            </Text>
            <Text block>{formatByteSize(used)}</Text>
          </div>

          <div>
            <Text type="gray" block>
              <FormattedMessage
                id="dashboard.text.Available"
                defaultMessage="可用"
              />
            </Text>
            <Text block>{formatByteSize(free)}</Text>
          </div>
          <div>
            <Text type="gray" block>
              <FormattedMessage
                id="dashboard.text.DailyAverage"
                defaultMessage="平均每日"
              />
            </Text>
            <Text block>{formatByteSize(avg)}</Text>
          </div>

          <div>
            <Text type="gray" block>
              <FormattedMessage
                id="dashboard.text.ExpectedPlanUse"
                defaultMessage="预计使用"
              />
            </Text>
            <Text type={parseLicenseRemainDaysToCommonState(predictDays)} block>
              {predictDays > 365 ? `365+` : predictDays}
              <FormattedMessage id="dashboard.text.Days" defaultMessage="天" />
            </Text>
          </div>
        </CardRow>
        <CardRow>
          <Progress status="success" percent={percent} showInfo={false} />
        </CardRow>
      </CardBody>
    </Card>
  );
}
