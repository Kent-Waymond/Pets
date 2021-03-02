import {
  IPlatformLicenseRecord,
  LicenseStatusType,
  SupportProductType,
} from '@/type';

// 实例许可
interface InstanceLicense {
  instanceId: string; // 实例id
  instanceName: string; // 实例名
  specId: string; // 规格ID
  notBefore: number; // 许可开始时间
  notAfter: number; // 许可结束时间
  serialNumber: string; // 许可序列号码
  status: LicenseStatusType; // 许可状态
  deviceId: string; // 设备ID
  productId: SupportProductType; // 产品ID
  version: string; // 产品版本
  specDescription: string; // 规格描述
}

// 实例许可规格
export interface InstanceLicenseSpecsRecord {
  description: string; // 规格描述：200资产，200并发
  occupyQuota: number; // 占据配额数
  productId: string; // 产品id
  specificationId: string; // 规格id
  version: string; // 许可版本
}
// 实例许可记录
export interface InstanceLicenseRecord extends InstanceLicense {}

// 平台许可详情
export interface IPlatformLicenseProfile extends IPlatformLicenseRecord {
  specificationId: string; // 许可规格ID
}
