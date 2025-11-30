import type { CommentItem } from '@/types/comment';
import { useState } from 'react';
import { CommentCard } from './commentCard';

import { IconChevronDownStroked } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import styles from './commentList.module.scss';

export function SecondaryCommentList({
  secondaryComments,
}: {
  secondaryComments: CommentItem[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [expandedCount, setExpandedCount] = useState(3);
  const increment = [3, 10, 20, 50, 100];
  const [expandedTimes, setExpandedTimes] = useState(0);

  const secondaryCommentList =
    expanded === false ? (
      <></>
    ) : (
      <div className={styles.secondaryCommentList}>
        {secondaryComments.slice(0, expandedCount).map(comment => (
          <CommentCard key={comment.comment_id} comment={comment} />
        ))}
      </div>
    );
  const expandButton =
    !expanded || expandedCount < secondaryComments.length ? (
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
        <IconChevronDownStroked size="small" style={{ marginLeft: '2px' }} />
      </Button>
    ) : (
      <></>
    );
  const showLessButton =
    expanded && expandedCount > 0 ? (
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
    );
  return (
    <>
      {secondaryCommentList}
      <div className={styles.expandButtonWrapper}>
        <div className={styles.moreCommentsLine} />
        {expandButton}
        {showLessButton}
      </div>
    </>
  );
}
