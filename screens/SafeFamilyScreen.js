// FamilySafetyScreen.js
//FireBase
// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if false;
//     }
//   }
// }
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import NetInfo from '@react-native-community/netinfo';

import { Ionicons } from '@expo/vector-icons';

import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

import { auth, db } from '../firebase/config';


// ============================================================
// LOCAL STORAGE KEYS
// ============================================================

const FAMILY_ID_KEY = 'family_safety_family_id';

const LOCAL_FAMILY_KEY = 'family_safety_local_data';

const PENDING_ACTIONS_KEY = 'family_safety_pending_actions';


// ============================================================
// DEFAULT EMPTY FAMILY
// ============================================================

const EMPTY_FAMILY = {
  id: null,
  name: '',
  meetupPoint: {
    name: '',
    address: '',
  },
  members: [],
};


// ============================================================
// MAIN SCREEN
// ============================================================

export default function FamilySafetyScreen({ navigation }) {

  // ----------------------------------------------------------
  // Firebase user
  //
  // Firebase Authentication gives every device/person a UID.
  //
  // This UID is what lets Firestore know:
  //
  // "This person belongs to this family."
  // ----------------------------------------------------------

  const [user, setUser] = useState(null);

  const [family, setFamily] = useState(EMPTY_FAMILY);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [isOffline, setIsOffline] = useState(false);

  const [familyName, setFamilyName] = useState('');

  const [meetupName, setMeetupName] = useState('');

  const [meetupAddress, setMeetupAddress] = useState('');

  const [inviteCode, setInviteCode] = useState('');

  const [joinCode, setJoinCode] = useState('');

  const [newMemberName, setNewMemberName] = useState('');

  const [pendingActions, setPendingActions] = useState([]);


  // ==========================================================
  // AUTH STATE
  // ==========================================================

  useEffect(() => {

    // --------------------------------------------------------
    // Firebase continuously tells us whether the device has
    // a signed-in Firebase user.
    // --------------------------------------------------------

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {

        setUser(currentUser);

        if (currentUser) {
          await loadFamily(currentUser.uid);
        } else {
          setLoading(false);
        }

      }
    );

    return unsubscribe;

  }, []);


  // ==========================================================
  // NETWORK STATE
  // ==========================================================

  useEffect(() => {

    const unsubscribe = NetInfo.addEventListener(
      (state) => {

        const offline =
          !state.isConnected ||
          state.isInternetReachable === false;

        setIsOffline(offline);

        // ----------------------------------------------------
        // If connectivity returns, attempt to send anything
        // that was stored locally while offline.
        // ----------------------------------------------------

        if (!offline) {
          syncPendingActions();
        }

      }
    );

    return unsubscribe;

  }, []);


  // ==========================================================
  // LOAD FAMILY
  // ==========================================================

  async function loadFamily(uid) {

    try {

      setLoading(true);

      // ------------------------------------------------------
      // First load local data.
      //
      // This means Family Safe can still display the family's
      // last known plan if the disaster has interrupted
      // connectivity.
      // ------------------------------------------------------

      const local = await AsyncStorage.getItem(
        LOCAL_FAMILY_KEY
      );

      if (local) {

        const parsed = JSON.parse(local);

        setFamily(parsed);

        setFamilyName(parsed.name || '');

        setMeetupName(
          parsed.meetupPoint?.name || ''
        );

        setMeetupAddress(
          parsed.meetupPoint?.address || ''
        );

      }


      // ------------------------------------------------------
      // Then determine which Firebase family this user belongs
      // to.
      // ------------------------------------------------------

      const savedFamilyId =
        await AsyncStorage.getItem(FAMILY_ID_KEY);

      if (!savedFamilyId) {

        setLoading(false);

        return;
      }


      // ------------------------------------------------------
      // If offline, stop here.
      //
      // The locally stored family information is still usable.
      // ------------------------------------------------------

      const networkState =
        await NetInfo.fetch();

      const offline =
        !networkState.isConnected ||
        networkState.isInternetReachable === false;

      if (offline) {

        setLoading(false);

        return;
      }


      // ------------------------------------------------------
      // Read the family document from Firestore.
      // ------------------------------------------------------

      const familyRef = doc(
        db,
        'families',
        savedFamilyId
      );

      const familySnapshot =
        await getDoc(familyRef);

      if (!familySnapshot.exists()) {

        console.log(
          'Family no longer exists.'
        );

        setLoading(false);

        return;
      }


      // ------------------------------------------------------
      // Read the members belonging to this family.
      // ------------------------------------------------------

      const membersRef = collection(
        db,
        'families',
        savedFamilyId,
        'members'
      );

      const membersSnapshot =
        await getDocs(membersRef);

      const members =
        membersSnapshot.docs.map(
          (memberDoc) => ({
            id: memberDoc.id,
            ...memberDoc.data(),
          })
        );


      const familyData = {
        id: savedFamilyId,
        ...familySnapshot.data(),
        members,
      };


      setFamily(familyData);

      setFamilyName(
        familyData.name || ''
      );

      setMeetupName(
        familyData.meetupPoint?.name || ''
      );

      setMeetupAddress(
        familyData.meetupPoint?.address || ''
      );


      // ------------------------------------------------------
      // Save the latest known copy locally.
      //
      // This becomes the offline fallback.
      // ------------------------------------------------------

      await AsyncStorage.setItem(
        LOCAL_FAMILY_KEY,
        JSON.stringify(familyData)
      );

    } catch (error) {

      console.log(
        'Failed to load family:',
        error
      );

    } finally {

      setLoading(false);

    }
  }


  // ==========================================================
  // REAL-TIME FAMILY LISTENER
  // ==========================================================

  useEffect(() => {

    if (!family.id) {
      return;
    }

    // --------------------------------------------------------
    // Firestore listener.
    //
    // When another family member changes their status,
    // this device receives the updated data automatically
    // while connected.
    // --------------------------------------------------------

    const familyRef = doc(
      db,
      'families',
      family.id
    );

    const unsubscribeFamily =
      onSnapshot(
        familyRef,
        (snapshot) => {

          if (!snapshot.exists()) {
            return;
          }

          setFamily((previous) => ({
            ...previous,
            ...snapshot.data(),
          }));

        },
        (error) => {

          console.log(
            'Family listener error:',
            error
          );

        }
      );


    const membersRef = collection(
      db,
      'families',
      family.id,
      'members'
    );

    const unsubscribeMembers =
      onSnapshot(
        membersRef,
        async (snapshot) => {

          const members =
            snapshot.docs.map(
              (memberDoc) => ({
                id: memberDoc.id,
                ...memberDoc.data(),
              })
            );


          setFamily((previous) => {

            const updated = {
              ...previous,
              members,
            };

            // ------------------------------------------------
            // Keep a local copy for offline use.
            // ------------------------------------------------

            AsyncStorage.setItem(
              LOCAL_FAMILY_KEY,
              JSON.stringify(updated)
            );

            return updated;

          });

        },
        (error) => {

          console.log(
            'Member listener error:',
            error
          );

        }
      );


    return () => {

      unsubscribeFamily();
      unsubscribeMembers();

    };

  }, [family.id]);


  // ==========================================================
  // CREATE FAMILY
  // ==========================================================

  async function createFamily() {

    if (!user) {

      Alert.alert(
        'Account Required',
        'Please sign in before creating a family circle.'
      );

      return;
    }


    if (!familyName.trim()) {

      Alert.alert(
        'Family Name Required',
        'Enter a name such as "Tan Family".'
      );

      return;
    }


    if (!meetupName.trim()) {

      Alert.alert(
        'Meetup Point Required',
        'Enter your agreed family meeting point.'
      );

      return;
    }


    if (isOffline) {

      Alert.alert(
        'Internet Required',
        'Creating a new shared family circle requires an internet connection. Your existing family plan remains available offline.'
      );

      return;
    }


    try {

      setSaving(true);


      // ------------------------------------------------------
      // Generate a short invitation code.
      //
      // The actual security boundary is still Firebase Auth +
      // Firestore Rules. This code is simply a convenient way
      // for another family member to find the invitation.
      // ------------------------------------------------------

      const generatedCode =
        generateInviteCode();


      // ------------------------------------------------------
      // CREATE THE FAMILY DOCUMENT
      // ------------------------------------------------------

      const familyRef =
        await addDoc(
          collection(db, 'families'),
          {
            name: familyName.trim(),

            createdBy: user.uid,

            meetupPoint: {
              name: meetupName.trim(),
              address: meetupAddress.trim(),
            },

            createdAt: serverTimestamp(),
          }
        );


      // ------------------------------------------------------
      // ADD THE CREATOR AS THE FIRST FAMILY MEMBER.
      //
      // There is no "authority account".
      // This is simply the person who created the family.
      // ------------------------------------------------------

      await setDoc(
        doc(
          db,
          'families',
          familyRef.id,
          'members',
          user.uid
        ),
        {
          uid: user.uid,

          name:
            user.email ||
            'Family Member',

          relationship: 'Family Member',

          status: 'WAITING',

          lastStatusUpdate:
            serverTimestamp(),

          joinedAt:
            serverTimestamp(),
        }
      );


      // ------------------------------------------------------
      // CREATE INVITATION.
      // ------------------------------------------------------

      await setDoc(
        doc(
          db,
          'families',
          familyRef.id,
          'invitations',
          generatedCode
        ),
        {
          familyId: familyRef.id,

          createdBy: user.uid,

          createdAt:
            serverTimestamp(),

          // Production implementation should also store an
          // expiry timestamp and reject expired invitations
          // through backend validation / security rules.
        }
      );


      await AsyncStorage.setItem(
        FAMILY_ID_KEY,
        familyRef.id
      );


      setInviteCode(generatedCode);


      await loadFamily(user.uid);


      Alert.alert(
        'Family Circle Created',
        `Your family circle is ready.\n\nInvitation code:\n${generatedCode}`
      );

    } catch (error) {

      console.log(
        'Create family error:',
        error
      );

      Alert.alert(
        'Unable to Create Family',
        `${error.code}\n${error.message}`
      );

    } finally {

      setSaving(false);

    }
  }


  // ==========================================================
  // GENERATE INVITATION CODE
  // ==========================================================

  function generateInviteCode() {

    const characters =
      'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let code = '';

    for (let i = 0; i < 6; i++) {

      code +=
        characters[
          Math.floor(
            Math.random() *
            characters.length
          )
        ];

    }

    return code;
  }


  // ==========================================================
  // UPDATE MEETUP POINT
  // ==========================================================

  async function saveMeetupPoint() {

    if (!family.id) {
      return;
    }


    const updatedMeetup = {

      name: meetupName.trim(),

      address: meetupAddress.trim(),

    };


    if (!updatedMeetup.name) {

      Alert.alert(
        'Meetup Point Required',
        'Enter a name for the family meetup point.'
      );

      return;
    }


    // --------------------------------------------------------
    // OFFLINE
    //
    // Save locally first.
    // --------------------------------------------------------

    const updatedFamily = {

      ...family,

      meetupPoint: updatedMeetup,

    };


    setFamily(updatedFamily);


    await AsyncStorage.setItem(
      LOCAL_FAMILY_KEY,
      JSON.stringify(updatedFamily)
    );


    if (isOffline) {

      await queueAction({
        type: 'UPDATE_MEETUP',
        familyId: family.id,
        meetupPoint: updatedMeetup,
      });


      Alert.alert(
        'Saved Offline',
        'The new meetup point is saved on this device and will be synchronised when connectivity returns.'
      );

      return;
    }


    try {

      await setDoc(
        doc(
          db,
          'families',
          family.id
        ),
        {
          meetupPoint: updatedMeetup,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );


      Alert.alert(
        'Meetup Point Saved',
        'Your family meetup point has been updated.'
      );

    } catch (error) {

      console.log(
        'Meetup save error:',
        error
      );

      await queueAction({
        type: 'UPDATE_MEETUP',
        familyId: family.id,
        meetupPoint: updatedMeetup,
      });

      Alert.alert(
        'Saved Offline',
        'The change is stored locally and will be synchronised when possible.'
      );

    }
  }


  // ==========================================================
  // CHANGE MEMBER STATUS
  // ==========================================================

  async function updateMyStatus(status) {

    if (!user || !family.id) {
      return;
    }


    const memberRef = doc(
      db,
      'families',
      family.id,
      'members',
      user.uid
    );


    // --------------------------------------------------------
    // Update our local copy immediately.
    //
    // This makes the interface responsive even if the network
    // is unavailable.
    // --------------------------------------------------------

    const updatedMembers =
      family.members.map(
        (member) =>
          member.uid === user.uid
            ? {
                ...member,
                status,
                localUpdatedAt:
                  new Date().toISOString(),
              }
            : member
      );


    const updatedFamily = {
      ...family,
      members: updatedMembers,
    };


    setFamily(updatedFamily);


    await AsyncStorage.setItem(
      LOCAL_FAMILY_KEY,
      JSON.stringify(updatedFamily)
    );


    // --------------------------------------------------------
    // OFFLINE
    //
    // IMPORTANT:
    // We do NOT claim that the family received the status.
    //
    // It is only saved locally until connectivity returns.
    // --------------------------------------------------------

    if (isOffline) {

      await queueAction({
        type: 'UPDATE_STATUS',
        familyId: family.id,
        uid: user.uid,
        status,
      });


      Alert.alert(
        'Saved Offline',
        `Your status is saved as ${status} on this device. It will be shared with your family when connectivity returns.`
      );

      return;
    }


    try {

      await setDoc(
        memberRef,
        {
          status,

          lastStatusUpdate:
            serverTimestamp(),

        },
        {
          merge: true,
        }
      );


      Alert.alert(
        'Safety Status Updated',
        `Your family status is now ${status}.`
      );

    } catch (error) {

      console.log(
        'Status update failed:',
        error
      );


      await queueAction({
        type: 'UPDATE_STATUS',
        familyId: family.id,
        uid: user.uid,
        status,
      });


      Alert.alert(
        'Saved Offline',
        'Your status is saved on this device and will synchronise when connectivity returns.'
      );

    }
  }


  // ==========================================================
  // QUEUE OFFLINE ACTION
  // ==========================================================

  async function queueAction(action) {

    try {

      const existing =
        await AsyncStorage.getItem(
          PENDING_ACTIONS_KEY
        );

      const actions =
        existing
          ? JSON.parse(existing)
          : [];


      actions.push({
        ...action,
        createdAt:
          new Date().toISOString(),
      });


      await AsyncStorage.setItem(
        PENDING_ACTIONS_KEY,
        JSON.stringify(actions)
      );


      setPendingActions(actions);

    } catch (error) {

      console.log(
        'Failed to queue action:',
        error
      );

    }
  }


  // ==========================================================
  // SYNCHRONISE OFFLINE ACTIONS
  // ==========================================================

  async function syncPendingActions() {

    try {

      const saved =
        await AsyncStorage.getItem(
          PENDING_ACTIONS_KEY
        );


      if (!saved) {
        return;
      }


      const actions =
        JSON.parse(saved);


      if (!actions.length) {
        return;
      }


      const remaining = [];


      for (const action of actions) {

        try {

          if (
            action.type ===
            'UPDATE_STATUS'
          ) {

            await setDoc(
              doc(
                db,
                'families',
                action.familyId,
                'members',
                action.uid
              ),
              {
                status:
                  action.status,

                lastStatusUpdate:
                  serverTimestamp(),
              },
              {
                merge: true,
              }
            );

          }


          if (
            action.type ===
            'UPDATE_MEETUP'
          ) {

            await setDoc(
              doc(
                db,
                'families',
                action.familyId
              ),
              {
                meetupPoint:
                  action.meetupPoint,

                updatedAt:
                  serverTimestamp(),
              },
              {
                merge: true,
              }
            );

          }

        } catch (error) {

          // --------------------------------------------------
          // Keep the action in the queue if Firebase is still
          // unavailable.
          // --------------------------------------------------

          remaining.push(action);

        }

      }


      await AsyncStorage.setItem(
        PENDING_ACTIONS_KEY,
        JSON.stringify(remaining)
      );


      setPendingActions(remaining);

    } catch (error) {

      console.log(
        'Sync error:',
        error
      );

    }
  }


  // ==========================================================
  // ADD FAMILY MEMBER / INVITATION
  // ==========================================================

  async function createInvitation() {

    if (!family.id) {
      return;
    }


    if (isOffline) {

      Alert.alert(
        'Internet Required',
        'Creating an invitation requires connectivity.'
      );

      return;
    }


    try {

      const code =
        generateInviteCode();


      await setDoc(
        doc(
          db,
          'families',
          family.id,
          'invitations',
          code
        ),
        {
          familyId:
            family.id,

          createdBy:
            user.uid,

          createdAt:
            serverTimestamp(),
        }
      );


      setInviteCode(code);


      Alert.alert(
        'Invitation Created',
        `Share this code with your family member:\n\n${code}`
      );

    } catch (error) {

      console.log(
        'Invitation error:',
        error
      );

    }
  }


  // ==========================================================
  // JOIN FAMILY
  // ==========================================================

  async function joinFamily() {

    if (!user) {
      return;
    }


    const code =
      joinCode.trim().toUpperCase();


    if (!code) {

      Alert.alert(
        'Invitation Required',
        'Enter the family invitation code.'
      );

      return;
    }


    if (isOffline) {

      Alert.alert(
        'Internet Required',
        'Joining a family requires an internet connection.'
      );

      return;
    }


    try {

      // ------------------------------------------------------
      // Search for the invitation.
      //
      // In a hardened production deployment, invitation
      // claiming should also be protected against abuse,
      // expired codes and repeated claims.
      // ------------------------------------------------------

      const familiesSnapshot =
        await getDocs(
          collection(db, 'families')
        );


      let matchedFamily = null;


      for (
        const familyDoc
        of familiesSnapshot.docs
      ) {

        const invitationRef =
          doc(
            db,
            'families',
            familyDoc.id,
            'invitations',
            code
          );


        const invitationSnapshot =
          await getDoc(invitationRef);


        if (
          invitationSnapshot.exists()
        ) {

          matchedFamily = {
            id: familyDoc.id,
            ...familyDoc.data(),
          };

          break;

        }

      }


      if (!matchedFamily) {

        Alert.alert(
          'Invalid Invitation',
          'That family invitation could not be found.'
        );

        return;
      }


      // ------------------------------------------------------
      // Add this authenticated Firebase user as a family
      // member.
      // ------------------------------------------------------

      await setDoc(
        doc(
          db,
          'families',
          matchedFamily.id,
          'members',
          user.uid
        ),
        {
          uid: user.uid,

          name:
            user.email ||
            'Family Member',

          relationship:
            'Family Member',

          status:
            'WAITING',

          joinedAt:
            serverTimestamp(),

          lastStatusUpdate:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );


      await AsyncStorage.setItem(
        FAMILY_ID_KEY,
        matchedFamily.id
      );


      await loadFamily(user.uid);


      Alert.alert(
        'Joined Family',
        `You are now part of ${matchedFamily.name}.`
      );


    } catch (error) {

      console.log(
        'Join family error:',
        error
      );


      Alert.alert(
        'Unable to Join',
        'Please check your invitation code and connection.'
      );

    }

  }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color="#38BDF8"
        />

        <Text style={styles.loadingText}>
          Loading Family Safe...
        </Text>

      </View>
    );
  }


  // ==========================================================
  // AUTHENTICATION SCREEN
  //
  // For production, you would normally give this its own
  // screen rather than keeping registration inside Family Safe.
  // It is included here so the architecture is clear.
  // ==========================================================

  if (!user) {

    return (
      <AuthenticationPanel />
    );

  }


  // ==========================================================
  // NO FAMILY YET
  // ==========================================================

  if (!family.id) {

    return (

      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >

            <Ionicons
              name="arrow-back"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.backText}>
              Resources
            </Text>

          </TouchableOpacity>


          <View style={styles.header}>

            <View style={styles.titleIcon}>

              <Ionicons
                name="people-outline"
                size={25}
                color="#38BDF8"
              />

            </View>

            <View style={styles.headerText}>

              <Text style={styles.title}>
                Family Safety Circle
              </Text>

              <Text style={styles.subtitle}>
                Create a private family emergency plan
                and stay connected during emergencies.
              </Text>

            </View>

          </View>


          <OfflineBanner
            offline={isOffline}
          />


          {/* CREATE FAMILY */}

          <View style={styles.sectionCard}>

            <Text style={styles.sectionTitle}>
              Create a Family Circle
            </Text>

            <Text style={styles.sectionSubtitle}>
              Set up the shared family plan on this device.
            </Text>


            <TextInput
              style={styles.input}
              placeholder="Family name"
              placeholderTextColor="#64748B"
              value={familyName}
              onChangeText={setFamilyName}
            />


            <TextInput
              style={styles.input}
              placeholder="Meetup point"
              placeholderTextColor="#64748B"
              value={meetupName}
              onChangeText={setMeetupName}
            />


            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
              ]}
              placeholder="Location / description"
              placeholderTextColor="#64748B"
              value={meetupAddress}
              onChangeText={setMeetupAddress}
              multiline
            />


            <TouchableOpacity
              style={styles.primaryButton}
              onPress={createFamily}
              disabled={saving}
            >

              <Ionicons
                name="people-outline"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.primaryButtonText}>
                Create Family Circle
              </Text>

            </TouchableOpacity>

          </View>


          {/* JOIN FAMILY */}

          <View style={styles.sectionCard}>

            <Text style={styles.sectionTitle}>
              Join an Existing Family
            </Text>

            <Text style={styles.sectionSubtitle}>
              Enter the invitation code provided by
              another family member.
            </Text>


            <TextInput
              style={styles.input}
              placeholder="Example: F8K2QM"
              placeholderTextColor="#64748B"
              value={joinCode}
              onChangeText={setJoinCode}
              autoCapitalize="characters"
            />


            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={joinFamily}
            >

              <Ionicons
                name="enter-outline"
                size={19}
                color="#38BDF8"
              />

              <Text style={styles.secondaryButtonText}>
                Join Family
              </Text>

            </TouchableOpacity>

          </View>


        </ScrollView>

      </KeyboardAvoidingView>

    );
  }


  // ==========================================================
  // MAIN FAMILY DASHBOARD
  // ==========================================================

  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* BACK */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >

          <Ionicons
            name="arrow-back"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.backText}>
            Resources
          </Text>

        </TouchableOpacity>


        {/* HEADER */}

        <View style={styles.header}>

          <View style={styles.titleIcon}>

            <Ionicons
              name="people-outline"
              size={25}
              color="#38BDF8"
            />

          </View>

          <View style={styles.headerText}>

            <Text style={styles.title}>
              {family.name}
            </Text>

            <Text style={styles.subtitle}>
              Family Safety Circle
            </Text>

          </View>

        </View>


        <OfflineBanner
          offline={isOffline}
        />


        {/* ====================================================
            MEETUP POINT
        ==================================================== */}

        <View style={styles.sectionCard}>

          <View style={styles.sectionHeader}>

            <View style={styles.sectionIcon}>

              <Ionicons
                name="location-outline"
                size={21}
                color="#34D399"
              />

            </View>

            <View>

              <Text style={styles.sectionTitle}>
                Family Meetup Point
              </Text>

              <Text style={styles.sectionSubtitle}>
                The location everyone agreed on.
              </Text>

            </View>

          </View>


          <TextInput
            style={styles.input}
            placeholder="Meetup point"
            placeholderTextColor="#64748B"
            value={meetupName}
            onChangeText={setMeetupName}
          />


          <TextInput
            style={[
              styles.input,
              styles.multilineInput,
            ]}
            placeholder="Location / description"
            placeholderTextColor="#64748B"
            value={meetupAddress}
            onChangeText={setMeetupAddress}
            multiline
          />


          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={saveMeetupPoint}
          >

            <Ionicons
              name="save-outline"
              size={18}
              color="#38BDF8"
            />

            <Text style={styles.secondaryButtonText}>
              Save Meetup Point
            </Text>

          </TouchableOpacity>

        </View>


        {/* ====================================================
            FAMILY MEMBERS
        ==================================================== */}

        <View style={styles.sectionCard}>

          <View style={styles.sectionHeader}>

            <View style={styles.sectionIconBlue}>

              <Ionicons
                name="people"
                size={21}
                color="#38BDF8"
              />

            </View>

            <View>

              <Text style={styles.sectionTitle}>
                Family Members
              </Text>

              <Text style={styles.sectionSubtitle}>
                Latest safety status shared by each member.
              </Text>

            </View>

          </View>


          {family.members.map(
            (member) => (

              <View
                key={member.id}
                style={styles.memberCard}
              >

                <View style={styles.memberIcon}>

                  <Ionicons
                    name="person-outline"
                    size={19}
                    color="#94A3B8"
                  />

                </View>


                <View style={styles.memberInfo}>

                  <Text style={styles.memberName}>
                    {member.name}
                  </Text>

                  <Text style={styles.memberRelationship}>
                    {member.relationship}
                  </Text>

                </View>


                <StatusBadge
                  status={member.status}
                />

              </View>

            )
          )}

        </View>


        {/* ====================================================
            MY STATUS
        ==================================================== */}

        <View style={styles.sectionCard}>

          <Text style={styles.sectionTitle}>
            My Safety Status
          </Text>

          <Text style={styles.sectionSubtitle}>
            Tell your family whether you are safe.
          </Text>


          <TouchableOpacity
            style={styles.safeButton}
            onPress={() =>
              updateMyStatus('SAFE')
            }
          >

            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color="#FFFFFF"
            />

            <Text style={styles.statusButtonText}>
              I'm Safe
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.helpButton}
            onPress={() =>
              updateMyStatus('NEED HELP')
            }
          >

            <Ionicons
              name="alert-circle-outline"
              size={22}
              color="#FFFFFF"
            />

            <Text style={styles.statusButtonText}>
              I Need Help
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.waitingButton}
            onPress={() =>
              updateMyStatus('WAITING')
            }
          >

            <Ionicons
              name="time-outline"
              size={22}
              color="#FBBF24"
            />

            <Text style={styles.waitingButtonText}>
              Not Checked In
            </Text>

          </TouchableOpacity>

        </View>


        {/* ====================================================
            INVITATION
        ==================================================== */}

        <View style={styles.sectionCard}>

          <Text style={styles.sectionTitle}>
            Add Family Members
          </Text>

          <Text style={styles.sectionSubtitle}>
            Generate a private invitation for another
            family member.
          </Text>


          <TouchableOpacity
            style={styles.primaryButton}
            onPress={createInvitation}
          >

            <Ionicons
              name="person-add-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text style={styles.primaryButtonText}>
              Generate Invitation
            </Text>

          </TouchableOpacity>


          {inviteCode !== '' && (

            <View style={styles.inviteBox}>

              <Text style={styles.inviteLabel}>
                FAMILY INVITATION CODE
              </Text>

              <Text style={styles.inviteCode}>
                {inviteCode}
              </Text>

              <Text style={styles.inviteDescription}>
                Share this code privately with your
                family member.
              </Text>

            </View>

          )}

        </View>


        {/* ====================================================
            OFFLINE INFORMATION
        ==================================================== */}

        <View style={styles.infoCard}>

          <Ionicons
            name="shield-checkmark-outline"
            size={19}
            color="#38BDF8"
          />

          <Text style={styles.infoText}>
            Family Safe does not track live locations.
            It shares voluntary safety statuses and the
            agreed meetup point. Your latest family plan
            remains available on this device when offline.
          </Text>

        </View>


      </ScrollView>

    </KeyboardAvoidingView>

  );
}


