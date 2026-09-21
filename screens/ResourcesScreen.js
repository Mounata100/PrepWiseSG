// import React, { useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Text,
//   Linking,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';

// /*
//   Disaster Preparedness & Response Hub

//   Main purpose:
//   BEFORE  -> Prepare
//   DURING  -> Respond
//   AFTER   -> Recover

//   Quick access:
//   - Family Safe
//   - Health ID QR
//   - Emergency Contacts
// */

// const ResourcesScreen = ({ navigation }) => {
//   const [activePhase, setActivePhase] = useState('before');

//   const emergencyContacts = [
//     {
//       name: 'Police Emergency',
//       number: '999',
//       icon: 'shield',
//       color: '#2563EB',
//     },
//     {
//       name: 'SCDF Ambulance & Fire',
//       number: '995',
//       icon: 'flame',
//       color: '#DC2626',
//     },
//     {
//       name: 'PUB Flood Hotline',
//       number: '1800-284-6600',
//       icon: 'water',
//       color: '#0284C7',
//     },
//     {
//       name: 'NEA Weather / Environment',
//       number: '1800-2255-632',
//       icon: 'cloud',
//       color: '#7C3AED',
//     },
//   ];

//   const preparednessTopics = [
//     {
//       icon: 'bag-handle',
//       color: '#10B981',
//       title: 'Emergency Go-Bag',
//       description:
//         'Keep water, medication, first aid supplies, power bank, torch, whistle and important documents ready.',
//     },
//     {
//       icon: 'people',
//       color: '#8B5CF6',
//       title: 'Family Emergency Plan',
//       description:
//         'Agree on meeting points, emergency contacts and what to do if family members become separated.',
//     },
//     {
//       icon: 'document-text',
//       color: '#F59E0B',
//       title: 'Important Documents',
//       description:
//         'Keep identification, medical information, insurance details and emergency contacts accessible.',
//     },
//     {
//       icon: 'battery-charging',
//       color: '#06B6D4',
//       title: 'Power & Communication',
//       description:
//         'Keep phones charged and have backup power available so you can receive emergency updates.',
//     },
//   ];

//   const disasterGuides = [
//     {
//       icon: 'water',
//       color: '#0284C7',
//       title: 'Flash Flood',
//       description:
//         'Move to higher ground. Avoid flooded roads, underpasses and underground areas. Never walk or drive through floodwater.',
//     },
//     {
//       icon: 'sunny',
//       color: '#F59E0B',
//       title: 'Extreme Heat',
//       description:
//         'Drink water regularly, reduce strenuous activity and seek a cool indoor location if you feel unwell.',
//     },
//     {
//       icon: 'cloud',
//       color: '#64748B',
//       title: 'Haze / Poor Air Quality',
//       description:
//         'Monitor air-quality conditions, reduce prolonged outdoor activity and use appropriate respiratory protection when necessary.',
//     },
//     {
//       icon: 'thunderstorm',
//       color: '#7C3AED',
//       title: 'Severe Weather',
//       description:
//         'Stay indoors when conditions become dangerous and keep away from exposed areas, windows and unsecured objects.',
//     },
//   ];

//   const recoverySteps = [
//     {
//       icon: 'medical',
//       color: '#F87171',
//       title: 'Check for Injuries',
//       description:
//         'Check yourself and people around you. Call emergency services for serious injuries.',
//     },
//     {
//       icon: 'people',
//       color: '#A78BFA',
//       title: 'Account for Family',
//       description:
//         'Use your agreed meeting point and contact plan to confirm that family members are safe.',
//     },
//     {
//       icon: 'home',
//       color: '#38BDF8',
//       title: 'Check Your Environment',
//       description:
//         'Do not enter unsafe buildings or areas with standing water, electrical hazards or structural damage.',
//     },
//     {
//       icon: 'camera',
//       color: '#F59E0B',
//       title: 'Document Damage',
//       description:
//         'When it is safe, record relevant damage and keep important information for follow-up and recovery.',
//     },
//   ];

//   const openEmergencyCall = (number) => {
//     Linking.openURL(`tel:${number}`);
//   };

//   const renderPhaseButton = (id, icon, title, subtitle) => {
//     const active = activePhase === id;

//     return (
//       <TouchableOpacity
//         style={[
//           styles.phaseButton,
//           active && styles.phaseButtonActive,
//         ]}
//         onPress={() => setActivePhase(id)}
//         activeOpacity={0.85}
//       >
//         <View
//           style={[
//             styles.phaseIcon,
//             active && styles.phaseIconActive,
//           ]}
//         >
//           <Ionicons
//             name={icon}
//             size={22}
//             color={active ? '#FFFFFF' : '#64748B'}
//           />
//         </View>

