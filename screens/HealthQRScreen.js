/**
 *Health QR

 The Health QR feature was created as an offline emergency preparedness tool. 
 Users enter essential medical and emergency-contact information, which is 
 validated and stored locally on the device using AsyncStorage. 
 Once the information is complete, the app generates a unique Emergency 
 Health ID and converts the profile into a QR code using react-native-qrcode-svg.

 The QR code is designed to work without an internet connection or the PrepWiseSG app, 
 allowing a responder to scan it using a normal phone camera. The feature also includes 
 local validation, profile completion tracking, privacy warnings, and a PrepPoints reward 
 to encourage users to complete their emergency profile.

 This demonstrates local data storage, input validation, QR-code generation, 
 offline functionality, and gamification** within the preparedness application.
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import ResourcesScreen from './ResourcesScreen';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'emergency_health_profile';

const EMPTY_PROFILE = {
  healthId: '',
  name: '',
  dob: '',
  blood: '',
  allergy: '',
  condition: '',
  medication: '',
  contact: '',
  relationship: '',
};

/* ===========================================================
 * STABLE SUB-COMPONENTS (Moved outside to prevent re-mounting)
 * =========================================================== */

function Field({
  label,
  field,
  placeholder,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
  profile,
  errors,
  update,
}) {
  const hasError = !!errors[field];

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <TextInput
        style={[styles.input, hasError && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor="#475569"
        value={profile[field] || ''}
        onChangeText={(text) => update(field, text)}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        keyboardType={keyboardType}
        returnKeyType="next"
        blurOnSubmit={false}
      />

      {hasError && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={13} color="#F87171" />
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      )}
    </View>
  );
}

function DateOfBirthField({ profile, errors, handleDateChange }) {
  const hasError = !!errors.dob;

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>Date of Birth *</Text>

      <TextInput
        style={[styles.input, hasError && styles.inputError]}
        placeholder="DD/MM/YYYY"
        placeholderTextColor="#475569"
        value={profile.dob || ''}
        onChangeText={handleDateChange}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        blurOnSubmit={false}
      />

      <Text style={styles.helperText}>Example: 12/05/1998</Text>

      {hasError && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={13} color="#F87171" />
          <Text style={styles.errorText}>{errors.dob}</Text>
        </View>
      )}
    </View>
  );
}

