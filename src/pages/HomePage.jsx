import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import { useTheme } from "../context/ThemeContext";
import { modulesConfig } from "../config/modulesConfig";
import HomeNavbar from "../components/Navbar/HomeNavbar";
import SectionColumn from "../components/MainMenu/SectionColumn";
import ProfileModal from "../components/Users/ProfileModal";
import UserManagementModal from "../components/Users/UserManagementModal";
import RoleManagementModal from "../components/RoleManagement/RoleManagementModal";

export default function HomePage({ user, onLogout }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState("");
  const [userRoles, setUserRoles] = useState(user?.roles || []);
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

  // Translate section titles and items dynamically based on current language
  const resolveTitle = useCallback((key, customFallback) => {
    if (!key) return customFallback || "Module";
    const cleanName = key.replace(/^(ts\.|nav\.|home\.)/, "");
    const fallbackText = customFallback && customFallback !== "Module" && customFallback !== "" ? customFallback : cleanName;

    // Check key directly
    const translatedDirect = t(key, { defaultValue: "" });
    if (translatedDirect && translatedDirect !== key) {
      return translatedDirect;
    }

    // Check with ts. prefix if not already present
    if (!key.startsWith("ts.")) {
      const translatedTs = t(`ts.${key}`, { defaultValue: "" });
      if (translatedTs && translatedTs !== `ts.${key}`) {
        return translatedTs;
      }
    }

    return fallbackText;
  }, [t]);

  const allSections = useMemo(() => {
    return modulesConfig
      .filter((section) => !section.hidden)
      .map((section) => ({
        ...section,
        id: section.id,
        title: resolveTitle(section.titleKey, section.title),
        items: section.items.map((item) => ({
          ...item,
          title: resolveTitle(item.titleKey, item.title),
          badge: item.badge || null,
        })),
      }));
  }, [resolveTitle]);

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
      r === "super admin" ||
      r.includes("super admin") ||
      r.includes("superadmin") ||
      r.includes("developer")
    );
  }, [rolesList]);

  const isAdmin = useMemo(() => {
    return isSuperAdmin || rolesList.some((r) => r === "admin" || r.includes("admin"));
  }, [isSuperAdmin, rolesList]);

  // --- VISIBILITY LOGIC (What modules can be seen on the Home dashboard) ---
  // In default, allow Admin and Super Admin to see ALL modules.
  // Regular non-admin users only see modules for which they have the specific module role.
  const canSeeModule = useCallback(
    (item) => {
      if (item.bypassAccess) return true;
      if (!user) return false;

      // 1. Super Admin and Admin can see all modules in default (including Coming Soon)
      if (isSuperAdmin || isAdmin) return true;

      // 2. Regular non-admin users: can only see modules matching their assigned module role
      const itemTitleLower = (item.title || "").trim().toLowerCase();
      const titleKeyClean = (item.titleKey || "").replace(/^(ts\.|nav\.|home\.)/, "").trim().toLowerCase();

      // Check matching by module title or titleKey
      if (itemTitleLower && rolesList.includes(itemTitleLower)) return true;
      if (titleKeyClean && rolesList.includes(titleKeyClean)) return true;

      // Check item.roles array
      if (item.roles && item.roles.length > 0) {
        return item.roles.some((r) => {
          const rLower = String(r).trim().toLowerCase();
          if (rLower === "super admin" || rLower === "admin") return false;
          return rolesList.includes(rLower);
        });
      }

      return false;
    },
    [user, isSuperAdmin, isAdmin, rolesList]
  );

  // If a user has only one module access, they can ONLY see that module only on Home
  const accessibleSections = useMemo(() => {
    return allSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => canSeeModule(item)),
      }))
      .filter((section) => section.items.length > 0);
  }, [allSections, canSeeModule]);

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

    // Coming Soon ('C') modules:
    // Admin can see them on Home, but cannot open them. Only Super Admin can go inside!
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

    // Permission check for opening modules
    const canOpen = isSuperAdmin || isAdmin || canSeeModule(item);

    if (canOpen) {
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
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: isDark ? '#0b0f19' : '#f8fafc',
        color: isDark ? '#f1f5f9' : '#1e293b',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Apparel Merchandising Studio Home Background Wallpaper */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          backgroundImage: 'url(/assets/home_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          opacity: isDark ? 0.32 : 0.62,
          filter: isDark ? 'brightness(0.62) contrast(1.1)' : 'brightness(1.02) saturate(1.03)',
          pointerEvents: 'none',
          transition: 'opacity 0.4s ease, filter 0.4s ease',
        }}
      />

      {/* Tactile Textile Weave Pattern Overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          backgroundImage: isDark
            ? 'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255, 255, 255, 0.015) 5px, rgba(255, 255, 255, 0.015) 6px), repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(255, 255, 255, 0.015) 5px, rgba(255, 255, 255, 0.015) 6px)'
            : 'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(15, 23, 42, 0.015) 5px, rgba(15, 23, 42, 0.015) 6px), repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(15, 23, 42, 0.015) 5px, rgba(15, 23, 42, 0.015) 6px)',
          opacity: 0.85,
        }}
      />

      {/* Foreground Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          width: '100%',
        }}
      >
        {/* Top Navbar with YPI Branding, Language Selector, User Profile & Settings */}
        <HomeNavbar
          user={user}
          onLogout={onLogout}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenManagement={(type) => setManagementModal({ open: true, type })}
          onFocusSearch={handleFocusSearch}
        />

        <main className="flex-1 w-full px-6 md:px-10 lg:px-12 py-8 box-border">
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
      </div>

      {/* User Profile Modal */}
      <ProfileModal
        user={user}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* User Management Modal */}
      <UserManagementModal
        isOpen={managementModal.open && managementModal.type === 'user'}
        onClose={() => setManagementModal({ open: false, type: 'user' })}
      />

      {/* Role Management Modal */}
      <RoleManagementModal
        isOpen={managementModal.open && managementModal.type === 'role'}
        onClose={() => setManagementModal({ open: false, type: 'role' })}
      />
    </div>
  );
}
