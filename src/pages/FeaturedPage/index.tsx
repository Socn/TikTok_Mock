import { TabPane, Tabs } from '@douyinfe/semi-ui';
import React from 'react';

import FeaturedPageContent from '@/components/FeaturedFeed';
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
