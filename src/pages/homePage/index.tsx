//TODO 退出旁边按钮  ---   直接到我的动态页面
// 类似萌宠圈那种展示，但不在页面导航上显示（我的投诉--若未处理，可修改  和我的动态 --- 不可修改）
import React, { useCallback, useState } from 'react';
import { AppRouteComponentProps } from '@/type';
import {
  PropertySafetyOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import Menu, { MenuItemType } from '@/components/menu';
import { NewRow } from '@/components/grid';
import { GET_IDENTITY } from '@/utils/auth';

function handleMenuClick(key: string, selected: string[], event: any) {
  const targetPath = `/homePage/${key}`;
  history.push(targetPath);
}

const MenuItems: MenuItemType[] = [
  {
    ItemKey: 'moment',
    title: '我的动态',
    icon: <DeploymentUnitOutlined className="icon-sm" />,
  },
  {
    ItemKey: 'myfeedback',
    title: '我的反馈',
    icon: <FileTextOutlined className="icon-sm" />,
  },
];
const PassByItems: any = [
  {
    ItemKey: 'myfeedback',
    title: '我的反馈',
    icon: <FileTextOutlined className="icon-sm" />,
  },
];

export default function (props: AppRouteComponentProps) {
  const { children } = props;
  const [currentKey, changeCurrentKey] = useState<string>('');
  const currentUser = GET_IDENTITY();

  const handleMenuClick = useCallback(
    (key: string, selected: string[], event: any) => {
      const targetPath = `/homePage/${key}`;
      history.push(targetPath);
      changeCurrentKey(key);
    },
    [],
  );
  console.log(currentUser, 'settings');

  console.log(currentUser === 'passby' ? 'PassByItems' : 'MenuItems');

  return (
    <NewRow flex={true} justify="stretch">
      <aside className="sider">
        <Menu
          items={currentUser === 'passby' ? PassByItems : MenuItems}
          onClick={handleMenuClick}
        />
      </aside>
      <div className="content">{children}</div>
    </NewRow>
  );
}
