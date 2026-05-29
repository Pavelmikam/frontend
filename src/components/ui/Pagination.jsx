const Pagination = ({ currentPage, lastPage, onPageChange, isLoading }) => {
  if (!lastPage || lastPage <= 1) return null;

  const pages = [];
  const delta = 2;

  const range = (start, end) => {
    const result = [];
    for (let i = start; i <= end; i++) result.push(i);
    return result;
  };

  const left = Math.max(2, currentPage - delta);
  const right = Math.min(lastPage - 1, currentPage + delta);

  pages.push(1);
  if (left > 2) pages.push('...');
  pages.push(...range(left, right));
  if (right < lastPage - 1) pages.push('...');
  if (lastPage > 1) pages.push(lastPage);

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
        className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ← Précédent
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            disabled={isLoading}
            className={`min-w-[36px] h-9 text-sm rounded-lg border transition-colors ${
              p === currentPage
                ? 'bg-blue-600 text-white border-blue-600 font-medium'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= lastPage || isLoading}
        className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Suivant →
      </button>
    </nav>
  );
};

export default Pagination;
