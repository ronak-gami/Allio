import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

const ChipInputComponent = () => {
  const [inputText, setInputText] = useState('');
  const [chips, setChips] = useState([]);

  const handleAddChip = () => {
    const trimmedText = inputText.trim();

    // Check if input is not empty and not already exists
    if (trimmedText && !chips.includes(trimmedText)) {
      setChips(prevChips => [...prevChips, trimmedText]);
      setInputText('');
    } else if (chips.includes(trimmedText)) {
      Alert.alert('Duplicate', 'This label already exists!');
    }
  };

  const handleRemoveChip = chipToRemove => {
    setChips(prevChips => prevChips.filter(chip => chip !== chipToRemove));
  };

  const renderChip = (chip, index) => (
    <View key={index} style={styles.chip}>
      <Text style={styles.chipText}>{chip}</Text>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => handleRemoveChip(chip)}
        activeOpacity={0.7}>
        <Text style={styles.cancelIcon}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={handleAddChip}
        placeholder="Type a label and press Enter"
        placeholderTextColor="#999"
        returnKeyType="done"
        blurOnSubmit={false}
      />

      {chips.length > 0 && (
        <ScrollView
          style={styles.chipsContainer}
          contentContainerStyle={styles.chipsContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.chipsWrapper}>
            {chips.map((chip, index) => renderChip(chip, index))}
          </View>
        </ScrollView>
      )}

      {chips.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {chips.length} label{chips.length !== 1 ? 's' : ''} added
          </Text>
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={() => setChips([])}
            activeOpacity={0.7}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chipsContainer: {
    maxHeight: 300,
    marginTop: 20,
  },
  chipsContent: {
    paddingBottom: 10,
  },
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  clearAllButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  clearAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ChipInputComponent;
