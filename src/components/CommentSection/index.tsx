import { requestCommentsByVideoId } from '@/apis/requestComments';
import type { CommentItem } from '@/types/comment';
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';

import { sendComments } from '@/apis/sendComments';
import AtSVG from '@/assets/icons/at.svg?react';
import EmojiStrokedSVG from '@/assets/icons/emojiStroked.svg?react';
import PictureStrokedSVG from '@/assets/icons/pictureStroked.svg?react';
import { IconArrowUp } from '@douyinfe/semi-icons';
import { Button, Input } from '@douyinfe/semi-ui';
import React from 'react';
import IconWrapper from '../IconWrapper';
import { CommentCard } from './commentCard';
import styles from './index.module.scss';

const SendCommentActionItem = ({ icon }: { icon: ReactElement }) => {
  const real_icon = React.cloneElement(icon, {
    className: styles.sendCommentActionButtonIcon,
    size: 'inherit',
  });
  return (
    <Button
      type="tertiary"
      size="small"
      className={styles.sendCommentActionButton}
    >
      {real_icon}
    </Button>
  );
};

export default function CommentSection({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [firstLevelComments, setFirstLevelComments] = useState<CommentItem[]>(
    [],
  );
  useEffect(() => {
    // Fetch comments by videoId
    async function f() {
      const data = await requestCommentsByVideoId(videoId);
      setComments(data.comments);
      setFirstLevelComments(
        data.comments.filter(comment => comment.parent_comment_id === '0'),
      );
      console.log(data);
    }
    f();
  }, [videoId]);

  const [commentText, setCommentText] = useState('');
  const handleCommentTextChange = (value: string) => {
    setCommentText(value);
  };
  const handleSendComment = async () => {
    await sendComments(videoId, commentText);
    const newComments = [
      {
        comment_id: `local_${Date.now().toString()}`,
        create_time: Date.now() / 1000,
        ip_location: '本地',
        aweme_id: videoId,
        content: commentText,
        user_id: 'local_user',
        sec_uid: 'local_sec_uid',
        short_user_id: 'local_short_user_id',
        user_unique_id: 'local_unique_id',
        user_signature: null,
        nickname: '本地用户',
        avatar:
          'https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/aweme_default_avatar.png.jpeg?from=2064092626',
        sub_comment_count: '0',
        like_count: 0,
        last_modify_ts: Date.now(),
        parent_comment_id: '0',
        pictures: '',
      },
      ...comments,
    ];
    setComments(newComments);
    setFirstLevelComments(
      newComments.filter(comment => comment.parent_comment_id === '0'),
    );
    setCommentText('');
    console.log(newComments);
  };
  return (
    <>
      <div
        style={{
          margin: '12px 0 8px 0',
          padding: '0 16px',
          fontSize: '12px',
        }}
      >{`全部评论(${comments.length})`}</div>
      <div
        style={{
          width: '336px',
          height: 'calc(100% - 60px - 38px)',
          overflow: 'scroll',
        }}
        className="swiper-no-mousewheel"
      >
        <div className={styles.commentList}>
          {firstLevelComments.map(comment => (
            <CommentCard
              key={comment.comment_id}
              comment={comment}
              secondaryComments={comments.filter(
                secondary => secondary.parent_comment_id === comment.comment_id,
              )}
            />
          ))}
        </div>
      </div>
      <div className={styles.sendCommentSection}>
        <Input
          className={styles.sendCommentInput}
          placeholder="留下你的精彩评论吧"
          value={commentText}
          onChange={handleCommentTextChange}
          suffix={
            <>
              <SendCommentActionItem
                icon={<IconWrapper icon={<PictureStrokedSVG />} />}
              />
              <SendCommentActionItem icon={<IconWrapper icon={<AtSVG />} />} />
              <SendCommentActionItem
                icon={<IconWrapper icon={<EmojiStrokedSVG />} />}
              />
              {commentText ? (
                <Button
                  type="primary"
                  size="small"
                  onClick={handleSendComment}
                  className={styles.sendCommentButton}
                >
                  <IconArrowUp
                    size="inherit"
                    style={{ color: 'var(--semi-color-text-0)' }}
                  />
                </Button>
              ) : null}
            </>
          }
        />
      </div>
    </>
  );
}
