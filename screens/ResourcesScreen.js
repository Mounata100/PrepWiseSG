/* =========================================================
   RESOURCES SCREEN
   Modern Climate Emergency Resource Hub
   Style: Minimalism + Neumorphism + Glassmorphism
========================================================= */

/* ---------------- IMPORT REACT ---------------- */
import React, { useState } from 'react';

/* ---------------- IMPORT REACT NATIVE COMPONENTS ---------------- */
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Linking,
  Image,
} from 'react-native';

/* ---------------- IMPORT PAPER COMPONENTS ---------------- */
import {
  Card,
  Title,
  Chip,
} from 'react-native-paper';

/* ---------------- IMPORT ICONS ---------------- */
import Icon from 'react-native-vector-icons/MaterialIcons';

/* ---------------- IMPORT GRADIENT ---------------- */
import { LinearGradient } from 'expo-linear-gradient';

/* =========================================================
   MAIN COMPONENT
========================================================= */
const ResourcesScreen = () => {

  /* ---------------- LANGUAGE STATE ---------------- */
  const [language, setLanguage] = useState('en');

  /* ---------------- CATEGORY STATE ---------------- */
  const [selectedCategory, setSelectedCategory] = useState('flood');

  /* =========================================================
     RESOURCE DATA
  ========================================================= */
  const resources = {
    en: {
      /* ---------------- FLOOD ---------------- */
      flood: {
        title: 'Flash Flood Guide',
        image: 'https://cdn-icons-png.flaticon.com/512/414/414974.png',
        content:
          'Move to higher ground immediately\n' +
          'Avoid underpasses and low-lying areas\n' +
          'Never cross floodwaters\n' +
          'Stay informed via SCDF/NEA apps',
        kit: [
          'Waterproof bag',
          'Emergency blanket',
          'Whistle',
          'First aid kit',
          '72hr water supply',
        ],
      },

      /* ---------------- HAZE ---------------- */
      haze: {
        title: 'Haze Protection Guide',
        image: 'https://cdn-icons-png.flaticon.com/512/4005/4005901.png',
        content:
          'Stay indoors with windows closed\n' +
          'Use N95 masks outdoors\n' +
          'Run air purifiers\n' +
          'Monitor NEA PSI readings',
        kit: [
          'N95 masks',
          'Eye drops',
          'Humidifier',
          'Reusable water bottle',
        ],
      },

      /* ---------------- EMERGENCY ---------------- */
      emergency: {
        title: 'Singapore Emergency Contacts',
        contacts: [
          {
            name: 'Police Emergency',
            number: '999',
            icon: 'local-police',
            color: '#2563EB',
          },
          {
            name: 'SCDF Ambulance & Fire',
            number: '995',
            icon: 'local-fire-department',
            color: '#DC2626',
          },
          {
            name: 'PUB Flood Hotline',
            number: '1800-284-6600',
            icon: 'invert-colors', // Fixed: MaterialIcons valid water-drop layout style
            color: '#0284C7',
          },
          {
            name: 'NEA Weather Hotline',
            number: '1800-2255-632',
            icon: 'cloud',
            color: '#7C3AED',
          },
          {
            name: 'SP PowerGrid Emergency',
            number: '1800-778-8888',
            icon: 'bolt',
            color: '#F59E0B',
          },
        ],
      },
    },
  };

  /* =========================================================
     CURRENT RESOURCE
  ========================================================= */
  const currentResource = resources[language]?.[selectedCategory] || resources.en.flood;

  return (
    <LinearGradient
      colors={['#EEF2FF', '#F8FAFC']}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HERO HEADER */}
        <View style={styles.heroCard}>
          <Icon
            name="warning" // Fixed: "emergency" is not consistently safe across MaterialIcons releases
            size={52}
            color="#DC2626"
          />
          <Text style={styles.heroTitle}>Climate Emergency Hub</Text>
          <Text style={styles.heroSubtitle}>Singapore Preparedness & Safety</Text>
        </View>

        {/* LANGUAGE SELECTOR */}
        <View style={styles.languageSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip
              icon="translate"
              selected={language === 'en'}
              onPress={() => setLanguage('en')}
              style={styles.chip}
            >
              English
            </Chip>
          </ScrollView>
        </View>

        {/* CATEGORY BUTTONS */}
        <View style={styles.categoryButtons}>
          {/* Flood button */}
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'flood' && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory('flood')}
          >
            <Icon name="water-drop" size={34} color="#0284C7" />
            <Text style={styles.categoryText}>Flood</Text>
          </TouchableOpacity>

          {/* Haze button */}
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'haze' && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory('haze')}
          >
            <Icon name="air" size={34} color="#D97706" />
            <Text style={styles.categoryText}>Haze</Text>
          </TouchableOpacity>

          {/* Emergency button */}
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'emergency' && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory('emergency')}
          >
            <Icon name="phone" size={34} color="#DC2626" />
            <Text style={styles.categoryText}>SOS</Text>
          </TouchableOpacity>
        </View>

        {/* STATUS BANNER */}
        <View style={styles.statusBanner}>
          <Icon name="cloud" size={22} color="white" />
          <Text style={styles.statusText}>Weather Advisory Monitoring Active</Text>
        </View>

        {/* MAIN CONTENT CARD */}
        <Card style={styles.resourceCard}>
          <Card.Content style={styles.cardContent}>
            
            {/* EMERGENCY CONTACTS VIEW */}
            {selectedCategory === 'emergency' ? (
              <>
                <Title style={styles.resourceTitle}>{currentResource.title}</Title>
                {currentResource.contacts.map((contact, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.contactCard}
                    onPress={() => Linking.openURL(`tel:${contact.number}`)}
                  >
                    <Icon name={contact.icon} size={36} color={contact.color} />
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactNumber}>{contact.number}</Text>
                    </View>
                    <Icon name="phone" size={28} color="#10B981" />
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              /* DISASTER INSTRUCTION TILES */
              <>
                <Image source={{ uri: currentResource.image }} style={styles.heroImage} />
                <Title style={styles.resourceTitle}>{currentResource.title}</Title>
                
                <View style={styles.resourceContent}>
                  {currentResource.content.split('\n').map((line, index) => (
                    <Text key={index} style={styles.contentLine}>
                      • {line}
                    </Text>
                  ))}
                </View>

                <Title style={styles.kitTitle}>Emergency Kit Items</Title>
                {currentResource.kit.map((item, index) => (
                  <View key={index} style={styles.kitItem}>
                    <Icon name="check-circle" size={24} color="#10B981" />
                    <Text style={styles.kitText}>{item}</Text>
                  </View>
                ))}
              </>
            )}

          </Card.Content>
        </Card>

      </ScrollView>
    </LinearGradient>
  );
};

