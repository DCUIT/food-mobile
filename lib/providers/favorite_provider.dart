import 'package:flutter/material.dart';
import '../models/food.dart';

class FavoriteProvider extends ChangeNotifier {
  final List<Food> _favorites = [];
  List<Food> get favorites => List.unmodifiable(_favorites);

  bool get hasFavorites => _favorites.isNotEmpty;

  bool isFavorite(Food food) => _favorites.any((f) => f.id == food.id);

  void toggleFavorite(Food food) {
    final index = _favorites.indexWhere((f) => f.id == food.id);
    if (index >= 0) {
      _favorites.removeAt(index);
    } else {
      _favorites.add(food);
    }
    notifyListeners();
  }

  void addFavorite(Food food) {
    if (!isFavorite(food)) {
      _favorites.add(food);
      notifyListeners();
    }
  }

  void removeFavorite(Food food) {
    final index = _favorites.indexWhere((f) => f.id == food.id);
    if (index >= 0) {
      _favorites.removeAt(index);
      notifyListeners();
    }
  }

  @override
  void dispose() {
    super.dispose();
  }
}

