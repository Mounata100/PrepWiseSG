// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Switch,
//   ScrollView,
// } from 'react-native';
// import { Card } from 'react-native-paper';
// import { scheduleReadinessReminder} from "../services/Notifications";
// import { useUser } from '../contexts/UserContext';

// export default function OnboardingScreen() {
//   const { completeOnboarding, theme, setTheme } = useUser();
  
//   const [currentStep, setCurrentStep] = useState(1);
//   const [prepLevel, setPrepLevel] = useState(null); // beginner, intermediate, advanced
//   const [selectedGoal, setSelectedGoal] = useState(null); // daily, 3day, 5day, weekly
//   const [notifications, setNotifications] = useState(true);

//   const isDark = theme === 'dark';
//   const totalSteps = 4;

//   // Strict Dynamic Theme
//   const colors = {
//     bg: isDark ? '#030712' : '#F8FAFC',
//     card: isDark ? '#111827' : '#FFFFFF',
//     border: isDark ? '#1F2937' : '#E2E8F0',
//     text: isDark ? '#FFFFFF' : '#0F172A',
//     sub: isDark ? '#94A3B8' : '#475569',
//     accent: '#0F766E', // PrepWise Teal
//   };

//   const handleNextStep = () => {
//     if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
//   };

//   const handleBackStep = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   const handleFinish = async () => {
//     if (selectedGoal && prepLevel) {
//       const streakInterval =
//         selectedGoal === "daily" ? 1 :
//         selectedGoal === "3day" ? 3 :
//         selectedGoal === "5day" ? 5 :
//         7;
//       // Pass gathered information up to user context
//       completeOnboarding({
//         goal: selectedGoal,
//         streakInterval,
//         //   selectedGoal==="daily" ? 1 :
//         //   selectedGoal==="3day" ? 3 :
//         //   selectedGoal==="5day" ? 5 :
//         //   selectedGoal==="weekly" ? 7 : null,
//         experienceLevel: prepLevel,
//         notificationsAllowed: notifications,
//       });
//       if(notifications){
//         await scheduleReadinessReminder(
//           streakInterval
//         );
//       }
//     }
//   };

//   const progressPercent = `${(currentStep / totalSteps) * 100}%`;

//   return (
//     <View style={[styles.container, { backgroundColor: colors.bg }]}>
      
//       {/* Top Progress Bar Head Tracker */}
//       <View style={styles.progressContainer}>
//         <View style={[styles.progressBarBackground, { backgroundColor: isDark ? '#1F2937' : '#E2E8F0' }]}>
//           <View style={[styles.progressBarFill, { width: progressPercent, backgroundColor: colors.accent }]} />
//         </View>
//         <Text style={[styles.stepText, { color: colors.sub }]}>
//           Mission Progress: Step {currentStep} of {totalSteps}
//         </Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
//         {/* STEP 1: WELCOME & BRIEFING */}
//         {currentStep === 1 && (
//           <View style={styles.stepContent}>
//             <Text style={[styles.title, { color: colors.text }]}>
//               Welcome to PrepWise 🛡️
//             </Text>
//             <Text style={[styles.subtitle, { color: colors.sub }]}>
//               Your tactical companion for disaster survival and emergency readiness. Let's get your training module initialized.
//             </Text>

//             <Card style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
//               <Text style={[styles.cardHeader, { color: colors.text }]}>What to expect:</Text>
//               <Text style={[styles.bulletItem, { color: colors.sub }]}>• 🛠️ Build custom emergency checklists</Text>
//               <Text style={[styles.bulletItem, { color: colors.sub }]}>• 🎮 Earn XP through survival drills</Text>
//               <Text style={[styles.bulletItem, { color: colors.sub }]}>• 📢 Receive real-time local crisis alerts</Text>
//             </Card>

