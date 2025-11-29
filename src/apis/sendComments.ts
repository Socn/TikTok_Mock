import { mockRequest } from '@/utils/mockRequests';

export async function sendComments(
  videoId: string,
  commentText: string,
): Promise<{ success: boolean; message: string }> {
  // Simulate sending comment
  console.log(`Sending comment "${commentText}" to video ID: ${videoId}`);

  // Simulate success response
  return await mockRequest({
    success: true,
    message: 'Comment sent successfully',
  });
}
