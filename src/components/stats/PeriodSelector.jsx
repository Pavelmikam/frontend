import { STAT_PERIODS } from '@/utils/constants';

const PeriodSelector = ({ value, onChange, options = STAT_PERIODS }) => (
  <div className="flex items-center gap-1 flex-wrap">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
          value === opt.value
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export default PeriodSelector;
