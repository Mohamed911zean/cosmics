import { motion } from "framer-motion"

export function Shipping() {
    return (
        <div className="pt-24 pb-16 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm"
                >
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-8">Shipping Policy</h1>

                    <div className="prose prose-rose max-w-none text-gray-600">
                        <h3>Shipping Overview</h3>
                        <p>
                            We are proud to offer international shipping to over 200 countries. However, there are some locations we are unable to ship to. If you happen to be from one of those countries we will contact you.
                        </p>

                        <h3>Shipping Times</h3>
                        <p>
                            Shipping time varies by location. These are our estimates:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>United States: 3-5 Business days</li>
                            <li>Canada, Europe: 6-10 Business days</li>
                            <li>Australia, New Zealand: 12-14 Business days</li>
                            <li>Mexico, Central America, South America: 15-20 Business days</li>
                        </ul>

                        <h3>Tracking Information</h3>
                        <p>
                            You will receive an email with a tracking number once your order is shipped but sometimes due to free shipping tracking is not available.
                        </p>

                        <h3>Lost/Missing Packages</h3>
                        <p>
                            Velvet & Vine is not liable if the incorrect address is placed during the checkout process. Please make sure that your billing and shipping address is correct before processing your order.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
