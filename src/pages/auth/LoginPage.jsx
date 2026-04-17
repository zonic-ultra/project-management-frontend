import React, { useState } from "react";
import Layout from "../../components/Layout";
import ApiService from "../../service/ApiService";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User } from "lucide-react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  //!working version with enhanced logging and role handling
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const loginData = { username, password };
      const data = await ApiService.loginUser(loginData);

      const token = data.token || data.data?.token;

      // Extract role correctly from backend response
      let role = data.role || data.data?.role || data.data; // data.data is 'ADMIN'

      if (!token) {
        setMessage("Login failed: No token received");
        return;
      }

      // Save token
      ApiService.saveToken(token);

      // Save role - handle string or object
      if (role) {
        const roleStr =
          typeof role === "string" ? role : role.name || String(role);
        ApiService.saveRole(roleStr);
      } else {
        console.warn("No role found in response");
      }

      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        const isAdmin = ApiService.isAdmin();
        if (isAdmin) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/tasks", { replace: true });
        }
      }, 800);
    } catch (error) {
      console.error("Login error:", error);
      const msg =
        error.response?.data?.message || "Invalid username or password";
      showMessage(msg);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <Layout>
      <div className='min-h-[80vh] flex items-center justify-center'>
        <div className='w-full max-w-md p-8 rounded-3xl bg-prussian-blue/50 backdrop-blur-xl border border-lavender-grey/10 shadow-2xl relative overflow-hidden group'>
          <div className='absolute -top-24 -right-24 w-48 h-48 bg-dusk-blue/10 rounded-full blur-3xl group-hover:bg-dusk-blue/20 transition-colors duration-500' />

          <div className='relative z-10'>
            <div className='flex flex-col items-center mb-8'>
              <h1 className='text-3xl font-black text-alabaster-grey tracking-tight'>
                Access Nexus
              </h1>
              <p className='text-lavender-grey text-sm mt-2'>
                Enter credentials to initialize session
              </p>
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-xl text-sm font-medium animate-pulse ${
                  message.includes("successful")
                    ? "bg-green-400/10 border border-green-400/30 text-green-400"
                    : "bg-red-400/10 border border-red-400/20 text-red-400"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleLogin} className='space-y-5'>
              <div className='space-y-2'>
                <label className='text-xs font-bold uppercase tracking-widest text-dusk-blue/60 ml-1'>
                  Username
                </label>
                <div className='relative'>
                  <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-grey/20' />
                  <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 pl-12 pr-4 text-alabaster-grey placeholder:text-lavender-grey/10 focus:outline-none focus:border-dusk-blue/50 focus:ring-1 focus:ring-dusk-blue/50 transition-all'
                    placeholder='Enter username'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-bold uppercase tracking-widest text-dusk-blue/60 ml-1'>
                  Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-grey/20' />
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='w-full bg-ink-black/50 border border-lavender-grey/10 rounded-xl py-3 pl-12 pr-4 text-alabaster-grey placeholder:text-lavender-grey/10 focus:outline-none focus:border-dusk-blue/50 focus:ring-1 focus:ring-dusk-blue/50 transition-all'
                    placeholder='••••••••'
                  />
                </div>
              </div>

              <button
                type='submit'
                className='w-full py-4 bg-gradient-to-r from-dusk-blue to-lavender-grey text-white font-black rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(65,90,119,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-sm'
              >
                Login
              </button>
            </form>

            <div className='mt-8 text-center'>
              <p className='text-lavender-grey/30 text-sm'>
                Don't have an account?{" "}
                <Link
                  to='/register'
                  className='text-dusk-blue font-bold hover:underline'
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
