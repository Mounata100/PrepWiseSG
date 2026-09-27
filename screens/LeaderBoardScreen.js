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

// import React, { useMemo } from 'react';
// import { View, Text, StyleSheet, FlatList } from 'react-native';
// import { Card, Avatar } from 'react-native-paper';
// import { useUser } from '../contexts/UserContext';
// import { subscribeToLeaderboard } from '../services/LeaderboardService';
// // const BASE_MOCK_LEADERBOARD = [
// //   { id: '1', name: 'Alex', points: 980, streak: 12 },
// //   { id: '2', name: 'Sarah', points: 870, streak: 9 },
// //   { id: '3', name: 'Daniel', points: 410, streak: 7 },
// // ];

// export default function LeaderboardScreen() {
//   // Destructure top-level context variables straight from useUser()
//   const { name, points, streak, theme } = useUser();
//   const isDark = theme === 'dark';

//   const colors = {
//     bg: isDark ? '#0F172A' : '#F8FAFC',
//     card: isDark ? '#1E293B' : '#FFFFFF',
//     text: isDark ? '#FFFFFF' : '#0F172A',
//     sub: isDark ? '#CBD5E1' : '#475569',
//     accent: '#58CC02',
//     gold: '#FACC15',
//     highlightBorder: isDark ? '#38BDF8' : '#2563EB'
//   };

//   // Dynamically compute and sort ranks based on active app telemetry
//   // const liveLeaderboard = useMemo(() => {
//   //   const userData = {
//   //     id: 'current_user',
//   //     name: name || 'Operator Active',
//   //     points: points || 0,
//   //     streak: streak || 4,
//   //     isCurrentUser: true,
//   //   };

//   //   return [...BASE_MOCK_LEADERBOARD, userData].sort((a, b) => b.points - a.points);
//   // }, [name, points, streak]);

//   const renderItem = ({ item, index }) => {
//     const rank = index + 1;

//     return (
//       <Card
//         style={[
//           styles.card,
//           { backgroundColor: colors.card },
//           item.isCurrentUser && { borderWidth: 2, borderColor: colors.highlightBorder }
//         ]}
//       >
//         <View style={styles.row}>
//           {/* Rank Indicator */}
//           <View style={styles.rankBox}>
//             <Text style={[styles.rank, { color: rank === 1 ? colors.gold : colors.text }]}>
//               #{rank}
//             </Text>
//           </View>

//           {/* Avatar frame */}
//           <Avatar.Text
//             size={50}
//             label={(item.name?.[0] || 'O').toUpperCase()}
//             style={{ backgroundColor: item.isCurrentUser ? colors.highlightBorder : colors.accent }}
//             labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
//           />

//           {/* Identity details */}
//           <View style={styles.info}>
//             <Text style={[styles.name, { color: colors.text }, item.isCurrentUser && { fontWeight: '900' }]}>
//               {item.name} {item.isCurrentUser && '(You)'}
//             </Text>
//             <Text style={[styles.streak, { color: colors.sub }]}>
//               🔥 {item.streak} day streak
//             </Text>
//           </View>

//           {/* Scoreboard readouts */}
//           <View>
//             <Text style={[styles.points, { color: colors.accent }]}>
//               {item.points} XP
//             </Text>
//           </View>
//         </View>
//       </Card>
//     );
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: colors.bg }]}>
//       <Text style={[styles.title, { color: colors.text }]}>🏆 Leaderboard</Text>
//       <FlatList
//         data={liveLeaderboard}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, paddingTop: 60 },
//   title: { fontSize: 30, fontWeight: 'bold', marginBottom: 20 },
//   card: { borderRadius: 24, marginBottom: 14, padding: 16, elevation: 4, borderWidth: 1, borderColor: 'transparent' },
//   row: { flexDirection: 'row', alignItems: 'center' },
//   rankBox: { width: 55 },
//   rank: { fontSize: 22, fontWeight: 'bold' },
//   info: { flex: 1, marginLeft: 14 },
//   name: { fontSize: 18, fontWeight: 'bold' },
//   streak: { marginTop: 4, fontSize: 14 },
//   points: { fontSize: 18, fontWeight: 'bold' },
// });