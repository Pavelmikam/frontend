import { useState } from 'react';
import { Star, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { NEIGHBORHOOD_CRITERIA, getScoreColor, getScoreLabel } from '@/utils/constants';
import NeighborhoodScoreMeter from './NeighborhoodScoreMeter';

const BADGE_COLORS = {
  green:  'bg-green-100 text-green-800 border-green-200',
  lime:   'bg-lime-100  text-lime-800  border-lime-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  red:    'bg-red-100   text-red-800   border-red-200',
  gray:   'bg-gray-100  text-gray-600  border-gray-200',
};

const NeighborhoodScoreCard = ({ score, isLoading, compact = false, onEvaluate }) => {
  if (isLoading) {
    if (compact) {
      return <div className="h-6 w-14 bg-gray-200 rounded-full animate-pulse" />;
    }
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-5 bg-gray-200 rounded w-40" />
        <div className="h-8 bg-gray-200 rounded w-24" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-3 bg-gray-200 rounded" />
        ))}
      </div>
    );
  }

  if (compact) {
    if (!score?.global_score) return null;
    const color = getScoreColor(score.global_score);
    const badgeClass = BADGE_COLORS[color] ?? BADGE_COLORS.gray;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
        <Star className="h-3 w-3 fill-current" />
        {score.global_score.toFixed(1)}
      </span>
    );
  }

  if (!score) {
    return (
      <div className="text-center py-6">
        <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-600 font-medium">Aucun score disponible.</p>
        <p className="text-xs text-gray-400 mt-1">Soyez le premier à évaluer ce quartier !</p>
        {onEvaluate && (
          <button
            onClick={onEvaluate}
            className="mt-3 text-sm text-blue-600 hover:underline font-medium"
          >
            Évaluer ce quartier →
          </button>
        )}
      </div>
    );
  }

  const color = getScoreColor(score.global_score);
  const badgeClass = BADGE_COLORS[color] ?? BADGE_COLORS.gray;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Score global</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-3xl font-bold text-gray-900">
              {score.global_score?.toFixed(1)}
            </span>
            <span className="text-gray-400">/5</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
              {getScoreLabel(score.global_score)}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Basé sur {score.report_count ?? 0} évaluation(s)
          </p>
        </div>
        {onEvaluate && (
          <button
            onClick={onEvaluate}
            className="text-xs text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors"
          >
            Évaluer
          </button>
        )}
      </div>

      {score.criteria && (
        <div className="space-y-3">
          {NEIGHBORHOOD_CRITERIA.map((c) => {
            const data = score.criteria?.[c.value];
            if (!data) return null;
            return (
              <div key={c.value} className="flex items-center gap-2">
                <span className="text-base w-6 shrink-0">{c.icon}</span>
                <NeighborhoodScoreMeter
                  score={data.score}
                  label={c.label}
                  size="sm"
                />
              </div>
            );
          })}
        </div>
      )}

      {score.computed_at && (
        <p className="text-xs text-gray-400">
          Calculé{' '}
          {formatDistanceToNow(new Date(score.computed_at), { addSuffix: true, locale: fr })}
        </p>
      )}
    </div>
  );
};

export default NeighborhoodScoreCard;
