// src/components/guards/PrivateRoute.tsx
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from 'sonner'

export function PrivateRoute() {
    const { user, isLoading } = useAuthStore()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && !user) {
            toast.error("Please log in to continue")
            navigate('/login', { state: { from: location }, replace: true })
        }
    }, [user, isLoading, navigate, location])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) return null

    return <Outlet />
}