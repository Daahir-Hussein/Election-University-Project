import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col lg:ml-72">
          <main className="flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
