import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput as RNTextInput,
  Pressable,
  Platform,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {useStyle} from './style';
import {COLORS} from '../../../utils/color';
import Text from '../Text';
import CustomVectorIcon from '../CustomvectorIcon';
import {scale} from 'react-native-size-matters';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  isPassword?: boolean;
  error?: string;
  style?: object;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  backgroundColor?: string;
  multiline?: boolean;
  prefixIcon?: string | React.ReactNode;
  showClearButton?: boolean;
  onClear?: () => void;
  dataType?: 'text' | 'date' | 'time';
  onDateChange?: (date: Date) => void;
  dateIconName?: string;
  timeIconName?: string;
  [key: string]: any;
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
  dateIconName = 'MaterialCommunityIcons:calendar',
  timeIconName = 'MaterialCommunityIcons:clock-outline',
  ...props
}) => {
  const [internalDate, setInternalDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [isSecure, setIsSecure] = useState<boolean>(isPassword);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const styles = useStyle();

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
      let formattedValue = '';

      if (dataType === 'date') {
        formattedValue = selectedDate.toLocaleDateString();
      } else if (dataType === 'time') {
        formattedValue = selectedDate.toLocaleTimeString();
      }

      onChangeText(formattedValue);
      onDateChange?.(selectedDate);
    }
  };

  const renderRightIcon = () => {
    if (dataType === 'date') {
      return (
        <TextInput.Icon
          icon={() => (
            <CustomVectorIcon
              name={dateIconName}
              size={24}
              color={isFocused ? COLORS.primary : COLORS.gray}
            />
          )}
          onPress={() => setShowPicker(true)}
        />
      );
    }

    if (dataType === 'time') {
      return (
        <TextInput.Icon
          icon={() => (
            <CustomVectorIcon
              name={timeIconName}
              size={24}
              color={isFocused ? COLORS.primary : COLORS.gray}
            />
          )}
          onPress={() => setShowPicker(true)}
        />
      );
    }

    if (isPassword) {
      return (
        <TextInput.Icon
          icon={() => (
            <CustomVectorIcon
              name={isSecure ? 'Feather:eye' : 'Feather:eye-off'}
              size={24}
              color={isFocused ? COLORS.primary : COLORS.gray}
            />
          )}
          onPress={() => setIsSecure(!isSecure)}
        />
      );
    }

    if (showClearButton && value && dataType === 'text') {
      return (
        <TextInput.Icon
          icon={() => (
            <CustomVectorIcon
              name="MaterialCommunityIcons:close-circle"
              size={24}
              color={COLORS.gray}
            />
          )}
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
      value={value}
      onChangeText={!isPickerInput ? onChangeText : undefined}
      editable={!isPickerInput}
      keyboardType={keyboardType}
      secureTextEntry={isPassword && isSecure}
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      style={[
        styles.inputField,
        multiline && {minHeight: 100, textAlignVertical: 'top'},
        backgroundColor ? {backgroundColor} : {},
      ]}
      outlineColor={error ? COLORS.error : COLORS.darkGray}
      activeOutlineColor={error ? COLORS.error : COLORS.primary}
      left={
        prefixIcon ? (
          <TextInput.Icon
            icon={() =>
              typeof prefixIcon === 'string' ? (
                <CustomVectorIcon
                  name={prefixIcon}
                  size={24}
                  color={COLORS.gray}
                />
              ) : (
                prefixIcon
              )
            }
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
          style={[
            inputProps.style,
            {
              fontFamily: 'WinkyRough-Regular',
              fontSize: scale(14),
              color: COLORS.black,
            },
          ]}
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
