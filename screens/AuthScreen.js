// screens/AuthScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  StatusBar, SafeAreaView, KeyboardAvoidingView, Image,
  Platform, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import logoImage from '../assets/logoImage.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
        
  const { login, signup, guestMode } = useUser();

  //Load saved users on mount
  useEffect(() => {
    console.log('AuthScreen mounted, loading users from storage...');
    loadUsers();
  }, []);

  const loadUsers = async () =>{
    try{
      const savedUsers = await AsyncStorage.getItem('users');
      if(savedUsers){
        console.log('Loaded users from storage:', JSON.parse(savedUsers));
      }
    } 
    catch (error) {
      console.log('Error loading users:', error);
      }
  };

  // Real-time validation with hints
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    const newTouched = { ...touched, [field]: true };
    
    switch (field) {
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Please enter a valid email (e.g., john@example.com)';
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = `Password too short. ${6 - value.length} more characters needed.`;
        } else {
          delete newErrors.password;
        }
        break;
        
      case 'name':
        if (mode === 'signup') {
          if (!value.trim()) {
            newErrors.name = 'Name is required';
          } else if (value.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
          } else {
            delete newErrors.name;
          }
        }
        break;
    }
    
    setErrors(newErrors);
    setTouched(newTouched);
  };

  // Check if all fields are valid
  const isFormValid = () => {
    if (mode === 'login') {
      return email.trim() && password.length >= 6;
    } else {
      return name.trim() && email.trim() && password.length >= 6;
    }
  };

  //Save user to Storage after signup to prevent the user having to 
  //create multiple accounts when opening the application after each time.
  const saveUserToStorage = async (userEmail, userPassword, userName) => {
    try{
      const savedUsers = await AsyncStorage.getItem('users');
      let users = savedUsers ? JSON.parse(savedUsers) : [];
      users.push({ 
        email: userEmail, 
        password: userPassword, 
        name: userName });
      await AsyncStorage.setItem('users', JSON.stringify(users));
      console.log('User saved to storage:', { email: userEmail, password: userPassword, name: userName });
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  };

  //Check if the user exists in the storage when the user logs into PrepWiseSG.

  const checkUserExists = async (userEmail, userPassword) => {
    try {
      const savedUsers = await AsyncStorage.getItem('users');
      if (!savedUsers) return { success: false, error: 'No account found. Please sign up first.' };
      
      const users = JSON.parse(savedUsers);
      const user = users.find(u => u.email === userEmail.toLowerCase());
      
      if (!user) {
        return { success: false, error: 'No account found. Please sign up first.' };
      }
      
      if (user.password !== userPassword) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Error checking user:', error);
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  };

  const handleAuth = async () => {
    // Mark all fields as touched to show errors
    setTouched({ email: true, password: true, name: true });
    
    // Validate all fields
    validateField('email', email);
    validateField('password', password);
    if (mode === 'signup') {
      validateField('name', name);
    }

    // Check if form is valid
    if (!isFormValid()) {
      Alert.alert(
        'Please Complete All Fields',
        'Fill in all required fields correctly to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    
    let result;
    if (mode === 'login') {
      result = await login(email.trim().toLowerCase(), password);
    } else {
      result = await signup(email.trim().toLowerCase(), password, name.trim());
    }

    setLoading(false);

    if (!result.success) {
      Alert.alert(
        mode === 'login' ? 'Sign In Failed' : 'Account Creation Failed',
        result.error,
        [{ text: 'OK' }]
      );
    }
  };

  const handleGuest = () => {
    Alert.alert(
      'Guest Mode',
      'You can explore basic features. Create an account to save your progress!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue as Guest', onPress: () => {guestMode();} },
      ]
    );
  };

  //Forgot Password
  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Enter your email address and we will send you a link to reset your password.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Link', 
          onPress: () => {
            // In a real app, this would send a reset email
            Alert.alert(
              'Reset Link Sent!',
              'Please check your email for the password reset link. (Demo: This is a placeholder)',
              [{ text: 'OK' }]
            );
          }
        },
      ]
    );
  };

  // Get password strength
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '', color: '#E2E8F0' };
    if (password.length < 4) return { level: 1, text: 'Weak', color: '#DC2626' };
    if (password.length < 6) return { level: 2, text: 'Fair', color: '#F59E0B' };
    if (password.length < 8) return { level: 3, text: 'Good', color: '#22C55E' };
    return { level: 4, text: 'Strong', color: '#0F766E' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Image source={require('../assets/logoImage.png')} style={styles.logoImage} resizeMode="contain" />
              </View>
              <Text style={styles.appName}>PrepWiseSG</Text>
              <Text style={styles.tagline}>Singapore's Disaster Preparedness</Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              {/* Tabs */}
              <View style={styles.tabs}>
                <TouchableOpacity 
                  style={[styles.tab, mode === 'login' && styles.activeTab]}
                  onPress={() => { setMode('login'); setErrors({}); setTouched({}); }}
                >
                  <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tab, mode === 'signup' && styles.activeTab]}
                  onPress={() => { setMode('signup'); setErrors({}); setTouched({}); }}
                >
                  <Text style={[styles.tabText, mode === 'signup' && styles.activeTabText]}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              {/* Welcome Text */}
              <Text style={styles.welcomeText}>
                {mode === 'login' ? 'Welcome back!' : 'Create your account'}
              </Text>

              {/* Name Input (Signup Only) */}
              {mode === 'signup' && (
                <View>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color={errors.name && touched.name ? '#DC2626' : '#64748B'} />
                    <TextInput
                      placeholder="Enter your full name"
                      value={name}
                      onChangeText={setName}
                      onBlur={() => validateField('name', name)}
                      style={[styles.input, errors.name && touched.name && styles.inputError]}
                      placeholderTextColor="#94A3B8"
                      autoCapitalize="words"
                    />
                    {name.trim().length >= 2 && (
                      <Ionicons name="checkmark-circle" size={20} color="#22C55E" style={styles.validIcon} />
                    )}
                  </View>
                  {/* Hint */}
                  <Text style={styles.hint}>
                    💡 At least 2 characters
                  </Text>
                  {/* Error */}
                  {errors.name && touched.name && (
                    <Text style={styles.errorText}>⚠️ {errors.name}</Text>
                  )}
                </View>
              )}

              {/* Email Input */}
              <View>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color={errors.email && touched.email ? '#DC2626' : '#64748B'} />
                  <TextInput
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    onBlur={() => validateField('email', email)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[styles.input, errors.email && touched.email && styles.inputError]}
                    placeholderTextColor="#94A3B8"
                  />
                  {email && !errors.email && /\S+@\S+\.\S+/.test(email) && (
                    <Ionicons name="checkmark-circle" size={20} color="#22C55E" style={styles.validIcon} />
                  )}
                </View>
                {/* Hint */}
                <Text style={styles.hint}>
                  💡 We'll send a confirmation to this email
                </Text>
                {/* Error */}
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>⚠️ {errors.email}</Text>
                )}
              </View>

              {/* Password Input */}
              <View>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color={errors.password && touched.password ? '#DC2626' : '#64748B'} />
                  <TextInput
                    placeholder={mode === 'signup' ? "Create a password (min 6 characters)" : "Enter your password"}
                    value={password}
                    onChangeText={setPassword}
                    onBlur={() => validateField('password', password)}
                    secureTextEntry={!showPassword}
                    style={[styles.input, { paddingRight: 50 }, errors.password && touched.password && styles.inputError]}
                    placeholderTextColor="#94A3B8"
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                      size={20} 
                      color="#64748B" 
                    />
                  </TouchableOpacity>
                  {password.length >= 6 && (
                    <Ionicons name="checkmark-circle" size={20} color="#22C55E" style={styles.validIconRight} />
                  )}
                </View>
                
                {/* Password Strength Bar (Signup Only) */}
                {mode === 'signup' && password.length > 0 && (
                  <View style={styles.strengthContainer}>
                    <View style={styles.strengthBar}>
                      <View style={[styles.strengthFill, { width: `${passwordStrength.level * 25}%`, backgroundColor: passwordStrength.color }]} />
                    </View>
                    <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                      {passwordStrength.text}
                    </Text>
                  </View>
                )}
                
                {/* Hint */}
                {mode === 'signup' ? (
                  <Text style={styles.hint}>
                    💡 Minimum 6 characters (add numbers/symbols for stronger password)
                  </Text>
                ) : (
                  <Text style={styles.hint}>
                    💡 Minimum 6 characters
                  </Text>
                )}
                
                {/* Error */}
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>⚠️ {errors.password}</Text>
                )}
              </View>

              {/* Forgot Password (Login Only) */}
              {mode === 'login' && (
                <TouchableOpacity style={styles.forgotButton}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              {/* Auth Button */}
              <TouchableOpacity 
                style={[styles.authButton, !isFormValid() && styles.authButtonDisabled]}
                onPress={handleAuth}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.authButtonText}>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Guest Button */}
              <TouchableOpacity 
                style={styles.guestButton}
                onPress={handleGuest}
              >
                <Ionicons name="walk-outline" size={20} color="#0F766E" />
                <Text style={styles.guestText}>Continue as Guest</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logoCircle: { 
    width: 120, height: 120, 
    borderRadius: 60, 
    backgroundColor: '#0F766E', 
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#0F766E', shadowOpacity: 0.4, shadowRadius: 20, elevation: 10
  },
  logoImage:{
    width: 80,
    height: 80,
    borderRadius: 16
  },
  appName: { fontSize: 32, fontWeight: '800', color: 'white', marginTop: 16 },
  tagline: { color: '#64748B', marginTop: 4, fontSize: 14 },
  
  card: { backgroundColor: 'white', borderRadius: 24, padding: 24 },
  tabs: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  activeTab: { backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { color: '#64748B', fontWeight: '600' },
  activeTabText: { color: '#0F766E' },
  
  welcomeText: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 20 },
  
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#0F172A', 
    marginBottom: 8,
    marginTop: 8
  },
  
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#F8FAFC', 
    borderRadius: 12, 
    paddingHorizontal: 16,
    borderWidth: 1, 
    borderColor: '#E2E8F0'
  },
  input: { 
    flex: 1, 
    paddingVertical: 14, 
    marginLeft: 10, 
    color: '#0F172A', 
    fontSize: 16 
  },
  inputError: { 
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2'
  },
  validIcon: { marginLeft: 8 },
  validIconRight: { position: 'absolute', right: 50 },
  eyeButton: { position: 'absolute', right: 16 },
  
  hint: { 
    color: '#64748B', 
    fontSize: 12, 
    marginTop: 6,
    marginLeft: 4
  },
  errorText: { 
    color: '#DC2626', 
    fontSize: 12, 
    marginTop: 6,
    fontWeight: '500'
  },
  
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginRight: 10
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    width: 50
  },
  
  forgotButton: { alignSelf: 'flex-end', marginBottom: 20, marginTop: 8 },
  forgotText: { color: '#2563EB', fontWeight: '600' },
  
  authButton: { 
    backgroundColor: '#0F766E', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 8 
  },
  authButtonDisabled: {
    backgroundColor: '#94A3B8'
  },
  authButtonText: { 
    color: 'white', 
    fontWeight: '700', 
    fontSize: 16 
  },
  
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { marginHorizontal: 12, color: '#94A3B8' },

  guestButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#F0FDF4', 
    padding: 14, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#0F766E'
  },
  guestText: { color: '#0F766E', fontWeight: '700', marginLeft: 8 },

  footer: { textAlign: 'center', color: '#64748B', fontSize: 12, marginTop: 20, lineHeight: 18 },
});