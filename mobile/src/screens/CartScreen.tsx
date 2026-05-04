// CartScreen - Giỏ hàng
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import API from '../api/api';
import { getCart, removeFromCart, updateCartQuantity } from '../utils/cart';
import { formatPrice } from '../utils/format';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  async function loadCart() {
    setLoading(true);
    try {
      const cart = await getCart();
      
      if (cart.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }
      
      const res = await API.get('/foods');
      const itemsWithQty = res.data
        .filter((f: any) => cart.some((item: any) => item.id === f.id))
        .map((f: any) => {
          const cartItem = cart.find((item: any) => item.id === f.id);
          return { ...f, quantity: cartItem.quantity };
        });
      setItems(itemsWithQty);
    } catch (error) {
      console.error('Cart error:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveItem(id: number) {
    await removeFromCart(id);
    loadCart();
  }

  async function handleUpdateQuantity(id: number, newQty: number) {
    await updateCartQuantity(id, newQty);
    loadCart();
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyText}>Giỏ hàng trống</Text>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopButtonText}>Chọn món ăn ngay</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Giỏ hàng của bạn</Text>
      
      {items.map(item => (
        <View key={item.id} style={styles.itemCard}>
          <Image 
            source={{ uri: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80' }} 
            style={styles.itemImage}
          />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
            
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={[styles.quantityButton, styles.quantityButtonPlus]}
                onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.itemActions}>
            <Text style={styles.itemTotal}>{formatPrice(item.price * item.quantity)}</Text>
            <TouchableOpacity
              onPress={() => handleRemoveItem(item.id)}
            >
              <Text style={styles.removeText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.totalText}>
          Tổng cộng: <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
        </Text>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Payment')}
        >
          <Text style={styles.checkoutButtonText}>Đặt hàng ngay</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 20,
    color: '#6b7280',
    marginBottom: 24,
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
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    objectFit: 'cover',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  itemPrice: {
    fontSize: 14,
    color: '#ea580c',
    fontWeight: '600',
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  quantityButtonPlus: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  removeText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  footer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 12,
  },
  totalAmount: {
    fontSize: 24,
    color: '#16a34a',
  },
  checkoutButton: {
    backgroundColor: '#f97316',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
