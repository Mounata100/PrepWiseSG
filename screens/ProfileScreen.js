// import React, { useMemo, useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, Alert, ActivityIndicator, FlatList } from 'react-native';
// import { Avatar } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import * as ImagePicker from 'expo-image-picker';
// import * as ImageManipulator from 'expo-image-manipulator';
// import * as Haptics from 'expo-haptics';
// import { useUser } from '../contexts/UserContext';
// import { useNavigation } from '@react-navigation/native';
// import { LEVELS, getCurrentLevel, getLevelProgress } from '../utility/levels';
// import { StorageManager } from '../utility/storagemanager'; // Handled file-system copies

// const FALLBACK_EMOJIS = ['🧑‍🚀', '🛡️', '⚡', '🤖', '🦊', '🐱', '🐼', '🧠', '🌟', '🔥'];

// const BADGE_CONFIG = {
//   go_bag_master: { label: 'Go-Bag Master', icon: '🎒', desc: 'Packed perfect kit in under 15s', border: '#0F766E' },
//   quiz_master: { label: 'Quiz Master', icon: '⚡', desc: 'Maintained optimal protocol streak', border: '#F59E0B' },
//   climate_hero: { label: 'Climate Hero', icon: '🛡️', desc: 'Stabilized volatile microclimates', border: '#10B981' },
//   survival_streak_master: { label: 'Streak Master', icon: '🔥', desc: 'Maintained 4+ daily operations', border: '#EF4444' },
//   first_login: { label: 'First Contact', icon: '👋', desc: 'Initialized baseline telemetry', border: '#3B82F6' },
// };

// export default function ProfileScreen() {
//   const navigation = useNavigation();
//   const { user, points, level, badges, logout } = useUser();

//   // const currentPoints = points || user?.points || 0;
//   // const currentLevel = level || user?.level || 1;
//   //const currentPoints = points ?? user?.xp ?? user?.points ?? 0;
//   const currentXP = Number(user?.xp ?? points ?? user?.points ?? 0);

//   const currentName = user?.name ?? 'OPERATOR_ACTIVE';

//   const currentStreak = user?.streak ?? 1;

//   const userMetrics = useMemo(() => {
//     const xp = Number.isFinite(currentXP) ? currentXP : 0;

//     const levelData = getCurrentLevel(xp);
//     const progress = getLevelProgress(xp);

//     const nextLevel = LEVELS.find(
//       item => item.level === levelData.level + 1
//     );

//     return {
//       currentXP: xp,
//       level: levelData.level,
//       title: levelData.title,
//       minXP: levelData.minXP,
//       maxXP: levelData.maxXP,
//       progressPct: `${progress * 100}%`,
//       nextLevel,
//     };
//   }, [currentXP]);

//   // const currentLevelData =
//   //   getCurrentLevel(currentXP);

//   // const currentLevel =
//   //   currentLevelData.level;

//   // const currentTitle =
//   //   currentLevelData.title;

//   // const levelProgress =
//   //   getLevelProgress(currentXP);

//   // const xpIntoLevel = currentXP - currentLevelData.minXP;

//   // const xpRange = currentLevelData.maxXP === Infinity
//   //     ? null
//   //     : currentLevelData.maxXP - currentLevelData.minXP;

//   // const nextLevel = LEVELS.find(item => item.level === currentLevel + 1);

//   // const currentLevelData = getCurrentLevel(currentPoints);

//   // const currentLevel = currentLevelData?.level ?? 1;
//   // const currentTitle = currentLevelData?.title ?? 'Recruit';
//   // const levelProgress = getLevelProgress(currentPoints);

//   // const currentName = user?.name || 'OPERATOR_ACTIVE';
//   // const currentStreak = user?.streak || 1;

//   // Image & Selection Modals State
//   const [profileImage, setProfileImage] = useState(null);
//   const [selectedEmoji, setSelectedEmoji] = useState(null);
//   const [loadingPhoto, setLoadingPhoto] = useState(true);
  
//   const [optionsVisible, setOptionsVisible] = useState(false);
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const [emojiModalVisible, setEmojiModalVisible] = useState(false);
  
//   const [facing, setFacing] = useState('front');
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);

//   useEffect(() => {
//     loadPersistedProfilePhoto();
//   }, []);

//   const loadPersistedProfilePhoto = async () => {
//     try {
//       const savedProfile = await StorageManager.getUserProfile();
//       if (savedProfile) {
//         if (savedProfile.profileEmoji) {
//           setSelectedEmoji(savedProfile.profileEmoji);
//           setProfileImage(null);
//         } else if (savedProfile.profileImageUri) {
//           setProfileImage(savedProfile.profileImageUri);
//           setSelectedEmoji(null);
//         }
//       }
//     } catch (e) {
//       console.warn('Profile read fail:', e);
//     } finally {
//       setLoadingPhoto(false);
//     }
//   };

//   const processAndSaveImage = async (inputUri) => {
//     setLoadingPhoto(true);
//     try {
//       const manipulated = await ImageManipulator.manipulateAsync(
//         inputUri,
//         [{ resize: { width: 350, height: 350 } }],
//         { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
//       );

//       const permanentPath = await StorageManager.persistProfilePhoto(manipulated.uri);
//       setProfileImage(permanentPath);
//       setSelectedEmoji(null);

//       const currentProfile = await StorageManager.getUserProfile();
//       await StorageManager.saveUserProfile({
//         ...currentProfile,
//         profileImageUri: permanentPath,
//         profileEmoji: null
//       });
//     } catch (err) {
//       Alert.alert("Error", "Failed to cache selected image.");
//     } finally {
//       setLoadingPhoto(false);
//     }
//   };

