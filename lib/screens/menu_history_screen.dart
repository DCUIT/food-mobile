import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/order_provider.dart';
import '../providers/auth_provider.dart';
import '../models/order.dart';

class MenuHistoryScreen extends StatelessWidget {
  const MenuHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Lịch sử đơn hàng')),
      body: Consumer2<OrderProvider, AuthProvider>(
        builder: (context, orderProvider, auth, child) {
          return RefreshIndicator(
            onRefresh: () async => orderProvider.loadOrders(context),
            child: orderProvider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : orderProvider.orders.isEmpty
                    ? const Center(child: Text('Chưa có đơn hàng nào'))
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: orderProvider.orders.length,
                        itemBuilder: (context, index) {
                          final order = orderProvider.orders[index];
                          return Card(
                            child: ListTile(
                              title: Text('Đơn #${order.id}'),
                              subtitle: Text('Trạng thái: ${order.status.toUpperCase()}\nKhách: ${order.user}'),
                              trailing: const Icon(Icons.arrow_forward_ios),
                              onTap: () => _showOrderDetail(context, order),
                            ),
                          );
                        },
                      ),
          );
        },
      ),
    );
  }

  void _showOrderDetail(BuildContext context, Order order) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Chi tiết đơn #${order.id}'),
        content: SingleChildScrollView(
          child: Text('Trạng thái: ${order.status}\nKhách hàng: ${order.user}\nMón ăn: ${order.items}'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Đóng')),
        ],
      ),
    );
  }
}
