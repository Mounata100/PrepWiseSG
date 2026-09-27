// // screens/AuthScreen.js
// /**
//  *                  ┌─────────────────┐
//                     │   AuthScreen    │
//                     └────────┬────────┘
//                              │
//                      login / signup
//                              │
//                              ▼
//                     ┌─────────────────┐
//                     │  UserContext    │
//                     └───────┬─────────┘
//                             │
//               ┌─────────────┴─────────────┐
//               │                           │
//               ▼                           ▼
//      ┌─────────────────┐         ┌─────────────────┐
//      │ Firebase Auth   │         │ UserService     │
//      │                 │         │                 │
//      │ UID             │         │ Firestore       │
//      │ Email/password  │         │ users/{uid}     │
//      └─────────────────┘         └────────┬────────┘
//                                           │
//                                           ▼
//                                  ┌─────────────────┐
//                                  │ LocalUserService│
//                                  │                 │
//                                  │ AsyncStorage    │
//                                  │ local cache     │
//                                  └─────────────────┘

//                                  Level	Game	Difficulty	Purpose
// 1	Climate Defence	Easy	Learn flood/evacuation basics
// 2	Flood Routing	Easy	Learn route decisions
// 3	Go-Bag	Easy	Learn essential preparation
// 4	Climate Defence	Medium	More pressure / more decisions
// 5	Flood Routing	Medium	More complex route choices
// 6	Go-Bag	Medium	Limited resources
// 7	Climate Defence	Hard	Fast tactical scenario
// 8	Flood Routing	Hard	Multiple hazards
// 9	Go-Bag	Hard	Resource-management challenge
// 10	Mission Complete	Final	Checklist / preparedness assessment
// 1 ─ Climate Defence ─ EASY
// 2 ─ Flood ─ EASY
// 3 ─ Go-Bag ─ EASY

// 4 ─ Climate Defence ─ MEDIUM
// 5 ─ Flood ─ MEDIUM
// 6 ─ Go-Bag ─ MEDIUM

// 7 ─ Climate Defence ─ HARD
// 8 ─ Flood ─ HARD
// 9 ─ Go-Bag ─ HARD

// 10 ─ FINAL PREPWISE MISSION
// MISSION 10
// PREPAREDNESS PROTOCOL

// ☐ Emergency contacts saved
// ☐ Family rendezvous point configured
// ☐ Emergency Go-Bag prepared
// ☐ Water supply checked
// ☐ Medical information completed
// ☐ Emergency flashlight available
// ☐ Power bank charged
// ☐ Important documents secured

//           7 / 8 COMPLETE

//        COMPLETE MISSION

//  */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useUser } from '../contexts/UserContext';
import { createUserProfile } from '../services/UserService';

import {
  saveCachedUser,
  getCachedUser,
  clearCachedUser,
  saveGuestUser,
  getGuestUser,
  clearGuestUser,
} from '../services/localuserService';

import '../localisation';

