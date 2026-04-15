import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Briefcase } from "lucide-react";
import ApiService from "../../service/ApiService";

const AddEditProjectPage = () => {
  const navigate = useNavigate();
  const { project_id } = useParams(); // /update/:id

  const [message, setMessage] = useState("");

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  // FIXED STATE (matches UI)
  const [project_name, setProjectName] = useState("");
  const [project_description, setProjectDescription] = useState("");

  const isEditing = Boolean(project_id);

  // LOAD DATA (EDIT MODE ONLY)
  useEffect(() => {
    if (!project_id) return;
    const loadProject = async () => {
      try {
        const result = await ApiService.getProjectById(project_id);
        const data = result.data;

        setProjectName(data?.project_name || "");
        setProjectDescription(data?.project_description || "");
      } catch (err) {
        showMessage("Error loading project: " + err);
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
        showMessage("Project updated successfully.");
      } else {
        await ApiService.createProject(projectData);
        showMessage("Project created successfully.");
      }

      setTimeout(() => navigate("/projects"), 1500);
    } catch (error) {
      showMessage("Failed to save project: " + error);
    }
  };

  return (
    <Layout>
      {/* MESSAGE */}
      {message && (
        <div className='fixed top-8 right-8 z-50 p-4 rounded-xl bg-dusk-blue/10 border border-dusk-blue/20 text-dusk-blue text-sm font-bold shadow-2xl backdrop-blur-xl'>
          {message}
        </div>
      )}

      <div className='max-w-2xl mx-auto space-y-8'>
        {/* BACK BUTTON (UI SAME) */}
        <button
          onClick={() => navigate("/projects")}
          className='flex items-center gap-2 text-lavender-grey hover:text-dusk-blue transition-colors group'
        >
          <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
          Back to Projects
        </button>

        {/* CARD (UI SAME) */}
        <div className='p-8 rounded-3xl bg-prussian-blue/50 backdrop-blur-xl border border-lavender-grey/10 shadow-2xl relative overflow-hidden'>
          <div className='absolute -bottom-24 -left-24 w-48 h-48 bg-lavender-grey/5 rounded-full blur-3xl' />

          <div className='relative z-10'>
            {/* HEADER (UI SAME) */}
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

              {/* BUTTON (UI SAME) */}
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
