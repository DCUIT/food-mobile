import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../models/food.dart';

class CartProvider extends ChangeNotifier {
  List<Food> _favorites = [];
  List<Food> get favorites => _favorites;

  void toggleFavorite(Food food) {
    final index = _favorites.indexWhere((f) => f.id == food.id);
    if (index >= 0) {
      _favorites.removeAt(index);
    } else {
      _favorites.add(food);
    }
    notifyListeners();
  }

  bool isFavorite(Food food) => _favorites.any((f) => f.id == food.id);
final List<CartItem> _cart = [];

  List<CartItem> get cart => _cart;

  double get totalAmount {
    return _cart.fold(0, (sum, item) => sum + item.totalPrice);
  }

  void addToCart(Food food, {int quantity = 1}) {
    final existingIndex = _cart.indexWhere((item) => item.food.id == food.id);
    if (existingIndex >= 0) {
      _cart[existingIndex].quantity += quantity;
    } else {
      _cart.add(CartItem(food: food, quantity: quantity));
    }
    notifyListeners();
  }

  void removeFromCart(CartItem item) {
    _cart.remove(item);
    notifyListeners();
  }

  void updateQuantity(CartItem item, int quantity) {
    item.quantity = quantity;
    if (item.quantity == 0) {
      removeFromCart(item);
    }
    notifyListeners();
  }

  void clearCart() {
    _cart.clear();
    notifyListeners();
  }
}
