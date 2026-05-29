import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import Expense from "./pages/Expense";
import Income from "./pages/Income";
import Profile from "./pages/Profile";
import Support from "./pages/Support";

const App = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const readAuth = () => {
            try {
                const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
                const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");

                setUser(storedUser ? JSON.parse(storedUser) : null);
                setToken(storedToken || null);
            } catch (error) {
                console.error("Error reading auth data:", error);
                setUser(null);
                setToken(null);
            }
        };

        readAuth();
    }, []);

    const clearAuth = () => {
        try {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
        } catch (error) {
            console.error("Error clearing auth data:", error);
        }
        setUser(null);
        setToken(null);
    };

    const handleLogout = () => {
        clearAuth();
        navigate("/login");
    };

    const handleLogin = (nextUser, nextToken) => {
        setUser(nextUser || null);
        setToken(nextToken || null);
    };

    return (
        <Routes>
            <Route element={<Layout onLogout={handleLogout} user={user} />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/income" element={<Income />} />
                <Route path="/expenses" element={<Expense />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/support" element={<Support />} />
            </Route>
            <Route path="/login" element={<Login onLogin={handleLogin} token={token} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;