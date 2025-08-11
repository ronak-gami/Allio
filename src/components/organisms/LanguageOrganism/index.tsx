// import React, { memo } from 'react';
// import { View } from 'react-native';
// import RadioGroup from '@components/molecules/RadioGroups';

// interface LanguageOrganismProps {
//   selectedLanguage: string;
//   onSelect: (value: string) => void;
// }

// const languageOptions = [
//   { label: 'English', value: 'en' },
//   { label: 'Hindi', value: 'hi' },
//   { label: 'Gujarati', value: 'gu' },
// ];
// const LanguageOrganism: React.FC<LanguageOrganismProps> = ({

//   selectedLanguage,
//   onSelect,
// }) => {
//   return (
//     <View>
//       <RadioGroup
//         options={languageOptions}
//         selectedValue={selectedLanguage}
//         onSelect={onSelect}
//       />
//     </View>
//   );
// };

// export default memo(LanguageOrganism);
import React, { useState, useCallback } from 'react';
import { Button, View } from 'react-native';
import RadioGroup from '@components/molecules/RadioGroups';
import i18n from '@assets/i18n';
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
  const { hideBottomSheet } = useBottomSheet();

  const handleLanguageApply = useCallback(() => {
    i18n.changeLanguage(selectedLanguage);
    console.log('Language applied:', selectedLanguage);
    hideBottomSheet();
  }, [selectedLanguage, hideBottomSheet]);

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
