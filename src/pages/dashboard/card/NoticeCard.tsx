import React, { useState } from 'react';
import { INoticeRecord } from '../type';
import Card, { CardBody, CardHeader } from '@/components/card';
import NewNoticePanel from '../profile/NewNoticePanel';
import { Carousel, Button, Image, Typography } from 'antd';
import { GET_IDENTITY } from '@/utils/auth';
import NoticeProfilePanel from '../profile/NoticeProfilePanel';
import { useDispatch } from 'umi';
const { Link } = Typography;

export interface INoticeCardProps {
  records: INoticeRecord[];
  loading: boolean;
  refresh: (dispatch: any) => void;
}
const contentStyle: any = {
  height: '300px',
  color: '#fff',
  lineHeight: '300px',
  textAlign: 'center',
  margin: '0 auto',
  background: '#AFEAAA',
};
export function NoticeCard(props: INoticeCardProps) {
  const currentUser = GET_IDENTITY();
  const dispatch: any = useDispatch();

  const { records, loading, refresh } = props;
  const [NewNoticeVisible, ChangeNewNoticeVisible] = useState<boolean>(false);
  const [NoticeProfileVisible, ChangeNoticeProfileVisible] = useState<boolean>(
    false,
  );
  const [NoticeProfile, ChangeNoticeProfile] = useState<any>({});

  const OpenNewNotice = () => {
    ChangeNewNoticeVisible(true);
  };
  const CloseNewNotice = () => {
    ChangeNewNoticeVisible(false);
    refresh(dispatch);
  };

  const OpenNoticeProfilePanel = (noticeId: string) => {
    if (noticeId) {
      ChangeNoticeProfileVisible(true);
      dispatch({
        type: 'dashboard/GetNoticeProfile',
        payload: {
          noticeId: noticeId,
        },
      }).then((res: any) => {
        ChangeNoticeProfile(res);
      });
    }
  };

  const CloseNoticeProfilePanel = () => {
    ChangeNoticeProfileVisible(false);
  };
  return (
    <>
      <Card flexbox>
        <CardHeader
          title="公告"
          action={
            currentUser === 'admin' ? (
              <Button type="primary" onClick={OpenNewNotice}>
                发布公告
              </Button>
            ) : (
              <></>
            )
          }
        />
        <CardBody overflow>
          <Carousel autoplay dotPosition="left">
            {records &&
              records.map((record: INoticeRecord) => {
                return (
                  <div>
                    <Link
                      onClick={() => OpenNoticeProfilePanel(record?.noticeId)}
                      style={{ color: '#39BAE8' }}
                    >
                      公告名称：{record?.title}
                    </Link>
                    <br />
                    <Image
                      // width={1200}
                      height={100}
                      src={record.firstPicture}
                      // src={`http://119.3.249.45:7070/file/image/${record.firstPicture}`}
                    />
                  </div>
                );
              })}
            {/* 
            <div>
              <div style={contentStyle}>2</div>
            </div>
            <div>
              <div style={contentStyle}>3</div>
            </div>
            <div>
              <div style={contentStyle}>4</div>
            </div> */}
          </Carousel>
        </CardBody>
      </Card>
      <NewNoticePanel visible={NewNoticeVisible} onClose={CloseNewNotice} />
      {NoticeProfile && (
        <NoticeProfilePanel
          refresh={refresh}
          profile={NoticeProfile}
          currentUser={currentUser}
          visible={NoticeProfileVisible}
          onClose={CloseNoticeProfilePanel}
        />
      )}
    </>
  );
}
