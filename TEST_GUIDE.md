# TEST GUIDE - FOOD APP

## 1. Setup
```
backend/run.bat   # Backend API http://localhost:5000
adb reverse tcp:5000 tcp:5000   # Emulator network
flutter run      # App
```

## 2. User Flow
1. **Login** `admin/123` ✅
2. **Home** → Add Phở/Bún qty 2 ✅
3. **Cart** → Tăng/giảm qty, Xóa → **Thanh toán COD** ✅
4. **Menu** → Xem order history ✅
5. **Logout** ✅

## 3. Admin Flow
1. **Admin tab** → Add food 'Bánh mì' 25k ✅
2. **Update/Cancel order** ✅
3. **Stats** (foods/orders/revenue) ✅

## 4. Register new user
Login → Register → New account → Order ✅

## 5. Edge cases
- Empty cart → Checkout
- No internet → Offline error
- Invalid login → Toast error

**ALL PASS ✅** App production ready!
