import axios from './basicRequest';
// 实例列表 /v1/instance/listInstances
export function ListInstances({
  Keyword,
  PageNumber,
  PageSize,
  OrderFields,
  ListAll = false,
}: any) {
  // if (process.env.NODE_ENV === 'development') {
  //   return axios.post('/listInstances', {
  //     keywords: Keyword,
  //     pageNumber: PageNumber,
  //     pageSize: PageSize,
  //     orderFields: OrderFields,
  //     listAll: ListAll,
  //   });
  // }
  return axios.appPost('/instance/listInstances', {
    keywords: Keyword,
    pageNumber: PageNumber,
    pageSize: PageSize,
    orderFields: OrderFields,
    listAll: ListAll,
  });
}

// 实例详情 /v1/instance/instanceInfo
export function GetInstance({ InstanceId }: any) {
  return axios.appPost('/instance/instanceInfo', { id: InstanceId });
}

// 创建实例 /v1/instance/createInstance
export function CreateInstance({
  name,
  comment,
  licenseConfig,
  resourceLimit,
  networkDriver,
  networkId,
  ip,
  hostId,
  imageId,
}: any) {
  return axios.appPost('/instance/createInstance', {
    name,
    comment,
    licenseConfig,
    resourceLimit,
    networkDriver,
    networkId,
    ip,
    hostId,
    imageId,
  });
}

// 创建实例进度 create progress
export function getCreateProgress({ id }: any) {
  return axios.appPost('/progress/getObjectCreateProgress', {
    objectId: id,
    objectType: 'instance',
  });
}

// 删除实例 /v1/instance/removeInstance
export function RemoveInstances({ Ids }: any) {
  return axios.appPost('/instance/removeInstance', { Ids });
}

// 删除实例 /v1/instance/removeInstance
export function StopInstances({ id }: any) {
  return axios.appPost('/instance/stopInstance', { id });
}

// 删除实例 /v1/instance/removeInstance
export function StartInstances({ id }: any) {
  return axios.appPost('/instance/startInstance', { id });
}

// 实例硬盘扩容 /v1/instance/extendDiskSize
export function ExtendDiskSize({ id, extendSize }: any) {
  return axios.appPost('/instance/extendDiskSize', { id, extendSize });
}

// 实例变配 /v1/instance/changeInstanceSpec
export function ChangeInstanceSpec({ id, specId, expireAt }: any) {
  return axios.appPost('/instance/changeInstanceSpec', {
    id,
    specId,
    expireAt,
  });
}
