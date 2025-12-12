import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { API_ENDPOINTS } from '../utils/constants';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';
import AnimationWrapper from '../components/AnimationWrapper';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [profileRes, orderRes] = await Promise.all([
          api.get(API_ENDPOINTS.AUTH.ME),
          api.get(API_ENDPOINTS.ORDERS.MY_ORDERS),
        ]);
        setProfile({
          ...profileRes.data.user,
          address: profileRes.data.user.address || {},
        });
        setOrders(orderRes.data.orders || []);
      } catch (error) {
        toast.error('Unable to load profile, please login again');
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [logout]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.put(API_ENDPOINTS.USERS.PROFILE, profile);
      setProfile(response.data.user);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AnimationWrapper>
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <Input
                label="Name"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
              <Input
                label="Phone"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
              <Input
                label="Street"
                value={profile.address?.street || ''}
                onChange={(e) => setProfile({ ...profile, address: { ...profile.address, street: e.target.value } })}
              />
              <Input
                label="City"
                value={profile.address?.city || ''}
                onChange={(e) => setProfile({ ...profile, address: { ...profile.address, city: e.target.value } })}
              />
              <Input
                label="State"
                value={profile.address?.state || ''}
                onChange={(e) => setProfile({ ...profile, address: { ...profile.address, state: e.target.value } })}
              />
              <Input
                label="ZIP"
                value={profile.address?.zipCode || ''}
                onChange={(e) =>
                  setProfile({ ...profile, address: { ...profile.address, zipCode: e.target.value } })
                }
              />
              <Input
                label="Country"
                value={profile.address?.country || ''}
                onChange={(e) =>
                  setProfile({ ...profile, address: { ...profile.address, country: e.target.value } })
                }
              />
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">You have no orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Order #{order._id.slice(-6)}</p>
                        <p className="font-semibold">${order.totalPrice.toFixed(2)}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className={order.isPaid ? 'text-green-600' : 'text-yellow-600'}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {order.orderItems?.map((item) => `${item.name} x${item.quantity}`).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
};

export default Profile;


