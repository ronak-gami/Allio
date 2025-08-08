import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { ICONS } from '@assets/index';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

import { Button, CustomModal, Text } from '@components/index';

import useStyle from './style';
import { useChatDetails } from './useChatDetails';

const ChatDetailsScreen = () => {
  const styles = useStyle();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<any>>();
  const { user } = params || {};

  const {
    relationStatus,
    sendRequest,
    acceptRequest,
    rejectRequest,
    message,
    setMessage,
    sendMessage,
    chatHistory,
    scrollViewRef,
    handleScroll,
    imageModalVisible,
    selectedImage,
    openImageModal,
    closeImageModal,
  } = useChatDetails(user);

  const showImage = user?.profile && user?.profile !== '';
  const firstLetter = user?.firstName?.charAt(0)?.toUpperCase() || '?';

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>User data not found.</Text>
      </SafeAreaView>
    );
  }

  const renderFriendStatusCard = () => {
    if (relationStatus === 'accepted') {return null;}

    return (
      <View style={styles.card}>
        {showImage ? (
          <Image
            source={{ uri: user?.profile }}
            style={styles.cardImageCentered}
          />
        ) : (
          <View style={styles.cardPlaceholderCentered}>
            <Text style={styles.cardPlaceholderText}>{firstLetter}</Text>
          </View>
        )}

        <Text style={styles.cardTitle}>Let’s Connect</Text>
        <Text style={styles.cardDescriptionCentered}>
          {relationStatus === 'none'
            ? 'Send a friend request to start chatting.'
            : relationStatus === 'sent'
            ? 'Waiting for approval...'
            : 'This user sent you a request. Accept to start chatting.'}
        </Text>

        <View style={styles.actionRowCentered}>
          {relationStatus === 'notsent' && (
            <Button title="Send Friend Request" onPress={sendRequest} />
          )}
          {relationStatus === 'received' && (
            <>
              <Button title="Accept" onPress={acceptRequest} />
              <Button
                title="Reject"
                onPress={rejectRequest}
                outlineColor={colors.error}
              />
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ICONS.Left} style={styles.backIcon} />
          </TouchableOpacity>
          {showImage ? (
            <Image source={{ uri: user?.profile }} style={styles.headerImage} />
          ) : (
            <View style={styles.headerPlaceholder}>
              <Text style={styles.headerPlaceholderText}>{firstLetter}</Text>
            </View>
          )}
          <View>
            <Text style={styles.headerName}>{user?.firstName}</Text>
            <Text style={styles.headerEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Chat / Request */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.container}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {relationStatus && (
            <View style={styles.renderFriendStatusCard}>
              {renderFriendStatusCard()}
            </View>
          )}

          {relationStatus === 'accepted' && (
            <View style={styles.chatArea}>
              {chatHistory?.length === 0 ? (
                <Text style={styles.nomessages}>No messages yet.</Text>
              ) : (
                chatHistory?.map((chat, index) => (
                  <View
                    key={index}
                    style={[
                      styles.messageBubble,
                      chat.fromMe ? styles.myMessage : styles.theirMessage,
                    ]}>
                    {chat?.text ? (
                      <Text style={styles.messageText}>{chat?.text}</Text>
                    ) : null}
                    {chat?.image ? (
                      <TouchableOpacity
                        onPress={() => openImageModal(chat?.image)}>
                        <Image
                          source={{ uri: chat?.image }}
                          style={[
                            styles.chatImage,
                            { marginTop: chat.text ? 5 : 0 },
                          ]}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>

        {relationStatus === 'accepted' && (
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Type your message..."
              value={message}
              onChangeText={setMessage}
              style={styles.textInput}
              multiline
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Image source={ICONS.Send} style={styles.sendIcon} />
            </TouchableOpacity>
          </View>
        )}

        <CustomModal
          visible={imageModalVisible}
          title="Image"
          onClose={closeImageModal}>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </CustomModal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetailsScreen;
