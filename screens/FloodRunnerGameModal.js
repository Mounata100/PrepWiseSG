// // // // // // // components/FloodRunnerGameModal.js
// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
// // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // import * as Haptics from 'expo-haptics';
// // // // // // import { Accelerometer } from 'expo-sensors';

// // // // // // const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // // // // // export default function FloodRunnerGameModal({ visible, onClose, onWin }) {
// // // // // //   const GAME_WIDTH = SCREEN_WIDTH - 64;
// // // // // //   const PLAYER_SIZE = 30;
  
// // // // // //   const [playerPositionX, setPlayerPositionX] = useState(GAME_WIDTH / 2 - PLAYER_SIZE / 2);
// // // // // //   const [debrisY, setDebrisY] = useState(0);
// // // // // //   const [debrisX, setDebrisX] = useState(Math.random() * (GAME_WIDTH - 20));
// // // // // //   const [score, setScore] = useState(0);
// // // // // //   const [gameOver, setGameOver] = useState(false);
// // // // // //   const [hasWon, setHasWon] = useState(false);

// // // // // //   useEffect(() => {
// // // // // //     let subscription;
// // // // // //     if (visible && !gameOver && !hasWon) {
// // // // // //       Accelerometer.setUpdateInterval(30);
// // // // // //       subscription = Accelerometer.addListener(data => {
// // // // // //         setPlayerPositionX(prevX => {
// // // // // //           let nextX = prevX + data.x * 18;
// // // // // //           if (nextX < 0) return 0;
// // // // // //           if (nextX > GAME_WIDTH - PLAYER_SIZE) return GAME_WIDTH - PLAYER_SIZE;
// // // // // //           return nextX;
// // // // // //         });
// // // // // //       });
// // // // // //     }
// // // // // //     return () => subscription && subscription.remove();
// // // // // //   }, [visible, gameOver, hasWon]);

// // // // // //   useEffect(() => {
// // // // // //     let gameInterval;
// // // // // //     if (visible && !gameOver && !hasWon) {
// // // // // //       gameInterval = setInterval(() => {
// // // // // //         setDebrisY(prevY => {
// // // // // //           if (prevY > 260) {
// // // // // //             setScore(s => {
// // // // // //               const newScore = s + 10;
// // // // // //               if (newScore >= 50) {
// // // // // //                 setHasWon(true);
// // // // // //                 Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
// // // // // //               }
// // // // // //               return newScore;
// // // // // //             });
// // // // // //             setDebrisX(Math.random() * (GAME_WIDTH - 20));
// // // // // //             return 0;
// // // // // //           }
// // // // // //           return prevY + 12;
// // // // // //         });
// // // // // //       }, 30);
// // // // // //     }
// // // // // //     return () => clearInterval(gameInterval);
// // // // // //   }, [visible, gameOver, hasWon, debrisX]);

// // // // // //   useEffect(() => {
// // // // // //     if (debrisY > 210 && debrisY < 250) {
// // // // // //       const playerCenter = playerPositionX + PLAYER_SIZE / 2;
// // // // // //       const debrisCenter = debrisX + 10;
// // // // // //       if (Math.abs(playerCenter - debrisCenter) < 22) {
// // // // // //         setGameOver(true);
// // // // // //         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
// // // // // //       }
// // // // // //     }
// // // // // //   }, [debrisY, playerPositionX, debrisX]);

// // // // // //   const restartGame = () => {
// // // // // //     setScore(0);
// // // // // //     setDebrisY(0);
// // // // // //     setGameOver(false);
// // // // // //     setHasWon(false);
// // // // // //     setPlayerPositionX(GAME_WIDTH / 2 - PLAYER_SIZE / 2);
// // // // // //   };

// // // // // //   return (
// // // // // //     <Modal visible={visible} animationType="slide" transparent={true}>
// // // // // //       <View style={styles.modalOverlay}>
// // // // // //         <View style={[styles.modalContentCard, { height: 480 }]}>
// // // // // //           <View style={styles.modalHeader}>
// // // // // //             <Text style={styles.modalTitle}>Flash Flood Evacuation Drill</Text>
// // // // // //             <TouchableOpacity onPress={onClose}>
// // // // // //               <Ionicons name="close-circle" size={26} color="#64748B" />
// // // // // //             </TouchableOpacity>
// // // // // //           </View>
// // // // // //           <Text style={{ color: '#94A3B8', fontSize: 12, marginBottom: 12 }}>
// // // // // //             Tilt your phone physically left/right to steer your responder to safety!
// // // // // //           </Text>

// // // // // //           <View style={[styles.gameCanvas, { width: GAME_WIDTH }]}>
// // // // // //             <View style={[styles.playerNode, { left: playerPositionX }]}>
// // // // // //               <Ionicons name="walk" size={24} color="black" />
// // // // // //               <Ionicons name="walk-outline" size={24} color="black" />
// // // // // //               <Ionicons name="fitness-outline" size={24} color="black" />
// // // // // //             </View>

// // // // // //             {!gameOver && !hasWon && (
// // // // // //               <View style={[styles.debrisNode, { left: debrisX, top: debrisY }]}>
// // // // // //                 <Ionicons name="warning" size={20} color="#EF4444" />
// // // // // //               </View>
// // // // // //             )}

// // // // // //             <View style={styles.shelterLine}>
// // // // // //               <Text style={styles.shelterLineText}>SCDF SAFE ELEVATED SHELTER AREA</Text>
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           <View style={styles.gameHud}>
// // // // // //             <Text style={{ color: '#FFF', fontWeight: '800' }}>Evacuation Score: {score} / 50</Text>
// // // // // //           </View>

// // // // // //           {gameOver && (
// // // // // //             <View style={styles.endGameOverlay}>
// // // // // //               <Text style={{ color: '#EF4444', fontWeight: '900', fontSize: 18 }}>Trapped by Water!</Text>
// // // // // //               <TouchableOpacity style={styles.retryBtn} onPress={restartGame}>
// // // // // //                 <Text style={{ color: '#FFF', fontWeight: '800' }}>Retry Drill</Text>
// // // // // //               </TouchableOpacity>
// // // // // //             </View>
// // // // // //           )}

// // // // // //           {hasWon && (
// // // // // //             <View style={styles.endGameOverlay}>
// // // // // //               <Text style={{ color: '#10B981', fontWeight: '900', fontSize: 18 }}>Reached High Ground!</Text>
// // // // // //               <TouchableOpacity 
// // // // // //                 style={styles.claimRewardBtn} 
// // // // // //                 onPress={() => {
// // // // // //                   onWin({ xp: 100, coins: 25 });
// // // // // //                   onClose();
// // // // // //                 }}
// // // // // //               >
// // // // // //                 <Text style={styles.claimRewardText}>Claim +100 XP & +25 Coins</Text>
// // // // // //               </TouchableOpacity>
// // // // // //             </View>
// // // // // //           )}
// // // // // //         </View>
// // // // // //       </View>
// // // // // //     </Modal>
// // // // // //   );
// // // // // // }

// // // // // // const styles = StyleSheet.create({
// // // // // //   modalOverlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 },
// // // // // //   modalContentCard: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 20, padding: 20, width: '100%' },
// // // // // //   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
// // // // // //   modalTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
// // // // // //   gameCanvas: { height: 260, backgroundColor: '#020617', borderRadius: 12, borderWidth: 1, borderColor: '#1E293B', position: 'relative', overflow: 'hidden' },
// // // // // //   playerNode: { position: 'absolute', bottom: 10 },
// // // // // //   debrisNode: { position: 'absolute' },
// // // // // //   shelterLine: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#10B98120', paddingVertical: 4, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#10B981' },
// // // // // //   shelterLineText: { color: '#10B981', fontSize: 8, fontWeight: '900' },
// // // // // //   gameHud: { marginTop: 12, alignItems: 'center' },
// // // // // //   endGameOverlay: { position: 'absolute', top: 120, left: 20, right: 20, backgroundColor: '#0F172ACC', padding: 20, borderRadius: 16, alignItems: 'center' },
// // // // // //   retryBtn: { backgroundColor: '#EF4444', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginTop: 10 },
// // // // // //   claimRewardBtn: { backgroundColor: '#10B981', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', marginTop: 10 },
// // // // // //   claimRewardText: { color: '#FFF', fontWeight: '900', fontSize: 13 }
// // // // // // });




// // // // // // components/FloodRunnerGameModal.js

// // // // // import React, { useEffect, useState } from 'react';
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

// // // // // const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// // // // // export default function FloodRunnerGameModal({
// // // // //   visible,
// // // // //   onClose,
// // // // //   onWin,
// // // // // }) {
// // // // //   // Keep the game safely inside the modal.
// // // // //   const GAME_WIDTH = Math.min(SCREEN_WIDTH - 72, 420);
// // // // //   const GAME_HEIGHT = Math.min(SCREEN_HEIGHT * 0.42, 320);

// // // // //   const PLAYER_SIZE = 34;
// // // // //   const DEBRIS_SIZE = 28;

// // // // //   const [playerPositionX, setPlayerPositionX] = useState(
// // // // //     GAME_WIDTH / 2 - PLAYER_SIZE / 2
// // // // //   );

// // // // //   const [debrisY, setDebrisY] = useState(0);

// // // // //   const [debrisX, setDebrisX] = useState(
// // // // //     Math.random() * (GAME_WIDTH - DEBRIS_SIZE)
// // // // //   );

// // // // //   const [score, setScore] = useState(0);
// // // // //   const [gameOver, setGameOver] = useState(false);
// // // // //   const [hasWon, setHasWon] = useState(false);

// // // // //   /*
// // // // //    * ---------------------------------------------------------
// // // // //    * RESET WHEN OPENING
// // // // //    * ---------------------------------------------------------
// // // // //    */

// // // // //   useEffect(() => {
// // // // //     if (visible) {
// // // // //       setScore(0);
// // // // //       setDebrisY(0);
// // // // //       setDebrisX(
// // // // //         Math.random() * (GAME_WIDTH - DEBRIS_SIZE)
// // // // //       );
// // // // //       setPlayerPositionX(
// // // // //         GAME_WIDTH / 2 - PLAYER_SIZE / 2
// // // // //       );
// // // // //       setGameOver(false);
// // // // //       setHasWon(false);
// // // // //     }
// // // // //   }, [visible]);

// // // // //   /*
// // // // //    * ---------------------------------------------------------
// // // // //    * ACCELEROMETER
// // // // //    * ---------------------------------------------------------
// // // // //    */

// // // // //   useEffect(() => {
// // // // //     let subscription;

// // // // //     if (visible && !gameOver && !hasWon) {
// // // // //       Accelerometer.setUpdateInterval(30);

// // // // //       subscription = Accelerometer.addListener((data) => {
// // // // //         setPlayerPositionX((prevX) => {
// // // // //           // Tilt left/right.
// // // // //           //
// // // // //           // Depending on phone orientation, you may need
// // // // //           // to change data.x to -data.x.

// // // // //           let nextX = prevX + data.x * 18;

// // // // //           if (nextX < 0) {
// // // // //             nextX = 0;
// // // // //           }

// // // // //           if (nextX > GAME_WIDTH - PLAYER_SIZE) {
// // // // //             nextX = GAME_WIDTH - PLAYER_SIZE;
// // // // //           }

// // // // //           return nextX;
// // // // //         });
// // // // //       });
// // // // //     }

// // // // //     return () => {
// // // // //       if (subscription) {
// // // // //         subscription.remove();
// // // // //       }
// // // // //     };
// // // // //   }, [visible, gameOver, hasWon]);

// // // // //   /*
// // // // //    * ---------------------------------------------------------
// // // // //    * DEBRIS MOVEMENT
// // // // //    * ---------------------------------------------------------
// // // // //    */

// // // // //   useEffect(() => {
// // // // //     if (!visible || gameOver || hasWon) {
// // // // //       return;
// // // // //     }

// // // // //     const gameInterval = setInterval(() => {
// // // // //       setDebrisY((previousY) => {
// // // // //         const nextY = previousY + 8;

// // // // //         // Debris reached bottom.
// // // // //         if (nextY > GAME_HEIGHT - 40) {
// // // // //           setScore((previousScore) => {
// // // // //             const newScore = previousScore + 10;

// // // // //             if (newScore >= 50) {
// // // // //               setHasWon(true);

// // // // //               Haptics.notificationAsync(
// // // // //                 Haptics.NotificationFeedbackType.Success
// // // // //               );
// // // // //             }

// // // // //             return newScore;
// // // // //           });

// // // // //           setDebrisX(
// // // // //             Math.random() * (GAME_WIDTH - DEBRIS_SIZE)
// // // // //           );

// // // // //           return 0;
// // // // //         }

// // // // //         return nextY;
// // // // //       });
// // // // //     }, 40);

// // // // //     return () => clearInterval(gameInterval);
// // // // //   }, [visible, gameOver, hasWon, GAME_WIDTH, GAME_HEIGHT]);

// // // // //   /*
// // // // //    * ---------------------------------------------------------
// // // // //    * COLLISION
// // // // //    * ---------------------------------------------------------
// // // // //    */

// // // // //   useEffect(() => {
// // // // //     if (gameOver || hasWon) {
// // // // //       return;
// // // // //     }

// // // // //     const playerCenter =
// // // // //       playerPositionX + PLAYER_SIZE / 2;

// // // // //     const debrisCenter =
// // // // //       debrisX + DEBRIS_SIZE / 2;

// // // // //     const horizontalDistance =
// // // // //       Math.abs(playerCenter - debrisCenter);

// // // // //     const playerBottom = GAME_HEIGHT - 10;

// // // // //     const debrisBottom =
// // // // //       debrisY + DEBRIS_SIZE;

// // // // //     // Collision zone near the player.
// // // // //     if (
// // // // //       debrisBottom >= playerBottom - PLAYER_SIZE &&
// // // // //       debrisY <= playerBottom &&
// // // // //       horizontalDistance < 28
// // // // //     ) {
// // // // //       setGameOver(true);

// // // // //       Haptics.impactAsync(
// // // // //         Haptics.ImpactFeedbackStyle.Heavy
// // // // //       );
// // // // //     }
// // // // //   }, [
// // // // //     debrisY,
// // // // //     debrisX,
// // // // //     playerPositionX,
// // // // //     gameOver,
// // // // //     hasWon,
// // // // //     GAME_HEIGHT,
// // // // //   ]);

// // // // //   /*
// // // // //    * ---------------------------------------------------------
// // // // //    * RESTART
// // // // //    * ---------------------------------------------------------
// // // // //    */

// // // // //   const restartGame = () => {
// // // // //     setScore(0);
// // // // //     setDebrisY(0);

// // // // //     setDebrisX(
// // // // //       Math.random() * (GAME_WIDTH - DEBRIS_SIZE)
// // // // //     );

// // // // //     setPlayerPositionX(
// // // // //       GAME_WIDTH / 2 - PLAYER_SIZE / 2
// // // // //     );

// // // // //     setGameOver(false);
// // // // //     setHasWon(false);
// // // // //   };

// // // // //   /*
// // // // //    * ---------------------------------------------------------
// // // // //    * RENDER
// // // // //    * ---------------------------------------------------------
// // // // //    */

// // // // //   return (
// // // // //     <Modal
// // // // //       visible={visible}
// // // // //       animationType="slide"
// // // // //       transparent
// // // // //       onRequestClose={onClose}
// // // // //     >
// // // // //       <View style={styles.modalOverlay}>

// // // // //         <View
// // // // //           style={[
// // // // //             styles.modalContentCard,
// // // // //             {
// // // // //               width: Math.min(SCREEN_WIDTH - 24, 480),
// // // // //             },
// // // // //           ]}
// // // // //         >

// // // // //           {/* HEADER */}

// // // // //           <View style={styles.modalHeader}>
// // // // //             <View style={{ flex: 1 }}>
// // // // //               <Text style={styles.modalTitle}>
// // // // //                 Flash Flood Evacuation Drill
// // // // //               </Text>

// // // // //               <Text style={styles.modalSubtitle}>
// // // // //                 Reach high ground while avoiding flood debris.
// // // // //               </Text>
// // // // //             </View>

// // // // //             <TouchableOpacity
// // // // //               onPress={onClose}
// // // // //               style={styles.closeButton}
// // // // //             >
// // // // //               <Ionicons
// // // // //                 name="close-circle"
// // // // //                 size={28}
// // // // //                 color="#64748B"
// // // // //               />
// // // // //             </TouchableOpacity>
// // // // //           </View>

// // // // //           {/* INSTRUCTIONS */}

// // // // //           <View style={styles.instructionBox}>
// // // // //             <Ionicons
// // // // //               name="phone-portrait-outline"
// // // // //               size={18}
// // // // //               color="#38BDF8"
// // // // //             />

// // // // //             <Text style={styles.instructionText}>
// // // // //               Tilt your phone left and right to move the responder.
// // // // //               Avoid falling debris and reach 50 points.
// // // // //             </Text>
// // // // //           </View>

// // // // //           {/* GAME */}

// // // // //           <View
// // // // //             style={[
// // // // //               styles.gameCanvas,
// // // // //               {
// // // // //                 width: GAME_WIDTH,
// // // // //                 height: GAME_HEIGHT,
// // // // //               },
// // // // //             ]}
// // // // //           >

// // // // //             {/* WATER */}

// // // // //             <View style={styles.waterLayer} />

// // // // //             {/* SHELTER */}

// // // // //             <View style={styles.shelterLine}>
// // // // //               <Ionicons
// // // // //                 name="shield-checkmark"
// // // // //                 size={14}
// // // // //                 color="#34D399"
// // // // //               />

// // // // //               <Text style={styles.shelterLineText}>
// // // // //                 SAFE ELEVATED SHELTER
// // // // //               </Text>
// // // // //             </View>

// // // // //             {/* DEBRIS */}

// // // // //             {!gameOver && !hasWon && (
// // // // //               <View
// // // // //                 style={[
// // // // //                   styles.debrisNode,
// // // // //                   {
// // // // //                     left: debrisX,
// // // // //                     top: debrisY,
// // // // //                     width: DEBRIS_SIZE,
// // // // //                     height: DEBRIS_SIZE,
// // // // //                   },
// // // // //                 ]}
// // // // //               >
// // // // //                 <View style={styles.debrisCircle}>
// // // // //                   <Ionicons
// // // // //                     name="warning"
// // // // //                     size={18}
// // // // //                     color="#FFFFFF"
// // // // //                   />
// // // // //                 </View>
// // // // //               </View>
// // // // //             )}

// // // // //             {/* PLAYER */}

// // // // //             <View
// // // // //               style={[
// // // // //                 styles.playerNode,
// // // // //                 {
// // // // //                   left: playerPositionX,
// // // // //                   bottom: 12,
// // // // //                   width: PLAYER_SIZE,
// // // // //                   height: PLAYER_SIZE,
// // // // //                 },
// // // // //               ]}
// // // // //             >
// // // // //               <View style={styles.playerCircle}>
// // // // //                 <Ionicons
// // // // //                   name="person"
// // // // //                   size={21}
// // // // //                   color="#020617"
// // // // //                 />
// // // // //               </View>
// // // // //             </View>

// // // // //             {/* GAME OVER */}

// // // // //             {gameOver && (
// // // // //               <View style={styles.endGameOverlay}>

// // // // //                 <Ionicons
// // // // //                   name="warning"
// // // // //                   size={38}
// // // // //                   color="#EF4444"
// // // // //                 />

// // // // //                 <Text style={styles.gameOverTitle}>
// // // // //                   Trapped by Water!
// // // // //                 </Text>

// // // // //                 <Text style={styles.gameOverText}>
// // // // //                   Avoid the debris and try again.
// // // // //                 </Text>

// // // // //                 <TouchableOpacity
// // // // //                   style={styles.retryBtn}
// // // // //                   onPress={restartGame}
// // // // //                 >
// // // // //                   <Ionicons
// // // // //                     name="refresh"
// // // // //                     size={16}
// // // // //                     color="#FFFFFF"
// // // // //                   />

// // // // //                   <Text style={styles.retryText}>
// // // // //                     Retry Drill
// // // // //                   </Text>
// // // // //                 </TouchableOpacity>

// // // // //               </View>
// // // // //             )}

// // // // //             {/* WIN */}

// // // // //             {hasWon && (
// // // // //               <View style={styles.endGameOverlay}>

// // // // //                 <Ionicons
// // // // //                   name="checkmark-circle"
// // // // //                   size={42}
// // // // //                   color="#34D399"
// // // // //                 />

// // // // //                 <Text style={styles.winTitle}>
// // // // //                   Reached High Ground!
// // // // //                 </Text>

// // // // //                 <Text style={styles.gameOverText}>
// // // // //                   You successfully completed the evacuation drill.
// // // // //                 </Text>

// // // // //                 <TouchableOpacity
// // // // //                   style={styles.claimRewardBtn}
// // // // //                   onPress={() => {
// // // // //                     onWin({
// // // // //                       xp: 100,
// // // // //                       coins: 25,
// // // // //                     });

// // // // //                     onClose();
// // // // //                   }}
// // // // //                 >
// // // // //                   <Text style={styles.claimRewardText}>
// // // // //                     Claim +100 XP & +25 Coins
// // // // //                   </Text>
// // // // //                 </TouchableOpacity>

// // // // //               </View>
// // // // //             )}

// // // // //           </View>

// // // // //           {/* HUD */}

// // // // //           <View style={styles.gameHud}>

// // // // //             <View style={styles.scoreBox}>
// // // // //               <Ionicons
// // // // //                 name="trophy"
// // // // //                 size={16}
// // // // //                 color="#FBBF24"
// // // // //               />

// // // // //               <Text style={styles.scoreText}>
// // // // //                 {score} / 50
// // // // //               </Text>
// // // // //             </View>

// // // // //             <Text style={styles.scoreLabel}>
// // // // //               EVACUATION SCORE
// // // // //             </Text>

// // // // //           </View>

// // // // //         </View>

// // // // //       </View>
// // // // //     </Modal>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({

// // // // //   modalOverlay: {
// // // // //     flex: 1,
// // // // //     backgroundColor: 'rgba(2, 6, 23, 0.88)',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     padding: 12,
// // // // //   },

// // // // //   modalContentCard: {
// // // // //     backgroundColor: '#0F172A',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#1E293B',
// // // // //     borderRadius: 20,
// // // // //     padding: 16,
// // // // //     maxHeight: '92%',
// // // // //   },

// // // // //   modalHeader: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'flex-start',
// // // // //     marginBottom: 10,
// // // // //   },

// // // // //   modalTitle: {
// // // // //     color: '#FFFFFF',
// // // // //     fontSize: 17,
// // // // //     fontWeight: '900',
// // // // //   },

// // // // //   modalSubtitle: {
// // // // //     color: '#64748B',
// // // // //     fontSize: 11,
// // // // //     marginTop: 3,
// // // // //   },

