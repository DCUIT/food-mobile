class Order {
  final int id;
  final String items; // JSON string của cart
  final String status;
  final String user;

  Order({
    required this.id,
    required this.items,
    required this.status,
    required this.user,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      items: json['items'],
      status: json['status'],
      user: json['user'] ?? '',
    );
  }
}
