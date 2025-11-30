import { requestFeed } from '@/apis/requestFeed';
import XGPlayer from '@/components/XGPlayer';
import type { AwemeResponse } from '@/types/feedList';
import React, { useEffect, useRef, useState } from 'react';

import { Keyboard, Mousewheel, Navigation } from 'swiper/modules';
import { Swiper, type SwiperRef, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import { IconChevronDown, IconChevronUp } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { atom, useAtom } from 'jotai';

import styles from './index.module.scss';
import './swiper.scss';
import { useFullscreen } from '@/hooks/useFullscreen';
import { refreshFeedAtom } from '@/routes/layout';

export const showCommentAtom = atom(false);

export default function RecommendPage() {
  const [feedData, setFeedData] = useState<AwemeResponse | null>(null);
  const swiperRef = useRef<SwiperRef | null>(null);
  const [fullscreen, toggleFullscreen] = useFullscreen();
  const [refreshFeed, setRefreshFeed] = useAtom(refreshFeedAtom);

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
          >
            <IconChevronUp size="large" />
          </Button>
          <Button
            theme="borderless"
            className={`${styles.swiperNavigationButton} swiper-navigation-down`}
          >
            <IconChevronDown size="large" />
          </Button>
        </div>
      </div>
      <Swiper
        modules={[Mousewheel, Navigation, Keyboard]}
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
        keyboard={{ enabled: true }}
        noSwipingSelector=".xgplayer-slider, .xgplayer-progress"
      >
        {feedData?.aweme_list.map(item => {
          if (item.aweme_type === 0)
            return (
              <SwiperSlide key={item.aweme_id}>
                {({ isActive, isVisible, isNext, isPrev }) => (
                  <>
                    <XGPlayer
                      videoInfo={item}
                      isActive={isActive}
                      isVisible={isVisible}
                      isNext={isNext}
                      isPrev={isPrev}
                      key={item.aweme_id}
                      onCloseBtnClick={() => toggleFullscreen(document.body)}
                    />
                  </>
                )}
              </SwiperSlide>
            );
        })}
      </Swiper>
    </div>
  );
}