//         <Text
//           style={[
//             styles.phaseTitle,
//             active && styles.phaseTitleActive,
//           ]}
//         >
//           {title}
//         </Text>

//         <Text
//           style={[
//             styles.phaseSubtitle,
//             active && styles.phaseSubtitleActive,
//           ]}
//         >
//           {subtitle}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   const renderInfoCard = (item, index) => (
//     <View key={index} style={styles.infoCard}>
//       <View
//         style={[
//           styles.infoIcon,
//           { backgroundColor: `${item.color}18` },
//         ]}
//       >
//         <Ionicons name={item.icon} size={24} color={item.color} />
//       </View>

//       <View style={styles.infoContent}>
//         <Text style={styles.infoTitle}>{item.title}</Text>
//         <Text style={styles.infoDescription}>
//           {item.description}
//         </Text>
//       </View>
//     </View>
//   );

//   const renderCurrentPhase = () => {
//     if (activePhase === 'before') {
//       return (
//         <>
//           <View style={styles.sectionHeader}>
//             <View>
//               <Text style={styles.sectionEyebrow}>BEFORE A DISASTER</Text>
//               <Text style={styles.sectionTitle}>Prepare Now</Text>
//             </View>

//             <View style={styles.sectionIconBlue}>
//               <Ionicons
//                 name="shield-checkmark"
//                 size={22}
//                 color="#38BDF8"
//               />
//             </View>
//           </View>

//           <Text style={styles.sectionIntro}>
//             Small preparations made before an emergency can make it
//             easier to protect yourself and your family when conditions
//             change quickly.
//           </Text>

//           {preparednessTopics.map(renderInfoCard)}
//         </>
//       );
//     }

//     if (activePhase === 'during') {
//       return (
//         <>
//           <View style={styles.sectionHeader}>
//             <View>
//               <Text style={styles.sectionEyebrow}>DURING A DISASTER</Text>
//               <Text style={styles.sectionTitle}>Respond Safely</Text>
//             </View>

//             <View style={styles.sectionIconRed}>
//               <Ionicons
//                 name="warning"
//                 size={22}
//                 color="#EF4444"
//               />
//             </View>
//           </View>

//           <Text style={styles.sectionIntro}>
//             Follow the safest action for the hazard. If there is an
//             immediate threat to life, contact emergency services.
//           </Text>

//           {disasterGuides.map(renderInfoCard)}
//         </>
//       );
//     }

//     return (
//       <>
//         <View style={styles.sectionHeader}>
//           <View>
//             <Text style={styles.sectionEyebrow}>AFTER A DISASTER</Text>
//             <Text style={styles.sectionTitle}>Recover Safely</Text>
//           </View>

//           <View style={styles.sectionIconGreen}>
//             <Ionicons
//               name="refresh"
//               size={22}
//               color="#10B981"
//             />
//           </View>
//         </View>

//         <Text style={styles.sectionIntro}>
//           Once the immediate danger has passed, focus on people first,
//           then move carefully towards recovery.
//         </Text>

//         {recoverySteps.map(renderInfoCard)}
//       </>
//     );
//   };

//   return (
//     <LinearGradient
//       colors={['#020617', '#071426', '#0F172A']}
//       style={styles.container}
//     >
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >

//         {/* HEADER */}
//         <View style={styles.hero}>
//           <View style={styles.heroIcon}>
//             <Ionicons
//               name="shield-checkmark"
//               size={34}
//               color="#38BDF8"
//             />
//           </View>

//           <Text style={styles.heroTitle}>
//             Disaster Preparedness and Response Hub
//           </Text>

//           <Text style={styles.heroSubtitle}>
//             Prepare before. Respond safely. Recover together.
//           </Text>

//           <View style={styles.locationBadge}>
//             <Ionicons
//               name="location"
//               size={13}
//               color="#94A3B8"
//             />
//             <Text style={styles.locationText}>
//               Singapore Climate & Emergency Safety
//             </Text>
//           </View>
//         </View>

//         {/* QUICK ACCESS */}
//         <Text style={styles.quickAccessLabel}>
//           QUICK ACCESS
//         </Text>

//         <View style={styles.quickGrid}>

