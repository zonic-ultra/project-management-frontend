/**
 * Task List Page Component (Task Matrix)
 */
import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  User,
  Briefcase,
  CirclePlus,
  Activity, // ← Added
} from "lucide-react";
import { SearchBar, Pagination } from "../../components/DataControls";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); // ← Added for refresh button

  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  const itemsPerPage = 10;
  const navigate = useNavigate();
  const isAdmin = ApiService.isAdmin();

  const getTasks = useCallback(async () => {
    setLoading(true);
    try {
      const responseData = await ApiService.getAllTasks();
      setTasks(responseData?.data || responseData || []);
    } catch (error) {
      console.error(error);
      showMessage("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const openStatusModal = (task, value) => {
    setSelectedTask(task);
    setNewStatus(value || task.taskStatus);
    setRemarks("");
    setShowStatusModal(true);
  };

  const handleStatusChange = async () => {
    if (!selectedTask || !newStatus) return;

    try {
      await ApiService.updateTaskStatus(selectedTask.id, newStatus, remarks);

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === selectedTask.id
            ? { ...t, taskStatus: newStatus, status: newStatus }
            : t,
        ),
      );

      setShowStatusModal(false);
      setSelectedTask(null);
      setNewStatus("");
      setRemarks("");
      showMessage("Task status updated");
    } catch (error) {
      showMessage(error.response?.data?.message || "Unable to update status");
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    try {
      await ApiService.deleteTask(selectedTask.id);
      setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
      setShowDeleteModal(false);
      setSelectedTask(null);
      showMessage("Task deleted successfully");
    } catch (error) {
      showMessage(error.response?.data?.message || "Unable to delete task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const taskName = task.task_name || task.name || "";
    const username = task.username || task.assignedUser || "";
    const matchesSearch =
      taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || task.taskStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-4xl font-black text-alabaster-grey tracking-tight'>
              Tasks
            </h1>
            <p className='text-lavender-grey mt-1'>Manage and track tasks</p>
          </div>

          <div className='flex items-center gap-3'>
            {isAdmin && (
              <button
                onClick={() => navigate("/tasks/create")}
                className='flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-dusk-blue to-lavender-grey text-white font-bold rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(65,90,119,0.4)] transition-all active:scale-95'
              >
                <CirclePlus className='w-5 h-5' />
                Create Task
              </button>
            )}

            {/* Refresh Button - Only spinning Activity icon when loading */}
            <button className='ml-10' onClick={getTasks} disabled={loading}>
              {loading ? (
                <Activity className='w-4 h-4 text-green-400 animate-spin' />
              ) : (
                <>
                  <Activity className='w-4 h-4 opacity-0' />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search + Filter */}
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }}
              placeholder='Search tasks or users......'
            />
          </div>

          <div className='relative min-w-[200px]'>
            <Filter className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lavender-grey/20' />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className='w-full bg-prussian-blue/30 border border-lavender-grey/10 rounded-2xl py-3 pl-10 pr-4 text-alabaster-grey focus:outline-none focus:border-dusk-blue/50 transition-all appearance-none cursor-pointer font-bold text-xs uppercase tracking-widest'
            >
              <option value='ALL'>All Statuses</option>
              <option value='TODO'>Pending (TODO)</option>
              <option value='IN_PROGRESS'>In Progress</option>
              <option value='DONE'>Completed (DONE)</option>
            </select>
          </div>
        </div>

        {/* Task Cards */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {currentItems.length > 0 ? (
            currentItems.map((task) => {
              const currentStatus = task.taskStatus || task.status || "TODO";

              return (
                <div
                  key={task.id}
                  className='group p-6 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10 hover:border-dusk-blue/40 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6'
                >
                  <div className='flex items-start gap-4'>
                    <div
                      className={`mt-1 p-2 rounded-xl ${
                        currentStatus === "DONE"
                          ? "bg-green-400/10 text-green-400"
                          : currentStatus === "IN_PROGRESS"
                            ? "bg-blue-400/10 text-blue-400"
                            : "bg-yellow-400/10 text-yellow-400"
                      }`}
                    >
                      {currentStatus === "DONE" ? (
                        <CheckCircle2 className='w-5 h-5' />
                      ) : currentStatus === "IN_PROGRESS" ? (
                        <Clock className='w-5 h-5' />
                      ) : (
                        <AlertCircle className='w-5 h-5' />
                      )}
                    </div>

                    <div>
                      <h3 className='text-lg font-bold text-alabaster-grey group-hover:text-dusk-blue transition-colors'>
                        {task.task_name}
                      </h3>

                      <div className='flex flex-wrap items-center gap-4 mt-2 text-xs font-bold uppercase tracking-widest text-lavender-grey/45'>
                        <span className='flex items-center gap-1.5'>
                          <User className='w-3 h-3' />
                          {task.username}
                        </span>
                        <span className='flex items-center gap-1.5'>
                          <Briefcase className='w-3 h-3' />
                          {task.project_name}
                        </span>
                        <span className='flex items-center gap-1.5'>
                          <Clock className='w-3 h-3' />
                          {task.dueDate}
                        </span>
                      </div>

                      <p className='mt-3 text-sm text-lavender-grey/60 line-clamp-1 italic'>
                        {task.contents}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <select
                      value={currentStatus}
                      onChange={(e) => openStatusModal(task, e.target.value)}
                      className='bg-ink-black border border-lavender-grey/10 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest text-lavender-grey focus:outline-none focus:border-dusk-blue/50 transition-all cursor-pointer'
                    >
                      <option
                        className='bg-yellow-400/10 text-yellow-400'
                        value='TODO'
                      >
                        Pending
                      </option>
                      <option
                        className='bg-blue-400/10 text-blue-400'
                        value='IN_PROGRESS'
                      >
                        In Progress
                      </option>
                      <option
                        className='bg-green-400/10 text-green-400 '
                        value='DONE'
                      >
                        Completed
                      </option>
                    </select>

                    <div className='flex items-center gap-2'>
                      {isAdmin && (
                        <button
                          onClick={() => navigate(`/tasks/update/${task.id}`)}
                          className='p-2 text-lavender-grey/20 hover:text-dusk-blue hover:bg-dusk-blue/10 rounded-lg transition-all'
                          title='Edit Task'
                        >
                          <Edit2 className='w-4 h-4' />
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setShowDeleteModal(true);
                          }}
                          className='p-2 text-lavender-grey/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className='text-center py-20 bg-prussian-blue/20 rounded-3xl border border-dashed border-lavender-grey/10'>
              <p className='text-lavender-grey/20 font-bold uppercase tracking-widest'>
                No tasks available
              </p>
            </div>
          )}
        </div>

        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredTasks.length}
          currentPage={currentPage}
          paginate={handlePageChange}
        />
      </div>

      {/* STATUS MODAL */}
      {showStatusModal && selectedTask && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-black/80 backdrop-blur-sm'>
          <div className='w-full max-w-md p-8 rounded-3xl bg-prussian-blue border border-lavender-grey/10 shadow-2xl relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-dusk-blue/5 rounded-full blur-3xl' />

            <div className='relative z-10 space-y-6'>
              <div className='flex items-center gap-4'>
                <div className='p-3 rounded-xl bg-dusk-blue/10 text-dusk-blue'>
                  <Clock className='w-6 h-6' />
                </div>
                <div>
                  <h3 className='text-xl font-black text-alabaster-grey'>
                    Change Status:{" "}
                    <span className='text-dusk-blue'>{newStatus}</span>
                  </h3>
                  <h4 className='text-lg font-bold text-alabaster-grey'>
                    Task:{" "}
                    <span className='text-dusk-blue'>
                      {selectedTask.task_name}
                    </span>
                  </h4>
                </div>
              </div>

              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder='Add remarks (optional)...'
                className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-2xl py-4 px-5 text-alabaster-grey'
              />

              <div className='flex gap-3 pt-4'>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedTask(null);
                    setNewStatus("");
                  }}
                  className='flex-1 py-4 bg-lavender-grey/5 text-lavender-grey font-bold rounded-2xl'
                >
                  Cancel
                </button>

                <button
                  onClick={handleStatusChange}
                  className='flex-1 py-4 bg-dusk-blue text-white font-black rounded-2xl'
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && selectedTask && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-black/80 backdrop-blur-sm'>
          <div className='w-full max-w-sm p-8 rounded-3xl bg-prussian-blue border border-red-400/10 shadow-2xl text-center'>
            <Trash2 className='w-8 h-8 text-red-400 mx-auto mb-4' />
            <h3 className='text-l font-black text-alabaster-grey'>
              Delete this task?
            </h3>
            <p className='text-lavender-grey mt-2'>
              This action cannot be undone:
              <br />
              <strong className='block mt-1'>"{selectedTask.task_name}"</strong>
            </p>

            <div className='flex gap-3 mt-8'>
              <button
                onClick={() => setShowDeleteModal(false)}
                className='flex-1 py-2 bg-lavender-grey/5 hover:bg-lavender-grey/15 text-lavender-grey font-black rounded-2xl transition-colors'
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteTask}
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

export default TasksPage;
