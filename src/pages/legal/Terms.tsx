import { motion } from "framer-motion"

export function Terms() {
    return (
        <div className="pt-24 pb-16 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm"
                >
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-8">Terms of Service</h1>

                    <div className="prose prose-rose max-w-none text-gray-600">
                        <p className="lead">
                            Overview
                        </p>
                        <p>
                            This website is operated by Velvet & Vine. Throughout the site, the terms "we", "us" and "our" refer to Velvet & Vine. Velvet & Vine offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
                        </p>

                        <h3>1. Online Store Terms</h3>
                        <p>
                            By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose.
                        </p>

                        <h3>2. General Conditions</h3>
                        <p>
                            We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.
                        </p>

                        <h3>3. Products or Services</h3>
                        <p>
                            Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
                        </p>

                        <h3>4. Accuracy of Billing and Account Information</h3>
                        <p>
                            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.
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
