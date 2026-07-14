import { Link } from 'react-router-dom';
import Button from '../components/Button';

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-800">Page Not Found</h1>
      <p className="mt-2 max-w-md text-sm text-gray-600">
        The page you are looking for does not exist, may have been moved, or
        you may not have permission to access it.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}

export default NotFound;
