import { GET_APP_AUTH_TOKEN } from '@/utils/auth';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';

declare module 'axios' {
  interface AxiosStatic {
    appPost: (
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ) => AxiosPromise<any>;
    graphQueryPost: (
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ) => AxiosPromise<any>;
  }
}

// console.log("ww ",process.env.BH_APP_SERVICE_URL)
let ServiceUrl;

if (process.env.APP_SERVICE_URL) {
  ServiceUrl = `${process.env.APP_SERVICE_URL}`;
} else {
  ServiceUrl = `${window.location.host}`;
  console.log(window.location.host, 'window.location.host');
}

ServiceUrl = ServiceUrl.startsWith('http')
  ? ServiceUrl
  : `${window.location.protocol}//${ServiceUrl}`;
console.log(window.location.protocol, 'window.location.protocol');
if (process.env.NODE_ENV === 'production') {
  if (process.env.APP_SERVICE_URL) {
    axios.defaults.baseURL = `${ServiceUrl}`;
  } else {
    axios.defaults.baseURL = `/`;
  }
} else {
  axios.defaults.baseURL = `${ServiceUrl}`;
}

export const DevDefaultReqURL = ServiceUrl;

axios.appPost = (
  url: string,
  data: any,
  config?: AxiosRequestConfig,
): AxiosPromise<any> => {
  // const reqToken = GET_APP_AUTH_TOKEN();

  return axios({
    url: `/api${url}`,
    method: 'post',
    data,
    ...config,
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${reqToken}`,
    },
  });
};

// -------------- 请求influxdb query --------------
export interface IGraphQueryFilter {
  key: string;
  value: string;
  operator: string;
}
// TODO:提取方法至单独文件
function normalizeQuerySql(
  table: string,
  filters: IGraphQueryFilter[],
  columns?: string[],
  limit?: number,
  order?: string,
): string {
  const columnsKey =
    columns instanceof Array && columns.length > 0 ? columns.join(',') : '*';
  let sql = `SELECT ${columnsKey} FROM ${table}`;
  let filterKey = '';
  if (filters instanceof Array && filters.length > 0) {
    filterKey = ' WHERE ';
    const targetFilters = [];
    for (let filter of filters) {
      const { key, value, operator } = filter;
      targetFilters.push(`${key}${operator}${value}`);
    }
    filterKey += targetFilters.join(' AND ');
  }
  // console.log('filterKey', filterKey);

  sql += filterKey;
  if (order) {
    sql += ` ORDER BY ${order}`;
  }
  if (limit) {
    sql += ` LIMIT ${limit}`;
  }

  return `${sql};`;
}
let queryBaseURL = `${DevDefaultReqURL}`;
axios.graphQueryPost = (
  url: string,
  data: any,
  config?: AxiosRequestConfig,
): AxiosPromise<any> => {
  const database = data?.db ? data?.db : 'ud';
  const table = data?.table ? data?.table : 'container_stats';
  const filter = data?.filter ? data?.filter : {};
  const columns = data?.columns ? data?.columns : [];
  const order = data?.order ? data?.order : '';
  let limit = data?.limit ? data?.limit : undefined;
  limit = Number(limit);
  limit = isNaN(limit) ? undefined : limit;
  // console.log(table, filter);
  const formdata = new FormData();
  const sql = normalizeQuerySql(table, filter, columns, limit, order);
  // console.log('sql  ', sql);
  formdata.append('q', sql);

  const reqToken = GET_APP_AUTH_TOKEN();

  return axios({
    baseURL: `${queryBaseURL}`,
    url: `${url}`,
    method: 'post',
    params: {
      db: database,
    },
    data: formdata,
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${reqToken}`,
      // Authorization: `Basic ${user + password}`,
    },
  });
};

export default axios;
