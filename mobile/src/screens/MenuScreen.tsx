// MenuScreen - Xem đơn hàng của tôi
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/api';
import { parseItems, calculateOrderTotal, getStatusLabel } from '../utils/parseOrder';
import { formatPrice } from '../utils/format';

interface Order {
  id: number;
  user: string;
  status: string;
  items: string;
  created_at?: string;
}

export default function MenuScreen() {
  const navigation = useNavigation<any>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadOrders();
    }, [])
  );

  async function loadOrders() {
    setLoading(true);
    try {
      const t = await AsyncStorage.getItem('token');
      setToken(t);
      
      if (!t) {
        setOrders([]);
        setLoading(false);
        return;
      }
      
      const res = await API.get('/orders', {
        headers: { Authorization: `Bearer ${t}` }
      });
      setOrders(res.data);
    } catch (error) {
      console.error('Load orders error:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelOrder(orderId: number) {
    if (!token) return;
    
    Alert.alert('Xác nhận', 'Bạn có chắc muốn hủy đơn hàng này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đồng ý',
        onPress: async () => {
          try {
            await API.put(`/orders/${orderId}/cancel`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
            loadOrders();
            Alert.alert('Thành công', 'Đơn hàng đã được hủy');
          } catch (error: any) {
            Alert.alert('Lỗi', error.response?.data?.msg || 'Hủy đơn thất bại');
          }
        }
      }
    ]);
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return '#eab308';
      case 'paid': return '#22c55e';
      case 'cancelled': return '#ef4444';
      case 'refunded': return '#6b7280';
      default: return '#6b7280';
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!token) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔐</Text>
        <Text style={styles.emptyText}>Vui lòng đăng nhập để xem đơn hàng</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Đăng nhập ngay</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopButtonText}>Đặt món ngay</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Đơn hàng của tôi</Text>
      
      {orders.map(order => {
        const items = parseItems(order.items);
        const total = calculateOrderTotal(order.items);
        const orderItems = parseItems(order.items);
        
        return (
          <TouchableOpacity 
            key={order.id}
            style={styles.orderCard}
            onPress={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
          >
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>Đơn hàng #{order.id}</Text>
                <Text style={styles.orderUser}>by {order.user}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                  {getStatusLabel(order.status)}
                </Text>
              </View>
            </View>
            
            <Text style={styles.orderTotal}>{formatPrice(total)}</Text>
            
            {/* Show order items when expanded */}
            {selectedOrder?.id === order.id && (
              <View style={styles.orderDetails}>
                <Text style={styles.detailsTitle}>Chi tiết đơn hàng:</Text>
                {orderItems.map((item: any, index: number) => (
                  <Text key={index} style={styles.itemDetail}>
                    • {item.name} x{item.quantity} = {formatPrice(item.price * item.quantity)}
                  </Text>
                ))}
                
                {order.status === 'pending' && (
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => handleCancelOrder(order.id)}
                  >
                    <Text style={styles.cancelButtonText}>Hủy đơn hàng</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            <Text style={styles.expandHint}>
              {selectedOrder?.id === order.id ? 'Tap để thu gọn' : 'Tap để xem chi tiết'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#eab308',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  shopButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  orderUser: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ea580c',
    marginTop: 8,
  },
  orderDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  itemDetail: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  cancelButtonText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  expandHint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 12,
    textAlign: 'center',
  },
});
