import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Signup() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6 py-32 font-sans">
            <div className="w-full max-w-[480px] space-y-16 animate-reveal-up">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-serif text-foreground tracking-tight">
                        Create Account
                    </h1>
                    <p className="text-[10px] text-accent uppercase tracking-[0.3em] font-bold">
                        Join the world of Lumière
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="signup-name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                                Full Name
                            </label>
                            <input
                                id="signup-name"
                                type="text"
                                className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-primary outline-none transition-all font-light placeholder:text-[10px] placeholder:tracking-widest"
                                placeholder="YOUR NAME"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="signup-email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                                Email Address
                            </label>
                            <input
                                id="signup-email"
                                type="email"
                                className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-primary outline-none transition-all font-light placeholder:text-[10px] placeholder:tracking-widest"
                                placeholder="YOUR@EMAIL.COM"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="signup-password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                                Password
                            </label>
                            <input
                                id="signup-password"
                                type="password"
                                className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-primary outline-none transition-all font-light placeholder:text-[10px] placeholder:tracking-widest"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="terms"
                            className="w-4 h-4 border-border/50 rounded-none accent-accent cursor-pointer"
                        />
                        <label htmlFor="terms" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 cursor-pointer">
                            I agree to the <span className="text-foreground border-b border-foreground/20 italic">Terms of Service</span>
                        </label>
                    </div>

                    <Button
                        type="button"
                        className="w-full h-18 text-[10px] font-bold uppercase tracking-[0.3em] text-primary-foreground bg-primary rounded-none transition-all duration-500 hover:bg-primary/90 active:scale-[0.98]"
                    >
                        Create Account
                    </Button>
                </div>

                <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-accent hover:underline transition-all"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
