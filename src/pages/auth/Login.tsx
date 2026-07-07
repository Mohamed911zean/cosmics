// src/pages/auth/Login.tsx
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Welcome back.');
        const { role } = useAuthStore.getState();
        if (role === 'admin' || role === 'superadmin') {
          navigate('/dashboard/dashHome', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const success = await googleLogin();
      if (success) {
        toast.success('Welcome back.');
        const { role } = useAuthStore.getState();
        if (role === 'admin' || role === 'superadmin') {
          navigate('/dashboard/dashHome', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        toast.error('Google sign-in failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex">

      {/* ── Left Panel: Product Image ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        <img
          src="https://e-majestic.com/cdn/shop/files/WhatsAppImage2025-09-01at15.31.20.jpg?v=1756738172&width=900"
          alt="Majestics Skincare"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-deep-purple/60 via-deep-purple/20 to-transparent" />

        {/* Brand copy on image */}
        <div className="absolute inset-0 flex flex-col justify-end p-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/">
              <h2 className="text-5xl font-serif text-primary-foreground tracking-[0.2em] font-medium mb-4">
                Majestics.
              </h2>
            </Link>
            <p className="text-primary-foreground/70 text-sm tracking-widest uppercase font-medium">
              Egypt's Premier Beauty Marketplace
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Right Panel: Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >

          {/* Mobile logo */}
          <Link to="/" className="lg:hidden block mb-12 text-center">
            <h1 className="text-3xl font-serif tracking-[0.2em] text-foreground">Majestics.</h1>
          </Link>

          {/* Heading */}
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-taupe font-bold mb-3">
              Welcome Back
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
              Sign in to your<br />
              <span className="italic font-light text-taupe">account</span>
            </h1>
          </div>

          {/* Google Button */}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-14 border border-border bg-surface hover:bg-secondary/30 transition-all duration-300 text-sm font-medium text-foreground/80 mb-8 disabled:opacity-50"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-4 h-4"
            />
            Continue with Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-taupe/60 font-bold">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                Email Address
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full h-14 px-5 bg-secondary/30 border border-border/50 focus:border-accent outline-none transition-all duration-200 font-light text-sm placeholder:text-foreground/25"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[10px] text-accent hover:text-foreground transition-colors uppercase tracking-wider font-bold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 px-5 pr-12 bg-secondary/30 border border-border/50 focus:border-accent outline-none transition-all duration-200 font-light text-sm placeholder:text-foreground/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 bg-foreground text-ivory text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-taupe transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full inline-block"
                  />
                  Signing In...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-foreground/40 mt-10 font-light">
            New to Majestics?{' '}
            <Link
              to="/signup"
              className="text-foreground font-medium hover:text-accent transition-colors underline underline-offset-4 decoration-border"
            >
              Create an account
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
};