//             <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.accent }]} onPress={handleNextStep}>
//               <Text style={styles.actionButtonText}>Begin Briefing</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* STEP 2: ENVIRONMENTAL SETTINGS */}
//         {currentStep === 2 && (
//           <View style={styles.stepContent}>
//             <Text style={[styles.title, { color: colors.text }]}>
//               Configure Interface ⚙️
//             </Text>
//             <Text style={[styles.subtitle, { color: colors.sub }]}>
//               Optimize the layout configuration for clear visibility under crisis parameters.
//             </Text>

//             {/* Theme Toggle */}
//             <Card style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 12 }]}>
//               <View style={styles.row}>
//                 <View style={{ flex: 1 }}>
//                   <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
//                   <Text style={[styles.settingSub, { color: colors.sub }]}>Better battery preservation and night visibility.</Text>
//                 </View>
//                 <Switch value={isDark} onValueChange={() => setTheme(isDark ? 'light' : 'dark')} thumbColor="#0F766E" />
//               </View>
//             </Card>

//             {/* Notifications Toggle */}
//             <Card style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 30 }]}>
//               <View style={styles.row}>
//                 <View style={{ flex: 1 }}>
//                   <Text style={[styles.settingTitle, { color: colors.text }]}>Tactical Alerts</Text>
//                   <Text style={[styles.settingSub, { color: colors.sub }]}>Get instant pings for natural disasters near you.</Text>
//                 </View>
//                 <Switch value={notifications} onValueChange={setNotifications} thumbColor="#0F766E" />
//               </View>
//             </Card>

//             <View style={styles.buttonRow}>
//               <TouchableOpacity style={[styles.backButton, { borderColor: colors.border }]} onPress={handleBackStep}>
//                 <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.accent, flex: 2 }]} onPress={handleNextStep}>
//                 <Text style={styles.actionButtonText}>Save & Continue</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}

//         {/* STEP 3: ASSESS PREPAREDNESS */}
//         {currentStep === 3 && (
//           <View style={styles.stepContent}>
//             <Text style={[styles.title, { color: colors.text }]}>
//               Current Status 🎒
//             </Text>
//             <Text style={[styles.subtitle, { color: colors.sub }]}>
//               How prepared are you if an environmental crisis hits your location right now?
//             </Text>

//             <View style={styles.optionsContainer}>
//               {[
//                 { id: 'beginner', title: 'Unprepared', desc: 'No gear, no specific plan. Ready to learn.' },
//                 { id: 'intermediate', title: 'Basic Prep', desc: 'I have water, food, and basic first-aid ready.' },
//                 { id: 'advanced', title: 'Survivalist', desc: 'Fully packed go-bag, communication lines, and structural plans.' },
//               ].map((lvl) => {
//                 const selected = prepLevel === lvl.id;
//                 return (
//                   <TouchableOpacity
//                     key={lvl.id}
//                     style={[styles.option, { backgroundColor: colors.card, borderColor: selected ? colors.accent : colors.border, borderWidth: selected ? 2 : 1 }]}
//                     onPress={() => setPrepLevel(lvl.id)}
//                   >
//                     <View style={{ flex: 1 }}>
//                       <Text style={[styles.optionText, { color: colors.text }]}>{lvl.title}</Text>
//                       <Text style={[styles.optionSubText, { color: colors.sub }]}>{lvl.desc}</Text>
//                     </View>
//                     {selected && <Text style={{ color: colors.accent, fontWeight: '800' }}>✓</Text>}
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>

//             <View style={styles.buttonRow}>
//               <TouchableOpacity style={[styles.backButton, { borderColor: colors.border }]} onPress={handleBackStep}>
//                 <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 style={[styles.actionButton, { backgroundColor: colors.accent, flex: 2, opacity: prepLevel ? 1 : 0.5 }]} 
//                 disabled={!prepLevel} 
//                 onPress={handleNextStep}
//               >
//                 <Text style={styles.actionButtonText}>Next: Establish Streak</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}

