export interface CommunityRecord {
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

export interface CommunityProfile extends CommunityRecord {}

export interface CommentRecord {
  commentId: number;
  avatar: string;
  commentUserId: string;
  content: string;
  createTime: string;
  nickname: string;
  essayId: string;
  parentId: number;
  replyComment: CommentRecord | null;
}