//   const handleLaunchCamera = async () => {
//     setOptionsVisible(false);
//     if (!permission) return;

//     if (!permission.granted) {
//       const updatedPermission = await requestPermission();
//       if (!updatedPermission.granted) {
//         Alert.alert('PDPA Notice', 'Camera access was declined. You can securely assign an operational badge emoji instead.');
//         return;
//       }
//     }
//     setCameraVisible(true);
//   };

//   const handleLaunchGallery = async () => {
//     setOptionsVisible(false);
//     const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
//     if (!libraryPermission.granted) {
//       Alert.alert('PDPA Notice', 'Gallery access was declined. Your privacy is fully respected. You may use our custom emojis instead.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ['images'], //ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });

//     if (!result.canceled && result.assets?.[0]?.uri) {
//       processAndSaveImage(result.assets[0].uri);
//     }
//   };

//   const handleSelectEmoji = async (emoji) => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//     setSelectedEmoji(emoji);
//     setProfileImage(null);
//     setEmojiModalVisible(false);

//     const currentProfile = await StorageManager.getUserProfile();
//     await StorageManager.saveUserProfile({
//       ...currentProfile,
//       profileImageUri: null,
//       profileEmoji: emoji
//     });
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       try {
//         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//         const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, skipProcessing: false });
//         setCameraVisible(false);
//         processAndSaveImage(photo.uri);
//       } catch (err) {
//         Alert.alert("Error", "Camera processing failure.");
//       }
//     }
//   };

//   // const userMetrics = useMemo(() => {
//   //   const nextLevelTarget = currentLevel * 500;
//   //   const progressPercentage = Math.min((currentPoints / nextLevelTarget) * 100, 100);
//   //   return {
//   //     progressPct: `${progressPercentage}%`,
//   //     gamesPlayed: Math.floor(currentPoints / 75), 
//   //     goBagScore: Math.floor(currentPoints * 0.4),
//   //     climateScore: Math.floor(currentPoints * 0.8),
//   //     quizScore: Math.min(currentPoints, 195)
//   //   };
//   // }, [currentPoints, currentLevel]);

//   //const XP_PER_LEVEL = 1000;

//   // const userMetrics = useMemo(() => {
//   //   const xpIntoCurrentLevel = currentPoints % XP_PER_LEVEL;
//   //   const xpNeeded = XP_PER_LEVEL;

//   //   const progressPercentage =
//   //     (xpIntoCurrentLevel / xpNeeded) * 100;

//   //   return {
//   //     progressPct: `${progressPercentage}%`,
//   //     currentXP: xpIntoCurrentLevel,
//   //     nextLevelXP: xpNeeded,

//   //     gamesPlayed: Math.floor(currentPoints / 75),
//   //     goBagScore: Math.floor(currentPoints * 0.4),
//   //     climateScore: Math.floor(currentPoints * 0.8),
//   //     quizScore: Math.min(currentPoints, 195),
//   //   };
//   // }, [currentPoints]);

//   // const userMetrics = useMemo(() => {
//   //   const currentXP = Number(
//   //     user?.xp ?? points ?? user?.points ?? 0
//   //   );

//   //   const levelData = getCurrentLevel(currentXP);
//   //   const progress = getLevelProgress(currentXP);

//   //   const nextLevel = LEVELS.find(
//   //     item => item.level === levelData.level + 1
//   //   );

//   //   return {
//   //     currentXP,
//   //     level: levelData.level,
//   //     title: levelData.title,
//   //     minXP: levelData.minXP,
//   //     maxXP: levelData.maxXP,
//   //     progressPct: `${progress * 100}%`,
//   //     nextLevel,
//   //   };
//   // }, [user?.xp, user?.points, points]);



//   return (
//     <View style={{ flex: 1, backgroundColor: '#030712' }}>
//       <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
//         {/* HEADER SECTION */}
//         <View style={styles.headerArea}>
//           <View style={styles.avatarWrapper}>
//             {loadingPhoto ? (
//               <View style={[styles.avatarFrame, styles.loadingAvatar]}>
//                 <ActivityIndicator size="small" color="#38BDF8" />
//               </View>
//             ) : selectedEmoji ? (
//               <View style={[styles.avatarFrame, styles.emojiAvatarContainer]}>
//                 <Text style={styles.largeEmojiDisplay}>{selectedEmoji}</Text>
//               </View>
//             ) : profileImage ? (
//               <Image source={{ uri: profileImage }} style={[styles.avatarFrame, styles.imageProfileAvatar]} />
//             ) : (
//               <Avatar.Text 
//                 size={84} 
//                 label={(currentName?.[0] || 'O').toUpperCase()} 
//                 style={styles.avatarFrame} 
//                 labelStyle={styles.avatarText}
//               />
//             )}
            
//             <TouchableOpacity style={styles.cameraTriggerBadge} onPress={() => setOptionsVisible(true)} activeOpacity={0.8}>
//               <Ionicons name="create" size={16} color="#FFFFFF" />
//             </TouchableOpacity>
//           </View>
          
//           <Text style={styles.profileName}>{currentName}</Text>
//           <View style={styles.tierPill}>
//             <Text style={styles.tierPillText}>LEVEL {userMetrics.level} • {userMetrics.title.toUpperCase()}</Text>
//           </View>
//         </View>

//         {/* PROGRESS AND TELEMETRY GRID */}
//         <View style={styles.xpCardWrapper}>
//           <View style={styles.xpTextRow}>
//             <Text style={styles.xpLabelString}>
//               LEVEL {userMetrics.level} XP
//             </Text>

//             <Text style={styles.xpValueString}>
//               {userMetrics.currentXP}
//               {userMetrics.maxXP !== Infinity && (
//                 <Text style={{ color: '#4B5563' }}>
//                   {' / '}
//                   {userMetrics.maxXP}
//                 </Text>
//               )}
//             </Text>
//           </View>

//           <View style={styles.trackBarBg}>
//             <View
//               style={[
//                 styles.trackBarFill,
//                 { width: userMetrics.progressPct }
//               ]}
//             />
//           </View>

//           <Text
//             style={{
//               color: '#64748B',
//               fontSize: 11,
//               marginTop: 8,
//             }}
//           >
//             {userMetrics.nextLevel
//               ? `${userMetrics.nextLevel.minXP - userMetrics.currentXP} XP until Level ${userMetrics.nextLevel.level}`
//               : 'Maximum level reached'}
//           </Text>
//         </View>

//         <View style={styles.streakBannerBox}>
//           <View style={styles.streakLeftRow}>
//             <View style={styles.fireIconCircle}><Ionicons name="flame" size={24} color="#FF7A00" /></View>
//             <View style={{ marginLeft: 14 }}>
//               <Text style={styles.streakTitleHeading}>{currentStreak} Days Running</Text>
//               <Text style={styles.streakSubheadingText}>Daily contingency habits functional.</Text>
//             </View>
//           </View>
//         </View>

//         <Text style={styles.sectionHeaderString}>Account Architecture</Text>
//         <TouchableOpacity style={styles.settingsNavigationRow} activeOpacity={0.8} onPress={() => navigation.navigate('Settings')}>
//           <View style={styles.settingsLeftLayout}>
//             <View style={styles.settingsIconBox}><Ionicons name="cog" size={20} color="#94A3B8" /></View>
//             <View>
//               <Text style={styles.settingsTitleMain}>Change Settings</Text>
//               <Text style={styles.settingsTitleSub}>Update passwords and physical identity tags</Text>
//             </View>
//           </View>
//           <Ionicons name="chevron-forward" size={16} color="#475569" />
//         </TouchableOpacity>

//         {/* ACHIEVEMENTS */}
//         <Text style={styles.sectionHeaderString}>Secured Achievements</Text>
//         <View style={styles.badgeSectionWrapper}>
//           {badges && badges.length > 0 ? (
//             <View style={styles.badgesDisplayFlexGrid}>
//               {badges.map((badgeKey, idx) => {
//                 const meta = BADGE_CONFIG[badgeKey] || { label: badgeKey.replace('_', ' '), icon: '🏅', desc: 'Active operational credential', border: '#334155' };
//                 return (
//                   <View key={idx} style={[styles.premiumBadgeItemCard, { borderColor: meta.border + '40' }]}>
//                     <View style={[styles.badgeEmblemBox, { backgroundColor: meta.border + '15' }]}><Text style={styles.badgeEmoji}>{meta.icon}</Text></View>
//                     <View style={styles.badgeTextMeta}>
//                       <Text style={styles.badgeLabelTitle}>{meta.label}</Text>
//                       <Text style={styles.badgeDescriptionText}>{meta.desc}</Text>
//                     </View>
//                   </View>
//                 );
//               })}
//             </View>
//           ) : (
//             <View style={styles.emptyBadgesBox}>
//               <Ionicons name="ribbon-outline" size={32} color="#334155" />
//               <Text style={styles.emptyBadgesText}>No active insignias found. Complete main modules to earn honors.</Text>
//             </View>
//           )}
//         </View>

//         <TouchableOpacity style={styles.logoutButtonWrapper} activeOpacity={0.8} onPress={logout}>
//           <Ionicons name="power-sharp" size={16} color="#EF4444" />
//           <Text style={styles.logoutButtonText}>Log Out</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* CHOOSE METHOD MODAL (PDPA COMPLIANT) */}
//       <Modal visible={optionsVisible} transparent animationType="fade">
//         <View style={styles.modalBlurOverlay}>
//           <View style={styles.optionsContainer}>
//             <Text style={styles.optionsHeader}>Identity Matrix Update</Text>
//             <Text style={styles.pdpaDisclaimer}>
//               Your privacy is guarded. Images processed here are localized to sandboxed memory space under strict PDPA design guidelines. No telemetry datasets are transmitted externally.
//             </Text>

//             <TouchableOpacity style={styles.optionItem} onPress={handleLaunchCamera}>
//               <Ionicons name="camera" size={22} color="#38BDF8" style={{ width: 30 }} />
//               <Text style={styles.optionText}>Initialize Hardware Camera</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.optionItem} onPress={handleLaunchGallery}>
//               <Ionicons name="image" size={22} color="#34D399" style={{ width: 30 }} />
//               <Text style={styles.optionText}>Access Media Storage Logs</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.optionItem} onPress={() => { setOptionsVisible(false); setEmojiModalVisible(true); }}>
//               <Ionicons name="happy" size={22} color="#F59E0B" style={{ width: 30 }} />
//               <Text style={styles.optionText}>Deploy Anonymous Emoji Tag</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.cancelOption} onPress={() => setOptionsVisible(false)}>
//               <Text style={styles.cancelOptionText}>Aborted Patch</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* ANONYMOUS EMOJI SELECTOR MODAL */}
//       <Modal visible={emojiModalVisible} transparent animationType="slide">
//         <View style={styles.modalBlurOverlay}>
//           <View style={styles.optionsContainer}>
//             <Text style={styles.optionsHeader}>Select Identity Emoji</Text>
//             <Text style={styles.pdpaDisclaimer}>Zero system permissions required. Keep your spatial identities fully unlinked.</Text>
            
//             <FlatList
//               data={FALLBACK_EMOJIS}
//               numColumns={5}
//               keyExtractor={(item) => item}
//               columnWrapperStyle={{ justifyContent: 'space-around', marginVertical: 8 }}
//               renderItem={({ item }) => (
//                 <TouchableOpacity onPress={() => handleSelectEmoji(item)} style={styles.emojiGridSelect}>
//                   <Text style={{ fontSize: 32 }}>{item}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//             <TouchableOpacity style={[styles.cancelOption, { marginTop: 16 }]} onPress={() => setEmojiModalVisible(false)}>
//               <Text style={styles.cancelOptionText}>Back</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* ABSOLUTE POSITIONED CAMERA MODAL */}
//       <Modal visible={cameraVisible} animationType="slide" transparent={false}>
//         <View style={styles.cameraContainer}>
//           <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
          
//           {/* Controls rendered completely separate from CameraView hierarchy */}
//           <View style={styles.absoluteCameraControls}>
//             <TouchableOpacity style={styles.backButton} onPress={() => setCameraVisible(false)} activeOpacity={0.7}>
//               <Ionicons name="close" size={28} color="white" />
//             </TouchableOpacity>

//             <View style={styles.bottomActions}>
//               <TouchableOpacity style={styles.circularButton} onPress={() => setFacing(c => c === 'back' ? 'front' : 'back')} activeOpacity={0.7}>
//                 <Ionicons name="camera-reverse" size={26} color="white" />
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.captureButton} onPress={takePicture} activeOpacity={0.7}>
//                 <View style={styles.innerCaptureButton} />
//               </TouchableOpacity>
              
