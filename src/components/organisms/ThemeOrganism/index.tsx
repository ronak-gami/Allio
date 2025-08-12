import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import RadioGroup from '@components/molecules/RadioGroups';
import { setDarkMode } from '@redux/slices/ThemeSlice';
import { useBottomSheet } from '../../../context/BottomSheetContext';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@components/atoms/Button';
import useStyle from './style';
interface ThemeOrganismProps {
  selectedTheme: string;
  onSelect: (value: string) => void;
  onApply: () => void;
}

const ThemeOrganism: React.FC<ThemeOrganismProps> = () => {
  const styles = useStyle();
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
    console.log('Theme applied:', selectedTheme);
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
        <Button title="Apply Theme" onPress={handleThemeApply} />
      </View>
    </View>
  );
};

export default ThemeOrganism;
