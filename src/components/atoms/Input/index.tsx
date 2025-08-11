// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   TextInput as RNTextInput,
//   Pressable,
//   Image,
//   Platform,
//   NativeSyntheticEvent,
//   TextInputFocusEventData,
//   StyleProp,
//   TextStyle,
// } from 'react-native';
// import { TextInput } from 'react-native-paper';
// import DateTimePicker, {
//   DateTimePickerEvent,
// } from '@react-native-community/datetimepicker';
// import { ICONS } from '@assets/index';
// import { useTheme } from '@react-navigation/native';

// import useStyle from './style';
// import Text from '../Text';

// interface InputProps {
//   placeholder: string;
//   value: string;
//   maxlength?: number;
//   onChangeText: (text: string) => void;
//   keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
//   isPassword?: boolean;
//   error?: string;
//   autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
//   backgroundColor?: string;
//   multiline?: boolean;
//   prefixIcon?: keyof typeof ICONS;
//   showClearButton?: boolean;
//   onClear?: () => void;
//   dataType?: 'text' | 'date' | 'time';
//   onDateChange?: (date: Date) => void;
//   style?: StyleProp<TextStyle>;
//   [key: string]: any;
// }

// const Input: React.FC<InputProps> = ({
//   placeholder,
//   value,
//   onChangeText,
//   keyboardType = 'default',
//   isPassword = false,
//   error,
//   maxlength,
//   style,
//   autoCapitalize = 'none',
//   backgroundColor,
//   multiline = false,
//   prefixIcon,
//   showClearButton = false,
//   onClear,
//   dataType = 'text',
//   onDateChange,
//   ...props
// }) => {
//   const [internalDate, setInternalDate] = useState<Date>(new Date());
//   const [showPicker, setShowPicker] = useState<boolean>(false);
//   const [isSecure, setIsSecure] = useState<boolean>(isPassword);
//   const [isFocused, setIsFocused] = useState<boolean>(false);

//   const styles = useStyle();
//   const { colors } = useTheme();

//   useEffect(() => {
//     if ((dataType === 'date' || dataType === 'time') && value) {
//       const parsedDate = new Date(value);
//       if (!isNaN(parsedDate.getTime())) {
//         setInternalDate(parsedDate);
//       }
//     }
//   }, [value, dataType]);

//   const handlePickerChange = (
//     event: DateTimePickerEvent,
//     selectedDate?: Date,
//   ) => {
//     setShowPicker(Platform.OS === 'ios');
//     if (event.type === 'dismissed') return;

//     if (selectedDate) {
//       setInternalDate(selectedDate);
//       const formattedValue =
//         dataType === 'date'
//           ? selectedDate.toLocaleDateString()
//           : selectedDate.toLocaleTimeString();

//       onChangeText(formattedValue);
//       onDateChange?.(selectedDate);
//     }
//   };

//   const renderRightIcon = () => {
//     if (isPassword) {
//       return (
//         <TextInput.Icon
//           icon={() => (
//             <Image
//               source={isSecure ? ICONS.eyeOff : ICONS.eye}
//               style={styles.icon}
//             />
//           )}
//           onPress={() => setIsSecure(!isSecure)}
//         />
//       );
//     }

//     if (showClearButton && value && dataType === 'text') {
//       return (
//         <TextInput.Icon
//           icon={() => <Image source={ICONS.cancel} style={styles.icon} />}
//           onPress={onClear}
//         />
//       );
//     }

//     return null;
//   };

//   const isPickerInput = dataType === 'date' || dataType === 'time';

//   const mainInputContent = (
//     <TextInput
//       keyboardType={keyboardType}
//       mode="outlined"
//       label={<Text>{placeholder}</Text>}
//       onChangeText={!isPickerInput ? onChangeText : undefined}
//       editable={!isPickerInput}
//       secureTextEntry={isPassword && isSecure}
//       maxLength={maxlength}
//       style={[
//         styles.inputField,
//         multiline && styles.multiline,
//         backgroundColor ? { backgroundColor } : {},
//       ]}
//       outlineColor={error ? colors.error : colors.darkGray}
//       activeOutlineColor={error ? colors.error : colors.primary}
//       left={
//         prefixIcon ? (
//           <TextInput.Icon
//             icon={() => (
//               <Image source={ICONS[prefixIcon]} style={styles.prefixIcon} />
//             )}
//           />
//         ) : null
//       }
//       right={renderRightIcon()}
//       theme={{
//         roundness: 10,
//       }}
//       render={inputProps => (
//         <RNTextInput
//           {...inputProps}
//           style={[inputProps.style, styles.textInput]}
//         />
//       )}
//       onFocus={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
//         setIsFocused(true);
//         props.onFocus?.(e);
//       }}
//       onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
//         setIsFocused(false);
//         props.onBlur?.(e);
//       }}
//       {...props}
//     />
//   );

//   return (
//     <View style={[styles.inputContainer, style]}>
//       {isPickerInput ? (
//         <Pressable onPress={() => setShowPicker(true)}>
//           <View pointerEvents="none">{mainInputContent}</View>
//         </Pressable>
//       ) : (
//         mainInputContent
//       )}

//       {showPicker && isPickerInput && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={internalDate}
//           mode={dataType}
//           is24Hour={true}
//           display="default"
//           onChange={handlePickerChange}
//         />
//       )}

//       {!!error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// export default Input;

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  Image,
} from 'react-native';
import Text from '../Text';
import useStyle from './style';
import { ICONS } from '@assets/index';

interface CustomInputProps {
  // Basic props
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e?: any) => void;

  // Input configuration
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;

  // Input types
  secureTextEntry?: boolean;
  editable?: boolean;

  // Validation
  error?: string;
  touched?: boolean;

  // Styling
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;

  // Additional props
  [key: string]: any;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  keyboardType = 'default',
  autoCapitalize = 'none',
  maxLength,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  editable = true,
  error,
  touched,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const styles = useStyle();
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e?: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const hasError = error && touched;
  const isPassword = secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          hasError && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}>
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.textInputMultiline,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={styles.placeHolderColor.color}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          secureTextEntry={isPassword && !isPasswordVisible}
          editable={editable}
          {...props}
        />

        {/* Password Toggle */}
        {isPassword && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}>
            <Image
              source={isPasswordVisible ? ICONS.eyeOff : ICONS.eye}
              style={[
                styles.icon,
                {
                  tintColor: isFocused
                    ? styles.inputContainerFocused.borderColor
                    : styles.inputContainer.borderColor,
                },
              ]}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {hasError && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}

      {/* Character Counter */}
      {maxLength && value && (
        <Text style={styles.counterText}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

export default CustomInput;
