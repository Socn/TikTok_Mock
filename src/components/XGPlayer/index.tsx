import type { AwemeItem } from '@/types/feedList';
import React, { type ReactElement, useEffect } from 'react';
import Mp4Plugin from 'xgplayer-mp4';
import ZH from 'xgplayer/es/lang/zh-cn';
import Player, { Events, I18N } from 'xgplayer/es/player';
import DefaultPreset from 'xgplayer/es/presets/default-en';
import 'xgplayer/dist/index.min.css';
import 'xgplayer/es/plugins/danmu/index.css';
import './index.player.scss';
import { fullScreenAtom, useFullscreen } from '@/hooks/useFullscreen';
import { showCommentAtom } from '@/pages/RecommendPage';
import {
  IconClose,
  IconComment,
  IconLikeHeart,
  IconMore,
  IconPlus,
  IconPulse,
  IconShare,
  IconStar,
} from '@douyinfe/semi-icons';
import { Button, Input, TabPane, Tabs, Tooltip } from '@douyinfe/semi-ui';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import CommentSection from '../CommentSection';
import styles from './index.module.scss';

import EmojiStrokedSVG from '@/assets/icons/emojiStroked.svg?react';
import ExitFullscreenSVG from '@/assets/icons/exitFullscreen.svg';
import FullscreenSVG from '@/assets/icons/fullscreen.svg';
import MuteSVG from '@/assets/icons/mute.svg';
import VolumeHighSVG from '@/assets/icons/volumeHigh.svg';
import VolumeLowSVG from '@/assets/icons/volumeLow.svg';
import chineseFormatDistanceToNow from '@/utils/chineseFormatDistanceToNow';
import { Danmu, Progress } from 'xgplayer';
import IconWrapper from '../IconWrapper';

const approx = require('approximate-number');
const playbackRateAtom = atom(1.0);
const volumeAtom = atomWithStorage('playerVolume', 0.3);

I18N.use(ZH);

const ActionItem = ({
  icon,
  text,
  tooltipText,
  onClick,
}: { icon: ReactElement; text: string; tooltipText: string;onClick?: () => void }) => {
  return (
    <Tooltip position='left' content={tooltipText}>
      <button className={styles.actionItem} onClick={onClick} type="button">
        <div className={styles.actionIconWrapper}>
          {React.cloneElement(icon, {
            className: styles.actionIcon,
            size: 'inherit',
          })}
        </div>
        <div className={styles.actionCount}>{text}</div>
      </button>
    </Tooltip>

  );
};

