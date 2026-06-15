import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import {
  Search, Globe, Menu, X, User, LogOut, Heart,
  Bookmark, Home, ShieldCheck, Plus, ChevronDown,
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { ROUTES, CITIES_CAMEROUN } from '@/utils/constants';

const HomeNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const isProprietaire = user?.role === 'proprietaire' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  // Shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = searchValue.trim()
      ? `?city=${encodeURIComponent(searchValue.trim())}`
      : '';
    navigate(`/annonces${params}`);
    setSearchFocused(false);
    setSearchValue('');
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block tracking-tight">
              Immo<span className="text-blue-600">Connect</span>
            </span>
          </Link>

          {/* ── Search bar (centre) ── */}
          <form
            onSubmit={handleSearch}
            className={`hidden md:flex items-center flex-1 max-w-md mx-4 border rounded-full transition-all duration-200 overflow-hidden ${
              searchFocused
                ? 'border-blue-500 shadow-lg ring-2 ring-blue-100'
                : 'border-gray-300 shadow-sm hover:shadow-md'
            }`}
          >
            <input
              ref={searchRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Rechercher une ville, un quartier..."
              className="flex-1 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
              list="cities-datalist"
            />
            <datalist id="cities-datalist">
              {CITIES_CAMEROUN.map((c) => <option key={c} value={c} />)}
            </datalist>
            <button
              type="submit"
              className="m-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors flex-shrink-0"
              aria-label="Rechercher"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* ── Right side ── */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Lien tableau de bord si connecté */}
            {isAuthenticated && (
              <Link
                to={ROUTES.DASHBOARD}
                className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors"
              >
                Tableau de bord
              </Link>
            )}

            {/* "Publier une annonce" — visible if owner or not logged in */}
            {(!isAuthenticated || isProprietaire) && (
              <Link
                to={isAuthenticated ? ROUTES.MES_ANNONCES_CREER : ROUTES.REGISTER}
                className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                Publier une annonce
              </Link>
            )}

            {/* Language placeholder */}
            <button
              type="button"
              className="hidden md:flex items-center gap-1 text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              title="Langue"
              aria-label="Langue"
            >
              <Globe className="h-4 w-4" />
            </button>

            {/* User menu / Login button */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`flex items-center gap-2 border rounded-full px-3 py-2 transition-all ${
                    menuOpen
                      ? 'border-gray-400 shadow-md'
                      : 'border-gray-300 hover:shadow-md'
                  }`}
                >
                  <Menu className="h-4 w-4 text-gray-600" />
                  <Avatar src={user?.avatar_thumb_url} name={user?.name} size="sm" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <Avatar src={user?.avatar_thumb_url} name={user?.name} size="md" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          <div className="mt-1"><Badge role={user?.role} /></div>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <MenuItem to={ROUTES.DASHBOARD} onClick={() => setMenuOpen(false)} icon={<Home className="h-4 w-4" />}>
                        Tableau de bord
                      </MenuItem>
                      <MenuItem to={ROUTES.PROFILE} onClick={() => setMenuOpen(false)} icon={<User className="h-4 w-4" />}>
                        Mon profil
                      </MenuItem>
                      <MenuItem to={ROUTES.MES_FAVORIS} onClick={() => setMenuOpen(false)} icon={<Heart className="h-4 w-4" />}>
                        Mes favoris
                      </MenuItem>
                      <MenuItem to={ROUTES.MES_RECHERCHES} onClick={() => setMenuOpen(false)} icon={<Bookmark className="h-4 w-4" />}>
                        Mes recherches
                      </MenuItem>
                      {isProprietaire && (
                        <MenuItem to={ROUTES.MES_ANNONCES} onClick={() => setMenuOpen(false)} icon={<Plus className="h-4 w-4" />}>
                          Mes annonces
                        </MenuItem>
                      )}
                      {isAdmin && (
                        <MenuItem to={ROUTES.ADMIN_MODERATION} onClick={() => setMenuOpen(false)} icon={<ShieldCheck className="h-4 w-4" />}>
                          Modération
                        </MenuItem>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors rounded-b-2xl"
                      >
                        <LogOut className="h-4 w-4" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`flex items-center gap-2 border rounded-full px-3 py-2 transition-all ${
                    menuOpen ? 'border-gray-400 shadow-md' : 'border-gray-300 hover:shadow-md'
                  }`}
                >
                  <Menu className="h-4 w-4 text-gray-600" />
                  <div className="h-7 w-7 rounded-full bg-gray-400 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <Link
                      to={ROUTES.REGISTER}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      S'inscrire
                    </Link>
                    <Link
                      to={ROUTES.LOGIN}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Se connecter
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <Link
                        to={ROUTES.ANNONCES}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Voir les annonces
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile search bar */}
        <form
          onSubmit={handleSearch}
          className="md:hidden flex items-center border border-gray-300 rounded-full shadow-sm mb-3 overflow-hidden"
        >
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Ville, quartier..."
            className="flex-1 px-4 py-2 text-sm outline-none bg-transparent"
            list="cities-datalist-mobile"
          />
          <datalist id="cities-datalist-mobile">
            {CITIES_CAMEROUN.map((c) => <option key={c} value={c} />)}
          </datalist>
          <button
            type="submit"
            className="m-1 bg-blue-600 text-white rounded-full p-2"
            aria-label="Rechercher"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
};

const MenuItem = ({ to, onClick, icon, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
  >
    <span className="text-gray-400">{icon}</span>
    {children}
  </Link>
);

export default HomeNavbar;
