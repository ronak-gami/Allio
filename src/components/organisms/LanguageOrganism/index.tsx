import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import i18n from '@assets/i18n';
import RadioGroup from '@components/molecules/RadioGroups';
import { Button } from '@components/index';
import { useBottomSheet } from '../../../context/BottomSheetContext';
import { useTranslation } from 'react-i18next';
import { capitalizeFirst } from '@utils/helper';

const LanguageOrganism: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    i18n.language || 'en' || 'hi' || 'gu',
  );
  const { t } = useTranslation();
  const { closeBottomSheet } = useBottomSheet();
  const languageOptions = [
    { label: t('languages.English'), value: 'en' },
    { label: t('languages.Hindi'), value: 'hi' },
    { label: t('languages.Gujarati'), value: 'gu' },
  ];

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
      <View style={{ marginTop: 20 }}>
        <Button
          title={capitalizeFirst(t('bottomSheet.selectLanguage'))}
          onPress={handleLanguageApply}
        />
      </View>
    </View>
  );
};

export default LanguageOrganism;