// // // // //   closeButton: {
// // // // //     marginLeft: 10,
// // // // //   },

// // // // //   instructionBox: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#082F49',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#075985',
// // // // //     borderRadius: 10,
// // // // //     padding: 9,
// // // // //     marginBottom: 12,
// // // // //     gap: 8,
// // // // //   },

// // // // //   instructionText: {
// // // // //     flex: 1,
// // // // //     color: '#BAE6FD',
// // // // //     fontSize: 10,
// // // // //     lineHeight: 15,
// // // // //   },

// // // // //   gameCanvas: {
// // // // //     backgroundColor: '#020617',
// // // // //     borderRadius: 14,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#1E293B',
// // // // //     position: 'relative',
// // // // //     overflow: 'hidden',
// // // // //   },

// // // // //   waterLayer: {
// // // // //     position: 'absolute',
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     bottom: 0,
// // // // //     height: '32%',
// // // // //     backgroundColor: '#082F49',
// // // // //     opacity: 0.75,
// // // // //   },

// // // // //   shelterLine: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     backgroundColor: '#064E3B',
// // // // //     paddingVertical: 7,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     flexDirection: 'row',
// // // // //     gap: 6,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#10B981',
// // // // //   },

// // // // //   shelterLineText: {
// // // // //     color: '#34D399',
// // // // //     fontSize: 9,
// // // // //     fontWeight: '900',
// // // // //     letterSpacing: 0.5,
// // // // //   },

// // // // //   playerNode: {
// // // // //     position: 'absolute',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },

// // // // //   playerCircle: {
// // // // //     width: 34,
// // // // //     height: 34,
// // // // //     borderRadius: 17,
// // // // //     backgroundColor: '#38BDF8',
// // // // //     borderWidth: 2,
// // // // //     borderColor: '#FFFFFF',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },

// // // // //   debrisNode: {
// // // // //     position: 'absolute',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },

// // // // //   debrisCircle: {
// // // // //     width: 28,
// // // // //     height: 28,
// // // // //     borderRadius: 14,
// // // // //     backgroundColor: '#EF4444',
// // // // //     borderWidth: 2,
// // // // //     borderColor: '#FCA5A5',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },

// // // // //   gameHud: {
// // // // //     marginTop: 10,
// // // // //     alignItems: 'center',
// // // // //   },

// // // // //   scoreBox: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 6,
// // // // //   },

// // // // //   scoreText: {
// // // // //     color: '#FFFFFF',
// // // // //     fontSize: 20,
// // // // //     fontWeight: '900',
// // // // //   },

// // // // //   scoreLabel: {
// // // // //     color: '#64748B',
// // // // //     fontSize: 8,
// // // // //     fontWeight: '900',
// // // // //     letterSpacing: 1,
// // // // //     marginTop: 2,
// // // // //   },

// // // // //   endGameOverlay: {
// // // // //     position: 'absolute',
// // // // //     top: 50,
// // // // //     bottom: 20,
// // // // //     left: 16,
// // // // //     right: 16,
// // // // //     backgroundColor: 'rgba(15, 23, 42, 0.96)',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#334155',
// // // // //     borderRadius: 18,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     padding: 20,
// // // // //   },

// // // // //   gameOverTitle: {
// // // // //     color: '#EF4444',
// // // // //     fontWeight: '900',
// // // // //     fontSize: 19,
// // // // //     marginTop: 8,
// // // // //   },

// // // // //   winTitle: {
// // // // //     color: '#34D399',
// // // // //     fontWeight: '900',
// // // // //     fontSize: 19,
// // // // //     marginTop: 8,
// // // // //   },

// // // // //   gameOverText: {
// // // // //     color: '#94A3B8',
// // // // //     fontSize: 11,
// // // // //     textAlign: 'center',
// // // // //     marginTop: 5,
// // // // //   },

// // // // //   retryBtn: {
// // // // //     backgroundColor: '#EF4444',
// // // // //     paddingVertical: 10,
// // // // //     paddingHorizontal: 18,
// // // // //     borderRadius: 10,
// // // // //     marginTop: 14,
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 6,
// // // // //   },

// // // // //   retryText: {
// // // // //     color: '#FFFFFF',
// // // // //     fontWeight: '800',
// // // // //     fontSize: 12,
// // // // //   },

// // // // //   claimRewardBtn: {
// // // // //     backgroundColor: '#10B981',
// // // // //     paddingVertical: 12,
// // // // //     paddingHorizontal: 20,
// // // // //     borderRadius: 12,
// // // // //     alignItems: 'center',
// // // // //     marginTop: 14,
// // // // //   },

// // // // //   claimRewardText: {
// // // // //     color: '#FFFFFF',
// // // // //     fontWeight: '900',
// // // // //     fontSize: 13,
// // // // //   },
// // // // // });



// // // // // components/FloodRunnerGameModal.js
// // // // import React, { useState, useEffect, useRef } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   StyleSheet,
// // // //   TouchableOpacity,
// // // //   Modal,
// // // //   Dimensions,
// // // // } from 'react-native';
// // // // import { Ionicons } from '@expo/vector-icons';
// // // // import * as Haptics from 'expo-haptics';
// // // // import { Accelerometer } from 'expo-sensors';

// // // // const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // // // export default function FloodRunnerGameModal({
// // // //   visible,
// // // //   onClose,
// // // //   onWin,
// // // // }) {
// // // //   const GAME_WIDTH = Math.min(SCREEN_WIDTH - 64, 360);
// // // //   const GAME_HEIGHT = 300;

// // // //   const PLAYER_SIZE = 36;
// // // //   const DEBRIS_SIZE = 28;

// // // //   const [playerPositionX, setPlayerPositionX] = useState(
// // // //     GAME_WIDTH / 2 - PLAYER_SIZE / 2
// // // //   );

// // // //   const [debrisY, setDebrisY] = useState(-30);
// // // //   const [debrisX, setDebrisX] = useState(
// // // //     Math.random() * (GAME_WIDTH - DEBRIS_SIZE)
// // // //   );

// // // //   const [score, setScore] = useState(0);
// // // //   const [gameOver, setGameOver] = useState(false);
// // // //   const [hasWon, setHasWon] = useState(false);
// // // //   const [sensorAvailable, setSensorAvailable] = useState(false);

// // // //   const movementRef = useRef(0);

// // // //   /*
// // // //    * ---------------------------------------------------------
// // // //    * ACCELEROMETER
// // // //    * ---------------------------------------------------------
// // // //    */

// // // //   useEffect(() => {
// // // //     let subscription;

// // // //     const setupAccelerometer = async () => {
// // // //       if (!visible || gameOver || hasWon) {
// // // //         return;
// // // //       }

// // // //       try {
// // // //         const available = await Accelerometer.isAvailableAsync();

// // // //         if (!available) {
// // // //           setSensorAvailable(false);
// // // //           return;
// // // //         }

// // // //         setSensorAvailable(true);

// // // //         Accelerometer.setUpdateInterval(50);

// // // //         subscription = Accelerometer.addListener((data) => {
// // // //           /*
// // // //            * data.x normally changes when the phone is tilted
// // // //            * left/right.
// // // //            *
// // // //            * Increase this value if movement feels too slow.
// // // //            */
// // // //           movementRef.current = data.x;
// // // //         });
// // // //       } catch (error) {
// // // //         console.log('Accelerometer error:', error);
// // // //         setSensorAvailable(false);
// // // //       }
// // // //     };

// // // //     setupAccelerometer();

// // // //     return () => {
// // // //       if (subscription) {
// // // //         subscription.remove();
// // // //       }
// // // //     };
// // // //   }, [visible, gameOver, hasWon]);

// // // //   /*
// // // //    * ---------------------------------------------------------
// // // //    * PLAYER MOVEMENT
// // // //    * ---------------------------------------------------------
// // // //    */

// // // //   useEffect(() => {
// // // //     if (!visible || gameOver || hasWon) {
// // // //       return;
// // // //     }

// // // //     const movementInterval = setInterval(() => {
// // // //       const tilt = movementRef.current;

// // // //       if (Math.abs(tilt) < 0.05) {
// // // //         return;
// // // //       }

// // // //       setPlayerPositionX((prevX) => {
// // // //         const speed = 12;

// // // //         let nextX = prevX + tilt * speed;

// // // //         nextX = Math.max(
// // // //           0,
// // // //           Math.min(
// // // //             GAME_WIDTH - PLAYER_SIZE,
// // // //             nextX
// // // //           )
// // // //         );

// // // //         return nextX;
// // // //       });
// // // //     }, 50);

// // // //     return () => clearInterval(movementInterval);
// // // //   }, [visible, gameOver, hasWon]);

// // // //   /*
// // // //    * ---------------------------------------------------------
// // // //    * TOUCH MOVEMENT
// // // //    * ---------------------------------------------------------
// // // //    */

// // // //   const movePlayer = (direction) => {
// // // //     if (gameOver || hasWon) {
// // // //       return;
// // // //     }

// // // //     setPlayerPositionX((prevX) => {
// // // //       const amount = 35;

// // // //       let nextX =
// // // //         direction === 'left'
// // // //           ? prevX - amount
// // // //           : prevX + amount;

// // // //       nextX = Math.max(
// // // //         0,
// // // //         Math.min(
// // // //           GAME_WIDTH - PLAYER_SIZE,
// // // //           nextX
// // // //         )
// // // //       );

// // // //       return nextX;
// // // //     });

// // // //     Haptics.impactAsync(
// // // //       Haptics.ImpactFeedbackStyle.Light
// // // //     );
// // // //   };

// // // //   /*
// // // //    * ---------------------------------------------------------
// // // //    * DEBRIS / GAME LOOP
// // // //    * ---------------------------------------------------------
// // // //    */

// // // //   useEffect(() => {
// // // //     if (!visible || gameOver || hasWon) {
// // // //       return;
// // // //     }

// // // //     const gameInterval = setInterval(() => {
// // // //       setDebrisY((prevY) => {
// // // //         const nextY = prevY + 6;

// // // //         /*
// // // //          * Debris reached bottom.
// // // //          */
// // // //         if (nextY > GAME_HEIGHT) {
// // // //           setScore((previousScore) => {
// // // //             const newScore = previousScore + 10;

// // // //             if (newScore >= 50) {
// // // //               setHasWon(true);

// // // //               Haptics.notificationAsync(
// // // //                 Haptics.NotificationFeedbackType.Success
// // // //               );
// // // //             }

// // // //             return newScore;
// // // //           });

// // // //           setDebrisX(
// // // //             Math.random() *
// // // //               (GAME_WIDTH - DEBRIS_SIZE)
// // // //           );

// // // //           return -30;
// // // //         }

// // // //         return nextY;
// // // //       });
// // // //     }, 40);

// // // //     return () => clearInterval(gameInterval);
// // // //   }, [
// // // //     visible,
// // // //     gameOver,
// // // //     hasWon,
// // // //     GAME_WIDTH,
// // // //   ]);

// // // //   /*
// // // //    * ---------------------------------------------------------
// // // //    * COLLISION
// // // //    * ---------------------------------------------------------
// // // //    */

// // // //   useEffect(() => {
// // // //     if (gameOver || hasWon) {
// // // //       return;
// // // //     }

// // // //     const playerLeft = playerPositionX;
// // // //     const playerRight =
// // // //       playerPositionX + PLAYER_SIZE;

// // // //     const playerTop =
// // // //       GAME_HEIGHT - PLAYER_SIZE - 10;

// // // //     const playerBottom =
// // // //       playerTop + PLAYER_SIZE;

// // // //     const debrisLeft = debrisX;
// // // //     const debrisRight =
// // // //       debrisX + DEBRIS_SIZE;

// // // //     const debrisTop = debrisY;
// // // //     const debrisBottom =
// // // //       debrisY + DEBRIS_SIZE;

// // // //     const collision =
// // // //       playerLeft < debrisRight &&
// // // //       playerRight > debrisLeft &&
// // // //       playerTop < debrisBottom &&
// // // //       playerBottom > debrisTop;

// // // //     if (collision) {
// // // //       setGameOver(true);

// // // //       Haptics.impactAsync(
// // // //         Haptics.ImpactFeedbackStyle.Heavy
// // // //       );
// // // //     }
// // // //   }, [
// // // //     debrisY,
// // // //     debrisX,
// // // //     playerPositionX,
// // // //     gameOver,
// // // //     hasWon,
// // // //   ]);

// // // //   /*
// // // //    * ---------------------------------------------------------
// // // //    * RESTART
// // // //    * ---------------------------------------------------------
// // // //    */

// // // //   const restartGame = () => {
// // // //     setScore(0);
// // // //     setDebrisY(-30);
// // // //     setDebrisX(
// // // //       Math.random() *
// // // //         (GAME_WIDTH - DEBRIS_SIZE)
// // // //     );
// // // //     setGameOver(false);
// // // //     setHasWon(false);
// // // //     setPlayerPositionX(
// // // //       GAME_WIDTH / 2 -
// // // //         PLAYER_SIZE / 2
// // // //     );
// // // //     movementRef.current = 0;
// // // //   };

// // // //   /*
// // // //    * ---------------------------------------------------------
// // // //    * RENDER
// // // //    * ---------------------------------------------------------
// // // //    */

// // // //   return (
// // // //     <Modal
// // // //       visible={visible}
// // // //       animationType="slide"
// // // //       transparent
// // // //       onRequestClose={onClose}
// // // //     >
// // // //       <View style={styles.modalOverlay}>
// // // //         <View
// // // //           style={[
// // // //             styles.modalContentCard,
// // // //             {
// // // //               width: GAME_WIDTH + 40,
// // // //             },
// // // //           ]}
// // // //         >
// // // //           {/* HEADER */}

// // // //           <View style={styles.modalHeader}>
// // // //             <Text style={styles.modalTitle}>
// // // //               Flash Flood Evacuation Drill
// // // //             </Text>

// // // //             <TouchableOpacity onPress={onClose}>
// // // //               <Ionicons
// // // //                 name="close-circle"
// // // //                 size={28}
// // // //                 color="#64748B"
// // // //               />
// // // //             </TouchableOpacity>
// // // //           </View>

// // // //           <Text style={styles.instructions}>
// // // //             Tilt your phone left/right or use the
// // // //             buttons below to move your responder.
// // // //           </Text>

// // // //           {/* SENSOR STATUS */}

// // // //           <View style={styles.sensorStatus}>
// // // //             <Ionicons
// // // //               name={
// // // //                 sensorAvailable
// // // //                   ? 'phone-portrait-outline'
// // // //                   : 'hand-left-outline'
// // // //               }
// // // //               size={14}
// // // //               color={
// // // //                 sensorAvailable
// // // //                   ? '#34D399'
// // // //                   : '#FBBF24'
// // // //               }
// // // //             />

// // // //             <Text
// // // //               style={[
// // // //                 styles.sensorText,
// // // //                 {
// // // //                   color: sensorAvailable
// // // //                     ? '#34D399'
// // // //                     : '#FBBF24',
// // // //                 },
// // // //               ]}
// // // //             >
// // // //               {sensorAvailable
// // // //                 ? 'Tilt controls active'
// // // //                 : 'Use touch controls'}
// // // //             </Text>
// // // //           </View>

// // // //           {/* GAME */}

// // // //           <View
// // // //             style={[
// // // //               styles.gameCanvas,
// // // //               {
// // // //                 width: GAME_WIDTH,
// // // //                 height: GAME_HEIGHT,
// // // //               },
// // // //             ]}
// // // //           >
// // // //             {/* SHELTER */}

// // // //             <View style={styles.shelterLine}>
// // // //               <Ionicons
// // // //                 name="shield-checkmark"
// // // //                 size={14}
// // // //                 color="#34D399"
// // // //               />

// // // //               <Text style={styles.shelterLineText}>
// // // //                 SAFE ELEVATED SHELTER
// // // //               </Text>
// // // //             </View>

// // // //             {/* WATER */}

// // // //             <View style={styles.waterLayer}>
// // // //               <Text style={styles.waterText}>
// // // //                 FLOOD ZONE
// // // //               </Text>
// // // //             </View>

// // // //             {/* DEBRIS */}

// // // //             {!gameOver && !hasWon && (
// // // //               <View
// // // //                 style={[
// // // //                   styles.debrisNode,
// // // //                   {
// // // //                     left: debrisX,
// // // //                     top: debrisY,
// // // //                   },
// // // //                 ]}
// // // //               >
// // // //                 <Ionicons
// // // //                   name="warning"
// // // //                   size={22}
// // // //                   color="#EF4444"
// // // //                 />
// // // //               </View>
// // // //             )}

// // // //             {/* PLAYER */}

// // // //             {!gameOver && !hasWon && (
// // // //               <View
// // // //                 style={[
// // // //                   styles.playerNode,
// // // //                   {
// // // //                     left: playerPositionX,
// // // //                     bottom: 10,
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

// // // //             {/* END SCREEN */}

// // // //             {(gameOver || hasWon) && (
// // // //               <View style={styles.endGameOverlay}>
// // // //                 {gameOver && (
// // // //                   <>
// // // //                     <Ionicons
// // // //                       name="water"
// // // //                       size={36}
// // // //                       color="#EF4444"
// // // //                     />

// // // //                     <Text style={styles.gameOverTitle}>
// // // //                       Trapped by Water!
// // // //                     </Text>

// // // //                     <Text style={styles.gameOverText}>
// // // //                       Avoid the falling debris and
// // // //                       reach the safe area.
// // // //                     </Text>

// // // //                     <TouchableOpacity
// // // //                       style={styles.retryBtn}
// // // //                       onPress={restartGame}
// // // //                     >
// // // //                       <Text style={styles.buttonText}>
// // // //                         Retry Drill
// // // //                       </Text>
// // // //                     </TouchableOpacity>
// // // //                   </>
// // // //                 )}

// // // //                 {hasWon && (
// // // //                   <>
// // // //                     <Ionicons
// // // //                       name="shield-checkmark"
// // // //                       size={40}
// // // //                       color="#10B981"
// // // //                     />

// // // //                     <Text
// // // //                       style={styles.successTitle}
// // // //                     >
// // // //                       Reached High Ground!
// // // //                     </Text>

// // // //                     <Text
// // // //                       style={styles.gameOverText}
// // // //                     >
// // // //                       Excellent evacuation response.
// // // //                     </Text>

// // // //                     <TouchableOpacity
// // // //                       style={styles.claimRewardBtn}
// // // //                       onPress={() => {
// // // //                         onWin({
// // // //                           xp: 100,
// // // //                           coins: 25,
// // // //                         });

// // // //                         onClose();
// // // //                       }}
// // // //                     >
// // // //                       <Text
// // // //                         style={styles.buttonText}
// // // //                       >
// // // //                         Claim +100 XP & +25 Coins
// // // //                       </Text>
// // // //                     </TouchableOpacity>
// // // //                   </>
// // // //                 )}
// // // //               </View>
// // // //             )}
// // // //           </View>

// // // //           {/* SCORE */}

// // // //           <View style={styles.gameHud}>
// // // //             <Text style={styles.scoreText}>
// // // //               EVACUATION SCORE
// // // //             </Text>

// // // //             <Text style={styles.scoreValue}>
// // // //               {score} / 50
// // // //             </Text>
// // // //           </View>

// // // //           {/* CONTROLS */}

// // // //           {!gameOver && !hasWon && (
// // // //             <View style={styles.controls}>
// // // //               <TouchableOpacity
// // // //                 style={styles.controlButton}
// // // //                 onPress={() =>
// // // //                   movePlayer('left')
// // // //                 }
// // // //                 activeOpacity={0.7}
// // // //               >
// // // //                 <Ionicons
// // // //                   name="arrow-back"
// // // //                   size={28}
// // // //                   color="#FFFFFF"
// // // //                 />

// // // //                 <Text style={styles.controlText}>
// // // //                   LEFT
// // // //                 </Text>
// // // //               </TouchableOpacity>

// // // //               <View style={styles.controlHint}>
// // // //                 <Ionicons
// // // //                   name="phone-portrait-outline"
// // // //                   size={20}
// // // //                   color="#38BDF8"
// // // //                 />

// // // //                 <Text style={styles.controlHintText}>
// // // //                   TILT
// // // //                 </Text>
// // // //               </View>

// // // //               <TouchableOpacity
// // // //                 style={styles.controlButton}
// // // //                 onPress={() =>
// // // //                   movePlayer('right')
// // // //                 }
// // // //                 activeOpacity={0.7}
// // // //               >
// // // //                 <Ionicons
// // // //                   name="arrow-forward"
// // // //                   size={28}
// // // //                   color="#FFFFFF"
// // // //                 />

// // // //                 <Text style={styles.controlText}>
// // // //                   RIGHT
// // // //                 </Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           )}
// // // //         </View>
// // // //       </View>
// // // //     </Modal>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   modalOverlay: {
// // // //     flex: 1,
// // // //     backgroundColor: 'rgba(2, 6, 23, 0.9)',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     padding: 16,
// // // //   },

// // // //   modalContentCard: {
// // // //     backgroundColor: '#0F172A',
// // // //     borderWidth: 1,
// // // //     borderColor: '#1E293B',
// // // //     borderRadius: 20,
// // // //     padding: 20,
// // // //     maxWidth: 400,
// // // //   },

// // // //   modalHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: 8,
// // // //   },

// // // //   modalTitle: {
// // // //     color: '#FFFFFF',
// // // //     fontSize: 17,
// // // //     fontWeight: '900',
// // // //     flex: 1,
// // // //     marginRight: 10,
// // // //   },

// // // //   instructions: {
// // // //     color: '#94A3B8',
// // // //     fontSize: 12,
// // // //     lineHeight: 18,
// // // //     marginBottom: 10,
// // // //   },

// // // //   sensorStatus: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     alignSelf: 'flex-start',
// // // //     gap: 6,
// // // //     marginBottom: 10,
// // // //     backgroundColor: '#020617',
// // // //     paddingHorizontal: 9,
// // // //     paddingVertical: 5,
// // // //     borderRadius: 8,
// // // //   },

// // // //   sensorText: {
// // // //     fontSize: 10,
// // // //     fontWeight: '800',
// // // //   },

// // // //   gameCanvas: {
// // // //     backgroundColor: '#020617',
// // // //     borderRadius: 14,
// // // //     borderWidth: 1,
// // // //     borderColor: '#1E293B',
// // // //     position: 'relative',
// // // //     overflow: 'hidden',
// // // //   },

// // // //   waterLayer: {
// // // //     position: 'absolute',
// // // //     bottom: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     height: 55,
// // // //     backgroundColor: '#0C4A6E',
// // // //     opacity: 0.35,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },

// // // //   waterText: {
// // // //     color: '#38BDF8',
// // // //     fontSize: 9,
// // // //     fontWeight: '900',
// // // //     letterSpacing: 2,
// // // //   },

