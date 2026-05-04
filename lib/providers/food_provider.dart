import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/food.dart';

class FoodProvider extends ChangeNotifier {
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
