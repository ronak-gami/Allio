import React from 'react';
import { View } from 'react-native';
import RadioGroup from '@components/molecules/RadioGroups';

interface ThemeOrganismProps {
  selectedTheme: string;
  onSelect: (value: string) => void;
}

const themeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

const ThemeOrganism: React.FC<ThemeOrganismProps> = ({
  selectedTheme,
  onSelect,
}) => {
  return (
    <View>
      <RadioGroup
        options={themeOptions}
        selectedValue={selectedTheme}
        onSelect={onSelect}
      />
    </View>
  );
};

export default ThemeOrganism;
