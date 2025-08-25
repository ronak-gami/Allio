/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  ImageBackground,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@types/navigations';
import { ICONS, IMAGES } from '@assets/index';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import Video from 'react-native-video';
import MapView, { Marker } from 'react-native-maps';
import {
  Button,
  Container,
  CustomHeader,
  CustomModal,
  Input,
  Text,
} from '@components/index';
import useStyle from './style';
import { useChatDetails } from './useChatDetails';

type ChatDetailsRouteProp = RouteProp<HomeStackParamList, 'ChatDetailsScreen'>;

const ChatDetailsScreen = () => {
  const styles = useStyle();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<ChatDetailsRouteProp>();
  const { user } = route.params || {};

  const {
    states,
    relationStatus,
    sendRequest,
    acceptRequest,
    rejectRequest,
    sendMessage,
    handleScroll,
    openImageModal,
    closeImageModal,
    openVideoModal,
    closeVideoModal,
    blockUser,
    clearChat,
    unblockUser,
    setThemeModalVisible,
    selectTheme,
    removeTheme,
    navigateToProfile,
    setMenuVisible,
    openMenu,

    openLocationFullModal,
    closeLocationFullModal,
    ensureLocationReady,
    shareCurrentLocation,
    startLiveLocationShare,
    stopLiveLocationShare,
    isLiveSharingMine,
    openInGoogleMaps,
    setLiveDurationMin,
    liveDurationMin,

    dismissLocationPrompt,
    openSystemLocationSettings,
    retryLocationPreparation,

    toggleSelectMessage,
    clearSelectedMessages,
    actionModalVisible,
    openActionModal,
    closeActionModal,
    deleteMessagesForMe,
    deleteMessagesForEveryone,
    pinMessage,

    handleEditMessage,
    setEditText,

    setActionMsgId,

    setIsEditing,
    setEditMsgId,
  } = useChatDetails(user);

  const showImage = user?.profileImage && user?.profileImage.trim() !== '';
  const firstLetter = user?.firstName?.charAt(0)?.toUpperCase() || '?';

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>User data not found.</Text>
      </SafeAreaView>
    );
  }

  const renderFriendStatusCard = () => {
    if (relationStatus === 'accepted') return null;

    return (
      <View style={styles.card}>
        {showImage ? (
          <Image
            source={{ uri: user?.profileImage }}
            style={styles.profileImage}
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
            <Button
              title="Send Friend Request"
              onPress={sendRequest}
              style={styles.button}
            />
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
    <Container
      title="Chat Details"
      showHeader={false}
      showLoader={states?.loadingMessages}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={ICONS.BackArrow} style={styles.backIcon} />
            </TouchableOpacity>

            {showImage ? (
              <Image
                source={{ uri: user?.profileImage }}
                style={styles.headerImage}
              />
            ) : (
              <View style={styles.headerPlaceholder}>
                <Text style={styles.headerPlaceholderText}>{firstLetter}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.flex}
              activeOpacity={0.7}
              onPress={() => {
                if (!states?.isBlockedByThem) navigateToProfile();
              }}>
              <Text style={styles.headerName}>{user?.firstName}</Text>
              <Text style={styles.headerEmail}>{user?.email}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openMenu}>
              <Image source={ICONS.menu} style={styles.menuIcon} />
            </TouchableOpacity>
          </View>
          {states?.chatHistory?.length > 0 &&
            (() => {
              const pinnedMsgId = states?.pinnedMsg || null;
              const pinnedMsg = states?.chatHistory?.find(
                m => m.id === pinnedMsgId,
              );
              return pinnedMsg ? (
                <TouchableOpacity
                  style={[
                    styles.pinnedMessageContainer,
                    { position: 'relative' },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => {
                    const idx = states.chatHistory.findIndex(
                      m => m.id === pinnedMsgId,
                    );
                    if (idx !== -1 && states.scrollViewRef?.current) {
                      states.scrollViewRef.current.scrollTo({
                        y: idx * 105,
                        animated: true,
                      });

                      setActionMsgId(null);
                      states.setHighlightedMsgId(pinnedMsgId); // highlight the message

                      setTimeout(() => {
                        states.setHighlightedMsgId(null);
                      }, 3000);
                    }
                  }}>
                  <Image
                    source={ICONS.Attach}
                    style={styles.pinnedMessageIcon}
                  />
                  <Text style={styles.pinnedMsgText}>
                    {pinnedMsg.text || '[Pinned message]'}
                  </Text>
                  <TouchableOpacity onPress={() => pinMessage('null')}>
                    <Image
                      source={ICONS.cancel}
                      style={styles.pinnedMessageIcon}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ) : null;
            })()}

          {/* Selected Messages Bar */}
          {states?.selectedMessages.length > 0 && (
            <View style={styles.selecteddMessageContainer}>
              <View style={styles.selecteddMessageview}>
                <Image
                  source={ICONS.check}
                  style={styles.selectedMessageIcon}
                />
                <Text style={styles.selecteddMessageText}>
                  {states?.selectedMessages.length} selected
                </Text>
              </View>
              <View style={styles.selecteddMessageview}>
                <TouchableOpacity onPress={openActionModal}>
                  <Image
                    source={ICONS.menu}
                    style={styles.selectedMessageIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={clearSelectedMessages}>
                  <Image
                    source={ICONS.cancel}
                    style={styles.selectedMessageIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <ImageBackground
            source={
              states?.selectedTheme ? { uri: states?.selectedTheme } : null
            }
            style={styles.flex}
            resizeMode="cover">
            <ScrollView
              ref={states?.scrollViewRef}
              contentContainerStyle={[
                styles.scrollContainer,
                states?.selectedTheme ? { backgroundColor: 'transparent' } : {},
              ]}
              style={{
                flex: 1,
                backgroundColor: states?.selectedTheme
                  ? undefined
                  : colors.background,
              }}
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
                <>
                  {states?.isBlockedByMe ? (
                    <View style={styles.flexGrow}>
                      <View style={styles.card}>
                        {showImage ? (
                          <Image
                            source={{ uri: user?.profileImage }}
                            style={styles.profileImage}
                          />
                        ) : (
                          <View style={styles.cardPlaceholderCentered}>
                            <Text style={styles.cardPlaceholderText}>
                              {firstLetter}
                            </Text>
                          </View>
                        )}
                        <Text style={styles.cardTitle}>Block</Text>
                        <Text style={styles.cardDescriptionCentered}>
                          You blocked this user.
                        </Text>
                        <Button
                          style={styles.padding}
                          title="Unblock User"
                          onPress={states?.unblockUserInline || (() => {})}
                        />
                      </View>
                    </View>
                  ) : states?.chatHistory?.length === 0 &&
                    !states?.loadingMessages ? (
                    <View style={styles.flexGrow}>
                      <View style={styles.card}>
                        {showImage ? (
                          <Image
                            source={{ uri: user?.profileImage }}
                            style={styles.profileImage}
                          />
                        ) : (
                          <View style={styles.cardPlaceholderCentered}>
                            <Text style={styles.cardPlaceholderText}>
                              {firstLetter}
                            </Text>
                          </View>
                        )}
                        <Text style={styles.cardTitle}>Let’s Message</Text>
                        <Text style={styles.cardDescriptionCentered}>
                          No messages yet.
                        </Text>
                      </View>
                    </View>
                  ) : (
                    states?.chatHistory?.map((chat, index) => {
                      const msgId = chat.id;
                      const isSelected =
                        states?.selectedMessages.includes(msgId);

                      const isLatestLiveShareMine =
                        chat.liveShare?.active &&
                        chat.fromMe &&
                        isLiveSharingMine &&
                        index ===
                          states.chatHistory
                            .map((m, i) =>
                              m.liveShare?.active && m.fromMe ? i : -1,
                            )
                            .filter(i => i !== -1)
                            .pop();

                      const latitude =
                        chat?.location?.latitude ?? chat?.location?.lat;
                      const longitude =
                        chat?.location?.longitude ?? chat?.location?.lng;

                      const openMaps = () => {
                        if (latitude && longitude) {
                          openInGoogleMaps(latitude, longitude);
                        }
                      };

                      // Show small modal at bottom of message if actionMsgId matches
                      const showActionMenu = states.actionMsgId === msgId;

                      return (
                        <View key={msgId} style={{ position: 'relative' }}>
                          {/* Message bubble with selection logic */}
                          <TouchableOpacity
                            onLongPress={() => {
                              toggleSelectMessage(msgId);
                              setActionMsgId(null);
                              setIsEditing(false);
                            }}
                            onPress={() => {
                              if (states?.selectedMessages.length > 0) {
                                toggleSelectMessage(msgId);
                              } else {
                                setActionMsgId(msgId);
                              }
                            }}
                            style={[
                              styles.messageBubble,
                              chat.fromMe
                                ? styles.myMessage
                                : styles.theirMessage,
                              isSelected && styles.selectedItem,
                              states.highlightedMsgId === chat.id &&
                                styles.selectedItem, // Use selected color for highlight
                            ]}
                            activeOpacity={0.95}>
                            {/* Text */}
                            {chat?.text && (
                              <Text style={styles.messageText}>
                                {chat.text}
                              </Text>
                            )}
                            {/* Show "edit" below the message if edited */}
                            {chat.edited && (
                              <Text type="semibold" style={styles.editedtext}>
                                edited
                              </Text>
                            )}
                            {/* Image */}
                            {chat?.image && (
                              <TouchableOpacity
                                onPress={() => openImageModal(chat.image!)}>
                                <Image
                                  source={{ uri: chat.image! }}
                                  style={[
                                    styles.chatImage,
                                    { marginTop: chat.text ? 5 : 0 },
                                  ]}
                                  resizeMode="cover"
                                />
                              </TouchableOpacity>
                            )}
                            {/* Video */}
                            {chat?.video && (
                              <TouchableOpacity
                                onPress={() => openVideoModal(chat.video!)}>
                                <Video
                                  source={{ uri: chat.video! }}
                                  style={styles.chatVideo}
                                  resizeMode="cover"
                                  paused
                                  pointerEvents="none"
                                />
                                <View style={styles.playIconOverlay}>
                                  <Image
                                    source={ICONS.VideoPlay}
                                    style={styles.playBtn}
                                  />
                                </View>
                              </TouchableOpacity>
                            )}
                            {(latitude && longitude) || chat?.liveShare ? (
                              <TouchableOpacity
                                style={{
                                  marginTop:
                                    chat.text || chat.image || chat.video
                                      ? 8
                                      : 0,
                                }}
                                activeOpacity={0.9}
                                onPress={openMaps}
                                disabled={!latitude || !longitude}>
                                <View style={{ gap: 10 }}>
                                  <MapView
                                    style={styles.mapView}
                                    initialRegion={{
                                      latitude: latitude || 0,
                                      longitude: longitude || 0,
                                      latitudeDelta: 0.01,
                                      longitudeDelta: 0.01,
                                    }}
                                    region={
                                      latitude && longitude
                                        ? {
                                            latitude,
                                            longitude,
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01,
                                          }
                                        : undefined
                                    }
                                    pointerEvents="none">
                                    {latitude && longitude && (
                                      <Marker
                                        coordinate={{
                                          latitude,
                                          longitude,
                                        }}
                                        title={
                                          chat?.liveShare?.active
                                            ? 'Live Location'
                                            : 'Shared Location'
                                        }
                                      />
                                    )}
                                  </MapView>
                                </View>

                                <View>
                                  <Text type="semibold">
                                    {chat?.liveShare?.active
                                      ? 'Live location • updating'
                                      : 'Shared location • tap to open'}
                                  </Text>
                                  {isLatestLiveShareMine && (
                                    <View>
                                      <Button
                                        title="Stop live location"
                                        onPress={stopLiveLocationShare}
                                        style={styles.stoplivebutton}
                                      />
                                    </View>
                                  )}
                                </View>
                              </TouchableOpacity>
                            ) : null}

                            {showActionMenu && (
                              <CustomModal
                                visible={showActionMenu}
                                title="Message Actions"
                                onClose={() => setActionMsgId(null)}>
                                {chat.fromMe && (
                                  <Button
                                    title="Edit Message"
                                    onPress={() => {
                                      setEditText(chat.text || '');
                                      setEditMsgId(msgId);
                                      setActionMsgId(null);
                                      setIsEditing(true);
                                    }}
                                  />
                                )}

                                <Button
                                  title="Pin Message"
                                  onPress={async () => {
                                    await pinMessage(msgId);
                                    setActionMsgId(null);
                                  }}
                                />

                                <Button
                                  title="Cancel"
                                  outlineColor={
                                    styles.menuItemDanger?.color || undefined
                                  }
                                  onPress={() => setActionMsgId(null)}
                                />
                              </CustomModal>
                            )}
                          </TouchableOpacity>
                        </View>
                      );
                    })
                  )}
                </>
              )}
            </ScrollView>
          </ImageBackground>

          {relationStatus === 'accepted' && (
            <View style={styles.inputContainer}>
              <Input
                placeholder={
                  states.isEditing
                    ? 'Edit your message...'
                    : 'Type your message...'
                }
                value={states.isEditing ? states.editText : states.message}
                onChangeText={text => {
                  if (states.isEditing) {
                    setEditText(text);
                  } else {
                    states.setMessage(text);
                  }
                }}
                style={styles.textInput}
              />
              <TouchableOpacity
                onPress={() => {
                  if (states.isEditing) {
                    handleEditMessage();
                  } else {
                    sendMessage();
                  }
                }}
                style={styles.sendButton}>
                <Image source={ICONS.Send} style={styles.sendIcon} />
              </TouchableOpacity>
            </View>
          )}

          <CustomModal
            visible={states?.imageModalVisible}
            title="Image"
            onClose={closeImageModal}>
            {states?.selectedImage && (
              <Image
                source={{ uri: states?.selectedImage }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
          </CustomModal>

          <CustomModal
            visible={states?.videoModalVisible}
            title="Video"
            onClose={closeVideoModal}>
            {states?.selectedVideo && (
              <Video
                source={{ uri: states?.selectedVideo }}
                style={styles.modalVideo}
                controls
                resizeMode="contain"
                paused={false}
              />
            )}
          </CustomModal>

          <Modal
            visible={states?.menuVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}>
            <TouchableOpacity
              style={styles.flex}
              activeOpacity={1}
              onPress={() => setMenuVisible(false)}>
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setMenuVisible(false);
                    states?.isBlockedByMe ? unblockUser() : blockUser();
                  }}
                  style={styles.padding}>
                  <Text type="semibold" style={styles.menuText}>
                    {states?.isBlockedByMe ? 'Unblock User' : 'Block User'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setMenuVisible(false);
                    clearChat();
                  }}
                  style={styles.padding}>
                  <Text type="semibold" style={styles.menuText}>
                    Clear Chat
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setMenuVisible(false);
                    setThemeModalVisible(true);
                  }}
                  style={styles.padding}>
                  <Text type="semibold" style={styles.menuText}>
                    Theme
                  </Text>
                </TouchableOpacity>

                {/* NEW: Share Location */}
                <TouchableOpacity
                  onPress={async () => {
                    setMenuVisible(false);
                    const ok = await ensureLocationReady();
                    if (ok) {
                      openLocationFullModal();
                    } else {
                      states?.setLocationPromptVisible?.(true);
                    }
                  }}
                  style={styles.padding}>
                  <Text type="semibold" style={styles.menuText}>
                    Share Location
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Theme Modal */}
          <CustomModal
            visible={states?.themeModalVisible}
            title="Select Chat Theme"
            onClose={() => setThemeModalVisible(false)}>
            <View style={styles.themeGrid}>
              {['Chattheme1', 'Chattheme2', 'Chattheme3', 'Chattheme4'].map(
                key => {
                  const themeUri = IMAGES[key];
                  const isSelected =
                    states?.selectedTheme === themeUri ||
                    states?.selecturl === themeUri;

                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => states?.setselecturl(themeUri)}
                      style={[
                        styles.themeOption,
                        isSelected && {
                          borderWidth: 5,
                          borderColor: colors.primary,
                        },
                      ]}>
                      <Image
                        source={themeUri}
                        style={styles.themeImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  );
                },
              )}
            </View>

            <Button
              title="Apply"
              loading={states?.loding}
              onPress={() => selectTheme(states?.selecturl)}
            />

            {states?.selectedTheme && (
              <Button
                title="Remove Theme"
                outlineColor={colors.primary}
                onPress={removeTheme}
              />
            )}
          </CustomModal>

          <Modal
            visible={states?.locationFullVisible}
            onRequestClose={closeLocationFullModal}
            animationType="slide"
            presentationStyle="fullScreen">
            <View style={styles.flex}>
              <CustomHeader
                showProfileLogo={false}
                showAppLogo={false}
                showBackArrow={true}
                title="Share Location"
                onProfilePress={() => {}}
                onBackPress={closeLocationFullModal}
              />

              <View style={styles.flex}>
                <MapView
                  style={styles.map}
                  showsUserLocation
                  key={'AIzaSyD9kG5DM7T14xn7BUjKuAtVGGHn33Lk60k'}
                  followsUserLocation
                  provider="google"
                  initialRegion={
                    states?.currentCoords
                      ? {
                          latitude: states.currentCoords.latitude,
                          longitude: states.currentCoords.longitude,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        }
                      : {
                          latitude: 20.5937,
                          longitude: 78.9629,
                          latitudeDelta: 10,
                          longitudeDelta: 10,
                        }
                  }
                  region={
                    states?.currentCoords
                      ? {
                          latitude: states.currentCoords.latitude,
                          longitude: states.currentCoords.longitude,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        }
                      : undefined
                  }>
                  {states?.currentCoords && (
                    <Marker
                      coordinate={{
                        latitude: states.currentCoords.latitude,
                        longitude: states.currentCoords.longitude,
                      }}
                      title="You"
                      description="Current location"
                    />
                  )}
                </MapView>
              </View>

              <View style={styles.bottomSheet}>
                <View style={styles.bottomSheetHeader}>
                  <Text type="semibold" style={styles.bottomSheetTitle}>
                    Choose what to share
                  </Text>

                  <View style={styles.durationChips}>
                    {[15, 30, 60].map(min => {
                      const selected = liveDurationMin === min;
                      return (
                        <TouchableOpacity
                          key={min}
                          onPress={() => setLiveDurationMin(min)}
                          style={[
                            styles.durationChip,
                            selected && styles.durationChipSelected,
                          ]}>
                          <Text
                            type="semibold"
                            style={[
                              styles.durationChipText,
                              selected && styles.durationChipTextSelected,
                            ]}>
                            {min}m
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.buttonGroup}>
                  <Button
                    title={
                      states?.currentCoords
                        ? 'Send current location'
                        : 'Finding your location...'
                    }
                    disabled={!states?.currentCoords}
                    onPress={async () => {
                      const ok = await ensureLocationReady(true);
                      if (ok) {
                        await shareCurrentLocation();
                        closeLocationFullModal();
                      }
                    }}
                  />

                  {!states?.isLiveSharingMine ? (
                    <Button
                      title={`Share live location (${liveDurationMin} min)`}
                      onPress={async () => {
                        const ok = await ensureLocationReady(true);
                        if (ok) {
                          await startLiveLocationShare(liveDurationMin);
                          closeLocationFullModal();
                        }
                      }}
                    />
                  ) : (
                    <Button
                      title="Stop live location"
                      outlineColor={colors.error}
                      onPress={async () => {
                        await stopLiveLocationShare();
                        closeLocationFullModal();
                      }}
                    />
                  )}
                </View>
              </View>
            </View>
          </Modal>

          <CustomModal
            visible={states?.locationPromptVisible}
            title="Turn on Location"
            onClose={dismissLocationPrompt}>
            <Text style={styles.promptText}>
              To share your location, please turn on Location Services and grant
              permission.
            </Text>
            <View style={styles.buttonGroup}>
              <Button
                title="Open Settings"
                onPress={openSystemLocationSettings}
              />
              <Button title="Try Again" onPress={retryLocationPreparation} />
            </View>
          </CustomModal>

          <CustomModal
            visible={actionModalVisible}
            title="Message Actions"
            onClose={closeActionModal}>
            {states.selectedMessages.length > 0 &&
            states?.selectedMessages.every(msgId => {
              const msg = states.chatHistory.find(m => m.id === msgId);
              return msg?.fromMe;
            }) ? (
              <Button
                title="Delete for Everyone"
                onPress={deleteMessagesForEveryone}
              />
            ) : null}

            {states?.selectedMessages.length > 0 && (
              <Button title="Delete for Me" onPress={deleteMessagesForMe} />
            )}

            <Button title="Cancel" onPress={closeActionModal} />
          </CustomModal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Container>
  );
};

export default ChatDetailsScreen;