/* =========================================================
   STYLES
========================================================= */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heroCard: { backgroundColor: '#FFFFFF', padding: 28, borderRadius: 30, alignItems: 'center', marginBottom: 24, shadowColor: '#CBD5E1', shadowOffset: { width: -6, height: -6 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 8 },
  heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#0F172A', marginTop: 14, textAlign: 'center' },
  heroSubtitle: { fontSize: 15, color: '#64748B', marginTop: 6, textAlign: 'center' },
  languageSelector: { marginBottom: 24 },
  chip: { marginRight: 12 },
  categoryButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  categoryButton: { backgroundColor: '#F1F5F9', width: '31%', paddingVertical: 22, borderRadius: 24, alignItems: 'center', shadowColor: '#FFFFFF', shadowOffset: { width: -6, height: -6 }, shadowOpacity: 1, shadowRadius: 8, elevation: 8 },
  selectedCategory: { backgroundColor: '#FFE5D9', elevation: 14 },
  categoryText: { marginTop: 10, fontSize: 16, fontWeight: '600', color: '#0F172A' },
  statusBanner: { backgroundColor: '#2563EB', padding: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  statusText: { color: 'white', marginLeft: 10, fontSize: 15, fontWeight: '600' },
  resourceCard: { borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', elevation: 10, marginBottom: 30 },
  cardContent: { padding: 24 },
  heroImage: { width: 140, height: 140, alignSelf: 'center', marginBottom: 18, resizeMode: 'contain' },
  resourceTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 20, textAlign: 'center' },
  resourceContent: { marginBottom: 24 },
  contentLine: { fontSize: 16, lineHeight: 26, marginBottom: 12, color: '#334155' },
  kitTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 18 },
  kitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  kitText: { marginLeft: 14, fontSize: 16, color: '#334155' },
  contactCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 24, padding: 20, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', shadowColor: '#94A3B8', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
  contactInfo: { flex: 1, marginLeft: 16 },
  contactName: { fontSize: 17, fontWeight: 'bold', color: '#111827' },
  contactNumber: { fontSize: 15, marginTop: 4, color: '#475569' },
});

export default ResourcesScreen;