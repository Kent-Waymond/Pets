import * as Service from '@/request/dashboard';
import { VaccineCountType, INoticeRecord, INoticeProfile } from './type.d';
import { message } from 'antd';
import { Subscription, Effect } from 'umi';
import { EnumProjectModels } from '@/variable';

interface IDashboardModelType {
  namespace: 'dashboard';
  state?: IDashboardModelStates;
  reducers?: IDashboardModelReducers;
  effects?: IDashboardModelEffects;
  subscriptions?: { setup: Subscription };
}

interface IDashboardModelStates {
  NoticeRecord: INoticeRecord[];
  NoticeProfile: INoticeProfile | null;
  AllDataForDashboard: VaccineCountType[];
}
interface IDashboardModelReducers {
  updateNoticeRecord: Reducer<IDashboardModelStates, any>;
  updateAllDataForDashboard: Reducer<IDashboardModelStates, any>;
  updateNoticeProfile: Reducer<IDashboardModelStates, any>;
}
interface IDashboardModelEffects {
  ListNoticeRecords: Effect;
  GetAllDataForDashboard: Effect;
  CreateNotice: Effect;
  GetNoticeProfile: Effect;
  DeleteNotice: Effect;
}

const Model: IDashboardModelType = {
  namespace: 'dashboard',
  state: {
    NoticeRecord: [],
    NoticeProfile: null,
    AllDataForDashboard: [],
  },
  reducers: {
    updateNoticeRecord(state: IDashboardModelStates, { payload }) {
      const { NoticeRecord } = payload;
      return { ...state, NoticeRecord };
    },
    updateAllDataForDashboard(state: IDashboardModelStates, { payload }) {
      const { AllDataForDashboard } = payload;
      return { ...state, AllDataForDashboard };
    },
    updateNoticeProfile(state: IDashboardModelStates, { payload }) {
      const { NoticeProfile } = payload;
      return { ...state, NoticeProfile };
    },
  },
  effects: {
    *ListNoticeRecords({}, { call, put }) {
      const response = yield call(Service.ListNoticeRecords);
      yield put({
        type: 'updateNoticeRecord',
        payload: {
          NoticeRecord: response?.data?.data,
        },
      });
      return;
    },
    *CreateNotice({ payload: { title, noticeType, content } }, { call, put }) {
      const response = yield call(Service.CreateNotice, {
        title,
        noticeType,
        content,
      });
      const noticeId = response?.data.data?.noticeId;
      if (response?.data?.code == '200') {
        message.success('发布成功！');
        return noticeId;
      } else {
        message.error('发布失败');
        return null;
      }
    },
    *GetAllDataForDashboard({}, { call, put }) {
      const records = yield call(Service.GetAllDataForDashboard);
      yield put({
        type: 'updateAllDataForDashboard',
        payload: {
          AllDataForDashboard: records,
        },
      });
      return;
    },
    *GetNoticeProfile({ payload: { noticeId } }, { call, put }) {
      const response = yield call(Service.GetNoticeProfile, { noticeId });
      const profile = response?.data?.data;
      yield put({
        type: 'updateNoticeProfile',
        payload: {
          NoticeProfile: response?.data?.data,
        },
      });
      return profile;
    },
    *DeleteNotice({ payload: { noticeId } }, { call, put }) {
      const response = yield call(Service.DeleteNotice, { noticeId });
      if (response?.data?.code == '200') {
        message.success('删除成功');
        return true;
      } else {
        message.error('删除失败');
        return null;
      }
    },
  },
};
export default Model;
