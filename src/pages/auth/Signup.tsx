// src/pages/auth/Signup.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup, googleLogin } = useAuthStore();
  const navigate = useNavigate();

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordLongEnough = password.length >= 6;

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const success = await signup(email, password);
      if (success) {
        toast.success('Account created. Welcome to Majestics.');
        navigate('/', { replace: true });
      } else {
        toast.error('Failed to create account');
      }
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const success = await googleLogin();
      if (success) {
        toast.success('Account created. Welcome to Majestics.');
        navigate('/', { replace: true });
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
          src="https://e-majestic.com/cdn/shop/files/WhatsApp_Image_2025-11-09_at_1.11.14_PM_1.jpg?v=1767270855&width=900"
          alt="Majestics Beauty"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D2422]/50 via-[#2D2422]/15 to-transparent" />

        {/* Floating trust badges */}
        <div className="absolute inset-0 flex flex-col justify-between p-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col gap-3 max-w-xs"
          >
            {[
              '100% Original Products',
              'Nationwide Delivery',
              'Verified Global Brands',
            ].map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-white/80 text-xs tracking-wider font-medium">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/">
              <h2 className="text-5xl font-serif text-white tracking-[0.2em] font-medium mb-4">
                Majestics.
              </h2>
            </Link>
            <p className="text-white/70 text-sm tracking-widest uppercase font-medium">
              Egypt's Premier Beauty Marketplace
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Right Panel: Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16 lg:px-16 overflow-y-auto">
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
              Join Majestics
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
              Create your<br />
              <span className="italic font-light text-taupe">account</span>
            </h1>
          </div>

          {/* Google Button */}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-14 border border-border bg-white hover:bg-secondary/30 transition-all duration-300 text-sm font-medium text-foreground/80 mb-8 disabled:opacity-50"
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
          <form onSubmit={handleEmailSignup} className="space-y-5">

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
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`w-full h-14 px-5 pr-12 bg-secondary/30 border focus:outline-none transition-all duration-200 font-light text-sm placeholder:text-foreground/25 ${
                    password.length > 0
                      ? passwordLongEnough
                        ? 'border-accent/60'
                        : 'border-rose-300'
                      : 'border-border/50 focus:border-accent'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength hint */}
              {password.length > 0 && !passwordLongEnough && (
                <p className="text-[10px] text-rose-400 font-medium tracking-wide">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full h-14 px-5 pr-12 bg-secondary/30 border focus:outline-none transition-all duration-200 font-light text-sm placeholder:text-foreground/25 ${
                    confirmPassword.length > 0
                      ? passwordsMatch
                        ? 'border-accent/60'
                        : 'border-rose-300'
                      : 'border-border/50 focus:border-accent'
                  }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {confirmPassword.length > 0 && passwordsMatch && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center"
                    >
                      <Check className="w-2.5 h-2.5 text-accent" />
                    </motion.div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-foreground/30 hover:text-foreground/60 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-[10px] text-rose-400 font-medium tracking-wide">
                  Passwords do not match
                </p>
              )}
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
                  Creating Account...
                </span>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-foreground/40 mt-10 font-light">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-foreground font-medium hover:text-accent transition-colors underline underline-offset-4 decoration-border"
            >
              Sign in
            </Link>
          </p>

          {/* Disclaimer */}
          <p className="text-center text-[10px] text-foreground/25 mt-6 leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="underline hover:text-foreground/50 transition-colors">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="underline hover:text-foreground/50 transition-colors">Privacy Policy</Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
};