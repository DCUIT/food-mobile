import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/food.dart';
import '../providers/cart_provider.dart';
import '../widgets/food_card.dart';

class FoodDetailScreen extends StatelessWidget {
  final Food food;
  const FoodDetailScreen({super.key, required this.food});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(food.name),
        backgroundColor: Colors.orange,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Large image
            Hero(
              tag: 'food_${food.id}',
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Image.network(
                  food.image.isNotEmpty ? food.image : 'https://via.placeholder.com/400x250/FFA500/FFFFFF?text=${food.name}',
                  height: 250,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(height: 20),
            // Title & Price
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    food.name,
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                ),
                Text(
                  '${food.price.toStringAsFixed(0)}đ',
                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.orange),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text('Phở bò truyền thống, nước dùng ngọt thanh từ xương hầm 12 giờ...', style: TextStyle(fontSize: 16, color: Colors.grey)),
            const SizedBox(height: 24),
            // Quantity & Add to Cart
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          onPressed: () {},
                          icon: const Icon(Icons.remove, size: 20),
                        ),
                        const Text('1', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        IconButton(
                          onPressed: () {},
                          icon: const Icon(Icons.add, size: 20),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _addToCart(context),
                    icon: const Icon(Icons.add_shopping_cart),
                    label: const Text('Thêm vào giỏ'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            // Description
            const Text(
              'Mô tả',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            const Text(
              'Phở bò thượng hạng với nước dùng ninh từ xương bò tươi, thịt bò fillet mềm ngọt, bánh phở dai ngon. Ăn kèm rau thơm, chanh, ớt và tương ớt cay nồng. Món ăn đặc trưng của ẩm thực Việt Nam.',
              style: TextStyle(height: 1.5, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }

  void _addToCart(BuildContext context) {
    Provider.of<CartProvider>(context, listen: false).addToCart(food);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${food.name} đã thêm vào giỏ hàng!'),
        backgroundColor: Colors.green,
      ),
    );
    Navigator.pop(context);
  }
}

