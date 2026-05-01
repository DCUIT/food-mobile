# Kế hoạch chuyển đổi React Web → React Native

## 📋 Tổng quan

Dự án hiện tại có đầy đủ chức năng:
- ✅ Backend Flask với JWT authentication
- ✅ API cho foods, orders, admin, stats
- ✅ Hệ thống đặt hàng và thanh toán
- ✅ Trang quản lý Admin

## 🔄 THAY ĐỔI CẦN THIẾT

### 1. Navigation (React Navigation)
| React Web | React Native |
|-----------|--------------|
| `react-router-dom` | `@react-navigation/native` |
| `<Routes>`, `<Route>` | `createNativeStackNavigator` |
| `<Link>` | `navigation.navigate()` |
| `useNavigate()` | `useNavigation()` |

### 2. Components Mapping
| React Web | React Native |
|-----------|--------------|
| `<div>` | `<View>` |
| `<span>`, `<p>` | `<Text>` |
| `<button>` | `<TouchableOpacity>` |
| `<img>` | `<Image>` |
| `<input>` | `<TextInput>` |
| className=... | StyleSheet.create() |

### 3. Storage
| React Web | React Native |
|-----------|--------------|
| `localStorage` | `@react-native-async-storage/async-storage` |

### 4. State Management
| React Web | React Native |
|-----------|--------------|
| window.dispatchEvent | EventListener với NativeEventEmitter |

---

## 📦 CẤU TRÚC MỚI (React Native)

```
mobile/
├── App.tsx                 # Root với Navigation
├── src/
│   ├── api/
│   │   └── api.ts         # Axios configuration
│   ├── components/
│   │   ├── FoodCard.tsx  # Card hiển thị món ăn
│   │   ├── NavBar.tsx    # Thanh điều hướng
│   │   ├── Banner.tsx    # Banner quảng cáo
│   │   ├── Toast.tsx     # Thông báo popup
│   │   └── Loading.tsx   # Loading spinner
│   ├── screens/
│   │   ├── HomeScreen.tsx    # Trang chủ
│   │   ├── MenuScreen.tsx   # Danh sách món
│   │   ├── LoginScreen.tsx  # Đăng nhập/đăng ký
│   │   ├── CartScreen.tsx   # Giỏ hàng
│   │   ├── PaymentScreen.tsx # Thanh toán
│   │   ├── SuccessScreen.tsx  # Thành công
│   │   └── AdminScreen.tsx  # Admin dashboard
│   ├── navigation/
│   │   └── AppNavigator.tsx # Cấu hình navigation
│   ├── utils/
│   │   ├── cart.ts       # Cart management (AsyncStorage)
│   │   ├── format.ts     # Format giá tiền
│   │   └── parseOrder.ts # Parse đơn hàng
│   └── theme/
│       └── colors.ts     # Màu sắc theme
```

---

## 🎯 CÁC BƯỚC THỰC HIỆN

### Bước 1: Thiết lập dự án React Native
- [ ] Cài đặt Expo CLI
- [ ] Tạo dự án mobile/
- [ ] Cài đặt dependencies (navigation, async-storage, axios)

### Bước 2: Di chuyển API Layer
- [ ] Sao chép api.ts với axios configuration
- [ ] Điều chỉnh baseURL cho mobile

### Bước 3: Di chuyển Utilities
- [ ] cart.ts: Thay localStorage → AsyncStorage
- [ ] format.ts: Format tiền tệ
- [ ] parseOrder.ts: Parse items từ JSON

### Bước 4: Tạo Navigation
- [ ] Cấu hình Stack Navigator
- [ ] Định nghĩa các screens
- [ ] Cấu hình routes

### Bước 5: Di chuyển Screens (từng cái)
- [ ] HomeScreen: Danh sách món ăn + category
- [ ] LoginScreen: Đăng nhập/đăng ký
- [ ] CartScreen: Xem/sửa giỏ hàng
- [ ] PaymentScreen: Chọn phương thức thanh toán
- [ ] SuccessScreen: Xác nhận đặt hàng
- [ ] AdminScreen: Quản lý món ăn, đơn hàng, thống kê

### Bước 6: Di chuyển Components
- [ ] FoodCard: Card hiển thị món
- [ ] NavBar: Thanh điều hướng
- [ ] Toast: Thông báo
- [ ] Loading: Loading spinner

### Bước 7: Testing
- [ ] Test navigation
- [ ] Test API calls
- [ ] Test cart functionality
- [ ] Test order flow

---

## 🔗 GIỮ NGUYÊN (Không thay đổi)

✅ **Backend Flask** - Giữ nguyên `backend/app.py`
✅ **API Endpoints** - Giữ nguyên tất cả routes
✅ **JWT Authentication** - Giữ nguyên logic
✅ **Database SQLite** - Giữ nguyên database.db
✅ **Order System** - Giữ nguyên flow đặt hàng
✅ **Admin Logic** - Giữ nguyên quản lý
✅ **Payment Flow** - Giữ nguyên thanh toán

---

## ⚠️ LƯU Ý

1. **Backend phải chạy**: `python backend/app.py` (port 5000)
2. **CORS**: Đã enable trong Flask (`CORS(app)`)
3. **URL**: Sử dụng `http://127.0.0.1:5000` hoặc địa chỉ IP thực cho mobile
4. **Expo**: Khuyên dùng Expo để test nhanh trên device

---

## 🚀 BẮT ĐẦU

Sau khi xác nhận kế hoạch, tiến hành thực hiện từng bước.
