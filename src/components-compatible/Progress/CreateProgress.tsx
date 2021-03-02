import { ProgressProps } from 'antd/lib/progress';
import { message, Progress, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useDispatch } from 'umi';
import styles from './form.less';

interface GetCreateProgressProps extends ProgressProps {
  id: string;
  title: any;
  dispatchType: string;
  InCreating: (creating: boolean) => void;
}

export default function CreateProgress(props: GetCreateProgressProps) {
  const { id, title, dispatchType, InCreating } = props;
  const dispatch = useDispatch<any>();

  const [progress, ChangeProgress] = useState<number>(1);
  const [barStatus, ChanggeBarStatus] = useState<
    'success' | 'normal' | 'exception' | 'active' | undefined
  >('normal');
  const [barColor, ChangeBarColor] = useState<string>('#093372');

  useEffect(() => {
    const textSuccess = (
      <FormattedMessage id="progress.message.success" defaultMessage="成功" />
    );
    const textFailed = (
      <FormattedMessage id="progress.message.fail" defaultMessage="失败" />
    );

    const timer = setInterval(async () => {
      const result = await dispatch({
        type: dispatchType,
        payload: {
          id,
        },
      });
      const changeStatus = (status: string) => {
        let messageInfo: any = null;
        if (status == 'exception') {
          ChanggeBarStatus('exception');
          ChangeBarColor('#ff4d4f');
          messageInfo = message.error(
            <>
              {title}
              {textFailed}
            </>,
          );
        } else {
          ChanggeBarStatus('success');
          ChangeBarColor('#52c41a');
          messageInfo = message.success(
            <>
              {title}
              {textSuccess}
            </>,
          );
        }
        setTimeout(() => {
          messageInfo();
          InCreating(false);
          dispatch({
            type: 'createrate/IdObjRemove',
            payload: {
              id: id,
            },
          });
        }, 2500);
      };
      if (result === null) {
        changeStatus('exception');
      }
      if (result) {
        ChangeProgress((prgs) => prgs + (result?.progress - prgs));
        if (result?.status != 'creating') {
          result?.status == 'failed'
            ? changeStatus('exception')
            : changeStatus('success');
        }
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [dispatch, InCreating, id, dispatchType, title]);

  return (
    <div className={styles.progressDiv}>
      <Progress
        type="dashboard"
        strokeColor={barColor}
        status={barStatus}
        percent={progress}
      />
      <Typography>
        <FormattedMessage id="host.create.current" defaultMessage="当前" />
        {title}
        <FormattedMessage
          id="host.create.progress"
          defaultMessage="进度：{progress}% "
          values={{ progress }}
        />
        &nbsp;&nbsp;
        <Spin size="small" />
      </Typography>
    </div>
  );
}
