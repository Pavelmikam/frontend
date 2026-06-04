import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { User, LogOut, ChevronDown, AlertTriangle, Plus, ShieldCheck, Heart, Bookmark, Briefcase } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useRentalRequests } from '@/hooks/useRentalRequests';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { ROUTES } from '@/utils/constants';

const Navbar = () => {
  const { user, logout, isAuthenticated, isEmailVerified, isLocataire, isProprietaire, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: favData } = useFavorites({});
  const favCount = favData?.meta?.total ?? 0;

  const { data: pendingRequestsData } = useRentalRequests(
    { status: 'en_attente' },
    { enabled: isAuthenticated }
  );
  const pendingCount = pendingRequestsData?.meta?.total ?? pendingRequestsData?.data?.length ?? 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
      isActive
        ? 'text-blue-600 bg-blue-50'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <>
      {isAuthenticated && !isEmailVerified && (
        <div className="bg-orange-500 text-white text-sm py-2 px-4 flex items-center justify-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>
            Votre adresse email n'est pas vérifiée.{' '}
            <Link to={ROUTES.VERIFY_EMAIL} className="underline font-medium hover:no-underline">
              Vérifier maintenant
            </Link>
          </span>
        </div>
      )}

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + nav links */}
            <div className="flex items-center gap-4">
              <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.ANNONCES} className="flex items-center gap-2">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IC</span>
                </div>
                <span className="font-bold text-gray-900 text-lg hidden sm:block">ImmoConnect</span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                <NavLink to={ROUTES.ANNONCES} className={navLinkClass}>
                  Annonces
                </NavLink>
                {isAuthenticated && (
                  <NavLink to={ROUTES.MES_FAVORIS} className={({ isActive }) =>
                    `relative text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${
                      isActive ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }>
                    <Heart className="h-4 w-4" />
                    Favoris
                    {favCount > 0 && (
                      <span className="ml-0.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                        {favCount}
                      </span>
                    )}
                  </NavLink>
                )}
                {isAuthenticated && (
                  <NavLink to={ROUTES.MES_RECHERCHES} className={({ isActive }) =>
                    `text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${
                      isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }>
                    <Bookmark className="h-4 w-4" />
                    Recherches
                  </NavLink>
                )}
                {isLocataire && (
                  <NavLink to="/mes-candidatures" className={({ isActive }) =>
                    `text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${
                      isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }>
                    <Briefcase className="h-4 w-4" />
                    Candidatures
                    {pendingCount > 0 && (
                      <span className="ml-0.5 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                        {pendingCount}
                      </span>
                    )}
                  </NavLink>
                )}
                {isProprietaire && (
                  <NavLink to={ROUTES.MES_ANNONCES} className={({ isActive }) =>
                    `relative text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${
                      isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }>
                    Mes annonces
                    {pendingCount > 0 && (
                      <span className="ml-0.5 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                        {pendingCount}
                      </span>
                    )}
                  </NavLink>
                )}
                {isAdmin && (
                  <NavLink to={ROUTES.ADMIN_MODERATION} className={({ isActive }) =>
                    `text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${
                      isActive ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }>
                    <ShieldCheck className="h-4 w-4" />
                    Modération
                  </NavLink>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              {isAuthenticated && isProprietaire && (
                <Link
                  to={ROUTES.MES_ANNONCES_CREER}
                  className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Déposer
                </Link>
              )}

              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Avatar src={user?.avatar_thumb_url} name={user?.name} size="sm" />
                    <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <Avatar src={user?.avatar_thumb_url} name={user?.name} size="md" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          </div>
                        </div>
                        <div className="mt-2"><Badge role={user?.role} /></div>
                      </div>

                      <Link to={ROUTES.DASHBOARD} onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Tableau de bord
                      </Link>
                      <Link to={ROUTES.PROFILE} onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <User className="h-4 w-4 text-gray-400" />
                        Mon profil
                      </Link>
                      <Link to={ROUTES.MES_FAVORIS} onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Heart className="h-4 w-4 text-gray-400" />
                        Mes favoris{favCount > 0 && ` (${favCount})`}
                      </Link>
                      <Link to={ROUTES.MES_RECHERCHES} onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Bookmark className="h-4 w-4 text-gray-400" />
                        Mes recherches
                      </Link>
                      {isLocataire && (
                        <Link to="/mes-candidatures" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          Mes candidatures{pendingCount > 0 && ` (${pendingCount})`}
                        </Link>
                      )}

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors">
                          <LogOut className="h-4 w-4" />
                          Se déconnecter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to={ROUTES.LOGIN}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    Se connecter
                  </Link>
                  <Link to={ROUTES.REGISTER}
                    className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors">
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
