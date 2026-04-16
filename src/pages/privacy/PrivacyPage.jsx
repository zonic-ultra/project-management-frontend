import React from "react";
import Layout from "../../components/Layout";
import { Shield, Lock, Eye, Database, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";

const PrivacyPage = () => {
  return (
    <Layout>
      <div className='max-w-4xl mx-auto space-y-12 py-10 px-4'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex items-center gap-4'
        >
          <div className='p-3 rounded-2xl bg-gradient-to-br from-dusk-blue to-lavender-grey shadow-[0_0_20px_rgba(65,90,119,0.3)]'>
            <Shield className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-4xl font-black text-alabaster-grey tracking-tight'>
              Privacy Protocol
            </h1>
            <p className='text-lavender-grey mt-1'>
              Data protection protocols governing the NEXUS command
              infrastructure
            </p>
          </div>
        </motion.div>

        <div className='grid gap-8'>
          {/* Section 1: Data Encryption */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className='p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10 relative overflow-hidden group hover:border-dusk-blue/30 transition-all'
          >
            <div className='absolute top-0 right-0 w-32 h-32 bg-dusk-blue/5 rounded-full blur-3xl' />
            <div className='flex items-center gap-3 mb-4 relative z-10'>
              <Lock className='w-5 h-5 text-dusk-blue' />
              <h3 className='text-xl font-bold text-alabaster-grey'>
                1. Data Encryption Protocol
              </h3>
            </div>
            <p className='text-lavender-grey leading-relaxed relative z-10'>
              NEXUS enforces multi-layer encryption across all operational data
              streams. Credentials and mission-critical records are secured
              using AES-256 cryptographic standards before being processed
              within the core data matrix.
            </p>
          </motion.section>

          {/* Section 2: Information Collection */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className='p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10 relative overflow-hidden group hover:border-dusk-blue/30 transition-all'
          >
            <div className='absolute top-0 right-0 w-32 h-32 bg-lavender-grey/5 rounded-full blur-3xl' />
            <div className='flex items-center gap-3 mb-4 relative z-10'>
              <Eye className='w-5 h-5 text-lavender-grey' />
              <h3 className='text-xl font-bold text-alabaster-grey'>
                2. Data Intake & Telemetry
              </h3>
            </div>
            <p className='text-lavender-grey leading-relaxed relative z-10'>
              The system collects only essential operational telemetry required
              for synchronization within NEXUS. This includes identity
              credentials (email, name) and system interactions such as tasks
              and projects. No external activity beyond the NEXUS environment is
              monitored or recorded.
            </p>
          </motion.section>

          {/* Section 3: Data Retention */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className='p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10 relative overflow-hidden group hover:border-dusk-blue/30 transition-all'
          >
            <div className='flex items-center gap-3 mb-4 relative z-10'>
              <Database className='w-5 h-5 text-dusk-blue' />
              <h3 className='text-xl font-bold text-alabaster-grey'>
                3. Data Retention Protocol
              </h3>
            </div>
            <p className='text-lavender-grey leading-relaxed relative z-10'>
              Operational data is retained only while an agent remains active
              within the system. Upon account deactivation, all associated
              identity traces and operational records are securely purged from
              the primary data matrix within 30 cycles.
            </p>
          </motion.section>

          {/* Section 4: Agent Autonomy */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className='p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10 relative overflow-hidden group hover:border-dusk-blue/30 transition-all'
          >
            <div className='flex items-center gap-3 mb-4 relative z-10'>
              <Fingerprint className='w-5 h-5 text-lavender-grey' />
              <h3 className='text-xl font-bold text-alabaster-grey'>
                4. Data Sovereignty Protocol
              </h3>
            </div>
            <p className='text-lavender-grey leading-relaxed relative z-10'>
              Each agent maintains full sovereignty over their personal data
              within NEXUS. You may access, modify, or request deletion of your
              identity records at any time through the Command Dashboard under
              your assigned clearance level permissions.
            </p>
          </motion.section>
        </div>

        {/* Footer Note */}
        <div className='text-center pt-10 border-t border-lavender-grey/10'>
          <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-lavender-grey/20'>
            NEXUS Privacy Protocol v2.0.4 // Last System Sync: April 2026
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
