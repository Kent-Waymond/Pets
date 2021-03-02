import { Avatar, List, Progress } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useDispatch } from 'umi';

interface BellItemProps {
  item: any;
}

export default function BellItem(props: BellItemProps) {
  const { item } = props;
  const name = item.name;
  const dispatch = useDispatch<any>();
  const [barStatus, ChangeBarStatus] = useState<
    'active' | 'exception' | 'success'
  >('active');
  const [Percents, ChangePercent] = useState<number>(1);

  useEffect(() => {
    const timer = setInterval(async () => {
      const result = await dispatch({
        type: item.type,
        payload: {
          id: item.id,
        },
      });
      const changeBar = (status: 'active' | 'exception' | 'success') => {
        ChangeBarStatus(status);
        setTimeout(() => {
          dispatch({
            type: 'createrate/IdObjRemove',
            payload: {
              id: item.id,
            },
          });
        }, 2000);
      };
      // 询问进度报错，先改变状态，后面删除进度显示条
      if (result === null || result?.status == 'failed') {
        changeBar('exception');
      }
      // 创建错误，或创建成功，删除创建中状态
      if (result?.progress >= 100) {
        changeBar('success');
      }
      // 进度有更新就更新共享的状态
      if (result?.progress >= Percents) {
        ChangePercent(result?.progress);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [item, dispatch, Percents]);

  return (
    <List.Item>
      <List.Item.Meta
        avatar={
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        }
        title={
          item.type[0] == 'i' ? (
            <FormattedMessage
              id="bell.created.instance"
              defaultMessage="创建实例：{name}"
              values={{ name }}
            />
          ) : (
            <FormattedMessage
              id="bell.created.node"
              defaultMessage="创建节点：{name}"
              values={{ name }}
            />
          )
        }
        description={<Progress percent={Percents} status={barStatus} />}
      />
    </List.Item>
  );
}
