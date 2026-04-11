import React from "react";
import Layout from "../../components/Layout";
import { Shield, FileText, Scale, AlertCircle } from "lucide-react";

const Terms = () => {
  return (
    <Layout>
      <div className='max-w-4xl mx-auto space-y-12 py-10'>
        <div className='flex items-center gap-4'>
          <div className='p-3 rounded-2xl bg-gradient-to-br from-dusk-blue to-lavender-grey shadow-[0_0_20px_rgba(65,90,119,0.3)]'>
            <FileText className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-4xl font-black text-alabaster-grey tracking-tight'>
              Terms of Service
            </h1>
            <p className='text-lavender-grey mt-1'>
              Legal protocols for the Synergy Collaboration Suite
            </p>
          </div>
        </div>

        <div className='grid gap-8'>
          <section className='p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10'>
            <div className='flex items-center gap-3 mb-4'>
              <Shield className='w-5 h-5 text-dusk-blue' />
              <h3 className='text-xl font-bold text-alabaster-grey'>
                1. Acceptance of Protocols
              </h3>
            </div>
            <p className='text-lavender-grey leading-relaxed'>
              By accessing the Synergy platform, you agree to be bound by these
              mission protocols. Our system is designed for high-performance
              collaboration, and your use of the service constitutes acceptance
              of all terms outlined herein.
            </p>
          </section>

          <section className='p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10'>
            <div className='flex items-center gap-3 mb-4'>
              <Scale className='w-5 h-5 text-lavender-grey' />
              <h3 className='text-xl font-bold text-alabaster-grey'>
                2. Agent Responsibilities
              </h3>
            </div>
            <p className='text-lavender-grey leading-relaxed'>
              Agents are responsible for maintaining the security of their
              access credentials. Any activity originating from an agent's
              terminal is the sole responsibility of that agent. Unauthorized
              access to the Synergy Core is strictly prohibited.
            </p>
          </section>

          <section className='p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10'>
            <div className='flex items-center gap-3 mb-4'>
              <AlertCircle className='w-5 h-5 text-red-400' />
              <h3 className='text-xl font-bold text-alabaster-grey'>
                3. Data Integrity
              </h3>
            </div>
            <p className='text-lavender-grey leading-relaxed'>
              Synergy provides real-time synchronization of mission data. While
              we strive for 100% core stability, we do not guarantee that the
              matrix will be free from neural latency or temporary
              synchronization offsets.
            </p>
          </section>
        </div>

        <div className='text-center pt-10 border-t border-lavender-grey/10'>
          <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-lavender-grey/20'>
            Last Protocol Update: April 2026
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
