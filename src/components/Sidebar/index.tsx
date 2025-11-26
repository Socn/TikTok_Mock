import { themeAtom } from '@/routes/layout';
import { IconStarStroked, IconThumbUpStroked } from '@douyinfe/semi-icons';
import { List } from '@douyinfe/semi-ui';
import { useAtom } from 'jotai';

import TikTokLogoSmallSvg from '@/assets/icons/tiktok-logo-small.svg?react';
import TikTokLogoSvg from '@/assets/icons/tiktok-logo.svg?react';
import { Link, useNavigate } from '@modern-js/runtime/router';
import {
  ChangeEvent,
  type ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';

import useCollapsed from '@/hooks/useCollpased';
import styles from './index.module.scss';

const TikTokLogo = ({ collapsed }: { collapsed: boolean }) => {
  if (collapsed === true) {
    return (
      <TikTokLogoSmallSvg
        style={{
          height: '56px',
          width: '30px',
          left: '21px',
          position: 'absolute',
        }}
      />
    );
  }
  return (
    <TikTokLogoSvg
      style={{
        height: '56px',
        width: '72px',
        left: '32px',
        position: 'absolute',
      }}
    />
  );
};

const sidebarItem = (
  item: { itemKey: string; text: string; icon: ReactElement; nav: string },
  collapsed: boolean,
  selectedKey: string,
  onClick: () => void,
) => {
  if (collapsed === true) {
    return (
      <List.Item
        key={item.itemKey}
        className={styles.sidenavItemCollapsed}
        onClick={onClick}
        style={
          item.itemKey === selectedKey
            ? {
                color: 'var(--semi-color-text-0)',
                backgroundColor: 'var(--semi-color-bg-2)',
              }
            : {
                color: 'var(--semi-color-text-1)',
              }
        }
      >
        <p className={styles.sidenavItemContent}>
          {item.icon}
          <span>{item.text}</span>
        </p>
      </List.Item>
    );
  }
  return (
    <List.Item
      key={item.itemKey}
      className={styles.sidenavItem}
      onClick={onClick}
      style={
        item.itemKey === selectedKey
          ? {
              color: 'var(--semi-color-text-0)',
              backgroundColor: 'var(--semi-color-bg-2)',
            }
          : {
              color: 'var(--semi-color-text-1)',
            }
      }
    >
      <p className={styles.sidenavItemContent}>
        {item.icon}
        <span>{item.text}</span>
      </p>
    </List.Item>
  );
};

export default function Sidebar() {
  const [theme, setTheme] = useAtom(themeAtom);

  const navigate = useNavigate();

  const itemStyle = {
    width: '24px',
    height: '24px',
    fontSize: '22px',
    padding: '1px',
  };
  const items = useMemo(
    () => [
      {
        itemKey: 'Featured',
        text: '精选',
        icon: <IconThumbUpStroked size="large" style={itemStyle} />,
        nav: '/jingxuan',
      },
      {
        itemKey: 'Recommend',
        text: '推荐',
        icon: <IconStarStroked size="large" style={itemStyle} />,
        nav: '/?recommend=1',
      },
    ],
    [],
  );

  const [selectedKey, setSelectedKey] = useState<string>(() => {
    for (const item of items) {
      if (item.nav === window.location.pathname + window.location.search) {
        return item.itemKey;
      }
    }
    return 'Featured';
  });

  const collapsed = useCollapsed();

  const sidebarWidth = collapsed ? 72 : 160;

  return (
    <>
      <div
        className="tiktok-logo"
        style={{
          position: 'absolute',
          height: '56px',
          width: `${sidebarWidth}px`,
        }}
      >
        <TikTokLogo collapsed={collapsed} />
      </div>
      <div
        style={{
          width: `${sidebarWidth}px`,
          marginTop: '56px',
          height: 'calc(100vh - 56px - 60px)',
        }}
      >
        <List
          dataSource={items}
          renderItem={item =>
            sidebarItem(item, collapsed, selectedKey, () => {
              navigate(item.nav);
              setSelectedKey(item.itemKey);
            })
          }
        />
      </div>
    </>
  );
}
