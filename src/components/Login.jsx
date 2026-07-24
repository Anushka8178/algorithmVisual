import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useToast } from './ToastProvider';

const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  if (/\s/.test(email)) {
    return 'Email cannot contain spaces';
  }
  if (!email.includes('@')) {
    return 'Email must contain @';
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address (e.g., user@domain.com)';
  }
  return null;
};

const validatePassword = (password) => {
  if (!password || password.length === 0) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!/[@$!%*?&]/.test(password)) {
    return 'Password must contain at least one special character (@$!%*?&)';
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(password)) {
    return 'Password does not meet all requirements';
  }
  return null;
};

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [errors, setErrors] = useState({ email:'', password:'' });
  const [touched, setTouched] = useState({ email:false, password:false });
  const [submitting, setSubmitting] = useState(false);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, form[field]);
  };

  const validateField = (field, value) => {
    let error = '';
    if (field === 'email') {
      error = validateEmail(value) || '';
    } else if (field === 'password') {
      error = validatePassword(value) || '';
    }
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({ email: true, password: true });
    
    const emailValid = validateField('email', form.email);
    const passwordValid = validateField('password', form.password);

    if (!emailValid || !passwordValid) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setSubmitting(true);
    const res = await login({ email: form.email.trim(), password: form.password });
    setSubmitting(false);
    if(res.success){
      showToast('Welcome back!', 'success');
      navigate(res.role === 'educator' ? '/educator' : '/dashboard');
    } else {
      showToast(res.message || 'Login failed', 'error');
    }
  };
  
  const goToEducatorSignup = () => navigate('/register?role=educator');
  const goToStudentSignup = () => navigate('/register?role=student');
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-cyan-500 rounded-full opacity-20 blur-3xl"
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-60 h-60 bg-teal-500 rounded-full opacity-20 blur-3xl"
        animate={{
          y: [0, -40, 0],
          x: [0, -15, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <Link
        to="/"
        className="absolute top-6 left-6 text-cyan-300/80 hover:text-cyan-200 transition-colors flex items-center gap-2 z-10"
      >
        <span>←</span>         Back to Home
      </Link>

      <motion.div
        className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 md:p-12 w-full max-w-md border border-cyan-500/20 shadow-xl shadow-cyan-900/20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl font-extrabold mb-2 text-center bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Welcome Back
        </motion.h1>
        <motion.p
          className="text-center mb-8 text-cyan-100/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Sign in to continue your learning journey
        </motion.p>

        <form className="space-y-6" onSubmit={onSubmit}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <label className="block text-sm font-medium mb-2 text-cyan-300/70">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e=>handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="your@email.com"
              className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 transition-all duration-200 ${
                touched.email && errors.email
                  ? 'border-red-500/50 focus:ring-red-400/50 focus:border-red-400/50'
                  : 'border-cyan-500/30 focus:ring-cyan-400/50 focus:border-cyan-400/50'
              }`}
            />
            {touched.email && errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
            {touched.email && !errors.email && form.email && (
              <p className="mt-1 text-xs text-green-400">✓ Valid email</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-cyan-300/70">
                Password <span className="text-red-400">*</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-cyan-300 hover:text-cyan-200 underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={form.password}
              onChange={e=>handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 transition-all duration-200 ${
                touched.password && errors.password
                  ? 'border-red-500/50 focus:ring-red-400/50 focus:border-red-400/50'
                  : 'border-cyan-500/30 focus:ring-cyan-400/50 focus:border-cyan-400/50'
              }`}
            />
            {touched.password && errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
            {touched.password && !errors.password && form.password && (
              <p className="mt-1 text-xs text-green-400">✓ Valid password format</p>
            )}
            {!touched.password && (
              <p className="mt-1 text-xs text-cyan-300/60">Enter your password (min 6 chars, uppercase, lowercase, number, special char)</p>
            )}
          </motion.div>

          <motion.button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 font-semibold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {submitting? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <motion.div
          className="mt-6 text-center text-sm text-cyan-100/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-300 hover:text-cyan-200 underline font-medium">
            Sign up
          </Link>
          <div className="mt-3 flex items-center justify-center gap-3">
            <button onClick={goToStudentSignup} className="text-cyan-300 hover:text-cyan-200 underline">I’m a Student</button>
            <span className="text-cyan-100/50">|</span>
            <button onClick={goToEducatorSignup} className="text-cyan-300 hover:text-cyan-200 underline">I’m an Educator</button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

