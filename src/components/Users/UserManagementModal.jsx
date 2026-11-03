import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  X,
  Search,
  Plus,
  Download,
  Upload,
  ChevronDown,
  Edit2,
  Trash2,
  Shield,
  RefreshCw,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { fetchUsers, deleteUser } from '../../api/users';
import UserFormModal from './UserFormModal';

export default function UserManagementModal({ isOpen, onClose }) {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load users with server-side pagination to ensure instant 60fps responsiveness
  const loadUsers = useCallback(async (query = '', page = 1) => {
    setLoading(true);
    try {
      const res = await fetchUsers(query, page, 50);
      if (Array.isArray(res.data)) {
        setUsers(res.data);
        setTotalCount(res.total ?? res.data.length);
        setCurrentPage(res.page || 1);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Failed to load users from the database. Please verify backend is running.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load when modal opens
  useEffect(() => {
    if (isOpen) {
      loadUsers('', 1);
    }
  }, [isOpen, loadUsers]);

  // Debounced search: typing in the search box is instant, and queries execute after 350ms pause
  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed !== activeSearch) {
        setActiveSearch(trimmed);
        setCurrentPage(1);
        loadUsers(trimmed, 1);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput, isOpen, activeSearch, loadUsers]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    setActiveSearch(trimmed);
    setCurrentPage(1);
    loadUsers(trimmed, 1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearch('');
    setCurrentPage(1);
    loadUsers('', 1);
  };

  const handleOpenAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleOpenEditUser = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (user) => {
    const userId = user._id || user.id;
    const userName = user.name || user.eng_name || user.emp_code || 'this user';

    Swal.fire({
      title: 'Delete User?',
      text: `Are you sure you want to delete ${userName} (${user.emp_code || user.emp_id})? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-3xl border-2 border-red-500',
        confirmButton: 'rounded-full px-6 py-2 font-bold',
        cancelButton: 'rounded-full px-6 py-2 font-bold',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(userId);
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: `${userName} has been removed from the database.`,
            timer: 1500,
            showConfirmButton: false,
          });
          loadUsers(activeSearch, currentPage);
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: err.response?.data?.message || err.message || 'Could not delete user.',
          });
        }
      }
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
        <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-4 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left">
          {/* Top Bar with Title & Close */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                User Management
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage all registered users, credentials, and access roles
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Controls Bar: Search & Action Buttons (Matching Image 1) */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900">
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search here....."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                Search
              </button>
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  title="Clear search and return to working users"
                  className="p-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <RefreshCw size={14} />
                </button>
              )}
              {/* Working Status Default Badge */}
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 rounded-full border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                {activeSearch
                  ? `Search (${totalCount})`
                  : `Working Only (${totalCount})`}
              </span>
            </form>

            {/* Action Buttons (Import, Export, + Add User) */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() =>
                  Swal.fire({
                    icon: 'info',
                    title: 'Import Users',
                    text: 'Select an Excel or CSV file to batch import user accounts.',
                  })
                }
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                <Upload size={14} />
                <span>Import</span>
              </button>

              <div className="relative group">
                <button
                  type="button"
                  onClick={() =>
                    Swal.fire({
                      icon: 'success',
                      title: 'Exporting Users',
                      text: 'Exporting user dataset to Excel format...',
                      timer: 1500,
                      showConfirmButton: false,
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
                >
                  <Download size={14} />
                  <span>Export</span>
                  <ChevronDown size={13} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleOpenAddUser}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-md hover:shadow-lg"
              >
                <Plus size={15} />
                <span>+ Add User</span>
              </button>
            </div>
          </div>

          {/* User Table (Matching Image 1) */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-850/80 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-6">NAME</th>
                  <th className="py-3.5 px-6">FULL NAME</th>
                  <th className="py-3.5 px-6">DEPARTMENT</th>
                  <th className="py-3.5 px-6">STATUS</th>
                  <th className="py-3.5 px-6">CREATED AT</th>
                  <th className="py-3.5 px-6 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-400">
                      <div className="inline-block animate-spin rounded-full h-7 w-7 border-4 border-blue-500 border-t-transparent mb-3" />
                      <p className="font-semibold text-xs">Loading user accounts...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-400">
                      <p className="font-semibold text-sm">No user records found.</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {activeSearch
                          ? `No records matching "${activeSearch}". Try another name, code, or status.`
                          : 'No active users with Working status found.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isWorking = (u.working_status || 'WORKING').toUpperCase() === 'WORKING';
                    const empTag = u.emp_id || u.emp_code || '';

                    return (
                      <tr
                        key={u._id || u.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* NAME + AVATAR + EMP ID */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                              {u.face_photo && (
                                <img
                                  src={u.face_photo}
                                  alt={u.name || 'User'}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextElementSibling) {
                                      e.currentTarget.nextElementSibling.style.display = 'flex';
                                    }
                                  }}
                                />
                              )}
                              <span
                                style={{ display: u.face_photo ? 'none' : 'flex' }}
                                className="w-full h-full font-bold text-slate-600 dark:text-slate-300 text-sm items-center justify-center"
                              >
                                {(u.name || u.username || 'U')[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-100 leading-tight">
                                {u.name || u.username}
                              </p>
                              {empTag && (
                                <p className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                                  {empTag}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* FULL NAME (Khmer & English) */}
                        <td className="py-4 px-6">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                            {u.kh_name || u.name || '-'}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wide">
                            {u.eng_name || u.name || '-'}
                          </p>
                        </td>

                        {/* DEPARTMENT & SECTION */}
                        <td className="py-4 px-6">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                            {u.dept_name || '-'}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                            {u.sect_name || '-'}
                          </p>
                        </td>

                        {/* STATUS */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isWorking ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                            />
                            <span
                              className={`font-semibold capitalize text-xs ${
                                isWorking
                                  ? 'text-slate-700 dark:text-slate-200'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {u.working_status || 'Working'}
                            </span>
                          </div>
                        </td>

                        {/* CREATED AT */}
                        <td className="py-4 px-6 whitespace-nowrap text-slate-600 dark:text-slate-400 font-mono text-xs">
                          {formatDate(u.created_at || u.createdAt)}
                        </td>

                        {/* ACTION BUTTONS (Edit, Agent Access, Delete) */}
                        <td className="py-4 px-6 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEditUser(u)}
                              className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer shadow-xs"
                            >
                              Edit
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer shadow-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Bar with user count & pagination */}
          <div className="px-8 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div>
              Showing <span className="font-bold text-slate-800 dark:text-slate-200">{users.length}</span> of <span className="font-bold text-slate-800 dark:text-slate-200">{totalCount}</span> user accounts {activeSearch ? '(matching search)' : '(status: Working)'}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1 || loading}
                onClick={() => {
                  const prev = currentPage - 1;
                  setCurrentPage(prev);
                  loadUsers(activeSearch, prev);
                }}
                className="px-3 py-1 font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="font-semibold text-slate-600 dark:text-slate-300 px-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages || loading}
                onClick={() => {
                  const next = currentPage + 1;
                  setCurrentPage(next);
                  loadUsers(activeSearch, next);
                }}
                className="px-3 py-1 font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-1.5 font-bold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        userToEdit={selectedUser}
        onSuccess={() => loadUsers(activeSearch, currentPage)}
      />
    </>
  );
}

