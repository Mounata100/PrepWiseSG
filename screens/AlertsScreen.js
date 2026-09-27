import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAlerts } from '../contexts/AlertContext';

const translations = {
  en: {
    environmentalMonitoring: 'Environmental Monitoring',
    pm25: 'PM2.5',
    weather: 'Weather',
    flood: 'Flood',
    airQualityTelemetry: 'Localised Air Quality Telemetry',
    airQuality: 'Air Quality',
    currentTemperature: 'Current Temperature',
    threeDayForecast: '3-Day Local Projections',
    riverDischarge: 'River Discharge Rate',
    normalBaseline: 'Normal Baseline',
    whatItMeans: 'What does this mean?',
    resources: 'Learn More & Resources',
    pm25Meaning:
      'PM2.5 measures very small particles in the air. Lower values generally indicate cleaner air, while higher values may indicate increased particle pollution.',
    weatherMeaning:
      'This is the current local temperature. The forecast below shows the expected daily maximum and minimum temperatures for the coming days.',
    floodMeaning:
      'River discharge is the volume of water flowing past a point each second. A reading such as 0.33 m³/s means approximately 0.33 cubic metres of water is passing that point every second.',
    floodRiskMeaning:
      'Normal Baseline means the current reading is not indicating an elevated flood condition according to the available local data. It does not guarantee that flooding cannot occur.',
    resourcesDescription:
      'View guidance, environmental information, safety advice and explanations of the measurements used in this app.',
  },

  ms: {
    environmentalMonitoring: 'Pemantauan Alam Sekitar',
    pm25: 'PM2.5',
    weather: 'Cuaca',
    flood: 'Banjir',
    airQualityTelemetry: 'Data Kualiti Udara Tempatan',
    airQuality: 'Kualiti Udara',
    currentTemperature: 'Suhu Semasa',
    threeDayForecast: 'Ramalan Tempatan 3 Hari',
    riverDischarge: 'Kadar Aliran Sungai',
    normalBaseline: 'Paras Normal',
    whatItMeans: 'Apakah maksudnya?',
    resources: 'Maklumat & Sumber',
    pm25Meaning:
      'PM2.5 mengukur zarah udara yang sangat halus. Nilai yang lebih rendah biasanya menunjukkan udara yang lebih bersih, manakala nilai yang lebih tinggi mungkin menunjukkan pencemaran zarah yang meningkat.',
    weatherMeaning:
      'Ini ialah suhu tempatan semasa. Ramalan di bawah menunjukkan suhu maksimum dan minimum yang dijangka untuk beberapa hari akan datang.',
    floodMeaning:
      'Kadar aliran sungai ialah jumlah air yang mengalir melalui sesuatu titik setiap saat. Bacaan seperti 0.33 m³/s bermaksud kira-kira 0.33 meter padu air mengalir melalui titik tersebut setiap saat.',
    floodRiskMeaning:
      'Paras Normal bermaksud bacaan semasa tidak menunjukkan keadaan banjir yang meningkat berdasarkan data tempatan yang tersedia. Ia tidak menjamin bahawa banjir tidak akan berlaku.',
    resourcesDescription:
      'Lihat panduan, maklumat alam sekitar, nasihat keselamatan dan penerangan tentang ukuran yang digunakan dalam aplikasi ini.',
  },

  ta: {
    environmentalMonitoring: 'சுற்றுச்சூழல் கண்காணிப்பு',
    pm25: 'PM2.5',
    weather: 'வானிலை',
    flood: 'வெள்ளம்',
    airQualityTelemetry: 'உள்ளூர் காற்றுத் தரத் தகவல்',
    airQuality: 'காற்றுத் தரம்',
    currentTemperature: 'தற்போதைய வெப்பநிலை',
    threeDayForecast: '3 நாள் உள்ளூர் முன்னறிவிப்பு',
    riverDischarge: 'ஆற்றின் நீரோட்ட அளவு',
    normalBaseline: 'இயல்பான நிலை',
    whatItMeans: 'இதன் பொருள் என்ன?',
    resources: 'மேலும் தகவல் & ஆதாரங்கள்',
    pm25Meaning:
      'PM2.5 என்பது காற்றில் உள்ள மிகச் சிறிய துகள்களை அளவிடுகிறது. பொதுவாக குறைந்த மதிப்புகள் தூய்மையான காற்றைக் குறிக்கின்றன; அதிக மதிப்புகள் துகள் மாசுபாடு அதிகரித்திருப்பதைக் குறிக்கலாம்.',
    weatherMeaning:
      'இது தற்போதைய உள்ளூர் வெப்பநிலை. கீழே வரும் நாட்களுக்கான எதிர்பார்க்கப்படும் அதிகபட்ச மற்றும் குறைந்தபட்ச வெப்பநிலைகள் காட்டப்படுகின்றன.',
    floodMeaning:
      'ஆற்றின் நீரோட்ட அளவு என்பது ஒரு குறிப்பிட்ட இடத்தை ஒரு வினாடியில் கடந்து செல்லும் நீரின் அளவு. 0.33 m³/s என்பது ஒவ்வொரு வினாடியும் சுமார் 0.33 கன மீட்டர் நீர் அந்த இடத்தை கடக்கிறது என்பதாகும்.',
    floodRiskMeaning:
      'இயல்பான நிலை என்பது கிடைக்கும் உள்ளூர் தரவுகளின் அடிப்படையில் தற்போதைய அளவு அதிகரித்த வெள்ள அபாயத்தை காட்டவில்லை என்பதாகும். வெள்ளம் ஏற்படாது என்பதற்கான உத்தரவாதம் இது அல்ல.',
    resourcesDescription:
      'வழிகாட்டிகள், சுற்றுச்சூழல் தகவல்கள், பாதுகாப்பு ஆலோசனைகள் மற்றும் இந்த செயலியில் பயன்படுத்தப்படும் அளவீடுகளின் விளக்கங்களைப் பார்க்கவும்.',
  },

  zh: {
    environmentalMonitoring: '环境监测',
    pm25: 'PM2.5',
    weather: '天气',
    flood: '洪水',
    airQualityTelemetry: '本地空气质量数据',
    airQuality: '空气质量',
    currentTemperature: '当前温度',
    threeDayForecast: '未来 3 天本地预测',
    riverDischarge: '河流流量',
    normalBaseline: '正常基准',
    whatItMeans: '这是什么意思？',
    resources: '更多信息与资源',
    pm25Meaning:
      'PM2.5 是空气中非常细小颗粒物的指标。通常较低的数值表示空气较洁净，而较高的数值可能表示颗粒物污染增加。',
    weatherMeaning:
      '这是当前当地温度。下方显示未来几天预计的每日最高和最低温度。',
    floodMeaning:
      '河流流量是每秒通过某一点的水量。例如 0.33 m³/s 表示每秒约有 0.33 立方米的水流经该位置。',
    floodRiskMeaning:
      '正常基准表示根据目前可用的当地数据，当前读数没有显示出升高的洪水状况。这并不代表完全不会发生洪水。',
    resourcesDescription:
      '查看环境信息、安全建议、使用指南以及本应用所使用数据指标的详细解释。',
  },
};

