import { useState } from 'react';
import { HolderOutlined, FilterOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

function FilterPanel() {
  const [menuTheme] = useState('light');
  const [current, setCurrent] = useState('1');

  const onClick = (e) => setCurrent(e.key);

  const items = [
    {
      key: 'sub1',
      icon: <FilterOutlined style={{ fontSize: 18 }} />,
      label: '',
      children: [
        { key: '1', label: 'Option 1' },
        { key: '2', label: 'Option 2' },
        { key: '3', label: 'Option 3' },
      ],
    },
    {
      key: 'sub2',
      icon: <HolderOutlined style={{ fontSize: 18 }} />,
      label: '',
      children: [
        { key: '4', label: 'Option 1' },
        { key: '5', label: 'Option 2' },
        { key: '6', label: 'Option 3' },
      ],
    },
    {
      key: 'sub3',
      icon: <HolderOutlined style={{ fontSize: 18 }} />,
      label: '',
      children: [
        { key: '7', label: 'Option 1' },
        { key: '8', label: 'Option 2' },
        { key: '9', label: 'Option 3' },
      ],
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        right: 10,
        zIndex: 1000,
        backgroundColor: 'white',
        padding: 4,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <Menu
        mode="vertical"
        theme={menuTheme}
        triggerSubMenuAction="click"
        items={items}
        expandIcon={null}
        onClick={onClick}
        style={{
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingInlineStart: 0,
        }}
        inlineIndent={0}
        rootClassName="filter-menu"
      />
      <style>{`
        .filter-menu .ant-menu-submenu-title {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          padding: 8px 0 !important;
          margin: 0 !important;
        }
        .filter-menu .ant-menu-sub {
          padding-left: 0 !important;
        }
      `}</style>
    </div>
  );
}

export default FilterPanel;
