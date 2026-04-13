/**
 * Changelog Page Component (Mission Audit Logs)
 *
 * Provides a comprehensive history of all status changes and mission
 * updates. Admins can monitor the progression of all objectives
 * through this centralized audit interface.
 */
import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
import ApiService from "../../service/ApiService";
import {
  History,
  Trash2,
  Clock,
  User,
  Hash,
  MessageSquare,
  //   AlertCircle,
  //   CheckCircle2,
} from "lucide-react";
import { SearchBar, Pagination } from "../../components/DataControls";
import { useNavigate } from "react-router-dom";

const ChangelogPage = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  const fetchLogs = useCallback(async () => {
    try {
      const response = await ApiService.getAllChangeLogs();
      if (response.status === 200) {
        setLogs(response.data || []);
      }
    } catch (error) {
      showMessage("Error retrieving audit logs: " + error);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleDeleteLog = async (id) => {
    if (!window.confirm("Are you sure you want to purge this audit entry?"))
      return;
    try {
      await ApiService.deleteChangeLog(id);
      setLogs(logs.filter((log) => log.id !== id));
      showMessage("Audit entry deleted successfully");
      navigate("/logs");
    } catch (error) {
      showMessage("Error deleting log: " + error);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const filteredLogs = logs.filter((log) => {
    const searchStr =
      `${log.changeBy} ${log.changedAt} ${log.remarks} ${log.newStatus} ${log.taskId}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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
              Mission Audit Logs
            </h1>
            <p className='text-lavender-grey mt-1'>
              Historical record of all strategic status transitions
            </p>
          </div>
          <div className='p-3 rounded-2xl bg-dusk-blue/10 border border-dusk-blue/20 text-dusk-blue'>
            <History className='w-8 h-8' />
          </div>
        </div>

        <div className='w-full'>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder='Search by agent, task ID, or remarks...'
          />
        </div>

        <div className='grid gap-4'>
          {currentItems.length > 0 ? (
            currentItems.map((log) => (
              <div
                key={log.id}
                className='group p-6 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10 hover:border-dusk-blue/40 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6'
              >
                <div className='flex-1 space-y-4'>
                  <div className='flex flex-wrap items-center gap-4'>
                    <div
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                        log.newStatus === "DONE"
                          ? "bg-green-400/10 text-green-400 border border-green-400/20"
                          : log.newStatus === "IN_PROGRESS"
                            ? "bg-blue-400/10 text-blue-400 border border-blue-400/20"
                            : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                      }`}
                    >
                      {log.newStatus}
                    </div>
                    <span className='flex items-center gap-1.5 text-xs font-bold text-lavender-grey/40'>
                      <Clock className='w-3 h-3' />
                      {formatDate(log.changedAt)}
                    </span>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 rounded-lg bg-ink-black/50 text-dusk-blue'>
                        <User className='w-4 h-4' />
                      </div>
                      <div>
                        <p className='text-[10px] uppercase tracking-widest text-lavender-grey/30 font-bold'>
                          Agent
                        </p>
                        <p className='text-sm font-bold text-alabaster-grey'>
                          {log.changeBy}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <div className='p-2 rounded-lg bg-ink-black/50 text-lavender-grey'>
                        <Hash className='w-4 h-4' />
                      </div>
                      <div>
                        <p className='text-[10px] uppercase tracking-widest text-lavender-grey/30 font-bold'>
                          Task ID
                        </p>
                        <p className='text-sm font-bold text-alabaster-grey'>
                          #{log.taskId}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start gap-3'>
                      <div className='p-2 rounded-lg bg-ink-black/50 text-lavender-grey mt-1'>
                        <MessageSquare className='w-4 h-4' />
                      </div>
                      <div>
                        <p className='text-[10px] uppercase tracking-widest text-lavender-grey/30 font-bold'>
                          Remarks
                        </p>
                        <p className='text-sm text-lavender-grey italic line-clamp-2'>
                          "{log.remarks}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteLog(log.id)}
                  className='p-3 text-lavender-grey/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all self-end md:self-center'
                  title='Purge Log Entry'
                >
                  <Trash2 className='w-5 h-5' />
                </button>
              </div>
            ))
          ) : (
            <div className='text-center py-20 bg-prussian-blue/20 rounded-3xl border border-dashed border-lavender-grey/10'>
              <p className='text-lavender-grey/20 font-bold uppercase tracking-widest'>
                No audit entries found in archives
              </p>
            </div>
          )}
        </div>

        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredLogs.length}
          currentPage={currentPage}
          paginate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </Layout>
  );
};

export default ChangelogPage;
