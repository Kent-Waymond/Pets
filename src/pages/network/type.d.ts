import { IPModeType, NetworkTypeKey } from '@/type';

export interface NetworkRecord {
  id: string;
  name: string; // 网络名
  comment: string; //备注
  type: NetworkTypeKey; //网络类型  2:macvlan(应用独占ip)  3:ipvlan(应用独占ip)
  ipMode: IPModeType; //IP设置模式
  ipPool: string; //IP池
  subnetMask: string; //掩码
  gateway: string; //网关
  createAt: number; //创建时间
  ethernetPortCount: number; //网口数
  instanceCount: number; // 实例数
}

export interface ICreateFormRecord {
  ipPool: string;
  gateway: string;
  ipMode: string;
  name: string;
  subnetMask: string;
  type: string;
  comment: string;
}

export interface NetworkProfile extends NetworkRecord {}

export interface NetworkEthernetPortRecord {
  ethernetPort: string;
  hostId: string;
  hostName: string;
}

export interface NetworkInstanceRecord {
  name: string;
  address: string;
  createAt: string;
  id: string;
  status: string;
}
