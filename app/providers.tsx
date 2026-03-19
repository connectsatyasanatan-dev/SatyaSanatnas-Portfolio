'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
    // We create the QueryClient inside state to prevent it from being shared across users on SSR
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        refetchOnWindowFocus: false, // Don't refetch automatically
                        retry: 1, // Only retry failed requests once
                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* The devtools only are included in development build
            <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    )
}
