import { IBHRawListDataRecord } from '@/type';
import { SquareRecord, SquareProfile } from './type.d';
import * as Service from '@/request/square';
import { Subscription, Effect } from 'umi';
import { message } from 'antd';
import { CommentRecord } from '../community/type';

interface IModelType {
  namespace: 'square';
  state?: IModelStates;
  reducers?: IModelReducers;
  effects?: IModelEffects;
  subscriptions?: { setup: Subscription };
}

interface IModelStates {
  Square: IBHRawListDataRecord<SquareRecord> | null;
  Comments: IBHRawListDataRecord<CommentRecord> | null;
  SquareProfile: SquareProfile | null;
}
interface IModelReducers {
  updateSquareRecord: Reducer<IModelStates, any>;
  updateCommentRecord: Reducer<IModelStates, any>;
}
interface IModelEffects {
  ListSquares: Effect;
  ListComments: Effect;
  SearchSquares: Effect;
  GetSquareProfile: Effect;
  CreateSMoment: Effect;
  RemoveSquare: Effect;
}

const Model: IModelType = {
  namespace: 'square',
  state: {
    Square: null,
    Comments: null,
    SquareProfile: null,
  },
  reducers: {
    updateSquareRecord: (state: IModelStates, { payload }): IModelStates => {
      const { Square } = payload;
      return {
        ...state,
        Square,
      };
    },
    updateCommentRecord: (state: IModelStates, { payload }): IModelStates => {
      const { Comments } = payload;
      return {
        ...state,
        Comments,
      };
    },
  },
  effects: {
    *ListSquares({ payload: { pageNumber, pageSize } }, { call, put }) {
      const response = yield call(Service.ListSquares, {
        pageNumber,
        pageSize,
      });

      yield put({
        type: 'updateSquareRecord',
        payload: {
          Square: response?.data?.data || null,
        },
      });
    },
    *ListComments({ payload: { essayId } }, { call, put }) {
      const response = yield call(Service.ListComments, {
        essayId,
      });

      yield put({
        type: 'updateCommentRecord',
        payload: {
          Comments: response?.data?.data || null,
        },
      });
    },
    *SearchSquares(
      { payload: { Keyword, pageNumber, pageSize } },
      { call, put },
    ) {
      const response = yield call(Service.SearchSquares, {
        Keyword,
        pageNumber,
        pageSize,
      });

      yield put({
        type: 'updateSquareRecord',
        payload: {
          Square: response?.data?.data || null,
        },
      });
    },
    *CreateSMoment(
      { payload: { title, essayContent, essayRange, essayType } },
      { call, put },
    ) {
      const response = yield call(Service.CreateSMoment, {
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
    *RemoveSquare({ payload: { essayId } }, { call, put }) {
      const response = yield call(Service.RemoveSquare, { essayId });
      if (response?.data?.code == '200') {
        message.success('删除成功！');
      } else {
        message.error('删除失败');
        return null;
      }
    },
    *GetSquareProfile({ payload: { essayId } }, { call, put }) {
      const response = yield call(Service.GetSquare, { essayId });
      const profile = response?.data?.data?.Square || null;

      return profile;
    },
  },
};

export default Model;
