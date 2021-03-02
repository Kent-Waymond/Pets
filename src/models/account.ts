import { Subscription, Effect, formatMessage } from 'umi';
import * as Service from '@/request/account';
import { message } from 'antd';
import { defineMessages } from 'react-intl';
import { SET_APP_AUTH_TOKEN, REMOVE_APP_AUTH_TOKEN } from '@/utils/auth';
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

const intlMessages = defineMessages({
  LoginFail: {
    id: 'account.model.LoginFail',
    defaultMessage: '登录失败，账号或密码错误',
  },
});

const Model: IAccountModelType = {
  namespace: 'account',

  effects: {
    *Login({ payload: { Username, Password } }, { call }) {
      const response = yield call(Service.Login, { Username, Password });
      // const token = response?.data?.data?.token || '';
      // if (response?.data?.code == '200' && token) {
      //   if (token) {
      //     SET_APP_AUTH_TOKEN(token);
      //     return true;
      // const token = response?.data?.data?.token || '';
      // const res = response?.data?.data || '';
      // if (response?.data?.code == '200' && res) {
      //   if (res) {
      //     console.log(res, 'login res');
      //     return true
      //   }
      // } else {
      //   message.error(formatMessage(intlMessages.LoginFail));
      //   return false;
      // }
      SET_APP_AUTH_TOKEN('true');
      return true;
    },

    *Logout({}, { call }) {
      try {
        const response = yield call(Service.Logout);
      } catch (e) {
      } finally {
        REMOVE_APP_AUTH_TOKEN();
        window.location.reload();
      }
      // if (response?.data?.code == '200') {
      //   REMOVE_APP_AUTH_TOKEN();
      //   return true;
      // }

      return false;
    },
  },
};

export default Model;
