import type { AwemeItem, AwemeResponse } from '@/types/feedList';
import { mockRequest } from '@/utils/mockRequests';

import VideoDataList from '@/assets/datas/videos.json';

export async function requestFeed(): Promise<AwemeResponse> {
  const response: AwemeResponse = {
    aweme_list: VideoDataList as unknown as AwemeItem[],
    has_more: 1,
    log_pb: {
      impr_id: '20251127200824AFCBC955929B451B9D5A',
    },
    status_code: 0,
  };

  // Remove duplicate aweme_id entries
  const seenIds = new Set();
  const uniqueDataById = [];

  for (const item of response.aweme_list) {
    if (!seenIds.has(item.aweme_id)) {
      seenIds.add(item.aweme_id);
      uniqueDataById.push(item);
    }
  }
  return await mockRequest({
    aweme_list: uniqueDataById,
    has_more: response.has_more,
    log_pb: response.log_pb,
    status_code: response.status_code,
  });
}