//               <View style={{ width: 60 }} />
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#030712' },
//   headerArea: { paddingTop: 60, alignItems: 'center', paddingBottom: 24, backgroundColor: '#090F1E', borderBottomWidth: 1, borderColor: '#1E293B' },
//   avatarWrapper: { position: 'relative', width: 88, height: 88 },
//   avatarFrame: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#1E293B', borderWidth: 2, borderColor: '#38BDF8', justifyContent: 'center', alignItems: 'center' },
//   imageProfileAvatar: { width: 84, height: 84, borderRadius: 42 },
//   emojiAvatarContainer: { backgroundColor: '#1E1B4B', borderColor: '#818CF8' },
//   largeEmojiDisplay: { fontSize: 40 },
//   loadingAvatar: { justifyContent: 'center', alignItems: 'center' },
//   avatarText: { color: '#38BDF8', fontWeight: '900', fontSize: 28 },
//   cameraTriggerBadge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#3B82F6', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#090F1E' },
//   profileName: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', marginTop: 14, letterSpacing: -0.3 },
//   tierPill: { backgroundColor: '#1E1B4B', borderWidth: 1, borderColor: '#4338CA', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginTop: 8 },
//   tierPillText: { color: '#818CF8', fontWeight: '800', fontSize: 10, letterSpacing: 0.5 },
//   xpCardWrapper: { margin: 16, backgroundColor: '#090F1E', borderWidth: 1, borderColor: '#1E293B', padding: 18, borderRadius: 20 },
//   xpTextRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   xpLabelString: { color: '#4B5563', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
//   xpValueString: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
//   trackBarBg: { height: 6, backgroundColor: '#111827', borderRadius: 10, overflow: 'hidden' },
//   trackBarFill: { height: '100%', backgroundColor: '#38BDF8', borderRadius: 10 },
//   sectionHeaderString: { color: '#4B5563', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginHorizontal: 16, marginBottom: 12, marginTop: 12 },
//   statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between', gap: 10, marginBottom: 16 },
//   statModuleCard: { width: '48%', backgroundColor: '#090F1E', borderWidth: 1, borderColor: '#1E293B', borderRadius: 16, padding: 16 },
//   statValueText: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', marginTop: 10, letterSpacing: -0.5 },
//   statLabelText: { color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 2 },
//   streakBannerBox: { marginHorizontal: 16, backgroundColor: '#1C130C', borderWidth: 1, borderColor: '#78350F', borderRadius: 16, padding: 14, marginBottom: 14 },
//   streakLeftRow: { flexDirection: 'row', alignItems: 'center' },
//   fireIconCircle: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#451A03', justifyContent: 'center', alignItems: 'center' },
//   streakTitleHeading: { color: '#F59E0B', fontSize: 15, fontWeight: '800' },
//   streakSubheadingText: { color: '#B45309', fontSize: 12, marginTop: 1, fontWeight: '500' },
//   settingsNavigationRow: { marginHorizontal: 16, backgroundColor: '#090F1E', borderWidth: 1, borderColor: '#1E293B', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
//   settingsLeftLayout: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   settingsIconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
//   settingsTitleMain: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
//   settingsTitleSub: { color: '#64748B', fontSize: 11, marginTop: 1 },
//   badgeSectionWrapper: { paddingHorizontal: 16, marginBottom: 24 },
//   badgesDisplayFlexGrid: { gap: 10 },
//   premiumBadgeItemCard: { backgroundColor: '#090F1E', borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center' },
//   badgeEmblemBox: { width: 46, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
//   badgeEmoji: { fontSize: 22 },
//   badgeTextMeta: { marginLeft: 14, flex: 1 },
//   badgeLabelTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
//   badgeDescriptionText: { color: '#64748B', fontSize: 11, marginTop: 1 },
//   emptyBadgesBox: { backgroundColor: '#090F1E', borderStyle: 'dashed', borderWidth: 1, borderColor: '#1E293B', borderRadius: 16, padding: 24, alignItems: 'center' },
//   emptyBadgesText: { color: '#4B5563', fontSize: 12, textAlign: 'center', marginTop: 8, lineHeight: 18, maxWidth: '85%' },
//   logoutButtonWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, marginHorizontal: 16, backgroundColor: '#1A0B0B', borderColor: '#DC2626', borderWidth: 1, borderRadius: 12, gap: 8, marginTop: 10, marginBottom: 20 },
//   logoutButtonText: { color: '#F87171', fontWeight: '800', fontSize: 13 },

