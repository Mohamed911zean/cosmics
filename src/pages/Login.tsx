import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6 py-32 font-sans">
            <div className="w-full max-w-[480px] space-y-16 animate-reveal-up">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-serif text-foreground tracking-tight">
                        Sign In
                    </h1>
                    <p className="text-[10px] text-accent uppercase tracking-[0.3em] font-bold">
                        Welcome back to Lumière
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="login-email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                                Email Address
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-primary outline-none transition-all font-light placeholder:text-[10px] placeholder:tracking-widest"
                                placeholder="YOUR@EMAIL.COM"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <label htmlFor="login-password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                                    Password
                                </label>
                                <span className="text-[9px] text-accent uppercase tracking-widest font-bold cursor-pointer hover:underline">
                                    Forgot?
                                </span>
                            </div>
                            <input
                                id="login-password"
                                type="password"
                                className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-primary outline-none transition-all font-light placeholder:text-[10px] placeholder:tracking-widest"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button
                        type="button"
                        className="w-full h-18 text-[10px] font-bold uppercase tracking-[0.3em] text-primary-foreground bg-primary rounded-none transition-all duration-500 hover:bg-primary/90 active:scale-[0.98]"
                    >
                        Sign In
                    </Button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/40"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-background px-4 text-[9px] uppercase tracking-[0.2em] text-foreground/30 font-bold">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        className="h-14 flex items-center justify-center gap-3 border border-border/50 rounded-none hover:bg-secondary/30 transition-all text-[10px] font-bold uppercase tracking-widest"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" className="text-foreground/80" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" className="text-foreground/60" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" className="text-foreground/40" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" className="text-foreground/20" />
                        </svg>
                        Google
                    </button>
                    <button
                        type="button"
                        className="h-14 flex items-center justify-center gap-3 border border-border/50 rounded-none hover:bg-secondary/30 transition-all text-[10px] font-bold uppercase tracking-widest"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-foreground/80">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        GitHub
                    </button>
                </div>

                <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="text-accent hover:underline transition-all"
                    >
                        Create One
                    </Link>
                </p>
            </div>
        </div>
    );
}
