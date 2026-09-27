import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';

const AVAILABLE_REWARDS = [
  {
    id: 'r1',
    category: 'Haze Protection',
    title: 'N95 Respirator Mask Pack (Box of 10)',
    cost: 50,
    icon: 'medical-outline',
    description: 'High-filtration masks essential for shielding your respiratory system during severe cross-border haze conditions.',
    code: 'HAZE-N95-01',
  },
  {
    id: 'r2',
    category: 'Flood Preparedness',
    title: 'Waterproof Document & Tech Dry Bag',
    cost: 50,
    icon: 'water-outline',
    description: 'Heavy-duty sealable pouch to keep passports, insurance papers, and emergency cash dry during sudden flash floods.',
    code: 'FLOOD-BAG-02',
  },
  {
    id: 'r3',
    category: 'Heatwave Safety',
    title: 'Electrolyte & Oral Rehydration Kit',
    cost: 25,
    icon: 'sunny-outline',
    description: 'Essential rehydration salts and cooling patches to prevent heat exhaustion and dehydration during extreme heat waves.',
    code: 'HEAT-ORC-03',
  },
  {
    id: 'r4',
    category: 'Emergency Utility',
    title: 'Solar-Powered Hand Crank Emergency Radio',
    cost: 90,
    icon: 'radio-outline',
    description: 'Stay updated on weather advisories and evacuation orders even during total power grid and cellular network outages.',
    code: 'UTILITY-RADIO-04',
  },
  {
    id: 'r5',
    category: 'Family Kit',
    title: 'Portable First Aid Trauma Module',
    cost: 65,
    icon: 'fitness-outline',
    description: 'Compact medical kit stocked with bandages, antiseptic wipes, and burn gel tailored for common urban emergencies.',
    code: 'KIT-FA-05',
  },
];

