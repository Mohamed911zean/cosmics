import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useProductStore } from "@/stores"

const faqData = [
    {
        question: "Are the products organic?",
        answer: "Many of the brands we feature prioritize pure, botanical, and organic ingredients. Every formula is dermatologically tested by its respective brand for safety and efficacy without synthetic fragrances or parabens."
    },
    {
        question: "What is the best order to use my skincare products?",
        answer: "Generally, we recommend following the original brand's instructions. Usually, products are applied from thinnest to thickest consistency: Cleanser > Serum > Moisturizer > Sunscreen (Daytime)."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay."
    },
    {
        question: "How long does delivery take?",
        answer: "Delivery typically takes 1-2 business days for Cairo and Giza, and 2-5 business days for other governorates across Egypt."
    },
    {
        question: "Do you offer returns?",
        answer: "Yes! We offer a 30-day hassle-free return policy. If you're not completely satisfied with your purchase, you can return the product for a full refund or exchange."
    },
    {
        question: "Are the products cruelty-free?",
        answer: "Absolutely. We curate brands that are proud to be 100% cruelty-free and vegan. We verify that all our suppliers adhere to these strict standards."
    }
]

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const { brand } = useProductStore()
    const brandName = brand?.name || "Majestic"

    return (
        <div className="pt-24 pb-16 min-h-screen bg-ivory">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-600 font-medium">
                        Have questions about your {brandName} ritual? We're here to help.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-border space-y-4"
                >
                    {faqData.map((item, index) => (
                        <div key={index} className="border-b border-rose-50 last:border-0 pb-4 last:pb-0">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="flex items-center justify-between w-full text-left py-4 focus:outline-none group"
                            >
                                <span className="text-lg font-serif font-medium text-gray-900 group-hover:text-accent transition-colors">
                                    {item.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? "rotate-180" : "group-hover:text-accent"}`}
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
                                        <p className="text-gray-600 pb-4 leading-relaxed font-sans">
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
