// 网口类型：
// device（物理网口）；
// bond（bond口）；
// vlan（vlan口）
export enum EnumNodeEthernetType {
  device = 'device',
  bond = 'bond',
  vlan = 'vlan',
}
// 联网状态: up, down
export enum EnumNodeEthernetNetworkState {
  up = 'up',
  down = 'down',
}

// 链路聚合类型：bond, team
export enum EnumNodeEthernetBondType {
  bond = 'bond',
  team = 'team',
}
// 数据盘类型：xfs, glusterfs
export enum EnumNodeDataDiskType {
  xfs = 'xfs',
  glusterfs = 'glusterfs',
}
