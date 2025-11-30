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
    <div
      key={item.aweme_id}
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`?modal_id=${item.aweme_id}`)}
    >
      <div style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            alignContent: 'center',
            bottom: '6px',
            left: '6px',
            zIndex: 12,
            pointerEvents: 'none',
            fontSize: '13px',
            lineHeight: '21px',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <IconWrapper
            icon={<HeartStrokedSVG />}
            style={{ height: '12px', width: '12px', fontSize: '12px' }}
          />
          {item.liked_count}
        </div>
        <div
          style={{
            height: '100%',
            width: '100%',
            background:
              'linear-gradient(180deg, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.6) 100%)',
            zIndex: 11,
            pointerEvents: 'none',
            position: 'absolute',
            inset: '0',
          }}
        />
        <img
          src={item.cover_url}
          style={{
            aspectRatio: '4/3',
            objectFit: 'cover',
            borderRadius: '12px',
            overflow: 'hidden',
            zIndex: 10,
            marginBottom: '4px',
          }}
          alt={item.desc}
        />
      </div>

      <div className={styles.videoTitle}>{item.desc}</div>
      <div className={styles.authorAndTime}>
        <div
          style={{
            maxWidth: 'calc(100% - 50px)',
            width: 'max-content',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          @{item.nickname}
        </div>{' '}
        · {chineseFormatDistanceToNow(new Date(item.create_time * 1000))}
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
  useEffect(()=>{
    toggleCssFullscreen(videoId !== undefined &&videoId != null &&videoId !== '');
  }, [videoId])

  const navigate = useNavigate();


  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(autofill, 1fr)',
          gridGap: '20px',
          padding: '8px',
        }}
      >
        {(feedData?.aweme_list || []).map(item => (
          <VideoCard key={item.aweme_id} item={item} />
        ))}
      </div>
      {videoId !== undefined && videoId != null && videoId !== '' ? (
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            inset: 0,
            zIndex: 999,
          }}
        >
          <XGPlayer
            videoInfo={
              feedData?.aweme_list.filter(item => item.aweme_id === videoId)[0]
            }
            isActive={true}
            isVisible={true}

                      onCloseBtnClick={()=>navigate(-1)}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
