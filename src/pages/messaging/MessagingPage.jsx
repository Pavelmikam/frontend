import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Archive, ArchiveX } from 'lucide-react';
import { useConversations } from '@/hooks/useConversations';
import ConversationCard from '@/components/messaging/ConversationCard';
import ConversationView from '@/components/messaging/ConversationView';
import Spinner from '@/components/ui/Spinner';
import { ROUTES } from '@/utils/constants';
import { Link } from 'react-router-dom';

const MessagingPage = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useConversations({ archived: showArchived || undefined });
  const conversations = data?.data ?? [];

  // Filtre local sur le nom ou le titre du bien
  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.other_participant?.name?.toLowerCase().includes(q) ||
      c.property?.title?.toLowerCase().includes(q)
    );
  });

  // Sélectionner automatiquement la première conversation sur desktop
  useEffect(() => {
    if (!activeId && filtered.length > 0 && window.innerWidth >= 1024) {
      setActiveId(filtered[0].id);
    }
  }, [filtered, activeId]);

  const total = data?.meta?.total ?? conversations.length;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white overflow-hidden rounded-xl border border-gray-200">
      {/* ── Panneau gauche — liste ── */}
      <div className={`w-full lg:w-80 flex-shrink-0 border-r border-gray-200 flex flex-col ${activeId ? 'hidden lg:flex' : 'flex'}`}>
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Messages
            </h1>
            <span className="text-xs text-gray-400">{total} conversation(s)</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-3">
            <button
              onClick={() => { setShowArchived(false); setActiveId(null); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                !showArchived ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Actives
            </button>
            <button
              onClick={() => { setShowArchived(true); setActiveId(null); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                showArchived ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Archive className="h-3 w-3" />
              Archivées
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex justify-center py-8"><Spinner size="md" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune conversation</p>
              {!showArchived && (
                <Link to={ROUTES.ANNONCES} className="text-xs text-blue-600 hover:underline mt-2 block">
                  Parcourir les annonces →
                </Link>
              )}
            </div>
          ) : (
            filtered.map((conv) => (
              <ConversationCard
                key={conv.id}
                conversation={conv}
                isActive={activeId === conv.id}
                onClick={(id) => setActiveId(id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Panneau droit — conversation ── */}
      <div className={`flex-1 flex flex-col min-w-0 ${!activeId ? 'hidden lg:flex' : 'flex'}`}>
        {/* Mobile back button */}
        {activeId && (
          <button
            onClick={() => setActiveId(null)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border-b border-gray-200"
          >
            ← Retour aux messages
          </button>
        )}

        {activeId ? (
          <ConversationView conversationId={activeId} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg font-medium text-gray-500">Sélectionnez une conversation</p>
            <p className="text-sm mt-1">Choisissez une conversation dans la liste à gauche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
