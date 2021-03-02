import * as DashboardService from '@/request/dashboard';
import {
  IDashboardNodeRecord,
  IDashboardInstanceRecord,
  IDashboardStorageStatistic,
  IDashboardRecordStatisticType,
} from './type.d';
import { Subscription, Effect } from 'umi';
import { EnumProjectModels } from '@/variable';

interface IDashboardModelType {
  namespace: EnumProjectModels.dashboard;
  state?: IDashboardModelStates;
  reducers?: IDashboardModelReducers;
  effects?: IDashboardModelEffects;
  subscriptions?: { setup: Subscription };
}

interface IDashboardModelStates {
  DashboardNodeRecords: IDashboardNodeRecord[];
  DashboardInstanceRecords: IDashboardInstanceRecord[];
  DashboardPlatformStatisticRecords: IDashboardRecordStatisticType[];
  DashboardStorageStatistic: IDashboardStorageStatistic | null;
}
interface IDashboardModelReducers {
  updateDashboardNodeRecord: Reducer<IDashboardModelStates, any>;
  updateDashboardInstanceRecord: Reducer<IDashboardModelStates, any>;
  updateDashboardStorageStatistic: Reducer<IDashboardModelStates, any>;
  updateDashboardPlatformStatisticRecord: Reducer<IDashboardModelStates, any>;
}
interface IDashboardModelEffects {
  ListDashboardNodeRecords: Effect;
  ListDashboardInstanceRecords: Effect;
  ListDashboardPlatformStatisticRecords: Effect;
  GetPlatformStorageStatistic: Effect;
}

const Model: IDashboardModelType = {
  namespace: EnumProjectModels.dashboard,
  state: {
    DashboardNodeRecords: [],
    DashboardInstanceRecords: [],
    DashboardPlatformStatisticRecords: [],
    DashboardStorageStatistic: null,
  },
  reducers: {
    updateDashboardNodeRecord(state: IDashboardModelStates, { payload }) {
      const { DashboardNodeRecords } = payload;
      return { ...state, DashboardNodeRecords };
    },
    updateDashboardInstanceRecord(state: IDashboardModelStates, { payload }) {
      const { DashboardInstanceRecords } = payload;
      return { ...state, DashboardInstanceRecords };
    },
    updateDashboardStorageStatistic(state: IDashboardModelStates, { payload }) {
      const { DashboardStorageStatistic } = payload;
      return { ...state, DashboardStorageStatistic };
    },
    updateDashboardPlatformStatisticRecord(
      state: IDashboardModelStates,
      { payload },
    ) {
      const { DashboardPlatformStatisticRecords } = payload;
      return { ...state, DashboardPlatformStatisticRecords };
    },
  },
  effects: {
    *ListDashboardNodeRecords({}, { call, put }) {
      const records = yield call(DashboardService.ListDashboardNodeRecords);
      yield put({
        type: 'updateDashboardNodeRecord',
        payload: {
          DashboardNodeRecords: records,
        },
      });
      return;
    },
    *ListDashboardPlatformStatisticRecords({}, { call, put }) {
      const records = yield call(
        DashboardService.ListDashboardPlatformStatisticRecords,
      );
      yield put({
        type: 'updateDashboardPlatformStatisticRecord',
        payload: {
          DashboardPlatformStatisticRecords: records,
        },
      });
      return;
    },
    *ListDashboardInstanceRecords({}, { call, put }) {
      const records = yield call(DashboardService.ListDashboardInstanceRecords);
      yield put({
        type: 'updateDashboardInstanceRecord',
        payload: {
          DashboardInstanceRecords: records,
        },
      });
      return;
    },
    *GetPlatformStorageStatistic({ payload: { startTime } }, { call, put }) {
      const response = yield call(
        DashboardService.GetPlatformStorageStatistic,
        { startTime },
      );
      const StorageStatistic = response?.data?.data || null;
      yield put({
        type: 'updateDashboardStorageStatistic',
        payload: {
          DashboardStorageStatistic: StorageStatistic,
        },
      });
      return;
    },
  },
};
export default Model;
