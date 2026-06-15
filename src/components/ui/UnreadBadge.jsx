const UnreadBadge = ({ count = 0, maxCount = 99, size = 'sm', className = '' }) => {
  if (!count || count <= 0) return null;

  const display = count > maxCount ? `${maxCount}+` : String(count);

  const sizeClass = size === 'md'
    ? 'min-w-[20px] h-5 text-xs px-1.5'
    : 'min-w-[16px] h-4 text-[10px] px-1';

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-red-500 text-white font-bold leading-none ${sizeClass} ${className}`}
    >
      {display}
    </span>
  );
};

export default UnreadBadge;
