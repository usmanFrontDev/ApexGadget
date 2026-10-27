import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { ROUTES } from '@/constants/routes'
import HomePage from '@/pages/home/HomePage'
import ShopPage from '@/pages/shop/ShopPage'
import SupportPage from '@/pages/support/SupportPage'
import TradePage from '@/pages/trade/TradePage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.shop, element: <ShopPage /> },
      { path: ROUTES.trade, element: <TradePage /> },
      { path: ROUTES.support, element: <SupportPage /> },
    ],
  },
])
