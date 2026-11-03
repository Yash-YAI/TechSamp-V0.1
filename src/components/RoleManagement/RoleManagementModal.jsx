import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Plus, Search, CheckCircle2, Users } from 'lucide-react';
import Swal from 'sweetalert2';
import { fetchRoles } from '../../api/users';
import { modulesConfig } from '../../config/modulesConfig';

export default function RoleManagementModal({ isOpen, onClose }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const loadRoleData = async () => {
      setLoading(true);
      try {
        const res = await fetchRoles();
        if (Array.isArray(res.data)) {
          setRoles(res.data);
          if (res.data.length > 0 && !selectedRole) {
            setSelectedRole(res.data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching roles:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadRoleData();
    }
  }, [isOpen, selectedRole]);

  if (!isOpen) return null;

  const filteredRoles = roles.filter((r) =>
    r.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find modules accessible by this role
  const accessibleModules = selectedRole
    ? modulesConfig.flatMap((section) =>
        section.items.filter(
          (item) =>
            !item.roles ||
            item.roles.length === 0 ||
            item.roles.includes(selectedRole)
        )
      )
    : [];

  const handleAddNewRole = () => {
    Swal.fire({
      title: 'Add New System Role',
      input: 'text',
      inputLabel: 'Role Name',
      inputPlaceholder: 'e.g. Quality Auditor',
      showCancelButton: true,
      confirmButtonText: 'Add Role',
      confirmButtonColor: '#3b82f6',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'Role name cannot be empty!';
        }
        if (roles.includes(value.trim())) {
          return 'Role already exists!';
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newRoleName = result.value.trim();
        setRoles((prev) => [newRoleName, ...prev]);
        setSelectedRole(newRoleName);
        Swal.fire({
          icon: 'success',
          title: 'Role Added',
          text: `Role "${newRoleName}" has been registered in the system.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-4 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                Role Management
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Define security roles and manage module permission assignments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body: Two-Column Split */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* Column 1: Roles List */}
          <div className="p-5 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/30 dark:bg-slate-850/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                System Roles ({roles.length})
              </span>
              <button
                onClick={handleAddNewRole}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
              >
                <Plus size={13} />
                <span>New</span>
              </button>
            </div>

            {/* Search filter */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            {/* Roles list */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredRoles.map((role) => {
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-750'
                    }`}
                  >
                    <span>{role}</span>
                    {isSelected && <CheckCircle2 size={14} className="text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2 & 3: Role Detail & Module Permissions */}
          <div className="col-span-2 p-8 overflow-y-auto flex flex-col justify-between">
            <div>
              {selectedRole ? (
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Active Role
                      </span>
                      <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-0.5">
                        {selectedRole}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      System Managed
                    </span>
                  </div>

                  {/* Modules with this role */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                      Accessible Modules ({accessibleModules.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {accessibleModules.map((mod, idx) => (
                        <div
                          key={mod.path || idx}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-850 flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 p-1 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                            <img
                              src={mod.image}
                              alt=""
                              className="w-full h-full object-cover rounded-md"
                              onError={(e) => (e.target.style.display = 'none')}
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {mod.titleKey?.replace(/^[^.]+\./, '')}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {mod.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-20 text-center text-slate-400">
                  Select a role from the left to view details
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

