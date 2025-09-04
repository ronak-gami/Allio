import React from 'react';
import { View } from 'react-native';
import { Container, CustomFlatList, Text } from '@components/index';
import useStyle from './style';
import useUsers from './useUsers';

const Users = () => {
  const styles = useStyle();
  const { users, usersLoading, usersError } = useUsers();

  const renderItem = ({ item }: any) => (
    <View style={styles.userItem}>
      <Text type="bold">
        {item.firstName} {item.lastName}
      </Text>
      <Text>{item.email}</Text>
      <Text>{item.mobileNo}</Text>
    </View>
  );

  return (
    <Container showBackArrow title="Users" showLoader={usersLoading}>
      <View style={styles.container}>
        {usersError ? (
          <Text style={styles.errorText}>{usersError}</Text>
        ) : (
          <CustomFlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={(item: { uid: any }) => item.uid}
            contentContainerStyle={styles.contentContainer}
            ListEmptyComponent={
              !usersLoading && (
                <Text type="BOLD" style={styles.emptyText}>
                  No users found.
                </Text>
              )
            }
          />
        )}
      </View>
    </Container>
  );
};

export default Users;
