import { requestFeed } from '@/apis/requestFeed';
import { refreshFeedAtom } from '@/routes/layout';
import type { AwemeItem, AwemeResponse } from '@/types/feedList';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

import HeartStrokedSVG from '@/assets/icons/heartStroked.svg?react';
import IconWrapper from '@/components/IconWrapper';
import styles from './index.module.scss';

import { useFullscreen } from '@/hooks/useFullscreen';
import chineseFormatDistanceToNow from '@/utils/chineseFormatDistanceToNow';
import { useLocation, useNavigate } from '@modern-js/runtime/router';
import XGPlayer from '../XGPlayer';

function VideoCard({ item }: { item: AwemeItem }) {
  const navigate = useNavigate();
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      key={item.aweme_id}
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`?modal_id=${item.aweme_id}`)}
    >
      <div style={{ position: 'relative' }}>
        <div className={styles.likeCountContainer}>
          <IconWrapper
            icon={<HeartStrokedSVG />}
            style={{ height: '12px', width: '12px', fontSize: '12px' }}
          />
          {item.liked_count}
        </div>
        <div className={styles.videoCoverGradient} />

        <img
          src={item.cover_url}
          className={styles.videoCover}
          alt={item.desc}
        />
      </div>

      <div className={styles.videoTitle}>{item.desc}</div>
      <div className={styles.authorAndTime}>
        <div className={styles.authorNickname}>@{item.nickname}</div> ·{' '}
        {chineseFormatDistanceToNow(new Date(item.create_time * 1000))}
      </div>
    </div>
  );
}

export default function FeaturedPageContent() {
  const [feedData, setFeedData] = useState<AwemeResponse | null>(null);
  const [refreshFeed, setRefreshFeed] = useAtom(refreshFeedAtom);
  const [isFullscreen, toggleFullscreen, toggleCssFullscreen] = useFullscreen();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Simulate fetching data
    async function f() {
      const data: AwemeResponse | null = await requestFeed();
      setFeedData(data);
      console.log(data);
    }
    f();
  }, [refreshFeed]);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const videoId = query.get('modal_id');
  useEffect(() => {
    toggleCssFullscreen(
      videoId !== undefined && videoId != null && videoId !== '',
    );
  }, [toggleCssFullscreen, videoId]);

  const navigate = useNavigate();

  return (
    <>
      <div className={styles.feedContainer}>
        {(feedData?.aweme_list || []).map(item => (
          <VideoCard key={item.aweme_id} item={item} />
        ))}
      </div>
      {videoId !== undefined && videoId != null && videoId !== '' ? (
        <div className={styles.playerContainer}>
          <XGPlayer
            videoInfo={
              feedData?.aweme_list.filter(item => item.aweme_id === videoId)[0]
            }
            isActive={true}
            isVisible={true}
            onCloseBtnClick={() => navigate(-1)}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