const VideoPlayer = ({
  video,
  isActive,
  isVisible,
}: {
  video: AwemeItem | undefined | null;
  isActive: boolean;
  isVisible: boolean;
}) => {
  const [ isFullscreen, toggleFullscreen, toggleCssFullscreen ] = useFullscreen();
  const playerRef = React.useRef<HTMLDivElement | null>(null);
  const [playbackRate, setPlaybackRate] = useAtom(playbackRateAtom);
  const [volume, setVolume] = useAtom(volumeAtom);

  const [player, setPlayer] = React.useState<Player | null>(null);

  const [danmuText, setDanmuText] = React.useState<string>('');

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (video !== null && video !== undefined) {

        const newPlayer = new Player({
          lang: 'zh',
          id: video.aweme_id,
          url: 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
          height: '100%',
          width: '100%',
          volume: {
            default: volume,
            showValueLabel: true,
          },
          presets: [DefaultPreset],
          plugins: [Mp4Plugin, Danmu],
          ignores: ['cssFullscreen'],
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
          icons: {
            fullscreen: FullscreenSVG,
            exitFullscreen: ExitFullscreenSVG,
            volumeMuted: MuteSVG,
            volumeSmall: VolumeLowSVG,
            volumeLarge: VolumeHighSVG,
          },
          playbackRate: {
            list: ['0.75', '1.0', '1.25', '1.5', '1.75', '2.0', '3.0'].map(
              item => ({
                text: `${item}x`,
                rate: Number.parseFloat(item),
                iconText: `${item}x`,
              }),
            ),
          },
        });
        setPlayer(newPlayer);
    }
  }, [video]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isActive && player !== undefined && player !== null) {
      if ((player.state === 4 || player.state === 6)) {
        player.replay();
      } else {
        try {
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          player.play().catch((err: any) => {
            console.error('Error playing video:', err);
          });
        } catch (error) {
          console.error('Error playing video', error);
        }
      }
    }
    if (!isActive && player !== undefined && player !== null) {
      player.pause();
    }
    if (player !== undefined && player !== null) {
      player.on(Events.RATE_CHANGE, () => {
        setPlaybackRate(player.playbackRate);
      });
      player.on(Events.VOLUME_CHANGE, () => {
        setVolume(player.volume);
      });
      const volumeIconDOM =
        playerRef.current?.getElementsByClassName('xgplayer-volume')[0];
      if (volumeIconDOM !== undefined && volumeIconDOM !== null) {
        volumeIconDOM.addEventListener('wheel', (e: Event) => {
          if ((e as WheelEvent).deltaY > 10) {
            player.volume = Math.min(1, player.volume + 0.01);
          }
          if ((e as WheelEvent).deltaY < -10) {
            player.volume = Math.max(0, player.volume - 0.01);
          }
        });
        volumeIconDOM.className += ' swiper-no-mousewheel';
      }
    }
  }, [isActive, player]);

  useEffect(() => {
    if (player !== undefined && player !== null) {
      player.playbackRate = playbackRate;
    }
  }, [playbackRate, player]);
  useEffect(() => {
    if (player !== undefined && player !== null) {
      player.volume = volume;
    }
  }, [volume, player]);

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
        <Input
          value={danmuText}
          onChange={value => setDanmuText(value)}
          style={{
            position: 'absolute',
            bottom: '6px',
            left: '180px',
            width: 'calc(100% - 140px - 196px - 80px)',
            height: '34px',
            zIndex: 1000,
            borderRadius: '12px',
          }}
          suffix={
            <Button
              theme="borderless"
              type="tertiary"
              style={{
                margin: '2px 1px',
                height: '30px',
                borderRadius: '11px',
                backgroundColor: 'var(--semi-color-fill-1)',
              }}
            >
              发送
            </Button>
          }
          prefix={
            <IconWrapper
              icon={<EmojiStrokedSVG />}
              style={{
                margin: '0 10px',
                fontSize: '20px',
                color: 'var(--semi-color-text-1)',
              }}
            />
          }
          placeholder="发一条弹幕吧"
          onEnterPress={() => {
            if (player) {
              const danmuPlugin = player.getPlugin('danmu') as Danmu;
              danmuPlugin.sendComment({
                duration: Math.min(10000, danmuText.length * 1000 + 5000),
                id: `${Date.now()}`,
                txt: danmuText,
              });
              setDanmuText('');
            }
          }}
        />
      </div>
    </div>
  );
};

