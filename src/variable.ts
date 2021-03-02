// fishpond 支持的产品列表
export enum EnumSupportProducts {
  USM = 'USM',
  WAF = 'WAF',
  NGFW = 'NGFW',
}

// fishpond 所有model
export enum EnumProjectModels {
  global = 'global',
  account = 'account',
  dashboard = 'dashboard',
  instance = 'instance',
  node = 'node',
}

// fishpond 网络类型
/*
网络类型 
1:自动分配端口（autoport）； 
2:macvlan(应用独占ip); 
3:ipvlan(应用独占ip)
**/
export enum EnumNetworkTypes {
  autoport = 1,
  macvlan = 2,
  ipvlan = 3,
}

// fishpond 网络模式
/*
ip设置模式：
dhcp：dchp
manual：手动设置
**/
export enum EnumIPModes {
  dhcp = 'dhcp',
  manual = 'manual',
}

// fishpond 镜像类型
// 镜像类型：
// file ：文件类型镜像
// repository：镜像仓库类型镜像
export enum EnumProductImageTypes {
  file = 'file',
  repository = 'repository',
}

// fishpond 许可状态
// 许可状态：
// EXPIRED:已过期
// NORMAL:正常
// REPEALED:已吊销
export enum EnumLicenseStatus {
  EXPIRED = 'EXPIRED',
  NORMAL = 'NORMAL',
  REPEALED = 'REPEALED',
}

// 默认table分页大小
export const TABLE_PAGE_SIZE = 50;
