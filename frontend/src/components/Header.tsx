import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Receipt, Wallet, Calendar, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/monthly-report', label: 'Monthly Report', icon: Calendar },
    { path: '/add-fund', label: 'Add Fund', icon: PlusCircle },
    { path: '/add-expense', label: 'Add Expense', icon: Receipt },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" onClick={closeMenu} className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
              FundFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  isActive(link.path) ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-500 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <nav className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`flex items-center space-x-4 p-4 rounded-xl text-base font-semibold transition-all ${
                  isActive(link.path) 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive(link.path) ? 'text-primary-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