//           {/* FAMILY SAFE */}
//           <TouchableOpacity
//             style={[
//               styles.quickCard,
//               styles.familyCard,
//             ]}
//             onPress={() => navigation.navigate('FamilySafety')}
//             activeOpacity={0.85}
//           >
//             <View style={styles.quickIconFamily}>
//               <Ionicons
//                 name="people"
//                 size={26}
//                 color="#A78BFA"
//               />
//             </View>

//             <Text style={styles.quickTitle}>
//               Family Safe
//             </Text>

//             <Text style={styles.quickDescription}>
//               Family emergency plan, contacts and safety status.
//             </Text>

//             <View style={styles.quickArrow}>
//               <Ionicons
//                 name="arrow-forward"
//                 size={16}
//                 color="#A78BFA"
//               />
//             </View>
//           </TouchableOpacity>

//           {/* HEALTH QR */}
//           <TouchableOpacity
//             style={[
//               styles.quickCard,
//               styles.healthCard,
//             ]}
//             onPress={() => navigation.navigate('HealthQR')}
//             activeOpacity={0.85}
//           >
//             <View style={styles.quickIconHealth}>
//               <Ionicons
//                 name="qr-code"
//                 size={26}
//                 color="#34D399"
//               />
//             </View>

//             <Text style={styles.quickTitle}>
//               Health ID QR
//             </Text>

//             <Text style={styles.quickDescription}>
//               Keep important health information accessible in an emergency.
//             </Text>

//             <View style={styles.quickArrow}>
//               <Ionicons
//                 name="arrow-forward"
//                 size={16}
//                 color="#34D399"
//               />
//             </View>
//           </TouchableOpacity>

//         </View>

//         {/* EMERGENCY BUTTON */}
//         <TouchableOpacity
//           style={styles.emergencyMainButton}
//           onPress={() => openEmergencyCall('995')}
//           activeOpacity={0.9}
//         >
//           <View style={styles.emergencyIcon}>
//             <Ionicons
//               name="call"
//               size={22}
//               color="#FFFFFF"
//             />
//           </View>

//           <View style={styles.emergencyTextContainer}>
//             <Text style={styles.emergencyTitle}>
//               EMERGENCY
//             </Text>
//             <Text style={styles.emergencySubtitle}>
//               Call SCDF Ambulance & Fire — 995
//             </Text>
//           </View>

//           <Ionicons
//             name="chevron-forward"
//             size={22}
//             color="#FFFFFF"
//           />
//         </TouchableOpacity>

//         {/* BEFORE / DURING / AFTER */}
//         <Text style={styles.phaseSectionLabel}>
//           DISASTER RESPONSE
//         </Text>

//         <View style={styles.phaseSelector}>
//           {renderPhaseButton(
//             'before',
//             'shield-checkmark',
//             'BEFORE',
//             'Prepare'
//           )}

//           {renderPhaseButton(
//             'during',
//             'warning',
//             'DURING',
//             'Respond'
//           )}

//           {renderPhaseButton(
//             'after',
//             'refresh',
//             'AFTER',
//             'Recover'
//           )}
//         </View>

//         {/* ACTIVE PHASE CONTENT */}
//         <View style={styles.contentCard}>
//           {renderCurrentPhase()}
//         </View>

//         {/* EMERGENCY CONTACTS */}
//         <View style={styles.contactsHeader}>
//           <View>
//             <Text style={styles.sectionEyebrow}>
//               IMPORTANT NUMBERS
//             </Text>
//             <Text style={styles.sectionTitle}>
//               Emergency Contacts
//             </Text>
//           </View>

//           <Ionicons
//             name="call-outline"
//             size={24}
//             color="#F87171"
//           />
//         </View>

//         <View style={styles.contactsCard}>
//           {emergencyContacts.map((contact, index) => (
//             <TouchableOpacity
//               key={contact.number}
//               style={[
//                 styles.contactRow,
//                 index === emergencyContacts.length - 1 &&
//                   styles.contactRowLast,
//               ]}
//               onPress={() => openEmergencyCall(contact.number)}
//               activeOpacity={0.75}
//             >
//               <View
//                 style={[
//                   styles.contactIcon,
//                   { backgroundColor: `${contact.color}18` },
//                 ]}
//               >
//                 <Ionicons
//                   name={contact.icon}
//                   size={21}
//                   color={contact.color}
//                 />
//               </View>

//               <View style={styles.contactInfo}>
//                 <Text style={styles.contactName}>
//                   {contact.name}
//                 </Text>
//                 <Text style={styles.contactNumber}>
//                   {contact.number}
//                 </Text>
//               </View>

