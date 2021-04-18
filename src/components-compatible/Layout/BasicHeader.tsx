import React, { useState } from 'react';
import { useDispatch, useHistory, useSelector, FormattedMessage } from 'umi';
import { Badge, Modal, Typography } from 'antd';
import { BasicAppMenu } from './BasicAppMenu';
import BellPop from '../Bell/BellPop';
import { IconTasks, IconSignOut } from '@/components-compatible/Icons';
import { HomeTwoTone } from '@ant-design/icons';
import { GET_IDENTITY, REMOVE_IDENTITY } from '@/utils/auth';

const { Title } = Typography;

export default function BasicHeader(props: any) {
  const { route } = props;
  const dispatch = useDispatch<any>();
  const history = useHistory();

  const [bellPopVisible, ChangeBellPopVisible] = useState<boolean>(false);

  const BellCount = useSelector(
    (state: any) => state.createrate.createObjIds.length,
  );

  function handleLogout() {
    Modal.confirm({
      title: '您确认退出吗？',
      cancelText: '取消',
      okText: '确定',
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'account/Logout',
        }).then((result: boolean) => {
          if (result) {
            REMOVE_IDENTITY();
            history.push('/login');
          }
        });
      },
    });
  }

  function handleBellPop() {
    ChangeBellPopVisible(!bellPopVisible);
  }

  function closeBellPop() {
    ChangeBellPopVisible(false);
  }
  const CurrentMenu = () => {
    const currentUser = GET_IDENTITY(); //   从localStorage中获取当前用户
    if (currentUser === 'admin') {
      return <BasicAppMenu route={route} currentAuthority={'admin'} />;
    } else if (currentUser === 'petMaster') {
      return <BasicAppMenu route={route} currentAuthority={'petMaster'} />;
    } else {
      return <BasicAppMenu route={route} currentAuthority={'passby'} />;
    }
  };
  return (
    <>
      <div className="ami-brand">
        <Title level={3}>
          <HomeTwoTone twoToneColor="#ffb549" />
          &nbsp;&nbsp;爱宠云社区
        </Title>
      </div>
      {/* 通过currentAuthority来控制展示的组件 */}
      {CurrentMenu()}

      <div className="ami-toolbar space-sm">
        <button
          className="btn btn-icon btn-icon-lg btn-transparent"
          onClick={handleBellPop}
        >
          <Badge count={BellCount} size="small">
            <IconTasks />
          </Badge>
        </button>
        <button className="btn btn-icon btn-transparent" onClick={handleLogout}>
          <IconSignOut />
        </button>
      </div>
      <BellPop visible={bellPopVisible} onCancel={closeBellPop} />
    </>
  );
}
