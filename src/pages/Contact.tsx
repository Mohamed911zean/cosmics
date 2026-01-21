import { motion } from "framer-motion"
import { Send, MapPin, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { useProductStore } from "@/stores"

export function Contact() {
    const { brand } = useProductStore()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    })

    const brandName = brand?.name || "Majestic"
    const ownerEmail = brand?.links.email || "elkonmohamed911@gmail.com"
    const storeAddress = brand?.links.address || "Dakahlia, Mansoura, Egypt"

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all fields")
            return
        }

        const phoneNumber = "+201143524764"
        const message = `*New Contact Request*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Message:* ${formData.message}`
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

        window.open(whatsappUrl, '_blank')
        toast.success("Opening WhatsApp...")
        setFormData({ name: "", email: "", message: "" })
    }

    return (
        <div className="pt-24 min-h-screen bg-ivory">
            {/* Hero Section */}
            <div className="bg-secondary/10 py-16 sm:py-24 mb-16">
                <div className="container mx-auto px-6 text-center space-y-4">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-[10px] text-accent font-bold uppercase tracking-[0.3em]"
                    >
                        Get in Touch
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-serif text-foreground"
                    >
                        Contact {brandName}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-foreground/60 max-w-xl mx-auto font-light"
                    >
                        Have a question about your ritual? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </motion.p>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-12"
                    >
                        <div className="space-y-6">
                            <h2 className="text-3xl font-serif">Store Details</h2>
                            <p className="text-foreground/60 leading-relaxed font-light">
                                Having an issue with your order or need skincare advice? We're here for you.
                            </p>

                            <div className="grid gap-8">
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-border">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm uppercase tracking-widest mb-1">Address</h3>
                                        <p className="text-foreground/70 text-sm whitespace-pre-line">{storeAddress}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-border">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm uppercase tracking-widest mb-1">Phone</h3>
                                        <p className="text-foreground/70 text-sm">+201143524764 [Owner]
                                            <br /> +201034673203 [Customer Service] </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-border">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm uppercase tracking-widest mb-1">Email</h3>
                                        <p className="text-foreground/70 text-sm">{ownerEmail}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-border">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm uppercase tracking-widest mb-1">Opening Hours</h3>
                                        <p className="text-foreground/70 text-sm">24/7 Support Always Here</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-white p-8 sm:p-10 border border-border/30 shadow-lg shadow-secondary/20"
                    >
                        <h2 className="text-2xl font-serif mb-8">Send us a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-accent outline-none transition-all font-light"
                                    placeholder="Jane Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Email Address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-accent outline-none transition-all font-light"
                                    placeholder="jane@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full p-4 bg-secondary/30 rounded-none border border-border/50 focus:border-accent outline-none transition-all font-light resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-14 rounded-none text-xs uppercase tracking-[0.2em] font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Send via WhatsApp
                            </Button>

                            <p className="text-center text-[10px] text-foreground/40 pt-4">
                                This will open WhatsApp to send your message directly to our support team.
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
