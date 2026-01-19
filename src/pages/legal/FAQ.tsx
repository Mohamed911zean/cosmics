import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqData = [
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay."
    },
    {
        question: "How long does shipping take?",
        answer: "Standard shipping within the US typically takes 3-5 business days. International shipping estimates vary from 6-20 business days depending on location."
    },
    {
        question: "Do you offer returns?",
        answer: "Yes! We offer a 30-day hassle-free return policy. If you're not completely satisfied with your purchase, you can return it for a full refund or exchange."
    },
    {
        question: "Are your products cruelty-free?",
        answer: "Absolutely. We are proud to be 100% cruelty-free and vegan. We verify that all of our suppliers adhere to these strict standards."
    },
    {
        question: "Can I change my order after placing it?",
        answer: "We process orders quickly, but if you contact us within 1 hour of placing your order, we can usually make changes. Please contact our support team immediately."
    }
]

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <div className="pt-24 pb-16 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-600">
                        Have questions? We're here to help.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm space-y-4"
                >
                    {faqData.map((item, index) => (
                        <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="flex items-center justify-between w-full text-left py-4 focus:outline-none group"
                            >
                                <span className="text-lg font-medium text-gray-900 group-hover:text-rose-500 transition-colors">
                                    {item.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                                />
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-gray-600 pb-4 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