export default function HealthQRScreen({ navigation }) {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [errors, setErrors] = useState({});
  const [generated, setGenerated] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile({
          ...EMPTY_PROFILE,
          ...parsed,
        });
        setSaved(true);
      }
    } catch (error) {
      console.log('Unable to load Health ID:', error);
    }
  }

  function update(field, value) {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: undefined,
      }));
    }

    setSaved(false);
  }

  function handleDateChange(text) {
    let value = text.replace(/\D/g, '');
    value = value.substring(0, 8);

    if (value.length > 4) {
      value =
        value.substring(0, 2) +
        '/' +
        value.substring(2, 4) +
        '/' +
        value.substring(4);
    } else if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }

    update('dob', value);
  }

  function isValidDateOfBirth(value) {
    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return false;

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(year, month - 1, day);

    const validDate =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;

    if (!validDate) return false;

    const today = new Date();
    if (date > today) return false;

    return true;
  }

  function validateProfile() {
    const newErrors = {};

    if (!profile.name.trim()) newErrors.name = 'Full name is required.';
    if (!profile.dob.trim()) {
      newErrors.dob = 'Date of birth is required.';
    } else if (!isValidDateOfBirth(profile.dob)) {
      newErrors.dob = 'Enter a valid date in DD/MM/YYYY format.';
    }
    if (!profile.blood.trim()) newErrors.blood = 'Blood type is required.';
    if (!profile.allergy.trim()) newErrors.allergy = 'Enter allergies or write "None".';
    if (!profile.condition.trim()) newErrors.condition = 'Enter medical conditions or write "None".';
    if (!profile.contact.trim()) newErrors.contact = 'Emergency contact is required.';
    if (!profile.relationship.trim()) newErrors.relationship = 'Enter the contact relationship.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const completion = useMemo(() => {
    const fields = [
      'name',
      'dob',
      'blood',
      'allergy',
      'condition',
      'medication',
      'contact',
      'relationship',
    ];

    const completed = fields.filter((field) => profile[field]?.trim()).length;
    return Math.round((completed / fields.length) * 100);
  }, [profile]);

  async function generateHealthID() {
    const valid = validateProfile();
    if (!valid) {
      Alert.alert(
        'Incomplete Health Profile',
        'Please correct the highlighted fields before generating your Emergency Health ID.'
      );
      return;
    }

    let updatedProfile = { ...profile };

    if (!updatedProfile.healthId) {
      updatedProfile.healthId =
        'PW-' + Math.floor(100000 + Math.random() * 900000);
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      setGenerated(true);
      setSaved(true);

      Alert.alert(
        'Emergency Health ID Created',
        'Your Health ID has been saved on this device and is available offline.'
      );
    } catch (error) {
      console.log('Unable to save Health ID:', error);
      Alert.alert('Save Failed', 'The Health ID could not be saved on this device.');
    }
  }

  const qrData = JSON.stringify({
    type: 'EMERGENCY_HEALTH_ID',
    version: 1,
    healthId: profile.healthId,
    name: profile.name,
    dateOfBirth: profile.dob,
    bloodType: profile.blood,
    allergies: profile.allergy,
    medicalConditions: profile.condition,
    medication: profile.medication,
    emergencyContact: profile.contact,
    relationship: profile.relationship,
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('ResourcesScreen')}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.backText}>Resources</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="medical-outline" size={28} color="#38BDF8" />
          </View>
          <Text style={styles.title}>Emergency Health ID</Text>
          <Text style={styles.subtitle}>
            Create an offline emergency medical profile that can be shown to responders.
          </Text>
        </View>

        <View style={styles.offlineCard}>
          <View style={styles.offlineIcon}>
            <Ionicons name="cloud-offline-outline" size={20} color="#34D399" />
          </View>
          <View style={styles.offlineContent}>
            <Text style={styles.offlineTitle}>Works Offline</Text>
            <Text style={styles.offlineText}>
              Your Health ID is stored on this device. The QR code can also be displayed without an internet connection.
            </Text>
          </View>
        </View>

        <View style={styles.privacyCard}>
          <Ionicons name="shield-outline" size={21} color="#FBBF24" />
          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>Important Privacy Notice</Text>
            <Text style={styles.privacyText}>
              Information contained in the QR code can be read by anyone who scans it. Only show your Health ID to trusted emergency responders.
            </Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Profile Completion</Text>
            <Text style={styles.progressPercentage}>{completion}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completion}%` }]} />
          </View>
        </View>

        {/* PERSONAL INFORMATION */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={18} color="#38BDF8" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <Field
            label="Full Name *"
            field="name"
            placeholder="e.g. Alex Tan"
            profile={profile}
            errors={errors}
            update={update}
          />

          <DateOfBirthField
            profile={profile}
            errors={errors}
            handleDateChange={handleDateChange}
          />
        </View>

        {/* MEDICAL INFORMATION */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="fitness-outline" size={18} color="#38BDF8" />
            <Text style={styles.sectionTitle}>Medical Information</Text>
          </View>

          <Field
            label="Blood Type *"
            field="blood"
            placeholder="e.g. O+"
            autoCapitalize="characters"
            profile={profile}
            errors={errors}
            update={update}
          />

          <Field
            label="Allergies *"
            field="allergy"
            placeholder='e.g. Penicillin, or "None"'
            profile={profile}
            errors={errors}
            update={update}
          />

          <Field
            label="Medical Conditions *"
            field="condition"
            placeholder='e.g. Asthma, or "None"'
            profile={profile}
            errors={errors}
            update={update}
          />

          <Field
            label="Medication"
            field="medication"
            placeholder='e.g. Inhaler, or "None"'
            profile={profile}
            errors={errors}
            update={update}
          />
        </View>

        {/* EMERGENCY CONTACT */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call-outline" size={18} color="#38BDF8" />
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
          </View>

          <Field
            label="Contact Name + Number *"
            field="contact"
            placeholder="e.g. Parent - 91234567"
            keyboardType="phone-pad"
            profile={profile}
            errors={errors}
            update={update}
          />

          <Field
            label="Relationship *"
            field="relationship"
            placeholder="e.g. Parent"
            profile={profile}
            errors={errors}
            update={update}
          />
        </View>

        {profile.healthId !== '' && (
          <View style={styles.idCard}>
            <View style={styles.idIcon}>
              <Ionicons name="shield-checkmark" size={24} color="#34D399" />
            </View>
            <View style={styles.idContent}>
              <Text style={styles.idTitle}>Emergency Health ID</Text>
              <Text style={styles.id}>{profile.healthId}</Text>
              <Text style={styles.savedText}>
                {saved ? 'Saved securely on this device' : 'Changes not yet saved'}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, completion < 100 && styles.buttonIncomplete]}
          onPress={generateHealthID}
          activeOpacity={0.85}
        >
          <Ionicons
            name={profile.healthId ? 'refresh-outline' : 'qr-code-outline'}
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.buttonText}>
            {profile.healthId ? 'Update Emergency QR' : 'Generate Emergency QR'}
          </Text>
        </TouchableOpacity>

        {generated && profile.healthId !== '' && (
          <View style={styles.qrSection}>
            <View style={styles.qrHeader}>
              <Ionicons name="qr-code" size={22} color="#38BDF8" />
              <Text style={styles.qrTitle}>Emergency QR</Text>
            </View>

            <View style={styles.qrBox}>
              <QRCode value={qrData} size={220} backgroundColor="#FFFFFF" color="#000000" />
            </View>

            <Text style={styles.qrInstruction}>
              Show this QR code to an emergency responder when medical information is required.
            </Text>

            <View style={styles.qrWarning}>
              <Ionicons name="warning-outline" size={18} color="#FBBF24" />
              <Text style={styles.qrWarningText}>
                The QR contains your emergency information in readable form. Keep it private and only display it when necessary.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.footerCard}>
          <Ionicons name="phone-portrait-outline" size={20} color="#64748B" />
          <Text style={styles.footerText}>
            No internet connection is required to access the saved profile or display the QR code.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 42,
    paddingBottom: 70,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 7,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 18,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#082F49',
    borderWidth: 1,
    borderColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 7,
    paddingHorizontal: 15,
  },
  offlineCard: {
    flexDirection: 'row',
    backgroundColor: '#052E16',
    borderWidth: 1,
    borderColor: '#166534',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  offlineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#064E3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineContent: {
    flex: 1,
    marginLeft: 11,
  },
  offlineTitle: {
    color: '#34D399',
    fontSize: 14,
    fontWeight: '900',
  },
  offlineText: {
    color: '#A7F3D0',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },
  privacyCard: {
    flexDirection: 'row',
    backgroundColor: '#451A03',
    borderWidth: 1,
    borderColor: '#92400E',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  privacyContent: {
    flex: 1,
    marginLeft: 10,
  },
  privacyTitle: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '900',
  },
  privacyText: {
    color: '#FDE68A',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },
  progressCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 15,
    marginBottom: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  progressPercentage: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '900',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },
  card: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  fieldContainer: {
    marginBottom: 14,
  },
  fieldLabel: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#FFFFFF',
    fontSize: 14,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  helperText: {
    color: '#475569',
    fontSize: 10,
    marginTop: 5,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  errorText: {
    color: '#F87171',
    fontSize: 10,
    flex: 1,
  },
  idCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#052E16',
    borderWidth: 1,
    borderColor: '#166534',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  idIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#064E3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  idContent: {
    flex: 1,
    marginLeft: 12,
  },
  idTitle: {
    color: '#86EFAC',
    fontSize: 11,
    fontWeight: '800',
  },
  id: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  savedText: {
    color: '#6EE7B7',
    fontSize: 10,
    marginTop: 3,
  },
  button: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 2,
    marginBottom: 18,
  },
  buttonIncomplete: {
    backgroundColor: '#1D4ED8',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  qrSection: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginBottom: 18,
  },
  qrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  qrTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  qrBox: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 18,
  },
  qrInstruction: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 10,
  },
  qrWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#451A03',
    borderWidth: 1,
    borderColor: '#92400E',
    borderRadius: 12,
    padding: 11,
    marginTop: 15,
  },
  qrWarningText: {
    flex: 1,
    color: '#FDE68A',
    fontSize: 10,
    lineHeight: 15,
    marginLeft: 8,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B1120',
    borderRadius: 14,
    padding: 14,
  },
  footerText: {
    flex: 1,
    color: '#64748B',
    fontSize: 10,
    lineHeight: 15,
    marginLeft: 9,
  }
});
// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import QRCode from 'react-native-qrcode-svg';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const STORAGE_KEY = 'emergency_health_profile';
// const REWARD_KEY = 'health_qr_reward_claimed';

// const HEALTH_QR_REWARD = 50;

// const BLOOD_TYPES = [
//   'A+',
//   'A-',
//   'B+',
//   'B-',
//   'AB+',
//   'AB-',
//   'O+',
//   'O-',
// ];

// export default function HealthQRScreen({ navigation }) {
//   const [profile, setProfile] = useState({
//     healthId: '',
//     name: '',
//     dob: '',
//     blood: '',
//     allergy: '',
//     condition: '',
//     medication: '',
//     contact: '',
//     relationship: '',
//   });

//   const [generated, setGenerated] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [rewardClaimed, setRewardClaimed] = useState(false);
//   const [loading, setLoading] = useState(true);

//   /*
//    * ---------------------------------------------------------
//    * LOAD SAVED PROFILE
//    * ---------------------------------------------------------
//    */

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   async function loadProfile() {
//     try {
//       const savedProfile = await AsyncStorage.getItem(STORAGE_KEY);
//       const savedReward = await AsyncStorage.getItem(REWARD_KEY);

//       if (savedProfile) {
//         const parsed = JSON.parse(savedProfile);

//         setProfile({
//           healthId: parsed.healthId || '',
//           name: parsed.name || '',
//           dob: parsed.dob || '',
//           blood: parsed.blood || '',
//           allergy: parsed.allergy || '',
//           condition: parsed.condition || '',
//           medication: parsed.medication || '',
//           contact: parsed.contact || '',
//           relationship: parsed.relationship || '',
//         });
//       }

//       if (savedReward === 'true') {
//         setRewardClaimed(true);
//       }
//     } catch (error) {
//       console.log('Failed to load health profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   /*
//    * ---------------------------------------------------------
//    * FIELD UPDATE
//    * ---------------------------------------------------------
//    */

//   function update(field, value) {
//     setProfile((previous) => ({
//       ...previous,
//       [field]: value,
//     }));

//     // Remove validation error once user edits the field.
//     setErrors((previous) => ({
//       ...previous,
//       [field]: undefined,
//     }));

//     // Editing the profile means the existing QR is no longer
//     // guaranteed to represent the current information.
//     setGenerated(false);
//   }

//   /*
//    * ---------------------------------------------------------
//    * VALIDATION
//    * ---------------------------------------------------------
//    */

//   function validateProfile() {
//     const newErrors = {};

//     if (!profile.name.trim()) {
//       newErrors.name = 'Full name is required.';
//     }

//     if (!profile.dob.trim()) {
//       newErrors.dob = 'Date of birth is required.';
//     } else if (!isValidDate(profile.dob)) {
//       newErrors.dob = 'Use a valid date such as 15/08/2005.';
//     }

//     if (!profile.blood.trim()) {
//       newErrors.blood = 'Blood type is required.';
//     } else if (!BLOOD_TYPES.includes(profile.blood.trim().toUpperCase())) {
//       newErrors.blood = 'Use a valid blood type such as O+ or A-.';
//     }

//     if (!profile.allergy.trim()) {
//       newErrors.allergy = 'Enter allergies or write "None".';
//     }

//     if (!profile.condition.trim()) {
//       newErrors.condition =
//         'Enter medical conditions or write "None".';
//     }

//     if (!profile.contact.trim()) {
//       newErrors.contact = 'Emergency contact is required.';
//     } else if (!looksLikePhoneNumber(profile.contact)) {
//       newErrors.contact =
//         'Enter a valid emergency contact number.';
//     }

//     if (!profile.relationship.trim()) {
//       newErrors.relationship =
//         'Emergency contact relationship is required.';
//     }

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;
//   }

//   function isValidDate(value) {
//     const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

//     if (!match) {
//       return false;
//     }

//     const day = Number(match[1]);
//     const month = Number(match[2]);
//     const year = Number(match[3]);

//     if (month < 1 || month > 12) {
//       return false;
//     }

//     if (day < 1 || day > 31) {
//       return false;
//     }

//     const date = new Date(year, month - 1, day);

//     return (
//       date.getFullYear() === year &&
//       date.getMonth() === month - 1 &&
//       date.getDate() === day
//     );
//   }

//   function looksLikePhoneNumber(value) {
//     const digits = value.replace(/\D/g, '');

//     return digits.length >= 8 && digits.length <= 15;
//   }

//   /*
//    * ---------------------------------------------------------
//    * PROFILE COMPLETION
//    * ---------------------------------------------------------
//    */

//   const completion = useMemo(() => {
//     const fields = [
//       profile.name,
//       profile.dob,
//       profile.blood,
//       profile.allergy,
//       profile.condition,
//       profile.contact,
//       profile.relationship,
//     ];

//     const completed = fields.filter(
//       (field) => field && field.trim()
//     ).length;

//     return Math.round((completed / fields.length) * 100);
//   }, [profile]);

//   /*
//    * ---------------------------------------------------------
//    * GENERATE HEALTH ID
//    * ---------------------------------------------------------
//    */

//   async function generateQR() {
//     const valid = validateProfile();

//     if (!valid) {
//       Alert.alert(
//         'Check Your Information',
//         'Please correct the highlighted fields before generating your Emergency Health ID.'
//       );

//       return;
//     }

//     let updatedProfile = {
//       ...profile,
//       blood: profile.blood.trim().toUpperCase(),
//       name: profile.name.trim(),
//       dob: profile.dob.trim(),
//       allergy: profile.allergy.trim(),
//       condition: profile.condition.trim(),
//       medication: profile.medication.trim(),
//       contact: profile.contact.trim(),
//       relationship: profile.relationship.trim(),
//     };

//     /*
//      * Generate the ID only once.
//      */
//     if (!updatedProfile.healthId) {
//       updatedProfile.healthId =
//         'PW-' +
//         Math.floor(100000 + Math.random() * 900000);
//     }

//     try {
//       await AsyncStorage.setItem(
//         STORAGE_KEY,
//         JSON.stringify(updatedProfile)
//       );

//       setProfile(updatedProfile);
//       setGenerated(true);

//       /*
//        * -------------------------------------------------------
//        * PREPPOINT REWARD
//        * -------------------------------------------------------
//        *
//        * We only award this once.
//        *
//        * In a production app this should be handled by your
//        * central UserContext rather than directly here.
//        */

//       if (!rewardClaimed) {
//         await AsyncStorage.setItem(REWARD_KEY, 'true');
//         setRewardClaimed(true);

//         Alert.alert(
//           'Emergency Health ID Created',
//           `Your Health ID is ready.\n\n+${HEALTH_QR_REWARD} PrepPoints earned for completing your emergency profile.`
//         );
//       } else {
//         Alert.alert(
//           'Emergency Health ID Updated',
//           'Your emergency profile and QR code have been updated.'
//         );
//       }
//     } catch (error) {
//       console.log('Failed to save health profile:', error);

//       Alert.alert(
//         'Unable to Save',
//         'Your profile could not be saved. Please try again.'
//       );
//     }
//   }

//   /*
//    * ---------------------------------------------------------
//    * QR PAYLOAD
//    * ---------------------------------------------------------
//    *
//    * This QR is intentionally designed to work without your app.
//    *
//    * IMPORTANT:
//    * This is NOT encryption.
//    * Anyone who scans the QR can potentially read the payload.
//    *
//    * For the prototype, the QR is therefore treated as an
//    * emergency information card rather than a secure medical
//    * record system.
//    */

//   const qrData = JSON.stringify({
//     type: 'EMERGENCY_HEALTH_ID',
//     version: 1,

//     healthId: profile.healthId,

//     name: profile.name,
//     dateOfBirth: profile.dob,
//     bloodType: profile.blood,

//     allergies: profile.allergy,
//     medicalConditions: profile.condition,
//     medication: profile.medication,

//     emergencyContact: profile.contact,
//     relationship: profile.relationship,
//   });

//   /*
//    * ---------------------------------------------------------
//    * INPUT COMPONENT
//    * ---------------------------------------------------------
//    */

//   function Field({
//     label,
//     field,
//     placeholder,
//     keyboardType = 'default',
//     autoCapitalize = 'sentences',
//   }) {
//     const hasError = !!errors[field];

//     return (
//       <View style={styles.fieldContainer}>
//         <Text style={styles.fieldLabel}>{label}</Text>

//         <TextInput
//           style={[
//             styles.input,
//             hasError && styles.inputError,
//           ]}
//           placeholder={placeholder}
//           placeholderTextColor="#475569"
//           value={profile[field]}
//           onChangeText={(text) => update(field, text)}
//           keyboardType={keyboardType}
//           autoCapitalize={autoCapitalize}
//           returnKeyType="next"
//         />

//         {hasError && (
//           <View style={styles.errorRow}>
//             <Ionicons
//               name="alert-circle"
//               size={13}
//               color="#F87171"
//             />

//             <Text style={styles.errorText}>
//               {errors[field]}
//             </Text>
//           </View>
//         )}
//       </View>
//     );
//   }

//   /*
//    * ---------------------------------------------------------
//    * RENDER
//    * ---------------------------------------------------------
//    */

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={
//         Platform.OS === 'ios'
//           ? 'padding'
//           : 'height'
//       }
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
//     >
//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.content}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         {/* ===================================================
//             BACK BUTTON
//             =================================================== */}

//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.navigate('ResourcesScreen')}
//           activeOpacity={0.8}
//         >
//           <Ionicons
//             name="arrow-back"
//             size={20}
//             color="#FFFFFF"
//           />

//           <Text style={styles.backText}>
//             Resources
//           </Text>
//         </TouchableOpacity>

//         {/* ===================================================
//             HEADER
//             =================================================== */}

//         <View style={styles.header}>
//           <View style={styles.headerIcon}>
//             <Ionicons
//               name="medical-outline"
//               size={28}
//               color="#38BDF8"
//             />
//           </View>

//           <Text style={styles.title}>
//             Emergency Health ID
//           </Text>

//           <Text style={styles.subtitle}>
//             Create an offline emergency medical profile
//             that can be shown to responders.
//           </Text>
//         </View>

//         {/* ===================================================
//             OFFLINE NOTICE
//             =================================================== */}

//         <View style={styles.offlineCard}>
//           <View style={styles.offlineIcon}>
//             <Ionicons
//               name="cloud-offline-outline"
//               size={20}
//               color="#34D399"
//             />
//           </View>

//           <View style={styles.offlineContent}>
//             <Text style={styles.offlineTitle}>
//               Works Offline
//             </Text>

//             <Text style={styles.offlineText}>
//               Your Health ID is stored on this device and
//               the QR code can be displayed without an
//               internet connection.
//             </Text>
//           </View>
//         </View>

//         {/* ===================================================
//             COMPLETION
//             =================================================== */}

//         <View style={styles.progressCard}>
//           <View style={styles.progressHeader}>
//             <Text style={styles.progressTitle}>
//               Profile Completion
//             </Text>

//             <Text style={styles.progressPercentage}>
//               {completion}%
//             </Text>
//           </View>

//           <View style={styles.progressBar}>
//             <View
//               style={[
//                 styles.progressFill,
//                 { width: `${completion}%` },
//               ]}
//             />
//           </View>
//         </View>

//         {/* ===================================================
//             PERSONAL INFORMATION
//             =================================================== */}

//         <View style={styles.card}>
//           <View style={styles.sectionHeader}>
//             <Ionicons
//               name="person-outline"
//               size={18}
//               color="#38BDF8"
//             />

//             <Text style={styles.sectionTitle}>
//               Personal Information
//             </Text>
//           </View>

//           <Field
//             label="Full Name *"
//             field="name"
//             placeholder="e.g. Alex Tan"
//           />

//           <Field
//             label="Date of Birth *"
//             field="dob"
//             placeholder="DD/MM/YYYY"
//             keyboardType="numeric"
//           />
//         </View>

//         {/* ===================================================
//             MEDICAL INFORMATION
//             =================================================== */}

//         <View style={styles.card}>
//           <View style={styles.sectionHeader}>
//             <Ionicons
//               name="heart-outline"
//               size={18}
//               color="#F87171"
//             />

//             <Text style={styles.sectionTitle}>
//               Medical Information
//             </Text>
//           </View>

//           <Field
//             label="Blood Type *"
//             field="blood"
//             placeholder="e.g. O+"
//             autoCapitalize="characters"
//           />

//           <View style={styles.bloodOptions}>
//             {BLOOD_TYPES.map((type) => {
//               const selected =
//                 profile.blood.toUpperCase() === type;

//               return (
//                 <TouchableOpacity
//                   key={type}
//                   style={[
//                     styles.bloodOption,
//                     selected && styles.bloodOptionSelected,
//                   ]}
//                   onPress={() => update('blood', type)}
//                 >
//                   <Text
//                     style={[
//                       styles.bloodOptionText,
//                       selected &&
//                         styles.bloodOptionTextSelected,
//                     ]}
//                   >
//                     {type}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>

//           {errors.blood && (
//             <Text style={styles.errorText}>
//               {errors.blood}
//             </Text>
//           )}

//           <Field
//             label="Allergies *"
//             field="allergy"
//             placeholder='e.g. Peanuts, or "None"'
//           />

//           <Field
//             label="Medical Conditions *"
//             field="condition"
//             placeholder='e.g. Asthma, or "None"'
//           />

//           <Field
//             label="Medication"
//             field="medication"
//             placeholder='e.g. Salbutamol, or "None"'
//           />
//         </View>

//         {/* ===================================================
//             EMERGENCY CONTACT
//             =================================================== */}

//         <View style={styles.card}>
//           <View style={styles.sectionHeader}>
//             <Ionicons
//               name="call-outline"
//               size={18}
//               color="#34D399"
//             />

//             <Text style={styles.sectionTitle}>
//               Emergency Contact
//             </Text>
//           </View>

//           <Field
//             label="Contact Name + Number *"
//             field="contact"
//             placeholder="e.g. Parent - 91234567"
//             keyboardType="phone-pad"
//           />

//           <Field
//             label="Relationship *"
//             field="relationship"
//             placeholder="e.g. Parent, Friend, Spouse"
//           />
//         </View>

//         {/* ===================================================
//             GENERATE
//             =================================================== */}

//         <TouchableOpacity
//           style={styles.generateButton}
//           onPress={generateQR}
//           activeOpacity={0.85}
//         >
//           <Ionicons
//             name="qr-code-outline"
//             size={20}
//             color="#FFFFFF"
//           />

//           <Text style={styles.generateButtonText}>
//             {generated
//               ? 'Update Emergency QR'
//               : 'Generate Emergency QR'}
//           </Text>
//         </TouchableOpacity>

//         {/* ===================================================
//             HEALTH ID
//             =================================================== */}

//         {profile.healthId !== '' && (
//           <View style={styles.idCard}>
//             <View style={styles.idIcon}>
//               <Ionicons
//                 name="shield-checkmark"
//                 size={22}
//                 color="#34D399"
//               />
//             </View>

//             <View style={styles.idContent}>
//               <Text style={styles.idLabel}>
//                 Emergency Health ID
//               </Text>

//               <Text style={styles.id}>
//                 {profile.healthId}
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* ===================================================
//             QR
//             =================================================== */}

//         {generated && (
//           <View style={styles.qrSection}>
//             <View style={styles.qrHeader}>
//               <Ionicons
//                 name="qr-code"
//                 size={20}
//                 color="#38BDF8"
//               />

//               <Text style={styles.qrTitle}>
//                 Emergency QR
//               </Text>
//             </View>

//             <View style={styles.qrBox}>
//               <QRCode
//                 value={qrData}
//                 size={220}
//                 backgroundColor="#FFFFFF"
//                 color="#020617"
//               />
//             </View>

//             <View style={styles.qrInstruction}>
//               <Ionicons
//                 name="camera-outline"
//                 size={18}
//                 color="#38BDF8"
//               />

//               <Text style={styles.qrInstructionText}>
//                 A responder can scan this QR using a
//                 normal phone camera. Your app is not
//                 required to read it.
//               </Text>
//             </View>

//             {/* =================================================
//                 PRIVACY WARNING
//                 ================================================= */}

//             <View style={styles.warningCard}>
//               <Ionicons
//                 name="warning-outline"
//                 size={20}
//                 color="#FBBF24"
//               />

//               <View style={styles.warningContent}>
//                 <Text style={styles.warningTitle}>
//                   Important Privacy Notice
//                 </Text>

//                 <Text style={styles.warningText}>
//                   The information encoded in this prototype
//                   QR can be read by anyone who scans it.
//                   Only display the QR to someone you trust
//                   to provide emergency assistance.
//                 </Text>
//               </View>
//             </View>
//           </View>
//         )}

//         {/* ===================================================
//             REWARD INFORMATION
//             =================================================== */}

//         <View style={styles.rewardCard}>
//           <Ionicons
//             name="flash"
//             size={20}
//             color="#F59E0B"
//           />

//           <View style={styles.rewardContent}>
//             <Text style={styles.rewardTitle}>
//               Preparedness Reward
//             </Text>

//             <Text style={styles.rewardText}>
//               {rewardClaimed
//                 ? 'Emergency Health ID reward already claimed.'
//                 : `Complete your profile and generate your QR to earn +${HEALTH_QR_REWARD} PrepPoints.`}
//             </Text>
//           </View>
//         </View>

//         {/* Bottom spacing for keyboard / small screens */}
//         <View style={{ height: 80 }} />
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#020617',
//   },

//   scroll: {
//     flex: 1,
//   },

//   content: {
//     paddingHorizontal: 16,
//     paddingTop: 45,
//     paddingBottom: 60,
//   },

//   /* =========================================================
//      BACK
//      ========================================================= */

//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//     backgroundColor: '#0F172A',
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     marginBottom: 22,
//     gap: 6,
//   },

//   backText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '700',
//   },

//   /* =========================================================
//      HEADER
//      ========================================================= */

//   header: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },

//   headerIcon: {
//     width: 58,
//     height: 58,
//     borderRadius: 29,
//     backgroundColor: '#0F172A',
//     borderWidth: 1,
//     borderColor: '#38BDF8',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },

//   title: {
//     color: '#FFFFFF',
//     fontSize: 28,
//     fontWeight: '900',
//     textAlign: 'center',
//   },

//   subtitle: {
//     color: '#94A3B8',
//     fontSize: 13,
//     lineHeight: 19,
//     textAlign: 'center',
//     marginTop: 7,
//     paddingHorizontal: 15,
//   },

//   /* =========================================================
//      OFFLINE
//      ========================================================= */

//   offlineCard: {
//     flexDirection: 'row',
//     backgroundColor: '#052E16',
//     borderWidth: 1,
//     borderColor: '#047857',
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 14,
//   },

//   offlineIcon: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: '#064E3B',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   offlineContent: {
//     flex: 1,
//     marginLeft: 11,
//   },

//   offlineTitle: {
//     color: '#34D399',
//     fontSize: 13,
//     fontWeight: '900',
//   },

//   offlineText: {
//     color: '#A7F3D0',
//     fontSize: 11,
//     lineHeight: 16,
//     marginTop: 3,
//   },

//   /* =========================================================
//      PROGRESS
//      ========================================================= */

//   progressCard: {
//     backgroundColor: '#0F172A',
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 14,
//   },

//   progressHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },

//   progressTitle: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '800',
//   },

//   progressPercentage: {
//     color: '#38BDF8',
//     fontSize: 12,
//     fontWeight: '900',
//   },

//   progressBar: {
//     height: 6,
//     backgroundColor: '#1E293B',
//     borderRadius: 4,
//     overflow: 'hidden',
//   },

//   progressFill: {
//     height: '100%',
//     backgroundColor: '#38BDF8',
//     borderRadius: 4,
//   },

//   /* =========================================================
//      CARDS
//      ========================================================= */

//   card: {
//     backgroundColor: '#0F172A',
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     borderRadius: 18,
//     padding: 16,
//     marginBottom: 14,
//   },

//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 14,
//   },

//   sectionTitle: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '900',
//   },

//   /* =========================================================
//      FIELDS
//      ========================================================= */

//   fieldContainer: {
//     marginBottom: 13,
//   },

//   fieldLabel: {
//     color: '#CBD5E1',
//     fontSize: 11,
//     fontWeight: '800',
//     marginBottom: 6,
//   },

//   input: {
//     backgroundColor: '#111827',
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     color: '#FFFFFF',
//     paddingHorizontal: 14,
//     paddingVertical: 13,
//     borderRadius: 12,
//     fontSize: 13,
//   },

//   inputError: {
//     borderColor: '#EF4444',
//   },

//   errorRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 5,
//     gap: 5,
//   },

//   errorText: {
//     color: '#F87171',
//     fontSize: 10,
//     marginTop: 4,
//   },

//   /* =========================================================
//      BLOOD TYPE
//      ========================================================= */

//   bloodOptions: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 7,
//     marginBottom: 10,
//   },

//   bloodOption: {
//     width: '22%',
//     backgroundColor: '#111827',
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     borderRadius: 9,
//     paddingVertical: 9,
//     alignItems: 'center',
//   },

//   bloodOptionSelected: {
//     backgroundColor: '#082F49',
//     borderColor: '#38BDF8',
//   },

//   bloodOptionText: {
//     color: '#64748B',
//     fontSize: 12,
//     fontWeight: '800',
//   },

//   bloodOptionTextSelected: {
//     color: '#38BDF8',
//   },

//   /* =========================================================
//      GENERATE
//      ========================================================= */

//   generateButton: {
//     backgroundColor: '#2563EB',
//     borderRadius: 15,
//     paddingVertical: 16,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 9,
//     marginTop: 4,
//     marginBottom: 14,
//   },

//   generateButtonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '900',
//   },

//   /* =========================================================
//      HEALTH ID
//      ========================================================= */

//   idCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#052E16',
//     borderWidth: 1,
//     borderColor: '#047857',
//     padding: 15,
//     borderRadius: 16,
//     marginBottom: 14,
//   },

//   idIcon: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: '#064E3B',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   idContent: {
//     flex: 1,
//     marginLeft: 12,
//   },

//   idLabel: {
//     color: '#86EFAC',
//     fontSize: 10,
//     fontWeight: '800',
//   },

//   id: {
//     color: '#FFFFFF',
//     fontSize: 22,
//     fontWeight: '900',
//     marginTop: 2,
//   },

//   /* =========================================================
//      QR
//      ========================================================= */

//   qrSection: {
//     backgroundColor: '#0F172A',
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     borderRadius: 18,
//     padding: 16,
//     marginBottom: 14,
//   },

//   qrHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 14,
//   },

//   qrTitle: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '900',
//   },

//   qrBox: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FFFFFF',
//     padding: 24,
//     borderRadius: 18,
//   },

//   qrInstruction: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: '#082F49',
//     borderWidth: 1,
//     borderColor: '#075985',
//     borderRadius: 12,
//     padding: 12,
//     marginTop: 14,
//     gap: 9,
//   },

//   qrInstructionText: {
//     flex: 1,
//     color: '#BAE6FD',
//     fontSize: 11,
//     lineHeight: 16,
//   },

//   /* =========================================================
//      WARNING
//      ========================================================= */

//   warningCard: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: '#451A03',
//     borderWidth: 1,
//     borderColor: '#92400E',
//     borderRadius: 13,
//     padding: 12,
//     marginTop: 12,
//     gap: 9,
//   },

//   warningContent: {
//     flex: 1,
//   },

//   warningTitle: {
//     color: '#FBBF24',
//     fontSize: 12,
//     fontWeight: '900',
//   },

//   warningText: {
//     color: '#FDE68A',
//     fontSize: 10,
//     lineHeight: 15,
//     marginTop: 3,
//   },

//   /* =========================================================
//      REWARD
//      ========================================================= */

//   rewardCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#451A03',
//     borderWidth: 1,
//     borderColor: '#92400E',
//     borderRadius: 16,
//     padding: 14,
//   },

//   rewardContent: {
//     flex: 1,
//     marginLeft: 10,
//   },

//   rewardTitle: {
//     color: '#FBBF24',
//     fontSize: 12,
//     fontWeight: '900',
//   },

//   rewardText: {
//     color: '#FDE68A',
//     fontSize: 10,
//     lineHeight: 15,
//     marginTop: 3,
//   },
// });