//         {/* STEP 4: GOAL / STREAK SELECTION */}
//         {currentStep === 4 && (
//           <View style={styles.stepContent}>
//             <Text style={[styles.title, { color: colors.text }]}>
//               Select Training Cycle 🎯
//             </Text>
//             <Text style={[styles.subtitle, { color: colors.sub }]}>
//               Choose how often you want to challenge your crisis readiness awareness.
//             </Text>

//             <View style={styles.optionsContainer}>
//               {[
//                 { id: 'daily', label: 'Daily Readiness', sub: 'Quick 1-minute daily checklist' },
//                 { id: '3day', label: '3-Day Challenge', sub: 'Short burst preparedness drill' },
//                 { id: '5day', label: '5-Day Challenge', sub: 'Extended incident planning test' },
//                 { id: 'weekly', label: 'Weekly Readiness', sub: 'Deep dive check-in once a week' },
//               ].map((goal) => {
//                 const isSelected = selectedGoal === goal.id;
//                 return (
//                   <TouchableOpacity
//                     key={goal.id}
//                     style={[styles.option, { backgroundColor: colors.card, borderColor: isSelected ? colors.accent : colors.border, borderWidth: isSelected ? 2 : 1 }]}
//                     onPress={() => setSelectedGoal(goal.id)}
//                   >
//                     <View style={{ flex: 1 }}>
//                       <Text style={[styles.optionText, { color: colors.text }]}>{goal.label}</Text>
//                       <Text style={[styles.optionSubText, { color: colors.sub }]}>{goal.sub}</Text>
//                     </View>
//                     {isSelected && <Text style={{ color: colors.accent, fontWeight: '800' }}>✓</Text>}
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>

//             <View style={styles.buttonRow}>
//               <TouchableOpacity style={[styles.backButton, { borderColor: colors.border }]} onPress={handleBackStep}>
//                 <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.actionButton, { backgroundColor: colors.accent, flex: 2, opacity: selectedGoal ? 1 : 0.5 }]}
//                 disabled={!selectedGoal}
//                 onPress={handleFinish}
//               >
//                 <Text style={styles.actionButtonText}>
//                   Deploy Profile (+50 XP)
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}

//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingTop: 60,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     paddingBottom: 40,
//   },
//   progressContainer: {
//     marginBottom: 20,
//   },
//   progressBarBackground: {
//     height: 8,
//     borderRadius: 4,
//     width: '100%',
//     overflow: 'hidden',
//   },
//   progressBarFill: {
//     height: '100%',
//     borderRadius: 4,
//   },
//   stepText: {
//     marginTop: 8,
//     fontSize: 13,
//     fontWeight: '700',
//     textAlign: 'right',
//   },
//   stepContent: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '900',
//     marginBottom: 12,
//     letterSpacing: -0.5,
//   },
//   subtitle: {
//     fontSize: 16,
//     marginBottom: 24,
//     lineHeight: 22,
//   },
//   card: {
//     borderRadius: 20,
//     padding: 20,
//     borderWidth: 1,
//     elevation: 0,
//     marginBottom: 24,
//   },
//   cardHeader: {
//     fontSize: 16,
//     fontWeight: '800',
//     marginBottom: 10,
//   },
//   bulletItem: {
//     fontSize: 15,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   settingTitle: {
//     fontSize: 17,
//     fontWeight: 'bold',
//   },
//   settingSub: {
//     marginTop: 2,
//     fontSize: 13,
//     lineHeight: 18,
//   },
//   optionsContainer: {
//     marginBottom: 16,
//   },
//   option: {
//     paddingVertical: 14,
//     paddingHorizontal: 18,
//     borderRadius: 16,
//     marginBottom: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   optionText: {
//     fontSize: 16,
//     fontWeight: '800',
//   },
//   optionSubText: {
//     fontSize: 13,
//     marginTop: 2,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     gap: 12,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   actionButton: {
//     height: 56,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   actionButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '800',
//   },
//   backButton: {
//     flex: 1,
//     height: 56,
//     borderRadius: 16,
//     borderWidth: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   backButtonText: {
//     fontSize: 16,
//     fontWeight: '700',
//   },
// });



