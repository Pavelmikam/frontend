import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { NEIGHBORHOOD_CRITERIA } from '@/utils/constants';
import { usePropertyNeighborhoodReviews } from '@/hooks/useNeighborhoodScore';
import Spinner from '@/components/ui/Spinner';

const NeighborhoodReviewsList = ({ propertyId }) => {
  const { data, isLoading } = usePropertyNeighborhoodReviews(propertyId);
  const reviews = data?.data ?? [];

  if (isLoading) {
    return <div className="flex justify-center py-4"><Spinner /></div>;
  }

  if (!reviews.length) {
    return (
      <p className="text-sm text-gray-400 text-center py-3">
        Aucun avis disponible pour ce quartier.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => {
        const criterion = NEIGHBORHOOD_CRITERIA.find((c) => c.value === review.criterion);
        const timeAgo = review.created_at
          ? formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: fr })
          : '';

        return (
          <div key={review.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
            <span className="text-xl shrink-0 mt-0.5">{criterion?.icon ?? '📍'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-700">
                  {criterion?.label ?? review.criterion}
                </span>
                <div className="flex gap-0.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className={`text-xs ${n <= review.score ? 'text-yellow-400' : 'text-gray-200'}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-xs text-gray-600 mb-1.5 leading-relaxed">{review.comment}</p>
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-400">{review.user?.name ?? 'Anonyme'}</span>
                <span className="text-xs text-gray-400">{timeAgo}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NeighborhoodReviewsList;
