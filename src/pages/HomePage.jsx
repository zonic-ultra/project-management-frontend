/**
 * Home Page Component
 *
 * The main landing page for the Nexus Collaboration System.
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import {
  Rocket,
  Shield,
  Zap,
  BarChart3,
  Users,
  Layers,
  Briefcase,
  CheckSquare,
} from "lucide-react";

const HomePage = () => {
  const [statsData, setStatsData] = useState({
    users: "0",
    tasks: "0",
    projects: "0",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const [usersRes, tasksRes, projectsRes] = await Promise.allSettled([
          ApiService.getTotalMembers(),
          ApiService.getTotalTasks(),
          ApiService.getTotalProjects(),
        ]);

        const getTotal = (result) => {
          if (result.status !== "fulfilled") return 0;
          const data = result.value;
          if (typeof data === "number") return data;
          if (data?.total !== undefined) return data.total;
          if (data?.count !== undefined) return data.count;
          if (typeof data === "string") return parseInt(data, 10) || 0;
          return 0;
        };

        setStatsData({
          users: getTotal(usersRes).toLocaleString(),
          tasks: getTotal(tasksRes).toLocaleString(),
          projects: getTotal(projectsRes).toLocaleString(),
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load system data.");
        setStatsData({ users: "12", tasks: "48", projects: "8" });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { label: "Members", value: statsData.users, icon: Users },
    { label: "Projects", value: statsData.projects, icon: Briefcase },
    { label: "Tasks", value: statsData.tasks, icon: CheckSquare },
  ];

  const features = [
    {
      icon: Rocket,
      title: "Collective Velocity",
      desc: "Helps teams work faster and stay in sync.",
    },
    {
      icon: Shield,
      title: "Secure System",
      desc: "Protects data with strong security rules.",
    },
    {
      icon: Zap,
      title: "Real-Time Sync",
      desc: "Keeps everything updated instantly across users.",
    },
    {
      icon: BarChart3,
      title: "Team Analytics",
      desc: "Shows clear insights about team work and progress.",
    },
    {
      icon: Users,
      title: "Member Management",
      desc: "Manages users, roles, and permissions in one place.",
    },
    {
      icon: Layers,
      title: "Flexible System",
      desc: "Adapts easily to how your team works.",
    },
  ];

  return (
    <Layout>
      <div className='relative overflow-hidden'>
        {/* Hero Section */}
        <section className='relative pt-10 pb-20 px-4'>
          <div className='max-w-7xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className='text-5xl md:text-8xl font-display font-bold mb-8 tracking-tight leading-[0.9] text-alabaster-grey'>
                Work Together Better With <br />
                <span className='bg-gradient-to-r from-dusk-blue via-lavender-grey to-dusk-blue bg-clip-text text-transparent animate-gradient'>
                  Nexus
                </span>
              </h2>

              <p className='text-xl md:text-2xl text-lavender-grey max-w-2xl mb-12 leading-relaxed font-light'>
                A modern system for team collaboration. Nexus helps you manage
                tasks, projects, and teamwork in one place.
              </p>

              {/* Stats Section with Rotating Light Effect */}
              <div className='max-w-5xl mx-auto mt-20'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-lavender-grey/10 border border-lavender-grey/10 rounded-3xl overflow-hidden shadow-2xl'>
                  {stats.map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className='p-8 bg-ink-black/40 backdrop-blur-sm text-center group hover:bg-prussian-blue/20 transition-all relative overflow-hidden'
                    >
                      <div className='flex justify-center mb-6 relative'>
                        <div className='relative w-12 h-12 flex items-center justify-center'>
                          <motion.div
                            className='absolute w-12 h-12 border border-dusk-blue/40 rounded-full'
                            style={{ borderTopColor: "#3b82f6" }}
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />

                          <motion.div
                            className='absolute w-12 h-12 border border-dusk-blue/20 rounded-full'
                            animate={{ rotate: -360 }}
                            transition={{
                              duration: 6,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />

                          <div className='relative z-10'>
                            <stat.icon className='w-7 h-7 text-dusk-blue' />
                          </div>
                        </div>
                      </div>

                      <h3 className='text-3xl font-display font-bold text-alabaster-grey mb-1 group-hover:scale-110 transition-transform duration-500'>
                        {loading ? "..." : stat.value}
                      </h3>
                      <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-lavender-grey/40 group-hover:text-lavender-grey/60 transition-colors'>
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {error && (
                  <p className='text-center text-red-400 text-sm mt-6'>
                    {error}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-20 px-4'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl font-bold mb-4 text-alabaster-grey'>
                Main Features
              </h2>
              <div className='w-20 h-1 bg-gradient-to-r from-dusk-blue to-lavender-grey mx-auto rounded-full'></div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className='p-8 bg-prussian-blue/30 border border-lavender-grey/10 rounded-3xl hover:border-dusk-blue/40 transition-all duration-300 group'
                >
                  <div className='w-14 h-14 bg-ink-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(13,27,42,0.3)]'>
                    <feature.icon className='w-7 h-7 text-dusk-blue' />
                  </div>
                  <h3 className='text-xl font-bold mb-3 text-alabaster-grey'>
                    {feature.title}
                  </h3>
                  <p className='text-lavender-grey leading-relaxed'>
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
