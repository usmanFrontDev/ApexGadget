import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { CART_DEMO_PARAM } from '@/constants/cart'
import { cartKeys } from '@/constants/queryKeys'
import { USE_MOCK_DATA } from '@/lib/env'
import { useCartStore } from '@/store/useCartStore'

/**
 * DEV ONLY: `/cart?demo=cart` fills the mock cart with the design scenario (two phones, one sold, code APEX10).
 * The `import.meta.env.DEV` guard makes the bundler drop the seed module from production builds.
 */
export function useDemoCartSeed() {
  const queryClient = useQueryClient()
  const [params, setParams] = useSearchParams()
  const wanted = params.get(CART_DEMO_PARAM.key) === CART_DEMO_PARAM.value

  useEffect(() => {
    if (!import.meta.env.DEV || !USE_MOCK_DATA || !wanted) return
    let cancelled = false
    void import('@/services/mock/cartDemo').then(({ seedDemoCart }) => {
      if (cancelled) return
      useCartStore.getState().setCartId(seedDemoCart())
      void queryClient.invalidateQueries({ queryKey: cartKeys.all })
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          next.delete(CART_DEMO_PARAM.key)
          return next
        },
        { replace: true },
      )
    })
    return () => {
      cancelled = true
    }
  }, [wanted, queryClient, setParams])
}