//               <View style={styles.callCircle}>
//                 <Ionicons
//                   name="call"
//                   size={16}
//                   color="#10B981"
//                 />
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* FOOTER */}
//         <View style={styles.footerCard}>
//           <Ionicons
//             name="information-circle-outline"
//             size={22}
//             color="#38BDF8"
//           />

//           <Text style={styles.footerText}>
//             This hub provides preparedness information and quick access
//             to safety tools. Always follow official emergency instructions
//             during an active incident.
//           </Text>
//         </View>

//       </ScrollView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },

//   scrollContent: {
//     padding: 16,
//     paddingTop: 40,
//     paddingBottom: 50,
//   },

//   /* HERO */

//   hero: {
//     alignItems: 'center',
//     paddingVertical: 12,
//     marginBottom: 24,
//   },

//   heroIcon: {
//     width: 72,
//     height: 72,
//     borderRadius: 36,
//     backgroundColor: '#0C2438',
//     borderWidth: 1,
//     borderColor: '#164E63',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 14,
//   },

//   heroTitle: {
//     color: '#FFFFFF',
//     fontSize: 25,
//     fontWeight: '900',
//     textAlign: 'center',
//   },

//   heroSubtitle: {
//     color: '#94A3B8',
//     fontSize: 13,
//     marginTop: 7,
//     textAlign: 'center',
//   },

//   locationBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 12,
//     backgroundColor: '#0F172A',
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     paddingHorizontal: 11,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },

//   locationText: {
//     color: '#94A3B8',
//     fontSize: 10,
//     fontWeight: '700',
//     marginLeft: 5,
//   },

//   /* QUICK ACCESS */

//   quickAccessLabel: {
//     color: '#64748B',
//     fontSize: 10,
//     fontWeight: '900',
//     letterSpacing: 1.5,
//     marginBottom: 10,
//   },

//   quickGrid: {
//     flexDirection: 'row',
//     gap: 10,
//     marginBottom: 14,
//   },

//   quickCard: {
//     flex: 1,
//     minHeight: 170,
//     borderRadius: 18,
//     padding: 15,
//     borderWidth: 1,
//     position: 'relative',
//   },

//   familyCard: {
//     backgroundColor: '#17112D',
//     borderColor: '#4C1D95',
//   },

//   healthCard: {
//     backgroundColor: '#06271F',
//     borderColor: '#065F46',
//   },

//   quickIconFamily: {
//     width: 46,
//     height: 46,
//     borderRadius: 14,
//     backgroundColor: '#2E1065',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },

//   quickIconHealth: {
//     width: 46,
//     height: 46,
//     borderRadius: 14,
//     backgroundColor: '#064E3B',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },

//   quickTitle: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '900',
//   },

//   quickDescription: {
//     color: '#94A3B8',
//     fontSize: 10,
//     lineHeight: 15,
//     marginTop: 5,
//   },

//   quickArrow: {
//     position: 'absolute',
//     right: 13,
//     bottom: 13,
//   },

//   /* EMERGENCY MAIN BUTTON */

//   emergencyMainButton: {
//     backgroundColor: '#991B1B',
//     borderWidth: 1,
//     borderColor: '#DC2626',
//     borderRadius: 17,
//     padding: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 28,
//   },

//   emergencyIcon: {
//     width: 42,
//     height: 42,
//     borderRadius: 13,
//     backgroundColor: '#DC2626',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   emergencyTextContainer: {
//     flex: 1,
//     marginLeft: 12,
//   },

//   emergencyTitle: {
//     color: '#FCA5A5',
//     fontSize: 10,
//     fontWeight: '900',
//     letterSpacing: 1,
//   },

//   emergencySubtitle: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '700',
//     marginTop: 3,
//   },

//   /* PHASE SELECTOR */

//   phaseSectionLabel: {
//     color: '#64748B',
//     fontSize: 10,
//     fontWeight: '900',
//     letterSpacing: 1.5,
//     marginBottom: 10,
//   },

//   phaseSelector: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 14,
//   },

//   phaseButton: {
//     flex: 1,
//     backgroundColor: '#0F172A',
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     borderRadius: 15,
//     paddingVertical: 13,
//     alignItems: 'center',
//   },

//   phaseButtonActive: {
//     backgroundColor: '#075985',
//     borderColor: '#0EA5E9',
//   },

