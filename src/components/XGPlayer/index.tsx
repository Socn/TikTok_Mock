import type { AwemeItem } from '@/types/feedList';
import React, { type ReactElement, useEffect } from 'react';
import Mp4Plugin from 'xgplayer-mp4';
import Player from 'xgplayer/es/player';
import DefaultPreset from 'xgplayer/es/presets/default-en';
import 'xgplayer/dist/index.min.css';
import './index.player.scss';
import useFullscreen, { fullScreenAtom } from '@/hooks/useFullscreen';
import { showCommentAtom } from '@/pages/RecommendPage';
import {
  IconClose,
  IconComment,
  IconLikeHeart,
  IconShare,
  IconStar,
} from '@douyinfe/semi-icons';
import { Button, TabPane, Tabs } from '@douyinfe/semi-ui';
import { useAtom } from 'jotai';
import CommentSection from '../CommentSection';
import styles from './index.module.scss';

const approx = require('approximate-number');

const ActionItem = ({
  icon,
  text,
  onClick,
}: { icon: ReactElement; text: string; onClick?: () => void }) => {
  return (
    <button className={styles.actionItem} onClick={onClick} type="button">
      <div className={styles.actionIconWrapper}>
        {React.cloneElement(icon, {
          className: styles.actionIcon,
          size: 'inherit',
        })}
      </div>
      <div className={styles.actionCount}>{text}</div>
    </button>
  );
};

const VideoPlayer = ({
  video,
}: {
  video: AwemeItem | undefined | null;
}) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const playerRef = React.useRef<HTMLDivElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (video !== null && video !== undefined) {
      const player = new Player({
        id: video.aweme_id,
        url: 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
        height: '100%',
        width: '100%',
        volume: 0.3,
        presets: [DefaultPreset],
        plugins: [Mp4Plugin],
        mp4plugin: {
          maxBufferLength: 50,
          minBufferLength: 10,
        },
        progress: {
          isDraggingSeek: true,
          isPauseMoving: false,
          isCloseClickSeek: false,
        },
        fullscreen: {
          switchCallback: () => {
            toggleFullscreen(document.body);
          },
        },
      });
    }
  }, [video]);

  if (video === null || video === undefined) {
    return <></>;
  }
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        zIndex: 'unset',
        position: 'absolute',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <div id={video.aweme_id} className={styles.player} ref={playerRef} />
      </div>
    </div>
  );
};

export default function XGPlayer({
  videoInfo,
  isActive,
  isVisible,
}: {
  videoInfo: AwemeItem | null | undefined;
  isActive: boolean;
  isVisible: boolean;
}) {
  const [showComments, setShowComments] = useAtom(showCommentAtom);
  const [loaded, setLoaded] = React.useState(isActive || isVisible);
  const [fullScreen, setFullScreen] = useAtom(fullScreenAtom);

  useEffect(() => {
    if ((isActive || isVisible) && !loaded) {
      setLoaded(true);
    }
  }, [isActive, isVisible, loaded]);

  const switchCommentSection = () => {
    console.log('Switch Comment Section');
    setShowComments(!showComments);
  };
  return (
    <div
      style={{
        borderRadius: fullScreen ? '0px' : '16px',
        overflow: 'hidden',
        display: 'flex',
        height: fullScreen ? '100%' : 'calc(100% - 12px)',
        width: fullScreen ? '100%' : 'calc(100% - 60px)',
        background: fullScreen ? 'black' : 'transparent',
      }}
      className={styles.container}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          transition: 'width 0.2s ease-out',
          ...(showComments
            ? { width: 'calc(100% - 336px)' }
            : { width: '100%' }),
        }}
        className="videoPlayerContainer"
      >
        <div className={styles.overlay}>
          <div className={styles.bottomFade} />
          <div className={styles.videoInfo}>
            <div className={styles.videoAuthorAndDate}>
              @{videoInfo?.nickname}
              <div className={styles.uploadDate}>
                ·{' '}
                {new Date(
                  (videoInfo?.create_time ?? 0) * 1000,
                ).toLocaleDateString()}
              </div>
            </div>
            <div className={styles.videoDesc}>{videoInfo?.desc}</div>
          </div>
          <div className={styles.actionList}>
            <div className={styles.avatar}>
              <img
                src={videoInfo?.avatar}
                alt="avatar"
                className={styles.avatarImg}
              />
            </div>
            <ActionItem
              icon={<IconLikeHeart />}
              text={approx(videoInfo?.liked_count)}
            />

            <ActionItem
              icon={<IconComment />}
              text={approx(videoInfo?.comment_count)}
              onClick={() => switchCommentSection()}
            />

            <ActionItem
              icon={<IconStar />}
              text={approx(videoInfo?.collected_count)}
            />

            <ActionItem
              icon={<IconShare />}
              text={approx(videoInfo?.share_count)}
            />
          </div>
        </div>

        <div>
          <VideoPlayer video={videoInfo} />
        </div>
      </div>

      <img
        src={videoInfo?.cover_url}
        alt="cover"
        className={styles.backgroundImg}
      />

      {showComments ? (
        <div className={styles.commentSection}>
          <Tabs
            style={{ height: '100%' }}
            contentStyle={{ height: 'calc(100% - 46px)', padding: '0' }}
            tabBarExtraContent={
              <Button
                type="tertiary"
                theme="borderless"
                className={styles.closeCommentButton}
                onClick={() => setShowComments(false)}
              >
                <IconClose />
              </Button>
            }
          >
            <TabPane
              tab="评论"
              itemKey="comments"
              className={styles.commentTabPane}
            >
              <div className={styles.tabContent}>
                {loaded ? (
                  <CommentSection videoId={videoInfo?.aweme_id ?? ''} />
                ) : (
                  <></>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
