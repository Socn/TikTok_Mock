import { Layout } from '@douyinfe/semi-ui';
import { Outlet } from '@modern-js/runtime/router';
import { atom, useAtom } from 'jotai';

import TikTokHeader from '@/components/Header';
import Sidebar from '@/components/Sidebar';

import './index.css';

export const themeAtom = atom('semi-always-dark');

export default () => {
  const { Header, Sider, Content } = Layout;
  const [theme, setTheme] = useAtom(themeAtom);

  return (
    <Layout className={theme} style={{ height: '100vh' }}>
      <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
        <Sidebar />
      </Sider>

      <Layout>
        <Header style={{ height: '56px' }}>
          <TikTokHeader />
        </Header>

        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
