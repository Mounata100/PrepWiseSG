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
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext'; // Adjust path if needed

// Mock Vouchers Data (Healthy365 style)
const AVAILABLE_VOUCHERS = [
  {
    id: 'v1',
    merchant: 'FairPrice',
    title: '$5 FairPrice eVoucher',
    cost: 500,
    category: 'Groceries',
    icon: 'cart-outline',
    description: 'Valid for 30 days at all FairPrice outlets across Singapore.',
    code: 'FP-SG365-9821',
  },
  {
    id: 'v2',
    merchant: 'Hawker Centre',
    title: '$3 CDC Meal Voucher',
    cost: 300,
    category: 'Food',
    icon: 'restaurant-outline',
    description: 'Redeemable at participating SG Hawker Stalls and Coffee Shops.',
    code: 'HWK-8821-FOOD',
  },
  {
    id: 'v3',
    merchant: 'LiHO Tea',
    title: 'Free Medium Bubble Tea',
    cost: 450,
    category: 'Beverage',
    icon: 'cafe-outline',
    description: 'Valid for standard size milk teas. Top up available for toppings.',
    code: 'LIHO-BOBA-7711',
  },
  {
    id: 'v4',
    merchant: 'SMRT / SimplyGo',
    title: '$2 Transit Top-Up',
    cost: 200,
    category: 'Transport',
    icon: 'bus-outline',
    description: 'Instant credit top-up to your SimplyGo EZ-Link account.',
    code: 'SMRT-BUS-3320',
  },
  {
    id: 'v5',
    merchant: 'Decathlon',
    title: '$10 Sports Equipment eVoucher',
    cost: 950,
    category: 'Fitness',
    icon: 'fitness-outline',
    description: 'Gear up! Redeemable at all Decathlon SG stores or online app.',
    code: 'DECA-FIT-5541',
  },
];

