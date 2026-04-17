import React, { useState, useEffect, useCallback, useMemo } from "react";
import Layout from "../../components/Layout";
import ApiService from "../../service/ApiService";
import {
  Trash2,
  User,
  Shield,
  Eye,
  Users,
  X,
  Mail,
  Calendar,
  LoaderCircle,
} from "lucide-react";
import { SearchBar, Pagination } from "../../components/DataControls";

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);

  // DELETE MODAL STATES
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMemberForDelete, setSelectedMemberForDelete] = useState(null);

  const membersPerPage = 10;

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const responseData = await ApiService.getAllMembers();
      if (responseData.status === 200) {
        setMembers(responseData.data || []);
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Loading Members: " + error,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleDelete = (member) => {
    setSelectedMemberForDelete(member);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await ApiService.deleteMember(selectedMemberForDelete.id);
      loadMembers();
      showMessage("Member access terminated successfully.");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Deleting Member: " + error,
      );
    } finally {
      setShowDeleteModal(false);
      setSelectedMemberForDelete(null);
    }
  };

  const openViewModal = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        member.name?.toLowerCase().includes(search.toLowerCase()) ||
        member.username?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [members, search]);

  const indexOfLast = currentPage * membersPerPage;
  const indexOfFirst = indexOfLast - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirst, indexOfLast);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
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
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='text-center sm:text-left'>
            <h1 className='text-4xl font-black text-alabaster-grey tracking-tight flex items-center justify-center sm:justify-start gap-3'>
              <Users className='text-dusk-blue' /> Members
            </h1>
            <p className='text-lavender-grey mt-2'>
              Registered users with system access
            </p>
          </div>

          <button
            onClick={loadMembers}
            disabled={loading}
            className='relative group p-2'
          >
            <div className='absolute inset-0 bg-gradient-to-r from-dusk-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            {loading ? (
              <LoaderCircle className='w-4 h-4 text-green-400 animate-spin' />
            ) : (
              <LoaderCircle className='w-4 h-4 opacity-0' />
            )}
          </button>
        </div>

        {/* SEARCH */}
        <div className='max-w-xl mx-auto'>
          <SearchBar
            searchTerm={search}
            setSearchTerm={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            placeholder='Search members by name or email...'
          />
        </div>

        {/* TABLE */}
        <div className='overflow-x-auto rounded-3xl border border-lavender-grey/10 bg-prussian-blue/30 backdrop-blur-xl shadow-2xl'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-ink-black/50 border-b border-lavender-grey/10'>
                <th className='px-6 py-4 text-xs font-black uppercase tracking-widest text-lavender-grey/40'>
                  Member ID
                </th>
                <th className='px-6 py-4 text-xs font-black uppercase tracking-widest text-lavender-grey/40'>
                  Full Name
                </th>
                <th className='px-6 py-4 text-xs font-black uppercase tracking-widest text-lavender-grey/40'>
                  Email
                </th>
                <th className='px-6 py-4 text-xs font-black uppercase tracking-widest text-lavender-grey/40'>
                  Role
                </th>
                <th className='px-6 py-4 text-xs font-black uppercase tracking-widest text-lavender-grey/40 text-center'>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className='divide-y divide-lavender-grey/5'>
              {currentMembers.map((member) => (
                <tr
                  key={member.id}
                  className='hover:bg-dusk-blue/5 transition-colors'
                >
                  <td className='px-6 py-4 text-sm font-mono text-dusk-blue/60'>
                    {member.id}
                  </td>

                  <td className='px-6 py-4 flex items-center gap-3'>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        member.role === "ADMIN"
                          ? "bg-dusk-blue/10 text-dusk-blue"
                          : "bg-lavender-grey/5 text-lavender-grey/40"
                      }`}
                    >
                      {member.role === "ADMIN" ? (
                        <Shield className='w-4 h-4' />
                      ) : (
                        <User className='w-4 h-4' />
                      )}
                    </div>
                    <span className='text-sm font-bold text-alabaster-grey'>
                      {member.name}
                    </span>
                  </td>

                  <td className='px-6 py-4 text-sm text-lavender-grey'>
                    {member.username}
                  </td>

                  <td className='px-6 py-4'>
                    <span className='text-[9px] font-black uppercase px-2 py-0.5 rounded bg-lavender-grey/5 text-lavender-grey/40'>
                      {member.role === "ADMIN" ? "Administrator" : "Member"}
                    </span>
                  </td>

                  <td className='px-6 py-4'>
                    <div className='flex justify-center gap-2'>
                      <button
                        onClick={() => openViewModal(member)}
                        className='p-2 text-lavender-grey/20 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all'
                      >
                        <Eye className='w-4 h-4' />
                      </button>

                      {member.role !== "ADMIN" && (
                        <button
                          onClick={() => handleDelete(member)}
                          className='p-2 text-lavender-grey/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          itemsPerPage={membersPerPage}
          totalItems={filteredMembers.length}
          currentPage={currentPage}
          paginate={changePage}
        />
      </div>

      {/* VIEW MODAL (UNCHANGED EXACTLY — NO DESIGN CHANGE) */}
      {selectedMember && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
          <div className='bg-prussian-blue/95 border border-lavender-grey/20 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl'>
            <div className='flex items-center justify-between px-6 py-5 border-b border-lavender-grey/10'>
              <div className='flex items-center gap-3'>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    selectedMember.role === "ADMIN"
                      ? "bg-dusk-blue/10 text-green-400"
                      : "bg-lavender-grey/10 text-lavender-grey"
                  }`}
                >
                  {selectedMember.role === "ADMIN" ? (
                    <Shield className='w-5 h-5' />
                  ) : (
                    <User className='w-5 h-5' />
                  )}
                </div>
                <div>
                  <h2 className='text-xl font-bold text-alabaster-grey'>
                    {selectedMember.name}
                  </h2>
                  <p className='text-xs text-lavender-grey/60 font-mono'>
                    ID: {selectedMember.id}
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                className='p-2 text-lavender-grey/40 hover:text-alabaster-grey hover:bg-lavender-grey/10 rounded-xl'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='p-6 space-y-6'>
              <div className='flex items-center gap-3 text-sm'>
                <Mail className='w-5 h-5 text-lavender-grey' />
                <div>
                  <p className='text-lavender-grey/60 text-xs'>EMAIL</p>
                  <p className='text-alabaster-grey'>
                    {selectedMember.username}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 text-sm'>
                <Shield className='w-5 h-5 text-lavender-grey' />
                <div>
                  <p className='text-lavender-grey/60 text-xs'>ROLE</p>

                  <span
                    className={`text-[10px] font-black uppercase rounded-full ${
                      selectedMember.role === "ADMIN"
                        ? " text-green-400"
                        : "bg-lavender-grey/10 text-lavender-grey"
                    }`}
                  >
                    {selectedMember.role === "ADMIN" ? "ADMIN" : "MEMBER"}
                  </span>
                </div>
              </div>

              {selectedMember.createdAt && (
                <div className='flex items-center gap-3 text-sm'>
                  <Calendar className='w-5 h-5 text-lavender-grey' />
                  <div>
                    <p className='text-lavender-grey/60 text-xs'>JOINED</p>
                    <p className='text-alabaster-grey'>
                      {new Date(selectedMember.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className='px-6 py-4 border-t border-lavender-grey/10 flex justify-end'>
              <button
                onClick={closeModal}
                className='px-6 py-2 text-sm font-bold uppercase text-lavender-grey hover:text-alabaster-grey'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL (NEW ONLY) */}
      {showDeleteModal && selectedMemberForDelete && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-black/80 backdrop-blur-sm'>
          <div className='w-full max-w-sm p-8 rounded-3xl bg-prussian-blue border border-red-400/10 shadow-2xl text-center'>
            <Trash2 className='w-8 h-8 text-red-400 mx-auto mb-4' />
            <h3 className='text-l font-black text-alabaster-grey'>
              Delete this member?
            </h3>
            <p className='text-lavender-grey mt-2'>
              This action cannot be undone:
              <br />
              <strong className='block mt-1'>
                "{selectedMemberForDelete.name}"
              </strong>
            </p>

            <div className='flex gap-3 mt-8'>
              <button
                onClick={() => setShowDeleteModal(false)}
                className='flex-1 py-2 bg-lavender-grey/5 hover:bg-lavender-grey/15 text-lavender-grey font-black rounded-2xl'
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className='flex-1 py-2 bg-red-400 hover:bg-red-500 text-white font-black rounded-2xl'
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

export default MembersPage;