//   phaseIcon: {
//     width: 35,
//     height: 35,
//     borderRadius: 12,
//     backgroundColor: '#1E293B',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 6,
//   },

//   phaseIconActive: {
//     backgroundColor: '#0284C7',
//   },

//   phaseTitle: {
//     color: '#CBD5E1',
//     fontSize: 10,
//     fontWeight: '900',
//   },

//   phaseTitleActive: {
//     color: '#FFFFFF',
//   },

//   phaseSubtitle: {
//     color: '#64748B',
//     fontSize: 9,
//     marginTop: 2,
//   },

//   phaseSubtitleActive: {
//     color: '#BAE6FD',
//   },

//   /* CONTENT */

//   contentCard: {
//     backgroundColor: '#0F172A',
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     padding: 18,
//     marginBottom: 28,
//   },

//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   sectionEyebrow: {
//     color: '#38BDF8',
//     fontSize: 9,
//     fontWeight: '900',
//     letterSpacing: 1.4,
//   },

//   sectionTitle: {
//     color: '#FFFFFF',
//     fontSize: 21,
//     fontWeight: '900',
//     marginTop: 3,
//   },

//   sectionIconBlue: {
//     width: 42,
//     height: 42,
//     borderRadius: 14,
//     backgroundColor: '#082F49',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   sectionIconRed: {
//     width: 42,
//     height: 42,
//     borderRadius: 14,
//     backgroundColor: '#450A0A',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   sectionIconGreen: {
//     width: 42,
//     height: 42,
//     borderRadius: 14,
//     backgroundColor: '#064E3B',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   sectionIntro: {
//     color: '#94A3B8',
//     fontSize: 12,
//     lineHeight: 18,
//     marginTop: 10,
//     marginBottom: 17,
//   },

//   infoCard: {
//     flexDirection: 'row',
//     backgroundColor: '#111C2E',
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     padding: 13,
//     marginBottom: 10,
//   },

//   infoIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 13,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },

//   infoContent: {
//     flex: 1,
//     marginLeft: 12,
//   },

//   infoTitle: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '800',
//   },

//   infoDescription: {
//     color: '#94A3B8',
//     fontSize: 11,
//     lineHeight: 17,
//     marginTop: 3,
//   },

//   /* CONTACTS */

//   contactsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },

//   contactsCard: {
//     backgroundColor: '#0F172A',
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#1E293B',
//     paddingHorizontal: 15,
//     marginBottom: 20,
//   },

//   contactRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: '#1E293B',
//   },

//   contactRowLast: {
//     borderBottomWidth: 0,
//   },

//   contactIcon: {
//     width: 42,
//     height: 42,
//     borderRadius: 13,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   contactInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },

//   contactName: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '800',
//   },

//   contactNumber: {
//     color: '#64748B',
//     fontSize: 11,
//     marginTop: 3,
//   },

//   callCircle: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     backgroundColor: '#064E3B',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   /* FOOTER */

//   footerCard: {
//     flexDirection: 'row',
//     backgroundColor: '#082F49',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#075985',
//     padding: 14,
//     alignItems: 'flex-start',
//   },

//   footerText: {
//     flex: 1,
//     color: '#BAE6FD',
//     fontSize: 10,
//     lineHeight: 16,
//     marginLeft: 10,
//   },
// });

// export default ResourcesScreen;
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next'; // Added translation hook

const ResourcesScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [activePhase, setActivePhase] = useState('before');

  const emergencyContacts = [
    {
      name: t('resources.contacts.police'),
      number: '999',
      icon: 'shield',
      color: '#2563EB',
    },
    {
      name: t('resources.contacts.scdf'),
      number: '995',
      icon: 'flame',
      color: '#DC2626',
    },
    {
      name: t('resources.contacts.pub'),
      number: '1800-284-6600',
      icon: 'water',
      color: '#0284C7',
    },
    {
      name: t('resources.contacts.nea'),
      number: '1800-2255-632',
      icon: 'cloud',
      color: '#7C3AED',
    },
  ];

  const preparednessTopics = [
    {
      icon: 'bag-handle',
      color: '#10B981',
      title: t('resources.topics.gobag.title'),
      description: t('resources.topics.gobag.desc'),
    },
    {
      icon: 'people',
      color: '#8B5CF6',
      title: t('resources.topics.familyPlan.title'),
      description: t('resources.topics.familyPlan.desc'),
    },
    {
      icon: 'document-text',
      color: '#F59E0B',
      title: t('resources.topics.docs.title'),
      description: t('resources.topics.docs.desc'),
    },
    {
      icon: 'battery-charging',
      color: '#06B6D4',
      title: t('resources.topics.power.title'),
      description: t('resources.topics.power.desc'),
    },
  ];

  const disasterGuides = [
    {
      icon: 'water',
      color: '#0284C7',
      title: t('resources.guides.flood.title'),
      description: t('resources.guides.flood.desc'),
    },
    {
      icon: 'sunny',
      color: '#F59E0B',
      title: t('resources.guides.heat.title'),
      description: t('resources.guides.heat.desc'),
    },
    {
      icon: 'cloud',
      color: '#64748B',
      title: t('resources.guides.haze.title'),
      description: t('resources.guides.haze.desc'),
    },
    {
      icon: 'thunderstorm',
      color: '#7C3AED',
      title: t('resources.guides.weather.title'),
      description: t('resources.guides.weather.desc'),
    },
  ];

  const recoverySteps = [
    {
      icon: 'medical',
      color: '#F87171',
      title: t('resources.recovery.injuries.title'),
      description: t('resources.recovery.injuries.desc'),
    },
    {
      icon: 'people',
      color: '#A78BFA',
      title: t('resources.recovery.family.title'),
      description: t('resources.recovery.family.desc'),
    },
    {
      icon: 'home',
      color: '#38BDF8',
      title: t('resources.recovery.environment.title'),
      description: t('resources.recovery.environment.desc'),
    },
    {
      icon: 'camera',
      color: '#F59E0B',
      title: t('resources.recovery.damage.title'),
      description: t('resources.recovery.damage.desc'),
    },
  ];

  const openEmergencyCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const renderPhaseButton = (id, icon, title, subtitle) => {
    const active = activePhase === id;

    return (
      <TouchableOpacity
        style={[styles.phaseButton, active && styles.phaseButtonActive]}
        onPress={() => setActivePhase(id)}
        activeOpacity={0.85}
      >
        <View style={[styles.phaseIcon, active && styles.phaseIconActive]}>
          <Ionicons name={icon} size={22} color={active ? '#FFFFFF' : '#64748B'} />
        </View>
        <Text style={[styles.phaseTitle, active && styles.phaseTitleActive]}>
          {title}
        </Text>
        <Text style={[styles.phaseSubtitle, active && styles.phaseSubtitleActive]}>
          {subtitle}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderInfoCard = (item, index) => (
    <View key={index} style={styles.infoCard}>
      <View style={[styles.infoIcon, { backgroundColor: `${item.color}18` }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{item.title}</Text>
        <Text style={styles.infoDescription}>{item.description}</Text>
      </View>
    </View>
  );

  const renderCurrentPhase = () => {
    if (activePhase === 'before') {
      return (
        <>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>{t('resources.phases.beforeEyebrow')}</Text>
              <Text style={styles.sectionTitle}>{t('resources.phases.beforeTitle')}</Text>
            </View>
            <View style={styles.sectionIconBlue}>
              <Ionicons name="shield-checkmark" size={22} color="#38BDF8" />
            </View>
          </View>
          <Text style={styles.sectionIntro}>{t('resources.phases.beforeIntro')}</Text>
          {preparednessTopics.map(renderInfoCard)}
        </>
      );
    }

    if (activePhase === 'during') {
      return (
        <>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>{t('resources.phases.duringEyebrow')}</Text>
              <Text style={styles.sectionTitle}>{t('resources.phases.duringTitle')}</Text>
            </View>
            <View style={styles.sectionIconRed}>
              <Ionicons name="warning" size={22} color="#EF4444" />
            </View>
          </View>
          <Text style={styles.sectionIntro}>{t('resources.phases.duringIntro')}</Text>
          {disasterGuides.map(renderInfoCard)}
        </>
      );
    }

    return (
      <>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>{t('resources.phases.afterEyebrow')}</Text>
            <Text style={styles.sectionTitle}>{t('resources.phases.afterTitle')}</Text>
          </View>
          <View style={styles.sectionIconGreen}>
            <Ionicons name="refresh" size={22} color="#10B981" />
          </View>
        </View>
        <Text style={styles.sectionIntro}>{t('resources.phases.afterIntro')}</Text>
        {recoverySteps.map(renderInfoCard)}
      </>
    );
  };

  return (
    <LinearGradient colors={['#020617', '#071426', '#0F172A']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="shield-checkmark" size={34} color="#38BDF8" />
          </View>
          <Text style={styles.heroTitle}>{t('resources.hero.title')}</Text>
          <Text style={styles.heroSubtitle}>{t('resources.hero.subtitle')}</Text>
          <View style={styles.locationBadge}>
            <Ionicons name="location" size={13} color="#94A3B8" />
            <Text style={styles.locationText}>{t('resources.hero.location')}</Text>
          </View>
        </View>

        {/* QUICK ACCESS */}
        <Text style={styles.quickAccessLabel}>{t('resources.quickAccess.label')}</Text>
        <View style={styles.quickGrid}>
          
          {/* FAMILY SAFE */}
          <TouchableOpacity
            style={[styles.quickCard, styles.familyCard]}
            onPress={() => navigation.navigate('FamilySafety')}
            activeOpacity={0.85}
          >
            <View style={styles.quickIconFamily}>
              <Ionicons name="people" size={26} color="#A78BFA" />
            </View>
            <Text style={styles.quickTitle}>{t('resources.quickAccess.familyTitle')}</Text>
            <Text style={styles.quickDescription}>{t('resources.quickAccess.familyDesc')}</Text>
            <View style={styles.quickArrow}>
              <Ionicons name="arrow-forward" size={16} color="#A78BFA" />
            </View>
          </TouchableOpacity>

          {/* HEALTH QR */}
          <TouchableOpacity
            style={[styles.quickCard, styles.healthCard]}
            onPress={() => navigation.navigate('HealthQR')}
            activeOpacity={0.85}
          >
            <View style={styles.quickIconHealth}>
              <Ionicons name="qr-code" size={26} color="#34D399" />
            </View>
            <Text style={styles.quickTitle}>{t('resources.quickAccess.healthTitle')}</Text>
            <Text style={styles.quickDescription}>{t('resources.quickAccess.healthDesc')}</Text>
            <View style={styles.quickArrow}>
              <Ionicons name="arrow-forward" size={16} color="#34D399" />
            </View>
          </TouchableOpacity>
        </View>

        {/* EMERGENCY BUTTON */}
        <TouchableOpacity
          style={styles.emergencyMainButton}
          onPress={() => openEmergencyCall('995')}
          activeOpacity={0.9}
        >
          <View style={styles.emergencyIcon}>
            <Ionicons name="call" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.emergencyTextContainer}>
            <Text style={styles.emergencyTitle}>{t('resources.emergencyBtn.title')}</Text>
            <Text style={styles.emergencySubtitle}>{t('resources.emergencyBtn.subtitle')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {/* BEFORE / DURING / AFTER */}
        <Text style={styles.phaseSectionLabel}>{t('resources.responseSectionLabel')}</Text>
        <View style={styles.phaseSelector}>
          {renderPhaseButton('before', 'shield-checkmark', t('resources.phases.btnBeforeTitle'), t('resources.phases.btnBeforeSub'))}
          {renderPhaseButton('during', 'warning', t('resources.phases.btnDuringTitle'), t('resources.phases.btnDuringSub'))}
          {renderPhaseButton('after', 'refresh', t('resources.phases.btnAfterTitle'), t('resources.phases.btnAfterSub'))}
        </View>

        {/* ACTIVE PHASE CONTENT */}
        <View style={styles.contentCard}>{renderCurrentPhase()}</View>

        {/* EMERGENCY CONTACTS */}
        <View style={styles.contactsHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>{t('resources.contacts.eyebrow')}</Text>
            <Text style={styles.sectionTitle}>{t('resources.contacts.title')}</Text>
          </View>
          <Ionicons name="call-outline" size={24} color="#F87171" />
        </View>

        <View style={styles.contactsCard}>
          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity
              key={contact.number}
              style={[styles.contactRow, index === emergencyContacts.length - 1 && styles.contactRowLast]}
              onPress={() => openEmergencyCall(contact.number)}
              activeOpacity={0.75}
            >
              <View style={[styles.contactIcon, { backgroundColor: `${contact.color}18` }]}>
                <Ionicons name={contact.icon} size={21} color={contact.color} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </View>
              <View style={styles.callCircle}>
                <Ionicons name="call" size={16} color="#10B981" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* FOOTER */}
        <View style={styles.footerCard}>
          <Ionicons name="information-circle-outline" size={22} color="#38BDF8" />
          <Text style={styles.footerText}>{t('resources.footer')}</Text>
        </View>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // Keep your exact existing styles here...
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 40, paddingBottom: 50 },
  hero: { alignItems: 'center', paddingVertical: 12, marginBottom: 24 },
  heroIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#0C2438', borderWidth: 1, borderColor: '#164E63', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  heroTitle: { color: '#FFFFFF', fontSize: 25, fontWeight: '900', textAlign: 'center' },
  heroSubtitle: { color: '#94A3B8', fontSize: 13, marginTop: 7, textAlign: 'center' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E293B', paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20 },
  locationText: { color: '#94A3B8', fontSize: 10, fontWeight: '700', marginLeft: 5 },
  quickAccessLabel: { color: '#64748B', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 10 },
  quickGrid: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  quickCard: { flex: 1, minHeight: 170, borderRadius: 18, padding: 15, borderWidth: 1, position: 'relative' },
  familyCard: { backgroundColor: '#17112D', borderColor: '#4C1D95' },
  healthCard: { backgroundColor: '#06271F', borderColor: '#065F46' },
  quickIconFamily: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#2E1065', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  quickIconHealth: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#064E3B', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  quickTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  quickDescription: { color: '#94A3B8', fontSize: 10, lineHeight: 15, marginTop: 5 },
  quickArrow: { position: 'absolute', right: 13, bottom: 13 },
  emergencyMainButton: { backgroundColor: '#991B1B', borderWidth: 1, borderColor: '#DC2626', borderRadius: 17, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  emergencyIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#DC2626', justifyContent: 'center', alignItems: 'center' },
  emergencyTextContainer: { flex: 1, marginLeft: 12 },
  emergencyTitle: { color: '#FCA5A5', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  emergencySubtitle: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', marginTop: 3 },
  phaseSectionLabel: { color: '#64748B', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 10 },
  phaseSelector: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  phaseButton: { flex: 1, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 15, paddingVertical: 13, alignItems: 'center' },
  phaseButtonActive: { backgroundColor: '#075985', borderColor: '#0EA5E9' },
  phaseIcon: { width: 35, height: 35, borderRadius: 12, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  phaseIconActive: { backgroundColor: '#0284C7' },
  phaseTitle: { color: '#CBD5E1', fontSize: 10, fontWeight: '900' },
  phaseTitleActive: { color: '#FFFFFF' },
  phaseSubtitle: { color: '#64748B', fontSize: 9, marginTop: 2 },
  phaseSubtitleActive: { color: '#BAE6FD' },
  contentCard: { backgroundColor: '#0F172A', borderRadius: 20, borderWidth: 1, borderColor: '#1E293B', padding: 18, marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionEyebrow: { color: '#38BDF8', fontSize: 9, fontWeight: '900', letterSpacing: 1.4 },
  sectionTitle: { color: '#FFFFFF', fontSize: 21, fontWeight: '900', marginTop: 3 },
  sectionIconBlue: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#082F49', justifyContent: 'center', alignItems: 'center' },
  sectionIconRed: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#450A0A', justifyContent: 'center', alignItems: 'center' },
  sectionIconGreen: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#064E3B', justifyContent: 'center', alignItems: 'center' },
  sectionIntro: { color: '#94A3B8', fontSize: 12, lineHeight: 18, marginTop: 10, marginBottom: 17 },
  infoCard: { flexDirection: 'row', backgroundColor: '#111C2E', borderRadius: 15, borderWidth: 1, borderColor: '#1E293B', padding: 13, marginBottom: 10 },
  infoIcon: { width: 44, height: 44, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  infoContent: { flex: 1, marginLeft: 12 },
  infoTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  infoDescription: { color: '#94A3B8', fontSize: 11, lineHeight: 17, marginTop: 3 },
  contactsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  contactsCard: { backgroundColor: '#0F172A', borderRadius: 20, borderWidth: 1, borderColor: '#1E293B', paddingHorizontal: 15, marginBottom: 20 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  contactRowLast: { borderBottomWidth: 0 },
  contactIcon: { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  contactInfo: { flex: 1, marginLeft: 12 },
  contactName: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  contactNumber: { color: '#64748B', fontSize: 11, marginTop: 3 },
  callCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#064E3B', justifyContent: 'center', alignItems: 'center' },
  footerCard: { flexDirection: 'row', backgroundColor: '#082F49', borderRadius: 16, borderWidth: 1, borderColor: '#075985', padding: 14, alignItems: 'flex-start' },
  footerText: { flex: 1, color: '#BAE6FD', fontSize: 10, lineHeight: 16, marginLeft: 10 },
});

export default ResourcesScreen;