import { IBHRawListDataRecord } from '@/type';
import { CommunityRecord, CommunityProfile } from './type.d';
import * as Service from '@/request/community';
import { Subscription, Effect } from 'umi';
import { message } from 'antd';

interface IModelType {
  namespace: 'community';
  state?: IModelStates;
  reducers?: IModelReducers;
  effects?: IModelEffects;
  subscriptions?: { setup: Subscription };
}

interface IModelStates {
  Community: IBHRawListDataRecord<CommunityRecord> | null;
  CommunityProfile: CommunityProfile | null;
  MyMoment: IBHRawListDataRecord<CommunityRecord> | null;
  MomentProfile: CommunityProfile | null;
}
interface IModelReducers {
  updateCommunityRecord: Reducer<IModelStates, any>;
  updateMomentRecord: Reducer<IModelStates, any>;
}
interface IModelEffects {
  ListCommunitys: Effect;
  SearchCommunitys: Effect;
  GetCommunityProfile: Effect;
  CreateCMoment: Effect;
  RemoveCommunity: Effect;
  UploadImage: Effect;

  ListMyMoments: Effect;
  GetMyMomentProfile: Effect;
  RemoveMyMoment: Effect;
}

const Model: IModelType = {
  namespace: 'community',
  state: {
    Community: null,
    CommunityProfile: null,
    MyMoment: null,
    MomentProfile: null,
  },
  reducers: {
    updateCommunityRecord: (state: IModelStates, { payload }): IModelStates => {
      const { Community } = payload;
      return {
        ...state,
        Community,
      };
    },
    updateMomentRecord: (state: IModelStates, { payload }): IModelStates => {
      const { MyMoment } = payload;
      return {
        ...state,
        MyMoment,
      };
    },
  },
  effects: {
    *ListCommunitys({ payload: { pageNumber, pageSize } }, { call, put }) {
      const response = yield call(Service.ListCommunitys, {
        pageNumber,
        pageSize,
      });

      yield put({
        type: 'updateCommunityRecord',
        payload: {
          Community: response?.data?.data || null,
        },
      });
    },
    *SearchCommunitys(
      { payload: { Keyword, pageNumber, pageSize } },
      { call, put },
    ) {
      const response = yield call(Service.SearchCommunitys, {
        Keyword,
        pageNumber,
        pageSize,
      });

      yield put({
        type: 'updateCommunityRecord',
        payload: {
          Community: response?.data?.data || null,
        },
      });
    },
    *CreateCMoment(
      { payload: { title, essayContent, essayRange, essayType } },
      { call, put },
    ) {
      const response = yield call(Service.CreateCMoment, {
        title,
        essayContent,
        essayRange,
        essayType,
      });
      const CId = response?.data.data?.essayId;
      if (response?.data?.code == '200') {
        message.success('发布成功！');
        return CId;
      } else {
        message.error('发布失败');
        return null;
      }
    },
    *RemoveCommunity({ payload: { essayId } }, { call, put }) {
      const response = yield call(Service.RemoveCommunity, { essayId });
      if (response?.data?.code == '200') {
        message.success('删除成功！');
      } else {
        message.error('删除失败');
        return null;
      }
    },
    *UploadImage({ payload: { name, CurrentUserID } }, { call, put }) {
      const response = yield call(Service.UploadImage, { name, CurrentUserID });
      console.log(response, 'response');
      if (response?.data?.code == '200') {
        message.success('上传成功');
      } else {
        message.error('上传失败');
      }
      return response;
    },
    *GetCommunityProfile({ payload: { essayId } }, { call, put }) {
      const response = yield call(Service.GetCommunity, { essayId });
      const profile = response?.data?.data?.Community || null;

      return profile;
    },

    *ListMyMoments({ payload: { pageNumber, pageSize } }, { call, put }) {
      const response = yield call(Service.ListMyMoments, {
        pageNumber,
        pageSize,
      });

      yield put({
        type: 'updateMomentRecord',
        payload: {
          MyMoment: response?.data?.data || null,
        },
      });
    },
    *GetMyMomentProfile({ payload: { momentId } }, { call, put }) {
      const response = yield call(Service.GetMyMoment, { momentId });
      const profile = response?.data?.data?.MyMoment || null;

      return profile;
    },
    *RemoveMyMoment({ payload: { momentId } }, { call, put }) {
      const response = yield call(Service.RemoveMyMoment, { momentId });
      if (response?.data?.code == '200') {
        message.success('删除成功！');
      } else {
        message.error('删除失败');
        return null;
      }
    },
  },
};

export default Model;
