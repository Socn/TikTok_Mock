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
import { Dropdown, List } from '@douyinfe/semi-ui';
import type { ReactElement, Ref } from 'react';
import styles from './index.module.scss';

const MenuItem = ({
  item,
  ref,
}: {
  item: { key: string; text: string; icon: ReactElement };
  ref?: Ref<HTMLDivElement>;
}) => {
  return (
    <div className={styles.menuItem} ref={ref}>
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
    ? [...allItems.slice(allItems.length - 4, allItems.length)]
    : allItems;
  const moreItems = allItems.slice(0, allItems.length - 4);
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {collapsed ? (
        <Dropdown
          position="bottom"
          className="semi-always-dark"
          render={
            <Dropdown.Menu style={{ height: 'max-content' }}>
              <List
                className={styles.headerMenu}
                dataSource={moreItems}
                layout="vertical"
                style={{ height: 'max-content' }}
                renderItem={item => (
                  <List.Item
                    key={item.key}
                    style={{ border: 'none', padding: 0 }}
                  >
                    <Dropdown.Item key={item.key}>{item.text}</Dropdown.Item>
                  </List.Item>
                )}
              />
            </Dropdown.Menu>
          }
        >
          <div>
            <MenuItem
              item={{
                key: 'more',
                text: '更多',
                icon: <IconMore />,
              }}
            />
          </div>
        </Dropdown>
      ) : (
        <></>
      )}
      <List
        className={styles.headerMenu}
        dataSource={items}
        layout="horizontal"
        renderItem={item => (
          <List.Item key={item.key} style={{ border: 'none', padding: 0 }}>
            <MenuItem item={item} key={item.key} />
          </List.Item>
        )}
      />
      <div className={styles.avatarContainer}>
        <div className={styles.avatar}>登录</div>
      </div>
    </div>
  );
}
