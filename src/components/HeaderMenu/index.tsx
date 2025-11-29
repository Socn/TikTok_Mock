import useCollapsed from '@/hooks/useCollpased';
import {
  IconBell,
  IconComment,
  IconDesktop,
  IconDownload,
  IconGift,
  IconMore,
  IconUpload,
} from '@douyinfe/semi-icons';
import { List } from '@douyinfe/semi-ui';
import type { ReactElement } from 'react';
import styles from './index.module.scss';

const MenuItem = ({
  item,
}: { item: { key: string; text: string; icon: ReactElement } }) => {
  return (
    <div className={styles.menuItem}>
      <div className={styles.menuItemIcon}>{item.icon}</div>
      <span className={styles.menuItemText}>{item.text}</span>
    </div>
  );
};

export function HeaderMenu() {
  const collapsed = useCollapsed(1030);
  const allItems = [
    {
      key: 'pay',
      text: '充钻石',
      icon: <IconGift />,
    },
    {
      key: 'client',
      text: '客户端',
      icon: <IconDownload />,
    },
    {
      key: 'wallpaper',
      text: '壁纸',
      icon: <IconDesktop />,
    },
    {
      key: 'notification',
      text: '通知',
      icon: <IconBell />,
    },
    {
      key: 'message',
      text: '私信',
      icon: <IconComment />,
    },
    {
      key: 'upload',
      text: '投稿',
      icon: <IconUpload />,
    },
  ];
  const items = collapsed
    ? [
        {
          key: 'more',
          text: '更多',
          icon: <IconMore />,
        },
        ...allItems.slice(allItems.length - 4, allItems.length),
      ]
    : allItems;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <List
        className={styles.headerMenu}
        dataSource={items}
        layout="horizontal"
        renderItem={item => (
          <List.Item key={item.key} style={{ border: 'none', padding: 0 }}>
            <MenuItem item={item} />
          </List.Item>
        )}
      />
      <div className={styles.avatarContainer}>
        <div className={styles.avatar}>Login</div>
      </div>
    </div>
  );
}
