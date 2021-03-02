interface IServiceNetwork {
  id: string;
  name: string;
  createAt: number;
  comment: string;
  subnet: string;
  gateway: string;
}

export interface IServiceNetworkRecord extends IServiceNetwork {}
