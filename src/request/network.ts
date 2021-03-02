import axios from './basicRequest';

// 网络列表 /v1/network/listNetworks
export function ListNetworks({ Keyword, PageNumber, PageSize }: any) {
  return axios.appPost('/network/listNetworks', {
    keywords: Keyword,
    pageNumber: PageNumber,
    pageSize: PageSize,
    listAll: false,
  });
}

// // 网络详情 /v1/network/GetProfile
// export function GetProfile({ id }: any) {
//   return axios.appPost('/network/GetProfile', {
//     id,
//   });
// }

// 网络已关联主机列表 /v1/network/listAttachedHosts
export function ListAttachedHosts({
  networkId,
  keywords,
  ListAll,
  pageNumber,
  pageSize,
}: any) {
  return axios.appPost('/network/listAttachedHosts', {
    networkId,
    keywords,
    pageNumber,
    pageSize,
    listAll: ListAll,
  });
}
// 网络已关联网口表 /v1/network/listAttachedEthernetPorts
export function ListAttachedEthernetPorts({
  networkId,
  keywords,
  ListAll,
  pageNumber,
  pageSize,
}: any) {
  return axios.appPost('/network/listAttachedEthernetPorts', {
    networkId,
    keywords,
    pageNumber,
    pageSize,
    listAll: ListAll,
  });
}

// 创建网络 /v1/network/createNetwork
export function CreateNetwork({
  name,
  type,
  ipMode,
  ipPool,
  subnetMask,
  gateway,
  comment,
}: any) {
  return axios.appPost('/network/createNetwork', {
    name,
    type,
    ipMode,
    ipPool,
    subnetMask,
    gateway,
    comment,
  });
}
// 更新网络 /v1/network/ModifyNetwork
export function ModifyNetwork({
  id,
  name,
  ipPool,
  subnetMask,
  gateway,
  comment,
}: any) {
  return axios.appPost('/network/modifyNetwork', {
    id,
    name,
    ipPool,
    subnetMask,
    gateway,
    comment,
  });
}

// 删除网络 /v1/network/RemoveNetwork
export function RemoveNetwork({ id }: any) {
  return axios.appPost('/network/removeNetwork', {
    id,
  });
}

// 为网络添加网口 /v1/network/attachEthernetPorts
export function AttachEthernetPorts({ networkId, ethernetPorts }: any) {
  return axios.appPost('/network/attachEthernetPorts', {
    networkId,
    ethernetPorts,
  });
}
// 删除网卡 /v1/network/DetachEthernetPorts
export function DetachEthernetPorts({ networkId, ethernetPorts }: any) {
  return axios.appPost('/network/detachEthernetPorts', {
    networkId,
    ethernetPorts,
  });
}
