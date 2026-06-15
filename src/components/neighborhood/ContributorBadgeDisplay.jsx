import { useState } from 'react';
import { CONTRIBUTOR_BADGES } from '@/utils/constants';

const ContributorBadgeDisplay = ({ badges = [], size = 'md', showAll = false }) => {
  const [tooltip, setTooltip] = useState(null);

  if (!badges || badges.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        Aucun badge pour l'instant. Commencez à évaluer des quartiers !
      </p>
    );
  }

  const displayed = showAll ? badges : badges.slice(0, 3);
  const extra = badges.length - displayed.length;
  const iconSize = size === 'sm' ? 'text-xl' : 'text-2xl';
  const padClass = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <div className="flex flex-wrap gap-2">
      {displayed.map((key) => {
        const badge = CONTRIBUTOR_BADGES[key];
        if (!badge) return null;
        return (
          <div
            key={key}
            className={`relative ${padClass} bg-white border border-gray-200 rounded-xl shadow-sm cursor-default hover:border-blue-300 transition-colors`}
            onMouseEnter={() => setTooltip(key)}
            onMouseLeave={() => setTooltip(null)}
          >
            <span className={iconSize}>{badge.icon}</span>
            {size !== 'sm' && (
              <p className="text-xs text-gray-600 mt-0.5 font-medium">{badge.label}</p>
            )}
            {tooltip === key && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-gray-900 text-white text-xs rounded-lg px-2 py-1.5 text-center shadow-lg z-10 pointer-events-none">
                <p className="font-medium">{badge.label}</p>
                <p className="text-gray-300 mt-0.5">{badge.description}</p>
              </div>
            )}
          </div>
        );
      })}
      {extra > 0 && (
        <div className={`${padClass} bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center`}>
          <span className="text-sm font-medium text-gray-500">+{extra}</span>
        </div>
      )}
    </div>
  );
};

export default ContributorBadgeDisplay;
