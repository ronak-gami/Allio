import React, { useCallback, useState } from 'react';
import { View } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode } from '@redux/slices/ThemeSlice';
import RadioGroup from '@components/molecules/RadioGroups';
import { Button } from '@components/index';
import { t } from 'i18next';
import { useBottomSheet } from '../../../context/BottomSheetContext';
import { capitalizeFirst } from '@utils/helper';

interface ThemeOrganismProps {
  selectedTheme?: string;
  onSelect?: (value: string) => void;
  onApply?: () => void;
}

const ThemeOrganism: React.FC<ThemeOrganismProps> = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light'>(
    isDarkMode ? 'dark' : 'light',
  );

  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const themeOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

  const handleThemeApply = useCallback(() => {
    dispatch(setDarkMode(selectedTheme === 'dark'));
    closeBottomSheet();
  }, [dispatch, selectedTheme, closeBottomSheet]);
  return (
    <View>
      <RadioGroup
        options={themeOptions}
        selectedValue={selectedTheme}
        onSelect={setSelectedTheme}
      />
      <View style={[{ marginTop: 20 }]}>
        <Button
          title={capitalizeFirst(t('bottomSheet.selectTheme'))}
          onPress={handleThemeApply}
        />
      </View>
    </View>
  );
};

export default ThemeOrganism;
