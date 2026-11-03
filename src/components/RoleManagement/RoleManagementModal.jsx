import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  X,
  ShieldCheck,
  Users as UsersIcon,
  Tag,
  Search,
  ChevronLeft,
  ChevronRight,
  Settings,
  UserPlus,
  Shield,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  Filter,
  Grid3X3,
  List,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import apiClient from '../../api/client';
import { modulesConfig } from '../../config/modulesConfig';

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          currentPage === 1
            ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed'
            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 border border-gray-200 dark:border-slate-700 shadow-xs cursor-pointer'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
              page === currentPage
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 font-bold'
                : page === '...'
                ? 'bg-transparent text-gray-400 cursor-default'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 border border-gray-200 dark:border-slate-700 cursor-pointer'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          currentPage === totalPages
            ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed'
            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 border border-gray-200 dark:border-slate-700 shadow-xs cursor-pointer'
        }`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// User Card Component with Graceful Avatar Fallback
const UserCard = ({ user, size = 'normal' }) => {
  const [imgError, setImgError] = useState(false);
  const sizeClasses = { small: 'w-20', normal: 'w-28', large: 'w-32' };
  const imgSizes = { small: 'w-10 h-10', normal: 'w-14 h-14', large: 'w-16 h-16' };
  const initial = (user.name || user.eng_name || user.emp_id || 'U')[0].toUpperCase();

  return (
    <div className={`${sizeClasses[size]} shrink-0 group text-center`}>
      <div className="relative inline-block">
        {user.face_photo && !imgError ? (
          <img
            src={user.face_photo}
            alt={user.name}
            onError={() => setImgError(true)}
            className={`${imgSizes[size]} mx-auto rounded-full object-cover border-2 border-gray-200 dark:border-slate-700 group-hover:border-blue-400 transition-all duration-200 shadow-xs`}
          />
        ) : (
          <div
            className={`${imgSizes[size]} mx-auto rounded-full bg-gradient-to-tr from-purple-100 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs border-2 border-gray-200 dark:border-slate-700 shadow-xs`}
          >
            {initial}
          </div>
        )}
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-850" />
      </div>
      <div className="mt-1.5 text-center">
        <div className="text-[11px] font-bold text-gray-800 dark:text-gray-200 truncate font-mono">
          {user.emp_id}
        </div>
        <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
          {user.eng_name || user.name}
        </div>
      </div>
    </div>
  );
};

// Selectable User Card Component
const SelectableUserCard = ({ user, isSelected, onSelect }) => {
  const [imgError, setImgError] = useState(false);
  const initial = (user.name || user.eng_name || user.emp_id || 'U')[0].toUpperCase();

  return (
    <div
      className={`w-28 shrink-0 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-500 shadow-md shadow-blue-500/20'
          : 'bg-gray-50 dark:bg-slate-800 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-slate-700/60 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="relative">
        {user.face_photo && !imgError ? (
          <img
            src={user.face_photo}
            alt={user.name}
            onError={() => setImgError(true)}
            className={`w-14 h-14 mx-auto rounded-full object-cover transition-all duration-200 ${
              isSelected ? 'ring-4 ring-blue-400/50' : ''
            }`}
          />
        ) : (
          <div
            className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-purple-100 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-sm transition-all duration-200 ${
              isSelected ? 'ring-4 ring-blue-400/50' : ''
            }`}
          >
            {initial}
          </div>
        )}
        <div
          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
            isSelected
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800'
          }`}
        >
          {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate font-mono">
          {user.emp_id}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {user.eng_name || user.name}
        </div>
        <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
          {user.job_title}
        </div>
      </div>
    </div>
  );
};

// Job Title Group Card
const JobTitleGroupCard = ({ jobTitle, users }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-850 rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-2xs hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-slate-750">
      <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{jobTitle}</span>
      <span className="ml-auto bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">
        {users.length}
      </span>
    </div>
    <div className="flex flex-wrap gap-3">
      {users.map((user) => (
        <UserCard key={user.emp_id} user={user} size="small" />
      ))}
    </div>
  </div>
);

