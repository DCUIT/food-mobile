import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<CartProvider>(
      builder: (context, cart, child) {
        return Scaffold(
          appBar: AppBar(title: const Text('Giỏ hàng')),
          body: cart.cart.isEmpty
              ? const Center(child: Text('Giỏ hàng trống'))
              : Column(
                  children: [
                    Expanded(
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: cart.cart.length,
                        itemBuilder: (context, index) {
                          final item = cart.cart[index];
                          return Card(
                            child: ListTile(
                              leading: CircleAvatar(child: Text('${item.food.id}')),
                              title: Text(item.food.name),
                              subtitle: Text('${item.food.price.toStringAsFixed(0)}đ x ${item.quantity}'),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  IconButton(
                                    onPressed: () => cart.updateQuantity(item, item.quantity - 1),
                                    icon: const Icon(Icons.remove),
                                  ),
                                  Text('${item.quantity}'),
                                  IconButton(
                                    onPressed: () => cart.updateQuantity(item, item.quantity + 1),
                                    icon: const Icon(Icons.add),
                                  ),
                                  IconButton(
                                    onPressed: () => cart.removeFromCart(item),
                                    icon: const Icon(Icons.delete, color: Colors.red),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: Colors.grey[100], boxShadow: [
                        BoxShadow(blurRadius: 4, color: Colors.grey.shade300, offset: const Offset(0, -2))
                      ]),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Tổng tiền:', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                              Text('${cart.totalAmount.toStringAsFixed(0)}đ', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.orange)),
                            ],
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                              onPressed: () => _showPaymentDialog(context, cart),
                              style: ElevatedButton.styleFrom(backgroundColor: Colors.orange),
                              child: const Text('Thanh toán', style: TextStyle(fontSize: 18)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
        );
      },
    );
  }

  void _showPaymentDialog(BuildContext context, CartProvider cart) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Chọn phương thức thanh toán'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.money, color: Colors.green),
              title: const Text('Thanh toán khi nhận hàng (COD)'),
              onTap: () => _placeOrder(context, cart, 'COD'),
            ),
            ListTile(
              leading: const Icon(Icons.account_balance, color: Colors.blue),
              title: const Text('Chuyển khoản ngân hàng'),
              onTap: () => _placeOrder(context, cart, 'Bank Transfer'),
            ),
            ListTile(
              leading: const Icon(Icons.wallet, color: Colors.purple),
              title: const Text('Ví điện tử'),
              onTap: () => _placeOrder(context, cart, 'E-wallet'),
            ),
          ],
        ),
      ),
    );
  }

    Future<void> _placeOrder(BuildContext context, CartProvider cart, String paymentMethod) async {
    Navigator.pop(context);
    final messenger = ScaffoldMessenger.of(context);
    try {
      await ApiService.createOrder(Provider.of<AuthProvider>(context, listen: false).token!, 
        cart.cart.map((item) => {
          'id': item.food.id,
          'name': item.food.name,
          'price': item.food.price,
          'quantity': item.quantity,
        }).toList()
      );
      if (!context.mounted) return;
      cart.clearCart();
      messenger.showSnackBar(
        const SnackBar(content: Text('Đặt hàng thành công!'), backgroundColor: Colors.green),
      );
    } catch (e) {
      if (!context.mounted) return;
      messenger.showSnackBar(
        SnackBar(content: Text('Lỗi đặt hàng: $e'), backgroundColor: Colors.red),
      );
    }
  }
}

