import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { useAuthStore } from '@/stores/auth-store'
import http from '@/lib/http'
import { useEffect } from 'react'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  beforeLoad: () => {
    const whiteList = ['/sign-in', '/sign-up']
    if (!whiteList.includes(location.pathname) && !useAuthStore.getState().auth.accessToken) {
      http.get('/user/auth')
    }
  },
  component: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const whiteList = ['/sign-in', '/sign-up']
      if (!whiteList.includes(location.pathname)) {
        http.get('/user/auth')
      }
    }, [])

    return (
      <>
        <NavigationProgress />
        <Outlet />
        <Toaster duration={5000} />
        {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
