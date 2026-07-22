import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiLock, FiLogIn, FiUser } from 'react-icons/fi';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/';
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (data) => {
    setAuthError(null);
    const result = login(data.username, data.password);

    if (result.success) {
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
      return;
    }

    setAuthError(result.message);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-xl sm:p-8">
      <h2 className="text-xl font-bold text-primary">Administrator Login</h2>
      {/* <p className="mt-1 text-sm text-gray-600">
        Sign in to access the election management portal.
      </p> */}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField
          label="Username"
          type="text"
          autoComplete="username"
          placeholder="Enter username"
          icon={FiUser}
          error={errors.username?.message}
          {...register('username', {
            required: 'Username is required.',
          })}
        />

        <InputField
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter password"
          icon={FiLock}
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required.',
          })}
        />

        {authError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger">
            {authError}
          </div>
        )}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Sign In
        </Button>
      </form>

      {/* <p className="mt-4 text-center text-xs text-gray-500">
        Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
      </p> */}

      <div className="mt-6 border-t border-gray-200 pt-4 text-center">
        <p className="text-xs text-gray-500">Not an administrator?</p>
        <Link
          to="/voter-login"
          className="mt-2 inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-dark"
        >
          <FiLogIn size={16} />
          Go to Voter Portal
        </Link>
      </div>
    </div>
  );
}

export default Login;
