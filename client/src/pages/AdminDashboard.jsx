import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { API_ENDPOINTS, CATEGORIES } from '../utils/constants';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import AnimationWrapper from '../components/AnimationWrapper';
import { sampleOrders, sampleProducts, sampleUsers } from '../data/seedData';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: CATEGORIES[0],
  brand: '',
  stock: 0,
  image: '',
  featured: false,
};

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productRes, orderRes, userRes] = await Promise.all([
          api.get(API_ENDPOINTS.PRODUCTS.ALL),
          api.get(API_ENDPOINTS.ORDERS.ALL),
          api.get(API_ENDPOINTS.USERS.ALL),
        ]);
        setProducts(productRes.data.products || []);
        setOrders(orderRes.data.orders || []);
        setUsers(userRes.data.users || []);
      } catch (error) {
        // Fallback to placeholder data if API not reachable
        setProducts(sampleProducts);
        setOrders(sampleOrders);
        setUsers(sampleUsers);
        toast('Using demo admin data', { icon: 'ℹ️' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editingId) {
        const response = await api.put(`/products/${editingId}`, payload);
        setProducts((prev) => prev.map((p) => (p._id === editingId ? response.data.product : p)));
        toast.success('Product updated');
      } else {
        const response = await api.post(API_ENDPOINTS.PRODUCTS.ALL, payload);
        setProducts((prev) => [response.data.product, ...prev]);
        toast.success('Product created');
      }
      setForm(emptyProduct);
      setEditingId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      image: product.image,
      featured: product.featured,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <AnimationWrapper>
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">Products</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input
                label="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
                <Input
                  label="Stock"
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Brand"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                />
              </div>
              <Input
                label="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                required
              />
              <div className="flex items-center gap-2">
                <input
                  id="featured"
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="h-4 w-4 text-primary-600"
                />
                <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">
                  Featured product
                </label>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </Button>
                {editingId && (
                  <Button variant="secondary" onClick={() => { setEditingId(null); setForm(emptyProduct); }}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Products</h2>
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-start gap-3"
                  >
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-500">${product.price.toFixed(2)} · {product.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(product)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(product._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-3">Recent Orders</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {orders.map((order) => (
                  <div key={order._id || order.id} className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex justify-between">
                      <span>#{(order._id || order.id).slice(-6)}</span>
                      <span className="font-semibold">${order.totalPrice?.toFixed(2) || order.totalPrice}</span>
                    </div>
                    <p className="text-gray-500">{order.user?.email || 'Guest'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
};

export default AdminDashboard;


