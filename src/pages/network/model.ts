import { IBHRawListDataRecord } from '@/type';
import {
  NetworkRecord,
  NetworkProfile,
  NetworkEthernetPortRecord,
  NetworkInstanceRecord,
} from './type.d';
import * as Service from '@/request/network';
import { Subscription, Effect, formatMessage } from 'umi';
import { message } from 'antd';
import { defineMessages } from 'react-intl';

interface INetworkModelType {
  namespace: 'network';
  state?: INetworkModelStates;
  reducers?: INetworkModelReducers;
  effects?: INetworkModelEffects;
  subscriptions?: { setup: Subscription };
}

interface INetworkModelStates {
  NetworkRecord: IBHRawListDataRecord<NetworkRecord> | null; // 网络列表
  NetworkProfile: NetworkProfile | null; // 网络详情
  AttachedEthernetPorts: IBHRawListDataRecord<NetworkEthernetPortRecord> | null;
  AttachedInstances: IBHRawListDataRecord<NetworkInstanceRecord> | null;
}
interface INetworkModelReducers {
  updateNetworkRecord: Reducer<INetworkModelStates, any>;
  updateNetworkProfile: Reducer<INetworkModelStates, any>;
  updateAttachedEthernetPorts: Reducer<INetworkModelStates, any>;
  updateAttachedInstances: Reducer<INetworkModelStates, any>;
}
interface INetworkModelEffects {
  ListNetworks: Effect;
  CreateNetwork: Effect;
  GetProfile: Effect;
  ListAttachedEthernetPorts: Effect;
  ListAttachedHosts: Effect;
  ModifyNetwork: Effect;
  RemoveNetwork: Effect;
  AttachEthernetPorts: Effect;
  DetachEthernetPorts: Effect;
}

const intlMessages = defineMessages({
  CreateNetworkErr: {
    id: 'network.model.CreateNetworkErr',
    defaultMessage: '创建网络失败{reason}',
  },
  CreateNetworkSuccess: {
    id: 'network.model.CreateNetworkSuccess',
    defaultMessage: '创建网络成功',
  },
  UpdateNetworkErr: {
    id: 'network.model.UpdateNetworkErr',
    defaultMessage: '更新网络失败{reason}',
  },
  DeleteNetworkSuccess: {
    id: 'network.model.DeleteNetworkSuccess',
    defaultMessage: '删除网络成功',
  },
  DeleteNetworkErr: {
    id: 'network.model.DeleteNetworkErr',
    defaultMessage: '删除网络失败{reason}',
  },
  UpdateNetworkSuccess: {
    id: 'network.model.UpdateNetworkSuccess',
    defaultMessage: '更新网络成功',
  },
  DetachEthernetPortsErr: {
    id: 'network.model.DetachEthernetPortsErr',
    defaultMessage: '删除网口失败{reason}',
  },
  DetachEthernetPortsSuccess: {
    id: 'network.model.DetachEthernetPortsSuccess',
    defaultMessage: '删除网口成功',
  },
  AttachEthernetPortsErr: {
    id: 'network.model.AttachEthernetPortsErr',
    defaultMessage: '添加网口失败{reason}',
  },
  AttachEthernetPortsSuccess: {
    id: 'network.model.AttachEthernetPortsSuccess',
    defaultMessage: '添加网口成功',
  },
});

