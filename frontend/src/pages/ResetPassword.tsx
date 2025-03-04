import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthProviderWrapper } from "../components/AuthProviderWrapper";
import { useAuth } from "../utils/AuthContext";

const ResetPasswordContent = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setMessage("Check your email for password reset instructions");
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg border border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">Reset your password</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {message && (
          <div className="bg-green-900/50 border border-green-700 text-green-100 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-300 mb-1">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending reset link..." : "Send reset link"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const ResetPassword = () => {
  return (
    <AuthProviderWrapper>
      <ResetPasswordContent />
    </AuthProviderWrapper>
  );
};

export default ResetPassword;
