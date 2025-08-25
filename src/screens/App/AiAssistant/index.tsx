import React, { useEffect, useRef, memo } from 'react';
import useStyle from './style';
import useAiAssistant from './useAiAssistant';
import { Container, Input, Text, CustomFlatList } from '@components/index';
import { Animated, Image, TouchableOpacity, View } from 'react-native';
import { ICONS } from '@assets/index';

// Enhanced Animated Logo Component
const AnimatedLogo = ({ styles }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(1)).current;
  const glowOpacityAnim = useRef(new Animated.Value(0.3)).current;
  const glowScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous rotation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      }),
    );

    // Logo pulsing scale animation
    const logoScaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScaleAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoScaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    // Glow opacity animation
    const glowOpacityAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacityAnim, {
          toValue: 0.8,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacityAnim, {
          toValue: 0.3,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    );

    // Glow scale animation
    const glowScaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowScaleAnim, {
          toValue: 1.1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowScaleAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    );

    rotateAnimation.start();
    logoScaleAnimation.start();
    glowOpacityAnimation.start();
    glowScaleAnimation.start();

    return () => {
      rotateAnimation.stop();
      logoScaleAnimation.stop();
      glowOpacityAnimation.stop();
      glowScaleAnimation.stop();
    };
  }, [rotateAnim, logoScaleAnim, glowOpacityAnim, glowScaleAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.logoContainer}>
      {/* Glow effect background */}
      <Animated.View
        style={[
          styles.logoGlow,
          {
            opacity: glowOpacityAnim,
            transform: [{ scale: glowScaleAnim }],
          },
        ]}
      />
      {/* Main logo */}
      <Animated.View
        style={{
          transform: [{ rotate: spin }, { scale: logoScaleAnim }],
        }}>
        <Image source={ICONS.gemini} style={styles.logoIcon} />
      </Animated.View>
    </View>
  );
};

// Enhanced Bubble Loader Component
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
            duration: 800,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 800,
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
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    }),
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 1.2],
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

// MessageItem Component (unchanged)
const MessageItem = memo(
  ({
    item,
    styles,
    isTyping,
    showPrintOption,
    printFullMessage,
    handleCopy,
    copiedMessageId,
  }) => {
    const isUser = item.isUser;

    // Animations for fade-in + slide-up
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(10)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, [fadeAnim, slideAnim]);

    return (
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>
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
            {/* main content */}
            <View style={styles.mainContentContainer}>
              <Text style={styles.messageText}>
                {item.text}
                {isTyping && '|'}
              </Text>

              {/* print option */}
              {showPrintOption === item.id && (
                <TouchableOpacity
                  style={styles.printButton}
                  onPress={() => printFullMessage(item.id)}
                  activeOpacity={0.7}>
                  <Text type="BOLD" style={styles.printButtonText}>
                    Fast Forward
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* copy button (AI only) */}
            {!isUser && !isTyping && item.text.length > 0 && (
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => handleCopy(item.text, item.id)}>
                <Image
                  source={
                    copiedMessageId === item.id ? ICONS.check : ICONS.copy
                  }
                  style={styles.copyIcon}
                />
                <Text style={styles.copyText}>
                  {copiedMessageId === item.id ? 'Copied' : 'Copy'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    );
  },
);

const AiAssistant = () => {
  const styles = useStyle();
  const {
    states,
    flatListRef,
    sendMessage,
    printFullMessage,
    stopTyping,
    handleCopy,
  } = useAiAssistant();

  const renderMessage = ({ item }) => {
    return (
      <MessageItem
        item={item}
        styles={styles}
        isTyping={states.typingMessageId === item.id}
        showPrintOption={states.showPrintOption}
        printFullMessage={printFullMessage}
        handleCopy={handleCopy}
        copiedMessageId={states.copiedMessageId}
      />
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
      <AnimatedLogo styles={styles} />
      <Text style={styles.emptyTitle}>Hello, how can I help?</Text>
      <Text style={styles.emptySubtitle}>
        You can ask questions related to{'\n'}studying, science, writing, or
        {'\n'}anything academic.
      </Text>
    </View>
  );

  const isTypingInProgress = states.typingMessageId !== null;
  const canSend = states.inputText.trim().length > 0 && !states.isLoading;

  return (
    <Container title="AI Assistant" showBackArrow>
      <View style={styles.container}>
        <View style={styles.chatContainer}>
          <CustomFlatList
            ref={flatListRef}
            data={states.messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={states.isLoading ? renderLoader : null}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />
        </View>

        <View style={styles.inputContainer}>
          <Input
            containerStyle={styles.inputField}
            value={states.inputText}
            onChangeText={states.setInputText}
            placeholder="Type a message..."
            multiline
            onSubmitEditing={isTypingInProgress ? stopTyping : sendMessage}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !canSend && !isTypingInProgress && styles.disabledButton,
            ]}
            onPress={isTypingInProgress ? stopTyping : sendMessage}
            disabled={!canSend && !isTypingInProgress}
            activeOpacity={0.7}>
            <Image
              source={isTypingInProgress ? ICONS.stop : ICONS.Send}
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default AiAssistant;
