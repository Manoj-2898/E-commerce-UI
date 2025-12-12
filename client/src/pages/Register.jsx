import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../components/Input';
import Button from '../components/Button';
import AnimationWrapper from '../components/AnimationWrapper';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { success, error } = await register(form.name, form.email, form.password);
    setLoading(false);
    if (success) {
      navigate('/');
    } else {
      toast.error(error || 'Registration failed');
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    // Use the auth register/login flow to sign in as demo user
    // If demo user already exists in mock store, use login endpoint via context
    try {
      // Attempt to login via the auth context by calling register then login fallback
      // We can't call login here because Register.jsx only has register in context.
      // So redirect user to login page with preset credentials.
      navigate('/login', { state: { guest: true } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <AnimationWrapper className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Create account</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Start shopping with us today.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
          <Button type="button" variant="outline" className="w-full mt-2" onClick={handleGuestLogin} disabled={loading}>
            Continue as Guest
          </Button>
        </form>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold">
            Login
          </Link>
        </p>
      </AnimationWrapper>
    </div>
  );
};

export default Register;


