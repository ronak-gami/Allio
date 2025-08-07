import React from 'react';
import { View } from 'react-native';
import CustomRadioButton from '@components/atoms/Radio';

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <View>
      {options.map(option => (
        <CustomRadioButton
          key={option.value}
          label={option.label}
          selected={selectedValue === option.value}
          onPress={() => onSelect(option.value)}
        />
      ))}
    </View>
  );
};

export default RadioGroup;
