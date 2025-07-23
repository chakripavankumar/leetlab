import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import routes from '../../routes';
import RightSideNavbar from './RightSideNavbar';

const Header = () => {
  const { authUser, isAuthenticated } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-base-300 text-base-content border-b border-slate-700/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={routes.root} className="btn btn-ghost text-xl font-bold normal-case">
              {/* <div className="avatar placeholder">
                <div className="bg-gradient-to-br from-orange-600 to-orange-200 text-white rounded-full w-8 h-8">
                  <span className="text-sm font-bold">D</span>
                </div>
              </div>
              <span className="hidden sm:inline bg-gradient-to-r from-orange-400 to-orange-200 bg-clip-text text-transparent">
                DSA CodeLab
              </span> */}
              <img src="./logo.svg" className="w-40 h-12" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to={routes.problems.all}
              className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium"
            >
              Problems
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to={routes.submissions.all}
                  className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium"
                >
                  My Submissions
                </Link>
                <Link
                  to={routes.playlists.all}
                  className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium"
                >
                  My Playlist
                </Link>
              </>
            )}

            {authUser?.role === 'ADMIN' && (
              <Link
                to={routes.admin.createProblem}
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium"
              >
                Add Problem
              </Link>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Right Side Navbar */}
            <div className="hidden md:block">
              <RightSideNavbar />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800/50 rounded-lg mt-2 border border-slate-700/30">
              <Link
                to={routes.problems.all}
                className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Problems
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to={routes.submissions.all}
                    className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Submissions
                  </Link>
                  <Link
                    to={routes.playlists.all}
                    className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Playlist
                  </Link>
                </>
              )}

              {authUser?.role === 'ADMIN' && (
                <Link
                  to={routes.admin.createProblem}
                  className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Add Problem
                </Link>
              )}

              {/* Mobile Right Side Navbar */}
              <div className="pt-4 border-t border-slate-700/30">
                <RightSideNavbar isMobile={true} onLinkClick={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
