// Cart utility - sử dụng AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeEventEmitter, NativeModules } from 'react-native';

const CART_KEY = 'cart';

// Event emitter cho cart changes
const { RNAsyncStorage } = NativeModules;
const eventEmitter = RNAsyncStorage ? new NativeEventEmitter(RNAsyncStorage) : null;

/**
 * Get cart items
 */
export async function getCart(): Promise<Array<{id: number; quantity: number}>> {
  try {
    const cartString = await AsyncStorage.getItem(CART_KEY);
    if (!cartString) return [];
    return JSON.parse(cartString);
  } catch (e) {
    console.error('Cart get error:', e);
    return [];
  }
}

/**
 * Save cart items
 */
async function saveCart(cart: Array<{id: number; quantity: number}>): Promise<void> {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Add item to cart
 */
export async function addToCart(item: {id: number; quantity?: number}): Promise<Array<{id: number; quantity: number}>> {
  const cart = await getCart();
  const { id, quantity = 1 } = item;
  const existingIndex = cart.findIndex(c => c.id === id);
  
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ id, quantity });
  }
  
  await saveCart(cart);
  return cart;
}

/**
 * Remove item from cart
 */
export async function removeFromCart(id: number): Promise<Array<{id: number; quantity: number}>> {
  const cart = await getCart();
  const newCart = cart.filter(item => item.id !== id);
  await saveCart(newCart);
  return newCart;
}

/**
 * Update item quantity in cart
 */
export async function updateCartQuantity(id: number, newQuantity: number): Promise<Array<{id: number; quantity: number}>> {
  if (newQuantity <= 0) {
    return removeFromCart(id);
  }
  
  const cart = await getCart();
  const index = cart.findIndex(item => item.id === id);
  if (index > -1) {
    cart[index].quantity = newQuantity;
    await saveCart(cart);
  }
  return cart;
}

/**
 * Clear cart
 */
export async function clearCart(): Promise<void> {
  await AsyncStorage.removeItem(CART_KEY);
}

/**
 * Get cart item count (tổng số lượng all items)
 */
export async function getCartCount(): Promise<number> {
  const cart = await getCart();
  return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
}
