import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../components/Input';
import Button from '../components/Button';
import AnimationWrapper from '../components/AnimationWrapper';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { success, error } = await login(form.email, form.password);
    setLoading(false);
    if (success) {
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo, { replace: true });
    } else {
      toast.error(error || 'Login failed');
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    const { success, error } = await login('demo@local.test', 'demo123');
    setLoading(false);
    if (success) {
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo, { replace: true });
    } else {
      toast.error(error || 'Guest login failed');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <AnimationWrapper className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Login to continue shopping.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? 'Signing in...' : 'Login'}
          </Button>
          <Button type="button" variant="outline" className="w-full mt-2" onClick={handleGuestLogin} disabled={loading}>
            Continue as Guest
          </Button>
        </form>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
          New here?{' '}
          <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold">
            Create an account
          </Link>
        </p>
      </AnimationWrapper>
    </div>
  );
};

export default Login;