// ============================================================
// AUTHENTICATION PANEL
// ============================================================
//
// In the finished application I would put this into its own
// AuthScreen. It is shown here to demonstrate the Firebase
// authentication connection.
//
// ============================================================

function AuthenticationPanel() {

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [creating, setCreating] = useState(false);


  async function createAccount() {

    if (!email.trim() || password.length < 6) {

      Alert.alert(
        'Account Details Required',
        'Enter an email and a password of at least 6 characters.'
      );

      return;
    }


    try {

      setCreating(true);

      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    } catch (error) {

      Alert.alert(
        'Account Creation Failed',
        getAuthErrorMessage(error)
      );

    } finally {

      setCreating(false);

    }
  }


  async function login() {

    try {

      setCreating(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    } catch (error) {

      Alert.alert(
        'Sign In Failed',
        getAuthErrorMessage(error)
      );

    } finally {

      setCreating(false);

    }
  }


  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >

      <ScrollView
        contentContainerStyle={styles.authContent}
        keyboardShouldPersistTaps="handled"
      >

        <View style={styles.authIcon}>

          <Ionicons
            name="shield-checkmark-outline"
            size={36}
            color="#38BDF8"
          />

        </View>


        <Text style={styles.authTitle}>
          Family Safety
        </Text>


        <Text style={styles.authSubtitle}>
          Create a private account so Family Safe can
          securely identify your family members.
        </Text>


        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#64748B"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />


        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#64748B"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />


        <TouchableOpacity
          style={styles.primaryButton}
          onPress={createAccount}
          disabled={creating}
        >

          <Text style={styles.primaryButtonText}>
            Create Account
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={login}
          disabled={creating}
        >

          <Text style={styles.secondaryButtonText}>
            Sign In
          </Text>

        </TouchableOpacity>


        <Text style={styles.authNote}>
          This is a family-member account, not an authority
          or administrator account.
        </Text>

      </ScrollView>

    </KeyboardAvoidingView>

  );
}


