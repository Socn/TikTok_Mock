import { themeAtom } from '@/routes/layout';
import {
  IconArticle,
  IconCamera,
  IconCameraStroked,
  IconGridView,
  IconHelpCircleStroked,
  IconLikeThumb,
  IconRefresh,
  IconSetting,
  IconStar,
  IconStarStroked,
  IconThumbUpStroked,
  IconTiktokLogo,
  IconUser,
  IconUserAdd,
  IconUserCardVideo,
  IconUserCardVideoStroked,
  IconUserGroup,
  IconVideo,
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
import { refreshFeedAtom } from '@/routes/layout';
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
    text?: string;
    icon?: ReactElement;
    selectedIcon?: ReactElement;
    nav?: string;
    hoverActionButton?: ReactElement;
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
  if (item.itemKey.slice(0, 9) === 'separator') {
    if (
      item.itemKey.slice(item.itemKey.length - 11, item.itemKey.length) ===
        'uncollapsed' &&
      collapsed === true // 仅在未折叠时显示分割线
    ) {
      return <></>;
    }
    return <div key={item.itemKey} className={styles.separator} />;
  }
  if (item.itemKey === 'separator2') {
  }
  if (item.itemKey === 'separator1') {
  }
  return (
    <List.Item
      key={item.itemKey}
      className={styles.sidenavItem}
      onClick={onClick}
      style={style}
    >
      {item.hoverActionButton && selected ? (
        <div className={styles.sidenavHoverItemContent}>
          {item.hoverActionButton}
        </div>
      ) : (
        <></>
      )}
      <p className={styles.sidenavItemContent}>
        {displayIcon}
        <span className={styles.sidenavItemText}>{item.text}</span>
      </p>
    </List.Item>
  );
};

const SidebarNav = ({
  collapsed,
  sidebarWidth,
}: { collapsed: boolean; sidebarWidth: number }) => {
  const navigate = useNavigate();

  const [refreshFeed, setRefreshFeed] = useAtom(refreshFeedAtom);

  const sidenavClassname = collapsed ? styles.sidenavCollapsed : styles.sidenav;
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
  const RefreshButton = (
    <IconRefresh
      size="inherit"
      className={styles.refreshButton}
      onClick={e => {
        e.stopPropagation();
        setRefreshFeed(value => !value);
      }}
    />
  );
  const items = useMemo(
    () => [
      {
        itemKey: 'Featured',
        text: '精选',
        icon: <IconThumbUpStroked size="large" style={itemStyle} />,
        selectedIcon: <IconLikeThumb size="large" style={itemStyle} />,
        nav: '/jingxuan',
        hoverActionButton: RefreshButton,
      },
      {
        itemKey: 'Recommend',
        text: '推荐',
        icon: <IconStarStroked size="large" style={itemStyle} />,
        selectedIcon: <IconStar size="large" style={itemStyle} />,
        nav: '/?recommend=1',
        hoverActionButton: RefreshButton,
      },
      {
        itemKey: 'AITikTok',
        text: 'AI抖音',
        icon: <IconTiktokLogo size="large" style={itemStyle} />,
        selectedIcon: <IconTiktokLogo size="large" style={itemStyle} />,
        nav: '/?recommend=1',
      },
      {
        itemKey: 'separator1_uncollapsed',
      },
      {
        itemKey: 'Following',
        text: '关注',
        icon: <IconUserAdd size="large" style={itemStyle} />,
        selectedIcon: <IconUserAdd size="large" style={itemStyle} />,
        nav: '/?recommend=1',
      },
      {
        itemKey: 'Friends',
        text: '朋友',
        icon: <IconUserGroup size="large" style={itemStyle} />,
        selectedIcon: <IconUserGroup size="large" style={itemStyle} />,
        nav: '/?recommend=1',
      },
      {
        itemKey: 'Mine',
        text: '我的',
        icon: <IconUser size="large" style={itemStyle} />,
        selectedIcon: <IconUser size="large" style={itemStyle} />,
        nav: '/?recommend=1',
      },
      {
        itemKey: 'separator2',
      },
      {
        itemKey: 'Stream',
        text: '直播',
        icon: <IconVideo size="large" style={itemStyle} />,
        selectedIcon: <IconVideo size="large" style={itemStyle} />,
        nav: '/?recommend=1',
      },
      {
        itemKey: 'Cinema',
        text: '放映厅',
        icon: <IconUserCardVideoStroked size="large" style={itemStyle} />,
        selectedIcon: <IconUserCardVideo size="large" style={itemStyle} />,
        nav: '/?recommend=1',
      },
      {
        itemKey: 'ShortVideo',
        text: '短剧',
        icon: <IconCameraStroked size="large" style={itemStyle} />,
        selectedIcon: <IconCamera size="large" style={itemStyle} />,
        nav: '/?recommend=1',
      },
    ],
    [itemStyle, RefreshButton],
  );

  const [selectedKey, setSelectedKey] = useState<string>(() => {
    for (const item of items) {
      if (item.nav === window.location.pathname + window.location.search) {
        return item.itemKey;
      }
    }
    return 'Featured';
  });

  return (
    <div
      style={{
        width: `${sidebarWidth}px`,
        marginTop: '56px',
      }}
    >
      <List
        className={sidenavClassname}
        dataSource={items}
        renderItem={item =>
          sidebarItem(item, collapsed, selectedKey, () => {
            navigate(item.nav ?? '');
            setSelectedKey(item.itemKey);
          })
        }
      />
    </div>
  );
};

const SidebarMenu = ({
  collapsed,
  sidebarWidth,
}: { collapsed: boolean; sidebarWidth: number }) => {
  const items = [
    {
      itemKey: 'Settings',
      icon: <IconSetting size="inherit" />,
    },
    {
      itemKey: 'More',
      icon: <IconGridView size="inherit" />,
    },
    {
      itemKey: 'Help',
      icon: <IconHelpCircleStroked size="inherit" />,
    },
    {
      itemKey: 'Quiz',
      icon: <IconArticle size="inherit" />,
    },
  ];

  const sidemenuClassname = collapsed
    ? styles.sidemenuCollapsed
    : styles.sidemenu;

  return (
    <div
      style={{
        width: `${sidebarWidth}px`,
      }}
    >
      <List
        className={sidemenuClassname}
        dataSource={items}
        layout={collapsed ? 'vertical' : 'horizontal'}
        renderItem={item => (
          <List.Item
            key={item.itemKey}
            className={styles.sidemenuItem}
            style={{
              color: 'var(--semi-color-text-1)',
            }}
          >
            {item.icon}
          </List.Item>
        )}
      />
    </div>
  );
};

export default function Sidebar() {
  const [theme, setTheme] = useAtom(themeAtom);

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
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <SidebarNav collapsed={collapsed} sidebarWidth={sidebarWidth} />
        <SidebarMenu collapsed={collapsed} sidebarWidth={sidebarWidth} />
      </div>
    </>
  );
}
