//
import { RouteComponentProps } from 'react-router';
import { IRoute } from 'umi';
import {
  EnumNetworkTypes,
  EnumProjectModels,
  EnumSupportProducts,
  EnumProductImageTypes,
  EnumLicenseStatus,
  EnumIPModes,
} from './variable';
// 用于List接口返回数据类型
// 例如{Count: 10, Users: [........]}
export type IBHRawListDataRecord<T> = (
  | { Count: number }
  | { count: number }
) & {
  [key: string]: T[];
};

// APP 路由组件props
export interface AppRouteComponentProps extends RouteComponentProps {
  route: IRoute;
  routes: IRoute[];
  children?: React.ReactNode;
}

// 支持的产品类型
export type SupportProductType = keyof typeof EnumSupportProducts;
// 所有model
export type ProjectModelType = keyof typeof EnumProjectModels;

// 所有网络类型
// export type NetworkTypeKey = tuple222[keyof typeof EnumNetworkTypes];
export type NetworkTypeKey =
  | EnumNetworkTypes.autoport
  | EnumNetworkTypes.macvlan
  | EnumNetworkTypes.ipvlan;
// 网络模式
export type IPModeType = keyof typeof EnumIPModes;

// 镜像类型
export type ProductImageType = keyof typeof EnumProductImageTypes;

// 许可状态
export type LicenseStatusType = keyof typeof EnumLicenseStatus;

// 平台许可
export interface IPlatformLicenseRecord {
  productId: SupportProductType; // 产品Id
  serialNumber: string; // 许可序列号
  notBefore: number; // 许可开始时间
  notAfter: number; // 许可过期时间
  quotaFree: number; // 剩余配额
  quotaSize: number; // 总配额
  issuer: string; //  签发者
  status: LicenseStatusType; // NORMAL 正常 EXPIRED 过期
  customer: string; // 客户
  specificationId: string;
}

export interface IPlatformNetworkRecord {
  id: string;
  name: string;
  comment: string;
  createAt: number;
  type: NetworkTypeKey;
}

export interface IPlatformImageRecord {
  id: string; // 镜像id
  name: string; // 镜像名
  productId: SupportProductType; // 产品Id
  version: string; // 镜像版本
  type: ProductImageType; // 镜像类型： file ：文件类型镜像 repository：镜像仓库类型镜像
  url: string; // 镜像地址：repository类型
  path: string; //  镜像地址：file类型镜像地址
  createAt: number; // 创建时间
  md5sum: string; // 镜像md5值
  size: number; // 镜像大小
}
