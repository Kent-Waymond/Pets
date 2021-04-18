export interface CommunityRecord {
  essay_id: string;
  user_id: string;
  essay_type: string;
  essay_content: string;
  essay_range: string;
}

export interface CommunityProfile extends CommunityRecord {}
