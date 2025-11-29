import CommentsData from '@/assets/datas/comments.json';
import type { CommentItem, CommentsList } from '@/types/comment';
import { mockRequest } from '@/utils/mockRequests';
export async function requestCommentsByVideoId(
  videoId: string,
): Promise<CommentsList> {
  const comments = (CommentsData as unknown as CommentsList['comments']).filter(
    (comment: CommentItem) => comment.aweme_id === videoId,
  );

  // Remove duplicate comment_id entries
  const seenIds = new Set();
  const uniqueDataById = [];

  for (const item of comments) {
    if (!seenIds.has(item.comment_id)) {
      seenIds.add(item.comment_id);
      uniqueDataById.push(item);
    }
  }
  return await mockRequest({
    comments: uniqueDataById,
  });
}
