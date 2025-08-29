import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFormik } from 'formik';

import {
  Button,
  Container,
  CustomFlatList,
  Input,
  LastUpdatedTime,
  NewsCard,
} from '@components/index';

import useNews from './useNews';
import useStyle from './styles';

const News = () => {
  const [activeTab, setActiveTab] = useState<'News List' | 'Add List'>(
    'News List',
  );
  const styles = useStyle();
  const {
    newsList,
    handleDelete,
    onSubmit,
    onRefresh,
    handleEdit,
    editItem,
    time,
  } = useNews();

  const initialFormValues = editItem
    ? {
        id: editItem.id || '',
        name: editItem.name || '',
        description: editItem.description || '',
        image: editItem.image || '',
      }
    : { name: '', description: '', image: '' };

  const {
    values,
    errors,
    touched,
    setFieldTouched,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialFormValues,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
    },
  });

  useEffect(() => {
    if (activeTab === 'Add List') {
      resetForm();
    }
  }, [activeTab]);

  const renderNewsCard = ({ item }: { item: any }) => {
    return (
      <NewsCard
        item={item}
        handleDelete={() => handleDelete(item)}
        handleEdit={() => {
          handleEdit(item);
          setActiveTab('Add List');
        }}
      />
    );
  };

  return (
    <Container showBackArrow title="News">
      <View style={styles.headerContainer}>
        {['News List', 'Add List'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab as any)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab}
            </Text>
            {activeTab === tab && <View />}
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'News List' && (
        <View>
          <LastUpdatedTime time={time} />
          <CustomFlatList
            data={newsList}
            removeClippedSubviews={false}
            renderItem={renderNewsCard}
            onRefresh={onRefresh}
          />
        </View>
      )}

      {activeTab === 'Add List' && (
        <View style={styles.form}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}>
            <Input
              label="Name"
              placeholder="e.g., pn"
              value={values.name}
              onChangeText={text => setFieldValue('name', text)}
              error={touched.name ? errors.name : undefined}
              touched={touched.name}
              onBlur={() => setFieldTouched('name')}
            />
            <Input
              label="Description"
              placeholder="description"
              value={values.description}
              onChangeText={text => setFieldValue('description', text)}
              error={touched.description ? errors.description : undefined}
              touched={touched.description}
              onBlur={() => setFieldTouched('description')}
            />
            <Button
              title={'Submit'}
              style={styles.button}
              onPress={handleSubmit}
            />
          </KeyboardAvoidingView>
        </View>
      )}
    </Container>
  );
};

export default News;
