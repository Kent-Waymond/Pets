import React from 'react';
import BasicHeader from '@/components-compatible/Layout/BasicHeader';
import { AppRouteComponentProps } from '@/type';

interface IBasicLayoutProps extends AppRouteComponentProps {
  children: any;
}
export default function BasicLayout(props: IBasicLayoutProps) {
  // console.log(props);
  return (
    <div className="ami-app">
      <header className="ami-header">
        <BasicHeader route={props.route} />
      </header>
      <div className="ami-main">{props.children}</div>
    </div>
  );
}
