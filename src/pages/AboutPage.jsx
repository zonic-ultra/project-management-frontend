/**
 * About Page Component
 *
 * Provides information about the Nexus mission, core values, and the
 * technical structure powering the platform.
 */
import React from "react";
import { motion } from "motion/react";
import Layout from "../components/Layout";
import { Shield, Cpu } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className='space-y-32 py-12'>
        {/* Mission Section */}
        <section className='relative'>
          <div className='max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className='text-6xl md:text-8xl font-display font-bold text-alabaster-grey mb-8 tracking-tight leading-[0.9]'>
                About Nexus <br />
              </h1>
              <p className='text-xl md:text-2xl text-lavender-grey leading-relaxed font-light max-w-2xl'>
                Nexus is a digital system built to serve as a central command
                center for team collaboration. It is designed for structured
                work, clear coordination, and high-performance teamwork.
              </p>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Core Values */}
      <section className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
        <div className='space-y-8'>
          <h2 className='text-4xl font-display font-bold text-alabaster-grey tracking-tight'>
            Core Principles
          </h2>
          <p className='text-lavender-grey leading-relaxed'>
            Nexus is built on three main principles: security, structure, and
            system intelligence.
          </p>
        </div>

        <div className='space-y-12'>
          <div className='flex gap-6 group'>
            <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-dusk-blue/10 flex items-center justify-center border border-dusk-blue/20 group-hover:bg-dusk-blue group-hover:text-white transition-all'>
              <Shield className='w-6 h-6' />
            </div>
            <div>
              <h3 className='text-xl font-bold text-alabaster-grey mb-2'>
                Security First
              </h3>
              <p className='text-lavender-grey text-sm leading-relaxed'>
                All data in Nexus is protected with strong encryption and
                role-based access control. Information is only available to
                authorized users.
              </p>
            </div>
          </div>

          <div className='flex gap-6 group'>
            <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-lavender-grey/10 flex items-center justify-center border border-lavender-grey/20 group-hover:bg-lavender-grey group-hover:text-ink-black transition-all'>
              <Cpu className='w-6 h-6' />
            </div>
            <div>
              <h3 className='text-xl font-bold text-alabaster-grey mb-2'>
                System Architecture
              </h3>
              <p className='text-lavender-grey text-sm leading-relaxed'>
                Nexus uses a modular system design that supports fast
                performance, smooth workflows, and scalable team collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
