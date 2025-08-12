import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import RadioGroup from '@components/molecules/RadioGroups';
import i18n from '@assets/i18n';
import Button from '@components/atoms/Button';
import { useBottomSheet } from '../../../context/BottomSheetContext';

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Gujarati', value: 'gu' },
];

const LanguageOrganism: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    i18n.language || 'en' || 'hi' || 'gu',
  );
  const { closeBottomSheet } = useBottomSheet();

  const handleLanguageApply = useCallback(() => {
    i18n.changeLanguage(selectedLanguage);
    console.log('Language applied:', selectedLanguage);
    closeBottomSheet();
  }, [selectedLanguage, closeBottomSheet]);

  return (
    <View>
      <RadioGroup
        options={languageOptions}
        selectedValue={selectedLanguage}
        onSelect={setSelectedLanguage}
      />
      <View style={{ marginTop: 20 }}>
        <Button title="Apply Language" onPress={handleLanguageApply} />
      </View>
    </View>
  );
};

export default LanguageOrganism;
