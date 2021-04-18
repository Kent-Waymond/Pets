export interface FeedbackRecord {
  title: string;
  phone: string;
  content: string;
  complainType: string;
  complainId: string;
  image: string;
}

export interface FeedbackProfile extends FeedbackRecord {}
