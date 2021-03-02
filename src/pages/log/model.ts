import { IBHRawListDataRecord } from '@/type';
import { OperationLogRecord } from './type.d';
import * as Service from '@/request/log';
import { Subscription, Effect } from 'umi';

interface ILogModelType {
  namespace: 'log';
  state?: ILogModelStates;
  reducers?: ILogModelReducers;
  effects?: ILogModelEffects;
  subscriptions?: { setup: Subscription };
}

interface ILogModelStates {
  OperationLogsRecord: IBHRawListDataRecord<OperationLogRecord> | null; // 操作日志列表
}
interface ILogModelReducers {
  updateOperationLogsRecord: Reducer<ILogModelStates, any>;
}
interface ILogModelEffects {
  ListOperateLogs: Effect;
}

const Model: ILogModelType = {
  namespace: 'log',
  state: {
    OperationLogsRecord: null,
  },
  reducers: {
    updateOperationLogsRecord: (
      state: ILogModelStates,
      { payload },
    ): ILogModelStates => {
      const { OperationLogsRecord } = payload;
      return {
        ...state,
        OperationLogsRecord: OperationLogsRecord,
      };
    },
  },
  effects: {
    *ListOperateLogs(
      {
        payload: {
          pageNumber,
          pageSize,
          startTime,
          endTime,
          actionType,
          result,
          keywords,
        },
      },
      { call, put },
    ) {
      const response = yield call(Service.ListOperateLogs, {
        pageNumber,
        pageSize,
        startTime,
        endTime,
        actionType,
        result,
        keywords,
      });
      const OperationLogsRecord = response?.data?.data;
      yield put({
        type: 'updateOperationLogsRecord',
        payload: {
          OperationLogsRecord,
        },
      });

      return OperationLogsRecord;
    },
  },
};

export default Model;
