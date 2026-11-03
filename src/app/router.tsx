import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { ROUTES } from '@/constants/routes'
import CartPage from '@/pages/cart/CartPage'
import RouteErrorPage from '@/pages/error/RouteErrorPage'
import HomePage from '@/pages/home/HomePage'
import NotFoundPage from '@/pages/not-found/NotFoundPage'
import ProductPage from '@/pages/product/ProductPage'
import ShopPage from '@/pages/shop/ShopPage'
import SupportPage from '@/pages/support/SupportPage'
import TradePage from '@/pages/trade/TradePage'
import WishlistPage from '@/pages/wishlist/WishlistPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        // Pathless: a page that crashes shows the error page inside the layout, and unknown URLs the 404.
        errorElement: <RouteErrorPage />,
        children: [
          { path: ROUTES.home, element: <HomePage /> },
          { path: ROUTES.shop, element: <ShopPage /> },
          { path: ROUTES.product, element: <ProductPage /> },
          { path: ROUTES.trade, element: <TradePage /> },
          { path: ROUTES.wishlist, element: <WishlistPage /> },
          { path: ROUTES.cart, element: <CartPage /> },
          { path: ROUTES.support, element: <SupportPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
