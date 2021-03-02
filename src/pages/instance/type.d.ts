import { ProjectModelType, SupportProductType } from '@/type';

interface Instance {
  id: string;
  name: string;
  createAt: number;
  comment: string;
  address: string;
  consolePort: number;
  protocolPorts: InstanceProtocol[];
  status: InstanceStatusType;
  operationAddress: string;
  productId: SupportProductType;
  licenseRemainDays: number;
  networkName: string;
  networkDriver: number;
  networkId: string;
}

export type InstanceStatusType =
  | 'running'
  | 'stopped'
  | 'starting'
  | 'transferring';

export interface InstanceRecord extends Instance {
  licenseConfig: InstanceLicenseConfig;
}

export interface InstanceProfileType extends Instance {
  runningNodes: InstanceRunningNode[];
  volumes: InstanceVolume[];
  ResourceLimit: InstanceResource;
  LicenseConfig: InstanceLicenseConfig;
}

export interface InstanceProtocol {
  protocolName: string;
  port: number;
}

export interface InstanceRunningNode {
  id: string;
  address: string;
  status: string;
}

export interface InstanceVolume {
  driverName: string;
  path: number;
}
export interface InstanceResource {
  cpu: number;
  memory: number;
  diskSize: number;
}
export interface InstanceLicenseConfig {
  productId: SupportProductType;
  version: string;
  specDescription: string;
  expireAt: number;
  specId: string;
}
