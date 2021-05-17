export interface SquareRecord {
  essayId: string;
  userId: string;
  title: string;
  nickname: string;
  createTime: string;
  essayType: string;
  essayContent: string;
  firstPicture: any;
  essayRange: string;
}

export interface SquareProfile extends SquareRecord {}
