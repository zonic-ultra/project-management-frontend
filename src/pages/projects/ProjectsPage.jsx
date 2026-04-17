import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Edit2,
  Briefcase,
  CirclePlus,
  Eye,
  LoaderCircle,
} from "lucide-react";
import { SearchBar, Pagination } from "../../components/DataControls";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  // DELETE MODAL STATES
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProjectForDelete, setSelectedProjectForDelete] =
    useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const isAdmin = ApiService.isAdmin();

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const getProjects = useCallback(async () => {
    setLoading(true);
    try {
      const responseData = await ApiService.getAllProjects();
      if (responseData.status === 200) {
        setProjects(responseData.data || []);
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Getting Projects: " + error,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  // OPEN DELETE MODAL
  const openDeleteModal = (project) => {
    setSelectedProjectForDelete(project);
    setShowDeleteModal(true);
  };

  //  CONFIRM DELETE
  const handleDeleteProject = async () => {
    if (!selectedProjectForDelete) return;

    try {
      await ApiService.deleteProject(selectedProjectForDelete.project_id);
      getProjects();
      showMessage("Project deleted successfully.");
      setShowDeleteModal(false);
      setSelectedProjectForDelete(null);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to delete Project: " + error,
      );
    }
  };

  const filteredProjects = projects.filter((project) => {
    const name = project.project_name?.toLowerCase() || "";
    const description = project.project_description?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return name.includes(search) || description.includes(search);
  });

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
              Projects Management
            </h1>
            <p className='text-lavender-grey mt-1'>
              Strategic oversight of all active Nexus operations
            </p>
          </div>

          <div className='flex items-center gap-3'>
            {isAdmin && (
              <button
                onClick={() => navigate("/projects/create")}
                className='flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-dusk-blue to-lavender-grey text-white font-bold rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(65,90,119,0.4)] transition-all active:scale-95'
              >
                <CirclePlus className='w-5 h-5' />
                Create Project
              </button>
            )}

            <button className='ml-10' onClick={getProjects} disabled={loading}>
              {loading ? (
                <LoaderCircle className='w-4 h-4 text-green-400 animate-spin' />
              ) : (
                <LoaderCircle className='w-4 h-4 opacity-0' />
              )}
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }}
              placeholder='Search projects by name or description...'
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
                <h3 className='text-xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent'>
                  {project.project_name}
                </h3>

                <p className='text-sm text-lavender-grey mt-1'>
                  {project.project_description}
                </p>

                <div className='flex justify-between mt-4'>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className='p-2 text-lavender-grey/45 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all'
                  >
                    <Eye className='h-4 w-4' />
                  </button>

                  {isAdmin && (
                    <div className='flex gap-5'>
                      <button
                        className='p-2 text-lavender-grey/45 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all'
                        onClick={() =>
                          navigate(`/projects/update/${project.project_id}`)
                        }
                      >
                        <Edit2 className='h-4 w-4' />
                      </button>

                      {/* OPEN MODAL INSTEAD OF DIRECT DELETE */}
                      <button
                        className='p-2 text-lavender-grey/45 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all'
                        onClick={() => openDeleteModal(project)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-20 bg-prussian-blue/20 rounded-3xl border border-dashed border-lavender-grey/10'>
              <p className='text-lavender-grey/20 font-bold uppercase tracking-widest'>
                No projects available
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

      {/* VIEW MODAL */}
      {selectedProject && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4'>
          <div
            className='absolute inset-0 bg-ink-black/80 backdrop-blur-md'
            onClick={() => setSelectedProject(null)}
          />
          <div className='relative w-full max-w-lg p-8 rounded-3xl bg-prussian-blue border border-dusk-blue/20 shadow-[0_0_50px_rgba(65,90,119,0.1)] animate-in zoom-in-95 duration-300 overflow-hidden'>
            <div className='absolute -top-24 -right-24 w-48 h-48 bg-dusk-blue/5 rounded-full blur-3xl pointer-events-none' />

            <div className='relative z-10'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-12 h-12 rounded-2xl bg-dusk-blue/10 flex items-center justify-center border border-dusk-blue/20'>
                  <Briefcase className='w-6 h-6 text-dusk-blue' />
                </div>
                <div>
                  <h2 className='text-xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent'>
                    {selectedProject.project_name}
                  </h2>
                  <p className='text-[10px] font-black uppercase tracking-[0.2em] text-dusk-blue'>
                    Project Overview
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
                      "No description provided"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className='w-full mt-8 py-4 bg-dusk-blue/10 text-dusk-blue font-black rounded-xl hover:bg-dusk-blue/20 transition-all uppercase tracking-[0.2em] text-[10px] border border-dusk-blue/20 active:scale-[0.98]'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && selectedProjectForDelete && (
        <div className='fixed inset-0 z-[150] flex items-center justify-center p-4 bg-ink-black/80 backdrop-blur-sm'>
          <div className='w-full max-w-sm p-6 rounded-3xl bg-prussian-blue border border-red-400/10 shadow-2xl text-center'>
            <Trash2 className='w-8 h-8 text-red-400 mx-auto mb-4' />
            <h3 className='text-l font-black text-alabaster-grey'>
              Delete this project?
            </h3>
            <p className='text-lavender-grey mt-2'>
              This action cannot be undone:
              <br />
              <strong className='block mt-1'>
                "{selectedProjectForDelete.project_name}"
              </strong>
            </p>

            <div className='flex gap-3 mt-6'>
              <button
                onClick={() => setShowDeleteModal(false)}
                className='flex-1 py-2 bg-lavender-grey/5 hover:bg-lavender-grey/15 text-lavender-grey font-black rounded-2xl transition-colors'
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteProject}
                className='flex-1 py-2 bg-red-400 hover:bg-red-500 text-white font-black rounded-2xl transition-colors shadow-lg shadow-red-400/20'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProjectPage;
