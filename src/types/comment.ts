export interface CommentItem {
  comment_id: string;
  create_time: number;
  ip_location: string;
  aweme_id: string;
  content: string;
  user_id: string;
  sec_uid: string;
  short_user_id: string;
  user_unique_id: string;
  user_signature: null;
  nickname: string;
  avatar: string;
  sub_comment_count: string;
  like_count: number;
  last_modify_ts: number;
  parent_comment_id: string;
  pictures: string;
}

export interface CommentsList {
  comments: CommentItem[];
}
