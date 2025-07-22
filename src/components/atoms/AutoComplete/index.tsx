import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity, Text} from 'react-native';
import {useStyle} from './style';
import Input from '../Input';

interface AutoCompleteProps {
  data: string[];
  placeholder?: string;
  onSelect: (item: string) => void;
  error?: string;
  touched?: boolean;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  data,
  placeholder = 'Search...',
  onSelect,
  error,
  touched,
}) => {
  const styles = useStyle();
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState<string[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === '') {
      setFilteredData([]);
      return;
    }

    const filtered = data.filter(item =>
      item.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const handleSelect = (item: string) => {
    setQuery(item);
    setFilteredData([]);
    onSelect(item);
  };

  const handleClear = () => {
    setQuery('');
    setFilteredData([]);
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder={placeholder}
        value={query}
        onChangeText={handleSearch}
        error={touched && error ? error : undefined}
        showClearButton={query.length > 0}
        onClear={handleClear}
        dataType="text"
      />

      {filteredData.length > 0 && (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps="handled"
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleSelect(item)}>
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default AutoComplete;
