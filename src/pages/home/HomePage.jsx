import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, MapPin, Heart, Bell, Map, Shield,
  ArrowRight, Home, ChevronRight, SlidersHorizontal,
  CheckCircle, Building2, UserCheck, Clock,
} from 'lucide-react';
import { CITIES_CAMEROUN, PROPERTY_TYPES, AMENITIES, ROUTES } from '@/utils/constants';

/* ─────────────────────────────────────────────────────────
   Données 100 % ImmoConnect
───────────────────────────────────────────────────────── */

// Ce que la plateforme offre RÉELLEMENT
const FEATURES = [
  {
    icon: <SlidersHorizontal className="h-6 w-6" />,
    color: 'text-blue-600 bg-blue-50',
    title: 'Filtres avancés',
    desc: 'Filtrez par ville, quartier, type de bien, fourchette de prix, surface, nombre de pièces, équipements et date de disponibilité.',
  },
  {
    icon: <Map className="h-6 w-6" />,
    color: 'text-green-600 bg-green-50',
    title: 'Vue carte',
    desc: 'Visualisez les annonces sur une carte interactive. Recherchez dans un rayon précis autour de votre position GPS.',
  },
  {
    icon: <Heart className="h-6 w-6" />,
    color: 'text-red-500 bg-red-50',
    title: 'Favoris',
    desc: 'Sauvegardez les annonces qui vous intéressent et comparez-les tranquillement depuis votre espace personnel.',
  },
  {
    icon: <Bell className="h-6 w-6" />,
    color: 'text-orange-500 bg-orange-50',
    title: 'Alertes email',
    desc: 'Sauvegardez vos critères de recherche. Recevez une alerte dès qu\'une nouvelle annonce correspondante est publiée.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    color: 'text-purple-600 bg-purple-50',
    title: 'Annonces validées',
    desc: 'Chaque annonce est examinée et approuvée par notre équipe avant d\'être visible. Aucune annonce frauduleuse.',
  },
  {
    icon: <UserCheck className="h-6 w-6" />,
    color: 'text-teal-600 bg-teal-50',
    title: 'Contact direct',
    desc: 'Contactez le propriétaire directement par email ou téléphone. Pas d\'intermédiaire, pas de commission cachée.',
  },
];

// Workflow réel de la plateforme
const HOW_IT_WORKS = {
  locataire: [
    {
      step: '1',
      icon: <Search className="h-5 w-5" />,
      title: 'Recherchez',
      desc: 'Utilisez les filtres avancés ou la carte pour trouver un bien correspondant exactement à vos critères.',
    },
    {
      step: '2',
      icon: <Heart className="h-5 w-5" />,
      title: 'Sauvegardez & comparez',
      desc: 'Ajoutez des annonces à vos favoris, sauvegardez vos recherches avec alertes pour ne rien manquer.',
    },
    {
      step: '3',
      icon: <UserCheck className="h-5 w-5" />,
      title: 'Contactez le propriétaire',
      desc: 'Écrivez directement au propriétaire via email ou appelez-le. Organisez votre visite sans intermédiaire.',
    },
  ],
  proprietaire: [
    {
      step: '1',
      icon: <Building2 className="h-5 w-5" />,
      title: 'Publiez votre annonce',
      desc: 'Remplissez le formulaire en 6 étapes : type, localisation, prix, équipements, photos, et disponibilité.',
    },
    {
      step: '2',
      icon: <Clock className="h-5 w-5" />,
      title: 'Validation par notre équipe',
      desc: 'Votre annonce est examinée sous 24h. Si elle respecte nos critères, elle est approuvée et mise en ligne.',
    },
    {
      step: '3',
      icon: <UserCheck className="h-5 w-5" />,
      title: 'Recevez des locataires',
      desc: 'Les locataires intéressés vous contactent directement. Gérez vos annonces depuis votre tableau de bord.',
    },
  ],
};

// Villes réelles avec les 15 de la constante CITIES_CAMEROUN
const CITY_HIGHLIGHTS = [
  { name: 'Yaoundé',   label: 'Capitale politique' },
  { name: 'Douala',    label: 'Capitale économique' },
  { name: 'Bafoussam', label: 'Hauts-Plateaux' },
  { name: 'Kribi',     label: 'Côte Atlantique' },
  { name: 'Limbe',     label: 'Côte du Mont Cameroun' },
  { name: 'Bamenda',   label: 'Nord-Ouest' },
];

