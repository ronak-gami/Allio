import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { Formik } from 'formik';

import {
  Button,
  Container,
  CustomFlatList,
  Input,
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
    loading,
    handleDelete,
    onSubmit,
    onRefresh,
    handleEdit,
    editItem,
  } = useNews();

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

  const initialFormValues = editItem
    ? {
        id: editItem.id || '',
        name: editItem.name || '',
        description: editItem.description || '',
        image: editItem.image || '',
      }
    : { name: '', description: '', image: '' };

  return (
    <Container showBackArrow title="News" showLoader={loading}>
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
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {activeTab === tab && <View />}
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'News List' && (
        <CustomFlatList
          data={newsList}
          removeClippedSubviews={false}
          renderItem={renderNewsCard}
          onRefresh={onRefresh}
        />
      )}

      {activeTab === 'Add List' && (
        <View style={styles.form}>
          <Formik
            initialValues={initialFormValues}
            onSubmit={(values, { resetForm }) => {
              onSubmit(values);
              resetForm();
            }}>
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}>
                <Input
                  label="Name"
                  placeholder="e.g., pn"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  error={touched.name ? errors.name : undefined}
                  touched={touched.name}
                />
                <Input
                  label="Description"
                  placeholder="description"
                  value={values.description}
                  onChangeText={handleChange('description')}
                  error={touched.description ? errors.description : undefined}
                  touched={touched.description}
                />

                {/* <TouchableOpacity
                  style={styles.avatarWrapper}
                  onPress={handlePickImage}>
                  <Image
                    source={
                      userData.uri
                        ? { uri: userData.uri }
                        : IMAGES.Dummy_Profile
                    }
                    style={styles.avatar}
                  />
                </TouchableOpacity> */}

                <Button
                  title={'Submit'}
                  style={styles.button}
                  onPress={handleSubmit}
                />
              </KeyboardAvoidingView>
            )}
          </Formik>
        </View>
      )}
    </Container>
  );
};

export default News;
