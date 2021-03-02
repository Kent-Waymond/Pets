import { Check_APP_AUTH_TOKEN } from '@/utils/auth';
import React from 'react';
import { Redirect } from 'umi';

interface IAuthorizedProps {
  children: any;
}

export default function Authorized(props: IAuthorizedProps) {
  const isLogin = Check_APP_AUTH_TOKEN();
  const { children } = props;
  console.log(isLogin, 'isLogin');
  if (isLogin) {
    return <>{children}</>;
  }
  return <Redirect to="/account/login"></Redirect>;
}