// ============================================================
// OFFLINE BANNER
// ============================================================

function OfflineBanner({ offline }) {

  return (

    <View
      style={[
        styles.offlineBanner,
        offline
          ? styles.offline
          : styles.online,
      ]}
    >

      <Ionicons
        name={
          offline
            ? 'cloud-offline-outline'
            : 'cloud-done-outline'
        }
        size={18}
        color={
          offline
            ? '#FBBF24'
            : '#34D399'
        }
      />


      <View style={styles.offlineTextContainer}>

        <Text
          style={[
            styles.offlineTitle,
            {
              color:
                offline
                  ? '#FBBF24'
                  : '#34D399',
            },
          ]}
        >
          {offline
            ? 'Offline'
            : 'Connected'}
        </Text>


        <Text style={styles.offlineSubtitle}>
          {offline
            ? 'Changes are saved locally and will sync when possible.'
            : 'Family safety information can synchronise.'}
        </Text>

      </View>

    </View>

  );
}


// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({ status }) {

  let backgroundColor = '#78350F';

  let color = '#FBBF24';

  if (status === 'SAFE') {

    backgroundColor = '#064E3B';

    color = '#34D399';

  }

  if (status === 'NEED HELP') {

    backgroundColor = '#7F1D1D';

    color = '#FCA5A5';

  }


  return (

    <View
      style={[
        styles.statusBadge,
        { backgroundColor },
      ]}
    >

      <Text
        style={[
          styles.statusText,
          { color },
        ]}
      >
        {status}
      </Text>

    </View>

  );
}


