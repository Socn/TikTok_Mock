import type { CommentItem } from '@/types/comment';
import { Button, Dropdown, Toast } from '@douyinfe/semi-ui';
import copy from 'copy-to-clipboard';
import React from 'react';
import type { ReactElement } from 'react';
import { useState } from 'react';

import styles from './commentCard.module.scss';

import BrokenHeartSVG from '@/assets/icons/brokenHeart.svg?react';
import BrokenHeartStrokedSVG from '@/assets/icons/brokenHeartStroked.svg?react';
import HeartSVG from '@/assets/icons/heart.svg?react';
import HeartStrokedSVG from '@/assets/icons/heartStroked.svg?react';
import InfoCirCleStrokedSVG from '@/assets/icons/infoCircleStroked.svg?react';
import ReplyStrokedSVG from '@/assets/icons/replyStroked.svg?react';
import ShareStrokedSVG from '@/assets/icons/shareStroked.svg?react';
import chineseFormatDistanceToNow from '@/utils/chineseFormatDistanceToNow';
import { IconCopyStroked, IconMoreStroked } from '@douyinfe/semi-icons';
import IconWrapper from '../IconWrapper';
import { SecondaryCommentList } from './commentList';

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

export function CommentCard({
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
                  {chineseFormatDistanceToNow(
                    new Date((comment.create_time ?? 0) * 1000),
                  )}
                </span>
                <span className={styles.commentIPLocation}>
                  {comment.ip_location === '' ? '' : `·${comment.ip_location}`}
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
                    icon={<IconCopyStroked />}
                    text="复制"
                    onClick={handleCopyComment}
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
