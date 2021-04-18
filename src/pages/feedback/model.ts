import { IBHRawListDataRecord } from '@/type';
import { FeedbackRecord, FeedbackProfile } from './type.d';
import * as Service from '@/request/feedback';
import { message } from 'antd';
import { Subscription, Effect } from 'umi';

interface IModelType {
  namespace: 'feedback';
  state?: IModelStates;
  reducers?: IModelReducers;
  effects?: IModelEffects;
  subscriptions?: { setup: Subscription };
}

interface IModelStates {
  Feedback: IBHRawListDataRecord<FeedbackRecord> | null;
  FeedbackProfile: FeedbackProfile | null;
  MyFeedback: IBHRawListDataRecord<FeedbackRecord> | null;
  MyFeedbackProfile: FeedbackProfile | null;
}
interface IModelReducers {
  updateFeedbackRecord: Reducer<IModelStates, any>;
  updateMyFeedbackRecord: Reducer<IModelStates, any>;
}
interface IModelEffects {
  ListFeedbacks: Effect;
  GetFeedback: Effect;
  ListMyFeedbacks: Effect;
  GetMyFeedback: Effect;
  CreateFeedback: Effect;
  ModifyFeedback: Effect;
  RemoveFeedback: Effect;
  DealFeedback: Effect;
}

const Model: IModelType = {
  namespace: 'feedback',
  state: {
    Feedback: null,
    FeedbackProfile: null,
    MyFeedback: null,
    MyFeedbackProfile: null,
  },
  reducers: {
    updateFeedbackRecord: (state: IModelStates, { payload }): IModelStates => {
      const { Feedback } = payload;
      return {
        ...state,
        Feedback,
      };
    },
    updateMyFeedbackRecord: (
      state: IModelStates,
      { payload },
    ): IModelStates => {
      const { MyFeedback } = payload;
      return {
        ...state,
        MyFeedback,
      };
    },
  },
  effects: {
    *ListFeedbacks(
      { payload: { Keyword, PageNumber, PageSize } },
      { call, put },
    ) {
      const response = yield call(Service.ListFeedbacks, {
        Keyword,
        PageNumber,
        PageSize,
      });

      yield put({
        type: 'updateFeedbackRecord',
        payload: {
          Feedback: response?.data?.data || null,
        },
      });
    },

    *CreateFeedback(
      { payload: { title, complainType, content, phone, image } },
      { call, put },
    ) {
      const response = yield call(Service.CreateFeedback, {
        title,
        complainType,
        content,
        phone,
        image,
      });
      const FeedbackId = response?.data.data?.feedbackId;
      if (response?.data?.code == '200') {
        message.success('提交成功！');
        return FeedbackId;
      } else {
        message.error('提交失败');
        return null;
      }
    },
    *ModifyFeedback(
      { payload: { complainId, complainType, title, content, phone, image } },
      { call, put },
    ) {
      const response = yield call(Service.ModifyFeedback, {
        complainId,
        complainType,
        title,
        content,
        phone,
        image,
      });
      const FeedbackId = response?.data.data?.feedbackId;
      if (response?.data?.code == '200') {
        message.success('提交成功！');
        return FeedbackId;
      } else {
        message.error('提交失败');
        return null;
      }
    },
    *RemoveFeedback({ payload: { complainId } }, { call, put }) {
      const response = yield call(Service.RemoveFeedback, { complainId });
      if (response?.data?.code == '200') {
        message.success('删除成功！');
      } else {
        message.error('删除失败');
        return null;
      }
    },
    *DealFeedback({ payload: { complainId, status } }, { call, put }) {
      const response = yield call(Service.DealFeedback, { complainId, status });
      if (response?.data?.code == '200') {
        message.success('处理完成');
      } else {
        message.error('处理失败');
        return null;
      }
    },
    *GetFeedback({ payload: { FeedbackId } }, { call, put }) {
      const response = yield call(Service.GetFeedback, { FeedbackId });
      const profile = response?.data?.data || null;
      // TODO 具体参数
      return profile;
    },

    *ListMyFeedbacks(
      { payload: { Keyword, PageNumber, PageSize } },
      { call, put },
    ) {
      const response = yield call(Service.ListMyFeedbacks, {
        Keyword,
        PageNumber,
        PageSize,
      });

      yield put({
        type: 'updateMyFeedbackRecord',
        payload: {
          Feedback: response?.data?.data || null,
        },
      });
    },
    *GetMyFeedback({ payload: { FeedbackId } }, { call, put }) {
      const response = yield call(Service.GetFeedback, { FeedbackId });
      const profile = response?.data?.data || null;
      // TODO 具体参数
      return profile;
    },
  },
};

export default Model;
