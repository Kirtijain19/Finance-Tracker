import React, { useEffect, useRef, useState } from "react";
import { navbarStyles } from "../assets/dummyStyles";
import img1 from "../assets/logo.png";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api";

const Navbar = ({ onLogout, user: propUser }) => {
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(
        propUser || {
            name: "",
            email: "",
        }
    );

    useEffect(() => {
        if (propUser) {
            setUser(propUser);
        }
    }, [propUser]);

    useEffect(() => {
        if (propUser) {
            return undefined;
        }

        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const response = await axios.get(`${BASE_URL}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const userData = response.data.user || response.data;
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
        return undefined;
    }, [propUser]);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleLogout = () => {
        setMenuOpen(false);
        localStorage.removeItem("token");
        if (onLogout) {
            onLogout();
        }
        navigate("/login");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className={navbarStyles.header}>
            <div className={navbarStyles.container}>
                <div onClick={() => navigate("/")} className={navbarStyles.logoContainer}>
                    <div className={navbarStyles.logoImage}>
                        <img src={img1} alt="logo" className={navbarStyles.logo} />
                    </div>
                    <span className={navbarStyles.logoText}>Finance Tracker</span>
                </div>

                {user && (
                    <div className={navbarStyles.userContainer} ref={menuRef}>
                        <button onClick={toggleMenu} className={navbarStyles.userButton}>
                            <div className="relative">
                                <div className={navbarStyles.userAvatar}>
                                    {(user?.name?.charAt(0) || "U").toUpperCase()}
                                </div>
                                <div className={navbarStyles.statusIndicator}></div>
                            </div>
                            <div className={navbarStyles.userTextContainer}>
                                <p className={navbarStyles.userName}>{user?.name || "User"}</p>
                                <p className={navbarStyles.userEmail}>{user?.email || "user@example.com"}</p>
                            </div>

                            <ChevronDown className={navbarStyles.chevronIcon(menuOpen)} />
                        </button>

                        {menuOpen && (
                            <div className={navbarStyles.dropdownMenu}>
                                <div className={navbarStyles.dropdownHeader}>
                                    <div className="flex items-center gap-3">
                                        <div className={navbarStyles.dropdownAvatar}>
                                            {(user?.name?.[0] || "U").toUpperCase()}
                                        </div>

                                        <div>
                                            <div className={navbarStyles.dropdownName}>{user?.name || "User"}</div>
                                            <div className={navbarStyles.dropdownEmail}>
                                                {user?.email || "user@example.com"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={navbarStyles.menuItemContainer}>
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            navigate("/profile");
                                        }}
                                        className={navbarStyles.menuItem}
                                    >
                                        <User className="w-4 h-4" />
                                        <span>My Profile</span>
                                    </button>
                                </div>

                                <div className={navbarStyles.menuItemBorder}>
                                    <button onClick={handleLogout} className={navbarStyles.logoutButton}>
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
