/**
 * About Page Component
 *
 * Provides information about the Nexus mission, core values, and the
 * technical architecture powering the platform. Includes animated
 * statistics and a breakdown of the tech stack.
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
                The Nexus <br />
              </h1>
              <p className='text-xl md:text-2xl text-lavender-grey leading-relaxed font-light max-w-2xl'>
                Nexus was forged in the digital void to provide the ultimate
                command center for high-stakes collective intelligence. We
                believe that the future of teamwork requires an interface that
                is as synchronized as the teams using it.
              </p>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Core Values */}
      <section className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
        <div className='space-y-8'>
          <h2 className='text-4xl font-display font-bold text-alabaster-grey tracking-tight'>
            Core Directives
          </h2>
          <p className='text-lavender-grey leading-relaxed'>
            Our philosophy is built on three pillars of digital collaboration:
            Security, Architecture, and Intelligence.
          </p>
        </div>

        <div className='space-y-12'>
          <div className='flex gap-6 group'>
            <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-dusk-blue/10 flex items-center justify-center border border-dusk-blue/20 group-hover:bg-dusk-blue group-hover:text-white transition-all'>
              <Shield className='w-6 h-6' />
            </div>
            <div>
              <h3 className='text-xl font-bold text-alabaster-grey mb-2'>
                Uncompromising Security
              </h3>
              <p className='text-lavender-grey text-sm leading-relaxed'>
                Every byte of data in Nexus is protected by multi-layer
                encryption and advanced role-based access protocols. Your
                mission intelligence is safe with us.
              </p>
            </div>
          </div>

          <div className='flex gap-6 group'>
            <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-lavender-grey/10 flex items-center justify-center border border-lavender-grey/20 group-hover:bg-lavender-grey group-hover:text-ink-black transition-all'>
              <Cpu className='w-6 h-6' />
            </div>
            <div>
              <h3 className='text-xl font-bold text-alabaster-grey mb-2'>
                Neural Architecture
              </h3>
              <p className='text-lavender-grey text-sm leading-relaxed'>
                Our system is built on a modular, high-performance architecture
                that adapts to your team's workflow, ensuring zero latency and
                maximum efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
