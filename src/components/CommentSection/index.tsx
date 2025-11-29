import { requestCommentsByVideoId } from '@/apis/requestComments';
import type { CommentItem } from '@/types/comment';
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';

import { sendComments } from '@/apis/sendComments';
import AtSVG from '@/assets/icons/at.svg?react';
import BrokenHeartSVG from '@/assets/icons/brokenHeart.svg?react';
import BrokenHeartStrokedSVG from '@/assets/icons/brokenHeartStroked.svg?react';
import EmojiStrokedSVG from '@/assets/icons/emojiStroked.svg?react';
import HeartSVG from '@/assets/icons/heart.svg?react';
import HeartStrokedSVG from '@/assets/icons/heartStroked.svg?react';
import InfoCirCleStrokedSVG from '@/assets/icons/infoCircleStroked.svg?react';
import PictureStrokedSVG from '@/assets/icons/pictureStroked.svg?react';
import ReplyStrokedSVG from '@/assets/icons/replyStroked.svg?react';
import ShareStrokedSVG from '@/assets/icons/shareStroked.svg?react';
import {
  IconArrowUp,
  IconChevronDownStroked,
  IconInfoCircle,
  IconMoreStroked,
} from '@douyinfe/semi-icons';
import { Button, Dropdown, Input, Toast } from '@douyinfe/semi-ui';
import copy from 'copy-to-clipboard';
import React from 'react';
import IconWrapper from '../IconWrapper';
import styles from './index.module.scss';

const CommentActionItem = ({
  icon,
  text,
  onClick,
}: { icon: ReactElement; text?: string; onClick?: () => void }) => {
  return (
    <button
      className={styles.commentActionItem}
      type="button"
      onClick={onClick}
    >
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

function SecondaryCommentList({
  secondaryComments,
}: {
  secondaryComments: CommentItem[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [expandedCount, setExpandedCount] = useState(3);
  const increment = [3, 10, 20, 50, 100];
  const [expandedTimes, setExpandedTimes] = useState(0);
  return (
    <>
      {expanded === false ? (
        <></>
      ) : (
        <div className={styles.secondaryCommentList}>
          {secondaryComments.slice(0, expandedCount).map(comment => (
            <CommentCard key={comment.comment_id} comment={comment} />
          ))}
        </div>
      )}
      <div className={styles.expandButtonWrapper}>
        <div className={styles.moreCommentsLine} />
        {!expanded || expandedCount < secondaryComments.length ? (
          <Button
            theme="borderless"
            type="tertiary"
            size="small"
            className={styles.expandButton}
            onClick={() => {
              if (expanded === true) {
                setExpandedTimes(expandedTimes + 1);
                setExpandedCount(
                  expandedCount +
                    increment[Math.min(expandedTimes, increment.length - 1)],
                );
              }
              setExpanded(true);
            }}
          >
            {expanded ? '展开更多' : `展开${secondaryComments.length}条回复`}
            <IconChevronDownStroked
              size="small"
              style={{ marginLeft: '2px' }}
            />
          </Button>
        ) : (
          <></>
        )}
        {expanded && expandedCount > 0 ? (
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
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

function CommentCard({
  comment,
  secondaryComments,
}: { comment: CommentItem; secondaryComments?: CommentItem[] }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const dropdownRef = React.useRef<Dropdown | null>(null);
  const commentContentRef = React.useRef<HTMLSpanElement | null>(null);
  const [visible, setVisible] = useState(false);
  const handleVisibleChange = (open: boolean) => {
    setVisible(open);
  };
  const handleCopyComment = () => {
    // navigator.clipboard.writeText(comment.content);
    setVisible(false);
    if (copy(comment.content)) {
      Toast.success({ content: '评论已复制到剪贴板', duration: 3 });
    }
  };
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
          <Dropdown
            ref={dropdownRef}
            onVisibleChange={handleVisibleChange}
            visible={visible}
            position="bottomRight"
            className={`${styles.dropdownWrapper} semi-always-dark`}
            spacing={0}
            render={
              <Dropdown.Menu style={{ padding: '8px' }}>
                <Dropdown.Item
                  style={{ background: 'transparent', padding: '4px' }}
                >
                  <Button
                    className={styles.commentMenuItem}
                    type="tertiary"
                    theme="borderless"
                    size="small"
                    onClick={handleCopyComment}
                  >
                    复制评论
                  </Button>
                </Dropdown.Item>
              </Dropdown.Menu>
            }
          >
            <div className={styles.commentMenu}>
              <IconMoreStroked
                className={styles.commentMenuIcon}
                style={visible ? { color: 'var(--semi-color-text-0)' } : {}}
              />
            </div>
          </Dropdown>
          <div className={styles.commentUsername}>{comment.nickname}</div>
          {disliked ? (
            <div
              style={{
                fontSize: '12px',
                lineHeight: '20px',
                margin: '0 0 5px 4px',
                color: 'var(--semi-color-text-3)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <IconWrapper
                icon={<InfoCirCleStrokedSVG />}
                style={{
                  marginRight: '2px',
                  opacity: 0.6,
                }}
              />
              该评论被折叠
            </div>
          ) : (
            <>
              <div className={styles.commentText}>
                <span ref={commentContentRef}>{comment.content}</span>
              </div>
              <div className={styles.commentInfo}>
                <span className={styles.commentTime}>
                  {new Date(comment.create_time * 1000).toLocaleDateString()}
                </span>
                ·
                <span className={styles.commentIPLocation}>
                  {comment.ip_location}
                </span>
              </div>
            </>
          )}

          <div className={styles.commentActionsWrapper}>
            <div
              className={styles.commentActions}
              style={disliked ? { marginTop: '0' } : {}}
            >
              {disliked ? (
                <></>
              ) : (
                <>
                  <CommentActionItem
                    icon={<IconWrapper icon={<ReplyStrokedSVG />} />}
                    text="回复"
                  />
                  <CommentActionItem
                    icon={<IconWrapper icon={<ShareStrokedSVG />} />}
                    text="分享"
                  />
                </>
              )}

              {liked ? (
                <CommentActionItem
                  icon={
                    <IconWrapper
                      icon={<HeartSVG />}
                      style={{
                        animation: 'bounce-scale .3s ease ',
                        transformOrigin: '8px 16px',
                      }}
                    />
                  }
                  text={(comment.like_count + 1).toString()}
                  onClick={() => setLiked(!liked)}
                />
              ) : (
                <CommentActionItem
                  icon={<IconWrapper icon={<HeartStrokedSVG />} />}
                  text={comment.like_count.toString()}
                  onClick={() => setLiked(!liked)}
                />
              )}
              {disliked ? (
                <CommentActionItem
                  icon={<IconWrapper icon={<BrokenHeartSVG />} />}
                  onClick={() => setDisliked(!disliked)}
                />
              ) : (
                <CommentActionItem
                  icon={<IconWrapper icon={<BrokenHeartStrokedSVG />} />}
                  onClick={() => setDisliked(!disliked)}
                />
              )}
            </div>
          </div>
        </div>
        <div>
          {secondaryComments && secondaryComments.length > 0 ? (
            <SecondaryCommentList secondaryComments={secondaryComments} />
          ) : null}
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
