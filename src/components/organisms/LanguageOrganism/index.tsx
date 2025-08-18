import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import i18n from '@assets/i18n';
import RadioGroup from '@components/molecules/RadioGroups';
import Button from '@components/atoms/Button';
import { useBottomSheet } from '../../../context/BottomSheetContext';
import useStyle from './style';

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Gujarati', value: 'gu' },
];

const LanguageOrganism: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    i18n.language || 'en' || 'hi' || 'gu',
  );
  const styles = useStyle();
  const { closeBottomSheet } = useBottomSheet();

  const handleLanguageApply = useCallback(() => {
    i18n.changeLanguage(selectedLanguage);
    closeBottomSheet();
  }, [selectedLanguage, closeBottomSheet]);

  return (
    <View>
      <RadioGroup
        options={languageOptions}
        selectedValue={selectedLanguage}
        onSelect={setSelectedLanguage}
      />
      <View style={styles.container}>
        <Button title="Apply Language" onPress={handleLanguageApply} />
      </View>
    </View>
  );
};

export default LanguageOrganism;
