import { themeAtom } from '@/routes/layout';
import {
  IconLikeThumb,
  IconStar,
  IconStarStroked,
  IconThumbUpStroked,
} from '@douyinfe/semi-icons';
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
  item: {
    itemKey: string;
    text: string;
    icon: ReactElement;
    selectedIcon: ReactElement;
    nav: string;
  },
  collapsed: boolean,
  selectedKey: string,
  onClick: () => void,
) => {
  const selected = item.itemKey === selectedKey;
  const displayIcon = selected ? item.selectedIcon : item.icon;
  const style = selected
    ? {
        color: 'var(--semi-color-text-0)',
        backgroundColor: 'var(--semi-color-bg-2)',
      }
    : {
        color: 'var(--semi-color-text-1)',
      };
  const className = collapsed
    ? styles.sidenavItemCollapsed
    : styles.sidenavItem;
  return (
    <List.Item
      key={item.itemKey}
      className={className}
      onClick={onClick}
      style={style}
    >
      <p className={styles.sidenavItemContent}>
        {displayIcon}
        <span className={styles.sidenavItemText}>{item.text}</span>
      </p>
    </List.Item>
  );
};

export default function Sidebar() {
  const [theme, setTheme] = useAtom(themeAtom);

  const navigate = useNavigate();
  const collapsed = useCollapsed();

  const itemStyle = collapsed
    ? {
        width: '24px',
        height: '24px',
        fontSize: '22px',
        padding: '0px 1px 1px 1px',
      }
    : {
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
        selectedIcon: <IconLikeThumb size="large" style={itemStyle} />,
        nav: '/jingxuan',
      },
      {
        itemKey: 'Recommend',
        text: '推荐',
        icon: <IconStarStroked size="large" style={itemStyle} />,
        selectedIcon: <IconStar size="large" style={itemStyle} />,
        nav: '/?recommend=1',
      },
    ],
    [itemStyle],
  );

  const [selectedKey, setSelectedKey] = useState<string>(() => {
    for (const item of items) {
      if (item.nav === window.location.pathname + window.location.search) {
        return item.itemKey;
      }
    }
    return 'Featured';
  });

  const sidebarWidth = collapsed ? 72 : 160;

  const sidenavClassname = collapsed ? styles.sidenavCollapsed : styles.sidenav;

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
          className={sidenavClassname}
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
