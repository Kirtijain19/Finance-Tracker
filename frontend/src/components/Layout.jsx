import React from "react";
import { Outlet } from "react-router-dom";
import { styles } from "../assets/dummyStyles";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ onLogout, user }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

    return (
        <div className={styles.layout.root}>
            <Navbar onLogout={onLogout} user={user} />
            <Sidebar user={user} isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
            <main className={styles.layout.mainContainer(sidebarCollapsed)}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