import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card } from 'react-native-paper';

import { scheduleReadinessReminder } from '../services/Notifications';
import { useUser } from '../contexts/UserContext';

const TOTAL_STEPS = 4;
const ACCENT_COLOR = '#0F766E';

const PREPARATION_LEVELS = [
  {
    id: 'beginner',
    title: 'Getting Started',
    description:
      'I have limited emergency supplies or a preparedness plan.',
  },
  {
    id: 'intermediate',
    title: 'Somewhat Prepared',
    description:
      'I have basic supplies such as water, food, and first-aid equipment.',
  },
  {
    id: 'advanced',
    title: 'Well Prepared',
    description:
      'I have an emergency kit, communication plan, and established response procedures.',
  },
];

const READINESS_GOALS = [
  {
    id: 'daily',
    label: 'Daily Readiness',
    description: 'Complete a short preparedness activity each day.',
    interval: 1,
  },
  {
    id: '3day',
    label: '3-Day Challenge',
    description: 'Complete preparedness activities over a three-day cycle.',
    interval: 3,
  },
  {
    id: '5day',
    label: '5-Day Challenge',
    description: 'Complete a structured five-day preparedness cycle.',
    interval: 5,
  },
  {
    id: 'weekly',
    label: 'Weekly Readiness',
    description: 'Review and improve your preparedness once each week.',
    interval: 7,
  },
];

