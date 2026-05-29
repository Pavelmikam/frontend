import { Heart } from 'lucide-react';
import { useToggleFavorite } from '@/hooks/useFavorites';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

const FavoriteButton = ({
  propertyId,
  isFavorited = false,
  size = 'md',
  showCount = false,
  count = 0,
  className = '',
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { mutate, isPending } = useToggleFavorite();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { navigate(ROUTES.LOGIN); return; }
    mutate(propertyId);
  };

  const iconSize = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }[size] || 'w-5 h-5';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={`flex items-center gap-1 transition-all duration-200 ${
        isPending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
      } ${className}`}
    >
      <Heart
        className={`${iconSize} transition-colors duration-200 ${
          isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
        }`}
      />
      {showCount && count > 0 && (
        <span className="text-sm text-gray-500">{count}</span>
      )}
    </button>
  );
};

export default FavoriteButton;
