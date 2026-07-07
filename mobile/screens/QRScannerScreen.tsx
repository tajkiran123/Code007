import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

export default function QRScannerScreen({ navigation }: { navigation: { navigate: (screen: 'dashboard' | 'qr_scanner') => void } }) {
  const [scanned, setScanned] = useState(false);

  const simulateQRCodeScan = (codeValue: string) => {
    setScanned(true);
    Alert.alert(
      '🔍 HOTSPOT SCAN SUCCESSFUL',
      `You scanned: "${codeValue}". Claim reward now?`,
      [
        { text: 'Cancel', onPress: () => setScanned(false), style: 'cancel' },
        { 
          text: 'Redeem Item', 
          onPress: () => {
            Alert.alert('🎉 SUCCESS', 'Voucher claimed! Check your registered work email inbox.');
            setScanned(false);
            navigation.navigate('dashboard');
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📷 WorkQuest AI QR Reader</Text>
      <Text style={styles.subtitle}>Align the QR Code inside the highlighted viewfinder zone to claim vouchers</Text>

      {/* Simulated Scanner Viewfinder */}
      <View style={styles.viewfinderContainer}>
        <View style={styles.viewfinder}>
          {scanned && <View style={styles.scannedLine} />}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.simulateButton}
        onPress={() => simulateQRCodeScan('WorkQuest Premium Hoodie Voucher (XP-600)')}
      >
        <Text style={styles.simulateText}>Simulate Camera Scan</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('dashboard')}
      >
        <Text style={styles.backText}>← Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#71717a',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 40,
  },
  viewfinderContainer: {
    width: 250,
    height: 250,
    borderColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    backgroundColor: '#13131a',
  },
  viewfinder: {
    width: 200,
    height: 200,
    borderColor: '#6c63ff',
    borderWidth: 2,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  scannedLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#00d4ff',
    top: '50%',
  },
  simulateButton: {
    backgroundColor: '#6c63ff',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  simulateText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 10,
  },
  backText: {
    color: '#a1a1aa',
    fontSize: 13,
  },
});
