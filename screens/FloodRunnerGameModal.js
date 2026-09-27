// // // // // // // // // // components/FloodRunnerGameModal.js
// // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
// // // // // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // // // // import * as Haptics from 'expo-haptics';
// // // // // // // // // import { Accelerometer } from 'expo-sensors';

// // // // // // // // // const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // // // // // // // // export default function FloodRunnerGameModal({ visible, onClose, onWin }) {
// // // // // // // // //   const GAME_WIDTH = SCREEN_WIDTH - 64;
// // // // // // // // //   const PLAYER_SIZE = 30;
  
// // // // // // // // //   const [playerPositionX, setPlayerPositionX] = useState(GAME_WIDTH / 2 - PLAYER_SIZE / 2);
// // // // // // // // //   const [debrisY, setDebrisY] = useState(0);
// // // // // // // // //   const [debrisX, setDebrisX] = useState(Math.random() * (GAME_WIDTH - 20));
// // // // // // // // //   const [score, setScore] = useState(0);
// // // // // // // // //   const [gameOver, setGameOver] = useState(false);
// // // // // // // // //   const [hasWon, setHasWon] = useState(false);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     let subscription;
// // // // // // // // //     if (visible && !gameOver && !hasWon) {
// // // // // // // // //       Accelerometer.setUpdateInterval(30);
// // // // // // // // //       subscription = Accelerometer.addListener(data => {
// // // // // // // // //         setPlayerPositionX(prevX => {
// // // // // // // // //           let nextX = prevX + data.x * 18;
// // // // // // // // //           if (nextX < 0) return 0;
// // // // // // // // //           if (nextX > GAME_WIDTH - PLAYER_SIZE) return GAME_WIDTH - PLAYER_SIZE;
// // // // // // // // //           return nextX;
// // // // // // // // //         });
// // // // // // // // //       });
// // // // // // // // //     }
// // // // // // // // //     return () => subscription && subscription.remove();
// // // // // // // // //   }, [visible, gameOver, hasWon]);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     let gameInterval;
// // // // // // // // //     if (visible && !gameOver && !hasWon) {
// // // // // // // // //       gameInterval = setInterval(() => {
// // // // // // // // //         setDebrisY(prevY => {
// // // // // // // // //           if (prevY > 260) {
// // // // // // // // //             setScore(s => {
// // // // // // // // //               const newScore = s + 10;
// // // // // // // // //               if (newScore >= 50) {
// // // // // // // // //                 setHasWon(true);
// // // // // // // // //                 Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
// // // // // // // // //               }
// // // // // // // // //               return newScore;
// // // // // // // // //             });
// // // // // // // // //             setDebrisX(Math.random() * (GAME_WIDTH - 20));
// // // // // // // // //             return 0;
// // // // // // // // //           }
// // // // // // // // //           return prevY + 12;
// // // // // // // // //         });
// // // // // // // // //       }, 30);
// // // // // // // // //     }
// // // // // // // // //     return () => clearInterval(gameInterval);
// // // // // // // // //   }, [visible, gameOver, hasWon, debrisX]);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     if (debrisY > 210 && debrisY < 250) {
// // // // // // // // //       const playerCenter = playerPositionX + PLAYER_SIZE / 2;
// // // // // // // // //       const debrisCenter = debrisX + 10;
// // // // // // // // //       if (Math.abs(playerCenter - debrisCenter) < 22) {
// // // // // // // // //         setGameOver(true);
// // // // // // // // //         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
// // // // // // // // //       }
// // // // // // // // //     }
// // // // // // // // //   }, [debrisY, playerPositionX, debrisX]);

// // // // // // // // //   const restartGame = () => {
// // // // // // // // //     setScore(0);
// // // // // // // // //     setDebrisY(0);
// // // // // // // // //     setGameOver(false);
// // // // // // // // //     setHasWon(false);
// // // // // // // // //     setPlayerPositionX(GAME_WIDTH / 2 - PLAYER_SIZE / 2);
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <Modal visible={visible} animationType="slide" transparent={true}>
// // // // // // // // //       <View style={styles.modalOverlay}>
// // // // // // // // //         <View style={[styles.modalContentCard, { height: 480 }]}>
// // // // // // // // //           <View style={styles.modalHeader}>
// // // // // // // // //             <Text style={styles.modalTitle}>Flash Flood Evacuation Drill</Text>
// // // // // // // // //             <TouchableOpacity onPress={onClose}>
// // // // // // // // //               <Ionicons name="close-circle" size={26} color="#64748B" />
// // // // // // // // //             </TouchableOpacity>
// // // // // // // // //           </View>
// // // // // // // // //           <Text style={{ color: '#94A3B8', fontSize: 12, marginBottom: 12 }}>
// // // // // // // // //             Tilt your phone physically left/right to steer your responder to safety!
// // // // // // // // //           </Text>

// // // // // // // // //           <View style={[styles.gameCanvas, { width: GAME_WIDTH }]}>
// // // // // // // // //             <View style={[styles.playerNode, { left: playerPositionX }]}>
// // // // // // // // //               <Ionicons name="walk" size={24} color="black" />
// // // // // // // // //               <Ionicons name="walk-outline" size={24} color="black" />
// // // // // // // // //               <Ionicons name="fitness-outline" size={24} color="black" />
// // // // // // // // //             </View>

// // // // // // // // //             {!gameOver && !hasWon && (
// // // // // // // // //               <View style={[styles.debrisNode, { left: debrisX, top: debrisY }]}>
// // // // // // // // //                 <Ionicons name="warning" size={20} color="#EF4444" />
// // // // // // // // //               </View>
// // // // // // // // //             )}

// // // // // // // // //             <View style={styles.shelterLine}>
// // // // // // // // //               <Text style={styles.shelterLineText}>SCDF SAFE ELEVATED SHELTER AREA</Text>
// // // // // // // // //             </View>
// // // // // // // // //           </View>

// // // // // // // // //           <View style={styles.gameHud}>
// // // // // // // // //             <Text style={{ color: '#FFF', fontWeight: '800' }}>Evacuation Score: {score} / 50</Text>
// // // // // // // // //           </View>

// // // // // // // // //           {gameOver && (
// // // // // // // // //             <View style={styles.endGameOverlay}>
// // // // // // // // //               <Text style={{ color: '#EF4444', fontWeight: '900', fontSize: 18 }}>Trapped by Water!</Text>
// // // // // // // // //               <TouchableOpacity style={styles.retryBtn} onPress={restartGame}>
// // // // // // // // //                 <Text style={{ color: '#FFF', fontWeight: '800' }}>Retry Drill</Text>
// // // // // // // // //               </TouchableOpacity>
// // // // // // // // //             </View>
// // // // // // // // //           )}

// // // // // // // // //           {hasWon && (
// // // // // // // // //             <View style={styles.endGameOverlay}>
// // // // // // // // //               <Text style={{ color: '#10B981', fontWeight: '900', fontSize: 18 }}>Reached High Ground!</Text>
// // // // // // // // //               <TouchableOpacity 
// // // // // // // // //                 style={styles.claimRewardBtn} 
// // // // // // // // //                 onPress={() => {
// // // // // // // // //                   onWin({ xp: 100, coins: 25 });
// // // // // // // // //                   onClose();
// // // // // // // // //                 }}
// // // // // // // // //               >
// // // // // // // // //                 <Text style={styles.claimRewardText}>Claim +100 XP & +25 Coins</Text>
// // // // // // // // //               </TouchableOpacity>
// // // // // // // // //             </View>
// // // // // // // // //           )}
// // // // // // // // //         </View>
// // // // // // // // //       </View>
// // // // // // // // //     </Modal>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //   modalOverlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 },
// // // // // // // // //   modalContentCard: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 20, padding: 20, width: '100%' },
// // // // // // // // //   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
// // // // // // // // //   modalTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
// // // // // // // // //   gameCanvas: { height: 260, backgroundColor: '#020617', borderRadius: 12, borderWidth: 1, borderColor: '#1E293B', position: 'relative', overflow: 'hidden' },
// // // // // // // // //   playerNode: { position: 'absolute', bottom: 10 },
// // // // // // // // //   debrisNode: { position: 'absolute' },
// // // // // // // // //   shelterLine: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#10B98120', paddingVertical: 4, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#10B981' },
// // // // // // // // //   shelterLineText: { color: '#10B981', fontSize: 8, fontWeight: '900' },
// // // // // // // // //   gameHud: { marginTop: 12, alignItems: 'center' },
// // // // // // // // //   endGameOverlay: { position: 'absolute', top: 120, left: 20, right: 20, backgroundColor: '#0F172ACC', padding: 20, borderRadius: 16, alignItems: 'center' },
// // // // // // // // //   retryBtn: { backgroundColor: '#EF4444', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginTop: 10 },
// // // // // // // // //   claimRewardBtn: { backgroundColor: '#10B981', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', marginTop: 10 },
// // // // // // // // //   claimRewardText: { color: '#FFF', fontWeight: '900', fontSize: 13 }
// // // // // // // // // });




// // // // // // // // // components/FloodRunnerGameModal.js

// // // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // // import {
// // // // // // // //   View,
// // // // // // // //   Text,
// // // // // // // //   StyleSheet,
// // // // // // // //   TouchableOpacity,
// // // // // // // //   Modal,
// // // // // // // //   Dimensions,
// // // // // // // // } from 'react-native';
// // // // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // // // import * as Haptics from 'expo-haptics';
// // // // // // // // import { Accelerometer } from 'expo-sensors';

// // // // // // // // const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// // // // // // // // export default function FloodRunnerGameModal({
// // // // // // // //   visible,
// // // // // // // //   onClose,
// // // // // // // //   onWin,
// // // // // // // // }) {
// // // // // // // //   // Keep the game safely inside the modal.
// // // // // // // //   const GAME_WIDTH = Math.min(SCREEN_WIDTH - 72, 420);
// // // // // // // //   const GAME_HEIGHT = Math.min(SCREEN_HEIGHT * 0.42, 320);

// // // // // // // //   const PLAYER_SIZE = 34;
// // // // // // // //   const DEBRIS_SIZE = 28;

// // // // // // // //   const [playerPositionX, setPlayerPositionX] = useState(
// // // // // // // //     GAME_WIDTH / 2 - PLAYER_SIZE / 2
// // // // // // // //   );

// // // // // // // //   const [debrisY, setDebrisY] = useState(0);

// // // // // // // //   const [debrisX, setDebrisX] = useState(
// // // // // // // //     Math.random() * (GAME_WIDTH - DEBRIS_SIZE)
// // // // // // // //   );

// // // // // // // //   const [score, setScore] = useState(0);
// // // // // // // //   const [gameOver, setGameOver] = useState(false);
// // // // // // // //   const [hasWon, setHasWon] = useState(false);

// // // // // // // //   /*
// // // // // // // //    * ---------------------------------------------------------
// // // // // // // //    * RESET WHEN OPENING
// // // // // // // //    * ---------------------------------------------------------
// // // // // // // //    */

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (visible) {
// // // // // // // //       setScore(0);
// // // // // // // //       setDebrisY(0);
// // // // // // // //       setDebrisX(
// // // // // // // //         Math.random() * (GAME_WIDTH - DEBRIS_SIZE)
// // // // // // // //       );
// // // // // // // //       setPlayerPositionX(
// // // // // // // //         GAME_WIDTH / 2 - PLAYER_SIZE / 2
// // // // // // // //       );
// // // // // // // //       setGameOver(false);
// // // // // // // //       setHasWon(false);
// // // // // // // //     }
// // // // // // // //   }, [visible]);

// // // // // // // //   /*
// // // // // // // //    * ---------------------------------------------------------
// // // // // // // //    * ACCELEROMETER
// // // // // // // //    * ---------------------------------------------------------
// // // // // // // //    */

// // // // // // // //   useEffect(() => {
// // // // // // // //     let subscription;

// // // // // // // //     if (visible && !gameOver && !hasWon) {
// // // // // // // //       Accelerometer.setUpdateInterval(30);

// // // // // // // //       subscription = Accelerometer.addListener((data) => {
// // // // // // // //         setPlayerPositionX((prevX) => {
// // // // // // // //           // Tilt left/right.
// // // // // // // //           //
// // // // // // // //           // Depending on phone orientation, you may need
// // // // // // // //           // to change data.x to -data.x.

// // // // // // // //           let nextX = prevX + data.x * 18;

// // // // // // // //           if (nextX < 0) {
// // // // // // // //             nextX = 0;
// // // // // // // //           }

// // // // // // // //           if (nextX > GAME_WIDTH - PLAYER_SIZE) {
// // // // // // // //             nextX = GAME_WIDTH - PLAYER_SIZE;
// // // // // // // //           }

// // // // // // // //           return nextX;
// // // // // // // //         });
// // // // // // // //       });
// // // // // // // //     }

// // // // // // // //     return () => {
// // // // // // // //       if (subscription) {
// // // // // // // //         subscription.remove();
// // // // // // // //       }
// // // // // // // //     };
// // // // // // // //   }, [visible, gameOver, hasWon]);

// // // // // // // //   /*
// // // // // // // //    * ---------------------------------------------------------
// // // // // // // //    * DEBRIS MOVEMENT
// // // // // // // //    * ---------------------------------------------------------
// // // // // // // //    */

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (!visible || gameOver || hasWon) {
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     const gameInterval = setInterval(() => {
// // // // // // // //       setDebrisY((previousY) => {
// // // // // // // //         const nextY = previousY + 8;

// // // // // // // //         // Debris reached bottom.
// // // // // // // //         if (nextY > GAME_HEIGHT - 40) {
// // // // // // // //           setScore((previousScore) => {
// // // // // // // //             const newScore = previousScore + 10;

// // // // // // // //             if (newScore >= 50) {
// // // // // // // //               setHasWon(true);

// // // // // // // //               Haptics.notificationAsync(
// // // // // // // //                 Haptics.NotificationFeedbackType.Success
// // // // // // // //               );
// // // // // // // //             }

// // // // // // // //             return newScore;
// // // // // // // //           });

// // // // // // // //           setDebrisX(
// // // // // // // //             Math.random() * (GAME_WIDTH - DEBRIS_SIZE)
// // // // // // // //           );

// // // // // // // //           return 0;
// // // // // // // //         }

// // // // // // // //         return nextY;
// // // // // // // //       });
// // // // // // // //     }, 40);

// // // // // // // //     return () => clearInterval(gameInterval);
// // // // // // // //   }, [visible, gameOver, hasWon, GAME_WIDTH, GAME_HEIGHT]);

// // // // // // // //   /*
// // // // // // // //    * ---------------------------------------------------------
// // // // // // // //    * COLLISION
// // // // // // // //    * ---------------------------------------------------------
// // // // // // // //    */

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (gameOver || hasWon) {
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     const playerCenter =
// // // // // // // //       playerPositionX + PLAYER_SIZE / 2;

// // // // // // // //     const debrisCenter =
// // // // // // // //       debrisX + DEBRIS_SIZE / 2;

// // // // // // // //     const horizontalDistance =
// // // // // // // //       Math.abs(playerCenter - debrisCenter);

// // // // // // // //     const playerBottom = GAME_HEIGHT - 10;

// // // // // // // //     const debrisBottom =
// // // // // // // //       debrisY + DEBRIS_SIZE;

// // // // // // // //     // Collision zone near the player.
// // // // // // // //     if (
// // // // // // // //       debrisBottom >= playerBottom - PLAYER_SIZE &&
// // // // // // // //       debrisY <= playerBottom &&
// // // // // // // //       horizontalDistance < 28
// // // // // // // //     ) {
// // // // // // // //       setGameOver(true);

// // // // // // // //       Haptics.impactAsync(
// // // // // // // //         Haptics.ImpactFeedbackStyle.Heavy
// // // // // // // //       );
// // // // // // // //     }
// // // // // // // //   }, [
// // // // // // // //     debrisY,
// // // // // // // //     debrisX,
// // // // // // // //     playerPositionX,
// // // // // // // //     gameOver,
// // // // // // // //     hasWon,
// // // // // // // //     GAME_HEIGHT,
// // // // // // // //   ]);

// // // // // // // //   /*
// // // // // // // //    * ---------------------------------------------------------
// // // // // // // //    * RESTART
// // // // // // // //    * ---------------------------------------------------------
// // // // // // // //    */

// // // // // // // //   const restartGame = () => {
// // // // // // // //     setScore(0);
// // // // // // // //     setDebrisY(0);

// // // // // // // //     setDebrisX(
// // // // // // // //       Math.random() * (GAME_WIDTH - DEBRIS_SIZE)
// // // // // // // //     );

// // // // // // // //     setPlayerPositionX(
// // // // // // // //       GAME_WIDTH / 2 - PLAYER_SIZE / 2
// // // // // // // //     );

// // // // // // // //     setGameOver(false);
// // // // // // // //     setHasWon(false);
// // // // // // // //   };

// // // // // // // //   /*
// // // // // // // //    * ---------------------------------------------------------
// // // // // // // //    * RENDER
// // // // // // // //    * ---------------------------------------------------------
// // // // // // // //    */

// // // // // // // //   return (
// // // // // // // //     <Modal
// // // // // // // //       visible={visible}
// // // // // // // //       animationType="slide"
// // // // // // // //       transparent
// // // // // // // //       onRequestClose={onClose}
// // // // // // // //     >
// // // // // // // //       <View style={styles.modalOverlay}>

// // // // // // // //         <View
// // // // // // // //           style={[
// // // // // // // //             styles.modalContentCard,
// // // // // // // //             {
// // // // // // // //               width: Math.min(SCREEN_WIDTH - 24, 480),
// // // // // // // //             },
// // // // // // // //           ]}
// // // // // // // //         >

// // // // // // // //           {/* HEADER */}

// // // // // // // //           <View style={styles.modalHeader}>
// // // // // // // //             <View style={{ flex: 1 }}>
// // // // // // // //               <Text style={styles.modalTitle}>
// // // // // // // //                 Flash Flood Evacuation Drill
// // // // // // // //               </Text>

// // // // // // // //               <Text style={styles.modalSubtitle}>
// // // // // // // //                 Reach high ground while avoiding flood debris.
// // // // // // // //               </Text>
// // // // // // // //             </View>

// // // // // // // //             <TouchableOpacity
// // // // // // // //               onPress={onClose}
// // // // // // // //               style={styles.closeButton}
// // // // // // // //             >
// // // // // // // //               <Ionicons
// // // // // // // //                 name="close-circle"
// // // // // // // //                 size={28}
// // // // // // // //                 color="#64748B"
// // // // // // // //               />
// // // // // // // //             </TouchableOpacity>
// // // // // // // //           </View>

// // // // // // // //           {/* INSTRUCTIONS */}

// // // // // // // //           <View style={styles.instructionBox}>
// // // // // // // //             <Ionicons
// // // // // // // //               name="phone-portrait-outline"
// // // // // // // //               size={18}
// // // // // // // //               color="#38BDF8"
// // // // // // // //             />

// // // // // // // //             <Text style={styles.instructionText}>
// // // // // // // //               Tilt your phone left and right to move the responder.
// // // // // // // //               Avoid falling debris and reach 50 points.
// // // // // // // //             </Text>
// // // // // // // //           </View>

// // // // // // // //           {/* GAME */}

// // // // // // // //           <View
// // // // // // // //             style={[
// // // // // // // //               styles.gameCanvas,
// // // // // // // //               {
// // // // // // // //                 width: GAME_WIDTH,
// // // // // // // //                 height: GAME_HEIGHT,
// // // // // // // //               },
// // // // // // // //             ]}
// // // // // // // //           >

// // // // // // // //             {/* WATER */}

// // // // // // // //             <View style={styles.waterLayer} />

// // // // // // // //             {/* SHELTER */}

// // // // // // // //             <View style={styles.shelterLine}>
// // // // // // // //               <Ionicons
// // // // // // // //                 name="shield-checkmark"
// // // // // // // //                 size={14}
// // // // // // // //                 color="#34D399"
// // // // // // // //               />

// // // // // // // //               <Text style={styles.shelterLineText}>
// // // // // // // //                 SAFE ELEVATED SHELTER
// // // // // // // //               </Text>
// // // // // // // //             </View>

// // // // // // // //             {/* DEBRIS */}

// // // // // // // //             {!gameOver && !hasWon && (
// // // // // // // //               <View
// // // // // // // //                 style={[
// // // // // // // //                   styles.debrisNode,
// // // // // // // //                   {
// // // // // // // //                     left: debrisX,
// // // // // // // //                     top: debrisY,
// // // // // // // //                     width: DEBRIS_SIZE,
// // // // // // // //                     height: DEBRIS_SIZE,
// // // // // // // //                   },
// // // // // // // //                 ]}
// // // // // // // //               >
// // // // // // // //                 <View style={styles.debrisCircle}>
// // // // // // // //                   <Ionicons
// // // // // // // //                     name="warning"
// // // // // // // //                     size={18}
// // // // // // // //                     color="#FFFFFF"
// // // // // // // //                   />
// // // // // // // //                 </View>
// // // // // // // //               </View>
// // // // // // // //             )}

// // // // // // // //             {/* PLAYER */}

// // // // // // // //             <View
// // // // // // // //               style={[
// // // // // // // //                 styles.playerNode,
// // // // // // // //                 {
// // // // // // // //                   left: playerPositionX,
// // // // // // // //                   bottom: 12,
// // // // // // // //                   width: PLAYER_SIZE,
// // // // // // // //                   height: PLAYER_SIZE,
// // // // // // // //                 },
// // // // // // // //               ]}
// // // // // // // //             >
// // // // // // // //               <View style={styles.playerCircle}>
// // // // // // // //                 <Ionicons
// // // // // // // //                   name="person"
// // // // // // // //                   size={21}
// // // // // // // //                   color="#020617"
// // // // // // // //                 />
// // // // // // // //               </View>
// // // // // // // //             </View>

// // // // // // // //             {/* GAME OVER */}

// // // // // // // //             {gameOver && (
// // // // // // // //               <View style={styles.endGameOverlay}>

// // // // // // // //                 <Ionicons
// // // // // // // //                   name="warning"
// // // // // // // //                   size={38}
// // // // // // // //                   color="#EF4444"
// // // // // // // //                 />

// // // // // // // //                 <Text style={styles.gameOverTitle}>
// // // // // // // //                   Trapped by Water!
// // // // // // // //                 </Text>

// // // // // // // //                 <Text style={styles.gameOverText}>
// // // // // // // //                   Avoid the debris and try again.
// // // // // // // //                 </Text>

// // // // // // // //                 <TouchableOpacity
// // // // // // // //                   style={styles.retryBtn}
// // // // // // // //                   onPress={restartGame}
// // // // // // // //                 >
// // // // // // // //                   <Ionicons
// // // // // // // //                     name="refresh"
// // // // // // // //                     size={16}
// // // // // // // //                     color="#FFFFFF"
// // // // // // // //                   />

// // // // // // // //                   <Text style={styles.retryText}>
// // // // // // // //                     Retry Drill
// // // // // // // //                   </Text>
// // // // // // // //                 </TouchableOpacity>

// // // // // // // //               </View>
// // // // // // // //             )}

// // // // // // // //             {/* WIN */}

// // // // // // // //             {hasWon && (
// // // // // // // //               <View style={styles.endGameOverlay}>

// // // // // // // //                 <Ionicons
// // // // // // // //                   name="checkmark-circle"
// // // // // // // //                   size={42}
// // // // // // // //                   color="#34D399"
// // // // // // // //                 />

// // // // // // // //                 <Text style={styles.winTitle}>
// // // // // // // //                   Reached High Ground!
// // // // // // // //                 </Text>

// // // // // // // //                 <Text style={styles.gameOverText}>
// // // // // // // //                   You successfully completed the evacuation drill.
// // // // // // // //                 </Text>

// // // // // // // //                 <TouchableOpacity
// // // // // // // //                   style={styles.claimRewardBtn}
// // // // // // // //                   onPress={() => {
// // // // // // // //                     onWin({
// // // // // // // //                       xp: 100,
// // // // // // // //                       coins: 25,
// // // // // // // //                     });

// // // // // // // //                     onClose();
// // // // // // // //                   }}
// // // // // // // //                 >
// // // // // // // //                   <Text style={styles.claimRewardText}>
// // // // // // // //                     Claim +100 XP & +25 Coins
// // // // // // // //                   </Text>
// // // // // // // //                 </TouchableOpacity>

// // // // // // // //               </View>
// // // // // // // //             )}

// // // // // // // //           </View>

// // // // // // // //           {/* HUD */}

// // // // // // // //           <View style={styles.gameHud}>

// // // // // // // //             <View style={styles.scoreBox}>
// // // // // // // //               <Ionicons
// // // // // // // //                 name="trophy"
// // // // // // // //                 size={16}
// // // // // // // //                 color="#FBBF24"
// // // // // // // //               />

// // // // // // // //               <Text style={styles.scoreText}>
// // // // // // // //                 {score} / 50
// // // // // // // //               </Text>
// // // // // // // //             </View>

// // // // // // // //             <Text style={styles.scoreLabel}>
// // // // // // // //               EVACUATION SCORE
// // // // // // // //             </Text>

// // // // // // // //           </View>

// // // // // // // //         </View>

// // // // // // // //       </View>
// // // // // // // //     </Modal>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // const styles = StyleSheet.create({

// // // // // // // //   modalOverlay: {
// // // // // // // //     flex: 1,
// // // // // // // //     backgroundColor: 'rgba(2, 6, 23, 0.88)',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     padding: 12,
// // // // // // // //   },

// // // // // // // //   modalContentCard: {
// // // // // // // //     backgroundColor: '#0F172A',
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: '#1E293B',
// // // // // // // //     borderRadius: 20,
// // // // // // // //     padding: 16,
// // // // // // // //     maxHeight: '92%',
// // // // // // // //   },

// // // // // // // //   modalHeader: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'flex-start',
// // // // // // // //     marginBottom: 10,
// // // // // // // //   },

// // // // // // // //   modalTitle: {
// // // // // // // //     color: '#FFFFFF',
// // // // // // // //     fontSize: 17,
// // // // // // // //     fontWeight: '900',
// // // // // // // //   },

// // // // // // // //   modalSubtitle: {
// // // // // // // //     color: '#64748B',
// // // // // // // //     fontSize: 11,
// // // // // // // //     marginTop: 3,
// // // // // // // //   },

// // // // // // // //   closeButton: {
// // // // // // // //     marginLeft: 10,
// // // // // // // //   },

// // // // // // // //   instructionBox: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     backgroundColor: '#082F49',
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: '#075985',
// // // // // // // //     borderRadius: 10,
// // // // // // // //     padding: 9,
// // // // // // // //     marginBottom: 12,
// // // // // // // //     gap: 8,
// // // // // // // //   },

// // // // // // // //   instructionText: {
// // // // // // // //     flex: 1,
// // // // // // // //     color: '#BAE6FD',
// // // // // // // //     fontSize: 10,
// // // // // // // //     lineHeight: 15,
// // // // // // // //   },

// // // // // // // //   gameCanvas: {
// // // // // // // //     backgroundColor: '#020617',
// // // // // // // //     borderRadius: 14,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: '#1E293B',
// // // // // // // //     position: 'relative',
// // // // // // // //     overflow: 'hidden',
// // // // // // // //   },

// // // // // // // //   waterLayer: {
// // // // // // // //     position: 'absolute',
// // // // // // // //     left: 0,
// // // // // // // //     right: 0,
// // // // // // // //     bottom: 0,
// // // // // // // //     height: '32%',
// // // // // // // //     backgroundColor: '#082F49',
// // // // // // // //     opacity: 0.75,
// // // // // // // //   },

// // // // // // // //   shelterLine: {
// // // // // // // //     position: 'absolute',
// // // // // // // //     top: 0,
// // // // // // // //     left: 0,
// // // // // // // //     right: 0,
// // // // // // // //     backgroundColor: '#064E3B',
// // // // // // // //     paddingVertical: 7,
// // // // // // // //     alignItems: 'center',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     gap: 6,
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: '#10B981',
// // // // // // // //   },

// // // // // // // //   shelterLineText: {
// // // // // // // //     color: '#34D399',
// // // // // // // //     fontSize: 9,
// // // // // // // //     fontWeight: '900',
// // // // // // // //     letterSpacing: 0.5,
// // // // // // // //   },

// // // // // // // //   playerNode: {
// // // // // // // //     position: 'absolute',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },

// // // // // // // //   playerCircle: {
// // // // // // // //     width: 34,
// // // // // // // //     height: 34,
// // // // // // // //     borderRadius: 17,
// // // // // // // //     backgroundColor: '#38BDF8',
// // // // // // // //     borderWidth: 2,
// // // // // // // //     borderColor: '#FFFFFF',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },

// // // // // // // //   debrisNode: {
// // // // // // // //     position: 'absolute',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },

// // // // // // // //   debrisCircle: {
// // // // // // // //     width: 28,
// // // // // // // //     height: 28,
// // // // // // // //     borderRadius: 14,
// // // // // // // //     backgroundColor: '#EF4444',
// // // // // // // //     borderWidth: 2,
// // // // // // // //     borderColor: '#FCA5A5',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },

// // // // // // // //   gameHud: {
// // // // // // // //     marginTop: 10,
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },

// // // // // // // //   scoreBox: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     gap: 6,
// // // // // // // //   },

// // // // // // // //   scoreText: {
// // // // // // // //     color: '#FFFFFF',
// // // // // // // //     fontSize: 20,
// // // // // // // //     fontWeight: '900',
// // // // // // // //   },

// // // // // // // //   scoreLabel: {
// // // // // // // //     color: '#64748B',
// // // // // // // //     fontSize: 8,
// // // // // // // //     fontWeight: '900',
// // // // // // // //     letterSpacing: 1,
// // // // // // // //     marginTop: 2,
// // // // // // // //   },

// // // // // // // //   endGameOverlay: {
// // // // // // // //     position: 'absolute',
// // // // // // // //     top: 50,
// // // // // // // //     bottom: 20,
// // // // // // // //     left: 16,
// // // // // // // //     right: 16,
// // // // // // // //     backgroundColor: 'rgba(15, 23, 42, 0.96)',
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: '#334155',
// // // // // // // //     borderRadius: 18,
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     padding: 20,
// // // // // // // //   },

// // // // // // // //   gameOverTitle: {
// // // // // // // //     color: '#EF4444',
// // // // // // // //     fontWeight: '900',
// // // // // // // //     fontSize: 19,
// // // // // // // //     marginTop: 8,
// // // // // // // //   },

// // // // // // // //   winTitle: {
// // // // // // // //     color: '#34D399',
// // // // // // // //     fontWeight: '900',
// // // // // // // //     fontSize: 19,
// // // // // // // //     marginTop: 8,
// // // // // // // //   },

// // // // // // // //   gameOverText: {
// // // // // // // //     color: '#94A3B8',
// // // // // // // //     fontSize: 11,
// // // // // // // //     textAlign: 'center',
// // // // // // // //     marginTop: 5,
// // // // // // // //   },

// // // // // // // //   retryBtn: {
// // // // // // // //     backgroundColor: '#EF4444',
// // // // // // // //     paddingVertical: 10,
// // // // // // // //     paddingHorizontal: 18,
// // // // // // // //     borderRadius: 10,
// // // // // // // //     marginTop: 14,
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     gap: 6,
// // // // // // // //   },

// // // // // // // //   retryText: {
// // // // // // // //     color: '#FFFFFF',
// // // // // // // //     fontWeight: '800',
// // // // // // // //     fontSize: 12,
// // // // // // // //   },

// // // // // // // //   claimRewardBtn: {
// // // // // // // //     backgroundColor: '#10B981',
// // // // // // // //     paddingVertical: 12,
// // // // // // // //     paddingHorizontal: 20,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginTop: 14,
// // // // // // // //   },

// // // // // // // //   claimRewardText: {
// // // // // // // //     color: '#FFFFFF',
// // // // // // // //     fontWeight: '900',
// // // // // // // //     fontSize: 13,
// // // // // // // //   },
// // // // // // // // });



// // // // // // // // components/FloodRunnerGameModal.js
// // // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // // import {
// // // // // // //   View,
// // // // // // //   Text,
// // // // // // //   StyleSheet,
// // // // // // //   TouchableOpacity,
// // // // // // //   Modal,
// // // // // // //   Dimensions,
// // // // // // // } from 'react-native';
// // // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // // import * as Haptics from 'expo-haptics';
// // // // // // // import { Accelerometer } from 'expo-sensors';

// // // // // // // const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // // // // // // export default function FloodRunnerGameModal({
// // // // // // //   visible,
// // // // // // //   onClose,
// // // // // // //   onWin,
// // // // // // // }) {
// // // // // // //   const GAME_WIDTH = Math.min(SCREEN_WIDTH - 64, 360);
// // // // // // //   const GAME_HEIGHT = 300;

// // // // // // //   const PLAYER_SIZE = 36;
// // // // // // //   const DEBRIS_SIZE = 28;

// // // // // // //   const [playerPositionX, setPlayerPositionX] = useState(
// // // // // // //     GAME_WIDTH / 2 - PLAYER_SIZE / 2
// // // // // // //   );

// // // // // // //   const [debrisY, setDebrisY] = useState(-30);
// // // // // // //   const [debrisX, setDebrisX] = useState(
// // // // // // //     Math.random() * (GAME_WIDTH - DEBRIS_SIZE)
// // // // // // //   );

// // // // // // //   const [score, setScore] = useState(0);
// // // // // // //   const [gameOver, setGameOver] = useState(false);
// // // // // // //   const [hasWon, setHasWon] = useState(false);
// // // // // // //   const [sensorAvailable, setSensorAvailable] = useState(false);

// // // // // // //   const movementRef = useRef(0);

// // // // // // //   /*
// // // // // // //    * ---------------------------------------------------------
// // // // // // //    * ACCELEROMETER
// // // // // // //    * ---------------------------------------------------------
// // // // // // //    */

// // // // // // //   useEffect(() => {
// // // // // // //     let subscription;

// // // // // // //     const setupAccelerometer = async () => {
// // // // // // //       if (!visible || gameOver || hasWon) {
// // // // // // //         return;
// // // // // // //       }

// // // // // // //       try {
// // // // // // //         const available = await Accelerometer.isAvailableAsync();

// // // // // // //         if (!available) {
// // // // // // //           setSensorAvailable(false);
// // // // // // //           return;
// // // // // // //         }

// // // // // // //         setSensorAvailable(true);

// // // // // // //         Accelerometer.setUpdateInterval(50);

// // // // // // //         subscription = Accelerometer.addListener((data) => {
// // // // // // //           /*
// // // // // // //            * data.x normally changes when the phone is tilted
// // // // // // //            * left/right.
// // // // // // //            *
// // // // // // //            * Increase this value if movement feels too slow.
// // // // // // //            */
// // // // // // //           movementRef.current = data.x;
// // // // // // //         });
// // // // // // //       } catch (error) {
// // // // // // //         console.log('Accelerometer error:', error);
// // // // // // //         setSensorAvailable(false);
// // // // // // //       }
// // // // // // //     };

// // // // // // //     setupAccelerometer();

// // // // // // //     return () => {
// // // // // // //       if (subscription) {
// // // // // // //         subscription.remove();
// // // // // // //       }
// // // // // // //     };
// // // // // // //   }, [visible, gameOver, hasWon]);

// // // // // // //   /*
// // // // // // //    * ---------------------------------------------------------
// // // // // // //    * PLAYER MOVEMENT
// // // // // // //    * ---------------------------------------------------------
// // // // // // //    */

// // // // // // //   useEffect(() => {
// // // // // // //     if (!visible || gameOver || hasWon) {
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     const movementInterval = setInterval(() => {
// // // // // // //       const tilt = movementRef.current;

// // // // // // //       if (Math.abs(tilt) < 0.05) {
// // // // // // //         return;
// // // // // // //       }

// // // // // // //       setPlayerPositionX((prevX) => {
// // // // // // //         const speed = 12;

// // // // // // //         let nextX = prevX + tilt * speed;

// // // // // // //         nextX = Math.max(
// // // // // // //           0,
// // // // // // //           Math.min(
// // // // // // //             GAME_WIDTH - PLAYER_SIZE,
// // // // // // //             nextX
// // // // // // //           )
// // // // // // //         );

// // // // // // //         return nextX;
// // // // // // //       });
// // // // // // //     }, 50);

// // // // // // //     return () => clearInterval(movementInterval);
// // // // // // //   }, [visible, gameOver, hasWon]);

// // // // // // //   /*
// // // // // // //    * ---------------------------------------------------------
// // // // // // //    * TOUCH MOVEMENT
// // // // // // //    * ---------------------------------------------------------
// // // // // // //    */

// // // // // // //   const movePlayer = (direction) => {
// // // // // // //     if (gameOver || hasWon) {
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     setPlayerPositionX((prevX) => {
// // // // // // //       const amount = 35;

// // // // // // //       let nextX =
// // // // // // //         direction === 'left'
// // // // // // //           ? prevX - amount
// // // // // // //           : prevX + amount;

// // // // // // //       nextX = Math.max(
// // // // // // //         0,
// // // // // // //         Math.min(
// // // // // // //           GAME_WIDTH - PLAYER_SIZE,
// // // // // // //           nextX
// // // // // // //         )
// // // // // // //       );

// // // // // // //       return nextX;
// // // // // // //     });

// // // // // // //     Haptics.impactAsync(
// // // // // // //       Haptics.ImpactFeedbackStyle.Light
// // // // // // //     );
// // // // // // //   };

// // // // // // //   /*
// // // // // // //    * ---------------------------------------------------------
// // // // // // //    * DEBRIS / GAME LOOP
// // // // // // //    * ---------------------------------------------------------
// // // // // // //    */

// // // // // // //   useEffect(() => {
// // // // // // //     if (!visible || gameOver || hasWon) {
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     const gameInterval = setInterval(() => {
// // // // // // //       setDebrisY((prevY) => {
// // // // // // //         const nextY = prevY + 6;

// // // // // // //         /*
// // // // // // //          * Debris reached bottom.
// // // // // // //          */
// // // // // // //         if (nextY > GAME_HEIGHT) {
// // // // // // //           setScore((previousScore) => {
// // // // // // //             const newScore = previousScore + 10;

// // // // // // //             if (newScore >= 50) {
// // // // // // //               setHasWon(true);

// // // // // // //               Haptics.notificationAsync(
// // // // // // //                 Haptics.NotificationFeedbackType.Success
// // // // // // //               );
// // // // // // //             }

// // // // // // //             return newScore;
// // // // // // //           });

// // // // // // //           setDebrisX(
// // // // // // //             Math.random() *
// // // // // // //               (GAME_WIDTH - DEBRIS_SIZE)
// // // // // // //           );

// // // // // // //           return -30;
// // // // // // //         }

// // // // // // //         return nextY;
// // // // // // //       });
// // // // // // //     }, 40);

// // // // // // //     return () => clearInterval(gameInterval);
// // // // // // //   }, [
// // // // // // //     visible,
// // // // // // //     gameOver,
// // // // // // //     hasWon,
// // // // // // //     GAME_WIDTH,
// // // // // // //   ]);

// // // // // // //   /*
// // // // // // //    * ---------------------------------------------------------
// // // // // // //    * COLLISION
// // // // // // //    * ---------------------------------------------------------
// // // // // // //    */

// // // // // // //   useEffect(() => {
// // // // // // //     if (gameOver || hasWon) {
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     const playerLeft = playerPositionX;
// // // // // // //     const playerRight =
// // // // // // //       playerPositionX + PLAYER_SIZE;

// // // // // // //     const playerTop =
// // // // // // //       GAME_HEIGHT - PLAYER_SIZE - 10;

// // // // // // //     const playerBottom =
// // // // // // //       playerTop + PLAYER_SIZE;

// // // // // // //     const debrisLeft = debrisX;
// // // // // // //     const debrisRight =
// // // // // // //       debrisX + DEBRIS_SIZE;

// // // // // // //     const debrisTop = debrisY;
// // // // // // //     const debrisBottom =
// // // // // // //       debrisY + DEBRIS_SIZE;

// // // // // // //     const collision =
// // // // // // //       playerLeft < debrisRight &&
// // // // // // //       playerRight > debrisLeft &&
// // // // // // //       playerTop < debrisBottom &&
// // // // // // //       playerBottom > debrisTop;

// // // // // // //     if (collision) {
// // // // // // //       setGameOver(true);

// // // // // // //       Haptics.impactAsync(
// // // // // // //         Haptics.ImpactFeedbackStyle.Heavy
// // // // // // //       );
// // // // // // //     }
// // // // // // //   }, [
// // // // // // //     debrisY,
// // // // // // //     debrisX,
// // // // // // //     playerPositionX,
// // // // // // //     gameOver,
// // // // // // //     hasWon,
// // // // // // //   ]);

// // // // // // //   /*
// // // // // // //    * ---------------------------------------------------------
// // // // // // //    * RESTART
// // // // // // //    * ---------------------------------------------------------
// // // // // // //    */

// // // // // // //   const restartGame = () => {
// // // // // // //     setScore(0);
// // // // // // //     setDebrisY(-30);
// // // // // // //     setDebrisX(
// // // // // // //       Math.random() *
// // // // // // //         (GAME_WIDTH - DEBRIS_SIZE)
// // // // // // //     );
// // // // // // //     setGameOver(false);
// // // // // // //     setHasWon(false);
// // // // // // //     setPlayerPositionX(
// // // // // // //       GAME_WIDTH / 2 -
// // // // // // //         PLAYER_SIZE / 2
// // // // // // //     );
// // // // // // //     movementRef.current = 0;
// // // // // // //   };

// // // // // // //   /*
// // // // // // //    * ---------------------------------------------------------
// // // // // // //    * RENDER
// // // // // // //    * ---------------------------------------------------------
// // // // // // //    */

// // // // // // //   return (
// // // // // // //     <Modal
// // // // // // //       visible={visible}
// // // // // // //       animationType="slide"
// // // // // // //       transparent
// // // // // // //       onRequestClose={onClose}
// // // // // // //     >
// // // // // // //       <View style={styles.modalOverlay}>
// // // // // // //         <View
// // // // // // //           style={[
// // // // // // //             styles.modalContentCard,
// // // // // // //             {
// // // // // // //               width: GAME_WIDTH + 40,
// // // // // // //             },
// // // // // // //           ]}
// // // // // // //         >
// // // // // // //           {/* HEADER */}

// // // // // // //           <View style={styles.modalHeader}>
// // // // // // //             <Text style={styles.modalTitle}>
// // // // // // //               Flash Flood Evacuation Drill
// // // // // // //             </Text>

// // // // // // //             <TouchableOpacity onPress={onClose}>
// // // // // // //               <Ionicons
// // // // // // //                 name="close-circle"
// // // // // // //                 size={28}
// // // // // // //                 color="#64748B"
// // // // // // //               />
// // // // // // //             </TouchableOpacity>
// // // // // // //           </View>

// // // // // // //           <Text style={styles.instructions}>
// // // // // // //             Tilt your phone left/right or use the
// // // // // // //             buttons below to move your responder.
// // // // // // //           </Text>

// // // // // // //           {/* SENSOR STATUS */}

// // // // // // //           <View style={styles.sensorStatus}>
// // // // // // //             <Ionicons
// // // // // // //               name={
// // // // // // //                 sensorAvailable
// // // // // // //                   ? 'phone-portrait-outline'
// // // // // // //                   : 'hand-left-outline'
// // // // // // //               }
// // // // // // //               size={14}
// // // // // // //               color={
// // // // // // //                 sensorAvailable
// // // // // // //                   ? '#34D399'
// // // // // // //                   : '#FBBF24'
// // // // // // //               }
// // // // // // //             />

// // // // // // //             <Text
// // // // // // //               style={[
// // // // // // //                 styles.sensorText,
// // // // // // //                 {
// // // // // // //                   color: sensorAvailable
// // // // // // //                     ? '#34D399'
// // // // // // //                     : '#FBBF24',
// // // // // // //                 },
// // // // // // //               ]}
// // // // // // //             >
// // // // // // //               {sensorAvailable
// // // // // // //                 ? 'Tilt controls active'
// // // // // // //                 : 'Use touch controls'}
// // // // // // //             </Text>
// // // // // // //           </View>

// // // // // // //           {/* GAME */}

// // // // // // //           <View
// // // // // // //             style={[
// // // // // // //               styles.gameCanvas,
// // // // // // //               {
// // // // // // //                 width: GAME_WIDTH,
// // // // // // //                 height: GAME_HEIGHT,
// // // // // // //               },
// // // // // // //             ]}
// // // // // // //           >
// // // // // // //             {/* SHELTER */}

// // // // // // //             <View style={styles.shelterLine}>
// // // // // // //               <Ionicons
// // // // // // //                 name="shield-checkmark"
// // // // // // //                 size={14}
// // // // // // //                 color="#34D399"
// // // // // // //               />

// // // // // // //               <Text style={styles.shelterLineText}>
// // // // // // //                 SAFE ELEVATED SHELTER
// // // // // // //               </Text>
// // // // // // //             </View>

// // // // // // //             {/* WATER */}

// // // // // // //             <View style={styles.waterLayer}>
// // // // // // //               <Text style={styles.waterText}>
// // // // // // //                 FLOOD ZONE
// // // // // // //               </Text>
// // // // // // //             </View>

// // // // // // //             {/* DEBRIS */}

// // // // // // //             {!gameOver && !hasWon && (
// // // // // // //               <View
// // // // // // //                 style={[
// // // // // // //                   styles.debrisNode,
// // // // // // //                   {
// // // // // // //                     left: debrisX,
// // // // // // //                     top: debrisY,
// // // // // // //                   },
// // // // // // //                 ]}
// // // // // // //               >
// // // // // // //                 <Ionicons
// // // // // // //                   name="warning"
// // // // // // //                   size={22}
// // // // // // //                   color="#EF4444"
// // // // // // //                 />
// // // // // // //               </View>
// // // // // // //             )}

// // // // // // //             {/* PLAYER */}

// // // // // // //             {!gameOver && !hasWon && (
// // // // // // //               <View
// // // // // // //                 style={[
// // // // // // //                   styles.playerNode,
// // // // // // //                   {
// // // // // // //                     left: playerPositionX,
// // // // // // //                     bottom: 10,
// // // // // // //                   },
// // // // // // //                 ]}
// // // // // // //               >
// // // // // // //                 <Ionicons
// // // // // // //                   name="person"
// // // // // // //                   size={25}
// // // // // // //                   color="#FFFFFF"
// // // // // // //                 />
// // // // // // //               </View>
// // // // // // //             )}

// // // // // // //             {/* END SCREEN */}

// // // // // // //             {(gameOver || hasWon) && (
// // // // // // //               <View style={styles.endGameOverlay}>
// // // // // // //                 {gameOver && (
// // // // // // //                   <>
// // // // // // //                     <Ionicons
// // // // // // //                       name="water"
// // // // // // //                       size={36}
// // // // // // //                       color="#EF4444"
// // // // // // //                     />

// // // // // // //                     <Text style={styles.gameOverTitle}>
// // // // // // //                       Trapped by Water!
// // // // // // //                     </Text>

// // // // // // //                     <Text style={styles.gameOverText}>
// // // // // // //                       Avoid the falling debris and
// // // // // // //                       reach the safe area.
// // // // // // //                     </Text>

// // // // // // //                     <TouchableOpacity
// // // // // // //                       style={styles.retryBtn}
// // // // // // //                       onPress={restartGame}
// // // // // // //                     >
// // // // // // //                       <Text style={styles.buttonText}>
// // // // // // //                         Retry Drill
// // // // // // //                       </Text>
// // // // // // //                     </TouchableOpacity>
// // // // // // //                   </>
// // // // // // //                 )}

// // // // // // //                 {hasWon && (
// // // // // // //                   <>
// // // // // // //                     <Ionicons
// // // // // // //                       name="shield-checkmark"
// // // // // // //                       size={40}
// // // // // // //                       color="#10B981"
// // // // // // //                     />

// // // // // // //                     <Text
// // // // // // //                       style={styles.successTitle}
// // // // // // //                     >
// // // // // // //                       Reached High Ground!
// // // // // // //                     </Text>

// // // // // // //                     <Text
// // // // // // //                       style={styles.gameOverText}
// // // // // // //                     >
// // // // // // //                       Excellent evacuation response.
// // // // // // //                     </Text>

// // // // // // //                     <TouchableOpacity
// // // // // // //                       style={styles.claimRewardBtn}
// // // // // // //                       onPress={() => {
// // // // // // //                         onWin({
// // // // // // //                           xp: 100,
// // // // // // //                           coins: 25,
// // // // // // //                         });

// // // // // // //                         onClose();
// // // // // // //                       }}
// // // // // // //                     >
// // // // // // //                       <Text
// // // // // // //                         style={styles.buttonText}
// // // // // // //                       >
// // // // // // //                         Claim +100 XP & +25 Coins
// // // // // // //                       </Text>
// // // // // // //                     </TouchableOpacity>
// // // // // // //                   </>
// // // // // // //                 )}
// // // // // // //               </View>
// // // // // // //             )}
// // // // // // //           </View>

// // // // // // //           {/* SCORE */}

// // // // // // //           <View style={styles.gameHud}>
// // // // // // //             <Text style={styles.scoreText}>
// // // // // // //               EVACUATION SCORE
// // // // // // //             </Text>

// // // // // // //             <Text style={styles.scoreValue}>
// // // // // // //               {score} / 50
// // // // // // //             </Text>
// // // // // // //           </View>

// // // // // // //           {/* CONTROLS */}

// // // // // // //           {!gameOver && !hasWon && (
// // // // // // //             <View style={styles.controls}>
// // // // // // //               <TouchableOpacity
// // // // // // //                 style={styles.controlButton}
// // // // // // //                 onPress={() =>
// // // // // // //                   movePlayer('left')
// // // // // // //                 }
// // // // // // //                 activeOpacity={0.7}
// // // // // // //               >
// // // // // // //                 <Ionicons
// // // // // // //                   name="arrow-back"
// // // // // // //                   size={28}
// // // // // // //                   color="#FFFFFF"
// // // // // // //                 />

// // // // // // //                 <Text style={styles.controlText}>
// // // // // // //                   LEFT
// // // // // // //                 </Text>
// // // // // // //               </TouchableOpacity>

// // // // // // //               <View style={styles.controlHint}>
// // // // // // //                 <Ionicons
// // // // // // //                   name="phone-portrait-outline"
// // // // // // //                   size={20}
// // // // // // //                   color="#38BDF8"
// // // // // // //                 />

// // // // // // //                 <Text style={styles.controlHintText}>
// // // // // // //                   TILT
// // // // // // //                 </Text>
// // // // // // //               </View>

// // // // // // //               <TouchableOpacity
// // // // // // //                 style={styles.controlButton}
// // // // // // //                 onPress={() =>
// // // // // // //                   movePlayer('right')
// // // // // // //                 }
// // // // // // //                 activeOpacity={0.7}
// // // // // // //               >
// // // // // // //                 <Ionicons
// // // // // // //                   name="arrow-forward"
// // // // // // //                   size={28}
// // // // // // //                   color="#FFFFFF"
// // // // // // //                 />

// // // // // // //                 <Text style={styles.controlText}>
// // // // // // //                   RIGHT
// // // // // // //                 </Text>
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>
// // // // // // //           )}
// // // // // // //         </View>
// // // // // // //       </View>
// // // // // // //     </Modal>
// // // // // // //   );
// // // // // // // }

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   modalOverlay: {
// // // // // // //     flex: 1,
// // // // // // //     backgroundColor: 'rgba(2, 6, 23, 0.9)',
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //     padding: 16,
// // // // // // //   },

// // // // // // //   modalContentCard: {
// // // // // // //     backgroundColor: '#0F172A',
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#1E293B',
// // // // // // //     borderRadius: 20,
// // // // // // //     padding: 20,
// // // // // // //     maxWidth: 400,
// // // // // // //   },

// // // // // // //   modalHeader: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginBottom: 8,
// // // // // // //   },

// // // // // // //   modalTitle: {
// // // // // // //     color: '#FFFFFF',
// // // // // // //     fontSize: 17,
// // // // // // //     fontWeight: '900',
// // // // // // //     flex: 1,
// // // // // // //     marginRight: 10,
// // // // // // //   },

// // // // // // //   instructions: {
// // // // // // //     color: '#94A3B8',
// // // // // // //     fontSize: 12,
// // // // // // //     lineHeight: 18,
// // // // // // //     marginBottom: 10,
// // // // // // //   },

// // // // // // //   sensorStatus: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     alignSelf: 'flex-start',
// // // // // // //     gap: 6,
// // // // // // //     marginBottom: 10,
// // // // // // //     backgroundColor: '#020617',
// // // // // // //     paddingHorizontal: 9,
// // // // // // //     paddingVertical: 5,
// // // // // // //     borderRadius: 8,
// // // // // // //   },

// // // // // // //   sensorText: {
// // // // // // //     fontSize: 10,
// // // // // // //     fontWeight: '800',
// // // // // // //   },

// // // // // // //   gameCanvas: {
// // // // // // //     backgroundColor: '#020617',
// // // // // // //     borderRadius: 14,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#1E293B',
// // // // // // //     position: 'relative',
// // // // // // //     overflow: 'hidden',
// // // // // // //   },

// // // // // // //   waterLayer: {
// // // // // // //     position: 'absolute',
// // // // // // //     bottom: 0,
// // // // // // //     left: 0,
// // // // // // //     right: 0,
// // // // // // //     height: 55,
// // // // // // //     backgroundColor: '#0C4A6E',
// // // // // // //     opacity: 0.35,
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //   },

// // // // // // //   waterText: {
// // // // // // //     color: '#38BDF8',
// // // // // // //     fontSize: 9,
// // // // // // //     fontWeight: '900',
// // // // // // //     letterSpacing: 2,
// // // // // // //   },

// // // // // // //   shelterLine: {
// // // // // // //     position: 'absolute',
// // // // // // //     top: 0,
// // // // // // //     left: 0,
// // // // // // //     right: 0,
// // // // // // //     height: 38,
// // // // // // //     backgroundColor: '#064E3B',
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#10B981',
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //     gap: 6,
// // // // // // //     zIndex: 2,
// // // // // // //   },

// // // // // // //   shelterLineText: {
// // // // // // //     color: '#34D399',
// // // // // // //     fontSize: 9,
// // // // // // //     fontWeight: '900',
// // // // // // //   },

// // // // // // //   playerNode: {
// // // // // // //     position: 'absolute',
// // // // // // //     width: 36,
// // // // // // //     height: 36,
// // // // // // //     borderRadius: 18,
// // // // // // //     backgroundColor: '#2563EB',
// // // // // // //     borderWidth: 2,
// // // // // // //     borderColor: '#60A5FA',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //     zIndex: 3,
// // // // // // //   },

// // // // // // //   debrisNode: {
// // // // // // //     position: 'absolute',
// // // // // // //     width: 28,
// // // // // // //     height: 28,
// // // // // // //     borderRadius: 14,
// // // // // // //     backgroundColor: '#450A0A',
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#EF4444',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //     zIndex: 3,
// // // // // // //   },

// // // // // // //   gameHud: {
// // // // // // //     marginTop: 12,
// // // // // // //     alignItems: 'center',
// // // // // // //   },

// // // // // // //   scoreText: {
// // // // // // //     color: '#64748B',
// // // // // // //     fontSize: 9,
// // // // // // //     fontWeight: '900',
// // // // // // //     letterSpacing: 1,
// // // // // // //   },

// // // // // // //   scoreValue: {
// // // // // // //     color: '#FFFFFF',
// // // // // // //     fontSize: 22,
// // // // // // //     fontWeight: '900',
// // // // // // //     marginTop: 2,
// // // // // // //   },

// // // // // // //   controls: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     marginTop: 14,
// // // // // // //     gap: 10,
// // // // // // //   },

// // // // // // //   controlButton: {
// // // // // // //     width: 90,
// // // // // // //     height: 58,
// // // // // // //     backgroundColor: '#1E3A8A',
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#3B82F6',
// // // // // // //     borderRadius: 14,
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //   },

// // // // // // //   controlText: {
// // // // // // //     color: '#BFDBFE',
// // // // // // //     fontSize: 8,
// // // // // // //     fontWeight: '900',
// // // // // // //     marginTop: 2,
// // // // // // //   },

// // // // // // //   controlHint: {
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //     opacity: 0.8,
// // // // // // //   },

// // // // // // //   controlHintText: {
// // // // // // //     color: '#38BDF8',
// // // // // // //     fontSize: 8,
// // // // // // //     fontWeight: '900',
// // // // // // //     marginTop: 2,
// // // // // // //   },

// // // // // // //   endGameOverlay: {
// // // // // // //     position: 'absolute',
// // // // // // //     top: 55,
// // // // // // //     bottom: 20,
// // // // // // //     left: 20,
// // // // // // //     right: 20,
// // // // // // //     backgroundColor: 'rgba(15, 23, 42, 0.96)',
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#334155',
// // // // // // //     borderRadius: 18,
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //     padding: 20,
// // // // // // //     zIndex: 10,
// // // // // // //   },

// // // // // // //   gameOverTitle: {
// // // // // // //     color: '#EF4444',
// // // // // // //     fontWeight: '900',
// // // // // // //     fontSize: 19,
// // // // // // //     marginTop: 8,
// // // // // // //   },

// // // // // // //   successTitle: {
// // // // // // //     color: '#10B981',
// // // // // // //     fontWeight: '900',
// // // // // // //     fontSize: 19,
// // // // // // //     marginTop: 8,
// // // // // // //   },

// // // // // // //   gameOverText: {
// // // // // // //     color: '#94A3B8',
// // // // // // //     fontSize: 11,
// // // // // // //     textAlign: 'center',
// // // // // // //     lineHeight: 17,
// // // // // // //     marginTop: 5,
// // // // // // //   },

// // // // // // //   retryBtn: {
// // // // // // //     backgroundColor: '#EF4444',
// // // // // // //     paddingVertical: 11,
// // // // // // //     paddingHorizontal: 20,
// // // // // // //     borderRadius: 10,
// // // // // // //     marginTop: 14,
// // // // // // //   },

// // // // // // //   claimRewardBtn: {
// // // // // // //     backgroundColor: '#10B981',
// // // // // // //     paddingVertical: 12,
// // // // // // //     paddingHorizontal: 20,
// // // // // // //     borderRadius: 12,
// // // // // // //     marginTop: 14,
// // // // // // //   },

// // // // // // //   buttonText: {
// // // // // // //     color: '#FFFFFF',
// // // // // // //     fontWeight: '900',
// // // // // // //     fontSize: 12,
// // // // // // //   },
// // // // // // // });

// // // // // // // /**
// // // // // // //  * ┌─────────────────────────┐
// // // // // // // │ 🏢  ELEVATED SHELTER    │
// // // // // // // │     🟢 SAFE ZONE        │
// // // // // // // ├─────────────────────────┤
// // // // // // // │ ~~~~~~~ 🌊 ~~~~~~~~~~~~ │
// // // // // // // │   🚗       ⚡           │
// // // // // // // │ ~~~~~~  ⚠️  ~~~~~~~~~~ │
// // // // // // // │        🧍               │
// // // // // // // │ 🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊 │
// // // // // // // │     FLOOD ZONE          │
// // // // // // // └─────────────────────────┘

// // // // // // //  */



// // // // // // import React, { useEffect, useMemo, useRef, useState } from 'react';
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   StyleSheet,
// // // // // //   TouchableOpacity,
// // // // // //   Modal,
// // // // // //   Dimensions,
// // // // // //   ScrollView,
// // // // // // } from 'react-native';

// // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // import * as Haptics from 'expo-haptics';
// // // // // // import { Accelerometer } from 'expo-sensors';

// // // // // // // Replace this import with the location of your translation hook.
// // // // // // // Example if you use react-i18next:
// // // // // // // import { useTranslation } from 'react-i18next';
// // // // // // import { useTranslation } from 'react-i18next';

// // // // // // const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
// // // // // //   Dimensions.get('window');

// // // // // // /*
// // // // // // |--------------------------------------------------------------------------
// // // // // // | LEVEL CONFIGURATION
// // // // // // |--------------------------------------------------------------------------
// // // // // // |
// // // // // // | Three levels:
// // // // // // |
// // // // // // | Level 1 = Easy
// // // // // // | Level 2 = Moderate
// // // // // // | Level 3 = Advanced
// // // // // // |
// // // // // // | The core game logic remains the same.
// // // // // // |--------------------------------------------------------------------------
// // // // // // */

// // // // // // const LEVEL_CONFIG = {
// // // // // //   1: {
// // // // // //     nameKey: 'games.floodRunner.levels.easy',
// // // // // //     targetScore: 50,

// // // // // //     debrisSpeed: 6,
// // // // // //     gameTick: 45,

// // // // // //     spawnCount: 1,

// // // // // //     playerSpeed: 35,

// // // // // //     reward: {
// // // // // //       xp: 100,
// // // // // //       coins: 25,
// // // // // //     },
// // // // // //   },

// // // // // //   2: {
// // // // // //     nameKey: 'games.floodRunner.levels.moderate',
// // // // // //     targetScore: 75,

// // // // // //     debrisSpeed: 8,
// // // // // //     gameTick: 40,

// // // // // //     spawnCount: 2,

// // // // // //     playerSpeed: 38,

// // // // // //     reward: {
// // // // // //       xp: 150,
// // // // // //       coins: 40,
// // // // // //     },
// // // // // //   },

// // // // // //   3: {
// // // // // //     nameKey: 'games.floodRunner.levels.advanced',
// // // // // //     targetScore: 100,

// // // // // //     debrisSpeed: 10,
// // // // // //     gameTick: 35,

// // // // // //     spawnCount: 3,

// // // // // //     playerSpeed: 42,

// // // // // //     reward: {
// // // // // //       xp: 200,
// // // // // //       coins: 60,
// // // // // //     },
// // // // // //   },
// // // // // // };

// // // // // // const PLAYER_SIZE = 36;
// // // // // // const DEBRIS_SIZE = 28;

// // // // // // const STARTING_DEBRIS_Y = -40;

// // // // // // export default function FloodRunnerGameModal({
// // // // // //   visible,
// // // // // //   onClose,
// // // // // //   onWin,
// // // // // //   level = 1,
// // // // // // }) {
// // // // // //   const { t } = useTranslation();

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | SAFE LEVEL
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   const selectedLevel = Math.min(
// // // // // //     3,
// // // // // //     Math.max(1, Number(level) || 1)
// // // // // //   );

// // // // // //   const config = LEVEL_CONFIG[selectedLevel];

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | GAME DIMENSIONS
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   const GAME_WIDTH = Math.min(
// // // // // //     SCREEN_WIDTH - 48,
// // // // // //     360
// // // // // //   );

// // // // // //   const GAME_HEIGHT = Math.min(
// // // // // //     SCREEN_HEIGHT * 0.43,
// // // // // //     330
// // // // // //   );

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | GAME STATE
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   const [gameStarted, setGameStarted] =
// // // // // //     useState(false);

// // // // // //   const [countdown, setCountdown] =
// // // // // //     useState(null);

// // // // // //   const [playerPositionX, setPlayerPositionX] =
// // // // // //     useState(
// // // // // //       GAME_WIDTH / 2 -
// // // // // //         PLAYER_SIZE / 2
// // // // // //     );

// // // // // //   /*
// // // // // //    * Multiple debris objects.
// // // // // //    *
// // // // // //    * Level 1 = 1
// // // // // //    * Level 2 = 2
// // // // // //    * Level 3 = 3
// // // // // //    */
// // // // // //   const [debris, setDebris] =
// // // // // //     useState([]);

// // // // // //   const [score, setScore] =
// // // // // //     useState(0);

// // // // // //   const [gameOver, setGameOver] =
// // // // // //     useState(false);

// // // // // //   const [hasWon, setHasWon] =
// // // // // //     useState(false);

// // // // // //   const [sensorAvailable, setSensorAvailable] =
// // // // // //     useState(false);

// // // // // //   const movementRef =
// // // // // //     useRef(0);

// // // // // //   const countdownTimerRef =
// // // // // //     useRef(null);

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | CREATE DEBRIS
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   const createDebris = () => {
// // // // // //     return Array.from(
// // // // // //       {
// // // // // //         length: config.spawnCount,
// // // // // //       },
// // // // // //       (_, index) => ({
// // // // // //         id: `${Date.now()}-${index}-${Math.random()}`,

// // // // // //         x:
// // // // // //           Math.random() *
// // // // // //           (GAME_WIDTH - DEBRIS_SIZE),

// // // // // //         y:
// // // // // //           STARTING_DEBRIS_Y -
// // // // // //           index * 100 -
// // // // // //           Math.random() * 80,
// // // // // //       })
// // // // // //     );
// // // // // //   };

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | RESET GAME
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   const resetGame = () => {
// // // // // //     setScore(0);

// // // // // //     setGameOver(false);

// // // // // //     setHasWon(false);

// // // // // //     setGameStarted(false);

// // // // // //     setCountdown(null);

// // // // // //     setPlayerPositionX(
// // // // // //       GAME_WIDTH / 2 -
// // // // // //         PLAYER_SIZE / 2
// // // // // //     );

// // // // // //     setDebris([]);

// // // // // //     movementRef.current = 0;
// // // // // //   };

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | START GAME
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   const startGame = () => {
// // // // // //     if (gameStarted || countdown !== null) {
// // // // // //       return;
// // // // // //     }

// // // // // //     setCountdown(3);

// // // // // //     let count = 3;

// // // // // //     countdownTimerRef.current =
// // // // // //       setInterval(() => {
// // // // // //         count -= 1;

// // // // // //         if (count <= 0) {
// // // // // //           clearInterval(
// // // // // //             countdownTimerRef.current
// // // // // //           );

// // // // // //           countdownTimerRef.current = null;

// // // // // //           setCountdown(null);

// // // // // //           setGameStarted(true);

// // // // // //           setScore(0);

// // // // // //           setGameOver(false);

// // // // // //           setHasWon(false);

// // // // // //           setPlayerPositionX(
// // // // // //             GAME_WIDTH / 2 -
// // // // // //               PLAYER_SIZE / 2
// // // // // //           );

// // // // // //           setDebris(createDebris());

// // // // // //           Haptics.notificationAsync(
// // // // // //             Haptics.NotificationFeedbackType.Success
// // // // // //           );

// // // // // //           return;
// // // // // //         }

// // // // // //         setCountdown(count);
// // // // // //       }, 700);
// // // // // //   };

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | CLEAN COUNTDOWN
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   useEffect(() => {
// // // // // //     return () => {
// // // // // //       if (countdownTimerRef.current) {
// // // // // //         clearInterval(
// // // // // //           countdownTimerRef.current
// // // // // //         );
// // // // // //       }
// // // // // //     };
// // // // // //   }, []);

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | ACCELEROMETER
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   useEffect(() => {
// // // // // //     let subscription;

// // // // // //     const setupAccelerometer = async () => {
// // // // // //       if (
// // // // // //         !visible ||
// // // // // //         !gameStarted ||
// // // // // //         gameOver ||
// // // // // //         hasWon
// // // // // //       ) {
// // // // // //         return;
// // // // // //       }

// // // // // //       try {
// // // // // //         const available =
// // // // // //           await Accelerometer.isAvailableAsync();

// // // // // //         if (!available) {
// // // // // //           setSensorAvailable(false);
// // // // // //           return;
// // // // // //         }

// // // // // //         setSensorAvailable(true);

// // // // // //         Accelerometer.setUpdateInterval(50);

// // // // // //         subscription =
// // // // // //           Accelerometer.addListener(
// // // // // //             (data) => {
// // // // // //               movementRef.current =
// // // // // //                 data.x;
// // // // // //             }
// // // // // //           );
// // // // // //       } catch (error) {
// // // // // //         console.log(
// // // // // //           'Accelerometer error:',
// // // // // //           error
// // // // // //         );

// // // // // //         setSensorAvailable(false);
// // // // // //       }
// // // // // //     };

// // // // // //     setupAccelerometer();

// // // // // //     return () => {
// // // // // //       if (subscription) {
// // // // // //         subscription.remove();
// // // // // //       }
// // // // // //     };
// // // // // //   }, [
// // // // // //     visible,
// // // // // //     gameStarted,
// // // // // //     gameOver,
// // // // // //     hasWon,
// // // // // //   ]);

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | ACCELEROMETER MOVEMENT
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   useEffect(() => {
// // // // // //     if (
// // // // // //       !visible ||
// // // // // //       !gameStarted ||
// // // // // //       gameOver ||
// // // // // //       hasWon
// // // // // //     ) {
// // // // // //       return;
// // // // // //     }

// // // // // //     const movementInterval =
// // // // // //       setInterval(() => {
// // // // // //         const tilt =
// // // // // //           movementRef.current;

// // // // // //         if (Math.abs(tilt) < 0.05) {
// // // // // //           return;
// // // // // //         }

// // // // // //         setPlayerPositionX(
// // // // // //           (previousX) => {
// // // // // //             let nextX =
// // // // // //               previousX +
// // // // // //               tilt * 12;

// // // // // //             nextX = Math.max(
// // // // // //               0,
// // // // // //               Math.min(
// // // // // //                 GAME_WIDTH -
// // // // // //                   PLAYER_SIZE,
// // // // // //                 nextX
// // // // // //               )
// // // // // //             );

// // // // // //             return nextX;
// // // // // //           }
// // // // // //         );
// // // // // //       }, 50);

// // // // // //     return () =>
// // // // // //       clearInterval(
// // // // // //         movementInterval
// // // // // //       );
// // // // // //   }, [
// // // // // //     visible,
// // // // // //     gameStarted,
// // // // // //     gameOver,
// // // // // //     hasWon,
// // // // // //     GAME_WIDTH,
// // // // // //   ]);

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | TOUCH MOVEMENT
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   const movePlayer = (direction) => {
// // // // // //     if (
// // // // // //       !gameStarted ||
// // // // // //       gameOver ||
// // // // // //       hasWon
// // // // // //     ) {
// // // // // //       return;
// // // // // //     }

// // // // // //     setPlayerPositionX(
// // // // // //       (previousX) => {
// // // // // //         const amount =
// // // // // //           config.playerSpeed;

// // // // // //         let nextX =
// // // // // //           direction === 'left'
// // // // // //             ? previousX - amount
// // // // // //             : previousX + amount;

// // // // // //         nextX = Math.max(
// // // // // //           0,
// // // // // //           Math.min(
// // // // // //             GAME_WIDTH -
// // // // // //               PLAYER_SIZE,
// // // // // //             nextX
// // // // // //           )
// // // // // //         );

// // // // // //         return nextX;
// // // // // //       }
// // // // // //     );

// // // // // //     Haptics.impactAsync(
// // // // // //       Haptics.ImpactFeedbackStyle.Light
// // // // // //     );
// // // // // //   };

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | GAME LOOP
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   useEffect(() => {
// // // // // //     if (
// // // // // //       !visible ||
// // // // // //       !gameStarted ||
// // // // // //       gameOver ||
// // // // // //       hasWon
// // // // // //     ) {
// // // // // //       return;
// // // // // //     }

// // // // // //     const gameInterval =
// // // // // //       setInterval(() => {
// // // // // //         setDebris(
// // // // // //           (previousDebris) => {
// // // // // //             let pointsEarned = 0;

// // // // // //             const updatedDebris =
// // // // // //               previousDebris.map(
// // // // // //                 (item) => ({
// // // // // //                   ...item,
// // // // // //                   y:
// // // // // //                     item.y +
// // // // // //                     config.debrisSpeed,
// // // // // //                 })
// // // // // //               );

// // // // // //             const activeDebris =
// // // // // //               updatedDebris.filter(
// // // // // //                 (item) => {
// // // // // //                   if (
// // // // // //                     item.y >
// // // // // //                     GAME_HEIGHT
// // // // // //                   ) {
// // // // // //                     pointsEarned += 10;

// // // // // //                     return false;
// // // // // //                   }

// // // // // //                   return true;
// // // // // //                 }
// // // // // //               );

// // // // // //             /*
// // // // // //              * A debris object reached the bottom.
// // // // // //              * Give the player points and respawn it.
// // // // // //              */
// // // // // //             if (pointsEarned > 0) {
// // // // // //               setScore(
// // // // // //                 (previousScore) => {
// // // // // //                   const newScore =
// // // // // //                     Math.min(
// // // // // //                       config.targetScore,
// // // // // //                       previousScore +
// // // // // //                         pointsEarned
// // // // // //                     );

// // // // // //                   if (
// // // // // //                     newScore >=
// // // // // //                     config.targetScore
// // // // // //                   ) {
// // // // // //                     setHasWon(true);

// // // // // //                     Haptics.notificationAsync(
// // // // // //                       Haptics.NotificationFeedbackType
// // // // // //                         .Success
// // // // // //                     );
// // // // // //                   }

// // // // // //                   return newScore;
// // // // // //                 }
// // // // // //               );

// // // // // //               /*
// // // // // //                * Keep the correct number
// // // // // //                * of hazards on screen.
// // // // // //                */
// // // // // //               while (
// // // // // //                 activeDebris.length <
// // // // // //                 config.spawnCount
// // // // // //               ) {
// // // // // //                 activeDebris.push({
// // // // // //                   id: `${Date.now()}-${Math.random()}`,

// // // // // //                   x:
// // // // // //                     Math.random() *
// // // // // //                     (GAME_WIDTH -
// // // // // //                       DEBRIS_SIZE),

// // // // // //                   y:
// // // // // //                     STARTING_DEBRIS_Y -
// // // // // //                     Math.random() * 80,
// // // // // //                 });
// // // // // //               }
// // // // // //             }

// // // // // //             return activeDebris;
// // // // // //           }
// // // // // //         );
// // // // // //       }, config.gameTick);

// // // // // //     return () =>
// // // // // //       clearInterval(
// // // // // //         gameInterval
// // // // // //       );
// // // // // //   }, [
// // // // // //     visible,
// // // // // //     gameStarted,
// // // // // //     gameOver,
// // // // // //     hasWon,
// // // // // //     GAME_WIDTH,
// // // // // //     GAME_HEIGHT,
// // // // // //     config,
// // // // // //   ]);

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | COLLISION
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   useEffect(() => {
// // // // // //     if (
// // // // // //       !gameStarted ||
// // // // // //       gameOver ||
// // // // // //       hasWon
// // // // // //     ) {
// // // // // //       return;
// // // // // //     }

// // // // // //     const playerLeft =
// // // // // //       playerPositionX;

// // // // // //     const playerRight =
// // // // // //       playerPositionX +
// // // // // //       PLAYER_SIZE;

// // // // // //     const playerTop =
// // // // // //       GAME_HEIGHT -
// // // // // //       PLAYER_SIZE -
// // // // // //       14;

// // // // // //     const playerBottom =
// // // // // //       playerTop +
// // // // // //       PLAYER_SIZE;

// // // // // //     const collision =
// // // // // //       debris.some((item) => {
// // // // // //         const debrisLeft =
// // // // // //           item.x;

// // // // // //         const debrisRight =
// // // // // //           item.x +
// // // // // //           DEBRIS_SIZE;

// // // // // //         const debrisTop =
// // // // // //           item.y;

// // // // // //         const debrisBottom =
// // // // // //           item.y +
// // // // // //           DEBRIS_SIZE;

// // // // // //         return (
// // // // // //           playerLeft <
// // // // // //             debrisRight &&
// // // // // //           playerRight >
// // // // // //             debrisLeft &&
// // // // // //           playerTop <
// // // // // //             debrisBottom &&
// // // // // //           playerBottom >
// // // // // //             debrisTop
// // // // // //         );
// // // // // //       });

// // // // // //     if (collision) {
// // // // // //       setGameOver(true);

// // // // // //       Haptics.impactAsync(
// // // // // //         Haptics.ImpactFeedbackStyle.Heavy
// // // // // //       );
// // // // // //     }
// // // // // //   }, [
// // // // // //     debris,
// // // // // //     playerPositionX,
// // // // // //     gameStarted,
// // // // // //     gameOver,
// // // // // //     hasWon,
// // // // // //     GAME_HEIGHT,
// // // // // //   ]);

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | CLOSE / RESET
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   const handleClose = () => {
// // // // // //     resetGame();
// // // // // //     onClose();
// // // // // //   };

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | CLAIM REWARD
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   const handleClaimReward = () => {
// // // // // //     onWin({
// // // // // //       xp: config.reward.xp,
// // // // // //       coins: config.reward.coins,
// // // // // //     });

// // // // // //     handleClose();
// // // // // //   };

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | GAME PROGRESS
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   const progressPercentage =
// // // // // //     Math.min(
// // // // // //       100,
// // // // // //       (score /
// // // // // //         config.targetScore) *
// // // // // //         100
// // // // // //     );

// // // // // //   /*
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   | RENDER
// // // // // //   |--------------------------------------------------------------------------
// // // // // //   */

// // // // // //   return (
// // // // // //     <Modal
// // // // // //       visible={visible}
// // // // // //       animationType="slide"
// // // // // //       transparent
// // // // // //       onRequestClose={handleClose}
// // // // // //     >
// // // // // //       <View style={styles.modalOverlay}>
// // // // // //         <View
// // // // // //           style={[
// // // // // //             styles.modalContentCard,
// // // // // //             {
// // // // // //               width:
// // // // // //                 GAME_WIDTH + 32,
// // // // // //             },
// // // // // //           ]}
// // // // // //         >
// // // // // //           {/* -------------------------------------------------------
// // // // // //               HEADER
// // // // // //           -------------------------------------------------------- */}

// // // // // //           <View style={styles.modalHeader}>
// // // // // //             <View style={styles.headerTitleArea}>
// // // // // //               <View style={styles.headerIcon}>
// // // // // //                 <Ionicons
// // // // // //                   name="water"
// // // // // //                   size={20}
// // // // // //                   color="#38BDF8"
// // // // // //                 />
// // // // // //               </View>

// // // // // //               <View style={styles.headerTextArea}>
// // // // // //                 <Text
// // // // // //                   style={styles.modalTitle}
// // // // // //                 >
// // // // // //                   {t(
// // // // // //                     'games.floodRunner.title'
// // // // // //                   )}
// // // // // //                 </Text>

// // // // // //                 <Text
// // // // // //                   style={styles.levelLabel}
// // // // // //                 >
// // // // // //                   {t(
// // // // // //                     'games.floodRunner.level',
// // // // // //                     {
// // // // // //                       level:
// // // // // //                         selectedLevel,
// // // // // //                     }
// // // // // //                   )}{' '}
// // // // // //                   •{' '}
// // // // // //                   {t(
// // // // // //                     config.nameKey
// // // // // //                   )}
// // // // // //                 </Text>
// // // // // //               </View>
// // // // // //             </View>

// // // // // //             <TouchableOpacity
// // // // // //               onPress={handleClose}
// // // // // //               accessibilityRole="button"
// // // // // //               accessibilityLabel={t(
// // // // // //                 'common.close'
// // // // // //               )}
// // // // // //             >
// // // // // //               <Ionicons
// // // // // //                 name="close-circle"
// // // // // //                 size={30}
// // // // // //                 color="#64748B"
// // // // // //               />
// // // // // //             </TouchableOpacity>
// // // // // //           </View>

// // // // // //           {/* -------------------------------------------------------
// // // // // //               OBJECTIVE
// // // // // //           -------------------------------------------------------- */}

// // // // // //           <View style={styles.objectiveCard}>
// // // // // //             <View style={styles.objectiveIcon}>
// // // // // //               <Ionicons
// // // // // //                 name="flag"
// // // // // //                 size={18}
// // // // // //                 color="#34D399"
// // // // // //               />
// // // // // //             </View>

// // // // // //             <View style={styles.objectiveTextArea}>
// // // // // //               <Text
// // // // // //                 style={styles.objectiveTitle}
// // // // // //               >
// // // // // //                 {t(
// // // // // //                   'games.floodRunner.objective'
// // // // // //                 )}
// // // // // //               </Text>

// // // // // //               <Text
// // // // // //                 style={styles.objectiveText}
// // // // // //               >
// // // // // //                 {t(
// // // // // //                   'games.floodRunner.objectiveDescription'
// // // // // //                 )}
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           {/* -------------------------------------------------------
// // // // // //               HOW TO PLAY
// // // // // //           -------------------------------------------------------- */}

// // // // // //           {!gameStarted &&
// // // // // //             !gameOver &&
// // // // // //             !hasWon && (
// // // // // //               <View
// // // // // //                 style={
// // // // // //                   styles.instructionsCard
// // // // // //                 }
// // // // // //               >
// // // // // //                 <View
// // // // // //                   style={
// // // // // //                     styles.instructionsHeader
// // // // // //                   }
// // // // // //                 >
// // // // // //                   <Ionicons
// // // // // //                     name="help-circle"
// // // // // //                     size={20}
// // // // // //                     color="#FBBF24"
// // // // // //                   />

// // // // // //                   <Text
// // // // // //                     style={
// // // // // //                       styles.instructionsTitle
// // // // // //                     }
// // // // // //                   >
// // // // // //                     {t(
// // // // // //                       'games.floodRunner.howToPlay'
// // // // // //                     )}
// // // // // //                   </Text>
// // // // // //                 </View>

// // // // // //                 <InstructionRow
// // // // // //                   icon="swap-horizontal"
// // // // // //                   text={t(
// // // // // //                     'games.floodRunner.instructions.move'
// // // // // //                   )}
// // // // // //                 />

// // // // // //                 <InstructionRow
// // // // // //                   icon="warning"
// // // // // //                   text={t(
// // // // // //                     'games.floodRunner.instructions.avoid'
// // // // // //                   )}
// // // // // //                 />

// // // // // //                 <InstructionRow
// // // // // //                   icon="water"
// // // // // //                   text={t(
// // // // // //                     'games.floodRunner.instructions.flood'
// // // // // //                   )}
// // // // // //                 />

// // // // // //                 <InstructionRow
// // // // // //                   icon="flag"
// // // // // //                   text={t(
// // // // // //                     'games.floodRunner.instructions.finish',
// // // // // //                     {
// // // // // //                       score:
// // // // // //                         config.targetScore,
// // // // // //                     }
// // // // // //                   )}
// // // // // //                 />
// // // // // //               </View>
// // // // // //             )}

// // // // // //           {/* -------------------------------------------------------
// // // // // //               SENSOR STATUS
// // // // // //           -------------------------------------------------------- */}

// // // // // //           {gameStarted &&
// // // // // //             !gameOver &&
// // // // // //             !hasWon && (
// // // // // //               <View
// // // // // //                 style={styles.sensorStatus}
// // // // // //               >
// // // // // //                 <Ionicons
// // // // // //                   name={
// // // // // //                     sensorAvailable
// // // // // //                       ? 'phone-portrait-outline'
// // // // // //                       : 'hand-left-outline'
// // // // // //                   }
// // // // // //                   size={15}
// // // // // //                   color={
// // // // // //                     sensorAvailable
// // // // // //                       ? '#34D399'
// // // // // //                       : '#FBBF24'
// // // // // //                   }
// // // // // //                 />

// // // // // //                 <Text
// // // // // //                   style={[
// // // // // //                     styles.sensorText,
// // // // // //                     {
// // // // // //                       color:
// // // // // //                         sensorAvailable
// // // // // //                           ? '#34D399'
// // // // // //                           : '#FBBF24',
// // // // // //                     },
// // // // // //                   ]}
// // // // // //                 >
// // // // // //                   {sensorAvailable
// // // // // //                     ? t(
// // // // // //                         'games.floodRunner.tiltActive'
// // // // // //                       )
// // // // // //                     : t(
// // // // // //                         'games.floodRunner.touchActive'
// // // // // //                       )}
// // // // // //                 </Text>
// // // // // //               </View>
// // // // // //             )}

// // // // // //           {/* -------------------------------------------------------
// // // // // //               GAME CANVAS
// // // // // //           -------------------------------------------------------- */}

// // // // // //           <View
// // // // // //             style={[
// // // // // //               styles.gameCanvas,
// // // // // //               {
// // // // // //                 width: GAME_WIDTH,
// // // // // //                 height: GAME_HEIGHT,
// // // // // //               },
// // // // // //             ]}
// // // // // //           >
// // // // // //             {/* SAFE ZONE */}

// // // // // //             <View
// // // // // //               style={styles.safeZone}
// // // // // //             >
// // // // // //               <View
// // // // // //                 style={styles.safeZoneIcon}
// // // // // //               >
// // // // // //                 <Ionicons
// // // // // //                   name="shield-checkmark"
// // // // // //                   size={18}
// // // // // //                   color="#34D399"
// // // // // //                 />
// // // // // //               </View>

// // // // // //               <View>
// // // // // //                 <Text
// // // // // //                   style={
// // // // // //                     styles.safeZoneTitle
// // // // // //                   }
// // // // // //                 >
// // // // // //                   {t(
// // // // // //                     'games.floodRunner.safeShelter'
// // // // // //                   )}
// // // // // //                 </Text>

// // // // // //                 <Text
// // // // // //                   style={
// // // // // //                     styles.safeZoneSub
// // // // // //                   }
// // // // // //                 >
// // // // // //                   {t(
// // // // // //                     'games.floodRunner.highGround'
// // // // // //                   )}
// // // // // //                 </Text>
// // // // // //               </View>
// // // // // //             </View>

// // // // // //             {/* DANGER FIELD */}

// // // // // //             <View
// // // // // //               style={styles.dangerField}
// // // // // //             >
// // // // // //               <View
// // // // // //                 style={styles.routeLine}
// // // // // //               />

// // // // // //               <Text
// // // // // //                 style={styles.dangerText}
// // // // // //               >
// // // // // //                 {t(
// // // // // //                   'games.floodRunner.evacuationRoute'
// // // // // //                 )}
// // // // // //               </Text>
// // // // // //             </View>

// // // // // //             {/* DEBRIS */}

// // // // // //             {gameStarted &&
// // // // // //               !gameOver &&
// // // // // //               !hasWon &&
// // // // // //               debris.map((item) => (
// // // // // //                 <View
// // // // // //                   key={item.id}
// // // // // //                   style={[
// // // // // //                     styles.debrisNode,
// // // // // //                     {
// // // // // //                       left: item.x,
// // // // // //                       top: item.y,
// // // // // //                     },
// // // // // //                   ]}
// // // // // //                 >
// // // // // //                   <Ionicons
// // // // // //                     name="warning"
// // // // // //                     size={20}
// // // // // //                     color="#FCA5A5"
// // // // // //                   />
// // // // // //                 </View>
// // // // // //               ))}

// // // // // //             {/* PLAYER */}

// // // // // //             {gameStarted &&
// // // // // //               !gameOver &&
// // // // // //               !hasWon && (
// // // // // //                 <View
// // // // // //                   style={[
// // // // // //                     styles.playerNode,
// // // // // //                     {
// // // // // //                       left:
// // // // // //                         playerPositionX,
// // // // // //                       bottom: 72,
// // // // // //                     },
// // // // // //                   ]}
// // // // // //                 >
// // // // // //                   <Ionicons
// // // // // //                     name="person"
// // // // // //                     size={25}
// // // // // //                     color="#FFFFFF"
// // // // // //                   />
// // // // // //                 </View>
// // // // // //               )}

// // // // // //             {/* FLOOD */}

// // // // // //             <View
// // // // // //               style={styles.floodLayer}
// // // // // //             >
// // // // // //               <View
// // // // // //                 style={
// // // // // //                   styles.waveContainer
// // // // // //                 }
// // // // // //               >
// // // // // //                 {Array.from({
// // // // // //                   length: 12,
// // // // // //                 }).map((_, index) => (
// // // // // //                   <Text
// // // // // //                     key={index}
// // // // // //                     style={
// // // // // //                       styles.wave
// // // // // //                     }
// // // // // //                   >
// // // // // //                     ~
// // // // // //                   </Text>
// // // // // //                 ))}
// // // // // //               </View>

// // // // // //               <Text
// // // // // //                 style={styles.floodLabel}
// // // // // //               >
// // // // // //                 {t(
// // // // // //                   'games.floodRunner.floodZone'
// // // // // //                 )}
// // // // // //               </Text>
// // // // // //             </View>

// // // // // //             {/* COUNTDOWN */}

// // // // // //             {countdown !== null && (
// // // // // //               <View
// // // // // //                 style={
// // // // // //                   styles.countdownOverlay
// // // // // //                 }
// // // // // //               >
// // // // // //                 <Text
// // // // // //                   style={
// // // // // //                     styles.countdownNumber
// // // // // //                   }
// // // // // //                 >
// // // // // //                   {countdown}
// // // // // //                 </Text>

// // // // // //                 <Text
// // // // // //                   style={
// // // // // //                     styles.countdownText
// // // // // //                   }
// // // // // //                 >
// // // // // //                   {t(
// // // // // //                     'games.floodRunner.getReady'
// // // // // //                   )}
// // // // // //                 </Text>
// // // // // //               </View>
// // // // // //             )}

// // // // // //             {/* START SCREEN */}

// // // // // //             {!gameStarted &&
// // // // // //               countdown === null &&
// // // // // //               !gameOver &&
// // // // // //               !hasWon && (
// // // // // //                 <View
// // // // // //                   style={
// // // // // //                     styles.startOverlay
// // // // // //                   }
// // // // // //                 >
// // // // // //                   <View
// // // // // //                     style={
// // // // // //                       styles.startIcon
// // // // // //                     }
// // // // // //                   >
// // // // // //                     <Ionicons
// // // // // //                       name="walk"
// // // // // //                       size={34}
// // // // // //                       color="#38BDF8"
// // // // // //                     />
// // // // // //                   </View>

// // // // // //                   <Text
// // // // // //                     style={
// // // // // //                       styles.startTitle
// // // // // //                     }
// // // // // //                   >
// // // // // //                     {t(
// // // // // //                       'games.floodRunner.ready'
// // // // // //                     )}
// // // // // //                   </Text>

// // // // // //                   <Text
// // // // // //                     style={
// // // // // //                       styles.startDescription
// // // // // //                     }
// // // // // //                   >
// // // // // //                     {t(
// // // // // //                       'games.floodRunner.startDescription'
// // // // // //                     )}
// // // // // //                   </Text>

// // // // // //                   <TouchableOpacity
// // // // // //                     style={
// // // // // //                       styles.startButton
// // // // // //                     }
// // // // // //                     onPress={startGame}
// // // // // //                     activeOpacity={0.8}
// // // // // //                   >
// // // // // //                     <Ionicons
// // // // // //                       name="play"
// // // // // //                       size={18}
// // // // // //                       color="#FFFFFF"
// // // // // //                     />

// // // // // //                     <Text
// // // // // //                       style={
// // // // // //                         styles.startButtonText
// // // // // //                       }
// // // // // //                     >
// // // // // //                       {t(
// // // // // //                         'games.floodRunner.start'
// // // // // //                       )}
// // // // // //                     </Text>
// // // // // //                   </TouchableOpacity>
// // // // // //                 </View>
// // // // // //               )}

// // // // // //             {/* GAME OVER */}

// // // // // //             {gameOver && (
// // // // // //               <View
// // // // // //                 style={
// // // // // //                   styles.endGameOverlay
// // // // // //                 }
// // // // // //               >
// // // // // //                 <View
// // // // // //                   style={[
// // // // // //                     styles.resultIcon,
// // // // // //                     {
// // // // // //                       backgroundColor:
// // // // // //                         '#450A0A',
// // // // // //                     },
// // // // // //                   ]}
// // // // // //                 >
// // // // // //                   <Ionicons
// // // // // //                     name="warning"
// // // // // //                     size={34}
// // // // // //                     color="#EF4444"
// // // // // //                   />
// // // // // //                 </View>

// // // // // //                 <Text
// // // // // //                   style={
// // // // // //                     styles.gameOverTitle
// // // // // //                   }
// // // // // //                 >
// // // // // //                   {t(
// // // // // //                     'games.floodRunner.failed'
// // // // // //                   )}
// // // // // //                 </Text>

// // // // // //                 <Text
// // // // // //                   style={
// // // // // //                     styles.gameOverText
// // // // // //                   }
// // // // // //                 >
// // // // // //                   {t(
// // // // // //                     'games.floodRunner.failedDescription'
// // // // // //                   )}
// // // // // //                 </Text>

// // // // // //                 <Text
// // // // // //                   style={
// // // // // //                     styles.finalScore
// // // // // //                   }
// // // // // //                 >
// // // // // //                   {score} /{' '}
// // // // // //                   {config.targetScore}
// // // // // //                 </Text>

// // // // // //                 <TouchableOpacity
// // // // // //                   style={
// // // // // //                     styles.retryButton
// // // // // //                   }
// // // // // //                   onPress={startGame}
// // // // // //                 >
// // // // // //                   <Ionicons
// // // // // //                     name="refresh"
// // // // // //                     size={18}
// // // // // //                     color="#FFFFFF"
// // // // // //                   />

// // // // // //                   <Text
// // // // // //                     style={
// // // // // //                       styles.buttonText
// // // // // //                     }
// // // // // //                   >
// // // // // //                     {t(
// // // // // //                       'games.floodRunner.retry'
// // // // // //                     )}
// // // // // //                   </Text>
// // // // // //                 </TouchableOpacity>
// // // // // //               </View>
// // // // // //             )}

// // // // // //             {/* WIN */}

// // // // // //             {hasWon && (
// // // // // //               <View
// // // // // //                 style={
// // // // // //                   styles.endGameOverlay
// // // // // //                 }
// // // // // //               >
// // // // // //                 <View
// // // // // //                   style={[
// // // // // //                     styles.resultIcon,
// // // // // //                     {
// // // // // //                       backgroundColor:
// // // // // //                         '#064E3B',
// // // // // //                     },
// // // // // //                   ]}
// // // // // //                 >
// // // // // //                   <Ionicons
// // // // // //                     name="shield-checkmark"
// // // // // //                     size={36}
// // // // // //                     color="#10B981"
// // // // // //                   />
// // // // // //                 </View>

// // // // // //                 <Text
// // // // // //                   style={
// // // // // //                     styles.successTitle
// // // // // //                   }
// // // // // //                 >
// // // // // //                   {t(
// // // // // //                     'games.floodRunner.success'
// // // // // //                   )}
// // // // // //                 </Text>

// // // // // //                 <Text
// // // // // //                   style={
// // // // // //                     styles.gameOverText
// // // // // //                   }
// // // // // //                 >
// // // // // //                   {t(
// // // // // //                     'games.floodRunner.successDescription'
// // // // // //                   )}
// // // // // //                 </Text>

// // // // // //                 <View
// // // // // //                   style={
// // // // // //                     styles.rewardRow
// // // // // //                   }
// // // // // //                 >
// // // // // //                   <Reward
// // // // // //                     icon="flash"
// // // // // //                     value={`+${config.reward.xp}`}
// // // // // //                     label={t(
// // // // // //                       'games.floodRunner.xp'
// // // // // //                     )}
// // // // // //                   />

// // // // // //                   <Reward
// // // // // //                     icon="cash"
// // // // // //                     value={`+${config.reward.coins}`}
// // // // // //                     label={t(
// // // // // //                       'games.floodRunner.coins'
// // // // // //                     )}
// // // // // //                   />
// // // // // //                 </View>

// // // // // //                 <TouchableOpacity
// // // // // //                   style={
// // // // // //                     styles.claimRewardButton
// // // // // //                   }
// // // // // //                   onPress={
// // // // // //                     handleClaimReward
// // // // // //                   }
// // // // // //                 >
// // // // // //                   <Text
// // // // // //                     style={
// // // // // //                       styles.buttonText
// // // // // //                     }
// // // // // //                   >
// // // // // //                     {t(
// // // // // //                       'games.floodRunner.claimReward'
// // // // // //                     )}
// // // // // //                   </Text>
// // // // // //                 </TouchableOpacity>
// // // // // //               </View>
// // // // // //             )}
// // // // // //           </View>

// // // // // //           {/* -------------------------------------------------------
// // // // // //               SCORE
// // // // // //           -------------------------------------------------------- */}

// // // // // //           <View style={styles.gameHud}>
// // // // // //             <View
// // // // // //               style={styles.scoreHeader}
// // // // // //             >
// // // // // //               <Text
// // // // // //                 style={styles.scoreLabel}
// // // // // //               >
// // // // // //                 {t(
// // // // // //                   'games.floodRunner.score'
// // // // // //                 )}
// // // // // //               </Text>

// // // // // //               <Text
// // // // // //                 style={styles.scoreValue}
// // // // // //               >
// // // // // //                 {score} /{' '}
// // // // // //                 {config.targetScore}
// // // // // //               </Text>
// // // // // //             </View>

// // // // // //             <View
// // // // // //               style={styles.progressBackground}
// // // // // //             >
// // // // // //               <View
// // // // // //                 style={[
// // // // // //                   styles.progressFill,
// // // // // //                   {
// // // // // //                     width: `${progressPercentage}%`,
// // // // // //                   },
// // // // // //                 ]}
// // // // // //               />
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           {/* -------------------------------------------------------
// // // // // //               CONTROLS
// // // // // //           -------------------------------------------------------- */}

// // // // // //           {gameStarted &&
// // // // // //             !gameOver &&
// // // // // //             !hasWon && (
// // // // // //               <View
// // // // // //                 style={styles.controls}
// // // // // //               >
// // // // // //                 <TouchableOpacity
// // // // // //                   style={
// // // // // //                     styles.controlButton
// // // // // //                   }
// // // // // //                   onPress={() =>
// // // // // //                     movePlayer('left')
// // // // // //                   }
// // // // // //                   activeOpacity={0.7}
// // // // // //                 >
// // // // // //                   <Ionicons
// // // // // //                     name="arrow-back"
// // // // // //                     size={24}
// // // // // //                     color="#FFFFFF"
// // // // // //                   />

// // // // // //                   <Text
// // // // // //                     style={
// // // // // //                       styles.controlText
// // // // // //                     }
// // // // // //                     numberOfLines={2}
// // // // // //                   >
// // // // // //                     {t(
// // // // // //                       'games.floodRunner.left'
// // // // // //                     )}
// // // // // //                   </Text>
// // // // // //                 </TouchableOpacity>

// // // // // //                 <View
// // // // // //                   style={
// // // // // //                     styles.controlHint
// // // // // //                   }
// // // // // //                 >
// // // // // //                   <Ionicons
// // // // // //                     name={
// // // // // //                       sensorAvailable
// // // // // //                         ? 'phone-portrait-outline'
// // // // // //                         : 'hand-left-outline'
// // // // // //                     }
// // // // // //                     size={21}
// // // // // //                     color="#38BDF8"
// // // // // //                   />

// // // // // //                   <Text
// // // // // //                     style={
// // // // // //                       styles.controlHintText
// // // // // //                     }
// // // // // //                     numberOfLines={2}
// // // // // //                   >
// // // // // //                     {sensorAvailable
// // // // // //                       ? t(
// // // // // //                           'games.floodRunner.tilt'
// // // // // //                         )
// // // // // //                       : t(
// // // // // //                           'games.floodRunner.touch'
// // // // // //                         )}
// // // // // //                   </Text>
// // // // // //                 </View>

// // // // // //                 <TouchableOpacity
// // // // // //                   style={
// // // // // //                     styles.controlButton
// // // // // //                   }
// // // // // //                   onPress={() =>
// // // // // //                     movePlayer('right')
// // // // // //                   }
// // // // // //                   activeOpacity={0.7}
// // // // // //                 >
// // // // // //                   <Ionicons
// // // // // //                     name="arrow-forward"
// // // // // //                     size={24}
// // // // // //                     color="#FFFFFF"
// // // // // //                   />

// // // // // //                   <Text
// // // // // //                     style={
// // // // // //                       styles.controlText
// // // // // //                     }
// // // // // //                     numberOfLines={2}
// // // // // //                   >
// // // // // //                     {t(
// // // // // //                       'games.floodRunner.right'
// // // // // //                     )}
// // // // // //                   </Text>
// // // // // //                 </TouchableOpacity>
// // // // // //               </View>
// // // // // //             )}
// // // // // //         </View>
// // // // // //       </View>
// // // // // //     </Modal>
// // // // // //   );
// // // // // // }

// // // // // // /*
// // // // // // |--------------------------------------------------------------------------
// // // // // // | INSTRUCTION ROW
// // // // // // |--------------------------------------------------------------------------
// // // // // // */

// // // // // // function InstructionRow({
// // // // // //   icon,
// // // // // //   text,
// // // // // // }) {
// // // // // //   return (
// // // // // //     <View style={styles.instructionRow}>
// // // // // //       <View style={styles.instructionIcon}>
// // // // // //         <Ionicons
// // // // // //           name={icon}
// // // // // //           size={16}
// // // // // //           color="#38BDF8"
// // // // // //         />
// // // // // //       </View>

// // // // // //       <Text
// // // // // //         style={styles.instructionText}
// // // // // //       >
// // // // // //         {text}
// // // // // //       </Text>
// // // // // //     </View>
// // // // // //   );
// // // // // // }

// // // // // // /*
// // // // // // |--------------------------------------------------------------------------
// // // // // // | REWARD
// // // // // // |--------------------------------------------------------------------------
// // // // // // */

// // // // // // function Reward({
// // // // // //   icon,
// // // // // //   value,
// // // // // //   label,
// // // // // // }) {
// // // // // //   return (
// // // // // //     <View style={styles.reward}>
// // // // // //       <Ionicons
// // // // // //         name={icon}
// // // // // //         size={18}
// // // // // //         color="#FBBF24"
// // // // // //       />

// // // // // //       <Text style={styles.rewardValue}>
// // // // // //         {value}
// // // // // //       </Text>

// // // // // //       <Text style={styles.rewardLabel}>
// // // // // //         {label}
// // // // // //       </Text>
// // // // // //     </View>
// // // // // //   );
// // // // // // }

// // // // // // /*
// // // // // // |--------------------------------------------------------------------------
// // // // // // | STYLES
// // // // // // |--------------------------------------------------------------------------
// // // // // // */

// // // // // // const styles = StyleSheet.create({
// // // // // //   modalOverlay: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor:
// // // // // //       'rgba(2, 6, 23, 0.94)',
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     padding: 12,
// // // // // //   },

// // // // // //   modalContentCard: {
// // // // // //     backgroundColor: '#0F172A',
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#1E293B',
// // // // // //     borderRadius: 22,
// // // // // //     padding: 16,
// // // // // //     maxWidth: 400,
// // // // // //     maxHeight: '96%',
// // // // // //   },

// // // // // //   modalHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 10,
// // // // // //   },

// // // // // //   headerTitleArea: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     flex: 1,
// // // // // //     marginRight: 10,
// // // // // //   },

// // // // // //   headerIcon: {
// // // // // //     width: 38,
// // // // // //     height: 38,
// // // // // //     borderRadius: 12,
// // // // // //     backgroundColor: '#082F49',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     marginRight: 10,
// // // // // //   },

// // // // // //   headerTextArea: {
// // // // // //     flex: 1,
// // // // // //   },

// // // // // //   modalTitle: {
// // // // // //     color: '#FFFFFF',
// // // // // //     fontSize: 17,
// // // // // //     fontWeight: '900',
// // // // // //   },

// // // // // //   levelLabel: {
// // // // // //     color: '#38BDF8',
// // // // // //     fontSize: 11,
// // // // // //     fontWeight: '800',
// // // // // //     marginTop: 3,
// // // // // //   },

// // // // // //   objectiveCard: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#052E16',
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#166534',
// // // // // //     borderRadius: 13,
// // // // // //     padding: 11,
// // // // // //     marginBottom: 10,
// // // // // //   },

// // // // // //   objectiveIcon: {
// // // // // //     width: 32,
// // // // // //     height: 32,
// // // // // //     borderRadius: 10,
// // // // // //     backgroundColor: '#064E3B',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     marginRight: 10,
// // // // // //   },

// // // // // //   objectiveTextArea: {
// // // // // //     flex: 1,
// // // // // //   },

// // // // // //   objectiveTitle: {
// // // // // //     color: '#34D399',
// // // // // //     fontSize: 11,
// // // // // //     fontWeight: '900',
// // // // // //     textTransform: 'uppercase',
// // // // // //   },

// // // // // //   objectiveText: {
// // // // // //     color: '#A7F3D0',
// // // // // //     fontSize: 11,
// // // // // //     lineHeight: 16,
// // // // // //     marginTop: 2,
// // // // // //   },

// // // // // //   instructionsCard: {
// // // // // //     backgroundColor: '#111827',
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#334155',
// // // // // //     borderRadius: 14,
// // // // // //     padding: 13,
// // // // // //     marginBottom: 10,
// // // // // //   },

// // // // // //   instructionsHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 8,
// // // // // //   },

// // // // // //   instructionsTitle: {
// // // // // //     color: '#FFFFFF',
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: '900',
// // // // // //     marginLeft: 7,
// // // // // //   },

// // // // // //   instructionRow: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'flex-start',
// // // // // //     marginTop: 7,
// // // // // //   },

// // // // // //   instructionIcon: {
// // // // // //     width: 25,
// // // // // //     height: 25,
// // // // // //     borderRadius: 8,
// // // // // //     backgroundColor: '#082F49',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     marginRight: 8,
// // // // // //   },

// // // // // //   instructionText: {
// // // // // //     flex: 1,
// // // // // //     color: '#CBD5E1',
// // // // // //     fontSize: 11,
// // // // // //     lineHeight: 17,
// // // // // //     paddingTop: 3,
// // // // // //   },

// // // // // //   sensorStatus: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     alignSelf: 'flex-start',
// // // // // //     backgroundColor: '#020617',
// // // // // //     paddingHorizontal: 9,
// // // // // //     paddingVertical: 5,
// // // // // //     borderRadius: 8,
// // // // // //     marginBottom: 8,
// // // // // //   },

// // // // // //   sensorText: {
// // // // // //     fontSize: 10,
// // // // // //     fontWeight: '800',
// // // // // //     marginLeft: 6,
// // // // // //   },

// // // // // //   gameCanvas: {
// // // // // //     backgroundColor: '#020617',
// // // // // //     borderRadius: 16,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#1E293B',
// // // // // //     position: 'relative',
// // // // // //     overflow: 'hidden',
// // // // // //   },

// // // // // //   safeZone: {
// // // // // //     position: 'absolute',
// // // // // //     top: 0,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     height: 56,
// // // // // //     backgroundColor: '#064E3B',
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#10B981',
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     paddingHorizontal: 14,
// // // // // //     zIndex: 4,
// // // // // //   },

// // // // // //   safeZoneIcon: {
// // // // // //     width: 34,
// // // // // //     height: 34,
// // // // // //     borderRadius: 10,
// // // // // //     backgroundColor: '#065F46',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     marginRight: 9,
// // // // // //   },

// // // // // //   safeZoneTitle: {
// // // // // //     color: '#D1FAE5',
// // // // // //     fontSize: 11,
// // // // // //     fontWeight: '900',
// // // // // //     letterSpacing: 0.5,
// // // // // //   },

// // // // // //   safeZoneSub: {
// // // // // //     color: '#6EE7B7',
// // // // // //     fontSize: 9,
// // // // // //     fontWeight: '700',
// // // // // //     marginTop: 2,
// // // // // //   },

// // // // // //   dangerField: {
// // // // // //     position: 'absolute',
// // // // // //     top: 56,
// // // // // //     bottom: 64,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //   },

// // // // // //   routeLine: {
// // // // // //     position: 'absolute',
// // // // // //     width: 2,
// // // // // //     height: '100%',
// // // // // //     backgroundColor: '#1E293B',
// // // // // //     opacity: 0.8,
// // // // // //   },

// // // // // //   dangerText: {
// // // // // //     color: '#334155',
// // // // // //     fontSize: 8,
// // // // // //     fontWeight: '900',
// // // // // //     letterSpacing: 1.5,
// // // // // //     transform: [
// // // // // //       {
// // // // // //         rotate: '-90deg',
// // // // // //       },
// // // // // //     ],
// // // // // //   },

// // // // // //   debrisNode: {
// // // // // //     position: 'absolute',
// // // // // //     width: DEBRIS_SIZE,
// // // // // //     height: DEBRIS_SIZE,
// // // // // //     borderRadius:
// // // // // //       DEBRIS_SIZE / 2,
// // // // // //     backgroundColor: '#450A0A',
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#EF4444',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     zIndex: 5,
// // // // // //   },

// // // // // //   playerNode: {
// // // // // //     position: 'absolute',
// // // // // //     width: PLAYER_SIZE,
// // // // // //     height: PLAYER_SIZE,
// // // // // //     borderRadius:
// // // // // //       PLAYER_SIZE / 2,
// // // // // //     backgroundColor: '#2563EB',
// // // // // //     borderWidth: 2,
// // // // // //     borderColor: '#60A5FA',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     zIndex: 6,
// // // // // //   },

// // // // // //   floodLayer: {
// // // // // //     position: 'absolute',
// // // // // //     bottom: 0,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     height: 64,
// // // // // //     backgroundColor: '#075985',
// // // // // //     borderTopWidth: 1,
// // // // // //     borderTopColor: '#38BDF8',
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     zIndex: 3,
// // // // // //   },

// // // // // //   waveContainer: {
// // // // // //     position: 'absolute',
// // // // // //     top: -13,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-around',
// // // // // //   },

// // // // // //   wave: {
// // // // // //     color: '#38BDF8',
// // // // // //     fontSize: 24,
// // // // // //     fontWeight: '900',
// // // // // //   },

// // // // // //   floodLabel: {
// // // // // //     color: '#BAE6FD',
// // // // // //     fontSize: 9,
// // // // // //     fontWeight: '900',
// // // // // //     letterSpacing: 2,
// // // // // //     marginTop: 12,
// // // // // //   },

// // // // // //   startOverlay: {
// // // // // //     position: 'absolute',
// // // // // //     top: 56,
// // // // // //     bottom: 64,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     backgroundColor:
// // // // // //       'rgba(2, 6, 23, 0.94)',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     padding: 24,
// // // // // //     zIndex: 20,
// // // // // //   },

// // // // // //   startIcon: {
// // // // // //     width: 62,
// // // // // //     height: 62,
// // // // // //     borderRadius: 20,
// // // // // //     backgroundColor: '#082F49',
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#0369A1',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     marginBottom: 12,
// // // // // //   },

// // // // // //   startTitle: {
// // // // // //     color: '#FFFFFF',
// // // // // //     fontSize: 20,
// // // // // //     fontWeight: '900',
// // // // // //     textAlign: 'center',
// // // // // //   },

// // // // // //   startDescription: {
// // // // // //     color: '#94A3B8',
// // // // // //     fontSize: 12,
// // // // // //     lineHeight: 18,
// // // // // //     textAlign: 'center',
// // // // // //     marginTop: 6,
// // // // // //     maxWidth: 250,
// // // // // //   },

// // // // // //   startButton: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     backgroundColor: '#0284C7',
// // // // // //     borderRadius: 12,
// // // // // //     minHeight: 48,
// // // // // //     paddingHorizontal: 22,
// // // // // //     marginTop: 16,
// // // // // //   },

// // // // // //   startButtonText: {
// // // // // //     color: '#FFFFFF',
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: '900',
// // // // // //     marginLeft: 7,
// // // // // //   },

// // // // // //   countdownOverlay: {
// // // // // //     position: 'absolute',
// // // // // //     top: 56,
// // // // // //     bottom: 64,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     backgroundColor:
// // // // // //       'rgba(2, 6, 23, 0.85)',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     zIndex: 30,
// // // // // //   },

// // // // // //   countdownNumber: {
// // // // // //     color: '#38BDF8',
// // // // // //     fontSize: 64,
// // // // // //     fontWeight: '900',
// // // // // //   },

// // // // // //   countdownText: {
// // // // // //     color: '#CBD5E1',
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: '800',
// // // // // //     marginTop: 2,
// // // // // //   },

// // // // // //   endGameOverlay: {
// // // // // //     position: 'absolute',
// // // // // //     top: 56,
// // // // // //     bottom: 64,
// // // // // //     left: 12,
// // // // // //     right: 12,
// // // // // //     backgroundColor:
// // // // // //       'rgba(15, 23, 42, 0.97)',
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#334155',
// // // // // //     borderRadius: 18,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     padding: 20,
// // // // // //     zIndex: 30,
// // // // // //   },

// // // // // //   resultIcon: {
// // // // // //     width: 64,
// // // // // //     height: 64,
// // // // // //     borderRadius: 20,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     marginBottom: 10,
// // // // // //   },

// // // // // //   gameOverTitle: {
// // // // // //     color: '#EF4444',
// // // // // //     fontWeight: '900',
// // // // // //     fontSize: 20,
// // // // // //     textAlign: 'center',
// // // // // //   },

// // // // // //   successTitle: {
// // // // // //     color: '#10B981',
// // // // // //     fontWeight: '900',
// // // // // //     fontSize: 20,
// // // // // //     textAlign: 'center',
// // // // // //   },

// // // // // //   gameOverText: {
// // // // // //     color: '#94A3B8',
// // // // // //     fontSize: 11,
// // // // // //     textAlign: 'center',
// // // // // //     lineHeight: 17,
// // // // // //     marginTop: 7,
// // // // // //     maxWidth: 250,
// // // // // //   },

// // // // // //   finalScore: {
// // // // // //     color: '#FFFFFF',
// // // // // //     fontSize: 24,
// // // // // //     fontWeight: '900',
// // // // // //     marginTop: 12,
// // // // // //   },

// // // // // //   retryButton: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     backgroundColor: '#DC2626',
// // // // // //     minHeight: 44,
// // // // // //     paddingHorizontal: 20,
// // // // // //     borderRadius: 11,
// // // // // //     marginTop: 14,
// // // // // //   },

// // // // // //   claimRewardButton: {
// // // // // //     backgroundColor: '#059669',
// // // // // //     minHeight: 46,
// // // // // //     paddingHorizontal: 22,
// // // // // //     borderRadius: 11,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     marginTop: 14,
// // // // // //   },

// // // // // //   buttonText: {
// // // // // //     color: '#FFFFFF',
// // // // // //     fontWeight: '900',
// // // // // //     fontSize: 12,
// // // // // //   },

// // // // // //   rewardRow: {
// // // // // //     flexDirection: 'row',
// // // // // //     marginTop: 14,
// // // // // //     gap: 10,
// // // // // //   },

// // // // // //   reward: {
// // // // // //     minWidth: 78,
// // // // // //     backgroundColor: '#111827',
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#334155',
// // // // // //     borderRadius: 10,
// // // // // //     paddingVertical: 8,
// // // // // //     paddingHorizontal: 10,
// // // // // //     alignItems: 'center',
// // // // // //   },

// // // // // //   rewardValue: {
// // // // // //     color: '#FBBF24',
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '900',
// // // // // //     marginTop: 2,
// // // // // //   },

// // // // // //   rewardLabel: {
// // // // // //     color: '#64748B',
// // // // // //     fontSize: 8,
// // // // // //     fontWeight: '800',
// // // // // //     marginTop: 1,
// // // // // //   },

// // // // // //   gameHud: {
// // // // // //     marginTop: 10,
// // // // // //   },

// // // // // //   scoreHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'space-between',
// // // // // //   },

// // // // // //   scoreLabel: {
// // // // // //     color: '#64748B',
// // // // // //     fontSize: 9,
// // // // // //     fontWeight: '900',
// // // // // //     letterSpacing: 1,
// // // // // //   },

// // // // // //   scoreValue: {
// // // // // //     color: '#FFFFFF',
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '900',
// // // // // //   },

// // // // // //   progressBackground: {
// // // // // //     height: 6,
// // // // // //     width: '100%',
// // // // // //     backgroundColor: '#1E293B',
// // // // // //     borderRadius: 3,
// // // // // //     overflow: 'hidden',
// // // // // //     marginTop: 5,
// // // // // //   },

// // // // // //   progressFill: {
// // // // // //     height: '100%',
// // // // // //     backgroundColor: '#38BDF8',
// // // // // //     borderRadius: 3,
// // // // // //   },

// // // // // //   controls: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'space-between',
// // // // // //     marginTop: 11,
// // // // // //     gap: 8,
// // // // // //   },

// // // // // //   controlButton: {
// // // // // //     flex: 1,
// // // // // //     minHeight: 54,
// // // // // //     backgroundColor: '#1E3A8A',
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#3B82F6',
// // // // // //     borderRadius: 13,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     paddingHorizontal: 5,
// // // // // //   },

// // // // // //   controlText: {
// // // // // //     color: '#BFDBFE',
// // // // // //     fontSize: 8,
// // // // // //     fontWeight: '900',
// // // // // //     marginTop: 2,
// // // // // //     textAlign: 'center',
// // // // // //   },

// // // // // //   controlHint: {
// // // // // //     width: 54,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //   },

// // // // // //   controlHintText: {
// // // // // //     color: '#38BDF8',
// // // // // //     fontSize: 7,
// // // // // //     fontWeight: '900',
// // // // // //     marginTop: 3,
// // // // // //     textAlign: 'center',
// // // // // //   },
// // // // // // });


// // // // // import React, {
// // // // //   useCallback,
// // // // //   useEffect,
// // // // //   useRef,
// // // // //   useState,
// // // // // } from 'react';

// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   StyleSheet,
// // // // //   TouchableOpacity,
// // // // //   Modal,
// // // // //   Dimensions,
// // // // // } from 'react-native';

// // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // import * as Haptics from 'expo-haptics';
// // // // // import { Accelerometer } from 'expo-sensors';
// // // // // import { useTranslation } from 'react-i18next';

// // // // // const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
// // // // //   Dimensions.get('window');

// // // // // /*
// // // // // |--------------------------------------------------------------------------
// // // // // | LEVEL CONFIGURATION
// // // // // |--------------------------------------------------------------------------
// // // // // */

// // // // // const LEVEL_CONFIG = {
// // // // //   1: {
// // // // //     nameKey: 'games.floodRunner.levels.easy',
// // // // //     targetScore: 50,

// // // // //     debrisSpeed: 155,
// // // // //     spawnInterval: 1150,

// // // // //     spawnCount: 1,

// // // // //     playerSpeed: 300,

// // // // //     reward: {
// // // // //       xp: 100,
// // // // //       coins: 25,
// // // // //     },
// // // // //   },

// // // // //   2: {
// // // // //     nameKey: 'games.floodRunner.levels.moderate',
// // // // //     targetScore: 75,

// // // // //     debrisSpeed: 205,
// // // // //     spawnInterval: 900,

// // // // //     spawnCount: 2,

// // // // //     playerSpeed: 340,

// // // // //     reward: {
// // // // //       xp: 150,
// // // // //       coins: 40,
// // // // //     },
// // // // //   },

// // // // //   3: {
// // // // //     nameKey: 'games.floodRunner.levels.advanced',
// // // // //     targetScore: 100,

// // // // //     debrisSpeed: 255,
// // // // //     spawnInterval: 750,

// // // // //     spawnCount: 3,

// // // // //     playerSpeed: 380,

// // // // //     reward: {
// // // // //       xp: 200,
// // // // //       coins: 60,
// // // // //     },
// // // // //   },
// // // // // };

// // // // // const PLAYER_SIZE = 36;
// // // // // const DEBRIS_SIZE = 28;

// // // // // const SAFE_ZONE_HEIGHT = 56;
// // // // // const FLOOD_HEIGHT = 64;

// // // // // const PLAYER_BOTTOM_OFFSET = 14;

// // // // // const COLLISION_PADDING = 4;

// // // // // /*
// // // // // |--------------------------------------------------------------------------
// // // // // | COMPONENT
// // // // // |--------------------------------------------------------------------------
// // // // // */

// // // // // export default function FloodRunnerGameModal({
// // // // //   visible,
// // // // //   onClose =() => {},
// // // // //   onWin = () => {},
// // // // //   level = 1,
// // // // // }) {
// // // // //   const { t } = useTranslation();

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | SAFE LEVEL
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const selectedLevel = Math.min(
// // // // //     3,
// // // // //     Math.max(1, Number(level) || 1)
// // // // //   );

// // // // //   const config = LEVEL_CONFIG[selectedLevel];

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | GAME DIMENSIONS
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const GAME_WIDTH = Math.min(
// // // // //     SCREEN_WIDTH - 48,
// // // // //     360
// // // // //   );

// // // // //   const GAME_HEIGHT = Math.min(
// // // // //     SCREEN_HEIGHT * 0.43,
// // // // //     330
// // // // //   );

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | REACT UI STATE
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const [gameStarted, setGameStarted] =
// // // // //     useState(false);

// // // // //   const [countdown, setCountdown] =
// // // // //     useState(null);

// // // // //   const [playerPositionX, setPlayerPositionX] =
// // // // //     useState(
// // // // //       GAME_WIDTH / 2 -
// // // // //         PLAYER_SIZE / 2
// // // // //     );

// // // // //   const [debris, setDebris] =
// // // // //     useState([]);

// // // // //   const [score, setScore] =
// // // // //     useState(0);

// // // // //   const [gameOver, setGameOver] =
// // // // //     useState(false);

// // // // //   const [hasWon, setHasWon] =
// // // // //     useState(false);

// // // // //   const [sensorAvailable, setSensorAvailable] =
// // // // //     useState(false);

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | GAME REFS
// // // // //   |--------------------------------------------------------------------------
// // // // //   |
// // // // //   | The actual game state lives in refs.
// // // // //   |
// // // // //   | This prevents the game loop from being recreated
// // // // //   | every time the player moves or debris changes.
// // // // //   |
// // // // //   */

// // // // //   const playerXRef = useRef(
// // // // //     GAME_WIDTH / 2 -
// // // // //       PLAYER_SIZE / 2
// // // // //   );

// // // // //   const debrisRef = useRef([]);

// // // // //   const scoreRef = useRef(0);

// // // // //   const gameRunningRef = useRef(false);

// // // // //   const gameOverRef = useRef(false);

// // // // //   const hasWonRef = useRef(false);

// // // // //   const movementRef = useRef(0);

// // // // //   const animationFrameRef =
// // // // //     useRef(null);

// // // // //   const lastFrameTimeRef =
// // // // //     useRef(null);

// // // // //   const lastSpawnTimeRef =
// // // // //     useRef(0);

// // // // //   const countdownTimerRef =
// // // // //     useRef(null);

// // // // //   const sensorSubscriptionRef =
// // // // //     useRef(null);

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | HELPERS
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const clampPlayerX = useCallback(
// // // // //     (x) => {
// // // // //       return Math.max(
// // // // //         0,
// // // // //         Math.min(
// // // // //           GAME_WIDTH - PLAYER_SIZE,
// // // // //           x
// // // // //         )
// // // // //       );
// // // // //     },
// // // // //     [GAME_WIDTH]
// // // // //   );

// // // // //   const createDebrisObject =
// // // // //     useCallback(
// // // // //       (y = -DEBRIS_SIZE) => {
// // // // //         return {
// // // // //           id: `${Date.now()}-${Math.random()}`,

// // // // //           x:
// // // // //             Math.random() *
// // // // //             Math.max(
// // // // //               1,
// // // // //               GAME_WIDTH - DEBRIS_SIZE
// // // // //             ),

// // // // //           y,
// // // // //         };
// // // // //       },
// // // // //       [GAME_WIDTH]
// // // // //     );

// // // // //   const createInitialDebris =
// // // // //     useCallback(() => {
// // // // //       const objects = [];

// // // // //       for (
// // // // //         let index = 0;
// // // // //         index < config.spawnCount;
// // // // //         index += 1
// // // // //       ) {
// // // // //         objects.push({
// // // // //           id: `${Date.now()}-${index}-${Math.random()}`,

// // // // //           x:
// // // // //             Math.random() *
// // // // //             Math.max(
// // // // //               1,
// // // // //               GAME_WIDTH - DEBRIS_SIZE
// // // // //             ),

// // // // //           y:
// // // // //             -DEBRIS_SIZE -
// // // // //             index * 105 -
// // // // //             Math.random() * 70,
// // // // //         });
// // // // //       }

// // // // //       return objects;
// // // // //     }, [
// // // // //       config.spawnCount,
// // // // //       GAME_WIDTH,
// // // // //     ]);

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | RESET GAME
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const resetGame = useCallback(() => {
// // // // //     if (countdownTimerRef.current) {
// // // // //       clearInterval(
// // // // //         countdownTimerRef.current
// // // // //       );

// // // // //       countdownTimerRef.current = null;
// // // // //     }

// // // // //     if (animationFrameRef.current) {
// // // // //       cancelAnimationFrame(
// // // // //         animationFrameRef.current
// // // // //       );

// // // // //       animationFrameRef.current = null;
// // // // //     }

// // // // //     if (sensorSubscriptionRef.current) {
// // // // //       sensorSubscriptionRef.current.remove();

// // // // //       sensorSubscriptionRef.current = null;
// // // // //     }

// // // // //     const initialX =
// // // // //       GAME_WIDTH / 2 -
// // // // //       PLAYER_SIZE / 2;

// // // // //     playerXRef.current = initialX;

// // // // //     debrisRef.current = [];

// // // // //     scoreRef.current = 0;

// // // // //     movementRef.current = 0;

// // // // //     gameRunningRef.current = false;

// // // // //     gameOverRef.current = false;

// // // // //     hasWonRef.current = false;

// // // // //     lastFrameTimeRef.current = null;

// // // // //     lastSpawnTimeRef.current = 0;

// // // // //     setScore(0);

// // // // //     setGameOver(false);

// // // // //     setHasWon(false);

// // // // //     setGameStarted(false);

// // // // //     setCountdown(null);

// // // // //     setPlayerPositionX(initialX);

// // // // //     setDebris([]);
// // // // //   }, [GAME_WIDTH]);

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | STOP GAME
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const stopGameLoop = useCallback(() => {
// // // // //     gameRunningRef.current = false;

// // // // //     if (animationFrameRef.current) {
// // // // //       cancelAnimationFrame(
// // // // //         animationFrameRef.current
// // // // //       );

// // // // //       animationFrameRef.current = null;
// // // // //     }

// // // // //     lastFrameTimeRef.current = null;
// // // // //   }, []);

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | GAME OVER
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const finishGame = useCallback(() => {
// // // // //     if (
// // // // //       !gameRunningRef.current ||
// // // // //       gameOverRef.current ||
// // // // //       hasWonRef.current
// // // // //     ) {
// // // // //       return;
// // // // //     }

// // // // //     gameRunningRef.current = false;

// // // // //     gameOverRef.current = true;

// // // // //     setGameOver(true);

// // // // //     if (animationFrameRef.current) {
// // // // //       cancelAnimationFrame(
// // // // //         animationFrameRef.current
// // // // //       );

// // // // //       animationFrameRef.current = null;
// // // // //     }

// // // // //     Haptics.impactAsync(
// // // // //       Haptics.ImpactFeedbackStyle.Heavy
// // // // //     );
// // // // //   }, []);

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | WIN GAME
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const winGame = useCallback(() => {
// // // // //     if (
// // // // //       hasWonRef.current ||
// // // // //       gameOverRef.current
// // // // //     ) {
// // // // //       return;
// // // // //     }

// // // // //     gameRunningRef.current = false;

// // // // //     hasWonRef.current = true;

// // // // //     scoreRef.current =
// // // // //       config.targetScore;

// // // // //     setScore(config.targetScore);

// // // // //     setHasWon(true);

// // // // //     if (animationFrameRef.current) {
// // // // //       cancelAnimationFrame(
// // // // //         animationFrameRef.current
// // // // //       );

// // // // //       animationFrameRef.current = null;
// // // // //     }

// // // // //     Haptics.notificationAsync(
// // // // //       Haptics.NotificationFeedbackType
// // // // //         .Success
// // // // //     );
// // // // //   }, [config.targetScore]);

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | COLLISION DETECTION
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const checkCollision = useCallback(
// // // // //     (playerX, debrisItem) => {
// // // // //       const playerLeft =
// // // // //         playerX +
// // // // //         COLLISION_PADDING;

// // // // //       const playerRight =
// // // // //         playerX +
// // // // //         PLAYER_SIZE -
// // // // //         COLLISION_PADDING;

// // // // //       const playerTop =
// // // // //         GAME_HEIGHT -
// // // // //         PLAYER_SIZE -
// // // // //         PLAYER_BOTTOM_OFFSET +
// // // // //         COLLISION_PADDING;

// // // // //       const playerBottom =
// // // // //         playerTop +
// // // // //         PLAYER_SIZE -
// // // // //         COLLISION_PADDING;

// // // // //       const debrisLeft =
// // // // //         debrisItem.x +
// // // // //         COLLISION_PADDING;

// // // // //       const debrisRight =
// // // // //         debrisItem.x +
// // // // //         DEBRIS_SIZE -
// // // // //         COLLISION_PADDING;

// // // // //       const debrisTop =
// // // // //         debrisItem.y +
// // // // //         COLLISION_PADDING;

// // // // //       const debrisBottom =
// // // // //         debrisItem.y +
// // // // //         DEBRIS_SIZE -
// // // // //         COLLISION_PADDING;

// // // // //       return (
// // // // //         playerLeft <
// // // // //           debrisRight &&
// // // // //         playerRight >
// // // // //           debrisLeft &&
// // // // //         playerTop <
// // // // //           debrisBottom &&
// // // // //         playerBottom >
// // // // //           debrisTop
// // // // //       );
// // // // //     },
// // // // //     [GAME_HEIGHT]
// // // // //   );

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | GAME LOOP
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const runGameLoop = useCallback(
// // // // //     (timestamp) => {
// // // // //       if (
// // // // //         !gameRunningRef.current ||
// // // // //         gameOverRef.current ||
// // // // //         hasWonRef.current
// // // // //       ) {
// // // // //         return;
// // // // //       }

// // // // //       if (
// // // // //         lastFrameTimeRef.current ===
// // // // //         null
// // // // //       ) {
// // // // //         lastFrameTimeRef.current =
// // // // //           timestamp;
// // // // //       }

// // // // //       const delta =
// // // // //         Math.min(
// // // // //           timestamp -
// // // // //             lastFrameTimeRef.current,
// // // // //           50
// // // // //         ) / 1000;

// // // // //       lastFrameTimeRef.current =
// // // // //         timestamp;

// // // // //       /*
// // // // //        * ------------------------------------------------------------
// // // // //        * PLAYER MOVEMENT
// // // // //        * ------------------------------------------------------------
// // // // //        */

// // // // //       const tilt =
// // // // //         movementRef.current;

// // // // //       let nextPlayerX =
// // // // //         playerXRef.current;

// // // // //       if (Math.abs(tilt) >= 0.04) {
// // // // //         /*
// // // // //          * Accelerometer values are normally
// // // // //          * around -1 to +1.
// // // // //          *
// // // // //          * Multiply by speed and delta
// // // // //          * so movement is frame-rate independent.
// // // // //          */
// // // // //         nextPlayerX +=
// // // // //           tilt *
// // // // //           config.playerSpeed *
// // // // //           delta;
// // // // //       }

// // // // //       nextPlayerX =
// // // // //         clampPlayerX(nextPlayerX);

// // // // //       playerXRef.current =
// // // // //         nextPlayerX;

// // // // //       /*
// // // // //        * Only update React UI when the
// // // // //        * actual position has changed.
// // // // //        */

// // // // //       setPlayerPositionX(
// // // // //         nextPlayerX
// // // // //       );

// // // // //       /*
// // // // //        * ------------------------------------------------------------
// // // // //        * MOVE DEBRIS
// // // // //        * ------------------------------------------------------------
// // // // //        */

// // // // //       const previousDebris =
// // // // //         debrisRef.current;

// // // // //       const movedDebris =
// // // // //         previousDebris.map(
// // // // //           (item) => ({
// // // // //             ...item,
// // // // //             y:
// // // // //               item.y +
// // // // //               config.debrisSpeed *
// // // // //                 delta,
// // // // //           })
// // // // //         );

// // // // //       /*
// // // // //        * ------------------------------------------------------------
// // // // //        * COLLISION
// // // // //        * ------------------------------------------------------------
// // // // //        */

// // // // //       const collision =
// // // // //         movedDebris.some(
// // // // //           (item) =>
// // // // //             checkCollision(
// // // // //               nextPlayerX,
// // // // //               item
// // // // //             )
// // // // //         );

// // // // //       if (collision) {
// // // // //         debrisRef.current =
// // // // //           movedDebris;

// // // // //         setDebris(
// // // // //           movedDebris
// // // // //         );

// // // // //         finishGame();

// // // // //         return;
// // // // //       }

// // // // //       /*
// // // // //        * ------------------------------------------------------------
// // // // //        * SCORE
// // // // //        * ------------------------------------------------------------
// // // // //        */

// // // // //       let passedCount = 0;

// // // // //       const survivingDebris =
// // // // //         movedDebris.filter(
// // // // //           (item) => {
// // // // //             if (
// // // // //               item.y >
// // // // //               GAME_HEIGHT
// // // // //             ) {
// // // // //               passedCount += 1;

// // // // //               return false;
// // // // //             }

// // // // //             return true;
// // // // //           }
// // // // //         );

// // // // //       /*
// // // // //        * Every debris item successfully
// // // // //        * passing the player gives 10 points.
// // // // //        */

// // // // //       if (passedCount > 0) {
// // // // //         const nextScore =
// // // // //           Math.min(
// // // // //             config.targetScore,
// // // // //             scoreRef.current +
// // // // //               passedCount * 10
// // // // //           );

// // // // //         scoreRef.current =
// // // // //           nextScore;

// // // // //         setScore(nextScore);

// // // // //         if (
// // // // //           nextScore >=
// // // // //           config.targetScore
// // // // //         ) {
// // // // //           debrisRef.current =
// // // // //             survivingDebris;

// // // // //           setDebris(
// // // // //             survivingDebris
// // // // //           );

// // // // //           winGame();

// // // // //           return;
// // // // //         }
// // // // //       }

// // // // //       /*
// // // // //        * ------------------------------------------------------------
// // // // //        * SPAWNING
// // // // //        * ------------------------------------------------------------
// // // // //        */

// // // // //       if (
// // // // //         timestamp -
// // // // //           lastSpawnTimeRef.current >=
// // // // //         config.spawnInterval
// // // // //       ) {
// // // // //         lastSpawnTimeRef.current =
// // // // //           timestamp;

// // // // //         if (
// // // // //           survivingDebris.length <
// // // // //           config.spawnCount
// // // // //         ) {
// // // // //           survivingDebris.push(
// // // // //             createDebrisObject()
// // // // //           );
// // // // //         }
// // // // //       }

// // // // //       /*
// // // // //        * Keep debris within the intended
// // // // //        * maximum number.
// // // // //        */

// // // // //       while (
// // // // //         survivingDebris.length >
// // // // //         config.spawnCount
// // // // //       ) {
// // // // //         survivingDebris.shift();
// // // // //       }

// // // // //       debrisRef.current =
// // // // //         survivingDebris;

// // // // //       setDebris(
// // // // //         survivingDebris
// // // // //       );

// // // // //       animationFrameRef.current =
// // // // //         requestAnimationFrame(
// // // // //           runGameLoop
// // // // //         );
// // // // //     },
// // // // //     [
// // // // //       clampPlayerX,
// // // // //       config.debrisSpeed,
// // // // //       config.playerSpeed,
// // // // //       config.spawnCount,
// // // // //       config.spawnInterval,
// // // // //       config.targetScore,
// // // // //       createDebrisObject,
// // // // //       finishGame,
// // // // //       GAME_HEIGHT,
// // // // //       checkCollision,
// // // // //       winGame,
// // // // //     ]
// // // // //   );

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | START ACTUAL GAME
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const beginGame = useCallback(() => {
// // // // //     const initialX =
// // // // //       GAME_WIDTH / 2 -
// // // // //       PLAYER_SIZE / 2;

// // // // //     playerXRef.current =
// // // // //       initialX;

// // // // //     debrisRef.current =
// // // // //       createInitialDebris();

// // // // //     scoreRef.current = 0;

// // // // //     gameRunningRef.current =
// // // // //       true;

// // // // //     gameOverRef.current =
// // // // //       false;

// // // // //     hasWonRef.current =
// // // // //       false;

// // // // //     movementRef.current = 0;

// // // // //     lastFrameTimeRef.current =
// // // // //       null;

// // // // //     lastSpawnTimeRef.current =
// // // // //       performance.now();

// // // // //     setPlayerPositionX(
// // // // //       initialX
// // // // //     );

// // // // //     setDebris(
// // // // //       debrisRef.current
// // // // //     );

// // // // //     setScore(0);

// // // // //     setGameOver(false);

// // // // //     setHasWon(false);

// // // // //     setGameStarted(true);

// // // // //     Haptics.notificationAsync(
// // // // //       Haptics.NotificationFeedbackType
// // // // //         .Success
// // // // //     );

// // // // //     animationFrameRef.current =
// // // // //       requestAnimationFrame(
// // // // //         runGameLoop
// // // // //       );
// // // // //   }, [
// // // // //     GAME_WIDTH,
// // // // //     createInitialDebris,
// // // // //     runGameLoop,
// // // // //   ]);

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | START / COUNTDOWN
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const startGame = useCallback(() => {
// // // // //     if (
// // // // //       gameRunningRef.current ||
// // // // //       countdown !== null
// // // // //     ) {
// // // // //       return;
// // // // //     }

// // // // //     /*
// // // // //      * If this is a retry, clear the
// // // // //      * previous game-over state.
// // // // //      */

// // // // //     setGameOver(false);

// // // // //     setHasWon(false);

// // // // //     gameOverRef.current =
// // // // //       false;

// // // // //     hasWonRef.current =
// // // // //       false;

// // // // //     setCountdown(3);

// // // // //     let count = 3;

// // // // //     countdownTimerRef.current =
// // // // //       setInterval(() => {
// // // // //         count -= 1;

// // // // //         if (count <= 0) {
// // // // //           if (
// // // // //             countdownTimerRef.current
// // // // //           ) {
// // // // //             clearInterval(
// // // // //               countdownTimerRef.current
// // // // //             );
// // // // //           }

// // // // //           countdownTimerRef.current =
// // // // //             null;

// // // // //           setCountdown(null);

// // // // //           beginGame();

// // // // //           return;
// // // // //         }

// // // // //         setCountdown(count);

// // // // //         Haptics.impactAsync(
// // // // //           Haptics.ImpactFeedbackStyle.Light
// // // // //         );
// // // // //       }, 700);
// // // // //   }, [
// // // // //     beginGame,
// // // // //     countdown,
// // // // //   ]);

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | TOUCH MOVEMENT
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const movePlayer = useCallback(
// // // // //     (direction) => {
// // // // //       if (
// // // // //         !gameRunningRef.current ||
// // // // //         gameOverRef.current ||
// // // // //         hasWonRef.current
// // // // //       ) {
// // // // //         return;
// // // // //       }

// // // // //       const amount =
// // // // //         config.playerSpeed *
// // // // //         0.18;

// // // // //       let nextX =
// // // // //         playerXRef.current;

// // // // //       if (direction === 'left') {
// // // // //         nextX -= amount;
// // // // //       } else {
// // // // //         nextX += amount;
// // // // //       }

// // // // //       nextX =
// // // // //         clampPlayerX(nextX);

// // // // //       playerXRef.current =
// // // // //         nextX;

// // // // //       setPlayerPositionX(
// // // // //         nextX
// // // // //       );

// // // // //       Haptics.impactAsync(
// // // // //         Haptics.ImpactFeedbackStyle.Light
// // // // //       );
// // // // //     },
// // // // //     [
// // // // //       clampPlayerX,
// // // // //       config.playerSpeed,
// // // // //     ]
// // // // //   );

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | ACCELEROMETER
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   useEffect(() => {
// // // // //     let mounted = true;

// // // // //     const setupAccelerometer =
// // // // //       async () => {
// // // // //         if (
// // // // //           !visible ||
// // // // //           !gameStarted ||
// // // // //           gameOver ||
// // // // //           hasWon
// // // // //         ) {
// // // // //           return;
// // // // //         }

// // // // //         try {
// // // // //           const available =
// // // // //             await Accelerometer.isAvailableAsync();

// // // // //           if (!mounted) {
// // // // //             return;
// // // // //           }

// // // // //           if (!available) {
// // // // //             setSensorAvailable(false);
// // // // //             return;
// // // // //           }

// // // // //           setSensorAvailable(true);

// // // // //           Accelerometer.setUpdateInterval(
// // // // //             50
// // // // //           );

// // // // //           sensorSubscriptionRef.current =
// // // // //             Accelerometer.addListener(
// // // // //               (data) => {
// // // // //                 if (
// // // // //                   !gameRunningRef.current
// // // // //                 ) {
// // // // //                   return;
// // // // //                 }

// // // // //                 /*
// // // // //                  * Expo's accelerometer x axis
// // // // //                  * controls horizontal movement.
// // // // //                  */

// // // // //                 movementRef.current =
// // // // //                   data.x;
// // // // //               }
// // // // //             );
// // // // //         } catch (error) {
// // // // //           console.log(
// // // // //             'Accelerometer error:',
// // // // //             error
// // // // //           );

// // // // //           if (mounted) {
// // // // //             setSensorAvailable(false);
// // // // //           }
// // // // //         }
// // // // //       };

// // // // //     setupAccelerometer();

// // // // //     return () => {
// // // // //       mounted = false;

// // // // //       if (
// // // // //         sensorSubscriptionRef.current
// // // // //       ) {
// // // // //         sensorSubscriptionRef.current.remove();

// // // // //         sensorSubscriptionRef.current =
// // // // //           null;
// // // // //       }
// // // // //     };
// // // // //   }, [
// // // // //     visible,
// // // // //     gameStarted,
// // // // //     gameOver,
// // // // //     hasWon,
// // // // //   ]);

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | MODAL CLEANUP
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   useEffect(() => {
// // // // //     if (!visible) {
// // // // //       resetGame();
// // // // //     }
// // // // //   }, [
// // // // //     visible,
// // // // //     resetGame,
// // // // //   ]);

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | COMPONENT UNMOUNT CLEANUP
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   useEffect(() => {
// // // // //     return () => {
// // // // //       if (
// // // // //         countdownTimerRef.current
// // // // //       ) {
// // // // //         clearInterval(
// // // // //           countdownTimerRef.current
// // // // //         );
// // // // //       }

// // // // //       if (
// // // // //         animationFrameRef.current
// // // // //       ) {
// // // // //         cancelAnimationFrame(
// // // // //           animationFrameRef.current
// // // // //         );
// // // // //       }

// // // // //       if (
// // // // //         sensorSubscriptionRef.current
// // // // //       ) {
// // // // //         sensorSubscriptionRef.current.remove();
// // // // //       }
// // // // //     };
// // // // //   }, []);

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | CLOSE
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const handleClose = useCallback(() => {
// // // // //     console.log('Closebuttonpressed');
// // // // //     console.log('FloodRunner: handleClose called');
// // // // //     resetGame();
// // // // //     console.log('Calling Parent onClose');
// // // // //     console.log('FloodRunner: calling onClose');
// // // // //     onClose();
// // // // //   },[resetGame, onClose]);

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | CLAIM REWARD
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const handleClaimReward = () => {
// // // // //     if (!hasWonRef.current) {
// // // // //       return;
// // // // //     }

// // // // //     // onWin({
// // // // //     //   xp: config.reward.xp,
// // // // //     //   coins: config.reward.coins,
// // // // //     // });
// // // // //     if (typeof onWin === 'function') {
// // // // //       onWin({
// // // // //         xp: config.reward.xp,
// // // // //         coins: config.reward.coins,
// // // // //       });
// // // // //     } else {
// // // // //       console.warn(
// // // // //         'FloodRunnerGameModal: onWin callback was not provided.'
// // // // //       );
// // // // //     }
// // // // //     handleClose();
// // // // //   };

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | PROGRESS
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   const progressPercentage =
// // // // //     Math.min(
// // // // //       100,
// // // // //       (score /
// // // // //         config.targetScore) *
// // // // //         100
// // // // //     );

// // // // //   /*
// // // // //   |--------------------------------------------------------------------------
// // // // //   | RENDER
// // // // //   |--------------------------------------------------------------------------
// // // // //   */

// // // // //   return (
// // // // //     <Modal
// // // // //       visible={visible}
// // // // //       animationType="slide"
// // // // //       transparent
// // // // //       onRequestClose={handleClose}
// // // // //     >
// // // // //       <View style={styles.modalOverlay}>
// // // // //         <View
// // // // //           style={[
// // // // //             styles.modalContentCard,
// // // // //             {
// // // // //               width:
// // // // //                 GAME_WIDTH + 32,
// // // // //             },
// // // // //           ]}
// // // // //         >
// // // // //           {/* HEADER */}

// // // // //           <View style={styles.modalHeader}>
// // // // //             <View
// // // // //               style={
// // // // //                 styles.headerTitleArea
// // // // //               }
// // // // //             >
// // // // //               <View
// // // // //                 style={
// // // // //                   styles.headerIcon
// // // // //                 }
// // // // //               >
// // // // //                 <Ionicons
// // // // //                   name="water"
// // // // //                   size={20}
// // // // //                   color="#38BDF8"
// // // // //                 />
// // // // //               </View>

// // // // //               <View
// // // // //                 style={
// // // // //                   styles.headerTextArea
// // // // //                 }
// // // // //               >
// // // // //                 <Text
// // // // //                   style={
// // // // //                     styles.modalTitle
// // // // //                   }
// // // // //                 >
// // // // //                   {t(
// // // // //                     'games.floodRunner.title'
// // // // //                   )}
// // // // //                 </Text>

// // // // //                 <Text
// // // // //                   style={
// // // // //                     styles.levelLabel
// // // // //                   }
// // // // //                 >
// // // // //                   {t(
// // // // //                     'games.floodRunner.level',
// // // // //                     {
// // // // //                       level:
// // // // //                         selectedLevel,
// // // // //                     }
// // // // //                   )}{' '}
// // // // //                   •{' '}
// // // // //                   {t(
// // // // //                     config.nameKey
// // // // //                   )}
// // // // //                 </Text>
// // // // //               </View>
// // // // //             </View>

// // // // //             <TouchableOpacity
// // // // //               onPress={handleClose}
// // // // //               accessibilityRole="button"
// // // // //               accessibilityLabel={t('common.close')}
// // // // //             >
// // // // //               <Ionicons
// // // // //                 name="close-circle"
// // // // //                 size={30}
// // // // //                 color="#64748B"
// // // // //               />
// // // // //             </TouchableOpacity>
// // // // //           </View>

// // // // //           {/* OBJECTIVE */}

// // // // //           <View
// // // // //             style={
// // // // //               styles.objectiveCard
// // // // //             }
// // // // //           >
// // // // //             <View
// // // // //               style={
// // // // //                 styles.objectiveIcon
// // // // //               }
// // // // //             >
// // // // //               <Ionicons
// // // // //                 name="flag"
// // // // //                 size={18}
// // // // //                 color="#34D399"
// // // // //               />
// // // // //             </View>

// // // // //             <View
// // // // //               style={
// // // // //                 styles.objectiveTextArea
// // // // //               }
// // // // //             >
// // // // //               <Text
// // // // //                 style={
// // // // //                   styles.objectiveTitle
// // // // //                 }
// // // // //               >
// // // // //                 {t(
// // // // //                   'games.floodRunner.objective'
// // // // //                 )}
// // // // //               </Text>

// // // // //               <Text
// // // // //                 style={
// // // // //                   styles.objectiveText
// // // // //                 }
// // // // //               >
// // // // //                 {t(
// // // // //                   'games.floodRunner.objectiveDescription'
// // // // //                 )}
// // // // //               </Text>
// // // // //             </View>
// // // // //           </View>

// // // // //           {/* INSTRUCTIONS */}

// // // // //           {!gameStarted &&
// // // // //             !gameOver &&
// // // // //             !hasWon &&
// // // // //             countdown === null && (
// // // // //               <View
// // // // //                 style={
// // // // //                   styles.instructionsCard
// // // // //                 }
// // // // //               >
// // // // //                 <View
// // // // //                   style={
// // // // //                     styles.instructionsHeader
// // // // //                   }
// // // // //                 >
// // // // //                   <Ionicons
// // // // //                     name="help-circle"
// // // // //                     size={20}
// // // // //                     color="#FBBF24"
// // // // //                   />

// // // // //                   <Text
// // // // //                     style={
// // // // //                       styles.instructionsTitle
// // // // //                     }
// // // // //                   >
// // // // //                     {t(
// // // // //                       'games.floodRunner.howToPlay'
// // // // //                     )}
// // // // //                   </Text>
// // // // //                 </View>

// // // // //                 <InstructionRow
// // // // //                   icon="swap-horizontal"
// // // // //                   text={t(
// // // // //                     'games.floodRunner.instructions.move'
// // // // //                   )}
// // // // //                 />

// // // // //                 <InstructionRow
// // // // //                   icon="warning"
// // // // //                   text={t(
// // // // //                     'games.floodRunner.instructions.avoid'
// // // // //                   )}
// // // // //                 />

// // // // //                 <InstructionRow
// // // // //                   icon="water"
// // // // //                   text={t(
// // // // //                     'games.floodRunner.instructions.flood'
// // // // //                   )}
// // // // //                 />

// // // // //                 <InstructionRow
// // // // //                   icon="flag"
// // // // //                   text={t(
// // // // //                     'games.floodRunner.instructions.finish',
// // // // //                     {
// // // // //                       score:
// // // // //                         config.targetScore,
// // // // //                     }
// // // // //                   )}
// // // // //                 />
// // // // //               </View>
// // // // //             )}

// // // // //           {/* SENSOR STATUS */}

// // // // //           {gameStarted &&
// // // // //             !gameOver &&
// // // // //             !hasWon && (
// // // // //               <View
// // // // //                 style={
// // // // //                   styles.sensorStatus
// // // // //                 }
// // // // //               >
// // // // //                 <Ionicons
// // // // //                   name={
// // // // //                     sensorAvailable
// // // // //                       ? 'phone-portrait-outline'
// // // // //                       : 'hand-left-outline'
// // // // //                   }
// // // // //                   size={15}
// // // // //                   color={
// // // // //                     sensorAvailable
// // // // //                       ? '#34D399'
// // // // //                       : '#FBBF24'
// // // // //                   }
// // // // //                 />

// // // // //                 <Text
// // // // //                   style={[
// // // // //                     styles.sensorText,
// // // // //                     {
// // // // //                       color:
// // // // //                         sensorAvailable
// // // // //                           ? '#34D399'
// // // // //                           : '#FBBF24',
// // // // //                     },
// // // // //                   ]}
// // // // //                 >
// // // // //                   {sensorAvailable
// // // // //                     ? t(
// // // // //                         'games.floodRunner.tiltActive'
// // // // //                       )
// // // // //                     : t(
// // // // //                         'games.floodRunner.touchActive'
// // // // //                       )}
// // // // //                 </Text>
// // // // //               </View>
// // // // //             )}

// // // // //           {/* GAME CANVAS */}

// // // // //           <View
// // // // //             style={[
// // // // //               styles.gameCanvas,
// // // // //               {
// // // // //                 width:
// // // // //                   GAME_WIDTH,
// // // // //                 height:
// // // // //                   GAME_HEIGHT,
// // // // //               },
// // // // //             ]}
// // // // //           >
// // // // //             {/* SAFE ZONE */}

// // // // //             <View
// // // // //               style={
// // // // //                 styles.safeZone
// // // // //               }
// // // // //             >
// // // // //               <View
// // // // //                 style={
// // // // //                   styles.safeZoneIcon
// // // // //                 }
// // // // //               >
// // // // //                 <Ionicons
// // // // //                   name="shield-checkmark"
// // // // //                   size={18}
// // // // //                   color="#34D399"
// // // // //                 />
// // // // //               </View>

// // // // //               <View>
// // // // //                 <Text
// // // // //                   style={
// // // // //                     styles.safeZoneTitle
// // // // //                   }
// // // // //                 >
// // // // //                   {t(
// // // // //                     'games.floodRunner.safeShelter'
// // // // //                   )}
// // // // //                 </Text>

// // // // //                 <Text
// // // // //                   style={
// // // // //                     styles.safeZoneSub
// // // // //                   }
// // // // //                 >
// // // // //                   {t(
// // // // //                     'games.floodRunner.highGround'
// // // // //                   )}
// // // // //                 </Text>
// // // // //               </View>
// // // // //             </View>

// // // // //             {/* DANGER FIELD */}

// // // // //             <View
// // // // //               style={
// // // // //                 styles.dangerField
// // // // //               }
// // // // //             >
// // // // //               <View
// // // // //                 style={
// // // // //                   styles.routeLine
// // // // //                 }
// // // // //               />

// // // // //               <Text
// // // // //                 style={
// // // // //                   styles.dangerText
// // // // //                 }
// // // // //               >
// // // // //                 {t(
// // // // //                   'games.floodRunner.evacuationRoute'
// // // // //                 )}
// // // // //               </Text>
// // // // //             </View>

// // // // //             {/* DEBRIS */}

// // // // //             {gameStarted &&
// // // // //               !gameOver &&
// // // // //               !hasWon &&
// // // // //               debris.map((item) => (
// // // // //                 <View
// // // // //                   key={item.id}
// // // // //                   style={[
// // // // //                     styles.debrisNode,
// // // // //                     {
// // // // //                       left: item.x,
// // // // //                       top: item.y,
// // // // //                     },
// // // // //                   ]}
// // // // //                 >
// // // // //                   <Ionicons
// // // // //                     name="warning"
// // // // //                     size={20}
// // // // //                     color="#FCA5A5"
// // // // //                   />
// // // // //                 </View>
// // // // //               ))}

// // // // //             {/* PLAYER */}

// // // // //             {gameStarted &&
// // // // //               !gameOver &&
// // // // //               !hasWon && (
// // // // //                 <View
// // // // //                   style={[
// // // // //                     styles.playerNode,
// // // // //                     {
// // // // //                       left:
// // // // //                         playerPositionX,
// // // // //                       bottom:
// // // // //                         PLAYER_BOTTOM_OFFSET +
// // // // //                         FLOOD_HEIGHT,
// // // // //                     },
// // // // //                   ]}
// // // // //                 >
// // // // //                   <Ionicons
// // // // //                     name="person"
// // // // //                     size={25}
// // // // //                     color="#FFFFFF"
// // // // //                   />
// // // // //                 </View>
// // // // //               )}

// // // // //             {/* FLOOD */}

// // // // //             <View
// // // // //               style={
// // // // //                 styles.floodLayer
// // // // //               }
// // // // //             >
// // // // //               <View
// // // // //                 style={
// // // // //                   styles.waveContainer
// // // // //                 }
// // // // //               >
// // // // //                 {Array.from({
// // // // //                   length: 12,
// // // // //                 }).map(
// // // // //                   (_, index) => (
// // // // //                     <Text
// // // // //                       key={index}
// // // // //                       style={
// // // // //                         styles.wave
// // // // //                       }
// // // // //                     >
// // // // //                       ~
// // // // //                     </Text>
// // // // //                   )
// // // // //                 )}
// // // // //               </View>

// // // // //               <Text
// // // // //                 style={
// // // // //                   styles.floodLabel
// // // // //                 }
// // // // //               >
// // // // //                 {t(
// // // // //                   'games.floodRunner.floodZone'
// // // // //                 )}
// // // // //               </Text>
// // // // //             </View>

// // // // //             {/* COUNTDOWN */}

// // // // //             {countdown !== null && (
// // // // //               <View
// // // // //                 style={
// // // // //                   styles.countdownOverlay
// // // // //                 }
// // // // //               >
// // // // //                 <Text
// // // // //                   style={
// // // // //                     styles.countdownNumber
// // // // //                   }
// // // // //                 >
// // // // //                   {countdown}
// // // // //                 </Text>

// // // // //                 <Text
// // // // //                   style={
// // // // //                     styles.countdownText
// // // // //                   }
// // // // //                 >
// // // // //                   {t(
// // // // //                     'games.floodRunner.getReady'
// // // // //                   )}
// // // // //                 </Text>
// // // // //               </View>
// // // // //             )}

// // // // //             {/* START SCREEN */}

// // // // //             {!gameStarted &&
// // // // //               countdown === null &&
// // // // //               !gameOver &&
// // // // //               !hasWon && (
// // // // //                 <View
// // // // //                   style={
// // // // //                     styles.startOverlay
// // // // //                   }
// // // // //                 >
// // // // //                   <View
// // // // //                     style={
// // // // //                       styles.startIcon
// // // // //                     }
// // // // //                   >
// // // // //                     <Ionicons
// // // // //                       name="walk"
// // // // //                       size={34}
// // // // //                       color="#38BDF8"
// // // // //                     />
// // // // //                   </View>

// // // // //                   <Text
// // // // //                     style={
// // // // //                       styles.startTitle
// // // // //                     }
// // // // //                   >
// // // // //                     {t(
// // // // //                       'games.floodRunner.ready'
// // // // //                     )}
// // // // //                   </Text>

// // // // //                   <Text
// // // // //                     style={
// // // // //                       styles.startDescription
// // // // //                     }
// // // // //                   >
// // // // //                     {t(
// // // // //                       'games.floodRunner.startDescription'
// // // // //                     )}
// // // // //                   </Text>

// // // // //                   <TouchableOpacity
// // // // //                     style={
// // // // //                       styles.startButton
// // // // //                     }
// // // // //                     onPress={
// // // // //                       startGame
// // // // //                     }
// // // // //                     activeOpacity={
// // // // //                       0.8
// // // // //                     }
// // // // //                   >
// // // // //                     <Ionicons
// // // // //                       name="play"
// // // // //                       size={18}
// // // // //                       color="#FFFFFF"
// // // // //                     />

// // // // //                     <Text
// // // // //                       style={
// // // // //                         styles.startButtonText
// // // // //                       }
// // // // //                     >
// // // // //                       {t(
// // // // //                         'games.floodRunner.start'
// // // // //                       )}
// // // // //                     </Text>
// // // // //                   </TouchableOpacity>
// // // // //                 </View>
// // // // //               )}

// // // // //             {/* GAME OVER */}

// // // // //             {gameOver && (
// // // // //               <View
// // // // //                 style={
// // // // //                   styles.endGameOverlay
// // // // //                 }
// // // // //               >
// // // // //                 <View
// // // // //                   style={[
// // // // //                     styles.resultIcon,
// // // // //                     {
// // // // //                       backgroundColor:
// // // // //                         '#450A0A',
// // // // //                     },
// // // // //                   ]}
// // // // //                 >
// // // // //                   <Ionicons
// // // // //                     name="warning"
// // // // //                     size={34}
// // // // //                     color="#EF4444"
// // // // //                   />
// // // // //                 </View>

// // // // //                 <Text
// // // // //                   style={
// // // // //                     styles.gameOverTitle
// // // // //                   }
// // // // //                 >
// // // // //                   {t(
// // // // //                     'games.floodRunner.failed'
// // // // //                   )}
// // // // //                 </Text>

// // // // //                 <Text
// // // // //                   style={
// // // // //                     styles.gameOverText
// // // // //                   }
// // // // //                 >
// // // // //                   {t(
// // // // //                     'games.floodRunner.failedDescription'
// // // // //                   )}
// // // // //                 </Text>

// // // // //                 <Text
// // // // //                   style={
// // // // //                     styles.finalScore
// // // // //                   }
// // // // //                 >
// // // // //                   {score} /{' '}
// // // // //                   {config.targetScore}
// // // // //                 </Text>

// // // // //                 <TouchableOpacity
// // // // //                   style={
// // // // //                     styles.retryButton
// // // // //                   }
// // // // //                   onPress={
// // // // //                     startGame
// // // // //                   }
// // // // //                   activeOpacity={
// // // // //                     0.8
// // // // //                   }
// // // // //                 >
// // // // //                   <Ionicons
// // // // //                     name="refresh"
// // // // //                     size={18}
// // // // //                     color="#FFFFFF"
// // // // //                   />

// // // // //                   <Text
// // // // //                     style={
// // // // //                       styles.buttonText
// // // // //                     }
// // // // //                   >
// // // // //                     {t(
// // // // //                       'games.floodRunner.retry'
// // // // //                     )}
// // // // //                   </Text>
// // // // //                 </TouchableOpacity>
// // // // //               </View>
// // // // //             )}

// // // // //             {/* WIN */}

// // // // //             {hasWon && (
// // // // //               <View
// // // // //                 style={
// // // // //                   styles.endGameOverlay
// // // // //                 }
// // // // //               >
// // // // //                 <View
// // // // //                   style={[
// // // // //                     styles.resultIcon,
// // // // //                     {
// // // // //                       backgroundColor:
// // // // //                         '#064E3B',
// // // // //                     },
// // // // //                   ]}
// // // // //                 >
// // // // //                   <Ionicons
// // // // //                     name="shield-checkmark"
// // // // //                     size={36}
// // // // //                     color="#10B981"
// // // // //                   />
// // // // //                 </View>

// // // // //                 <Text
// // // // //                   style={
// // // // //                     styles.successTitle
// // // // //                   }
// // // // //                 >
// // // // //                   {t(
// // // // //                     'games.floodRunner.success'
// // // // //                   )}
// // // // //                 </Text>

// // // // //                 <Text
// // // // //                   style={
// // // // //                     styles.gameOverText
// // // // //                   }
// // // // //                 >
// // // // //                   {t(
// // // // //                     'games.floodRunner.successDescription'
// // // // //                   )}
// // // // //                 </Text>

// // // // //                 <View
// // // // //                   style={
// // // // //                     styles.rewardRow
// // // // //                   }
// // // // //                 >
// // // // //                   <Reward
// // // // //                     icon="flash"
// // // // //                     value={`+${config.reward.xp}`}
// // // // //                     label={t(
// // // // //                       'games.floodRunner.xp'
// // // // //                     )}
// // // // //                   />

// // // // //                   <Reward
// // // // //                     icon="cash"
// // // // //                     value={`+${config.reward.coins}`}
// // // // //                     label={t(
// // // // //                       'games.floodRunner.coins'
// // // // //                     )}
// // // // //                   />
// // // // //                 </View>

// // // // //                 <TouchableOpacity
// // // // //                   style={
// // // // //                     styles.claimRewardButton
// // // // //                   }
// // // // //                   onPress={
// // // // //                     handleClaimReward
// // // // //                   }
// // // // //                   activeOpacity={
// // // // //                     0.8
// // // // //                   }
// // // // //                 >
// // // // //                   <Text
// // // // //                     style={
// // // // //                       styles.buttonText
// // // // //                     }
// // // // //                   >
// // // // //                     {t(
// // // // //                       'games.floodRunner.claimReward'
// // // // //                     )}
// // // // //                   </Text>
// // // // //                 </TouchableOpacity>
// // // // //               </View>
// // // // //             )}
// // // // //           </View>

// // // // //           {/* SCORE */}

// // // // //           <View
// // // // //             style={styles.gameHud}
// // // // //           >
// // // // //             <View
// // // // //               style={
// // // // //                 styles.scoreHeader
// // // // //               }
// // // // //             >
// // // // //               <Text
// // // // //                 style={
// // // // //                   styles.scoreLabel
// // // // //                 }
// // // // //               >
// // // // //                 {t(
// // // // //                   'games.floodRunner.score'
// // // // //                 )}
// // // // //               </Text>

// // // // //               <Text
// // // // //                 style={
// // // // //                   styles.scoreValue
// // // // //                 }
// // // // //               >
// // // // //                 {score} /{' '}
// // // // //                 {config.targetScore}
// // // // //               </Text>
// // // // //             </View>

// // // // //             <View
// // // // //               style={
// // // // //                 styles.progressBackground
// // // // //               }
// // // // //             >
// // // // //               <View
// // // // //                 style={[
// // // // //                   styles.progressFill,
// // // // //                   {
// // // // //                     width: `${progressPercentage}%`,
// // // // //                   },
// // // // //                 ]}
// // // // //               />
// // // // //             </View>
// // // // //           </View>

// // // // //           {/* CONTROLS */}

// // // // //           {gameStarted &&
// // // // //             !gameOver &&
// // // // //             !hasWon && (
// // // // //               <View
// // // // //                 style={
// // // // //                   styles.controls
// // // // //                 }
// // // // //               >
// // // // //                 <TouchableOpacity
// // // // //                   style={
// // // // //                     styles.controlButton
// // // // //                   }
// // // // //                   onPress={() =>
// // // // //                     movePlayer(
// // // // //                       'left'
// // // // //                     )
// // // // //                   }
// // // // //                   activeOpacity={
// // // // //                     0.7
// // // // //                   }
// // // // //                 >
// // // // //                   <Ionicons
// // // // //                     name="arrow-back"
// // // // //                     size={24}
// // // // //                     color="#FFFFFF"
// // // // //                   />

// // // // //                   <Text
// // // // //                     style={
// // // // //                       styles.controlText
// // // // //                     }
// // // // //                     numberOfLines={
// // // // //                       2
// // // // //                     }
// // // // //                   >
// // // // //                     {t(
// // // // //                       'games.floodRunner.left'
// // // // //                     )}
// // // // //                   </Text>
// // // // //                 </TouchableOpacity>

// // // // //                 <View
// // // // //                   style={
// // // // //                     styles.controlHint
// // // // //                   }
// // // // //                 >
// // // // //                   <Ionicons
// // // // //                     name={
// // // // //                       sensorAvailable
// // // // //                         ? 'phone-portrait-outline'
// // // // //                         : 'hand-left-outline'
// // // // //                     }
// // // // //                     size={21}
// // // // //                     color="#38BDF8"
// // // // //                   />

// // // // //                   <Text
// // // // //                     style={
// // // // //                       styles.controlHintText
// // // // //                     }
// // // // //                     numberOfLines={
// // // // //                       2
// // // // //                     }
// // // // //                   >
// // // // //                     {sensorAvailable
// // // // //                       ? t(
// // // // //                           'games.floodRunner.tilt'
// // // // //                         )
// // // // //                       : t(
// // // // //                           'games.floodRunner.touch'
// // // // //                         )}
// // // // //                   </Text>
// // // // //                 </View>

// // // // //                 <TouchableOpacity
// // // // //                   style={
// // // // //                     styles.controlButton
// // // // //                   }
// // // // //                   onPress={() =>
// // // // //                     movePlayer(
// // // // //                       'right'
// // // // //                     )
// // // // //                   }
// // // // //                   activeOpacity={
// // // // //                     0.7
// // // // //                   }
// // // // //                 >
// // // // //                   <Ionicons
// // // // //                     name="arrow-forward"
// // // // //                     size={24}
// // // // //                     color="#FFFFFF"
// // // // //                   />

// // // // //                   <Text
// // // // //                     style={
// // // // //                       styles.controlText
// // // // //                     }
// // // // //                     numberOfLines={
// // // // //                       2
// // // // //                     }
// // // // //                   >
// // // // //                     {t(
// // // // //                       'games.floodRunner.right'
// // // // //                     )}
// // // // //                   </Text>
// // // // //                 </TouchableOpacity>
// // // // //               </View>
// // // // //             )}
// // // // //         </View>
// // // // //       </View>
// // // // //     </Modal>
// // // // //   );
// // // // // }

// // // // // /*
// // // // // |--------------------------------------------------------------------------
// // // // // | INSTRUCTION ROW
// // // // // |--------------------------------------------------------------------------
// // // // // */

// // // // // function InstructionRow({
// // // // //   icon,
// // // // //   text,
// // // // // }) {
// // // // //   return (
// // // // //     <View
// // // // //       style={
// // // // //         styles.instructionRow
// // // // //       }
// // // // //     >
// // // // //       <View
// // // // //         style={
// // // // //           styles.instructionIcon
// // // // //         }
// // // // //       >
// // // // //         <Ionicons
// // // // //           name={icon}
// // // // //           size={16}
// // // // //           color="#38BDF8"
// // // // //         />
// // // // //       </View>

// // // // //       <Text
// // // // //         style={
// // // // //           styles.instructionText
// // // // //         }
// // // // //       >
// // // // //         {text}
// // // // //       </Text>
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // /*
// // // // // |--------------------------------------------------------------------------
// // // // // | REWARD
// // // // // |--------------------------------------------------------------------------
// // // // // */

// // // // // function Reward({
// // // // //   icon,
// // // // //   value,
// // // // //   label,
// // // // // }) {
// // // // //   return (
// // // // //     <View
// // // // //       style={styles.reward}
// // // // //     >
// // // // //       <Ionicons
// // // // //         name={icon}
// // // // //         size={18}
// // // // //         color="#FBBF24"
// // // // //       />

// // // // //       <Text
// // // // //         style={
// // // // //           styles.rewardValue
// // // // //         }
// // // // //       >
// // // // //         {value}
// // // // //       </Text>

// // // // //       <Text
// // // // //         style={
// // // // //           styles.rewardLabel
// // // // //         }
// // // // //       >
// // // // //         {label}
// // // // //       </Text>
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // /*
// // // // // |--------------------------------------------------------------------------
// // // // // | STYLES
// // // // // |--------------------------------------------------------------------------
// // // // // */

// // // // // const styles = StyleSheet.create({
// // // // //   modalOverlay: {
// // // // //     flex: 1,
// // // // //     backgroundColor:
// // // // //       'rgba(2, 6, 23, 0.94)',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     padding: 12,
// // // // //   },

// // // // //   modalContentCard: {
// // // // //     backgroundColor: '#0F172A',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#1E293B',
// // // // //     borderRadius: 22,
// // // // //     padding: 16,
// // // // //     maxWidth: 400,
// // // // //     maxHeight: '96%',
// // // // //   },

// // // // //   modalHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent:
// // // // //       'space-between',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 10,
// // // // //   },

// // // // //   headerTitleArea: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     flex: 1,
// // // // //     marginRight: 10,
// // // // //   },

// // // // //   headerIcon: {
// // // // //     width: 38,
// // // // //     height: 38,
// // // // //     borderRadius: 12,
// // // // //     backgroundColor: '#082F49',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     marginRight: 10,
// // // // //   },

// // // // //   headerTextArea: {
// // // // //     flex: 1,
// // // // //   },

// // // // //   modalTitle: {
// // // // //     color: '#FFFFFF',
// // // // //     fontSize: 17,
// // // // //     fontWeight: '900',
// // // // //   },

// // // // //   levelLabel: {
// // // // //     color: '#38BDF8',
// // // // //     fontSize: 11,
// // // // //     fontWeight: '800',
// // // // //     marginTop: 3,
// // // // //   },

// // // // //   objectiveCard: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#052E16',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#166534',
// // // // //     borderRadius: 13,
// // // // //     padding: 11,
// // // // //     marginBottom: 10,
// // // // //   },

// // // // //   objectiveIcon: {
// // // // //     width: 32,
// // // // //     height: 32,
// // // // //     borderRadius: 10,
// // // // //     backgroundColor: '#064E3B',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     marginRight: 10,
// // // // //   },

// // // // //   objectiveTextArea: {
// // // // //     flex: 1,
// // // // //   },

// // // // //   objectiveTitle: {
// // // // //     color: '#34D399',
// // // // //     fontSize: 11,
// // // // //     fontWeight: '900',
// // // // //     textTransform: 'uppercase',
// // // // //   },

// // // // //   objectiveText: {
// // // // //     color: '#A7F3D0',
// // // // //     fontSize: 11,
// // // // //     lineHeight: 16,
// // // // //     marginTop: 2,
// // // // //   },

// // // // //   instructionsCard: {
// // // // //     backgroundColor: '#111827',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#334155',
// // // // //     borderRadius: 14,
// // // // //     padding: 13,
// // // // //     marginBottom: 10,
// // // // //   },

// // // // //   instructionsHeader: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 8,
// // // // //   },

// // // // //   instructionsTitle: {
// // // // //     color: '#FFFFFF',
// // // // //     fontSize: 13,
// // // // //     fontWeight: '900',
// // // // //     marginLeft: 7,
// // // // //   },

// // // // //   instructionRow: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'flex-start',
// // // // //     marginTop: 7,
// // // // //   },

// // // // //   instructionIcon: {
// // // // //     width: 25,
// // // // //     height: 25,
// // // // //     borderRadius: 8,
// // // // //     backgroundColor: '#082F49',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     marginRight: 8,
// // // // //   },

// // // // //   instructionText: {
// // // // //     flex: 1,
// // // // //     color: '#CBD5E1',
// // // // //     fontSize: 11,
// // // // //     lineHeight: 17,
// // // // //     paddingTop: 3,
// // // // //   },

// // // // //   sensorStatus: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     alignSelf: 'flex-start',
// // // // //     backgroundColor: '#020617',
// // // // //     paddingHorizontal: 9,
// // // // //     paddingVertical: 5,
// // // // //     borderRadius: 8,
// // // // //     marginBottom: 8,
// // // // //   },

// // // // //   sensorText: {
// // // // //     fontSize: 10,
// // // // //     fontWeight: '800',
// // // // //     marginLeft: 6,
// // // // //   },

// // // // //   gameCanvas: {
// // // // //     backgroundColor: '#020617',
// // // // //     borderRadius: 16,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#1E293B',
// // // // //     position: 'relative',
// // // // //     overflow: 'hidden',
// // // // //   },

// // // // //   safeZone: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     height: SAFE_ZONE_HEIGHT,
// // // // //     backgroundColor: '#064E3B',
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#10B981',
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 14,
// // // // //     zIndex: 4,
// // // // //   },

// // // // //   safeZoneIcon: {
// // // // //     width: 34,
// // // // //     height: 34,
// // // // //     borderRadius: 10,
// // // // //     backgroundColor: '#065F46',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     marginRight: 9,
// // // // //   },

// // // // //   safeZoneTitle: {
// // // // //     color: '#D1FAE5',
// // // // //     fontSize: 11,
// // // // //     fontWeight: '900',
// // // // //     letterSpacing: 0.5,
// // // // //   },

// // // // //   safeZoneSub: {
// // // // //     color: '#6EE7B7',
// // // // //     fontSize: 9,
// // // // //     fontWeight: '700',
// // // // //     marginTop: 2,
// // // // //   },

// // // // //   dangerField: {
// // // // //     position: 'absolute',
// // // // //     top: SAFE_ZONE_HEIGHT,
// // // // //     bottom: FLOOD_HEIGHT,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //   },

// // // // //   routeLine: {
// // // // //     position: 'absolute',
// // // // //     width: 2,
// // // // //     height: '100%',
// // // // //     backgroundColor: '#1E293B',
// // // // //     opacity: 0.8,
// // // // //   },

// // // // //   dangerText: {
// // // // //     color: '#334155',
// // // // //     fontSize: 8,
// // // // //     fontWeight: '900',
// // // // //     letterSpacing: 1.5,
// // // // //     transform: [
// // // // //       {
// // // // //         rotate: '-90deg',
// // // // //       },
// // // // //     ],
// // // // //   },

// // // // //   debrisNode: {
// // // // //     position: 'absolute',
// // // // //     width: DEBRIS_SIZE,
// // // // //     height: DEBRIS_SIZE,
// // // // //     borderRadius:
// // // // //       DEBRIS_SIZE / 2,
// // // // //     backgroundColor: '#450A0A',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#EF4444',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     zIndex: 5,
// // // // //   },

// // // // //   playerNode: {
// // // // //     position: 'absolute',
// // // // //     width: PLAYER_SIZE,
// // // // //     height: PLAYER_SIZE,
// // // // //     borderRadius:
// // // // //       PLAYER_SIZE / 2,
// // // // //     backgroundColor: '#2563EB',
// // // // //     borderWidth: 2,
// // // // //     borderColor: '#60A5FA',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     zIndex: 6,
// // // // //   },

// // // // //   floodLayer: {
// // // // //     position: 'absolute',
// // // // //     bottom: 0,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     height: FLOOD_HEIGHT,
// // // // //     backgroundColor: '#075985',
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: '#38BDF8',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     zIndex: 3,
// // // // //   },

// // // // //   waveContainer: {
// // // // //     position: 'absolute',
// // // // //     top: -13,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     flexDirection: 'row',
// // // // //     justifyContent:
// // // // //       'space-around',
// // // // //   },

// // // // //   wave: {
// // // // //     color: '#38BDF8',
// // // // //     fontSize: 24,
// // // // //     fontWeight: '900',
// // // // //   },

// // // // //   floodLabel: {
// // // // //     color: '#BAE6FD',
// // // // //     fontSize: 9,
// // // // //     fontWeight: '900',
// // // // //     letterSpacing: 2,
// // // // //     marginTop: 12,
// // // // //   },

// // // // //   startOverlay: {
// // // // //     position: 'absolute',
// // // // //     top: SAFE_ZONE_HEIGHT,
// // // // //     bottom: FLOOD_HEIGHT,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     backgroundColor:
// // // // //       'rgba(2, 6, 23, 0.94)',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     padding: 24,
// // // // //     zIndex: 20,
// // // // //   },

// // // // //   startIcon: {
// // // // //     width: 62,
// // // // //     height: 62,
// // // // //     borderRadius: 20,
// // // // //     backgroundColor: '#082F49',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#0369A1',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     marginBottom: 12,
// // // // //   },

// // // // //   startTitle: {
// // // // //     color: '#FFFFFF',
// // // // //     fontSize: 20,
// // // // //     fontWeight: '900',
// // // // //     textAlign: 'center',
// // // // //   },

// // // // //   startDescription: {
// // // // //     color: '#94A3B8',
// // // // //     fontSize: 12,
// // // // //     lineHeight: 18,
// // // // //     textAlign: 'center',
// // // // //     marginTop: 6,
// // // // //     maxWidth: 250,
// // // // //   },

// // // // //   startButton: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     backgroundColor: '#0284C7',
// // // // //     borderRadius: 12,
// // // // //     minHeight: 48,
// // // // //     paddingHorizontal: 22,
// // // // //     marginTop: 16,
// // // // //   },

// // // // //   startButtonText: {
// // // // //     color: '#FFFFFF',
// // // // //     fontSize: 13,
// // // // //     fontWeight: '900',
// // // // //     marginLeft: 7,
// // // // //   },

// // // // //   countdownOverlay: {
// // // // //     position: 'absolute',
// // // // //     top: SAFE_ZONE_HEIGHT,
// // // // //     bottom: FLOOD_HEIGHT,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     backgroundColor:
// // // // //       'rgba(2, 6, 23, 0.85)',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     zIndex: 30,
// // // // //   },

// // // // //   countdownNumber: {
// // // // //     color: '#38BDF8',
// // // // //     fontSize: 64,
// // // // //     fontWeight: '900',
// // // // //   },

// // // // //   countdownText: {
// // // // //     color: '#CBD5E1',
// // // // //     fontSize: 12,
// // // // //     fontWeight: '800',
// // // // //     marginTop: 2,
// // // // //   },

// // // // //   endGameOverlay: {
// // // // //     position: 'absolute',
// // // // //     top: SAFE_ZONE_HEIGHT,
// // // // //     bottom: FLOOD_HEIGHT,
// // // // //     left: 12,
// // // // //     right: 12,
// // // // //     backgroundColor:
// // // // //       'rgba(15, 23, 42, 0.97)',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#334155',
// // // // //     borderRadius: 18,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     padding: 20,
// // // // //     zIndex: 30,
// // // // //   },

// // // // //   resultIcon: {
// // // // //     width: 64,
// // // // //     height: 64,
// // // // //     borderRadius: 20,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     marginBottom: 10,
// // // // //   },

// // // // //   gameOverTitle: {
// // // // //     color: '#EF4444',
// // // // //     fontWeight: '900',
// // // // //     fontSize: 20,
// // // // //     textAlign: 'center',
// // // // //   },

// // // // //   successTitle: {
// // // // //     color: '#10B981',
// // // // //     fontWeight: '900',
// // // // //     fontSize: 20,
// // // // //     textAlign: 'center',
// // // // //   },

// // // // //   gameOverText: {
// // // // //     color: '#94A3B8',
// // // // //     fontSize: 11,
// // // // //     textAlign: 'center',
// // // // //     lineHeight: 17,
// // // // //     marginTop: 7,
// // // // //     maxWidth: 250,
// // // // //   },

// // // // //   finalScore: {
// // // // //     color: '#FFFFFF',
// // // // //     fontSize: 24,
// // // // //     fontWeight: '900',
// // // // //     marginTop: 12,
// // // // //   },

// // // // //   retryButton: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     backgroundColor: '#DC2626',
// // // // //     minHeight: 44,
// // // // //     paddingHorizontal: 20,
// // // // //     borderRadius: 11,
// // // // //     marginTop: 14,
// // // // //   },

// // // // //   claimRewardButton: {
// // // // //     backgroundColor: '#059669',
// // // // //     minHeight: 46,
// // // // //     paddingHorizontal: 22,
// // // // //     borderRadius: 11,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     marginTop: 14,
// // // // //   },

// // // // //   buttonText: {
// // // // //     color: '#FFFFFF',
// // // // //     fontWeight: '900',
// // // // //     fontSize: 12,
// // // // //   },

// // // // //   rewardRow: {
// // // // //     flexDirection: 'row',
// // // // //     marginTop: 14,
// // // // //     gap: 10,
// // // // //   },

// // // // //   reward: {
// // // // //     minWidth: 78,
// // // // //     backgroundColor: '#111827',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#334155',
// // // // //     borderRadius: 10,
// // // // //     paddingVertical: 8,
// // // // //     paddingHorizontal: 10,
// // // // //     alignItems: 'center',
// // // // //   },

// // // // //   rewardValue: {
// // // // //     color: '#FBBF24',
// // // // //     fontSize: 16,
// // // // //     fontWeight: '900',
// // // // //     marginTop: 2,
// // // // //   },

// // // // //   rewardLabel: {
// // // // //     color: '#64748B',
// // // // //     fontSize: 8,
// // // // //     fontWeight: '800',
// // // // //     marginTop: 1,
// // // // //   },

// // // // //   gameHud: {
// // // // //     marginTop: 10,
// // // // //   },

// // // // //   scoreHeader: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent:
// // // // //       'space-between',
// // // // //   },

// // // // //   scoreLabel: {
// // // // //     color: '#64748B',
// // // // //     fontSize: 9,
// // // // //     fontWeight: '900',
// // // // //     letterSpacing: 1,
// // // // //   },

// // // // //   scoreValue: {
// // // // //     color: '#FFFFFF',
// // // // //     fontSize: 16,
// // // // //     fontWeight: '900',
// // // // //   },

// // // // //   progressBackground: {
// // // // //     height: 6,
// // // // //     width: '100%',
// // // // //     backgroundColor: '#1E293B',
// // // // //     borderRadius: 3,
// // // // //     overflow: 'hidden',
// // // // //     marginTop: 5,
// // // // //   },

// // // // //   progressFill: {
// // // // //     height: '100%',
// // // // //     backgroundColor: '#38BDF8',
// // // // //     borderRadius: 3,
// // // // //   },

// // // // //   controls: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent:
// // // // //       'space-between',
// // // // //     marginTop: 11,
// // // // //     gap: 8,
// // // // //   },

// // // // //   controlButton: {
// // // // //     flex: 1,
// // // // //     minHeight: 54,
// // // // //     backgroundColor: '#1E3A8A',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#3B82F6',
// // // // //     borderRadius: 13,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     paddingHorizontal: 5,
// // // // //   },

// // // // //   controlText: {
// // // // //     color: '#BFDBFE',
// // // // //     fontSize: 8,
// // // // //     fontWeight: '900',
// // // // //     marginTop: 2,
// // // // //     textAlign: 'center',
// // // // //   },

// // // // //   controlHint: {
// // // // //     width: 54,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //   },

// // // // //   controlHintText: {
// // // // //     color: '#38BDF8',
// // // // //     fontSize: 7,
// // // // //     fontWeight: '900',
// // // // //     marginTop: 3,
// // // // //     textAlign: 'center',
// // // // //   },
// // // // // });


// // // // import React, {
// // // //   useCallback,
// // // //   useEffect,
// // // //   useRef,
// // // //   useState,
// // // // } from 'react';

// // // // import {
// // // //   View,
// // // //   Text,
// // // //   StyleSheet,
// // // //   TouchableOpacity,
// // // //   Dimensions,
// // // //   BackHandler,
// // // // } from 'react-native';

// // // // import { Ionicons } from '@expo/vector-icons';
// // // // import * as Haptics from 'expo-haptics';
// // // // import { Accelerometer } from 'expo-sensors';
// // // // import { useTranslation } from 'react-i18next';
// // // // import { useNavigation, useRoute } from '@react-navigation/native';

// // // // const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
// // // //   Dimensions.get('window');

// // // // /*
// // // // |--------------------------------------------------------------------------
// // // // | LEVEL CONFIGURATION
// // // // |--------------------------------------------------------------------------
// // // // */

// // // // const LEVEL_CONFIG = {
// // // //   1: {
// // // //     nameKey: 'games.floodRunner.levels.easy',
// // // //     targetScore: 50,

// // // //     debrisSpeed: 155,
// // // //     spawnInterval: 1150,
// // // //     spawnCount: 1,

// // // //     playerSpeed: 300,

// // // //     reward: {
// // // //       xp: 100,
// // // //       coins: 25,
// // // //     },
// // // //   },

// // // //   2: {
// // // //     nameKey: 'games.floodRunner.levels.moderate',
// // // //     targetScore: 75,

// // // //     debrisSpeed: 205,
// // // //     spawnInterval: 900,
// // // //     spawnCount: 2,

// // // //     playerSpeed: 340,

// // // //     reward: {
// // // //       xp: 150,
// // // //       coins: 40,
// // // //     },
// // // //   },

// // // //   3: {
// // // //     nameKey: 'games.floodRunner.levels.advanced',
// // // //     targetScore: 100,

// // // //     debrisSpeed: 255,
// // // //     spawnInterval: 750,
// // // //     spawnCount: 3,

// // // //     playerSpeed: 380,

// // // //     reward: {
// // // //       xp: 200,
// // // //       coins: 60,
// // // //     },
// // // //   },
// // // // };

// // // // const PLAYER_SIZE = 36;
// // // // const DEBRIS_SIZE = 28;

// // // // const SAFE_ZONE_HEIGHT = 56;
// // // // const FLOOD_HEIGHT = 64;

// // // // const PLAYER_BOTTOM_OFFSET = 14;

// // // // const COLLISION_PADDING = 4;

// // // // /*
// // // // |--------------------------------------------------------------------------
// // // // | COMPONENT
// // // // |--------------------------------------------------------------------------
// // // // */

// // // // export default function FloodRunnerGameModal() {
// // // //   const { t } = useTranslation();

// // // //   const navigation = useNavigation();

// // // //   const route = useRoute();

// // // //   /*
// // // //    * The game is now a normal React Navigation screen.
// // // //    *
// // // //    * MissionsScreen can open it with:
// // // //    *
// // // //    * navigation.navigate('FloodRunnerGameModal', {
// // // //    *   level: 1,
// // // //    * });
// // // //    */

// // // //   const routeLevel =
// // // //     route?.params?.level ?? 1;

// // // //   const selectedLevel = Math.min(
// // // //     3,
// // // //     Math.max(
// // // //       1,
// // // //       Number(routeLevel) || 1
// // // //     )
// // // //   );

// // // //   const config =
// // // //     LEVEL_CONFIG[selectedLevel];

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | GAME DIMENSIONS
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const GAME_WIDTH = Math.min(
// // // //     SCREEN_WIDTH - 32,
// // // //     390
// // // //   );

// // // //   const GAME_HEIGHT = Math.min(
// // // //     SCREEN_HEIGHT * 0.52,
// // // //     430
// // // //   );

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | REACT STATE
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const [gameStarted, setGameStarted] =
// // // //     useState(false);

// // // //   const [countdown, setCountdown] =
// // // //     useState(null);

// // // //   const [playerPositionX, setPlayerPositionX] =
// // // //     useState(
// // // //       GAME_WIDTH / 2 -
// // // //         PLAYER_SIZE / 2
// // // //     );

// // // //   const [debris, setDebris] =
// // // //     useState([]);

// // // //   const [score, setScore] =
// // // //     useState(0);

// // // //   const [gameOver, setGameOver] =
// // // //     useState(false);

// // // //   const [hasWon, setHasWon] =
// // // //     useState(false);

// // // //   const [sensorAvailable, setSensorAvailable] =
// // // //     useState(false);

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | REFS
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const playerXRef = useRef(
// // // //     GAME_WIDTH / 2 -
// // // //       PLAYER_SIZE / 2
// // // //   );

// // // //   const debrisRef = useRef([]);

// // // //   const scoreRef = useRef(0);

// // // //   const gameRunningRef =
// // // //     useRef(false);

// // // //   const gameOverRef =
// // // //     useRef(false);

// // // //   const hasWonRef =
// // // //     useRef(false);

// // // //   const movementRef =
// // // //     useRef(0);

// // // //   const animationFrameRef =
// // // //     useRef(null);

// // // //   const lastFrameTimeRef =
// // // //     useRef(null);

// // // //   const lastSpawnTimeRef =
// // // //     useRef(0);

// // // //   const countdownTimerRef =
// // // //     useRef(null);

// // // //   const sensorSubscriptionRef =
// // // //     useRef(null);

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | CLAMP PLAYER
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const clampPlayerX = useCallback(
// // // //     (x) => {
// // // //       return Math.max(
// // // //         0,
// // // //         Math.min(
// // // //           GAME_WIDTH - PLAYER_SIZE,
// // // //           x
// // // //         )
// // // //       );
// // // //     },
// // // //     [GAME_WIDTH]
// // // //   );

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | CREATE DEBRIS
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const createDebrisObject =
// // // //     useCallback(
// // // //       (y = -DEBRIS_SIZE) => {
// // // //         return {
// // // //           id:
// // // //             `${Date.now()}-${Math.random()}`,

// // // //           x:
// // // //             Math.random() *
// // // //             Math.max(
// // // //               1,
// // // //               GAME_WIDTH - DEBRIS_SIZE
// // // //             ),

// // // //           y,
// // // //         };
// // // //       },
// // // //       [GAME_WIDTH]
// // // //     );

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | INITIAL DEBRIS
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const createInitialDebris =
// // // //     useCallback(() => {
// // // //       const objects = [];

// // // //       for (
// // // //         let index = 0;
// // // //         index < config.spawnCount;
// // // //         index += 1
// // // //       ) {
// // // //         objects.push({
// // // //           id:
// // // //             `${Date.now()}-${index}-${Math.random()}`,

// // // //           x:
// // // //             Math.random() *
// // // //             Math.max(
// // // //               1,
// // // //               GAME_WIDTH - DEBRIS_SIZE
// // // //             ),

// // // //           y:
// // // //             -DEBRIS_SIZE -
// // // //             index * 115 -
// // // //             Math.random() * 90,
// // // //         });
// // // //       }

// // // //       return objects;
// // // //     }, [
// // // //       config.spawnCount,
// // // //       GAME_WIDTH,
// // // //     ]);

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | STOP GAME LOOP
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const stopGameLoop = useCallback(() => {
// // // //     gameRunningRef.current =
// // // //       false;

// // // //     if (
// // // //       animationFrameRef.current
// // // //     ) {
// // // //       cancelAnimationFrame(
// // // //         animationFrameRef.current
// // // //       );

// // // //       animationFrameRef.current =
// // // //         null;
// // // //     }

// // // //     lastFrameTimeRef.current =
// // // //       null;
// // // //   }, []);

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | RESET GAME
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const resetGame = useCallback(() => {
// // // //     if (
// // // //       countdownTimerRef.current
// // // //     ) {
// // // //       clearInterval(
// // // //         countdownTimerRef.current
// // // //       );

// // // //       countdownTimerRef.current =
// // // //         null;
// // // //     }

// // // //     stopGameLoop();

// // // //     if (
// // // //       sensorSubscriptionRef.current
// // // //     ) {
// // // //       sensorSubscriptionRef.current.remove();

// // // //       sensorSubscriptionRef.current =
// // // //         null;
// // // //     }

// // // //     const initialX =
// // // //       GAME_WIDTH / 2 -
// // // //       PLAYER_SIZE / 2;

// // // //     playerXRef.current =
// // // //       initialX;

// // // //     debrisRef.current = [];

// // // //     scoreRef.current = 0;

// // // //     gameRunningRef.current =
// // // //       false;

// // // //     gameOverRef.current =
// // // //       false;

// // // //     hasWonRef.current =
// // // //       false;

// // // //     movementRef.current = 0;

// // // //     lastFrameTimeRef.current =
// // // //       null;

// // // //     lastSpawnTimeRef.current =
// // // //       0;

// // // //     setGameStarted(false);
// // // //     setCountdown(null);
// // // //     setPlayerPositionX(initialX);
// // // //     setDebris([]);
// // // //     setScore(0);
// // // //     setGameOver(false);
// // // //     setHasWon(false);
// // // //   }, [
// // // //     GAME_WIDTH,
// // // //     stopGameLoop,
// // // //   ]);

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | GAME OVER
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const finishGame =
// // // //     useCallback(() => {
// // // //       if (
// // // //         !gameRunningRef.current ||
// // // //         gameOverRef.current ||
// // // //         hasWonRef.current
// // // //       ) {
// // // //         return;
// // // //       }

// // // //       gameRunningRef.current =
// // // //         false;

// // // //       gameOverRef.current =
// // // //         true;

// // // //       setGameOver(true);

// // // //       if (
// // // //         animationFrameRef.current
// // // //       ) {
// // // //         cancelAnimationFrame(
// // // //           animationFrameRef.current
// // // //         );

// // // //         animationFrameRef.current =
// // // //           null;
// // // //       }

// // // //       Haptics.impactAsync(
// // // //         Haptics.ImpactFeedbackStyle.Heavy
// // // //       );
// // // //     }, []);

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | WIN
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const winGame =
// // // //     useCallback(() => {
// // // //       if (
// // // //         hasWonRef.current ||
// // // //         gameOverRef.current
// // // //       ) {
// // // //         return;
// // // //       }

// // // //       gameRunningRef.current =
// // // //         false;

// // // //       hasWonRef.current =
// // // //         true;

// // // //       scoreRef.current =
// // // //         config.targetScore;

// // // //       setScore(
// // // //         config.targetScore
// // // //       );

// // // //       setHasWon(true);

// // // //       if (
// // // //         animationFrameRef.current
// // // //       ) {
// // // //         cancelAnimationFrame(
// // // //           animationFrameRef.current
// // // //         );

// // // //         animationFrameRef.current =
// // // //           null;
// // // //       }

// // // //       Haptics.notificationAsync(
// // // //         Haptics.NotificationFeedbackType
// // // //           .Success
// // // //       );
// // // //     }, [
// // // //       config.targetScore,
// // // //     ]);

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | COLLISION
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const checkCollision =
// // // //     useCallback(
// // // //       (playerX, debrisItem) => {
// // // //         const playerLeft =
// // // //           playerX +
// // // //           COLLISION_PADDING;

// // // //         const playerRight =
// // // //           playerX +
// // // //           PLAYER_SIZE -
// // // //           COLLISION_PADDING;

// // // //         const playerTop =
// // // //           GAME_HEIGHT -
// // // //           PLAYER_SIZE -
// // // //           PLAYER_BOTTOM_OFFSET -
// // // //           FLOOD_HEIGHT +
// // // //           COLLISION_PADDING;

// // // //         const playerBottom =
// // // //           playerTop +
// // // //           PLAYER_SIZE -
// // // //           COLLISION_PADDING;

// // // //         const debrisLeft =
// // // //           debrisItem.x +
// // // //           COLLISION_PADDING;

// // // //         const debrisRight =
// // // //           debrisItem.x +
// // // //           DEBRIS_SIZE -
// // // //           COLLISION_PADDING;

// // // //         const debrisTop =
// // // //           debrisItem.y +
// // // //           COLLISION_PADDING;

// // // //         const debrisBottom =
// // // //           debrisItem.y +
// // // //           DEBRIS_SIZE -
// // // //           COLLISION_PADDING;

// // // //         return (
// // // //           playerLeft <
// // // //             debrisRight &&
// // // //           playerRight >
// // // //             debrisLeft &&
// // // //           playerTop <
// // // //             debrisBottom &&
// // // //           playerBottom >
// // // //             debrisTop
// // // //         );
// // // //       },
// // // //       [GAME_HEIGHT]
// // // //     );

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | GAME LOOP
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const runGameLoop =
// // // //     useCallback(
// // // //       (timestamp) => {
// // // //         if (
// // // //           !gameRunningRef.current ||
// // // //           gameOverRef.current ||
// // // //           hasWonRef.current
// // // //         ) {
// // // //           return;
// // // //         }

// // // //         if (
// // // //           lastFrameTimeRef.current ===
// // // //           null
// // // //         ) {
// // // //           lastFrameTimeRef.current =
// // // //             timestamp;
// // // //         }

// // // //         const delta =
// // // //           Math.min(
// // // //             timestamp -
// // // //               lastFrameTimeRef.current,
// // // //             50
// // // //           ) / 1000;

// // // //         lastFrameTimeRef.current =
// // // //           timestamp;

// // // //         /*
// // // //          * PLAYER
// // // //          */

// // // //         const tilt =
// // // //           movementRef.current;

// // // //         let nextPlayerX =
// // // //           playerXRef.current;

// // // //         if (
// // // //           Math.abs(tilt) >= 0.04
// // // //         ) {
// // // //           nextPlayerX +=
// // // //             tilt *
// // // //             config.playerSpeed *
// // // //             delta;
// // // //         }

// // // //         nextPlayerX =
// // // //           clampPlayerX(
// // // //             nextPlayerX
// // // //           );

// // // //         playerXRef.current =
// // // //           nextPlayerX;

// // // //         setPlayerPositionX(
// // // //           nextPlayerX
// // // //         );

// // // //         /*
// // // //          * DEBRIS
// // // //          */

// // // //         const previousDebris =
// // // //           debrisRef.current;

// // // //         const movedDebris =
// // // //           previousDebris.map(
// // // //             (item) => ({
// // // //               ...item,

// // // //               y:
// // // //                 item.y +
// // // //                 config.debrisSpeed *
// // // //                   delta,
// // // //             })
// // // //           );

// // // //         /*
// // // //          * COLLISION
// // // //          */

// // // //         const collision =
// // // //           movedDebris.some(
// // // //             (item) =>
// // // //               checkCollision(
// // // //                 nextPlayerX,
// // // //                 item
// // // //               )
// // // //           );

// // // //         if (collision) {
// // // //           debrisRef.current =
// // // //             movedDebris;

// // // //           setDebris(
// // // //             movedDebris
// // // //           );

// // // //           finishGame();

// // // //           return;
// // // //         }

// // // //         /*
// // // //          * SCORE
// // // //          */

// // // //         let passedCount = 0;

// // // //         const survivingDebris =
// // // //           movedDebris.filter(
// // // //             (item) => {
// // // //               if (
// // // //                 item.y >
// // // //                 GAME_HEIGHT
// // // //               ) {
// // // //                 passedCount += 1;
// // // //                 return false;
// // // //               }

// // // //               return true;
// // // //             }
// // // //           );

// // // //         if (passedCount > 0) {
// // // //           const nextScore =
// // // //             Math.min(
// // // //               config.targetScore,
// // // //               scoreRef.current +
// // // //                 passedCount * 10
// // // //             );

// // // //           scoreRef.current =
// // // //             nextScore;

// // // //           setScore(nextScore);

// // // //           if (
// // // //             nextScore >=
// // // //             config.targetScore
// // // //           ) {
// // // //             debrisRef.current =
// // // //               survivingDebris;

// // // //             setDebris(
// // // //               survivingDebris
// // // //             );

// // // //             winGame();

// // // //             return;
// // // //           }
// // // //         }

// // // //         /*
// // // //          * SPAWN
// // // //          */

// // // //         if (
// // // //           timestamp -
// // // //             lastSpawnTimeRef.current >=
// // // //           config.spawnInterval
// // // //         ) {
// // // //           lastSpawnTimeRef.current =
// // // //             timestamp;

// // // //           if (
// // // //             survivingDebris.length <
// // // //             config.spawnCount
// // // //           ) {
// // // //             survivingDebris.push(
// // // //               createDebrisObject()
// // // //             );
// // // //           }
// // // //         }

// // // //         while (
// // // //           survivingDebris.length >
// // // //           config.spawnCount
// // // //         ) {
// // // //           survivingDebris.shift();
// // // //         }

// // // //         debrisRef.current =
// // // //           survivingDebris;

// // // //         setDebris(
// // // //           survivingDebris
// // // //         );

// // // //         animationFrameRef.current =
// // // //           requestAnimationFrame(
// // // //             runGameLoop
// // // //           );
// // // //       },
// // // //       [
// // // //         clampPlayerX,
// // // //         config.debrisSpeed,
// // // //         config.playerSpeed,
// // // //         config.spawnCount,
// // // //         config.spawnInterval,
// // // //         config.targetScore,
// // // //         createDebrisObject,
// // // //         finishGame,
// // // //         GAME_HEIGHT,
// // // //         checkCollision,
// // // //         winGame,
// // // //       ]
// // // //     );

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | BEGIN GAME
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const beginGame =
// // // //     useCallback(() => {
// // // //       const initialX =
// // // //         GAME_WIDTH / 2 -
// // // //         PLAYER_SIZE / 2;

// // // //       playerXRef.current =
// // // //         initialX;

// // // //       debrisRef.current =
// // // //         createInitialDebris();

// // // //       scoreRef.current = 0;

// // // //       gameRunningRef.current =
// // // //         true;

// // // //       gameOverRef.current =
// // // //         false;

// // // //       hasWonRef.current =
// // // //         false;

// // // //       movementRef.current = 0;

// // // //       lastFrameTimeRef.current =
// // // //         null;

// // // //       lastSpawnTimeRef.current =
// // // //         performance.now();

// // // //       setPlayerPositionX(
// // // //         initialX
// // // //       );

// // // //       setDebris(
// // // //         debrisRef.current
// // // //       );

// // // //       setScore(0);

// // // //       setGameOver(false);

// // // //       setHasWon(false);

// // // //       setGameStarted(true);

// // // //       Haptics.notificationAsync(
// // // //         Haptics.NotificationFeedbackType
// // // //           .Success
// // // //       );

// // // //       animationFrameRef.current =
// // // //         requestAnimationFrame(
// // // //           runGameLoop
// // // //         );
// // // //     }, [
// // // //       GAME_WIDTH,
// // // //       createInitialDebris,
// // // //       runGameLoop,
// // // //     ]);

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | START GAME
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const startGame =
// // // //     useCallback(() => {
// // // //       if (
// // // //         gameRunningRef.current ||
// // // //         countdown !== null
// // // //       ) {
// // // //         return;
// // // //       }

// // // //       /*
// // // //        * Reset retry state.
// // // //        */

// // // //       setGameOver(false);
// // // //       setHasWon(false);

// // // //       gameOverRef.current =
// // // //         false;

// // // //       hasWonRef.current =
// // // //         false;

// // // //       setCountdown(3);

// // // //       let count = 3;

// // // //       Haptics.impactAsync(
// // // //         Haptics.ImpactFeedbackStyle.Light
// // // //       );

// // // //       countdownTimerRef.current =
// // // //         setInterval(() => {
// // // //           count -= 1;

// // // //           if (count <= 0) {
// // // //             if (
// // // //               countdownTimerRef.current
// // // //             ) {
// // // //               clearInterval(
// // // //                 countdownTimerRef.current
// // // //               );
// // // //             }

// // // //             countdownTimerRef.current =
// // // //               null;

// // // //             setCountdown(null);

// // // //             beginGame();

// // // //             return;
// // // //           }

// // // //           setCountdown(count);

// // // //           Haptics.impactAsync(
// // // //             Haptics.ImpactFeedbackStyle.Light
// // // //           );
// // // //         }, 700);
// // // //     }, [
// // // //       beginGame,
// // // //       countdown,
// // // //     ]);

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | TOUCH MOVEMENT
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const movePlayer =
// // // //     useCallback(
// // // //       (direction) => {
// // // //         if (
// // // //           !gameRunningRef.current ||
// // // //           gameOverRef.current ||
// // // //           hasWonRef.current
// // // //         ) {
// // // //           return;
// // // //         }

// // // //         const amount =
// // // //           config.playerSpeed *
// // // //           0.18;

// // // //         let nextX =
// // // //           playerXRef.current;

// // // //         if (
// // // //           direction === 'left'
// // // //         ) {
// // // //           nextX -= amount;
// // // //         } else {
// // // //           nextX += amount;
// // // //         }

// // // //         nextX =
// // // //           clampPlayerX(nextX);

// // // //         playerXRef.current =
// // // //           nextX;

// // // //         setPlayerPositionX(
// // // //           nextX
// // // //         );

// // // //         Haptics.impactAsync(
// // // //           Haptics.ImpactFeedbackStyle.Light
// // // //         );
// // // //       },
// // // //       [
// // // //         clampPlayerX,
// // // //         config.playerSpeed,
// // // //       ]
// // // //     );

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | ACCELEROMETER
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   useEffect(() => {
// // // //     let mounted = true;

// // // //     const setupAccelerometer =
// // // //       async () => {
// // // //         if (
// // // //           !gameStarted ||
// // // //           gameOver ||
// // // //           hasWon
// // // //         ) {
// // // //           return;
// // // //         }

// // // //         try {
// // // //           const available =
// // // //             await Accelerometer.isAvailableAsync();

// // // //           if (!mounted) {
// // // //             return;
// // // //           }

// // // //           if (!available) {
// // // //             setSensorAvailable(false);
// // // //             return;
// // // //           }

// // // //           setSensorAvailable(true);

// // // //           Accelerometer.setUpdateInterval(
// // // //             50
// // // //           );

// // // //           sensorSubscriptionRef.current =
// // // //             Accelerometer.addListener(
// // // //               (data) => {
// // // //                 if (
// // // //                   !gameRunningRef.current
// // // //                 ) {
// // // //                   return;
// // // //                 }

// // // //                 movementRef.current =
// // // //                   data.x;
// // // //               }
// // // //             );
// // // //         } catch (error) {
// // // //           console.log(
// // // //             'FloodRunner accelerometer error:',
// // // //             error
// // // //           );

// // // //           if (mounted) {
// // // //             setSensorAvailable(false);
// // // //           }
// // // //         }
// // // //       };

// // // //     setupAccelerometer();

// // // //     return () => {
// // // //       mounted = false;

// // // //       if (
// // // //         sensorSubscriptionRef.current
// // // //       ) {
// // // //         sensorSubscriptionRef.current.remove();

// // // //         sensorSubscriptionRef.current =
// // // //           null;
// // // //       }
// // // //     };
// // // //   }, [
// // // //     gameStarted,
// // // //     gameOver,
// // // //     hasWon,
// // // //   ]);

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | BACK BUTTON
// // // //   |--------------------------------------------------------------------------
// // // //   |
// // // //   | Do not allow Android back to leave the
// // // //   | screen while the game is actively running.
// // // //   |
// // // //   */

// // // //   useEffect(() => {
// // // //     const subscription =
// // // //       BackHandler.addEventListener(
// // // //         'hardwareBackPress',
// // // //         () => {
// // // //           if (
// // // //             gameRunningRef.current ||
// // // //             countdown !== null
// // // //           ) {
// // // //             return true;
// // // //           }

// // // //           return false;
// // // //         }
// // // //       );

// // // //     return () => {
// // // //       subscription.remove();
// // // //     };
// // // //   }, [
// // // //     countdown,
// // // //   ]);

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | CLEANUP
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   useEffect(() => {
// // // //     return () => {
// // // //       if (
// // // //         countdownTimerRef.current
// // // //       ) {
// // // //         clearInterval(
// // // //           countdownTimerRef.current
// // // //         );
// // // //       }

// // // //       if (
// // // //         animationFrameRef.current
// // // //       ) {
// // // //         cancelAnimationFrame(
// // // //           animationFrameRef.current
// // // //         );
// // // //       }

// // // //       if (
// // // //         sensorSubscriptionRef.current
// // // //       ) {
// // // //         sensorSubscriptionRef.current.remove();
// // // //       }
// // // //     };
// // // //   }, []);

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | CLAIM REWARD
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const handleClaimReward =
// // // //     useCallback(() => {
// // // //       if (
// // // //         !hasWonRef.current
// // // //       ) {
// // // //         return;
// // // //       }

// // // //       /*
// // // //        * For now we simply return to Missions.
// // // //        *
// // // //        * Later you can connect this to your
// // // //        * XP / coins system.
// // // //        */

// // // //       resetGame();

// // // //       navigation.goBack();
// // // //     }, [
// // // //       navigation,
// // // //       resetGame,
// // // //     ]);

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | PROGRESS
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   const progressPercentage =
// // // //     Math.min(
// // // //       100,
// // // //       (score /
// // // //         config.targetScore) *
// // // //         100
// // // //     );

// // // //   /*
// // // //   |--------------------------------------------------------------------------
// // // //   | RENDER
// // // //   |--------------------------------------------------------------------------
// // // //   */

// // // //   return (
// // // //     <View
// // // //       style={styles.screen}
// // // //     >
// // // //       <View
// // // //         style={[
// // // //           styles.modalContentCard,
// // // //           {
// // // //             width:
// // // //               Math.min(
// // // //                 GAME_WIDTH + 32,
// // // //                 SCREEN_WIDTH - 16
// // // //               ),
// // // //           },
// // // //         ]}
// // // //       >
// // // //         {/* HEADER */}

// // // //         <View
// // // //           style={styles.modalHeader}
// // // //         >
// // // //           <View
// // // //             style={
// // // //               styles.headerTitleArea
// // // //             }
// // // //           >
// // // //             <View
// // // //               style={
// // // //                 styles.headerIcon
// // // //               }
// // // //             >
// // // //               <Ionicons
// // // //                 name="water"
// // // //                 size={20}
// // // //                 color="#38BDF8"
// // // //               />
// // // //             </View>

// // // //             <View
// // // //               style={
// // // //                 styles.headerTextArea
// // // //               }
// // // //             >
// // // //               <Text
// // // //                 style={
// // // //                   styles.modalTitle
// // // //                 }
// // // //               >
// // // //                 {t(
// // // //                   'games.floodRunner.title'
// // // //                 )}
// // // //               </Text>

// // // //               <Text
// // // //                 style={
// // // //                   styles.levelLabel
// // // //                 }
// // // //               >
// // // //                 {t(
// // // //                   'games.floodRunner.level',
// // // //                   {
// // // //                     level:
// // // //                       selectedLevel,
// // // //                   }
// // // //                 )}{' '}
// // // //                 •{' '}
// // // //                 {t(
// // // //                   config.nameKey
// // // //                 )}
// // // //               </Text>
// // // //             </View>
// // // //           </View>
// // // //         </View>

// // // //         {/* OBJECTIVE */}

// // // //         <View
// // // //           style={
// // // //             styles.objectiveCard
// // // //           }
// // // //         >
// // // //           <View
// // // //             style={
// // // //               styles.objectiveIcon
// // // //             }
// // // //           >
// // // //             <Ionicons
// // // //               name="flag"
// // // //               size={18}
// // // //               color="#34D399"
// // // //             />
// // // //           </View>

// // // //           <View
// // // //             style={
// // // //               styles.objectiveTextArea
// // // //             }
// // // //           >
// // // //             <Text
// // // //               style={
// // // //                 styles.objectiveTitle
// // // //               }
// // // //             >
// // // //               {t(
// // // //                 'games.floodRunner.objective'
// // // //               )}
// // // //             </Text>

// // // //             <Text
// // // //               style={
// // // //                 styles.objectiveText
// // // //               }
// // // //             >
// // // //               {t(
// // // //                 'games.floodRunner.objectiveDescription'
// // // //               )}
// // // //             </Text>
// // // //           </View>
// // // //         </View>

// // // //         {/* INSTRUCTIONS */}

// // // //         {!gameStarted &&
// // // //           !gameOver &&
// // // //           !hasWon &&
// // // //           countdown === null && (
// // // //             <View
// // // //               style={
// // // //                 styles.instructionsCard
// // // //               }
// // // //             >
// // // //               <View
// // // //                 style={
// // // //                   styles.instructionsHeader
// // // //                 }
// // // //               >
// // // //                 <Ionicons
// // // //                   name="help-circle"
// // // //                   size={20}
// // // //                   color="#FBBF24"
// // // //                 />

// // // //                 <Text
// // // //                   style={
// // // //                     styles.instructionsTitle
// // // //                   }
// // // //                 >
// // // //                   {t(
// // // //                     'games.floodRunner.howToPlay'
// // // //                   )}
// // // //                 </Text>
// // // //               </View>

// // // //               <InstructionRow
// // // //                 icon="swap-horizontal"
// // // //                 text={t(
// // // //                   'games.floodRunner.instructions.move'
// // // //                 )}
// // // //               />

// // // //               <InstructionRow
// // // //                 icon="warning"
// // // //                 text={t(
// // // //                   'games.floodRunner.instructions.avoid'
// // // //                 )}
// // // //               />

// // // //               <InstructionRow
// // // //                 icon="water"
// // // //                 text={t(
// // // //                   'games.floodRunner.instructions.flood'
// // // //                 )}
// // // //               />

// // // //               <InstructionRow
// // // //                 icon="flag"
// // // //                 text={t(
// // // //                   'games.floodRunner.instructions.finish',
// // // //                   {
// // // //                     score:
// // // //                       config.targetScore,
// // // //                   }
// // // //                 )}
// // // //               />
// // // //             </View>
// // // //           )}

// // // //         {/* SENSOR STATUS */}

// // // //         {gameStarted &&
// // // //           !gameOver &&
// // // //           !hasWon && (
// // // //             <View
// // // //               style={
// // // //                 styles.sensorStatus
// // // //               }
// // // //             >
// // // //               <Ionicons
// // // //                 name={
// // // //                   sensorAvailable
// // // //                     ? 'phone-portrait-outline'
// // // //                     : 'hand-left-outline'
// // // //                 }
// // // //                 size={15}
// // // //                 color={
// // // //                   sensorAvailable
// // // //                     ? '#34D399'
// // // //                     : '#FBBF24'
// // // //                 }
// // // //               />

// // // //               <Text
// // // //                 style={[
// // // //                   styles.sensorText,
// // // //                   {
// // // //                     color:
// // // //                       sensorAvailable
// // // //                         ? '#34D399'
// // // //                         : '#FBBF24',
// // // //                   },
// // // //                 ]}
// // // //               >
// // // //                 {sensorAvailable
// // // //                   ? t(
// // // //                       'games.floodRunner.tiltActive'
// // // //                     )
// // // //                   : t(
// // // //                       'games.floodRunner.touchActive'
// // // //                     )}
// // // //               </Text>
// // // //             </View>
// // // //           )}

// // // //         {/* GAME AREA */}

// // // //         <View
// // // //           style={[
// // // //             styles.gameCanvas,
// // // //             {
// // // //               width:
// // // //                 GAME_WIDTH,
// // // //               height:
// // // //                 GAME_HEIGHT,
// // // //             },
// // // //           ]}
// // // //         >
// // // //           {/* SAFE ZONE */}

// // // //           <View
// // // //             style={
// // // //               styles.safeZone
// // // //             }
// // // //           >
// // // //             <View
// // // //               style={
// // // //                 styles.safeZoneIcon
// // // //               }
// // // //             >
// // // //               <Ionicons
// // // //                 name="shield-checkmark"
// // // //                 size={18}
// // // //                 color="#34D399"
// // // //               />
// // // //             </View>

// // // //             <View>
// // // //               <Text
// // // //                 style={
// // // //                   styles.safeZoneTitle
// // // //                 }
// // // //               >
// // // //                 {t(
// // // //                   'games.floodRunner.safeShelter'
// // // //                 )}
// // // //               </Text>

// // // //               <Text
// // // //                 style={
// // // //                   styles.safeZoneSub
// // // //                 }
// // // //               >
// // // //                 {t(
// // // //                   'games.floodRunner.highGround'
// // // //                 )}
// // // //               </Text>
// // // //             </View>
// // // //           </View>

// // // //           {/* DANGER FIELD */}

// // // //           <View
// // // //             style={
// // // //               styles.dangerField
// // // //             }
// // // //           >
// // // //             <View
// // // //               style={
// // // //                 styles.routeLine
// // // //               }
// // // //             />

// // // //             <Text
// // // //               style={
// // // //                 styles.dangerText
// // // //               }
// // // //             >
// // // //               {t(
// // // //                 'games.floodRunner.evacuationRoute'
// // // //               )}
// // // //             </Text>
// // // //           </View>

// // // //           {/* DEBRIS */}

// // // //           {gameStarted &&
// // // //             !gameOver &&
// // // //             !hasWon &&
// // // //             debris.map(
// // // //               (item) => (
// // // //                 <View
// // // //                   key={item.id}
// // // //                   style={[
// // // //                     styles.debrisNode,
// // // //                     {
// // // //                       left:
// // // //                         item.x,
// // // //                       top:
// // // //                         item.y,
// // // //                     },
// // // //                   ]}
// // // //                 >
// // // //                   <Ionicons
// // // //                     name="warning"
// // // //                     size={20}
// // // //                     color="#FCA5A5"
// // // //                   />
// // // //                 </View>
// // // //               )
// // // //             )}

// // // //           {/* PLAYER */}

// // // //           {gameStarted &&
// // // //             !gameOver &&
// // // //             !hasWon && (
// // // //               <View
// // // //                 style={[
// // // //                   styles.playerNode,
// // // //                   {
// // // //                     left:
// // // //                       playerPositionX,

// // // //                     bottom:
// // // //                       PLAYER_BOTTOM_OFFSET +
// // // //                       FLOOD_HEIGHT,
// // // //                   },
// // // //                 ]}
// // // //               >
// // // //                 <Ionicons
// // // //                   name="person"
// // // //                   size={25}
// // // //                   color="#FFFFFF"
// // // //                 />
// // // //               </View>
// // // //             )}

// // // //           {/* FLOOD */}

// // // //           <View
// // // //             style={
// // // //               styles.floodLayer
// // // //             }
// // // //           >
// // // //             <View
// // // //               style={
// // // //                 styles.waveContainer
// // // //               }
// // // //             >
// // // //               {Array.from({
// // // //                 length: 12,
// // // //               }).map(
// // // //                 (_, index) => (
// // // //                   <Text
// // // //                     key={index}
// // // //                     style={
// // // //                       styles.wave
// // // //                     }
// // // //                   >
// // // //                     ~
// // // //                   </Text>
// // // //                 )
// // // //               )}
// // // //             </View>

// // // //             <Text
// // // //               style={
// // // //                 styles.floodLabel
// // // //               }
// // // //             >
// // // //               {t(
// // // //                 'games.floodRunner.floodZone'
// // // //               )}
// // // //             </Text>
// // // //           </View>

// // // //           {/* COUNTDOWN */}

// // // //           {countdown !== null && (
// // // //             <View
// // // //               style={
// // // //                 styles.countdownOverlay
// // // //               }
// // // //             >
// // // //               <Text
// // // //                 style={
// // // //                   styles.countdownNumber
// // // //                 }
// // // //               >
// // // //                 {countdown}
// // // //               </Text>

// // // //               <Text
// // // //                 style={
// // // //                   styles.countdownText
// // // //                 }
// // // //               >
// // // //                 {t(
// // // //                   'games.floodRunner.getReady'
// // // //                 )}
// // // //               </Text>
// // // //             </View>
// // // //           )}

// // // //           {/* START */}

// // // //           {!gameStarted &&
// // // //             countdown === null &&
// // // //             !gameOver &&
// // // //             !hasWon && (
// // // //               <View
// // // //                 style={
// // // //                   styles.startOverlay
// // // //                 }
// // // //               >
// // // //                 <View
// // // //                   style={
// // // //                     styles.startIcon
// // // //                   }
// // // //                 >
// // // //                   <Ionicons
// // // //                     name="walk"
// // // //                     size={34}
// // // //                     color="#38BDF8"
// // // //                   />
// // // //                 </View>

// // // //                 <Text
// // // //                   style={
// // // //                     styles.startTitle
// // // //                   }
// // // //                 >
// // // //                   {t(
// // // //                     'games.floodRunner.ready'
// // // //                   )}
// // // //                 </Text>

// // // //                 <Text
// // // //                   style={
// // // //                     styles.startDescription
// // // //                   }
// // // //                 >
// // // //                   {t(
// // // //                     'games.floodRunner.startDescription'
// // // //                   )}
// // // //                 </Text>

// // // //                 <TouchableOpacity
// // // //                   style={
// // // //                     styles.startButton
// // // //                   }
// // // //                   onPress={
// // // //                     startGame
// // // //                   }
// // // //                   activeOpacity={0.8}
// // // //                 >
// // // //                   <Ionicons
// // // //                     name="play"
// // // //                     size={18}
// // // //                     color="#FFFFFF"
// // // //                   />

// // // //                   <Text
// // // //                     style={
// // // //                       styles.startButtonText
// // // //                     }
// // // //                   >
// // // //                     {t(
// // // //                       'games.floodRunner.start'
// // // //                     )}
// // // //                   </Text>
// // // //                 </TouchableOpacity>
// // // //               </View>
// // // //             )}

// // // //           {/* GAME OVER */}

// // // //           {gameOver && (
// // // //             <View
// // // //               style={
// // // //                 styles.endGameOverlay
// // // //               }
// // // //             >
// // // //               <View
// // // //                 style={[
// // // //                   styles.resultIcon,
// // // //                   {
// // // //                     backgroundColor:
// // // //                       '#450A0A',
// // // //                   },
// // // //                 ]}
// // // //               >
// // // //                 <Ionicons
// // // //                   name="warning"
// // // //                   size={34}
// // // //                   color="#EF4444"
// // // //                 />
// // // //               </View>

// // // //               <Text
// // // //                 style={
// // // //                   styles.gameOverTitle
// // // //                 }
// // // //               >
// // // //                 {t(
// // // //                   'games.floodRunner.failed'
// // // //                 )}
// // // //               </Text>

// // // //               <Text
// // // //                 style={
// // // //                   styles.gameOverText
// // // //                 }
// // // //               >
// // // //                 {t(
// // // //                   'games.floodRunner.failedDescription'
// // // //                 )}
// // // //               </Text>

// // // //               <Text
// // // //                 style={
// // // //                   styles.finalScore
// // // //                 }
// // // //               >
// // // //                 {score} /{' '}
// // // //                 {config.targetScore}
// // // //               </Text>

// // // //               <TouchableOpacity
// // // //                 style={
// // // //                   styles.retryButton
// // // //                 }
// // // //                 onPress={
// // // //                   startGame
// // // //                 }
// // // //                 activeOpacity={0.8}
// // // //               >
// // // //                 <Ionicons
// // // //                   name="refresh"
// // // //                   size={18}
// // // //                   color="#FFFFFF"
// // // //                 />

// // // //                 <Text
// // // //                   style={
// // // //                     styles.buttonText
// // // //                   }
// // // //                 >
// // // //                   {t(
// // // //                     'games.floodRunner.retry'
// // // //                   )}
// // // //                 </Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           )}

// // // //           {/* WIN */}

// // // //           {hasWon && (
// // // //             <View
// // // //               style={
// // // //                 styles.endGameOverlay
// // // //               }
// // // //             >
// // // //               <View
// // // //                 style={[
// // // //                   styles.resultIcon,
// // // //                   {
// // // //                     backgroundColor:
// // // //                       '#064E3B',
// // // //                   },
// // // //                 ]}
// // // //               >
// // // //                 <Ionicons
// // // //                   name="shield-checkmark"
// // // //                   size={36}
// // // //                   color="#10B981"
// // // //                 />
// // // //               </View>

// // // //               <Text
// // // //                 style={
// // // //                   styles.successTitle
// // // //                 }
// // // //               >
// // // //                 {t(
// // // //                   'games.floodRunner.success'
// // // //                 )}
// // // //               </Text>

// // // //               <Text
// // // //                 style={
// // // //                   styles.gameOverText
// // // //                 }
// // // //               >
// // // //                 {t(
// // // //                   'games.floodRunner.successDescription'
// // // //                 )}
// // // //               </Text>

// // // //               <View
// // // //                 style={
// // // //                   styles.rewardRow
// // // //                 }
// // // //               >
// // // //                 <Reward
// // // //                   icon="flash"
// // // //                   value={`+${config.reward.xp}`}
// // // //                   label={t(
// // // //                     'games.floodRunner.xp'
// // // //                   )}
// // // //                 />

// // // //                 <Reward
// // // //                   icon="cash"
// // // //                   value={`+${config.reward.coins}`}
// // // //                   label={t(
// // // //                     'games.floodRunner.coins'
// // // //                   )}
// // // //                 />
// // // //               </View>

// // // //               <TouchableOpacity
// // // //                 style={
// // // //                   styles.claimRewardButton
// // // //                 }
// // // //                 onPress={
// // // //                   handleClaimReward
// // // //                 }
// // // //                 activeOpacity={0.8}
// // // //               >
// // // //                 <Ionicons
// // // //                   name="checkmark-circle"
// // // //                   size={18}
// // // //                   color="#FFFFFF"
// // // //                 />

// // // //                 <Text
// // // //                   style={
// // // //                     styles.buttonText
// // // //                   }
// // // //                 >
// // // //                   {t(
// // // //                     'games.floodRunner.claimReward'
// // // //                   )}
// // // //                 </Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           )}
// // // //         </View>

// // // //         {/* SCORE */}

// // // //         <View
// // // //           style={styles.gameHud}
// // // //         >
// // // //           <View
// // // //             style={
// // // //               styles.scoreHeader
// // // //             }
// // // //           >
// // // //             <Text
// // // //               style={
// // // //                 styles.scoreLabel
// // // //               }
// // // //             >
// // // //               {t(
// // // //                 'games.floodRunner.score'
// // // //               )}
// // // //             </Text>

// // // //             <Text
// // // //               style={
// // // //                 styles.scoreValue
// // // //               }
// // // //             >
// // // //               {score} /{' '}
// // // //               {config.targetScore}
// // // //             </Text>
// // // //           </View>

// // // //           <View
// // // //             style={
// // // //               styles.progressBackground
// // // //             }
// // // //           >
// // // //             <View
// // // //               style={[
// // // //                 styles.progressFill,
// // // //                 {
// // // //                   width:
// // // //                     `${progressPercentage}%`,
// // // //                 },
// // // //               ]}
// // // //             />
// // // //           </View>
// // // //         </View>

// // // //         {/* CONTROLS */}

// // // //         {gameStarted &&
// // // //           !gameOver &&
// // // //           !hasWon && (
// // // //             <View
// // // //               style={
// // // //                 styles.controls
// // // //               }
// // // //             >
// // // //               <TouchableOpacity
// // // //                 style={
// // // //                   styles.controlButton
// // // //                 }
// // // //                 onPress={() =>
// // // //                   movePlayer(
// // // //                     'left'
// // // //                   )
// // // //                 }
// // // //                 activeOpacity={0.7}
// // // //               >
// // // //                 <Ionicons
// // // //                   name="arrow-back"
// // // //                   size={24}
// // // //                   color="#FFFFFF"
// // // //                 />

// // // //                 <Text
// // // //                   style={
// // // //                     styles.controlText
// // // //                   }
// // // //                   numberOfLines={2}
// // // //                 >
// // // //                   {t(
// // // //                     'games.floodRunner.left'
// // // //                   )}
// // // //                 </Text>
// // // //               </TouchableOpacity>

// // // //               <View
// // // //                 style={
// // // //                   styles.controlHint
// // // //                 }
// // // //               >
// // // //                 <Ionicons
// // // //                   name={
// // // //                     sensorAvailable
// // // //                       ? 'phone-portrait-outline'
// // // //                       : 'hand-left-outline'
// // // //                   }
// // // //                   size={21}
// // // //                   color="#38BDF8"
// // // //                 />

// // // //                 <Text
// // // //                   style={
// // // //                     styles.controlHintText
// // // //                   }
// // // //                   numberOfLines={2}
// // // //                 >
// // // //                   {sensorAvailable
// // // //                     ? t(
// // // //                         'games.floodRunner.tilt'
// // // //                       )
// // // //                     : t(
// // // //                         'games.floodRunner.touch'
// // // //                       )}
// // // //                 </Text>
// // // //               </View>

// // // //               <TouchableOpacity
// // // //                 style={
// // // //                   styles.controlButton
// // // //                 }
// // // //                 onPress={() =>
// // // //                   movePlayer(
// // // //                     'right'
// // // //                   )
// // // //                 }
// // // //                 activeOpacity={0.7}
// // // //               >
// // // //                 <Ionicons
// // // //                   name="arrow-forward"
// // // //                   size={24}
// // // //                   color="#FFFFFF"
// // // //                 />

// // // //                 <Text
// // // //                   style={
// // // //                     styles.controlText
// // // //                   }
// // // //                   numberOfLines={2}
// // // //                 >
// // // //                   {t(
// // // //                     'games.floodRunner.right'
// // // //                   )}
// // // //                 </Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           )}
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // }

// // // // /*
// // // // |--------------------------------------------------------------------------
// // // // | INSTRUCTION ROW
// // // // |--------------------------------------------------------------------------
// // // // */

// // // // function InstructionRow({
// // // //   icon,
// // // //   text,
// // // // }) {
// // // //   return (
// // // //     <View
// // // //       style={
// // // //         styles.instructionRow
// // // //       }
// // // //     >
// // // //       <View
// // // //         style={
// // // //           styles.instructionIcon
// // // //         }
// // // //       >
// // // //         <Ionicons
// // // //           name={icon}
// // // //           size={16}
// // // //           color="#38BDF8"
// // // //         />
// // // //       </View>

// // // //       <Text
// // // //         style={
// // // //           styles.instructionText
// // // //         }
// // // //       >
// // // //         {text}
// // // //       </Text>
// // // //     </View>
// // // //   );
// // // // }

// // // // /*
// // // // |--------------------------------------------------------------------------
// // // // | REWARD
// // // // |--------------------------------------------------------------------------
// // // // */

// // // // function Reward({
// // // //   icon,
// // // //   value,
// // // //   label,
// // // // }) {
// // // //   return (
// // // //     <View
// // // //       style={styles.reward}
// // // //     >
// // // //       <Ionicons
// // // //         name={icon}
// // // //         size={18}
// // // //         color="#FBBF24"
// // // //       />

// // // //       <Text
// // // //         style={
// // // //           styles.rewardValue
// // // //         }
// // // //       >
// // // //         {value}
// // // //       </Text>

// // // //       <Text
// // // //         style={
// // // //           styles.rewardLabel
// // // //         }
// // // //       >
// // // //         {label}
// // // //       </Text>
// // // //     </View>
// // // //   );
// // // // }

// // // // /*
// // // // |--------------------------------------------------------------------------
// // // // | STYLES
// // // // |--------------------------------------------------------------------------
// // // // */

// // // // const styles = StyleSheet.create({
// // // //   screen: {
// // // //     flex: 1,
// // // //     backgroundColor: '#020617',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     padding: 8,
// // // //   },

// // // //   modalContentCard: {
// // // //     backgroundColor: '#0F172A',
// // // //     borderWidth: 1,
// // // //     borderColor: '#1E293B',
// // // //     borderRadius: 22,
// // // //     padding: 12,
// // // //     maxWidth: 430,
// // // //     maxHeight: '98%',
// // // //   },

// // // //   modalHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: 10,
// // // //   },

// // // //   headerTitleArea: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     flex: 1,
// // // //   },

// // // //   headerIcon: {
// // // //     width: 38,
// // // //     height: 38,
// // // //     borderRadius: 12,
// // // //     backgroundColor: '#082F49',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     marginRight: 10,
// // // //   },

// // // //   headerTextArea: {
// // // //     flex: 1,
// // // //   },

// // // //   modalTitle: {
// // // //     color: '#FFFFFF',
// // // //     fontSize: 17,
// // // //     fontWeight: '900',
// // // //   },

// // // //   levelLabel: {
// // // //     color: '#38BDF8',
// // // //     fontSize: 11,
// // // //     fontWeight: '800',
// // // //     marginTop: 3,
// // // //   },

// // // //   objectiveCard: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#052E16',
// // // //     borderWidth: 1,
// // // //     borderColor: '#166534',
// // // //     borderRadius: 13,
// // // //     padding: 10,
// // // //     marginBottom: 8,
// // // //   },

// // // //   objectiveIcon: {
// // // //     width: 32,
// // // //     height: 32,
// // // //     borderRadius: 10,
// // // //     backgroundColor: '#064E3B',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     marginRight: 10,
// // // //   },

// // // //   objectiveTextArea: {
// // // //     flex: 1,
// // // //   },

// // // //   objectiveTitle: {
// // // //     color: '#34D399',
// // // //     fontSize: 11,
// // // //     fontWeight: '900',
// // // //     textTransform: 'uppercase',
// // // //   },

// // // //   objectiveText: {
// // // //     color: '#A7F3D0',
// // // //     fontSize: 11,
// // // //     lineHeight: 16,
// // // //     marginTop: 2,
// // // //   },

// // // //   instructionsCard: {
// // // //     backgroundColor: '#111827',
// // // //     borderWidth: 1,
// // // //     borderColor: '#334155',
// // // //     borderRadius: 14,
// // // //     padding: 11,
// // // //     marginBottom: 8,
// // // //   },

// // // //   instructionsHeader: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginBottom: 6,
// // // //   },

// // // //   instructionsTitle: {
// // // //     color: '#FFFFFF',
// // // //     fontSize: 13,
// // // //     fontWeight: '900',
// // // //     marginLeft: 7,
// // // //   },

// // // //   instructionRow: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'flex-start',
// // // //     marginTop: 6,
// // // //   },

// // // //   instructionIcon: {
// // // //     width: 25,
// // // //     height: 25,
// // // //     borderRadius: 8,
// // // //     backgroundColor: '#082F49',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     marginRight: 8,
// // // //   },

// // // //   instructionText: {
// // // //     flex: 1,
// // // //     color: '#CBD5E1',
// // // //     fontSize: 11,
// // // //     lineHeight: 16,
// // // //     paddingTop: 3,
// // // //   },

// // // //   sensorStatus: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     alignSelf: 'flex-start',
// // // //     backgroundColor: '#020617',
// // // //     paddingHorizontal: 9,
// // // //     paddingVertical: 5,
// // // //     borderRadius: 8,
// // // //     marginBottom: 8,
// // // //   },

// // // //   sensorText: {
// // // //     fontSize: 10,
// // // //     fontWeight: '800',
// // // //     marginLeft: 6,
// // // //   },

// // // //   gameCanvas: {
// // // //     backgroundColor: '#020617',
// // // //     borderRadius: 16,
// // // //     borderWidth: 1,
// // // //     borderColor: '#1E293B',
// // // //     position: 'relative',
// // // //     overflow: 'hidden',
// // // //   },

// // // //   safeZone: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     height: SAFE_ZONE_HEIGHT,
// // // //     backgroundColor: '#064E3B',
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#10B981',
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 14,
// // // //     zIndex: 4,
// // // //   },

// // // //   safeZoneIcon: {
// // // //     width: 34,
// // // //     height: 34,
// // // //     borderRadius: 10,
// // // //     backgroundColor: '#065F46',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     marginRight: 9,
// // // //   },

// // // //   safeZoneTitle: {
// // // //     color: '#D1FAE5',
// // // //     fontSize: 11,
// // // //     fontWeight: '900',
// // // //     letterSpacing: 0.5,
// // // //   },

// // // //   safeZoneSub: {
// // // //     color: '#6EE7B7',
// // // //     fontSize: 9,
// // // //     fontWeight: '700',
// // // //     marginTop: 2,
// // // //   },

// // // //   dangerField: {
// // // //     position: 'absolute',
// // // //     top: SAFE_ZONE_HEIGHT,
// // // //     bottom: FLOOD_HEIGHT,
// // // //     left: 0,
// // // //     right: 0,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },

// // // //   routeLine: {
// // // //     position: 'absolute',
// // // //     width: 2,
// // // //     height: '100%',
// // // //     backgroundColor: '#1E293B',
// // // //     opacity: 0.8,
// // // //   },

// // // //   dangerText: {
// // // //     color: '#334155',
// // // //     fontSize: 8,
// // // //     fontWeight: '900',
// // // //     letterSpacing: 1.5,
// // // //     transform: [
// // // //       {
// // // //         rotate: '-90deg',
// // // //       },
// // // //     ],
// // // //   },

// // // //   debrisNode: {
// // // //     position: 'absolute',
// // // //     width: DEBRIS_SIZE,
// // // //     height: DEBRIS_SIZE,
// // // //     borderRadius:
// // // //       DEBRIS_SIZE / 2,
// // // //     backgroundColor: '#450A0A',
// // // //     borderWidth: 1,
// // // //     borderColor: '#EF4444',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     zIndex: 5,
// // // //   },

// // // //   playerNode: {
// // // //     position: 'absolute',
// // // //     width: PLAYER_SIZE,
// // // //     height: PLAYER_SIZE,
// // // //     borderRadius:
// // // //       PLAYER_SIZE / 2,
// // // //     backgroundColor: '#2563EB',
// // // //     borderWidth: 2,
// // // //     borderColor: '#60A5FA',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     zIndex: 6,
// // // //   },

// // // //   floodLayer: {
// // // //     position: 'absolute',
// // // //     bottom: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     height: FLOOD_HEIGHT,
// // // //     backgroundColor: '#075985',
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: '#38BDF8',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     zIndex: 3,
// // // //   },

// // // //   waveContainer: {
// // // //     position: 'absolute',
// // // //     top: -13,
// // // //     left: 0,
// // // //     right: 0,
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-around',
// // // //   },

// // // //   wave: {
// // // //     color: '#38BDF8',
// // // //     fontSize: 24,
// // // //     fontWeight: '900',
// // // //   },

// // // //   floodLabel: {
// // // //     color: '#BAE6FD',
// // // //     fontSize: 9,
// // // //     fontWeight: '900',
// // // //     letterSpacing: 2,
// // // //     marginTop: 12,
// // // //   },

// // // //   startOverlay: {
// // // //     position: 'absolute',
// // // //     top: SAFE_ZONE_HEIGHT,
// // // //     bottom: FLOOD_HEIGHT,
// // // //     left: 0,
// // // //     right: 0,
// // // //     backgroundColor:
// // // //       'rgba(2, 6, 23, 0.94)',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     padding: 20,
// // // //     zIndex: 20,
// // // //   },

// // // //   startIcon: {
// // // //     width: 62,
// // // //     height: 62,
// // // //     borderRadius: 20,
// // // //     backgroundColor: '#082F49',
// // // //     borderWidth: 1,
// // // //     borderColor: '#0369A1',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     marginBottom: 12,
// // // //   },

// // // //   startTitle: {
// // // //     color: '#FFFFFF',
// // // //     fontSize: 20,
// // // //     fontWeight: '900',
// // // //     textAlign: 'center',
// // // //   },

// // // //   startDescription: {
// // // //     color: '#94A3B8',
// // // //     fontSize: 12,
// // // //     lineHeight: 18,
// // // //     textAlign: 'center',
// // // //     marginTop: 6,
// // // //     maxWidth: 250,
// // // //   },

// // // //   startButton: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     backgroundColor: '#0284C7',
// // // //     borderRadius: 12,
// // // //     minHeight: 48,
// // // //     paddingHorizontal: 22,
// // // //     marginTop: 16,
// // // //   },

// // // //   startButtonText: {
// // // //     color: '#FFFFFF',
// // // //     fontSize: 13,
// // // //     fontWeight: '900',
// // // //     marginLeft: 7,
// // // //   },

// // // //   countdownOverlay: {
// // // //     position: 'absolute',
// // // //     top: SAFE_ZONE_HEIGHT,
// // // //     bottom: FLOOD_HEIGHT,
// // // //     left: 0,
// // // //     right: 0,
// // // //     backgroundColor:
// // // //       'rgba(2, 6, 23, 0.85)',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     zIndex: 30,
// // // //   },

// // // //   countdownNumber: {
// // // //     color: '#38BDF8',
// // // //     fontSize: 64,
// // // //     fontWeight: '900',
// // // //   },

// // // //   countdownText: {
// // // //     color: '#CBD5E1',
// // // //     fontSize: 12,
// // // //     fontWeight: '800',
// // // //     marginTop: 2,
// // // //   },

// // // //   endGameOverlay: {
// // // //     position: 'absolute',
// // // //     top: SAFE_ZONE_HEIGHT + 8,
// // // //     bottom: FLOOD_HEIGHT + 8,
// // // //     left: 10,
// // // //     right: 10,
// // // //     backgroundColor:
// // // //       'rgba(15, 23, 42, 0.98)',
// // // //     borderWidth: 1,
// // // //     borderColor: '#334155',
// // // //     borderRadius: 18,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     padding: 18,
// // // //     zIndex: 30,
// // // //   },

// // // //   resultIcon: {
// // // //     width: 64,
// // // //     height: 64,
// // // //     borderRadius: 20,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     marginBottom: 10,
// // // //   },

// // // //   gameOverTitle: {
// // // //     color: '#EF4444',
// // // //     fontWeight: '900',
// // // //     fontSize: 20,
// // // //     textAlign: 'center',
// // // //   },

// // // //   successTitle: {
// // // //     color: '#10B981',
// // // //     fontWeight: '900',
// // // //     fontSize: 20,
// // // //     textAlign: 'center',
// // // //   },

// // // //   gameOverText: {
// // // //     color: '#94A3B8',
// // // //     fontSize: 11,
// // // //     textAlign: 'center',
// // // //     lineHeight: 17,
// // // //     marginTop: 7,
// // // //     maxWidth: 250,
// // // //   },

// // // //   finalScore: {
// // // //     color: '#FFFFFF',
// // // //     fontSize: 24,
// // // //     fontWeight: '900',
// // // //     marginTop: 12,
// // // //   },

// // // //   retryButton: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     backgroundColor: '#DC2626',
// // // //     minHeight: 44,
// // // //     paddingHorizontal: 20,
// // // //     borderRadius: 11,
// // // //     marginTop: 14,
// // // //   },

// // // //   claimRewardButton: {
// // // //     flexDirection: 'row',
// // // //     backgroundColor: '#059669',
// // // //     minHeight: 46,
// // // //     paddingHorizontal: 22,
// // // //     borderRadius: 11,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     marginTop: 14,
// // // //   },

// // // //   buttonText: {
// // // //     color: '#FFFFFF',
// // // //     fontWeight: '900',
// // // //     fontSize: 12,
// // // //     marginLeft: 6,
// // // //   },

// // // //   rewardRow: {
// // // //     flexDirection: 'row',
// // // //     marginTop: 14,
// // // //     gap: 10,
// // // //   },

// // // //   reward: {
// // // //     minWidth: 78,
// // // //     backgroundColor: '#111827',
// // // //     borderWidth: 1,
// // // //     borderColor: '#334155',
// // // //     borderRadius: 10,
// // // //     paddingVertical: 8,
// // // //     paddingHorizontal: 10,
// // // //     alignItems: 'center',
// // // //   },

// // // //   rewardValue: {
// // // //     color: '#FBBF24',
// // // //     fontSize: 16,
// // // //     fontWeight: '900',
// // // //     marginTop: 2,
// // // //   },

// // // //   rewardLabel: {
// // // //     color: '#64748B',
// // // //     fontSize: 8,
// // // //     fontWeight: '800',
// // // //     marginTop: 1,
// // // //   },

// // // //   gameHud: {
// // // //     marginTop: 9,
// // // //   },

// // // //   scoreHeader: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //   },

// // // //   scoreLabel: {
// // // //     color: '#64748B',
// // // //     fontSize: 9,
// // // //     fontWeight: '900',
// // // //     letterSpacing: 1,
// // // //   },

// // // //   scoreValue: {
// // // //     color: '#FFFFFF',
// // // //     fontSize: 16,
// // // //     fontWeight: '900',
// // // //   },

// // // //   progressBackground: {
// // // //     height: 6,
// // // //     width: '100%',
// // // //     backgroundColor: '#1E293B',
// // // //     borderRadius: 3,
// // // //     overflow: 'hidden',
// // // //     marginTop: 5,
// // // //   },

// // // //   progressFill: {
// // // //     height: '100%',
// // // //     backgroundColor: '#38BDF8',
// // // //     borderRadius: 3,
// // // //   },

// // // //   controls: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     marginTop: 9,
// // // //     gap: 8,
// // // //   },

// // // //   controlButton: {
// // // //     flex: 1,
// // // //     minHeight: 54,
// // // //     backgroundColor: '#1E3A8A',
// // // //     borderWidth: 1,
// // // //     borderColor: '#3B82F6',
// // // //     borderRadius: 13,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     paddingHorizontal: 5,
// // // //   },

// // // //   controlText: {
// // // //     color: '#BFDBFE',
// // // //     fontSize: 8,
// // // //     fontWeight: '900',
// // // //     marginTop: 2,
// // // //     textAlign: 'center',
// // // //   },

// // // //   controlHint: {
// // // //     width: 54,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },

// // // //   controlHintText: {
// // // //     color: '#38BDF8',
// // // //     fontSize: 7,
// // // //     fontWeight: '900',
// // // //     marginTop: 3,
// // // //     textAlign: 'center',
// // // //   },
// // // // });




// // // // FloodRunnerGameModal.js

// // // import React, {
// // //   useCallback,
// // //   useEffect,
// // //   useRef,
// // //   useState,
// // // } from 'react';

// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   Dimensions,
// // //   BackHandler,
// // // } from 'react-native';

// // // import { Ionicons } from '@expo/vector-icons';
// // // import * as Haptics from 'expo-haptics';
// // // import { Accelerometer } from 'expo-sensors';
// // // import { useTranslation } from 'react-i18next';
// // // import {
// // //   useNavigation,
// // //   useRoute,
// // // } from '@react-navigation/native';

// // // const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
// // //   Dimensions.get('window');

// // // /*
// // // |--------------------------------------------------------------------------
// // // | LEVEL CONFIGURATION
// // // |--------------------------------------------------------------------------
// // // */

// // // const LEVEL_CONFIG = {
// // //   1: {
// // //     nameKey: 'games.floodRunner.levels.easy',

// // //     targetScore: 50,

// // //     debrisSpeed: 155,
// // //     spawnInterval: 1150,
// // //     spawnCount: 1,

// // //     playerSpeed: 300,

// // //     reward: {
// // //       xp: 100,
// // //       coins: 25,
// // //     },
// // //   },

// // //   2: {
// // //     nameKey: 'games.floodRunner.levels.moderate',

// // //     targetScore: 75,

// // //     debrisSpeed: 205,
// // //     spawnInterval: 900,
// // //     spawnCount: 2,

// // //     playerSpeed: 340,

// // //     reward: {
// // //       xp: 150,
// // //       coins: 40,
// // //     },
// // //   },

// // //   3: {
// // //     nameKey: 'games.floodRunner.levels.advanced',

// // //     targetScore: 100,

// // //     debrisSpeed: 255,
// // //     spawnInterval: 750,
// // //     spawnCount: 3,

// // //     playerSpeed: 380,

// // //     reward: {
// // //       xp: 200,
// // //       coins: 60,
// // //     },
// // //   },
// // // };

// // // /*
// // // |--------------------------------------------------------------------------
// // // | GAME CONSTANTS
// // // |--------------------------------------------------------------------------
// // // */

// // // const PLAYER_SIZE = 36;
// // // const DEBRIS_SIZE = 28;

// // // const SAFE_ZONE_HEIGHT = 56;
// // // const FLOOD_HEIGHT = 64;

// // // const PLAYER_BOTTOM_OFFSET = 14;

// // // const COLLISION_PADDING = 5;

// // // const TOUCH_MOVE_MULTIPLIER = 0.22;

// // // const SENSOR_DEAD_ZONE = 0.05;

// // // /*
// // // |--------------------------------------------------------------------------
// // // | COMPONENT
// // // |--------------------------------------------------------------------------
// // // */

// // // export default function FloodRunnerGameModal() {
// // //   const { t } = useTranslation();

// // //   const navigation = useNavigation();
// // //   const route = useRoute();

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | LEVEL
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const routeLevel = route?.params?.level ?? 1;

// // //   const selectedLevel = Math.min(
// // //     3,
// // //     Math.max(
// // //       1,
// // //       Number(routeLevel) || 1
// // //     )
// // //   );

// // //   const config = LEVEL_CONFIG[selectedLevel];

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | GAME DIMENSIONS
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const GAME_WIDTH = Math.min(
// // //     SCREEN_WIDTH - 32,
// // //     390
// // //   );

// // //   const GAME_HEIGHT = Math.min(
// // //     SCREEN_HEIGHT * 0.52,
// // //     430
// // //   );

// // //   const INITIAL_PLAYER_X =
// // //     GAME_WIDTH / 2 -
// // //     PLAYER_SIZE / 2;

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | STATE
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const [gameStarted, setGameStarted] =
// // //     useState(false);

// // //   const [countdown, setCountdown] =
// // //     useState(null);

// // //   const [playerPositionX, setPlayerPositionX] =
// // //     useState(INITIAL_PLAYER_X);

// // //   const [debris, setDebris] =
// // //     useState([]);

// // //   const [score, setScore] =
// // //     useState(0);

// // //   const [gameOver, setGameOver] =
// // //     useState(false);

// // //   const [hasWon, setHasWon] =
// // //     useState(false);

// // //   const [sensorAvailable, setSensorAvailable] =
// // //     useState(false);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | REFS
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const playerXRef = useRef(
// // //     INITIAL_PLAYER_X
// // //   );

// // //   const debrisRef = useRef([]);

// // //   const scoreRef = useRef(0);

// // //   const gameRunningRef =
// // //     useRef(false);

// // //   const gameOverRef =
// // //     useRef(false);

// // //   const hasWonRef =
// // //     useRef(false);

// // //   const movementRef =
// // //     useRef(0);

// // //   const animationFrameRef =
// // //     useRef(null);

// // //   const lastFrameTimeRef =
// // //     useRef(null);

// // //   const lastSpawnTimeRef =
// // //     useRef(0);

// // //   const countdownTimerRef =
// // //     useRef(null);

// // //   const sensorSubscriptionRef =
// // //     useRef(null);

// // //   /*
// // //    * Prevents an old animation frame from
// // //    * accidentally continuing after restart.
// // //    */
// // //   const gameSessionRef =
// // //     useRef(0);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | HAPTICS
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const safeImpact = useCallback(
// // //     async (style) => {
// // //       try {
// // //         await Haptics.impactAsync(style);
// // //       } catch (error) {
// // //         // Haptics may be unavailable on some devices.
// // //       }
// // //     },
// // //     []
// // //   );

// // //   const safeNotification =
// // //     useCallback(async (type) => {
// // //       try {
// // //         await Haptics.notificationAsync(type);
// // //       } catch (error) {
// // //         // Haptics may be unavailable.
// // //       }
// // //     }, []);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | CLAMP PLAYER
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const clampPlayerX = useCallback(
// // //     (x) => {
// // //       return Math.max(
// // //         0,
// // //         Math.min(
// // //           GAME_WIDTH - PLAYER_SIZE,
// // //           x
// // //         )
// // //       );
// // //     },
// // //     [GAME_WIDTH]
// // //   );

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | CREATE DEBRIS
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const createDebrisObject =
// // //     useCallback(
// // //       (y = -DEBRIS_SIZE) => {
// // //         return {
// // //           id:
// // //             `${Date.now()}-${Math.random()}`,

// // //           x:
// // //             Math.random() *
// // //             Math.max(
// // //               1,
// // //               GAME_WIDTH - DEBRIS_SIZE
// // //             ),

// // //           y,
// // //         };
// // //       },
// // //       [GAME_WIDTH]
// // //     );

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | CREATE INITIAL DEBRIS
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const createInitialDebris =
// // //     useCallback(() => {
// // //       const objects = [];

// // //       /*
// // //        * Start debris at different heights so
// // //        * the player has time to react.
// // //        */

// // //       for (
// // //         let index = 0;
// // //         index < config.spawnCount;
// // //         index += 1
// // //       ) {
// // //         objects.push({
// // //           id:
// // //             `${Date.now()}-${index}-${Math.random()}`,

// // //           x:
// // //             Math.random() *
// // //             Math.max(
// // //               1,
// // //               GAME_WIDTH - DEBRIS_SIZE
// // //             ),

// // //           y:
// // //             -DEBRIS_SIZE -
// // //             index * 120 -
// // //             Math.random() * 100,
// // //         });
// // //       }

// // //       return objects;
// // //     }, [
// // //       config.spawnCount,
// // //       GAME_WIDTH,
// // //     ]);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | STOP SENSOR
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const stopSensor = useCallback(() => {
// // //     if (
// // //       sensorSubscriptionRef.current
// // //     ) {
// // //       try {
// // //         sensorSubscriptionRef.current.remove();
// // //       } catch (error) {
// // //         // Ignore cleanup errors.
// // //       }

// // //       sensorSubscriptionRef.current =
// // //         null;
// // //     }

// // //     movementRef.current = 0;
// // //   }, []);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | STOP GAME LOOP
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const stopGameLoop = useCallback(() => {
// // //     gameRunningRef.current =
// // //       false;

// // //     gameSessionRef.current += 1;

// // //     if (
// // //       animationFrameRef.current !==
// // //       null
// // //     ) {
// // //       cancelAnimationFrame(
// // //         animationFrameRef.current
// // //       );

// // //       animationFrameRef.current =
// // //         null;
// // //     }

// // //     lastFrameTimeRef.current =
// // //       null;
// // //   }, []);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | RESET GAME
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const resetGame = useCallback(() => {
// // //     /*
// // //      * Stop countdown.
// // //      */

// // //     if (
// // //       countdownTimerRef.current
// // //     ) {
// // //       clearInterval(
// // //         countdownTimerRef.current
// // //       );

// // //       countdownTimerRef.current =
// // //         null;
// // //     }

// // //     /*
// // //      * Stop gameplay.
// // //      */

// // //     stopGameLoop();
// // //     stopSensor();

// // //     /*
// // //      * Reset refs.
// // //      */

// // //     playerXRef.current =
// // //       INITIAL_PLAYER_X;

// // //     debrisRef.current = [];

// // //     scoreRef.current = 0;

// // //     gameRunningRef.current =
// // //       false;

// // //     gameOverRef.current =
// // //       false;

// // //     hasWonRef.current =
// // //       false;

// // //     movementRef.current = 0;

// // //     lastFrameTimeRef.current =
// // //       null;

// // //     lastSpawnTimeRef.current =
// // //       0;

// // //     /*
// // //      * Reset state.
// // //      */

// // //     setGameStarted(false);
// // //     setCountdown(null);
// // //     setPlayerPositionX(
// // //       INITIAL_PLAYER_X
// // //     );
// // //     setDebris([]);
// // //     setScore(0);
// // //     setGameOver(false);
// // //     setHasWon(false);
// // //   }, [
// // //     INITIAL_PLAYER_X,
// // //     stopGameLoop,
// // //     stopSensor,
// // //   ]);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | FINISH GAME
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const finishGame =
// // //     useCallback(() => {
// // //       if (
// // //         !gameRunningRef.current ||
// // //         gameOverRef.current ||
// // //         hasWonRef.current
// // //       ) {
// // //         return;
// // //       }

// // //       gameRunningRef.current =
// // //         false;

// // //       gameOverRef.current =
// // //         true;

// // //       stopSensor();

// // //       if (
// // //         animationFrameRef.current !==
// // //         null
// // //       ) {
// // //         cancelAnimationFrame(
// // //           animationFrameRef.current
// // //         );

// // //         animationFrameRef.current =
// // //           null;
// // //       }

// // //       lastFrameTimeRef.current =
// // //         null;

// // //       setGameOver(true);

// // //       safeNotification(
// // //         Haptics.NotificationFeedbackType
// // //           .Error
// // //       );
// // //     }, [
// // //       safeNotification,
// // //       stopSensor,
// // //     ]);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | WIN GAME
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const winGame =
// // //     useCallback(() => {
// // //       if (
// // //         hasWonRef.current ||
// // //         gameOverRef.current
// // //       ) {
// // //         return;
// // //       }

// // //       gameRunningRef.current =
// // //         false;

// // //       hasWonRef.current =
// // //         true;

// // //       stopSensor();

// // //       scoreRef.current =
// // //         config.targetScore;

// // //       setScore(
// // //         config.targetScore
// // //       );

// // //       setHasWon(true);

// // //       if (
// // //         animationFrameRef.current !==
// // //         null
// // //       ) {
// // //         cancelAnimationFrame(
// // //           animationFrameRef.current
// // //         );

// // //         animationFrameRef.current =
// // //           null;
// // //       }

// // //       lastFrameTimeRef.current =
// // //         null;

// // //       safeNotification(
// // //         Haptics.NotificationFeedbackType
// // //           .Success
// // //       );
// // //     }, [
// // //       config.targetScore,
// // //       safeNotification,
// // //       stopSensor,
// // //     ]);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | COLLISION
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const checkCollision =
// // //     useCallback(
// // //       (playerX, debrisItem) => {
// // //         const playerTop =
// // //           GAME_HEIGHT -
// // //           PLAYER_SIZE -
// // //           PLAYER_BOTTOM_OFFSET -
// // //           FLOOD_HEIGHT;

// // //         const playerLeft =
// // //           playerX +
// // //           COLLISION_PADDING;

// // //         const playerRight =
// // //           playerX +
// // //           PLAYER_SIZE -
// // //           COLLISION_PADDING;

// // //         const playerCollisionTop =
// // //           playerTop +
// // //           COLLISION_PADDING;

// // //         const playerCollisionBottom =
// // //           playerTop +
// // //           PLAYER_SIZE -
// // //           COLLISION_PADDING;

// // //         const debrisLeft =
// // //           debrisItem.x +
// // //           COLLISION_PADDING;

// // //         const debrisRight =
// // //           debrisItem.x +
// // //           DEBRIS_SIZE -
// // //           COLLISION_PADDING;

// // //         const debrisTop =
// // //           debrisItem.y +
// // //           COLLISION_PADDING;

// // //         const debrisBottom =
// // //           debrisItem.y +
// // //           DEBRIS_SIZE -
// // //           COLLISION_PADDING;

// // //         return (
// // //           playerLeft <
// // //             debrisRight &&
// // //           playerRight >
// // //             debrisLeft &&
// // //           playerCollisionTop <
// // //             debrisBottom &&
// // //           playerCollisionBottom >
// // //             debrisTop
// // //         );
// // //       },
// // //       [GAME_HEIGHT]
// // //     );

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | GAME LOOP
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const runGameLoop =
// // //     useCallback(
// // //       (timestamp, sessionId) => {
// // //         /*
// // //          * Ignore an animation frame belonging
// // //          * to an old game session.
// // //          */

// // //         if (
// // //           sessionId !==
// // //           gameSessionRef.current
// // //         ) {
// // //           return;
// // //         }

// // //         if (
// // //           !gameRunningRef.current ||
// // //           gameOverRef.current ||
// // //           hasWonRef.current
// // //         ) {
// // //           return;
// // //         }

// // //         /*
// // //          * First frame.
// // //          */

// // //         if (
// // //           lastFrameTimeRef.current ===
// // //           null
// // //         ) {
// // //           lastFrameTimeRef.current =
// // //             timestamp;
// // //         }

// // //         /*
// // //          * Cap delta so the game doesn't
// // //          * jump after a frame-rate drop.
// // //          */

// // //         const delta = Math.min(
// // //           timestamp -
// // //             lastFrameTimeRef.current,
// // //           50
// // //         ) / 1000;

// // //         lastFrameTimeRef.current =
// // //           timestamp;

// // //         /*
// // //          |--------------------------------------------------------------------------
// // //          | PLAYER MOVEMENT
// // //          |--------------------------------------------------------------------------
// // //          */

// // //         let nextPlayerX =
// // //           playerXRef.current;

// // //         const tilt =
// // //           movementRef.current;

// // //         if (
// // //           Math.abs(tilt) >=
// // //           SENSOR_DEAD_ZONE
// // //         ) {
// // //           nextPlayerX +=
// // //             tilt *
// // //             config.playerSpeed *
// // //             delta;
// // //         }

// // //         nextPlayerX =
// // //           clampPlayerX(
// // //             nextPlayerX
// // //           );

// // //         playerXRef.current =
// // //           nextPlayerX;

// // //         setPlayerPositionX(
// // //           nextPlayerX
// // //         );

// // //         /*
// // //          |--------------------------------------------------------------------------
// // //          | MOVE DEBRIS
// // //          |--------------------------------------------------------------------------
// // //          */

// // //         const movedDebris =
// // //           debrisRef.current.map(
// // //             (item) => ({
// // //               ...item,

// // //               y:
// // //                 item.y +
// // //                 config.debrisSpeed *
// // //                   delta,
// // //             })
// // //           );

// // //         /*
// // //          |--------------------------------------------------------------------------
// // //          | COLLISION
// // //          |--------------------------------------------------------------------------
// // //          */

// // //         const collision =
// // //           movedDebris.some(
// // //             (item) =>
// // //               checkCollision(
// // //                 nextPlayerX,
// // //                 item
// // //               )
// // //           );

// // //         if (collision) {
// // //           debrisRef.current =
// // //             movedDebris;

// // //           setDebris(
// // //             movedDebris
// // //           );

// // //           finishGame();

// // //           return;
// // //         }

// // //         /*
// // //          |--------------------------------------------------------------------------
// // //          | SCORE
// // //          |--------------------------------------------------------------------------
// // //          */

// // //         let passedCount = 0;

// // //         const survivingDebris =
// // //           movedDebris.filter(
// // //             (item) => {
// // //               if (
// // //                 item.y >
// // //                 GAME_HEIGHT
// // //               ) {
// // //                 passedCount += 1;
// // //                 return false;
// // //               }

// // //               return true;
// // //             }
// // //           );

// // //         if (
// // //           passedCount > 0
// // //         ) {
// // //           const nextScore =
// // //             Math.min(
// // //               config.targetScore,
// // //               scoreRef.current +
// // //                 passedCount * 10
// // //             );

// // //           scoreRef.current =
// // //             nextScore;

// // //           setScore(nextScore);

// // //           /*
// // //            * Win immediately once the
// // //            * target has been reached.
// // //            */

// // //           if (
// // //             nextScore >=
// // //             config.targetScore
// // //           ) {
// // //             debrisRef.current =
// // //               survivingDebris;

// // //             setDebris(
// // //               survivingDebris
// // //             );

// // //             winGame();

// // //             return;
// // //           }
// // //         }

// // //         /*
// // //          |--------------------------------------------------------------------------
// // //          | SPAWN
// // //          |--------------------------------------------------------------------------
// // //          */

// // //         if (
// // //           timestamp -
// // //             lastSpawnTimeRef.current >=
// // //           config.spawnInterval
// // //         ) {
// // //           lastSpawnTimeRef.current =
// // //             timestamp;

// // //           /*
// // //            * Only spawn if we haven't
// // //            * reached the configured number
// // //            * of active obstacles.
// // //            */

// // //           if (
// // //             survivingDebris.length <
// // //             config.spawnCount
// // //           ) {
// // //             survivingDebris.push(
// // //               createDebrisObject()
// // //             );
// // //           }
// // //         }

// // //         /*
// // //          * Safety limit.
// // //          */

// // //         while (
// // //           survivingDebris.length >
// // //           config.spawnCount
// // //         ) {
// // //           survivingDebris.shift();
// // //         }

// // //         debrisRef.current =
// // //           survivingDebris;

// // //         setDebris(
// // //           survivingDebris
// // //         );

// // //         /*
// // //          |--------------------------------------------------------------------------
// // //          | NEXT FRAME
// // //          |--------------------------------------------------------------------------
// // //          */

// // //         animationFrameRef.current =
// // //           requestAnimationFrame(
// // //             (nextTimestamp) =>
// // //               runGameLoop(
// // //                 nextTimestamp,
// // //                 sessionId
// // //               )
// // //           );
// // //       },
// // //       [
// // //         clampPlayerX,
// // //         config.debrisSpeed,
// // //         config.playerSpeed,
// // //         config.spawnCount,
// // //         config.spawnInterval,
// // //         config.targetScore,
// // //         createDebrisObject,
// // //         finishGame,
// // //         GAME_HEIGHT,
// // //         checkCollision,
// // //         winGame,
// // //       ]
// // //     );

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | BEGIN GAME
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const beginGame =
// // //     useCallback(() => {
// // //       /*
// // //        * Create a new session.
// // //        */

// // //       const sessionId =
// // //         gameSessionRef.current + 1;

// // //       gameSessionRef.current =
// // //         sessionId;

// // //       /*
// // //        * Stop any previous frame.
// // //        */

// // //       if (
// // //         animationFrameRef.current !==
// // //         null
// // //       ) {
// // //         cancelAnimationFrame(
// // //           animationFrameRef.current
// // //         );

// // //         animationFrameRef.current =
// // //           null;
// // //       }

// // //       /*
// // //        * Initial player.
// // //        */

// // //       playerXRef.current =
// // //         INITIAL_PLAYER_X;

// // //       /*
// // //        * Initial obstacles.
// // //        */

// // //       const initialDebris =
// // //         createInitialDebris();

// // //       debrisRef.current =
// // //         initialDebris;

// // //       /*
// // //        * Reset game refs.
// // //        */

// // //       scoreRef.current = 0;

// // //       gameRunningRef.current =
// // //         true;

// // //       gameOverRef.current =
// // //         false;

// // //       hasWonRef.current =
// // //         false;

// // //       movementRef.current = 0;

// // //       lastFrameTimeRef.current =
// // //         null;

// // //       lastSpawnTimeRef.current =
// // //         performance.now();

// // //       /*
// // //        * Update UI.
// // //        */

// // //       setPlayerPositionX(
// // //         INITIAL_PLAYER_X
// // //       );

// // //       setDebris(
// // //         initialDebris
// // //       );

// // //       setScore(0);

// // //       setGameOver(false);

// // //       setHasWon(false);

// // //       setGameStarted(true);

// // //       safeNotification(
// // //         Haptics.NotificationFeedbackType
// // //           .Success
// // //       );

// // //       /*
// // //        * Start loop.
// // //        */

// // //       animationFrameRef.current =
// // //         requestAnimationFrame(
// // //           (timestamp) =>
// // //             runGameLoop(
// // //               timestamp,
// // //               sessionId
// // //             )
// // //         );
// // //     }, [
// // //       INITIAL_PLAYER_X,
// // //       createInitialDebris,
// // //       runGameLoop,
// // //       safeNotification,
// // //     ]);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | START GAME
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const startGame =
// // //     useCallback(() => {
// // //       /*
// // //        * Don't allow multiple starts.
// // //        */

// // //       if (
// // //         gameRunningRef.current ||
// // //         countdown !== null
// // //       ) {
// // //         return;
// // //       }

// // //       /*
// // //        * Clear any previous timer.
// // //        */

// // //       if (
// // //         countdownTimerRef.current
// // //       ) {
// // //         clearInterval(
// // //           countdownTimerRef.current
// // //         );

// // //         countdownTimerRef.current =
// // //           null;
// // //       }

// // //       /*
// // //        * Reset gameplay state,
// // //        * but keep the start screen hidden
// // //        * while counting down.
// // //        */

// // //       stopGameLoop();
// // //       stopSensor();

// // //       playerXRef.current =
// // //         INITIAL_PLAYER_X;

// // //       debrisRef.current = [];

// // //       scoreRef.current = 0;

// // //       gameOverRef.current =
// // //         false;

// // //       hasWonRef.current =
// // //         false;

// // //       gameRunningRef.current =
// // //         false;

// // //       setPlayerPositionX(
// // //         INITIAL_PLAYER_X
// // //       );

// // //       setDebris([]);

// // //       setScore(0);

// // //       setGameOver(false);

// // //       setHasWon(false);

// // //       setGameStarted(false);

// // //       /*
// // //        * Countdown.
// // //        */

// // //       let count = 3;

// // //       setCountdown(count);

// // //       safeImpact(
// // //         Haptics.ImpactFeedbackStyle
// // //           .Light
// // //       );

// // //       countdownTimerRef.current =
// // //         setInterval(() => {
// // //           count -= 1;

// // //           if (count <= 0) {
// // //             clearInterval(
// // //               countdownTimerRef.current
// // //             );

// // //             countdownTimerRef.current =
// // //               null;

// // //             setCountdown(null);

// // //             beginGame();

// // //             return;
// // //           }

// // //           setCountdown(count);

// // //           safeImpact(
// // //             Haptics.ImpactFeedbackStyle
// // //               .Light
// // //           );
// // //         }, 700);
// // //     }, [
// // //       beginGame,
// // //       countdown,
// // //       INITIAL_PLAYER_X,
// // //       safeImpact,
// // //       stopGameLoop,
// // //       stopSensor,
// // //     ]);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | TOUCH MOVEMENT
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const movePlayer =
// // //     useCallback(
// // //       (direction) => {
// // //         if (
// // //           !gameRunningRef.current ||
// // //           gameOverRef.current ||
// // //           hasWonRef.current
// // //         ) {
// // //           return;
// // //         }

// // //         const amount =
// // //           config.playerSpeed *
// // //           TOUCH_MOVE_MULTIPLIER;

// // //         let nextX =
// // //           playerXRef.current;

// // //         if (
// // //           direction === 'left'
// // //         ) {
// // //           nextX -= amount;
// // //         } else if (
// // //           direction === 'right'
// // //         ) {
// // //           nextX += amount;
// // //         }

// // //         nextX =
// // //           clampPlayerX(nextX);

// // //         playerXRef.current =
// // //           nextX;

// // //         setPlayerPositionX(
// // //           nextX
// // //         );

// // //         safeImpact(
// // //           Haptics.ImpactFeedbackStyle
// // //             .Light
// // //         );
// // //       },
// // //       [
// // //         clampPlayerX,
// // //         config.playerSpeed,
// // //         safeImpact,
// // //       ]
// // //     );

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | ACCELEROMETER
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   useEffect(() => {
// // //     let mounted = true;

// // //     const setupAccelerometer =
// // //       async () => {
// // //         /*
// // //          * Only use the sensor while
// // //          * the game is actually active.
// // //          */

// // //         if (
// // //           !gameStarted ||
// // //           gameOver ||
// // //           hasWon
// // //         ) {
// // //           stopSensor();
// // //           return;
// // //         }

// // //         try {
// // //           const available =
// // //             await Accelerometer.isAvailableAsync();

// // //           if (!mounted) {
// // //             return;
// // //           }

// // //           if (!available) {
// // //             setSensorAvailable(false);
// // //             return;
// // //           }

// // //           setSensorAvailable(true);

// // //           Accelerometer.setUpdateInterval(
// // //             50
// // //           );

// // //           /*
// // //            * Remove an older subscription
// // //            * before creating another one.
// // //            */

// // //           stopSensor();

// // //           sensorSubscriptionRef.current =
// // //             Accelerometer.addListener(
// // //               (data) => {
// // //                 if (
// // //                   !gameRunningRef.current
// // //                 ) {
// // //                   return;
// // //                 }

// // //                 /*
// // //                  * X-axis is used for
// // //                  * left/right movement.
// // //                  */

// // //                 const value =
// // //                   Number(data?.x) || 0;

// // //                 movementRef.current =
// // //                   Math.max(
// // //                     -1,
// // //                     Math.min(
// // //                       1,
// // //                       value
// // //                     )
// // //                   );
// // //               }
// // //             );
// // //         } catch (error) {
// // //           console.log(
// // //             'FloodRunner accelerometer error:',
// // //             error
// // //           );

// // //           if (mounted) {
// // //             setSensorAvailable(false);
// // //           }
// // //         }
// // //       };

// // //     setupAccelerometer();

// // //     return () => {
// // //       mounted = false;
// // //       stopSensor();
// // //     };
// // //   }, [
// // //     gameStarted,
// // //     gameOver,
// // //     hasWon,
// // //     stopSensor,
// // //   ]);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | BACK BUTTON
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   useEffect(() => {
// // //     const subscription =
// // //       BackHandler.addEventListener(
// // //         'hardwareBackPress',
// // //         () => {
// // //           /*
// // //            * Prevent leaving while the
// // //            * game or countdown is active.
// // //            */

// // //           if (
// // //             gameRunningRef.current ||
// // //             countdown !== null
// // //           ) {
// // //             return true;
// // //           }

// // //           return false;
// // //         }
// // //       );

// // //     return () => {
// // //       subscription.remove();
// // //     };
// // //   }, [
// // //     countdown,
// // //   ]);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | SCREEN CLEANUP
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   useEffect(() => {
// // //     return () => {
// // //       /*
// // //        * Countdown.
// // //        */

// // //       if (
// // //         countdownTimerRef.current
// // //       ) {
// // //         clearInterval(
// // //           countdownTimerRef.current
// // //         );

// // //         countdownTimerRef.current =
// // //           null;
// // //       }

// // //       /*
// // //        * Animation.
// // //        */

// // //       if (
// // //         animationFrameRef.current !==
// // //         null
// // //       ) {
// // //         cancelAnimationFrame(
// // //           animationFrameRef.current
// // //         );

// // //         animationFrameRef.current =
// // //           null;
// // //       }

// // //       /*
// // //        * Sensor.
// // //        */

// // //       if (
// // //         sensorSubscriptionRef.current
// // //       ) {
// // //         try {
// // //           sensorSubscriptionRef.current.remove();
// // //         } catch (error) {
// // //           // Ignore.
// // //         }

// // //         sensorSubscriptionRef.current =
// // //           null;
// // //       }

// // //       gameRunningRef.current =
// // //         false;
// // //     };
// // //   }, []);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | CLAIM REWARD
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const handleClaimReward =
// // //     useCallback(() => {
// // //       if (
// // //         !hasWonRef.current
// // //       ) {
// // //         return;
// // //       }

// // //       /*
// // //        * Your XP/coins system can be
// // //        * connected here later.
// // //        */

// // //       resetGame();

// // //       navigation.goBack();
// // //     }, [
// // //       navigation,
// // //       resetGame,
// // //     ]);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | PROGRESS
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const progressPercentage =
// // //     Math.min(
// // //       100,
// // //       (score /
// // //         config.targetScore) *
// // //         100
// // //     );

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | RENDER
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   return (
// // //     <View
// // //       style={styles.screen}
// // //     >
// // //       <View
// // //         style={[
// // //           styles.modalContentCard,
// // //           {
// // //             width:
// // //               Math.min(
// // //                 GAME_WIDTH + 32,
// // //                 SCREEN_WIDTH - 16
// // //               ),
// // //           },
// // //         ]}
// // //       >
// // //         {/* HEADER */}

// // //         <View
// // //           style={styles.modalHeader}
// // //         >
// // //           <View
// // //             style={
// // //               styles.headerTitleArea
// // //             }
// // //           >
// // //             <View
// // //               style={
// // //                 styles.headerIcon
// // //               }
// // //             >
// // //               <Ionicons
// // //                 name="water"
// // //                 size={20}
// // //                 color="#38BDF8"
// // //               />
// // //             </View>

// // //             <View
// // //               style={
// // //                 styles.headerTextArea
// // //               }
// // //             >
// // //               <Text
// // //                 style={
// // //                   styles.modalTitle
// // //                 }
// // //               >
// // //                 {t(
// // //                   'games.floodRunner.title'
// // //                 )}
// // //               </Text>

// // //               <Text
// // //                 style={
// // //                   styles.levelLabel
// // //                 }
// // //               >
// // //                 {t(
// // //                   'games.floodRunner.level',
// // //                   {
// // //                     level:
// // //                       selectedLevel,
// // //                   }
// // //                 )}{' '}
// // //                 •{' '}
// // //                 {t(
// // //                   config.nameKey
// // //                 )}
// // //               </Text>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* OBJECTIVE */}

// // //         <View
// // //           style={
// // //             styles.objectiveCard
// // //           }
// // //         >
// // //           <View
// // //             style={
// // //               styles.objectiveIcon
// // //             }
// // //           >
// // //             <Ionicons
// // //               name="flag"
// // //               size={18}
// // //               color="#34D399"
// // //             />
// // //           </View>

// // //           <View
// // //             style={
// // //               styles.objectiveTextArea
// // //             }
// // //           >
// // //             <Text
// // //               style={
// // //                 styles.objectiveTitle
// // //               }
// // //             >
// // //               {t(
// // //                 'games.floodRunner.objective'
// // //               )}
// // //             </Text>

// // //             <Text
// // //               style={
// // //                 styles.objectiveText
// // //               }
// // //             >
// // //               {t(
// // //                 'games.floodRunner.objectiveDescription'
// // //               )}
// // //             </Text>
// // //           </View>
// // //         </View>

// // //         {/* INSTRUCTIONS */}

// // //         {!gameStarted &&
// // //           !gameOver &&
// // //           !hasWon &&
// // //           countdown === null && (
// // //             <View
// // //               style={
// // //                 styles.instructionsCard
// // //               }
// // //             >
// // //               <View
// // //                 style={
// // //                   styles.instructionsHeader
// // //                 }
// // //               >
// // //                 <Ionicons
// // //                   name="help-circle"
// // //                   size={20}
// // //                   color="#FBBF24"
// // //                 />

// // //                 <Text
// // //                   style={
// // //                     styles.instructionsTitle
// // //                   }
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.howToPlay'
// // //                   )}
// // //                 </Text>
// // //               </View>

// // //               <InstructionRow
// // //                 icon="swap-horizontal"
// // //                 text={t(
// // //                   'games.floodRunner.instructions.move'
// // //                 )}
// // //               />

// // //               <InstructionRow
// // //                 icon="warning"
// // //                 text={t(
// // //                   'games.floodRunner.instructions.avoid'
// // //                 )}
// // //               />

// // //               <InstructionRow
// // //                 icon="water"
// // //                 text={t(
// // //                   'games.floodRunner.instructions.flood'
// // //                 )}
// // //               />

// // //               <InstructionRow
// // //                 icon="flag"
// // //                 text={t(
// // //                   'games.floodRunner.instructions.finish',
// // //                   {
// // //                     score:
// // //                       config.targetScore,
// // //                   }
// // //                 )}
// // //               />
// // //             </View>
// // //           )}

// // //         {/* SENSOR STATUS */}

// // //         {gameStarted &&
// // //           !gameOver &&
// // //           !hasWon && (
// // //             <View
// // //               style={
// // //                 styles.sensorStatus
// // //               }
// // //             >
// // //               <Ionicons
// // //                 name={
// // //                   sensorAvailable
// // //                     ? 'phone-portrait-outline'
// // //                     : 'hand-left-outline'
// // //                 }
// // //                 size={15}
// // //                 color={
// // //                   sensorAvailable
// // //                     ? '#34D399'
// // //                     : '#FBBF24'
// // //                 }
// // //               />

// // //               <Text
// // //                 style={[
// // //                   styles.sensorText,
// // //                   {
// // //                     color:
// // //                       sensorAvailable
// // //                         ? '#34D399'
// // //                         : '#FBBF24',
// // //                   },
// // //                 ]}
// // //               >
// // //                 {sensorAvailable
// // //                   ? t(
// // //                       'games.floodRunner.tiltActive'
// // //                     )
// // //                   : t(
// // //                       'games.floodRunner.touchActive'
// // //                     )}
// // //               </Text>
// // //             </View>
// // //           )}

// // //         {/* GAME AREA */}

// // //         <View
// // //           style={[
// // //             styles.gameCanvas,
// // //             {
// // //               width:
// // //                 GAME_WIDTH,
// // //               height:
// // //                 GAME_HEIGHT,
// // //             },
// // //           ]}
// // //         >
// // //           {/* SAFE ZONE */}

// // //           <View
// // //             style={
// // //               styles.safeZone
// // //             }
// // //           >
// // //             <View
// // //               style={
// // //                 styles.safeZoneIcon
// // //               }
// // //             >
// // //               <Ionicons
// // //                 name="shield-checkmark"
// // //                 size={18}
// // //                 color="#34D399"
// // //               />
// // //             </View>

// // //             <View>
// // //               <Text
// // //                 style={
// // //                   styles.safeZoneTitle
// // //                 }
// // //               >
// // //                 {t(
// // //                   'games.floodRunner.safeShelter'
// // //                 )}
// // //               </Text>

// // //               <Text
// // //                 style={
// // //                   styles.safeZoneSub
// // //                 }
// // //               >
// // //                 {t(
// // //                   'games.floodRunner.highGround'
// // //                 )}
// // //               </Text>
// // //             </View>
// // //           </View>

// // //           {/* DANGER FIELD */}

// // //           <View
// // //             style={
// // //               styles.dangerField
// // //             }
// // //           >
// // //             <View
// // //               style={
// // //                 styles.routeLine
// // //               }
// // //             />

// // //             <Text
// // //               style={
// // //                 styles.dangerText
// // //               }
// // //             >
// // //               {t(
// // //                 'games.floodRunner.evacuationRoute'
// // //               )}
// // //             </Text>
// // //           </View>

// // //           {/* DEBRIS */}

// // //           {gameStarted &&
// // //             !gameOver &&
// // //             !hasWon &&
// // //             debris.map(
// // //               (item) => (
// // //                 <View
// // //                   key={item.id}
// // //                   style={[
// // //                     styles.debrisNode,
// // //                     {
// // //                       left:
// // //                         item.x,
// // //                       top:
// // //                         item.y,
// // //                     },
// // //                   ]}
// // //                 >
// // //                   <Ionicons
// // //                     name="warning"
// // //                     size={20}
// // //                     color="#FCA5A5"
// // //                   />
// // //                 </View>
// // //               )
// // //             )}

// // //           {/* PLAYER */}

// // //           {gameStarted &&
// // //             !gameOver &&
// // //             !hasWon && (
// // //               <View
// // //                 style={[
// // //                   styles.playerNode,
// // //                   {
// // //                     left:
// // //                       playerPositionX,

// // //                     bottom:
// // //                       PLAYER_BOTTOM_OFFSET +
// // //                       FLOOD_HEIGHT,
// // //                   },
// // //                 ]}
// // //               >
// // //                 <Ionicons
// // //                   name="person"
// // //                   size={25}
// // //                   color="#FFFFFF"
// // //                 />
// // //               </View>
// // //             )}

// // //           {/* FLOOD */}

// // //           <View
// // //             style={
// // //               styles.floodLayer
// // //             }
// // //           >
// // //             <View
// // //               style={
// // //                 styles.waveContainer
// // //               }
// // //             >
// // //               {Array.from({
// // //                 length: 12,
// // //               }).map(
// // //                 (_, index) => (
// // //                   <Text
// // //                     key={index}
// // //                     style={
// // //                       styles.wave
// // //                     }
// // //                   >
// // //                     ~
// // //                   </Text>
// // //                 )
// // //               )}
// // //             </View>

// // //             <Text
// // //               style={
// // //                 styles.floodLabel
// // //               }
// // //             >
// // //               {t(
// // //                 'games.floodRunner.floodZone'
// // //               )}
// // //             </Text>
// // //           </View>

// // //           {/* COUNTDOWN */}

// // //           {countdown !== null && (
// // //             <View
// // //               style={
// // //                 styles.countdownOverlay
// // //               }
// // //             >
// // //               <Text
// // //                 style={
// // //                   styles.countdownNumber
// // //                 }
// // //               >
// // //                 {countdown}
// // //               </Text>

// // //               <Text
// // //                 style={
// // //                   styles.countdownText
// // //                 }
// // //               >
// // //                 {t(
// // //                   'games.floodRunner.getReady'
// // //                 )}
// // //               </Text>
// // //             </View>
// // //           )}

// // //           {/* START */}

// // //           {!gameStarted &&
// // //             countdown === null &&
// // //             !gameOver &&
// // //             !hasWon && (
// // //               <View
// // //                 style={
// // //                   styles.startOverlay
// // //                 }
// // //               >
// // //                 <View
// // //                   style={
// // //                     styles.startIcon
// // //                   }
// // //                 >
// // //                   <Ionicons
// // //                     name="walk"
// // //                     size={34}
// // //                     color="#38BDF8"
// // //                   />
// // //                 </View>

// // //                 <Text
// // //                   style={
// // //                     styles.startTitle
// // //                   }
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.ready'
// // //                   )}
// // //                 </Text>

// // //                 <Text
// // //                   style={
// // //                     styles.startDescription
// // //                   }
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.startDescription'
// // //                   )}
// // //                 </Text>

// // //                 <TouchableOpacity
// // //                   style={
// // //                     styles.startButton
// // //                   }
// // //                   onPress={
// // //                     startGame
// // //                   }
// // //                   activeOpacity={0.8}
// // //                 >
// // //                   <Ionicons
// // //                     name="play"
// // //                     size={18}
// // //                     color="#FFFFFF"
// // //                   />

// // //                   <Text
// // //                     style={
// // //                       styles.startButtonText
// // //                     }
// // //                   >
// // //                     {t(
// // //                       'games.floodRunner.start'
// // //                     )}
// // //                   </Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             )}

// // //           {/* GAME OVER */}

// // //           {gameOver && (
// // //             <View
// // //               style={
// // //                 styles.endGameOverlay
// // //               }
// // //             >
// // //               <View
// // //                 style={[
// // //                   styles.resultIcon,
// // //                   {
// // //                     backgroundColor:
// // //                       '#450A0A',
// // //                   },
// // //                 ]}
// // //               >
// // //                 <Ionicons
// // //                   name="warning"
// // //                   size={34}
// // //                   color="#EF4444"
// // //                 />
// // //               </View>

// // //               <Text
// // //                 style={
// // //                   styles.gameOverTitle
// // //                 }
// // //               >
// // //                 {t(
// // //                   'games.floodRunner.failed'
// // //                 )}
// // //               </Text>

// // //               <Text
// // //                 style={
// // //                   styles.gameOverText
// // //                 }
// // //               >
// // //                 {t(
// // //                   'games.floodRunner.failedDescription'
// // //                 )}
// // //               </Text>

// // //               <Text
// // //                 style={
// // //                   styles.finalScore
// // //                 }
// // //               >
// // //                 {score} /{' '}
// // //                 {config.targetScore}
// // //               </Text>

// // //               <TouchableOpacity
// // //                 style={
// // //                   styles.retryButton
// // //                 }
// // //                 onPress={
// // //                   startGame
// // //                 }
// // //                 activeOpacity={0.8}
// // //               >
// // //                 <Ionicons
// // //                   name="refresh"
// // //                   size={18}
// // //                   color="#FFFFFF"
// // //                 />

// // //                 <Text
// // //                   style={
// // //                     styles.buttonText
// // //                   }
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.retry'
// // //                   )}
// // //                 </Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           )}

// // //           {/* WIN */}

// // //           {hasWon && (
// // //             <View
// // //               style={
// // //                 styles.endGameOverlay
// // //               }
// // //             >
// // //               <View
// // //                 style={[
// // //                   styles.resultIcon,
// // //                   {
// // //                     backgroundColor:
// // //                       '#064E3B',
// // //                   },
// // //                 ]}
// // //               >
// // //                 <Ionicons
// // //                   name="shield-checkmark"
// // //                   size={36}
// // //                   color="#10B981"
// // //                 />
// // //               </View>

// // //               <Text
// // //                 style={
// // //                   styles.successTitle
// // //                 }
// // //               >
// // //                 {t(
// // //                   'games.floodRunner.success'
// // //                 )}
// // //               </Text>

// // //               <Text
// // //                 style={
// // //                   styles.gameOverText
// // //                 }
// // //               >
// // //                 {t(
// // //                   'games.floodRunner.successDescription'
// // //                 )}
// // //               </Text>

// // //               <View
// // //                 style={
// // //                   styles.rewardRow
// // //                 }
// // //               >
// // //                 <Reward
// // //                   icon="flash"
// // //                   value={`+${config.reward.xp}`}
// // //                   label={t(
// // //                     'games.floodRunner.xp'
// // //                   )}
// // //                 />

// // //                 <Reward
// // //                   icon="cash"
// // //                   value={`+${config.reward.coins}`}
// // //                   label={t(
// // //                     'games.floodRunner.coins'
// // //                   )}
// // //                 />
// // //               </View>

// // //               <TouchableOpacity
// // //                 style={
// // //                   styles.claimRewardButton
// // //                 }
// // //                 onPress={
// // //                   handleClaimReward
// // //                 }
// // //                 activeOpacity={0.8}
// // //               >
// // //                 <Ionicons
// // //                   name="checkmark-circle"
// // //                   size={18}
// // //                   color="#FFFFFF"
// // //                 />

// // //                 <Text
// // //                   style={
// // //                     styles.buttonText
// // //                   }
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.claimReward'
// // //                   )}
// // //                 </Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           )}
// // //         </View>

// // //         {/* SCORE */}

// // //         <View
// // //           style={styles.gameHud}
// // //         >
// // //           <View
// // //             style={
// // //               styles.scoreHeader
// // //             }
// // //           >
// // //             <Text
// // //               style={
// // //                 styles.scoreLabel
// // //               }
// // //             >
// // //               {t(
// // //                 'games.floodRunner.score'
// // //               )}
// // //             </Text>

// // //             <Text
// // //               style={
// // //                 styles.scoreValue
// // //               }
// // //             >
// // //               {score} /{' '}
// // //               {config.targetScore}
// // //             </Text>
// // //           </View>

// // //           <View
// // //             style={
// // //               styles.progressBackground
// // //             }
// // //           >
// // //             <View
// // //               style={[
// // //                 styles.progressFill,
// // //                 {
// // //                   width:
// // //                     `${progressPercentage}%`,
// // //                 },
// // //               ]}
// // //             />
// // //           </View>
// // //         </View>

// // //         {/* CONTROLS */}

// // //         {gameStarted &&
// // //           !gameOver &&
// // //           !hasWon && (
// // //             <View
// // //               style={
// // //                 styles.controls
// // //               }
// // //             >
// // //               <TouchableOpacity
// // //                 style={
// // //                   styles.controlButton
// // //                 }
// // //                 onPress={() =>
// // //                   movePlayer('left')
// // //                 }
// // //                 activeOpacity={0.7}
// // //               >
// // //                 <Ionicons
// // //                   name="arrow-back"
// // //                   size={24}
// // //                   color="#FFFFFF"
// // //                 />

// // //                 <Text
// // //                   style={
// // //                     styles.controlText
// // //                   }
// // //                   numberOfLines={2}
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.left'
// // //                   )}
// // //                 </Text>
// // //               </TouchableOpacity>

// // //               <View
// // //                 style={
// // //                   styles.controlHint
// // //                 }
// // //               >
// // //                 <Ionicons
// // //                   name={
// // //                     sensorAvailable
// // //                       ? 'phone-portrait-outline'
// // //                       : 'hand-left-outline'
// // //                   }
// // //                   size={21}
// // //                   color="#38BDF8"
// // //                 />

// // //                 <Text
// // //                   style={
// // //                     styles.controlHintText
// // //                   }
// // //                   numberOfLines={2}
// // //                 >
// // //                   {sensorAvailable
// // //                     ? t(
// // //                         'games.floodRunner.tilt'
// // //                       )
// // //                     : t(
// // //                         'games.floodRunner.touch'
// // //                       )}
// // //                 </Text>
// // //               </View>

// // //               <TouchableOpacity
// // //                 style={
// // //                   styles.controlButton
// // //                 }
// // //                 onPress={() =>
// // //                   movePlayer('right')
// // //                 }
// // //                 activeOpacity={0.7}
// // //               >
// // //                 <Ionicons
// // //                   name="arrow-forward"
// // //                   size={24}
// // //                   color="#FFFFFF"
// // //                 />

// // //                 <Text
// // //                   style={
// // //                     styles.controlText
// // //                   }
// // //                   numberOfLines={2}
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.right'
// // //                   )}
// // //                 </Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           )}
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // /*
// // // |--------------------------------------------------------------------------
// // // | INSTRUCTION ROW
// // // |--------------------------------------------------------------------------
// // // */

// // // function InstructionRow({
// // //   icon,
// // //   text,
// // // }) {
// // //   return (
// // //     <View
// // //       style={
// // //         styles.instructionRow
// // //       }
// // //     >
// // //       <View
// // //         style={
// // //           styles.instructionIcon
// // //         }
// // //       >
// // //         <Ionicons
// // //           name={icon}
// // //           size={16}
// // //           color="#38BDF8"
// // //         />
// // //       </View>

// // //       <Text
// // //         style={
// // //           styles.instructionText
// // //         }
// // //       >
// // //         {text}
// // //       </Text>
// // //     </View>
// // //   );
// // // }

// // // /*
// // // |--------------------------------------------------------------------------
// // // | REWARD
// // // |--------------------------------------------------------------------------
// // // */

// // // function Reward({
// // //   icon,
// // //   value,
// // //   label,
// // // }) {
// // //   return (
// // //     <View
// // //       style={styles.reward}
// // //     >
// // //       <Ionicons
// // //         name={icon}
// // //         size={18}
// // //         color="#FBBF24"
// // //       />

// // //       <Text
// // //         style={
// // //           styles.rewardValue
// // //         }
// // //       >
// // //         {value}
// // //       </Text>

// // //       <Text
// // //         style={
// // //           styles.rewardLabel
// // //         }
// // //       >
// // //         {label}
// // //       </Text>
// // //     </View>
// // //   );
// // // }

// // // /*
// // // |--------------------------------------------------------------------------
// // // | STYLES
// // // |--------------------------------------------------------------------------
// // // */

// // // const styles = StyleSheet.create({
// // //   screen: {
// // //     flex: 1,
// // //     backgroundColor: '#020617',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     padding: 8,
// // //   },

// // //   modalContentCard: {
// // //     backgroundColor: '#0F172A',
// // //     borderWidth: 1,
// // //     borderColor: '#1E293B',
// // //     borderRadius: 22,
// // //     padding: 12,
// // //     maxWidth: 430,
// // //     maxHeight: '98%',
// // //   },

// // //   modalHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 10,
// // //   },

// // //   headerTitleArea: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },

// // //   headerIcon: {
// // //     width: 38,
// // //     height: 38,
// // //     borderRadius: 12,
// // //     backgroundColor: '#082F49',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     marginRight: 10,
// // //   },

// // //   headerTextArea: {
// // //     flex: 1,
// // //   },

// // //   modalTitle: {
// // //     color: '#FFFFFF',
// // //     fontSize: 17,
// // //     fontWeight: '900',
// // //   },

// // //   levelLabel: {
// // //     color: '#38BDF8',
// // //     fontSize: 11,
// // //     fontWeight: '800',
// // //     marginTop: 3,
// // //   },

// // //   objectiveCard: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#052E16',
// // //     borderWidth: 1,
// // //     borderColor: '#166534',
// // //     borderRadius: 13,
// // //     padding: 10,
// // //     marginBottom: 8,
// // //   },

// // //   objectiveIcon: {
// // //     width: 32,
// // //     height: 32,
// // //     borderRadius: 10,
// // //     backgroundColor: '#064E3B',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     marginRight: 10,
// // //   },

// // //   objectiveTextArea: {
// // //     flex: 1,
// // //   },

// // //   objectiveTitle: {
// // //     color: '#34D399',
// // //     fontSize: 11,
// // //     fontWeight: '900',
// // //     textTransform: 'uppercase',
// // //   },

// // //   objectiveText: {
// // //     color: '#A7F3D0',
// // //     fontSize: 11,
// // //     lineHeight: 16,
// // //     marginTop: 2,
// // //   },

// // //   instructionsCard: {
// // //     backgroundColor: '#111827',
// // //     borderWidth: 1,
// // //     borderColor: '#334155',
// // //     borderRadius: 14,
// // //     padding: 11,
// // //     marginBottom: 8,
// // //   },

// // //   instructionsHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 6,
// // //   },

// // //   instructionsTitle: {
// // //     color: '#FFFFFF',
// // //     fontSize: 13,
// // //     fontWeight: '900',
// // //     marginLeft: 7,
// // //   },

// // //   instructionRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'flex-start',
// // //     marginTop: 6,
// // //   },

// // //   instructionIcon: {
// // //     width: 25,
// // //     height: 25,
// // //     borderRadius: 8,
// // //     backgroundColor: '#082F49',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     marginRight: 8,
// // //   },

// // //   instructionText: {
// // //     flex: 1,
// // //     color: '#CBD5E1',
// // //     fontSize: 11,
// // //     lineHeight: 16,
// // //     paddingTop: 3,
// // //   },

// // //   sensorStatus: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     alignSelf: 'flex-start',
// // //     backgroundColor: '#020617',
// // //     paddingHorizontal: 9,
// // //     paddingVertical: 5,
// // //     borderRadius: 8,
// // //     marginBottom: 8,
// // //   },

// // //   sensorText: {
// // //     fontSize: 10,
// // //     fontWeight: '800',
// // //     marginLeft: 6,
// // //   },

// // //   gameCanvas: {
// // //     backgroundColor: '#020617',
// // //     borderRadius: 16,
// // //     borderWidth: 1,
// // //     borderColor: '#1E293B',
// // //     position: 'relative',
// // //     overflow: 'hidden',
// // //   },

// // //   safeZone: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     height: SAFE_ZONE_HEIGHT,
// // //     backgroundColor: '#064E3B',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#10B981',
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 14,
// // //     zIndex: 4,
// // //   },

// // //   safeZoneIcon: {
// // //     width: 34,
// // //     height: 34,
// // //     borderRadius: 10,
// // //     backgroundColor: '#065F46',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     marginRight: 9,
// // //   },

// // //   safeZoneTitle: {
// // //     color: '#D1FAE5',
// // //     fontSize: 11,
// // //     fontWeight: '900',
// // //     letterSpacing: 0.5,
// // //   },

// // //   safeZoneSub: {
// // //     color: '#6EE7B7',
// // //     fontSize: 9,
// // //     fontWeight: '700',
// // //     marginTop: 2,
// // //   },

// // //   dangerField: {
// // //     position: 'absolute',
// // //     top: SAFE_ZONE_HEIGHT,
// // //     bottom: FLOOD_HEIGHT,
// // //     left: 0,
// // //     right: 0,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },

// // //   routeLine: {
// // //     position: 'absolute',
// // //     width: 2,
// // //     height: '100%',
// // //     backgroundColor: '#1E293B',
// // //     opacity: 0.8,
// // //   },

// // //   dangerText: {
// // //     color: '#334155',
// // //     fontSize: 8,
// // //     fontWeight: '900',
// // //     letterSpacing: 1.5,
// // //     transform: [
// // //       {
// // //         rotate: '-90deg',
// // //       },
// // //     ],
// // //   },

// // //   debrisNode: {
// // //     position: 'absolute',
// // //     width: DEBRIS_SIZE,
// // //     height: DEBRIS_SIZE,
// // //     borderRadius:
// // //       DEBRIS_SIZE / 2,
// // //     backgroundColor: '#450A0A',
// // //     borderWidth: 1,
// // //     borderColor: '#EF4444',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     zIndex: 5,
// // //   },

// // //   playerNode: {
// // //     position: 'absolute',
// // //     width: PLAYER_SIZE,
// // //     height: PLAYER_SIZE,
// // //     borderRadius:
// // //       PLAYER_SIZE / 2,
// // //     backgroundColor: '#2563EB',
// // //     borderWidth: 2,
// // //     borderColor: '#60A5FA',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     zIndex: 6,
// // //   },

// // //   floodLayer: {
// // //     position: 'absolute',
// // //     bottom: 0,
// // //     left: 0,
// // //     right: 0,
// // //     height: FLOOD_HEIGHT,
// // //     backgroundColor: '#075985',
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#38BDF8',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     zIndex: 3,
// // //   },

// // //   waveContainer: {
// // //     position: 'absolute',
// // //     top: -13,
// // //     left: 0,
// // //     right: 0,
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-around',
// // //   },

// // //   wave: {
// // //     color: '#38BDF8',
// // //     fontSize: 24,
// // //     fontWeight: '900',
// // //   },

// // //   floodLabel: {
// // //     color: '#BAE6FD',
// // //     fontSize: 9,
// // //     fontWeight: '900',
// // //     letterSpacing: 2,
// // //     marginTop: 12,
// // //   },

// // //   startOverlay: {
// // //     position: 'absolute',
// // //     top: SAFE_ZONE_HEIGHT,
// // //     bottom: FLOOD_HEIGHT,
// // //     left: 0,
// // //     right: 0,
// // //     backgroundColor:
// // //       'rgba(2, 6, 23, 0.94)',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     padding: 20,
// // //     zIndex: 20,
// // //   },

// // //   startIcon: {
// // //     width: 62,
// // //     height: 62,
// // //     borderRadius: 20,
// // //     backgroundColor: '#082F49',
// // //     borderWidth: 1,
// // //     borderColor: '#0369A1',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     marginBottom: 12,
// // //   },

// // //   startTitle: {
// // //     color: '#FFFFFF',
// // //     fontSize: 20,
// // //     fontWeight: '900',
// // //     textAlign: 'center',
// // //   },

// // //   startDescription: {
// // //     color: '#94A3B8',
// // //     fontSize: 12,
// // //     lineHeight: 18,
// // //     textAlign: 'center',
// // //     marginTop: 6,
// // //     maxWidth: 250,
// // //   },

// // //   startButton: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     backgroundColor: '#0284C7',
// // //     borderRadius: 12,
// // //     minHeight: 48,
// // //     paddingHorizontal: 22,
// // //     marginTop: 16,
// // //   },

// // //   startButtonText: {
// // //     color: '#FFFFFF',
// // //     fontSize: 13,
// // //     fontWeight: '900',
// // //     marginLeft: 7,
// // //   },

// // //   countdownOverlay: {
// // //     position: 'absolute',
// // //     top: SAFE_ZONE_HEIGHT,
// // //     bottom: FLOOD_HEIGHT,
// // //     left: 0,
// // //     right: 0,
// // //     backgroundColor:
// // //       'rgba(2, 6, 23, 0.85)',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     zIndex: 30,
// // //   },

// // //   countdownNumber: {
// // //     color: '#38BDF8',
// // //     fontSize: 64,
// // //     fontWeight: '900',
// // //   },

// // //   countdownText: {
// // //     color: '#CBD5E1',
// // //     fontSize: 12,
// // //     fontWeight: '800',
// // //     marginTop: 2,
// // //   },

// // //   endGameOverlay: {
// // //     position: 'absolute',
// // //     top: SAFE_ZONE_HEIGHT + 8,
// // //     bottom: FLOOD_HEIGHT + 8,
// // //     left: 10,
// // //     right: 10,
// // //     backgroundColor:
// // //       'rgba(15, 23, 42, 0.98)',
// // //     borderWidth: 1,
// // //     borderColor: '#334155',
// // //     borderRadius: 18,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     padding: 18,
// // //     zIndex: 30,
// // //   },

// // //   resultIcon: {
// // //     width: 64,
// // //     height: 64,
// // //     borderRadius: 20,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     marginBottom: 10,
// // //   },

// // //   gameOverTitle: {
// // //     color: '#EF4444',
// // //     fontWeight: '900',
// // //     fontSize: 20,
// // //     textAlign: 'center',
// // //   },

// // //   successTitle: {
// // //     color: '#10B981',
// // //     fontWeight: '900',
// // //     fontSize: 20,
// // //     textAlign: 'center',
// // //   },

// // //   gameOverText: {
// // //     color: '#94A3B8',
// // //     fontSize: 11,
// // //     textAlign: 'center',
// // //     lineHeight: 17,
// // //     marginTop: 7,
// // //     maxWidth: 250,
// // //   },

// // //   finalScore: {
// // //     color: '#FFFFFF',
// // //     fontSize: 24,
// // //     fontWeight: '900',
// // //     marginTop: 12,
// // //   },

// // //   retryButton: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     backgroundColor: '#DC2626',
// // //     minHeight: 44,
// // //     paddingHorizontal: 20,
// // //     borderRadius: 11,
// // //     marginTop: 14,
// // //   },

// // //   claimRewardButton: {
// // //     flexDirection: 'row',
// // //     backgroundColor: '#059669',
// // //     minHeight: 46,
// // //     paddingHorizontal: 22,
// // //     borderRadius: 11,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     marginTop: 14,
// // //   },

// // //   buttonText: {
// // //     color: '#FFFFFF',
// // //     fontWeight: '900',
// // //     fontSize: 12,
// // //     marginLeft: 6,
// // //   },

// // //   rewardRow: {
// // //     flexDirection: 'row',
// // //     marginTop: 14,
// // //     gap: 10,
// // //   },

// // //   reward: {
// // //     minWidth: 78,
// // //     backgroundColor: '#111827',
// // //     borderWidth: 1,
// // //     borderColor: '#334155',
// // //     borderRadius: 10,
// // //     paddingVertical: 8,
// // //     paddingHorizontal: 10,
// // //     alignItems: 'center',
// // //   },

// // //   rewardValue: {
// // //     color: '#FBBF24',
// // //     fontSize: 16,
// // //     fontWeight: '900',
// // //     marginTop: 2,
// // //   },

// // //   rewardLabel: {
// // //     color: '#64748B',
// // //     fontSize: 8,
// // //     fontWeight: '800',
// // //     marginTop: 1,
// // //   },

// // //   gameHud: {
// // //     marginTop: 9,
// // //   },

// // //   scoreHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //   },

// // //   scoreLabel: {
// // //     color: '#64748B',
// // //     fontSize: 9,
// // //     fontWeight: '900',
// // //     letterSpacing: 1,
// // //   },

// // //   scoreValue: {
// // //     color: '#FFFFFF',
// // //     fontSize: 16,
// // //     fontWeight: '900',
// // //   },

// // //   progressBackground: {
// // //     height: 6,
// // //     width: '100%',
// // //     backgroundColor: '#1E293B',
// // //     borderRadius: 3,
// // //     overflow: 'hidden',
// // //     marginTop: 5,
// // //   },

// // //   progressFill: {
// // //     height: '100%',
// // //     backgroundColor: '#38BDF8',
// // //     borderRadius: 3,
// // //   },

// // //   controls: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     marginTop: 9,
// // //     gap: 8,
// // //   },

// // //   controlButton: {
// // //     flex: 1,
// // //     minHeight: 54,
// // //     backgroundColor: '#1E3A8A',
// // //     borderWidth: 1,
// // //     borderColor: '#3B82F6',
// // //     borderRadius: 13,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingHorizontal: 5,
// // //   },

// // //   controlText: {
// // //     color: '#BFDBFE',
// // //     fontSize: 8,
// // //     fontWeight: '900',
// // //     marginTop: 2,
// // //     textAlign: 'center',
// // //   },

// // //   controlHint: {
// // //     width: 54,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },

// // //   controlHintText: {
// // //     color: '#38BDF8',
// // //     fontSize: 7,
// // //     fontWeight: '900',
// // //     marginTop: 3,
// // //     textAlign: 'center',
// // //   },
// // // });


// // import React, {
// //   useCallback,
// //   useEffect,
// //   useMemo,
// //   useRef,
// //   useState,
// // } from 'react';

// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Dimensions,
// //   BackHandler,
// // } from 'react-native';

// // import { Ionicons } from '@expo/vector-icons';
// // import * as Haptics from 'expo-haptics';
// // import { Accelerometer } from 'expo-sensors';
// // import { useTranslation } from 'react-i18next';
// // import { useNavigation, useRoute } from '@react-navigation/native';
// // import { useUser } from '../contexts/UserContext';

// // const { width: SCREEN_WIDTH, 
// //         height: SCREEN_HEIGHT 
// //       } = Dimensions.get('window');

// // /*
// // |--------------------------------------------------------------------------
// // | LEVEL CONFIGURATION
// // |--------------------------------------------------------------------------
// // */

// // const LEVEL_CONFIG = {
// //   1: {
// //     nameKey: 'games.floodRunner.levels.easy',

// //     targetScore: 50,

// //     debrisSpeed: 155,
// //     spawnInterval: 1150,
// //     spawnCount: 1,

// //     playerSpeed: 300,

// //     reward: {
// //       xp: 100,
// //       coins: 25,
// //     },
// //   },

// //   2: {
// //     nameKey: 'games.floodRunner.levels.moderate',

// //     targetScore: 75,

// //     debrisSpeed: 205,
// //     spawnInterval: 900,
// //     spawnCount: 2,

// //     playerSpeed: 340,

// //     reward: {
// //       xp: 150,
// //       coins: 40,
// //     },
// //   },

// //   3: {
// //     nameKey: 'games.floodRunner.levels.advanced',

// //     targetScore: 100,

// //     debrisSpeed: 255,
// //     spawnInterval: 750,
// //     spawnCount: 3,

// //     playerSpeed: 380,

// //     reward: {
// //       xp: 200,
// //       coins: 60,
// //     },
// //   },
// // };

// // /*
// // |--------------------------------------------------------------------------
// // | GAME CONSTANTS
// // |--------------------------------------------------------------------------
// // */

// // const PLAYER_SIZE = 36;
// // const DEBRIS_SIZE = 28;

// // const SAFE_ZONE_HEIGHT = 56;
// // const FLOOD_HEIGHT = 64;

// // const PLAYER_BOTTOM_OFFSET = 14;

// // const COLLISION_PADDING = 5;

// // const TOUCH_MOVE_MULTIPLIER = 0.22;

// // const SENSOR_DEAD_ZONE = 0.05;

// // /*
// // |--------------------------------------------------------------------------
// // | ADAPTIVE SAFETY CONSTANTS
// // |--------------------------------------------------------------------------
// // |
// // | This is the core of the Adaptive Safety-Aware Difficulty Algorithm.
// // |
// // | The algorithm keeps difficulty bounded between:
// // |
// // |   0.78 = substantially easier
// // |   1.15 = moderately harder
// // |
// // | The player can therefore never be pushed into an unlimited
// // | difficulty spiral.
// // |--------------------------------------------------------------------------
// // */

// // const MIN_DIFFICULTY_FACTOR = 0.78;
// // const MAX_DIFFICULTY_FACTOR = 1.15;

// // const NEAR_MISS_DISTANCE = 34;

// // const RISK_INCREASE_COLLISION = 28;
// // const RISK_INCREASE_NEAR_MISS = 5;

// // const RISK_DECREASE_SUCCESS = 1.5;
// // const RISK_DECREASE_CORRECT_RESCUE = 12;

// // const RISK_UPDATE_INTERVAL = 1000;

// // /*
// // |--------------------------------------------------------------------------
// // | RESCUE SYSTEM
// // |--------------------------------------------------------------------------
// // */

// // const MAX_RESCUE_LIVES = 1;

// // const RESCUE_POINTS = 15;

// // /*
// // |--------------------------------------------------------------------------
// // | RESCUE QUESTIONS
// // |--------------------------------------------------------------------------
// // */

// // const RESCUE_QUESTIONS = [
// //   {
// //     id: 'q1',

// //     questionKey:
// //       'games.floodRunner.questions.q1.question',

// //     options: [
// //       {
// //         id: 'a',
// //         textKey:
// //           'games.floodRunner.questions.q1.a',
// //       },
// //       {
// //         id: 'b',
// //         textKey:
// //           'games.floodRunner.questions.q1.b',
// //       },
// //       {
// //         id: 'c',
// //         textKey:
// //           'games.floodRunner.questions.q1.c',
// //       },
// //     ],

// //     correct: 'b',
// //   },

// //   {
// //     id: 'q2',

// //     questionKey:
// //       'games.floodRunner.questions.q2.question',

// //     options: [
// //       {
// //         id: 'a',
// //         textKey:
// //           'games.floodRunner.questions.q2.a',
// //       },
// //       {
// //         id: 'b',
// //         textKey:
// //           'games.floodRunner.questions.q2.b',
// //       },
// //       {
// //         id: 'c',
// //         textKey:
// //           'games.floodRunner.questions.q2.c',
// //       },
// //     ],

// //     correct: 'a',
// //   },

// //   {
// //     id: 'q3',

// //     questionKey:
// //       'games.floodRunner.questions.q3.question',

// //     options: [
// //       {
// //         id: 'a',
// //         textKey:
// //           'games.floodRunner.questions.q3.a',
// //       },
// //       {
// //         id: 'b',
// //         textKey:
// //           'games.floodRunner.questions.q3.b',
// //       },
// //       {
// //         id: 'c',
// //         textKey:
// //           'games.floodRunner.questions.q3.c',
// //       },
// //     ],

// //     correct: 'c',
// //   },

// //   {
// //     id: 'q4',

// //     questionKey:
// //       'games.floodRunner.questions.q4.question',

// //     options: [
// //       {
// //         id: 'a',
// //         textKey:
// //           'games.floodRunner.questions.q4.a',
// //       },
// //       {
// //         id: 'b',
// //         textKey:
// //           'games.floodRunner.questions.q4.b',
// //       },
// //       {
// //         id: 'c',
// //         textKey:
// //           'games.floodRunner.questions.q4.c',
// //       },
// //     ],

// //     correct: 'a',
// //   },

// //   {
// //     id: 'q5',

// //     questionKey:
// //       'games.floodRunner.questions.q5.question',

// //     options: [
// //       {
// //         id: 'a',
// //         textKey:
// //           'games.floodRunner.questions.q5.a',
// //       },
// //       {
// //         id: 'b',
// //         textKey:
// //           'games.floodRunner.questions.q5.b',
// //       },
// //       {
// //         id: 'c',
// //         textKey:
// //           'games.floodRunner.questions.q5.c',
// //       },
// //     ],

// //     correct: 'b',
// //   },
// // ];

// // /*
// // |--------------------------------------------------------------------------
// // | HELPERS
// // |--------------------------------------------------------------------------
// // */

// // function clamp(value, min, max) {
// //   return Math.max(
// //     min,
// //     Math.min(max, value)
// //   );
// // }

// // function getRandomQuestion() {
// //   const index = Math.floor(
// //     Math.random() *
// //       RESCUE_QUESTIONS.length
// //   );

// //   return RESCUE_QUESTIONS[index];
// // }

// // /*
// // |--------------------------------------------------------------------------
// // | COMPONENT
// // |--------------------------------------------------------------------------
// // */

// // export default function FloodRunnerGameModal() {
// //   const { t } = useTranslation();
// //   const { updatePoints, addPrepCoins, completeMission } = useUser();
// //   const navigation = useNavigation(); 
// //   const route = useRoute();

// //   /*
// //   |--------------------------------------------------------------------------
// //   | LEVEL
// //   |--------------------------------------------------------------------------
// //   */

// //   const routeLevel = route?.params?.level ?? 1;

// //   const selectedLevel = Math.min(
// //     3,
// //     Math.max(
// //       1,
// //       Number(routeLevel) || 1
// //     )
// //   );

// //   const config =
// //     LEVEL_CONFIG[selectedLevel];

// //   /*
// //   |--------------------------------------------------------------------------
// //   | GAME DIMENSIONS
// //   |--------------------------------------------------------------------------
// //   */

// //   const GAME_WIDTH = Math.min(
// //     SCREEN_WIDTH - 32,
// //     390
// //   );

// //   const GAME_HEIGHT = Math.min(
// //     SCREEN_HEIGHT * 0.52,
// //     430
// //   );

// //   const INITIAL_PLAYER_X =
// //     GAME_WIDTH / 2 -
// //     PLAYER_SIZE / 2;

// //   /*
// //   |--------------------------------------------------------------------------
// //   | STATE
// //   |--------------------------------------------------------------------------
// //   */

// //   const [gameStarted, setGameStarted] =
// //     useState(false);

// //   const [countdown, setCountdown] =
// //     useState(null);

// //   const [playerPositionX, setPlayerPositionX] =
// //     useState(INITIAL_PLAYER_X);

// //   const [debris, setDebris] =
// //     useState([]);

// //   const [score, setScore] =
// //     useState(0);

// //   const [gameOver, setGameOver] =
// //     useState(false);

// //   const [hasWon, setHasWon] =
// //     useState(false);

// //   const [sensorAvailable, setSensorAvailable] =
// //     useState(false);

// //   const [rescueVisible, setRescueVisible] =
// //     useState(false);

// //   const [rescueQuestion, setRescueQuestion] =
// //     useState(null);

// //   const [rescueLives, setRescueLives] =
// //     useState(MAX_RESCUE_LIVES);

// //   const [selectedAnswer, setSelectedAnswer] =
// //     useState(null);

// //   const [answerFeedback, setAnswerFeedback] =
// //     useState(null);

// //   const [riskScore, setRiskScore] =
// //     useState(50);

// //   const [difficultyFactor, setDifficultyFactor] =
// //     useState(1);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | REFS
// //   |--------------------------------------------------------------------------
// //   */

// //   const playerXRef =
// //     useRef(INITIAL_PLAYER_X);

// //   const debrisRef =
// //     useRef([]);

// //   const scoreRef =
// //     useRef(0);

// //   const gameRunningRef =
// //     useRef(false);

// //   const gameOverRef =
// //     useRef(false);

// //   const hasWonRef =
// //     useRef(false);

// //   const movementRef =
// //     useRef(0);

// //   const animationFrameRef =
// //     useRef(null);

// //   const lastFrameTimeRef =
// //     useRef(null);

// //   const lastSpawnTimeRef =
// //     useRef(0);

// //   const countdownTimerRef =
// //     useRef(null);

// //   const sensorSubscriptionRef =
// //     useRef(null);

// //   const gameSessionRef =
// //     useRef(0);

// //   /*
// //    * Adaptive algorithm state.
// //    */
// //   const adaptiveRef =
// //     useRef({
// //       riskScore: 50,

// //       nearMisses: 0,

// //       successfulDodges: 0,

// //       collisions: 0,

// //       correctRescues: 0,

// //       lastRiskUpdate: 0,
// //     });

// //   /*
// //   |--------------------------------------------------------------------------
// //   | HAPTICS
// //   |--------------------------------------------------------------------------
// //   */

// //   const safeImpact =
// //     useCallback(async (style) => {
// //       try {
// //         await Haptics.impactAsync(
// //           style
// //         );
// //       } catch (error) {
// //         // Ignore unavailable haptics.
// //       }
// //     }, []);

// //   const safeNotification =
// //     useCallback(async (type) => {
// //       try {
// //         await Haptics.notificationAsync(
// //           type
// //         );
// //       } catch (error) {
// //         // Ignore unavailable haptics.
// //       }
// //     }, []);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | ADAPTIVE SAFETY ALGORITHM
// //   |--------------------------------------------------------------------------
// //   |
// //   | riskScore:
// //   |
// //   | 0   = player appears comfortable
// //   | 100 = player is struggling
// //   |
// //   | Difficulty is then inversely related
// //   | to risk.
// //   |
// //   | High risk:
// //   |     lower speed
// //   |     longer spawn interval
// //   |
// //   | Low risk:
// //   |     higher speed
// //   |     shorter spawn interval
// //   |
// //   |--------------------------------------------------------------------------
// //   */

// //   const calculateAdaptiveDifficulty =
// //     useCallback(
// //       (timestamp) => {
// //         const adaptive =
// //           adaptiveRef.current;

// //         if (
// //           timestamp -
// //             adaptive.lastRiskUpdate <
// //           RISK_UPDATE_INTERVAL
// //         ) {
// //           return;
// //         }

// //         adaptive.lastRiskUpdate =
// //           timestamp;

// //         /*
// //          * Successful play slowly reduces
// //          * perceived difficulty pressure.
// //          */
// //         adaptive.riskScore -=
// //           adaptive.successfulDodges *
// //           RISK_DECREASE_SUCCESS;

// //         adaptive.successfulDodges = 0;

// //         /*
// //          * Rescue questions are strong
// //          * evidence that the player needs
// //          * a little more breathing room.
// //          */
// //         adaptive.riskScore +=
// //           adaptive.correctRescues *
// //           2;

// //         adaptive.correctRescues = 0;

// //         adaptive.riskScore = clamp(
// //           adaptive.riskScore,
// //           0,
// //           100
// //         );

// //         /*
// //          * Difficulty factor.
// //          *
// //          * risk = 0   -> 1.15
// //          * risk = 50  -> ~0.965
// //          * risk = 100 -> 0.78
// //          */
// //         const nextFactor =
// //           MAX_DIFFICULTY_FACTOR -
// //           (adaptive.riskScore /
// //             100) *
// //             (
// //               MAX_DIFFICULTY_FACTOR -
// //               MIN_DIFFICULTY_FACTOR
// //             );

// //         const boundedFactor =
// //           clamp(
// //             nextFactor,
// //             MIN_DIFFICULTY_FACTOR,
// //             MAX_DIFFICULTY_FACTOR
// //           );

// //         setRiskScore(
// //           Math.round(
// //             adaptive.riskScore
// //           )
// //         );

// //         setDifficultyFactor(
// //           boundedFactor
// //         );
// //       },
// //       []
// //     );

// //   /*
// //   |--------------------------------------------------------------------------
// //   | CLAMP PLAYER
// //   |--------------------------------------------------------------------------
// //   */

// //   const clampPlayerX =
// //     useCallback(
// //       (x) => {
// //         return Math.max(
// //           0,
// //           Math.min(
// //             GAME_WIDTH -
// //               PLAYER_SIZE,
// //             x
// //           )
// //         );
// //       },
// //       [GAME_WIDTH]
// //     );

// //   /*
// //   |--------------------------------------------------------------------------
// //   | CREATE DEBRIS
// //   |--------------------------------------------------------------------------
// //   */

// //   const createDebrisObject =
// //     useCallback(
// //       (y = -DEBRIS_SIZE) => {
// //         return {
// //           id:
// //             `${Date.now()}-${Math.random()}`,

// //           x:
// //             Math.random() *
// //             Math.max(
// //               1,
// //               GAME_WIDTH -
// //                 DEBRIS_SIZE
// //             ),

// //           y,

// //           nearMissed: false,
// //         };
// //       },
// //       [GAME_WIDTH]
// //     );

// //   /*
// //   |--------------------------------------------------------------------------
// //   | INITIAL DEBRIS
// //   |--------------------------------------------------------------------------
// //   */

// //   const createInitialDebris =
// //     useCallback(() => {
// //       const objects = [];

// //       for (
// //         let index = 0;
// //         index <
// //         config.spawnCount;
// //         index += 1
// //       ) {
// //         objects.push({
// //           id:
// //             `${Date.now()}-${index}-${Math.random()}`,

// //           x:
// //             Math.random() *
// //             Math.max(
// //               1,
// //               GAME_WIDTH -
// //                 DEBRIS_SIZE
// //             ),

// //           y:
// //             -DEBRIS_SIZE -
// //             index * 120 -
// //             Math.random() * 100,

// //           nearMissed: false,
// //         });
// //       }

// //       return objects;
// //     }, [
// //       config.spawnCount,
// //       GAME_WIDTH,
// //     ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | STOP SENSOR
// //   |--------------------------------------------------------------------------
// //   */

// //   const stopSensor =
// //     useCallback(() => {
// //       if (
// //         sensorSubscriptionRef.current
// //       ) {
// //         try {
// //           sensorSubscriptionRef.current.remove();
// //         } catch (error) {
// //           // Ignore.
// //         }

// //         sensorSubscriptionRef.current =
// //           null;
// //       }

// //       movementRef.current = 0;
// //     }, []);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | STOP GAME LOOP
// //   |--------------------------------------------------------------------------
// //   */

// //   const stopGameLoop =
// //     useCallback(() => {
// //       gameRunningRef.current =
// //         false;

// //       gameSessionRef.current +=
// //         1;

// //       if (
// //         animationFrameRef.current !==
// //         null
// //       ) {
// //         cancelAnimationFrame(
// //           animationFrameRef.current
// //         );

// //         animationFrameRef.current =
// //           null;
// //       }

// //       lastFrameTimeRef.current =
// //         null;
// //     }, []);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | RESET GAME
// //   |--------------------------------------------------------------------------
// //   */

// //   const resetGame =
// //     useCallback(() => {
// //       if (
// //         countdownTimerRef.current
// //       ) {
// //         clearInterval(
// //           countdownTimerRef.current
// //         );

// //         countdownTimerRef.current =
// //           null;
// //       }

// //       stopGameLoop();
// //       stopSensor();

// //       playerXRef.current =
// //         INITIAL_PLAYER_X;

// //       debrisRef.current = [];

// //       scoreRef.current = 0;

// //       gameRunningRef.current =
// //         false;

// //       gameOverRef.current =
// //         false;

// //       hasWonRef.current =
// //         false;

// //       movementRef.current = 0;

// //       adaptiveRef.current = {
// //         riskScore: 50,
// //         nearMisses: 0,
// //         successfulDodges: 0,
// //         collisions: 0,
// //         correctRescues: 0,
// //         lastRiskUpdate: 0,
// //       };

// //       setGameStarted(false);
// //       setCountdown(null);
// //       setPlayerPositionX(
// //         INITIAL_PLAYER_X
// //       );
// //       setDebris([]);
// //       setScore(0);
// //       setGameOver(false);
// //       setHasWon(false);

// //       setRescueVisible(false);
// //       setRescueQuestion(null);
// //       setSelectedAnswer(null);
// //       setAnswerFeedback(null);

// //       setRescueLives(
// //         MAX_RESCUE_LIVES
// //       );

// //       setRiskScore(50);
// //       setDifficultyFactor(1);
// //     }, [
// //       INITIAL_PLAYER_X,
// //       stopGameLoop,
// //       stopSensor,
// //     ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | END GAME
// //   |--------------------------------------------------------------------------
// //   */

// //   const finishGame =
// //     useCallback(() => {
// //       if (
// //         gameOverRef.current ||
// //         hasWonRef.current
// //       ) {
// //         return;
// //       }

// //       gameRunningRef.current =
// //         false;

// //       gameOverRef.current =
// //         true;

// //       stopSensor();

// //       if (
// //         animationFrameRef.current !==
// //         null
// //       ) {
// //         cancelAnimationFrame(
// //           animationFrameRef.current
// //         );

// //         animationFrameRef.current =
// //           null;
// //       }

// //       lastFrameTimeRef.current =
// //         null;

// //       setGameOver(true);

// //       safeNotification(
// //         Haptics.NotificationFeedbackType
// //           .Error
// //       );
// //     }, [
// //       safeNotification,
// //       stopSensor,
// //     ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | WIN GAME
// //   |--------------------------------------------------------------------------
// //   */

// //   const winGame =
// //     useCallback(() => {
// //       if (
// //         hasWonRef.current ||
// //         gameOverRef.current
// //       ) {
// //         return;
// //       }

// //       gameRunningRef.current =
// //         false;

// //       hasWonRef.current =
// //         true;

// //       stopSensor();

// //       scoreRef.current =
// //         config.targetScore;

// //       setScore(
// //         config.targetScore
// //       );

// //       setHasWon(true);

// //       if (
// //         animationFrameRef.current !==
// //         null
// //       ) {
// //         cancelAnimationFrame(
// //           animationFrameRef.current
// //         );

// //         animationFrameRef.current =
// //           null;
// //       }

// //       lastFrameTimeRef.current =
// //         null;

// //       safeNotification(
// //         Haptics.NotificationFeedbackType
// //           .Success
// //       );
// //     }, [
// //       config.targetScore,
// //       safeNotification,
// //       stopSensor,
// //     ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | COLLISION
// //   |--------------------------------------------------------------------------
// //   */

// //   const checkCollision =
// //     useCallback(
// //       (playerX, debrisItem) => {
// //         const playerTop =
// //           GAME_HEIGHT -
// //           PLAYER_SIZE -
// //           PLAYER_BOTTOM_OFFSET -
// //           FLOOD_HEIGHT;

// //         const playerLeft =
// //           playerX +
// //           COLLISION_PADDING;

// //         const playerRight =
// //           playerX +
// //           PLAYER_SIZE -
// //           COLLISION_PADDING;

// //         const playerCollisionTop =
// //           playerTop +
// //           COLLISION_PADDING;

// //         const playerCollisionBottom =
// //           playerTop +
// //           PLAYER_SIZE -
// //           COLLISION_PADDING;

// //         const debrisLeft =
// //           debrisItem.x +
// //           COLLISION_PADDING;

// //         const debrisRight =
// //           debrisItem.x +
// //           DEBRIS_SIZE -
// //           COLLISION_PADDING;

// //         const debrisTop =
// //           debrisItem.y +
// //           COLLISION_PADDING;

// //         const debrisBottom =
// //           debrisItem.y +
// //           DEBRIS_SIZE -
// //           COLLISION_PADDING;

// //         return (
// //           playerLeft <
// //             debrisRight &&
// //           playerRight >
// //             debrisLeft &&
// //           playerCollisionTop <
// //             debrisBottom &&
// //           playerCollisionBottom >
// //             debrisTop
// //         );
// //       },
// //       [GAME_HEIGHT]
// //     );

// //   /*
// //   |--------------------------------------------------------------------------
// //   | HANDLE COLLISION / RESCUE
// //   |--------------------------------------------------------------------------
// //   */

// //   const triggerRescueQuestion =
// //     useCallback(() => {
// //       if (
// //         rescueLives <= 0
// //       ) {
// //         finishGame();
// //         return;
// //       }

// //       gameRunningRef.current =
// //         false;

// //       stopSensor();

// //       if (
// //         animationFrameRef.current !==
// //         null
// //       ) {
// //         cancelAnimationFrame(
// //           animationFrameRef.current
// //         );

// //         animationFrameRef.current =
// //           null;
// //       }

// //       adaptiveRef.current.collisions +=
// //         1;

// //       adaptiveRef.current.riskScore +=
// //         RISK_INCREASE_COLLISION;

// //       adaptiveRef.current.riskScore =
// //         clamp(
// //           adaptiveRef.current.riskScore,
// //           0,
// //           100
// //         );

// //       const question =
// //         getRandomQuestion();

// //       setRescueQuestion(
// //         question
// //       );

// //       setSelectedAnswer(null);
// //       setAnswerFeedback(null);
// //       setRescueVisible(true);

// //       setRiskScore(
// //         Math.round(
// //           adaptiveRef.current
// //             .riskScore
// //         )
// //       );

// //       safeNotification(
// //         Haptics.NotificationFeedbackType
// //           .Warning
// //       );
// //     }, [
// //       finishGame,
// //       rescueLives,
// //       safeNotification,
// //       stopSensor,
// //     ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | RESCUE ANSWER
// //   |--------------------------------------------------------------------------
// //   */

// //   const handleRescueAnswer =
// //     useCallback(
// //       (answerId) => {
// //         if (
// //           !rescueQuestion ||
// //           selectedAnswer
// //         ) {
// //           return;
// //         }

// //         setSelectedAnswer(
// //           answerId
// //         );

// //         const correct =
// //           answerId ===
// //           rescueQuestion.correct;

// //         if (!correct) {
// //           setAnswerFeedback(
// //             'wrong'
// //           );

// //           safeNotification(
// //             Haptics.NotificationFeedbackType
// //               .Error
// //           );

// //           setTimeout(() => {
// //             setRescueVisible(false);
// //             setRescueQuestion(null);
// //             finishGame();
// //           }, 850);

// //           return;
// //         }

// //         setAnswerFeedback(
// //           'correct'
// //         );

// //         safeNotification(
// //           Haptics.NotificationFeedbackType
// //             .Success
// //         );

// //         /*
// //          * The player earns a rescue.
// //          *
// //          * We also reduce adaptive risk,
// //          * meaning the game gives them
// //          * breathing room after learning.
// //          */
// //         adaptiveRef.current.correctRescues +=
// //           1;

// //         adaptiveRef.current.riskScore -=
// //           RISK_DECREASE_CORRECT_RESCUE;

// //         adaptiveRef.current.riskScore =
// //           clamp(
// //             adaptiveRef.current.riskScore,
// //             0,
// //             100
// //           );

// //         const nextScore =
// //           Math.min(
// //             config.targetScore,
// //             scoreRef.current +
// //               RESCUE_POINTS
// //           );

// //         scoreRef.current =
// //           nextScore;

// //         setScore(
// //           nextScore
// //         );

// //         setRiskScore(
// //           Math.round(
// //             adaptiveRef.current
// //               .riskScore
// //           )
// //         );

// //         setDifficultyFactor(
// //           MAX_DIFFICULTY_FACTOR -
// //             (
// //               adaptiveRef.current
// //                 .riskScore /
// //               100
// //             ) *
// //             (
// //               MAX_DIFFICULTY_FACTOR -
// //               MIN_DIFFICULTY_FACTOR
// //             )
// //         );

// //         /*
// //          * Consume the rescue life.
// //          */
// //         setRescueLives(
// //           (value) =>
// //             Math.max(
// //               0,
// //               value - 1
// //             )
// //         );

// //         /*
// //          * Give the player a short grace
// //          * period by resetting obstacles.
// //          */
// //         debrisRef.current =
// //           debrisRef.current.filter(
// //             (item) =>
// //               item.y <
// //               GAME_HEIGHT * 0.35
// //           );

// //         setDebris(
// //           debrisRef.current
// //         );

// //         setTimeout(() => {
// //           setRescueVisible(false);
// //           setRescueQuestion(null);
// //           setSelectedAnswer(null);
// //           setAnswerFeedback(null);

// //           /*
// //            * If rescue itself reached the
// //            * target, the player wins.
// //            */
// //           if (
// //             nextScore >=
// //             config.targetScore
// //           ) {
// //             winGame();
// //             return;
// //           }

// //           gameOverRef.current =
// //             false;

// //           hasWonRef.current =
// //             false;

// //           gameRunningRef.current =
// //             true;

// //           lastFrameTimeRef.current =
// //             null;

// //           lastSpawnTimeRef.current =
// //             performance.now();

// //           const sessionId =
// //             gameSessionRef.current;

// //           animationFrameRef.current =
// //             requestAnimationFrame(
// //               (timestamp) =>
// //                 runGameLoop(
// //                   timestamp,
// //                   sessionId
// //                 )
// //             );
// //         }, 700);
// //       },
// //       [
// //         config.targetScore,
// //         finishGame,
// //         GAME_HEIGHT,
// //         rescueQuestion,
// //         runGameLoop,
// //         safeNotification,
// //         selectedAnswer,
// //         winGame,
// //       ]
// //     );

// //   /*
// //   |--------------------------------------------------------------------------
// //   | GAME LOOP
// //   |--------------------------------------------------------------------------
// //   */

// //   const runGameLoop =
// //     useCallback(
// //       (timestamp, sessionId) => {
// //         if (
// //           sessionId !==
// //           gameSessionRef.current
// //         ) {
// //           return;
// //         }

// //         if (
// //           !gameRunningRef.current ||
// //           gameOverRef.current ||
// //           hasWonRef.current ||
// //           rescueVisible
// //         ) {
// //           return;
// //         }

// //         if (
// //           lastFrameTimeRef.current ===
// //           null
// //         ) {
// //           lastFrameTimeRef.current =
// //             timestamp;
// //         }

// //         const delta =
// //           Math.min(
// //             timestamp -
// //               lastFrameTimeRef.current,
// //             50
// //           ) / 1000;

// //         lastFrameTimeRef.current =
// //           timestamp;

// //         /*
// //          * Update adaptive difficulty.
// //          */
// //         calculateAdaptiveDifficulty(
// //           timestamp
// //         );

// //         const adaptive =
// //           adaptiveRef.current;

// //         const factor =
// //           clamp(
// //             MAX_DIFFICULTY_FACTOR -
// //               (
// //                 adaptive.riskScore /
// //                 100
// //               ) *
// //               (
// //                 MAX_DIFFICULTY_FACTOR -
// //                 MIN_DIFFICULTY_FACTOR
// //               ),
// //             MIN_DIFFICULTY_FACTOR,
// //             MAX_DIFFICULTY_FACTOR
// //           );

// //         /*
// //          |--------------------------------------------------------------------------
// //          | PLAYER
// //          |--------------------------------------------------------------------------
// //          */

// //         let nextPlayerX =
// //           playerXRef.current;

// //         const tilt =
// //           movementRef.current;

// //         if (
// //           Math.abs(tilt) >=
// //           SENSOR_DEAD_ZONE
// //         ) {
// //           nextPlayerX +=
// //             tilt *
// //             config.playerSpeed *
// //             delta;
// //         }

// //         nextPlayerX =
// //           clampPlayerX(
// //             nextPlayerX
// //           );

// //         playerXRef.current =
// //           nextPlayerX;

// //         setPlayerPositionX(
// //           nextPlayerX
// //         );

// //         /*
// //          |--------------------------------------------------------------------------
// //          | DEBRIS
// //          |--------------------------------------------------------------------------
// //          */

// //         const effectiveDebrisSpeed =
// //           config.debrisSpeed *
// //           factor;

// //         const movedDebris =
// //           debrisRef.current.map(
// //             (item) => ({
// //               ...item,

// //               y:
// //                 item.y +
// //                 effectiveDebrisSpeed *
// //                 delta,
// //             })
// //           );

// //         /*
// //          |--------------------------------------------------------------------------
// //          | COLLISION + NEAR MISS
// //          |--------------------------------------------------------------------------
// //          */

// //         let collision = false;

// //         const checkedDebris =
// //           movedDebris.map(
// //             (item) => {
// //               if (
// //                 checkCollision(
// //                   nextPlayerX,
// //                   item
// //                 )
// //               ) {
// //                 collision = true;
// //                 return item;
// //               }

// //               /*
// //                * Near miss detection.
// //                *
// //                * If the obstacle comes close
// //                * horizontally and vertically
// //                * but doesn't collide, the player
// //                * demonstrated useful avoidance.
// //                */
// //               if (
// //                 !item.nearMissed &&
// //                 item.y >
// //                   GAME_HEIGHT -
// //                   PLAYER_SIZE -
// //                   PLAYER_BOTTOM_OFFSET -
// //                   FLOOD_HEIGHT -
// //                   45 &&
// //                 item.y <
// //                   GAME_HEIGHT -
// //                   PLAYER_SIZE -
// //                   PLAYER_BOTTOM_OFFSET -
// //                   FLOOD_HEIGHT +
// //                   55
// //               ) {
// //                 const horizontalGap =
// //                   Math.abs(
// //                     (
// //                       item.x +
// //                       DEBRIS_SIZE / 2
// //                     ) -
// //                     (
// //                       nextPlayerX +
// //                       PLAYER_SIZE / 2
// //                     )
// //                   );

// //                 if (
// //                   horizontalGap <=
// //                   NEAR_MISS_DISTANCE
// //                 ) {
// //                   adaptive.nearMisses +=
// //                     1;

// //                   adaptive.riskScore +=
// //                     RISK_INCREASE_NEAR_MISS;

// //                   adaptive.riskScore =
// //                     clamp(
// //                       adaptive.riskScore,
// //                       0,
// //                       100
// //                     );

// //                   return {
// //                     ...item,
// //                     nearMissed: true,
// //                   };
// //                 }
// //               }

// //               return item;
// //             }
// //           );

// //         if (collision) {
// //           debrisRef.current =
// //             checkedDebris;

// //           setDebris(
// //             checkedDebris
// //           );

// //           triggerRescueQuestion();

// //           return;
// //         }

// //         /*
// //          |--------------------------------------------------------------------------
// //          | PASSED OBSTACLES
// //          |--------------------------------------------------------------------------
// //          */

// //         let passedCount = 0;

// //         const survivingDebris =
// //           checkedDebris.filter(
// //             (item) => {
// //               if (
// //                 item.y >
// //                 GAME_HEIGHT
// //               ) {
// //                 passedCount += 1;

// //                 adaptive.successfulDodges +=
// //                   1;

// //                 return false;
// //               }

// //               return true;
// //             }
// //           );

// //         /*
// //          |--------------------------------------------------------------------------
// //          | SCORE
// //          |--------------------------------------------------------------------------
// //          */

// //         if (
// //           passedCount > 0
// //         ) {
// //           const nextScore =
// //             Math.min(
// //               config.targetScore,
// //               scoreRef.current +
// //                 passedCount * 10
// //             );

// //           scoreRef.current =
// //             nextScore;

// //           setScore(
// //             nextScore
// //           );

// //           if (
// //             nextScore >=
// //             config.targetScore
// //           ) {
// //             debrisRef.current =
// //               survivingDebris;

// //             setDebris(
// //               survivingDebris
// //             );

// //             winGame();

// //             return;
// //           }
// //         }

// //         /*
// //          |--------------------------------------------------------------------------
// //          | ADAPTIVE SPAWN
// //          |--------------------------------------------------------------------------
// //          */

// //         const effectiveSpawnInterval =
// //           config.spawnInterval /
// //           factor;

// //         if (
// //           timestamp -
// //             lastSpawnTimeRef.current >=
// //           effectiveSpawnInterval
// //         ) {
// //           lastSpawnTimeRef.current =
// //             timestamp;

// //           if (
// //             survivingDebris.length <
// //             config.spawnCount
// //           ) {
// //             survivingDebris.push(
// //               createDebrisObject()
// //             );
// //           }
// //         }

// //         /*
// //          * Safety limit.
// //          */
// //         while (
// //           survivingDebris.length >
// //           config.spawnCount
// //         ) {
// //           survivingDebris.shift();
// //         }

// //         debrisRef.current =
// //           survivingDebris;

// //         setDebris(
// //           survivingDebris
// //         );

// //         /*
// //          |--------------------------------------------------------------------------
// //          | NEXT FRAME
// //          |--------------------------------------------------------------------------
// //          */

// //         animationFrameRef.current =
// //           requestAnimationFrame(
// //             (nextTimestamp) =>
// //               runGameLoop(
// //                 nextTimestamp,
// //                 sessionId
// //               )
// //           );
// //       },
// //       [
// //         calculateAdaptiveDifficulty,
// //         checkCollision,
// //         clampPlayerX,
// //         config.debrisSpeed,
// //         config.playerSpeed,
// //         config.spawnCount,
// //         config.spawnInterval,
// //         config.targetScore,
// //         createDebrisObject,
// //         GAME_HEIGHT,
// //         rescueVisible,
// //         triggerRescueQuestion,
// //         winGame,
// //       ]
// //     );

// //   /*
// //   |--------------------------------------------------------------------------
// //   | BEGIN GAME
// //   |--------------------------------------------------------------------------
// //   */

// //   const beginGame =
// //     useCallback(() => {
// //       const sessionId =
// //         gameSessionRef.current +
// //         1;

// //       gameSessionRef.current =
// //         sessionId;

// //       if (
// //         animationFrameRef.current !==
// //         null
// //       ) {
// //         cancelAnimationFrame(
// //           animationFrameRef.current
// //         );

// //         animationFrameRef.current =
// //           null;
// //       }

// //       playerXRef.current =
// //         INITIAL_PLAYER_X;

// //       const initialDebris =
// //         createInitialDebris();

// //       debrisRef.current =
// //         initialDebris;

// //       scoreRef.current = 0;

// //       gameRunningRef.current =
// //         true;

// //       gameOverRef.current =
// //         false;

// //       hasWonRef.current =
// //         false;

// //       movementRef.current = 0;

// //       lastFrameTimeRef.current =
// //         null;

// //       lastSpawnTimeRef.current =
// //         performance.now();

// //       adaptiveRef.current = {
// //         riskScore: 50,
// //         nearMisses: 0,
// //         successfulDodges: 0,
// //         collisions: 0,
// //         correctRescues: 0,
// //         lastRiskUpdate:
// //           performance.now(),
// //       };

// //       setRiskScore(50);
// //       setDifficultyFactor(1);

// //       setPlayerPositionX(
// //         INITIAL_PLAYER_X
// //       );

// //       setDebris(
// //         initialDebris
// //       );

// //       setScore(0);

// //       setGameOver(false);
// //       setHasWon(false);

// //       setRescueLives(
// //         MAX_RESCUE_LIVES
// //       );

// //       setGameStarted(true);

// //       safeNotification(
// //         Haptics.NotificationFeedbackType
// //           .Success
// //       );

// //       animationFrameRef.current =
// //         requestAnimationFrame(
// //           (timestamp) =>
// //             runGameLoop(
// //               timestamp,
// //               sessionId
// //             )
// //         );
// //     }, [
// //       INITIAL_PLAYER_X,
// //       createInitialDebris,
// //       runGameLoop,
// //       safeNotification,
// //     ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | START GAME
// //   |--------------------------------------------------------------------------
// //   */

// //   const startGame =
// //     useCallback(() => {
// //       if (
// //         gameRunningRef.current ||
// //         countdown !== null
// //       ) {
// //         return;
// //       }

// //       if (
// //         countdownTimerRef.current
// //       ) {
// //         clearInterval(
// //           countdownTimerRef.current
// //         );

// //         countdownTimerRef.current =
// //           null;
// //       }

// //       stopGameLoop();
// //       stopSensor();

// //       playerXRef.current =
// //         INITIAL_PLAYER_X;

// //       debrisRef.current = [];

// //       scoreRef.current = 0;

// //       gameOverRef.current =
// //         false;

// //       hasWonRef.current =
// //         false;

// //       gameRunningRef.current =
// //         false;

// //       setPlayerPositionX(
// //         INITIAL_PLAYER_X
// //       );

// //       setDebris([]);

// //       setScore(0);

// //       setGameOver(false);
// //       setHasWon(false);

// //       setRescueVisible(false);
// //       setRescueQuestion(null);

// //       setRescueLives(
// //         MAX_RESCUE_LIVES
// //       );

// //       setGameStarted(false);

// //       let count = 3;

// //       setCountdown(count);

// //       safeImpact(
// //         Haptics.ImpactFeedbackStyle
// //           .Light
// //       );

// //       countdownTimerRef.current =
// //         setInterval(() => {
// //           count -= 1;

// //           if (
// //             count <= 0
// //           ) {
// //             clearInterval(
// //               countdownTimerRef.current
// //             );

// //             countdownTimerRef.current =
// //               null;

// //             setCountdown(null);

// //             beginGame();

// //             return;
// //           }

// //           setCountdown(count);

// //           safeImpact(
// //             Haptics.ImpactFeedbackStyle
// //               .Light
// //           );
// //         }, 700);
// //     }, [
// //       beginGame,
// //       countdown,
// //       INITIAL_PLAYER_X,
// //       safeImpact,
// //       stopGameLoop,
// //       stopSensor,
// //     ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | TOUCH MOVEMENT
// //   |--------------------------------------------------------------------------
// //   */

// //   const movePlayer =
// //     useCallback(
// //       (direction) => {
// //         if (
// //           !gameRunningRef.current ||
// //           gameOverRef.current ||
// //           hasWonRef.current
// //         ) {
// //           return;
// //         }

// //         const amount =
// //           config.playerSpeed *
// //           TOUCH_MOVE_MULTIPLIER;

// //         let nextX =
// //           playerXRef.current;

// //         if (
// //           direction === 'left'
// //         ) {
// //           nextX -= amount;
// //         }

// //         if (
// //           direction === 'right'
// //         ) {
// //           nextX += amount;
// //         }

// //         nextX =
// //           clampPlayerX(nextX);

// //         playerXRef.current =
// //           nextX;

// //         setPlayerPositionX(
// //           nextX
// //         );

// //         safeImpact(
// //           Haptics.ImpactFeedbackStyle
// //             .Light
// //         );
// //       },
// //       [
// //         clampPlayerX,
// //         config.playerSpeed,
// //         safeImpact,
// //       ]
// //     );

// //   /*
// //   |--------------------------------------------------------------------------
// //   | ACCELEROMETER
// //   |--------------------------------------------------------------------------
// //   */

// //   useEffect(() => {
// //     let mounted = true;

// //     const setupAccelerometer =
// //       async () => {
// //         if (
// //           !gameStarted ||
// //           gameOver ||
// //           hasWon ||
// //           rescueVisible
// //         ) {
// //           stopSensor();
// //           return;
// //         }

// //         try {
// //           const available =
// //             await Accelerometer.isAvailableAsync();

// //           if (!mounted) {
// //             return;
// //           }

// //           if (!available) {
// //             setSensorAvailable(
// //               false
// //             );

// //             return;
// //           }

// //           setSensorAvailable(
// //             true
// //           );

// //           Accelerometer.setUpdateInterval(
// //             50
// //           );

// //           stopSensor();

// //           sensorSubscriptionRef.current =
// //             Accelerometer.addListener(
// //               (data) => {
// //                 if (
// //                   !gameRunningRef.current
// //                 ) {
// //                   return;
// //                 }

// //                 const value =
// //                   Number(
// //                     data?.x
// //                   ) || 0;

// //                 movementRef.current =
// //                   clamp(
// //                     value,
// //                     -1,
// //                     1
// //                   );
// //               }
// //             );
// //         } catch (error) {
// //           console.log(
// //             'FloodRunner accelerometer error:',
// //             error
// //           );

// //           if (mounted) {
// //             setSensorAvailable(
// //               false
// //             );
// //           }
// //         }
// //       };

// //     setupAccelerometer();

// //     return () => {
// //       mounted = false;
// //       stopSensor();
// //     };
// //   }, [
// //     gameStarted,
// //     gameOver,
// //     hasWon,
// //     rescueVisible,
// //     stopSensor,
// //   ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | BACK BUTTON
// //   |--------------------------------------------------------------------------
// //   */

// //   useEffect(() => {
// //     const subscription =
// //       BackHandler.addEventListener(
// //         'hardwareBackPress',
// //         () => {
// //           if (
// //             gameRunningRef.current ||
// //             countdown !== null ||
// //             rescueVisible
// //           ) {
// //             return true;
// //           }

// //           return false;
// //         }
// //       );

// //     return () => {
// //       subscription.remove();
// //     };
// //   }, [
// //     countdown,
// //     rescueVisible,
// //   ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | CLEANUP
// //   |--------------------------------------------------------------------------
// //   */

// //   useEffect(() => {
// //     return () => {
// //       if (
// //         countdownTimerRef.current
// //       ) {
// //         clearInterval(
// //           countdownTimerRef.current
// //         );

// //         countdownTimerRef.current =
// //           null;
// //       }

// //       if (
// //         animationFrameRef.current !==
// //         null
// //       ) {
// //         cancelAnimationFrame(
// //           animationFrameRef.current
// //         );

// //         animationFrameRef.current =
// //           null;
// //       }

// //       if (
// //         sensorSubscriptionRef.current
// //       ) {
// //         try {
// //           sensorSubscriptionRef.current.remove();
// //         } catch (error) {
// //           // Ignore.
// //         }

// //         sensorSubscriptionRef.current =
// //           null;
// //       }

// //       gameRunningRef.current =
// //         false;
// //     };
// //   }, []);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | CLAIM REWARD
// //   |--------------------------------------------------------------------------
// //   */

// //   const handleClaimReward =useCallback(() => {
// //     if (!hasWonRef.current) {
// //       return;
// //     }

// //       /*
// //        * Connect your real XP/coins
// //        * persistence here.
// //        */
// //     const reward = config.reward;

// //   // Update mission/progression system here.
// //   completeMission({
// //     missionId: 'floodRunner',
// //     level: selectedLevel,
// //     score: scoreRef.current,
// //     xp: reward.xp,
// //     coins: reward.coins,
// //   });

// //     resetGame();

// //       navigation.goBack();
// //     }, [
// //       navigation,
// //       resetGame,
// //     ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | PROGRESS
// //   |--------------------------------------------------------------------------
// //   */

// //   const progressPercentage =
// //     Math.min(
// //       100,
// //       (
// //         score /
// //         config.targetScore
// //       ) *
// //       100
// //     );

// //   /*
// //   |--------------------------------------------------------------------------
// //   | CURRENT DIFFICULTY LABEL
// //   |--------------------------------------------------------------------------
// //   */

// //   const difficultyLabel =
// //     useMemo(() => {
// //       if (
// //         difficultyFactor < 0.88
// //       ) {
// //         return t(
// //           'games.floodRunner.adaptive.easier'
// //         );
// //       }

// //       if (
// //         difficultyFactor > 1.05
// //       ) {
// //         return t(
// //           'games.floodRunner.adaptive.harder'
// //         );
// //       }

// //       return t(
// //         'games.floodRunner.adaptive.balanced'
// //       );
// //     }, [
// //       difficultyFactor,
// //       t,
// //     ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | RENDER
// //   |--------------------------------------------------------------------------
// //   */

// //   return (
// //     <View
// //       style={styles.screen}
// //     >
// //       <View
// //         style={[
// //           styles.modalContentCard,
// //           {
// //             width:
// //               Math.min(
// //                 GAME_WIDTH + 32,
// //                 SCREEN_WIDTH - 16
// //               ),
// //           },
// //         ]}
// //       >
// //         {/* HEADER */}

// //         <View
// //           style={styles.modalHeader}
// //         >
// //           <View
// //             style={
// //               styles.headerTitleArea
// //             }
// //           >
// //             <View
// //               style={
// //                 styles.headerIcon
// //               }
// //             >
// //               <Ionicons
// //                 name="water"
// //                 size={20}
// //                 color="#38BDF8"
// //               />
// //             </View>

// //             <View
// //               style={
// //                 styles.headerTextArea
// //               }
// //             >
// //               <Text
// //                 style={
// //                   styles.modalTitle
// //                 }
// //               >
// //                 {t(
// //                   'games.floodRunner.title'
// //                 )}
// //               </Text>

// //               <Text
// //                 style={
// //                   styles.levelLabel
// //                 }
// //               >
// //                 {t(
// //                   'games.floodRunner.level',
// //                   {
// //                     level:
// //                       selectedLevel,
// //                   }
// //                 )}{' '}
// //                 •{' '}
// //                 {t(
// //                   config.nameKey
// //                 )}
// //               </Text>
// //             </View>
// //           </View>
// //         </View>

// //         {/* OBJECTIVE */}

// //         <View
// //           style={
// //             styles.objectiveCard
// //           }
// //         >
// //           <View
// //             style={
// //               styles.objectiveIcon
// //             }
// //           >
// //             <Ionicons
// //               name="flag"
// //               size={18}
// //               color="#34D399"
// //             />
// //           </View>

// //           <View
// //             style={
// //               styles.objectiveTextArea
// //             }
// //           >
// //             <Text
// //               style={
// //                 styles.objectiveTitle
// //               }
// //             >
// //               {t(
// //                 'games.floodRunner.objective'
// //               )}
// //             </Text>

// //             <Text
// //               style={
// //                 styles.objectiveText
// //               }
// //             >
// //               {t(
// //                 'games.floodRunner.objectiveDescription'
// //               )}
// //             </Text>
// //           </View>
// //         </View>

// //         {/* INSTRUCTIONS */}

// //         {!gameStarted &&
// //           !gameOver &&
// //           !hasWon &&
// //           countdown === null && (
// //             <View
// //               style={
// //                 styles.instructionsCard
// //               }
// //             >
// //               <View
// //                 style={
// //                   styles.instructionsHeader
// //                 }
// //               >
// //                 <Ionicons
// //                   name="help-circle"
// //                   size={20}
// //                   color="#FBBF24"
// //                 />

// //                 <Text
// //                   style={
// //                     styles.instructionsTitle
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.howToPlay'
// //                   )}
// //                 </Text>
// //               </View>

// //               <InstructionRow
// //                 icon="swap-horizontal"
// //                 text={t(
// //                   'games.floodRunner.instructions.move'
// //                 )}
// //               />

// //               <InstructionRow
// //                 icon="warning"
// //                 text={t(
// //                   'games.floodRunner.instructions.avoid'
// //                 )}
// //               />

// //               <InstructionRow
// //                 icon="water"
// //                 text={t(
// //                   'games.floodRunner.instructions.flood'
// //                 )}
// //               />

// //               <InstructionRow
// //                 icon="flag"
// //                 text={t(
// //                   'games.floodRunner.instructions.finish',
// //                   {
// //                     score:
// //                       config.targetScore,
// //                   }
// //                 )}
// //               />

// //               <InstructionRow
// //                 icon="help-circle"
// //                 text={t(
// //                   'games.floodRunner.instructions.rescue'
// //                 )}
// //               />
// //             </View>
// //           )}

// //         {/* SENSOR STATUS */}

// //         {gameStarted &&
// //           !gameOver &&
// //           !hasWon &&
// //           !rescueVisible && (
// //             <View
// //               style={
// //                 styles.sensorStatus
// //               }
// //             >
// //               <Ionicons
// //                 name={
// //                   sensorAvailable
// //                     ? 'phone-portrait-outline'
// //                     : 'hand-left-outline'
// //                 }
// //                 size={15}
// //                 color={
// //                   sensorAvailable
// //                     ? '#34D399'
// //                     : '#FBBF24'
// //                 }
// //               />

// //               <Text
// //                 style={[
// //                   styles.sensorText,
// //                   {
// //                     color:
// //                       sensorAvailable
// //                         ? '#34D399'
// //                         : '#FBBF24',
// //                   },
// //                 ]}
// //               >
// //                 {sensorAvailable
// //                   ? t(
// //                       'games.floodRunner.tiltActive'
// //                     )
// //                   : t(
// //                       'games.floodRunner.touchActive'
// //                     )}
// //               </Text>

// //               <View
// //                 style={
// //                   styles.lifeBadge
// //                 }
// //               >
// //                 <Ionicons
// //                   name="heart"
// //                   size={12}
// //                   color="#FB7185"
// //                 />

// //                 <Text
// //                   style={
// //                     styles.lifeText
// //                   }
// //                 >
// //                   {rescueLives}
// //                 </Text>
// //               </View>
// //             </View>
// //           )}

// //         {/* GAME AREA */}

// //         <View
// //           style={[
// //             styles.gameCanvas,
// //             {
// //               width:
// //                 GAME_WIDTH,
// //               height:
// //                 GAME_HEIGHT,
// //             },
// //           ]}
// //         >
// //           {/* SAFE ZONE */}

// //           <View
// //             style={
// //               styles.safeZone
// //             }
// //           >
// //             <View
// //               style={
// //                 styles.safeZoneIcon
// //               }
// //             >
// //               <Ionicons
// //                 name="shield-checkmark"
// //                 size={18}
// //                 color="#34D399"
// //               />
// //             </View>

// //             <View>
// //               <Text
// //                 style={
// //                   styles.safeZoneTitle
// //                 }
// //               >
// //                 {t(
// //                   'games.floodRunner.safeShelter'
// //                 )}
// //               </Text>

// //               <Text
// //                 style={
// //                   styles.safeZoneSub
// //                 }
// //               >
// //                 {t(
// //                   'games.floodRunner.highGround'
// //                 )}
// //               </Text>
// //             </View>
// //           </View>

// //           {/* DANGER FIELD */}

// //           <View
// //             style={
// //               styles.dangerField
// //             }
// //           >
// //             <View
// //               style={
// //                 styles.routeLine
// //               }
// //             />

// //             <Text
// //               style={
// //                 styles.dangerText
// //               }
// //             >
// //               {t(
// //                 'games.floodRunner.evacuationRoute'
// //               )}
// //             </Text>
// //           </View>

// //           {/* DEBRIS */}

// //           {gameStarted &&
// //             !gameOver &&
// //             !hasWon &&
// //             debris.map(
// //               (item) => (
// //                 <View
// //                   key={item.id}
// //                   style={[
// //                     styles.debrisNode,
// //                     {
// //                       left:
// //                         item.x,
// //                       top:
// //                         item.y,
// //                     },
// //                   ]}
// //                 >
// //                   <Ionicons
// //                     name="warning"
// //                     size={20}
// //                     color="#FCA5A5"
// //                   />
// //                 </View>
// //               )
// //             )}

// //           {/* PLAYER */}

// //           {gameStarted &&
// //             !gameOver &&
// //             !hasWon &&
// //             !rescueVisible && (
// //               <View
// //                 style={[
// //                   styles.playerNode,
// //                   {
// //                     left:
// //                       playerPositionX,

// //                     bottom:
// //                       PLAYER_BOTTOM_OFFSET +
// //                       FLOOD_HEIGHT,
// //                   },
// //                 ]}
// //               >
// //                 <Ionicons
// //                   name="person"
// //                   size={25}
// //                   color="#FFFFFF"
// //                 />
// //               </View>
// //             )}

// //           {/* FLOOD */}

// //           <View
// //             style={
// //               styles.floodLayer
// //             }
// //           >
// //             <View
// //               style={
// //                 styles.waveContainer
// //               }
// //             >
// //               {Array.from({
// //                 length: 12,
// //               }).map(
// //                 (_, index) => (
// //                   <Text
// //                     key={index}
// //                     style={
// //                       styles.wave
// //                     }
// //                   >
// //                     ~
// //                   </Text>
// //                 )
// //               )}
// //             </View>

// //             <Text
// //               style={
// //                 styles.floodLabel
// //               }
// //             >
// //               {t(
// //                 'games.floodRunner.floodZone'
// //               )}
// //             </Text>
// //           </View>

// //           {/* ADAPTIVE STATUS */}

// //           {gameStarted &&
// //             !gameOver &&
// //             !hasWon &&
// //             !rescueVisible && (
// //               <View
// //                 style={
// //                   styles.adaptiveBadge
// //                 }
// //               >
// //                 <Ionicons
// //                   name="pulse"
// //                   size={11}
// //                   color="#38BDF8"
// //                 />

// //                 <Text
// //                   style={
// //                     styles.adaptiveText
// //                   }
// //                 >
// //                   {difficultyLabel}
// //                 </Text>
// //               </View>
// //             )}

// //           {/* COUNTDOWN */}

// //           {countdown !== null && (
// //             <View
// //               style={
// //                 styles.countdownOverlay
// //               }
// //             >
// //               <Text
// //                 style={
// //                   styles.countdownNumber
// //                 }
// //               >
// //                 {countdown}
// //               </Text>

// //               <Text
// //                 style={
// //                   styles.countdownText
// //                 }
// //               >
// //                 {t(
// //                   'games.floodRunner.getReady'
// //                 )}
// //               </Text>
// //             </View>
// //           )}

// //           {/* START */}

// //           {!gameStarted &&
// //             countdown === null &&
// //             !gameOver &&
// //             !hasWon && (
// //               <View
// //                 style={
// //                   styles.startOverlay
// //                 }
// //               >
// //                 <View
// //                   style={
// //                     styles.startIcon
// //                   }
// //                 >
// //                   <Ionicons
// //                     name="walk"
// //                     size={34}
// //                     color="#38BDF8"
// //                   />
// //                 </View>

// //                 <Text
// //                   style={
// //                     styles.startTitle
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.ready'
// //                   )}
// //                 </Text>

// //                 <Text
// //                   style={
// //                     styles.startDescription
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.startDescription'
// //                   )}
// //                 </Text>

// //                 <TouchableOpacity
// //                   style={
// //                     styles.startButton
// //                   }
// //                   onPress={
// //                     startGame
// //                   }
// //                   activeOpacity={0.8}
// //                 >
// //                   <Ionicons
// //                     name="play"
// //                     size={18}
// //                     color="#FFFFFF"
// //                   />

// //                   <Text
// //                     style={
// //                       styles.startButtonText
// //                     }
// //                   >
// //                     {t(
// //                       'games.floodRunner.start'
// //                     )}
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>
// //             )}

// //           {/* RESCUE QUESTION */}

// //           {rescueVisible &&
// //             rescueQuestion && (
// //               <View
// //                 style={
// //                   styles.rescueOverlay
// //                 }
// //               >
// //                 <View
// //                   style={
// //                     styles.rescueIcon
// //                   }
// //                 >
// //                   <Ionicons
// //                     name="medkit"
// //                     size={28}
// //                     color="#FBBF24"
// //                   />
// //                 </View>

// //                 <Text
// //                   style={
// //                     styles.rescueTitle
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.rescueTitle'
// //                   )}
// //                 </Text>

// //                 <Text
// //                   style={
// //                     styles.rescueDescription
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.rescueDescription'
// //                   )}
// //                 </Text>

// //                 <Text
// //                   style={
// //                     styles.rescueQuestion
// //                   }
// //                 >
// //                   {t(
// //                     rescueQuestion.questionKey
// //                   )}
// //                 </Text>

// //                 <View
// //                   style={
// //                     styles.answerList
// //                   }
// //                 >
// //                   {rescueQuestion.options.map(
// //                     (option) => {
// //                       const isSelected =
// //                         selectedAnswer ===
// //                         option.id;

// //                       const isCorrect =
// //                         rescueQuestion.correct ===
// //                         option.id;

// //                       let backgroundColor =
// //                         '#172033';

// //                       let borderColor =
// //                         '#334155';

// //                       if (
// //                         isSelected &&
// //                         answerFeedback ===
// //                           'correct'
// //                       ) {
// //                         backgroundColor =
// //                           '#064E3B';

// //                         borderColor =
// //                           '#10B981';
// //                       }

// //                       if (
// //                         isSelected &&
// //                         answerFeedback ===
// //                           'wrong'
// //                       ) {
// //                         backgroundColor =
// //                           '#450A0A';

// //                         borderColor =
// //                           '#EF4444';
// //                       }

// //                       if (
// //                         selectedAnswer &&
// //                         isCorrect &&
// //                         answerFeedback ===
// //                           'correct'
// //                       ) {
// //                         backgroundColor =
// //                           '#064E3B';

// //                         borderColor =
// //                           '#10B981';
// //                       }

// //                       return (
// //                         <TouchableOpacity
// //                           key={
// //                             option.id
// //                           }
// //                           disabled={
// //                             !!selectedAnswer
// //                           }
// //                           style={[
// //                             styles.answerButton,
// //                             {
// //                               backgroundColor,
// //                               borderColor,
// //                             },
// //                           ]}
// //                           onPress={() =>
// //                             handleRescueAnswer(
// //                               option.id
// //                             )
// //                           }
// //                           activeOpacity={
// //                             0.8
// //                           }
// //                         >
// //                           <View
// //                             style={
// //                               styles.answerLetter
// //                             }
// //                           >
// //                             <Text
// //                               style={
// //                                 styles.answerLetterText
// //                               }
// //                             >
// //                               {option.id.toUpperCase()}
// //                             </Text>
// //                           </View>

// //                           <Text
// //                             style={
// //                               styles.answerText
// //                             }
// //                           >
// //                             {t(
// //                               option.textKey
// //                             )}
// //                           </Text>
// //                         </TouchableOpacity>
// //                       );
// //                     }
// //                   )}
// //                 </View>

// //                 <View
// //                   style={
// //                     styles.rescueLifeNotice
// //                   }
// //                 >
// //                   <Ionicons
// //                     name="heart"
// //                     size={13}
// //                     color="#FB7185"
// //                   />

// //                   <Text
// //                     style={
// //                       styles.rescueLifeText
// //                     }
// //                   >
// //                     {t(
// //                       'games.floodRunner.rescueLifeNotice'
// //                     )}
// //                   </Text>
// //                 </View>
// //               </View>
// //             )}

// //           {/* GAME OVER */}

// //           {gameOver && (
// //             <View
// //               style={
// //                 styles.endGameOverlay
// //               }
// //             >
// //               <View
// //                 style={[
// //                   styles.resultIcon,
// //                   {
// //                     backgroundColor:
// //                       '#450A0A',
// //                   },
// //                 ]}
// //               >
// //                 <Ionicons
// //                   name="warning"
// //                   size={34}
// //                   color="#EF4444"
// //                 />
// //               </View>

// //               <Text
// //                 style={
// //                   styles.gameOverTitle
// //                 }
// //               >
// //                 {t(
// //                   'games.floodRunner.failed'
// //                 )}
// //               </Text>

// //               <Text
// //                 style={
// //                   styles.gameOverText
// //                 }
// //               >
// //                 {t(
// //                   'games.floodRunner.failedDescription'
// //                 )}
// //               </Text>

// //               <Text
// //                 style={
// //                   styles.finalScore
// //                 }
// //               >
// //                 {score} /{' '}
// //                 {config.targetScore}
// //               </Text>

// //               <TouchableOpacity
// //                 style={
// //                   styles.retryButton
// //                 }
// //                 onPress={
// //                   startGame
// //                 }
// //                 activeOpacity={0.8}
// //               >
// //                 <Ionicons
// //                   name="refresh"
// //                   size={18}
// //                   color="#FFFFFF"
// //                 />

// //                 <Text
// //                   style={
// //                     styles.buttonText
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.retry'
// //                   )}
// //                 </Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}

// //           {/* WIN */}

// //           {hasWon && (
// //             <View
// //               style={
// //                 styles.endGameOverlay
// //               }
// //             >
// //               <View
// //                 style={[
// //                   styles.resultIcon,
// //                   {
// //                     backgroundColor:
// //                       '#064E3B',
// //                   },
// //                 ]}
// //               >
// //                 <Ionicons
// //                   name="shield-checkmark"
// //                   size={36}
// //                   color="#10B981"
// //                 />
// //               </View>

// //               <Text
// //                 style={
// //                   styles.successTitle
// //                 }
// //               >
// //                 {t(
// //                   'games.floodRunner.success'
// //                 )}
// //               </Text>

// //               <Text
// //                 style={
// //                   styles.gameOverText
// //                 }
// //               >
// //                 {t(
// //                   'games.floodRunner.successDescription'
// //                 )}
// //               </Text>

// //               <View
// //                 style={
// //                   styles.rewardRow
// //                 }
// //               >
// //                 <Reward
// //                   icon="flash"
// //                   value={`+${config.reward.xp}`}
// //                   label={t(
// //                     'games.floodRunner.xp'
// //                   )}
// //                 />

// //                 <Reward
// //                   icon="cash"
// //                   value={`+${config.reward.coins}`}
// //                   label={t(
// //                     'games.floodRunner.coins'
// //                   )}
// //                 />
// //               </View>

// //               <TouchableOpacity
// //                 style={
// //                   styles.claimRewardButton
// //                 }
// //                 onPress={
// //                   handleClaimReward
// //                 }
// //                 activeOpacity={0.8}
// //               >
// //                 <Ionicons
// //                   name="checkmark-circle"
// //                   size={18}
// //                   color="#FFFFFF"
// //                 />

// //                 <Text
// //                   style={
// //                     styles.buttonText
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.claimReward'
// //                   )}
// //                 </Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}
// //         </View>

// //         {/* SCORE */}

// //         <View
// //           style={styles.gameHud}
// //         >
// //           <View
// //             style={
// //               styles.scoreHeader
// //             }
// //           >
// //             <Text
// //               style={
// //                 styles.scoreLabel
// //               }
// //             >
// //               {t(
// //                 'games.floodRunner.score'
// //               )}
// //             </Text>

// //             <Text
// //               style={
// //                 styles.scoreValue
// //               }
// //             >
// //               {score} /{' '}
// //               {config.targetScore}
// //             </Text>
// //           </View>

// //           <View
// //             style={
// //               styles.progressBackground
// //             }
// //           >
// //             <View
// //               style={[
// //                 styles.progressFill,
// //                 {
// //                   width:
// //                     `${progressPercentage}%`,
// //                 },
// //               ]}
// //             />
// //           </View>

// //           {gameStarted &&
// //             !gameOver &&
// //             !hasWon && (
// //               <View
// //                 style={
// //                   styles.algorithmRow
// //                 }
// //               >
// //                 <Text
// //                   style={
// //                     styles.algorithmLabel
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.adaptive.safety'
// //                   )}
// //                 </Text>

// //                 <Text
// //                   style={
// //                     styles.algorithmValue
// //                   }
// //                 >
// //                   {riskScore}
// //                 </Text>
// //               </View>
// //             )}
// //         </View>

// //         {/* CONTROLS */}

// //         {gameStarted &&
// //           !gameOver &&
// //           !hasWon &&
// //           !rescueVisible && (
// //             <View
// //               style={
// //                 styles.controls
// //               }
// //             >
// //               <TouchableOpacity
// //                 style={
// //                   styles.controlButton
// //                 }
// //                 onPress={() =>
// //                   movePlayer('left')
// //                 }
// //                 activeOpacity={0.7}
// //               >
// //                 <Ionicons
// //                   name="arrow-back"
// //                   size={24}
// //                   color="#FFFFFF"
// //                 />

// //                 <Text
// //                   style={
// //                     styles.controlText
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.left'
// //                   )}
// //                 </Text>
// //               </TouchableOpacity>

// //               <View
// //                 style={
// //                   styles.controlHint
// //                 }
// //               >
// //                 <Ionicons
// //                   name={
// //                     sensorAvailable
// //                       ? 'phone-portrait-outline'
// //                       : 'hand-left-outline'
// //                   }
// //                   size={21}
// //                   color="#38BDF8"
// //                 />

// //                 <Text
// //                   style={
// //                     styles.controlHintText
// //                   }
// //                 >
// //                   {sensorAvailable
// //                     ? t(
// //                         'games.floodRunner.tilt'
// //                       )
// //                     : t(
// //                         'games.floodRunner.touch'
// //                       )}
// //                 </Text>
// //               </View>

// //               <TouchableOpacity
// //                 style={
// //                   styles.controlButton
// //                 }
// //                 onPress={() =>
// //                   movePlayer('right')
// //                 }
// //                 activeOpacity={0.7}
// //               >
// //                 <Ionicons
// //                   name="arrow-forward"
// //                   size={24}
// //                   color="#FFFFFF"
// //                 />

// //                 <Text
// //                   style={
// //                     styles.controlText
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.right'
// //                   )}
// //                 </Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}
// //       </View>
// //     </View>
// //   );
// // }

// // /*
// // |--------------------------------------------------------------------------
// // | INSTRUCTION ROW
// // |--------------------------------------------------------------------------
// // */

// // function InstructionRow({
// //   icon,
// //   text,
// // }) {
// //   return (
// //     <View
// //       style={
// //         styles.instructionRow
// //       }
// //     >
// //       <View
// //         style={
// //           styles.instructionIcon
// //         }
// //       >
// //         <Ionicons
// //           name={icon}
// //           size={16}
// //           color="#38BDF8"
// //         />
// //       </View>

// //       <Text
// //         style={
// //           styles.instructionText
// //         }
// //       >
// //         {text}
// //       </Text>
// //     </View>
// //   );
// // }

// // /*
// // |--------------------------------------------------------------------------
// // | REWARD
// // |--------------------------------------------------------------------------
// // */

// // function Reward({
// //   icon,
// //   value,
// //   label,
// // }) {
// //   return (
// //     <View
// //       style={styles.reward}
// //     >
// //       <Ionicons
// //         name={icon}
// //         size={18}
// //         color="#FBBF24"
// //       />

// //       <Text
// //         style={
// //           styles.rewardValue
// //         }
// //       >
// //         {value}
// //       </Text>

// //       <Text
// //         style={
// //           styles.rewardLabel
// //         }
// //       >
// //         {label}
// //       </Text>
// //     </View>
// //   );
// // }

// // /*
// // |--------------------------------------------------------------------------
// // | STYLES
// // |--------------------------------------------------------------------------
// // */

// // const styles = StyleSheet.create({
// //   screen: {
// //     flex: 1,
// //     backgroundColor: '#020617',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 8,
// //   },

// //   modalContentCard: {
// //     backgroundColor: '#0F172A',
// //     borderWidth: 1,
// //     borderColor: '#1E293B',
// //     borderRadius: 22,
// //     padding: 12,
// //     maxWidth: 430,
// //     maxHeight: '98%',
// //   },

// //   modalHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },

// //   headerTitleArea: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },

// //   headerIcon: {
// //     width: 38,
// //     height: 38,
// //     borderRadius: 12,
// //     backgroundColor: '#082F49',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginRight: 10,
// //   },

// //   headerTextArea: {
// //     flex: 1,
// //   },

// //   modalTitle: {
// //     color: '#FFFFFF',
// //     fontSize: 17,
// //     fontWeight: '900',
// //   },

// //   levelLabel: {
// //     color: '#38BDF8',
// //     fontSize: 11,
// //     fontWeight: '800',
// //     marginTop: 3,
// //   },

// //   objectiveCard: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#052E16',
// //     borderWidth: 1,
// //     borderColor: '#166534',
// //     borderRadius: 13,
// //     padding: 10,
// //     marginBottom: 8,
// //   },

// //   objectiveIcon: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 10,
// //     backgroundColor: '#064E3B',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginRight: 10,
// //   },

// //   objectiveTextArea: {
// //     flex: 1,
// //   },

// //   objectiveTitle: {
// //     color: '#34D399',
// //     fontSize: 11,
// //     fontWeight: '900',
// //     textTransform: 'uppercase',
// //   },

// //   objectiveText: {
// //     color: '#A7F3D0',
// //     fontSize: 11,
// //     lineHeight: 16,
// //     marginTop: 2,
// //   },

// //   instructionsCard: {
// //     backgroundColor: '#111827',
// //     borderWidth: 1,
// //     borderColor: '#334155',
// //     borderRadius: 14,
// //     padding: 11,
// //     marginBottom: 8,
// //   },

// //   instructionsHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 6,
// //   },

// //   instructionsTitle: {
// //     color: '#FFFFFF',
// //     fontSize: 13,
// //     fontWeight: '900',
// //     marginLeft: 7,
// //   },

// //   instructionRow: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //     marginTop: 6,
// //   },

// //   instructionIcon: {
// //     width: 25,
// //     height: 25,
// //     borderRadius: 8,
// //     backgroundColor: '#082F49',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginRight: 8,
// //   },

// //   instructionText: {
// //     flex: 1,
// //     color: '#CBD5E1',
// //     fontSize: 11,
// //     lineHeight: 16,
// //     paddingTop: 3,
// //   },

// //   sensorStatus: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     alignSelf: 'flex-start',
// //     backgroundColor: '#020617',
// //     paddingHorizontal: 9,
// //     paddingVertical: 5,
// //     borderRadius: 8,
// //     marginBottom: 8,
// //   },

// //   sensorText: {
// //     fontSize: 10,
// //     fontWeight: '800',
// //     marginLeft: 6,
// //   },

// //   lifeBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginLeft: 10,
// //     paddingLeft: 8,
// //     borderLeftWidth: 1,
// //     borderLeftColor: '#334155',
// //   },

// //   lifeText: {
// //     color: '#FB7185',
// //     fontSize: 10,
// //     fontWeight: '900',
// //     marginLeft: 4,
// //   },

// //   gameCanvas: {
// //     backgroundColor: '#020617',
// //     borderRadius: 16,
// //     borderWidth: 1,
// //     borderColor: '#1E293B',
// //     position: 'relative',
// //     overflow: 'hidden',
// //   },

// //   safeZone: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     height: SAFE_ZONE_HEIGHT,
// //     backgroundColor: '#064E3B',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#10B981',
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 14,
// //     zIndex: 4,
// //   },

// //   safeZoneIcon: {
// //     width: 34,
// //     height: 34,
// //     borderRadius: 10,
// //     backgroundColor: '#065F46',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginRight: 9,
// //   },

// //   safeZoneTitle: {
// //     color: '#D1FAE5',
// //     fontSize: 11,
// //     fontWeight: '900',
// //     letterSpacing: 0.5,
// //   },

// //   safeZoneSub: {
// //     color: '#6EE7B7',
// //     fontSize: 9,
// //     fontWeight: '700',
// //     marginTop: 2,
// //   },

// //   dangerField: {
// //     position: 'absolute',
// //     top: SAFE_ZONE_HEIGHT,
// //     bottom: FLOOD_HEIGHT,
// //     left: 0,
// //     right: 0,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },

// //   routeLine: {
// //     position: 'absolute',
// //     width: 2,
// //     height: '100%',
// //     backgroundColor: '#1E293B',
// //     opacity: 0.8,
// //   },

// //   dangerText: {
// //     color: '#334155',
// //     fontSize: 8,
// //     fontWeight: '900',
// //     letterSpacing: 1.5,
// //     transform: [
// //       {
// //         rotate: '-90deg',
// //       },
// //     ],
// //   },

// //   debrisNode: {
// //     position: 'absolute',
// //     width: DEBRIS_SIZE,
// //     height: DEBRIS_SIZE,
// //     borderRadius:
// //       DEBRIS_SIZE / 2,
// //     backgroundColor: '#450A0A',
// //     borderWidth: 1,
// //     borderColor: '#EF4444',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     zIndex: 5,
// //   },

// //   playerNode: {
// //     position: 'absolute',
// //     width: PLAYER_SIZE,
// //     height: PLAYER_SIZE,
// //     borderRadius:
// //       PLAYER_SIZE / 2,
// //     backgroundColor: '#2563EB',
// //     borderWidth: 2,
// //     borderColor: '#60A5FA',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     zIndex: 6,
// //   },

// //   floodLayer: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     height: FLOOD_HEIGHT,
// //     backgroundColor: '#075985',
// //     borderTopWidth: 1,
// //     borderTopColor: '#38BDF8',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     zIndex: 3,
// //   },

// //   waveContainer: {
// //     position: 'absolute',
// //     top: -13,
// //     left: 0,
// //     right: 0,
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //   },

// //   wave: {
// //     color: '#38BDF8',
// //     fontSize: 24,
// //     fontWeight: '900',
// //   },

// //   floodLabel: {
// //     color: '#BAE6FD',
// //     fontSize: 9,
// //     fontWeight: '900',
// //     letterSpacing: 2,
// //     marginTop: 12,
// //   },

// //   adaptiveBadge: {
// //     position: 'absolute',
// //     top: SAFE_ZONE_HEIGHT + 8,
// //     right: 8,
// //     zIndex: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(2, 6, 23, 0.82)',
// //     borderWidth: 1,
// //     borderColor: '#164E63',
// //     borderRadius: 8,
// //     paddingHorizontal: 7,
// //     paddingVertical: 4,
// //   },

// //   adaptiveText: {
// //     color: '#7DD3FC',
// //     fontSize: 8,
// //     fontWeight: '900',
// //     marginLeft: 4,
// //   },

// //   startOverlay: {
// //     position: 'absolute',
// //     top: SAFE_ZONE_HEIGHT,
// //     bottom: FLOOD_HEIGHT,
// //     left: 0,
// //     right: 0,
// //     backgroundColor:
// //       'rgba(2, 6, 23, 0.94)',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 20,
// //     zIndex: 20,
// //   },

// //   startIcon: {
// //     width: 62,
// //     height: 62,
// //     borderRadius: 20,
// //     backgroundColor: '#082F49',
// //     borderWidth: 1,
// //     borderColor: '#0369A1',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 12,
// //   },

// //   startTitle: {
// //     color: '#FFFFFF',
// //     fontSize: 20,
// //     fontWeight: '900',
// //     textAlign: 'center',
// //   },

// //   startDescription: {
// //     color: '#94A3B8',
// //     fontSize: 12,
// //     lineHeight: 18,
// //     textAlign: 'center',
// //     marginTop: 6,
// //     maxWidth: 250,
// //   },

// //   startButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: '#0284C7',
// //     borderRadius: 12,
// //     minHeight: 48,
// //     paddingHorizontal: 22,
// //     marginTop: 16,
// //   },

// //   startButtonText: {
// //     color: '#FFFFFF',
// //     fontSize: 13,
// //     fontWeight: '900',
// //     marginLeft: 7,
// //   },

// //   countdownOverlay: {
// //     position: 'absolute',
// //     top: SAFE_ZONE_HEIGHT,
// //     bottom: FLOOD_HEIGHT,
// //     left: 0,
// //     right: 0,
// //     backgroundColor:
// //       'rgba(2, 6, 23, 0.85)',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     zIndex: 30,
// //   },

// //   countdownNumber: {
// //     color: '#38BDF8',
// //     fontSize: 64,
// //     fontWeight: '900',
// //   },

// //   countdownText: {
// //     color: '#CBD5E1',
// //     fontSize: 12,
// //     fontWeight: '800',
// //     marginTop: 2,
// //   },

// //   /*
// //   |--------------------------------------------------------------------------
// //   | RESCUE QUESTION STYLES
// //   |--------------------------------------------------------------------------
// //   */

// //   rescueOverlay: {
// //     position: 'absolute',
// //     top: SAFE_ZONE_HEIGHT + 5,
// //     bottom: FLOOD_HEIGHT + 5,
// //     left: 6,
// //     right: 6,
// //     backgroundColor:
// //       'rgba(15, 23, 42, 0.985)',
// //     borderWidth: 1,
// //     borderColor: '#92400E',
// //     borderRadius: 18,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 14,
// //     zIndex: 40,
// //   },

// //   rescueIcon: {
// //     width: 52,
// //     height: 52,
// //     borderRadius: 17,
// //     backgroundColor: '#451A03',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 7,
// //   },

// //   rescueTitle: {
// //     color: '#FBBF24',
// //     fontSize: 18,
// //     fontWeight: '900',
// //     textAlign: 'center',
// //   },

// //   rescueDescription: {
// //     color: '#94A3B8',
// //     fontSize: 10,
// //     lineHeight: 15,
// //     textAlign: 'center',
// //     marginTop: 4,
// //     maxWidth: 280,
// //   },

// //   rescueQuestion: {
// //     color: '#FFFFFF',
// //     fontSize: 13,
// //     fontWeight: '900',
// //     lineHeight: 19,
// //     textAlign: 'center',
// //     marginTop: 10,
// //     marginBottom: 8,
// //     maxWidth: 285,
// //   },

// //   answerList: {
// //     width: '100%',
// //   },

// //   answerButton: {
// //     minHeight: 38,
// //     borderWidth: 1,
// //     borderRadius: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 8,
// //     marginTop: 5,
// //   },

// //   answerLetter: {
// //     width: 25,
// //     height: 25,
// //     borderRadius: 8,
// //     backgroundColor: '#0F172A',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginRight: 8,
// //   },

// //   answerLetterText: {
// //     color: '#38BDF8',
// //     fontSize: 9,
// //     fontWeight: '900',
// //   },

// //   answerText: {
// //     flex: 1,
// //     color: '#E2E8F0',
// //     fontSize: 10,
// //     fontWeight: '700',
// //   },

// //   rescueLifeNotice: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 8,
// //   },

// //   rescueLifeText: {
// //     color: '#64748B',
// //     fontSize: 8,
// //     fontWeight: '800',
// //     marginLeft: 5,
// //   },

// //   /*
// //   |--------------------------------------------------------------------------
// //   | END GAME
// //   |--------------------------------------------------------------------------
// //   */

// //   endGameOverlay: {
// //     position: 'absolute',
// //     top: SAFE_ZONE_HEIGHT + 8,
// //     bottom: FLOOD_HEIGHT + 8,
// //     left: 10,
// //     right: 10,
// //     backgroundColor:
// //       'rgba(15, 23, 42, 0.98)',
// //     borderWidth: 1,
// //     borderColor: '#334155',
// //     borderRadius: 18,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 18,
// //     zIndex: 30,
// //   },

// //   resultIcon: {
// //     width: 64,
// //     height: 64,
// //     borderRadius: 20,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 10,
// //   },

// //   gameOverTitle: {
// //     color: '#EF4444',
// //     fontWeight: '900',
// //     fontSize: 20,
// //     textAlign: 'center',
// //   },

// //   successTitle: {
// //     color: '#10B981',
// //     fontWeight: '900',
// //     fontSize: 20,
// //     textAlign: 'center',
// //   },

// //   gameOverText: {
// //     color: '#94A3B8',
// //     fontSize: 11,
// //     textAlign: 'center',
// //     lineHeight: 17,
// //     marginTop: 7,
// //     maxWidth: 250,
// //   },

// //   finalScore: {
// //     color: '#FFFFFF',
// //     fontSize: 24,
// //     fontWeight: '900',
// //     marginTop: 12,
// //   },

// //   retryButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: '#DC2626',
// //     minHeight: 44,
// //     paddingHorizontal: 20,
// //     borderRadius: 11,
// //     marginTop: 14,
// //   },

// //   claimRewardButton: {
// //     flexDirection: 'row',
// //     backgroundColor: '#059669',
// //     minHeight: 46,
// //     paddingHorizontal: 22,
// //     borderRadius: 11,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginTop: 14,
// //   },

// //   buttonText: {
// //     color: '#FFFFFF',
// //     fontWeight: '900',
// //     fontSize: 12,
// //     marginLeft: 6,
// //   },

// //   rewardRow: {
// //     flexDirection: 'row',
// //     marginTop: 14,
// //     gap: 10,
// //   },

// //   reward: {
// //     minWidth: 78,
// //     backgroundColor: '#111827',
// //     borderWidth: 1,
// //     borderColor: '#334155',
// //     borderRadius: 10,
// //     paddingVertical: 8,
// //     paddingHorizontal: 10,
// //     alignItems: 'center',
// //   },

// //   rewardValue: {
// //     color: '#FBBF24',
// //     fontSize: 16,
// //     fontWeight: '900',
// //     marginTop: 2,
// //   },

// //   rewardLabel: {
// //     color: '#64748B',
// //     fontSize: 8,
// //     fontWeight: '800',
// //     marginTop: 1,
// //   },

// //   /*
// //   |--------------------------------------------------------------------------
// //   | HUD
// //   |--------------------------------------------------------------------------
// //   */

// //   gameHud: {
// //     marginTop: 9,
// //   },

// //   scoreHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //   },

// //   scoreLabel: {
// //     color: '#64748B',
// //     fontSize: 9,
// //     fontWeight: '900',
// //     letterSpacing: 1,
// //   },

// //   scoreValue: {
// //     color: '#FFFFFF',
// //     fontSize: 16,
// //     fontWeight: '900',
// //   },

// //   progressBackground: {
// //     height: 6,
// //     width: '100%',
// //     backgroundColor: '#1E293B',
// //     borderRadius: 3,
// //     overflow: 'hidden',
// //     marginTop: 5,
// //   },

// //   progressFill: {
// //     height: '100%',
// //     backgroundColor: '#38BDF8',
// //     borderRadius: 3,
// //   },

// //   algorithmRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginTop: 4,
// //   },

// //   algorithmLabel: {
// //     color: '#475569',
// //     fontSize: 7,
// //     fontWeight: '900',
// //     letterSpacing: 0.5,
// //   },

// //   algorithmValue: {
// //     color: '#38BDF8',
// //     fontSize: 8,
// //     fontWeight: '900',
// //   },

// //   /*
// //   |--------------------------------------------------------------------------
// //   | CONTROLS
// //   |--------------------------------------------------------------------------
// //   */

// //   controls: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     marginTop: 9,
// //     gap: 8,
// //   },

// //   controlButton: {
// //     flex: 1,
// //     minHeight: 54,
// //     backgroundColor: '#1E3A8A',
// //     borderWidth: 1,
// //     borderColor: '#3B82F6',
// //     borderRadius: 13,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingHorizontal: 5,
// //   },

// //   controlText: {
// //     color: '#BFDBFE',
// //     fontSize: 8,
// //     fontWeight: '900',
// //     marginTop: 2,
// //     textAlign: 'center',
// //   },

// //   controlHint: {
// //     width: 54,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },

// //   controlHintText: {
// //     color: '#38BDF8',
// //     fontSize: 7,
// //     fontWeight: '900',
// //     marginTop: 3,
// //     textAlign: 'center',
// //   },
// // });
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';

// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   BackHandler,
// } from 'react-native';

// import { Ionicons } from '@expo/vector-icons';
// import * as Haptics from 'expo-haptics';
// import { Accelerometer } from 'expo-sensors';
// import { useTranslation } from 'react-i18next';
// import {
//   useNavigation,
//   useRoute,
// } from '@react-navigation/native';

// import { useUser } from '../contexts/UserContext';

// const {
//   width: SCREEN_WIDTH,
//   height: SCREEN_HEIGHT,
// } = Dimensions.get('window');

// /* ============================================================
//    LEVEL CONFIG
// ============================================================ */

// const LEVEL_CONFIG = {
//   1: {
//     nameKey: 'games.floodRunner.levels.easy',

//     targetScore: 50,

//     debrisSpeed: 155,
//     spawnInterval: 1150,
//     spawnCount: 1,

//     playerSpeed: 300,

//     reward: {
//       xp: 100,
//       coins: 25,
//     },
//   },

//   2: {
//     nameKey: 'games.floodRunner.levels.moderate',

//     targetScore: 75,

//     debrisSpeed: 205,
//     spawnInterval: 900,
//     spawnCount: 2,

//     playerSpeed: 340,

//     reward: {
//       xp: 150,
//       coins: 40,
//     },
//   },

//   3: {
//     nameKey: 'games.floodRunner.levels.advanced',

//     targetScore: 100,

//     debrisSpeed: 255,
//     spawnInterval: 750,
//     spawnCount: 3,

//     playerSpeed: 380,

//     reward: {
//       xp: 200,
//       coins: 60,
//     },
//   },
// };

// /* ============================================================
//    GAME CONSTANTS
// ============================================================ */

// const PLAYER_SIZE = 36;
// const DEBRIS_SIZE = 28;

// const FLOOD_HEIGHT = 64;
// const PLAYER_BOTTOM_OFFSET = 14;

// const COLLISION_PADDING = 5;

// const TOUCH_MOVE_MULTIPLIER = 0.22;
// const SENSOR_DEAD_ZONE = 0.05;

// /* Adaptive difficulty */

// const MIN_DIFFICULTY_FACTOR = 0.78;
// const MAX_DIFFICULTY_FACTOR = 1.15;

// const NEAR_MISS_DISTANCE = 34;

// const RISK_INCREASE_COLLISION = 28;
// const RISK_INCREASE_NEAR_MISS = 5;

// const RISK_DECREASE_SUCCESS = 1.5;
// const RISK_DECREASE_CORRECT_RESCUE = 12;

// const RISK_UPDATE_INTERVAL = 1000;

// /* Rescue */

// const MAX_RESCUE_LIVES = 1;
// const RESCUE_POINTS = 15;

// /* ============================================================
//    RESCUE QUESTIONS
// ============================================================ */

// const RESCUE_QUESTIONS = [
//   {
//     id: 'q1',

//     questionKey:
//       'games.floodRunner.questions.q1.question',

//     options: [
//       {
//         id: 'a',
//         textKey:
//           'games.floodRunner.questions.q1.a',
//       },
//       {
//         id: 'b',
//         textKey:
//           'games.floodRunner.questions.q1.b',
//       },
//       {
//         id: 'c',
//         textKey:
//           'games.floodRunner.questions.q1.c',
//       },
//     ],

//     correct: 'b',
//   },

//   {
//     id: 'q2',

//     questionKey:
//       'games.floodRunner.questions.q2.question',

//     options: [
//       {
//         id: 'a',
//         textKey:
//           'games.floodRunner.questions.q2.a',
//       },
//       {
//         id: 'b',
//         textKey:
//           'games.floodRunner.questions.q2.b',
//       },
//       {
//         id: 'c',
//         textKey:
//           'games.floodRunner.questions.q2.c',
//       },
//     ],

//     correct: 'a',
//   },

//   {
//     id: 'q3',

//     questionKey:
//       'games.floodRunner.questions.q3.question',

//     options: [
//       {
//         id: 'a',
//         textKey:
//           'games.floodRunner.questions.q3.a',
//       },
//       {
//         id: 'b',
//         textKey:
//           'games.floodRunner.questions.q3.b',
//       },
//       {
//         id: 'c',
//         textKey:
//           'games.floodRunner.questions.q3.c',
//       },
//     ],

//     correct: 'c',
//   },

//   {
//     id: 'q4',

//     questionKey:
//       'games.floodRunner.questions.q4.question',

//     options: [
//       {
//         id: 'a',
//         textKey:
//           'games.floodRunner.questions.q4.a',
//       },
//       {
//         id: 'b',
//         textKey:
//           'games.floodRunner.questions.q4.b',
//       },
//       {
//         id: 'c',
//         textKey:
//           'games.floodRunner.questions.q4.c',
//       },
//     ],

//     correct: 'a',
//   },

//   {
//     id: 'q5',

//     questionKey:
//       'games.floodRunner.questions.q5.question',

//     options: [
//       {
//         id: 'a',
//         textKey:
//           'games.floodRunner.questions.q5.a',
//       },
//       {
//         id: 'b',
//         textKey:
//           'games.floodRunner.questions.q5.b',
//       },
//       {
//         id: 'c',
//         textKey:
//           'games.floodRunner.questions.q5.c',
//       },
//     ],

//     correct: 'b',
//   },
// ];

// /* ============================================================
//    HELPERS
// ============================================================ */

// function clamp(value, min, max) {
//   return Math.max(
//     min,
//     Math.min(max, value)
//   );
// }

// function getRandomQuestion() {
//   const index = Math.floor(
//     Math.random() *
//       RESCUE_QUESTIONS.length
//   );

//   return RESCUE_QUESTIONS[index];
// }

// /* ============================================================
//    COMPONENT
// ============================================================ */

// export default function FloodRunnerGameModal() {
//   const { t } = useTranslation();

//   /*
//    * IMPORTANT:
//    *
//    * completeMission must come from UserContext.
//    *
//    * If your UserContext uses a different function name,
//    * change it here.
//    */
//   const {
//     completeMission,
//   } = useUser();

//   const navigation = useNavigation();
//   const route = useRoute();

//   /* ==========================================================
//      LEVEL
//   ========================================================== */

//   const routeLevel =
//     route?.params?.level ?? 1;

//   const selectedLevel = Math.min(
//     3,
//     Math.max(
//       1,
//       Number(routeLevel) || 1
//     )
//   );

//   const config =
//     LEVEL_CONFIG[selectedLevel];

//   /* ==========================================================
//      DIMENSIONS
//   ========================================================== */

//   const GAME_WIDTH = Math.min(
//     SCREEN_WIDTH - 32,
//     390
//   );

//   const GAME_HEIGHT = Math.min(
//     SCREEN_HEIGHT * 0.52,
//     430
//   );

//   const INITIAL_PLAYER_X =
//     GAME_WIDTH / 2 -
//     PLAYER_SIZE / 2;

//   /* ==========================================================
//      STATE
//   ========================================================== */

//   const [gameStarted, setGameStarted] =
//     useState(false);

//   const [countdown, setCountdown] =
//     useState(null);

//   const [playerPositionX, setPlayerPositionX] =
//     useState(INITIAL_PLAYER_X);

//   const [debris, setDebris] =
//     useState([]);

//   const [score, setScore] =
//     useState(0);

//   const [gameOver, setGameOver] =
//     useState(false);

//   const [hasWon, setHasWon] =
//     useState(false);

//   const [sensorAvailable, setSensorAvailable] =
//     useState(false);

//   const [rescueVisible, setRescueVisible] =
//     useState(false);

//   const [rescueQuestion, setRescueQuestion] =
//     useState(null);

//   const [rescueLives, setRescueLives] =
//     useState(MAX_RESCUE_LIVES);

//   const [selectedAnswer, setSelectedAnswer] =
//     useState(null);

//   const [answerFeedback, setAnswerFeedback] =
//     useState(null);

//   const [riskScore, setRiskScore] =
//     useState(50);

//   const [difficultyFactor, setDifficultyFactor] =
//     useState(1);

//   /*
//    * Prevents the reward from being claimed twice.
//    */
//   const [rewardClaimed, setRewardClaimed] =
//     useState(false);

//   /* ==========================================================
//      REFS
//   ========================================================== */

//   const playerXRef =
//     useRef(INITIAL_PLAYER_X);

//   const debrisRef =
//     useRef([]);

//   const scoreRef =
//     useRef(0);

//   const gameRunningRef =
//     useRef(false);

//   const gameOverRef =
//     useRef(false);

//   const hasWonRef =
//     useRef(false);

//   const rewardClaimedRef =
//     useRef(false);

//   const movementRef =
//     useRef(0);

//   const animationFrameRef =
//     useRef(null);

//   const lastFrameTimeRef =
//     useRef(null);

//   const lastSpawnTimeRef =
//     useRef(0);

//   const countdownTimerRef =
//     useRef(null);

//   const sensorSubscriptionRef =
//     useRef(null);

//   /*
//    * Each game gets its own session ID.
//    * This prevents an old animation loop
//    * from restarting after retry/rescue.
//    */
//   const gameSessionRef =
//     useRef(0);

//   /*
//    * Adaptive difficulty data.
//    */
//   const adaptiveRef =
//     useRef({
//       riskScore: 50,
//       nearMisses: 0,
//       successfulDodges: 0,
//       collisions: 0,
//       correctRescues: 0,
//       lastRiskUpdate: 0,
//     });

//   /* ==========================================================
//      HAPTICS
//   ========================================================== */

//   const safeImpact =
//     useCallback(async (style) => {
//       try {
//         await Haptics.impactAsync(style);
//       } catch (error) {
//         // Haptics unavailable.
//       }
//     }, []);

//   const safeNotification =
//     useCallback(async (type) => {
//       try {
//         await Haptics.notificationAsync(type);
//       } catch (error) {
//         // Haptics unavailable.
//       }
//     }, []);

//   /* ==========================================================
//      DIFFICULTY
//   ========================================================== */

//   const calculateAdaptiveDifficulty =
//     useCallback(
//       (timestamp) => {
//         const adaptive =
//           adaptiveRef.current;

//         if (
//           timestamp -
//             adaptive.lastRiskUpdate <
//           RISK_UPDATE_INTERVAL
//         ) {
//           return;
//         }

//         adaptive.lastRiskUpdate =
//           timestamp;

//         adaptive.riskScore -=
//           adaptive.successfulDodges *
//           RISK_DECREASE_SUCCESS;

//         adaptive.successfulDodges = 0;

//         adaptive.riskScore +=
//           adaptive.correctRescues * 2;

//         adaptive.correctRescues = 0;

//         adaptive.riskScore = clamp(
//           adaptive.riskScore,
//           0,
//           100
//         );

//         const nextFactor =
//           MAX_DIFFICULTY_FACTOR -
//           (adaptive.riskScore / 100) *
//             (
//               MAX_DIFFICULTY_FACTOR -
//               MIN_DIFFICULTY_FACTOR
//             );

//         setRiskScore(
//           Math.round(adaptive.riskScore)
//         );

//         setDifficultyFactor(
//           clamp(
//             nextFactor,
//             MIN_DIFFICULTY_FACTOR,
//             MAX_DIFFICULTY_FACTOR
//           )
//         );
//       },
//       []
//     );

//   /* ==========================================================
//      CLAMP PLAYER
//   ========================================================== */

//   const clampPlayerX =
//     useCallback(
//       (x) => {
//         return Math.max(
//           0,
//           Math.min(
//             GAME_WIDTH - PLAYER_SIZE,
//             x
//           )
//         );
//       },
//       [GAME_WIDTH]
//     );

//   /* ==========================================================
//      CREATE DEBRIS
//   ========================================================== */

//   const createDebrisObject =
//     useCallback(
//       (y = -DEBRIS_SIZE) => {
//         return {
//           id:
//             `${Date.now()}-${Math.random()}`,

//           x:
//             Math.random() *
//             Math.max(
//               1,
//               GAME_WIDTH - DEBRIS_SIZE
//             ),

//           y,

//           nearMissed: false,
//         };
//       },
//       [GAME_WIDTH]
//     );

//   /* ==========================================================
//      INITIAL DEBRIS
//   ========================================================== */

//   const createInitialDebris =
//     useCallback(() => {
//       const objects = [];

//       for (
//         let index = 0;
//         index < config.spawnCount;
//         index += 1
//       ) {
//         objects.push({
//           id:
//             `${Date.now()}-${index}-${Math.random()}`,

//           x:
//             Math.random() *
//             Math.max(
//               1,
//               GAME_WIDTH - DEBRIS_SIZE
//             ),

//           y:
//             -DEBRIS_SIZE -
//             index * 120 -
//             Math.random() * 100,

//           nearMissed: false,
//         });
//       }

//       return objects;
//     }, [
//       config.spawnCount,
//       GAME_WIDTH,
//     ]);

//   /* ==========================================================
//      STOP SENSOR
//   ========================================================== */

//   const stopSensor =
//     useCallback(() => {
//       if (
//         sensorSubscriptionRef.current
//       ) {
//         try {
//           sensorSubscriptionRef.current.remove();
//         } catch (error) {
//           // Ignore.
//         }

//         sensorSubscriptionRef.current =
//           null;
//       }

//       movementRef.current = 0;
//     }, []);

//   /* ==========================================================
//      STOP GAME LOOP
//   ========================================================== */

//   const stopGameLoop =
//     useCallback(() => {
//       gameRunningRef.current = false;

//       gameSessionRef.current += 1;

//       if (
//         animationFrameRef.current !== null
//       ) {
//         cancelAnimationFrame(
//           animationFrameRef.current
//         );

//         animationFrameRef.current = null;
//       }

//       lastFrameTimeRef.current = null;
//     }, []);

//   /* ==========================================================
//      RESET
//   ========================================================== */

//   const resetGame =
//     useCallback(() => {
//       if (
//         countdownTimerRef.current
//       ) {
//         clearInterval(
//           countdownTimerRef.current
//         );

//         countdownTimerRef.current = null;
//       }

//       stopGameLoop();
//       stopSensor();

//       playerXRef.current =
//         INITIAL_PLAYER_X;

//       debrisRef.current = [];

//       scoreRef.current = 0;

//       gameRunningRef.current = false;
//       gameOverRef.current = false;
//       hasWonRef.current = false;

//       rewardClaimedRef.current = false;

//       movementRef.current = 0;

//       adaptiveRef.current = {
//         riskScore: 50,
//         nearMisses: 0,
//         successfulDodges: 0,
//         collisions: 0,
//         correctRescues: 0,
//         lastRiskUpdate: 0,
//       };

//       setGameStarted(false);
//       setCountdown(null);

//       setPlayerPositionX(
//         INITIAL_PLAYER_X
//       );

//       setDebris([]);
//       setScore(0);

//       setGameOver(false);
//       setHasWon(false);

//       setRescueVisible(false);
//       setRescueQuestion(null);

//       setSelectedAnswer(null);
//       setAnswerFeedback(null);

//       setRescueLives(
//         MAX_RESCUE_LIVES
//       );

//       setRiskScore(50);
//       setDifficultyFactor(1);

//       setRewardClaimed(false);
//     }, [
//       INITIAL_PLAYER_X,
//       stopGameLoop,
//       stopSensor,
//     ]);

//   /* ==========================================================
//      FINISH / GAME OVER
//   ========================================================== */

//   const finishGame =
//     useCallback(() => {
//       if (
//         gameOverRef.current ||
//         hasWonRef.current
//       ) {
//         return;
//       }

//       gameRunningRef.current = false;
//       gameOverRef.current = true;

//       stopSensor();

//       if (
//         animationFrameRef.current !== null
//       ) {
//         cancelAnimationFrame(
//           animationFrameRef.current
//         );

//         animationFrameRef.current = null;
//       }

//       lastFrameTimeRef.current = null;

//       setGameOver(true);

//       safeNotification(
//         Haptics.NotificationFeedbackType.Error
//       );
//     }, [
//       safeNotification,
//       stopSensor,
//     ]);

//   /* ==========================================================
//      WIN
//   ========================================================== */

//   const winGame =
//     useCallback(() => {
//       if (
//         hasWonRef.current ||
//         gameOverRef.current
//       ) {
//         return;
//       }

//       gameRunningRef.current = false;
//       hasWonRef.current = true;

//       stopSensor();

//       scoreRef.current =
//         config.targetScore;

//       setScore(
//         config.targetScore
//       );

//       setHasWon(true);

//       if (
//         animationFrameRef.current !== null
//       ) {
//         cancelAnimationFrame(
//           animationFrameRef.current
//         );

//         animationFrameRef.current = null;
//       }

//       lastFrameTimeRef.current = null;

//       safeNotification(
//         Haptics.NotificationFeedbackType.Success
//       );
//     }, [
//       config.targetScore,
//       safeNotification,
//       stopSensor,
//     ]);

//   /* ==========================================================
//      COLLISION
//   ========================================================== */

//   const checkCollision =
//     useCallback(
//       (playerX, debrisItem) => {
//         const playerTop =
//           GAME_HEIGHT -
//           PLAYER_SIZE -
//           PLAYER_BOTTOM_OFFSET -
//           FLOOD_HEIGHT;

//         const playerLeft =
//           playerX +
//           COLLISION_PADDING;

//         const playerRight =
//           playerX +
//           PLAYER_SIZE -
//           COLLISION_PADDING;

//         const playerCollisionTop =
//           playerTop +
//           COLLISION_PADDING;

//         const playerCollisionBottom =
//           playerTop +
//           PLAYER_SIZE -
//           COLLISION_PADDING;

//         const debrisLeft =
//           debrisItem.x +
//           COLLISION_PADDING;

//         const debrisRight =
//           debrisItem.x +
//           DEBRIS_SIZE -
//           COLLISION_PADDING;

//         const debrisTop =
//           debrisItem.y +
//           COLLISION_PADDING;

//         const debrisBottom =
//           debrisItem.y +
//           DEBRIS_SIZE -
//           COLLISION_PADDING;

//         return (
//           playerLeft < debrisRight &&
//           playerRight > debrisLeft &&
//           playerCollisionTop < debrisBottom &&
//           playerCollisionBottom > debrisTop
//         );
//       },
//       [GAME_HEIGHT]
//     );

//   /* ==========================================================
//      RESCUE QUESTION
//   ========================================================== */

//   const triggerRescueQuestion =
//     useCallback(() => {
//       if (rescueLives <= 0) {
//         finishGame();
//         return;
//       }

//       gameRunningRef.current = false;

//       stopSensor();

//       if (
//         animationFrameRef.current !== null
//       ) {
//         cancelAnimationFrame(
//           animationFrameRef.current
//         );

//         animationFrameRef.current = null;
//       }

//       adaptiveRef.current.collisions += 1;

//       adaptiveRef.current.riskScore +=
//         RISK_INCREASE_COLLISION;

//       adaptiveRef.current.riskScore =
//         clamp(
//           adaptiveRef.current.riskScore,
//           0,
//           100
//         );

//       const question =
//         getRandomQuestion();

//       setRescueQuestion(question);
//       setSelectedAnswer(null);
//       setAnswerFeedback(null);
//       setRescueVisible(true);

//       setRiskScore(
//         Math.round(
//           adaptiveRef.current.riskScore
//         )
//       );

//       safeNotification(
//         Haptics.NotificationFeedbackType.Warning
//       );
//     }, [
//       finishGame,
//       rescueLives,
//       safeNotification,
//       stopSensor,
//     ]);

//   /* ==========================================================
//      GAME LOOP
//   ========================================================== */

//   const runGameLoop =
//     useCallback(
//       (timestamp, sessionId) => {
//         if (
//           sessionId !==
//           gameSessionRef.current
//         ) {
//           return;
//         }

//         if (
//           !gameRunningRef.current ||
//           gameOverRef.current ||
//           hasWonRef.current ||
//           rescueVisible
//         ) {
//           return;
//         }

//         if (
//           lastFrameTimeRef.current === null
//         ) {
//           lastFrameTimeRef.current =
//             timestamp;
//         }

//         const delta =
//           Math.min(
//             timestamp -
//               lastFrameTimeRef.current,
//             50
//           ) / 1000;

//         lastFrameTimeRef.current =
//           timestamp;

//         calculateAdaptiveDifficulty(
//           timestamp
//         );

//         const adaptive =
//           adaptiveRef.current;

//         const factor =
//           clamp(
//             MAX_DIFFICULTY_FACTOR -
//               (
//                 adaptive.riskScore / 100
//               ) *
//               (
//                 MAX_DIFFICULTY_FACTOR -
//                 MIN_DIFFICULTY_FACTOR
//               ),
//             MIN_DIFFICULTY_FACTOR,
//             MAX_DIFFICULTY_FACTOR
//           );

//         /* PLAYER */

//         let nextPlayerX =
//           playerXRef.current;

//         const tilt =
//           movementRef.current;

//         if (
//           Math.abs(tilt) >=
//           SENSOR_DEAD_ZONE
//         ) {
//           nextPlayerX +=
//             tilt *
//             config.playerSpeed *
//             delta;
//         }

//         nextPlayerX =
//           clampPlayerX(nextPlayerX);

//         playerXRef.current =
//           nextPlayerX;

//         setPlayerPositionX(
//           nextPlayerX
//         );

//         /* DEBRIS */

//         const effectiveDebrisSpeed =
//           config.debrisSpeed *
//           factor;

//         const movedDebris =
//           debrisRef.current.map(
//             (item) => ({
//               ...item,

//               y:
//                 item.y +
//                 effectiveDebrisSpeed *
//                 delta,
//             })
//           );

//         /* COLLISION */

//         let collision = false;

//         const checkedDebris =
//           movedDebris.map(
//             (item) => {
//               if (
//                 checkCollision(
//                   nextPlayerX,
//                   item
//                 )
//               ) {
//                 collision = true;
//                 return item;
//               }

//               /*
//                * Near miss.
//                */
//               if (
//                 !item.nearMissed &&
//                 item.y >
//                   GAME_HEIGHT -
//                   PLAYER_SIZE -
//                   PLAYER_BOTTOM_OFFSET -
//                   FLOOD_HEIGHT -
//                   45 &&
//                 item.y <
//                   GAME_HEIGHT -
//                   PLAYER_SIZE -
//                   PLAYER_BOTTOM_OFFSET -
//                   FLOOD_HEIGHT +
//                   55
//               ) {
//                 const horizontalGap =
//                   Math.abs(
//                     (
//                       item.x +
//                       DEBRIS_SIZE / 2
//                     ) -
//                     (
//                       nextPlayerX +
//                       PLAYER_SIZE / 2
//                     )
//                   );

//                 if (
//                   horizontalGap <=
//                   NEAR_MISS_DISTANCE
//                 ) {
//                   adaptive.nearMisses += 1;

//                   adaptive.riskScore +=
//                     RISK_INCREASE_NEAR_MISS;

//                   adaptive.riskScore =
//                     clamp(
//                       adaptive.riskScore,
//                       0,
//                       100
//                     );

//                   return {
//                     ...item,
//                     nearMissed: true,
//                   };
//                 }
//               }

//               return item;
//             }
//           );

//         if (collision) {
//           debrisRef.current =
//             checkedDebris;

//           setDebris(
//             checkedDebris
//           );

//           triggerRescueQuestion();

//           return;
//         }

//         /* PASSED OBSTACLES */

//         let passedCount = 0;

//         const survivingDebris =
//           checkedDebris.filter(
//             (item) => {
//               if (
//                 item.y >
//                 GAME_HEIGHT
//               ) {
//                 passedCount += 1;

//                 adaptive.successfulDodges +=
//                   1;

//                 return false;
//               }

//               return true;
//             }
//           );

//         /* SCORE */

//         if (passedCount > 0) {
//           const nextScore =
//             Math.min(
//               config.targetScore,
//               scoreRef.current +
//                 passedCount * 10
//             );

//           scoreRef.current =
//             nextScore;

//           setScore(nextScore);

//           if (
//             nextScore >=
//             config.targetScore
//           ) {
//             debrisRef.current =
//               survivingDebris;

//             setDebris(
//               survivingDebris
//             );

//             winGame();

//             return;
//           }
//         }

//         /* SPAWN */

//         const effectiveSpawnInterval =
//           config.spawnInterval /
//           factor;

//         if (
//           timestamp -
//             lastSpawnTimeRef.current >=
//           effectiveSpawnInterval
//         ) {
//           lastSpawnTimeRef.current =
//             timestamp;

//           if (
//             survivingDebris.length <
//             config.spawnCount
//           ) {
//             survivingDebris.push(
//               createDebrisObject()
//             );
//           }
//         }

//         /*
//          * Safety limit.
//          */
//         while (
//           survivingDebris.length >
//           config.spawnCount
//         ) {
//           survivingDebris.shift();
//         }

//         debrisRef.current =
//           survivingDebris;

//         setDebris(
//           survivingDebris
//         );

//         animationFrameRef.current =
//           requestAnimationFrame(
//             (nextTimestamp) =>
//               runGameLoop(
//                 nextTimestamp,
//                 sessionId
//               )
//           );
//       },
//       [
//         calculateAdaptiveDifficulty,
//         checkCollision,
//         clampPlayerX,
//         config.debrisSpeed,
//         config.playerSpeed,
//         config.spawnCount,
//         config.spawnInterval,
//         config.targetScore,
//         createDebrisObject,
//         GAME_HEIGHT,
//         rescueVisible,
//         triggerRescueQuestion,
//         winGame,
//       ]
//     );

//   /* ==========================================================
//      RESCUE ANSWER
//   ========================================================== */

//   const handleRescueAnswer =
//     useCallback(
//       (answerId) => {
//         if (
//           !rescueQuestion ||
//           selectedAnswer
//         ) {
//           return;
//         }

//         setSelectedAnswer(answerId);

//         const correct =
//           answerId ===
//           rescueQuestion.correct;

//         if (!correct) {
//           setAnswerFeedback('wrong');

//           safeNotification(
//             Haptics.NotificationFeedbackType.Error
//           );

//           setTimeout(() => {
//             setRescueVisible(false);
//             setRescueQuestion(null);

//             finishGame();
//           }, 850);

//           return;
//         }

//         setAnswerFeedback('correct');

//         safeNotification(
//           Haptics.NotificationFeedbackType.Success
//         );

//         adaptiveRef.current.correctRescues +=
//           1;

//         adaptiveRef.current.riskScore -=
//           RISK_DECREASE_CORRECT_RESCUE;

//         adaptiveRef.current.riskScore =
//           clamp(
//             adaptiveRef.current.riskScore,
//             0,
//             100
//           );

//         const nextScore =
//           Math.min(
//             config.targetScore,
//             scoreRef.current +
//               RESCUE_POINTS
//           );

//         scoreRef.current =
//           nextScore;

//         setScore(nextScore);

//         setRiskScore(
//           Math.round(
//             adaptiveRef.current.riskScore
//           )
//         );

//         setDifficultyFactor(
//           MAX_DIFFICULTY_FACTOR -
//             (
//               adaptiveRef.current.riskScore /
//               100
//             ) *
//             (
//               MAX_DIFFICULTY_FACTOR -
//               MIN_DIFFICULTY_FACTOR
//             )
//         );

//         setRescueLives(
//           (value) =>
//             Math.max(0, value - 1)
//         );

//         /*
//          * Remove nearby obstacles.
//          */
//         debrisRef.current =
//           debrisRef.current.filter(
//             (item) =>
//               item.y <
//               GAME_HEIGHT * 0.35
//           );

//         setDebris(
//           debrisRef.current
//         );

//         /*
//          * IMPORTANT:
//          *
//          * Capture the current session.
//          * We create a fresh session after rescue
//          * so the old animation loop cannot interfere.
//          */
//         const newSession =
//           gameSessionRef.current + 1;

//         gameSessionRef.current =
//           newSession;

//         setTimeout(() => {
//           setRescueVisible(false);
//           setRescueQuestion(null);
//           setSelectedAnswer(null);
//           setAnswerFeedback(null);

//           if (
//             nextScore >=
//             config.targetScore
//           ) {
//             winGame();
//             return;
//           }

//           gameOverRef.current = false;
//           hasWonRef.current = false;
//           gameRunningRef.current = true;

//           lastFrameTimeRef.current = null;

//           lastSpawnTimeRef.current =
//             performance.now();

//           animationFrameRef.current =
//             requestAnimationFrame(
//               (timestamp) =>
//                 runGameLoop(
//                   timestamp,
//                   newSession
//                 )
//             );
//         }, 700);
//       },
//       [
//         config.targetScore,
//         finishGame,
//         GAME_HEIGHT,
//         rescueQuestion,
//         runGameLoop,
//         safeNotification,
//         selectedAnswer,
//         winGame,
//       ]
//     );

//   /* ==========================================================
//      BEGIN GAME
//   ========================================================== */

//   const beginGame =
//     useCallback(() => {
//       const sessionId =
//         gameSessionRef.current + 1;

//       gameSessionRef.current =
//         sessionId;

//       if (
//         animationFrameRef.current !== null
//       ) {
//         cancelAnimationFrame(
//           animationFrameRef.current
//         );

//         animationFrameRef.current = null;
//       }

//       playerXRef.current =
//         INITIAL_PLAYER_X;

//       const initialDebris =
//         createInitialDebris();

//       debrisRef.current =
//         initialDebris;

//       scoreRef.current = 0;

//       gameRunningRef.current = true;
//       gameOverRef.current = false;
//       hasWonRef.current = false;

//       rewardClaimedRef.current = false;

//       movementRef.current = 0;

//       lastFrameTimeRef.current = null;

//       lastSpawnTimeRef.current =
//         performance.now();

//       adaptiveRef.current = {
//         riskScore: 50,
//         nearMisses: 0,
//         successfulDodges: 0,
//         collisions: 0,
//         correctRescues: 0,
//         lastRiskUpdate:
//           performance.now(),
//       };

//       setRiskScore(50);
//       setDifficultyFactor(1);

//       setPlayerPositionX(
//         INITIAL_PLAYER_X
//       );

//       setDebris(initialDebris);
//       setScore(0);

//       setGameOver(false);
//       setHasWon(false);

//       setRewardClaimed(false);

//       setRescueLives(
//         MAX_RESCUE_LIVES
//       );

//       setGameStarted(true);

//       safeNotification(
//         Haptics.NotificationFeedbackType.Success
//       );

//       animationFrameRef.current =
//         requestAnimationFrame(
//           (timestamp) =>
//             runGameLoop(
//               timestamp,
//               sessionId
//             )
//         );
//     }, [
//       INITIAL_PLAYER_X,
//       createInitialDebris,
//       runGameLoop,
//       safeNotification,
//     ]);

//   /* ==========================================================
//      START GAME
//   ========================================================== */

//   const startGame =
//     useCallback(() => {
//       if (
//         gameRunningRef.current ||
//         countdown !== null
//       ) {
//         return;
//       }

//       if (
//         countdownTimerRef.current
//       ) {
//         clearInterval(
//           countdownTimerRef.current
//         );

//         countdownTimerRef.current = null;
//       }

//       stopGameLoop();
//       stopSensor();

//       playerXRef.current =
//         INITIAL_PLAYER_X;

//       debrisRef.current = [];

//       scoreRef.current = 0;

//       gameOverRef.current = false;
//       hasWonRef.current = false;
//       gameRunningRef.current = false;

//       rewardClaimedRef.current = false;

//       setPlayerPositionX(
//         INITIAL_PLAYER_X
//       );

//       setDebris([]);
//       setScore(0);

//       setGameOver(false);
//       setHasWon(false);

//       setRescueVisible(false);
//       setRescueQuestion(null);

//       setRescueLives(
//         MAX_RESCUE_LIVES
//       );

//       setRewardClaimed(false);

//       setGameStarted(false);

//       let count = 3;

//       setCountdown(count);

//       safeImpact(
//         Haptics.ImpactFeedbackStyle.Light
//       );

//       countdownTimerRef.current =
//         setInterval(() => {
//           count -= 1;

//           if (count <= 0) {
//             clearInterval(
//               countdownTimerRef.current
//             );

//             countdownTimerRef.current = null;

//             setCountdown(null);

//             beginGame();

//             return;
//           }

//           setCountdown(count);

//           safeImpact(
//             Haptics.ImpactFeedbackStyle.Light
//           );
//         }, 700);
//     }, [
//       beginGame,
//       countdown,
//       INITIAL_PLAYER_X,
//       safeImpact,
//       stopGameLoop,
//       stopSensor,
//     ]);

//   /* ==========================================================
//      TOUCH
//   ========================================================== */

//   const movePlayer =
//     useCallback(
//       (direction) => {
//         if (
//           !gameRunningRef.current ||
//           gameOverRef.current ||
//           hasWonRef.current
//         ) {
//           return;
//         }

//         const amount =
//           config.playerSpeed *
//           TOUCH_MOVE_MULTIPLIER;

//         let nextX =
//           playerXRef.current;

//         if (direction === 'left') {
//           nextX -= amount;
//         }

//         if (direction === 'right') {
//           nextX += amount;
//         }

//         nextX =
//           clampPlayerX(nextX);

//         playerXRef.current =
//           nextX;

//         setPlayerPositionX(nextX);

//         safeImpact(
//           Haptics.ImpactFeedbackStyle.Light
//         );
//       },
//       [
//         clampPlayerX,
//         config.playerSpeed,
//         safeImpact,
//       ]
//     );

//   /* ==========================================================
//      ACCELEROMETER
//   ========================================================== */

//   useEffect(() => {
//     let mounted = true;

//     const setupAccelerometer =
//       async () => {
//         if (
//           !gameStarted ||
//           gameOver ||
//           hasWon ||
//           rescueVisible
//         ) {
//           stopSensor();
//           return;
//         }

//         try {
//           const available =
//             await Accelerometer.isAvailableAsync();

//           if (!mounted) {
//             return;
//           }

//           if (!available) {
//             setSensorAvailable(false);
//             return;
//           }

//           setSensorAvailable(true);

//           Accelerometer.setUpdateInterval(50);

//           stopSensor();

//           sensorSubscriptionRef.current =
//             Accelerometer.addListener(
//               (data) => {
//                 if (
//                   !gameRunningRef.current
//                 ) {
//                   return;
//                 }

//                 const value =
//                   Number(data?.x) || 0;

//                 movementRef.current =
//                   clamp(
//                     value,
//                     -1,
//                     1
//                   );
//               }
//             );
//         } catch (error) {
//           console.log(
//             'FloodRunner accelerometer error:',
//             error
//           );

//           if (mounted) {
//             setSensorAvailable(false);
//           }
//         }
//       };

//     setupAccelerometer();

//     return () => {
//       mounted = false;
//       stopSensor();
//     };
//   }, [
//     gameStarted,
//     gameOver,
//     hasWon,
//     rescueVisible,
//     stopSensor,
//   ]);

//   /* ==========================================================
//      BACK BUTTON
//   ========================================================== */

//   useEffect(() => {
//     const subscription =
//       BackHandler.addEventListener(
//         'hardwareBackPress',
//         () => {
//           if (
//             gameRunningRef.current ||
//             countdown !== null ||
//             rescueVisible
//           ) {
//             return true;
//           }

//           return false;
//         }
//       );

//     return () => {
//       subscription.remove();
//     };
//   }, [
//     countdown,
//     rescueVisible,
//   ]);

//   /* ==========================================================
//      CLEANUP
//   ========================================================== */

//   useEffect(() => {
//     return () => {
//       if (
//         countdownTimerRef.current
//       ) {
//         clearInterval(
//           countdownTimerRef.current
//         );
//       }

//       if (
//         animationFrameRef.current !== null
//       ) {
//         cancelAnimationFrame(
//           animationFrameRef.current
//         );
//       }

//       if (
//         sensorSubscriptionRef.current
//       ) {
//         try {
//           sensorSubscriptionRef.current.remove();
//         } catch (error) {
//           // Ignore.
//         }
//       }

//       gameRunningRef.current = false;
//     };
//   }, []);

//   /* ==========================================================
//      CLAIM REWARD
//   ========================================================== */

//   const handleClaimReward =
//     useCallback(() => {
//       /*
//        * Must actually have won.
//        */
//       if (!hasWonRef.current) {
//         return;
//       }

//       /*
//        * Prevent double tapping from
//        * awarding the mission twice.
//        */
//       if (rewardClaimedRef.current) {
//         return;
//       }

//       rewardClaimedRef.current = true;

//       setRewardClaimed(true);

//       const reward = config.reward;

//       /*
//        * THIS is the important connection
//        * to your UserContext.
//        *
//        * UserContext should update:
//        *
//        * - XP
//        * - Prep Coins
//        * - mission progress
//        * - mission percentage
//        * - completed levels
//        */
//       try {
//         completeMission({
//           missionId: 'floodRunner',
//           level: selectedLevel,
//           score: scoreRef.current,
//           xp: reward.xp,
//           coins: reward.coins,
//         });
//       } catch (error) {
//         console.error(
//           'FloodRunner completeMission error:',
//           error
//         );

//         /*
//          * Allow another attempt if persistence
//          * actually failed.
//          */
//         rewardClaimedRef.current = false;
//         setRewardClaimed(false);

//         return;
//       }

//       /*
//        * Give the context time to update,
//        * then leave the modal.
//        */
//       setTimeout(() => {
//         resetGame();
//         navigation.goBack();
//       }, 250);
//     }, [
//       completeMission,
//       config.reward,
//       navigation,
//       resetGame,
//       selectedLevel,
//     ]);

//   /* ==========================================================
//      PROGRESS
//   ========================================================== */

//   const progressPercentage =
//     Math.min(
//       100,
//       (
//         score /
//         config.targetScore
//       ) * 100
//     );

//   /* ==========================================================
//      DIFFICULTY LABEL
//   ========================================================== */

//   const difficultyLabel =
//     useMemo(() => {
//       if (
//         difficultyFactor < 0.88
//       ) {
//         return t(
//           'games.floodRunner.adaptive.easier'
//         );
//       }

//       if (
//         difficultyFactor > 1.05
//       ) {
//         return t(
//           'games.floodRunner.adaptive.harder'
//         );
//       }

//       return t(
//         'games.floodRunner.adaptive.balanced'
//       );
//     }, [
//       difficultyFactor,
//       t,
//     ]);

//   /* ==========================================================
//      RENDER
//   ========================================================== */

//   return (
//     <View style={styles.screen}>
//       <View
//         style={[
//           styles.modalContentCard,
//           {
//             width: Math.min(
//               GAME_WIDTH + 32,
//               SCREEN_WIDTH - 16
//             ),
//           },
//         ]}
//       >
//         {/* HEADER */}

//         <View style={styles.modalHeader}>
//           <View
//             style={styles.headerTitleArea}
//           >
//             <View style={styles.headerIcon}>
//               <Ionicons
//                 name="water"
//                 size={20}
//                 color="#38BDF8"
//               />
//             </View>

//             <View
//               style={styles.headerTextArea}
//             >
//               <Text
//                 style={styles.modalTitle}
//               >
//                 {t(
//                   'games.floodRunner.title'
//                 )}
//               </Text>

//               <Text
//                 style={styles.levelLabel}
//               >
//                 {t(
//                   'games.floodRunner.level',
//                   {
//                     level:
//                       selectedLevel,
//                   }
//                 )}{' '}
//                 •{' '}
//                 {t(config.nameKey)}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* OBJECTIVE */}

//         <View
//           style={styles.objectiveCard}
//         >
//           <View
//             style={styles.objectiveIcon}
//           >
//             <Ionicons
//               name="flag"
//               size={18}
//               color="#34D399"
//             />
//           </View>

//           <View
//             style={styles.objectiveTextArea}
//           >
//             <Text
//               style={styles.objectiveTitle}
//             >
//               {t(
//                 'games.floodRunner.objective'
//               )}
//             </Text>

//             <Text
//               style={styles.objectiveText}
//             >
//               {t(
//                 'games.floodRunner.objectiveDescription'
//               )}
//             </Text>
//           </View>
//         </View>

//         {/* INSTRUCTIONS */}

//         {!gameStarted &&
//           !gameOver &&
//           !hasWon &&
//           countdown === null && (
//             <View
//               style={
//                 styles.instructionsCard
//               }
//             >
//               <View
//                 style={
//                   styles.instructionsHeader
//                 }
//               >
//                 <Ionicons
//                   name="help-circle"
//                   size={20}
//                   color="#FBBF24"
//                 />

//                 <Text
//                   style={
//                     styles.instructionsTitle
//                   }
//                 >
//                   {t(
//                     'games.floodRunner.howToPlay'
//                   )}
//                 </Text>
//               </View>

//               <InstructionRow
//                 icon="swap-horizontal"
//                 text={t(
//                   'games.floodRunner.instructions.move'
//                 )}
//               />

//               <InstructionRow
//                 icon="warning"
//                 text={t(
//                   'games.floodRunner.instructions.avoid'
//                 )}
//               />

//               <InstructionRow
//                 icon="water"
//                 text={t(
//                   'games.floodRunner.instructions.flood'
//                 )}
//               />

//               <InstructionRow
//                 icon="flag"
//                 text={t(
//                   'games.floodRunner.instructions.finish',
//                   {
//                     score:
//                       config.targetScore,
//                   }
//                 )}
//               />

//               <InstructionRow
//                 icon="help-circle"
//                 text={t(
//                   'games.floodRunner.instructions.rescue'
//                 )}
//               />
//             </View>
//           )}

//         {/* SENSOR */}

//         {gameStarted &&
//           !gameOver &&
//           !hasWon &&
//           !rescueVisible && (
//             <View
//               style={styles.sensorStatus}
//             >
//               <Ionicons
//                 name={
//                   sensorAvailable
//                     ? 'phone-portrait-outline'
//                     : 'hand-left-outline'
//                 }
//                 size={15}
//                 color={
//                   sensorAvailable
//                     ? '#34D399'
//                     : '#FBBF24'
//                 }
//               />

//               <Text
//                 style={[
//                   styles.sensorText,
//                   {
//                     color:
//                       sensorAvailable
//                         ? '#34D399'
//                         : '#FBBF24',
//                   },
//                 ]}
//               >
//                 {sensorAvailable
//                   ? t(
//                       'games.floodRunner.tiltActive'
//                     )
//                   : t(
//                       'games.floodRunner.touchActive'
//                     )}
//               </Text>

//               <View
//                 style={styles.lifeBadge}
//               >
//                 <Ionicons
//                   name="heart"
//                   size={12}
//                   color="#FB7185"
//                 />

//                 <Text
//                   style={styles.lifeText}
//                 >
//                   {rescueLives}
//                 </Text>
//               </View>
//             </View>
//           )}

//         {/* GAME */}

//         <View
//           style={[
//             styles.gameCanvas,
//             {
//               width: GAME_WIDTH,
//               height: GAME_HEIGHT,
//             },
//           ]}
//         >
//           {/* SAFE ZONE */}

//           <View
//             style={styles.safeZone}
//           >
//             <View
//               style={styles.safeZoneIcon}
//             >
//               <Ionicons
//                 name="shield-checkmark"
//                 size={18}
//                 color="#34D399"
//               />
//             </View>

//             <View>
//               <Text
//                 style={styles.safeZoneTitle}
//               >
//                 {t(
//                   'games.floodRunner.safeShelter'
//                 )}
//               </Text>

//               <Text
//                 style={styles.safeZoneSub}
//               >
//                 {t(
//                   'games.floodRunner.highGround'
//                 )}
//               </Text>
//             </View>
//           </View>

//           {/* DANGER FIELD */}

//           <View
//             style={styles.dangerField}
//           >
//             <View
//               style={styles.routeLine}
//             />

//             <Text
//               style={styles.dangerText}
//             >
//               {t(
//                 'games.floodRunner.evacuationRoute'
//               )}
//             </Text>
//           </View>

//           {/* DEBRIS */}

//           {gameStarted &&
//             !gameOver &&
//             !hasWon &&
//             debris.map((item) => (
//               <View
//                 key={item.id}
//                 style={[
//                   styles.debrisNode,
//                   {
//                     left: item.x,
//                     top: item.y,
//                   },
//                 ]}
//               >
//                 <Ionicons
//                   name="warning"
//                   size={20}
//                   color="#FCA5A5"
//                 />
//               </View>
//             ))}

//           {/* PLAYER */}

//           {gameStarted &&
//             !gameOver &&
//             !hasWon &&
//             !rescueVisible && (
//               <View
//                 style={[
//                   styles.playerNode,
//                   {
//                     left:
//                       playerPositionX,

//                     bottom:
//                       PLAYER_BOTTOM_OFFSET +
//                       FLOOD_HEIGHT,
//                   },
//                 ]}
//               >
//                 <Ionicons
//                   name="person"
//                   size={25}
//                   color="#FFFFFF"
//                 />
//               </View>
//             )}

//           {/* FLOOD */}

//           <View
//             style={styles.floodLayer}
//           >
//             <View
//               style={styles.waveContainer}
//             >
//               {Array.from({
//                 length: 12,
//               }).map((_, index) => (
//                 <Text
//                   key={index}
//                   style={styles.wave}
//                 >
//                   ~
//                 </Text>
//               ))}
//             </View>

//             <Text
//               style={styles.floodLabel}
//             >
//               {t(
//                 'games.floodRunner.floodZone'
//               )}
//             </Text>
//           </View>

//           {/* ADAPTIVE */}

//           {gameStarted &&
//             !gameOver &&
//             !hasWon &&
//             !rescueVisible && (
//               <View
//                 style={styles.adaptiveBadge}
//               >
//                 <Ionicons
//                   name="pulse"
//                   size={11}
//                   color="#38BDF8"
//                 />

//                 <Text
//                   style={styles.adaptiveText}
//                 >
//                   {difficultyLabel}
//                 </Text>
//               </View>
//             )}

//           {/* COUNTDOWN */}

//           {countdown !== null && (
//             <View
//               style={
//                 styles.countdownOverlay
//               }
//             >
//               <Text
//                 style={
//                   styles.countdownNumber
//                 }
//               >
//                 {countdown}
//               </Text>

//               <Text
//                 style={
//                   styles.countdownText
//                 }
//               >
//                 {t(
//                   'games.floodRunner.getReady'
//                 )}
//               </Text>
//             </View>
//           )}

//           {/* START */}

//           {!gameStarted &&
//             countdown === null &&
//             !gameOver &&
//             !hasWon && (
//               <View
//                 style={styles.startOverlay}
//               >
//                 <View
//                   style={styles.startIcon}
//                 >
//                   <Ionicons
//                     name="walk"
//                     size={34}
//                     color="#38BDF8"
//                   />
//                 </View>

//                 <Text
//                   style={styles.startTitle}
//                 >
//                   {t(
//                     'games.floodRunner.ready'
//                   )}
//                 </Text>

//                 <Text
//                   style={
//                     styles.startDescription
//                   }
//                 >
//                   {t(
//                     'games.floodRunner.startDescription'
//                   )}
//                 </Text>

//                 <TouchableOpacity
//                   style={styles.startButton}
//                   onPress={startGame}
//                   activeOpacity={0.8}
//                 >
//                   <Ionicons
//                     name="play"
//                     size={18}
//                     color="#FFFFFF"
//                   />

//                   <Text
//                     style={
//                       styles.startButtonText
//                     }
//                   >
//                     {t(
//                       'games.floodRunner.start'
//                     )}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             )}

//           {/* RESCUE */}

//           {rescueVisible &&
//             rescueQuestion && (
//               <View
//                 style={
//                   styles.rescueOverlay
//                 }
//               >
//                 <View
//                   style={styles.rescueIcon}
//                 >
//                   <Ionicons
//                     name="medkit"
//                     size={28}
//                     color="#FBBF24"
//                   />
//                 </View>

//                 <Text
//                   style={styles.rescueTitle}
//                 >
//                   {t(
//                     'games.floodRunner.rescueTitle'
//                   )}
//                 </Text>

//                 <Text
//                   style={
//                     styles.rescueDescription
//                   }
//                 >
//                   {t(
//                     'games.floodRunner.rescueDescription'
//                   )}
//                 </Text>

//                 <Text
//                   style={
//                     styles.rescueQuestion
//                   }
//                 >
//                   {t(
//                     rescueQuestion.questionKey
//                   )}
//                 </Text>

//                 <View
//                   style={
//                     styles.answerList
//                   }
//                 >
//                   {rescueQuestion.options.map(
//                     (option) => {
//                       const isSelected =
//                         selectedAnswer ===
//                         option.id;

//                       const isCorrect =
//                         rescueQuestion.correct ===
//                         option.id;

//                       let backgroundColor =
//                         '#172033';

//                       let borderColor =
//                         '#334155';

//                       if (
//                         isSelected &&
//                         answerFeedback ===
//                           'correct'
//                       ) {
//                         backgroundColor =
//                           '#064E3B';

//                         borderColor =
//                           '#10B981';
//                       }

//                       if (
//                         isSelected &&
//                         answerFeedback ===
//                           'wrong'
//                       ) {
//                         backgroundColor =
//                           '#450A0A';

//                         borderColor =
//                           '#EF4444';
//                       }

//                       if (
//                         selectedAnswer &&
//                         isCorrect &&
//                         answerFeedback ===
//                           'correct'
//                       ) {
//                         backgroundColor =
//                           '#064E3B';

//                         borderColor =
//                           '#10B981';
//                       }

//                       return (
//                         <TouchableOpacity
//                           key={option.id}
//                           disabled={
//                             !!selectedAnswer
//                           }
//                           style={[
//                             styles.answerButton,
//                             {
//                               backgroundColor,
//                               borderColor,
//                             },
//                           ]}
//                           onPress={() =>
//                             handleRescueAnswer(
//                               option.id
//                             )
//                           }
//                           activeOpacity={0.8}
//                         >
//                           <View
//                             style={
//                               styles.answerLetter
//                             }
//                           >
//                             <Text
//                               style={
//                                 styles.answerLetterText
//                               }
//                             >
//                               {option.id.toUpperCase()}
//                             </Text>
//                           </View>

//                           <Text
//                             style={
//                               styles.answerText
//                             }
//                           >
//                             {t(
//                               option.textKey
//                             )}
//                           </Text>
//                         </TouchableOpacity>
//                       );
//                     }
//                   )}
//                 </View>

//                 <View
//                   style={
//                     styles.rescueLifeNotice
//                   }
//                 >
//                   <Ionicons
//                     name="heart"
//                     size={13}
//                     color="#FB7185"
//                   />

//                   <Text
//                     style={
//                       styles.rescueLifeText
//                     }
//                   >
//                     {t(
//                       'games.floodRunner.rescueLifeNotice'
//                     )}
//                   </Text>
//                 </View>
//               </View>
//             )}

//           {/* GAME OVER */}

//           {gameOver && (
//             <View
//               style={
//                 styles.endGameOverlay
//               }
//             >
//               <View
//                 style={[
//                   styles.resultIcon,
//                   {
//                     backgroundColor:
//                       '#450A0A',
//                   },
//                 ]}
//               >
//                 <Ionicons
//                   name="warning"
//                   size={34}
//                   color="#EF4444"
//                 />
//               </View>

//               <Text
//                 style={
//                   styles.gameOverTitle
//                 }
//               >
//                 {t(
//                   'games.floodRunner.failed'
//                 )}
//               </Text>

//               <Text
//                 style={
//                   styles.gameOverText
//                 }
//               >
//                 {t(
//                   'games.floodRunner.failedDescription'
//                 )}
//               </Text>

//               <Text
//                 style={styles.finalScore}
//               >
//                 {score} /{' '}
//                 {config.targetScore}
//               </Text>

//               <TouchableOpacity
//                 style={
//                   styles.retryButton
//                 }
//                 onPress={startGame}
//                 activeOpacity={0.8}
//               >
//                 <Ionicons
//                   name="refresh"
//                   size={18}
//                   color="#FFFFFF"
//                 />

//                 <Text
//                   style={styles.buttonText}
//                 >
//                   {t(
//                     'games.floodRunner.retry'
//                   )}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* WIN */}

//           {hasWon && (
//             <View
//               style={
//                 styles.endGameOverlay
//               }
//             >
//               <View
//                 style={[
//                   styles.resultIcon,
//                   {
//                     backgroundColor:
//                       '#064E3B',
//                   },
//                 ]}
//               >
//                 <Ionicons
//                   name="shield-checkmark"
//                   size={36}
//                   color="#10B981"
//                 />
//               </View>

//               <Text
//                 style={
//                   styles.successTitle
//                 }
//               >
//                 {t(
//                   'games.floodRunner.success'
//                 )}
//               </Text>

//               <Text
//                 style={
//                   styles.gameOverText
//                 }
//               >
//                 {t(
//                   'games.floodRunner.successDescription'
//                 )}
//               </Text>

//               <View
//                 style={styles.rewardRow}
//               >
//                 <Reward
//                   icon="flash"
//                   value={`+${config.reward.xp}`}
//                   label={t(
//                     'games.floodRunner.xp'
//                   )}
//                 />

//                 <Reward
//                   icon="cash"
//                   value={`+${config.reward.coins}`}
//                   label={t(
//                     'games.floodRunner.coins'
//                   )}
//                 />
//               </View>

//               <TouchableOpacity
//                 style={[
//                   styles.claimRewardButton,
//                   rewardClaimed &&
//                     styles.claimDisabled,
//                 ]}
//                 disabled={rewardClaimed}
//                 onPress={
//                   handleClaimReward
//                 }
//                 activeOpacity={0.8}
//               >
//                 <Ionicons
//                   name="checkmark-circle"
//                   size={18}
//                   color="#FFFFFF"
//                 />

//                 <Text
//                   style={styles.buttonText}
//                 >
//                   {rewardClaimed
//                     ? t(
//                         'games.floodRunner.rewardClaimed'
//                       )
//                     : t(
//                         'games.floodRunner.claimReward'
//                       )}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* SCORE */}

//         <View
//           style={styles.gameHud}
//         >
//           <View
//             style={styles.scoreHeader}
//           >
//             <Text
//               style={styles.scoreLabel}
//             >
//               {t(
//                 'games.floodRunner.score'
//               )}
//             </Text>

//             <Text
//               style={styles.scoreValue}
//             >
//               {score} /{' '}
//               {config.targetScore}
//             </Text>
//           </View>

//           <View
//             style={
//               styles.progressBackground
//             }
//           >
//             <View
//               style={[
//                 styles.progressFill,
//                 {
//                   width:
//                     `${progressPercentage}%`,
//                 },
//               ]}
//             />
//           </View>

//           {gameStarted &&
//             !gameOver &&
//             !hasWon && (
//               <View
//                 style={
//                   styles.algorithmRow
//                 }
//               >
//                 <Text
//                   style={
//                     styles.algorithmLabel
//                   }
//                 >
//                   {t(
//                     'games.floodRunner.adaptive.safety'
//                   )}
//                 </Text>

//                 <Text
//                   style={
//                     styles.algorithmValue
//                   }
//                 >
//                   {riskScore}
//                 </Text>
//               </View>
//             )}
//         </View>

//         {/* CONTROLS */}

//         {gameStarted &&
//           !gameOver &&
//           !hasWon &&
//           !rescueVisible && (
//             <View
//               style={styles.controls}
//             >
//               <TouchableOpacity
//                 style={
//                   styles.controlButton
//                 }
//                 onPress={() =>
//                   movePlayer('left')
//                 }
//                 activeOpacity={0.7}
//               >
//                 <Ionicons
//                   name="arrow-back"
//                   size={24}
//                   color="#FFFFFF"
//                 />

//                 <Text
//                   style={
//                     styles.controlText
//                   }
//                 >
//                   {t(
//                     'games.floodRunner.left'
//                   )}
//                 </Text>
//               </TouchableOpacity>

//               <View
//                 style={
//                   styles.controlHint
//                 }
//               >
//                 <Ionicons
//                   name={
//                     sensorAvailable
//                       ? 'phone-portrait-outline'
//                       : 'hand-left-outline'
//                   }
//                   size={21}
//                   color="#38BDF8"
//                 />

//                 <Text
//                   style={
//                     styles.controlHintText
//                   }
//                 >
//                   {sensorAvailable
//                     ? t(
//                         'games.floodRunner.tilt'
//                       )
//                     : t(
//                         'games.floodRunner.touch'
//                       )}
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 style={
//                   styles.controlButton
//                 }
//                 onPress={() =>
//                   movePlayer('right')
//                 }
//                 activeOpacity={0.7}
//               >
//                 <Ionicons
//                   name="arrow-forward"
//                   size={24}
//                   color="#FFFFFF"
//                 />

//                 <Text
//                   style={
//                     styles.controlText
//                   }
//                 >
//                   {t(
//                     'games.floodRunner.right'
//                   )}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//       </View>
//     </View>
//   );
// }

// /* ============================================================
//    INSTRUCTION ROW
// ============================================================ */

// function InstructionRow({
//   icon,
//   text,
// }) {
//   return (
//     <View
//       style={styles.instructionRow}
//     >
//       <View
//         style={styles.instructionIcon}
//       >
//         <Ionicons
//           name={icon}
//           size={16}
//           color="#38BDF8"
//         />
//       </View>

//       <Text
//         style={styles.instructionText}
//       >
//         {text}
//       </Text>
//     </View>
//   );
// }

// /* ============================================================
//    REWARD
// ============================================================ */

// function Reward({
//   icon,
//   value,
//   label,
// }) {
//   return (
//     <View style={styles.reward}>
//       <Ionicons
//         name={icon}
//         size={18}
//         color="#FBBF24"
//       />

//       <Text
//         style={styles.rewardValue}
//       >
//         {value}
//       </Text>

//       <Text
//         style={styles.rewardLabel}
//       >
//         {label}
//       </Text>
//     </View>
//   );
// }

// /* ============================================================
//    STYLES
// ============================================================ */

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: '#020617',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 8,
//   },

//   modalContentCard: {
//     backgroundColor: '#0F172A',
//     borderRadius: 24,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     maxHeight: '96%',
//   },

//   modalHeader: {
//     marginBottom: 10,
//   },

//   headerTitleArea: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   headerIcon: {
//     width: 42,
//     height: 42,
//     borderRadius: 14,
//     backgroundColor: '#082F49',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 10,
//   },

//   headerTextArea: {
//     flex: 1,
//   },

//   modalTitle: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: '800',
//   },

//   levelLabel: {
//     color: '#94A3B8',
//     fontSize: 12,
//     marginTop: 2,
//   },

//   objectiveCard: {
//     flexDirection: 'row',
//     backgroundColor: '#0B1F1A',
//     borderWidth: 1,
//     borderColor: '#064E3B',
//     borderRadius: 14,
//     padding: 10,
//     marginBottom: 10,
//   },

//   objectiveIcon: {
//     width: 34,
//     height: 34,
//     borderRadius: 10,
//     backgroundColor: '#052E25',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 9,
//   },

//   objectiveTextArea: {
//     flex: 1,
//   },

//   objectiveTitle: {
//     color: '#34D399',
//     fontWeight: '800',
//     fontSize: 13,
//   },

//   objectiveText: {
//     color: '#A7F3D0',
//     fontSize: 11,
//     marginTop: 2,
//     lineHeight: 16,
//   },

//   instructionsCard: {
//     backgroundColor: '#111827',
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     padding: 10,
//     marginBottom: 10,
//   },

//   instructionsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },

//   instructionsTitle: {
//     color: '#FFFFFF',
//     fontWeight: '800',
//     marginLeft: 7,
//     fontSize: 13,
//   },

//   instructionRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 3,
//   },

//   instructionIcon: {
//     width: 25,
//     height: 25,
//     borderRadius: 8,
//     backgroundColor: '#082F49',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 7,
//   },

//   instructionText: {
//     color: '#CBD5E1',
//     fontSize: 11,
//     flex: 1,
//   },

//   sensorStatus: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 7,
//     paddingHorizontal: 4,
//   },

//   sensorText: {
//     fontSize: 11,
//     fontWeight: '700',
//     marginLeft: 5,
//     flex: 1,
//   },

//   lifeBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#3F1722',
//     borderRadius: 10,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//   },

//   lifeText: {
//     color: '#FFFFFF',
//     fontWeight: '800',
//     marginLeft: 4,
//     fontSize: 11,
//   },

//   gameCanvas: {
//     backgroundColor: '#07111F',
//     borderRadius: 18,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#1E3A5F',
//     position: 'relative',
//   },

//   safeZone: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 56,
//     backgroundColor: '#052E25',
//     borderBottomWidth: 1,
//     borderBottomColor: '#065F46',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     zIndex: 2,
//   },

//   safeZoneIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     backgroundColor: '#064E3B',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 8,
//   },

//   safeZoneTitle: {
//     color: '#6EE7B7',
//     fontSize: 12,
//     fontWeight: '800',
//   },

//   safeZoneSub: {
//     color: '#A7F3D0',
//     fontSize: 9,
//     marginTop: 1,
//   },

//   dangerField: {
//     position: 'absolute',
//     top: 56,
//     left: 0,
//     right: 0,
//     bottom: FLOOD_HEIGHT,
//     backgroundColor: '#0B1626',
//   },

//   routeLine: {
//     position: 'absolute',
//     left: '50%',
//     top: 0,
//     bottom: 0,
//     width: 1,
//     backgroundColor: '#1E3A5F',
//     opacity: 0.7,
//   },

//   dangerText: {
//     color: '#334155',
//     fontSize: 9,
//     position: 'absolute',
//     top: 10,
//     left: 12,
//     textTransform: 'uppercase',
//     letterSpacing: 1,
//   },

//   debrisNode: {
//     position: 'absolute',
//     width: DEBRIS_SIZE,
//     height: DEBRIS_SIZE,
//     borderRadius: 9,
//     backgroundColor: '#451A1A',
//     borderWidth: 1,
//     borderColor: '#7F1D1D',
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 4,
//   },

//   playerNode: {
//     position: 'absolute',
//     width: PLAYER_SIZE,
//     height: PLAYER_SIZE,
//     borderRadius: 12,
//     backgroundColor: '#0284C7',
//     borderWidth: 2,
//     borderColor: '#7DD3FC',
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 5,
//   },

//   floodLayer: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: FLOOD_HEIGHT,
//     backgroundColor: '#075985',
//     borderTopWidth: 2,
//     borderTopColor: '#38BDF8',
//     zIndex: 3,
//   },

//   waveContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     position: 'absolute',
//     top: -11,
//     left: 0,
//     right: 0,
//   },

//   wave: {
//     color: '#7DD3FC',
//     fontSize: 18,
//     fontWeight: '900',
//   },

//   floodLabel: {
//     color: '#BAE6FD',
//     fontSize: 9,
//     fontWeight: '800',
//     textAlign: 'center',
//     marginTop: 25,
//     letterSpacing: 1,
//   },

//   adaptiveBadge: {
//     position: 'absolute',
//     top: 66,
//     right: 8,
//     backgroundColor: '#082F49',
//     borderRadius: 10,
//     paddingHorizontal: 7,
//     paddingVertical: 4,
//     flexDirection: 'row',
//     alignItems: 'center',
//     zIndex: 8,
//   },

//   adaptiveText: {
//     color: '#7DD3FC',
//     fontSize: 8,
//     fontWeight: '700',
//     marginLeft: 4,
//   },

//   countdownOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(2,6,23,0.85)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 20,
//   },

//   countdownNumber: {
//     color: '#FFFFFF',
//     fontSize: 72,
//     fontWeight: '900',
//   },

//   countdownText: {
//     color: '#7DD3FC',
//     fontSize: 13,
//     marginTop: 4,
//   },

//   startOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(2,6,23,0.88)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 24,
//     zIndex: 15,
//   },

//   startIcon: {
//     width: 70,
//     height: 70,
//     borderRadius: 24,
//     backgroundColor: '#082F49',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },

//   startTitle: {
//     color: '#FFFFFF',
//     fontSize: 23,
//     fontWeight: '900',
//   },

//   startDescription: {
//     color: '#94A3B8',
//     textAlign: 'center',
//     fontSize: 11,
//     lineHeight: 17,
//     marginTop: 6,
//     maxWidth: 280,
//   },

//   startButton: {
//     marginTop: 18,
//     backgroundColor: '#0284C7',
//     borderRadius: 13,
//     paddingHorizontal: 20,
//     paddingVertical: 11,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   startButtonText: {
//     color: '#FFFFFF',
//     fontWeight: '800',
//     marginLeft: 7,
//   },

//   rescueOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(2,6,23,0.97)',
//     alignItems: 'center',
//     padding: 16,
//     zIndex: 30,
//   },

//   rescueIcon: {
//     width: 54,
//     height: 54,
//     borderRadius: 18,
//     backgroundColor: '#422006',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 8,
//   },

//   rescueTitle: {
//     color: '#FBBF24',
//     fontSize: 19,
//     fontWeight: '900',
//   },

//   rescueDescription: {
//     color: '#CBD5E1',
//     fontSize: 10,
//     textAlign: 'center',
//     marginTop: 4,
//     marginBottom: 10,
//   },

//   rescueQuestion: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '800',
//     textAlign: 'center',
//     lineHeight: 18,
//     marginBottom: 10,
//   },

//   answerList: {
//     width: '100%',
//   },

//   answerButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderRadius: 11,
//     padding: 8,
//     marginBottom: 7,
//   },

//   answerLetter: {
//     width: 27,
//     height: 27,
//     borderRadius: 9,
//     backgroundColor: '#334155',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 8,
//   },

//   answerLetterText: {
//     color: '#FFFFFF',
//     fontSize: 10,
//     fontWeight: '900',
//   },

//   answerText: {
//     color: '#E2E8F0',
//     fontSize: 10,
//     lineHeight: 15,
//     flex: 1,
//   },

//   rescueLifeNotice: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 2,
//   },

//   rescueLifeText: {
//     color: '#94A3B8',
//     fontSize: 9,
//     marginLeft: 4,
//   },

//   endGameOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(2,6,23,0.96)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     zIndex: 25,
//   },

//   resultIcon: {
//     width: 68,
//     height: 68,
//     borderRadius: 23,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },

//   gameOverTitle: {
//     color: '#F87171',
//     fontSize: 22,
//     fontWeight: '900',
//   },

//   successTitle: {
//     color: '#34D399',
//     fontSize: 22,
//     fontWeight: '900',
//   },

//   gameOverText: {
//     color: '#94A3B8',
//     fontSize: 11,
//     textAlign: 'center',
//     lineHeight: 17,
//     marginTop: 5,
//     maxWidth: 280,
//   },

//   finalScore: {
//     color: '#FFFFFF',
//     fontSize: 25,
//     fontWeight: '900',
//     marginTop: 12,
//   },

//   retryButton: {
//     marginTop: 15,
//     backgroundColor: '#DC2626',
//     borderRadius: 12,
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   claimRewardButton: {
//     marginTop: 15,
//     backgroundColor: '#059669',
//     borderRadius: 12,
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   claimDisabled: {
//     opacity: 0.6,
//   },

//   buttonText: {
//     color: '#FFFFFF',
//     fontWeight: '800',
//     marginLeft: 7,
//     fontSize: 12,
//   },

//   rewardRow: {
//     flexDirection: 'row',
//     marginTop: 13,
//     gap: 22,
//   },

//   reward: {
//     alignItems: 'center',
//   },

//   rewardValue: {
//     color: '#FBBF24',
//     fontSize: 16,
//     fontWeight: '900',
//     marginTop: 2,
//   },

//   rewardLabel: {
//     color: '#94A3B8',
//     fontSize: 9,
//     marginTop: 1,
//   },

//   gameHud: {
//     marginTop: 10,
//   },

//   scoreHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   scoreLabel: {
//     color: '#94A3B8',
//     fontSize: 10,
//     fontWeight: '700',
//     textTransform: 'uppercase',
//   },

//   scoreValue: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '900',
//   },

//   progressBackground: {
//     height: 7,
//     backgroundColor: '#1E293B',
//     borderRadius: 5,
//     overflow: 'hidden',
//     marginTop: 5,
//   },

//   progressFill: {
//     height: '100%',
//     backgroundColor: '#38BDF8',
//     borderRadius: 5,
//   },

//   algorithmRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 4,
//   },

//   algorithmLabel: {
//     color: '#64748B',
//     fontSize: 8,
//   },

//   algorithmValue: {
//     color: '#38BDF8',
//     fontSize: 8,
//     fontWeight: '800',
//   },

//   controls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },

//   controlButton: {
//     width: 82,
//     height: 46,
//     borderRadius: 13,
//     backgroundColor: '#172033',
//     borderWidth: 1,
//     borderColor: '#334155',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   controlText: {
//     color: '#CBD5E1',
//     fontSize: 8,
//     marginTop: 1,
//     fontWeight: '700',
//   },

//   controlHint: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   controlHintText: {
//     color: '#64748B',
//     fontSize: 8,
//     marginTop: 2,
//   },
// });

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  useWindowDimensions,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Accelerometer } from 'expo-sensors';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUser } from '../contexts/UserContext';

/* ============================================================
   FLOOD RUNNER

   CAMPAIGN MAPPING

   MissionsScreen contains:

   level-2 -> FloodRunnerGameModal
   level-5 -> FloodRunnerGameModal
   level-8 -> FloodRunnerGameModal

   These map to:

   level-2 -> Flood Runner Easy
   level-5 -> Flood Runner Moderate
   level-8 -> Flood Runner Advanced

   Flood Runner reports the CAMPAIGN MISSION ID back to
   UserContext, NOT "floodRunner".

   This is what allows MissionsScreen to unlock the next
   campaign mission.
============================================================ */

const CAMPAIGN_TO_GAME_LEVEL = {
  2: 1,
  5: 2,
  8: 3,
};

const GAME_LEVELS = {
  1: {
    nameKey: 'games.floodRunner.levels.easy',

    targetScore: 50,

    debrisSpeed: 150,
    spawnInterval: 1200,
    spawnCount: 1,

    playerSpeed: 285,

    reward: {
      xp: 100,
      coins: 25,
    },
  },

  2: {
    nameKey: 'games.floodRunner.levels.moderate',

    targetScore: 75,

    debrisSpeed: 205,
    spawnInterval: 900,
    spawnCount: 2,

    playerSpeed: 325,

    reward: {
      xp: 150,
      coins: 40,
    },
  },

  3: {
    nameKey: 'games.floodRunner.levels.advanced',

    targetScore: 100,

    debrisSpeed: 255,
    spawnInterval: 720,
    spawnCount: 3,

    playerSpeed: 370,

    reward: {
      xp: 200,
      coins: 60,
    },
  },
};

/* ============================================================
   GAME CONSTANTS
============================================================ */

const PLAYER_SIZE = 36;
const DEBRIS_SIZE = 28;

const FLOOD_HEIGHT = 62;
const PLAYER_BOTTOM_OFFSET = 14;

const COLLISION_PADDING = 5;

const TOUCH_MOVE_MULTIPLIER = 0.22;
const SENSOR_DEAD_ZONE = 0.05;

/* ============================================================
   ADAPTIVE DIFFICULTY

   riskScore:

   0   = player coping well
   50  = balanced
   100 = player struggling

   When player performs well:
   risk decreases
   difficulty increases

   When player struggles:
   risk increases
   difficulty decreases
============================================================ */

const MIN_DIFFICULTY_FACTOR = 0.76;
const MAX_DIFFICULTY_FACTOR = 1.18;

const NEAR_MISS_DISTANCE = 34;

const RISK_INCREASE_COLLISION = 28;
const RISK_INCREASE_NEAR_MISS = 5;

const RISK_DECREASE_SUCCESS = 1.5;
const RISK_DECREASE_CORRECT_RESCUE = 12;

const RISK_UPDATE_INTERVAL = 1000;

/* ============================================================
   RESCUE
============================================================ */

const MAX_RESCUE_LIVES = 1;
const RESCUE_POINTS = 15;

/* ============================================================
   RESCUE QUESTIONS
============================================================ */

const RESCUE_QUESTIONS = [
  {
    id: 'q1',
    questionKey:
      'games.floodRunner.questions.q1.question',

    options: [
      {
        id: 'a',
        textKey:
          'games.floodRunner.questions.q1.a',
      },
      {
        id: 'b',
        textKey:
          'games.floodRunner.questions.q1.b',
      },
      {
        id: 'c',
        textKey:
          'games.floodRunner.questions.q1.c',
      },
    ],

    correct: 'b',
  },

  {
    id: 'q2',
    questionKey:
      'games.floodRunner.questions.q2.question',

    options: [
      {
        id: 'a',
        textKey:
          'games.floodRunner.questions.q2.a',
      },
      {
        id: 'b',
        textKey:
          'games.floodRunner.questions.q2.b',
      },
      {
        id: 'c',
        textKey:
          'games.floodRunner.questions.q2.c',
      },
    ],

    correct: 'a',
  },

  {
    id: 'q3',
    questionKey:
      'games.floodRunner.questions.q3.question',

    options: [
      {
        id: 'a',
        textKey:
          'games.floodRunner.questions.q3.a',
      },
      {
        id: 'b',
        textKey:
          'games.floodRunner.questions.q3.b',
      },
      {
        id: 'c',
        textKey:
          'games.floodRunner.questions.q3.c',
      },
    ],

    correct: 'c',
  },

  {
    id: 'q4',
    questionKey:
      'games.floodRunner.questions.q4.question',

    options: [
      {
        id: 'a',
        textKey:
          'games.floodRunner.questions.q4.a',
      },
      {
        id: 'b',
        textKey:
          'games.floodRunner.questions.q4.b',
      },
      {
        id: 'c',
        textKey:
          'games.floodRunner.questions.q4.c',
      },
    ],

    correct: 'a',
  },

  {
    id: 'q5',
    questionKey:
      'games.floodRunner.questions.q5.question',

    options: [
      {
        id: 'a',
        textKey:
          'games.floodRunner.questions.q5.a',
      },
      {
        id: 'b',
        textKey:
          'games.floodRunner.questions.q5.b',
      },
      {
        id: 'c',
        textKey:
          'games.floodRunner.questions.q5.c',
      },
    ],

    correct: 'b',
  },
];

/* ============================================================
   HELPERS
============================================================ */

function clamp(value, min, max) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

function getRandomQuestion() {
  const index = Math.floor(
    Math.random() *
      RESCUE_QUESTIONS.length
  );

  return RESCUE_QUESTIONS[index];
}

/* ============================================================
   COMPONENT
============================================================ */

export default function FloodRunnerGameModal() {
  const { t } = useTranslation();

  const navigation = useNavigation();
  const route = useRoute();

  const insets = useSafeAreaInsets();

  const {
    width: windowWidth,
    height: windowHeight,
  } = useWindowDimensions();

  /*
   * IMPORTANT:
   *
   * This is the SAME UserContext completion mechanism
   * already used by the Flood Runner code you supplied.
   *
   * UserContext remains the source of truth.
   */
  const {
    user,
    completeMission,
  } = useUser();

  /* ==========================================================
     CAMPAIGN LEVEL
  ========================================================== */

  const campaignLevel = Number(
    route?.params?.level ?? 2
  );

  /*
   * If MissionsScreen opened Flood Runner:
   *
   * 2 -> internal game level 1
   * 5 -> internal game level 2
   * 8 -> internal game level 3
   *
   * We also support directly opening Flood Runner with
   * level 1/2/3 for testing.
   */
  const gameLevel = useMemo(() => {
    if (
      CAMPAIGN_TO_GAME_LEVEL[
        campaignLevel
      ]
    ) {
      return CAMPAIGN_TO_GAME_LEVEL[
        campaignLevel
      ];
    }

    return clamp(
      Number(campaignLevel) || 1,
      1,
      3
    );
  }, [campaignLevel]);

  const config =
    GAME_LEVELS[gameLevel];

  /*
   * THIS is the ID MissionsScreen actually checks.
   *
   * For example:
   *
   * mission = "level-2"
   *
   * MissionsScreen checks:
   *
   * completedMissions["level-2"]
   */
  const campaignMissionId =
    route?.params?.mission ||
    `level-${campaignLevel}`;

  /*
   * Rewards passed by MissionsScreen are authoritative
   * for the campaign mission.
   *
   * Example:
   *
   * Mission 2:
   * xpreward = 180
   * coinreward = 40
   */
  const missionXpReward =
    Number(route?.params?.xpreward) ||
    config.reward.xp;

  const missionCoinReward =
    Number(route?.params?.coinreward) ||
    config.reward.coins;

  /* ==========================================================
     RESPONSIVE GAME DIMENSIONS
  ========================================================== */

  const GAME_WIDTH = Math.min(
    Math.max(windowWidth - 28, 280),
    420
  );

  /*
   * Keep the game area comfortably inside the visible
   * window. The entire screen itself is scrollable, so
   * very short devices can still reach the controls.
   */
  const GAME_HEIGHT = clamp(
    windowHeight * 0.46,
    300,
    430
  );

  const INITIAL_PLAYER_X =
    GAME_WIDTH / 2 -
    PLAYER_SIZE / 2;

  /* ==========================================================
     STATE
  ========================================================== */

  const [
    gameStarted,
    setGameStarted,
  ] = useState(false);

  const [
    countdown,
    setCountdown,
  ] = useState(null);

  const [
    playerPositionX,
    setPlayerPositionX,
  ] = useState(INITIAL_PLAYER_X);

  const [
    debris,
    setDebris,
  ] = useState([]);

  const [
    score,
    setScore,
  ] = useState(0);

  const [
    gameOver,
    setGameOver,
  ] = useState(false);

  const [
    hasWon,
    setHasWon,
  ] = useState(false);

  const [
    sensorAvailable,
    setSensorAvailable,
  ] = useState(false);

  const [
    rescueVisible,
    setRescueVisible,
  ] = useState(false);

  const [
    rescueQuestion,
    setRescueQuestion,
  ] = useState(null);

  const [
    rescueLives,
    setRescueLives,
  ] = useState(MAX_RESCUE_LIVES);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState(null);

  const [
    answerFeedback,
    setAnswerFeedback,
  ] = useState(null);

  const [
    riskScore,
    setRiskScore,
  ] = useState(50);

  const [
    difficultyFactor,
    setDifficultyFactor,
  ] = useState(1);

  const [
    rewardClaimed,
    setRewardClaimed,
  ] = useState(false);

  /* ==========================================================
     REFS
  ========================================================== */

  const playerXRef =
    useRef(INITIAL_PLAYER_X);

  const debrisRef =
    useRef([]);

  const scoreRef =
    useRef(0);

  const gameRunningRef =
    useRef(false);

  const gameOverRef =
    useRef(false);

  const hasWonRef =
    useRef(false);

  const rewardClaimedRef =
    useRef(false);

  const movementRef =
    useRef(0);

  const animationFrameRef =
    useRef(null);

  const lastFrameTimeRef =
    useRef(null);

  const lastSpawnTimeRef =
    useRef(0);

  const countdownTimerRef =
    useRef(null);

  const sensorSubscriptionRef =
    useRef(null);

  /*
   * Every game/restart/rescue gets a unique session.
   */
  const gameSessionRef =
    useRef(0);

  /*
   * Prevents completion while the reward action is
   * being processed.
   */
  const completionInProgressRef =
    useRef(false);

  /*
   * Adaptive difficulty state.
   */
  const adaptiveRef =
    useRef({
      riskScore: 50,
      nearMisses: 0,
      successfulDodges: 0,
      collisions: 0,
      correctRescues: 0,
      lastRiskUpdate: 0,
    });

  /* ==========================================================
     HAPTICS
  ========================================================== */

  const safeImpact =
    useCallback(async (style) => {
      try {
        await Haptics.impactAsync(style);
      } catch (error) {
        // Haptics may be unavailable.
      }
    }, []);

  const safeNotification =
    useCallback(async (type) => {
      try {
        await Haptics.notificationAsync(
          type
        );
      } catch (error) {
        // Haptics may be unavailable.
      }
    }, []);

  /* ==========================================================
     ADAPTIVE DIFFICULTY
  ========================================================== */

  const calculateAdaptiveDifficulty =
    useCallback((timestamp) => {
      const adaptive =
        adaptiveRef.current;

      if (
        timestamp -
          adaptive.lastRiskUpdate <
        RISK_UPDATE_INTERVAL
      ) {
        return;
      }

      adaptive.lastRiskUpdate =
        timestamp;

      /*
       * Successful play makes the game gradually harder.
       */
      adaptive.riskScore -=
        adaptive.successfulDodges *
        RISK_DECREASE_SUCCESS;

      adaptive.successfulDodges = 0;

      /*
       * Correct rescue answers provide evidence that
       * the player can handle the situation, but we
       * still give a small temporary adjustment.
       */
      adaptive.riskScore +=
        adaptive.correctRescues * 2;

      adaptive.correctRescues = 0;

      adaptive.riskScore = clamp(
        adaptive.riskScore,
        0,
        100
      );

      const nextFactor =
        MAX_DIFFICULTY_FACTOR -
        (adaptive.riskScore / 100) *
          (
            MAX_DIFFICULTY_FACTOR -
            MIN_DIFFICULTY_FACTOR
          );

      const safeFactor = clamp(
        nextFactor,
        MIN_DIFFICULTY_FACTOR,
        MAX_DIFFICULTY_FACTOR
      );

      setRiskScore(
        Math.round(
          adaptive.riskScore
        )
      );

      setDifficultyFactor(
        safeFactor
      );
    }, []);

  /* ==========================================================
     PLAYER CLAMP
  ========================================================== */

  const clampPlayerX =
    useCallback(
      (x) => {
        return Math.max(
          0,
          Math.min(
            GAME_WIDTH - PLAYER_SIZE,
            x
          )
        );
      },
      [GAME_WIDTH]
    );

  /* ==========================================================
     DEBRIS
  ========================================================== */

  const createDebrisObject =
    useCallback(
      (y = -DEBRIS_SIZE) => ({
        id:
          `${Date.now()}-${Math.random()}`,

        x:
          Math.random() *
          Math.max(
            1,
            GAME_WIDTH - DEBRIS_SIZE
          ),

        y,

        nearMissed: false,
      }),
      [GAME_WIDTH]
    );

  const createInitialDebris =
    useCallback(() => {
      const objects = [];

      for (
        let index = 0;
        index < config.spawnCount;
        index += 1
      ) {
        objects.push({
          id:
            `${Date.now()}-${index}-${Math.random()}`,

          x:
            Math.random() *
            Math.max(
              1,
              GAME_WIDTH - DEBRIS_SIZE
            ),

          y:
            -DEBRIS_SIZE -
            index * 120 -
            Math.random() * 90,

          nearMissed: false,
        });
      }

      return objects;
    }, [
      GAME_WIDTH,
      config.spawnCount,
    ]);

  /* ==========================================================
     SENSOR
  ========================================================== */

  const stopSensor =
    useCallback(() => {
      if (
        sensorSubscriptionRef.current
      ) {
        try {
          sensorSubscriptionRef.current.remove();
        } catch (error) {
          // Ignore sensor cleanup errors.
        }

        sensorSubscriptionRef.current =
          null;
      }

      movementRef.current = 0;
    }, []);

  /* ==========================================================
     GAME LOOP STOP
  ========================================================== */

  const stopGameLoop =
    useCallback(() => {
      gameRunningRef.current = false;

      gameSessionRef.current += 1;

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }

      lastFrameTimeRef.current = null;
    }, []);

  /* ==========================================================
     RESET
  ========================================================== */

  const resetGame =
    useCallback(() => {
      if (
        countdownTimerRef.current
      ) {
        clearInterval(
          countdownTimerRef.current
        );

        countdownTimerRef.current =
          null;
      }

      stopGameLoop();
      stopSensor();

      playerXRef.current =
        INITIAL_PLAYER_X;

      debrisRef.current = [];

      scoreRef.current = 0;

      gameRunningRef.current = false;
      gameOverRef.current = false;
      hasWonRef.current = false;

      rewardClaimedRef.current =
        false;

      completionInProgressRef.current =
        false;

      movementRef.current = 0;

      adaptiveRef.current = {
        riskScore: 50,
        nearMisses: 0,
        successfulDodges: 0,
        collisions: 0,
        correctRescues: 0,
        lastRiskUpdate: 0,
      };

      setGameStarted(false);
      setCountdown(null);

      setPlayerPositionX(
        INITIAL_PLAYER_X
      );

      setDebris([]);
      setScore(0);

      setGameOver(false);
      setHasWon(false);

      setRescueVisible(false);
      setRescueQuestion(null);

      setSelectedAnswer(null);
      setAnswerFeedback(null);

      setRescueLives(
        MAX_RESCUE_LIVES
      );

      setRiskScore(50);
      setDifficultyFactor(1);

      setRewardClaimed(false);
    }, [
      INITIAL_PLAYER_X,
      stopGameLoop,
      stopSensor,
    ]);

  /* ==========================================================
     GAME OVER
  ========================================================== */

  const finishGame =
    useCallback(() => {
      if (
        gameOverRef.current ||
        hasWonRef.current
      ) {
        return;
      }

      gameRunningRef.current = false;
      gameOverRef.current = true;

      stopSensor();

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }

      lastFrameTimeRef.current = null;

      setGameOver(true);

      safeNotification(
        Haptics.NotificationFeedbackType.Error
      );
    }, [
      safeNotification,
      stopSensor,
    ]);

  /* ==========================================================
     WIN
  ========================================================== */

  const winGame =
    useCallback(() => {
      if (
        hasWonRef.current ||
        gameOverRef.current
      ) {
        return;
      }

      gameRunningRef.current = false;
      hasWonRef.current = true;

      stopSensor();

      scoreRef.current =
        config.targetScore;

      setScore(
        config.targetScore
      );

      setHasWon(true);

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }

      lastFrameTimeRef.current = null;

      safeNotification(
        Haptics.NotificationFeedbackType.Success
      );
    }, [
      config.targetScore,
      safeNotification,
      stopSensor,
    ]);

  /* ==========================================================
     COLLISION
  ========================================================== */

  const checkCollision =
    useCallback(
      (playerX, debrisItem) => {
        const playerTop =
          GAME_HEIGHT -
          PLAYER_SIZE -
          PLAYER_BOTTOM_OFFSET -
          FLOOD_HEIGHT;

        const playerLeft =
          playerX +
          COLLISION_PADDING;

        const playerRight =
          playerX +
          PLAYER_SIZE -
          COLLISION_PADDING;

        const playerCollisionTop =
          playerTop +
          COLLISION_PADDING;

        const playerCollisionBottom =
          playerTop +
          PLAYER_SIZE -
          COLLISION_PADDING;

        const debrisLeft =
          debrisItem.x +
          COLLISION_PADDING;

        const debrisRight =
          debrisItem.x +
          DEBRIS_SIZE -
          COLLISION_PADDING;

        const debrisTop =
          debrisItem.y +
          COLLISION_PADDING;

        const debrisBottom =
          debrisItem.y +
          DEBRIS_SIZE -
          COLLISION_PADDING;

        return (
          playerLeft <
            debrisRight &&
          playerRight >
            debrisLeft &&
          playerCollisionTop <
            debrisBottom &&
          playerCollisionBottom >
            debrisTop
        );
      },
      [GAME_HEIGHT]
    );

  /* ==========================================================
     RESCUE
  ========================================================== */

  const triggerRescueQuestion =
    useCallback(() => {
      if (rescueLives <= 0) {
        finishGame();
        return;
      }

      gameRunningRef.current =
        false;

      stopSensor();

      /*
       * Kill the current animation session.
       */
      gameSessionRef.current += 1;

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }

      lastFrameTimeRef.current = null;

      adaptiveRef.current.collisions +=
        1;

      adaptiveRef.current.riskScore +=
        RISK_INCREASE_COLLISION;

      adaptiveRef.current.riskScore =
        clamp(
          adaptiveRef.current.riskScore,
          0,
          100
        );

      setRiskScore(
        Math.round(
          adaptiveRef.current.riskScore
        )
      );

      const question =
        getRandomQuestion();

      setRescueQuestion(question);
      setSelectedAnswer(null);
      setAnswerFeedback(null);
      setRescueVisible(true);

      safeNotification(
        Haptics.NotificationFeedbackType.Warning
      );
    }, [
      finishGame,
      rescueLives,
      safeNotification,
      stopSensor,
    ]);

  /* ==========================================================
     GAME LOOP
  ========================================================== */

  const runGameLoop =
    useCallback(
      (timestamp, sessionId) => {
        if (
          sessionId !==
          gameSessionRef.current
        ) {
          return;
        }

        if (
          !gameRunningRef.current ||
          gameOverRef.current ||
          hasWonRef.current ||
          rescueVisible
        ) {
          return;
        }

        if (
          lastFrameTimeRef.current ===
          null
        ) {
          lastFrameTimeRef.current =
            timestamp;
        }

        const delta =
          Math.min(
            timestamp -
              lastFrameTimeRef.current,
            50
          ) / 1000;

        lastFrameTimeRef.current =
          timestamp;

        calculateAdaptiveDifficulty(
          timestamp
        );

        const adaptive =
          adaptiveRef.current;

        const factor = clamp(
          MAX_DIFFICULTY_FACTOR -
            (
              adaptive.riskScore /
              100
            ) *
            (
              MAX_DIFFICULTY_FACTOR -
              MIN_DIFFICULTY_FACTOR
            ),
          MIN_DIFFICULTY_FACTOR,
          MAX_DIFFICULTY_FACTOR
        );

        /* ------------------------------------------------------
           PLAYER
        ------------------------------------------------------ */

        let nextPlayerX =
          playerXRef.current;

        const tilt =
          movementRef.current;

        if (
          Math.abs(tilt) >=
          SENSOR_DEAD_ZONE
        ) {
          nextPlayerX +=
            tilt *
            config.playerSpeed *
            delta;
        }

        nextPlayerX =
          clampPlayerX(
            nextPlayerX
          );

        playerXRef.current =
          nextPlayerX;

        setPlayerPositionX(
          nextPlayerX
        );

        /* ------------------------------------------------------
           DEBRIS MOVEMENT
        ------------------------------------------------------ */

        const effectiveDebrisSpeed =
          config.debrisSpeed *
          factor;

        const movedDebris =
          debrisRef.current.map(
            (item) => ({
              ...item,

              y:
                item.y +
                effectiveDebrisSpeed *
                delta,
            })
          );

        /* ------------------------------------------------------
           COLLISION / NEAR MISS
        ------------------------------------------------------ */

        let collision = false;

        const checkedDebris =
          movedDebris.map(
            (item) => {
              if (
                checkCollision(
                  nextPlayerX,
                  item
                )
              ) {
                collision = true;
                return item;
              }

              /*
               * Near miss gives the adaptive algorithm
               * evidence that the player is operating
               * close to danger.
               */
              if (
                !item.nearMissed &&
                item.y >
                  GAME_HEIGHT -
                  PLAYER_SIZE -
                  PLAYER_BOTTOM_OFFSET -
                  FLOOD_HEIGHT -
                  45 &&
                item.y <
                  GAME_HEIGHT -
                  PLAYER_SIZE -
                  PLAYER_BOTTOM_OFFSET -
                  FLOOD_HEIGHT +
                  55
              ) {
                const horizontalGap =
                  Math.abs(
                    (
                      item.x +
                      DEBRIS_SIZE / 2
                    ) -
                    (
                      nextPlayerX +
                      PLAYER_SIZE / 2
                    )
                  );

                if (
                  horizontalGap <=
                  NEAR_MISS_DISTANCE
                ) {
                  adaptive.nearMisses +=
                    1;

                  adaptive.riskScore +=
                    RISK_INCREASE_NEAR_MISS;

                  adaptive.riskScore =
                    clamp(
                      adaptive.riskScore,
                      0,
                      100
                    );

                  return {
                    ...item,
                    nearMissed: true,
                  };
                }
              }

              return item;
            }
          );

        if (collision) {
          debrisRef.current =
            checkedDebris;

          setDebris(
            checkedDebris
          );

          triggerRescueQuestion();

          return;
        }

        /* ------------------------------------------------------
           PASSED OBSTACLES
        ------------------------------------------------------ */

        let passedCount = 0;

        const survivingDebris =
          checkedDebris.filter(
            (item) => {
              if (
                item.y >
                GAME_HEIGHT
              ) {
                passedCount += 1;

                adaptive.successfulDodges +=
                  1;

                return false;
              }

              return true;
            }
          );

        /* ------------------------------------------------------
           SCORE
        ------------------------------------------------------ */

        if (passedCount > 0) {
          const nextScore =
            Math.min(
              config.targetScore,
              scoreRef.current +
                passedCount * 10
            );

          scoreRef.current =
            nextScore;

          setScore(nextScore);

          if (
            nextScore >=
            config.targetScore
          ) {
            debrisRef.current =
              survivingDebris;

            setDebris(
              survivingDebris
            );

            winGame();

            return;
          }
        }

        /* ------------------------------------------------------
           ADAPTIVE SPAWN
        ------------------------------------------------------ */

        const effectiveSpawnInterval =
          config.spawnInterval /
          factor;

        if (
          timestamp -
            lastSpawnTimeRef.current >=
          effectiveSpawnInterval
        ) {
          lastSpawnTimeRef.current =
            timestamp;

          if (
            survivingDebris.length <
            config.spawnCount
          ) {
            survivingDebris.push(
              createDebrisObject()
            );
          }
        }

        /*
         * Prevent runaway obstacle count.
         */
        while (
          survivingDebris.length >
          config.spawnCount
        ) {
          survivingDebris.shift();
        }

        debrisRef.current =
          survivingDebris;

        setDebris(
          survivingDebris
        );

        animationFrameRef.current =
          requestAnimationFrame(
            (nextTimestamp) =>
              runGameLoop(
                nextTimestamp,
                sessionId
              )
          );
      },
      [
        calculateAdaptiveDifficulty,
        checkCollision,
        clampPlayerX,
        config.debrisSpeed,
        config.playerSpeed,
        config.spawnCount,
        config.spawnInterval,
        config.targetScore,
        createDebrisObject,
        GAME_HEIGHT,
        rescueVisible,
        triggerRescueQuestion,
        winGame,
      ]
    );

  /* ==========================================================
     RESCUE ANSWER
  ========================================================== */

  const handleRescueAnswer =
    useCallback(
      (answerId) => {
        if (
          !rescueQuestion ||
          selectedAnswer
        ) {
          return;
        }

        setSelectedAnswer(
          answerId
        );

        const correct =
          answerId ===
          rescueQuestion.correct;

        if (!correct) {
          setAnswerFeedback(
            'wrong'
          );

          safeNotification(
            Haptics.NotificationFeedbackType.Error
          );

          setTimeout(() => {
            setRescueVisible(false);
            setRescueQuestion(null);

            finishGame();
          }, 850);

          return;
        }

        setAnswerFeedback(
          'correct'
        );

        safeNotification(
          Haptics.NotificationFeedbackType.Success
        );

        adaptiveRef.current.correctRescues +=
          1;

        adaptiveRef.current.riskScore -=
          RISK_DECREASE_CORRECT_RESCUE;

        adaptiveRef.current.riskScore =
          clamp(
            adaptiveRef.current.riskScore,
            0,
            100
          );

        const nextScore =
          Math.min(
            config.targetScore,
            scoreRef.current +
              RESCUE_POINTS
          );

        scoreRef.current =
          nextScore;

        setScore(nextScore);

        setRiskScore(
          Math.round(
            adaptiveRef.current.riskScore
          )
        );

        const nextFactor =
          MAX_DIFFICULTY_FACTOR -
          (
            adaptiveRef.current
              .riskScore / 100
          ) *
          (
            MAX_DIFFICULTY_FACTOR -
            MIN_DIFFICULTY_FACTOR
          );

        setDifficultyFactor(
          clamp(
            nextFactor,
            MIN_DIFFICULTY_FACTOR,
            MAX_DIFFICULTY_FACTOR
          )
        );

        setRescueLives(
          (value) =>
            Math.max(
              0,
              value - 1
            )
        );

        /*
         * Clear nearby obstacles.
         */
        debrisRef.current =
          debrisRef.current.filter(
            (item) =>
              item.y <
              GAME_HEIGHT * 0.35
          );

        setDebris(
          debrisRef.current
        );

        /*
         * Kill old session.
         */
        const newSession =
          gameSessionRef.current +
          1;

        gameSessionRef.current =
          newSession;

        setTimeout(() => {
          setRescueVisible(false);
          setRescueQuestion(null);
          setSelectedAnswer(null);
          setAnswerFeedback(null);

          if (
            nextScore >=
            config.targetScore
          ) {
            winGame();
            return;
          }

          gameOverRef.current = false;
          hasWonRef.current = false;
          gameRunningRef.current = true;

          lastFrameTimeRef.current =
            null;

          lastSpawnTimeRef.current =
            performance.now();

          animationFrameRef.current =
            requestAnimationFrame(
              (timestamp) =>
                runGameLoop(
                  timestamp,
                  newSession
                )
            );
        }, 700);
      },
      [
        config.targetScore,
        finishGame,
        GAME_HEIGHT,
        rescueQuestion,
        runGameLoop,
        safeNotification,
        selectedAnswer,
        winGame,
      ]
    );

  /* ==========================================================
     BEGIN GAME
  ========================================================== */

  const beginGame =
    useCallback(() => {
      const sessionId =
        gameSessionRef.current +
        1;

      gameSessionRef.current =
        sessionId;

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }

      playerXRef.current =
        INITIAL_PLAYER_X;

      const initialDebris =
        createInitialDebris();

      debrisRef.current =
        initialDebris;

      scoreRef.current = 0;

      gameRunningRef.current = true;
      gameOverRef.current = false;
      hasWonRef.current = false;

      rewardClaimedRef.current =
        false;

      completionInProgressRef.current =
        false;

      movementRef.current = 0;

      lastFrameTimeRef.current =
        null;

      lastSpawnTimeRef.current =
        performance.now();

      adaptiveRef.current = {
        riskScore: 50,
        nearMisses: 0,
        successfulDodges: 0,
        collisions: 0,
        correctRescues: 0,
        lastRiskUpdate:
          performance.now(),
      };

      setRiskScore(50);
      setDifficultyFactor(1);

      setPlayerPositionX(
        INITIAL_PLAYER_X
      );

      setDebris(initialDebris);
      setScore(0);

      setGameOver(false);
      setHasWon(false);

      setRewardClaimed(false);

      setRescueLives(
        MAX_RESCUE_LIVES
      );

      setGameStarted(true);

      safeNotification(
        Haptics.NotificationFeedbackType.Success
      );

      animationFrameRef.current =
        requestAnimationFrame(
          (timestamp) =>
            runGameLoop(
              timestamp,
              sessionId
            )
        );
    }, [
      INITIAL_PLAYER_X,
      createInitialDebris,
      runGameLoop,
      safeNotification,
    ]);

  /* ==========================================================
     START GAME
  ========================================================== */

  const startGame =
    useCallback(() => {
      if (
        gameRunningRef.current ||
        countdown !== null
      ) {
        return;
      }

      if (
        countdownTimerRef.current
      ) {
        clearInterval(
          countdownTimerRef.current
        );

        countdownTimerRef.current =
          null;
      }

      stopGameLoop();
      stopSensor();

      playerXRef.current =
        INITIAL_PLAYER_X;

      debrisRef.current = [];

      scoreRef.current = 0;

      gameOverRef.current = false;
      hasWonRef.current = false;
      gameRunningRef.current = false;

      rewardClaimedRef.current =
        false;

      completionInProgressRef.current =
        false;

      setPlayerPositionX(
        INITIAL_PLAYER_X
      );

      setDebris([]);
      setScore(0);

      setGameOver(false);
      setHasWon(false);

      setRescueVisible(false);
      setRescueQuestion(null);

      setRescueLives(
        MAX_RESCUE_LIVES
      );

      setRewardClaimed(false);

      setGameStarted(false);

      let count = 3;

      setCountdown(count);

      safeImpact(
        Haptics.ImpactFeedbackStyle.Light
      );

      countdownTimerRef.current =
        setInterval(() => {
          count -= 1;

          if (count <= 0) {
            clearInterval(
              countdownTimerRef.current
            );

            countdownTimerRef.current =
              null;

            setCountdown(null);

            beginGame();

            return;
          }

          setCountdown(count);

          safeImpact(
            Haptics.ImpactFeedbackStyle.Light
          );
        }, 700);
    }, [
      beginGame,
      countdown,
      INITIAL_PLAYER_X,
      safeImpact,
      stopGameLoop,
      stopSensor,
    ]);

  /* ==========================================================
     TOUCH CONTROLS
  ========================================================== */

  const movePlayer =
    useCallback(
      (direction) => {
        if (
          !gameRunningRef.current ||
          gameOverRef.current ||
          hasWonRef.current
        ) {
          return;
        }

        const amount =
          config.playerSpeed *
          TOUCH_MOVE_MULTIPLIER;

        let nextX =
          playerXRef.current;

        if (
          direction === 'left'
        ) {
          nextX -= amount;
        }

        if (
          direction === 'right'
        ) {
          nextX += amount;
        }

        nextX =
          clampPlayerX(nextX);

        playerXRef.current =
          nextX;

        setPlayerPositionX(
          nextX
        );

        safeImpact(
          Haptics.ImpactFeedbackStyle.Light
        );
      },
      [
        clampPlayerX,
        config.playerSpeed,
        safeImpact,
      ]
    );

  /* ==========================================================
     ACCELEROMETER
  ========================================================== */

  useEffect(() => {
    let mounted = true;

    const setupAccelerometer =
      async () => {
        if (
          !gameStarted ||
          gameOver ||
          hasWon ||
          rescueVisible
        ) {
          stopSensor();
          return;
        }

        try {
          const available =
            await Accelerometer.isAvailableAsync();

          if (!mounted) {
            return;
          }

          if (!available) {
            setSensorAvailable(
              false
            );

            return;
          }

          setSensorAvailable(
            true
          );

          Accelerometer.setUpdateInterval(
            50
          );

          stopSensor();

          sensorSubscriptionRef.current =
            Accelerometer.addListener(
              (data) => {
                if (
                  !gameRunningRef.current
                ) {
                  return;
                }

                const value =
                  Number(data?.x) ||
                  0;

                movementRef.current =
                  clamp(
                    value,
                    -1,
                    1
                  );
              }
            );
        } catch (error) {
          console.log(
            'FloodRunner accelerometer error:',
            error
          );

          if (mounted) {
            setSensorAvailable(
              false
            );
          }
        }
      };

    setupAccelerometer();

    return () => {
      mounted = false;
      stopSensor();
    };
  }, [
    gameStarted,
    gameOver,
    hasWon,
    rescueVisible,
    stopSensor,
  ]);

  /* ==========================================================
     BACK BUTTON
  ========================================================== */

  const handleBack =
    useCallback(() => {
      /*
       * Stop every active game resource before leaving.
       */
      stopGameLoop();
      stopSensor();

      if (
        countdownTimerRef.current
      ) {
        clearInterval(
          countdownTimerRef.current
        );

        countdownTimerRef.current =
          null;
      }

      navigation.goBack();
    }, [
      navigation,
      stopGameLoop,
      stopSensor,
    ]);

  /* ==========================================================
     ANDROID HARDWARE BACK
  ========================================================== */

  useEffect(() => {
    const subscription =
      BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          handleBack();
          return true;
        }
      );

    return () => {
      subscription.remove();
    };
  }, [handleBack]);

  /* ==========================================================
     CLEANUP
  ========================================================== */

  useEffect(() => {
    return () => {
      if (
        countdownTimerRef.current
      ) {
        clearInterval(
          countdownTimerRef.current
        );
      }

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      if (
        sensorSubscriptionRef.current
      ) {
        try {
          sensorSubscriptionRef.current.remove();
        } catch (error) {
          // Ignore.
        }
      }

      gameRunningRef.current =
        false;
    };
  }, []);

  /* ==========================================================
     COMPLETE MISSION
  ========================================================== */

//   const handleClaimReward = useCallback(() => {
//   if (rewardClaimed) {
//     return;
//   }

//   if (!missionId) {
//     console.warn('FloodRunner: missing missionId');
//     return;
//   }

//   completeMission(
//     missionId,
//     missionXpReward,
//     missionCoinReward
//   );

//   setRewardClaimed(true);
// }, [
//   rewardClaimed,
//   missionId,
//   missionXpReward,
//   missionCoinReward,
//   completeMission,
// ]);
  const handleClaimReward = useCallback(async () => {
    /*
    * The game must genuinely be won.
    */
    if (!hasWonRef.current) {
      return;
    }

    /*
    * Prevent double tapping.
    */
    if (
      rewardClaimedRef.current ||
      completionInProgressRef.current
    ) {
      return;
    }

    completionInProgressRef.current = true;
    rewardClaimedRef.current = true;
    setRewardClaimed(true);

    try {
      await Promise.resolve(
        completeMission(
          campaignMissionId,
          missionXpReward,
          missionCoinReward
        )
      );
    } catch (error) {
      console.error(
        'FloodRunner mission completion error:',
        error
      );

      rewardClaimedRef.current = false;
      completionInProgressRef.current = false;
      setRewardClaimed(false);

      return;
    }

    setTimeout(() => {
      resetGame();
      navigation.goBack();
    }, 250);
  }, [
    campaignMissionId,
    completeMission,
    missionXpReward,
    missionCoinReward,
    navigation,
    resetGame,
  ]);


  // const handleClaimReward = useCallback(async() => {
  //     /*
  //      * The game must genuinely be won.
  //      */
  //     if (!hasWonRef.current) {
  //       return;
  //     }

  //     /*
  //      * Prevent double tapping.
  //      */
  //     if (
  //       rewardClaimedRef.current ||
  //       completionInProgressRef.current
  //     ) {
  //       return;
  //     }

  //     completionInProgressRef.current =
  //       true;

  //     rewardClaimedRef.current =
  //       true;

  //     setRewardClaimed(true);

  //     /*
  //      * ======================================================
  //      * IMPORTANT MISSION CONNECTION
  //      * ======================================================
  //      *
  //      * DO NOT use:
  //      *
  //      * missionId: 'floodRunner'
  //      *
  //      * because MissionsScreen does NOT look for that key.
  //      *
  //      * MissionsScreen looks for:
  //      *
  //      * completedMissions['level-2']
  //      * completedMissions['level-5']
  //      * completedMissions['level-8']
  //      *
  //      * Therefore we send the actual mission ID.
  //      */
  //     try {
  //       await Promise.resolve(
  //         completeMission({
  //           // missionId: campaignMissionId,
  //           // /*
  //           //  * Campaign level:
  //           //  * 2 / 5 / 8
  //           //  */
  //           // level: campaignLevel,
  //           // /*
  //           //  * Internal Flood Runner level:
  //           //  * 1 / 2 / 3
  //           //  */
  //           // gameLevel,
  //           // score: scoreRef.current,

  //           // /*
  //           //  * Rewards supplied by MissionsScreen.
  //           //  */
  //           // xp:
  //           //   missionXpReward,

  //           // coins:
  //           //   missionCoinReward,

  //           // /*
  //           //  * Extra aliases are harmless for contexts
  //           //  * that use them and make the completion
  //           //  * payload explicit.
  //           //  */
  //           // xpreward:
  //           //   missionXpReward,

  //           // coinreward:
  //           //   missionCoinReward,

  //           // game:
  //           //   'FloodRunnerGameModal',
  //           campaignMissionId,
  //           missionXpReward,
  //           missionCoinReward
  //         })
  //       );
  //     } catch (error) {
  //       console.error(
  //         'FloodRunner mission completion error:',
  //         error
  //       );

  //       /*
  //        * Allow the player to retry claiming if the
  //        * UserContext operation failed.
  //        */
  //       rewardClaimedRef.current =
  //         false;

  //       completionInProgressRef.current =
  //         false;

  //       setRewardClaimed(false);

  //       return;
  //     }

  //     /*
  //      * UserContext is now the source of truth.
  //      *
  //      * MissionsScreen will see:
  //      *
  //      * completedMissions[level-X] === true
  //      *
  //      * and unlock the next campaign mission.
  //      */
  //     setTimeout(() => {
  //       resetGame();

  //       navigation.goBack();
  //     }, 250);
  //   }, [
  //     campaignLevel,
  //     campaignMissionId,
  //     completeMission,
  //     gameLevel,
  //     missionCoinReward,
  //     missionXpReward,
  //     navigation,
  //     resetGame,
  //   ]);

  /* ==========================================================
     PROGRESS
  ========================================================== */

  const progressPercentage =
    Math.min(
      100,
      (
        score /
        config.targetScore
      ) * 100
    );

  /* ==========================================================
     DIFFICULTY LABEL
  ========================================================== */

  const difficultyLabel =
    useMemo(() => {
      if (
        difficultyFactor < 0.88
      ) {
        return t(
          'games.floodRunner.adaptive.easier'
        );
      }

      if (
        difficultyFactor > 1.05
      ) {
        return t(
          'games.floodRunner.adaptive.harder'
        );
      }

      return t(
        'games.floodRunner.adaptive.balanced'
      );
    }, [
      difficultyFactor,
      t,
    ]);

  /* ==========================================================
     RENDER HELPERS
  ========================================================== */

  const isCompact =
    windowHeight < 700;

  const isVerySmall =
    windowHeight < 620;

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop:
            Math.max(
              insets.top,
              6
            ),
          paddingBottom:
            Math.max(
              insets.bottom,
              6
            ),
        },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              Math.max(
                insets.bottom + 20,
                24
              ),
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces
      >
        <View
          style={[
            styles.modalContentCard,
            {
              width: Math.min(
                GAME_WIDTH + 24,
                windowWidth - 12
              ),
            },
          ]}
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <View
            style={[
              styles.modalHeader,
              isCompact &&
                styles.modalHeaderCompact,
            ]}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View
              style={styles.headerIcon}
            >
              <Ionicons
                name="water"
                size={20}
                color="#38BDF8"
              />
            </View>

            <View
              style={styles.headerTextArea}
            >
              <Text
                style={styles.modalTitle}
                numberOfLines={1}
              >
                {t(
                  'games.floodRunner.title'
                )}
              </Text>

              <Text
                style={styles.levelLabel}
              >
                {t(
                  'games.floodRunner.level',
                  {
                    level:
                      gameLevel,
                  }
                )}{' '}
                •{' '}
                {t(config.nameKey)}
              </Text>
            </View>
          </View>

          {/* =================================================
              CAMPAIGN CONNECTION
          ================================================= */}

          <View
            style={styles.campaignConnection}
          >
            <Ionicons
              name="map"
              size={14}
              color="#A855F7"
            />

            <Text
              style={
                styles.campaignConnectionText
              }
            >
              {t(
                'games.floodRunner.level',
                {
                  level:
                    campaignLevel,
                }
              )}
            </Text>

            <View
              style={
                styles.connectionDot
              }
            />

            <Text
              style={
                styles.campaignConnectionText
              }
            >
              {t(
                config.nameKey
              )}
            </Text>
          </View>

          {/* =================================================
              OBJECTIVE
          ================================================= */}

          <View
            style={styles.objectiveCard}
          >
            <View
              style={styles.objectiveIcon}
            >
              <Ionicons
                name="flag"
                size={18}
                color="#34D399"
              />
            </View>

            <View
              style={styles.objectiveTextArea}
            >
              <Text
                style={
                  styles.objectiveTitle
                }
              >
                {t(
                  'games.floodRunner.objective'
                )}
              </Text>

              <Text
                style={
                  styles.objectiveText
                }
              >
                {t(
                  'games.floodRunner.objectiveDescription'
                )}
              </Text>
            </View>
          </View>

          {/* =================================================
              INSTRUCTIONS
          ================================================= */}

          {!gameStarted &&
            !gameOver &&
            !hasWon &&
            countdown === null && (
              <View
                style={
                  styles.instructionsCard
                }
              >
                <View
                  style={
                    styles.instructionsHeader
                  }
                >
                  <Ionicons
                    name="help-circle"
                    size={20}
                    color="#FBBF24"
                  />

                  <Text
                    style={
                      styles.instructionsTitle
                    }
                  >
                    {t(
                      'games.floodRunner.howToPlay'
                    )}
                  </Text>
                </View>

                <InstructionRow
                  icon="swap-horizontal"
                  text={t(
                    'games.floodRunner.instructions.move'
                  )}
                />

                <InstructionRow
                  icon="warning"
                  text={t(
                    'games.floodRunner.instructions.avoid'
                  )}
                />

                <InstructionRow
                  icon="water"
                  text={t(
                    'games.floodRunner.instructions.flood'
                  )}
                />

                <InstructionRow
                  icon="flag"
                  text={t(
                    'games.floodRunner.instructions.finish',
                    {
                      score:
                        config.targetScore,
                    }
                  )}
                />

                <InstructionRow
                  icon="help-circle"
                  text={t(
                    'games.floodRunner.instructions.rescue'
                  )}
                />
              </View>
            )}

          {/* =================================================
              SENSOR STATUS
          ================================================= */}

          {gameStarted &&
            !gameOver &&
            !hasWon &&
            !rescueVisible && (
              <View
                style={
                  styles.sensorStatus
                }
              >
                <Ionicons
                  name={
                    sensorAvailable
                      ? 'phone-portrait-outline'
                      : 'hand-left-outline'
                  }
                  size={15}
                  color={
                    sensorAvailable
                      ? '#34D399'
                      : '#FBBF24'
                  }
                />

                <Text
                  style={[
                    styles.sensorText,
                    {
                      color:
                        sensorAvailable
                          ? '#34D399'
                          : '#FBBF24',
                    },
                  ]}
                >
                  {sensorAvailable
                    ? t(
                        'games.floodRunner.tiltActive'
                      )
                    : t(
                        'games.floodRunner.touchActive'
                      )}
                </Text>

                <View
                  style={
                    styles.lifeBadge
                  }
                >
                  <Ionicons
                    name="heart"
                    size={12}
                    color="#FB7185"
                  />

                  <Text
                    style={styles.lifeText}
                  >
                    {rescueLives}
                  </Text>
                </View>
              </View>
            )}

          {/* =================================================
              GAME CANVAS
          ================================================= */}

          <View
            style={[
              styles.gameCanvas,
              {
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
              },
            ]}
          >
            {/* SAFE ZONE */}

            <View
              style={styles.safeZone}
            >
              <View
                style={
                  styles.safeZoneIcon
                }
              >
                <Ionicons
                  name="shield-checkmark"
                  size={18}
                  color="#34D399"
                />
              </View>

              <View>
                <Text
                  style={
                    styles.safeZoneTitle
                  }
                >
                  {t(
                    'games.floodRunner.safeShelter'
                  )}
                </Text>

                <Text
                  style={
                    styles.safeZoneSub
                  }
                >
                  {t(
                    'games.floodRunner.highGround'
                  )}
                </Text>
              </View>
            </View>

            {/* DANGER FIELD */}

            <View
              style={styles.dangerField}
            >
              <View
                style={styles.routeLine}
              />

              <Text
                style={styles.dangerText}
              >
                {t(
                  'games.floodRunner.evacuationRoute'
                )}
              </Text>
            </View>

            {/* DEBRIS */}

            {gameStarted &&
              !gameOver &&
              !hasWon &&
              debris.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.debrisNode,
                    {
                      left:
                        item.x,
                      top:
                        item.y,
                    },
                  ]}
                >
                  <Ionicons
                    name="warning"
                    size={20}
                    color="#FCA5A5"
                  />
                </View>
              ))}

            {/* PLAYER */}

            {gameStarted &&
              !gameOver &&
              !hasWon &&
              !rescueVisible && (
                <View
                  style={[
                    styles.playerNode,
                    {
                      left:
                        playerPositionX,

                      bottom:
                        PLAYER_BOTTOM_OFFSET +
                        FLOOD_HEIGHT,
                    },
                  ]}
                >
                  <Ionicons
                    name="person"
                    size={25}
                    color="#FFFFFF"
                  />
                </View>
              )}

            {/* FLOOD */}

            <View
              style={styles.floodLayer}
            >
              <View
                style={
                  styles.waveContainer
                }
              >
                {Array.from({
                  length: 12,
                }).map(
                  (_, index) => (
                    <Text
                      key={index}
                      style={
                        styles.wave
                      }
                    >
                      ~
                    </Text>
                  )
                )}
              </View>

              <Text
                style={
                  styles.floodLabel
                }
              >
                {t(
                  'games.floodRunner.floodZone'
                )}
              </Text>
            </View>

            {/* ADAPTIVE BADGE */}

            {gameStarted &&
              !gameOver &&
              !hasWon &&
              !rescueVisible && (
                <View
                  style={
                    styles.adaptiveBadge
                  }
                >
                  <Ionicons
                    name="pulse"
                    size={11}
                    color="#38BDF8"
                  />

                  <Text
                    style={
                      styles.adaptiveText
                    }
                  >
                    {difficultyLabel}
                  </Text>
                </View>
              )}

            {/* COUNTDOWN */}

            {countdown !== null && (
              <View
                style={
                  styles.countdownOverlay
                }
              >
                <Text
                  style={
                    styles.countdownNumber
                  }
                >
                  {countdown}
                </Text>

                <Text
                  style={
                    styles.countdownText
                  }
                >
                  {t(
                    'games.floodRunner.getReady'
                  )}
                </Text>
              </View>
            )}

            {/* START */}

            {!gameStarted &&
              countdown === null &&
              !gameOver &&
              !hasWon && (
                <View
                  style={
                    styles.startOverlay
                  }
                >
                  <View
                    style={
                      styles.startIcon
                    }
                  >
                    <Ionicons
                      name="walk"
                      size={34}
                      color="#38BDF8"
                    />
                  </View>

                  <Text
                    style={
                      styles.startTitle
                    }
                  >
                    {t(
                      'games.floodRunner.ready'
                    )}
                  </Text>

                  <Text
                    style={
                      styles.startDescription
                    }
                  >
                    {t(
                      'games.floodRunner.startDescription'
                    )}
                  </Text>

                  <TouchableOpacity
                    style={
                      styles.startButton
                    }
                    onPress={
                      startGame
                    }
                    activeOpacity={
                      0.8
                    }
                  >
                    <Ionicons
                      name="play"
                      size={18}
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.startButtonText
                      }
                    >
                      {t(
                        'games.floodRunner.start'
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

            {/* =================================================
                RESCUE
            ================================================= */}

            {rescueVisible &&
              rescueQuestion && (
                <View
                  style={
                    styles.rescueOverlay
                  }
                >
                  <View
                    style={
                      styles.rescueIcon
                    }
                  >
                    <Ionicons
                      name="medkit"
                      size={26}
                      color="#FBBF24"
                    />
                  </View>

                  <Text
                    style={
                      styles.rescueTitle
                    }
                  >
                    {t(
                      'games.floodRunner.rescueTitle'
                    )}
                  </Text>

                  <Text
                    style={
                      styles.rescueDescription
                    }
                  >
                    {t(
                      'games.floodRunner.rescueDescription'
                    )}
                  </Text>

                  <Text
                    style={
                      styles.rescueQuestion
                    }
                  >
                    {t(
                      rescueQuestion.questionKey
                    )}
                  </Text>

                  <View
                    style={
                      styles.answerList
                    }
                  >
                    {rescueQuestion.options.map(
                      (option) => {
                        const isSelected =
                          selectedAnswer ===
                          option.id;

                        const isCorrect =
                          rescueQuestion.correct ===
                          option.id;

                        let backgroundColor =
                          '#172033';

                        let borderColor =
                          '#334155';

                        if (
                          isSelected &&
                          answerFeedback ===
                            'correct'
                        ) {
                          backgroundColor =
                            '#064E3B';

                          borderColor =
                            '#10B981';
                        }

                        if (
                          isSelected &&
                          answerFeedback ===
                            'wrong'
                        ) {
                          backgroundColor =
                            '#450A0A';

                          borderColor =
                            '#EF4444';
                        }

                        if (
                          selectedAnswer &&
                          isCorrect &&
                          answerFeedback ===
                            'correct'
                        ) {
                          backgroundColor =
                            '#064E3B';

                          borderColor =
                            '#10B981';
                        }

                        return (
                          <TouchableOpacity
                            key={
                              option.id
                            }
                            disabled={
                              !!selectedAnswer
                            }
                            style={[
                              styles.answerButton,
                              {
                                backgroundColor,
                                borderColor,
                              },
                            ]}
                            onPress={() =>
                              handleRescueAnswer(
                                option.id
                              )
                            }
                            activeOpacity={
                              0.8
                            }
                          >
                            <View
                              style={
                                styles.answerLetter
                              }
                            >
                              <Text
                                style={
                                  styles.answerLetterText
                                }
                              >
                                {option.id.toUpperCase()}
                              </Text>
                            </View>

                            <Text
                              style={
                                styles.answerText
                              }
                            >
                              {t(
                                option.textKey
                              )}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>

                  <View
                    style={
                      styles.rescueLifeNotice
                    }
                  >
                    <Ionicons
                      name="heart"
                      size={13}
                      color="#FB7185"
                    />

                    <Text
                      style={
                        styles.rescueLifeText
                      }
                    >
                      {t(
                        'games.floodRunner.rescueLifeNotice'
                      )}
                    </Text>
                  </View>
                </View>
              )}

            {/* =================================================
                GAME OVER
            ================================================= */}

            {gameOver && (
              <View
                style={
                  styles.endGameOverlay
                }
              >
                <View
                  style={[
                    styles.resultIcon,
                    {
                      backgroundColor:
                        '#450A0A',
                    },
                  ]}
                >
                  <Ionicons
                    name="warning"
                    size={34}
                    color="#EF4444"
                  />
                </View>

                <Text
                  style={
                    styles.gameOverTitle
                  }
                >
                  {t(
                    'games.floodRunner.failed'
                  )}
                </Text>

                <Text
                  style={
                    styles.gameOverText
                  }
                >
                  {t(
                    'games.floodRunner.failedDescription'
                  )}
                </Text>

                <Text
                  style={
                    styles.finalScore
                  }
                >
                  {score} /{' '}
                  {
                    config.targetScore
                  }
                </Text>

                <TouchableOpacity
                  style={
                    styles.retryButton
                  }
                  onPress={
                    startGame
                  }
                  activeOpacity={
                    0.8
                  }
                >
                  <Ionicons
                    name="refresh"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    {t(
                      'games.floodRunner.retry'
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* =================================================
                WIN
            ================================================= */}

            {hasWon && (
              <View
                style={
                  styles.endGameOverlay
                }
              >
                <View
                  style={[
                    styles.resultIcon,
                    {
                      backgroundColor:
                        '#064E3B',
                    },
                  ]}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={36}
                    color="#10B981"
                  />
                </View>

                <Text
                  style={
                    styles.successTitle
                  }
                >
                  {t(
                    'games.floodRunner.success'
                  )}
                </Text>

                <Text
                  style={
                    styles.gameOverText
                  }
                >
                  {t(
                    'games.floodRunner.successDescription'
                  )}
                </Text>

                <View
                  style={
                    styles.rewardRow
                  }
                >
                  <Reward
                    icon="flash"
                    value={`+${missionXpReward}`}
                    label={t(
                      'games.floodRunner.xp'
                    )}
                  />

                  <Reward
                    icon="cash"
                    value={`+${missionCoinReward}`}
                    label={t(
                      'games.floodRunner.coins'
                    )}
                  />
                </View>

                <View
                  style={
                    styles.unlockNotice
                  }
                >
                  <Ionicons
                    name="lock-open"
                    size={14}
                    color="#34D399"
                  />

                  <Text
                    style={
                      styles.unlockNoticeText
                    }
                  >
                    {t(
                      'games.floodRunner.successDescription'
                    )}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.claimRewardButton,
                    rewardClaimed &&
                      styles.claimDisabled,
                  ]}
                  disabled={
                    rewardClaimed
                  }
                  onPress={
                    handleClaimReward
                  }
                  activeOpacity={
                    0.8
                  }
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    {rewardClaimed
                      ? t(
                          'games.floodRunner.rewardClaimed'
                        )
                      : t(
                          'games.floodRunner.claimReward'
                        )}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* =================================================
              SCORE HUD
          ================================================= */}

          <View
            style={styles.gameHud}
          >
            <View
              style={
                styles.scoreHeader
              }
            >
              <Text
                style={styles.scoreLabel}
              >
                {t(
                  'games.floodRunner.score'
                )}
              </Text>

              <Text
                style={styles.scoreValue}
              >
                {score} /{' '}
                {
                  config.targetScore
                }
              </Text>
            </View>

            <View
              style={
                styles.progressBackground
              }
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      `${progressPercentage}%`,
                  },
                ]}
              />
            </View>

            {gameStarted &&
              !gameOver &&
              !hasWon && (
                <View
                  style={
                    styles.algorithmPanel
                  }
                >
                  <View>
                    <Text
                      style={
                        styles.algorithmLabel
                      }
                    >
                      ADAPTIVE SAFETY
                    </Text>

                    <Text
                      style={
                        styles.algorithmSub
                      }
                    >
                      {difficultyLabel}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.algorithmScoreBox
                    }
                  >
                    <Ionicons
                      name="pulse"
                      size={12}
                      color="#38BDF8"
                    />

                    <Text
                      style={
                        styles.algorithmValue
                      }
                    >
                      {riskScore}
                    </Text>
                  </View>
                </View>
              )}
          </View>

          {/* =================================================
              CONTROLS
          ================================================= */}

          {gameStarted &&
            !gameOver &&
            !hasWon &&
            !rescueVisible && (
              <View
                style={[
                  styles.controls,
                  isVerySmall &&
                    styles.controlsCompact,
                ]}
              >
                <TouchableOpacity
                  style={
                    styles.controlButton
                  }
                  onPress={() =>
                    movePlayer(
                      'left'
                    )
                  }
                  activeOpacity={
                    0.7
                  }
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.controlText
                    }
                  >
                    {t(
                      'games.floodRunner.left'
                    )}
                  </Text>
                </TouchableOpacity>

                <View
                  style={
                    styles.controlHint
                  }
                >
                  <Ionicons
                    name={
                      sensorAvailable
                        ? 'phone-portrait-outline'
                        : 'hand-left-outline'
                    }
                    size={21}
                    color="#38BDF8"
                  />

                  <Text
                    style={
                      styles.controlHintText
                    }
                  >
                    {sensorAvailable
                      ? t(
                          'games.floodRunner.tilt'
                        )
                      : t(
                          'games.floodRunner.touch'
                        )}
                  </Text>
                </View>

                <TouchableOpacity
                  style={
                    styles.controlButton
                  }
                  onPress={() =>
                    movePlayer(
                      'right'
                    )
                  }
                  activeOpacity={
                    0.7
                  }
                >
                  <Ionicons
                    name="arrow-forward"
                    size={24}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.controlText
                    }
                  >
                    {t(
                      'games.floodRunner.right'
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

          {/* =================================================
              EXIT BUTTON
          ================================================= */}

          {!gameStarted &&
            !countdown && (
              <TouchableOpacity
                style={
                  styles.bottomBackButton
                }
                onPress={
                  handleBack
                }
                activeOpacity={
                  0.8
                }
              >
                <Ionicons
                  name="arrow-back"
                  size={17}
                  color="#CBD5E1"
                />

                <Text
                  style={
                    styles.bottomBackText
                  }
                >
                  {t(
                    'common.back'
                  ) || 'Back'}
                </Text>
              </TouchableOpacity>
            )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ============================================================
   INSTRUCTION ROW
============================================================ */

function InstructionRow({
  icon,
  text,
}) {
  return (
    <View
      style={styles.instructionRow}
    >
      <View
        style={styles.instructionIcon}
      >
        <Ionicons
          name={icon}
          size={16}
          color="#38BDF8"
        />
      </View>

      <Text
        style={styles.instructionText}
      >
        {text}
      </Text>
    </View>
  );
}

/* ============================================================
   REWARD
============================================================ */

function Reward({
  icon,
  value,
  label,
}) {
  return (
    <View style={styles.reward}>
      <Ionicons
        name={icon}
        size={18}
        color="#FBBF24"
      />

      <Text
        style={styles.rewardValue}
      >
        {value}
      </Text>

      <Text
        style={styles.rewardLabel}
      >
        {label}
      </Text>
    </View>
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
  },

  scroll: {
    flex: 1,
    width: '100%',
  },

  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingTop: 6,
  },

  modalContentCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  /* ==========================================================
     HEADER
  ========================================================== */

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  modalHeaderCompact: {
    marginBottom: 7,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#172033',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#082F49',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  headerTextArea: {
    flex: 1,
  },

  modalTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },

  levelLabel: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },

  /* ==========================================================
     CAMPAIGN CONNECTION
  ========================================================== */

  campaignConnection: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#1E1B4B',
    borderWidth: 1,
    borderColor: '#4C1D95',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginBottom: 9,
  },

  campaignConnectionText: {
    color: '#C4B5FD',
    fontSize: 9,
    fontWeight: '800',
  },

  connectionDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#A855F7',
    marginHorizontal: 6,
  },

  /* ==========================================================
     OBJECTIVE
  ========================================================== */

  objectiveCard: {
    flexDirection: 'row',
    backgroundColor: '#0B1F1A',
    borderWidth: 1,
    borderColor: '#064E3B',
    borderRadius: 14,
    padding: 9,
    marginBottom: 9,
  },

  objectiveIcon: {
    width: 33,
    height: 33,
    borderRadius: 10,
    backgroundColor: '#052E25',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  objectiveTextArea: {
    flex: 1,
  },

  objectiveTitle: {
    color: '#34D399',
    fontWeight: '800',
    fontSize: 12,
  },

  objectiveText: {
    color: '#A7F3D0',
    fontSize: 10,
    marginTop: 2,
    lineHeight: 15,
  },

  /* ==========================================================
     INSTRUCTIONS
  ========================================================== */

  instructionsCard: {
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 9,
    marginBottom: 9,
  },

  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },

  instructionsTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 7,
    fontSize: 12,
  },

  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },

  instructionIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#082F49',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },

  instructionText: {
    color: '#CBD5E1',
    fontSize: 10,
    flex: 1,
    lineHeight: 14,
  },

  /* ==========================================================
     SENSOR
  ========================================================== */

  sensorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 4,
  },

  sensorText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 5,
    flex: 1,
  },

  lifeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3F1722',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  lifeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 4,
    fontSize: 10,
  },

  /* ==========================================================
     GAME
  ========================================================== */

  gameCanvas: {
    backgroundColor: '#07111F',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E3A5F',
    position: 'relative',
  },

  safeZone: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 55,
    backgroundColor: '#052E25',
    borderBottomWidth: 1,
    borderBottomColor: '#065F46',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    zIndex: 2,
  },

  safeZoneIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  safeZoneTitle: {
    color: '#6EE7B7',
    fontSize: 11,
    fontWeight: '800',
  },

  safeZoneSub: {
    color: '#A7F3D0',
    fontSize: 8,
    marginTop: 1,
  },

  dangerField: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    bottom: FLOOD_HEIGHT,
    backgroundColor: '#0B1626',
  },

  routeLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#1E3A5F',
    opacity: 0.7,
  },

  dangerText: {
    color: '#334155',
    fontSize: 8,
    position: 'absolute',
    top: 10,
    left: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  debrisNode: {
    position: 'absolute',
    width: DEBRIS_SIZE,
    height: DEBRIS_SIZE,
    borderRadius: 9,
    backgroundColor: '#451A1A',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },

  playerNode: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius: 12,
    backgroundColor: '#0284C7',
    borderWidth: 2,
    borderColor: '#7DD3FC',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },

  floodLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: FLOOD_HEIGHT,
    backgroundColor: '#075985',
    borderTopWidth: 2,
    borderTopColor: '#38BDF8',
    zIndex: 3,
  },

  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    top: -11,
    left: 0,
    right: 0,
  },

  wave: {
    color: '#7DD3FC',
    fontSize: 18,
    fontWeight: '900',
  },

  floodLabel: {
    color: '#BAE6FD',
    fontSize: 8,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 25,
    letterSpacing: 1,
  },

  adaptiveBadge: {
    position: 'absolute',
    top: 65,
    right: 8,
    backgroundColor: '#082F49',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 8,
  },

  adaptiveText: {
    color: '#7DD3FC',
    fontSize: 8,
    fontWeight: '700',
    marginLeft: 4,
  },

  /* ==========================================================
     COUNTDOWN
  ========================================================== */

  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(2,6,23,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },

  countdownNumber: {
    color: '#FFFFFF',
    fontSize: 68,
    fontWeight: '900',
  },

  countdownText: {
    color: '#7DD3FC',
    fontSize: 12,
    marginTop: 4,
  },

  /* ==========================================================
     START
  ========================================================== */

  startOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(2,6,23,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 15,
  },

  startIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: '#082F49',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  startTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },

  startDescription: {
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 5,
    maxWidth: 270,
  },

  startButton: {
    marginTop: 15,
    backgroundColor: '#0284C7',
    borderRadius: 13,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 7,
    fontSize: 12,
  },

  /* ==========================================================
     RESCUE
  ========================================================== */

  rescueOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(2,6,23,0.98)',
    alignItems: 'center',
    padding: 14,
    zIndex: 30,
  },

  rescueIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: '#422006',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },

  rescueTitle: {
    color: '#FBBF24',
    fontSize: 18,
    fontWeight: '900',
  },

  rescueDescription: {
    color: '#CBD5E1',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 8,
  },

  rescueQuestion: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 9,
  },

  answerList: {
    width: '100%',
  },

  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 11,
    padding: 7,
    marginBottom: 6,
  },

  answerLetter: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  answerLetterText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  answerText: {
    color: '#E2E8F0',
    fontSize: 9,
    lineHeight: 14,
    flex: 1,
  },

  rescueLifeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  rescueLifeText: {
    color: '#94A3B8',
    fontSize: 8,
    marginLeft: 4,
  },

  /* ==========================================================
     END GAME
  ========================================================== */

  endGameOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(2,6,23,0.97)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    zIndex: 25,
  },

  resultIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  gameOverTitle: {
    color: '#F87171',
    fontSize: 21,
    fontWeight: '900',
  },

  successTitle: {
    color: '#34D399',
    fontSize: 21,
    fontWeight: '900',
  },

  gameOverText: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 5,
    maxWidth: 270,
  },

  finalScore: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 10,
  },

  retryButton: {
    marginTop: 13,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  claimRewardButton: {
    marginTop: 12,
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  claimDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 7,
    fontSize: 11,
  },

  rewardRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 24,
  },

  reward: {
    alignItems: 'center',
  },

  rewardValue: {
    color: '#FBBF24',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
  },

  rewardLabel: {
    color: '#94A3B8',
    fontSize: 8,
    marginTop: 1,
  },

  unlockNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#052E25',
    borderWidth: 1,
    borderColor: '#065F46',
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 9,
  },

  unlockNoticeText: {
    color: '#A7F3D0',
    fontSize: 8,
    marginLeft: 5,
    maxWidth: 190,
    textAlign: 'center',
  },

  /* ==========================================================
     HUD
  ========================================================== */

  gameHud: {
    marginTop: 9,
  },

  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  scoreLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  scoreValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  progressBackground: {
    height: 7,
    backgroundColor: '#1E293B',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 5,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 5,
  },

  algorithmPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    backgroundColor: '#081522',
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#12324A',
  },

  algorithmLabel: {
    color: '#64748B',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.6,
  },

  algorithmSub: {
    color: '#38BDF8',
    fontSize: 8,
    marginTop: 1,
    fontWeight: '700',
  },

  algorithmScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  algorithmValue: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '900',
  },

  /* ==========================================================
     CONTROLS
  ========================================================== */

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
  },

  controlsCompact: {
    marginTop: 7,
  },

  controlButton: {
    width: 78,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#172033',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },

  controlText: {
    color: '#CBD5E1',
    fontSize: 8,
    marginTop: 1,
    fontWeight: '700',
  },

  controlHint: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  controlHintText: {
    color: '#64748B',
    fontSize: 8,
    marginTop: 2,
  },

  /* ==========================================================
     BOTTOM BACK
  ========================================================== */

  bottomBackButton: {
    marginTop: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 11,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },

  bottomBackText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 6,
  },
});
