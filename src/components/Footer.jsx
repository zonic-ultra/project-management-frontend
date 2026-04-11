import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='mt-auto py-12 border-t border-lavender-grey/10 bg-prussian-blue/20 backdrop-blur-xl'>
      <div className='max-w-7xl mx-auto px-4 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 items-center'>
          {/* Brand Section */}
          <div className='flex flex-col items-center md:items-start gap-4'>
            <Link to='/' className='flex items-center gap-2 group'>
              <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-dusk-blue to-lavender-grey flex items-center justify-center shadow-[0_0_15px_rgba(65,90,119,0.3)] group-hover:scale-110 transition-transform'>
                <Shield className='w-5 h-5 text-white' />
              </div>
              <span className='font-black tracking-tighter text-xl bg-gradient-to-r from-alabaster-grey to-lavender-grey bg-clip-text text-transparent'>
                NEXUS
              </span>
            </Link>
            <p className='text-lavender-grey/40 text-xs font-medium text-center md:text-left max-w-[200px]'>
              The future of collective intelligence and seamless team
              synchronization.
            </p>
          </div>

          {/* Links Section */}
          <div className='flex justify-center gap-8 text-xs font-bold uppercase tracking-widest'>
            <Link
              to='/about'
              className='text-lavender-grey hover:text-dusk-blue transition-colors'
            >
              About
            </Link>
            <Link
              to='/terms'
              className='text-lavender-grey hover:text-dusk-blue transition-colors'
            >
              Terms
            </Link>
            <Link
              to='/privacy'
              className='text-lavender-grey hover:text-dusk-blue transition-colors'
            >
              Privacy
            </Link>
          </div>

          {/* Copyright Section */}
          <div className='flex flex-col items-center md:items-end gap-2'>
            <p className='text-lavender-grey/40 text-[10px] font-bold uppercase tracking-[0.2em]'>
              © {currentYear} Synergy Suite. All Rights Reserved.
            </p>
            <div className='flex gap-4'>
              <div className='w-1 h-1 rounded-full bg-dusk-blue animate-pulse' />
              <div className='w-1 h-1 rounded-full bg-lavender-grey/40' />
              <div className='w-1 h-1 rounded-full bg-lavender-grey/40' />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
