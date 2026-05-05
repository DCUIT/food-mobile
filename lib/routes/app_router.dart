import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../screens/auth/login_screen.dart';
import '../screens/home_screen.dart';
import '../screens/food_detail_screen.dart';
import '../screens/cart_screen.dart';
import '../screens/favorite_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/admin_screen.dart';
import '../screens/menu_history_screen.dart';

part 'app_router.gr.dart'; // Codegen

@TypedGoRoute<LoginRoute>(path: '/login')
class LoginRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) => const AuthLoginScreen();
}

@TypedGoRoute<HomeRoute>(path: '/home')
class HomeRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) => const HomeScreen();
}

@TypedGoRoute<FoodDetailRoute>(path: '/food/:id')
class FoodDetailRoute extends GoRouteData {
  final String id;
  const FoodDetailRoute({required this.id});

  @override
  Widget build(BuildContext context, GoRouterState state) {
    final foodId = int.parse(id);
    return FoodDetailScreen(foodId: foodId);
  }
}

// ... other routes

final GoRouter router = GoRouter(
  initialLocation: '/login',
  routes: $appRoutes,
  redirect: (context, state) {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (!auth.isLoggedIn && !state.location.startsWith('/login')) return '/login';
    return null;
  },
);

