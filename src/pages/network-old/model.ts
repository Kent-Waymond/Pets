import { IBHRawListDataRecord } from '@/type';
import { IServiceNetworkRecord } from './index.d';
import * as Service from '@/request/network';
import { Subscription, Effect, formatMessage } from 'umi';
import { message } from 'antd';
import { defineMessages } from 'react-intl';

interface INetworkModelType {
  namespace: 'network-old';
  state?: INetworkModelStates;
  reducers?: INetworkModelReducers;
  effects?: INetworkModelEffects;
  subscriptions?: { setup: Subscription };
}

interface INetworkModelStates {
  ServiceNetwork: IBHRawListDataRecord<IServiceNetworkRecord> | null;
}
interface INetworkModelReducers {
  updateServiceNetwork: Reducer<INetworkModelStates, any>;
}
interface INetworkModelEffects {
  ListNetworks: Effect;
  CreateNetwork: Effect;
}

const intlMessages = defineMessages({
  CreateNetworkOk: {
    id: 'mode.network.CreateNetworkOk',
    defaultMessage: '创建网络成功',
  },
  CreateNetworkErr: {
    id: 'mode.network.CreateNetworkErr',
    defaultMessage: '创建网络失败{reason}',
  },
});

const Model: INetworkModelType = {
  namespace: 'network-old',
  state: {
    ServiceNetwork: null,
  },
  reducers: {
    updateServiceNetwork: (
      state: INetworkModelStates,
      { payload },
    ): INetworkModelStates => {
      const { ServiceNetwork } = payload;
      return {
        ...state,
        ServiceNetwork,
      };
    },
  },
  effects: {
    *ListNetworks(
      { payload: { Keyword, PageNumber, PageSize, ListAll } },
      { call, put },
    ) {
      const response = yield call(Service.ListNetworks, {
        Keyword,
        PageNumber,
        PageSize,
        ListAll,
      });

      const ServiceNetwork = response?.data?.data;
      yield put({
        type: 'updateServiceNetwork',
        payload: {
          ServiceNetwork: ServiceNetwork || null,
        },
      });

      return ServiceNetwork;
    },
    *CreateNetwork(
      { payload: { name, subnet, gateway, comment } },
      { call, put },
    ) {
      const response = yield call(Service.CreateNetwork, {
        name,
        subnet,
        gateway,
        comment,
      });
      const networkId = response.data?.data?.id || '';
      if (response.data?.code == '200') {
        message.success(formatMessage(intlMessages.CreateNetworkOk));
      } else {
        const msgtip = response.data?.message
          ? ', ' + response.data?.message
          : '';
        message.error(
          formatMessage(intlMessages.CreateNetworkErr, { reason: msgtip }),
        );
      }
      return networkId;
    },
  },
};

export default Model;
