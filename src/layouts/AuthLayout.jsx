import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary-light px-4 py-6">
      <div className="w-full max-w-md">
        <div className="mb-5 text-center text-white">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-2xl font-bold shadow-lg">
            EMS
          </div>

          <h1 className="text-3xl font-bold">
            Election Management System
          </h1>

          
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;