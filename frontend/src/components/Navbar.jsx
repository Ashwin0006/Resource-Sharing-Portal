import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="animated-navbar fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg logo-name">Resource Portal</h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Browse
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/upload"
                  className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Upload
                </Link>
                <Link
                  to="/my-resources"
                  className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  My Resources
                </Link>
              </>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-white">
                  Hello, <span className="font-semibold text-white">{user?.username}</span>
                </span>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-md text-sm hover:from-red-600 hover:to-pink-700 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
