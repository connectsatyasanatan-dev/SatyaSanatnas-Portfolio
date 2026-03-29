'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import portfolioAPI from '@/lib/api'

const AnalyticsTracker = () => {
    const pathname = usePathname()
    const sessionIdRef = useRef<string | null>(null)
    const startTimeRef = useRef<number>(Date.now())

    useEffect(() => {
        if (typeof window === 'undefined') return

        // 1. Visitor ID (persistent)
        let visitorId = localStorage.getItem('visitor_id')
        if (!visitorId) {
            visitorId = 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
            localStorage.setItem('visitor_id', visitorId)
        }

        // 2. Session ID (per page load/session)
        const sessionId = 's_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
        sessionIdRef.current = sessionId
        startTimeRef.current = Date.now()

        // 3. Gather data
        const ua = navigator.userAgent
        const deviceType = /Mobile|Android|iPhone/i.test(ua) ? 'mobile' : 
                          /Tablet|iPad/i.test(ua) ? 'tablet' : 'desktop'
        
        const getBrowser = () => {
            if (ua.includes('Chrome')) return 'Chrome'
            if (ua.includes('Firefox')) return 'Firefox'
            if (ua.includes('Safari')) return 'Safari'
            if (ua.includes('Edge')) return 'Edge'
            return 'Other'
        }

        const data = {
            visitorId,
            sessionId,
            deviceType,
            browser: getBrowser(),
            referrer: document.referrer || 'Direct',
            pagePath: pathname
        }

        // 4. Track Visit
        portfolioAPI.trackVisit(data)

        // 5. Track Duration (every 30 seconds)
        const interval = setInterval(() => {
            const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
            portfolioAPI.trackDuration({ sessionId, duration })
        }, 30000)

        // 6. Track on leave
        const handleBeforeUnload = () => {
            const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
            // Use fetch with keepalive: true (modern alternative to sendBeacon)
            const exitData = { sessionId, duration }
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
            fetch(`${apiUrl}/track-duration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(exitData),
                keepalive: true
            }).catch(() => {})
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            clearInterval(interval)
            window.removeEventListener('beforeunload', handleBeforeUnload)
            const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
            portfolioAPI.trackDuration({ sessionId, duration })
        }
    }, [pathname])

    return null
}

export default AnalyticsTracker
