import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
import ApiService from "../../service/ApiService";
import { Trash2, User, Shield, Edit2, Eye, Users } from "lucide-react";
import { SearchBar, Pagination } from "../../components/DataControls";
import { Link } from "react-router-dom";

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 10;

  const loadMembers = useCallback(async () => {
    try {
      const responseData = await ApiService.getAllMembers();
      if (responseData.status === 200) {
        setMembers(responseData.data || []);
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Loading Members: " + error,
      );
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleDelete = async (id) => {
    try {
      if (
        window.confirm("Are you sure you want to delete this member's access?")
      ) {
        await ApiService.deleteMember(id);
        loadMembers();
        showMessage("Member access terminated successfully.");
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Deleting Member: " + error,
      );
    }
  };

  // Filter + Pagination Logic
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.username.toLowerCase().includes(search.toLowerCase()),
  );

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
        <div className='fixed top-8 right-8 z-50 p-4 rounded-xl bg-dusk-blue/10 border border-dusk-blue/20 text-dusk-blue text-sm font-bold shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4'>
          {message}
        </div>
      )}

      <div className='space-y-8'>
        <div className='text-center'>
          <h1 className='text-4xl font-black text-alabaster-grey tracking-tight flex items-center justify-center gap-3'>
            <Users className='text-dusk-blue' /> Member Registry
          </h1>
          <p className='text-lavender-grey mt-2'>
            Authorized personnel with Nexus clearance
          </p>
        </div>

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
                  className='hover:bg-dusk-blue/5 transition-colors group'
                >
                  <td className='px-6 py-4 text-sm font-mono text-dusk-blue/60'>
                    {member.id}
                  </td>

                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
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
                    </div>
                  </td>

                  <td className='px-6 py-4 text-sm text-lavender-grey'>
                    {member.username}
                  </td>

                  <td className='px-6 py-4'>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                        member.role === "ADMIN"
                          ? "bg-dusk-blue/10 text-dusk-blue"
                          : "bg-lavender-grey/5 text-lavender-grey/40"
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>

                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-center gap-2'>
                      <Link
                        to={`/view_member/${member.id}`}
                        className='p-2 text-lavender-grey/20 hover:text-dusk-blue hover:bg-dusk-blue/10 rounded-lg transition-all'
                        title='View Profile'
                      >
                        <Eye className='w-4 h-4' />
                      </Link>

                      <Link
                        to={`/update_member/${member.id}`}
                        className='p-2 text-lavender-grey/20 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all'
                        title='Edit Agent'
                      >
                        <Edit2 className='w-4 h-4' />
                      </Link>

                      {member.role !== "ADMIN" && (
                        <button
                          onClick={() => handleDelete(member.id)}
                          className='p-2 text-lavender-grey/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all'
                          title='Terminate Access'
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

          {currentMembers.length === 0 && (
            <div className='text-center py-20'>
              <p className='text-lavender-grey/20 font-bold uppercase tracking-widest'>
                No agents found in registry
              </p>
            </div>
          )}
        </div>

        <Pagination
          itemsPerPage={membersPerPage}
          totalItems={filteredMembers.length}
          currentPage={currentPage}
          paginate={changePage}
        />
      </div>
    </Layout>
  );
};

export default MembersPage;
