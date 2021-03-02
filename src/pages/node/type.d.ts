import {
  EnumNodeDataDiskType,
  EnumNodeEthernetBondType,
  EnumNodeEthernetNetworkState,
  EnumNodeEthernetType,
} from './variable';

export interface INodeRecord {
  id: string;
  address: string;
  name: string;
  createAt: number;
  status: 'down' | 'ready';
}

export interface INodeProfile extends INodeRecord {
  accountName: string;
  sshPort: number;
  ethernetPorts?: INodeProfileEthernetPorts[];
  attachedNetworks?: INodeProfileAttachedNetwork[];
  dataDisk?: INodeProfileDataDisk[];
}

export type NodeEthernetType = keyof typeof EnumNodeEthernetType;
export type NodeEthernetNetworkStateType = keyof typeof EnumNodeEthernetNetworkState;
export type NodeEthernetBondType = keyof typeof EnumNodeEthernetBondType;
export type NodeDataDiskType = keyof typeof EnumNodeDataDiskType;

export interface INodeProfileEthernetPorts {
  id: string;
  name: string;
  type: NodeEthernetType;
  state: NodeEthernetNetworkStateType;
  connection: boolean;
  slaveType: NodeEthernetBondType;
  master: string;
  remark: string;
  createAt?: string;
  addrs?: string[];
}

export interface INodeProfileAttachedNetwork {
  ethernetPort: string;
  networkName: string;
  networkId: number;
}

export interface INodeProfileDataDisk {
  name: string;
  mountPoint: string;
  filesystem: NodeDataDiskType;
}