/* ─────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────── */

const HomePage = () => {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');
  const [tab, setTab] = useState('locataire');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (searchType) params.set('type', searchType);
    navigate(`/annonces${params.size ? `?${params}` : ''}`);
  };

  return (
    <div className="bg-white text-gray-900">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 overflow-hidden">
        {/* Cercles décoratifs discrets */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/[0.04]" />
          <div className="absolute -bottom-28 -left-12 w-72 h-72 rounded-full bg-white/[0.04]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            Louez votre logement<br />au <span className="text-blue-200">Cameroun</span>
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Appartements, studios, chambres, maisons — des annonces vérifiées dans 15 villes.
            Trouvez, sauvegardez et contactez directement les propriétaires.
          </p>

          {/* Formulaire de recherche */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-2xl p-3 max-w-3xl mx-auto flex flex-col sm:flex-row gap-2"
          >
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-400 transition-all">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Ville ou quartier..."
                className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
                list="hero-cities"
              />
              <datalist id="hero-cities">
                {CITIES_CAMEROUN.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div className="sm:w-48 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-400 transition-all">
              <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
              >
                <option value="">Type de bien</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <Search className="h-4 w-4" />
              Rechercher
            </button>
          </form>

          {/* Raccourcis types de biens */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {PROPERTY_TYPES.slice(0, 5).map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => navigate(`/annonces?type=${t.value}`)}
                className="text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors border border-white/20"
              >
                {t.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => navigate('/annonces')}
              className="text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors border border-white/20"
            >
              Voir tout →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TYPES DE LOGEMENTS (navigation rapide)
      ══════════════════════════════════════════ */}
      <section className="border-b border-gray-100 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {PROPERTY_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => navigate(`/annonces?type=${t.value}`)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all text-sm text-gray-600 font-medium group"
              >
                <Home className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CE QUE VOUS POUVEZ FAIRE
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">La plateforme</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Tout ce qu'ImmoConnect vous offre
            </h2>
            <p className="text-gray-500 max-w-xl">
              Des outils pensés pour simplifier la recherche de logement en location au Cameroun.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, color, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 ${color}`}>
                  {icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COMMENT ÇA MARCHE (workflow réel)
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Fonctionnement</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Comment ça marche ?</h2>
          </div>

          {/* Onglets rôles */}
          <div className="flex justify-center gap-2 mb-12">
            {[
              { key: 'locataire',    label: 'Je cherche à louer' },
              { key: 'proprietaire', label: 'Je propose un bien' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  tab === key
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS[tab].map(({ step, icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white mb-4 shadow-md shadow-blue-200 flex-shrink-0">
                  {icon}
                </div>
                <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Étape {step}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to={tab === 'locataire' ? ROUTES.ANNONCES : ROUTES.REGISTER}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
            >
              {tab === 'locataire' ? 'Voir les annonces' : 'Créer un compte propriétaire'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VILLES COUVERTES
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Couverture</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                15 villes au Cameroun
              </h2>
            </div>
            <Link
              to={ROUTES.ANNONCES}
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
            >
              Toutes les villes <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Villes mises en avant */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {CITY_HIGHLIGHTS.map(({ name, label }) => (
              <button
                key={name}
                type="button"
                onClick={() => navigate(`/annonces?city=${encodeURIComponent(name)}`)}
                className="group relative bg-white rounded-2xl border border-gray-200 p-6 text-left hover:border-blue-400 hover:shadow-md transition-all duration-200"
              >
                <MapPin className="h-5 w-5 text-blue-500 mb-3" />
                <p className="font-bold text-gray-900 text-lg">{name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                <ArrowRight className="h-4 w-4 text-blue-400 absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

          {/* Autres villes en badges */}
          <div className="flex flex-wrap gap-2">
            {CITIES_CAMEROUN.filter((c) => !CITY_HIGHLIGHTS.find((h) => h.name === c)).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => navigate(`/annonces?city=${encodeURIComponent(city)}`)}
                className="text-sm text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-blue-600 px-4 py-2 rounded-full transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ÉQUIPEMENTS DISPONIBLES
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Filtres disponibles</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Recherchez par équipements</h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm">
              Chaque annonce précise ses équipements. Vous pouvez filtrer votre recherche pour n'afficher que les biens qui ont TOUS les équipements sélectionnés.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {AMENITIES.map(({ value, label, icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => navigate(`/annonces?amenities[]=${value}`)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all"
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          GARANTIES DE LA PLATEFORME
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: <Shield className="h-8 w-8 mx-auto text-blue-600 mb-4" />,
                title: 'Annonces validées',
                desc: 'Chaque bien est examiné par notre équipe. Seules les annonces approuvées sont visibles sur la plateforme.',
              },
              {
                icon: <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-4" />,
                title: 'Aucune commission',
                desc: 'ImmoConnect met en relation directe propriétaires et locataires. Aucune commission sur la transaction.',
              },
              {
                icon: <Clock className="h-8 w-8 mx-auto text-orange-500 mb-4" />,
                title: 'Statut en temps réel',
                desc: 'Chaque annonce affiche son statut exact : disponible, sous réservation, loué. Toujours à jour.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 border border-gray-100">
                {icon}
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA — DEUX PUBLICS
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Locataire */}
            <div className="bg-blue-600 rounded-3xl p-10 text-white flex flex-col justify-between">
              <div>
                <Search className="h-8 w-8 mb-4 opacity-80" />
                <h3 className="text-2xl font-extrabold mb-3">Vous cherchez à louer ?</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">
                  Parcourez des centaines d'annonces de logements disponibles dans toutes les grandes villes
                  du Cameroun. Filtres avancés, carte interactive, favoris et alertes email inclus.
                </p>
              </div>
              <Link
                to={ROUTES.ANNONCES}
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors self-start"
              >
                Voir les annonces <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Propriétaire */}
            <div className="bg-gray-900 rounded-3xl p-10 text-white flex flex-col justify-between">
              <div>
                <Building2 className="h-8 w-8 mb-4 opacity-80" />
                <h3 className="text-2xl font-extrabold mb-3">Vous avez un bien à louer ?</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Publiez votre annonce en quelques minutes. Ajoutez photos, description, équipements et prix.
                  Notre équipe la valide et elle devient visible par tous les locataires de la plateforme.
                </p>
              </div>
              <Link
                to={ROUTES.REGISTER}
                className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors self-start"
              >
                Publier gratuitement <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

            {/* Marque */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Home className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-white text-lg">ImmoConnect</span>
              </div>
              <p className="text-sm leading-relaxed">
                Plateforme de location immobilière au Cameroun. Locataires et propriétaires en contact direct.
              </p>
            </div>

            {/* Locataires */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Locataires</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={ROUTES.ANNONCES} className="hover:text-white transition-colors">Voir les annonces</Link></li>
                <li><Link to="/annonces?sort=newest" className="hover:text-white transition-colors">Nouveautés</Link></li>
                <li><Link to={ROUTES.LOGIN} className="hover:text-white transition-colors">Mon espace</Link></li>
              </ul>
            </div>

            {/* Propriétaires */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Propriétaires</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={ROUTES.REGISTER} className="hover:text-white transition-colors">Créer un compte</Link></li>
                <li><Link to={ROUTES.LOGIN} className="hover:text-white transition-colors">Publier une annonce</Link></li>
                <li><Link to={ROUTES.LOGIN} className="hover:text-white transition-colors">Gérer mes annonces</Link></li>
              </ul>
            </div>

            {/* Villes */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Villes</h4>
              <ul className="space-y-2 text-sm">
                {['Yaoundé', 'Douala', 'Bafoussam', 'Kribi', 'Bamenda', 'Limbe'].map((c) => (
                  <li key={c}>
                    <Link to={`/annonces?city=${encodeURIComponent(c)}`} className="hover:text-white transition-colors">
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <p>© {new Date().getFullYear()} ImmoConnect Cameroun. Tous droits réservés.</p>
            <div className="flex gap-5">
              <span className="cursor-pointer hover:text-white transition-colors">Confidentialité</span>
              <span className="cursor-pointer hover:text-white transition-colors">Conditions</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