export default function VoucherStoreScreen({ navigation }) {
  // Pull coins and update functions from your UserContext if available,
  // or default to local state for testing
  const userContext = useUser ? useUser() : null;
  const userCoins = userContext?.currentUserCoins ?? 1200; // Mock 1200 coins fallback

  const [activeTab, setActiveTab] = useState('store'); // 'store' or 'my_vouchers'
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [myClaimedVouchers, setMyClaimedVouchers] = useState([]);
  const [selectedClaimedVoucher, setSelectedClaimedVoucher] = useState(null);

  // Handle Voucher Purchase with Coins
  const handleRedeemConfirm = () => {
    if (!selectedVoucher) return;

    if (userCoins < selectedVoucher.cost) {
      Alert.alert(
        'Insufficient Coins',
        `You need ${selectedVoucher.cost - userCoins} more coins to redeem this voucher! Complete daily drills to earn more.`
      );
      return;
    }

    // Deduct coins if function exists in Context
    if (userContext?.spendCoins) {
      userContext.spendCoins(selectedVoucher.cost);
    }

    // Add to My Vouchers list
    const newClaimedItem = {
      ...selectedVoucher,
      claimedAt: new Date().toLocaleDateString('en-SG'),
      redemptionCode: `${selectedVoucher.code}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setMyClaimedVouchers([newClaimedItem, ...myClaimedVouchers]);
    setSelectedVoucher(null);

    Alert.alert(
      '🎉 Redemption Successful!',
      `You redeemed ${newClaimedItem.title} for ${selectedVoucher.cost} coins. Check 'My Vouchers' to view your promo code.`,
      [{ text: 'View My Vouchers', onPress: () => setActiveTab('my_vouchers') }]
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
        <Text style={styles.headerTitle}>Voucher Rewards</Text>
        <View style={styles.coinBadge}>
          <Ionicons name="ribbon" size={16} color="#F59E0B" />
          <Text style={styles.coinText}>{userCoins} PTS</Text>
        </View>
      </View>

      {/* Healthy365 Style Segmented Control Header */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'store' && styles.activeTabButton]}
          onPress={() => setActiveTab('store')}
        >
          <Text style={[styles.tabText, activeTab === 'store' && styles.activeTabText]}>
            Redeem Rewards
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'my_vouchers' && styles.activeTabButton]}
          onPress={() => setActiveTab('my_vouchers')}
        >
          <Text style={[styles.tabText, activeTab === 'my_vouchers' && styles.activeTabText]}>
            My Vouchers ({myClaimedVouchers.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* STORE TAB */}
      {activeTab === 'store' ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.bannerContainer}>
            <Ionicons name="shield-checkmark" size={28} color="#10B981" />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>No Cash Required!</Text>
              <Text style={styles.bannerSub}>
                Trade your disaster prep coins earned from drills for real merchant eVouchers.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Available eVouchers</Text>

          {AVAILABLE_VOUCHERS.map((voucher) => {
            const canAfford = userCoins >= voucher.cost;
            return (
              <TouchableOpacity
                key={voucher.id}
                style={styles.voucherCard}
                onPress={() => setSelectedVoucher(voucher)}
              >
                <View style={styles.voucherIconBox}>
                  <Ionicons name={voucher.icon} size={30} color="#0F766E" />
                </View>

                <View style={styles.voucherInfo}>
                  <Text style={styles.merchantName}>{voucher.merchant}</Text>
                  <Text style={styles.voucherTitle}>{voucher.title}</Text>
                  <Text style={styles.voucherCat}>{voucher.category}</Text>
                </View>

                <View style={styles.costBadgeContainer}>
                  <View style={[styles.costBadge, !canAfford && styles.costBadgeDisabled]}>
                    <Ionicons name="ribbon-outline" size={14} color="white" />
                    <Text style={styles.costText}>{voucher.cost} PTS</Text>
                  </View>
                  <Text style={styles.tapToView}>Tap to view</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        /* MY CLAIMED VOUCHERS TAB */
        <View style={styles.myVouchersContainer}>
          {myClaimedVouchers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="ticket-outline" size={64} color="#475569" />
              <Text style={styles.emptyTitle}>No Vouchers Redeemed Yet</Text>
              <Text style={styles.emptySub}>
                Complete quizzes and preparedness drills to collect coins and claim your first rewards!
              </Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => setActiveTab('store')}
              >
                <Text style={styles.exploreBtnText}>Browse Voucher Store</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={myClaimedVouchers}
              keyExtractor={(item, idx) => item.id + idx}
              contentContainerStyle={{ padding: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.claimedCard}
                  onPress={() => setSelectedClaimedVoucher(item)}
                >
                  <View style={styles.claimedHeader}>
                    <Text style={styles.claimedMerchant}>{item.merchant}</Text>
                    <View style={styles.activeTag}>
                      <Text style={styles.activeTagText}>READY TO USE</Text>
                    </View>
                  </View>
                  <Text style={styles.claimedTitle}>{item.title}</Text>
                  <Text style={styles.claimedDate}>Claimed on: {item.claimedAt}</Text>
                  <View style={styles.codeSnippetBox}>
                    <Text style={styles.codeSnippetLabel}>CODE:</Text>
                    <Text style={styles.codeSnippetValue}>{item.redemptionCode}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      {/* REDEMPTION CONFIRMATION MODAL */}
      <Modal visible={!!selectedVoucher} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setSelectedVoucher(null)}
            >
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>

            {selectedVoucher && (
              <>
                <View style={styles.modalIconCircle}>
                  <Ionicons name={selectedVoucher.icon} size={40} color="#0F766E" />
                </View>

                <Text style={styles.modalMerchant}>{selectedVoucher.merchant}</Text>
                <Text style={styles.modalTitle}>{selectedVoucher.title}</Text>
                <Text style={styles.modalDesc}>{selectedVoucher.description}</Text>

                <View style={styles.priceSummaryRow}>
                  <Text style={styles.priceLabel}>Voucher Price:</Text>
                  <Text style={styles.priceValue}>{selectedVoucher.cost} PTS</Text>
                </View>
                <View style={styles.priceSummaryRow}>
                  <Text style={styles.priceLabel}>Your Coin Balance:</Text>
                  <Text style={styles.priceValue}>{userCoins} PTS</Text>
                </View>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={[
                    styles.confirmRedeemBtn,
                    userCoins < selectedVoucher.cost && styles.confirmBtnDisabled,
                  ]}
                  onPress={handleRedeemConfirm}
                  disabled={userCoins < selectedVoucher.cost}
                >
                  <Text style={styles.confirmRedeemText}>
                    {userCoins >= selectedVoucher.cost
                      ? `Confirm Redemption (${selectedVoucher.cost} PTS)`
                      : 'Insufficient Coins'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* VIEW CLAIMED VOUCHER CODE MODAL */}
      <Modal visible={!!selectedClaimedVoucher} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.codeModalContent}>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setSelectedClaimedVoucher(null)}
            >
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>

            {selectedClaimedVoucher && (
              <>
                <Text style={styles.codeModalHeader}>Show to Merchant Cashier</Text>
                <Text style={styles.codeModalMerchant}>{selectedClaimedVoucher.merchant}</Text>
                <Text style={styles.codeModalTitle}>{selectedClaimedVoucher.title}</Text>

                <View style={styles.barcodeBox}>
                  <Ionicons name="qr-code-outline" size={120} color="#0F172A" />
                  <Text style={styles.barcodeText}>{selectedClaimedVoucher.redemptionCode}</Text>
                </View>

                <Text style={styles.codeModalFooter}>
                  Present this QR / Code at checkout counter. Non-refundable once scanned.
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
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: 'white' },
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
  coinText: { color: '#F59E0B', fontWeight: '700', marginLeft: 6, fontSize: 13 },

  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTabButton: { backgroundColor: '#0F766E' },
  tabText: { color: '#94A3B8', fontWeight: '600', fontSize: 13 },
  activeTabText: { color: 'white', fontWeight: '700' },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 30 },

  bannerContainer: {
    flexDirection: 'row',
    backgroundColor: '#022C22',
    borderWidth: 1,
    borderColor: '#059669',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerTextContainer: { marginLeft: 12, flex: 1 },
  bannerTitle: { color: '#10B981', fontWeight: '700', fontSize: 14 },
  bannerSub: { color: '#A7F3D0', fontSize: 12, marginTop: 2 },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 12 },

  voucherCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  voucherIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E6FFFA',
    justify: 'center',
    alignItems: 'center',
  },
  voucherInfo: { flex: 1, marginLeft: 12 },
  merchantName: { fontSize: 12, fontWeight: '700', color: '#0F766E' },
  voucherTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 2 },
  voucherCat: { fontSize: 11, color: '#64748B', marginTop: 2 },

  costBadgeContainer: { alignItems: 'flex-end' },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  costBadgeDisabled: { backgroundColor: '#94A3B8' },
  costText: { color: 'white', fontWeight: '700', fontSize: 12, marginLeft: 4 },
  tapToView: { fontSize: 10, color: '#94A3B8', marginTop: 4 },

  myVouchersContainer: { flex: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyTitle: { color: 'white', fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptySub: { color: '#94A3B8', textAlign: 'center', fontSize: 13, marginTop: 8, lineHeight: 18 },
  exploreBtn: {
    backgroundColor: '#0F766E',
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
  claimedMerchant: { color: '#2DD4BF', fontWeight: '700', fontSize: 13 },
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
  codeSnippetValue: { color: '#F59E0B', fontSize: 13, fontWeight: '800', marginLeft: 8 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  closeModalBtn: { alignSelf: 'flex-end', padding: 4 },
  modalIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E6FFFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalMerchant: { color: '#0F766E', fontWeight: '700', fontSize: 14 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 4, textAlign: 'center' },
  modalDesc: { color: '#64748B', fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 18 },

  priceSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  priceLabel: { color: '#64748B', fontSize: 14 },
  priceValue: { color: '#0F172A', fontWeight: '700', fontSize: 14 },

  divider: { height: 1, backgroundColor: '#E2E8F0', width: '100%', marginVertical: 16 },

  confirmRedeemBtn: {
    backgroundColor: '#0F766E',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmBtnDisabled: { backgroundColor: '#94A3B8' },
  confirmRedeemText: { color: 'white', fontWeight: '700', fontSize: 15 },

  codeModalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 'auto',
    marginTop: 'auto',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  codeModalHeader: { fontSize: 12, color: '#64748B', fontWeight: '700', textTransform: 'uppercase' },
  codeModalMerchant: { fontSize: 18, fontWeight: '800', color: '#0F766E', marginTop: 4 },
  codeModalTitle: { fontSize: 14, color: '#0F172A', marginTop: 2, textAlign: 'center' },
  barcodeBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  barcodeText: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginTop: 10, letterSpacing: 1.5 },
  codeModalFooter: { color: '#94A3B8', fontSize: 11, textAlign: 'center', lineHeight: 16 },
});