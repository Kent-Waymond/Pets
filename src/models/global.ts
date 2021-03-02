import * as LicenseService from '@/request/license';
import * as NetworkService from '@/request/network';
import * as ImageService from '@/request/image';
import { Subscription, Effect } from 'umi';
import { EnumProjectModels, EnumSupportProducts } from '@/variable';
import {
  IPlatformImageRecord,
  IPlatformLicenseRecord,
  IPlatformNetworkRecord,
} from '@/type';

interface IGlobalModelType {
  namespace: EnumProjectModels.global;
  state?: IGlobalModelStates;
  reducers?: IGlobalModelReducers;
  effects?: IGlobalModelEffects;
  subscriptions?: { setup: Subscription };
}

interface IGlobalModelStates {
  PlatformLicenses: IPlatformLicenseRecord[];
  PlatformNetworks: IPlatformNetworkRecord[];
  PlatformImages: IPlatformImageRecord[];
}
interface IGlobalModelReducers {
  updatePlatformLicenses: Reducer<IGlobalModelStates, any>;
  updatePlatformNetworks: Reducer<IGlobalModelStates, any>;
  updatePlatformImages: Reducer<IGlobalModelStates, any>;
}
interface IGlobalModelEffects {
  ListPlatformLicenses: Effect;
  ListPlatformNetworks: Effect;
  ListPlatformImages: Effect;
}

const Model: IGlobalModelType = {
  namespace: EnumProjectModels.global,
  state: {
    PlatformLicenses: [],
    PlatformNetworks: [],
    PlatformImages: [],
  },
  reducers: {
    updatePlatformLicenses(state: IGlobalModelStates, { payload }) {
      const { PlatformLicenses } = payload;
      return { ...state, PlatformLicenses };
    },
    updatePlatformNetworks(state: IGlobalModelStates, { payload }) {
      const { PlatformNetworks } = payload;
      return { ...state, PlatformNetworks };
    },
    updatePlatformImages(state: IGlobalModelStates, { payload }) {
      const { PlatformImages } = payload;
      return { ...state, PlatformImages };
    },
  },
  effects: {
    *ListPlatformLicenses({}, { call, put }) {
      const response = yield call(LicenseService.ListPlatformLicenses, {});
      const PlatformLicenses = response.data?.data?.licenses || [];
      yield put({
        type: 'updatePlatformLicenses',
        payload: {
          PlatformLicenses,
        },
      });
      return PlatformLicenses;
    },
    *ListPlatformNetworks({}, { call, put }) {
      const response = yield call(NetworkService.ListNetworks, {
        ListAll: true,
      });
      const PlatformNetworks = response.data?.data?.networks || [];
      yield put({
        type: 'updatePlatformNetworks',
        payload: {
          PlatformNetworks,
        },
      });
      return PlatformNetworks;
    },
    *ListPlatformImages({}, { call, put }) {
      const response = yield call(ImageService.ListImages, { ListAll: true });
      const PlatformImages = response.data?.data?.images || [];
      yield put({
        type: 'updatePlatformImages',
        payload: {
          PlatformImages,
        },
      });
      return PlatformImages;
    },
  },
};
export default Model;
