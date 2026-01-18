import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/authContext"
import { toast } from "sonner"
import { useEffect } from "react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const location = useLocation()

    useEffect(() => {
        if (!loading && !user) {
            toast.error("Please log in to continue", {
                description: "You need an account to complete your purchase."
            })
        }
    }, [user, loading])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
            </div>
        )
    }

    if (!user) {
        // Redirect to login but save the attempted url
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <>{children}</>
}
