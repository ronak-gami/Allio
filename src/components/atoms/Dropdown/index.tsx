import React, {useState} from 'react';
import {View, TouchableOpacity, Modal, FlatList, Image} from 'react-native';
import {useStyle} from './style';
import Text from '../Text';
import {COLORS} from '../../../utils/color';
import {ICONS} from '../../../assets';

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
  const styles = useStyle();
  const [visible, setVisible] = useState(false);

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
          error && touched ? {borderColor: COLORS.error} : {},
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
            <FlatList
              data={data}
              keyExtractor={item => item}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    index !== data.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.black,
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
