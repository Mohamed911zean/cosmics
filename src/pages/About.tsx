import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, Leaf, ShieldCheck, Heart, Sparkles } from "lucide-react"
export default function About() {
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
                            The Majestic Journey
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight mb-8">
                            Redefining Care <br />
                            Through <span className="italic text-taupe font-light">Intention</span>
                        </h1>
                        <p className="text-xl text-taupe leading-relaxed">
                            Founded on the belief that body care is a sacred ritual, Majestic combines botanical wisdom with modern science to create products that honor your natural radiance.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* OUR PHILOSOPHY */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">Everything your skin needs</h2>
                            <p className="text-lg text-taupe mb-8 leading-relaxed">
                                We specialize in high-quality skincare and body care products, curated to provide the ultimate nourishment for your skin.
                            </p>
                            <p className="text-lg text-taupe mb-10 leading-relaxed">
                                Our formulation process is a delicate balance of patience and precision. We don't believe in shortcuts—only in the transformative power of time-tested rituals and dermatological excellence.
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
                        <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Core Values</h2>
                        <p className="text-taupe">The pillars that define everything we do at Majestic.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-12">
                        {[
                            { icon: Leaf, title: "Pure Ingredients", desc: "No synthetic fragrances, parabens, or harmful chemicals. Ever." },
                            { icon: ShieldCheck, title: "Scientific Rigor", desc: "Every formula is dermatologically tested for safety and efficacy." },
                            { icon: Heart, title: "Compassion", desc: "We believe in beauty that radiates kindness to yourself and others." },
                            { icon: Sparkles, title: "Radiance", desc: "Our goal is to help you wake up to skin that feels reborn and luminous." }
                        ].map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-center group"
                            >
                                <div className="w-16 h-16 rounded-full bg-white mb-6 mx-auto flex items-center justify-center text-accent shadow-sm group-hover:scale-110 transition-transform duration-500">
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
            <section className="py-32 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative p-12 md:p-20"
                        >
                            <div className="absolute inset-0 border border-border/50 rounded-[3rem]" />
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-6">
                                <Sparkles className="w-8 h-8 text-accent" />
                            </div>

                            <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight italic">
                                "Our commitment is to transparency, sustainability, and the celebration of authentic beauty."
                            </h2>
                            <p className="text-taupe uppercase tracking-[0.3em] text-xs font-bold">— The Majestic Team</p>
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
                        <h2 className="text-4xl md:text-6xl font-serif mb-8 text-white">Start Your Own <br /> <span className="italic font-light">Skin Ritual</span></h2>
                        <p className="text-ivory/70 max-w-lg mx-auto mb-10 text-lg">
                            Experience the harmony of nature and science. Discover the collection that’s designed for you.
                        </p>
                        <Link to="/shop">
                            <button className="px-12 py-5 bg-ivory text-foreground rounded-full hover:bg-accent transition-colors duration-300 flex items-center gap-2 group mx-auto font-bold shadow-xl">
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