// // // //   shelterLine: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     height: 38,
// // // //     backgroundColor: '#064E3B',
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#10B981',
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     gap: 6,
// // // //     zIndex: 2,
// // // //   },

// // // //   shelterLineText: {
// // // //     color: '#34D399',
// // // //     fontSize: 9,
// // // //     fontWeight: '900',
// // // //   },

// // // //   playerNode: {
// // // //     position: 'absolute',
// // // //     width: 36,
// // // //     height: 36,
// // // //     borderRadius: 18,
// // // //     backgroundColor: '#2563EB',
// // // //     borderWidth: 2,
// // // //     borderColor: '#60A5FA',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     zIndex: 3,
// // // //   },

// // // //   debrisNode: {
// // // //     position: 'absolute',
// // // //     width: 28,
// // // //     height: 28,
// // // //     borderRadius: 14,
// // // //     backgroundColor: '#450A0A',
// // // //     borderWidth: 1,
// // // //     borderColor: '#EF4444',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     zIndex: 3,
// // // //   },

// // // //   gameHud: {
// // // //     marginTop: 12,
// // // //     alignItems: 'center',
// // // //   },

// // // //   scoreText: {
// // // //     color: '#64748B',
// // // //     fontSize: 9,
// // // //     fontWeight: '900',
// // // //     letterSpacing: 1,
// // // //   },

// // // //   scoreValue: {
// // // //     color: '#FFFFFF',
// // // //     fontSize: 22,
// // // //     fontWeight: '900',
// // // //     marginTop: 2,
// // // //   },

// // // //   controls: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     marginTop: 14,
// // // //     gap: 10,
// // // //   },

// // // //   controlButton: {
// // // //     width: 90,
// // // //     height: 58,
// // // //     backgroundColor: '#1E3A8A',
// // // //     borderWidth: 1,
// // // //     borderColor: '#3B82F6',
// // // //     borderRadius: 14,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },

// // // //   controlText: {
// // // //     color: '#BFDBFE',
// // // //     fontSize: 8,
// // // //     fontWeight: '900',
// // // //     marginTop: 2,
// // // //   },

// // // //   controlHint: {
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     opacity: 0.8,
// // // //   },

// // // //   controlHintText: {
// // // //     color: '#38BDF8',
// // // //     fontSize: 8,
// // // //     fontWeight: '900',
// // // //     marginTop: 2,
// // // //   },

// // // //   endGameOverlay: {
// // // //     position: 'absolute',
// // // //     top: 55,
// // // //     bottom: 20,
// // // //     left: 20,
// // // //     right: 20,
// // // //     backgroundColor: 'rgba(15, 23, 42, 0.96)',
// // // //     borderWidth: 1,
// // // //     borderColor: '#334155',
// // // //     borderRadius: 18,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     padding: 20,
// // // //     zIndex: 10,
// // // //   },

// // // //   gameOverTitle: {
// // // //     color: '#EF4444',
// // // //     fontWeight: '900',
// // // //     fontSize: 19,
// // // //     marginTop: 8,
// // // //   },

// // // //   successTitle: {
// // // //     color: '#10B981',
// // // //     fontWeight: '900',
// // // //     fontSize: 19,
// // // //     marginTop: 8,
// // // //   },

// // // //   gameOverText: {
// // // //     color: '#94A3B8',
// // // //     fontSize: 11,
// // // //     textAlign: 'center',
// // // //     lineHeight: 17,
// // // //     marginTop: 5,
// // // //   },

// // // //   retryBtn: {
// // // //     backgroundColor: '#EF4444',
// // // //     paddingVertical: 11,
// // // //     paddingHorizontal: 20,
// // // //     borderRadius: 10,
// // // //     marginTop: 14,
// // // //   },

// // // //   claimRewardBtn: {
// // // //     backgroundColor: '#10B981',
// // // //     paddingVertical: 12,
// // // //     paddingHorizontal: 20,
// // // //     borderRadius: 12,
// // // //     marginTop: 14,
// // // //   },

// // // //   buttonText: {
// // // //     color: '#FFFFFF',
// // // //     fontWeight: '900',
// // // //     fontSize: 12,
// // // //   },
// // // // });

// // // // /**
// // // //  * ┌─────────────────────────┐
// // // // │ 🏢  ELEVATED SHELTER    │
// // // // │     🟢 SAFE ZONE        │
// // // // ├─────────────────────────┤
// // // // │ ~~~~~~~ 🌊 ~~~~~~~~~~~~ │
// // // // │   🚗       ⚡           │
// // // // │ ~~~~~~  ⚠️  ~~~~~~~~~~ │
// // // // │        🧍               │
// // // // │ 🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊 │
// // // // │     FLOOD ZONE          │
// // // // └─────────────────────────┘

// // // //  */



// // // import React, { useEffect, useMemo, useRef, useState } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   Modal,
// // //   Dimensions,
// // //   ScrollView,
// // // } from 'react-native';

// // // import { Ionicons } from '@expo/vector-icons';
// // // import * as Haptics from 'expo-haptics';
// // // import { Accelerometer } from 'expo-sensors';

// // // // Replace this import with the location of your translation hook.
// // // // Example if you use react-i18next:
// // // // import { useTranslation } from 'react-i18next';
// // // import { useTranslation } from 'react-i18next';

// // // const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
// // //   Dimensions.get('window');

// // // /*
// // // |--------------------------------------------------------------------------
// // // | LEVEL CONFIGURATION
// // // |--------------------------------------------------------------------------
// // // |
// // // | Three levels:
// // // |
// // // | Level 1 = Easy
// // // | Level 2 = Moderate
// // // | Level 3 = Advanced
// // // |
// // // | The core game logic remains the same.
// // // |--------------------------------------------------------------------------
// // // */

// // // const LEVEL_CONFIG = {
// // //   1: {
// // //     nameKey: 'games.floodRunner.levels.easy',
// // //     targetScore: 50,

// // //     debrisSpeed: 6,
// // //     gameTick: 45,

// // //     spawnCount: 1,

// // //     playerSpeed: 35,

// // //     reward: {
// // //       xp: 100,
// // //       coins: 25,
// // //     },
// // //   },

// // //   2: {
// // //     nameKey: 'games.floodRunner.levels.moderate',
// // //     targetScore: 75,

// // //     debrisSpeed: 8,
// // //     gameTick: 40,

// // //     spawnCount: 2,

// // //     playerSpeed: 38,

// // //     reward: {
// // //       xp: 150,
// // //       coins: 40,
// // //     },
// // //   },

// // //   3: {
// // //     nameKey: 'games.floodRunner.levels.advanced',
// // //     targetScore: 100,

// // //     debrisSpeed: 10,
// // //     gameTick: 35,

// // //     spawnCount: 3,

// // //     playerSpeed: 42,

// // //     reward: {
// // //       xp: 200,
// // //       coins: 60,
// // //     },
// // //   },
// // // };

// // // const PLAYER_SIZE = 36;
// // // const DEBRIS_SIZE = 28;

// // // const STARTING_DEBRIS_Y = -40;

