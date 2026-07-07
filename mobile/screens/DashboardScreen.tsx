import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import SyncManager from '../utils/SyncManager';

interface Task {
  id: string;
  title: string;
  xp: number;
  difficulty: string;
  status: string;
}

export default function DashboardScreen({ navigation }: { navigation: { navigate: (screen: 'dashboard' | 'qr_scanner') => void } }) {
  const [xp, setXp] = useState(3420);
  const [streak, setStreak] = useState(6);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'task-1', title: 'Refactor Core State Engine', xp: 60, difficulty: 'hard', status: 'in_progress' },
    { id: 'task-2', title: 'Fix SQLite Cache Leak', xp: 60, difficulty: 'hard', status: 'todo' },
    { id: 'task-3', title: 'OAuth Token validation middleware', xp: 30, difficulty: 'medium', status: 'todo' }
  ]);
  const [isOffline, setIsOffline] = useState(false);

  // Sync Manager connection check simulation
  useEffect(() => {
    const handleConnectionChange = () => {
      // Toggle connection every 20 seconds for simulation demo
      setIsOffline((prev) => {
        const next = !prev;
        if (!next) {
          SyncManager.replayOfflineQueue().then((success) => {
            if (success) console.log('📶 Re-synchronized offline queued tasks!');
          });
        }
        return next;
      });
    };
    const interval = setInterval(handleConnectionChange, 20000);
    return () => clearInterval(interval);
  }, []);

  const claimTaskReward = async (task: Task) => {
    if (isOffline) {
      // Cache completion offline
      await SyncManager.cacheTaskCompletion(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      alert('💾 Connection offline! Task cached locally. Will sync automatically when connection restores.');
    } else {
      // Instantly add XP in online mode
      setXp((prev) => prev + task.xp);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      alert(`🎉 Reward Claimed! +${task.xp} XP added to your balance.`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Profile Summary */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.username}>Developer Engineer 01</Text>
            <Text style={styles.subtitle}>Level 4 Champion</Text>
          </View>
        </View>

        {/* Offline Badge status bar */}
        <View style={[styles.networkBadge, isOffline ? styles.badgeOffline : styles.badgeOnline]}>
          <Text style={styles.networkText}>{isOffline ? '⚠️ OFFLINE MODE (Saves locally)' : '⚡ ONLINE SYNC ACTIVE'}</Text>
        </View>
      </View>

      {/* Gamification Core Stats card */}
      <View style={styles.statsCard}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TOTAL XP</Text>
          <Text style={styles.statValue}>{xp}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>STREAK FIRE</Text>
          <Text style={[styles.statValue, { color: '#ff4d9d' }]}>🔥 {streak} Days</Text>
        </View>
      </View>

      {/* Task List Panel */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sprints Active Tasks</Text>
      </View>

      {tasks.length === 0 ? (
        <Text style={styles.noTasks}>No pending mobile quests!</Text>
      ) : (
        tasks.map((item) => (
          <View key={item.id} style={styles.taskCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskXp}>+{item.xp} XP Points • {item.difficulty.toUpperCase()}</Text>
            </View>
            <TouchableOpacity style={styles.claimButton} onPress={() => claimTaskReward(item)}>
              <Text style={styles.claimText}>Complete</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* QR scanner action card */}
      <TouchableOpacity 
        style={styles.qrCard} 
        onPress={() => navigation.navigate('qr_scanner')}
      >
        <Text style={styles.qrCardText}>📷 Open QR Code Scanner</Text>
        <Text style={styles.qrCardDesc}>Scan codes at desk hotspots to redeem company merchandise or claim coffee vouchers.</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#6c63ff',
  },
  username: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#a1a1aa',
    fontSize: 12,
  },
  networkBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeOnline: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
  },
  badgeOffline: {
    backgroundColor: 'rgba(255, 77, 157, 0.15)',
  },
  networkText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#141419',
    borderColor: '#22222a',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#71717a',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#22222a',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noTasks: {
    color: '#71717a',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 12,
  },
  taskCard: {
    backgroundColor: '#141419',
    borderColor: '#22222a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskXp: {
    color: '#6c63ff',
    fontSize: 11,
    fontWeight: '700',
  },
  claimButton: {
    backgroundColor: '#6c63ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  claimText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  qrCard: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderColor: 'rgba(108, 99, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  qrCardText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  qrCardDesc: {
    color: '#a1a1aa',
    fontSize: 11,
    lineHeight: 16,
  },
});
