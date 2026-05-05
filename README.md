# Hương Vị Việt - Flutter Food App 🍜✨

![Screenshot Home](assets/screenshots/home.png)
![Screenshot Cart](assets/screenshots/cart.png)
![Screenshot Admin](assets/screenshots/admin.png)

## 🚀 Features
✅ **User**: Browse menu → Cart → COD/Bank/E-wallet → Order history  
✅ **Admin**: CRUD foods, order management, stats  
✅ **Search** real-time, **Favorites** ❤️  
✅ **Auth** JWT + auto-login  
✅ **Dark mode**, responsive UI  

## 🛠 Tech Stack
```
Flutter • Provider • Dio • SharedPreferences
Flask API • SQLite • JWT
Material Design • go_router
```

## 📱 Quick Setup

### Backend (Flask)
```bash
cd "D:\Code\food-fullstack\backend"
python init_db.py
python app.py  # http://localhost:5000
```

**Demo accounts:**
| Username | Password | Role |
|----------|----------|------|
| admin    | 123      | Admin|

### Frontend (Flutter)
```bash
cd "d:/Flutter Projects/food_app"
flutter pub get
flutter run  # Android/iOS/Web
```

## 🧪 API Endpoints
| Method | Endpoint | Auth |
|--------|----------|------|
| GET    | /foods   | No   |
| POST   | /login   | No   |
| POST   | /order   | JWT  |

## 📁 Project Structure
```
lib/
├── providers/   # State management
├── screens/     # Feature screens
├── services/    # API + utils
└── constants/   # Colors/theme/API
```

## 🎯 Roadmap
- Push notifications
- Real payment (Momo/VNPay)
- Location services

---

**Made with ❤️ for Vietnamese food lovers! 🇻🇳**
