import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../screens/auth/login_screen.dart';
import '../screens/home_screen.dart';
import '../screens/food_detail_screen.dart';
import '../screens/cart_screen.dart';

final GoRouter router = GoRouter(
  initialLocation: '/auth',
  routes: [
    GoRoute(
      path: '/auth',
      builder: (context, state) => const AuthLoginScreen(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/food/:id',
      builder: (context, state) {
        // Parse food ID
        final id = int.tryParse(state.pathParameters['id']!) ?? 1;
        return FoodDetailScreen(foodId: id);
      },
    ),
    GoRoute(
      path: '/cart',
      builder: (context, state) => const CartScreen(),
    ),
  ],
  redirect: (context, state) {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (!auth.isLoggedIn && state.location != '/auth') {
      return '/auth';
    }
    return null;
  },
  errorBuilder: (context, state) => Scaffold(
    body: Center(child: Text('404: ${state.error}')),
  ),
);

// Helper extensions
extension AppRouter on BuildContext {
  void goToFood(int id) => go('/food/$id');
  void goToCart() => go('/cart');
}

