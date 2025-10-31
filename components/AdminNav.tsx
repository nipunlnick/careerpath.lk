import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminNav: React.FC = () => {
  const { user, isFirebaseConnected, loginAsFallbackAdmin, isFallbackMode } =
    useAuth();

  // Check if user is admin
  const isAdmin =
    user?.email &&
    ["admin@careerpath.lk", "nipun@careerpath.lk"].includes(user.email);

  // Show connection status for debugging
  const showConnectionStatus = !isFirebaseConnected;

  if (!isAdmin && !showConnectionStatus) {
    return null;
  }

  return (
    <div
      className={`py-2 px-4 text-white ${
        isAdmin ? "bg-red-600" : "bg-yellow-600"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isAdmin ? (
            <>
              <span className="text-sm font-medium">
                🔧 Admin Panel {isFallbackMode ? "(Offline Mode)" : ""}
              </span>
              <nav className="flex space-x-4">
                <Link
                  to="/admin/analytics"
                  className="text-sm hover:text-red-200 transition-colors"
                >
                  📊 Analytics
                </Link>
              </nav>
            </>
          ) : (
            <>
              <span className="text-sm font-medium">
                ⚠️ Firebase Connection:{" "}
                {isFirebaseConnected ? "Connected" : "Offline"}
              </span>
              {!isFirebaseConnected && (
                <button
                  onClick={loginAsFallbackAdmin}
                  className="text-xs bg-yellow-700 hover:bg-yellow-800 px-2 py-1 rounded transition-colors"
                >
                  🔧 Dev Admin Login
                </button>
              )}
            </>
          )}
        </div>
        <div className="text-xs opacity-75">
          {isAdmin
            ? `Admin: ${user?.displayName || user?.email} ${
                isFallbackMode ? "(Fallback)" : ""
              }`
            : `Status: ${isFirebaseConnected ? "Online" : "Offline Mode"}`}
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
