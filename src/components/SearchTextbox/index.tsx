import { IconSearch } from '@douyinfe/semi-icons';
import { Input } from '@douyinfe/semi-ui';
import { Typography } from '@douyinfe/semi-ui';
import { useState } from 'react';
import styles from './index.module.scss';

const textboxSuffix = (hovered: boolean) => {
  const { Text } = Typography;
  const unhoveredStyle = {
    color: 'white !important',
    right: '-1px',
  };
  const hoveredStyle = {
    backgroundColor: 'white',
    right: '-2px',
  };
  const style = hovered ? hoveredStyle : unhoveredStyle;
  return (
    <>
      <div className={styles.suffixSeparator} />
      <div className={styles.textboxSuffix} style={style}>
        <IconSearch
          style={
            hovered ? { color: 'rgba(22, 24, 35, 0.75)' } : { color: 'white' }
          }
        />
        <Text
          className={styles.suffixText}
          style={
            hovered ? { color: 'rgba(22, 24, 35, 0.75)' } : { color: 'white' }
          }
        >
          搜索
        </Text>
      </div>
    </>
  );
};

export default function SearchTextbox({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Input
        type="text"
        placeholder="搜索你感兴趣的内容"
        className={styles.textbox}
        size="large"
        suffix={textboxSuffix(hovered)}
        style={
          hovered
            ? {
                border: '2px solid rgba(255, 255, 255, 0.9)',
                background: 'rgba(0, 0, 0, 0)',
              }
            : {
                border: '1px solid rgba(255,255,255,0.16)',
                background: 'rgba(255,255,255,0.15)',
              }
        }
        inputStyle={
          hovered
            ? {
                padding: '11px',
              }
            : {
                padding: '12px',
              }
        }
      />
    </div>
  );
}
