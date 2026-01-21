import { motion } from "framer-motion"
import { useProductStore } from "@/stores"

export function Privacy() {
    const { brand } = useProductStore()
    const brandName = brand?.name || "Majestics"

    return (
        <div className="pt-24 pb-16 min-h-screen bg-ivory">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-border"
                >
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-8">Privacy Policy</h1>

                    <div className="prose prose-rose max-w-none text-gray-600">
                        <p className="lead">
                            At {brandName}, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our store.
                        </p>

                        <h3 className="text-foreground font-serif">1. Personal Information We Collect</h3>
                        <p>
                            When you visit the {brandName} site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
                        </p>

                        <h3 className="text-foreground font-serif">2. How We Use Your Personal Information</h3>
                        <p>
                            We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). This helps us facilitate the delivery of your curated skincare products directly to you.
                        </p>

                        <h3 className="text-foreground font-serif">3. Sharing Your Personal Information</h3>
                        <p>
                            We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Google Analytics to help us understand how our customers use the Site.
                        </p>

                        <h3 className="text-foreground font-serif">4. Data Retention</h3>
                        <p>
                            When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
                        </p>

                        <h3 className="text-foreground font-serif">5. Changes</h3>
                        <p>
                            We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.
                        </p>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <p className="text-sm text-gray-400">Last updated: January 2026</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