const languages = [
  { key: 'en', label: 'EN' },
  { key: 'ms', label: 'BM' },
  { key: 'ta', label: 'தமிழ்' },
  { key: 'zh', label: '中文' },
];

export default function AlertsScreen({ navigation }) {
  const {
    loading,
    pm25Details,
    weatherDetails,
    floodDetails,
    fetchLocalisedTelemetry,
  } = useAlerts();

  const [activeTab, setActiveTab] = useState('weather');
  const [language, setLanguage] = useState('en');

  const t = translations[language];

  const pmValue =
    pm25Details?.value !== undefined ? pm25Details.value : 12;

  const pmStatus = pm25Details?.status || 'Good';
  const pmColor = pm25Details?.color || '#10B981';

  const floodValue =
    floodDetails?.riverDischarge !== undefined
      ? floodDetails.riverDischarge
      : '0.0';

  const floodColor = floodDetails?.color || '#10B981';

  const floodRisk =
    floodDetails?.floodRisk || t.normalBaseline;

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.titleText}>
          {t.environmentalMonitoring}
        </Text>

        <TouchableOpacity
          style={styles.refreshBadgeButton}
          onPress={fetchLocalisedTelemetry}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name="refresh"
              size={18}
              color="#FFFFFF"
            />
          )}
        </TouchableOpacity>
      </View>

      {/* LANGUAGE SELECTOR */}
      <View style={styles.languageRow}>
        {languages.map((item) => {
          const selected = language === item.key;

          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => setLanguage(item.key)}
              style={[
                styles.languageButton,
                selected && styles.languageButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  selected && styles.languageButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* TAB CONTROLLER */}
      <View style={styles.segmentWrapperRow}>
        {[
          { label: t.pm25, key: 'pm25' },
          { label: t.weather, key: 'weather' },
          { label: t.flood, key: 'flood' },
        ].map((tab) => {
          const isSelected = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.segmentButton,
                isSelected && styles.activeSegmentButton,
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.segmentButtonText,
                  isSelected && styles.activeSegmentButtonText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContentFrame}
        showsVerticalScrollIndicator={false}
      >

        {/* PM2.5 */}
        {activeTab === 'pm25' && (
          <View style={styles.dataCardFrame}>

            <Text style={styles.cardSectionLabel}>
              {t.airQualityTelemetry}
            </Text>

            <View
              style={[
                styles.metricDisplayCircle,
                { borderColor: pmColor },
              ]}
            >
              <Text
                style={[
                  styles.bigMetricNumber,
                  { color: pmColor },
                ]}
              >
                {pmValue}
              </Text>

              <Text style={styles.unitTextLabel}>
                µg/m³
              </Text>
            </View>

            <View
              style={[
                styles.statusBannerRow,
                {
                  backgroundColor: pmColor + '20',
                  borderColor: pmColor,
                },
              ]}
            >
              <Ionicons
                name="checkbox-outline"
                size={18}
                color={pmColor}
              />

              <Text
                style={[
                  styles.statusTextValue,
                  { color: pmColor },
                ]}
              >
                {t.airQuality}: {pmStatus}
              </Text>
            </View>

            {/* MEANING */}
            <View style={styles.meaningBox}>
              <View style={styles.meaningHeader}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#38BDF8"
                />

                <Text style={styles.meaningTitle}>
                  {t.whatItMeans}
                </Text>
              </View>

              <Text style={styles.meaningText}>
                {t.pm25Meaning}
              </Text>
            </View>

          </View>
        )}

        {/* WEATHER */}
        {activeTab === 'weather' && (
          <View style={styles.dataCardFrame}>

            <Text style={styles.cardSectionLabel}>
              {t.currentTemperature}
            </Text>

            <Text style={styles.mainNumericalTempDisplay}>
              {weatherDetails?.currentTemp || '--'}°C
            </Text>

            <View style={styles.meaningBox}>
              <View style={styles.meaningHeader}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#38BDF8"
                />

                <Text style={styles.meaningTitle}>
                  {t.whatItMeans}
                </Text>
              </View>

              <Text style={styles.meaningText}>
                {t.weatherMeaning}
              </Text>
            </View>

            <Text
              style={[
                styles.cardSectionLabel,
                {
                  marginTop: 24,
                  marginBottom: 10,
                },
              ]}
            >
              {t.threeDayForecast}
            </Text>

            {weatherDetails?.forecast?.map((day, idx) => (
              <View
                key={idx}
                style={styles.forecastRowItem}
              >
                <Text style={styles.forecastDateString}>
                  {day.date}
                </Text>

                <Text style={styles.forecastTempSpreadText}>
                  {day.max}°C / {day.min}°C
                </Text>
              </View>
            ))}

          </View>
        )}

        {/* FLOOD */}
        {activeTab === 'flood' && (
          <View style={styles.dataCardFrame}>

            <Text style={styles.cardSectionLabel}>
              {t.riverDischarge}
            </Text>

            <Text style={styles.mainNumericalTempDisplay}>
              {floodValue} m³/s
            </Text>

            <View
              style={[
                styles.statusBannerRow,
                {
                  backgroundColor: floodColor + '20',
                  borderColor: floodColor,
                  marginTop: 10,
                },
              ]}
            >
              <Ionicons
                name="water"
                size={18}
                color={floodColor}
              />

              <Text
                style={[
                  styles.statusTextValue,
                  { color: floodColor },
                ]}
              >
                {floodRisk}
              </Text>
            </View>

            {/* FLOOD MEANING */}
            <View style={styles.meaningBox}>
              <View style={styles.meaningHeader}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#38BDF8"
                />

                <Text style={styles.meaningTitle}>
                  {t.whatItMeans}
                </Text>
              </View>

              <Text style={styles.meaningText}>
                {t.floodMeaning}
              </Text>

              <Text style={styles.meaningTextSecondary}>
                {t.floodRiskMeaning}
              </Text>
            </View>

          </View>
        )}

        {/* RESOURCES BUTTON */}
        <TouchableOpacity
          style={styles.resourcesButton}
          onPress={() => navigation.navigate('Resources')}
          activeOpacity={0.8}
        >
          <View style={styles.resourcesIcon}>
            <Ionicons
              name="library-outline"
              size={22}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.resourcesTextContainer}>
            <Text style={styles.resourcesTitle}>
              {t.resources}
            </Text>

            <Text style={styles.resourcesDescription}>
              {t.resourcesDescription}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#64748B"
          />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
    paddingTop: 60,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  titleText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    flex: 1,
  },

  refreshBadgeButton: {
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },

  /* LANGUAGE */

  languageRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 6,
  },

  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#090F1E',
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  languageButtonActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6',
  },

  languageButtonText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
  },

  languageButtonTextActive: {
    color: '#FFFFFF',
  },

  /* SEGMENTS */

  segmentWrapperRow: {
    flexDirection: 'row',
    backgroundColor: '#090F1E',
    marginHorizontal: 20,
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 20,
  },

  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },

  activeSegmentButton: {
    backgroundColor: '#1E3A8A',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },

  segmentButtonText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },

  activeSegmentButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  /* CONTENT */

  scrollContentFrame: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  dataCardFrame: {
    backgroundColor: '#090F1E',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },

  cardSectionLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },

  /* PM */

  metricDisplayCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },

  bigMetricNumber: {
    fontSize: 44,
    fontWeight: '900',
  },

  unitTextLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    marginTop: -4,
  },

  /* STATUS */

  statusBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    width: '100%',
    justifyContent: 'center',
  },

  statusTextValue: {
    fontSize: 13,
    fontWeight: '800',
  },

  /* MEANING */

  meaningBox: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
  },

  meaningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },

  meaningTitle: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '800',
  },

  meaningText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 20,
  },

  meaningTextSecondary: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },

  /* WEATHER */

  mainNumericalTempDisplay: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: '900',
    marginVertical: 14,
  },

  forecastRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#030712',
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
  },

  forecastDateString: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },

  forecastTempSpreadText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },

  /* RESOURCES */

  resourcesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
  },

  resourcesIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  resourcesTextContainer: {
    flex: 1,
  },

  resourcesTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },

  resourcesDescription: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
  },
});