export default function XGPlayer({
  videoInfo,
  isActive,
  isVisible,
  isNext,
  isPrev,
  className,
  onCloseBtnClick,
}: {
  videoInfo: AwemeItem | null | undefined;
  isActive: boolean;
  isVisible: boolean;
  isNext?: boolean;
  isPrev?: boolean;
  className?: string;
  onCloseBtnClick?: () => void;
}) {
  const [showComments, setShowComments] = useAtom(showCommentAtom);
  const [loaded, setLoaded] = React.useState(isActive || isVisible);
  const [fullScreen, toggleFullScreen, toggleCssFullScreen] = useFullscreen();
  const videoDescRef = React.useRef<HTMLDivElement | null>(null);
  const [expandDesc, setExpandDesc] = React.useState(false);
  const [showExpandButton, setShowExpandButton] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [collected, setCollected] = React.useState(false);

  useEffect(() => {
    if ((isActive || isVisible) && !loaded) {
      setLoaded(true);
    }
  }, [isActive, isVisible, loaded]);

  useEffect(() => {
    if (videoDescRef.current) {
      const descElement = videoDescRef.current;
      if ((videoDescRef.current?.clientHeight ?? 0) > 90) {
        setShowExpandButton(true);
      }
    }
  }, []);

  const switchCommentSection = () => {
    console.log('Switch Comment Section');
    setShowComments(!showComments);
    setExpandDesc(false);
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
      className={`${styles.container} ${className}`}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          transition: 'width 0.2s ease-out',
          ...(showComments || expandDesc
            ? { width: 'calc(100% - 336px)' }
            : { width: '100%' }),
        }}
        className="videoPlayerContainer"
      >
        {fullScreen ? (<Button onClick={onCloseBtnClick} size='large'
         theme='borderless'
         type='tertiary'
         className={styles.largeCloseButton}
          ><IconClose size='extra-large' /></Button>) : (<></>)}
        <div className={styles.overlay}>
          <div className={styles.bottomFade} />
          <div
            className={styles.videoInfo}
            style={expandDesc ? { display: 'none' } : {}}
          >
            <div className={styles.videoAuthorAndDate}>
              @{videoInfo?.nickname}
              <div className={styles.uploadDate}>
                ·{' '}
                {chineseFormatDistanceToNow(
                  new Date((videoInfo?.create_time ?? 0) * 1000),
                )}
              </div>
            </div>
            <div className={styles.videoDesc}>{videoInfo?.desc}</div>
            <div className={styles.videoDescForDetect} ref={videoDescRef}>
              {videoInfo?.desc}
            </div>
            {showExpandButton ? (
              <Button
                size="small"
                type="tertiary"
                style={{
                  position: 'absolute',
                  bottom: '0px',
                  left: '300px',
                }}
                onClick={() => setExpandDesc(true)}
              >
                展开
              </Button>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.actionList}>
            <div className={styles.avatar}>
              <img
                src={videoInfo?.avatar}
                alt="avatar"
                className={styles.avatarImg}
              />
              <Button className={styles.followBtn} size="small" type='tertiary'>
                <IconPlus size="inherit" />
              </Button>
            </div>
            <ActionItem
              icon={liked ? <IconLikeHeart style={{color: '#fe2c55', animation: 'likeActionAnim .5s ease'}}/> : <IconLikeHeart />}
              text={approx(videoInfo?.liked_count??0 + (liked ? 1 : 0))}
              onClick={()=>setLiked(!liked)}
              tooltipText='点赞'
            />

            <ActionItem
              icon={<IconComment />}
              text={approx(videoInfo?.comment_count)}
              onClick={() => switchCommentSection()}
              tooltipText='评论'
            />

            <ActionItem
              icon={collected ?<IconStar style={{color: '#f5bb41', animation: 'likeActionAnim .5s ease'}}/> : <IconStar />}
              text={approx(videoInfo?.collected_count??0 + (collected ? 1 : 0))}
              onClick={()=>setCollected(!collected)}
              tooltipText='收藏'
            />

            <ActionItem
              icon={<IconShare />}
              text={approx(videoInfo?.share_count)}
              tooltipText='分享'
            />

            <ActionItem icon={<IconPulse />} text="听抖音"
              tooltipText='听抖音'/>

            <ActionItem icon={<IconMore />} text=""
              tooltipText='更多'/>
          </div>
        </div>

        <div>
          <VideoPlayer
            video={videoInfo}
            isActive={isActive}
            isVisible={isVisible}
          />
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

      {expandDesc ? (
        <div className={styles.commentSection}>
          <div className={styles.videoInfoExpanded}>
            <div className={styles.videoAuthorAndDate}>
              @{videoInfo?.nickname}
              <div className={styles.uploadDate}>
                ·{' '}
                {chineseFormatDistanceToNow(
                  new Date((videoInfo?.create_time ?? 0) * 1000),
                )}
              </div>
            </div>
            <div className={styles.videoDesc}>{videoInfo?.desc}</div>
          </div>
          <Button
            type="tertiary"
            theme="borderless"
            className={styles.closeExpandedDescButton}
            onClick={() => setExpandDesc(false)}
          >
            <IconClose size="large" />
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
