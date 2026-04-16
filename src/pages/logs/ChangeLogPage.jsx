/**
 * Changelog Page Component (Mission Audit Logs)
 */
import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
import ApiService from "../../service/ApiService";
import {
  History,
  Trash2,
  User,
  Hash,
  MessageSquare,
  NotebookPen,
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
        const sortedLogs = (response.data || []).sort(
          (a, b) => new Date(b.changedAt) - new Date(a.changedAt),
        );
        setLogs(sortedLogs);
      }
    } catch (error) {
      showMessage("Error retrieving audit logs: " + error);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Re-sort logs whenever the logs array changes (e.g. after delete)
  useEffect(() => {
    if (logs.length > 0) {
      const sortedLogs = [...logs].sort(
        (a, b) => new Date(b.changedAt) - new Date(a.changedAt),
      );
      setLogs(sortedLogs);
    }
  }, [logs]);

  const handleDeleteLog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this log entry?"))
      return;
    try {
      await ApiService.deleteChangeLog(id);

      // Remove the deleted log and keep remaining logs sorted
      setLogs((prevLogs) =>
        prevLogs
          .filter((log) => log.id !== id)
          .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt)),
      );

      showMessage("Log deleted successfully");
      navigate("/logs");
    } catch (error) {
      showMessage("Failed to delete log: " + error);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const filteredLogs = logs.filter((log) => {
    const searchStr =
      `${log.changeBy || ""} ${log.taskName || ""} ${log.createdAt || ""} ${log.remarks || ""} ${log.newStatus || ""} ${log.taskId || ""}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleString("en-US", {
  //     month: "short",
  //     day: "numeric",
  //     hour: "numeric",
  //     minute: "2-digit",
  //   });
  // };

  return (
    <Layout>
      {message && (
        <div className='fixed top-8 right-8 z-50 p-4 rounded-xl bg-dusk-blue/10 border border-dusk-blue/20 text-dusk-blue text-sm font-bold shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4'>
          {message}
        </div>
      )}

      <div className='space-y-4'>
        {/* Header */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <h1 className='text-4xl font-black text-alabaster-grey tracking-tight'>
              Change Logs
            </h1>

            <div className='p-3 sm:p-4 rounded-3xl bg-dusk-blue/10 border border-dusk-blue/20 text-dusk-blue mr-1'>
              <History className='w-5 h-5 sm:w-6 sm:h-6' />
            </div>
          </div>

          <p className='text-lavender-grey text-sm sm:text-base mt-1'>
            History of task updates and changes
          </p>
        </div>

        {/* Search */}
        <div className='w-full'>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder='Search logs...'
          />
        </div>

        {/* Logs List */}
        <div className='grid gap-2'>
          {currentItems.length > 0 ? (
            currentItems.map((log) => (
              <div
                key={log.id}
                className='group p-2.5 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10 hover:border-dusk-blue/40 transition-all'
              >
                <div className='flex flex-col gap-1.5 ml-4 mt-1'>
                  {/* Status + Date */}
                  <div className='flex items-center gap-2'>
                    <div
                      className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full ${
                        log.newStatus === "DONE"
                          ? "bg-green-400/10 text-green-400"
                          : log.newStatus === "IN_PROGRESS"
                            ? "bg-blue-400/10 text-blue-400"
                            : "bg-yellow-400/10 text-yellow-400"
                      }`}
                    >
                      {log.newStatus}
                    </div>
                    <span className='text-[10px] text-lavender-grey/70'>
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "Unknown Date"}
                    </span>
                  </div>

                  {/* TASK NAME + TASK ID */}
                  <div className='flex flex-col lg:flex-row gap-3'>
                    {/* Task Name */}
                    <div className='flex items-start gap-2 flex-1'>
                      <div className='p-1 bg-ink-black/70 rounded text-lavender-grey mt-0.5'>
                        <NotebookPen className='w-3.5 h-3.5' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-[8px] uppercase tracking-widest text-lavender-grey/50'>
                          TASK
                        </p>
                        <p className='text-[13px] font-semibold text-lavender-grey/45 leading-none'>
                          {log.taskName}
                        </p>
                      </div>
                    </div>

                    {/* Task ID */}
                    <div className='flex items-start gap-2 lg:w-44'>
                      <div className='p-1 bg-ink-black/70 rounded text-lavender-grey mt-0.5'>
                        <Hash className='w-3.5 h-3.5' />
                      </div>
                      <div>
                        <p className='text-[8px] uppercase tracking-widest text-lavender-grey/50'>
                          ID
                        </p>
                        <p className='text-[10px] font-semibold text-lavender-grey/45 leading-none'>
                          {log.taskId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className='flex items-start gap-2 pl-0.5'>
                    <MessageSquare className='w-3.5 h-3.5 text-lavender-grey mt-1 flex-shrink-0' />
                    <p className='text-xs text-lavender-grey/45 italic line-clamp-1'>
                      {log.remarks || "No remarks"}
                    </p>
                  </div>
                </div>

                {/* Action By + Delete */}
                <div className='flex justify-between items-center mt-3 ml-4 pt-2 border-t border-lavender-grey/10'>
                  <div className='flex items-center gap-2'>
                    <User className='w-3.5 h-3.5 text-dusk-blue' />
                    <p className='text-sm font-semibold text-lavender-grey/45'>
                      {log.changeBy}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className='p-1.5 .-mr-1 text-lavender-grey/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg mr-4'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-8 bg-prussian-blue/20 rounded-3xl border border-dashed border-lavender-grey/10'>
              <p className='text-lavender-grey/30 text-sm font-bold'>
                No logs found
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
