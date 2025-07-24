import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Pressable,
  Image,
  Platform,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  StyleProp,
  TextStyle,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { COLORS } from '../../../utils/color';
import Text from '../Text';
import { ICONS } from '../../../assets';
import styles from './style';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  isPassword?: boolean;
  error?: string;
  // style?: object;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  backgroundColor?: string;
  multiline?: boolean;
  prefixIcon?: keyof typeof ICONS;
  showClearButton?: boolean;
  onClear?: () => void;
  dataType?: 'text' | 'date' | 'time';
  onDateChange?: (date: Date) => void;
  [key: string]: any;
  style?: StyleProp<TextStyle>;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  isPassword = false,
  error,
  style,
  autoCapitalize = 'none',
  backgroundColor,
  multiline = false,
  prefixIcon,
  showClearButton = false,
  onClear,
  dataType = 'text',
  onDateChange,
  ...props
}) => {
  const [internalDate, setInternalDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [isSecure, setIsSecure] = useState<boolean>(isPassword);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if ((dataType === 'date' || dataType === 'time') && value) {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        setInternalDate(parsedDate);
      }
    }
  }, [value, dataType]);

  const handlePickerChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowPicker(Platform.OS === 'ios');
    if (event.type === 'dismissed') return;

    if (selectedDate) {
      setInternalDate(selectedDate);
      const formattedValue =
        dataType === 'date'
          ? selectedDate.toLocaleDateString()
          : selectedDate.toLocaleTimeString();

      onChangeText(formattedValue);
      onDateChange?.(selectedDate);
    }
  };

  const renderRightIcon = () => {
    if (isPassword) {
      return (
        <TextInput.Icon
          icon={() => (
            <Image
              source={isSecure ? ICONS.eyeOff : ICONS.eye}
              style={styles.icon}
            />
          )}
          onPress={() => setIsSecure(!isSecure)}
        />
      );
    }

    if (showClearButton && value && dataType === 'text') {
      return (
        <TextInput.Icon
          icon={() => <Image source={ICONS.cancel} style={styles.icon} />}
          onPress={onClear}
        />
      );
    }

    return null;
  };

  const isPickerInput = dataType === 'date' || dataType === 'time';

  const mainInputContent = (
    <TextInput
      mode="outlined"
      label={<Text>{placeholder}</Text>}
      onChangeText={!isPickerInput ? onChangeText : undefined}
      editable={!isPickerInput}
      secureTextEntry={isPassword && isSecure}
      style={[
        styles.inputField,
        multiline && styles.multiline,
        backgroundColor ? { backgroundColor } : {},
      ]}
      outlineColor={error ? COLORS.error : COLORS.darkGray}
      activeOutlineColor={error ? COLORS.error : COLORS.primary}
      left={
        prefixIcon ? (
          <TextInput.Icon
            icon={() => (
              <Image source={ICONS[prefixIcon]} style={styles.prefixIcon} />
            )}
          />
        ) : null
      }
      right={renderRightIcon()}
      theme={{
        colors: {
          text: COLORS.black,
          placeholder: COLORS.gray,
        },
        roundness: 15,
      }}
      render={inputProps => (
        <RNTextInput
          {...inputProps}
          style={[inputProps.style, styles.textInput]}
        />
      )}
      onFocus={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
      {...props}
    />
  );

  return (
    <View style={[styles.inputContainer, style]}>
      {isPickerInput ? (
        <Pressable onPress={() => setShowPicker(true)}>
          <View pointerEvents="none">{mainInputContent}</View>
        </Pressable>
      ) : (
        mainInputContent
      )}

      {showPicker && isPickerInput && (
        <DateTimePicker
          testID="dateTimePicker"
          value={internalDate}
          mode={dataType}
          is24Hour={true}
          display="default"
          onChange={handlePickerChange}
        />
      )}

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default Input;
