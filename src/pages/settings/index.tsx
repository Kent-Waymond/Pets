import React, { useCallback, useState } from 'react';
import { AppRouteComponentProps } from '@/type';
import {
  InstagramOutlined,
  PropertySafetyOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import Menu, { MenuItemType } from '@/components/menu';
import { NewRow } from '@/components/grid';
import { GET_IDENTITY } from '@/utils/auth';

function handleMenuClick(key: string, selected: string[], event: any) {
  const targetPath = `/settings/${key}`;
  history.push(targetPath);
}

const MenuItems: MenuItemType[] = [
  {
    ItemKey: 'community',
    title: '萌宠社区',
    icon: <PropertySafetyOutlined className="icon-sm" />,
  },
  {
    ItemKey: 'square',
    title: '萌宠广场',
    icon: <DeploymentUnitOutlined className="icon-sm" />,
  },
  {
    ItemKey: 'feedback',
    title: '投诉与建议',
    icon: <FileTextOutlined className="icon-sm" />,
  },
  {
    ItemKey: 'myfeedback',
    title: '我的反馈',
    icon: <FormOutlined className="icon-sm" />,
  },
  {
    ItemKey: 'moment',
    title: '我的动态',
    icon: <InstagramOutlined className="icon-sm" />,
  },
];
const PassByItems: any = [
  {
    ItemKey: 'feedback',
    title: '投诉与建议',
    icon: <FileTextOutlined className="icon-sm" />,
  },
];

export default function (props: AppRouteComponentProps) {
  const { children } = props;
  const [currentKey, changeCurrentKey] = useState<string>('');
  const currentUser = GET_IDENTITY();

  const handleMenuClick = useCallback(
    (key: string, selected: string[], event: any) => {
      const targetPath = `/settings/${key}`;
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
