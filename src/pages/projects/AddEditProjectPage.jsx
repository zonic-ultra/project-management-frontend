import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Briefcase } from "lucide-react";
import ApiService from "../../service/ApiService";

const AddEditProjectPage = () => {
  const navigate = useNavigate();
  const { project_id } = useParams();

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(100); // 100% = full bar

  const showMessage = (msg, success = false) => {
    setMessage(msg);
    setIsSuccess(success);
    setProgress(100);

    // Start shrinking after a tiny delay
    setTimeout(() => {
      setProgress(0);
    }, 50);

    // Remove message after the bar finishes (now slower)
    setTimeout(() => {
      setMessage("");
      setIsSuccess(false);
      setProgress(100);
    }, 5500); // ← Changed from 4300 to 5500ms (5.5 seconds)
  };

  const [project_name, setProjectName] = useState("");
  const [project_description, setProjectDescription] = useState("");

  const isEditing = Boolean(project_id);

  // LOAD DATA
  useEffect(() => {
    if (!project_id) return;
    const loadProject = async () => {
      try {
        const result = await ApiService.getProjectById(project_id);
        const data = result.data;

        setProjectName(data?.project_name || "");
        setProjectDescription(data?.project_description || "");
      } catch (err) {
        showMessage("Error loading project: " + err, false);
      }
    };

    loadProject();
  }, [project_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      project_name,
      project_description,
    };

    try {
      if (isEditing) {
        await ApiService.updateProject(project_id, projectData);
        showMessage("Project updated successfully.", true);
      } else {
        await ApiService.createProject(projectData);
        showMessage("Project created successfully.", true);
      }

      setTimeout(() => navigate("/projects"), 1500);
    } catch (error) {
      showMessage("Failed to save project: " + error, false);
    }
  };

  return (
    <Layout>
      {/* MESSAGE */}
      {message && (
        <div
          className={`fixed left-1/2 -translate-x-1/2 z-[9999] 
      w-[90%] max-w-md px-5 py-4 rounded-2xl text-sm  
      shadow-2xl backdrop-blur-2xl overflow-hidden
      ${
        isSuccess
          ? "bg-green-500/20 border-green-400/30 text-white"
          : "bg-red-500/20 border-red-400/30 text-white"
      }`}
          style={{
            // This is the key fix — adjust the number based on your navbar height
            top: "70px", // ← Change this value
            // Fallback for devices with notch/status bar
            marginTop: "env(safe-area-inset-top, 0px)",
          }}
        >
          <div className='flex items-start gap-3'>
            <div className='text-2xl flex-shrink-0 mt-0.5'>
              {isSuccess ? "✅" : "⚠️"}
            </div>

            <div className='flex-1'>
              <p className='leading-tight'>{message}</p>

              {/* Progress Bar */}
              <div className='h-1 bg-white/30 rounded-full overflow-hidden mt-3'>
                <div
                  className={`h-full rounded-full transition-all ease-linear
              ${isSuccess ? "bg-green-300" : "bg-red-300"}`}
                  style={{
                    width: `${progress}%`,
                    opacity: progress > 5 ? 1 : 0,
                    transitionDuration: progress === 100 ? "0ms" : "1600ms",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='max-w-2xl mx-auto space-y-8'>
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/projects")}
          className='flex items-center gap-2 text-lavender-grey hover:text-dusk-blue transition-colors group'
        >
          <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
          Back to Projects
        </button>

        {/* CARD */}
        <div className='p-8 rounded-3xl bg-prussian-blue/50 backdrop-blur-xl border border-lavender-grey/10 shadow-2xl relative overflow-hidden'>
          <div className='absolute -bottom-24 -left-24 w-48 h-48 bg-lavender-grey/5 rounded-full blur-3xl' />

          <div className='relative z-10'>
            {/* HEaDER */}
            <div className='flex items-center gap-4 mb-8'>
              <div className='p-3 rounded-xl bg-dusk-blue/10 text-dusk-blue'>
                <Briefcase className='w-6 h-6' />
              </div>

              <div>
                <h1 className='text-2xl font-black text-alabaster-grey tracking-tight'>
                  {isEditing ? "Edit Project" : "Create Project"}
                </h1>
                <p className='text-lavender-grey text-sm'>
                  Fill in the project details below
                </p>
              </div>
            </div>

            {/* FORM (UI SAME) */}
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* NAME */}
              <div className='space-y-2'>
                <label className='text-xs font-bold uppercase tracking-widest text-dusk-blue/60 ml-1'>
                  Project Title
                </label>
                <input
                  type='text'
                  value={project_name}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 px-4 text-alabaster-grey placeholder:text-lavender-grey/10 focus:outline-none focus:border-dusk-blue/50 transition-all'
                  placeholder='e.g. Project E-commerce Revamp...'
                />
              </div>

              {/* DESCRIPTION */}
              <div className='space-y-2'>
                <label className='text-xs font-bold uppercase tracking-widest text-dusk-blue/60 ml-1'>
                  Project Description
                </label>
                <textarea
                  value={project_description}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  required
                  rows={5}
                  className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 px-4 text-alabaster-grey placeholder:text-lavender-grey/10 focus:outline-none focus:border-dusk-blue/50 transition-all resize-none'
                  placeholder='Describe the purpose and goals of this project...'
                />
              </div>

              {/* BUTTON */}
              <button
                type='submit'
                className='w-full py-4 mt-4 bg-gradient-to-r from-dusk-blue to-lavender-grey text-white font-black rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(65,90,119,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-2'
              >
                <Save className='w-4 h-4' />
                {isEditing ? "Save Changes" : "Create Project"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddEditProjectPage;
