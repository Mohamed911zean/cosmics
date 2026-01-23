// src/components/guards/AdminRoute.tsx
import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'

export function AdminRoute() {
    const { user, role, isLoading } = useAuthStore()

    console.log('AdminRoute - user:', !!user, 'role:', role, 'isLoading:', isLoading)

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (role !== 'admin' && role !== 'superadmin') {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}