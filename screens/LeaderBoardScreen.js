// =========================================================
// LEADERBOARD SCREEN
// Duolingo-style Gamified Leaderboard
// =========================================================
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';

import { Card, Avatar } from 'react-native-paper';
import { useUser } from '../contexts/UserContext';
import { subscribeToLeaderboard } from '../services/LeaderBoardService';

export default function LeaderboardScreen() {

  const { user, theme } = useUser();

  const [leaderboard, setLeaderboard] = useState([]);

  const isDark = theme === 'dark';

  const colors = {
    bg: isDark ? '#0F172A' : '#F8FAFC',
    card: isDark ? '#1E293B' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#0F172A',
    sub: isDark ? '#CBD5E1' : '#475569',
    accent: '#58CC02',
    gold: '#FACC15',
    highlightBorder: isDark ? '#38BDF8' : '#2563EB'
  };

  useEffect(() => {

    const unsubscribe = subscribeToLeaderboard(
      user?.id,
      (data) => {
        setLeaderboard(data);
      }
    );
    return unsubscribe;
  }, []);

  const renderItem = ({ item, index }) => {

    const rank = item.rank;

    const isCurrentUser =
      item.id === user?.id;

    return (
      <Card
        style={[
          styles.card,
          { backgroundColor: colors.card },
          isCurrentUser && {
            borderWidth: 2,
            borderColor: colors.highlightBorder
          }
        ]}
      >

        <View style={styles.row}>

          <View style={styles.rankBox}>
            <Text
              style={[
                styles.rank,
                {
                  color:
                    rank === 1
                      ? colors.gold
                      : colors.text
                }
              ]}
            >
              #{rank}
            </Text>
          </View>

          <Avatar.Text
            size={50}
            label={(item.name?.[0] || 'U').toUpperCase()}
            style={{
              backgroundColor: isCurrentUser
                ? colors.highlightBorder
                : colors.accent
            }}
            labelStyle={{
              color: '#FFFFFF',
              fontWeight: 'bold'
            }}
          />

          <View style={styles.info}>

            <Text
              style={[
                styles.name,
                { color: colors.text },
                isCurrentUser && {
                  fontWeight: '900'
                }
              ]}
            >
              {item.name || 'Unknown User'}
              {isCurrentUser && (
                <Text
                  style={[
                    styles.yourPositionLabel,
                    { color: colors.highlightBorder }
                  ]}>
                  Your Position
                </Text>
              )}
            </Text>
            <Text
              style={[
                styles.streak,
                { color: colors.sub }
              ]}
            >
              🔥 {item.streak || 0} day streak
            </Text>

          </View>

          <View>
            <Text
              style={[
                styles.points,
                { color: colors.accent }
              ]}
            >
              {item.points || 0} XP
            </Text>
          </View>

        </View>

      </Card>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg }
      ]}
    >

      <Text
        style={[
          styles.title,
          { color: colors.text }
        ]}
      >
        🏆 Leaderboard
      </Text>

      <FlatList
        data={leaderboard}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30
        }}
      />

    </View>
  );
}