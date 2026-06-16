import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MoreVertical, Archive, ArchiveX, ExternalLink, MessageSquare } from 'lucide-react';
import { isToday, isYesterday, format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useConversation, useConversationMutations } from '@/hooks/useConversations';
import { useMessagesPolling } from '@/hooks/useMessages';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import Avatar from '@/components/ui/Avatar';
import Spinner from '@/components/ui/Spinner';
import { ROUTES } from '@/utils/constants';

const DaySeparator = ({ date }) => {
  let label;
  if (isToday(date)) label = "Aujourd'hui";
  else if (isYesterday(date)) label = 'Hier';
  else label = format(date, 'd MMMM yyyy', { locale: fr });

  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400 flex-shrink-0">{label}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
};

const ConversationView = ({ conversationId }) => {
  const bottomRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  const { data: convData, isLoading: convLoading } = useConversation(conversationId);
  const { messages, isLoading: msgLoading } = useMessagesPolling(conversationId, true);
  const { archive, unarchive } = useConversationMutations();

  const conversation = convData?.conversation ?? convData;
  const other = conversation?.other_participant ?? {};
  const property = conversation?.property ?? {};
  const isArchived = conversation?.is_archived;

  // Scroll to bottom quand de nouveaux messages arrivent
  useEffect(() => {
    if (messages.length !== prevCount) {
      setPrevCount(messages.length);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleSent = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isLoading = convLoading || msgLoading;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>Conversation introuvable.</p>
      </div>
    );
  }

  // Regrouper les messages par jour
  const groups = [];
  let lastDate = null;
  for (const msg of messages) {
    const d = new Date(msg.created_at);
    if (!lastDate || !isSameDay(d, lastDate)) {
      groups.push({ type: 'separator', date: d, key: `sep-${msg.id}` });
      lastDate = d;
    }
    groups.push({ type: 'message', msg, key: `msg-${msg.id}` });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
        <Avatar src={other.avatar_thumb_url} name={other.name} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{other.name}</p>
          {property.title && (
            <Link
              to={`${ROUTES.ANNONCES}/${property.id}`}
              className="text-xs text-blue-600 hover:underline truncate flex items-center gap-1"
            >
              <Building2 className="h-3 w-3" />
              {property.title}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {conversation.rental_request_id && (
            <Link
              to={`/candidatures/${conversation.rental_request_id}`}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Candidature
            </Link>
          )}

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    isArchived ? unarchive.mutate(conversationId) : archive.mutate(conversationId);
                    setMenuOpen(false);
                  }}
                >
                  {isArchived ? <ArchiveX className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                  {isArchived ? 'Désarchiver' : 'Archiver'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages zone */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
        onClick={() => setMenuOpen(false)}
      >
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">Commencez la conversation !</p>
          </div>
        ) : (
          groups.map((item) =>
            item.type === 'separator' ? (
              <DaySeparator key={item.key} date={item.date} />
            ) : (
              <MessageBubble
                key={item.key}
                message={item.msg}
                isOwn={item.msg.is_mine}
              />
            )
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        conversationId={conversationId}
        onSent={handleSent}
        disabled={false}
      />
    </div>
  );
};

export default ConversationView;
