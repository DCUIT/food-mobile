# 🌶️ Hương Vị Việt - Food Delivery App

![Screenshot](assets/images/screenshot-home.png)
![Screenshot](assets/images/screenshot-cart.png)

## ✨ **Features**
- 📱 **Responsive UI** (Mobile/Tablet)
- 👨‍🍳 **Full Food Menu** (Grid + Search + Detail)
- 🛒 **Shopping Cart** (+/- Qty + COD/Bank payment)
- ❤️ **Favorites** (Persist local)
- 📋 **Order History**
- 👑 **Admin Panel** (CRUD foods/orders)
- 🔐 **Auth** (Login/Register/JWT)
- 🌙 **Dark Mode Ready**

## 🛠️ **Tech Stack**
```
Frontend: Flutter • Provider • go_router • Dio
Backend: Flask (Python) • SQLite • JWT
Storage: shared_preferences
Colors: Custom Design System
```

## 🚀 **Quick Start**

### 1️⃣ Backend
```bash
cd backend
pip install -r requirements.txt
python init_db.py  # Admin: admin/123 + demo foods
python app.py      # http://localhost:5000
```

### 2️⃣ Frontend
```bash
flutter pub get
flutter run
```
*Chọn Android Emulator/Chrome*

### 3️⃣ Demo Flow
```
Login → Home (Search "phở") → Detail → Cart → Thanh toán
→ Favorite ❤️ → Admin → Orders
```

## 📱 **Screenshots**
| Home | Cart | Admin |
|------|------|-------|
| ![Home](assets/images/screenshot-home.png) | ![Cart](assets/images/screenshot-cart.png) | ![Admin](assets/images/screenshot-admin.png) |

## 🔧 **Troubleshooting**
```
flutter clean && flutter pub get
Backend CORS OK (*)
Emulator: http://10.0.2.2:5000
```

## 📂 **Structure**
```
lib/
├── constants/     # Colors/API/Theme
├── models/        # Food/Cart/Order
├── providers/     # State mgmt
├── screens/       # UI Pages
├── services/      # Dio API
└── widgets/       # Reusable
backend/           # Flask API
```

**Made with ❤️ for Vietnamese food lovers!**

⭐ Star nếu hữu ích!

