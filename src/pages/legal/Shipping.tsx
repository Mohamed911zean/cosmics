import { motion } from "framer-motion"
import { useProductStore } from "@/stores"

export function Shipping() {
    const { brand } = useProductStore()
    const brandName = brand?.name || "Majestics"

    return (
        <div className="pt-24 pb-16 min-h-screen bg-ivory">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface rounded-3xl p-8 sm:p-12 shadow-sm border border-border"
                >
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-8">Shipping Policy</h1>

                    <div className="prose prose-rose max-w-none text-muted-foreground">
                        <h3 className="text-foreground font-serif">Nationwide Delivery</h3>
                        <p>
                            We are proud to offer nationwide delivery to every governorate in Egypt. From the heart of Cairo to the furthest corners of Upper Egypt, we ensure your beauty essentials reach you safely. Facilitating the delivery of top skincare brands across Egypt is our mission.
                        </p>

                        <h3 className="text-foreground font-serif">Estimated Delivery Times</h3>
                        <p>
                            Delivery times vary by your location in Egypt. These are our estimates:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Cairo & Giza: 1-2 Business days</li>
                            <li>Alexandria & Delta (including Mansoura): 2-3 Business days</li>
                            <li>Canal Cities & Red Sea: 3-4 Business days</li>
                            <li>Upper Egypt: 4-5 Business days</li>
                        </ul>


                        <h3 className="text-foreground font-serif">Tracking Information</h3>
                        <p>
                            You will receive an email with a tracking number once your order is shipped but sometimes due to free shipping tracking is not available.
                        </p>

                        <h3 className="text-foreground font-serif">Lost/Missing Packages</h3>
                        <p>
                            {brandName} is not liable if the incorrect address is placed during the checkout process. Please make sure that your billing and shipping address is correct before processing your order.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
