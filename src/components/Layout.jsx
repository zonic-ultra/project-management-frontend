import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../components/SideBar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const showDesktopSidebar = !isAuthPage;

  return (
    <div className='min-h-screen bg-ink-black text-alabaster-grey font-sans overflow-hidden'>
      {/* Mobile Header */}
      {!isAuthPage && (
        <header className='md:hidden flex items-center justify-between px-4 py-4 border-b border-lavender-grey/20 bg-prussian-blue/95 backdrop-blur-xl sticky top-0 z-50'>
          <Link to='/' className='flex items-center gap-2'>
            {/* <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-dusk-blue to-lavender-grey flex items-center justify-center'>
              <Shield className='w-5 h-5 text-white' />
            </div> */}
            <span className='font-black tracking-tighter text-2xl bg-gradient-to-r from-alabaster-grey to-lavender-grey bg-clip-text text-transparent'>
              NEXUS
            </span>
          </Link>

          <div className='flex items-center gap-3'>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className='p-3 text-dusk-blue hover:bg-dusk-blue/10 rounded-2xl transition-all'
            >
              <Menu size={28} />
            </button>
          </div>
        </header>
      )}

      <div className='flex h-screen'>
        {/* Desktop Sidebar - Visible only on md and above */}
        {showDesktopSidebar && <Sidebar />}

        {/* Main Content */}
        <main className='flex-1 overflow-y-auto transition-all duration-300'>
          <div className='fixed inset-0 pointer-events-none z-0'>
            <div className='absolute top-[-15%] right-[-15%] w-[70%] h-[70%] bg-dusk-blue/5 blur-[150px] rounded-full' />
            <div className='absolute bottom-[-15%] left-[-15%] w-[70%] h-[70%] bg-lavender-grey/5 blur-[150px] rounded-full' />
          </div>

          <div className='relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'>
            {children}
          </div>
          <Footer />
        </main>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && !isAuthPage && (
        <div className='fixed inset-0 z-[999] md:hidden'>
          <div
            className='absolute inset-0 bg-black/80 backdrop-blur-md'
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className='absolute inset-y-0 left-0 w-72 bg-prussian-blue border-r border-lavender-grey/20 shadow-2xl overflow-hidden'>
            <Sidebar
              isMobile={true}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
