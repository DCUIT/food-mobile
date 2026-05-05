import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/api_constants.dart';
import '../models/food.dart';
import '../models/order.dart';

class ApiService {
static const String baseUrl = apiBaseUrl;

  // Get all foods
  static Future<List<Food>> getFoods() async {
    final response = await http.get(Uri.parse('$baseUrl/foods'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Food.fromJson(json)).toList();
    }
    throw Exception('Failed to load foods');
  }

  // Login
  static Future<Map<String, dynamic>> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'username': username, 'password': password}),
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    }
    throw Exception('Login failed');
  }

  // Register
  static Future<String> register(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/register'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'username': username, 'password': password}),
    );
    if (response.statusCode == 200) {
      return 'Đăng ký thành công';
    }
    throw Exception('Register failed');
  }

  // Create order (requires token)
  static Future<String> createOrder(String token, List<dynamic> cart) async {
    final response = await http.post(
      Uri.parse('$baseUrl/order'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({'cart': cart}),
    );
    if (response.statusCode == 200) {
      return 'Order created';
    }
    throw Exception('Order failed');
  }

  // Get orders (requires token)
  static Future<List<Order>> getOrders(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/orders'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Order.fromJson(json)).toList();
    }
    throw Exception('Failed to load orders');
  }
}
