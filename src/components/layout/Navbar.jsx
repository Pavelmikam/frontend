import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { User, LogOut, ChevronDown, AlertTriangle, Plus, ShieldCheck, Heart, Bookmark, Briefcase, MessageSquare, LayoutDashboard, Users, Flag, Tag, ScrollText, MapPin, Star, TrendingUp, BarChart2, Download, Menu, X } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useRentalRequests } from '@/hooks/useRentalRequests';
import { useUnreadCount } from '@/hooks/useConversations';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import UnreadBadge from '@/components/ui/UnreadBadge';
import NotificationBellButton from '@/components/notifications/NotificationBellButton';
import { ROUTES } from '@/utils/constants';

const AdminDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const links = [
    { path: '/admin',                 label: 'Dashboard',      icon: LayoutDashboard },
    { path: '/admin/utilisateurs',    label: 'Utilisateurs',   icon: Users           },
    { path: '/admin/signalements',    label: 'Signalements',   icon: Flag            },
    { path: '/admin/moderation',      label: 'Modération',     icon: ShieldCheck     },
    { path: '/admin/categories',      label: 'Catégories',     icon: Tag             },
    { path: '/admin/journal',         label: 'Journal',        icon: ScrollText      },
    { path: '/admin/quartiers',       label: 'Quartiers',      icon: MapPin          },
    { path: '/admin/statistiques',    label: 'Statistiques',   icon: BarChart2       },
    { path: '/admin/exports',         label: 'Exports',        icon: Download        },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <ShieldCheck className="h-4 w-4" />
        Admin
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
          {links.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Icon className="h-4 w-4 text-gray-400" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { user, logout, isAuthenticated, isEmailVerified, isLocataire, isProprietaire, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: favData } = useFavorites({});
  const favCount = favData?.meta?.total ?? 0;

  const { data: pendingRequestsData } = useRentalRequests(
    { status: 'en_attente' },
    { enabled: isAuthenticated }
  );
  const pendingCount = pendingRequestsData?.meta?.total ?? pendingRequestsData?.data?.length ?? 0;

  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.unread_count ?? 0;

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
    navigate(ROUTES.HOME);
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

                <NavLink to="/annonces/populaires" className={({ isActive }) =>
                  `text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${
                    isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }>
                  <TrendingUp className="h-4 w-4" />
                  Populaires
                </NavLink>

                <NavLink to="/score-quartier" className={({ isActive }) =>
                  `text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${
                    isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }>
                  <MapPin className="h-4 w-4" />
                  Score quartier
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

                {/* Messagerie (locataire + propriétaire) */}
                {isAuthenticated && !isAdmin && (
                  <NavLink to="/messagerie" className={({ isActive }) =>
                    `relative text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${
                      isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }>
                    <MessageSquare className="h-4 w-4" />
                    Messagerie
                    {unreadCount > 0 && (
                      <UnreadBadge count={unreadCount} size="sm" className="ml-0.5" />
                    )}
                  </NavLink>
                )}

                {isAdmin && <AdminDropdown />}
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              {/* Hamburger (mobile only) */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Menu navigation"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Cloche notifications */}
              {isAuthenticated && !isAdmin && (
                <NotificationBellButton />
              )}

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
                    <div className="relative">
                      <Avatar src={user?.avatar_thumb_url} name={user?.name} size="sm" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </div>
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
                      {!isAdmin && (
                        <Link to="/mon-profil-contributeur" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Star className="h-4 w-4 text-gray-400" />
                          Mon profil contributeur
                        </Link>
                      )}
                      {!isAdmin && (
                        <Link to="/messagerie" onClick={() => setDropdownOpen(false)}
                          className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                            Messagerie
                          </div>
                          {unreadCount > 0 && <UnreadBadge count={unreadCount} size="sm" />}
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

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white py-3 px-2">
            <div className="flex flex-col gap-1">
              <NavLink to={ROUTES.ANNONCES} onClick={() => setMobileOpen(false)} className={navLinkClass}>
                Annonces
              </NavLink>
              <NavLink to="/annonces/populaires" onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <TrendingUp className="h-4 w-4" /> Populaires
              </NavLink>
              <NavLink to="/score-quartier" onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <MapPin className="h-4 w-4" /> Score quartier
              </NavLink>
              {isAuthenticated && (
                <NavLink to={ROUTES.MES_FAVORIS} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${isActive ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  <Heart className="h-4 w-4" /> Favoris{favCount > 0 && ` (${favCount})`}
                </NavLink>
              )}
              {isAuthenticated && (
                <NavLink to={ROUTES.MES_RECHERCHES} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  <Bookmark className="h-4 w-4" /> Recherches
                </NavLink>
              )}
              {isLocataire && (
                <NavLink to="/mes-candidatures" onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  <Briefcase className="h-4 w-4" /> Candidatures{pendingCount > 0 && ` (${pendingCount})`}
                </NavLink>
              )}
              {isProprietaire && (
                <NavLink to={ROUTES.MES_ANNONCES} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Mes annonces{pendingCount > 0 && ` (${pendingCount})`}
                </NavLink>
              )}
              {isProprietaire && (
                <NavLink to={ROUTES.MES_ANNONCES_CREER} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  <Plus className="h-4 w-4" /> Déposer une annonce
                </NavLink>
              )}
              {isAuthenticated && !isAdmin && (
                <NavLink to="/messagerie" onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  <MessageSquare className="h-4 w-4" /> Messagerie{unreadCount > 0 && ` (${unreadCount})`}
                </NavLink>
              )}
              {isAdmin && (
                <div className="border-t border-gray-100 mt-1 pt-2">
                  <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Admin</p>
                  {[
                    { path: '/admin',                 label: 'Dashboard',    icon: LayoutDashboard },
                    { path: '/admin/utilisateurs',    label: 'Utilisateurs', icon: Users           },
                    { path: '/admin/signalements',    label: 'Signalements', icon: Flag            },
                    { path: '/admin/moderation',      label: 'Modération',   icon: ShieldCheck     },
                    { path: '/admin/categories',      label: 'Catégories',   icon: Tag             },
                    { path: '/admin/journal',         label: 'Journal',      icon: ScrollText      },
                    { path: '/admin/quartiers',       label: 'Quartiers',    icon: MapPin          },
                    { path: '/admin/statistiques',    label: 'Statistiques', icon: BarChart2       },
                    { path: '/admin/exports',         label: 'Exports',      icon: Download        },
                  ].map(({ path, label, icon: Icon }) => (
                    <Link key={path} to={path} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-lg">
                      <Icon className="h-4 w-4 text-gray-400" />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
