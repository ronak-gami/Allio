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
  Linking,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Video from 'react-native-video';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@types/navigations';
import { ICONS, IMAGES } from '@assets/index';
import { Button, Container, CustomModal, Input, Text } from '@components/index';
import { useChatDetails } from './useChatDetails';
import MapView, { Marker } from 'react-native-maps';
import useStyle from './style';

type ChatDetailsRouteProp = RouteProp<HomeStackParamList, 'ChatDetailsScreen'>;

const ChatDetailsScreen = () => {
  const styles = useStyle();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<ChatDetailsRouteProp>();
  const { user } = route.params || {};

  const [menuVisible, setMenuVisible] = useState<boolean>(false);

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
    handleShareLocation,
    handleShareLiveLocation,
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
    if (relationStatus === 'accepted') {
      return null;
    }
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
        <Text style={styles.cardTitle}>Let's Connect</Text>
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

  const openMenu = () => {
    setMenuVisible(true);
  };

  return (
    <Container title="Chat Details" showHeader={false}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={ICONS.BackArrow} style={styles.backIcon} />
            </TouchableOpacity>

            {showImage ? (
              <Image
                source={{ uri: user?.profile }}
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
              // Disable navigation if user is blocked by me
              onPress={() => {
                if (!states?.isBlockedByThem) {
                  navigateToProfile();
                }
              }}>
              <Text style={styles.headerName}>{user?.firstName}</Text>
              <Text style={styles.headerEmail}>{user?.email}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openMenu}>
              <Image source={ICONS.menu} style={styles.menuIcon} />
            </TouchableOpacity>
          </View>

          <ImageBackground
            source={
              states?.selectedTheme ? { uri: states?.selectedTheme } : null
            }
            style={styles.flex}
            resizeMode="cover">
            {/* Chat Content */}
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
                            source={{ uri: user?.profile }}
                            style={styles.cardImageCentered}
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
                          onPress={unblockUser}
                        />
                      </View>
                    </View>
                  ) : states?.chatHistory?.length === 0 ? (
                    <View style={styles.flexGrow}>
                      <View style={styles.card}>
                        {showImage ? (
                          <Image
                            source={{ uri: user?.profile }}
                            style={styles.cardImageCentered}
                          />
                        ) : (
                          <View style={styles.cardPlaceholderCentered}>
                            <Text style={styles.cardPlaceholderText}>
                              {firstLetter}
                            </Text>
                          </View>
                        )}
                        <Text style={styles.cardTitle}>Let's Message</Text>
                        <Text style={styles.cardDescriptionCentered}>
                          No messages yet.
                        </Text>
                      </View>
                    </View>
                  ) : (
                    states?.chatHistory?.map((chat, index) => (
                      <View
                        key={index}
                        style={[
                          styles.messageBubble,
                          chat.fromMe ? styles.myMessage : styles.theirMessage,
                        ]}>
                        {chat?.text && (
                          <Text style={styles.messageText}>{chat.text}</Text>
                        )}
                        {chat?.image && (
                          <TouchableOpacity
                            onPress={() => openImageModal(chat.image)}>
                            <Image
                              source={{ uri: chat.image }}
                              style={[
                                styles.chatImage,
                                { marginTop: chat.text ? 5 : 0 },
                              ]}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        )}
                        {chat?.video && (
                          <TouchableOpacity
                            onPress={() => openVideoModal(chat.video)}>
                            <Video
                              source={{ uri: chat.video }}
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
                        {/* Location message rendering */}
                        {chat?.location && (
                          <TouchableOpacity
                            style={[
                              styles.locationCard,
                              { marginTop: chat.text ? 8 : 0 },
                            ]}
                            onPress={() => {
                              const url = `https://www.google.com/maps/search/?api=1&query=${chat.location.latitude},${chat.location.longitude}`;
                              Linking.openURL(url);
                            }}>
                            <View style={styles.locationHeader}>
                              <View style={styles.locationIcon}>
                                <Text style={styles.locationIconText}>📍</Text>
                              </View>
                              <Text style={styles.locationTitle}>
                                Shared Location
                              </Text>
                            </View>

                            <MapView
                              style={styles.locationMapPreview}
                              initialRegion={{
                                latitude: chat.location.latitude,
                                longitude: chat.location.longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005,
                              }}
                              scrollEnabled={false}
                              zoomEnabled={false}
                              rotateEnabled={false}
                              pitchEnabled={false}>
                              <Marker
                                coordinate={{
                                  latitude: chat.location.latitude,
                                  longitude: chat.location.longitude,
                                }}
                                title="Shared Location"
                                pinColor="red"
                              />
                            </MapView>

                            <View style={styles.locationFooter}>
                              <Text style={styles.viewMapText}>
                                Tap to open in Maps
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))
                  )}
                </>
              )}
            </ScrollView>
          </ImageBackground>

          {relationStatus === 'accepted' && (
            <View style={styles.inputContainer}>
              <Input
                placeholder="Type your message..."
                value={states?.message}
                onChangeText={states?.setMessage}
                style={styles.textInput}
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <Image source={ICONS.Send} style={styles.sendIcon} />
              </TouchableOpacity>
            </View>
          )}

          {/* Image Modal */}
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

          {/* Video Modal */}
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

          {/* Menu Modal */}
          <Modal
            visible={menuVisible}
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
                <TouchableOpacity
                  onPress={() => {
                    setMenuVisible(false);
                    handleShareLocation();
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
              onPress={() => {
                selectTheme(states?.selecturl);
              }}
            />

            {/* Remove Theme Button */}
            {states?.selectedTheme && (
              <Button
                title="Remove Theme"
                outlineColor={colors.primary}
                onPress={() => {
                  removeTheme();
                }}
              />
            )}
          </CustomModal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Container>
  );
};
export default ChatDetailsScreen;
// import React, { useState } from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Modal,
//   ImageBackground,
//   Linking,
// } from 'react-native';
// import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
// import { HomeStackParamList } from '@types/navigations';
// import { ICONS, IMAGES } from '@assets/index';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useTheme } from '@react-navigation/native';
// import Video from 'react-native-video';
// import { Button, Container, CustomModal, Input, Text } from '@components/index';
// import useStyle from './style';
// import { useChatDetails } from './useChatDetails';

// type ChatDetailsRouteProp = RouteProp<HomeStackParamList, 'ChatDetailsScreen'>;

// const ChatDetailsScreen = () => {
//   const styles = useStyle();
//   const { colors } = useTheme();
//   const navigation = useNavigation();
//   const route = useRoute<ChatDetailsRouteProp>();
//   const { user } = route.params || {};
//   const [menuVisible, setMenuVisible] = useState<boolean>(false);

//   const {
//     states,
//     relationStatus,
//     sendRequest,
//     acceptRequest,
//     rejectRequest,
//     sendMessage,
//     handleScroll,
//     openImageModal,
//     closeImageModal,
//     openVideoModal,
//     closeVideoModal,
//     blockUser,
//     clearChat,
//     unblockUser,
//     setThemeModalVisible,
//     selectTheme,
//     removeTheme,
//     navigateToProfile,
//     handleShareLocation,
//   } = useChatDetails(user);

//   const showImage = user?.profile && user?.profile !== '';
//   const firstLetter = user?.firstName?.charAt(0)?.toUpperCase() || '?';

//   if (!user) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text>User data not found.</Text>
//       </SafeAreaView>
//     );
//   }

//   const renderFriendStatusCard = () => {
//     if (relationStatus === 'accepted') {
//       return null;
//     }
//     return (
//       <View style={styles.card}>
//         {showImage ? (
//           <Image
//             source={{ uri: user?.profile }}
//             style={styles.cardImageCentered}
//           />
//         ) : (
//           <View style={styles.cardPlaceholderCentered}>
//             <Text style={styles.cardPlaceholderText}>{firstLetter}</Text>
//           </View>
//         )}
//         <Text style={styles.cardTitle}>Let's Connect</Text>
//         <Text style={styles.cardDescriptionCentered}>
//           {relationStatus === 'none'
//             ? 'Send a friend request to start chatting.'
//             : relationStatus === 'sent'
//             ? 'Waiting for approval...'
//             : 'This user sent you a request. Accept to start chatting.'}
//         </Text>

//         <View style={styles.actionRowCentered}>
//           {relationStatus === 'notsent' && (
//             <Button
//               title="Send Friend Request"
//               onPress={sendRequest}
//               style={styles.button}
//             />
//           )}
//           {relationStatus === 'received' && (
//             <>
//               <Button title="Accept" onPress={acceptRequest} />
//               <Button
//                 title="Reject"
//                 onPress={rejectRequest}
//                 outlineColor={colors.error}
//               />
//             </>
//           )}
//         </View>
//       </View>
//     );
//   };

//   const openMenu = () => {
//     setMenuVisible(true);
//   };

//   return (
//     <Container title="Chat Details" showHeader={false}>
//       <SafeAreaView style={styles.container}>
//         <KeyboardAvoidingView
//           style={styles.container}
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
//           <View style={styles.header}>
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <Image source={ICONS.BackArrow} style={styles.backIcon} />
//             </TouchableOpacity>

//             {showImage ? (
//               <Image
//                 source={{ uri: user?.profile }}
//                 style={styles.headerImage}
//               />
//             ) : (
//               <View style={styles.headerPlaceholder}>
//                 <Text style={styles.headerPlaceholderText}>{firstLetter}</Text>
//               </View>
//             )}

//             <TouchableOpacity
//               style={styles.flex}
//               activeOpacity={0.7}
//               // Disable navigation if user is blocked by me
//               onPress={() => {
//                 if (!states?.isBlockedByThem) {
//                   navigateToProfile();
//                 }
//               }}>
//               <Text style={styles.headerName}>{user?.firstName}</Text>
//               <Text style={styles.headerEmail}>{user?.email}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={openMenu}>
//               <Image source={ICONS.menu} style={styles.menuIcon} />
//             </TouchableOpacity>
//           </View>

//           <ImageBackground
//             source={
//               states?.selectedTheme ? { uri: states?.selectedTheme } : null
//             }
//             style={styles.flex}
//             resizeMode="cover">
//             {/* Chat Content */}
//             <ScrollView
//               ref={states?.scrollViewRef}
//               contentContainerStyle={[
//                 styles.scrollContainer,
//                 states?.selectedTheme ? { backgroundColor: 'transparent' } : {},
//               ]}
//               style={{
//                 flex: 1,
//                 backgroundColor: states?.selectedTheme
//                   ? undefined
//                   : colors.background,
//               }}
//               keyboardShouldPersistTaps="handled"
//               showsVerticalScrollIndicator={false}
//               onScroll={handleScroll}
//               scrollEventThrottle={16}>
//               {relationStatus && (
//                 <View style={styles.renderFriendStatusCard}>
//                   {renderFriendStatusCard()}
//                 </View>
//               )}

//               {relationStatus === 'accepted' && (
//                 <>
//                   {states?.isBlockedByMe ? (
//                     <View style={styles.flexGrow}>
//                       <View style={styles.card}>
//                         {showImage ? (
//                           <Image
//                             source={{ uri: user?.profile }}
//                             style={styles.cardImageCentered}
//                           />
//                         ) : (
//                           <View style={styles.cardPlaceholderCentered}>
//                             <Text style={styles.cardPlaceholderText}>
//                               {firstLetter}
//                             </Text>
//                           </View>
//                         )}
//                         <Text style={styles.cardTitle}>Block</Text>
//                         <Text style={styles.cardDescriptionCentered}>
//                           You blocked this user.
//                         </Text>
//                         <Button
//                           style={styles.padding}
//                           title="Unblock User"
//                           onPress={unblockUser}
//                         />
//                       </View>
//                     </View>
//                   ) : states?.chatHistory?.length === 0 ? (
//                     <View style={styles.flexGrow}>
//                       <View style={styles.card}>
//                         {showImage ? (
//                           <Image
//                             source={{ uri: user?.profile }}
//                             style={styles.cardImageCentered}
//                           />
//                         ) : (
//                           <View style={styles.cardPlaceholderCentered}>
//                             <Text style={styles.cardPlaceholderText}>
//                               {firstLetter}
//                             </Text>
//                           </View>
//                         )}
//                         <Text style={styles.cardTitle}>Let's Message</Text>
//                         <Text style={styles.cardDescriptionCentered}>
//                           No messages yet.
//                         </Text>
//                       </View>
//                     </View>
//                   ) : (
//                     states?.chatHistory?.map((chat, index) => (
//                       <View
//                         key={index}
//                         style={[
//                           styles.messageBubble,
//                           chat.fromMe ? styles.myMessage : styles.theirMessage,
//                         ]}>
//                         {chat?.text && (
//                           <Text style={styles.messageText}>{chat.text}</Text>
//                         )}
//                         {chat?.image && (
//                           <TouchableOpacity
//                             onPress={() => openImageModal(chat.image)}>
//                             <Image
//                               source={{ uri: chat.image }}
//                               style={[
//                                 styles.chatImage,
//                                 { marginTop: chat.text ? 5 : 0 },
//                               ]}
//                               resizeMode="cover"
//                             />
//                           </TouchableOpacity>
//                         )}
//                         {chat?.video && (
//                           <TouchableOpacity
//                             onPress={() => openVideoModal(chat.video)}>
//                             <Video
//                               source={{ uri: chat.video }}
//                               style={styles.chatVideo}
//                               resizeMode="cover"
//                               paused
//                               pointerEvents="none"
//                             />
//                             <View style={styles.playIconOverlay}>
//                               <Image
//                                 source={ICONS.VideoPlay}
//                                 style={styles.playBtn}
//                               />
//                             </View>
//                           </TouchableOpacity>
//                         )}
//                         {/* Location message rendering */}
//                         {chat?.type === 'location' && chat?.location && (
//                           <TouchableOpacity
//                             style={[
//                               styles.locationCard,
//                               { marginTop: chat.text ? 8 : 0 },
//                             ]}
//                             onPress={() => {
//                               const url = `https://www.google.com/maps/search/?api=1&query=${chat.location.latitude},${chat.location.longitude}`;
//                               Linking.openURL(url);
//                             }}>
//                             <View style={styles.locationHeader}>
//                               <View style={styles.locationIcon}>
//                                 <Text style={styles.locationIconText}>📍</Text>
//                               </View>
//                               <Text style={styles.locationTitle}>Location</Text>
//                             </View>

//                             <Image
//                               source={{
//                                 uri: `https://maps.googleapis.com/maps/api/staticmap?center=${chat.location.latitude},${chat.location.longitude}&zoom=15&size=200x120&maptype=roadmap&markers=color:red%7C${chat.location.latitude},${chat.location.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`,
//                               }}
//                               style={styles.locationMapPreview}
//                               defaultSource={IMAGES.Home} // Add a placeholder image
//                             />

//                             <View style={styles.locationFooter}>
//                               <Text style={styles.locationCoords}>
//                                 {chat.location.latitude.toFixed(4)},{' '}
//                                 {chat.location.longitude.toFixed(4)}
//                               </Text>
//                               <Text style={styles.viewMapText}>
//                                 Tap to view on map
//                               </Text>
//                             </View>
//                           </TouchableOpacity>
//                         )}
//                       </View>
//                     ))
//                   )}
//                 </>
//               )}
//             </ScrollView>
//           </ImageBackground>

//           {relationStatus === 'accepted' && (
//             <View style={styles.inputContainer}>
//               <Input
//                 placeholder="Type your message..."
//                 value={states?.message}
//                 onChangeText={states?.setMessage}
//                 style={styles.textInput}
//               />
//               <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
//                 <Image source={ICONS.Send} style={styles.sendIcon} />
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* Image Modal */}
//           <CustomModal
//             visible={states?.imageModalVisible}
//             title="Image"
//             onClose={closeImageModal}>
//             {states?.selectedImage && (
//               <Image
//                 source={{ uri: states?.selectedImage }}
//                 style={styles.modalImage}
//                 resizeMode="contain"
//               />
//             )}
//           </CustomModal>

//           {/* Video Modal */}
//           <CustomModal
//             visible={states?.videoModalVisible}
//             title="Video"
//             onClose={closeVideoModal}>
//             {states?.selectedVideo && (
//               <Video
//                 source={{ uri: states?.selectedVideo }}
//                 style={styles.modalVideo}
//                 controls
//                 resizeMode="contain"
//                 paused={false}
//               />
//             )}
//           </CustomModal>

//           {/* Menu Modal */}
//           <Modal
//             visible={menuVisible}
//             transparent
//             animationType="fade"
//             onRequestClose={() => setMenuVisible(false)}>
//             <TouchableOpacity
//               style={styles.flex}
//               activeOpacity={1}
//               onPress={() => setMenuVisible(false)}>
//               <View style={styles.menuContainer}>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setMenuVisible(false);
//                     states?.isBlockedByMe ? unblockUser() : blockUser();
//                   }}
//                   style={styles.padding}>
//                   <Text type="semibold" style={styles.menuText}>
//                     {states?.isBlockedByMe ? 'Unblock User' : 'Block User'}
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setMenuVisible(false);
//                     clearChat();
//                   }}
//                   style={styles.padding}>
//                   <Text type="semibold" style={styles.menuText}>
//                     Clear Chat
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setMenuVisible(false);
//                     setThemeModalVisible(true);
//                   }}
//                   style={styles.padding}>
//                   <Text type="semibold" style={styles.menuText}>
//                     Theme
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setMenuVisible(false);
//                     handleShareLocation();
//                   }}
//                   style={styles.padding}>
//                   <Text type="semibold" style={styles.menuText}>
//                     Share Location
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </TouchableOpacity>
//           </Modal>

//           {/* Theme Modal */}
//           <CustomModal
//             visible={states?.themeModalVisible}
//             title="Select Chat Theme"
//             onClose={() => setThemeModalVisible(false)}>
//             <View style={styles.themeGrid}>
//               {['Chattheme1', 'Chattheme2', 'Chattheme3', 'Chattheme4'].map(
//                 key => {
//                   const themeUri = IMAGES[key];
//                   const isSelected =
//                     states?.selectedTheme === themeUri ||
//                     states?.selecturl === themeUri;

//                   return (
//                     <TouchableOpacity
//                       key={key}
//                       onPress={() => states?.setselecturl(themeUri)}
//                       style={[
//                         styles.themeOption,
//                         isSelected && {
//                           borderWidth: 5,
//                           borderColor: colors.primary,
//                         },
//                       ]}>
//                       <Image
//                         source={themeUri}
//                         style={styles.themeImage}
//                         resizeMode="cover"
//                       />
//                     </TouchableOpacity>
//                   );
//                 },
//               )}
//             </View>

//             <Button
//               title="Apply"
//               loading={states?.loding}
//               onPress={() => {
//                 selectTheme(states?.selecturl);
//               }}
//             />

//             {/* Remove Theme Button */}
//             {states?.selectedTheme && (
//               <Button
//                 title="Remove Theme"
//                 outlineColor={colors.primary}
//                 onPress={() => {
//                   removeTheme();
//                 }}
//               />
//             )}
//           </CustomModal>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </Container>
//   );
// };

// export default ChatDetailsScreen;
