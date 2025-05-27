// File: app/login/page.jsx

"use client"; // Marks this as a Client Component for interactivity

import React, { useState, useRef, useEffect } from "react";
// Import icons from react-icons/fi (Feather Icons)
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from 'next/navigation'; // Import useRouter for client-side navigation

function LoginPage() {
  // --- State Management ---
  const [email, setEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter(); // Initialize the router

  // Ref for auto-focusing email input on load
  const emailInputRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    // Auto-focus email input on component mount
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // --- Validation Helpers ---
  const validateEmail = (email) => {
    if (!email) {
      return "Email is required.";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Invalid email format.";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return "";
  };

  // --- Simulated Authentication Logic ---
  const simulateSignIn = async ({ email, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@example.com" && password === "password123") {
          console.log("Simulated sign-in success!");
          resolve({ success: true, message: "Login successful!" });
        } else if (email === "user@example.com" && password !== "password123") {
          reject(new Error("CredentialsSignin"));
        } else if (email === "new@example.com") {
          reject(new Error("UserNotFound"));
        } else {
          reject(new Error("GenericError"));
        }
      }, 1500); // Simulate network delay
    });
  };

  // --- Form Submission Handler ---
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Perform client-side validation
    const emailValidationMsg = validateEmail(email);
    const passwordValidationMsg = validatePassword(authPassword);

    setEmailError(emailValidationMsg);
    setPasswordError(passwordValidationMsg);

    if (emailValidationMsg || passwordValidationMsg) {
      setLoading(false);
      return;
    }

    try {
      await simulateSignIn({
        email,
        password: authPassword,
      });

      // On successful simulated login, redirect to the customer dashboard
      router.push('/customers'); // Redirect to the new customer dashboard page

    } catch (err) {
      const errorMessages = {
        CredentialsSignin:
          "Incorrect email or password. Please double-check your credentials.",
        UserNotFound: "No account found with this email. Please sign up.",
        GenericError: "An unexpected error occurred. Please try again.",
      };
      setError(
        errorMessages[err.message] ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 p-4 sm:p-6 lg:p-8">
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300 ease-in-out hover:shadow-3xl"
      >
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800 animate-fade-in-down">
          Welcome Back
        </h1>

        <div className="space-y-6">
          {/* Email Input Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className={`relative flex items-center overflow-hidden rounded-lg border px-4 py-3 bg-white
                        ${emailError ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus-within:border-[#357AFF] focus-within:ring-1 focus-within:ring-[#357AFF]"}`}>
              <FiMail className="mr-3 text-gray-400 text-lg" aria-hidden="true" />
              <input
                id="email"
                ref={emailInputRef}
                required
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                onBlur={(e) => setEmailError(validateEmail(e.target.value))}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full bg-transparent text-lg outline-none placeholder-gray-400"
                aria-invalid={emailError ? "true" : "false"}
                aria-describedby={emailError ? "email-error" : undefined}
              />
            </div>
            {emailError && (
              <p id="email-error" className="text-sm text-red-500 mt-1 pl-4 animate-fade-in">
                {emailError}
              </p>
            )}
          </div>

          {/* Password Input Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className={`relative flex items-center overflow-hidden rounded-lg border px-4 py-3 bg-white
                        ${passwordError ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus-within:border-[#357AFF] focus-within:ring-1 focus-within:ring-[#357AFF]"}`}>
              <FiLock className="mr-3 text-gray-400 text-lg" aria-hidden="true" />
              <input
                id="password"
                required
                name="password"
                type={showPassword ? "text" : "password"}
                value={authPassword}
                onChange={(e) => {
                  setAuthPassword(e.target.value);
                  setPasswordError("");
                }}
                onBlur={(e) => setPasswordError(validatePassword(e.target.value))}
                autoComplete="current-password"
                className="w-full rounded-lg bg-transparent text-lg outline-none placeholder-gray-400"
                aria-invalid={passwordError ? "true" : "false"}
                aria-describedby={passwordError ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#357AFF] rounded-full"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {passwordError && (
              <p id="password-error" className="text-sm text-red-500 mt-1 pl-4 animate-fade-in">
                {passwordError}
              </p>
            )}
          </div>

          {/* General Error Message Display (from backend/simulated auth) */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 animate-fade-in">
              {error}
            </div>
          )}

          {/* Forgot Password Link */}
          <div className="text-right text-sm">
            <a
              href="/account/forgot-password"
              className="font-medium text-[#357AFF] hover:text-[#2E69DE] transition-colors duration-200"
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#2E69DE] focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {/* "Don't have an account? Sign up" link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <a
              href="/account/signup"
              className="text-[#357AFF] hover:text-[#2E69DE] font-medium transition-colors duration-200"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
