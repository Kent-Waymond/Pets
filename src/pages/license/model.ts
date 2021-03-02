import { IBHRawListDataRecord } from '@/type';
import {
  InstanceLicenseRecord,
  InstanceLicenseSpecsRecord,
  IPlatformLicenseProfile,
} from './type.d';
import * as Service from '@/request/license';
import { Subscription, Effect, formatMessage } from 'umi';
import { defineMessages } from 'react-intl';
import { message } from 'antd';

interface ILicenseModelType {
  namespace: 'license';
  state?: ILicenseModelStates;
  reducers?: ILicenseModelReducers;
  effects?: ILicenseModelEffects;
  subscriptions?: { setup: Subscription };
}

interface ILicenseModelStates {
  InstanceLicense: IBHRawListDataRecord<InstanceLicenseRecord> | null; // 实例许可列表
  InstanceLicenseSpecs: InstanceLicenseSpecsRecord[]; // 实例许可规格列表
  PlatformLicenseProfile: IPlatformLicenseProfile | null; // 平台许可详情
}
interface ILicenseModelReducers {
  updateInstanceLicense: Reducer<ILicenseModelStates, any>;
  updateInstanceLicenseSpecs: Reducer<ILicenseModelStates, any>;
  updatePlatformLicenseProfile: Reducer<ILicenseModelStates, any>;
}
interface ILicenseModelEffects {
  ListInstanceLicenses: Effect;
  ListInstanceLicenseSpecs: Effect;
  GetPlatformLicenseInfo: Effect;
  ImportLicense: Effect;
}

const intlMessages = defineMessages({
  ImportLicenseOk: {
    id: 'mode.license.ImportLicenseOk',
    defaultMessage: '导入平台许可包成功',
  },
  ImportLicenseErr: {
    id: 'mode.license.ImportLicenseErr',
    defaultMessage: '导入平台许可包失败{reason}',
  },
});

const Model: ILicenseModelType = {
  namespace: 'license',
  state: {
    InstanceLicense: null,
    InstanceLicenseSpecs: [],
    PlatformLicenseProfile: null,
  },
  reducers: {
    updateInstanceLicense: (
      state: ILicenseModelStates,
      { payload },
    ): ILicenseModelStates => {
      const { InstanceLicense } = payload;
      return {
        ...state,
        InstanceLicense,
      };
    },
    updateInstanceLicenseSpecs: (
      state: ILicenseModelStates,
      { payload },
    ): ILicenseModelStates => {
      const { InstanceLicenseSpecs } = payload;
      return {
        ...state,
        InstanceLicenseSpecs,
      };
    },
    updatePlatformLicenseProfile: (
      state: ILicenseModelStates,
      { payload },
    ): ILicenseModelStates => {
      const { PlatformLicenseProfile } = payload;
      return {
        ...state,
        PlatformLicenseProfile,
      };
    },
  },
  effects: {
    *ListInstanceLicenses(
      { payload: { Keyword, PageNumber, PageSize } },
      { call, put },
    ) {
      const response = yield call(Service.ListInstanceLicenses, {
        Keyword,
        PageNumber,
        PageSize,
      });

      const InstanceLicense = response?.data?.data;
      yield put({
        type: 'updateInstanceLicense',
        payload: {
          InstanceLicense: InstanceLicense || null,
        },
      });

      return InstanceLicense;
    },
    *ListInstanceLicenseSpecs({ payload: { productId } }, { call, put }) {
      const response = yield call(Service.ListInstanceLicenseSpecs, {
        productId,
      });

      const data = response?.data?.data;
      const InstanceLicenseSpecs =
        data?.specs instanceof Array ? data?.specs : [];
      yield put({
        type: 'updateInstanceLicenseSpecs',
        payload: {
          InstanceLicenseSpecs: InstanceLicenseSpecs,
        },
      });

      return InstanceLicenseSpecs;
    },
    *GetPlatformLicenseInfo({ payload: { productId } }, { call, put }) {
      const response = yield call(Service.GetPlatformLicenseInfo, {
        productId,
      });

      const data = response?.data?.data;
      const PlatformLicenseProfile =
        typeof data?.license == 'object' ? data?.license : null;
      yield put({
        type: 'updatePlatformLicenseProfile',
        payload: {
          PlatformLicenseProfile,
        },
      });

      return PlatformLicenseProfile;
    },
    *ImportLicense({ payload: { license, productId } }, { call }) {
      const response = yield call(Service.importPlatformLicense, {
        license,
        productId,
      });
      if (response.data?.code == '200') {
        message.success(formatMessage(intlMessages.ImportLicenseOk));
      } else {
        const msgtip = response.data?.message
          ? ', ' + response.data?.message
          : '';
        message.error(
          formatMessage(intlMessages.ImportLicenseErr, { reason: msgtip }),
        );
      }
    },
  },
};

export default Model;
