import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircleAvatar(
            radius: 60,
            backgroundColor: Colors.orange,
            child: Icon(Icons.person, size: 80, color: Colors.white),
          ),
          SizedBox(height: 24),
          Text('Profile', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          SizedBox(height: 8),
          Text('admin', style: TextStyle(fontSize: 18, color: Colors.grey)),
        ],
      ),
    );
  }
}

