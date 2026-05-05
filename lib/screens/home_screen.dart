import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/food.dart';
import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';
import '../providers/food_provider.dart';
import '../widgets/banner_widget.dart';
import '../widgets/food_card.dart';
import 'cart_screen.dart';
import 'favorite_screen.dart';
import 'menu_history_screen.dart';
import 'profile_screen.dart';
import 'admin_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  late List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<FoodProvider>(context, listen: false).loadFoods(context);
    });
    _screens = [
      const FoodListTab(),
      CartScreen(),
      const FavoriteScreen(),
      MenuHistoryScreen(),
      const ProfileScreen(),
      if (Provider.of<AuthProvider>(context, listen: false).isAdmin) const AdminScreen(),
    ]; 
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final cart = Provider.of<CartProvider>(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hương Vị Việt'),
        actions: [
          if (cart.totalAmount > 0)
            Stack(
              children: [
                IconButton(
                  onPressed: () => _currentIndex = 1,
                  icon: const Icon(Icons.shopping_cart),
                ),
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(10)),
                    child: Text('${cart.cart.length}', style: const TextStyle(color: Colors.white, fontSize: 12)),
                  ),
                ),
              ],
            ),
          IconButton(
            onPressed: () => auth.logout(),
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: [
          const BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          const BottomNavigationBarItem(icon: Icon(Icons.shopping_cart), label: 'Cart'),
          const BottomNavigationBarItem(icon: Icon(Icons.favorite), label: 'Favorite'),
          const BottomNavigationBarItem(icon: Icon(Icons.history), label: 'Profile'),
          if (auth.isAdmin)
            const BottomNavigationBarItem(icon: Icon(Icons.admin_panel_settings), label: 'Admin'),
        ],
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}

class FoodListTab extends StatelessWidget {
  const FoodListTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<FoodProvider>(
      builder: (context, foodProvider, child) {
        if (foodProvider.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }
        if (foodProvider.error != null) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('Lỗi tải món ăn'),
                ElevatedButton(
                  onPressed: () => foodProvider.loadFoods(context),
                  child: const Text('Thử lại'),
                ),
              ],
            ),
          );
        }
return CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Column(
                children: [
                  const BannerWidget(),
                  const SizedBox(height: 20),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: 'Tìm món ăn...',
                        prefixIcon: const Icon(Icons.search),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    child: Text(
                      'Thực Đơn Đa Dạng',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.75,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final food = foodProvider.foods[index];
                    return FoodCard(food: food);
                  },
                  childCount: foodProvider.foods.length,
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
