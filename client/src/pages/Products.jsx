import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { API_ENDPOINTS, CATEGORIES, SORT_OPTIONS } from '../utils/constants';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Input from '../components/Input';
import Button from '../components/Button';
import { FiSearch, FiX } from 'react-icons/fi';
import { sampleProducts } from '../data/seedData';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [searchParams, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        ...Object.fromEntries(searchParams),
      };
      const response = await api.get(API_ENDPOINTS.PRODUCTS.ALL, { params });
      setProducts(response.data.products);
      setTotalPages(response.data.pages);
    } catch (error) {
      setProducts(sampleProducts);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set('keyword', search);
    if (category) params.set('category', category);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    const selectedSort = SORT_OPTIONS.find((opt) => opt.value === sortBy);
    params.set('sortBy', sortBy);
    if (selectedSort?.order) {
      params.set('order', selectedSort.order);
    }
    setSearchParams(params);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('createdAt');
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          All Products
        </h1>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <FiSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <Input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <select
              value={sortBy}
              onChange={(e) => {
                const selected = SORT_OPTIONS.find((opt) => opt.value === e.target.value);
                if (selected?.order) {
                  setSearchParams((prev) => {
                    const params = new URLSearchParams(prev);
                    params.set('order', selected.order);
                    params.set('sortBy', selected.value);
                    return params;
                  });
                }
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <Button onClick={handleSearch} variant="primary">
              Apply Filters
            </Button>

            {(search || category || minPrice || maxPrice) && (
              <Button onClick={clearFilters} variant="secondary">
                <FiX className="inline mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <Loader />
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No products found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

