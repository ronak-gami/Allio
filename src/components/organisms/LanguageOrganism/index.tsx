import React from 'react';
import { View } from 'react-native';
import RadioGroup from '@components/molecules/RadioGroups';

interface LanguageOrganismProps {
  selectedLanguage: string;
  onSelect: (value: string) => void;
}

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Gujarati', value: 'gu' },
];

const LanguageOrganism: React.FC<LanguageOrganismProps> = ({
  selectedLanguage,
  onSelect,
}) => {
  return (
    <View>
      <RadioGroup
        options={languageOptions}
        selectedValue={selectedLanguage}
        onSelect={onSelect}
      />
    </View>
  );
};

export default LanguageOrganism;
