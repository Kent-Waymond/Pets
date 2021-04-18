//
import { RouteComponentProps } from 'react-router';
import { IRoute } from 'umi';

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
