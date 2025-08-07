import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Text from '../Text';
import { ICONS } from '@assets/index';
import useStyle from './style';
import { CustomFlatList } from '@components/index';

interface DropdownProps {
  label: string;
  data: string[];
  onSelect: (value: string) => void;
  selectedValue: string;
  error?: string;
  touched?: boolean;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  label,
  data,
  onSelect,
  selectedValue,
  error,
  touched,
}) => {
  const [visible, setVisible] = useState(false);
  const styles = useStyle();
  const { colors } = useTheme();

  const handleSelect = (item: string) => {
    onSelect(item);
    setVisible(false);
  };

  return (
    <>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[
          styles.dropdown,
          error && touched ? { borderColor: colors.error } : {},
        ]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}>
        <Text style={styles.dropdownText}>
          {selectedValue || 'Select an option'}
        </Text>
        <Image source={ICONS.down} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>

      {error && touched && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}>
          <View style={styles.modalContainer}>
            <CustomFlatList
              data={data}
              removeClippedSubviews={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    index !== data.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.black,
                    },
                  ]}
                  onPress={() => handleSelect(item)}>
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default CustomDropdown;
