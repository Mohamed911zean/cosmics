import { motion } from "framer-motion"
import { ArrowLeft, Home } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center max-w-lg mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-9xl font-serif font-bold text-rose-100"
                >
                    404
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative -mt-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                    <p className="text-gray-600 mb-8">
                        Oops! The page you are looking for seems to have wandered off.
                        It might have been moved or deleted.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/">
                            <Button className="h-12 w-full sm:w-auto px-8 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white border-0">
                                <Home className="w-5 h-5 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="h-12 w-full sm:w-auto px-8 rounded-full border border-gray-300 hover:bg-gray-100 font-medium flex items-center justify-center transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Go Back
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
