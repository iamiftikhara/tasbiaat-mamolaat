import React, { useState } from 'react';
import { Select, Button, Dropdown, Space } from 'antd';
import { GlobalOutlined, DownOutlined } from '@ant-design/icons';
import { useMultilingual } from '../hooks/useMultilingual';

const { Option } = Select;

const LanguageSwitcher = ({ type = 'select', size = 'middle' }) => {
  const { currentLanguage, supportedLanguages, languages, changeLanguage, isRTL } = useMultilingual();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setDropdownVisible(false);
  };

  // Select component version
  if (type === 'select') {
    return (
      <Select
        value={currentLanguage}
        onChange={handleLanguageChange}
        size={size}
        style={{ minWidth: 120 }}
        suffixIcon={<GlobalOutlined />}
      >
        {supportedLanguages.map(langCode => (
          <Option key={langCode} value={langCode}>
            <Space>
              <span>{languages[langCode].flag}</span>
              <span>{languages[langCode].name}</span>
            </Space>
          </Option>
        ))}
      </Select>
    );
  }

  // Dropdown button version
  if (type === 'dropdown') {
    const items = supportedLanguages.map(langCode => ({
      key: langCode,
      label: (
        <Space>
          <span>{languages[langCode].flag}</span>
          <span>{languages[langCode].name}</span>
        </Space>
      ),
      onClick: () => handleLanguageChange(langCode)
    }));

    return (
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        open={dropdownVisible}
        onOpenChange={setDropdownVisible}
        placement={isRTL ? 'bottomLeft' : 'bottomRight'}
      >
        <Button size={size} icon={<GlobalOutlined />}>
          <Space>
            <span>{languages[currentLanguage].flag}</span>
            <span>{languages[currentLanguage].name}</span>
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    );
  }

  // Simple button version
  if (type === 'button') {
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {supportedLanguages.map(langCode => (
          <Button
            key={langCode}
            size={size}
            type={currentLanguage === langCode ? 'primary' : 'default'}
            onClick={() => handleLanguageChange(langCode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{languages[langCode].flag}</span>
            <span>{languages[langCode].name}</span>
          </Button>
        ))}
      </div>
    );
  }

  // Compact flag-only version
  if (type === 'flags') {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {supportedLanguages.map(langCode => (
          <Button
            key={langCode}
            size={size}
            type={currentLanguage === langCode ? 'primary' : 'text'}
            onClick={() => handleLanguageChange(langCode)}
            style={{
              padding: '4px 8px',
              minWidth: 'auto',
              height: 'auto'
            }}
            title={languages[langCode].name}
          >
            {languages[langCode].flag}
          </Button>
        ))}
      </div>
    );
  }

  return null;
};

export default LanguageSwitcher;