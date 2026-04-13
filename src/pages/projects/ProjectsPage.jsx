import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit2, Briefcase, CirclePlus } from "lucide-react";
import { SearchBar, Pagination } from "../../components/DataControls";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const isAdmin = ApiService.isAdmin();

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  // =========================
  // LOAD PROJECTS
  // =========================
  const getProjects = useCallback(async () => {
    try {
      const responseData = await ApiService.getAllProjects();
      if (responseData.status === 200) {
        setProjects(responseData.data || []);
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Getting Projects: " + error,
      );
    }
  }, []);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  // =========================
  // DELETE PROJECT
  // =========================
  const handleDeleteProject = async (id) => {
    try {
      if (window.confirm("Are you sure you want to archive this initiative?")) {
        await ApiService.deleteProject(id);
        getProjects();
        showMessage("Project archived successfully.");
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Deleting Project: " + error,
      );
    }
  };

  // =========================
  // SEARCH FILTER (FIXED)
  // =========================
  const filteredProjects = projects.filter((project) => {
    const name = project.project_name?.toLowerCase() || "";
    const description = project.project_description?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return name.includes(search) || description.includes(search);
  });

  // =========================
  // PAGINATION
  // =========================
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      {message && (
        <div className='fixed top-8 right-8 z-50 p-4 rounded-xl bg-dusk-blue/10 border border-dusk-blue/20 text-dusk-blue text-sm font-bold shadow-2xl backdrop-blur-xl'>
          {message}
        </div>
      )}

      <div className='space-y-8'>
        {/* HEADER */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-4xl font-black text-alabaster-grey tracking-tight'>
              Projects
            </h1>
            <p className='text-lavender-grey mt-1'>
              Strategic oversight of all active Nexus operations
            </p>
          </div>

          {isAdmin && (
            // <button
            //   onClick={() => navigate("/projects/create")}
            //   className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-dusk-blue to-lavender-grey text-white rounded-2xl'
            // >
            //   <CirclePlus className='w-6 h-6' />
            //   New project
            // </button>
            <button
              onClick={() => navigate("/projects/create")}
              className='flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-dusk-blue to-lavender-grey text-white font-bold rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(65,90,119,0.4)] transition-all active:scale-95'
            >
              <CirclePlus className='w-5 h-5' />
              Add Project
            </button>
          )}
        </div>

        {/* SEARCH (FIXED) */}
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={(val) => {
                setSearchTerm(val);
                setCurrentPage(1); // ✅ FIX: reset page on search
              }}
              placeholder='Search project by name or briefing...'
            />
          </div>
        </div>

        {/* PROJECT CARDS */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {currentItems.length > 0 ? (
            currentItems.map((project) => (
              <div
                key={project.project_id}
                className='p-6 rounded-2xl bg-prussian-blue/30'
              >
                <h3 className='text-xl font-bold text-alabaster-grey'>
                  {project.project_name || "Untitled Project"}
                </h3>

                <p className='text-sm text-lavender-grey'>
                  {project.project_description || "No description available"}
                </p>

                <div className='flex justify-between mt-4'>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className='p-2 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all'
                  >
                    View
                  </button>

                  {isAdmin && (
                    <div className='flex gap-5'>
                      <button
                        className='p-2 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all'
                        onClick={() =>
                          navigate(`/projects/update/${project.project_id}`)
                        }
                      >
                        <Edit2 />
                      </button>

                      <button
                        className='p-2 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all'
                        onClick={() => handleDeleteProject(project.project_id)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-20 bg-prussian-blue/20 rounded-3xl border border-dashed border-lavender-grey/10'>
              <p className='text-lavender-grey/20 font-bold uppercase tracking-widest'>
                No projects found
              </p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredProjects.length}
          currentPage={currentPage}
          paginate={handlePageChange}
        />
      </div>
      {/* Intelligence Brief Modal */}
      {selectedProject && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4'>
          <div
            className='absolute inset-0 bg-ink-black/80 backdrop-blur-md'
            onClick={() => setSelectedProject(null)}
          />
          <div className='relative w-full max-w-lg p-8 rounded-3xl bg-prussian-blue border border-dusk-blue/20 shadow-[0_0_50px_rgba(65,90,119,0.1)] animate-in zoom-in-95 duration-300 overflow-hidden'>
            {/* Decorative background element */}
            <div className='absolute -top-24 -right-24 w-48 h-48 bg-dusk-blue/5 rounded-full blur-3xl pointer-events-none' />

            <div className='relative z-10'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-12 h-12 rounded-2xl bg-dusk-blue/10 flex items-center justify-center border border-dusk-blue/20'>
                  <Briefcase className='w-6 h-6 text-dusk-blue' />
                </div>
                <div>
                  <h2 className='text-2xl font-black text-alabaster-grey tracking-tight'>
                    {selectedProject.project_name ||
                      selectedProject.name ||
                      "Untitled Project"}
                  </h2>
                  <p className='text-[10px] font-black uppercase tracking-[0.2em] text-dusk-blue'>
                    Mission Intelligence Brief
                  </p>
                </div>
              </div>

              <div className='space-y-6'>
                <div className='p-6 rounded-2xl bg-ink-black/50 border border-lavender-grey/10'>
                  <h4 className='text-[10px] font-black uppercase tracking-widest text-lavender-grey/30 mb-3'>
                    Strategic Description
                  </h4>
                  <p className='text-lavender-grey text-sm leading-relaxed'>
                    {selectedProject.project_description ||
                      selectedProject.description ||
                      "No description provided for this initiative."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className='w-full mt-8 py-4 bg-dusk-blue/10 text-dusk-blue font-black rounded-xl hover:bg-dusk-blue/20 transition-all uppercase tracking-[0.2em] text-[10px] border border-dusk-blue/20 active:scale-[0.98]'
              >
                Close Briefing
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProjectPage;
