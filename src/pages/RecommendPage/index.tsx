import { requestFeed } from '@/apis/requestFeed';
import XGPlayer from '@/components/XGPlayer';
import type { AwemeResponse } from '@/types/feedList';
import { useEffect, useRef, useState } from 'react';

import { Mousewheel, Navigation } from 'swiper/modules';
import { Swiper, type SwiperRef, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import { IconArrowDown, IconArrowUp } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { atom, useAtom } from 'jotai';

import styles from './index.module.scss';
import './swiper.scss';
import { fullScreenAtom } from '@/hooks/useFullscreen';
import { refreshFeedAtom } from '@/routes/layout';

export const showCommentAtom = atom(false);

export default function RecommendPage() {
  const [feedData, setFeedData] = useState<AwemeResponse | null>(null);
  const swiperRef = useRef<SwiperRef | null>(null);
  const [fullscreen, setFullscreen] = useAtom(fullScreenAtom);
  const [refreshFeed, setRefreshFeed] = useAtom(refreshFeedAtom);

  useEffect(() => {
    // Simulate fetching data
    async function f() {
      const data: AwemeResponse | null = await requestFeed();
      setFeedData(data);
      console.log(data);
    }
    f();
  }, [refreshFeed]);

  return (
    <div style={{ color: 'white', width: '100%', height: '100%' }}>
      <div
        className={
          fullscreen
            ? styles.swiperNavigationContainerFullscreen
            : styles.swiperNavigationContainer
        }
      >
        <div className={styles.swiperNavigationButtons}>
          <Button
            theme="borderless"
            className={`${styles.swiperNavigationButton} swiper-navigation-up`}
            onClick={() => swiperRef.current?.swiper.slidePrev()}
          >
            <IconArrowUp />
          </Button>
          <Button
            theme="borderless"
            className={`${styles.swiperNavigationButton} swiper-navigation-down`}
            onClick={() => swiperRef.current?.swiper.slideNext()}
          >
            <IconArrowDown />
          </Button>
        </div>
      </div>
      <Swiper
        modules={[Mousewheel, Navigation]}
        ref={swiperRef}
        navigation={{
          enabled: true,
          nextEl: '.swiper-navigation-down',
          prevEl: '.swiper-navigation-up',
        }}
        spaceBetween={50}
        slidesPerView={1}
        direction="vertical"
        style={{ height: '100%' }}
        mousewheel={{
          enabled: true,
        }}
        noSwipingSelector="xg-center-grid"
      >
        {feedData?.aweme_list.map(item => {
          if (item.aweme_type === 0)
            return (
              <SwiperSlide key={item.aweme_id}>
                {({ isActive, isVisible }) => (
                  <XGPlayer
                    videoInfo={item}
                    isActive={isActive}
                    isVisible={isVisible}
                  />
                )}
              </SwiperSlide>
            );
        })}
      </Swiper>
    </div>
  );
}