//   // SECURE PRIVACY SYSTEM MODALS
//   modalBlurOverlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
//   optionsContainer: { width: '100%', backgroundColor: '#090F1E', borderRadius: 24, borderWidth: 1, borderColor: '#1E293B', padding: 24 },
//   optionsHeader: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
//   pdpaDisclaimer: { fontSize: 11, color: '#64748B', textAlign: 'center', lineHeight: 16, marginBottom: 20 },
//   optionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', padding: 16, borderRadius: 14, marginVertical: 6, borderWidth: 1, borderColor: '#1E293B' },
//   optionText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
//   cancelOption: { padding: 14, alignItems: 'center', marginTop: 8 },
//   cancelOptionText: { color: '#64748B', fontWeight: '800', fontSize: 13 },
//   emojiGridSelect: { padding: 12, backgroundColor: '#0F172A', borderRadius: 12, borderWidth: 1, borderColor: '#1E293B' },

//   // NATIVE VIEW DESIGN STACKS
//   cameraContainer: { flex: 1, backgroundColor: 'black', position: 'relative' },
//   camera: { flex: 1 },
//   absoluteCameraControls: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', padding: 24, paddingTop: 50 },
//   backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start' },
//   bottomActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 10 },
//   circularButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
//   captureButton: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: 'white', justifyContent: 'center', alignItems: 'center' },
//   innerCaptureButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'white' }
// });

