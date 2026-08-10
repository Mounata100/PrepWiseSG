// components/FloodRunnerGameModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Accelerometer } from 'expo-sensors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FloodRunnerGameModal({ visible, onClose, onWin }) {
  const GAME_WIDTH = SCREEN_WIDTH - 64;
  const PLAYER_SIZE = 30;
  
  const [playerPositionX, setPlayerPositionX] = useState(GAME_WIDTH / 2 - PLAYER_SIZE / 2);
  const [debrisY, setDebrisY] = useState(0);
  const [debrisX, setDebrisX] = useState(Math.random() * (GAME_WIDTH - 20));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    let subscription;
    if (visible && !gameOver && !hasWon) {
      Accelerometer.setUpdateInterval(30);
      subscription = Accelerometer.addListener(data => {
        setPlayerPositionX(prevX => {
          let nextX = prevX + data.x * 18;
          if (nextX < 0) return 0;
          if (nextX > GAME_WIDTH - PLAYER_SIZE) return GAME_WIDTH - PLAYER_SIZE;
          return nextX;
        });
      });
    }
    return () => subscription && subscription.remove();
  }, [visible, gameOver, hasWon]);

  useEffect(() => {
    let gameInterval;
    if (visible && !gameOver && !hasWon) {
      gameInterval = setInterval(() => {
        setDebrisY(prevY => {
          if (prevY > 260) {
            setScore(s => {
              const newScore = s + 10;
              if (newScore >= 50) {
                setHasWon(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
              return newScore;
            });
            setDebrisX(Math.random() * (GAME_WIDTH - 20));
            return 0;
          }
          return prevY + 12;
        });
      }, 30);
    }
    return () => clearInterval(gameInterval);
  }, [visible, gameOver, hasWon, debrisX]);

  useEffect(() => {
    if (debrisY > 210 && debrisY < 250) {
      const playerCenter = playerPositionX + PLAYER_SIZE / 2;
      const debrisCenter = debrisX + 10;
      if (Math.abs(playerCenter - debrisCenter) < 22) {
        setGameOver(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    }
  }, [debrisY, playerPositionX, debrisX]);

  const restartGame = () => {
    setScore(0);
    setDebrisY(0);
    setGameOver(false);
    setHasWon(false);
    setPlayerPositionX(GAME_WIDTH / 2 - PLAYER_SIZE / 2);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContentCard, { height: 480 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Flash Flood Evacuation Drill</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={26} color="#64748B" />
            </TouchableOpacity>
          </View>
          <Text style={{ color: '#94A3B8', fontSize: 12, marginBottom: 12 }}>
            Tilt your phone physically left/right to steer your responder to safety!
          </Text>

          <View style={[styles.gameCanvas, { width: GAME_WIDTH }]}>
            <View style={[styles.playerNode, { left: playerPositionX }]}>
              <Ionicons name="walk" size={24} color="black" />
              <Ionicons name="walk-outline" size={24} color="black" />
              <Ionicons name="fitness-outline" size={24} color="black" />
            </View>

            {!gameOver && !hasWon && (
              <View style={[styles.debrisNode, { left: debrisX, top: debrisY }]}>
                <Ionicons name="warning" size={20} color="#EF4444" />
              </View>
            )}

            <View style={styles.shelterLine}>
              <Text style={styles.shelterLineText}>SCDF SAFE ELEVATED SHELTER AREA</Text>
            </View>
          </View>

          <View style={styles.gameHud}>
            <Text style={{ color: '#FFF', fontWeight: '800' }}>Evacuation Score: {score} / 50</Text>
          </View>

          {gameOver && (
            <View style={styles.endGameOverlay}>
              <Text style={{ color: '#EF4444', fontWeight: '900', fontSize: 18 }}>Trapped by Water!</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={restartGame}>
                <Text style={{ color: '#FFF', fontWeight: '800' }}>Retry Drill</Text>
              </TouchableOpacity>
            </View>
          )}

          {hasWon && (
            <View style={styles.endGameOverlay}>
              <Text style={{ color: '#10B981', fontWeight: '900', fontSize: 18 }}>Reached High Ground!</Text>
              <TouchableOpacity 
                style={styles.claimRewardBtn} 
                onPress={() => {
                  onWin({ xp: 100, coins: 25 });
                  onClose();
                }}
              >
                <Text style={styles.claimRewardText}>Claim +100 XP & +25 Coins</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContentCard: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 20, padding: 20, width: '100%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  gameCanvas: { height: 260, backgroundColor: '#020617', borderRadius: 12, borderWidth: 1, borderColor: '#1E293B', position: 'relative', overflow: 'hidden' },
  playerNode: { position: 'absolute', bottom: 10 },
  debrisNode: { position: 'absolute' },
  shelterLine: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#10B98120', paddingVertical: 4, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#10B981' },
  shelterLineText: { color: '#10B981', fontSize: 8, fontWeight: '900' },
  gameHud: { marginTop: 12, alignItems: 'center' },
  endGameOverlay: { position: 'absolute', top: 120, left: 20, right: 20, backgroundColor: '#0F172ACC', padding: 20, borderRadius: 16, alignItems: 'center' },
  retryBtn: { backgroundColor: '#EF4444', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginTop: 10 },
  claimRewardBtn: { backgroundColor: '#10B981', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  claimRewardText: { color: '#FFF', fontWeight: '900', fontSize: 13 }
});