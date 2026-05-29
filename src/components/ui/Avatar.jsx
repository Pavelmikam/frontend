import { useState } from 'react';

const sizeClasses = {
  sm:  'h-8 w-8 text-xs',
  md:  'h-10 w-10 text-sm',
  lg:  'h-16 w-16 text-lg',
  xl:  'h-24 w-24 text-2xl',
};

const getColorFromName = (name = '') => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500',
    'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const Avatar = ({ src, alt, name = '', size = 'md' }) => {
  const [imgError, setImgError] = useState(false);

  const showImage = src && !imgError;
  const initials = getInitials(name);
  const colorClass = getColorFromName(name);

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0
        ${sizeClasses[size]}
        ${!showImage ? colorClass + ' text-white font-semibold' : ''}
      `}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || name}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  );
};

export default Avatar;
