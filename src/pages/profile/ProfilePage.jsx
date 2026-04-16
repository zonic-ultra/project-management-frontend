/**
 * Profile Page Component
 *
 * Allows users to manage their identity within the Nexus.
 * Features profile information updates and secure password rotation.
 *
 * JSX only - No <form> elements
 */
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import ApiService from "../../service/ApiService";
import {
  User,
  Mail,
  Lock,
  Shield,
  Save,
  Key,
  Eye,
  EyeOff,
  Activity, // ← Added for refresh button
} from "lucide-react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userInfo, setUserInfo] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    role: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ← Added for refresh

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getLoggedInUsersInfo();
      const data = response.data || response.user || response;
      const user = data.user || data;

      if (user && (user.name || user.username || user.email || user.id)) {
        setUserInfo({
          id: user.id || "",
          name: user.name || "",
          username: user.username || user.email?.split("@")[0] || "",
          email: user.email || user.username || "",
          role: user.role || "",
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to synchronize profile data.";
      setError(errorMsg);
      console.error("Profile sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Profile Update
  const handleProfileUpdate = async () => {
    if (!userInfo.name.trim() || !userInfo.username.trim()) {
      setError("Name and Nexus ID are required.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await ApiService.updateProfile(userInfo.id, {
        name: userInfo.name.trim(),
        username: userInfo.username.trim(),
      });

      setMessage("Identity updated successfully.");
      setTimeout(() => setMessage(""), 4000);
      setActiveTab("overview");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Profile update failed.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError("New password confirmation mismatch.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await ApiService.changePassword(userInfo.id, passwordData);
      setMessage("Security credentials changed successfully.");
      setTimeout(() => setMessage(""), 4000);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setActiveTab("overview");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Password rotation failed.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "update", label: "Update Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
  ];

  return (
    <Layout>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-10 pb-20'>
        {/* Header with Refresh Button */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 md:pt-0'>
          <div className='flex items-center gap-4'>
            <div className='p-3 rounded-2xl bg-gradient-to-br from-dusk-blue to-lavender-grey shadow-[0_0_20px_rgba(65,90,119,0.3)] shrink-0'>
              <User className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-3xl md:text-4xl font-black text-alabaster-grey tracking-tight'>
                Your Profile
              </h1>
              <p className='text-lavender-grey mt-1 text-sm md:text-base'>
                Manage your Nexus identity and security protocols
              </p>
            </div>
          </div>

          {/* Refresh Button - Only spinning Activity icon when loading */}
          <button onClick={fetchProfile} disabled={loading}>
            {loading ? (
              <Activity className='w-4 h-4 text-green-400 animate-spin' />
            ) : (
              <>
                <Activity className='w-4 h-4 opacity-0' />
              </>
            )}
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className='overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide'>
          <div className='flex p-1 bg-prussian-blue/30 border border-lavender-grey/10 rounded-2xl w-max sm:w-fit min-w-full sm:min-w-0'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMessage("");
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex-1 sm:flex-none whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-dusk-blue text-white shadow-lg"
                    : "text-lavender-grey hover:text-alabaster-grey hover:bg-white/5"
                }`}
              >
                <tab.icon className='w-3.5 h-3.5 sm:w-4 h-4' />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        {(message || error) && (
          <div
            className={`p-4 rounded-2xl border backdrop-blur-xl text-sm font-bold ${
              message
                ? "bg-green-400/10 border-green-400/20 text-green-400"
                : "bg-red-400/10 border-red-400/20 text-red-400"
            }`}
          >
            {message || error}
          </div>
        )}

        {/* Tab Content */}
        <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
          {activeTab === "overview" && (
            <div className='p-5 sm:p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-64 h-64 bg-dusk-blue/5 rounded-full blur-3xl' />
              <div className='relative z-10 space-y-8'>
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    <Shield className='w-5 h-5 text-dusk-blue shrink-0' />
                    <h3 className='text-lg sm:text-xl font-bold text-alabaster-grey'>
                      Identity Overview
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("update")}
                    className='text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-dusk-blue hover:text-lavender-grey transition-colors whitespace-nowrap'
                  >
                    Modify Parameters
                  </button>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8'>
                  <div className='space-y-1'>
                    <p className='text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-lavender-grey/40'>
                      Name
                    </p>
                    <p className='text-base sm:text-lg font-medium text-alabaster-grey break-words'>
                      {userInfo.name}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-lavender-grey/40'>
                      Email
                    </p>
                    <p className='text-base sm:text-lg font-medium text-alabaster-grey break-all'>
                      {userInfo.username}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-lavender-grey/40'>
                      Security Level
                    </p>
                    <p className='text-base sm:text-lg font-medium text-dusk-blue uppercase'>
                      {userInfo.role ||
                        (ApiService.isAdmin() ? "ADMIN" : "MEMBER")}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-lavender-grey/40'>
                      System Status
                    </p>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0' />
                      <p className='text-base sm:text-lg font-medium text-green-400'>
                        Active
                      </p>
                    </div>
                  </div>
                </div>

                <div className='pt-8 border-t border-lavender-grey/10 flex flex-col sm:flex-row gap-4'>
                  <button
                    onClick={() => setActiveTab("update")}
                    className='w-full sm:w-auto px-6 py-3 rounded-xl bg-dusk-blue/10 border border-dusk-blue/20 text-dusk-blue text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-dusk-blue hover:text-white transition-all text-center'
                  >
                    Update Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className='w-full sm:w-auto px-6 py-3 rounded-xl bg-lavender-grey/5 border border-lavender-grey/10 text-lavender-grey text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-lavender-grey/10 hover:text-alabaster-grey transition-all text-center'
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "update" && (
            <div className='p-5 sm:p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-dusk-blue/5 rounded-full blur-3xl' />
              <div className='relative z-10 space-y-6'>
                <div className='flex items-center gap-3 mb-2'>
                  <Shield className='w-5 h-5 text-dusk-blue shrink-0' />
                  <h3 className='text-lg sm:text-xl font-bold text-alabaster-grey'>
                    Identity Parameters
                  </h3>
                </div>

                <div className='space-y-8 w-full'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <label className='text-[10px] font-bold uppercase tracking-widest text-lavender-grey/40 ml-1'>
                        Name
                      </label>
                      <div className='relative'>
                        <User className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lavender-grey/20' />
                        <input
                          type='text'
                          value={userInfo.name}
                          onChange={(e) =>
                            setUserInfo({ ...userInfo, name: e.target.value })
                          }
                          className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 pl-12 pr-4 text-alabaster-grey text-sm focus:outline-none focus:border-dusk-blue/50 transition-all'
                          placeholder='Enter full name'
                        />
                      </div>
                    </div>

                    <div className='space-y-2 mt-2'>
                      <div className='flex items-center justify-between gap-1 px-1'>
                        <label className='text-[10px] font-bold uppercase tracking-widest text-lavender-grey/40'>
                          Email
                        </label>
                        <p className='text-red-400 text-[10px] leading-none'>
                          If email changed, login again with your new email
                        </p>
                      </div>

                      <div className='relative'>
                        <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lavender-grey/20' />
                        <input
                          type='email'
                          value={userInfo.username}
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              username: e.target.value,
                            })
                          }
                          className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 pl-12 pr-4 text-alabaster-grey text-sm focus:outline-none focus:border-dusk-blue/50 transition-all'
                          placeholder='Enter email address'
                        />
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col sm:flex-row gap-4 pt-4 border-t border-lavender-grey/10'>
                    <button
                      onClick={handleProfileUpdate}
                      disabled={loading}
                      className='flex-1 py-4 bg-gradient-to-r from-dusk-blue to-lavender-grey text-white font-black rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(65,90,119,0.4)] transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 disabled:opacity-70'
                    >
                      <Save className='w-4 h-4' />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setActiveTab("overview")}
                      className='px-6 py-4 bg-ink-black/30 border border-lavender-grey/10 text-lavender-grey font-black rounded-xl hover:bg-white/5 transition-all uppercase tracking-widest text-[10px] text-center'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className='p-5 sm:p-8 rounded-3xl bg-prussian-blue/30 border border-lavender-grey/10 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-lavender-grey/5 rounded-full blur-3xl' />
              <div className='relative z-10 space-y-6'>
                <div className='flex items-center gap-3 mb-2'>
                  <Lock className='w-5 h-5 text-lavender-grey shrink-0' />
                  <h3 className='text-lg sm:text-xl font-bold text-alabaster-grey'>
                    Security Credentials
                  </h3>
                </div>

                <div className='space-y-8 w-full'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2 md:col-span-2'>
                      <label className='text-[10px] font-bold uppercase tracking-widest text-lavender-grey/40 ml-1'>
                        Current Password
                      </label>
                      <div className='relative'>
                        <Key className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lavender-grey/20' />
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 pl-12 pr-12 text-alabaster-grey text-sm focus:outline-none focus:border-dusk-blue/50 transition-all'
                          placeholder='••••••••'
                        />
                        <button
                          type='button'
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className='absolute right-4 top-1/2 -translate-y-1/2 text-lavender-grey/40 hover:text-lavender-grey'
                        >
                          {showCurrentPassword ? (
                            <EyeOff className='w-4 h-4' />
                          ) : (
                            <Eye className='w-4 h-4' />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <label className='text-[10px] font-bold uppercase tracking-widest text-lavender-grey/40 ml-1'>
                        New Password
                      </label>
                      <div className='relative'>
                        <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lavender-grey/20' />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 pl-12 pr-12 text-alabaster-grey text-sm focus:outline-none focus:border-dusk-blue/50 transition-all'
                          placeholder='••••••••'
                        />
                        <button
                          type='button'
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className='absolute right-4 top-1/2 -translate-y-1/2 text-lavender-grey/40 hover:text-lavender-grey'
                        >
                          {showNewPassword ? (
                            <EyeOff className='w-4 h-4' />
                          ) : (
                            <Eye className='w-4 h-4' />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <label className='text-[10px] font-bold uppercase tracking-widest text-lavender-grey/40 ml-1'>
                        Confirm New Password
                      </label>
                      <div className='relative'>
                        <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lavender-grey/20' />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmNewPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmNewPassword: e.target.value,
                            })
                          }
                          className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 pl-12 pr-12 text-alabaster-grey text-sm focus:outline-none focus:border-dusk-blue/50 transition-all'
                          placeholder='••••••••'
                        />
                        <button
                          type='button'
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className='absolute right-4 top-1/2 -translate-y-1/2 text-lavender-grey/40 hover:text-lavender-grey'
                        >
                          {showConfirmPassword ? (
                            <EyeOff className='w-4 h-4' />
                          ) : (
                            <Eye className='w-4 h-4' />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col sm:flex-row gap-4 pt-4 border-t border-lavender-grey/10'>
                    <button
                      onClick={handlePasswordChange}
                      disabled={loading}
                      className='flex-1 py-4 bg-prussian-blue border border-lavender-grey/10 text-alabaster-grey font-black rounded-xl hover:bg-lavender-grey/5 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 disabled:opacity-70'
                    >
                      <Key className='w-4 h-4' />
                      {loading ? "Rotating..." : "Reset"}
                    </button>
                    <button
                      onClick={() => setActiveTab("overview")}
                      className='px-6 py-4 bg-ink-black/30 border border-lavender-grey/10 text-lavender-grey font-black rounded-xl hover:bg-white/5 transition-all uppercase tracking-widest text-[10px] text-center'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
