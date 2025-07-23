import React from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import routes from '../../routes';
import { Bell, BookMarked, BookOpen, Code, LogOut, Trophy, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthLogout } from '../../hooks/reactQuery/useAuthApi';
import toast from 'react-hot-toast';
import queryClient from '../../utils/queryClient';
import { QUERY_KEYS } from '../../constants/keys';

const RightSideNavbar = ({ isMobile = false, onLinkClick }) => {
  const { authUser, isAuthenticated, clearAuth, problemsSolved } = useAuthStore();

  const { mutate: authLogoutHandle } = useAuthLogout();

  const navigate = useNavigate();

  const handleLogout = () => {
    authLogoutHandle(null, {
      onSuccess: () => {
        clearAuth();
        queryClient.clear();
        navigate('/login');
        if (onLinkClick) onLinkClick();
      },
      onError: (err) => {
        toast.error(err.response.data?.error || 'Something went wrong');
      },
    });
  };

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
  };

  if (!isAuthenticated) {
    if (isMobile) {
      return (
        <div className="flex flex-col gap-2">
          <Link
            to={routes.login}
            className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium text-center"
            onClick={handleLinkClick}
          >
            Sign In
          </Link>
          <Link
            to={routes.register}
            className="btn btn-primary btn-sm w-full"
            onClick={handleLinkClick}
          >
            Sign Up
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <Link
          to={routes.login}
          className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium"
        >
          Sign In
        </Link>
        <Link to={routes.register} className="btn btn-primary">
          Sign Up
        </Link>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-2">
        {/* User Info */}
        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
          <div className="w-10 h-10 rounded-full ring-2 ring-slate-600/30">
            <img
              src={authUser?.image || 'https://avatar.iran.liara.run/public/boy'}
              alt="User Avatar"
              className="object-cover rounded-full w-full h-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-200 truncate">{authUser?.name}</p>
            <p className="text-sm text-slate-400 truncate">{authUser?.email}</p>
            {problemsSolved?.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Trophy className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-slate-300">
                  {problemsSolved?.length} Problems solved
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Items */}
        <div className="space-y-1">
          <button
            className="flex items-center gap-3 px-3 py-2 hover:bg-red-600/20 rounded-lg transition-all duration-200 text-red-400 w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {/* User Stats (Desktop) */}
      {problemsSolved?.length > 0 && (
        <div className="hidden xl:flex items-center gap-4 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-600/30">
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-slate-300">
              {problemsSolved?.length || ''} Problems solved
            </span>
          </div>
        </div>
      )}

      {/* User Dropdown */}
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:bg-slate-700/50">
          <div className="w-10 rounded-full ring-2 ring-slate-600/30 hover:ring-emerald-500/50 transition-all duration-200">
            <img
              src={authUser?.image || 'https://avatar.iran.liara.run/public/boy'}
              alt="User Avatar"
              className="object-cover rounded-full"
            />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-slate-800 border border-slate-600/30 rounded-2xl w-64 backdrop-blur-xl"
        >
          {/* User Info */}
          <li className="p-3 border-b border-slate-600/30 mb-2">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-slate-200">{authUser?.name}</p>
              <p className="text-sm text-slate-400">{authUser?.email}</p>
              <div className="flex items-center gap-4 mt-2">
                {problemsSolved?.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-slate-300">
                      {problemsSolved?.length || ''} Problems solved
                    </span>
                  </div>
                )}
              </div>
            </div>
          </li>

          {/* Menu Items */}
          <li>
            <Link
              to={routes.profile}
              className="flex items-center gap-3 p-3 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-slate-200">My Profile</span>
            </Link>
          </li>

          <li>
            <Link
              to={routes.submissions.all}
              className="flex items-center gap-3 p-3 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span className="text-slate-200">My Submissions</span>
            </Link>
          </li>

          <li>
            <Link
              to={routes.playlists.all}
              className="flex items-center gap-3 p-3 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            >
              <BookMarked className="w-4 h-4 text-slate-400" />
              <span className="text-slate-200">My Playlists</span>
            </Link>
          </li>

          {authUser?.role === 'ADMIN' && (
            <li>
              <Link
                to={routes.admin.createProblem}
                className="flex items-center gap-3 p-3 hover:bg-emerald-600/20 rounded-lg transition-all duration-200 text-emerald-400"
              >
                <Code className="w-4 h-4" />
                <span>Add Problem</span>
              </Link>
            </li>
          )}

          <li className="mt-2 pt-2 border-t border-slate-600/30">
            <button
              className="flex items-center gap-3 p-3 hover:bg-red-600/20 rounded-lg transition-all duration-200 text-red-400 w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RightSideNavbar;
