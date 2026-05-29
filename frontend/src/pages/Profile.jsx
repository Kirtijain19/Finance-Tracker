import React, { useEffect, useState } from "react";
import axios from "axios";
import { Lock, Mail, User } from "lucide-react";
import { profileStyles } from "../assets/dummyStyles";
import { getInitials } from "../components/Helpers";

const BASE_URL = "https://finance-tracker-8ig9.onrender.com/api";

const Profile = () => {
  const [user, setUser] = useState({ name: "User", email: "user@example.com" });
  const [form, setForm] = useState(user);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const cached = localStorage.getItem("user");
        if (cached) {
          const parsed = JSON.parse(cached);
          setUser(parsed);
          setForm(parsed);
        }

        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const apiUser = response.data?.user || response.data;
        if (apiUser) {
          setUser(apiUser);
          setForm(apiUser);
          localStorage.setItem("user", JSON.stringify(apiUser));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(form);
        return;
      }
      const response = await axios.put(
        `${BASE_URL}/users/profile`,
        { name: form.name, email: form.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const apiUser = response.data?.user || form;
      setUser(apiUser);
      setForm(apiUser);
      localStorage.setItem("user", JSON.stringify(apiUser));
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className={profileStyles.container}>
      <div className={profileStyles.mainContainer}>
        <div className={profileStyles.header}>
          <div className={profileStyles.avatar}>
            <span className="text-white text-2xl font-bold">{getInitials(user.name)}</span>
          </div>
          <h1 className={profileStyles.userName}>{loading ? "Loading..." : user.name}</h1>
          <p className={profileStyles.userEmail}>{loading ? "" : user.email}</p>
        </div>

        <div className={profileStyles.content}>
          <div className={profileStyles.grid}>
            <div className={profileStyles.card}>
              <h2 className={profileStyles.cardTitle}>
                <User className={profileStyles.icon} /> Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={profileStyles.label}>Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={profileStyles.input}
                  />
                </div>
                <div>
                  <label className={profileStyles.label}>Email Address</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={profileStyles.input}
                  />
                </div>
                <div className="flex gap-3">
                  <button className={profileStyles.buttonPrimary} onClick={handleSave}>
                    Save Changes
                  </button>
                  <button className={profileStyles.buttonSecondary} onClick={() => setForm(user)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <div className={profileStyles.card}>
              <h2 className={profileStyles.cardTitle}>
                <Lock className={profileStyles.icon} /> Account Security
              </h2>
              <div className={profileStyles.securityItem}>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className={profileStyles.securityText}>Password</span>
                </div>
                <button className={profileStyles.changeButton} onClick={() => setShowPasswordModal(true)}>
                  Change
                </button>
              </div>
              <button className={`${profileStyles.buttonPrimary} mt-6`}>Logout</button>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className={profileStyles.modalContent}>
            <div className={profileStyles.modalHeader}>
              <h3 className={profileStyles.modalTitle}>Change Password</h3>
              <button type="button" onClick={() => setShowPasswordModal(false)}>
                X
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={profileStyles.passwordLabel}>Current Password</label>
                <input type="password" className={profileStyles.inputWithError} />
              </div>
              <div>
                <label className={profileStyles.passwordLabel}>New Password</label>
                <input type="password" className={profileStyles.inputWithError} />
              </div>
              <button className={profileStyles.buttonPrimary}>Update Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
