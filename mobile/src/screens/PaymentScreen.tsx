// PaymentScreen - Thanh toán
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/api';
import { getCart, clearCart } from '../utils/cart';
import { formatPrice } from '../utils/format';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function PaymentScreen() {
  const navigation = useNavigation<any>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    loadCart();
    checkLogin();
  }, []);

  async function checkLogin() {
    const t = await AsyncStorage.getItem('token');
    setToken(t);
  }

  async function loadCart() {
    const cartData = await getCart();
    
    if (cartData.length === 0) {
      navigation.navigate('Cart');
      return;
    }
    
    try {
      const res = await API.get('/foods');
      const cartItems = cartData.map((item: any) => {
        const food = res.data.find((f: any) => f.id === item.id);
        return food ? { ...food, quantity: item.quantity } : null;
      }).filter(Boolean);
      setCart(cartItems);
    } catch (error) {
      console.error('Load cart error:', error);
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleOrder() {
    if (!token) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập để đặt hàng', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      await API.post('/order', { cart: orderItems }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await clearCart();
      Alert.alert('Thành công', '🎉 Đặt hàng thành công!', [
        { text: 'OK', onPress: () => navigation.replace('Success') }
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi', error.response?.data?.msg || 'Đặt hàng thất bại');
    }
    setLoading(false);
  }

  if (cart.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thanh toán</Text>
      
      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đơn hàng</Text>
        {cart.map(item => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.orderItemName}>{item.name} x{item.quantity}</Text>
            <Text style={styles.orderItemPrice}>{formatPrice(item.price * item.quantity)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        
        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionActive]}
          onPress={() => setPaymentMethod('cod')}
        >
          <View style={styles.radioOuter}>
            {paymentMethod === 'cod' && <View style={styles.radioInner} />}
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Thanh toán khi nhận hàng (COD)</Text>
            <Text style={styles.paymentDesc}>Thanh toán trực tiếp khi nhận hàng</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'transfer' && styles.paymentOptionActive]}
          onPress={() => setPaymentMethod('transfer')}
        >
          <View style={styles.radioOuter}>
            {paymentMethod === 'transfer' && <View style={styles.radioInner} />}
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Chuyển khoản ngân hàng</Text>
            <Text style={styles.paymentDesc}>Chuyển khoản trước, giao hàng sau</Text>
            <Text style={styles.bankInfo}>STK: 123456789 Vietcombank</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'wallet' && styles.paymentOptionActive]}
          onPress={() => setPaymentMethod('wallet')}
        >
          <View style={styles.radioOuter}>
            {paymentMethod === 'wallet' && <View style={styles.radioInner} />}
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Ví điện tử</Text>
            <Text style={styles.paymentDesc}>Momo / ZaloPay / VNPay</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>ĐẶT HÀNG ({formatPrice(total)})</Text>
        )}
      </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  orderItemName: {
    fontSize: 14,
    color: '#374151',
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentOptionActive: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#16a34a',
  },
  paymentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  paymentDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  bankInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
