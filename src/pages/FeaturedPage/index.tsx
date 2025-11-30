import { requestFeed } from '@/apis/requestFeed';
import { refreshFeedAtom } from '@/routes/layout';
import type { AwemeResponse } from '@/types/feedList';
import { List, TabPane, Tabs } from '@douyinfe/semi-ui';
import { useAtom } from 'jotai';
import React, { Suspense, useEffect, useState } from 'react';

const LazyFeaturedFeed = React.lazy(() => import('@/components/FeaturedFeed'));

import FeaturedPageContent from '@/components/FeaturedFeed';
import { useLocation } from '@modern-js/runtime/router';
import LazyLoad from 'react-lazyload';
import styles from './index.module.scss';

export default function FeaturedPage() {
  return (
    <Tabs
      type="line"
      size="large"
      defaultActiveKey="全部"
      collapsible
      arrowPosition={'end'}
      className={styles.featuredTabs}
    >
      {[
        '全部',
        '公开课',
        '游戏',
        '二次元',
        '音乐',
        '影视',
        '美食',
        '知识',
        '小剧场',
        '生活vlog',
        '体育',
        '旅行',
        '亲子',
        '动物',
        '三农',
        '汽车',
      ].map(item => (
        <TabPane tab={item} key={item} itemKey={item} style={{ width: '100%' }}>
          <FeaturedPageContent />
        </TabPane>
      ))}
    </Tabs>
  );
}
