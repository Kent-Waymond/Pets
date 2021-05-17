import { Subscription, Effect, formatMessage } from 'umi';
import * as Service from '@/request/account';
import { message } from 'antd';
import { defineMessages } from 'react-intl';
import {
  SET_USER_TOKEN,
  REMOVE_USER_TOKEN,
  SET_IDENTITY,
  REMOVE_IDENTITY,
  GET_IDENTITY,
} from '@/utils/auth';
interface IAccountModelType {
  namespace: 'account';
  state?: IAccountModelStates;
  reducers?: IAccountModelReducers;
  effects?: IAccountModelEffects;
  subscriptions?: { setup: Subscription };
}

interface IAccountModelStates {}
interface IAccountModelReducers {}
interface IAccountModelEffects {
  Login: Effect;
  Logout: Effect;
}

const Model: IAccountModelType = {
  namespace: 'account',

  effects: {
    *Login({ payload: { phone, password } }, { call }) {
      const response = yield call(Service.Login, { phone, password });
      const userId = response?.data?.data?.userId || '';
      if (response?.data?.code == '200' && userId) {
        if (userId) {
          SET_USER_TOKEN(userId);
          if (userId === 'tourist') {
            SET_IDENTITY('passby');
          } else if (phone === 'root') {
            SET_IDENTITY('admin');
          } else {
            SET_IDENTITY('petMaster');
          }
          message.success('登录成功！');
          return userId;
          // const token = response?.data?.data?.token || '';
          // const res = response?.data?.data || '';
          // if (response?.data?.code == '200' && res) {
          //   if (res) {
          //     console.log(res, 'login res');
          //     return true
          //   }
        }
      } else {
        message.error('账号或密码错误');
        return false;
      }
    },
    *Logout({}, { call }) {
      try {
        const response = yield call(Service.Logout);
      } catch (e) {
      } finally {
        REMOVE_USER_TOKEN();
        REMOVE_IDENTITY();
        window.location.reload();
        return true;
      }
      // if (response?.data?.code == '200') {
      //   REMOVE_USER_TOKEN();
      //   return true;
      // }
    },
  },
};

export default Model;
