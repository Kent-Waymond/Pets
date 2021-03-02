import { IBHRawListDataRecord } from '@/type';
import { InstanceRecord, InstanceProfileType } from './type';
import * as InstanceService from '@/request/instance';
import * as NetworkService from '@/request/network';
import { Subscription, Effect, formatMessage } from 'umi';
import { message } from 'antd';
import { defineMessages } from 'react-intl';

interface IModelType {
  namespace: 'instance';
  state?: IModelStates;
  reducers?: IModelReducers;
  effects?: IModelEffects;
  subscriptions?: { setup: Subscription };
}

interface IModelStates {
  Instance: IBHRawListDataRecord<InstanceRecord> | null;
  InstanceProfile: InstanceProfileType | null;
}
interface IModelReducers {
  updateInstance: Reducer<IModelStates, any>;
  updateInstanceProfile: Reducer<IModelStates, any>;
}
interface IModelEffects {
  ListInstances: Effect;
  GetInstance: Effect;
  CreateInstance: Effect;
  RemoveInstances: Effect;
  StopInstance: Effect;
  StartInstance: Effect;
  ExtendDiskSize: Effect;
  SpecificationChange: Effect;
  GetCreateInstanceProgress: Effect;
  ListInstanceNetworkAttachedNodes: Effect;
}

const intlMessages = defineMessages({
  RemoveInstancesOk: {
    id: 'mode.instance.RemoveInstancesOk',
    defaultMessage: '移除实例成功',
  },
  StopInstanceOk: {
    id: 'mode.instance.StopInstanceOk',
    defaultMessage: '停用实例成功',
  },
  StartInstanceOk: {
    id: 'mode.instance.StartInstanceOk',
    defaultMessage: '启用实例成功',
  },
  ExtendDiskSizeOk: {
    id: 'mode.instance.ExtendDiskSizeOk',
    defaultMessage: '磁盘扩容成功',
  },
  CreateInstanceErr: {
    id: 'mode.instance.CreateInstanceErr',
    defaultMessage: '创建实例失败{reason}',
  },
  RemoveInstancesErr: {
    id: 'mode.instance.RemoveInstancesErr',
    defaultMessage: '移除实例失败{reason}',
  },
  StopInstanceErr: {
    id: 'mode.instance.StopInstanceErr',
    defaultMessage: '停用实例失败{reason}',
  },
  StartInstanceErr: {
    id: 'mode.instance.StartInstanceErr',
    defaultMessage: '启用实例失败{reason}',
  },
  ExtendDiskSizeErr: {
    id: 'mode.instance.ExtendDiskSizeErr',
    defaultMessage: '磁盘扩容失败{reason}',
  },
  ChangeInstanceSpecOk: {
    id: 'mode.instance.ChangeInstanceSpecOk',
    defaultMessage: '实例变配成功',
  },
  ChangeInstanceSpecErr: {
    id: 'mode.instance.ChangeInstanceSpecErr',
    defaultMessage: '实例变配失败{reason}',
  },
});