// Table Row Avatar Component
const TableUserAvatar = ({ user }) => {
  const [imgError, setImgError] = useState(false);
  const initial = (user.name || user.eng_name || user.emp_id || 'U')[0].toUpperCase();

  return (
    <div className="flex items-center gap-2.5">
      {user.face_photo && !imgError ? (
        <img
          src={user.face_photo}
          alt={user.name}
          onError={() => setImgError(true)}
          className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-slate-700 shadow-2xs shrink-0"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-[10px] border border-gray-200 dark:border-slate-700 shrink-0">
          {initial}
        </div>
      )}
      <span className="truncate">{user.name || 'N/A'}</span>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-t-xl transition-all duration-200 cursor-pointer ${
      active
        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-t-2 border-x border-blue-500 shadow-2xs -mb-px'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200'
    }`}
  >
    <Icon className={`w-4 h-4 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
    <span>{label}</span>
  </button>
);

// Automatically extract all unique roles mentioned in modulesConfig (including module names)
const extractRolesFromConfig = (config) => {
  const rolesSet = new Set();
  config.forEach((section) => {
    if (section.hidden) return;
    (section.items || []).forEach((item) => {
      if (Array.isArray(item.roles)) {
        item.roles.forEach((r) => {
          const trimmed = String(r).trim();
          if (trimmed) rolesSet.add(trimmed);
        });
      }
      const rawTitle = item.title || (item.titleKey ? item.titleKey.replace(/^(ts\.|nav\.|home\.)/, '') : '');
      if (rawTitle) {
        rolesSet.add(rawTitle.trim());
      }
    });
  });
  return Array.from(rolesSet);
};

const rolesFromConfig = extractRolesFromConfig(modulesConfig);

const getModulesForRole = (roleName, t) => {
  if (!roleName) return [];
  const normalizedRole = roleName.trim().toLowerCase();

  // Admin and Super Admin: in default allowed to all modules
  if (normalizedRole === 'admin' || normalizedRole === 'super admin') {
    const allModules = [];
    modulesConfig.forEach((section) => {
      if (section.hidden) return;
      section.items.forEach((item) => {
        const title = item.title || (item.titleKey ? t(item.titleKey, item.title || 'Module') : 'Module');
        if (!allModules.includes(title)) {
          allModules.push(title);
        }
      });
    });
    return allModules;
  }

  // Module-specific roles:
  const modules = [];
  modulesConfig.forEach((section) => {
    if (section.hidden) return;
    section.items.forEach((item) => {
      const itemTitle = (item.title || (item.titleKey ? t(item.titleKey, item.title || '') : '')).trim();
      const rawTitle = (item.title || (item.titleKey ? item.titleKey.replace(/^(ts\.|nav\.|home\.)/, '') : '')).trim();

      const matchesTitle = itemTitle.toLowerCase() === normalizedRole || rawTitle.toLowerCase() === normalizedRole;
      const matchesRoles = item.roles && item.roles.some((r) => r.trim().toLowerCase() === normalizedRole);

      if (matchesTitle || matchesRoles) {
        if (!modules.includes(itemTitle)) {
          modules.push(itemTitle);
        }
      }
    });
  });
  return modules;
};

export default function RoleManagementModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const [activeTab, setActiveTab] = useState('current');
  const [roles, setRoles] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedJobTitles, setSelectedJobTitles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [userRoles, setUserRoles] = useState(storedUser?.roles || []);
  const [filterRole, setFilterRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  // Search & Filter states for Current Roles
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [currentSearchType, setCurrentSearchType] = useState('role');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [moduleSearchQuery, setModuleSearchQuery] = useState('');
  const itemsPerPage = 5;

  // User Roles tab pagination
  const [userRolesPage, setUserRolesPage] = useState(1);
  const userRolesPerPage = 15;

  // Buyer Access Control states
  const [buyersList, setBuyersList] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState('');
  const [buyerUsersList, setBuyerUsersList] = useState([]);
  const [buyerSearchQuery, setBuyerSearchQuery] = useState('');
  const [selectedBuyerEmpIds, setSelectedBuyerEmpIds] = useState([]);
  const [buyerLoading, setBuyerLoading] = useState(false);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/api/role-management');
      const activeRolesList = (response.data || []).filter((r) => {
        const isSystem = r.role === 'Admin' || r.role === 'Super Admin';
        if (isSystem) return true;
        return rolesFromConfig.some((configRole) => configRole.toLowerCase() === r.role.toLowerCase());
      });
      setRoles(activeRolesList);
      setFilteredRoles(activeRolesList);
    } catch {
      setError('Failed to fetch roles from database');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchJobTitles = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/job-titles');
      setJobTitles(response.data || []);
    } catch {
      setError('Failed to fetch job titles');
    }
  }, []);

  const fetchUserRoles = useCallback(async () => {
    if (!storedUser?.emp_code && !storedUser?.emp_id) return;
    const empId = storedUser.emp_code || storedUser.emp_id;
    try {
      const response = await apiClient.get(`/api/user-roles/${empId}`);
      if (Array.isArray(response.data?.roles)) {
        setUserRoles(response.data.roles);
      }
    } catch (err) {
      console.error('Error fetching user roles:', err);
    }
  }, [storedUser]);

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      fetchJobTitles();
      fetchUserRoles();
    }
  }, [isOpen, fetchRoles, fetchJobTitles, fetchUserRoles]);

  const userAllRoles = useMemo(() => {
    return [
      ...(Array.isArray(userRoles) ? userRoles : []),
      ...(Array.isArray(storedUser?.roles) ? storedUser.roles : []),
      storedUser?.role,
    ]
      .filter(Boolean)
      .map((r) => String(r).trim().toLowerCase());
  }, [userRoles, storedUser]);

  const isSuperAdmin = useMemo(() => {
    return userAllRoles.some(
      (r) => r === 'super admin' || r.includes('super admin') || r.includes('superadmin') || r.includes('developer')
    );
  }, [userAllRoles]);

  const isAdmin = useMemo(() => {
    return isSuperAdmin || userAllRoles.some((r) => r === 'admin' || r.includes('admin'));
  }, [isSuperAdmin, userAllRoles]);

  // Search handler for Current Roles tab
  const handleCurrentSearch = useCallback(async () => {
    if (!currentSearchQuery.trim()) {
      setFilteredRoles(roles);
      setCurrentPage(1);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.get('/api/role-management/search', {
        params: { query: currentSearchQuery, type: currentSearchType },
      });
      const activeSearched = (response.data || []).filter((r) => {
        const isSystem = r.role === 'Admin' || r.role === 'Super Admin';
        if (isSystem) return true;
        return rolesFromConfig.some((configRole) => configRole.toLowerCase() === r.role.toLowerCase());
      });
      setFilteredRoles(activeSearched);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error searching roles:', err);
      setError('Failed to search roles');
    } finally {
      setIsLoading(false);
    }
  }, [currentSearchQuery, currentSearchType, roles]);

  useEffect(() => {
    if (!currentSearchQuery.trim()) {
      setFilteredRoles(roles);
      setCurrentPage(1);
      return;
    }

    const debounceTimer = setTimeout(() => {
      handleCurrentSearch();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [currentSearchQuery, currentSearchType, handleCurrentSearch, roles]);

  const visibleRoles = useMemo(
    () => filteredRoles.filter((r) => (r.users || []).length > 0 || (r.jobTitles || []).length > 0),
    [filteredRoles]
  );

  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return visibleRoles.slice(startIndex, startIndex + itemsPerPage);
  }, [visibleRoles, currentPage, itemsPerPage]);

  const totalCurrentPages = Math.ceil(visibleRoles.length / itemsPerPage);

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    const existingRole = roles.find((r) => r.role === role);
    if (existingRole) {
      setSelectedJobTitles(existingRole.jobTitles || []);
      const usersList = [];
      for (const title of existingRole.jobTitles || []) {
        try {
          const response = await apiClient.get('/api/users-by-job-title', { params: { jobTitle: title } });
          usersList.push(...(response.data || []).filter((u) => (u.working_status || 'WORKING').toUpperCase() === 'WORKING'));
        } catch (err) {
          console.error('Error fetching users for job title:', title, err);
        }
      }

      const matchingUsersMap = new Map(usersList.map((u) => [u.emp_id, u]));
      (existingRole.users || []).forEach((u) => {
        if (!matchingUsersMap.has(u.emp_id)) {
          usersList.push({
            emp_id: u.emp_id,
            name: u.eng_name || u.name,
            eng_name: u.eng_name,
            job_title: u.job_title,
            face_photo: u.face_photo,
            working_status: 'Working',
          });
        }
      });

      setMatchingUsers(usersList);
      setSelectedUsers((existingRole.users || []).map((u) => u.emp_id));
      setUserSuggestions([]);
      setIsEditing(true);
    } else {
      setSelectedJobTitles([]);
      setMatchingUsers([]);
      setSelectedUsers([]);
      setUserSuggestions([]);
      setIsEditing(false);
    }
  };

  const handleJobTitleSelect = async (title) => {
    if (!selectedJobTitles.includes(title)) {
      const newJobTitles = [...selectedJobTitles, title];
      setSelectedJobTitles(newJobTitles);
      try {
        const response = await apiClient.get('/api/users-by-job-title', { params: { jobTitle: title } });
        const workingUsers = (response.data || []).filter(
          (u) => (u.working_status || 'WORKING').toUpperCase() === 'WORKING'
        );
        setMatchingUsers((prev) => {
          const existingEmpIds = new Set(prev.map((u) => u.emp_id));
          const newUsers = workingUsers.filter((u) => !existingEmpIds.has(u.emp_id));
          return [...prev, ...newUsers];
        });
      } catch {
        setError('Failed to fetch users');
      }
    }
    setSearchQuery('');
  };

  const handleJobTitleRemove = (title) => {
    setSelectedJobTitles((prev) => prev.filter((t) => t !== title));
    const removedUsers = matchingUsers.filter((user) => user.job_title === title);
    setMatchingUsers((prev) => prev.filter((user) => user.job_title !== title));
    setSelectedUsers((prev) => prev.filter((empId) => !removedUsers.some((u) => u.emp_id === empId)));
  };

  // Debounced User Search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setUserSuggestions([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      try {
        setSearchingUsers(true);
        const response = await apiClient.get('/api/users/search', { params: { term: searchQuery } });
        setUserSuggestions(response.data || []);
      } catch (err) {
        console.error('Error searching users:', err);
      } finally {
        setSearchingUsers(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleUserSearchSelect = (u) => {
    setMatchingUsers((prev) => {
      const exists = prev.some((item) => item.emp_id === u.emp_id);
      if (exists) return prev;
      return [
        ...prev,
        {
          emp_id: u.emp_id,
          name: u.eng_name || u.name,
          eng_name: u.eng_name,
          job_title: u.job_title,
          face_photo: u.face_photo,
          working_status: 'Working',
        },
      ];
    });
    setSelectedUsers((prev) => (prev.includes(u.emp_id) ? prev : [...prev, u.emp_id]));
    if (u.job_title) {
      handleJobTitleSelect(u.job_title);
    } else {
      setSearchQuery('');
    }
    setUserSuggestions([]);
  };

  const handleUserSelect = (empId) => {
    setSelectedUsers((prev) => (prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]));
  };

  const handleSelectAll = () => {
    setSelectedUsers(matchingUsers.map((u) => u.emp_id));
  };

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    if (selectedUsers.length === 0 && !isEditing) {
      setError('Please select at least one user');
      return;
    }

    if (!isSuperAdmin && (selectedRole === 'Admin' || selectedRole === 'Super Admin')) {
      setError('Only Super Admin can assign or modify Admin and Super Admin roles.');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/api/role-management', {
        role: selectedRole,
        jobTitles: selectedJobTitles,
        selectedUsers: selectedUsers,
      });

      setSuccessMessage(isEditing ? 'Role updated successfully in TTS database!' : 'Role added successfully in TTS database!');
      fetchRoles();
      if (!isEditing) {
        setSelectedRole('');
        setSelectedJobTitles([]);
        setMatchingUsers([]);
        setSelectedUsers([]);
        setUserSuggestions([]);
      }
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save role');
    } finally {
      setIsLoading(false);
    }
  };

  // Download PDF Report
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);

    const pdfTitle = filterRole ? `${filterRole} Users Directory` : 'All System Roles Directory';
    doc.text(pdfTitle, 14, 22);

    const tableData = [];
    roles.forEach((role) => {
      if (filterRole && role.role !== filterRole) return;
      (role.users || [])
        .sort((a, b) => (a.emp_id || '').localeCompare(b.emp_id || ''))
        .forEach((u) => {
          tableData.push([
            role.role,
            u.name || 'N/A',
            u.emp_id || 'N/A',
            u.eng_name || 'N/A',
            u.job_title || 'N/A',
            u.dept_name || 'N/A',
          ]);
        });
    });

    const tableColumns = ['Role', 'User Name', 'Emp ID', 'Eng Name', 'Job Title', 'Department'];

    autoTable(doc, {
      head: [tableColumns],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { top: 30 },
    });

    doc.save(filterRole ? `${filterRole}_users.pdf` : 'All_roles_users.pdf');
  };

  // Dynamic available roles derived directly from modulesConfig
  const availableRoles = useMemo(() => {
    const rolesSet = new Set();
    rolesSet.add('Super Admin');
    rolesSet.add('Admin');
    rolesFromConfig.forEach((role) => {
      rolesSet.add(role);
    });
    return Array.from(rolesSet).sort();
  }, []);

  // Admin user CANNOT assign another admin or super admin!
  // Admin and Super Admin can ONLY be assigned by Super Admin!
  const assignableRoles = useMemo(() => {
    return availableRoles.filter((role) => {
      const normalized = role.trim().toLowerCase();
      if (normalized === 'super admin' || normalized === 'admin') {
        return isSuperAdmin;
      }
      return true;
    });
  }, [availableRoles, isSuperAdmin]);

  const sortedTableData = useMemo(() => {
    const data = [];
    roles.forEach((role) => {
      if (filterRole && role.role !== filterRole) return;
      (role.users || [])
        .sort((a, b) => (a.emp_id || '').localeCompare(b.emp_id || ''))
        .forEach((u) => {
          data.push({ role: role.role, user: u });
        });
    });
    return data;
  }, [roles, filterRole]);

  const paginatedUserRoles = useMemo(() => {
    const startIndex = (userRolesPage - 1) * userRolesPerPage;
    return sortedTableData.slice(startIndex, startIndex + userRolesPerPage);
  }, [sortedTableData, userRolesPage]);

  const totalUserRolesPages = Math.ceil(sortedTableData.length / userRolesPerPage);

  const getRoleColorScheme = (roleName) => {
    const normalized = (roleName || '').trim().toLowerCase();
    switch (normalized) {
      case 'admin':
      case 'super admin':
        return {
          bgLight: 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
          text: 'text-purple-700 dark:text-purple-300',
          iconBg: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
          circleBorder: 'border-purple-500',
        };
      default:
        return {
          bgLight: 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
          text: 'text-blue-700 dark:text-blue-300',
          iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
          circleBorder: 'border-blue-500',
        };
    }
  };

  const processedRoleModules = useMemo(() => {
    return availableRoles
      .map((roleName) => {
        const modulesList = getModulesForRole(roleName, t);
        const filteredModules = modulesList.filter((mod) =>
          mod.toLowerCase().includes(moduleSearchQuery.toLowerCase())
        );
        return {
          roleName,
          modulesList,
          filteredModules,
          hasModules: modulesList.length > 0,
        };
      })
      .filter(({ filteredModules }) => {
        if (moduleSearchQuery.trim()) {
          return filteredModules.length > 0;
        }
        return true;
      });
  }, [availableRoles, moduleSearchQuery, t]);

  // Buyer Groups Methods
  const fetchBuyers = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/buyer-groups/buyers');
      if (res.data?.success && Array.isArray(res.data.buyers)) {
        setBuyersList(res.data.buyers);
        if (res.data.buyers.length > 0 && !selectedBuyer) {
          setSelectedBuyer(res.data.buyers[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load buyers:', err);
    }
  }, [selectedBuyer]);

  const searchBuyerUsers = useCallback(async (searchVal = '') => {
    setBuyerLoading(true);
    try {
      const res = await apiClient.get('/api/buyer-groups/users', { params: { search: searchVal } });
      if (res.data?.success) {
        setBuyerUsersList(res.data.users || []);
      }
    } catch (err) {
      console.error('Failed to load buyer users:', err);
    } finally {
      setBuyerLoading(false);
    }
  }, []);

  const handleSaveBuyerGroup = async () => {
    if (!selectedBuyer) {
      setError('Please select a buyer first');
      return;
    }
    setBuyerLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await apiClient.post('/api/buyer-groups/save', {
        buyerName: selectedBuyer,
        empIds: selectedBuyerEmpIds,
      });
      if (res.data?.success) {
        setSuccessMessage(`Successfully updated users for ${selectedBuyer}`);
        searchBuyerUsers(buyerSearchQuery);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save buyer mapping');
    } finally {
      setBuyerLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'buyer-access') {
      fetchBuyers();
      searchBuyerUsers('');
    }
  }, [activeTab, fetchBuyers, searchBuyerUsers]);

  useEffect(() => {
    if (selectedBuyer && buyerUsersList.length > 0) {
      const alreadyAssigned = buyerUsersList
        .filter((u) => u.buyers && u.buyers.includes(selectedBuyer))
        .map((u) => u.emp_id);
      setSelectedBuyerEmpIds(alreadyAssigned);
    }
  }, [selectedBuyer, buyerUsersList]);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-4 flex flex-col max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left">
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-7 py-4 border-b border-gray-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-850">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Shield className="w-6 h-6 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                Role Management
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Manage user roles and permissions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 pt-3 border-b border-gray-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-850 flex gap-1 overflow-x-auto">
          <TabButton
            active={activeTab === 'current'}
            onClick={() => setActiveTab('current')}
            icon={Grid3X3}
            label="Current Roles"
          />
          <TabButton
            active={activeTab === 'add'}
            onClick={() => setActiveTab('add')}
            icon={UserPlus}
            label="Add/Update Role"
          />
          <TabButton
            active={activeTab === 'user-roles'}
            onClick={() => setActiveTab('user-roles')}
            icon={List}
            label="User Roles"
          />
          <TabButton
            active={activeTab === 'role-modules'}
            onClick={() => setActiveTab('role-modules')}
            icon={Shield}
            label="Role Modules"
          />
          <TabButton
            active={activeTab === 'buyer-access'}
            onClick={() => setActiveTab('buyer-access')}
            icon={Tag}
            label="Buyer Groups"
          />
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mx-6 mt-3 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError('')} className="p-1 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-3 p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl flex items-center gap-2 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab Body Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900">
          {/* ==================== CURRENT ROLES TAB ==================== */}
          {activeTab === 'current' && (
            <div>
              {/* Search Bar */}
              <div className="mb-6 flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search roles, employees, or job titles..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs"
                    value={currentSearchQuery}
                    onChange={(e) => setCurrentSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    className="px-3.5 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs cursor-pointer"
                    value={currentSearchType}
                    onChange={(e) => setCurrentSearchType(e.target.value)}
                  >
                    <option value="role">Search by Role</option>
                    <option value="emp_id">Search by Emp ID</option>
                    <option value="name">Search by Name</option>
                    <option value="job_title">Search by Job Title</option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                Showing {visibleRoles.length} of {roles.length} roles
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20 text-blue-600">
                  <Loader2 className="w-7 h-7 animate-spin" />
                  <span className="ml-2.5 text-xs text-gray-500 font-semibold">Loading roles...</span>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {paginatedRoles.map((role) => {
                      const usersByJobTitle = (role.users || []).reduce((acc, u) => {
                        const title = u.job_title || 'General';
                        if (!acc[title]) acc[title] = [];
                        acc[title].push(u);
                        return acc;
                      }, {});

                      return (
                        <div
                          key={role.role}
                          className="border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                          {/* Role Header */}
                          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <ShieldCheck className="w-5 h-5" />
                              <h3 className="text-base font-bold">{role.role}</h3>
                              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                {(role.users || []).length} users
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex gap-1.5 flex-wrap">
                                {(role.jobTitles || []).slice(0, 3).map((title) => (
                                  <span
                                    key={title}
                                    className="bg-white/20 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                                  >
                                    {title}
                                  </span>
                                ))}
                                {(role.jobTitles || []).length > 3 && (
                                  <span className="bg-white/30 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                                    +{(role.jobTitles || []).length - 3} more
                                  </span>
                                )}
                              </div>
                              {/* Edit Role Button: only Super Admin can edit Admin/Super Admin */}
                              {!isSuperAdmin && (role.role === 'Admin' || role.role === 'Super Admin') ? (
                                <span className="text-[11px] bg-white/20 text-white/90 font-semibold px-2.5 py-1 rounded-lg">
                                  Super Admin Only
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    handleRoleSelect(role.role);
                                    setActiveTab('add');
                                    setIsEditing(true);
                                  }}
                                  className="text-xs bg-white text-blue-600 hover:bg-blue-50 font-bold px-3 py-1 rounded-lg shadow-xs transition-colors cursor-pointer"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Available Modules Section */}
                          <div className="px-5 py-3 bg-blue-50/40 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-2">
                              <Settings className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Available Modules in Tech & Samp
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {getModulesForRole(role.role, t).map((module) => (
                                <span
                                  key={module}
                                  className="bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-1 rounded-lg border border-blue-100 dark:border-slate-700 font-medium shadow-2xs"
                                >
                                  {module}
                                </span>
                              ))}
                              {getModulesForRole(role.role, t).length === 0 && (
                                <span className="text-gray-400 text-xs italic">
                                  No modules assigned to this role in modulesConfig
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Users grouped by Job Title */}
                          <div className="p-4 bg-gray-50/70 dark:bg-slate-850/50 max-h-80 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {Object.entries(usersByJobTitle).map(([jobTitle, uList]) => (
                                <JobTitleGroupCard key={jobTitle} jobTitle={jobTitle} users={uList} />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalCurrentPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          )}

          {/* ==================== ADD/UPDATE ROLE TAB ==================== */}
          {activeTab === 'add' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <span>{isEditing ? 'Update Role Assignment' : 'Add New Role Assignment'}</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Select a role and assign job titles with their users
                </p>
              </div>

              <div className="space-y-5">
                {/* Role Selection */}
                <div className="bg-white dark:bg-slate-850 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2.5 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Select Role
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 text-sm font-medium cursor-pointer"
                    value={selectedRole}
                    onChange={(e) => handleRoleSelect(e.target.value)}
                  >
                    <option value="">-- Choose a Role --</option>
                    {assignableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {isEditing && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Editing existing role assignment (TTS Database)
                    </div>
                  )}
                  {selectedRole && (
                    <div className="mt-3 p-3.5 bg-blue-50/50 dark:bg-slate-850 rounded-xl border border-blue-100 dark:border-slate-700">
                      <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Settings className="w-3.5 h-3.5 text-blue-600" />
                        <span>Accessible Modules for {selectedRole}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getModulesForRole(selectedRole, t).map((module) => (
                          <span
                            key={module}
                            className="bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-1 rounded-lg border border-blue-100 dark:border-slate-700 font-medium shadow-2xs"
                          >
                            {module}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Job Titles & Users Search */}
                <div className="bg-white dark:bg-slate-850 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2.5 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    Job Titles & Users
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search job titles or type user ID/name..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchingUsers && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                      </div>
                    )}
                    {searchQuery && (
                      <div className="absolute z-30 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                        {/* Job Titles Section */}
                        {jobTitles.filter((title) =>
                          title.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length > 0 && (
                          <div>
                            <div className="px-4 py-1.5 bg-gray-100 dark:bg-slate-750 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Job Titles
                            </div>
                            {jobTitles
                              .filter((title) =>
                                title.toLowerCase().includes(searchQuery.toLowerCase())
                              )
                              .map((title) => (
                                <div
                                  key={title}
                                  className="px-5 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200"
                                  onClick={() => handleJobTitleSelect(title)}
                                >
                                  <Tag className="w-3.5 h-3.5 text-gray-400" />
                                  <span>{title}</span>
                                  {selectedJobTitles.includes(title) && (
                                    <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />
                                  )}
                                </div>
                              ))}
                          </div>
                        )}

                        {/* Users Section */}
                        {userSuggestions.length > 0 && (
                          <div>
                            <div className="px-4 py-1.5 bg-gray-100 dark:bg-slate-750 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-t border-gray-100 dark:border-slate-700">
                              Users (Matching ID or Name)
                            </div>
                            {userSuggestions.map((u) => (
                              <div
                                key={u.emp_id}
                                className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-2.5 text-xs"
                                onClick={() => handleUserSearchSelect(u)}
                              >
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                                  {(u.eng_name || u.name || 'U')[0].toUpperCase()}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-gray-800 dark:text-gray-100 truncate">
                                    {u.eng_name || u.name}
                                  </span>
                                  <span className="text-[10px] text-gray-500 font-mono">
                                    {u.emp_id} • {u.job_title}
                                  </span>
                                </div>
                                {selectedUsers.includes(u.emp_id) && (
                                  <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selected Job Titles Chips */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedJobTitles.map((title) => (
                      <span
                        key={title}
                        className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {title}
                        <X
                          className="w-3.5 h-3.5 cursor-pointer hover:text-red-500"
                          onClick={() => handleJobTitleRemove(title)}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Users Selection Grid */}
                <div className="bg-white dark:bg-slate-850 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <UsersIcon className="w-4 h-4 text-blue-600" />
                      Select Users
                      <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold ml-1.5">
                        {selectedUsers.length} / {matchingUsers.length}
                      </span>
                    </label>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <button
                        onClick={handleSelectAll}
                        className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={handleDeselectAll}
                        className="text-gray-500 hover:underline cursor-pointer"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-8 min-h-[220px] max-h-[340px] overflow-y-auto flex flex-col items-center justify-center bg-white dark:bg-slate-850">
                    {matchingUsers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        <UsersIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 stroke-1 mb-2" />
                        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                          Select job titles to see available users
                        </p>
                      </div>
                    ) : (
                      <div className="w-full flex flex-wrap gap-2.5 justify-start">
                        {matchingUsers.map((user) => (
                          <SelectableUserCard
                            key={user.emp_id}
                            user={user}
                            isSelected={selectedUsers.includes(user.emp_id)}
                            onSelect={() => handleUserSelect(user.emp_id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !selectedRole || (selectedUsers.length === 0 && !isEditing)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    isLoading || !selectedRole || (selectedUsers.length === 0 && !isEditing)
                      ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-75'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving to TTS Database...
                    </>
                  ) : (
                    <>{isEditing ? 'Update Role Assignment' : 'Add Role Assignment'}</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ==================== USER ROLES DIRECTORY TAB ==================== */}
          {activeTab === 'user-roles' && (
            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <List className="w-5 h-5 text-blue-600" />
                    <span>User Roles Directory</span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Complete list of all users and their assigned roles
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      className="px-3.5 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold cursor-pointer text-gray-800 dark:text-gray-100"
                      value={filterRole}
                      onChange={(e) => {
                        setFilterRole(e.target.value);
                        setUserRolesPage(1);
                      }}
                    >
                      <option value="">All Roles</option>
                      {roles.map((r) => (
                        <option key={r.role} value={r.role}>
                          {r.role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleDownloadPDF}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Entries count matching image */}
              <div className="mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
                Showing {paginatedUserRoles.length} of {sortedTableData.length} entries
              </div>

              {/* Table matching image 3 */}
              <div className="border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-5 py-3 text-left font-bold uppercase tracking-wider">Role</th>
                        <th className="px-5 py-3 text-left font-bold uppercase tracking-wider">User Name</th>
                        <th className="px-5 py-3 text-left font-bold uppercase tracking-wider">Emp ID</th>
                        <th className="px-5 py-3 text-left font-bold uppercase tracking-wider">Eng Name</th>
                        <th className="px-5 py-3 text-left font-bold uppercase tracking-wider">Job Title</th>
                        <th className="px-5 py-3 text-left font-bold uppercase tracking-wider">Department</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {paginatedUserRoles.map(({ role, user }, index) => {
                        const colors = getRoleColorScheme(role);
                        return (
                          <tr
                            key={`${role}-${user.emp_id}-${index}`}
                            className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="px-5 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full border-2 ${colors.circleBorder} inline-block shrink-0`} />
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{role}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-800 dark:text-gray-200">
                              <TableUserAvatar user={user} />
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap font-mono text-gray-700 dark:text-gray-300 font-medium">
                              {user.emp_id || 'N/A'}
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300">
                              {user.eng_name || 'N/A'}
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                              {user.job_title || 'N/A'}
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                              {user.dept_name || 'N/A'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <Pagination
                currentPage={userRolesPage}
                totalPages={totalUserRolesPages}
                onPageChange={setUserRolesPage}
              />
            </div>
          )}

          {/* ==================== ROLE MODULES TAB ==================== */}
          {activeTab === 'role-modules' && (
            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>Role Modules Mapping</span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Overview of which modules are accessible under each role
                  </p>
                </div>

                <div className="w-full md:w-72 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by module name..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                    value={moduleSearchQuery}
                    onChange={(e) => setModuleSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Table matching image 4 */}
              <div className="border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800 text-xs">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider w-1/4">
                          Role
                        </th>
                        <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">
                          Accessible Modules
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {processedRoleModules.map(({ roleName, filteredModules, modulesList }) => {
                        const colors = getRoleColorScheme(roleName);
                        return (
                          <tr key={roleName} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4 align-top whitespace-nowrap border-r border-gray-100 dark:border-slate-800">
                              <div className="flex items-start gap-2.5">
                                <span className={`w-3 h-3 rounded-full border-2 ${colors.circleBorder} mt-1 inline-block shrink-0`} />
                                <div>
                                  <span className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight block">
                                    {roleName}
                                  </span>
                                  <span className="text-[11px] text-gray-400 font-normal mt-0.5 block">
                                    {modulesList.length} {modulesList.length === 1 ? 'module' : 'modules'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-2">
                                {filteredModules.map((module) => (
                                  <span
                                    key={module}
                                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium shadow-2xs ${colors.bgLight} ${colors.text}`}
                                  >
                                    {module}
                                  </span>
                                ))}
                                {filteredModules.length === 0 && (
                                  <span className="text-gray-400 text-xs italic">No modules assigned</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== BUYER GROUPS TAB ==================== */}
          {activeTab === 'buyer-access' && (
            <div>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5 pb-5 border-b border-gray-100 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-indigo-600" />
                    Buyer Groups Access
                  </h2>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Map users to specific buyer groups in Tech & Samp
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="w-full sm:w-48">
                    <select
                      value={selectedBuyer}
                      onChange={(e) => setSelectedBuyer(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
                    >
                      <option value="">-- Choose Buyer --</option>
                      {buyersList.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative w-full sm:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="text"
                      placeholder="Search name, ID..."
                      className="w-full pl-8 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      value={buyerSearchQuery}
                      onChange={(e) => {
                        setBuyerSearchQuery(e.target.value);
                        searchBuyerUsers(e.target.value);
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSaveBuyerGroup}
                    disabled={buyerLoading || !selectedBuyer}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {buyerLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    Save Mapping
                  </button>
                </div>
              </div>

              {/* Buyer Users Table */}
              <div className="border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left w-12">
                          <input
                            type="checkbox"
                            checked={
                              buyerUsersList.length > 0 &&
                              buyerUsersList.every((u) => selectedBuyerEmpIds.includes(u.emp_id))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                const allIds = buyerUsersList.map((u) => u.emp_id);
                                setSelectedBuyerEmpIds(Array.from(new Set([...selectedBuyerEmpIds, ...allIds])));
                              } else {
                                const listIds = buyerUsersList.map((u) => u.emp_id);
                                setSelectedBuyerEmpIds(selectedBuyerEmpIds.filter((id) => !listIds.includes(id)));
                              }
                            }}
                            className="rounded text-blue-600"
                          />
                        </th>
                        <th className="px-4 py-3 text-left font-bold uppercase">Employee</th>
                        <th className="px-4 py-3 text-left font-bold uppercase">Job Title</th>
                        <th className="px-4 py-3 text-left font-bold uppercase">Department</th>
                        <th className="px-4 py-3 text-left font-bold uppercase">Assigned Buyers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {buyerUsersList.map((userObj) => {
                        const isChecked = selectedBuyerEmpIds.includes(userObj.emp_id);
                        return (
                          <tr key={userObj.emp_id} className={`hover:bg-slate-50 dark:hover:bg-slate-800 ${isChecked ? 'bg-blue-50/20' : ''}`}>
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedBuyerEmpIds([...selectedBuyerEmpIds, userObj.emp_id]);
                                  } else {
                                    setSelectedBuyerEmpIds(selectedBuyerEmpIds.filter((id) => id !== userObj.emp_id));
                                  }
                                }}
                                className="rounded text-blue-600 cursor-pointer"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-bold text-gray-800 dark:text-gray-100">
                              {userObj.eng_name || userObj.name} ({userObj.emp_id})
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                              {userObj.job_title || 'N/A'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                              {userObj.dept_name || 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {(userObj.buyers || []).map((b) => (
                                  <span key={b} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                                    {b}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
