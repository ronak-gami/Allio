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

interface InputProps {
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

const Input: React.FC<InputProps> = ({
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
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
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
          containerStyle,
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

export default Input;
