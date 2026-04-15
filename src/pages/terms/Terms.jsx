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
              Terms
            </h1>
            <p className='text-lavender-grey mt-1'>
              Rules for using this platform
            </p>
          </div>
        </div>

        <div className='grid gap-8'>
          <section className='p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10'>
            <div className='flex items-center gap-3 mb-4'>
              <Shield className='w-5 h-5 text-dusk-blue' />
              <h3 className='text-xl font-bold text-alabaster-grey'>
                1. Acceptance of Terms
              </h3>
            </div>
            <p className='text-lavender-grey leading-relaxed'>
              By using this platform, you agree to these terms. Using the system
              means you accept all rules listed here.
            </p>
          </section>

          <section className='p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10'>
            <div className='flex items-center gap-3 mb-4'>
              <Scale className='w-5 h-5 text-lavender-grey' />
              <h3 className='text-xl font-bold text-alabaster-grey'>
                2. User Responsibilities
              </h3>
            </div>
            <p className='text-lavender-grey leading-relaxed'>
              You are responsible for keeping your account secure. Any action
              made using your account is your responsibility. Do not access the
              system without permission.
            </p>
          </section>

          <section className='p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10'>
            <div className='flex items-center gap-3 mb-4'>
              <AlertCircle className='w-5 h-5 text-red-400' />
              <h3 className='text-xl font-bold text-alabaster-grey'>
                3. Data Accuracy
              </h3>
            </div>
            <p className='text-lavender-grey leading-relaxed'>
              The system updates data in real time. We try to keep everything
              working properly, but we cannot guarantee there will be no errors
              or interruptions.
            </p>
          </section>
        </div>

        <div className='text-center pt-10 border-t border-lavender-grey/10'>
          <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-lavender-grey/20'>
            Last updated: April 2026
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
