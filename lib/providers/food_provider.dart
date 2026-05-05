import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/food.dart';

class FoodProvider extends ChangeNotifier {
  List<Food> _filteredFoods = [];
  String _searchQuery = '';

  List<Food> get filteredFoods => _filteredFoods.isNotEmpty ? _filteredFoods : _allFoods;
  List<Food> get _allFoods => _foods; // private access

  void filterFoods(String query) {
    _searchQuery = query.toLowerCase();
    if (_searchQuery.isEmpty) {
      _filteredFoods.clear();
    } else {
      _filteredFoods = _foods.where((food) => 
        food.name.toLowerCase().contains(_searchQuery)
      ).toList();
    }
    notifyListeners();
  }
  List<Food> _foods = [];
  bool _isLoading = false;
  String? _error;

  List<Food> get foods => _foods;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadFoods(BuildContext context) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _foods = await ApiService.getFoods();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
