# TODO - Reorganize Mobile App Structure

## Current Structure:
```
mobile/
├── App.tsx
├── src/
│   ├── api/api.ts
│   ├── screens/ (6 screens)
│   └── utils/ (3 utils)
```

## Target Structure:
```
food-mobile/
├── src/
│   ├── navigation/
│   ├── screens/ (auth, home, cart, orders, profile, admin)
│   ├── components/
│   ├── services/
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   └── styles/
```

## Steps:

### Phase 1: Create Directory Structure
- [ ] Create `src/navigation/` folder
- [ ] Create `src/screens/auth/` folder
- [ ] Create `src/screens/home/` folder
- [ ] Create `src/screens/cart/` folder
- [ ] Create `src/screens/orders/` folder
- [ ] Create `src/screens/admin/` folder
- [ ] Create `src/components/common/` folder
- [ ] Create `src/components/food/` folder
- [ ] Create `src/components/cart/` folder
- [ ] Create `src/components/order/` folder
- [ ] Create `src/components/ui/` folder
- [ ] Create `src/services/` folder
- [ ] Create `src/context/` folder
- [ ] Create `src/hooks/` folder
- [ ] Create `src/utils/` folder
- [ ] Create `src/styles/` folder

### Phase 2: Move/Refactor Screens
- [ ] Move HomeScreen to `src/screens/home/HomeScreen.tsx`
- [ ] Move LoginScreen to `src/screens/auth/LoginScreen.tsx`
- [ ] Move CartScreen to `src/screens/cart/CartScreen.tsx`
- [ ] Move PaymentScreen to `src/screens/cart/PaymentScreen.tsx`
- [ ] Move SuccessScreen to `src/screens/cart/SuccessScreen.tsx`
- [ ] Move MenuScreen to `src/screens/orders/MyOrdersScreen.tsx`

### Phase 3: Create Services
- [ ] Move api.ts to `src/services/api.ts`
- [ ] Create `src/services/authService.ts`
- [ ] Create `src/services/foodService.ts`
- [ ] Create `src/services/orderService.ts`

### Phase 4: Move Utilities
- [ ] Move format.ts to `src/utils/format.ts`
- [ ] Move cart.ts to `src/utils/cart.ts`
- [ ] Move parseOrder.ts to `src/utils/parseOrder.ts`
- [ ] Create `src/utils/constants.ts`
- [ ] Create `src/utils/storage.ts`

### Phase 5: Create Contexts
- [ ] Create `src/context/AuthContext.tsx`
- [ ] Create `src/context/CartContext.tsx`
- [ ] Create `src/context/ThemeContext.tsx`

### Phase 6: Create Hooks
- [ ] Create `src/hooks/useAuth.ts`
- [ ] Create `src/hooks/useCart.ts`
- [ ] Create `src/hooks/useOrders.ts`

### Phase 7: Create Styles
- [ ] Create `src/styles/colors.ts`
- [ ] Create `src/styles/theme.ts`
- [ ] Create `src/styles/globalStyles.ts`

### Phase 8: Create Navigation
- [ ] Create `src/navigation/AppNavigator.tsx`
- [ ] Create `src/navigation/AuthNavigator.tsx`
- [ ] Create `src/navigation/BottomTabs.tsx`

### Phase 9: Create Components
- [ ] Create common components (Loader, Toast, EmptyState, ConfirmModal)
- [ ] Create food components (FoodCard, FoodList, CategoryTabs)
- [ ] Create cart components (CartItem, CartSummary, QuantityButton)
- [ ] Create order components (OrderCard, OrderStatusBadge, OrderTimeline)
- [ ] Create ui components (CustomButton, InputField, Header, ScreenWrapper)

### Phase 10: Update Root App
- [ ] Update `App.tsx` to use new structure
- [ ] Clean up old files