// // // export default function FloodRunnerGameModal({
// // //   visible,
// // //   onClose,
// // //   onWin,
// // //   level = 1,
// // // }) {
// // //   const { t } = useTranslation();

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | SAFE LEVEL
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const selectedLevel = Math.min(
// // //     3,
// // //     Math.max(1, Number(level) || 1)
// // //   );

// // //   const config = LEVEL_CONFIG[selectedLevel];

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | GAME DIMENSIONS
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const GAME_WIDTH = Math.min(
// // //     SCREEN_WIDTH - 48,
// // //     360
// // //   );

// // //   const GAME_HEIGHT = Math.min(
// // //     SCREEN_HEIGHT * 0.43,
// // //     330
// // //   );

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | GAME STATE
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const [gameStarted, setGameStarted] =
// // //     useState(false);

// // //   const [countdown, setCountdown] =
// // //     useState(null);

// // //   const [playerPositionX, setPlayerPositionX] =
// // //     useState(
// // //       GAME_WIDTH / 2 -
// // //         PLAYER_SIZE / 2
// // //     );

// // //   /*
// // //    * Multiple debris objects.
// // //    *
// // //    * Level 1 = 1
// // //    * Level 2 = 2
// // //    * Level 3 = 3
// // //    */
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

// // //   const movementRef =
// // //     useRef(0);

// // //   const countdownTimerRef =
// // //     useRef(null);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | CREATE DEBRIS
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const createDebris = () => {
// // //     return Array.from(
// // //       {
// // //         length: config.spawnCount,
// // //       },
// // //       (_, index) => ({
// // //         id: `${Date.now()}-${index}-${Math.random()}`,

// // //         x:
// // //           Math.random() *
// // //           (GAME_WIDTH - DEBRIS_SIZE),

// // //         y:
// // //           STARTING_DEBRIS_Y -
// // //           index * 100 -
// // //           Math.random() * 80,
// // //       })
// // //     );
// // //   };

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | RESET GAME
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const resetGame = () => {
// // //     setScore(0);

// // //     setGameOver(false);

// // //     setHasWon(false);

// // //     setGameStarted(false);

// // //     setCountdown(null);

// // //     setPlayerPositionX(
// // //       GAME_WIDTH / 2 -
// // //         PLAYER_SIZE / 2
// // //     );

// // //     setDebris([]);

// // //     movementRef.current = 0;
// // //   };

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | START GAME
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const startGame = () => {
// // //     if (gameStarted || countdown !== null) {
// // //       return;
// // //     }

// // //     setCountdown(3);

// // //     let count = 3;

// // //     countdownTimerRef.current =
// // //       setInterval(() => {
// // //         count -= 1;

// // //         if (count <= 0) {
// // //           clearInterval(
// // //             countdownTimerRef.current
// // //           );

// // //           countdownTimerRef.current = null;

// // //           setCountdown(null);

// // //           setGameStarted(true);

// // //           setScore(0);

// // //           setGameOver(false);

// // //           setHasWon(false);

// // //           setPlayerPositionX(
// // //             GAME_WIDTH / 2 -
// // //               PLAYER_SIZE / 2
// // //           );

// // //           setDebris(createDebris());

// // //           Haptics.notificationAsync(
// // //             Haptics.NotificationFeedbackType.Success
// // //           );

// // //           return;
// // //         }

// // //         setCountdown(count);
// // //       }, 700);
// // //   };

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | CLEAN COUNTDOWN
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   useEffect(() => {
// // //     return () => {
// // //       if (countdownTimerRef.current) {
// // //         clearInterval(
// // //           countdownTimerRef.current
// // //         );
// // //       }
// // //     };
// // //   }, []);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | ACCELEROMETER
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   useEffect(() => {
// // //     let subscription;

// // //     const setupAccelerometer = async () => {
// // //       if (
// // //         !visible ||
// // //         !gameStarted ||
// // //         gameOver ||
// // //         hasWon
// // //       ) {
// // //         return;
// // //       }

// // //       try {
// // //         const available =
// // //           await Accelerometer.isAvailableAsync();

// // //         if (!available) {
// // //           setSensorAvailable(false);
// // //           return;
// // //         }

// // //         setSensorAvailable(true);

// // //         Accelerometer.setUpdateInterval(50);

// // //         subscription =
// // //           Accelerometer.addListener(
// // //             (data) => {
// // //               movementRef.current =
// // //                 data.x;
// // //             }
// // //           );
// // //       } catch (error) {
// // //         console.log(
// // //           'Accelerometer error:',
// // //           error
// // //         );

// // //         setSensorAvailable(false);
// // //       }
// // //     };

// // //     setupAccelerometer();

// // //     return () => {
// // //       if (subscription) {
// // //         subscription.remove();
// // //       }
// // //     };
// // //   }, [
// // //     visible,
// // //     gameStarted,
// // //     gameOver,
// // //     hasWon,
// // //   ]);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | ACCELEROMETER MOVEMENT
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   useEffect(() => {
// // //     if (
// // //       !visible ||
// // //       !gameStarted ||
// // //       gameOver ||
// // //       hasWon
// // //     ) {
// // //       return;
// // //     }

// // //     const movementInterval =
// // //       setInterval(() => {
// // //         const tilt =
// // //           movementRef.current;

// // //         if (Math.abs(tilt) < 0.05) {
// // //           return;
// // //         }

// // //         setPlayerPositionX(
// // //           (previousX) => {
// // //             let nextX =
// // //               previousX +
// // //               tilt * 12;

// // //             nextX = Math.max(
// // //               0,
// // //               Math.min(
// // //                 GAME_WIDTH -
// // //                   PLAYER_SIZE,
// // //                 nextX
// // //               )
// // //             );

// // //             return nextX;
// // //           }
// // //         );
// // //       }, 50);

// // //     return () =>
// // //       clearInterval(
// // //         movementInterval
// // //       );
// // //   }, [
// // //     visible,
// // //     gameStarted,
// // //     gameOver,
// // //     hasWon,
// // //     GAME_WIDTH,
// // //   ]);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | TOUCH MOVEMENT
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const movePlayer = (direction) => {
// // //     if (
// // //       !gameStarted ||
// // //       gameOver ||
// // //       hasWon
// // //     ) {
// // //       return;
// // //     }

// // //     setPlayerPositionX(
// // //       (previousX) => {
// // //         const amount =
// // //           config.playerSpeed;

// // //         let nextX =
// // //           direction === 'left'
// // //             ? previousX - amount
// // //             : previousX + amount;

// // //         nextX = Math.max(
// // //           0,
// // //           Math.min(
// // //             GAME_WIDTH -
// // //               PLAYER_SIZE,
// // //             nextX
// // //           )
// // //         );

// // //         return nextX;
// // //       }
// // //     );

// // //     Haptics.impactAsync(
// // //       Haptics.ImpactFeedbackStyle.Light
// // //     );
// // //   };

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | GAME LOOP
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   useEffect(() => {
// // //     if (
// // //       !visible ||
// // //       !gameStarted ||
// // //       gameOver ||
// // //       hasWon
// // //     ) {
// // //       return;
// // //     }

// // //     const gameInterval =
// // //       setInterval(() => {
// // //         setDebris(
// // //           (previousDebris) => {
// // //             let pointsEarned = 0;

// // //             const updatedDebris =
// // //               previousDebris.map(
// // //                 (item) => ({
// // //                   ...item,
// // //                   y:
// // //                     item.y +
// // //                     config.debrisSpeed,
// // //                 })
// // //               );

// // //             const activeDebris =
// // //               updatedDebris.filter(
// // //                 (item) => {
// // //                   if (
// // //                     item.y >
// // //                     GAME_HEIGHT
// // //                   ) {
// // //                     pointsEarned += 10;

// // //                     return false;
// // //                   }

// // //                   return true;
// // //                 }
// // //               );

// // //             /*
// // //              * A debris object reached the bottom.
// // //              * Give the player points and respawn it.
// // //              */
// // //             if (pointsEarned > 0) {
// // //               setScore(
// // //                 (previousScore) => {
// // //                   const newScore =
// // //                     Math.min(
// // //                       config.targetScore,
// // //                       previousScore +
// // //                         pointsEarned
// // //                     );

// // //                   if (
// // //                     newScore >=
// // //                     config.targetScore
// // //                   ) {
// // //                     setHasWon(true);

// // //                     Haptics.notificationAsync(
// // //                       Haptics.NotificationFeedbackType
// // //                         .Success
// // //                     );
// // //                   }

// // //                   return newScore;
// // //                 }
// // //               );

// // //               /*
// // //                * Keep the correct number
// // //                * of hazards on screen.
// // //                */
// // //               while (
// // //                 activeDebris.length <
// // //                 config.spawnCount
// // //               ) {
// // //                 activeDebris.push({
// // //                   id: `${Date.now()}-${Math.random()}`,

// // //                   x:
// // //                     Math.random() *
// // //                     (GAME_WIDTH -
// // //                       DEBRIS_SIZE),

// // //                   y:
// // //                     STARTING_DEBRIS_Y -
// // //                     Math.random() * 80,
// // //                 });
// // //               }
// // //             }

// // //             return activeDebris;
// // //           }
// // //         );
// // //       }, config.gameTick);

// // //     return () =>
// // //       clearInterval(
// // //         gameInterval
// // //       );
// // //   }, [
// // //     visible,
// // //     gameStarted,
// // //     gameOver,
// // //     hasWon,
// // //     GAME_WIDTH,
// // //     GAME_HEIGHT,
// // //     config,
// // //   ]);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | COLLISION
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   useEffect(() => {
// // //     if (
// // //       !gameStarted ||
// // //       gameOver ||
// // //       hasWon
// // //     ) {
// // //       return;
// // //     }

// // //     const playerLeft =
// // //       playerPositionX;

// // //     const playerRight =
// // //       playerPositionX +
// // //       PLAYER_SIZE;

// // //     const playerTop =
// // //       GAME_HEIGHT -
// // //       PLAYER_SIZE -
// // //       14;

// // //     const playerBottom =
// // //       playerTop +
// // //       PLAYER_SIZE;

// // //     const collision =
// // //       debris.some((item) => {
// // //         const debrisLeft =
// // //           item.x;

// // //         const debrisRight =
// // //           item.x +
// // //           DEBRIS_SIZE;

// // //         const debrisTop =
// // //           item.y;

// // //         const debrisBottom =
// // //           item.y +
// // //           DEBRIS_SIZE;

// // //         return (
// // //           playerLeft <
// // //             debrisRight &&
// // //           playerRight >
// // //             debrisLeft &&
// // //           playerTop <
// // //             debrisBottom &&
// // //           playerBottom >
// // //             debrisTop
// // //         );
// // //       });

// // //     if (collision) {
// // //       setGameOver(true);

// // //       Haptics.impactAsync(
// // //         Haptics.ImpactFeedbackStyle.Heavy
// // //       );
// // //     }
// // //   }, [
// // //     debris,
// // //     playerPositionX,
// // //     gameStarted,
// // //     gameOver,
// // //     hasWon,
// // //     GAME_HEIGHT,
// // //   ]);

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | CLOSE / RESET
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const handleClose = () => {
// // //     resetGame();
// // //     onClose();
// // //   };

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | CLAIM REWARD
// // //   |--------------------------------------------------------------------------
// // //   */

// // //   const handleClaimReward = () => {
// // //     onWin({
// // //       xp: config.reward.xp,
// // //       coins: config.reward.coins,
// // //     });

// // //     handleClose();
// // //   };

// // //   /*
// // //   |--------------------------------------------------------------------------
// // //   | GAME PROGRESS
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
// // //     <Modal
// // //       visible={visible}
// // //       animationType="slide"
// // //       transparent
// // //       onRequestClose={handleClose}
// // //     >
// // //       <View style={styles.modalOverlay}>
// // //         <View
// // //           style={[
// // //             styles.modalContentCard,
// // //             {
// // //               width:
// // //                 GAME_WIDTH + 32,
// // //             },
// // //           ]}
// // //         >
// // //           {/* -------------------------------------------------------
// // //               HEADER
// // //           -------------------------------------------------------- */}

// // //           <View style={styles.modalHeader}>
// // //             <View style={styles.headerTitleArea}>
// // //               <View style={styles.headerIcon}>
// // //                 <Ionicons
// // //                   name="water"
// // //                   size={20}
// // //                   color="#38BDF8"
// // //                 />
// // //               </View>

// // //               <View style={styles.headerTextArea}>
// // //                 <Text
// // //                   style={styles.modalTitle}
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.title'
// // //                   )}
// // //                 </Text>

// // //                 <Text
// // //                   style={styles.levelLabel}
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.level',
// // //                     {
// // //                       level:
// // //                         selectedLevel,
// // //                     }
// // //                   )}{' '}
// // //                   •{' '}
// // //                   {t(
// // //                     config.nameKey
// // //                   )}
// // //                 </Text>
// // //               </View>
// // //             </View>

// // //             <TouchableOpacity
// // //               onPress={handleClose}
// // //               accessibilityRole="button"
// // //               accessibilityLabel={t(
// // //                 'common.close'
// // //               )}
// // //             >
// // //               <Ionicons
// // //                 name="close-circle"
// // //                 size={30}
// // //                 color="#64748B"
// // //               />
// // //             </TouchableOpacity>
// // //           </View>

// // //           {/* -------------------------------------------------------
// // //               OBJECTIVE
// // //           -------------------------------------------------------- */}

// // //           <View style={styles.objectiveCard}>
// // //             <View style={styles.objectiveIcon}>
// // //               <Ionicons
// // //                 name="flag"
// // //                 size={18}
// // //                 color="#34D399"
// // //               />
// // //             </View>

// // //             <View style={styles.objectiveTextArea}>
// // //               <Text
// // //                 style={styles.objectiveTitle}
// // //               >
// // //                 {t(
// // //                   'games.floodRunner.objective'
// // //                 )}
// // //               </Text>

// // //               <Text
// // //                 style={styles.objectiveText}
// // //               >
// // //                 {t(
// // //                   'games.floodRunner.objectiveDescription'
// // //                 )}
// // //               </Text>
// // //             </View>
// // //           </View>

// // //           {/* -------------------------------------------------------
// // //               HOW TO PLAY
// // //           -------------------------------------------------------- */}

// // //           {!gameStarted &&
// // //             !gameOver &&
// // //             !hasWon && (
// // //               <View
// // //                 style={
// // //                   styles.instructionsCard
// // //                 }
// // //               >
// // //                 <View
// // //                   style={
// // //                     styles.instructionsHeader
// // //                   }
// // //                 >
// // //                   <Ionicons
// // //                     name="help-circle"
// // //                     size={20}
// // //                     color="#FBBF24"
// // //                   />

// // //                   <Text
// // //                     style={
// // //                       styles.instructionsTitle
// // //                     }
// // //                   >
// // //                     {t(
// // //                       'games.floodRunner.howToPlay'
// // //                     )}
// // //                   </Text>
// // //                 </View>

// // //                 <InstructionRow
// // //                   icon="swap-horizontal"
// // //                   text={t(
// // //                     'games.floodRunner.instructions.move'
// // //                   )}
// // //                 />

// // //                 <InstructionRow
// // //                   icon="warning"
// // //                   text={t(
// // //                     'games.floodRunner.instructions.avoid'
// // //                   )}
// // //                 />

// // //                 <InstructionRow
// // //                   icon="water"
// // //                   text={t(
// // //                     'games.floodRunner.instructions.flood'
// // //                   )}
// // //                 />

// // //                 <InstructionRow
// // //                   icon="flag"
// // //                   text={t(
// // //                     'games.floodRunner.instructions.finish',
// // //                     {
// // //                       score:
// // //                         config.targetScore,
// // //                     }
// // //                   )}
// // //                 />
// // //               </View>
// // //             )}

// // //           {/* -------------------------------------------------------
// // //               SENSOR STATUS
// // //           -------------------------------------------------------- */}

// // //           {gameStarted &&
// // //             !gameOver &&
// // //             !hasWon && (
// // //               <View
// // //                 style={styles.sensorStatus}
// // //               >
// // //                 <Ionicons
// // //                   name={
// // //                     sensorAvailable
// // //                       ? 'phone-portrait-outline'
// // //                       : 'hand-left-outline'
// // //                   }
// // //                   size={15}
// // //                   color={
// // //                     sensorAvailable
// // //                       ? '#34D399'
// // //                       : '#FBBF24'
// // //                   }
// // //                 />

// // //                 <Text
// // //                   style={[
// // //                     styles.sensorText,
// // //                     {
// // //                       color:
// // //                         sensorAvailable
// // //                           ? '#34D399'
// // //                           : '#FBBF24',
// // //                     },
// // //                   ]}
// // //                 >
// // //                   {sensorAvailable
// // //                     ? t(
// // //                         'games.floodRunner.tiltActive'
// // //                       )
// // //                     : t(
// // //                         'games.floodRunner.touchActive'
// // //                       )}
// // //                 </Text>
// // //               </View>
// // //             )}

// // //           {/* -------------------------------------------------------
// // //               GAME CANVAS
// // //           -------------------------------------------------------- */}

// // //           <View
// // //             style={[
// // //               styles.gameCanvas,
// // //               {
// // //                 width: GAME_WIDTH,
// // //                 height: GAME_HEIGHT,
// // //               },
// // //             ]}
// // //           >
// // //             {/* SAFE ZONE */}

// // //             <View
// // //               style={styles.safeZone}
// // //             >
// // //               <View
// // //                 style={styles.safeZoneIcon}
// // //               >
// // //                 <Ionicons
// // //                   name="shield-checkmark"
// // //                   size={18}
// // //                   color="#34D399"
// // //                 />
// // //               </View>

// // //               <View>
// // //                 <Text
// // //                   style={
// // //                     styles.safeZoneTitle
// // //                   }
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.safeShelter'
// // //                   )}
// // //                 </Text>

// // //                 <Text
// // //                   style={
// // //                     styles.safeZoneSub
// // //                   }
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.highGround'
// // //                   )}
// // //                 </Text>
// // //               </View>
// // //             </View>

// // //             {/* DANGER FIELD */}

// // //             <View
// // //               style={styles.dangerField}
// // //             >
// // //               <View
// // //                 style={styles.routeLine}
// // //               />

// // //               <Text
// // //                 style={styles.dangerText}
// // //               >
// // //                 {t(
// // //                   'games.floodRunner.evacuationRoute'
// // //                 )}
// // //               </Text>
// // //             </View>

// // //             {/* DEBRIS */}

// // //             {gameStarted &&
// // //               !gameOver &&
// // //               !hasWon &&
// // //               debris.map((item) => (
// // //                 <View
// // //                   key={item.id}
// // //                   style={[
// // //                     styles.debrisNode,
// // //                     {
// // //                       left: item.x,
// // //                       top: item.y,
// // //                     },
// // //                   ]}
// // //                 >
// // //                   <Ionicons
// // //                     name="warning"
// // //                     size={20}
// // //                     color="#FCA5A5"
// // //                   />
// // //                 </View>
// // //               ))}

// // //             {/* PLAYER */}

// // //             {gameStarted &&
// // //               !gameOver &&
// // //               !hasWon && (
// // //                 <View
// // //                   style={[
// // //                     styles.playerNode,
// // //                     {
// // //                       left:
// // //                         playerPositionX,
// // //                       bottom: 72,
// // //                     },
// // //                   ]}
// // //                 >
// // //                   <Ionicons
// // //                     name="person"
// // //                     size={25}
// // //                     color="#FFFFFF"
// // //                   />
// // //                 </View>
// // //               )}

// // //             {/* FLOOD */}

// // //             <View
// // //               style={styles.floodLayer}
// // //             >
// // //               <View
// // //                 style={
// // //                   styles.waveContainer
// // //                 }
// // //               >
// // //                 {Array.from({
// // //                   length: 12,
// // //                 }).map((_, index) => (
// // //                   <Text
// // //                     key={index}
// // //                     style={
// // //                       styles.wave
// // //                     }
// // //                   >
// // //                     ~
// // //                   </Text>
// // //                 ))}
// // //               </View>

// // //               <Text
// // //                 style={styles.floodLabel}
// // //               >
// // //                 {t(
// // //                   'games.floodRunner.floodZone'
// // //                 )}
// // //               </Text>
// // //             </View>

// // //             {/* COUNTDOWN */}

// // //             {countdown !== null && (
// // //               <View
// // //                 style={
// // //                   styles.countdownOverlay
// // //                 }
// // //               >
// // //                 <Text
// // //                   style={
// // //                     styles.countdownNumber
// // //                   }
// // //                 >
// // //                   {countdown}
// // //                 </Text>

// // //                 <Text
// // //                   style={
// // //                     styles.countdownText
// // //                   }
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.getReady'
// // //                   )}
// // //                 </Text>
// // //               </View>
// // //             )}

// // //             {/* START SCREEN */}

// // //             {!gameStarted &&
// // //               countdown === null &&
// // //               !gameOver &&
// // //               !hasWon && (
// // //                 <View
// // //                   style={
// // //                     styles.startOverlay
// // //                   }
// // //                 >
// // //                   <View
// // //                     style={
// // //                       styles.startIcon
// // //                     }
// // //                   >
// // //                     <Ionicons
// // //                       name="walk"
// // //                       size={34}
// // //                       color="#38BDF8"
// // //                     />
// // //                   </View>

// // //                   <Text
// // //                     style={
// // //                       styles.startTitle
// // //                     }
// // //                   >
// // //                     {t(
// // //                       'games.floodRunner.ready'
// // //                     )}
// // //                   </Text>

// // //                   <Text
// // //                     style={
// // //                       styles.startDescription
// // //                     }
// // //                   >
// // //                     {t(
// // //                       'games.floodRunner.startDescription'
// // //                     )}
// // //                   </Text>

// // //                   <TouchableOpacity
// // //                     style={
// // //                       styles.startButton
// // //                     }
// // //                     onPress={startGame}
// // //                     activeOpacity={0.8}
// // //                   >
// // //                     <Ionicons
// // //                       name="play"
// // //                       size={18}
// // //                       color="#FFFFFF"
// // //                     />

// // //                     <Text
// // //                       style={
// // //                         styles.startButtonText
// // //                       }
// // //                     >
// // //                       {t(
// // //                         'games.floodRunner.start'
// // //                       )}
// // //                     </Text>
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               )}

// // //             {/* GAME OVER */}

// // //             {gameOver && (
// // //               <View
// // //                 style={
// // //                   styles.endGameOverlay
// // //                 }
// // //               >
// // //                 <View
// // //                   style={[
// // //                     styles.resultIcon,
// // //                     {
// // //                       backgroundColor:
// // //                         '#450A0A',
// // //                     },
// // //                   ]}
// // //                 >
// // //                   <Ionicons
// // //                     name="warning"
// // //                     size={34}
// // //                     color="#EF4444"
// // //                   />
// // //                 </View>

// // //                 <Text
// // //                   style={
// // //                     styles.gameOverTitle
// // //                   }
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.failed'
// // //                   )}
// // //                 </Text>

// // //                 <Text
// // //                   style={
// // //                     styles.gameOverText
// // //                   }
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.failedDescription'
// // //                   )}
// // //                 </Text>

// // //                 <Text
// // //                   style={
// // //                     styles.finalScore
// // //                   }
// // //                 >
// // //                   {score} /{' '}
// // //                   {config.targetScore}
// // //                 </Text>

// // //                 <TouchableOpacity
// // //                   style={
// // //                     styles.retryButton
// // //                   }
// // //                   onPress={startGame}
// // //                 >
// // //                   <Ionicons
// // //                     name="refresh"
// // //                     size={18}
// // //                     color="#FFFFFF"
// // //                   />

// // //                   <Text
// // //                     style={
// // //                       styles.buttonText
// // //                     }
// // //                   >
// // //                     {t(
// // //                       'games.floodRunner.retry'
// // //                     )}
// // //                   </Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             )}

// // //             {/* WIN */}

// // //             {hasWon && (
// // //               <View
// // //                 style={
// // //                   styles.endGameOverlay
// // //                 }
// // //               >
// // //                 <View
// // //                   style={[
// // //                     styles.resultIcon,
// // //                     {
// // //                       backgroundColor:
// // //                         '#064E3B',
// // //                     },
// // //                   ]}
// // //                 >
// // //                   <Ionicons
// // //                     name="shield-checkmark"
// // //                     size={36}
// // //                     color="#10B981"
// // //                   />
// // //                 </View>

// // //                 <Text
// // //                   style={
// // //                     styles.successTitle
// // //                   }
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.success'
// // //                   )}
// // //                 </Text>

// // //                 <Text
// // //                   style={
// // //                     styles.gameOverText
// // //                   }
// // //                 >
// // //                   {t(
// // //                     'games.floodRunner.successDescription'
// // //                   )}
// // //                 </Text>

// // //                 <View
// // //                   style={
// // //                     styles.rewardRow
// // //                   }
// // //                 >
// // //                   <Reward
// // //                     icon="flash"
// // //                     value={`+${config.reward.xp}`}
// // //                     label={t(
// // //                       'games.floodRunner.xp'
// // //                     )}
// // //                   />

// // //                   <Reward
// // //                     icon="cash"
// // //                     value={`+${config.reward.coins}`}
// // //                     label={t(
// // //                       'games.floodRunner.coins'
// // //                     )}
// // //                   />
// // //                 </View>

// // //                 <TouchableOpacity
// // //                   style={
// // //                     styles.claimRewardButton
// // //                   }
// // //                   onPress={
// // //                     handleClaimReward
// // //                   }
// // //                 >
// // //                   <Text
// // //                     style={
// // //                       styles.buttonText
// // //                     }
// // //                   >
// // //                     {t(
// // //                       'games.floodRunner.claimReward'
// // //                     )}
// // //                   </Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             )}
// // //           </View>

// // //           {/* -------------------------------------------------------
// // //               SCORE
// // //           -------------------------------------------------------- */}

// // //           <View style={styles.gameHud}>
// // //             <View
// // //               style={styles.scoreHeader}
// // //             >
// // //               <Text
// // //                 style={styles.scoreLabel}
// // //               >
// // //                 {t(
// // //                   'games.floodRunner.score'
// // //                 )}
// // //               </Text>

// // //               <Text
// // //                 style={styles.scoreValue}
// // //               >
// // //                 {score} /{' '}
// // //                 {config.targetScore}
// // //               </Text>
// // //             </View>

// // //             <View
// // //               style={styles.progressBackground}
// // //             >
// // //               <View
// // //                 style={[
// // //                   styles.progressFill,
// // //                   {
// // //                     width: `${progressPercentage}%`,
// // //                   },
// // //                 ]}
// // //               />
// // //             </View>
// // //           </View>

// // //           {/* -------------------------------------------------------
// // //               CONTROLS
// // //           -------------------------------------------------------- */}

// // //           {gameStarted &&
// // //             !gameOver &&
// // //             !hasWon && (
// // //               <View
// // //                 style={styles.controls}
// // //               >
// // //                 <TouchableOpacity
// // //                   style={
// // //                     styles.controlButton
// // //                   }
// // //                   onPress={() =>
// // //                     movePlayer('left')
// // //                   }
// // //                   activeOpacity={0.7}
// // //                 >
// // //                   <Ionicons
// // //                     name="arrow-back"
// // //                     size={24}
// // //                     color="#FFFFFF"
// // //                   />

// // //                   <Text
// // //                     style={
// // //                       styles.controlText
// // //                     }
// // //                     numberOfLines={2}
// // //                   >
// // //                     {t(
// // //                       'games.floodRunner.left'
// // //                     )}
// // //                   </Text>
// // //                 </TouchableOpacity>

// // //                 <View
// // //                   style={
// // //                     styles.controlHint
// // //                   }
// // //                 >
// // //                   <Ionicons
// // //                     name={
// // //                       sensorAvailable
// // //                         ? 'phone-portrait-outline'
// // //                         : 'hand-left-outline'
// // //                     }
// // //                     size={21}
// // //                     color="#38BDF8"
// // //                   />

// // //                   <Text
// // //                     style={
// // //                       styles.controlHintText
// // //                     }
// // //                     numberOfLines={2}
// // //                   >
// // //                     {sensorAvailable
// // //                       ? t(
// // //                           'games.floodRunner.tilt'
// // //                         )
// // //                       : t(
// // //                           'games.floodRunner.touch'
// // //                         )}
// // //                   </Text>
// // //                 </View>

// // //                 <TouchableOpacity
// // //                   style={
// // //                     styles.controlButton
// // //                   }
// // //                   onPress={() =>
// // //                     movePlayer('right')
// // //                   }
// // //                   activeOpacity={0.7}
// // //                 >
// // //                   <Ionicons
// // //                     name="arrow-forward"
// // //                     size={24}
// // //                     color="#FFFFFF"
// // //                   />

// // //                   <Text
// // //                     style={
// // //                       styles.controlText
// // //                     }
// // //                     numberOfLines={2}
// // //                   >
// // //                     {t(
// // //                       'games.floodRunner.right'
// // //                     )}
// // //                   </Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             )}
// // //         </View>
// // //       </View>
// // //     </Modal>
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
// // //     <View style={styles.instructionRow}>
// // //       <View style={styles.instructionIcon}>
// // //         <Ionicons
// // //           name={icon}
// // //           size={16}
// // //           color="#38BDF8"
// // //         />
// // //       </View>

// // //       <Text
// // //         style={styles.instructionText}
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
// // //     <View style={styles.reward}>
// // //       <Ionicons
// // //         name={icon}
// // //         size={18}
// // //         color="#FBBF24"
// // //       />

// // //       <Text style={styles.rewardValue}>
// // //         {value}
// // //       </Text>

// // //       <Text style={styles.rewardLabel}>
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
// // //   modalOverlay: {
// // //     flex: 1,
// // //     backgroundColor:
// // //       'rgba(2, 6, 23, 0.94)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     padding: 12,
// // //   },

// // //   modalContentCard: {
// // //     backgroundColor: '#0F172A',
// // //     borderWidth: 1,
// // //     borderColor: '#1E293B',
// // //     borderRadius: 22,
// // //     padding: 16,
// // //     maxWidth: 400,
// // //     maxHeight: '96%',
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
// // //     marginRight: 10,
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
// // //     padding: 11,
// // //     marginBottom: 10,
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
// // //     padding: 13,
// // //     marginBottom: 10,
// // //   },

// // //   instructionsHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
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
// // //     marginTop: 7,
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
// // //     lineHeight: 17,
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
// // //     height: 56,
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
// // //     top: 56,
// // //     bottom: 64,
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
// // //     height: 64,
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
// // //     top: 56,
// // //     bottom: 64,
// // //     left: 0,
// // //     right: 0,
// // //     backgroundColor:
// // //       'rgba(2, 6, 23, 0.94)',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     padding: 24,
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
// // //     top: 56,
// // //     bottom: 64,
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
// // //     top: 56,
// // //     bottom: 64,
// // //     left: 12,
// // //     right: 12,
// // //     backgroundColor:
// // //       'rgba(15, 23, 42, 0.97)',
// // //     borderWidth: 1,
// // //     borderColor: '#334155',
// // //     borderRadius: 18,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     padding: 20,
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
// // //     marginTop: 10,
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
// // //     marginTop: 11,
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
// //   useRef,
// //   useState,
// // } from 'react';

// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Modal,
// //   Dimensions,
// // } from 'react-native';

// // import { Ionicons } from '@expo/vector-icons';
// // import * as Haptics from 'expo-haptics';
// // import { Accelerometer } from 'expo-sensors';
// // import { useTranslation } from 'react-i18next';

// // const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
// //   Dimensions.get('window');

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

// // const PLAYER_SIZE = 36;
// // const DEBRIS_SIZE = 28;

// // const SAFE_ZONE_HEIGHT = 56;
// // const FLOOD_HEIGHT = 64;

// // const PLAYER_BOTTOM_OFFSET = 14;

// // const COLLISION_PADDING = 4;

// // /*
// // |--------------------------------------------------------------------------
// // | COMPONENT
// // |--------------------------------------------------------------------------
// // */

// // export default function FloodRunnerGameModal({
// //   visible,
// //   onClose =() => {},
// //   onWin = () => {},
// //   level = 1,
// // }) {
// //   const { t } = useTranslation();

// //   /*
// //   |--------------------------------------------------------------------------
// //   | SAFE LEVEL
// //   |--------------------------------------------------------------------------
// //   */

// //   const selectedLevel = Math.min(
// //     3,
// //     Math.max(1, Number(level) || 1)
// //   );

// //   const config = LEVEL_CONFIG[selectedLevel];

// //   /*
// //   |--------------------------------------------------------------------------
// //   | GAME DIMENSIONS
// //   |--------------------------------------------------------------------------
// //   */

// //   const GAME_WIDTH = Math.min(
// //     SCREEN_WIDTH - 48,
// //     360
// //   );

// //   const GAME_HEIGHT = Math.min(
// //     SCREEN_HEIGHT * 0.43,
// //     330
// //   );

// //   /*
// //   |--------------------------------------------------------------------------
// //   | REACT UI STATE
// //   |--------------------------------------------------------------------------
// //   */

// //   const [gameStarted, setGameStarted] =
// //     useState(false);

// //   const [countdown, setCountdown] =
// //     useState(null);

// //   const [playerPositionX, setPlayerPositionX] =
// //     useState(
// //       GAME_WIDTH / 2 -
// //         PLAYER_SIZE / 2
// //     );

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

// //   /*
// //   |--------------------------------------------------------------------------
// //   | GAME REFS
// //   |--------------------------------------------------------------------------
// //   |
// //   | The actual game state lives in refs.
// //   |
// //   | This prevents the game loop from being recreated
// //   | every time the player moves or debris changes.
// //   |
// //   */

// //   const playerXRef = useRef(
// //     GAME_WIDTH / 2 -
// //       PLAYER_SIZE / 2
// //   );

// //   const debrisRef = useRef([]);

// //   const scoreRef = useRef(0);

// //   const gameRunningRef = useRef(false);

// //   const gameOverRef = useRef(false);

// //   const hasWonRef = useRef(false);

// //   const movementRef = useRef(0);

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

// //   /*
// //   |--------------------------------------------------------------------------
// //   | HELPERS
// //   |--------------------------------------------------------------------------
// //   */

// //   const clampPlayerX = useCallback(
// //     (x) => {
// //       return Math.max(
// //         0,
// //         Math.min(
// //           GAME_WIDTH - PLAYER_SIZE,
// //           x
// //         )
// //       );
// //     },
// //     [GAME_WIDTH]
// //   );

// //   const createDebrisObject =
// //     useCallback(
// //       (y = -DEBRIS_SIZE) => {
// //         return {
// //           id: `${Date.now()}-${Math.random()}`,

// //           x:
// //             Math.random() *
// //             Math.max(
// //               1,
// //               GAME_WIDTH - DEBRIS_SIZE
// //             ),

// //           y,
// //         };
// //       },
// //       [GAME_WIDTH]
// //     );

// //   const createInitialDebris =
// //     useCallback(() => {
// //       const objects = [];

// //       for (
// //         let index = 0;
// //         index < config.spawnCount;
// //         index += 1
// //       ) {
// //         objects.push({
// //           id: `${Date.now()}-${index}-${Math.random()}`,

// //           x:
// //             Math.random() *
// //             Math.max(
// //               1,
// //               GAME_WIDTH - DEBRIS_SIZE
// //             ),

// //           y:
// //             -DEBRIS_SIZE -
// //             index * 105 -
// //             Math.random() * 70,
// //         });
// //       }

// //       return objects;
// //     }, [
// //       config.spawnCount,
// //       GAME_WIDTH,
// //     ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | RESET GAME
// //   |--------------------------------------------------------------------------
// //   */

// //   const resetGame = useCallback(() => {
// //     if (countdownTimerRef.current) {
// //       clearInterval(
// //         countdownTimerRef.current
// //       );

// //       countdownTimerRef.current = null;
// //     }

// //     if (animationFrameRef.current) {
// //       cancelAnimationFrame(
// //         animationFrameRef.current
// //       );

// //       animationFrameRef.current = null;
// //     }

// //     if (sensorSubscriptionRef.current) {
// //       sensorSubscriptionRef.current.remove();

// //       sensorSubscriptionRef.current = null;
// //     }

// //     const initialX =
// //       GAME_WIDTH / 2 -
// //       PLAYER_SIZE / 2;

// //     playerXRef.current = initialX;

// //     debrisRef.current = [];

// //     scoreRef.current = 0;

// //     movementRef.current = 0;

// //     gameRunningRef.current = false;

// //     gameOverRef.current = false;

// //     hasWonRef.current = false;

// //     lastFrameTimeRef.current = null;

// //     lastSpawnTimeRef.current = 0;

// //     setScore(0);

// //     setGameOver(false);

// //     setHasWon(false);

// //     setGameStarted(false);

// //     setCountdown(null);

// //     setPlayerPositionX(initialX);

// //     setDebris([]);
// //   }, [GAME_WIDTH]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | STOP GAME
// //   |--------------------------------------------------------------------------
// //   */

// //   const stopGameLoop = useCallback(() => {
// //     gameRunningRef.current = false;

// //     if (animationFrameRef.current) {
// //       cancelAnimationFrame(
// //         animationFrameRef.current
// //       );

// //       animationFrameRef.current = null;
// //     }

// //     lastFrameTimeRef.current = null;
// //   }, []);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | GAME OVER
// //   |--------------------------------------------------------------------------
// //   */

// //   const finishGame = useCallback(() => {
// //     if (
// //       !gameRunningRef.current ||
// //       gameOverRef.current ||
// //       hasWonRef.current
// //     ) {
// //       return;
// //     }

// //     gameRunningRef.current = false;

// //     gameOverRef.current = true;

// //     setGameOver(true);

// //     if (animationFrameRef.current) {
// //       cancelAnimationFrame(
// //         animationFrameRef.current
// //       );

// //       animationFrameRef.current = null;
// //     }

// //     Haptics.impactAsync(
// //       Haptics.ImpactFeedbackStyle.Heavy
// //     );
// //   }, []);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | WIN GAME
// //   |--------------------------------------------------------------------------
// //   */

// //   const winGame = useCallback(() => {
// //     if (
// //       hasWonRef.current ||
// //       gameOverRef.current
// //     ) {
// //       return;
// //     }

// //     gameRunningRef.current = false;

// //     hasWonRef.current = true;

// //     scoreRef.current =
// //       config.targetScore;

// //     setScore(config.targetScore);

// //     setHasWon(true);

// //     if (animationFrameRef.current) {
// //       cancelAnimationFrame(
// //         animationFrameRef.current
// //       );

// //       animationFrameRef.current = null;
// //     }

// //     Haptics.notificationAsync(
// //       Haptics.NotificationFeedbackType
// //         .Success
// //     );
// //   }, [config.targetScore]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | COLLISION DETECTION
// //   |--------------------------------------------------------------------------
// //   */

// //   const checkCollision = useCallback(
// //     (playerX, debrisItem) => {
// //       const playerLeft =
// //         playerX +
// //         COLLISION_PADDING;

// //       const playerRight =
// //         playerX +
// //         PLAYER_SIZE -
// //         COLLISION_PADDING;

// //       const playerTop =
// //         GAME_HEIGHT -
// //         PLAYER_SIZE -
// //         PLAYER_BOTTOM_OFFSET +
// //         COLLISION_PADDING;

// //       const playerBottom =
// //         playerTop +
// //         PLAYER_SIZE -
// //         COLLISION_PADDING;

// //       const debrisLeft =
// //         debrisItem.x +
// //         COLLISION_PADDING;

// //       const debrisRight =
// //         debrisItem.x +
// //         DEBRIS_SIZE -
// //         COLLISION_PADDING;

// //       const debrisTop =
// //         debrisItem.y +
// //         COLLISION_PADDING;

// //       const debrisBottom =
// //         debrisItem.y +
// //         DEBRIS_SIZE -
// //         COLLISION_PADDING;

// //       return (
// //         playerLeft <
// //           debrisRight &&
// //         playerRight >
// //           debrisLeft &&
// //         playerTop <
// //           debrisBottom &&
// //         playerBottom >
// //           debrisTop
// //       );
// //     },
// //     [GAME_HEIGHT]
// //   );

// //   /*
// //   |--------------------------------------------------------------------------
// //   | GAME LOOP
// //   |--------------------------------------------------------------------------
// //   */

// //   const runGameLoop = useCallback(
// //     (timestamp) => {
// //       if (
// //         !gameRunningRef.current ||
// //         gameOverRef.current ||
// //         hasWonRef.current
// //       ) {
// //         return;
// //       }

// //       if (
// //         lastFrameTimeRef.current ===
// //         null
// //       ) {
// //         lastFrameTimeRef.current =
// //           timestamp;
// //       }

// //       const delta =
// //         Math.min(
// //           timestamp -
// //             lastFrameTimeRef.current,
// //           50
// //         ) / 1000;

// //       lastFrameTimeRef.current =
// //         timestamp;

// //       /*
// //        * ------------------------------------------------------------
// //        * PLAYER MOVEMENT
// //        * ------------------------------------------------------------
// //        */

// //       const tilt =
// //         movementRef.current;

// //       let nextPlayerX =
// //         playerXRef.current;

// //       if (Math.abs(tilt) >= 0.04) {
// //         /*
// //          * Accelerometer values are normally
// //          * around -1 to +1.
// //          *
// //          * Multiply by speed and delta
// //          * so movement is frame-rate independent.
// //          */
// //         nextPlayerX +=
// //           tilt *
// //           config.playerSpeed *
// //           delta;
// //       }

// //       nextPlayerX =
// //         clampPlayerX(nextPlayerX);

// //       playerXRef.current =
// //         nextPlayerX;

// //       /*
// //        * Only update React UI when the
// //        * actual position has changed.
// //        */

// //       setPlayerPositionX(
// //         nextPlayerX
// //       );

// //       /*
// //        * ------------------------------------------------------------
// //        * MOVE DEBRIS
// //        * ------------------------------------------------------------
// //        */

// //       const previousDebris =
// //         debrisRef.current;

// //       const movedDebris =
// //         previousDebris.map(
// //           (item) => ({
// //             ...item,
// //             y:
// //               item.y +
// //               config.debrisSpeed *
// //                 delta,
// //           })
// //         );

// //       /*
// //        * ------------------------------------------------------------
// //        * COLLISION
// //        * ------------------------------------------------------------
// //        */

// //       const collision =
// //         movedDebris.some(
// //           (item) =>
// //             checkCollision(
// //               nextPlayerX,
// //               item
// //             )
// //         );

// //       if (collision) {
// //         debrisRef.current =
// //           movedDebris;

// //         setDebris(
// //           movedDebris
// //         );

// //         finishGame();

// //         return;
// //       }

// //       /*
// //        * ------------------------------------------------------------
// //        * SCORE
// //        * ------------------------------------------------------------
// //        */

// //       let passedCount = 0;

// //       const survivingDebris =
// //         movedDebris.filter(
// //           (item) => {
// //             if (
// //               item.y >
// //               GAME_HEIGHT
// //             ) {
// //               passedCount += 1;

// //               return false;
// //             }

// //             return true;
// //           }
// //         );

// //       /*
// //        * Every debris item successfully
// //        * passing the player gives 10 points.
// //        */

// //       if (passedCount > 0) {
// //         const nextScore =
// //           Math.min(
// //             config.targetScore,
// //             scoreRef.current +
// //               passedCount * 10
// //           );

// //         scoreRef.current =
// //           nextScore;

// //         setScore(nextScore);

// //         if (
// //           nextScore >=
// //           config.targetScore
// //         ) {
// //           debrisRef.current =
// //             survivingDebris;

// //           setDebris(
// //             survivingDebris
// //           );

// //           winGame();

// //           return;
// //         }
// //       }

// //       /*
// //        * ------------------------------------------------------------
// //        * SPAWNING
// //        * ------------------------------------------------------------
// //        */

// //       if (
// //         timestamp -
// //           lastSpawnTimeRef.current >=
// //         config.spawnInterval
// //       ) {
// //         lastSpawnTimeRef.current =
// //           timestamp;

// //         if (
// //           survivingDebris.length <
// //           config.spawnCount
// //         ) {
// //           survivingDebris.push(
// //             createDebrisObject()
// //           );
// //         }
// //       }

// //       /*
// //        * Keep debris within the intended
// //        * maximum number.
// //        */

// //       while (
// //         survivingDebris.length >
// //         config.spawnCount
// //       ) {
// //         survivingDebris.shift();
// //       }

// //       debrisRef.current =
// //         survivingDebris;

// //       setDebris(
// //         survivingDebris
// //       );

// //       animationFrameRef.current =
// //         requestAnimationFrame(
// //           runGameLoop
// //         );
// //     },
// //     [
// //       clampPlayerX,
// //       config.debrisSpeed,
// //       config.playerSpeed,
// //       config.spawnCount,
// //       config.spawnInterval,
// //       config.targetScore,
// //       createDebrisObject,
// //       finishGame,
// //       GAME_HEIGHT,
// //       checkCollision,
// //       winGame,
// //     ]
// //   );

// //   /*
// //   |--------------------------------------------------------------------------
// //   | START ACTUAL GAME
// //   |--------------------------------------------------------------------------
// //   */

// //   const beginGame = useCallback(() => {
// //     const initialX =
// //       GAME_WIDTH / 2 -
// //       PLAYER_SIZE / 2;

// //     playerXRef.current =
// //       initialX;

// //     debrisRef.current =
// //       createInitialDebris();

// //     scoreRef.current = 0;

// //     gameRunningRef.current =
// //       true;

// //     gameOverRef.current =
// //       false;

// //     hasWonRef.current =
// //       false;

// //     movementRef.current = 0;

// //     lastFrameTimeRef.current =
// //       null;

// //     lastSpawnTimeRef.current =
// //       performance.now();

// //     setPlayerPositionX(
// //       initialX
// //     );

// //     setDebris(
// //       debrisRef.current
// //     );

// //     setScore(0);

// //     setGameOver(false);

// //     setHasWon(false);

// //     setGameStarted(true);

// //     Haptics.notificationAsync(
// //       Haptics.NotificationFeedbackType
// //         .Success
// //     );

// //     animationFrameRef.current =
// //       requestAnimationFrame(
// //         runGameLoop
// //       );
// //   }, [
// //     GAME_WIDTH,
// //     createInitialDebris,
// //     runGameLoop,
// //   ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | START / COUNTDOWN
// //   |--------------------------------------------------------------------------
// //   */

// //   const startGame = useCallback(() => {
// //     if (
// //       gameRunningRef.current ||
// //       countdown !== null
// //     ) {
// //       return;
// //     }

// //     /*
// //      * If this is a retry, clear the
// //      * previous game-over state.
// //      */

// //     setGameOver(false);

// //     setHasWon(false);

// //     gameOverRef.current =
// //       false;

// //     hasWonRef.current =
// //       false;

// //     setCountdown(3);

// //     let count = 3;

// //     countdownTimerRef.current =
// //       setInterval(() => {
// //         count -= 1;

// //         if (count <= 0) {
// //           if (
// //             countdownTimerRef.current
// //           ) {
// //             clearInterval(
// //               countdownTimerRef.current
// //             );
// //           }

// //           countdownTimerRef.current =
// //             null;

// //           setCountdown(null);

// //           beginGame();

// //           return;
// //         }

// //         setCountdown(count);

// //         Haptics.impactAsync(
// //           Haptics.ImpactFeedbackStyle.Light
// //         );
// //       }, 700);
// //   }, [
// //     beginGame,
// //     countdown,
// //   ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | TOUCH MOVEMENT
// //   |--------------------------------------------------------------------------
// //   */

// //   const movePlayer = useCallback(
// //     (direction) => {
// //       if (
// //         !gameRunningRef.current ||
// //         gameOverRef.current ||
// //         hasWonRef.current
// //       ) {
// //         return;
// //       }

// //       const amount =
// //         config.playerSpeed *
// //         0.18;

// //       let nextX =
// //         playerXRef.current;

// //       if (direction === 'left') {
// //         nextX -= amount;
// //       } else {
// //         nextX += amount;
// //       }

// //       nextX =
// //         clampPlayerX(nextX);

// //       playerXRef.current =
// //         nextX;

// //       setPlayerPositionX(
// //         nextX
// //       );

// //       Haptics.impactAsync(
// //         Haptics.ImpactFeedbackStyle.Light
// //       );
// //     },
// //     [
// //       clampPlayerX,
// //       config.playerSpeed,
// //     ]
// //   );

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
// //           !visible ||
// //           !gameStarted ||
// //           gameOver ||
// //           hasWon
// //         ) {
// //           return;
// //         }

// //         try {
// //           const available =
// //             await Accelerometer.isAvailableAsync();

// //           if (!mounted) {
// //             return;
// //           }

// //           if (!available) {
// //             setSensorAvailable(false);
// //             return;
// //           }

// //           setSensorAvailable(true);

// //           Accelerometer.setUpdateInterval(
// //             50
// //           );

// //           sensorSubscriptionRef.current =
// //             Accelerometer.addListener(
// //               (data) => {
// //                 if (
// //                   !gameRunningRef.current
// //                 ) {
// //                   return;
// //                 }

// //                 /*
// //                  * Expo's accelerometer x axis
// //                  * controls horizontal movement.
// //                  */

// //                 movementRef.current =
// //                   data.x;
// //               }
// //             );
// //         } catch (error) {
// //           console.log(
// //             'Accelerometer error:',
// //             error
// //           );

// //           if (mounted) {
// //             setSensorAvailable(false);
// //           }
// //         }
// //       };

// //     setupAccelerometer();

// //     return () => {
// //       mounted = false;

// //       if (
// //         sensorSubscriptionRef.current
// //       ) {
// //         sensorSubscriptionRef.current.remove();

// //         sensorSubscriptionRef.current =
// //           null;
// //       }
// //     };
// //   }, [
// //     visible,
// //     gameStarted,
// //     gameOver,
// //     hasWon,
// //   ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | MODAL CLEANUP
// //   |--------------------------------------------------------------------------
// //   */

// //   useEffect(() => {
// //     if (!visible) {
// //       resetGame();
// //     }
// //   }, [
// //     visible,
// //     resetGame,
// //   ]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | COMPONENT UNMOUNT CLEANUP
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
// //       }

// //       if (
// //         animationFrameRef.current
// //       ) {
// //         cancelAnimationFrame(
// //           animationFrameRef.current
// //         );
// //       }

// //       if (
// //         sensorSubscriptionRef.current
// //       ) {
// //         sensorSubscriptionRef.current.remove();
// //       }
// //     };
// //   }, []);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | CLOSE
// //   |--------------------------------------------------------------------------
// //   */

// //   const handleClose = useCallback(() => {
// //     console.log('Closebuttonpressed');
// //     console.log('FloodRunner: handleClose called');
// //     resetGame();
// //     console.log('Calling Parent onClose');
// //     console.log('FloodRunner: calling onClose');
// //     onClose();
// //   },[resetGame, onClose]);

// //   /*
// //   |--------------------------------------------------------------------------
// //   | CLAIM REWARD
// //   |--------------------------------------------------------------------------
// //   */

// //   const handleClaimReward = () => {
// //     if (!hasWonRef.current) {
// //       return;
// //     }

// //     // onWin({
// //     //   xp: config.reward.xp,
// //     //   coins: config.reward.coins,
// //     // });
// //     if (typeof onWin === 'function') {
// //       onWin({
// //         xp: config.reward.xp,
// //         coins: config.reward.coins,
// //       });
// //     } else {
// //       console.warn(
// //         'FloodRunnerGameModal: onWin callback was not provided.'
// //       );
// //     }
// //     handleClose();
// //   };

// //   /*
// //   |--------------------------------------------------------------------------
// //   | PROGRESS
// //   |--------------------------------------------------------------------------
// //   */

// //   const progressPercentage =
// //     Math.min(
// //       100,
// //       (score /
// //         config.targetScore) *
// //         100
// //     );

// //   /*
// //   |--------------------------------------------------------------------------
// //   | RENDER
// //   |--------------------------------------------------------------------------
// //   */

// //   return (
// //     <Modal
// //       visible={visible}
// //       animationType="slide"
// //       transparent
// //       onRequestClose={handleClose}
// //     >
// //       <View style={styles.modalOverlay}>
// //         <View
// //           style={[
// //             styles.modalContentCard,
// //             {
// //               width:
// //                 GAME_WIDTH + 32,
// //             },
// //           ]}
// //         >
// //           {/* HEADER */}

// //           <View style={styles.modalHeader}>
// //             <View
// //               style={
// //                 styles.headerTitleArea
// //               }
// //             >
// //               <View
// //                 style={
// //                   styles.headerIcon
// //                 }
// //               >
// //                 <Ionicons
// //                   name="water"
// //                   size={20}
// //                   color="#38BDF8"
// //                 />
// //               </View>

// //               <View
// //                 style={
// //                   styles.headerTextArea
// //                 }
// //               >
// //                 <Text
// //                   style={
// //                     styles.modalTitle
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.title'
// //                   )}
// //                 </Text>

// //                 <Text
// //                   style={
// //                     styles.levelLabel
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.level',
// //                     {
// //                       level:
// //                         selectedLevel,
// //                     }
// //                   )}{' '}
// //                   •{' '}
// //                   {t(
// //                     config.nameKey
// //                   )}
// //                 </Text>
// //               </View>
// //             </View>

// //             <TouchableOpacity
// //               onPress={handleClose}
// //               accessibilityRole="button"
// //               accessibilityLabel={t('common.close')}
// //             >
// //               <Ionicons
// //                 name="close-circle"
// //                 size={30}
// //                 color="#64748B"
// //               />
// //             </TouchableOpacity>
// //           </View>

// //           {/* OBJECTIVE */}

// //           <View
// //             style={
// //               styles.objectiveCard
// //             }
// //           >
// //             <View
// //               style={
// //                 styles.objectiveIcon
// //               }
// //             >
// //               <Ionicons
// //                 name="flag"
// //                 size={18}
// //                 color="#34D399"
// //               />
// //             </View>

// //             <View
// //               style={
// //                 styles.objectiveTextArea
// //               }
// //             >
// //               <Text
// //                 style={
// //                   styles.objectiveTitle
// //                 }
// //               >
// //                 {t(
// //                   'games.floodRunner.objective'
// //                 )}
// //               </Text>

// //               <Text
// //                 style={
// //                   styles.objectiveText
// //                 }
// //               >
// //                 {t(
// //                   'games.floodRunner.objectiveDescription'
// //                 )}
// //               </Text>
// //             </View>
// //           </View>

// //           {/* INSTRUCTIONS */}

// //           {!gameStarted &&
// //             !gameOver &&
// //             !hasWon &&
// //             countdown === null && (
// //               <View
// //                 style={
// //                   styles.instructionsCard
// //                 }
// //               >
// //                 <View
// //                   style={
// //                     styles.instructionsHeader
// //                   }
// //                 >
// //                   <Ionicons
// //                     name="help-circle"
// //                     size={20}
// //                     color="#FBBF24"
// //                   />

// //                   <Text
// //                     style={
// //                       styles.instructionsTitle
// //                     }
// //                   >
// //                     {t(
// //                       'games.floodRunner.howToPlay'
// //                     )}
// //                   </Text>
// //                 </View>

// //                 <InstructionRow
// //                   icon="swap-horizontal"
// //                   text={t(
// //                     'games.floodRunner.instructions.move'
// //                   )}
// //                 />

// //                 <InstructionRow
// //                   icon="warning"
// //                   text={t(
// //                     'games.floodRunner.instructions.avoid'
// //                   )}
// //                 />

// //                 <InstructionRow
// //                   icon="water"
// //                   text={t(
// //                     'games.floodRunner.instructions.flood'
// //                   )}
// //                 />

// //                 <InstructionRow
// //                   icon="flag"
// //                   text={t(
// //                     'games.floodRunner.instructions.finish',
// //                     {
// //                       score:
// //                         config.targetScore,
// //                     }
// //                   )}
// //                 />
// //               </View>
// //             )}

// //           {/* SENSOR STATUS */}

// //           {gameStarted &&
// //             !gameOver &&
// //             !hasWon && (
// //               <View
// //                 style={
// //                   styles.sensorStatus
// //                 }
// //               >
// //                 <Ionicons
// //                   name={
// //                     sensorAvailable
// //                       ? 'phone-portrait-outline'
// //                       : 'hand-left-outline'
// //                   }
// //                   size={15}
// //                   color={
// //                     sensorAvailable
// //                       ? '#34D399'
// //                       : '#FBBF24'
// //                   }
// //                 />

// //                 <Text
// //                   style={[
// //                     styles.sensorText,
// //                     {
// //                       color:
// //                         sensorAvailable
// //                           ? '#34D399'
// //                           : '#FBBF24',
// //                     },
// //                   ]}
// //                 >
// //                   {sensorAvailable
// //                     ? t(
// //                         'games.floodRunner.tiltActive'
// //                       )
// //                     : t(
// //                         'games.floodRunner.touchActive'
// //                       )}
// //                 </Text>
// //               </View>
// //             )}

// //           {/* GAME CANVAS */}

// //           <View
// //             style={[
// //               styles.gameCanvas,
// //               {
// //                 width:
// //                   GAME_WIDTH,
// //                 height:
// //                   GAME_HEIGHT,
// //               },
// //             ]}
// //           >
// //             {/* SAFE ZONE */}

// //             <View
// //               style={
// //                 styles.safeZone
// //               }
// //             >
// //               <View
// //                 style={
// //                   styles.safeZoneIcon
// //                 }
// //               >
// //                 <Ionicons
// //                   name="shield-checkmark"
// //                   size={18}
// //                   color="#34D399"
// //                 />
// //               </View>

// //               <View>
// //                 <Text
// //                   style={
// //                     styles.safeZoneTitle
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.safeShelter'
// //                   )}
// //                 </Text>

// //                 <Text
// //                   style={
// //                     styles.safeZoneSub
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.highGround'
// //                   )}
// //                 </Text>
// //               </View>
// //             </View>

// //             {/* DANGER FIELD */}

// //             <View
// //               style={
// //                 styles.dangerField
// //               }
// //             >
// //               <View
// //                 style={
// //                   styles.routeLine
// //                 }
// //               />

// //               <Text
// //                 style={
// //                   styles.dangerText
// //                 }
// //               >
// //                 {t(
// //                   'games.floodRunner.evacuationRoute'
// //                 )}
// //               </Text>
// //             </View>

// //             {/* DEBRIS */}

// //             {gameStarted &&
// //               !gameOver &&
// //               !hasWon &&
// //               debris.map((item) => (
// //                 <View
// //                   key={item.id}
// //                   style={[
// //                     styles.debrisNode,
// //                     {
// //                       left: item.x,
// //                       top: item.y,
// //                     },
// //                   ]}
// //                 >
// //                   <Ionicons
// //                     name="warning"
// //                     size={20}
// //                     color="#FCA5A5"
// //                   />
// //                 </View>
// //               ))}

// //             {/* PLAYER */}

// //             {gameStarted &&
// //               !gameOver &&
// //               !hasWon && (
// //                 <View
// //                   style={[
// //                     styles.playerNode,
// //                     {
// //                       left:
// //                         playerPositionX,
// //                       bottom:
// //                         PLAYER_BOTTOM_OFFSET +
// //                         FLOOD_HEIGHT,
// //                     },
// //                   ]}
// //                 >
// //                   <Ionicons
// //                     name="person"
// //                     size={25}
// //                     color="#FFFFFF"
// //                   />
// //                 </View>
// //               )}

// //             {/* FLOOD */}

// //             <View
// //               style={
// //                 styles.floodLayer
// //               }
// //             >
// //               <View
// //                 style={
// //                   styles.waveContainer
// //                 }
// //               >
// //                 {Array.from({
// //                   length: 12,
// //                 }).map(
// //                   (_, index) => (
// //                     <Text
// //                       key={index}
// //                       style={
// //                         styles.wave
// //                       }
// //                     >
// //                       ~
// //                     </Text>
// //                   )
// //                 )}
// //               </View>

// //               <Text
// //                 style={
// //                   styles.floodLabel
// //                 }
// //               >
// //                 {t(
// //                   'games.floodRunner.floodZone'
// //                 )}
// //               </Text>
// //             </View>

// //             {/* COUNTDOWN */}

// //             {countdown !== null && (
// //               <View
// //                 style={
// //                   styles.countdownOverlay
// //                 }
// //               >
// //                 <Text
// //                   style={
// //                     styles.countdownNumber
// //                   }
// //                 >
// //                   {countdown}
// //                 </Text>

// //                 <Text
// //                   style={
// //                     styles.countdownText
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.getReady'
// //                   )}
// //                 </Text>
// //               </View>
// //             )}

// //             {/* START SCREEN */}

// //             {!gameStarted &&
// //               countdown === null &&
// //               !gameOver &&
// //               !hasWon && (
// //                 <View
// //                   style={
// //                     styles.startOverlay
// //                   }
// //                 >
// //                   <View
// //                     style={
// //                       styles.startIcon
// //                     }
// //                   >
// //                     <Ionicons
// //                       name="walk"
// //                       size={34}
// //                       color="#38BDF8"
// //                     />
// //                   </View>

// //                   <Text
// //                     style={
// //                       styles.startTitle
// //                     }
// //                   >
// //                     {t(
// //                       'games.floodRunner.ready'
// //                     )}
// //                   </Text>

// //                   <Text
// //                     style={
// //                       styles.startDescription
// //                     }
// //                   >
// //                     {t(
// //                       'games.floodRunner.startDescription'
// //                     )}
// //                   </Text>

// //                   <TouchableOpacity
// //                     style={
// //                       styles.startButton
// //                     }
// //                     onPress={
// //                       startGame
// //                     }
// //                     activeOpacity={
// //                       0.8
// //                     }
// //                   >
// //                     <Ionicons
// //                       name="play"
// //                       size={18}
// //                       color="#FFFFFF"
// //                     />

// //                     <Text
// //                       style={
// //                         styles.startButtonText
// //                       }
// //                     >
// //                       {t(
// //                         'games.floodRunner.start'
// //                       )}
// //                     </Text>
// //                   </TouchableOpacity>
// //                 </View>
// //               )}

// //             {/* GAME OVER */}

// //             {gameOver && (
// //               <View
// //                 style={
// //                   styles.endGameOverlay
// //                 }
// //               >
// //                 <View
// //                   style={[
// //                     styles.resultIcon,
// //                     {
// //                       backgroundColor:
// //                         '#450A0A',
// //                     },
// //                   ]}
// //                 >
// //                   <Ionicons
// //                     name="warning"
// //                     size={34}
// //                     color="#EF4444"
// //                   />
// //                 </View>

// //                 <Text
// //                   style={
// //                     styles.gameOverTitle
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.failed'
// //                   )}
// //                 </Text>

// //                 <Text
// //                   style={
// //                     styles.gameOverText
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.failedDescription'
// //                   )}
// //                 </Text>

// //                 <Text
// //                   style={
// //                     styles.finalScore
// //                   }
// //                 >
// //                   {score} /{' '}
// //                   {config.targetScore}
// //                 </Text>

// //                 <TouchableOpacity
// //                   style={
// //                     styles.retryButton
// //                   }
// //                   onPress={
// //                     startGame
// //                   }
// //                   activeOpacity={
// //                     0.8
// //                   }
// //                 >
// //                   <Ionicons
// //                     name="refresh"
// //                     size={18}
// //                     color="#FFFFFF"
// //                   />

// //                   <Text
// //                     style={
// //                       styles.buttonText
// //                     }
// //                   >
// //                     {t(
// //                       'games.floodRunner.retry'
// //                     )}
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>
// //             )}

// //             {/* WIN */}

// //             {hasWon && (
// //               <View
// //                 style={
// //                   styles.endGameOverlay
// //                 }
// //               >
// //                 <View
// //                   style={[
// //                     styles.resultIcon,
// //                     {
// //                       backgroundColor:
// //                         '#064E3B',
// //                     },
// //                   ]}
// //                 >
// //                   <Ionicons
// //                     name="shield-checkmark"
// //                     size={36}
// //                     color="#10B981"
// //                   />
// //                 </View>

// //                 <Text
// //                   style={
// //                     styles.successTitle
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.success'
// //                   )}
// //                 </Text>

// //                 <Text
// //                   style={
// //                     styles.gameOverText
// //                   }
// //                 >
// //                   {t(
// //                     'games.floodRunner.successDescription'
// //                   )}
// //                 </Text>

// //                 <View
// //                   style={
// //                     styles.rewardRow
// //                   }
// //                 >
// //                   <Reward
// //                     icon="flash"
// //                     value={`+${config.reward.xp}`}
// //                     label={t(
// //                       'games.floodRunner.xp'
// //                     )}
// //                   />

// //                   <Reward
// //                     icon="cash"
// //                     value={`+${config.reward.coins}`}
// //                     label={t(
// //                       'games.floodRunner.coins'
// //                     )}
// //                   />
// //                 </View>

// //                 <TouchableOpacity
// //                   style={
// //                     styles.claimRewardButton
// //                   }
// //                   onPress={
// //                     handleClaimReward
// //                   }
// //                   activeOpacity={
// //                     0.8
// //                   }
// //                 >
// //                   <Text
// //                     style={
// //                       styles.buttonText
// //                     }
// //                   >
// //                     {t(
// //                       'games.floodRunner.claimReward'
// //                     )}
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>
// //             )}
// //           </View>

// //           {/* SCORE */}

// //           <View
// //             style={styles.gameHud}
// //           >
// //             <View
// //               style={
// //                 styles.scoreHeader
// //               }
// //             >
// //               <Text
// //                 style={
// //                   styles.scoreLabel
// //                 }
// //               >
// //                 {t(
// //                   'games.floodRunner.score'
// //                 )}
// //               </Text>

// //               <Text
// //                 style={
// //                   styles.scoreValue
// //                 }
// //               >
// //                 {score} /{' '}
// //                 {config.targetScore}
// //               </Text>
// //             </View>

// //             <View
// //               style={
// //                 styles.progressBackground
// //               }
// //             >
// //               <View
// //                 style={[
// //                   styles.progressFill,
// //                   {
// //                     width: `${progressPercentage}%`,
// //                   },
// //                 ]}
// //               />
// //             </View>
// //           </View>

// //           {/* CONTROLS */}

// //           {gameStarted &&
// //             !gameOver &&
// //             !hasWon && (
// //               <View
// //                 style={
// //                   styles.controls
// //                 }
// //               >
// //                 <TouchableOpacity
// //                   style={
// //                     styles.controlButton
// //                   }
// //                   onPress={() =>
// //                     movePlayer(
// //                       'left'
// //                     )
// //                   }
// //                   activeOpacity={
// //                     0.7
// //                   }
// //                 >
// //                   <Ionicons
// //                     name="arrow-back"
// //                     size={24}
// //                     color="#FFFFFF"
// //                   />

// //                   <Text
// //                     style={
// //                       styles.controlText
// //                     }
// //                     numberOfLines={
// //                       2
// //                     }
// //                   >
// //                     {t(
// //                       'games.floodRunner.left'
// //                     )}
// //                   </Text>
// //                 </TouchableOpacity>

// //                 <View
// //                   style={
// //                     styles.controlHint
// //                   }
// //                 >
// //                   <Ionicons
// //                     name={
// //                       sensorAvailable
// //                         ? 'phone-portrait-outline'
// //                         : 'hand-left-outline'
// //                     }
// //                     size={21}
// //                     color="#38BDF8"
// //                   />

// //                   <Text
// //                     style={
// //                       styles.controlHintText
// //                     }
// //                     numberOfLines={
// //                       2
// //                     }
// //                   >
// //                     {sensorAvailable
// //                       ? t(
// //                           'games.floodRunner.tilt'
// //                         )
// //                       : t(
// //                           'games.floodRunner.touch'
// //                         )}
// //                   </Text>
// //                 </View>

// //                 <TouchableOpacity
// //                   style={
// //                     styles.controlButton
// //                   }
// //                   onPress={() =>
// //                     movePlayer(
// //                       'right'
// //                     )
// //                   }
// //                   activeOpacity={
// //                     0.7
// //                   }
// //                 >
// //                   <Ionicons
// //                     name="arrow-forward"
// //                     size={24}
// //                     color="#FFFFFF"
// //                   />

// //                   <Text
// //                     style={
// //                       styles.controlText
// //                     }
// //                     numberOfLines={
// //                       2
// //                     }
// //                   >
// //                     {t(
// //                       'games.floodRunner.right'
// //                     )}
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>
// //             )}
// //         </View>
// //       </View>
// //     </Modal>
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
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor:
// //       'rgba(2, 6, 23, 0.94)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 12,
// //   },

// //   modalContentCard: {
// //     backgroundColor: '#0F172A',
// //     borderWidth: 1,
// //     borderColor: '#1E293B',
// //     borderRadius: 22,
// //     padding: 16,
// //     maxWidth: 400,
// //     maxHeight: '96%',
// //   },

// //   modalHeader: {
// //     flexDirection: 'row',
// //     justifyContent:
// //       'space-between',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },

// //   headerTitleArea: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //     marginRight: 10,
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
// //     padding: 11,
// //     marginBottom: 10,
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
// //     padding: 13,
// //     marginBottom: 10,
// //   },

// //   instructionsHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 8,
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
// //     marginTop: 7,
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
// //     lineHeight: 17,
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
// //     justifyContent:
// //       'space-around',
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
// //     padding: 24,
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

// //   endGameOverlay: {
// //     position: 'absolute',
// //     top: SAFE_ZONE_HEIGHT,
// //     bottom: FLOOD_HEIGHT,
// //     left: 12,
// //     right: 12,
// //     backgroundColor:
// //       'rgba(15, 23, 42, 0.97)',
// //     borderWidth: 1,
// //     borderColor: '#334155',
// //     borderRadius: 18,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 20,
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

// //   gameHud: {
// //     marginTop: 10,
// //   },

// //   scoreHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent:
// //       'space-between',
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

// //   controls: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent:
// //       'space-between',
// //     marginTop: 11,
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
// import { useNavigation, useRoute } from '@react-navigation/native';

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
//   Dimensions.get('window');

// /*
// |--------------------------------------------------------------------------
// | LEVEL CONFIGURATION
// |--------------------------------------------------------------------------
// */

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

// const PLAYER_SIZE = 36;
// const DEBRIS_SIZE = 28;

// const SAFE_ZONE_HEIGHT = 56;
// const FLOOD_HEIGHT = 64;

// const PLAYER_BOTTOM_OFFSET = 14;

// const COLLISION_PADDING = 4;

// /*
// |--------------------------------------------------------------------------
// | COMPONENT
// |--------------------------------------------------------------------------
// */

// export default function FloodRunnerGameModal() {
//   const { t } = useTranslation();

//   const navigation = useNavigation();

//   const route = useRoute();

//   /*
//    * The game is now a normal React Navigation screen.
//    *
//    * MissionsScreen can open it with:
//    *
//    * navigation.navigate('FloodRunnerGameModal', {
//    *   level: 1,
//    * });
//    */

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

//   /*
//   |--------------------------------------------------------------------------
//   | GAME DIMENSIONS
//   |--------------------------------------------------------------------------
//   */

//   const GAME_WIDTH = Math.min(
//     SCREEN_WIDTH - 32,
//     390
//   );

//   const GAME_HEIGHT = Math.min(
//     SCREEN_HEIGHT * 0.52,
//     430
//   );

//   /*
//   |--------------------------------------------------------------------------
//   | REACT STATE
//   |--------------------------------------------------------------------------
//   */

//   const [gameStarted, setGameStarted] =
//     useState(false);

//   const [countdown, setCountdown] =
//     useState(null);

//   const [playerPositionX, setPlayerPositionX] =
//     useState(
//       GAME_WIDTH / 2 -
//         PLAYER_SIZE / 2
//     );

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

//   /*
//   |--------------------------------------------------------------------------
//   | REFS
//   |--------------------------------------------------------------------------
//   */

//   const playerXRef = useRef(
//     GAME_WIDTH / 2 -
//       PLAYER_SIZE / 2
//   );

//   const debrisRef = useRef([]);

//   const scoreRef = useRef(0);

//   const gameRunningRef =
//     useRef(false);

//   const gameOverRef =
//     useRef(false);

//   const hasWonRef =
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
//   |--------------------------------------------------------------------------
//   | CLAMP PLAYER
//   |--------------------------------------------------------------------------
//   */

//   const clampPlayerX = useCallback(
//     (x) => {
//       return Math.max(
//         0,
//         Math.min(
//           GAME_WIDTH - PLAYER_SIZE,
//           x
//         )
//       );
//     },
//     [GAME_WIDTH]
//   );

//   /*
//   |--------------------------------------------------------------------------
//   | CREATE DEBRIS
//   |--------------------------------------------------------------------------
//   */

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
//         };
//       },
//       [GAME_WIDTH]
//     );

//   /*
//   |--------------------------------------------------------------------------
//   | INITIAL DEBRIS
//   |--------------------------------------------------------------------------
//   */

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
//             index * 115 -
//             Math.random() * 90,
//         });
//       }

//       return objects;
//     }, [
//       config.spawnCount,
//       GAME_WIDTH,
//     ]);

//   /*
//   |--------------------------------------------------------------------------
//   | STOP GAME LOOP
//   |--------------------------------------------------------------------------
//   */

//   const stopGameLoop = useCallback(() => {
//     gameRunningRef.current =
//       false;

//     if (
//       animationFrameRef.current
//     ) {
//       cancelAnimationFrame(
//         animationFrameRef.current
//       );

//       animationFrameRef.current =
//         null;
//     }

//     lastFrameTimeRef.current =
//       null;
//   }, []);

//   /*
//   |--------------------------------------------------------------------------
//   | RESET GAME
//   |--------------------------------------------------------------------------
//   */

//   const resetGame = useCallback(() => {
//     if (
//       countdownTimerRef.current
//     ) {
//       clearInterval(
//         countdownTimerRef.current
//       );

//       countdownTimerRef.current =
//         null;
//     }

//     stopGameLoop();

//     if (
//       sensorSubscriptionRef.current
//     ) {
//       sensorSubscriptionRef.current.remove();

//       sensorSubscriptionRef.current =
//         null;
//     }

//     const initialX =
//       GAME_WIDTH / 2 -
//       PLAYER_SIZE / 2;

//     playerXRef.current =
//       initialX;

//     debrisRef.current = [];

//     scoreRef.current = 0;

//     gameRunningRef.current =
//       false;

//     gameOverRef.current =
//       false;

//     hasWonRef.current =
//       false;

//     movementRef.current = 0;

//     lastFrameTimeRef.current =
//       null;

//     lastSpawnTimeRef.current =
//       0;

//     setGameStarted(false);
//     setCountdown(null);
//     setPlayerPositionX(initialX);
//     setDebris([]);
//     setScore(0);
//     setGameOver(false);
//     setHasWon(false);
//   }, [
//     GAME_WIDTH,
//     stopGameLoop,
//   ]);

//   /*
//   |--------------------------------------------------------------------------
//   | GAME OVER
//   |--------------------------------------------------------------------------
//   */

//   const finishGame =
//     useCallback(() => {
//       if (
//         !gameRunningRef.current ||
//         gameOverRef.current ||
//         hasWonRef.current
//       ) {
//         return;
//       }

//       gameRunningRef.current =
//         false;

//       gameOverRef.current =
//         true;

//       setGameOver(true);

//       if (
//         animationFrameRef.current
//       ) {
//         cancelAnimationFrame(
//           animationFrameRef.current
//         );

//         animationFrameRef.current =
//           null;
//       }

//       Haptics.impactAsync(
//         Haptics.ImpactFeedbackStyle.Heavy
//       );
//     }, []);

//   /*
//   |--------------------------------------------------------------------------
//   | WIN
//   |--------------------------------------------------------------------------
//   */

//   const winGame =
//     useCallback(() => {
//       if (
//         hasWonRef.current ||
//         gameOverRef.current
//       ) {
//         return;
//       }

//       gameRunningRef.current =
//         false;

//       hasWonRef.current =
//         true;

//       scoreRef.current =
//         config.targetScore;

//       setScore(
//         config.targetScore
//       );

//       setHasWon(true);

//       if (
//         animationFrameRef.current
//       ) {
//         cancelAnimationFrame(
//           animationFrameRef.current
//         );

//         animationFrameRef.current =
//           null;
//       }

//       Haptics.notificationAsync(
//         Haptics.NotificationFeedbackType
//           .Success
//       );
//     }, [
//       config.targetScore,
//     ]);

//   /*
//   |--------------------------------------------------------------------------
//   | COLLISION
//   |--------------------------------------------------------------------------
//   */

//   const checkCollision =
//     useCallback(
//       (playerX, debrisItem) => {
//         const playerLeft =
//           playerX +
//           COLLISION_PADDING;

//         const playerRight =
//           playerX +
//           PLAYER_SIZE -
//           COLLISION_PADDING;

//         const playerTop =
//           GAME_HEIGHT -
//           PLAYER_SIZE -
//           PLAYER_BOTTOM_OFFSET -
//           FLOOD_HEIGHT +
//           COLLISION_PADDING;

//         const playerBottom =
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
//           playerLeft <
//             debrisRight &&
//           playerRight >
//             debrisLeft &&
//           playerTop <
//             debrisBottom &&
//           playerBottom >
//             debrisTop
//         );
//       },
//       [GAME_HEIGHT]
//     );

//   /*
//   |--------------------------------------------------------------------------
//   | GAME LOOP
//   |--------------------------------------------------------------------------
//   */

//   const runGameLoop =
//     useCallback(
//       (timestamp) => {
//         if (
//           !gameRunningRef.current ||
//           gameOverRef.current ||
//           hasWonRef.current
//         ) {
//           return;
//         }

//         if (
//           lastFrameTimeRef.current ===
//           null
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

//         /*
//          * PLAYER
//          */

//         const tilt =
//           movementRef.current;

//         let nextPlayerX =
//           playerXRef.current;

//         if (
//           Math.abs(tilt) >= 0.04
//         ) {
//           nextPlayerX +=
//             tilt *
//             config.playerSpeed *
//             delta;
//         }

//         nextPlayerX =
//           clampPlayerX(
//             nextPlayerX
//           );

//         playerXRef.current =
//           nextPlayerX;

//         setPlayerPositionX(
//           nextPlayerX
//         );

//         /*
//          * DEBRIS
//          */

//         const previousDebris =
//           debrisRef.current;

//         const movedDebris =
//           previousDebris.map(
//             (item) => ({
//               ...item,

//               y:
//                 item.y +
//                 config.debrisSpeed *
//                   delta,
//             })
//           );

//         /*
//          * COLLISION
//          */

//         const collision =
//           movedDebris.some(
//             (item) =>
//               checkCollision(
//                 nextPlayerX,
//                 item
//               )
//           );

//         if (collision) {
//           debrisRef.current =
//             movedDebris;

//           setDebris(
//             movedDebris
//           );

//           finishGame();

//           return;
//         }

//         /*
//          * SCORE
//          */

//         let passedCount = 0;

//         const survivingDebris =
//           movedDebris.filter(
//             (item) => {
//               if (
//                 item.y >
//                 GAME_HEIGHT
//               ) {
//                 passedCount += 1;
//                 return false;
//               }

//               return true;
//             }
//           );

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

//         /*
//          * SPAWN
//          */

//         if (
//           timestamp -
//             lastSpawnTimeRef.current >=
//           config.spawnInterval
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
//             runGameLoop
//           );
//       },
//       [
//         clampPlayerX,
//         config.debrisSpeed,
//         config.playerSpeed,
//         config.spawnCount,
//         config.spawnInterval,
//         config.targetScore,
//         createDebrisObject,
//         finishGame,
//         GAME_HEIGHT,
//         checkCollision,
//         winGame,
//       ]
//     );

//   /*
//   |--------------------------------------------------------------------------
//   | BEGIN GAME
//   |--------------------------------------------------------------------------
//   */

//   const beginGame =
//     useCallback(() => {
//       const initialX =
//         GAME_WIDTH / 2 -
//         PLAYER_SIZE / 2;

//       playerXRef.current =
//         initialX;

//       debrisRef.current =
//         createInitialDebris();

//       scoreRef.current = 0;

//       gameRunningRef.current =
//         true;

//       gameOverRef.current =
//         false;

//       hasWonRef.current =
//         false;

//       movementRef.current = 0;

//       lastFrameTimeRef.current =
//         null;

//       lastSpawnTimeRef.current =
//         performance.now();

//       setPlayerPositionX(
//         initialX
//       );

//       setDebris(
//         debrisRef.current
//       );

//       setScore(0);

//       setGameOver(false);

//       setHasWon(false);

//       setGameStarted(true);

//       Haptics.notificationAsync(
//         Haptics.NotificationFeedbackType
//           .Success
//       );

//       animationFrameRef.current =
//         requestAnimationFrame(
//           runGameLoop
//         );
//     }, [
//       GAME_WIDTH,
//       createInitialDebris,
//       runGameLoop,
//     ]);

//   /*
//   |--------------------------------------------------------------------------
//   | START GAME
//   |--------------------------------------------------------------------------
//   */

//   const startGame =
//     useCallback(() => {
//       if (
//         gameRunningRef.current ||
//         countdown !== null
//       ) {
//         return;
//       }

//       /*
//        * Reset retry state.
//        */

//       setGameOver(false);
//       setHasWon(false);

//       gameOverRef.current =
//         false;

//       hasWonRef.current =
//         false;

//       setCountdown(3);

//       let count = 3;

//       Haptics.impactAsync(
//         Haptics.ImpactFeedbackStyle.Light
//       );

//       countdownTimerRef.current =
//         setInterval(() => {
//           count -= 1;

//           if (count <= 0) {
//             if (
//               countdownTimerRef.current
//             ) {
//               clearInterval(
//                 countdownTimerRef.current
//               );
//             }

//             countdownTimerRef.current =
//               null;

//             setCountdown(null);

//             beginGame();

//             return;
//           }

//           setCountdown(count);

//           Haptics.impactAsync(
//             Haptics.ImpactFeedbackStyle.Light
//           );
//         }, 700);
//     }, [
//       beginGame,
//       countdown,
//     ]);

//   /*
//   |--------------------------------------------------------------------------
//   | TOUCH MOVEMENT
//   |--------------------------------------------------------------------------
//   */

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
//           0.18;

//         let nextX =
//           playerXRef.current;

//         if (
//           direction === 'left'
//         ) {
//           nextX -= amount;
//         } else {
//           nextX += amount;
//         }

//         nextX =
//           clampPlayerX(nextX);

//         playerXRef.current =
//           nextX;

//         setPlayerPositionX(
//           nextX
//         );

//         Haptics.impactAsync(
//           Haptics.ImpactFeedbackStyle.Light
//         );
//       },
//       [
//         clampPlayerX,
//         config.playerSpeed,
//       ]
//     );

//   /*
//   |--------------------------------------------------------------------------
//   | ACCELEROMETER
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {
//     let mounted = true;

//     const setupAccelerometer =
//       async () => {
//         if (
//           !gameStarted ||
//           gameOver ||
//           hasWon
//         ) {
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

//           Accelerometer.setUpdateInterval(
//             50
//           );

//           sensorSubscriptionRef.current =
//             Accelerometer.addListener(
//               (data) => {
//                 if (
//                   !gameRunningRef.current
//                 ) {
//                   return;
//                 }

//                 movementRef.current =
//                   data.x;
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

//       if (
//         sensorSubscriptionRef.current
//       ) {
//         sensorSubscriptionRef.current.remove();

//         sensorSubscriptionRef.current =
//           null;
//       }
//     };
//   }, [
//     gameStarted,
//     gameOver,
//     hasWon,
//   ]);

//   /*
//   |--------------------------------------------------------------------------
//   | BACK BUTTON
//   |--------------------------------------------------------------------------
//   |
//   | Do not allow Android back to leave the
//   | screen while the game is actively running.
//   |
//   */

//   useEffect(() => {
//     const subscription =
//       BackHandler.addEventListener(
//         'hardwareBackPress',
//         () => {
//           if (
//             gameRunningRef.current ||
//             countdown !== null
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
//   ]);

//   /*
//   |--------------------------------------------------------------------------
//   | CLEANUP
//   |--------------------------------------------------------------------------
//   */

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
//         animationFrameRef.current
//       ) {
//         cancelAnimationFrame(
//           animationFrameRef.current
//         );
//       }

//       if (
//         sensorSubscriptionRef.current
//       ) {
//         sensorSubscriptionRef.current.remove();
//       }
//     };
//   }, []);

//   /*
//   |--------------------------------------------------------------------------
//   | CLAIM REWARD
//   |--------------------------------------------------------------------------
//   */

//   const handleClaimReward =
//     useCallback(() => {
//       if (
//         !hasWonRef.current
//       ) {
//         return;
//       }

//       /*
//        * For now we simply return to Missions.
//        *
//        * Later you can connect this to your
//        * XP / coins system.
//        */

//       resetGame();

//       navigation.goBack();
//     }, [
//       navigation,
//       resetGame,
//     ]);

//   /*
//   |--------------------------------------------------------------------------
//   | PROGRESS
//   |--------------------------------------------------------------------------
//   */

//   const progressPercentage =
//     Math.min(
//       100,
//       (score /
//         config.targetScore) *
//         100
//     );

//   /*
//   |--------------------------------------------------------------------------
//   | RENDER
//   |--------------------------------------------------------------------------
//   */

//   return (
//     <View
//       style={styles.screen}
//     >
//       <View
//         style={[
//           styles.modalContentCard,
//           {
//             width:
//               Math.min(
//                 GAME_WIDTH + 32,
//                 SCREEN_WIDTH - 16
//               ),
//           },
//         ]}
//       >
//         {/* HEADER */}

//         <View
//           style={styles.modalHeader}
//         >
//           <View
//             style={
//               styles.headerTitleArea
//             }
//           >
//             <View
//               style={
//                 styles.headerIcon
//               }
//             >
//               <Ionicons
//                 name="water"
//                 size={20}
//                 color="#38BDF8"
//               />
//             </View>

//             <View
//               style={
//                 styles.headerTextArea
//               }
//             >
//               <Text
//                 style={
//                   styles.modalTitle
//                 }
//               >
//                 {t(
//                   'games.floodRunner.title'
//                 )}
//               </Text>

//               <Text
//                 style={
//                   styles.levelLabel
//                 }
//               >
//                 {t(
//                   'games.floodRunner.level',
//                   {
//                     level:
//                       selectedLevel,
//                   }
//                 )}{' '}
//                 •{' '}
//                 {t(
//                   config.nameKey
//                 )}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* OBJECTIVE */}

//         <View
//           style={
//             styles.objectiveCard
//           }
//         >
//           <View
//             style={
//               styles.objectiveIcon
//             }
//           >
//             <Ionicons
//               name="flag"
//               size={18}
//               color="#34D399"
//             />
//           </View>

//           <View
//             style={
//               styles.objectiveTextArea
//             }
//           >
//             <Text
//               style={
//                 styles.objectiveTitle
//               }
//             >
//               {t(
//                 'games.floodRunner.objective'
//               )}
//             </Text>

//             <Text
//               style={
//                 styles.objectiveText
//               }
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
//             </View>
//           )}

//         {/* SENSOR STATUS */}

//         {gameStarted &&
//           !gameOver &&
//           !hasWon && (
//             <View
//               style={
//                 styles.sensorStatus
//               }
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
//             </View>
//           )}

//         {/* GAME AREA */}

//         <View
//           style={[
//             styles.gameCanvas,
//             {
//               width:
//                 GAME_WIDTH,
//               height:
//                 GAME_HEIGHT,
//             },
//           ]}
//         >
//           {/* SAFE ZONE */}

//           <View
//             style={
//               styles.safeZone
//             }
//           >
//             <View
//               style={
//                 styles.safeZoneIcon
//               }
//             >
//               <Ionicons
//                 name="shield-checkmark"
//                 size={18}
//                 color="#34D399"
//               />
//             </View>

//             <View>
//               <Text
//                 style={
//                   styles.safeZoneTitle
//                 }
//               >
//                 {t(
//                   'games.floodRunner.safeShelter'
//                 )}
//               </Text>

//               <Text
//                 style={
//                   styles.safeZoneSub
//                 }
//               >
//                 {t(
//                   'games.floodRunner.highGround'
//                 )}
//               </Text>
//             </View>
//           </View>

//           {/* DANGER FIELD */}

//           <View
//             style={
//               styles.dangerField
//             }
//           >
//             <View
//               style={
//                 styles.routeLine
//               }
//             />

//             <Text
//               style={
//                 styles.dangerText
//               }
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
//             debris.map(
//               (item) => (
//                 <View
//                   key={item.id}
//                   style={[
//                     styles.debrisNode,
//                     {
//                       left:
//                         item.x,
//                       top:
//                         item.y,
//                     },
//                   ]}
//                 >
//                   <Ionicons
//                     name="warning"
//                     size={20}
//                     color="#FCA5A5"
//                   />
//                 </View>
//               )
//             )}

//           {/* PLAYER */}

//           {gameStarted &&
//             !gameOver &&
//             !hasWon && (
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
//             style={
//               styles.floodLayer
//             }
//           >
//             <View
//               style={
//                 styles.waveContainer
//               }
//             >
//               {Array.from({
//                 length: 12,
//               }).map(
//                 (_, index) => (
//                   <Text
//                     key={index}
//                     style={
//                       styles.wave
//                     }
//                   >
//                     ~
//                   </Text>
//                 )
//               )}
//             </View>

//             <Text
//               style={
//                 styles.floodLabel
//               }
//             >
//               {t(
//                 'games.floodRunner.floodZone'
//               )}
//             </Text>
//           </View>

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
//                 style={
//                   styles.startOverlay
//                 }
//               >
//                 <View
//                   style={
//                     styles.startIcon
//                   }
//                 >
//                   <Ionicons
//                     name="walk"
//                     size={34}
//                     color="#38BDF8"
//                   />
//                 </View>

//                 <Text
//                   style={
//                     styles.startTitle
//                   }
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
//                   style={
//                     styles.startButton
//                   }
//                   onPress={
//                     startGame
//                   }
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
//                 style={
//                   styles.finalScore
//                 }
//               >
//                 {score} /{' '}
//                 {config.targetScore}
//               </Text>

//               <TouchableOpacity
//                 style={
//                   styles.retryButton
//                 }
//                 onPress={
//                   startGame
//                 }
//                 activeOpacity={0.8}
//               >
//                 <Ionicons
//                   name="refresh"
//                   size={18}
//                   color="#FFFFFF"
//                 />

//                 <Text
//                   style={
//                     styles.buttonText
//                   }
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
//                 style={
//                   styles.rewardRow
//                 }
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
//                 style={
//                   styles.claimRewardButton
//                 }
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
//                   style={
//                     styles.buttonText
//                   }
//                 >
//                   {t(
//                     'games.floodRunner.claimReward'
//                   )}
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
//             style={
//               styles.scoreHeader
//             }
//           >
//             <Text
//               style={
//                 styles.scoreLabel
//               }
//             >
//               {t(
//                 'games.floodRunner.score'
//               )}
//             </Text>

//             <Text
//               style={
//                 styles.scoreValue
//               }
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
//         </View>

//         {/* CONTROLS */}

//         {gameStarted &&
//           !gameOver &&
//           !hasWon && (
//             <View
//               style={
//                 styles.controls
//               }
//             >
//               <TouchableOpacity
//                 style={
//                   styles.controlButton
//                 }
//                 onPress={() =>
//                   movePlayer(
//                     'left'
//                   )
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
//                   numberOfLines={2}
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
//                   numberOfLines={2}
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
//                   movePlayer(
//                     'right'
//                   )
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
//                   numberOfLines={2}
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

// /*
// |--------------------------------------------------------------------------
// | INSTRUCTION ROW
// |--------------------------------------------------------------------------
// */

// function InstructionRow({
//   icon,
//   text,
// }) {
//   return (
//     <View
//       style={
//         styles.instructionRow
//       }
//     >
//       <View
//         style={
//           styles.instructionIcon
//         }
//       >
//         <Ionicons
//           name={icon}
//           size={16}
//           color="#38BDF8"
//         />
//       </View>

//       <Text
//         style={
//           styles.instructionText
//         }
//       >
//         {text}
//       </Text>
//     </View>
//   );
// }

// /*
// |--------------------------------------------------------------------------
// | REWARD
// |--------------------------------------------------------------------------
// */

// function Reward({
//   icon,
//   value,
//   label,
// }) {
//   return (
//     <View
//       style={styles.reward}
//     >
//       <Ionicons
//         name={icon}
//         size={18}
//         color="#FBBF24"
//       />

//       <Text
//         style={
//           styles.rewardValue
//         }
//       >
//         {value}
//       </Text>

//       <Text
//         style={
//           styles.rewardLabel
//         }
//       >
//         {label}
//       </Text>
//     </View>
//   );
// }

// /*
// |--------------------------------------------------------------------------
// | STYLES
// |--------------------------------------------------------------------------
// */

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: '#020617',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 8,
//   },

//   modalContentCard: {
//     backgroundColor: '#0F172A',
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     borderRadius: 22,
//     padding: 12,
//     maxWidth: 430,
//     maxHeight: '98%',
//   },

//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },

//   headerTitleArea: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },

//   headerIcon: {
//     width: 38,
//     height: 38,
//     borderRadius: 12,
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
//     fontSize: 17,
//     fontWeight: '900',
//   },

//   levelLabel: {
//     color: '#38BDF8',
//     fontSize: 11,
//     fontWeight: '800',
//     marginTop: 3,
//   },

//   objectiveCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#052E16',
//     borderWidth: 1,
//     borderColor: '#166534',
//     borderRadius: 13,
//     padding: 10,
//     marginBottom: 8,
//   },

//   objectiveIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     backgroundColor: '#064E3B',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 10,
//   },

//   objectiveTextArea: {
//     flex: 1,
//   },

//   objectiveTitle: {
//     color: '#34D399',
//     fontSize: 11,
//     fontWeight: '900',
//     textTransform: 'uppercase',
//   },

//   objectiveText: {
//     color: '#A7F3D0',
//     fontSize: 11,
//     lineHeight: 16,
//     marginTop: 2,
//   },

//   instructionsCard: {
//     backgroundColor: '#111827',
//     borderWidth: 1,
//     borderColor: '#334155',
//     borderRadius: 14,
//     padding: 11,
//     marginBottom: 8,
//   },

//   instructionsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },

//   instructionsTitle: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '900',
//     marginLeft: 7,
//   },

//   instructionRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginTop: 6,
//   },

//   instructionIcon: {
//     width: 25,
//     height: 25,
//     borderRadius: 8,
//     backgroundColor: '#082F49',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 8,
//   },

//   instructionText: {
//     flex: 1,
//     color: '#CBD5E1',
//     fontSize: 11,
//     lineHeight: 16,
//     paddingTop: 3,
//   },

//   sensorStatus: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//     backgroundColor: '#020617',
//     paddingHorizontal: 9,
//     paddingVertical: 5,
//     borderRadius: 8,
//     marginBottom: 8,
//   },

//   sensorText: {
//     fontSize: 10,
//     fontWeight: '800',
//     marginLeft: 6,
//   },

//   gameCanvas: {
//     backgroundColor: '#020617',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     position: 'relative',
//     overflow: 'hidden',
//   },

//   safeZone: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: SAFE_ZONE_HEIGHT,
//     backgroundColor: '#064E3B',
//     borderBottomWidth: 1,
//     borderBottomColor: '#10B981',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 14,
//     zIndex: 4,
//   },

//   safeZoneIcon: {
//     width: 34,
//     height: 34,
//     borderRadius: 10,
//     backgroundColor: '#065F46',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 9,
//   },

//   safeZoneTitle: {
//     color: '#D1FAE5',
//     fontSize: 11,
//     fontWeight: '900',
//     letterSpacing: 0.5,
//   },

//   safeZoneSub: {
//     color: '#6EE7B7',
//     fontSize: 9,
//     fontWeight: '700',
//     marginTop: 2,
//   },

//   dangerField: {
//     position: 'absolute',
//     top: SAFE_ZONE_HEIGHT,
//     bottom: FLOOD_HEIGHT,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   routeLine: {
//     position: 'absolute',
//     width: 2,
//     height: '100%',
//     backgroundColor: '#1E293B',
//     opacity: 0.8,
//   },

//   dangerText: {
//     color: '#334155',
//     fontSize: 8,
//     fontWeight: '900',
//     letterSpacing: 1.5,
//     transform: [
//       {
//         rotate: '-90deg',
//       },
//     ],
//   },

//   debrisNode: {
//     position: 'absolute',
//     width: DEBRIS_SIZE,
//     height: DEBRIS_SIZE,
//     borderRadius:
//       DEBRIS_SIZE / 2,
//     backgroundColor: '#450A0A',
//     borderWidth: 1,
//     borderColor: '#EF4444',
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 5,
//   },

//   playerNode: {
//     position: 'absolute',
//     width: PLAYER_SIZE,
//     height: PLAYER_SIZE,
//     borderRadius:
//       PLAYER_SIZE / 2,
//     backgroundColor: '#2563EB',
//     borderWidth: 2,
//     borderColor: '#60A5FA',
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 6,
//   },

//   floodLayer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: FLOOD_HEIGHT,
//     backgroundColor: '#075985',
//     borderTopWidth: 1,
//     borderTopColor: '#38BDF8',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 3,
//   },

//   waveContainer: {
//     position: 'absolute',
//     top: -13,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },

//   wave: {
//     color: '#38BDF8',
//     fontSize: 24,
//     fontWeight: '900',
//   },

//   floodLabel: {
//     color: '#BAE6FD',
//     fontSize: 9,
//     fontWeight: '900',
//     letterSpacing: 2,
//     marginTop: 12,
//   },

//   startOverlay: {
//     position: 'absolute',
//     top: SAFE_ZONE_HEIGHT,
//     bottom: FLOOD_HEIGHT,
//     left: 0,
//     right: 0,
//     backgroundColor:
//       'rgba(2, 6, 23, 0.94)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     zIndex: 20,
//   },

//   startIcon: {
//     width: 62,
//     height: 62,
//     borderRadius: 20,
//     backgroundColor: '#082F49',
//     borderWidth: 1,
//     borderColor: '#0369A1',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },

//   startTitle: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: '900',
//     textAlign: 'center',
//   },

//   startDescription: {
//     color: '#94A3B8',
//     fontSize: 12,
//     lineHeight: 18,
//     textAlign: 'center',
//     marginTop: 6,
//     maxWidth: 250,
//   },

//   startButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#0284C7',
//     borderRadius: 12,
//     minHeight: 48,
//     paddingHorizontal: 22,
//     marginTop: 16,
//   },

//   startButtonText: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '900',
//     marginLeft: 7,
//   },

//   countdownOverlay: {
//     position: 'absolute',
//     top: SAFE_ZONE_HEIGHT,
//     bottom: FLOOD_HEIGHT,
//     left: 0,
//     right: 0,
//     backgroundColor:
//       'rgba(2, 6, 23, 0.85)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 30,
//   },

//   countdownNumber: {
//     color: '#38BDF8',
//     fontSize: 64,
//     fontWeight: '900',
//   },

//   countdownText: {
//     color: '#CBD5E1',
//     fontSize: 12,
//     fontWeight: '800',
//     marginTop: 2,
//   },

//   endGameOverlay: {
//     position: 'absolute',
//     top: SAFE_ZONE_HEIGHT + 8,
//     bottom: FLOOD_HEIGHT + 8,
//     left: 10,
//     right: 10,
//     backgroundColor:
//       'rgba(15, 23, 42, 0.98)',
//     borderWidth: 1,
//     borderColor: '#334155',
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 18,
//     zIndex: 30,
//   },

//   resultIcon: {
//     width: 64,
//     height: 64,
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },

//   gameOverTitle: {
//     color: '#EF4444',
//     fontWeight: '900',
//     fontSize: 20,
//     textAlign: 'center',
//   },

//   successTitle: {
//     color: '#10B981',
//     fontWeight: '900',
//     fontSize: 20,
//     textAlign: 'center',
//   },

//   gameOverText: {
//     color: '#94A3B8',
//     fontSize: 11,
//     textAlign: 'center',
//     lineHeight: 17,
//     marginTop: 7,
//     maxWidth: 250,
//   },

//   finalScore: {
//     color: '#FFFFFF',
//     fontSize: 24,
//     fontWeight: '900',
//     marginTop: 12,
//   },

//   retryButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#DC2626',
//     minHeight: 44,
//     paddingHorizontal: 20,
//     borderRadius: 11,
//     marginTop: 14,
//   },

//   claimRewardButton: {
//     flexDirection: 'row',
//     backgroundColor: '#059669',
//     minHeight: 46,
//     paddingHorizontal: 22,
//     borderRadius: 11,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 14,
//   },

//   buttonText: {
//     color: '#FFFFFF',
//     fontWeight: '900',
//     fontSize: 12,
//     marginLeft: 6,
//   },

//   rewardRow: {
//     flexDirection: 'row',
//     marginTop: 14,
//     gap: 10,
//   },

//   reward: {
//     minWidth: 78,
//     backgroundColor: '#111827',
//     borderWidth: 1,
//     borderColor: '#334155',
//     borderRadius: 10,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     alignItems: 'center',
//   },

//   rewardValue: {
//     color: '#FBBF24',
//     fontSize: 16,
//     fontWeight: '900',
//     marginTop: 2,
//   },

//   rewardLabel: {
//     color: '#64748B',
//     fontSize: 8,
//     fontWeight: '800',
//     marginTop: 1,
//   },

//   gameHud: {
//     marginTop: 9,
//   },

//   scoreHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },

//   scoreLabel: {
//     color: '#64748B',
//     fontSize: 9,
//     fontWeight: '900',
//     letterSpacing: 1,
//   },

//   scoreValue: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '900',
//   },

//   progressBackground: {
//     height: 6,
//     width: '100%',
//     backgroundColor: '#1E293B',
//     borderRadius: 3,
//     overflow: 'hidden',
//     marginTop: 5,
//   },

//   progressFill: {
//     height: '100%',
//     backgroundColor: '#38BDF8',
//     borderRadius: 3,
//   },

//   controls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 9,
//     gap: 8,
//   },

//   controlButton: {
//     flex: 1,
//     minHeight: 54,
//     backgroundColor: '#1E3A8A',
//     borderWidth: 1,
//     borderColor: '#3B82F6',
//     borderRadius: 13,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 5,
//   },

//   controlText: {
//     color: '#BFDBFE',
//     fontSize: 8,
//     fontWeight: '900',
//     marginTop: 2,
//     textAlign: 'center',
//   },

//   controlHint: {
//     width: 54,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   controlHintText: {
//     color: '#38BDF8',
//     fontSize: 7,
//     fontWeight: '900',
//     marginTop: 3,
//     textAlign: 'center',
//   },
// });




// FloodRunnerGameModal.js

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Accelerometer } from 'expo-sensors';
import { useTranslation } from 'react-i18next';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

/*
|--------------------------------------------------------------------------
| LEVEL CONFIGURATION
|--------------------------------------------------------------------------
*/

const LEVEL_CONFIG = {
  1: {
    nameKey: 'games.floodRunner.levels.easy',

    targetScore: 50,

    debrisSpeed: 155,
    spawnInterval: 1150,
    spawnCount: 1,

    playerSpeed: 300,

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

    playerSpeed: 340,

    reward: {
      xp: 150,
      coins: 40,
    },
  },

  3: {
    nameKey: 'games.floodRunner.levels.advanced',

    targetScore: 100,

    debrisSpeed: 255,
    spawnInterval: 750,
    spawnCount: 3,

    playerSpeed: 380,

    reward: {
      xp: 200,
      coins: 60,
    },
  },
};

/*
|--------------------------------------------------------------------------
| GAME CONSTANTS
|--------------------------------------------------------------------------
*/

const PLAYER_SIZE = 36;
const DEBRIS_SIZE = 28;

const SAFE_ZONE_HEIGHT = 56;
const FLOOD_HEIGHT = 64;

const PLAYER_BOTTOM_OFFSET = 14;

const COLLISION_PADDING = 5;

const TOUCH_MOVE_MULTIPLIER = 0.22;

const SENSOR_DEAD_ZONE = 0.05;

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function FloodRunnerGameModal() {
  const { t } = useTranslation();

  const navigation = useNavigation();
  const route = useRoute();

  /*
  |--------------------------------------------------------------------------
  | LEVEL
  |--------------------------------------------------------------------------
  */

  const routeLevel = route?.params?.level ?? 1;

  const selectedLevel = Math.min(
    3,
    Math.max(
      1,
      Number(routeLevel) || 1
    )
  );

  const config = LEVEL_CONFIG[selectedLevel];

  /*
  |--------------------------------------------------------------------------
  | GAME DIMENSIONS
  |--------------------------------------------------------------------------
  */

  const GAME_WIDTH = Math.min(
    SCREEN_WIDTH - 32,
    390
  );

  const GAME_HEIGHT = Math.min(
    SCREEN_HEIGHT * 0.52,
    430
  );

  const INITIAL_PLAYER_X =
    GAME_WIDTH / 2 -
    PLAYER_SIZE / 2;

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [gameStarted, setGameStarted] =
    useState(false);

  const [countdown, setCountdown] =
    useState(null);

  const [playerPositionX, setPlayerPositionX] =
    useState(INITIAL_PLAYER_X);

  const [debris, setDebris] =
    useState([]);

  const [score, setScore] =
    useState(0);

  const [gameOver, setGameOver] =
    useState(false);

  const [hasWon, setHasWon] =
    useState(false);

  const [sensorAvailable, setSensorAvailable] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | REFS
  |--------------------------------------------------------------------------
  */

  const playerXRef = useRef(
    INITIAL_PLAYER_X
  );

  const debrisRef = useRef([]);

  const scoreRef = useRef(0);

  const gameRunningRef =
    useRef(false);

  const gameOverRef =
    useRef(false);

  const hasWonRef =
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
   * Prevents an old animation frame from
   * accidentally continuing after restart.
   */
  const gameSessionRef =
    useRef(0);

  /*
  |--------------------------------------------------------------------------
  | HAPTICS
  |--------------------------------------------------------------------------
  */

  const safeImpact = useCallback(
    async (style) => {
      try {
        await Haptics.impactAsync(style);
      } catch (error) {
        // Haptics may be unavailable on some devices.
      }
    },
    []
  );

  const safeNotification =
    useCallback(async (type) => {
      try {
        await Haptics.notificationAsync(type);
      } catch (error) {
        // Haptics may be unavailable.
      }
    }, []);

  /*
  |--------------------------------------------------------------------------
  | CLAMP PLAYER
  |--------------------------------------------------------------------------
  */

  const clampPlayerX = useCallback(
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

  /*
  |--------------------------------------------------------------------------
  | CREATE DEBRIS
  |--------------------------------------------------------------------------
  */

  const createDebrisObject =
    useCallback(
      (y = -DEBRIS_SIZE) => {
        return {
          id:
            `${Date.now()}-${Math.random()}`,

          x:
            Math.random() *
            Math.max(
              1,
              GAME_WIDTH - DEBRIS_SIZE
            ),

          y,
        };
      },
      [GAME_WIDTH]
    );

  /*
  |--------------------------------------------------------------------------
  | CREATE INITIAL DEBRIS
  |--------------------------------------------------------------------------
  */

  const createInitialDebris =
    useCallback(() => {
      const objects = [];

      /*
       * Start debris at different heights so
       * the player has time to react.
       */

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
            Math.random() * 100,
        });
      }

      return objects;
    }, [
      config.spawnCount,
      GAME_WIDTH,
    ]);

  /*
  |--------------------------------------------------------------------------
  | STOP SENSOR
  |--------------------------------------------------------------------------
  */

  const stopSensor = useCallback(() => {
    if (
      sensorSubscriptionRef.current
    ) {
      try {
        sensorSubscriptionRef.current.remove();
      } catch (error) {
        // Ignore cleanup errors.
      }

      sensorSubscriptionRef.current =
        null;
    }

    movementRef.current = 0;
  }, []);

  /*
  |--------------------------------------------------------------------------
  | STOP GAME LOOP
  |--------------------------------------------------------------------------
  */

  const stopGameLoop = useCallback(() => {
    gameRunningRef.current =
      false;

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

    lastFrameTimeRef.current =
      null;
  }, []);

  /*
  |--------------------------------------------------------------------------
  | RESET GAME
  |--------------------------------------------------------------------------
  */

  const resetGame = useCallback(() => {
    /*
     * Stop countdown.
     */

    if (
      countdownTimerRef.current
    ) {
      clearInterval(
        countdownTimerRef.current
      );

      countdownTimerRef.current =
        null;
    }

    /*
     * Stop gameplay.
     */

    stopGameLoop();
    stopSensor();

    /*
     * Reset refs.
     */

    playerXRef.current =
      INITIAL_PLAYER_X;

    debrisRef.current = [];

    scoreRef.current = 0;

    gameRunningRef.current =
      false;

    gameOverRef.current =
      false;

    hasWonRef.current =
      false;

    movementRef.current = 0;

    lastFrameTimeRef.current =
      null;

    lastSpawnTimeRef.current =
      0;

    /*
     * Reset state.
     */

    setGameStarted(false);
    setCountdown(null);
    setPlayerPositionX(
      INITIAL_PLAYER_X
    );
    setDebris([]);
    setScore(0);
    setGameOver(false);
    setHasWon(false);
  }, [
    INITIAL_PLAYER_X,
    stopGameLoop,
    stopSensor,
  ]);

  /*
  |--------------------------------------------------------------------------
  | FINISH GAME
  |--------------------------------------------------------------------------
  */

  const finishGame =
    useCallback(() => {
      if (
        !gameRunningRef.current ||
        gameOverRef.current ||
        hasWonRef.current
      ) {
        return;
      }

      gameRunningRef.current =
        false;

      gameOverRef.current =
        true;

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

      lastFrameTimeRef.current =
        null;

      setGameOver(true);

      safeNotification(
        Haptics.NotificationFeedbackType
          .Error
      );
    }, [
      safeNotification,
      stopSensor,
    ]);

  /*
  |--------------------------------------------------------------------------
  | WIN GAME
  |--------------------------------------------------------------------------
  */

  const winGame =
    useCallback(() => {
      if (
        hasWonRef.current ||
        gameOverRef.current
      ) {
        return;
      }

      gameRunningRef.current =
        false;

      hasWonRef.current =
        true;

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

      lastFrameTimeRef.current =
        null;

      safeNotification(
        Haptics.NotificationFeedbackType
          .Success
      );
    }, [
      config.targetScore,
      safeNotification,
      stopSensor,
    ]);

  /*
  |--------------------------------------------------------------------------
  | COLLISION
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | GAME LOOP
  |--------------------------------------------------------------------------
  */

  const runGameLoop =
    useCallback(
      (timestamp, sessionId) => {
        /*
         * Ignore an animation frame belonging
         * to an old game session.
         */

        if (
          sessionId !==
          gameSessionRef.current
        ) {
          return;
        }

        if (
          !gameRunningRef.current ||
          gameOverRef.current ||
          hasWonRef.current
        ) {
          return;
        }

        /*
         * First frame.
         */

        if (
          lastFrameTimeRef.current ===
          null
        ) {
          lastFrameTimeRef.current =
            timestamp;
        }

        /*
         * Cap delta so the game doesn't
         * jump after a frame-rate drop.
         */

        const delta = Math.min(
          timestamp -
            lastFrameTimeRef.current,
          50
        ) / 1000;

        lastFrameTimeRef.current =
          timestamp;

        /*
         |--------------------------------------------------------------------------
         | PLAYER MOVEMENT
         |--------------------------------------------------------------------------
         */

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

        /*
         |--------------------------------------------------------------------------
         | MOVE DEBRIS
         |--------------------------------------------------------------------------
         */

        const movedDebris =
          debrisRef.current.map(
            (item) => ({
              ...item,

              y:
                item.y +
                config.debrisSpeed *
                  delta,
            })
          );

        /*
         |--------------------------------------------------------------------------
         | COLLISION
         |--------------------------------------------------------------------------
         */

        const collision =
          movedDebris.some(
            (item) =>
              checkCollision(
                nextPlayerX,
                item
              )
          );

        if (collision) {
          debrisRef.current =
            movedDebris;

          setDebris(
            movedDebris
          );

          finishGame();

          return;
        }

        /*
         |--------------------------------------------------------------------------
         | SCORE
         |--------------------------------------------------------------------------
         */

        let passedCount = 0;

        const survivingDebris =
          movedDebris.filter(
            (item) => {
              if (
                item.y >
                GAME_HEIGHT
              ) {
                passedCount += 1;
                return false;
              }

              return true;
            }
          );

        if (
          passedCount > 0
        ) {
          const nextScore =
            Math.min(
              config.targetScore,
              scoreRef.current +
                passedCount * 10
            );

          scoreRef.current =
            nextScore;

          setScore(nextScore);

          /*
           * Win immediately once the
           * target has been reached.
           */

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

        /*
         |--------------------------------------------------------------------------
         | SPAWN
         |--------------------------------------------------------------------------
         */

        if (
          timestamp -
            lastSpawnTimeRef.current >=
          config.spawnInterval
        ) {
          lastSpawnTimeRef.current =
            timestamp;

          /*
           * Only spawn if we haven't
           * reached the configured number
           * of active obstacles.
           */

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
         * Safety limit.
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

        /*
         |--------------------------------------------------------------------------
         | NEXT FRAME
         |--------------------------------------------------------------------------
         */

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
        clampPlayerX,
        config.debrisSpeed,
        config.playerSpeed,
        config.spawnCount,
        config.spawnInterval,
        config.targetScore,
        createDebrisObject,
        finishGame,
        GAME_HEIGHT,
        checkCollision,
        winGame,
      ]
    );

  /*
  |--------------------------------------------------------------------------
  | BEGIN GAME
  |--------------------------------------------------------------------------
  */

  const beginGame =
    useCallback(() => {
      /*
       * Create a new session.
       */

      const sessionId =
        gameSessionRef.current + 1;

      gameSessionRef.current =
        sessionId;

      /*
       * Stop any previous frame.
       */

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

      /*
       * Initial player.
       */

      playerXRef.current =
        INITIAL_PLAYER_X;

      /*
       * Initial obstacles.
       */

      const initialDebris =
        createInitialDebris();

      debrisRef.current =
        initialDebris;

      /*
       * Reset game refs.
       */

      scoreRef.current = 0;

      gameRunningRef.current =
        true;

      gameOverRef.current =
        false;

      hasWonRef.current =
        false;

      movementRef.current = 0;

      lastFrameTimeRef.current =
        null;

      lastSpawnTimeRef.current =
        performance.now();

      /*
       * Update UI.
       */

      setPlayerPositionX(
        INITIAL_PLAYER_X
      );

      setDebris(
        initialDebris
      );

      setScore(0);

      setGameOver(false);

      setHasWon(false);

      setGameStarted(true);

      safeNotification(
        Haptics.NotificationFeedbackType
          .Success
      );

      /*
       * Start loop.
       */

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

  /*
  |--------------------------------------------------------------------------
  | START GAME
  |--------------------------------------------------------------------------
  */

  const startGame =
    useCallback(() => {
      /*
       * Don't allow multiple starts.
       */

      if (
        gameRunningRef.current ||
        countdown !== null
      ) {
        return;
      }

      /*
       * Clear any previous timer.
       */

      if (
        countdownTimerRef.current
      ) {
        clearInterval(
          countdownTimerRef.current
        );

        countdownTimerRef.current =
          null;
      }

      /*
       * Reset gameplay state,
       * but keep the start screen hidden
       * while counting down.
       */

      stopGameLoop();
      stopSensor();

      playerXRef.current =
        INITIAL_PLAYER_X;

      debrisRef.current = [];

      scoreRef.current = 0;

      gameOverRef.current =
        false;

      hasWonRef.current =
        false;

      gameRunningRef.current =
        false;

      setPlayerPositionX(
        INITIAL_PLAYER_X
      );

      setDebris([]);

      setScore(0);

      setGameOver(false);

      setHasWon(false);

      setGameStarted(false);

      /*
       * Countdown.
       */

      let count = 3;

      setCountdown(count);

      safeImpact(
        Haptics.ImpactFeedbackStyle
          .Light
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
            Haptics.ImpactFeedbackStyle
              .Light
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

  /*
  |--------------------------------------------------------------------------
  | TOUCH MOVEMENT
  |--------------------------------------------------------------------------
  */

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
        } else if (
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
          Haptics.ImpactFeedbackStyle
            .Light
        );
      },
      [
        clampPlayerX,
        config.playerSpeed,
        safeImpact,
      ]
    );

  /*
  |--------------------------------------------------------------------------
  | ACCELEROMETER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const setupAccelerometer =
      async () => {
        /*
         * Only use the sensor while
         * the game is actually active.
         */

        if (
          !gameStarted ||
          gameOver ||
          hasWon
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
            setSensorAvailable(false);
            return;
          }

          setSensorAvailable(true);

          Accelerometer.setUpdateInterval(
            50
          );

          /*
           * Remove an older subscription
           * before creating another one.
           */

          stopSensor();

          sensorSubscriptionRef.current =
            Accelerometer.addListener(
              (data) => {
                if (
                  !gameRunningRef.current
                ) {
                  return;
                }

                /*
                 * X-axis is used for
                 * left/right movement.
                 */

                const value =
                  Number(data?.x) || 0;

                movementRef.current =
                  Math.max(
                    -1,
                    Math.min(
                      1,
                      value
                    )
                  );
              }
            );
        } catch (error) {
          console.log(
            'FloodRunner accelerometer error:',
            error
          );

          if (mounted) {
            setSensorAvailable(false);
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
    stopSensor,
  ]);

  /*
  |--------------------------------------------------------------------------
  | BACK BUTTON
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const subscription =
      BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          /*
           * Prevent leaving while the
           * game or countdown is active.
           */

          if (
            gameRunningRef.current ||
            countdown !== null
          ) {
            return true;
          }

          return false;
        }
      );

    return () => {
      subscription.remove();
    };
  }, [
    countdown,
  ]);

  /*
  |--------------------------------------------------------------------------
  | SCREEN CLEANUP
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      /*
       * Countdown.
       */

      if (
        countdownTimerRef.current
      ) {
        clearInterval(
          countdownTimerRef.current
        );

        countdownTimerRef.current =
          null;
      }

      /*
       * Animation.
       */

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

      /*
       * Sensor.
       */

      if (
        sensorSubscriptionRef.current
      ) {
        try {
          sensorSubscriptionRef.current.remove();
        } catch (error) {
          // Ignore.
        }

        sensorSubscriptionRef.current =
          null;
      }

      gameRunningRef.current =
        false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CLAIM REWARD
  |--------------------------------------------------------------------------
  */

  const handleClaimReward =
    useCallback(() => {
      if (
        !hasWonRef.current
      ) {
        return;
      }

      /*
       * Your XP/coins system can be
       * connected here later.
       */

      resetGame();

      navigation.goBack();
    }, [
      navigation,
      resetGame,
    ]);

  /*
  |--------------------------------------------------------------------------
  | PROGRESS
  |--------------------------------------------------------------------------
  */

  const progressPercentage =
    Math.min(
      100,
      (score /
        config.targetScore) *
        100
    );

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <View
      style={styles.screen}
    >
      <View
        style={[
          styles.modalContentCard,
          {
            width:
              Math.min(
                GAME_WIDTH + 32,
                SCREEN_WIDTH - 16
              ),
          },
        ]}
      >
        {/* HEADER */}

        <View
          style={styles.modalHeader}
        >
          <View
            style={
              styles.headerTitleArea
            }
          >
            <View
              style={
                styles.headerIcon
              }
            >
              <Ionicons
                name="water"
                size={20}
                color="#38BDF8"
              />
            </View>

            <View
              style={
                styles.headerTextArea
              }
            >
              <Text
                style={
                  styles.modalTitle
                }
              >
                {t(
                  'games.floodRunner.title'
                )}
              </Text>

              <Text
                style={
                  styles.levelLabel
                }
              >
                {t(
                  'games.floodRunner.level',
                  {
                    level:
                      selectedLevel,
                  }
                )}{' '}
                •{' '}
                {t(
                  config.nameKey
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* OBJECTIVE */}

        <View
          style={
            styles.objectiveCard
          }
        >
          <View
            style={
              styles.objectiveIcon
            }
          >
            <Ionicons
              name="flag"
              size={18}
              color="#34D399"
            />
          </View>

          <View
            style={
              styles.objectiveTextArea
            }
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

        {/* INSTRUCTIONS */}

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
            </View>
          )}

        {/* SENSOR STATUS */}

        {gameStarted &&
          !gameOver &&
          !hasWon && (
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
            </View>
          )}

        {/* GAME AREA */}

        <View
          style={[
            styles.gameCanvas,
            {
              width:
                GAME_WIDTH,
              height:
                GAME_HEIGHT,
            },
          ]}
        >
          {/* SAFE ZONE */}

          <View
            style={
              styles.safeZone
            }
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
            style={
              styles.dangerField
            }
          >
            <View
              style={
                styles.routeLine
              }
            />

            <Text
              style={
                styles.dangerText
              }
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
            debris.map(
              (item) => (
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
              )
            )}

          {/* PLAYER */}

          {gameStarted &&
            !gameOver &&
            !hasWon && (
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
            style={
              styles.floodLayer
            }
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
                  activeOpacity={0.8}
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

          {/* GAME OVER */}

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
                {config.targetScore}
              </Text>

              <TouchableOpacity
                style={
                  styles.retryButton
                }
                onPress={
                  startGame
                }
                activeOpacity={0.8}
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

          {/* WIN */}

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
                  value={`+${config.reward.xp}`}
                  label={t(
                    'games.floodRunner.xp'
                  )}
                />

                <Reward
                  icon="cash"
                  value={`+${config.reward.coins}`}
                  label={t(
                    'games.floodRunner.coins'
                  )}
                />
              </View>

              <TouchableOpacity
                style={
                  styles.claimRewardButton
                }
                onPress={
                  handleClaimReward
                }
                activeOpacity={0.8}
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
                  {t(
                    'games.floodRunner.claimReward'
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* SCORE */}

        <View
          style={styles.gameHud}
        >
          <View
            style={
              styles.scoreHeader
            }
          >
            <Text
              style={
                styles.scoreLabel
              }
            >
              {t(
                'games.floodRunner.score'
              )}
            </Text>

            <Text
              style={
                styles.scoreValue
              }
            >
              {score} /{' '}
              {config.targetScore}
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
        </View>

        {/* CONTROLS */}

        {gameStarted &&
          !gameOver &&
          !hasWon && (
            <View
              style={
                styles.controls
              }
            >
              <TouchableOpacity
                style={
                  styles.controlButton
                }
                onPress={() =>
                  movePlayer('left')
                }
                activeOpacity={0.7}
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
                  numberOfLines={2}
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
                  numberOfLines={2}
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
                  movePlayer('right')
                }
                activeOpacity={0.7}
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
                  numberOfLines={2}
                >
                  {t(
                    'games.floodRunner.right'
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          )}
      </View>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| INSTRUCTION ROW
|--------------------------------------------------------------------------
*/

function InstructionRow({
  icon,
  text,
}) {
  return (
    <View
      style={
        styles.instructionRow
      }
    >
      <View
        style={
          styles.instructionIcon
        }
      >
        <Ionicons
          name={icon}
          size={16}
          color="#38BDF8"
        />
      </View>

      <Text
        style={
          styles.instructionText
        }
      >
        {text}
      </Text>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| REWARD
|--------------------------------------------------------------------------
*/

function Reward({
  icon,
  value,
  label,
}) {
  return (
    <View
      style={styles.reward}
    >
      <Ionicons
        name={icon}
        size={18}
        color="#FBBF24"
      />

      <Text
        style={
          styles.rewardValue
        }
      >
        {value}
      </Text>

      <Text
        style={
          styles.rewardLabel
        }
      >
        {label}
      </Text>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },

  modalContentCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 22,
    padding: 12,
    maxWidth: 430,
    maxHeight: '98%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  headerTitleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#082F49',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  headerTextArea: {
    flex: 1,
  },

  modalTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  levelLabel: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },

  objectiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#052E16',
    borderWidth: 1,
    borderColor: '#166534',
    borderRadius: 13,
    padding: 10,
    marginBottom: 8,
  },

  objectiveIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  objectiveTextArea: {
    flex: 1,
  },

  objectiveTitle: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  objectiveText: {
    color: '#A7F3D0',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },

  instructionsCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 11,
    marginBottom: 8,
  },

  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  instructionsTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 7,
  },

  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },

  instructionIcon: {
    width: 25,
    height: 25,
    borderRadius: 8,
    backgroundColor: '#082F49',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  instructionText: {
    flex: 1,
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
    paddingTop: 3,
  },

  sensorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#020617',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 8,
  },

  sensorText: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 6,
  },

  gameCanvas: {
    backgroundColor: '#020617',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    position: 'relative',
    overflow: 'hidden',
  },

  safeZone: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SAFE_ZONE_HEIGHT,
    backgroundColor: '#064E3B',
    borderBottomWidth: 1,
    borderBottomColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    zIndex: 4,
  },

  safeZoneIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#065F46',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  safeZoneTitle: {
    color: '#D1FAE5',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  safeZoneSub: {
    color: '#6EE7B7',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },

  dangerField: {
    position: 'absolute',
    top: SAFE_ZONE_HEIGHT,
    bottom: FLOOD_HEIGHT,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  routeLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#1E293B',
    opacity: 0.8,
  },

  dangerText: {
    color: '#334155',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
    transform: [
      {
        rotate: '-90deg',
      },
    ],
  },

  debrisNode: {
    position: 'absolute',
    width: DEBRIS_SIZE,
    height: DEBRIS_SIZE,
    borderRadius:
      DEBRIS_SIZE / 2,
    backgroundColor: '#450A0A',
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },

  playerNode: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius:
      PLAYER_SIZE / 2,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#60A5FA',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
  },

  floodLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: FLOOD_HEIGHT,
    backgroundColor: '#075985',
    borderTopWidth: 1,
    borderTopColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },

  waveContainer: {
    position: 'absolute',
    top: -13,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  wave: {
    color: '#38BDF8',
    fontSize: 24,
    fontWeight: '900',
  },

  floodLabel: {
    color: '#BAE6FD',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 12,
  },

  startOverlay: {
    position: 'absolute',
    top: SAFE_ZONE_HEIGHT,
    bottom: FLOOD_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor:
      'rgba(2, 6, 23, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 20,
  },

  startIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#082F49',
    borderWidth: 1,
    borderColor: '#0369A1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  startTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },

  startDescription: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 250,
  },

  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 22,
    marginTop: 16,
  },

  startButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 7,
  },

  countdownOverlay: {
    position: 'absolute',
    top: SAFE_ZONE_HEIGHT,
    bottom: FLOOD_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor:
      'rgba(2, 6, 23, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },

  countdownNumber: {
    color: '#38BDF8',
    fontSize: 64,
    fontWeight: '900',
  },

  countdownText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },

  endGameOverlay: {
    position: 'absolute',
    top: SAFE_ZONE_HEIGHT + 8,
    bottom: FLOOD_HEIGHT + 8,
    left: 10,
    right: 10,
    backgroundColor:
      'rgba(15, 23, 42, 0.98)',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    zIndex: 30,
  },

  resultIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  gameOverTitle: {
    color: '#EF4444',
    fontWeight: '900',
    fontSize: 20,
    textAlign: 'center',
  },

  successTitle: {
    color: '#10B981',
    fontWeight: '900',
    fontSize: 20,
    textAlign: 'center',
  },

  gameOverText: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 7,
    maxWidth: 250,
  },

  finalScore: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 12,
  },

  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: 11,
    marginTop: 14,
  },

  claimRewardButton: {
    flexDirection: 'row',
    backgroundColor: '#059669',
    minHeight: 46,
    paddingHorizontal: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    marginLeft: 6,
  },

  rewardRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },

  reward: {
    minWidth: 78,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },

  rewardValue: {
    color: '#FBBF24',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },

  rewardLabel: {
    color: '#64748B',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 1,
  },

  gameHud: {
    marginTop: 9,
  },

  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  scoreLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  scoreValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  progressBackground: {
    height: 6,
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 5,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 3,
  },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
    gap: 8,
  },

  controlButton: {
    flex: 1,
    minHeight: 54,
    backgroundColor: '#1E3A8A',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  controlText: {
    color: '#BFDBFE',
    fontSize: 8,
    fontWeight: '900',
    marginTop: 2,
    textAlign: 'center',
  },

  controlHint: {
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },

  controlHintText: {
    color: '#38BDF8',
    fontSize: 7,
    fontWeight: '900',
    marginTop: 3,
    textAlign: 'center',
  },
});
