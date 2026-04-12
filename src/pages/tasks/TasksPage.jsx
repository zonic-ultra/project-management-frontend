/**
 * Task List Page Component (Task Matrix)
 *
 * The central hub for managing mission objectives. Features advanced
 * filtering by status and real-time search. Users can update task
 * statuses directly from the matrix.
 */
import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  User,
  Briefcase,
} from "lucide-react";
import { SearchBar, Pagination } from "../../components/DataControls";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const isAdmin = ApiService.isAdmin();

  const getTasks = useCallback(async () => {
    try {
      const responseData = await ApiService.getAllTasks();
      if (responseData.status === 200) {
        setTasks(responseData.data || []);
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Getting Tasks: " + error,
      );
    }
  }, []);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleDeleteTask = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this task? ")) {
        await ApiService.deleteTask(id);
        window.location.reload();
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Deleting Task: " + error,
      );
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ApiService.updateTaskStatus(id, newStatus);
      setTasks(
        tasks.map((t) => (t.id === id ? { ...t, taskStatus: newStatus } : t)),
      );
      showMessage("Status updated successfully");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error updating status: " + error,
      );
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const taskName = task.task_name || task.name || "";
    const username = task.username || task.assignedUser || "";
    const matchesSearch =
      taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      (task.taskStatus || task.status) === statusFilter;
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
        <div className='fixed top-8 right-8 z-50 p-4 rounded-xl bg-dusk-blue/10 border border-dusk-blue/20 text-dusk-blue text-sm font-bold shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4'>
          {message}
        </div>
      )}

      <div className='space-y-8'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-4xl font-black text-alabaster-grey tracking-tight'>
              Task Matrix
            </h1>
            <p className='text-lavender-grey mt-1'>
              Manage and track mission-critical objectives
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => navigate("/tasks/create")}
              className='flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-dusk-blue to-lavender-grey text-white font-bold rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(65,90,119,0.4)] transition-all active:scale-95'
            >
              <Plus className='w-5 h-5' />
              Add task
            </button>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }}
              placeholder='Search objectives or agents...'
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
              <option value='COMPLETED'>Completed</option>
            </select>
          </div>
        </div>

        <div className='grid gap-4'>
          {currentItems.length > 0 ? (
            currentItems.map((task) => (
              <div
                key={task.id}
                className='group p-6 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10 hover:border-dusk-blue/40 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6'
              >
                <div className='flex items-start gap-4'>
                  <div
                    className={`mt-1 p-2 rounded-xl ${
                      (task.taskStatus || task.status) === "COMPLETED"
                        ? "bg-green-400/10 text-green-400"
                        : (task.taskStatus || task.status) === "IN_PROGRESS"
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-yellow-400/10 text-yellow-400"
                    }`}
                  >
                    {(task.taskStatus || task.status) === "COMPLETED" ? (
                      <CheckCircle2 className='w-5 h-5' />
                    ) : (task.taskStatus || task.status) === "IN_PROGRESS" ? (
                      <Clock className='w-5 h-5' />
                    ) : (
                      <AlertCircle className='w-5 h-5' />
                    )}
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-alabaster-grey group-hover:text-dusk-blue transition-colors'>
                      {task.task_name || task.name}
                    </h3>
                    <div className='flex flex-wrap items-center gap-4 mt-2 text-xs font-bold uppercase tracking-widest text-lavender-grey/20'>
                      <span className='flex items-center gap-1.5'>
                        <User className='w-3 h-3' />
                        {task.username || task.assignedUser}
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
                      {task.contents || task.description}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <select
                    value={task.taskStatus || task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value)
                    }
                    className='bg-ink-black border border-lavender-grey/10 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest text-lavender-grey focus:outline-none focus:border-dusk-blue/50 transition-all cursor-pointer'
                  >
                    <option value='TODO'>Pending</option>
                    <option value='IN_PROGRESS'>In Progress</option>
                    <option value='COMPLETED'>Completed</option>
                  </select>

                  {isAdmin && (
                    <div className='flex items-center gap-2 ml-4'>
                      <button
                        onClick={() => navigate(`/tasks/update/${task.id}`)}
                        className='p-2 text-lavender-grey/20 hover:text-dusk-blue hover:bg-dusk-blue/10 rounded-lg transition-all'
                      >
                        <Edit2 className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className='p-2 text-lavender-grey/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-20 bg-prussian-blue/20 rounded-3xl border border-dashed border-lavender-grey/10'>
              <p className='text-lavender-grey/20 font-bold uppercase tracking-widest'>
                No tasks found in matrix
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
    </Layout>
  );
};

export default TasksPage;
