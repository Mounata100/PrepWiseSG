// =========================================================
// SETTINGS SCREEN
// Dark Mode Toggle + Account Modification Particulars
// =========================================================
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';


export default function SettingsScreen() {
  const { theme, setTheme, user, name, updateProfile } = useUser();
  const navigation = useNavigation();

  const isDark = theme === 'dark';
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language?.split('-')[0] || 'en';
  const changeLanguage = async (language) => {
    await i18n.changeLanguage(language);
  };


  const colors = {
    bg: isDark ? '#0F172A' : '#F8FAFC',
    card: isDark ? '#1E293B' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#0F172A',
    sub: isDark ? '#CBD5E1' : '#475569',
    accent: '#58CC02',
    inputBg: isDark ? '#0F172A' : '#F1F5F9',
    border: isDark ? '#334155' : '#E2E8F0',
  };

  // Local state for user particulars & security updates
  const [displayName, setDisplayName] = useState(name || user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleUpdateParticulars = () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Display Name cannot be blank.');
      return;
    }
    
    if (typeof updateProfile === 'function') {
      updateProfile({ name: displayName });
      Alert.alert('Success', 'Particulars modified successfully.');
    } else {
      Alert.alert('Saved locally', `Name set to: ${displayName}. (Hook up your context's update function here!)`);
    }
  };

  const handleUpdatePassword = () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    // Call context engine or endpoint architecture here
    Alert.alert('Success', 'Security protocol credentials rotated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity 
        style={styles.backButtonHeader} 
        activeOpacity={0.7} 
        onPress={() => navigation.goBack()} // Safely returns to profile page view history stack
        >
        <Ionicons name="arrow-back" size={22} color={colors.text} />
        <Text style={[styles.backButtonText, { color: colors.text }]}>Return to Profile</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>
        Settings
      </Text>

      {/* APPEARANCE CONFIG */}
      <Text style={[styles.sectionHeader, { color: colors.sub }]}>APP CONFIGURATION</Text>
      <Card style={[styles.card, { backgroundColor: colors.card, marginBottom: 20 }]}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
            <Text style={[styles.settingSub, { color: colors.sub }]}>Switch app appearance</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            thumbColor={colors.accent}
            trackColor={{ false: '#767577', true: '#22C55E' }}
          />
        </View>
      </Card>

      {/* USER PARTICULARS CONFIG */}
      <Text style={[styles.sectionHeader, { color: colors.sub }]}>PERSONAL PARTICULARS</Text>
      <Card style={[styles.card, { backgroundColor: colors.card, marginBottom: 20 }]}>
        <View style={styles.inputBlock}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Display Name / Operator Call-sign</Text>
          <TextInput
            style={[styles.inputField, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter identity label..."
            placeholderTextColor="#64748B"
          />
        </View>

        <TouchableOpacity 
          style={[styles.actionButton, 
                { backgroundColor:'#D97706'}]} 
          activeOpacity={0.8}
          onPress={handleUpdateParticulars}
        >
          <Text style={styles.actionButtonText}>Update Particulars</Text>
        </TouchableOpacity>
      </Card>
      {/* LANGUAGE CONFIG */}
      <Text style={[styles.sectionHeader, { color: colors.sub }]}>
        {t('settings.sections.language')}
      </Text>

      <Card style={[styles.card, { backgroundColor: colors.card, marginBottom: 20 }]}>
        <View style={styles.languageHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              {t('settings.language.title')}
            </Text>
            <Text style={[styles.settingSub, { color: colors.sub }]}>
              {t('settings.language.description')}
            </Text>
          </View>

          <Ionicons
            name="language-outline"
            size={22}
            color={colors.accent}
          />
        </View>

        <View style={styles.languageOptions}>
          {[
            { code: 'en', label: 'English', native: 'English' },
            { code: 'zh', label: 'Chinese', native: '中文' },
            { code: 'ms', label: 'Malay', native: 'Bahasa Melayu' },
            { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
          ].map(language => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageOption,
                {
                  backgroundColor:
                    currentLanguage === language.code
                      ? '#D97706'
                      : colors.inputBg,
                  borderColor:
                    currentLanguage === language.code
                      ? colors.accent
                      : colors.border,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => changeLanguage(language.code)}
            >
              <Text
                style={[
                  styles.languageOptionText,
                  {
                    color:
                      currentLanguage === language.code
                        ? '#FFFFFF'
                        : colors.text,
                  },
                ]}
              >
                {language.native}
              </Text>

              <Text
                style={[
                  styles.languageOptionSub,
                  {
                    color:
                      currentLanguage === language.code
                        ? 'rgba(255,255,255,0.8)'
                        : colors.sub,
                  },
                ]}
              >
                {language.label}
              </Text>

              {currentLanguage === language.code && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#FFFFFF"
                  style={styles.languageCheck}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Card>


      {/* SECURITY / PASSWORD RESET */}
      <Text style={[styles.sectionHeader, { color: colors.sub }]}>ACCOUNT SECURITY</Text>
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.inputBlock}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Current Password</Text>
          <TextInput
            style={[styles.inputField, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#64748B"
          />
        </View>

        <View style={styles.inputBlock}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>New Password</Text>
          <TextInput
            style={[styles.inputField, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="Min 6 characters"
            placeholderTextColor="#64748B"
          />
        </View>

        <View style={styles.inputBlock}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Confirm New Password</Text>
          <TextInput
            style={[styles.inputField, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Repeat new password"
            placeholderTextColor="#64748B"
          />
        </View>

        <TouchableOpacity 
          style={[styles.actionButton, 
                { backgroundColor: '#4F46E5 ' }]} 
          activeOpacity={0.8}
          onPress={handleUpdatePassword}
        >
          <Text style={styles.actionButtonText}>Rotate Encryption Password</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 20,
    marginTop: 40,
    letterSpacing: -0.5,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  settingSub: {
    marginTop: 2,
    fontSize: 13,
  },
  inputBlock: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputField: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  actionButton: {
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  languageOptions: {
    gap: 8,
  },

  languageOption: {
    minHeight: 58,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    justifyContent: 'center',
    position: 'relative',
  },

  languageOptionText: {
    fontSize: 14,
    fontWeight: '800',
  },

  languageOptionSub: {
    fontSize: 11,
    marginTop: 2,
  },

  languageCheck: {
    position: 'absolute',
    right: 14,
    top: '50%',
    marginTop: -10,
  }
});