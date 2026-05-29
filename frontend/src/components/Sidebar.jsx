import React, { useEffect, useRef, useState } from "react";
import { sidebarStyles, cn } from "../assets/dummyStyles";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";

const MENU_ITEMS = [
  { text: "Dashboard", path: "/", icon: <Home size={20} /> },
  { text: "Income", path: "/income", icon: <ArrowUp size={20} /> },
  { text: "Expenses", path: "/expenses", icon: <ArrowDown size={20} /> },
  { text: "Profile", path: "/profile", icon: <User size={20} /> },
];

const Sidebar = ({ user, isCollapsed, setIsCollapsed }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const { name: userName = "User", email = "user@example.com" } = user || {};

  const initial = (userName?.[0] || "U").toUpperCase();

    // to check for overflow  in mobile

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);


  // to logout

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMobileOpen(false);
    navigate("/login");
  };
    
    
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

    // a small component
  const renderMenuItem = ({ text, path, icon }) => {
    const isActive = pathname === path;
    return (
      <motion.li key={text} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          to={path}
          className={cn(
            sidebarStyles.menuItem.base,
            isActive ? sidebarStyles.menuItem.active : sidebarStyles.menuItem.inactive,
            isCollapsed ? sidebarStyles.menuItem.collapsed : sidebarStyles.menuItem.expanded
          )}
          onMouseEnter={() => setActiveHover(text)}
          onMouseLeave={() => setActiveHover(null)}
        >
          <span className={isActive ? sidebarStyles.menuIcon.active : sidebarStyles.menuIcon.inactive}>
            {icon}
          </span>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              {text}
            </motion.span>
          )}
          {activeHover === text && !isActive && !isCollapsed && (
            <span className={sidebarStyles.activeIndicator}></span>
          )}
        </Link>
      </motion.li>
    );
  };



  return (
    <>
      <motion.aside
        ref={sidebarRef}
        className={sidebarStyles.sidebarContainer.base}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
      >
        <div
          className={cn(
            sidebarStyles.sidebarInner.base,
            isCollapsed ? sidebarStyles.sidebarInner.collapsed : sidebarStyles.sidebarInner.expanded
          )}
        >
          <div
            className={cn(
              sidebarStyles.userProfileContainer.base,
              isCollapsed
                ? sidebarStyles.userProfileContainer.collapsed
                : sidebarStyles.userProfileContainer.expanded
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={sidebarStyles.userInitials.base}>{initial}</div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{userName}</p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>
              )}
              </div>
              {!isCollapsed && (
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-teal-600 hover:border-teal-400"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft size={14} />
                </button>
              )}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <ul className={sidebarStyles.menuList.base}>{MENU_ITEMS.map(renderMenuItem)}</ul>
          </nav>

          <div
            className={cn(
              sidebarStyles.footerContainer.base,
              isCollapsed
                ? sidebarStyles.footerContainer.collapsed
                : sidebarStyles.footerContainer.expanded
            )}
          >
            <Link
              to="/support"
              className={cn(
                sidebarStyles.footerLink.base,
                isCollapsed ? sidebarStyles.footerLink.collapsed : ""
              )}
            >
              <HelpCircle size={18} />
              {!isCollapsed && <span>Support</span>}
            </Link>
            <button
              onClick={handleLogout}
              className={cn(
                sidebarStyles.logoutButton.base,
                isCollapsed ? sidebarStyles.logoutButton.collapsed : ""
              )}
            >
              <LogOut size={18} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>

        {isCollapsed && (
          <button onClick={toggleSidebar} className={sidebarStyles.toggleButton.base}>
            <ChevronRight size={16} />
          </button>
        )}
      </motion.aside>

      {mobileOpen && (
        <div className={sidebarStyles.mobileOverlay}>
          <div className={sidebarStyles.mobileBackdrop} onClick={() => setMobileOpen(false)} />
          <motion.div
            className={sidebarStyles.mobileSidebar.base}
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
          >
            <div className={sidebarStyles.mobileHeader}>
              <span className="font-semibold text-gray-800">Menu</span>
              <button
                className={sidebarStyles.mobileCloseButton}
                onClick={() => setMobileOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={sidebarStyles.mobileUserContainer}>
              <div className={sidebarStyles.userInitials.base}>{initial}</div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>
            </div>

            <ul className={sidebarStyles.mobileMenuList}>
              {MENU_ITEMS.map(({ text, path, icon }) => {
                const isActive = pathname === path;
                return (
                  <li key={`mobile-${text}`}>
                    <Link
                      to={path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        sidebarStyles.mobileMenuItem.base,
                        isActive
                          ? sidebarStyles.mobileMenuItem.active
                          : sidebarStyles.mobileMenuItem.inactive
                      )}
                    >
                      {icon}
                      <span>{text}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className={sidebarStyles.mobileFooter}>
              <Link
                  to="/support"
                  onClick={() => setMobileOpen(false)}
                  className={sidebarStyles.mobileFooterLink}
                >
                  <HelpCircle size={18} />
                  <span>Support</span>
                </Link>
              <button
                onClick={handleLogout}
                className={sidebarStyles.mobileLogoutButton}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <button
        className={sidebarStyles.mobileMenuButton}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
    </>
  );
};

export default Sidebar;
