import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import DashboardScreen from './screens/DashboardScreen';
import QRScannerScreen from './screens/QRScannerScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'qr_scanner'>('dashboard');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090b" />
      
      {/* Screen Content Wrapper */}
      <View style={styles.content}>
        {currentScreen === 'dashboard' ? (
          <DashboardScreen navigation={{ navigate: (screen: 'dashboard' | 'qr_scanner') => setCurrentScreen(screen) }} />
        ) : (
          <QRScannerScreen navigation={{ navigate: (screen: 'dashboard' | 'qr_scanner') => setCurrentScreen(screen) }} />
        )}
      </View>

      {/* Futuristic Glassmorphic Tab Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabItem, currentScreen === 'dashboard' && styles.tabActive]}
          onPress={() => setCurrentScreen('dashboard')}
        >
          <Text style={[styles.tabText, currentScreen === 'dashboard' && styles.tabTextActive]}>📊 Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, currentScreen === 'qr_scanner' && styles.tabActive]}
          onPress={() => setCurrentScreen('qr_scanner')}
        >
          <Text style={[styles.tabText, currentScreen === 'qr_scanner' && styles.tabTextActive]}>📷 QR Claim</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#13131a',
    borderTopWidth: 1,
    borderTopColor: '#22222a',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabActive: {
    borderTopWidth: 2,
    borderTopColor: '#6c63ff',
  },
  tabText: {
    color: '#6e6e7e',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#6c63ff',
  },
});
