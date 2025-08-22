import React, { useEffect, useRef } from 'react';
import useStyle from './style';
import useAiAssistant from './useAiAssistant';
import { Container, Input, Text, CustomFlatList } from '@components/index';
import { Animated, Image, TouchableOpacity, View } from 'react-native';
import { ICONS } from '@assets/index';

// Animated Bubble Loader Component (No changes here)
const AnimatedBubbles = ({ styles }) => {
  const bubble1 = useRef(new Animated.Value(0)).current;
  const bubble2 = useRef(new Animated.Value(0)).current;
  const bubble3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (animatedValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 600,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    const animations = [
      createAnimation(bubble1, 0),
      createAnimation(bubble2, 200),
      createAnimation(bubble3, 400),
    ];

    animations.forEach(animation => animation.start());

    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, [bubble1, bubble2, bubble3]);

  const getAnimatedStyle = animatedValue => ({
    opacity: animatedValue,
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
  });

  return (
    <View style={styles.bubbleContainer}>
      <Animated.View style={[styles.bubble, getAnimatedStyle(bubble1)]} />
      <Animated.View style={[styles.bubble, getAnimatedStyle(bubble2)]} />
      <Animated.View style={[styles.bubble, getAnimatedStyle(bubble3)]} />
    </View>
  );
};

const AiAssistant = () => {
  const styles = useStyle();
  const {
    messages,
    inputText,
    isLoading,
    typingMessageId,
    showPrintOption, // Import new state
    flatListRef,
    setInputText,
    sendMessage,
    printFullMessage, // Import new function
  } = useAiAssistant();

  const renderMessage = ({ item }) => {
    const isUser = item.isUser;
    const isTyping = typingMessageId === item.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}>
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.aiText,
            ]}>
            {item.text}
            {isTyping && '|'}
          </Text>
          {/* ---- NEW: Conditionally render the "Print All" button ---- */}
          {showPrintOption === item.id && (
            <TouchableOpacity
              style={styles.printButton}
              onPress={() => printFullMessage(item.id)}
              activeOpacity={0.7}>
              <Text style={styles.printButtonText}>⚡ Print All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <View style={styles.loaderBubble}>
        <AnimatedBubbles styles={styles} />
        <Text style={styles.typingIndicator}>AI is thinking...</Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Hello! How can I help you today?</Text>
    </View>
  );

  const canSend = inputText.trim().length > 0 && !isLoading;

  return (
    <Container title="AI Assistant" showBackArrow>
      <View style={styles.container}>
        <View style={styles.chatContainer}>
          <CustomFlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={isLoading ? renderLoader : null}
          />
        </View>

        <View style={styles.inputContainer}>
          <Input
            containerStyle={styles.inputField}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            multiline
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendButton, !canSend && styles.disabledButton]}
            onPress={sendMessage}
            disabled={!canSend}
            activeOpacity={0.7}>
            <Image source={ICONS.Send} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default AiAssistant;
