export interface IAppMenuRecord {
  path: string;
  name: string;
  hideInMenu: boolean;
  icon?: string;
  routes?: IAppMenuRecord[];
}
