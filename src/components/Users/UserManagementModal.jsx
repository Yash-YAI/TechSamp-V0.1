import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Search,
  Plus,
  Bot,
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
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load all users from backend API
  const loadUsers = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const res = await fetchUsers(query);
      if (Array.isArray(res.data)) {
        setUsers(res.data);
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

  useEffect(() => {
    if (isOpen) {
      loadUsers(searchTerm);
    }
  }, [isOpen, loadUsers]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadUsers(searchTerm);
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
          loadUsers(searchTerm);
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

  const handleAgentAccess = (user) => {
    Swal.fire({
      icon: 'info',
      title: 'AI Agent Access',
      text: `AI Agent and Assistant permissions for ${user.name || user.emp_code} are active.`,
      confirmButtonColor: '#3b82f6',
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                Search
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    loadUsers('');
                  }}
                  className="p-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <RefreshCw size={14} />
                </button>
              )}
            </form>

            {/* Action Buttons (AI Agent Access, Import, Export, + Add User) */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() =>
                  Swal.fire({
                    icon: 'info',
                    title: 'AI Agent Access',
                    text: 'AI Agent access is enabled for authorized user roles.',
                  })
                }
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                <Bot size={15} />
                <span>AI Agent Access</span>
              </button>

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
                        Try searching by a different name, Employee Code, or ID.
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
                              {u.face_photo ? (
                                <img
                                  src={u.face_photo}
                                  alt={u.name || 'User'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="font-bold text-slate-600 dark:text-slate-300 text-sm">
                                  {(u.name || u.username || 'U')[0].toUpperCase()}
                                </span>
                              )}
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

                            {/* Agent Access Button */}
                            <button
                              onClick={() => handleAgentAccess(u)}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
                            >
                              Agent Access
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

          {/* Footer Bar with user count */}
          <div className="px-8 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing <span className="font-bold text-slate-800 dark:text-slate-200">{users.length}</span> user accounts
            </span>
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
        onSuccess={() => loadUsers(searchTerm)}
      />
    </>
  );
}

