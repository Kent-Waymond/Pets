import axios from './basicRequest';

// 实例许可列表 /v1/license/ListInstanceLicenses
export function ListInstanceLicenses({ Keyword, PageNumber, PageSize }: any) {
  return axios.appPost('/license/listInstanceLicenses', {
    keywords: Keyword,
    pageNumber: PageNumber,
    pageSize: PageSize,
  });
}

// 实例许可规格列表 /v1/license/listInstanceSpecs
export function ListInstanceLicenseSpecs({
  productId,
  version = '1.0.0',
}: any) {
  return axios.appPost('/license/listInstanceSpecs', { productId, version });
}
// 平台许可列表 /v1/license/listPlatformLicenses
export function ListPlatformLicenses({ productId, version = '1.0.0' }: any) {
  return axios.appPost('/license/listPlatformLicenses', { productId, version });
}

// 平台许可详情 /v1/license/platformLicenseInfo
export function GetPlatformLicenseInfo({ productId, version = '1.0.0' }: any) {
  try {
    return axios.appPost('/license/platformLicenseInfo', {
      productId,
      version,
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

// 导入平台许可包 /v1/license/importPlatformLicense
export function importPlatformLicense({
  license,
  productId,
  version = '1.0.0',
}: any) {
  return axios.appPost('/license/importPlatformLicense', {
    license,
    productId,
    version,
  });
}
