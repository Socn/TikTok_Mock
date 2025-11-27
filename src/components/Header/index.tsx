import useCollapsed from '@/hooks/useCollpased';
import styles from './index.module.scss';

import SearchTextbox from '@/components/SearchTextbox';
import { HeaderMenu } from '../HeaderMenu';

export default function TikTokHeader() {
  const collapsed = useCollapsed();
  return (
    <div className={styles.headerBar}>
      <SearchTextbox className={styles.searchTextbox} />
      <HeaderMenu />
    </div>
  );
}
