/**
 * Dashboard Page Component
 *
 * Provides a high-level overview of the Nexus system. Displays key
 * performance indicators (KPIs), real-time activity feeds, and
 * system health metrics using futuristic UI elements.
 */
import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
import ApiService from "../../service/ApiService";
import {
  Users,
  CheckSquare,
  Briefcase,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    users: 0,
    tasks: 0,
    projects: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTotal = (result) => {
    if (result.status !== "fulfilled") return 0;

    const response = result.value;
    if (typeof response === "number") return response;
    if (response?.data !== undefined) {
      const data = response.data;
      if (typeof data === "number") return data;
      if (data?.total !== undefined) return data.total;
      if (data?.count !== undefined) return data.count;
      if (typeof data === "string") return parseInt(data, 10) || 0;
    }
    if (response?.total !== undefined) return response.total;
    if (response?.count !== undefined) return response.count;
    if (typeof response === "string") return parseInt(response, 10) || 0;

    return 0;
  };

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersRes, tasksRes, projectsRes, allTasksRes, logsRes] =
        await Promise.allSettled([
          ApiService.getTotalMembers(),
          ApiService.getTotalTasks(),
          ApiService.getTotalProjects(),
          ApiService.getAllTasks(),
          ApiService.getAllChangeLogs(),
        ]);

      const usersTotal = getTotal(usersRes);
      const tasksTotal = getTotal(tasksRes);
      const projectsTotal = getTotal(projectsRes);

      const allTasks =
        allTasksRes.status === "fulfilled"
          ? allTasksRes.value?.data || allTasksRes.value || []
          : [];

      const allLogs =
        logsRes.status === "fulfilled"
          ? logsRes.value?.data || logsRes.value || []
          : [];

      const todo = allTasks.filter(
        (t) => (t.taskStatus || t.status) === "TODO",
      ).length;
      const inProgress = allTasks.filter(
        (t) => (t.taskStatus || t.status) === "IN_PROGRESS",
      ).length;
      const done = allTasks.filter(
        (t) => (t.taskStatus || t.status) === "DONE",
      ).length;

      const processedLogs = allLogs.slice(0, 8).map((log) => ({
        id: log.id,
        user: log.changeBy || "System",
        action: log.remarks || `Updated task status to ${log.newStatus}`,
        time: new Date(log.createdAt).toLocaleString(),
        status: log.newStatus,
      }));

      setActivities(processedLogs);

      setStats({
        users: usersTotal,
        tasks: tasksTotal,
        projects: projectsTotal,
        todo,
        inProgress,
        done,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to retrieve system intelligence.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      name: "Active Members",
      value: stats.users,
      icon: Users,
      color: "text-dusk-blue",
      bg: "bg-dusk-blue/10",
      desc: "Total registered members in the system",
    },
    {
      name: "Tasks",
      value: stats.tasks,
      icon: CheckSquare,
      color: "text-lavender-grey",
      bg: "bg-lavender-grey/10",
      desc: "Total tasks",
    },
    {
      name: "Projects",
      value: stats.projects,
      icon: Briefcase,
      color: "text-dusk-blue",
      bg: "bg-dusk-blue/10",
      desc: "Active strategic projects",
    },
    {
      name: "System Velocity",
      value: "94%",
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-400/10",
      desc: "Overall completion rate",
    },
  ];

  return (
    <Layout>
      <div className='space-y-10 pb-10'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
          <div className='flex items-center gap-4'>
            <div className='p-3 rounded-2xl bg-gradient-to-br from-dusk-blue to-lavender-grey shadow-[0_0_20px_rgba(65,90,119,0.3)]'>
              <Zap className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-4xl font-black text-alabaster-grey tracking-tight'>
                System Overview
              </h1>
              <p className='text-lavender-grey mt-1'>
                Live system status and activity overview
              </p>
            </div>
          </div>
          <button onClick={fetchStats} disabled={loading}>
            {loading ? (
              <Activity className='w-4 h-4 text-green-400 animate-spin' />
            ) : (
              <>
                <Activity className='w-4 h-4 opacity-0' />
              </>
            )}
          </button>
        </div>

        {error && (
          <div className='p-4 rounded-2xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-bold backdrop-blur-xl'>
            {error}
          </div>
        )}

        {/* Top Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className='p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10 hover:border-dusk-blue/40 transition-all duration-500 group relative overflow-hidden'
            >
              <div className='absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity'>
                <stat.icon className='w-20 h-20' />
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
              >
                <stat.icon className='w-6 h-6' />
              </div>
              <p className='text-lavender-grey text-xs font-bold uppercase tracking-widest mb-1'>
                {stat.name}
              </p>
              <h3 className='text-3xl font-black text-alabaster-grey'>
                {loading ? "..." : stat.value}
              </h3>
              <p className='text-[10px] text-lavender-grey/40 mt-2 font-medium'>
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Objective Status - FIXED thin bar when only 1 task */}
        <div className='p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10'>
          <h3 className='text-xl font-bold text-alabaster-grey mb-8 flex items-center gap-3'>
            <CheckSquare className='w-5 h-5 text-dusk-blue' />
            Task Status
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              {
                name: "Pending",
                value: stats.todo,
                color: "bg-yellow-400",
                text: "text-yellow-400",
              },
              {
                name: "In Progress",
                value: stats.inProgress,
                color: "bg-blue-400",
                text: "text-blue-400",
              },
              {
                name: "Completed",
                value: stats.done,
                color: "bg-green-400",
                text: "text-green-400",
              },
            ].map((status) => {
              // Calculate percentage
              let percentage =
                stats.tasks > 0 ? (status.value / stats.tasks) * 100 : 0;

              // STRONG FIX: If total tasks is 1, force the bar to be only 3% wide
              if (stats.tasks === 1 && status.value === 1) {
                percentage = 3;
              }

              return (
                <div key={status.name} className='space-y-4'>
                  <div className='flex justify-between text-sm font-bold'>
                    <span className='text-lavender-grey'>{status.name}</span>
                    <span className={status.text}>
                      {status.value} ({Math.round(percentage)}%)
                    </span>
                  </div>

                  <div className='h-3 w-full bg-ink-black rounded-full overflow-hidden'>
                    <div
                      className={`h-full ${status.color} transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Neural Activity Feed */}
        <div className='p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10'>
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-3'>
              <Activity className='w-5 h-5 text-dusk-blue' />
              <h3 className='text-xl font-bold text-alabaster-grey'>
                Recent Activity Log
              </h3>
            </div>
            <span className='text-[10px] font-bold uppercase tracking-widest text-dusk-blue bg-dusk-blue/10 px-3 py-1 rounded-full'>
              Live Changelog • Last 8 activities
            </span>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className='flex items-start gap-4 p-5 rounded-2xl bg-ink-black/30 border border-lavender-grey/10 group hover:bg-ink-black/50 hover:border-dusk-blue/30 transition-all duration-300'
                >
                  <div
                    className={`mt-1 p-2 rounded-lg ${
                      activity.status === "DONE"
                        ? "bg-green-400/10 text-green-400"
                        : activity.status === "IN_PROGRESS"
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-yellow-400/10 text-yellow-400"
                    }`}
                  >
                    <Activity className='w-4 h-4' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-alabaster-grey leading-relaxed'>
                      <span className='font-bold text-dusk-blue'>
                        {activity.user}
                      </span>
                      <span className='text-lavender-grey'> — </span>
                      <span className='text-lavender-grey/80 italic'>
                        "{activity.action}"
                      </span>
                    </p>
                    <div className='flex items-center gap-3 mt-2'>
                      <span className='text-[10px] text-lavender-grey/30 font-bold uppercase tracking-widest'>
                        {activity.time}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                          activity.status === "DONE"
                            ? "bg-green-400/10 text-green-400"
                            : activity.status === "IN_PROGRESS"
                              ? "bg-blue-400/10 text-blue-400"
                              : "bg-yellow-400/10 text-yellow-400"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='col-span-2 text-center py-10 text-lavender-grey/20 font-bold uppercase tracking-widest'>
                No recent activity detected in the Nexus core
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
