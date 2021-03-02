// TODO:即将废弃

import axios from './basicRequest';

// 节点列表 /v1/node/listNodes
export function ListNodes({ Keyword, PageNumber, PageSize, OrderFields }: any) {
  return axios.appPost('/node/listNodes', {
    keywords: Keyword,
    pageNumber: PageNumber,
    pageSize: PageSize,
    orderFields: OrderFields,
  });
}

// 加入集群 /v1/node/joinCluster
export function JoinCluster({ HostId }: any) {
  return axios.appPost('/node/joinCluster', { hostId: HostId });
}

// 脱离集群 /v1/node/leaveCluster
export function LeaveCluster({ Ids }: any) {
  return axios.appPost('/node/leaveCluster', { ids: Ids });
}