// ============================================================
// FIREBASE AUTH ERROR TRANSLATION
// ============================================================

function getAuthErrorMessage(error) {

  switch (error.code) {

    case 'auth/email-already-in-use':
      return 'An account already exists with this email.';

    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/weak-password':
      return 'Please use a stronger password.';

    case 'auth/invalid-credential':
      return 'The email or password is incorrect.';

    default:
      return 'Please try again.';
  }
}


// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#020617',
  },

  content: {
    padding: 20,
    paddingTop: 45,
    paddingBottom: 70,
  },

  authContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 13,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingVertical: 5,
  },

  backText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  titleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerText: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },

  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 13,
    marginBottom: 16,
    borderWidth: 1,
  },

  offline: {
    backgroundColor: '#422006',
    borderColor: '#92400E',
  },

  online: {
    backgroundColor: '#052E16',
    borderColor: '#166534',
  },

  offlineTextContainer: {
    flex: 1,
    marginLeft: 9,
  },

  offlineTitle: {
    fontSize: 12,
    fontWeight: '900',
  },

  offlineSubtitle: {
    color: '#CBD5E1',
    fontSize: 10,
    marginTop: 2,
  },

  sectionCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  sectionIconBlue: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#082F49',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  sectionSubtitle: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 3,
    marginBottom: 12,
  },

  input: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E293B',
    color: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 13,
    marginBottom: 12,
  },

  multilineInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },

  primaryButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 5,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 7,
  },

  secondaryButton: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1D4ED8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },

  secondaryButtonText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 7,
  },

  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 13,
    padding: 11,
    marginBottom: 9,
  },

  memberIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  memberInfo: {
    flex: 1,
    marginLeft: 9,
  },

  memberName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  memberRelationship: {
    color: '#64748B',
    fontSize: 9,
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 7,
  },

  statusText: {
    fontSize: 8,
    fontWeight: '900',
  },

  safeButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    marginBottom: 9,
  },

  helpButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    marginBottom: 9,
  },

  waitingButton: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#92400E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
  },

  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 7,
  },

  waitingButtonText: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 7,
  },

  inviteBox: {
    backgroundColor: '#082F49',
    borderWidth: 1,
    borderColor: '#0369A1',
    borderRadius: 14,
    padding: 16,
    marginTop: 15,
    alignItems: 'center',
  },

  inviteLabel: {
    color: '#7DD3FC',
    fontSize: 9,
    fontWeight: '900',
  },

  inviteCode: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 4,
    marginTop: 6,
  },

  inviteDescription: {
    color: '#BAE6FD',
    fontSize: 10,
    marginTop: 7,
    textAlign: 'center',
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#0B1120',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginTop: 2,
  },

  infoText: {
    flex: 1,
    color: '#64748B',
    fontSize: 10,
    lineHeight: 15,
    marginLeft: 8,
  },

  authIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 18,
  },

  authTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
  },

  authSubtitle: {
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 25,
  },

  authNote: {
    color: '#475569',
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 18,
  },

});
