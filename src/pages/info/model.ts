import { IBHRawListDataRecord } from '@/type';
import { PetProfile, PetRecord, UserRecord, UserProfile } from './type.d';
import * as Service from '@/request/info';
import * as NetworkService from '@/request/network';
import { Subscription, Effect, formatMessage } from 'umi';
import { message } from 'antd';
import { defineMessages } from 'react-intl';

interface IModelType {
  namespace: 'info';
  state?: IModelStates;
  reducers?: IModelReducers;
  effects?: IModelEffects;
  subscriptions?: { setup: Subscription };
}

interface IModelStates {
  PetRecord: IBHRawListDataRecord<PetRecord> | null;
  PetProfile: PetProfile | null;

  UserRecord: IBHRawListDataRecord<UserRecord> | null;
  UserProfile: UserProfile | null;
}
interface IModelReducers {
  updatePetRecord: Reducer<IModelStates, any>;
  updatePetProfile: Reducer<IModelStates, any>;

  updateUserRecord: Reducer<IModelStates, any>;
  updateUserProfile: Reducer<IModelStates, any>;
}
interface IModelEffects {
  ListPetRecords: Effect;
  SearchPetRecords: Effect;
  GetPetProfile: Effect;
  CreatePet: Effect;
  UpdatePet: Effect;
  RemovePet: Effect;

  ListAllUsers: Effect;
  GetUserProfile: Effect;
  sendCode: Effect;
  CreateUser: Effect;
}

const Model: IModelType = {
  namespace: 'info',
  state: {
    PetRecord: null,
    PetProfile: null,
    UserRecord: null,
    UserProfile: null,
  },
  reducers: {
    updatePetRecord: (state: IModelStates, { payload }): IModelStates => {
      const { PetRecord } = payload;
      return {
        ...state,
        PetRecord,
      };
    },
    updatePetProfile: (state: IModelStates, { payload }) => {
      const { PetProfile } = payload;
      return {
        ...state,
        PetProfile,
      };
    },
    updateUserRecord: (state: IModelStates, { payload }): IModelStates => {
      const { UserRecord } = payload;
      return {
        ...state,
        UserRecord,
      };
    },
    updateUserProfile: (state: IModelStates, { payload }) => {
      const { UserProfile } = payload;
      return {
        ...state,
        UserProfile,
      };
    },
  },
  effects: {
    *ListPetRecords(
      { payload: { Keyword, PageNumber, PageSize, OrderFields } },
      { call, put },
    ) {
      const response = yield call(Service.ListPetRecords, {
        Keyword,
        PageNumber,
        PageSize,
        OrderFields,
      });

      yield put({
        type: 'updatePetRecord',
        payload: {
          PetRecord: response?.data?.data || null,
        },
      });
    },
    *SearchPetRecords({ payload: { species } }, { call, put }) {
      const response = yield call(Service.SearchPetRecords, {
        species,
      });

      yield put({
        type: 'updatePetRecord',
        payload: {
          PetRecord: response?.data?.data || null,
        },
      });
    },
    *CreatePet(
      { payload: { petName, petSpecies, petImage, age, gender, status } },
      { call, put },
    ) {
      const response = yield call(Service.CreatePet, {
        petName,
        petSpecies,
        petImage,
        age,
        gender,
        status,
      });
      const PetId = response?.data.data?.petId;
      if (response?.data?.code == '200') {
        message.success('新增宠物成功！');
        return PetId;
      } else {
        message.error('新增宠物失败');
        return null;
      }
    },
    *RemovePet({ payload: { petId } }, { call, put }) {
      const response = yield call(Service.RemovePet, { petId });
      if (response?.data?.code == '200') {
        message.success('删除宠物成功！');
        return true;
      } else {
        message.error('删除宠物失败');
        return null;
      }
    },
    *GetPetProfile({ payload: { petId } }, { call, put }) {
      const response = yield call(Service.GetPetProfile, { petId });
      const PetProfile = response?.data?.data?.pet || null;

      yield put({
        type: 'updatePetProfile',
        payload: {
          PetProfile: response?.data?.data || null,
        },
      });
      return PetProfile;
    },
    *UpdatePet(
      { payload: { petId, petName, petImage, age, status } },
      { call, put },
    ) {
      const response = yield call(Service.UpdatePet, {
        petId,
        petName,
        petImage,
        age,
        status,
      });
      const PetProfile = response?.data?.data || null;

      if (PetProfile) {
        message.success('删除宠物成功！');
        yield put({
          type: 'updatePetProfile',
          payload: {
            PetProfile: response?.data?.data || null,
          },
        });
        return PetProfile;
      } else {
        message.error('删除宠物失败');
        return null;
      }
    },
    *ListAllUsers(
      { payload: { Keyword, PageNumber, PageSize } },
      { call, put },
    ) {
      const response = yield call(Service.ListAllUsers, {
        Keyword,
        PageNumber,
        PageSize,
      });

      yield put({
        type: 'updateUserRecord',
        payload: {
          UserRecord: response?.data?.data || null,
        },
      });
    },
    *GetUserProfile({ payload: { VaccineId } }, { call, put }) {
      const response = yield call(Service.sendCode, { VaccineId });
      const profile = response?.data?.data?.user || null;

      return profile;
    },
    *sendCode({ payload: { email } }, { call, put }) {
      const response = yield call(Service.sendCode, { email });
      if (response?.data?.code == '200') {
        message.success('验证码已发送！');
      } else {
        message.error('验证码发送失败！');
      }
    },
    *CreateUser(
      { payload: { email, code, phone, detailAddress, userName } },
      { call, put },
    ) {
      const response = yield call(Service.CreateUser, {
        email,
        code,
        phone,
        detailAddress,
        userName,
      });
      const UserId = response?.data.data?.userId;
      if (response?.data?.code == '200' && response?.data?.data) {
        message.success('创建用户成功！');
        return UserId;
      } else {
        message.error('创建用户失败');
        return null;
      }
    },
  },
};

export default Model;
