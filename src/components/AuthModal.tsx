import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Zap } from "lucide-react";

interface Credentials {
  name?: string;
  email: string;
  password: string;
}

const AuthModal = ({ isAuthOpen, setIsAuthOpen }: { isAuthOpen: boolean; setIsAuthOpen: (open: boolean) => void }) => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!emailRegex.test(credentials.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!passwordRegex.test(credentials.password)) {
      alert("Password must be at least 8 characters, include a number, a special character, and both uppercase & lowercase letters.");
      return;
    }

    // Call API for login/signup here...
    console.log("Authentication Successful:", credentials);
    setIsAuthOpen(false);
  };

  return (
    isAuthOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#13141A] border border-white/10 p-8 rounded-lg w-full max-w-md relative"
        >
          {/* Close Button */}
          <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">TeamSync</span>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {/* Name Field (Only for Signup) */}
            {authMode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={credentials.name || ""}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full px-6 py-3 bg-primary rounded font-medium text-white hover:bg-primary/90 transition-colors"
            >
              {authMode === "signin" ? "Sign In" : "Create Account"}
            </motion.button>

            {/* Links for Switching Modes and Forgot Password */}
            <div className="text-center text-sm text-gray-400">
              {authMode === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <button onClick={() => setAuthMode("signup")} className="text-primary hover:underline">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => setAuthMode("signin")} className="text-primary hover:underline">
                    Sign in
                  </button>
                </>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-center text-sm text-gray-400 mt-2">
              <button className="text-primary hover:underline">Forgot password?</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )
  );
};

export default AuthModal;