export default function VoucherStoreScreen({ navigation }) {
  const { user, spendPrepCoins, addInventoryItem } = useUser();
  
  const currentUserCoins = user?.prepCoins ?? 0;
  const myInventory = user?.inventory ?? [];

  const [activeTab, setActiveTab] = useState('store'); 
  const [selectedReward, setSelectedReward] = useState(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

  const handleRedeemConfirm = () => {
    if (!selectedReward) return;

    if (currentUserCoins < selectedReward.cost) {
      Alert.alert(
        'Insufficient Prep Points',
        `You need ${selectedReward.cost - currentUserCoins} more points to claim this preparedness item. Complete daily hazard quizzes and drills to earn more!`
      );
      return;
    }

    // Deduct coins persistently
    spendPrepCoins(selectedReward.cost);

    // Save item persistently to user inventory
    const newInventoryItem = {
      ...selectedReward,
      unlockedAt: new Date().toLocaleDateString('en-SG'),
      serialCode: `${selectedReward.code}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    addInventoryItem(newInventoryItem);
    setSelectedReward(null);

    Alert.alert(
      '🎉 Preparedness Item Claimed!',
      `You successfully secured your voucher for ${newInventoryItem.title}. Check 'My Vouchers' to view your redemption code.`,
      [{ text: 'View My Vouchers', onPress: () => setActiveTab('my_inventory') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}> Rewards Hub</Text>
        <View style={styles.coinBadge}>
          <Ionicons name="shield-checkmark" size={16} color="#34D399" />
          <Text style={styles.coinText}>{currentUserCoins} PrepCoins</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'store' && styles.activeTabButton]}
          onPress={() => setActiveTab('store')}
        >
          <Text style={[styles.tabText, activeTab === 'store' && styles.activeTabText]}>
            Available Rewards
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'my_inventory' && styles.activeTabButton]}
          onPress={() => setActiveTab('my_inventory')}
        >
          <Text style={[styles.tabText, activeTab === 'my_inventory' && styles.activeTabText]}>
            My Vouchers ({myInventory.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* STORE TAB */}
      {activeTab === 'store' ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.bannerContainer}>
            <Ionicons name="alert-circle-outline" size={28} color="#34D399" />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Redeem Your Safety Points</Text>
              <Text style={styles.bannerSub}>
                Exchange your earned points for real emergency gear, protection kits, and survival essentials against haze, floods, and heatwaves.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Emergency Readiness Supplies</Text>

          {AVAILABLE_REWARDS.map((reward) => {
            const canAfford = currentUserCoins >= reward.cost;
            return (
              <TouchableOpacity
                key={reward.id}
                style={styles.voucherCard}
                onPress={() => setSelectedReward(reward)}
              >
                <View style={styles.voucherIconBox}>
                  <Ionicons name={reward.icon} size={28} color="#0D9488" />
                </View>

                <View style={styles.voucherInfo}>
                  <Text style={styles.merchantName}>{reward.category.toUpperCase()}</Text>
                  <Text style={styles.voucherTitle}>{reward.title}</Text>
                  <Text style={styles.voucherCat}>{reward.description.substring(0, 48)}...</Text>
                </View>

                <View style={styles.costBadgeContainer}>
                  <View style={[styles.costBadge, !canAfford && styles.costBadgeDisabled]}>
                    <Ionicons name="shield-outline" size={14} color="white" />
                    <Text style={styles.costText}>{reward.cost} PrepCoins</Text>
                  </View>
                  <Text style={styles.tapToView}>Tap to redeem</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        /* MY INVENTORY / VOUCHERS TAB */
        <View style={styles.myVouchersContainer}>
          {myInventory.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={64} color="#64748B" />
              <Text style={styles.emptyTitle}>No Vouchers Claimed Yet</Text>
              <Text style={styles.emptySub}>
                Complete safety modules, hazard drills, and quizzes to accumulate points and claim real emergency gear vouchers!
              </Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => setActiveTab('store')}
              >
                <Text style={styles.exploreBtnText}>Browse Rewards Store</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={myInventory}
              keyExtractor={(item, idx) => item.id + idx}
              contentContainerStyle={{ padding: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.claimedCard}
                  onPress={() => setSelectedInventoryItem(item)}
                >
                  <View style={styles.claimedHeader}>
                    <Text style={styles.claimedMerchant}>{item.category.toUpperCase()}</Text>
                    <View style={styles.activeTag}>
                      <Text style={styles.activeTagText}>READY TO REDEEM</Text>
                    </View>
                  </View>
                  <Text style={styles.claimedTitle}>{item.title}</Text>
                  <Text style={styles.claimedDate}>Claimed on: {item.unlockedAt}</Text>
                  <View style={styles.codeSnippetBox}>
                    <Text style={styles.codeSnippetLabel}>VOUCHER CODE:</Text>
                    <Text style={styles.codeSnippetValue}>{item.serialCode}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      {/* REWARD INSPECT / CONFIRM MODAL */}
      <Modal visible={!!selectedReward} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setSelectedReward(null)}
            >
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>

            {selectedReward && (
              <>
                <View style={styles.modalIconCircle}>
                  <Ionicons name={selectedReward.icon} size={36} color="#0D9488" />
                </View>

                <Text style={styles.modalMerchant}>{selectedReward.category.toUpperCase()}</Text>
                <Text style={styles.modalTitle}>{selectedReward.title}</Text>
                <Text style={styles.modalDesc}>{selectedReward.description}</Text>

                <View style={styles.priceSummaryRow}>
                  <Text style={styles.priceLabel}>Points Required:</Text>
                  <Text style={styles.priceValue}>{selectedReward.cost} PrepCoins</Text>
                </View>
                <View style={styles.priceSummaryRow}>
                  <Text style={styles.priceLabel}>Your Current Balance:</Text>
                  <Text style={styles.priceValue}>{currentUserCoins} PrepCoins</Text>
                </View>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={[
                    styles.confirmRedeemBtn,
                    currentUserCoins < selectedReward.cost && styles.confirmBtnDisabled,
                  ]}
                  onPress={handleRedeemConfirm}
                  disabled={currentUserCoins < selectedReward.cost}
                >
                  <Text style={styles.confirmRedeemText}>
                    {currentUserCoins >= selectedReward.cost
                      ? `Claim Voucher (${selectedReward.cost} PrepCoins)`
                      : 'Insufficient Points'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* VIEW VOUCHER QR/SERIAL DETAILS MODAL */}
      <Modal visible={!!selectedInventoryItem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.codeModalContent}>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setSelectedInventoryItem(null)}
            >
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>

            {selectedInventoryItem && (
              <>
                <Text style={styles.codeModalHeader}>Emergency Supply Voucher</Text>
                <Text style={styles.codeModalMerchant}>{selectedInventoryItem.category}</Text>
                <Text style={styles.codeModalTitle}>{selectedInventoryItem.title}</Text>

                <View style={styles.barcodeBox}>
                  <Ionicons name="qr-code-outline" size={72} color="#0F172A" />
                  <Text style={styles.barcodeText}>{selectedInventoryItem.serialCode}</Text>
                </View>

                <Text style={styles.codeModalFooter}>
                  Present this verification code at participating community collection centers or emergency preparedness roadshows.
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090D16' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: 'white' },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  coinText: { color: '#34D399', fontWeight: '700', marginLeft: 6, fontSize: 13 },

  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTabButton: { backgroundColor: '#0D9488' },
  tabText: { color: '#94A3B8', fontWeight: '600', fontSize: 13 },
  activeTabText: { color: 'white', fontWeight: '700' },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 30 },

  bannerContainer: {
    flexDirection: 'row',
    backgroundColor: '#064E3B',
    borderWidth: 1,
    borderColor: '#059669',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerTextContainer: { marginLeft: 12, flex: 1 },
  bannerTitle: { color: '#34D399', fontWeight: '700', fontSize: 14 },
  bannerSub: { color: '#A7F3D0', fontSize: 12, marginTop: 2, lineHeight: 16 },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 12 },

  voucherCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  voucherIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#134E4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voucherInfo: { flex: 1, marginLeft: 12 },
  merchantName: { fontSize: 11, fontWeight: '700', color: '#2DD4BF', letterSpacing: 0.5 },
  voucherTitle: { fontSize: 14, fontWeight: '700', color: 'white', marginTop: 2 },
  voucherCat: { fontSize: 11, color: '#94A3B8', marginTop: 2 },

  costBadgeContainer: { alignItems: 'flex-end' },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D9488',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  costBadgeDisabled: { backgroundColor: '#475569' },
  costText: { color: 'white', fontWeight: '700', fontSize: 12, marginLeft: 4 },
  tapToView: { fontSize: 10, color: '#94A3B8', marginTop: 4 },

  myVouchersContainer: { flex: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyTitle: { color: 'white', fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptySub: { color: '#94A3B8', textAlign: 'center', fontSize: 13, marginTop: 8, lineHeight: 18 },
  exploreBtn: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  exploreBtnText: { color: 'white', fontWeight: '700' },

  claimedCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  claimedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  claimedMerchant: { color: '#2DD4BF', fontWeight: '700', fontSize: 12 },
  activeTag: { backgroundColor: '#064E3B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  activeTagText: { color: '#34D399', fontSize: 10, fontWeight: '800' },
  claimedTitle: { color: 'white', fontSize: 16, fontWeight: '700', marginTop: 6 },
  claimedDate: { color: '#94A3B8', fontSize: 11, marginTop: 4 },
  codeSnippetBox: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  codeSnippetLabel: { color: '#64748B', fontSize: 12, fontWeight: '700' },
  codeSnippetValue: { color: '#34D399', fontSize: 13, fontWeight: '800', marginLeft: 8 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  closeModalBtn: { alignSelf: 'flex-end', padding: 4 },
  modalIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#134E4A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalMerchant: { color: '#2DD4BF', fontWeight: '700', fontSize: 12, letterSpacing: 0.5 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: 'white', marginTop: 4, textAlign: 'center' },
  modalDesc: { color: '#94A3B8', fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 18 },

  priceSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  priceLabel: { color: '#94A3B8', fontSize: 14 },
  priceValue: { color: 'white', fontWeight: '700', fontSize: 14 },

  divider: { height: 1, backgroundColor: '#334155', width: '100%', marginVertical: 16 },

  confirmRedeemBtn: {
    backgroundColor: '#0D9488',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmBtnDisabled: { backgroundColor: '#475569' },
  confirmRedeemText: { color: 'white', fontWeight: '700', fontSize: 15 },

  codeModalContent: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    marginBottom: 'auto',
    marginTop: 'auto',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  codeModalHeader: { fontSize: 12, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' },
  codeModalMerchant: { fontSize: 14, fontWeight: '800', color: '#2DD4BF', marginTop: 4 },
  codeModalTitle: { fontSize: 16, color: 'white', marginTop: 2, textAlign: 'center', fontWeight: '700' },
  barcodeBox: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  barcodeText: { fontSize: 15, fontWeight: '800', color: '#34D399', marginTop: 10, letterSpacing: 1.5 },
  codeModalFooter: { color: '#94A3B8', fontSize: 11, textAlign: 'center', lineHeight: 16 },
});