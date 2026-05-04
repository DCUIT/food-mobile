// HomeScreen - Trang chủ hiển thị danh sách món ăn
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import API from '../api/api';
import { addToCart } from '../utils/cart';
import { formatPrice } from '../utils/format';

// Category data (static - chưa có category trong DB)
const categories = [
  { icon: '🍜', name: 'Phở' },
  { icon: '🥗', name: 'Bún Chả' },
  { icon: '🍛', name: 'Cơm Tấm' },
  { icon: '🥖', name: 'Bánh Mì' },
  { icon: '🍿', name: 'Đồ Ăn Vặt' },
  { icon: '🍹', name: 'Thức Uống' },
];

interface Food {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    loadFoods();
  }, []);

  async function loadFoods() {
    try {
      const res = await API.get('/foods');
      setFoods(res.data);
    } catch (error) {
      console.error('Load foods error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart(food: Food) {
    setAddingId(food.id);
    try {
      await addToCart({ id: food.id, quantity: 1 });
      // Show feedback
      setTimeout(() => setAddingId(null), 1000);
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  }

  // Filter foods by category (chưa có category trong DB nên show all)
  const filteredFoods = foods;

  const renderFood = ({ item }: { item: Food }) => (
    <TouchableOpacity 
      style={styles.foodCard}
      onPress={() => handleAddToCart(item)}
      disabled={addingId === item.id}
    >
      <Image 
        source={{ uri: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500' }} 
        style={styles.foodImage}
      />
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodPrice}>{formatPrice(item.price)}</Text>
        <TouchableOpacity 
          style={[
            styles.addButton,
            addingId === item.id && styles.addButtonActive
          ]}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addButtonText}>
            {addingId === item.id ? '✓ Đã thêm' : 'Thêm vào giỏ'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>🍽️ Food App</Text>
        <Text style={styles.bannerSubtitle}>Đặt món ngay - Giao hàng tận nơi</Text>
      </View>

      {/* Menu Title */}
      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Thực Đơn Đa Dạng</Text>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        <TouchableOpacity 
          style={[
            styles.categoryButton,
            selectedCategory === null && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={styles.categoryIcon}>🍽️</Text>
          <Text style={[
            styles.categoryText,
            selectedCategory === null && styles.categoryTextActive
          ]}>Tất cả</Text>
        </TouchableOpacity>
        
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.name}
            style={[
              styles.categoryButton,
              selectedCategory === cat.name && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(cat.name)}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={[
              styles.categoryText,
              selectedCategory === cat.name && styles.categoryTextActive
            ]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Food Grid */}
      <FlatList
        data={filteredFoods}
        renderItem={renderFood}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.foodList}
      />

      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.navButtonText}>🛒 Giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.navButtonText}>👤 Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    backgroundColor: '#16a34a',
    padding: 24,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#dcfce7',
    marginTop: 4,
  },
  menuSection: {
    padding: 16,
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textTransform: 'uppercase',
  },
  categoryScroll: {
    maxHeight: 80,
  },
  categoryContainer: {
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: '#16a34a',
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 4,
  },
  categoryTextActive: {
    color: '#fff',
  },
  foodList: {
    padding: 8,
  },
  foodCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImage: {
    width: '100%',
    height: 120,
    objectFit: 'cover',
  },
  foodInfo: {
    padding: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  foodPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ea580c',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#f97316',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonActive: {
    backgroundColor: '#22c55e',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  navButton: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
