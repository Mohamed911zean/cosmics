import { motion } from "framer-motion"
import { useProductStore } from "@/stores"

export function Terms() {
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
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-8">Terms of Service</h1>

                    <div className="prose prose-rose max-w-none text-muted-foreground">
                        <p className="lead">
                            Overview
                        </p>
                        <p>
                            This website is operated by {brandName}. Throughout the site, the terms "we", "us" and "our" refer to {brandName}. {brandName} offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
                        </p>

                        <h3 className="text-foreground font-serif">1. Online Store Terms</h3>
                        <p>
                            By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use the products purchased through our marketplace for any illegal or unauthorized purpose.
                        </p>

                        <h3 className="text-foreground font-serif">2. General Conditions</h3>
                        <p>
                            We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.
                        </p>

                        <h3 className="text-foreground font-serif">3. Products or Services</h3>
                        <p>
                            Certain skincare and body care products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
                        </p>

                        <h3 className="text-foreground font-serif">4. Accuracy of Billing and Account Information</h3>
                        <p>
                            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.
                        </p>

                        <div className="mt-8 pt-8 border-t border-border">
                            <p className="text-sm text-muted-foreground">Last updated: January 2026</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
