import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ConversationView from '@/components/messaging/ConversationView';

const ConversationPage = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <Link
          to="/messagerie"
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux messages
        </Link>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <ConversationView conversationId={Number(id)} />
      </div>
    </div>
  );
};

export default ConversationPage;
