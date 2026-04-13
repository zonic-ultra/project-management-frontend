/**
 * Add/Edit Task Page Component
 *
 * A dual-purpose interface for initializing new objectives or
 * modifying existing ones. Handles form validation and interfaces
 * with the ApiService for data persistence.
 */
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import ApiService from "../../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Shield } from "lucide-react";

const AddEditTaskPage = () => {
  const { id } = useParams();
  const [task_name, setTaskName] = useState("");
  const [contents, setContents] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [project_id, setProjectId] = useState("");
  const [user_id, setUserId] = useState("");
  const [taskStatus, setTaskStatus] = useState("TODO");
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, membersRes] = await Promise.all([
          ApiService.getAllProjects(),
          ApiService.getAllMembers(),
        ]);

        if (projectsRes.status === 200) setProjects(projectsRes.data || []);
        if (membersRes.status === 200) setMembers(membersRes.data || []);

        if (id) {
          setIsEditing(true);
          const taskRes = await ApiService.getTaskById(id);
          if (taskRes.status === 200) {
            const taskData = taskRes.data || taskRes.task;
            setTaskName(taskData.task_name);
            setContents(taskData.contents);
            setDueDate(taskData.dueDate);
            setProjectId(taskData.project_id);
            setUserId(taskData.user_id);
            setTaskStatus(taskData.taskStatus);
          }
        }
      } catch (error) {
        showMessage("Error initializing mission parameters: " + error);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      task_name,
      contents,
      dueDate,
      project_id,
      user_id,
      taskStatus,
    };

    try {
      if (isEditing && id) {
        await ApiService.updateTask(id, taskData);
        showMessage("Objective updated successfully");
        setTimeout(() => navigate("/tasks"), 1500);
      } else {
        await ApiService.addTask(taskData);
        showMessage("Objective initialized successfully");
        setTimeout(() => navigate("/tasks"), 1500);
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error saving task: " + error,
      );
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      {message && (
        <div className='fixed top-8 right-8 z-50 p-4 rounded-xl bg-dusk-blue/10 border border-dusk-blue/20 text-dusk-blue text-sm font-bold shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4'>
          {message}
        </div>
      )}

      <div className='max-w-2xl mx-auto space-y-8'>
        <button
          onClick={() => navigate("/tasks")}
          className='flex items-center gap-2 text-lavender-grey hover:text-dusk-blue transition-colors group'
        >
          <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
          Back to Matrix
        </button>

        <div className='p-8 rounded-3xl bg-prussian-blue/50 backdrop-blur-xl border border-lavender-grey/10 shadow-2xl relative overflow-hidden'>
          <div className='absolute -top-24 -right-24 w-48 h-48 bg-dusk-blue/5 rounded-full blur-3xl' />

          <div className='relative z-10'>
            <div className='flex items-center gap-4 mb-8'>
              <div className='p-3 rounded-xl bg-dusk-blue/10 text-dusk-blue'>
                <Shield className='w-6 h-6' />
              </div>
              <div>
                <h1 className='text-2xl font-black text-alabaster-grey tracking-tight'>
                  {isEditing ? "Modify Objective" : "Initialize Objective"}
                </h1>
                <p className='text-lavender-grey text-sm'>
                  Define mission-critical parameters
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='text-xs font-bold uppercase tracking-widest text-dusk-blue/60 ml-1'>
                    Objective Name
                  </label>
                  <input
                    type='text'
                    value={task_name}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                    className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 px-4 text-alabaster-grey placeholder:text-lavender-grey/10 focus:outline-none focus:border-dusk-blue/50 transition-all'
                    placeholder='e.g. System Overhaul'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='text-xs font-bold uppercase tracking-widest text-dusk-blue/60 ml-1'>
                    Deadline
                  </label>
                  <input
                    type='date'
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 px-4 text-alabaster-grey focus:outline-none focus:border-dusk-blue/50 transition-all [color-scheme:dark]'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='text-xs font-bold uppercase tracking-widest text-dusk-blue/60 ml-1'>
                    Strategic Initiative (Project)
                  </label>
                  {/* <select
                    value={project_id}
                    onChange={(e) => setProjectId(e.target.value)}
                    required
                    className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 px-4 text-alabaster-grey focus:outline-none focus:border-dusk-blue/50 transition-all appearance-none cursor-pointer'
                  >
                    <option value=''>Select Initiative</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.project_name || p.name}
                      </option>
                    ))}
                  </select> */}
                  <select
                    value={project_id}
                    onChange={(e) => setProjectId(e.target.value)} // keep as string for React
                    required
                    className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 px-4 text-alabaster-grey focus:outline-none focus:border-dusk-blue/50 transition-all appearance-none cursor-pointer'
                  >
                    <option value=''>Select Initiative</option>
                    {projects.map((p) => (
                      <option key={p.project_id} value={p.project_id}>
                        {" "}
                        {/* value must be the numeric ID */}
                        {p.project_name || p.name || `Project ${p.project_id}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='space-y-2'>
                  <label className='text-xs font-bold uppercase tracking-widest text-dusk-blue/60 ml-1'>
                    Assigned Agent
                  </label>
                  <select
                    value={user_id}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 px-4 text-alabaster-grey focus:outline-none focus:border-dusk-blue/50 transition-all appearance-none cursor-pointer'
                  >
                    <option value=''>Select Agent</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-bold uppercase tracking-widest text-dusk-blue/60 ml-1'>
                  Task Status
                </label>
                <select
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  required
                  className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 px-4 text-alabaster-grey focus:outline-none focus:border-dusk-blue/50 transition-all appearance-none cursor-pointer'
                >
                  <option value='TODO'>Pending</option>
                  <option value='IN_PROGRESS'>In Progress</option>
                  <option value='DONE'>Completed</option>
                </select>
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-bold uppercase tracking-widest text-dusk-blue/60 ml-1'>
                  Mission Contents
                </label>
                <textarea
                  value={contents}
                  onChange={(e) => setContents(e.target.value)}
                  required
                  rows={4}
                  className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 px-4 text-alabaster-grey placeholder:text-lavender-grey/10 focus:outline-none focus:border-dusk-blue/50 transition-all resize-none'
                  placeholder='Detailed mission objectives and technical requirements...'
                />
              </div>

              <button
                type='submit'
                className='w-full py-4 mt-4 bg-gradient-to-r from-dusk-blue to-lavender-grey text-white font-black rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(65,90,119,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-2'
              >
                <Save className='w-4 h-4' />
                {isEditing ? "Commit Changes" : "Initialize Objective"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddEditTaskPage;
