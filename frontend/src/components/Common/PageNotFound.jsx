import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Bug } from 'lucide-react';

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl font-bold text-primary/20 select-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Bug className="w-16 h-16 text-error animate-bounce" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <h2 className="text-3xl font-bold text-base-content">Page Not Found</h2>
          <p className="text-base-content/70 text-lg leading-relaxed">
            Oops! The page you're looking for seems to have vanished into the void. It might have
            been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Suggestions */}
        <div className="bg-base-200 rounded-box p-6 mb-8">
          <h3 className="font-semibold text-base-content mb-3">Here's what you can try:</h3>
          <ul className="text-sm text-base-content/70 space-y-2 text-left">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Check the URL for any typos
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Go back to the previous page
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Search for what you're looking for
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Visit our homepage to start fresh
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Link>

          <button onClick={handleGoBack} className="btn btn-outline gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link to="/problems" className="btn btn-ghost gap-2">
            <Search className="w-4 h-4" />
            Browse Problems
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-base-300">
          <p className="text-sm text-base-content/60">
            Still having trouble?{' '}
            <Link to="/contact" className="link link-primary font-medium">
              Contact support
            </Link>{' '}
            or{' '}
            <Link to="/help" className="link link-primary font-medium">
              visit our help center
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
