import 'package:flutter/material.dart';

class AdminScreen extends StatelessWidget {
  const AdminScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Quản trị')),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.admin_panel_settings, size: 80, color: Colors.blue),
            SizedBox(height: 16),
            Text('Chức năng quản trị', style: TextStyle(fontSize: 20)),
            SizedBox(height: 8),
            Text('Quản lý món ăn, đơn hàng, thống kê (Coming soon...)'),
          ],
        ),
      ),
    );
  }
}
