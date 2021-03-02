import React, { useCallback, useState } from 'react';
import { AppRouteComponentProps } from '@/type';
import {
  PropertySafetyOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { FormattedMessage, history } from 'umi';
import Menu, { MenuItemType } from '@/components/menu';
import { Row } from '@/components/grid';
import Card, { CardBody, CardHeader } from '@/components/card';

function handleMenuClick(key: string, selected: string[], event: any) {
  const targetPath = `/settings/${key}`;
  history.push(targetPath);
}

const MenuItems: MenuItemType[] = [
  {
    ItemKey: 'license',
    title: (
      <FormattedMessage id="settings.menu.licese" defaultMessage="许可管理" />
    ),
    icon: <PropertySafetyOutlined className="icon-sm" />,
  },
  {
    ItemKey: 'network',
    title: (
      <FormattedMessage id="settings.menu.network" defaultMessage="网络管理" />
    ),
    icon: <DeploymentUnitOutlined className="icon-sm" />,
  },
  {
    ItemKey: 'log',
    title: (
      <FormattedMessage id="settings.menu.log" defaultMessage="操作日志" />
    ),
    icon: <FileTextOutlined className="icon-sm" />,
  },
];

export default function (props: AppRouteComponentProps) {
  const { children } = props;
  const [currentKey, changeCurrentKey] = useState<string>('');

  const handleMenuClick = useCallback(
    (key: string, selected: string[], event: any) => {
      const targetPath = `/settings/${key}`;
      history.push(targetPath);
      changeCurrentKey(key);
    },
    [],
  );
  return (
    <Row flex={true} justify="stretch">
      <aside className="sider">
        <Menu items={MenuItems} onClick={handleMenuClick} />
      </aside>
      <div className="content">{children}</div>
    </Row>
  );
}
