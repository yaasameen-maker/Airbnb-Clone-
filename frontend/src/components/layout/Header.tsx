import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, Heart, Calendar, Home } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { UserRole } from '../../types';
import { useState } from 'react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Airbnb Experiences</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/experiences" className="text-gray-700 hover:text-gray-900 font-medium">
              Explore
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === UserRole.HOST && (
                  <Link to="/host/experiences" className="text-gray-700 hover:text-gray-900 font-medium">
                    My Experiences
                  </Link>
                )}
                
                {user?.role === UserRole.ADMIN && (
                  <Link to="/admin" className="text-gray-700 hover:text-gray-900 font-medium">
                    Admin
                  </Link>
                )}
                
                <Link to="/bookings" className="text-gray-700 hover:text-gray-900 font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Bookings
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user?.firstName}</span>
                  </button>
                  
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary px-4 py-2 rounded-md">
                  Sign up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
