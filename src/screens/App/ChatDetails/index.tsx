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
import Text from '@components/atoms/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

import { useChatDetails } from './useChatDetails';
import useStyle from './style';
import { Button } from '@components/index';

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
  } = useChatDetails(user?.email);

  console.log('the chat histry', chatHistory);

  const showImage = user?.profile && user?.profile !== '';
  const firstLetter = user?.firstName?.charAt(0)?.toUpperCase() || '?';

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: 'red', fontSize: 20, textAlign: 'center' }}>
          User data not found.
        </Text>
      </SafeAreaView>
    );
  }

  const renderFriendStatusCard = () => {
    if (relationStatus === 'accepted') return null;

    return (
      <View style={styles.card}>
        {showImage ? (
          <Image
            source={{ uri: user.profile }}
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
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ICONS.Left} style={styles.backIcon} />
          </TouchableOpacity>
          {showImage ? (
            <Image source={{ uri: user.profile }} style={styles.headerImage} />
          ) : (
            <View style={styles.headerPlaceholder}>
              <Text style={styles.headerPlaceholderText}>{firstLetter}</Text>
            </View>
          )}
          <View>
            <Text style={styles.headerName}>{user.firstName}</Text>
            <Text style={styles.headerEmail}>{user.email}</Text>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollContainer]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {relationStatus && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexGrow: 1,
              }}>
              {renderFriendStatusCard()}
            </View>
          )}
          {relationStatus === 'accepted' && (
            <View style={styles.chatArea}>
              {chatHistory.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 10 }}>
                  No messages yet.
                </Text>
              ) : (
                chatHistory.map((chat, index) => (
                  <View
                    key={index}
                    style={[
                      styles.messageBubble,
                      chat.fromMe ? styles.myMessage : styles.theirMessage,
                    ]}>
                    <Text style={styles.messageText}>{chat.text}</Text>
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
              placeholderTextColor="#999"
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetailsScreen;
