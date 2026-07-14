import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary-light px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-xl font-bold">
            EMS
          </div>
          <h1 className="text-2xl font-bold">Election Management System</h1>
          <p className="mt-1 text-sm text-blue-100">
            National Election Administration Portal
          </p>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
