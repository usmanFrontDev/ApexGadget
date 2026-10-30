import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { ROUTES } from '@/constants/routes'
import CartPage from '@/pages/cart/CartPage'
import HomePage from '@/pages/home/HomePage'
import ProductPage from '@/pages/product/ProductPage'
import ShopPage from '@/pages/shop/ShopPage'
import SupportPage from '@/pages/support/SupportPage'
import TradePage from '@/pages/trade/TradePage'
import WishlistPage from '@/pages/wishlist/WishlistPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.shop, element: <ShopPage /> },
      { path: ROUTES.product, element: <ProductPage /> },
      { path: ROUTES.trade, element: <TradePage /> },
      { path: ROUTES.wishlist, element: <WishlistPage /> },
      { path: ROUTES.cart, element: <CartPage /> },
      { path: ROUTES.support, element: <SupportPage /> },
    ],
  },
])
