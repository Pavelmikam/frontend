import { useState } from 'react';
import { Flag } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import ReportModal from './ReportModal';

const ReportButton = ({ type, targetId, ownerId, className = '' }) => {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) return null;
  if (ownerId && user?.id === ownerId) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Signaler"
        className={`flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors ${className}`}
      >
        <Flag className="h-3.5 w-3.5" />
        <span>Signaler</span>
      </button>

      <ReportModal
        isOpen={open}
        onClose={() => setOpen(false)}
        type={type}
        targetId={targetId}
      />
    </>
  );
};

export default ReportButton;
