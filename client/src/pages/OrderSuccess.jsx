import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import AnimationWrapper from '../components/AnimationWrapper';
import Button from '../components/Button';

const OrderSuccess = () => {
  const location = useLocation();
  const total = location.state?.total;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <AnimationWrapper className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <FiCheckCircle className="text-green-500 mx-auto mb-4" size={56} />
        <h1 className="text-3xl font-bold mb-2">Order placed!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Thank you for shopping with us. We will send you a confirmation email shortly.
        </p>
        {total && <p className="text-lg font-semibold mb-6">Paid: ${Number(total).toFixed(2)}</p>}
        <div className="flex flex-col gap-3">
          <Link to="/products">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
          <Link to="/profile">
            <Button className="w-full" variant="secondary">
              View Orders
            </Button>
          </Link>
        </div>
      </AnimationWrapper>
    </div>
  );
};

export default OrderSuccess;


