import React from 'react';
import Card, {
  CardBody,
  CardChart,
  CardHeader,
  CardRow,
} from '@/components/card';
import { Chart, Tooltip, Axis, Interval } from 'bizcharts';
import Text from '@/components/text';
import { useIntl, history } from 'umi';
import { Link } from 'umi';
import { GET_IDENTITY } from '@/utils/auth';
interface IDashboardPetCardProps {
  PetStatistic: any;
  PetCount: number;
  type: 'pets' | 'vaccine';
}

const DefaultPetStatistic: any = {
  total: 52,
  dog: 19,
  cat: 28,
  mice: 2,
  eagle: 1,
  reptiles: 2, // 爬行动物
};

export function DashboardPetCard(props: IDashboardPetCardProps) {
  const { PetStatistic, type, PetCount } = props;
  const currentUser = GET_IDENTITY();
  const record = [];
  let objALL = { type: '总计', number: PetCount };
  record.push(objALL);
  let Statistic: any = {
    total: 0,
    dog: 0,
    cat: 0,
    mice: 0,
    eagle: 0,
    reptiles: 0,
  };
  Statistic.total = PetCount;

  if (PetStatistic) {
    PetStatistic.forEach((item: any) => {
      let obj = { type: '', number: 0 };
      obj.type = item.petSpecies;
      obj.number = item.pets;
      record.push(obj);
      if (item.petSpecies === '汪星人') {
        Statistic.dog = item.pets;
      } else if (item.petSpecies === '喵星人') {
        Statistic.cat = item.pets;
      } else if (item.petSpecies === '啮齿动物') {
        Statistic.mice = item.pets;
      } else if (item.petSpecies === '猛禽') {
        Statistic.eagle = item.pets;
      } else if (item.petSpecies === '爬行动物') {
        Statistic.reptiles = item.pets;
      }
    });
  }

  const DisplayPetStatistic = {
    ...DefaultPetStatistic,
    ...Statistic,
  };

  const { total, dog, cat, mice, eagle, reptiles } = DisplayPetStatistic;

  const intl = useIntl();

  const scale = {
    size: {
      min: 0,
      nice: true,
      alias: '社区宠物总览',
    },
    date: {
      range: [0, 0.95],
      // formatter: DateLabelFormatter,
    },
  };
  const data = [
    { type: '总计', number: 52 },
    { type: '汪星人', number: 19 },
    { type: '喵星人', number: 28 },
    { type: '啮齿动物', number: 2 },
    { type: '猛禽', number: 1 },
    { type: '爬行动物', number: 2 },
  ];

  const handleClickTitle = (keyword: string) => {
    if (currentUser === 'admin') {
      history.push({
        pathname: '/info',
        query: {
          keyword: keyword,
        },
      });
    }
  };

  return (
    <Card height={300} flexbox>
      <CardHeader title="社区宠物总览" headerClassNames={['bg-success']} />
      <CardChart chartClassNames={['bg-success']}>
        <Chart scale={scale} padding={[0, 0, 0, 0]} data={data} autoFit>
          <Tooltip shared />
          <Axis name="type" visible={false} />
          <Axis name="number" visible={false} />
          <Interval
            position="type*number"
            size={8}
            color="rgba(255, 255, 255, 0.85)"
          />
        </Chart>
      </CardChart>
      <CardBody>
        <CardRow>
          <div>
            <Link to={currentUser === 'admin' ? '/info' : '#'}>
              <Text type="gray" block>
                总计
              </Text>
              <Text block underline>
                52
              </Text>
            </Link>
          </div>

          <div onClick={() => handleClickTitle('汪星人')}>
            <Text type="gray" block>
              汪星人
            </Text>
            {/* {dog} */}
            <Text block underline>
              19
            </Text>
          </div>
          <div onClick={() => handleClickTitle('喵星人')}>
            <Text type="gray" block>
              喵星人
            </Text>
            <Text block underline>
              28
            </Text>
          </div>
          <div onClick={() => handleClickTitle('啮齿动物')}>
            <Text type="gray" block>
              啮齿动物
            </Text>
            <Text block underline>
              2
            </Text>
          </div>
          <div onClick={() => handleClickTitle('猛禽')}>
            <Text type="gray" block>
              猛禽
            </Text>
            <Text block underline>
              1
            </Text>
          </div>
          <div onClick={() => handleClickTitle('爬行动物')}>
            <Text type="gray" block>
              爬行动物
            </Text>
            <Text block underline>
              2{/* {mice > 365 ? `365+` : mice} */}
            </Text>
          </div>
        </CardRow>
      </CardBody>
    </Card>
  );
}