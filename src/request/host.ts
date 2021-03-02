import axios from './basicRequest';

// 主机列表 /v1/host/listHosts
export function ListHosts({
  Keyword,
  PageNumber,
  PageSize,
  OrderFields,
  ListAll = false,
}: any) {
  return axios.appPost('/host/listHosts', {
    keywords: Keyword,
    pageNumber: PageNumber,
    pageSize: PageSize,
    orderFields: OrderFields,
    listAll: ListAll,
  });
}
// 主机列表(节点列表) /v1/host/hostInfo
export function GetHostInfo({ NodeId }: any) {
  return axios.appPost('/host/hostInfo', {
    id: NodeId,
  });
  // return axios.appPost('')
}

// 创建主机 /v1/host/createHost
export function CreateHost({
  name,
  address,
  sshPort,
  accountName,
  accountPassword,
  accountPrivatekey,
  accountPrivatekeyPass,
}: any) {
  return axios.appPost('/host/createHost', {
    name,
    address,
    sshPort,
    accountName,
    accountPassword,
    accountPrivatekey,
    accountPrivatekeyPass,
  });
}

// 节点上的实例列表
export function ListInstancesOnNode({
  NodeId,
  Keyword,
  PageNumber,
  PageSize,
  OrderFields,
}: any) {
  return axios.appPost('/host/listInstancesOnNode', {
    nodeId: NodeId,
    keywords: Keyword,
    pageNumber: PageNumber,
    pageSize: PageSize,
    orderFields: OrderFields,
  });
}

// 创建主机进度 create progress
export function getCreateProgress({ id }: any) {
  return axios.appPost('/progress/getObjectCreateProgress', {
    objectId: id,
    objectType: 'host',
  });
}

// 删除主机 /v1/host/removeHost
export function RemoveHost({ id }: any) {
  return axios.appPost('/host/removeHost', { id });
}
// 加入网络 /v1/host/attachNetwork
export function AttachNetwork({
  hostId,
  networkId,
  ethernetPort,
  vlanId,
}: any) {
  return axios.appPost('/host/attachNetwork', {
    hostId,
    networkId,
    ethernetPort,
    vlanId,
  });
}
// 主机网口列表 /v1/host/ethernetPorts
export function ListEthernetPorts({ hostId }: any) {
  return axios.appPost('/host/ethernetPorts', { id: hostId });
}
// 主机未被关联的网口列表 /v1/host/listUnattachedEthernetPorts
export function ListUnattachedEthernetPorts({ hostId }: any) {
  return axios.appPost('/host/listUnattachedEthernetPorts', { id: hostId });
}

// 主机创建链路聚合
export function CreateNetworkBond({ id, name, mode, slave }: any) {
  return axios.appPost('/host/createNetworkBond', {
    id,
    name,
    mode,
    slave,
  });
}

// 删除链路聚合
export function RemoveNetworkBond({ id, name }: any) {
  return axios.appPost('/host/removeNetworkBond', { id, name });
}
// 更新主机网口状态 /v1/host/updateEthernetPortState
export function UpdateEthernetPortState({ NodeId, ethernetPort, state }: any) {
  return axios.appPost('/host/updateEthernetPortState', {
    hostId: NodeId,
    ethernetPort,
    state,
  });
}
// 设置主机网口ip /v1/host/setEthernetPortIP
export function UpdateEthernetPortIP({ NodeId, ethernetPort, ip, mask }: any) {
  return axios.appPost('/host/setEthernetPortIP', {
    hostId: NodeId,
    ethernetPort,
    ip,
    mask,
  });
}
// 标记主机网口 /v1/host/remarkEthernetPort
export function RemarkEthernetPort({ NodeId, ethernetPort, remark }: any) {
  return axios.appPost('/host/remarkEthernetPort', {
    hostId: NodeId,
    ethernetPort,
    remark,
  });
}
// 配置主机数据盘
export function ConfigDataDisk({
  mountPoint,
  hostId,
  diskName,
  comment,
  filesystem,
}: any) {
  return axios.appPost('/host/configDataDisk', {
    mountPoint,
    hostId,
    diskName,
    comment,
    filesystem,
  });
}

// 创建VLAN
export function CreateVLAN({ hostId, ethernetPort, vlanId, vlanName }: any) {
  return axios.appPost('/host/createVlan', {
    hostId,
    ethernetPort,
    vlanId,
    vlanName,
  });
}
