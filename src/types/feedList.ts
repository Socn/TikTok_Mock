// 顶层响应

export interface AwemeResponse {
  aweme_list: AwemeItem[];
  has_more: number;
  log_pb: {
    impr_id: string;
  };
  status_code: number;
}

// 单条 aweme
export interface AwemeItem {
  aweme_id: string;
  aweme_type: number;
  title: string;
  desc: string;
  create_time: number;
  user_id: string;
  sec_uid: string;
  short_user_id: null;
  user_unique_id: null;
  user_signature: null;
  nickname: string;
  avatar: string;
  liked_count: number;
  collected_count: number;
  comment_count: number;
  share_count: number;
  ip_location: string;
  last_modify_ts: number;
  aweme_url: string;
  cover_url: string;
  video_download_url: string;
  music_download_url: string;
  note_download_url: string;
  source_keyword: string;
}