const Model: INetworkModelType = {
  namespace: 'network',
  state: {
    NetworkRecord: null,
    NetworkProfile: null,
    AttachedEthernetPorts: null,
    AttachedInstances: null,
  },
  reducers: {
    updateNetworkRecord: (
      state: INetworkModelStates,
      { payload },
    ): INetworkModelStates => {
      const { NetworkRecord } = payload;
      return {
        ...state,
        NetworkRecord: NetworkRecord,
      };
    },
    updateNetworkProfile: (
      state: INetworkModelStates,
      { payload },
    ): INetworkModelStates => {
      const { NetworkProfile } = payload;
      return {
        ...state,
        NetworkProfile: NetworkProfile,
      };
    },
    updateAttachedEthernetPorts: (
      state: INetworkModelStates,
      { payload },
    ): INetworkModelStates => {
      const { AttachedEthernetPorts } = payload;
      return {
        ...state,
        AttachedEthernetPorts: AttachedEthernetPorts,
      };
    },
    updateAttachedInstances: (
      state: INetworkModelStates,
      { payload },
    ): INetworkModelStates => {
      const { AttachedInstances } = payload;
      return {
        ...state,
        AttachedInstances: AttachedInstances,
      };
    },
  },
  effects: {
    *ListNetworks(
      { payload: { Keyword, PageNumber, PageSize } },
      { call, put },
    ) {
      const response = yield call(Service.ListNetworks, {
        Keyword,
        PageNumber,
        PageSize,
      });
      const NetworkRecord = response?.data?.data;
      yield put({
        type: 'updateNetworkRecord',
        payload: {
          NetworkRecord,
        },
      });

      return NetworkRecord;
    },
    *ListAttachedEthernetPorts(
      { payload: { Portkeywords, ListAll, networkId, pageNumber, pageSize } },
      { call, put },
    ) {
      const response = yield call(Service.ListAttachedEthernetPorts, {
        keywords: Portkeywords,
        ListAll,
        pageNumber,
        pageSize,
        networkId,
      });
      const AttachedEthernetPorts = response?.data?.data?.ethernetPorts;
      yield put({
        type: 'updateAttachedEthernetPorts',
        payload: {
          AttachedEthernetPorts,
        },
      });

      return AttachedEthernetPorts;
    },
    *ListAttachedHosts(
      {
        payload: { Instancekeywords, ListAll, networkId, pageNumber, pageSize },
      },
      { call, put },
    ) {
      const response = yield call(Service.ListAttachedHosts, {
        keywords: Instancekeywords,
        ListAll,
        pageNumber,
        pageSize,
        networkId,
      });
      const AttachedHosts = response?.data?.data?.hosts;
      yield put({
        type: 'updateAttachedHosts',
        payload: {
          AttachedHosts,
        },
      });

      return AttachedHosts;
    },
    *GetProfile({ payload: { id } }, { call, put }) {
      // const response = yield call(Service.ListNetworks, {
      //   id,
      // });
      const NetworkProfile = null;
      yield put({
        type: 'updateNetworkProfile',
        payload: {
          NetworkProfile,
        },
      });

      return NetworkProfile;
    },
    *CreateNetwork(
      { payload: { name, type, ipMode, ipPool, subnetMask, gateway, comment } },
      { call, put },
    ) {
      const response = yield call(Service.CreateNetwork, {
        name,
        type,
        ipMode,
        ipPool,
        subnetMask,
        gateway,
        comment,
      });
      const networtId = response?.data?.data?.id || null;
      if (networtId == null) {
        const errMsg = response?.data?.message
          ? ', ' + response.data.message
          : '';
        message.error(
          formatMessage(intlMessages.CreateNetworkErr, { reason: errMsg }),
        );
      } else {
        message.success(formatMessage(intlMessages.CreateNetworkSuccess));
      }
      return networtId;
    },
    *ModifyNetwork(
      { payload: { id, name, ipPool, subnetMask, gateway, comment } },
      { call, put },
    ) {
      const response = yield call(Service.ModifyNetwork, {
        id,
        name,
        ipPool,
        subnetMask,
        gateway,
        comment,
      });
      const networtId = response?.data?.data?.id || null;
      if (networtId == null) {
        const errMsg = response?.data?.message
          ? ', ' + response.data.message
          : '';
        message.error(
          formatMessage(intlMessages.UpdateNetworkErr, { reason: errMsg }),
        );
      } else {
        message.success(formatMessage(intlMessages.UpdateNetworkSuccess));
      }
      return networtId;
    },
    *RemoveNetwork({ payload: { id } }, { call, put }) {
      const response = yield call(Service.RemoveNetwork, {
        id,
      });
      const isSuccess = response?.data?.success;
      if (!isSuccess) {
        const errMsg = response?.data?.message
          ? ', ' + response.data.message
          : '';
        message.error(
          formatMessage(intlMessages.DeleteNetworkErr, { reason: errMsg }),
        );
      } else {
        message.success(formatMessage(intlMessages.DeleteNetworkSuccess));
      }
      return isSuccess;
    },
    *AttachEthernetPorts(
      { payload: { networkId, ethernetPorts } },
      { call, put },
    ) {
      const response = yield call(Service.AttachEthernetPorts, {
        networkId,
        ethernetPorts,
      });
      const isSuccess = response?.data?.success;
      if (!isSuccess) {
        const errMsg = response?.data?.message
          ? ', ' + response.data.message
          : '';
        message.error(
          formatMessage(intlMessages.AttachEthernetPortsErr, {
            reason: errMsg,
          }),
        );
      } else {
        message.success(formatMessage(intlMessages.AttachEthernetPortsSuccess));
      }
      return isSuccess;
    },
    *DetachEthernetPorts(
      { payload: { networkId, ethernetPorts } },
      { call, put },
    ) {
      const response = yield call(Service.DetachEthernetPorts, {
        networkId,
        ethernetPorts,
      });
      const isSuccess = response?.data?.success;
      if (!isSuccess) {
        const errMsg = response?.data?.message
          ? ', ' + response.data.message
          : '';
        message.error(
          formatMessage(intlMessages.DetachEthernetPortsErr, {
            reason: errMsg,
          }),
        );
      } else {
        message.success(formatMessage(intlMessages.DetachEthernetPortsSuccess));
      }
      return isSuccess;
    },
  },
};

export default Model;
