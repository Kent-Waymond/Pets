import { Effect, Subscription } from 'umi';

interface ICreateModelType {
  namespace: 'createrate';
  state?: ICreateModelStates;
  reducers?: ICreateModelReducers;
  effects?: ICreateModelEffects;
  subscription?: { setup: Subscription };
}

interface ICreateModelStates {
  createObjIds: Array<IdObj> | null;
}
interface IdObj {
  id: string;
  name: string;
  type: string;
}
interface ICreateModelReducers {
  updateObjIds: Reducer<ICreateModelStates, any>;
}
interface ICreateModelEffects {
  IdObjPush: Effect;
  IdObjRemove: Effect;
}

const Model: ICreateModelType = {
  namespace: 'createrate',
  state: {
    createObjIds: [],
  },
  reducers: {
    updateObjIds: (
      state: ICreateModelStates,
      { payload },
    ): ICreateModelStates => {
      const { createObjIds } = payload;
      return {
        ...state,
        createObjIds,
      };
    },
  },
  effects: {
    *IdObjPush({ payload: { id, name, type } }, { put, select }) {
      const addobj = {
        id,
        name,
        type,
      };
      const ObjIds = yield select(
        (state: any) => state.createrate.createObjIds,
      );
      const newObj = ObjIds.concat(addobj);
      yield put({
        type: 'updateObjIds',
        payload: {
          createObjIds: newObj,
        },
      });
      return;
    },
    *IdObjRemove({ payload: { id } }, { put, select }) {
      const ObjIds = yield select(
        (state: any) => state.createrate.createObjIds,
      );
      const newObj = ObjIds.filter((item: IdObj) => item.id != id);
      yield put({
        type: 'updateObjIds',
        payload: {
          createObjIds: newObj,
        },
      });
      return;
    },
  },
};

export default Model;
