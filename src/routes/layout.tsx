import { Layout } from '@douyinfe/semi-ui';
import { Outlet } from '@modern-js/runtime/router';
import { atom, useAtom } from 'jotai';

import TikTokHeader from '@/components/Header';
import Sidebar from '@/components/Sidebar';

import './index.css';
import { fullScreenAtom } from '@/hooks/useFullscreen';

export const themeAtom = atom('semi-always-dark');

export const refreshFeedAtom = atom(false);

export default () => {
  const { Header, Sider, Content } = Layout;
  const [theme, setTheme] = useAtom(themeAtom);
  const [isFullscreen, setFullscreen] = useAtom(fullScreenAtom);

  return (
    <Layout
      className={theme}
      style={{ height: '100vh', backgroundColor: 'rgb(22, 24, 35)' }}
    >
      <meta
        name="viewport"
        content="width=device-width,initial-scale=0.5,user-scalable=no,viewport-fit=cover"
      />
      <Sider>
        <Sidebar />
      </Sider>

      <Layout style={{ height: '100vh' }}>
        <Header style={{ height: '56px' }}>
          <TikTokHeader />
        </Header>

        <Content
          style={
            isFullscreen
              ? {
                  position: 'absolute',
                  height: '100vh',
                  width: '100vw',
                  top: 0,
                  left: 0,
                  zIndex: 1000,
                }
              : { height: 'calc(100vh - 56px)' }
          }
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
