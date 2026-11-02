import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import { useTheme } from "../context/ThemeContext";
import apiClient from "../api/client";
import { modulesConfig } from "../config/modulesConfig";
import HomeNavbar from "../components/HomePage/HomeNavbar";
import SectionColumn from "../components/HomePage/SectionColumn";
import ProfileModal from "../components/HomePage/ProfileModal";
import ManagementModal from "../components/HomePage/ManagementModal";

export default function HomePage({ user, onLogout }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [userRoles, setUserRoles] = useState(user?.roles || []);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [managementModal, setManagementModal] = useState({ open: false, type: 'user' });

  const searchInputRef = useRef(null);

  // Focus search input when search button in navbar is clicked
  const handleFocusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Sync roles if user updates
  useEffect(() => {
    if (user?.roles) {
      setUserRoles(user.roles);
    }
  }, [user]);

  // Read orders from API to calculate New Orders bubble count
  useEffect(() => {
    const fetchNewOrdersCount = async () => {
      try {
        const response = await apiClient.get('/api/production-orders');
        if (Array.isArray(response.data)) {
          const count = response.data.filter((o) => o.type === "New").length;
          setNewOrdersCount(count);
        }
      } catch {
        // Silently skip if endpoint is not provisioned
      }
    };
    fetchNewOrdersCount();
  }, []);

  // Translate section titles and items dynamically based on current language
  const resolveTitle = useCallback((key, fallback) => {
    if (!key) return fallback || "Module";
    if (key.startsWith("tech.") || key.startsWith("nav.") || key.startsWith("home.")) {
      const cleanKey = key.replace(/^[^.]+\./, "");
      return t(key, fallback || cleanKey);
    }
    return t(`tech.${key}`, fallback || key);
  }, [t]);

  const allSections = useMemo(() => {
    return modulesConfig
      .filter((section) => !section.hidden)
      .map((section) => ({
        id: section.id,
        title: resolveTitle(section.titleKey, section.id),
        items: section.items.map((item) => ({
          ...item,
          title: resolveTitle(item.titleKey, "Module"),
          badge: item.hasBadge ? (newOrdersCount > 0 ? newOrdersCount : null) : null,
        })),
      }));
  }, [resolveTitle, newOrdersCount]);

  // List of normalized roles for current user
  const rolesList = useMemo(() => {
    return [
      ...(Array.isArray(userRoles) ? userRoles : []),
      ...(Array.isArray(user?.roles) ? user.roles : []),
      user?.role,
      user?.job_title,
      user?.dept_name,
    ]
      .filter(Boolean)
      .map((r) => String(r).toLowerCase());
  }, [userRoles, user]);

  const isSuperAdmin = useMemo(() => {
    return rolesList.some((r) =>
      r.includes("super admin") || r.includes("superadmin")
    );
  }, [rolesList]);

  const isPrivileged = useMemo(() => {
    return rolesList.some((r) =>
      r.includes("admin") ||
      r.includes("super admin") ||
      r.includes("superadmin") ||
      r.includes("developer")
    );
  }, [rolesList]);

  // --- ACCESS CONTROL LOGIC ---
  const hasAccess = useCallback(
    (item) => {
      if (item.bypassAccess) return true;
      if (!user) return false;

      // Super Admin, Admin, and Developers access all
      if (isPrivileged) return true;

      // Role-based matching
      if (item.roles && item.roles.length > 0) {
        const itemRolesLower = item.roles.map((r) => String(r).toLowerCase());
        return rolesList.some((userRole) => itemRolesLower.includes(userRole));
      }

      // Default: allow access if no strict roles specified
      return true;
    },
    [user, isPrivileged, rolesList]
  );

  const accessibleSections = useMemo(() => {
    // Show sections on Home dashboard
    return allSections;
  }, [allSections]);

  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return accessibleSections;
    const term = searchTerm.toLowerCase();
    return accessibleSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.title.toLowerCase().includes(term)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [accessibleSections, searchTerm]);

  const { theme } = useTheme();

  // SweetAlert Handler
  const showAlert = (type, title, text) => {
    Swal.fire({
      icon: type,
      title: title,
      text: text,
      background: theme === 'dark' ? '#1e293b' : '#ffffff',
      color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
      confirmButtonColor: '#ef4444',
      customClass: {
        popup: 'rounded-3xl border-2 border-red-500',
        title: 'font-bold uppercase tracking-tight',
        confirmButton: 'rounded-full px-8 py-2 font-bold',
      },
    });
  };

  const handleNavigation = (item) => {
    const rawStatus = (item.status || (item.version === '0' ? 'C' : 'F')).toUpperCase();

    // Coming Soon ('C') modules are restricted to Super Admins only
    if (rawStatus === 'C') {
      if (!isSuperAdmin) {
        showAlert(
          'info',
          t('nav.comingSoon', 'Coming Soon'),
          'This module is currently coming soon. Access is granted to Super Admins only.'
        );
        return;
      }
    }

    if (hasAccess(item)) {
      if (item.path.startsWith('http')) {
        window.open(item.path, '_blank');
      } else {
        navigate(item.path);
      }
    } else {
      showAlert('error', 'Unauthorized', 'You do not have permission to access this module.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col">
      {/* Top Navbar with YPI Branding, Language Selector, User Profile & Settings */}
      <HomeNavbar
        user={user}
        onLogout={onLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenManagement={(type) => setManagementModal({ open: true, type })}
        onFocusSearch={handleFocusSearch}
      />

      <main className="flex-1 w-full px-6 md:px-10 lg:px-12 py-8 box-border">
        {/* Search Bar */}
        {/* <div className="w-full max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t("nav.search", "Search for modules...")}
              className="w-full pl-12 pr-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div> */}

        {/* Main Sections: Full Width */}
        <div className="w-full flex flex-col gap-10">
          {filteredSections.map((section) => (
            <SectionColumn
              key={section.id}
              section={section}
              onItemClick={handleNavigation}
            />
          ))}

          {filteredSections.length === 0 && (
            <div className="w-full text-center py-16 text-slate-400 font-semibold">
              No modules match &quot;{searchTerm}&quot;
            </div>
          )}
        </div>
      </main>

      {/* User Profile Modal */}
      <ProfileModal
        user={user}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* User / Role Management Modal */}
      <ManagementModal
        type={managementModal.type}
        isOpen={managementModal.open}
        onClose={() => setManagementModal({ open: false, type: 'user' })}
      />
    </div>
  );
}
