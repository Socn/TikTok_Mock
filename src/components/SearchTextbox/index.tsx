import useSearchHistory from '@/hooks/useSearchHistory';
import { IconClose, IconDeleteStroked, IconSearch } from '@douyinfe/semi-icons';
import { Badge, Button, Dropdown, Input } from '@douyinfe/semi-ui';
import { Typography } from '@douyinfe/semi-ui';
import { useRef, useState } from 'react';
import styles from './index.module.scss';

const textboxSuffix = (styleChange: boolean, onClick: () => void) => {
  const { Text } = Typography;
  const unhoveredStyle = {
    color: 'white !important',
    right: '-1px',
  };
  const hoveredStyle = {
    backgroundColor: 'white',
    right: '-2px',
  };
  const style = styleChange ? hoveredStyle : unhoveredStyle;
  return (
    <>
      <div className={styles.suffixSeparator} />
      <Button
        className={styles.textboxSuffix}
        style={style}
        onClick={e => onClick()}
      >
        <IconSearch
          style={
            styleChange
              ? { color: 'rgba(22, 24, 35, 0.75)' }
              : { color: 'white' }
          }
        />
        <Text
          className={styles.suffixText}
          style={
            styleChange
              ? { color: 'rgba(22, 24, 35, 0.75)' }
              : { color: 'white' }
          }
        >
          搜索
        </Text>
      </Button>
    </>
  );
};

export default function SearchTextbox({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { history, addHistory, clearHistory, deleteHistoryItem } =
    useSearchHistory();
  const [inputValue, setInputValue] = useState('');

  const onSearch = () => {
    console.log(inputValue);
    if (inputValue.trim() !== '') {
      addHistory(inputValue.trim());
    }
    setInputValue('');
  };

  const onBadgeClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    term: string,
  ) => {
    setInputValue(term);
    event.stopPropagation();
    addHistory(term);
  };

  const onBadgeDeleteClick = (term: string) => {
    deleteHistoryItem(term);
  };

  const dropdownRef = useRef<Dropdown>(null);
  const textboxContainerRef = useRef<HTMLDivElement>(null);
  const textboxRef = useRef<HTMLInputElement>(null);
  const hoverDelay = useRef(setTimeout(() => {}, 0));
  const onMouseEnter = () => {
    clearTimeout(hoverDelay.current);
    hoverDelay.current = setTimeout(() => setDropdownVisible(true), 300);
    setHovered(true);
  };
  const onMouseLeave = () => {
    if (!focused) {
      clearTimeout(hoverDelay.current);
      hoverDelay.current = setTimeout(() => setDropdownVisible(false), 10);
    }
    setHovered(false);
  };
  const onFocus = () => {
    setFocused(true);
  };
  const onBlur = () => {
    setFocused(false);
  };
  const onDropdownVisibleChange = (visible: boolean) => {
    console.log(visible);
  };

  const historyItems = history.map(term => (
    <Badge
      count={<IconClose size="inherit" />}
      key={term}
      countClassName={styles.historyItemDelete}
      onClick={e => onBadgeDeleteClick(term)}
      className={styles.historyItem}
    >
      <Badge
        count={term}
        countClassName={styles.historyItemInner}
        onClick={e => onBadgeClick(e, term)}
      />
    </Badge>
  ));

  return (
    <Dropdown
      position="bottom"
      trigger="click"
      visible={dropdownVisible}
      className={`${styles.dropdownWrapper} semi-always-dark textboxDropdown`}
      style={{
        width: '400px',
      }}
      spacing={0}
      disableFocusListener
      clickToHide={false}
      onVisibleChange={onDropdownVisibleChange}
      ref={dropdownRef}
      render={
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <Dropdown.Menu
            style={{
              padding: '8px 2px 12px 2px',
            }}
          >
            <Dropdown.Title
              style={{
                fontWeight: 'bold',
                fontSize: '13px',

                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              历史记录
              <Button
                type="tertiary"
                theme="borderless"
                size="small"
                onClick={e => clearHistory()}
                className={styles.clearButton}
                contentClassName={styles.clearButtonContent}
                icon={<IconDeleteStroked size="inherit" />}
              >
                清除记录
              </Button>
            </Dropdown.Title>
            <div className={styles.historyItemContainer}>
              {historyItems.length > 0 ? (
                historyItems
              ) : (
                <p
                  style={{ color: 'var(--semi-color-text-3', fontSize: '13px' }}
                >
                  暂无历史记录
                </p>
              )}
            </div>
          </Dropdown.Menu>
        </div>
      }
    >
      <div
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={e => {
          if (
            // Keep focus when clicking dropdown menu
            e.relatedTarget?.children[0].className.includes('textboxDropdown')
          ) {
            e.target.focus();
            return;
          }
          onBlur();
        }}
        ref={textboxContainerRef}
      >
        <Input
          type="text"
          placeholder="搜索你感兴趣的内容"
          className={styles.textbox}
          size="large"
          suffix={textboxSuffix(hovered || focused || dropdownVisible, () =>
            onSearch(),
          )}
          onEnterPress={e => onSearch()}
          onChange={value => setInputValue(value)}
          value={inputValue}
          ref={textboxRef}
          style={
            hovered || focused || dropdownVisible
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
            hovered || focused || dropdownVisible
              ? {
                  padding: '11px',
                }
              : {
                  padding: '12px',
                }
          }
        />
      </div>
    </Dropdown>
  );
}
