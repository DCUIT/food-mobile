import 'food.dart';

class CartItem {
  final Food food;
  int quantity;

  CartItem({
    required this.food,
    required this.quantity,
  });

  double get totalPrice => food.price * quantity;

  void increment() => quantity++;
  void decrement() => quantity > 0 ? quantity-- : 0;
}