const Model: IModelType = {
  namespace: 'instance',
  state: {
    Instance: null,
    InstanceProfile: null,
  },
  reducers: {
    updateInstance: (state: IModelStates, { payload }): IModelStates => {
      const { Instance } = payload;
      return {
        ...state,
        Instance,
      };
    },
    updateInstanceProfile: (state: IModelStates, { payload }) => {
      const { InstanceProfile } = payload;
      return {
        ...state,
        InstanceProfile,
      };
    },
  },
  effects: {
    *ListInstances(
      { payload: { Keyword, PageNumber, PageSize, OrderFields } },
      { call, put },
    ) {
      const response = yield call(InstanceService.ListInstances, {
        Keyword,
        PageNumber,
        PageSize,
        OrderFields,
      });

      yield put({
        type: 'updateInstance',
        payload: {
          Instance: response?.data?.data || null,
        },
      });
    },
    *GetInstance({ payload: { InstanceId } }, { call, put }) {
      const response = yield call(InstanceService.GetInstance, { InstanceId });
      const profile = response?.data?.data?.instance || null;
      // yield put({
      //   type: "updateInstance",
      //   payload: {
      //     Instance: profile
      //   }
      // })

      return profile;
    },
    *CreateInstance(
      {
        payload: {
          name,
          comment,
          licenseConfig,
          resourceLimit,
          networkDriver,
          networkId,
          ip,
          hostId,
          imageId,
        },
      },
      { call, put },
    ) {
      const response = yield call(InstanceService.CreateInstance, {
        name,
        comment,
        licenseConfig,
        resourceLimit,
        networkDriver,
        networkId,
        ip,
        hostId,
        imageId,
      });
      const instanceId = response?.data?.data?.id || null;
      if (instanceId === null) {
        const msgtip = response.data?.message
          ? ', ' + response.data?.message
          : '';
        message.error(
          formatMessage(intlMessages.CreateInstanceErr, { reason: msgtip }),
        );
      }
      return instanceId;
    },
    *GetCreateInstanceProgress({ payload: { id } }, { call, put }) {
      const response = yield call(InstanceService.getCreateProgress, { id });
      const progress = response?.data?.data?.object || null;
      return progress;
    },
    *RemoveInstances({ payload: { Ids } }, { call, put }) {
      const response = yield call(InstanceService.RemoveInstances, { Ids });
      if (response.data?.code == '200') {
        message.success(formatMessage(intlMessages.RemoveInstancesOk));
      } else {
        const msgtip = response.data?.message
          ? ', ' + response.data?.message
          : '';
        message.error(
          formatMessage(intlMessages.RemoveInstancesErr, { reason: msgtip }),
        );
      }
      return;
    },
    *StopInstance({ payload: { id } }, { call }) {
      const response = yield call(InstanceService.StopInstances, { id });
      if (response.data?.code == '200') {
        message.success(formatMessage(intlMessages.StopInstanceOk));
      } else {
        const msgtip = response.data?.message
          ? ', ' + response.data?.message
          : '';
        message.error(
          formatMessage(intlMessages.StopInstanceErr, { reason: msgtip }),
        );
      }
      return;
    },
    *StartInstance({ payload: { id } }, { call }) {
      const response = yield call(InstanceService.StartInstances, { id });
      if (response.data?.code == '200') {
        message.success(formatMessage(intlMessages.StartInstanceOk));
      } else {
        const msgtip = response.data?.message
          ? ', ' + response.data?.message
          : '';
        message.error(
          formatMessage(intlMessages.StartInstanceErr, { reason: msgtip }),
        );
      }
      return;
    },
    *ExtendDiskSize({ payload: { id, extendSize } }, { call, put }) {
      const response = yield call(InstanceService.ExtendDiskSize, {
        id,
        extendSize,
      });
      if (response.data?.code == '200') {
        message.success(formatMessage(intlMessages.ExtendDiskSizeOk));
      } else {
        const msgtip = response.data?.message
          ? ', ' + response.data?.message
          : '';
        message.error(
          formatMessage(intlMessages.ExtendDiskSizeErr, { reason: msgtip }),
        );
      }
      return;
    },
    *SpecificationChange({ payload: { id, specId, expireAt } }, { call }) {
      const response = yield call(InstanceService.ChangeInstanceSpec, {
        id,
        specId,
        expireAt,
      });
      if (response.data?.code == '200') {
        message.success(formatMessage(intlMessages.ChangeInstanceSpecOk));
      } else {
        const msgtip = response.data?.message
          ? ', ' + response.data?.message
          : '';
        message.error(
          formatMessage(intlMessages.ChangeInstanceSpecErr, { reason: msgtip }),
        );
      }
      return;
    },
    *ListInstanceNetworkAttachedNodes({ payload: { networkId } }, { call }) {
      const response = yield call(NetworkService.ListAttachedHosts, {
        networkId,
        ListAll: true,
      });
      const AttachNodes = response?.data?.data?.hosts || [];

      return AttachNodes;
    },
  },
};

export default Model;
