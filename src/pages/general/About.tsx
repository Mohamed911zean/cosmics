import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, Leaf, ShieldCheck, Heart, Sparkles } from "lucide-react"
import { useProductStore } from "@/stores"

export default function About() {
    const { brand } = useProductStore()
    const brandName = brand?.name || "Majestic"

    return (
        <main className="bg-ivory text-foreground font-sans selection:bg-accent selection:text-foreground">

            {/* HERO SECTION */}
            <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-20">
                <div className="absolute inset-0 z-0 opacity-60">
                    <img
                        src="https://e-majestic.com/cdn/shop/files/WhatsApp_Image_2025-11-09_at_1.11.14_PM_1.jpg?v=1767270855&width=900"
                        alt="Our Story Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-ivory/20 via-ivory/40 to-ivory" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="max-w-3xl mx-auto"
                    >
                        <span className="inline-block text-taupe tracking-widest uppercase text-xs mb-4 font-semibold">
                            Our Mission in Egypt
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight mb-8">
                            Egypt's Destination for <br />
                            <span className="italic text-taupe font-light">Original Beauty</span>
                        </h1>
                        <p className="text-xl text-taupe leading-relaxed">
                            {brandName} is the premier curated marketplace in Egypt, dedicated to delivering 100% original skincare and beauty products from global brands to every doorstep across the nation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* OUR PHILOSOPHY */}
            <section className="py-24 bg-surface">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">Serving the Egyptian Community</h2>
                            <p className="text-lg text-taupe mb-8 leading-relaxed font-bold">
                                Important Notice: Majestics is an Egyptian reseller marketplace. We bring authentic global brands directly to Egypt, ensuring quality and trust.
                            </p>
                            <p className="text-lg text-taupe mb-8 leading-relaxed">
                                We specialize in sourcing original skincare and body care products from world-renowned brands, making them accessible to beauty enthusiasts across Egypt. Our platform bridge the gap between international excellence and the Egyptian market.
                            </p>
                            <p className="text-lg text-taupe mb-10 leading-relaxed">
                                Based in Mansoura and delivering nationwide, we prioritize authenticity above all else. Every item on our marketplace is verified and handled with the utmost care, ensuring that Egyptian customers receive exactly what they expect from their favorite global brands.
                            </p>


                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                                <img
                                    src="https://e-majestic.com/cdn/shop/files/ss_cica.png?v=1754243318&width=900"
                                    alt="Our Philosophy"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CORE VALUES */}
            <section className="py-24 bg-ivory">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Core Pillars</h2>
                        <p className="text-taupe">The values that make {brandName} Egypt's most trusted beauty marketplace.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-12">
                        {[
                            { icon: Leaf, title: "100% Original", desc: "We guarantee that every product is an authentic item sourced for the Egyptian market." },
                            { icon: ShieldCheck, title: "Egyptian Delivery", desc: "Efficient nationwide shipping, delivering directly to your door anywhere in Egypt." },
                            { icon: Heart, title: "Local Trust", desc: "Built by and for the Egyptian community, focusing on reliability and customer care." },
                            { icon: Sparkles, title: "Global Access", desc: "Bringing the best of world-renowned beauty brands to the heart of Egypt." }
                        ].map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-center group"
                            >
                                <div className="w-16 h-16 rounded-full bg-surface mb-6 mx-auto flex items-center justify-center text-accent shadow-sm group-hover:scale-110 transition-transform duration-500">
                                    <value.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-serif mb-3">{value.title}</h3>
                                <p className="text-sm text-taupe leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COMMITMENT SECTION */}
            <section className="py-32 bg-surface overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative p-12 md:p-20"
                        >
                            <div className="absolute inset-0 border border-border/50 rounded-[3rem]" />
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-surface px-6">
                                <Sparkles className="w-8 h-8 text-accent" />
                            </div>

                            <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight italic">
                                "Our commitment is to bring the world's finest beauty brands to every home in Egypt with complete transparency and trust."
                            </h2>
                            <p className="text-taupe uppercase tracking-[0.3em] text-xs font-bold">— The {brandName} Egyptian Team</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 bg-foreground text-ivory">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-serif mb-8 text-primary-foreground">Start Your Own <br /> <span className="italic font-light">Skin Ritual</span></h2>
                        <p className="text-white-creamy max-w-lg mx-auto mb-10 text-lg">
                            Experience the harmony of nature and science. Discover the collection that’s designed for you.
                        </p>
                        <Link to="/shop">
                            <button className="px-12 py-5 bg-ivory text-white-soft rounded-full hover:bg-accent transition-colors duration-300 flex items-center gap-2 group mx-auto font-bold shadow-xl">
                                Shop The Collection
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>

        </main>
    )
}
