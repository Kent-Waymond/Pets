import { IBHRawListDataRecord } from '@/type';
import { VaccineRecord, VaccineProfile } from './type.d';
import * as Service from '@/request/vaccine';
import * as NetworkService from '@/request/network';
import { Subscription, Effect, formatMessage } from 'umi';
import { message } from 'antd';
import { defineMessages } from 'react-intl';

interface IModelType {
  namespace: 'vaccine';
  state?: IModelStates;
  reducers?: IModelReducers;
  effects?: IModelEffects;
  subscriptions?: { setup: Subscription };
}

interface IModelStates {
  Vaccine: IBHRawListDataRecord<VaccineRecord> | null;
  AuditVaccine: IBHRawListDataRecord<VaccineRecord> | null;
  VaccineProfile: VaccineProfile | null;
}
interface IModelReducers {
  updateAuditVaccine: Reducer<IModelStates, any>;
  updateVaccine: Reducer<IModelStates, any>;
  updateVaccineProfile: Reducer<IModelStates, any>;
}
interface IModelEffects {
  ListVaccines: Effect;
  CreateVaccine: Effect;
  SearchVaccines: Effect;
  DeleteVaccine: Effect;

  UploadLicense: Effect;

  AuditVaccine: Effect;
  ListAuditVaccines: Effect;
}

const intlMessages = defineMessages({
  RemoveInstancesOk: {
    id: 'mode.instance.RemoveInstancesOk',
    defaultMessage: '移除实例成功',
  },
});

const Model: IModelType = {
  namespace: 'vaccine',
  state: {
    Vaccine: null,
    AuditVaccine: null,
    VaccineProfile: null,
  },
  reducers: {
    updateAuditVaccine: (state: IModelStates, { payload }): IModelStates => {
      const { AuditVaccine } = payload;
      return {
        ...state,
        AuditVaccine,
      };
    },
    updateVaccine: (state: IModelStates, { payload }): IModelStates => {
      const { Vaccine } = payload;
      return {
        ...state,
        Vaccine,
      };
    },
    updateVaccineProfile: (state: IModelStates, { payload }) => {
      const { VaccineProfile } = payload;
      return {
        ...state,
        VaccineProfile,
      };
    },
  },
  effects: {
    *ListVaccines({ payload: { PageNumber, PageSize } }, { call, put }) {
      const response = yield call(Service.ListVaccines, {
        PageNumber,
        PageSize,
      });
      if (response?.data?.code === '200') {
        yield put({
          type: 'updateVaccine',
          payload: {
            Vaccine: response?.data?.data?.data,
          },
        });
        return response?.data?.data?.total;
      }
    },
    *SearchVaccines({ payload: { Keyword } }, { call, put }) {
      const response = yield call(Service.SearchVaccine, {
        Keyword,
      });

      yield put({
        type: 'updateVaccine',
        payload: {
          Vaccine: response?.data?.data?.vaccineList || null,
        },
      });
    },
    // *GetVaccine({ payload: { VaccineId } }, { call, put }) {
    //   const response = yield call(Service.CreateVaccine, { VaccineId });
    //   const profile = response?.data?.data?.vaccine || null;

    //   return profile;
    // },
    *UploadLicense(
      { payload: { VaccineId, PetProfileId, petImage } },
      { call, put },
    ) {
      const response = yield call(Service.UploadLicense, {
        VaccineId,
        PetProfileId,
        petImage,
      });
      if (response?.data?.code == '200') {
        message.success('证明上传成功！');
      } else {
        message.error('证明上传失败');
        return null;
      }
    },
    *CreateVaccine(
      { payload: { vaccineName, vaccineType, vaccinePetType, comment } },
      { call, put },
    ) {
      const response = yield call(Service.CreateVaccine, {
        vaccineName,
        vaccineType,
        vaccinePetType,
        comment,
      });
      const VaccineId = response?.data.data?.vaccineId;
      if (response?.data?.code == '200') {
        message.success('疫苗添加成功！');
        return VaccineId;
      } else {
        message.error('疫苗添加失败');
        return null;
      }
    },
    *DeleteVaccine({ payload: { vaccineId } }, { call, put }) {
      const response = yield call(Service.DeleteVaccine, { vaccineId });
      if (response?.data?.code == '200') {
        message.success('疫苗删除成功！');
      } else {
        message.error('疫苗删除失败');
      }
    },

    *ListAuditVaccines({ payload: { PageNumber, PageSize } }, { call, put }) {
      const response = yield call(Service.ListAuditVaccines, {
        PageNumber,
        PageSize,
      });

      if (response?.data?.code === '200') {
        yield put({
          type: 'updateAuditVaccine',
          payload: {
            AuditVaccine: response?.data?.data?.data || null,
          },
        });
        return response?.data?.data?.total;
      }
    },
    *AuditVaccine({ payload: { vaccineId, status } }, { call, put }) {
      const response = yield call(Service.AuditVaccine, { vaccineId, status });
      if (response?.data?.code == '200') {
        message.success('审查通过！');
      } else {
        message.error('审查驳回');
      }
    },
  },
};

export default Model;
