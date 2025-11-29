import { requestCommentsByVideoId } from '@/apis/requestComments';
import type { CommentItem } from '@/types/comment';
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';

import {
  IconChevronDownStroked,
  IconDislikeThumb,
  IconHeartStroked,
  IconReplyStroked,
  IconShareStroked,
} from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import React from 'react';
import styles from './index.module.scss';

const CommentActionItem = ({
  icon,
  text,
}: { icon: ReactElement; text: string }) => {
  return (
    <button className={styles.commentActionItem} type="button">
      <div className={styles.commentActionIconWrapper}>
        {React.cloneElement(icon, {
          className: styles.commentActionIcon,
          size: 'inherit',
        })}
      </div>
      <div className={styles.commentActionText}>{text}</div>
    </button>
  );
};

function SecondaryCommentList({
  secondaryComments,
}: {
  secondaryComments: CommentItem[];
}) {
  const [expanded, setExpanded] = useState(false);
  if (!expanded) {
    return (
      <div className={styles.expandButtonWrapper}>
        <div className={styles.moreCommentsLine} />
        <Button
          theme="borderless"
          type="tertiary"
          size="small"
          className={styles.expandButton}
          onClick={() => setExpanded(true)}
        >
          展开{secondaryComments.length}条回复
          <IconChevronDownStroked size="small" style={{ marginLeft: '2px' }} />
        </Button>
      </div>
    );
  }
  return (
    <>
      <div className={styles.secondaryCommentList}>
        {secondaryComments.map(comment => (
          <CommentCard key={comment.comment_id} comment={comment} />
        ))}
      </div>
      <div className={styles.expandButtonWrapper}>
        <div className={styles.moreCommentsLine} style={{ opacity: 0 }} />
        <Button
          theme="borderless"
          type="tertiary"
          size="small"
          className={styles.expandButton}
          onClick={() => setExpanded(false)}
        >
          收起
          <IconChevronDownStroked
            size="small"
            style={{ marginLeft: '2px' }}
            rotate={180}
          />
        </Button>
      </div>
    </>
  );
}

function CommentCard({
  comment,
  secondaryComments,
}: { comment: CommentItem; secondaryComments?: CommentItem[] }) {
  return (
    <div className={styles.commentCard}>
      <div className={styles.commentAvatarWrapper}>
        <img
          className={styles.commentAvatar}
          src={comment.avatar}
          alt="avatar"
        />
      </div>
      <div className={styles.commentContentWrapper}>
        <div className={styles.commentContent}>
          <div className={styles.commentUsername}>{comment.nickname}</div>
          <div className={styles.commentText}>{comment.content}</div>
          <div className={styles.commentInfo}>
            <span className={styles.commentTime}>
              {new Date(comment.create_time * 1000).toLocaleDateString()}
            </span>
            ·
            <span className={styles.commentIPLocation}>
              {comment.ip_location}
            </span>
          </div>
          <div className={styles.commentActionsWrapper}>
            <div className={styles.commentActions}>
              <CommentActionItem icon={<IconReplyStroked />} text="回复" />
              <CommentActionItem icon={<IconShareStroked />} text="分享" />
              <CommentActionItem
                icon={<IconHeartStroked />}
                text={comment.like_count.toString()}
              />
              <CommentActionItem icon={<IconDislikeThumb />} text="" />
            </div>
          </div>
          <div>
            {secondaryComments && secondaryComments.length > 0 ? (
              <SecondaryCommentList secondaryComments={secondaryComments} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

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
  return (
    <div
      style={{
        width: '336px',
        height: '100%',
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
  );
}
