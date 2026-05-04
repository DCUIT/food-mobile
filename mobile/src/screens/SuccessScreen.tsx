// SuccessScreen - Xác nhận đặt hàng thành công
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SuccessScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>Đặt hàng thành công!</Text>
      <Text style={styles.subtitle}>Cảm ơn bạn đã đặt hàng</Text>
      <Text style={styles.desc}>
        Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.
      </Text>

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>Về trang chủ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.ordersButton}
          onPress={() => navigation.navigate('Menu')}
        >
          <Text style={styles.ordersButtonText}>Xem đơn hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#374151',
    marginBottom: 16,
  },
  desc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  homeButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ordersButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  ordersButtonText: {
    color: '#16a34a',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
