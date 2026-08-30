// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Flame, Lock, Mail, ArrowRight, CheckCircle } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import { useTheme } from "../context/ThemeContext";

// export default function Login() {
//   const [email, setEmail] = useState("admin@crispandgrill.com");
//   const [password, setPassword] = useState("password123");
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     login(email, password);
//     navigate("/dashboard");
//   };

//   return (
//     <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
//       <div className="w-full max-w-md space-y-8 bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
//         {/* Brand Logo & Title */}
//         <div className="text-center space-y-2">
//           <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-orange-500/25">
//             <Flame className="w-9 h-9 fill-white" />
//           </div>
//           <h2 className="text-2xl font-black text-white font-heading tracking-tight mt-4">
//             Fast Food Admin Portal
//           </h2>
//           <p className="text-xs text-zinc-400">
//             Sign in to manage kitchen orders, counter POS, and menu analytics
//           </p>
//         </div>

//         {/* Demo Credentials Info Box */}
//         <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-400 space-y-1">
//           <div className="flex items-center gap-1.5 font-bold">
//             <CheckCircle className="w-4 h-4" />
//             <span>Ready for Quick Terminal Access</span>
//           </div>
//           <p className="text-[11px] text-zinc-300">
//             Click &quot;Access Admin Terminal&quot; below to log in directly as Super Admin.
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
//               Admin Email
//             </label>
//             <div className="relative">
//               <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:border-orange-500"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:border-orange-500"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             id="login-submit-btn"
//             className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 mt-6"
//           >
//             <span>Access Admin Terminal</span>
//             <ArrowRight className="w-4 h-4" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



// import React, { useState } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const navigate = useNavigate();

//   const {
//     login,
//     isAuthenticated,
//     loading,
//   } = useAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [error, setError] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   if (loading) {
//     return null;
//   }

//   if (isAuthenticated) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setError("");
//     setSubmitting(true);

//     const result = await login(email, password);

//     setSubmitting(false);

//     if (!result.success) {
//       setError(result.error);
//       return;
//     }

//     navigate("/dashboard", {
//       replace: true,
//     });
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center">

//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow"
//       >

//         <h1 className="text-2xl font-bold">
//           Login
//         </h1>

//         {error && (
//           <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(event) => setEmail(event.target.value)}
//           className="w-full rounded-lg border p-3"
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(event) => setPassword(event.target.value)}
//           className="w-full rounded-lg border p-3"
//           required
//         />

//         <button
//           type="submit"
//           disabled={submitting}
//           className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50"
//         >
//           {submitting ? "Signing in..." : "Login"}
//         </button>

//       </form>

//     </div>
//   );
// }


import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const {
    login,
    isAuthenticated,
    loading,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111111]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-orange-500" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    const result = await login(email, password);

    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    // navigate("/dashboard", {
    //   replace: true,
    // });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111111] px-4">

      {/* Background decoration */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

      {/* Login Card */}
      <div className="relative w-full max-w-md">

        {/* Logo / Brand */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/20">
            <span className="text-2xl font-black text-white">
              FF
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white">
            FastFood
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Admin Dashboard
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl sm:p-8"
        >

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">
              Welcome Back
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Login to manage your restaurant
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">

            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="email"
                placeholder="admin@fastfood.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#111111] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                required
              />

            </div>
          </div>

          {/* Password */}
          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>

            <div className="relative">

              <LockKeyhole
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#111111] py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-orange-500"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-orange-500 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            Authorized staff only
          </p>

        </form>

        <p className="mt-6 text-center text-xs text-gray-600">
          © 2026 FastFood Admin Dashboard
        </p>

      </div>
    </div>
  );
}

