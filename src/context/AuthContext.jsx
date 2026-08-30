// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("fastfood_admin_user");
//     return savedUser
//       ? JSON.parse(savedUser)
//       : {
//           name: "Daniyal Khan",
//           email: "admin@crispandgrill.com",
//           role: "Super Admin",
//           avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
//         };
//   });

//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     return localStorage.getItem("fastfood_admin_auth") !== "false";
//   });

//   const login = (email, password) => {
//     const adminData = {
//       name: "Daniyal Khan",
//       email: email || "admin@crispandgrill.com",
//       role: "Super Admin",
//       avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
//     };
//     setUser(adminData);
//     setIsAuthenticated(true);
//     localStorage.setItem("fastfood_admin_auth", "true");
//     localStorage.setItem("fastfood_admin_user", JSON.stringify(adminData));
//     return true;
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     localStorage.setItem("fastfood_admin_auth", "false");
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };


import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/firbase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  //     try {
  //       if (!firebaseUser) {
  //         setUser(null);
  //         setProfile(null);
  //         setLoading(false);
  //         return;
  //       }

  //       setUser(firebaseUser);

  //       const userRef = doc(db, "users", firebaseUser.uid);
  //       const userSnap = await getDoc(userRef);

  //       if (!userSnap.exists()) {
  //         console.error("User profile does not exist in Firestore.");

  //         setProfile(null);
  //         setLoading(false);
  //         return;
  //       }

  //       const userData = userSnap.data();

  //       setProfile({
  //         uid: firebaseUser.uid,
  //         name: userData.name || firebaseUser.displayName || "",
  //         email: userData.email || firebaseUser.email || "",
  //         role: userData.role || null,
  //         avatar: userData.avatar || null,
  //       });
  //     } catch (error) {
  //       console.error("Authentication error:", error);

  //       setUser(null);
  //       setProfile(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    setLoading(true);

    try {
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        return;
      }

      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error("User profile does not exist in Firestore.");

        setUser(null);
        setProfile(null);
        return;
      }

      const userData = userSnap.data();

      setUser(firebaseUser);

      setProfile({
        uid: firebaseUser.uid,
        name: userData.name || firebaseUser.displayName || "",
        email: userData.email || firebaseUser.email || "",
        role: userData.role || null,
        avatar: userData.avatar || null,
      });
    } catch (error) {
      console.error("Authentication error:", error);

      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      return {
        success: true,
        user: result.user,
      };
    } catch (error) {
      console.error("Login error:", error);

      let message = "Unable to login.";

      switch (error.code) {
        case "auth/invalid-credential":
          message = "Invalid email or password.";
          break;

        case "auth/user-disabled":
          message = "This account has been disabled.";
          break;

        case "auth/too-many-requests":
          message = "Too many attempts. Please try again later.";
          break;

        default:
          message = error.message;
      }

      return {
        success: false,
        error: message,
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);

      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAdmin = profile?.role === "admin";
  const isCashier = profile?.role === "cashier";

  const hasRole = (roles) => {
    if (!profile?.role) {
      return false;
    }

    if (Array.isArray(roles)) {
      return roles.includes(profile.role);
    }

    return profile.role === roles;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        isCashier,
        hasRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
  