export default function AuthScreen() {
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetErrors, setResetErrors] = useState({});
  const [resetLoading, setResetLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const { login, signup, guestMode } = useUser();

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

  const languages = [
    {
      code: 'en',
      label: t('language.english'),
      nativeLabel: 'English',
    },
    {
      code: 'ms',
      label: t('language.malay'),
      nativeLabel: 'Bahasa Melayu',
    },
    {
      code: 'zh',
      label: t('language.chinese'),
      nativeLabel: '中文',
    },
    {
      code: 'ta',
      label: t('language.tamil'),
      nativeLabel: 'தமிழ்',
    },
  ];

  useEffect(() => {
    console.log('AuthScreen mounted, loading users from storage...');
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const savedUsers = await AsyncStorage.getItem('users');

      if (savedUsers) {
        console.log(
          'Loaded users from storage:',
          JSON.parse(savedUsers)
        );
      }
    } catch (error) {
      console.log('Error loading users:', error);
    }
  };

  // --------------------------------------------------
  // LANGUAGE
  // --------------------------------------------------

  const changeLanguage = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);

      // Optional persistence so the selected language
      // remains after the app is restarted.
      await AsyncStorage.setItem('appLanguage', languageCode);

      setLanguageModalVisible(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    const newTouched = { ...touched, [field]: true };

    switch (field) {
      case 'email':
        if (!value.trim()) {
          newErrors.email = t('auth.validation.emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = t('auth.validation.invalidEmail');
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = t(
            'auth.validation.passwordRequired'
          );
        } else if (value.length < 6) {
          newErrors.password = t(
            'auth.validation.passwordTooShort',
            { count: 6 - value.length }
          );
        } else {
          delete newErrors.password;
        }
        break;

      case 'username':
        if (mode === 'signup') {
          if (!value.trim()) {
            newErrors.username = t(
              'auth.validation.nameRequired'
            );
          } else if (value.trim().length < 2) {
            newErrors.username = t(
              'auth.validation.nameTooShort'
            );
          } else {
            delete newErrors.username;
          }
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    setTouched(newTouched);
  };

  const isFormValid = () => {
    if (mode === 'login') {
      return (
        email.trim() &&
        password.length >= 6
      );
    }

    return (
      username.trim() &&
      email.trim() &&
      password.length >= 6
    );
  };

  // --------------------------------------------------
  // AUTH
  // --------------------------------------------------

  const handleAuth = async () => {
    setTouched({
      email: true,
      password: true,
      username: true,
    });

    validateField('email', email);
    validateField('password', password);

    if (mode === 'signup') {
      validateField('username', username);
    }

    if (!isFormValid()) {
      Alert.alert(
        t('auth.alerts.completeFieldsTitle'),
        t('auth.alerts.completeFieldsMessage'),
        [
          {
            text: t('auth.alerts.ok'),
          },
        ]
      );

      return;
    }

    setLoading(true);

    let result;

    try {
      if (mode === 'login') {
        result = await login(
          email.trim().toLowerCase(),
          password
        );
      } else {
        result = await signup(
          email.trim().toLowerCase(),
          password,
          username.trim()
        );
      }
    } catch (error) {
      console.error('Authentication error:', error);

      result = {
        success: false,
        error: 'Something went wrong. Please try again.',
      };
    }

    setLoading(false);

    if (!result.success) {
      Alert.alert(
        mode === 'login'
          ? t('auth.alerts.signInFailed')
          : t('auth.alerts.accountCreationFailed'),
        result.error,
        [
          {
            text: t('auth.alerts.ok'),
          },
        ]
      );
    }
  };

  // --------------------------------------------------
  // GUEST
  // --------------------------------------------------

  const handleGuest = () => {
    Alert.alert(
      t('auth.alerts.guestModeTitle'),
      t('auth.alerts.guestModeMessage'),
      [
        {
          text: t('auth.alerts.cancel'),
          style: 'cancel',
        },
        {
          text: t('auth.alerts.continueGuest'),
          onPress: () => {
            guestMode();
          },
        },
      ]
    );
  };

  // --------------------------------------------------
  // FORGOT PASSWORD
  // --------------------------------------------------

  // const handleForgotPassword = () => {
  //   Alert.alert(
  //     t('auth.alerts.resetPasswordTitle'),
  //     t('auth.alerts.resetPasswordMessage'),
  //     [
  //       {
  //         text: t('auth.alerts.cancel'),
  //         style: 'cancel',
  //       },
  //       {
  //         text: t('auth.alerts.sendLink'),
  //         onPress: () => {
  //           Alert.alert(
  //             t('auth.alerts.resetLinkSentTitle'),
  //             t('auth.alerts.resetLinkSentMessage'),
  //             [
  //               {
  //                 text: t('auth.alerts.ok'),
  //               },
  //             ]
  //           );
  //         },
  //       },
  //     ]
  //   );
  // };

  const openForgotPassword = () => {
    setResetEmail(email.trim());
    setNewPassword('');
    setConfirmNewPassword('');
    setResetErrors({});
    setForgotPasswordModalVisible(true);
  };

  const closeForgotPassword = () => {
    if (resetLoading) return;

    setForgotPasswordModalVisible(false);
    setResetErrors({});
  };

  const validateResetForm = () => {
    const newErrors = {};

    if (!resetEmail.trim()) {
      newErrors.email = t('auth.validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(resetEmail.trim())) {
      newErrors.email = t('auth.validation.invalidEmail');
    }

    if (!newPassword) {
      newErrors.newPassword =
        t('auth.validation.passwordRequired');
    } else if (newPassword.length < 6) {
      newErrors.newPassword = t(
        'auth.validation.passwordTooShort',
        {
          count: 6 - newPassword.length,
        }
      );
    }

    if (!confirmNewPassword) {
      newErrors.confirmNewPassword =
        t('auth.validation.passwordRequired');
    } else if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword =
        t('auth.alerts.passwordsDoNotMatch');
    }

    setResetErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateResetForm()) {
      return;
    }

    setResetLoading(true);

    try {
      /*
      * IMPORTANT:
      * Connect this to your actual UserContext/service.
      *
      * Example:
      *
      * const result = await resetPassword(
      *   resetEmail.trim().toLowerCase(),
      *   newPassword
      * );
      */

      // Temporary placeholder until resetPassword exists.
      const result = {
        success: false,
        error: 'Password reset service is not connected yet.',
      };

      if (!result.success) {
        Alert.alert(
          t('auth.forgotPasswordTitle'),
          result.error ||
            t('auth.passwordResetFailed'),
          [
            {
              text: t('auth.alerts.ok'),
            },
          ]
        );

        return;
      }

      setForgotPasswordModalVisible(false);

      setEmail(resetEmail.trim().toLowerCase());
      setPassword('');

      Alert.alert(
        t('auth.passwordResetSuccessTitle'),
        t('auth.passwordResetSuccessMessage'),
        [
          {
            text: t('auth.alerts.ok'),
          },
        ]
      );
    } catch (error) {
      console.error('Password reset error:', error);

      Alert.alert(
        t('auth.forgotPasswordTitle'),
        t('auth.passwordResetFailed'),
        [
          {
            text: t('auth.alerts.ok'),
          },
        ]
      );
    } finally {
      setResetLoading(false);
    }
  };

  // --------------------------------------------------
  // PASSWORD STRENGTH
  // --------------------------------------------------

  const getPasswordStrength = () => {
    if (!password) {
      return {
        level: 0,
        text: '',
        color: '#E2E8F0',
      };
    }

    if (password.length < 4) {
      return {
        level: 1,
        text: t('auth.passwordStrength.weak'),
        color: '#DC2626',
      };
    }

    if (password.length < 6) {
      return {
        level: 2,
        text: t('auth.passwordStrength.fair'),
        color: '#F59E0B',
      };
    }

    if (password.length < 8) {
      return {
        level: 3,
        text: t('auth.passwordStrength.good'),
        color: '#22C55E',
      };
    }

    return {
      level: 4,
      text: t('auth.passwordStrength.strong'),
      color: '#0F766E',
    };
  };

  const passwordStrength = getPasswordStrength();

  const currentLanguage =
    languages.find(
      (language) => language.code === i18n.language
    ) || languages[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >

            {/* LANGUAGE BUTTON */}
            <View style={styles.languageButtonContainer}>
              <TouchableOpacity
                style={styles.languageButton}
                onPress={() =>
                  setLanguageModalVisible(true)
                }
                activeOpacity={0.8}
              >
                <Ionicons
                  name="language-outline"
                  size={20}
                  color="#0F766E"
                />

                <Text style={styles.languageButtonText}>
                  {currentLanguage.nativeLabel}
                </Text>

                <Ionicons
                  name="chevron-down"
                  size={16}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {/* LOGO SECTION */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../assets/logoImage.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.appName}>
                {t('auth.appName')}
              </Text>

              <Text style={styles.tagline}>
                {t('auth.tagline')}
              </Text>
            </View>

            {/* FORM CARD */}
            <View style={styles.card}>

              {/* TABS */}
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    mode === 'login' &&
                      styles.activeTab,
                  ]}
                  onPress={() => {
                    setMode('login');
                    setErrors({});
                    setTouched({});
                  }}
                >
                  <Text
                    style={[
                      styles.tabText,
                      mode === 'login' &&
                        styles.activeTabText,
                    ]}
                  >
                    {t('auth.signIn')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tab,
                    mode === 'signup' &&
                      styles.activeTab,
                  ]}
                  onPress={() => {
                    setMode('signup');
                    setErrors({});
                    setTouched({});
                  }}
                >
                  <Text
                    style={[
                      styles.tabText,
                      mode === 'signup' &&
                        styles.activeTabText,
                    ]}
                  >
                    {t('auth.signUp')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* WELCOME */}
              <Text style={styles.welcomeText}>
                {mode === 'login'
                  ? t('auth.welcomeBack')
                  : t('auth.createAccount')}
              </Text>

              {/* USERNAME */}
              {mode === 'signup' && (
                <View>
                  <Text style={styles.label}>
                    {t('auth.fullName')}
                  </Text>

                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={
                        errors.username &&
                        touched.username
                          ? '#DC2626'
                          : '#64748B'
                      }
                    />

                    <TextInput
                      placeholder={t(
                        'auth.enterFullName'
                      )}
                      value={username}
                      onChangeText={setUsername}
                      onBlur={() =>
                        validateField(
                          'username',
                          username
                        )
                      }
                      style={[
                        styles.input,
                        errors.username &&
                          touched.username &&
                          styles.inputError,
                      ]}
                      placeholderTextColor="#94A3B8"
                      autoCapitalize="words"
                    />

                    {username.trim().length >= 2 && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#22C55E"
                        style={styles.validIcon}
                      />
                    )}
                  </View>

                  <Text style={styles.hint}>
                    {t('auth.nameHint')}
                  </Text>

                  {errors.username &&
                    touched.username && (
                      <Text style={styles.errorText}>
                        ⚠️ {errors.username}
                      </Text>
                    )}
                </View>
              )}

              {/* EMAIL */}
              <View>
                <Text style={styles.label}>
                  {t('auth.email')}
                </Text>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={
                      errors.email && touched.email
                        ? '#DC2626'
                        : '#64748B'
                    }
                  />

                  <TextInput
                    placeholder={t(
                      'auth.enterEmail'
                    )}
                    value={email}
                    onChangeText={setEmail}
                    onBlur={() =>
                      validateField(
                        'email',
                        email
                      )
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[
                      styles.input,
                      errors.email &&
                        touched.email &&
                        styles.inputError,
                    ]}
                    placeholderTextColor="#94A3B8"
                  />

                  {email &&
                    !errors.email &&
                    /\S+@\S+\.\S+/.test(email) && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#22C55E"
                        style={styles.validIcon}
                      />
                    )}
                </View>

                <Text style={styles.hint}>
                  {t('auth.emailHint')}
                </Text>

                {errors.email &&
                  touched.email && (
                    <Text style={styles.errorText}>
                      ⚠️ {errors.email}
                    </Text>
                  )}
              </View>

              {/* PASSWORD */}
              <View>
                <Text style={styles.label}>
                  {t('auth.password')}
                </Text>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={
                      errors.password &&
                      touched.password
                        ? '#DC2626'
                        : '#64748B'
                    }
                  />

                  <TextInput
                    placeholder={
                      mode === 'signup'
                        ? t(
                            'auth.createPassword'
                          )
                        : t(
                            'auth.enterPassword'
                          )
                    }
                    value={password}
                    onChangeText={setPassword}
                    onBlur={() =>
                      validateField(
                        'password',
                        password
                      )
                    }
                    secureTextEntry={!showPassword}
                    style={[
                      styles.input,
                      {
                        paddingRight: 50,
                      },
                      errors.password &&
                        touched.password &&
                        styles.inputError,
                    ]}
                    placeholderTextColor="#94A3B8"
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    <Ionicons
                      name={
                        showPassword
                          ? 'eye-off-outline'
                          : 'eye-outline'
                      }
                      size={20}
                      color="#64748B"
                    />
                  </TouchableOpacity>

                  {password.length >= 6 && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#22C55E"
                      style={
                        styles.validIconRight
                      }
                    />
                  )}
                </View>

                {/* PASSWORD STRENGTH */}
                {mode === 'signup' &&
                  password.length > 0 && (
                    <View
                      style={
                        styles.strengthContainer
                      }
                    >
                      <View
                        style={
                          styles.strengthBar
                        }
                      >
                        <View
                          style={[
                            styles.strengthFill,
                            {
                              width: `${passwordStrength.level * 25}%`,
                              backgroundColor:
                                passwordStrength.color,
                            },
                          ]}
                        />
                      </View>

                      <Text
                        style={[
                          styles.strengthText,
                          {
                            color:
                              passwordStrength.color,
                          },
                        ]}
                      >
                        {passwordStrength.text}
                      </Text>
                    </View>
                  )}

                <Text style={styles.hint}>
                  {mode === 'signup'
                    ? t(
                        'auth.passwordStrongHint'
                      )
                    : t(
                        'auth.passwordHint'
                      )}
                </Text>

                {errors.password &&
                  touched.password && (
                    <Text style={styles.errorText}>
                      ⚠️ {errors.password}
                    </Text>
                  )}
              </View>

              {/* FORGOT PASSWORD */}
              {mode === 'login' && (
                <TouchableOpacity
                  style={styles.forgotButton}
                  onPress={
                    openForgotPassword
                  }
                >
                  <Text
                    style={styles.forgotText}
                  >
                    {t(
                      'auth.forgotPassword'
                    )}
                  </Text>
                </TouchableOpacity>
              )}

              {/* AUTH BUTTON */}
              <TouchableOpacity
                style={[
                  styles.authButton,
                  !isFormValid() &&
                    styles.authButtonDisabled,
                ]}
                onPress={handleAuth}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator
                    color="white"
                  />
                ) : (
                  <Text
                    style={
                      styles.authButtonText
                    }
                  >
                    {mode === 'login'
                      ? t('auth.signIn')
                      : t(
                          'auth.createAccountButton'
                        )}
                  </Text>
                )}
              </TouchableOpacity>

              {/* DIVIDER */}
              <View style={styles.divider}>
                <View
                  style={styles.dividerLine}
                />

                <Text
                  style={styles.dividerText}
                >
                  {t('auth.or')}
                </Text>

                <View
                  style={styles.dividerLine}
                />
              </View>

              {/* GUEST */}
              <TouchableOpacity
                style={styles.guestButton}
                onPress={handleGuest}
              >
                <Ionicons
                  name="walk-outline"
                  size={20}
                  color="#0F766E"
                />

                <Text
                  style={styles.guestText}
                >
                  {t(
                    'auth.continueAsGuest'
                  )}
                </Text>
              </TouchableOpacity>
            </View>

            {/* FOOTER */}
            <Text style={styles.footer}>
              {t('auth.terms')}
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* LANGUAGE MODAL */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setLanguageModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.languageModal}>

            <View
              style={
                styles.languageModalHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.languageModalTitle
                  }
                >
                  {t('language.title')}
                </Text>

                <Text
                  style={
                    styles.languageModalSubtitle
                  }
                >
                  Select your preferred language
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  setLanguageModalVisible(
                    false
                  )
                }
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {languages.map((language) => {
              const selected =
                i18n.language ===
                language.code;

              return (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageOption,
                    selected &&
                      styles.selectedLanguageOption,
                  ]}
                  onPress={() =>
                    changeLanguage(
                      language.code
                    )
                  }
                >
                  <View
                    style={
                      styles.languageOptionText
                    }
                  >
                    <Text
                      style={[
                        styles.languageName,
                        selected &&
                          styles.selectedLanguageName,
                      ]}
                    >
                      {language.nativeLabel}
                    </Text>

                    <Text
                      style={
                        styles.languageEnglishName
                      }
                    >
                      {language.label}
                    </Text>
                  </View>

                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#0F766E"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
      {/* FORGOT PASSWORD MODAL */}
      <Modal
        visible={forgotPasswordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeForgotPassword}
      >
        <KeyboardAvoidingView
          style={styles.resetModalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.resetModalScroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.resetModal}>
              {/* HEADER */}
              <View style={styles.resetModalHeader}>
                <View style={styles.resetIconCircle}>
                  <Ionicons
                    name="lock-open-outline"
                    size={24}
                    color="#0F766E"
                  />
                </View>

                <TouchableOpacity
                  onPress={closeForgotPassword}
                  style={styles.closeButton}
                  disabled={resetLoading}
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.resetModalTitle}>
                {t('auth.forgotPasswordTitle')}
              </Text>

              <Text style={styles.resetModalMessage}>
                {t('auth.forgotPasswordMessage')}
              </Text>

              {/* EMAIL */}
              <Text style={styles.label}>
                {t('auth.resetEmail')}
              </Text>

              <View
                style={[
                  styles.inputContainer,
                  resetErrors.email && styles.resetInputError,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={
                    resetErrors.email
                      ? '#DC2626'
                      : '#64748B'
                  }
                />

                <TextInput
                  placeholder={t(
                    'auth.resetEmailPlaceholder'
                  )}
                  value={resetEmail}
                  onChangeText={(value) => {
                    setResetEmail(value);

                    if (resetErrors.email) {
                      setResetErrors((prev) => ({
                        ...prev,
                        email: undefined,
                      }));
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {resetErrors.email && (
                <Text style={styles.errorText}>
                  ⚠️ {resetErrors.email}
                </Text>
              )}

              {/* NEW PASSWORD */}
              <Text style={styles.label}>
                {t('auth.newPassword')}
              </Text>

              <View
                style={[
                  styles.inputContainer,
                  resetErrors.newPassword &&
                    styles.resetInputError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    resetErrors.newPassword
                      ? '#DC2626'
                      : '#64748B'
                  }
                />

                <TextInput
                  placeholder={t(
                    'auth.enterNewPassword'
                  )}
                  value={newPassword}
                  onChangeText={(value) => {
                    setNewPassword(value);

                    if (resetErrors.newPassword) {
                      setResetErrors((prev) => ({
                        ...prev,
                        newPassword: undefined,
                      }));
                    }
                  }}
                  secureTextEntry={!showNewPassword}
                  style={[
                    styles.input,
                    {
                      paddingRight: 48,
                    },
                  ]}
                  placeholderTextColor="#94A3B8"
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() =>
                    setShowNewPassword(!showNewPassword)
                  }
                >
                  <Ionicons
                    name={
                      showNewPassword
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>

              {resetErrors.newPassword && (
                <Text style={styles.errorText}>
                  ⚠️ {resetErrors.newPassword}
                </Text>
              )}

              {/* CONFIRM PASSWORD */}
              <Text style={styles.label}>
                {t('auth.confirmNewPassword')}
              </Text>

              <View
                style={[
                  styles.inputContainer,
                  resetErrors.confirmNewPassword &&
                    styles.resetInputError,
                ]}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={
                    resetErrors.confirmNewPassword
                      ? '#DC2626'
                      : '#64748B'
                  }
                />

                <TextInput
                  placeholder={t(
                    'auth.enterConfirmPassword'
                  )}
                  value={confirmNewPassword}
                  onChangeText={(value) => {
                    setConfirmNewPassword(value);

                    if (
                      resetErrors.confirmNewPassword
                    ) {
                      setResetErrors((prev) => ({
                        ...prev,
                        confirmNewPassword: undefined,
                      }));
                    }
                  }}
                  secureTextEntry={
                    !showConfirmPassword
                  }
                  style={[
                    styles.input,
                    {
                      paddingRight: 48,
                    },
                  ]}
                  placeholderTextColor="#94A3B8"
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  <Ionicons
                    name={
                      showConfirmPassword
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>

              {resetErrors.confirmNewPassword && (
                <Text style={styles.errorText}>
                  ⚠️ {resetErrors.confirmNewPassword}
                </Text>
              )}

              {/* RESET BUTTON */}
              <TouchableOpacity
                style={[
                  styles.resetButton,
                  resetLoading &&
                    styles.authButtonDisabled,
                ]}
                onPress={handleResetPassword}
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="#FFFFFF"
                    />

                    <Text style={styles.resetButtonText}>
                      {t('auth.resetPassword')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* CANCEL */}
              <TouchableOpacity
                style={styles.resetCancelButton}
                onPress={closeForgotPassword}
                disabled={resetLoading}
              >
                <Text style={styles.resetCancelText}>
                  {t('auth.alerts.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },

  safeArea: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  // LANGUAGE BUTTON
  languageButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },

  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  languageButtonText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '600',
  },

  // LOGO
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },

  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F766E',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },

  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },

  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginTop: 16,
  },

  tagline: {
    color: '#64748B',
    marginTop: 4,
    fontSize: 14,
    textAlign: 'center',
  },

  // CARD
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
  },

  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  tabText: {
    color: '#64748B',
    fontWeight: '600',
  },

  activeTabText: {
    color: '#0F766E',
  },

  welcomeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    marginLeft: 10,
    color: '#0F172A',
    fontSize: 16,
  },

  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },

  validIcon: {
    marginLeft: 8,
  },

  validIconRight: {
    position: 'absolute',
    right: 50,
  },

  eyeButton: {
    position: 'absolute',
    right: 16,
  },

  hint: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },

  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },

  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginRight: 10,
  },

  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },

  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    minwidth: 55,
    maxWidth: 90,
    textAlign: 'right'
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: 8,
  },

  forgotText: {
    color: '#2563EB',
    fontWeight: '600',
  },

  authButton: {
    backgroundColor: '#0F766E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  authButtonDisabled: {
    backgroundColor: '#94A3B8',
  },

  authButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },

  dividerText: {
    marginHorizontal: 12,
    color: '#94A3B8',
  },

  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0F766E',
  },

  guestText: {
    color: '#0F766E',
    fontWeight: '700',
    marginLeft: 8,
  },

  footer: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 12,
    marginTop: 20,
    lineHeight: 18,
  },

  // LANGUAGE MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  languageModal: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
  },

  languageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },

  languageModalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },

  languageModalSubtitle: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 13,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },

  selectedLanguageOption: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0F766E',
  },

  languageOptionText: {
    flex: 1,
  },

  languageName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  selectedLanguageName: {
    color: '#0F766E',
  },

  languageEnglishName: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  //Forgot Password
  resetModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.65)',
    justifyContent: 'center',
  },

  resetModalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  resetModal: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
  },

  resetModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  resetIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  resetModalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 16,
  },

  resetModalMessage: {
    fontSize: 14,
    lineHeight: 21,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 12,
  },

  resetInputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },

  resetButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },

  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  resetCancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },

  resetCancelText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  }
});
