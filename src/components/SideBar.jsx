import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Briefcase,
  LogOut,
  Home,
  Info,
} from "lucide-react";
// import { i } from "motion/react-client";

const Sidebar = ({ isMobile = false, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Safe auth checks - NO aggressive logout (Home & About are public)
  const isAuth = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();

  const handleClick = () => {
    if (isMobile && onClose) onClose();
  };

  const handleLogout = () => {
    handleClick();
    ApiService.logout();
    navigate("/login");
  };

  return (
    <aside
      className={`h-full w-72 bg-prussian-blue border-r border-lavender-grey/20 flex flex-col overflow-hidden
      ${isMobile ? "block" : "hidden md:flex"}`}
    >
      <div className='flex flex-col h-full p-6 overflow-y-auto'>
        {/* Logo */}
        <div className='flex items-center gap-3 mb-10'>
          <span className='font-black tracking-tighter text-2xl bg-gradient-to-r from-alabaster-grey to-lavender-grey bg-clip-text text-transparent'>
            NEXUS
          </span>
        </div>

        <nav className='flex-1 space-y-1'>
          <Link
            to='/'
            onClick={handleClick}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all group ${
              location.pathname === "/"
                ? "bg-dusk-blue/20 text-dusk-blue shadow-[inset_4px_0_0_#415A77]"
                : "hover:bg-white/5 text-alabaster-grey hover:text-white"
            }`}
          >
            <Home className='w-5 h-5' />
            Home
          </Link>

          <Link
            to='/about'
            onClick={handleClick}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all group ${
              location.pathname === "/about"
                ? "bg-dusk-blue/20 text-dusk-blue shadow-[inset_4px_0_0_#415A77]"
                : "hover:bg-white/5 text-alabaster-grey hover:text-white"
            }`}
          >
            <Info className='w-5 h-5' />
            About
          </Link>

          {/* Dashboard - Admin Only */}
          {isAdmin && (
            <Link
              to='/dashboard'
              onClick={handleClick}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all group ${
                location.pathname === "/dashboard"
                  ? "bg-dusk-blue/20 text-dusk-blue shadow-[inset_4px_0_0_#415A77]"
                  : "hover:bg-white/5 text-alabaster-grey hover:text-white"
              }`}
            >
              <LayoutDashboard className='w-5 h-5' />
              Dashboard
            </Link>
          )}

          {/* Tasks - Logged in users */}
          {isAuth && (
            <Link
              to='/tasks'
              onClick={handleClick}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all group ${
                location.pathname === "/tasks"
                  ? "bg-dusk-blue/20 text-dusk-blue shadow-[inset_4px_0_0_#415A77]"
                  : "hover:bg-white/5 text-alabaster-grey hover:text-white"
              }`}
            >
              <CheckSquare className='w-5 h-5' />
              Tasks
            </Link>
          )}

          {/* Projects - Logged in users */}
          {isAdmin && (
            <Link
              to='/projects'
              onClick={handleClick}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all group ${
                location.pathname === "/projects"
                  ? "bg-dusk-blue/20 text-dusk-blue shadow-[inset_4px_0_0_#415A77]"
                  : "hover:bg-white/5 text-alabaster-grey hover:text-white"
              }`}
            >
              <Briefcase className='w-5 h-5' />
              Projects
            </Link>
          )}

          {/* Users - Admin Only */}
          {isAdmin && (
            <Link
              to='/users'
              onClick={handleClick}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all group ${
                location.pathname === "/users"
                  ? "bg-dusk-blue/20 text-dusk-blue shadow-[inset_4px_0_0_#415A77]"
                  : "hover:bg-white/5 text-alabaster-grey hover:text-white"
              }`}
            >
              <Users className='w-5 h-5' />
              Users
            </Link>
          )}
        </nav>

        {/* Bottom Section - Clearly Separated */}
        <div className='mt-auto pt-8'>
          {isAuth ? (
            /* Logout Button - Only when logged in */
            <button
              type='button'
              onClick={handleLogout}
              className='w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all'
            >
              <LogOut className='w-5 h-5' />
              Logout
            </button>
          ) : (
            /* Login & Register - Only when NOT logged in */
            <div className='space-y-3'>
              <Link
                to='/login'
                onClick={handleClick}
                className='block text-center py-3.5 rounded-2xl font-bold bg-dusk-blue text-ink-black hover:bg-dusk-blue/90 transition-all'
              >
                Login
              </Link>
              <Link
                to='/register'
                onClick={handleClick}
                className='block text-center py-3.5 rounded-2xl font-bold border border-dusk-blue/30 text-dusk-blue hover:bg-dusk-blue/10 transition-all'
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
