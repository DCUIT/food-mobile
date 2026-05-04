import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/food.dart';
import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';
import '../providers/food_provider.dart';
import 'cart_screen.dart';
import 'menu_history_screen.dart';
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
      MenuHistoryScreen(),
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
          const BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Trang chủ'),
          const BottomNavigationBarItem(icon: Icon(Icons.shopping_cart), label: 'Giỏ hàng'),
          const BottomNavigationBarItem(icon: Icon(Icons.history), label: 'Đơn hàng'),
          if (auth.isAdmin)
            const BottomNavigationBarItem(icon: Icon(Icons.admin_panel_settings), label: 'Quản lý'),
        ],
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
        return GridView.builder(
          padding: const EdgeInsets.all(16),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 0.8,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
          ),
          itemCount: foodProvider.foods.length,
          itemBuilder: (context, index) {
            final food = foodProvider.foods[index];
            return FoodCard(food: food);
          },
        );
      },
    );
  }
}

class FoodCard extends StatelessWidget {
  final Food food;
  const FoodCard({super.key, required this.food});

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);
    return Card(
      elevation: 4,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
              child: CachedNetworkImage(
                imageUrl: food.image.isNotEmpty ? food.image : 'https://via.placeholder.com/150?text=Food',
                fit: BoxFit.cover,
                width: double.infinity,
                placeholder: (context, url) => const Icon(Icons.restaurant, size: 50),
                errorWidget: (context, url, error) => const Icon(Icons.error, size: 50),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(food.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text('${food.price.toStringAsFixed(0)}đ', style: const TextStyle(color: Colors.orange, fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => cart.addToCart(food),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.orange),
                    child: const Text('Thêm vào giỏ'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
