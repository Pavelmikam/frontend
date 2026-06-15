import { getScoreColor, getScoreLabel } from '@/utils/constants';

const COLOR_CLASSES = {
  green:  { bar: 'bg-green-500',  text: 'text-green-700' },
  lime:   { bar: 'bg-lime-500',   text: 'text-lime-700'  },
  yellow: { bar: 'bg-yellow-400', text: 'text-yellow-700' },
  red:    { bar: 'bg-red-500',    text: 'text-red-700'   },
  gray:   { bar: 'bg-gray-300',   text: 'text-gray-500'  },
};

const NeighborhoodScoreMeter = ({ score, label, size = 'md' }) => {
  const color = getScoreColor(score);
  const { bar, text } = COLOR_CLASSES[color] ?? COLOR_CLASSES.gray;
  const pct = score ? Math.min((score / 5) * 100, 100) : 0;

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  const textClass   = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        {label && <span className={`${textClass} text-gray-600 truncate pr-2`}>{label}</span>}
        <span className={`${textClass} font-semibold ${text} shrink-0`}>
          {score ? score.toFixed(1) : '—'}/5
        </span>
      </div>
      <div className={`w-full bg-gray-200 rounded-full ${heightClass} overflow-hidden`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-500 ${bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {size !== 'sm' && (
        <p className={`mt-0.5 text-xs ${text}`}>{getScoreLabel(score)}</p>
      )}
    </div>
  );
};

export default NeighborhoodScoreMeter;