export default function OnboardingScreen() {
  const { completeOnboarding, theme, setTheme } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [prepLevel, setPrepLevel] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#030712' : '#F8FAFC',
    card: isDark ? '#111827' : '#FFFFFF',
    border: isDark ? '#1F2937' : '#E2E8F0',
    text: isDark ? '#FFFFFF' : '#0F172A',
    secondaryText: isDark ? '#94A3B8' : '#475569',
    muted: isDark ? '#64748B' : '#64748B',
    accent: ACCENT_COLOR,
  };

  const progressPercentage = `${(currentStep / TOTAL_STEPS) * 100}%`;

  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((previousStep) => previousStep + 1);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1 && !isSubmitting) {
      setCurrentStep((previousStep) => previousStep - 1);
    }
  };

  const handleFinish = async () => {
    if (!selectedGoal || !prepLevel || isSubmitting) {
      return;
    }

    const selectedGoalData = READINESS_GOALS.find(
      (goal) => goal.id === selectedGoal
    );

    if (!selectedGoalData) {
      return;
    }

    setIsSubmitting(true);

    try {
      await completeOnboarding({
        goal: selectedGoal,
        streakInterval: selectedGoalData.interval,
        experienceLevel: prepLevel,
        notificationsAllowed: notifications,
      });

      if (notifications) {
        try {
          await scheduleReadinessReminder(selectedGoalData.interval);
        } catch (notificationError) {
          console.warn(
            'Unable to schedule readiness reminder:',
            notificationError
          );
        }
      }
    } catch (error) {
      console.error('Unable to complete onboarding:', error);

      Alert.alert(
        'Unable to Complete Setup',
        'Your onboarding information could not be saved. Please try again.'
      );

      setIsSubmitting(false);
    }
  };

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      <View
        style={[
          styles.progressBarBackground,
          { backgroundColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.progressBarFill,
            {
              width: progressPercentage,
              backgroundColor: colors.accent,
            },
          ]}
        />
      </View>

      <Text style={[styles.stepText, { color: colors.secondaryText }]}>
        Step {currentStep} of {TOTAL_STEPS}
      </Text>
    </View>
  );

  const renderNavigationButtons = ({
    onNext,
    nextLabel,
    nextDisabled = false,
  }) => (
    <View style={styles.buttonRow}>
      {currentStep > 1 && (
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              borderColor: colors.border,
              opacity: isSubmitting ? 0.5 : 1,
            },
          ]}
          onPress={handleBackStep}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Go back to the previous step"
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>
            Back
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[
          styles.actionButton,
          {
            backgroundColor: colors.accent,
            flex: currentStep > 1 ? 2 : 1,
            opacity: nextDisabled || isSubmitting ? 0.5 : 1,
          },
        ]}
        onPress={onNext}
        disabled={nextDisabled || isSubmitting}
        accessibilityRole="button"
        accessibilityLabel={nextLabel}
        accessibilityState={{
          disabled: nextDisabled || isSubmitting,
          busy: isSubmitting,
        }}
      >
        <Text style={styles.actionButtonText}>
          {isSubmitting && currentStep === TOTAL_STEPS
            ? 'Saving...'
            : nextLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {renderProgress()}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* STEP 1 */}
        {currentStep === 1 && (
          <View style={styles.stepContent}>
            <Text style={[styles.title, { color: colors.text }]}>
              Welcome
            </Text>

            <Text
              style={[styles.subtitle, { color: colors.secondaryText }]}
            >
              Build your preparedness profile and develop practical skills for
              responding to climate-related emergencies in Singapore.
            </Text>

            <Card
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.cardHeader, { color: colors.text }]}>
                What you can expect
              </Text>

              <Text
                style={[styles.bulletItem, { color: colors.secondaryText }]}
              >
                Build and complete personalised emergency checklists.
              </Text>

              <Text
                style={[styles.bulletItem, { color: colors.secondaryText }]}
              >
                Complete quizzes and preparedness activities to earn experience
                points.
              </Text>

              <Text
                style={[styles.bulletItem, { color: colors.secondaryText }]}
              >
                Receive relevant environmental and emergency notifications.
              </Text>

              <Text
                style={[styles.bulletItem, { color: colors.secondaryText }]}
              >
                Track your progress and improve your preparedness over time.
              </Text>
            </Card>

            {renderNavigationButtons({
              onNext: handleNextStep,
              nextLabel: 'Continue',
            })}
          </View>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <View style={styles.stepContent}>
            <Text style={[styles.title, { color: colors.text }]}>
              App Preferences
            </Text>

            <Text
              style={[styles.subtitle, { color: colors.secondaryText }]}
            >
              Configure the application according to your preferences.
            </Text>

            <Card
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  marginBottom: 12,
                },
              ]}
            >
              <View style={styles.row}>
                <View style={styles.settingContent}>
                  <Text
                    style={[styles.settingTitle, { color: colors.text }]}
                  >
                    Dark Mode
                  </Text>

                  <Text
                    style={[
                      styles.settingSub,
                      { color: colors.secondaryText },
                    ]}
                  >
                    Use a darker interface for improved visibility in low-light
                    environments.
                  </Text>
                </View>

                <Switch
                  value={isDark}
                  onValueChange={() =>
                    setTheme(isDark ? 'light' : 'dark')
                  }
                  trackColor={{
                    false: colors.border,
                    true: colors.accent,
                  }}
                  thumbColor="#FFFFFF"
                  accessibilityRole="switch"
                  accessibilityLabel="Dark Mode"
                  accessibilityState={{ checked: isDark }}
                />
              </View>
            </Card>

            <Card
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  marginBottom: 30,
                },
              ]}
            >
              <View style={styles.row}>
                <View style={styles.settingContent}>
                  <Text
                    style={[styles.settingTitle, { color: colors.text }]}
                  >
                    Emergency Notifications
                  </Text>

                  <Text
                    style={[
                      styles.settingSub,
                      { color: colors.secondaryText },
                    ]}
                  >
                    Receive relevant preparedness reminders and emergency
                    notifications.
                  </Text>
                </View>

                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{
                    false: colors.border,
                    true: colors.accent,
                  }}
                  thumbColor="#FFFFFF"
                  accessibilityRole="switch"
                  accessibilityLabel="Emergency Notifications"
                  accessibilityState={{ checked: notifications }}
                />
              </View>
            </Card>

            {renderNavigationButtons({
              onNext: handleNextStep,
              nextLabel: 'Save and Continue',
            })}
          </View>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <View style={styles.stepContent}>
            <Text style={[styles.title, { color: colors.text }]}>
              Preparedness Level
            </Text>

            <Text
              style={[styles.subtitle, { color: colors.secondaryText }]}
            >
              Select the option that best describes your current level of
              emergency preparedness.
            </Text>

            <View style={styles.optionsContainer}>
              {PREPARATION_LEVELS.map((level) => {
                const isSelected = prepLevel === level.id;

                return (
                  <TouchableOpacity
                    key={level.id}
                    style={[
                      styles.option,
                      {
                        backgroundColor: colors.card,
                        borderColor: isSelected
                          ? colors.accent
                          : colors.border,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                    onPress={() => setPrepLevel(level.id)}
                    accessibilityRole="radio"
                    accessibilityLabel={level.title}
                    accessibilityState={{
                      selected: isSelected,
                    }}
                  >
                    <View style={styles.optionContent}>
                      <Text
                        style={[
                          styles.optionText,
                          { color: colors.text },
                        ]}
                      >
                        {level.title}
                      </Text>

                      <Text
                        style={[
                          styles.optionSubText,
                          { color: colors.secondaryText },
                        ]}
                      >
                        {level.description}
                      </Text>
                    </View>

                    {isSelected && (
                      <View
                        style={[
                          styles.selectionIndicator,
                          { backgroundColor: colors.accent },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {renderNavigationButtons({
              onNext: handleNextStep,
              nextLabel: 'Continue',
              nextDisabled: !prepLevel,
            })}
          </View>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <View style={styles.stepContent}>
            <Text style={[styles.title, { color: colors.text }]}>
              Readiness Schedule
            </Text>

            <Text
              style={[styles.subtitle, { color: colors.secondaryText }]}
            >
              Choose how frequently you would like to complete preparedness
              activities and maintain your readiness progress.
            </Text>

            <View style={styles.optionsContainer}>
              {READINESS_GOALS.map((goal) => {
                const isSelected = selectedGoal === goal.id;

                return (
                  <TouchableOpacity
                    key={goal.id}
                    style={[
                      styles.option,
                      {
                        backgroundColor: colors.card,
                        borderColor: isSelected
                          ? colors.accent
                          : colors.border,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                    onPress={() => setSelectedGoal(goal.id)}
                    accessibilityRole="radio"
                    accessibilityLabel={goal.label}
                    accessibilityState={{
                      selected: isSelected,
                    }}
                  >
                    <View style={styles.optionContent}>
                      <Text
                        style={[
                          styles.optionText,
                          { color: colors.text },
                        ]}
                      >
                        {goal.label}
                      </Text>

                      <Text
                        style={[
                          styles.optionSubText,
                          { color: colors.secondaryText },
                        ]}
                      >
                        {goal.description}
                      </Text>
                    </View>

                    {isSelected && (
                      <View
                        style={[
                          styles.selectionIndicator,
                          { backgroundColor: colors.accent },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {renderNavigationButtons({
              onNext: handleFinish,
              nextLabel: 'Complete Setup',
              nextDisabled: !selectedGoal,
            })}

            <Text
              style={[styles.footerNote, { color: colors.muted }]}
            >
              You can change your preferences and readiness schedule later
              from Settings.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  progressContainer: {
    marginBottom: 20,
  },

  progressBarBackground: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  stepText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },

  stepContent: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 24,
  },

  card: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
    marginBottom: 24,
  },

  cardHeader: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },

  bulletItem: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  settingContent: {
    flex: 1,
    paddingRight: 16,
  },

  settingTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  settingSub: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },

  optionsContainer: {
    marginBottom: 16,
  },

  option: {
    minHeight: 78,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  optionContent: {
    flex: 1,
    paddingRight: 12,
  },

  optionText: {
    fontSize: 16,
    fontWeight: '700',
  },

  optionSubText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },

  selectionIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  actionButton: {
    minHeight: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  backButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  footerNote: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 18,
  },
});