import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Haptics from 'expo-haptics';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  LEVELS,
  getCurrentLevel,
  getLevelProgress
} from '../utility/levels';
import { StorageManager } from '../utility/storagemanager';

const FALLBACK_EMOJIS = [
  '🧑‍🚀',
  '🛡️',
  '⚡',
  '🤖',
  '🦊',
  '🐱',
  '🐼',
  '🧠',
  '🌟',
  '🔥'
];

const BADGE_CONFIG = {
  go_bag_master: {
    labelKey: 'profile.badges.goBagMaster.label',
    descKey: 'profile.badges.goBagMaster.description',
    icon: '🎒',
    border: '#0F766E'
  },
  quiz_master: {
    labelKey: 'profile.badges.quizMaster.label',
    descKey: 'profile.badges.quizMaster.description',
    icon: '⚡',
    border: '#F59E0B'
  },
  climate_hero: {
    labelKey: 'profile.badges.climateHero.label',
    descKey: 'profile.badges.climateHero.description',
    icon: '🛡️',
    border: '#10B981'
  },
  survival_streak_master: {
    labelKey: 'profile.badges.survivalStreakMaster.label',
    descKey: 'profile.badges.survivalStreakMaster.description',
    icon: '🔥',
    border: '#EF4444'
  },
  first_login: {
    labelKey: 'profile.badges.firstLogin.label',
    descKey: 'profile.badges.firstLogin.description',
    icon: '👋',
    border: '#3B82F6'
  }
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const {
    user,
    points,
    level,
    badges,
    logout
  } = useUser();

  const currentXP = Number(
    user?.xp ?? points ?? user?.points ?? 0
  );

  const currentName =
    user?.name ?? t('profile.defaultName');

  const currentStreak =
    user?.streak ?? 1;

  const userMetrics = useMemo(() => {
    const xp = Number.isFinite(currentXP)
      ? currentXP
      : 0;

    const levelData = getCurrentLevel(xp);
    const progress = getLevelProgress(xp);

    const nextLevel = LEVELS.find(
      item => item.level === levelData.level + 1
    );

    return {
      currentXP: xp,
      level: levelData.level,
      title: levelData.title,
      minXP: levelData.minXP,
      maxXP: levelData.maxXP,
      progressPct: `${progress * 100}%`,
      nextLevel
    };
  }, [currentXP]);

  // --------------------------------------------------
  // IMAGE / PROFILE STATE
  // --------------------------------------------------

  const [profileImage, setProfileImage] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [loadingPhoto, setLoadingPhoto] = useState(true);

  const [optionsVisible, setOptionsVisible] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [emojiModalVisible, setEmojiModalVisible] = useState(false);

  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] =
    useCameraPermissions();

  const cameraRef = useRef(null);

  // --------------------------------------------------
  // LOAD PROFILE PHOTO
  // --------------------------------------------------

  useEffect(() => {
    loadPersistedProfilePhoto();
  }, []);

  const loadPersistedProfilePhoto = async () => {
    try {
      const savedProfile =
        await StorageManager.getUserProfile();

      if (savedProfile) {
        if (savedProfile.profileEmoji) {
          setSelectedEmoji(savedProfile.profileEmoji);
          setProfileImage(null);
        } else if (savedProfile.profileImageUri) {
          setProfileImage(savedProfile.profileImageUri);
          setSelectedEmoji(null);
        }
      }
    } catch (e) {
      console.warn('Profile read fail:', e);
    } finally {
      setLoadingPhoto(false);
    }
  };

  // --------------------------------------------------
  // IMAGE PROCESSING
  // --------------------------------------------------

  const processAndSaveImage = async inputUri => {
    setLoadingPhoto(true);

    try {
      const manipulated =
        await ImageManipulator.manipulateAsync(
          inputUri,
          [
            {
              resize: {
                width: 350,
                height: 350
              }
            }
          ],
          {
            compress: 0.6,
            format: ImageManipulator.SaveFormat.JPEG
          }
        );

      const permanentPath =
        await StorageManager.persistProfilePhoto(
          manipulated.uri
        );

      setProfileImage(permanentPath);
      setSelectedEmoji(null);

      const currentProfile =
        await StorageManager.getUserProfile();

      await StorageManager.saveUserProfile({
        ...currentProfile,
        profileImageUri: permanentPath,
        profileEmoji: null
      });
    } catch (err) {
      Alert.alert(
        t('profile.photo.error'),
        t('profile.photo.failedToCache')
      );
    } finally {
      setLoadingPhoto(false);
    }
  };

  // --------------------------------------------------
  // CAMERA
  // --------------------------------------------------

  const handleLaunchCamera = async () => {
    setOptionsVisible(false);

    if (!permission) return;

    if (!permission.granted) {
      const updatedPermission =
        await requestPermission();

      if (!updatedPermission.granted) {
        Alert.alert(
          t('profile.photo.pdpaNotice'),
          t('profile.photo.cameraDenied')
        );

        return;
      }
    }

    setCameraVisible(true);
  };

  // --------------------------------------------------
  // GALLERY
  // --------------------------------------------------

  const handleLaunchGallery = async () => {
    setOptionsVisible(false);

    const libraryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!libraryPermission.granted) {
      Alert.alert(
        t('profile.photo.pdpaNotice'),
        t('profile.photo.galleryDenied')
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8
      });

    if (
      !result.canceled &&
      result.assets?.[0]?.uri
    ) {
      processAndSaveImage(
        result.assets[0].uri
      );
    }
  };

  // --------------------------------------------------
  // EMOJI
  // --------------------------------------------------

  const handleSelectEmoji = async emoji => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Medium
    );

    setSelectedEmoji(emoji);
    setProfileImage(null);
    setEmojiModalVisible(false);

    const currentProfile =
      await StorageManager.getUserProfile();

    await StorageManager.saveUserProfile({
      ...currentProfile,
      profileImageUri: null,
      profileEmoji: emoji
    });
  };

  // --------------------------------------------------
  // TAKE PHOTO
  // --------------------------------------------------

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );

        const photo =
          await cameraRef.current.takePictureAsync({
            quality: 0.8,
            skipProcessing: false
          });

        setCameraVisible(false);

        processAndSaveImage(photo.uri);
      } catch (err) {
        Alert.alert(
          t('profile.photo.error'),
          t('profile.photo.cameraFailure')
        );
      }
    }
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#030712'
      }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 40
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <View style={styles.headerArea}>
          <View style={styles.avatarWrapper}>

            {loadingPhoto ? (
              <View
                style={[
                  styles.avatarFrame,
                  styles.loadingAvatar
                ]}
              >
                <ActivityIndicator
                  size="small"
                  color="#38BDF8"
                />
              </View>
            ) : selectedEmoji ? (
              <View
                style={[
                  styles.avatarFrame,
                  styles.emojiAvatarContainer
                ]}
              >
                <Text
                  style={styles.largeEmojiDisplay}
                >
                  {selectedEmoji}
                </Text>
              </View>
            ) : profileImage ? (
              <Image
                source={{
                  uri: profileImage
                }}
                style={[
                  styles.avatarFrame,
                  styles.imageProfileAvatar
                ]}
              />
            ) : (
              <Avatar.Text
                size={84}
                label={(
                  currentName?.[0] || 'O'
                ).toUpperCase()}
                style={styles.avatarFrame}
                labelStyle={styles.avatarText}
              />
            )}

            <TouchableOpacity
              style={styles.cameraTriggerBadge}
              onPress={() =>
                setOptionsVisible(true)
              }
              activeOpacity={0.8}
            >
              <Ionicons
                name="create"
                size={16}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>
            {currentName}
          </Text>

          <View style={styles.tierPill}>
            <Text style={styles.tierPillText}>
              {t('profile.level', {
                level: userMetrics.level
              })}
              {' • '}
              {userMetrics.title.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* XP */}

        <View style={styles.xpCardWrapper}>
          <View style={styles.xpTextRow}>
            <Text style={styles.xpLabelString}>
              {t('profile.levelXp', {
                level: userMetrics.level
              })}
            </Text>

            <Text style={styles.xpValueString}>
              {userMetrics.currentXP}

              {userMetrics.maxXP !== Infinity && (
                <Text
                  style={{
                    color: '#4B5563'
                  }}
                >
                  {' / '}
                  {userMetrics.maxXP}
                </Text>
              )}
            </Text>
          </View>

          <View style={styles.trackBarBg}>
            <View
              style={[
                styles.trackBarFill,
                {
                  width:
                    userMetrics.progressPct
                }
              ]}
            />
          </View>

          <Text
            style={{
              color: '#64748B',
              fontSize: 11,
              marginTop: 8
            }}
          >
            {userMetrics.nextLevel
              ? t('profile.xpUntilLevel', {
                  xp:
                    userMetrics.nextLevel.minXP -
                    userMetrics.currentXP,
                  level:
                    userMetrics.nextLevel.level
                })
              : t(
                  'profile.maximumLevel'
                )}
          </Text>
        </View>

        {/* STREAK */}

        <View style={styles.streakBannerBox}>
          <View style={styles.streakLeftRow}>
            <View
              style={styles.fireIconCircle}
            >
              <Ionicons
                name="flame"
                size={24}
                color="#FF7A00"
              />
            </View>

            <View
              style={{
                marginLeft: 14
              }}
            >
              <Text
                style={styles.streakTitleHeading}
              >
                {t(
                  'profile.streak.daysRunning',
                  {
                    count: currentStreak
                  }
                )}
              </Text>

              <Text
                style={styles.streakSubheadingText}
              >
                {t(
                  'profile.streak.dailyHabits'
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* SETTINGS */}

        <Text
          style={styles.sectionHeaderString}
        >
          {t(
            'profile.account.architecture'
          )}
        </Text>

        <TouchableOpacity
          style={styles.settingsNavigationRow}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('Settings')
          }
        >
          <View
            style={styles.settingsLeftLayout}
          >
            <View
              style={styles.settingsIconBox}
            >
              <Ionicons
                name="cog"
                size={20}
                color="#94A3B8"
              />
            </View>

            <View>
              <Text
                style={styles.settingsTitleMain}
              >
                {t(
                  'profile.account.changeSettings'
                )}
              </Text>

              <Text
                style={styles.settingsTitleSub}
              >
                {t(
                  'profile.account.changeSettingsDescription'
                )}
              </Text>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={16}
            color="#475569"
          />
        </TouchableOpacity>

        {/* ACHIEVEMENTS */}

        <Text
          style={styles.sectionHeaderString}
        >
          {t(
            'profile.achievements.title'
          )}
        </Text>

        <View
          style={styles.badgeSectionWrapper}
        >
          {badges && badges.length > 0 ? (
            <View
              style={
                styles.badgesDisplayFlexGrid
              }
            >
              {badges.map(
                (badgeKey, idx) => {
                  const meta =
                    BADGE_CONFIG[
                      badgeKey
                    ];

                  const border =
                    meta?.border ??
                    '#334155';

                  const icon =
                    meta?.icon ??
                    '🏅';

                  const label = meta
                    ? t(meta.labelKey)
                    : badgeKey.replace(
                        /_/g,
                        ' '
                      );

                  const description =
                    meta
                      ? t(meta.descKey)
                      : t(
                          'profile.badges.fallbackDescription'
                        );

                  return (
                    <View
                      key={idx}
                      style={[
                        styles.premiumBadgeItemCard,
                        {
                          borderColor:
                            border + '40'
                        }
                      ]}
                    >
                      <View
                        style={[
                          styles.badgeEmblemBox,
                          {
                            backgroundColor:
                              border + '15'
                          }
                        ]}
                      >
                        <Text
                          style={
                            styles.badgeEmoji
                          }
                        >
                          {icon}
                        </Text>
                      </View>

                      <View
                        style={
                          styles.badgeTextMeta
                        }
                      >
                        <Text
                          style={
                            styles.badgeLabelTitle
                          }
                        >
                          {label}
                        </Text>

                        <Text
                          style={
                            styles.badgeDescriptionText
                          }
                        >
                          {description}
                        </Text>
                      </View>
                    </View>
                  );
                }
              )}
            </View>
          ) : (
            <View
              style={styles.emptyBadgesBox}
            >
              <Ionicons
                name="ribbon-outline"
                size={32}
                color="#334155"
              />

              <Text
                style={
                  styles.emptyBadgesText
                }
              >
                {t(
                  'profile.achievements.empty'
                )}
              </Text>
            </View>
          )}
        </View>

        {/* LOG OUT */}

        <TouchableOpacity
          style={styles.logoutButtonWrapper}
          activeOpacity={0.8}
          onPress={logout}
        >
          <Ionicons
            name="power-sharp"
            size={16}
            color="#EF4444"
          />

          <Text
            style={styles.logoutButtonText}
          >
            {t('profile.logout')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* CHOOSE METHOD MODAL */}

      <Modal
        visible={optionsVisible}
        transparent
        animationType="fade"
      >
        <View
          style={styles.modalBlurOverlay}
        >
          <View
            style={styles.optionsContainer}
          >
            <Text
              style={styles.optionsHeader}
            >
              {t(
                'profile.photo.identityUpdate'
              )}
            </Text>

            <Text
              style={styles.pdpaDisclaimer}
            >
              {t(
                'profile.photo.privacyNotice'
              )}
            </Text>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleLaunchCamera}
            >
              <Ionicons
                name="camera"
                size={22}
                color="#38BDF8"
                style={{ width: 30 }}
              />

              <Text
                style={styles.optionText}
              >
                {t(
                  'profile.photo.camera'
                )}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleLaunchGallery}
            >
              <Ionicons
                name="image"
                size={22}
                color="#34D399"
                style={{ width: 30 }}
              />

              <Text
                style={styles.optionText}
              >
                {t(
                  'profile.photo.gallery'
                )}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setOptionsVisible(false);
                setEmojiModalVisible(true);
              }}
            >
              <Ionicons
                name="happy"
                size={22}
                color="#F59E0B"
                style={{ width: 30 }}
              />

              <Text
                style={styles.optionText}
              >
                {t(
                  'profile.photo.emoji'
                )}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelOption}
              onPress={() =>
                setOptionsVisible(false)
              }
            >
              <Text
                style={
                  styles.cancelOptionText
                }
              >
                {t(
                  'profile.photo.cancel'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* EMOJI SELECTOR */}

      <Modal
        visible={emojiModalVisible}
        transparent
        animationType="slide"
      >
        <View
          style={styles.modalBlurOverlay}
        >
          <View
            style={styles.optionsContainer}
          >
            <Text
              style={styles.optionsHeader}
            >
              {t(
                'profile.photo.selectEmoji'
              )}
            </Text>

            <Text
              style={styles.pdpaDisclaimer}
            >
              {t(
                'profile.photo.emojiPrivacy'
              )}
            </Text>

            <FlatList
              data={FALLBACK_EMOJIS}
              numColumns={5}
              keyExtractor={item => item}
              columnWrapperStyle={{
                justifyContent:
                  'space-around',
                marginVertical: 8
              }}
              renderItem={({
                item
              }) => (
                <TouchableOpacity
                  onPress={() =>
                    handleSelectEmoji(item)
                  }
                  style={
                    styles.emojiGridSelect
                  }
                >
                  <Text
                    style={{
                      fontSize: 32
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={[
                styles.cancelOption,
                {
                  marginTop: 16
                }
              ]}
              onPress={() =>
                setEmojiModalVisible(false)
              }
            >
              <Text
                style={
                  styles.cancelOptionText
                }
              >
                {t(
                  'profile.photo.back'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CAMERA */}

      <Modal
        visible={cameraVisible}
        animationType="slide"
        transparent={false}
      >
        <View
          style={styles.cameraContainer}
        >
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
          />

          <View
            style={
              styles.absoluteCameraControls
            }
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                setCameraVisible(false)
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={28}
                color="white"
              />
            </TouchableOpacity>

            <View
              style={styles.bottomActions}
            >
              <TouchableOpacity
                style={styles.circularButton}
                onPress={() =>
                  setFacing(current =>
                    current === 'back'
                      ? 'front'
                      : 'back'
                  )
                }
                activeOpacity={0.7}
              >
                <Ionicons
                  name="camera-reverse"
                  size={26}
                  color="white"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.captureButton
                }
                onPress={takePicture}
                activeOpacity={0.7}
              >
                <View
                  style={
                    styles.innerCaptureButton
                  }
                />
              </TouchableOpacity>

              <View
                style={{
                  width: 60
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712'
  },

  headerArea: {
    paddingTop: 60,
    alignItems: 'center',
    paddingBottom: 24,
    backgroundColor: '#090F1E',
    borderBottomWidth: 1,
    borderColor: '#1E293B'
  },

  avatarWrapper: {
    position: 'relative',
    width: 88,
    height: 88
  },

  avatarFrame: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center'
  },

  imageProfileAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42
  },

  emojiAvatarContainer: {
    backgroundColor: '#1E1B4B',
    borderColor: '#818CF8'
  },

  largeEmojiDisplay: {
    fontSize: 40
  },

  loadingAvatar: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  avatarText: {
    color: '#38BDF8',
    fontWeight: '900',
    fontSize: 28
  },

  cameraTriggerBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#3B82F6',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#090F1E'
  },

  profileName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 14,
    letterSpacing: -0.3
  },

  tierPill: {
    backgroundColor: '#1E1B4B',
    borderWidth: 1,
    borderColor: '#4338CA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8
  },

  tierPillText: {
    color: '#818CF8',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5
  },

  xpCardWrapper: {
    margin: 16,
    backgroundColor: '#090F1E',
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 18,
    borderRadius: 20
  },

  xpTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },

  xpLabelString: {
    color: '#4B5563',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1
  },

  xpValueString: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14
  },

  trackBarBg: {
    height: 6,
    backgroundColor: '#111827',
    borderRadius: 10,
    overflow: 'hidden'
  },

  trackBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 10
  },

  sectionHeaderString: {
    color: '#4B5563',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 12
  },

  streakBannerBox: {
    marginHorizontal: 16,
    backgroundColor: '#1C130C',
    borderWidth: 1,
    borderColor: '#78350F',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14
  },

  streakLeftRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  fireIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#451A03',
    justifyContent: 'center',
    alignItems: 'center'
  },

  streakTitleHeading: {
    color: '#F59E0B',
    fontSize: 15,
    fontWeight: '800'
  },

  streakSubheadingText: {
    color: '#B45309',
    fontSize: 12,
    marginTop: 1,
    fontWeight: '500'
  },

  settingsNavigationRow: {
    marginHorizontal: 16,
    backgroundColor: '#090F1E',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },

  settingsLeftLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },

  settingsIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center'
  },

  settingsTitleMain: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },

  settingsTitleSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 1
  },

  badgeSectionWrapper: {
    paddingHorizontal: 16,
    marginBottom: 24
  },

  badgesDisplayFlexGrid: {
    gap: 10
  },

  premiumBadgeItemCard: {
    backgroundColor: '#090F1E',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },

  badgeEmblemBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  badgeEmoji: {
    fontSize: 22
  },

  badgeTextMeta: {
    marginLeft: 14,
    flex: 1
  },

  badgeLabelTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },

  badgeDescriptionText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 1
  },

  emptyBadgesBox: {
    backgroundColor: '#090F1E',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center'
  },

  emptyBadgesText: {
    color: '#4B5563',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    maxWidth: '85%'
  },

  logoutButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    marginHorizontal: 16,
    backgroundColor: '#1A0B0B',
    borderColor: '#DC2626',
    borderWidth: 1,
    borderRadius: 12,
    gap: 8,
    marginTop: 10,
    marginBottom: 20
  },

  logoutButtonText: {
    color: '#F87171',
    fontWeight: '800',
    fontSize: 13
  },

  modalBlurOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  optionsContainer: {
    width: '100%',
    backgroundColor: '#090F1E',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 24
  },

  optionsHeader: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8
  },

  pdpaDisclaimer: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20
  },

  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#1E293B'
  },

  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },

  cancelOption: {
    padding: 14,
    alignItems: 'center',
    marginTop: 8
  },

  cancelOptionText: {
    color: '#64748B',
    fontWeight: '800',
    fontSize: 13
  },

  emojiGridSelect: {
    padding: 12,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B'
  },

  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
    position: 'relative'
  },

  camera: {
    flex: 1
  },

  absoluteCameraControls: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 50
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },

  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10
  },

  circularButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },

  innerCaptureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white'
  }
});
