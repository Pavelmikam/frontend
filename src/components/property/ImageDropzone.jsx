import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, X, AlertCircle } from 'lucide-react';

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = { 'image/jpeg': [], 'image/png': [], 'image/webp': [] };

const ImageDropzone = ({
  onFilesAdded,
  initialFiles = [],
  maxFiles = 10,
  currentCount = 0,
  disabled = false,
}) => {
  // Start with null URLs — created in useEffect to survive React StrictMode cleanup
  const [previews, setPreviews] = useState(() =>
    initialFiles.map((file) => ({ file, url: null, name: file.name }))
  );
  const [errors, setErrors] = useState([]);

  // Create blob URLs in an effect so StrictMode's cleanup/remount cycle recreates them
  useEffect(() => {
    if (initialFiles.length === 0) return;

    const entries = initialFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreviews(entries);

    return () => {
      entries.forEach((e) => URL.revokeObjectURL(e.url));
      // Reset to null so the next effect run (StrictMode remount) recreates URLs
      setPreviews(initialFiles.map((file) => ({ file, url: null, name: file.name })));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const remaining = maxFiles - currentCount - previews.length;

  const onDrop = useCallback(
    (accepted, rejected) => {
      const newErrors = rejected.map((f) => {
        if (f.errors.some((e) => e.code === 'file-too-large'))
          return `${f.file.name} : taille supérieure à 5 Mo.`;
        if (f.errors.some((e) => e.code === 'file-invalid-type'))
          return `${f.file.name} : format non supporté (JPG, PNG, WebP uniquement).`;
        return `${f.file.name} : fichier invalide.`;
      });
      setErrors(newErrors);
      if (!accepted.length) return;

      const toAdd = accepted.slice(0, remaining);
      const newPreviews = toAdd.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }));

      const updated = [...previews, ...newPreviews];
      setPreviews(updated);
      onFilesAdded(updated.map((p) => p.file));
    },
    [remaining, onFilesAdded, previews],
  );

  const removePreview = (index) => {
    const removed = previews[index];
    if (removed?.url) URL.revokeObjectURL(removed.url);
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onFilesAdded(updated.map((p) => p.file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    maxFiles: Math.max(0, remaining),
    disabled: disabled || remaining <= 0,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}
          ${disabled || remaining <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Camera className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-700">
          {isDragActive ? 'Déposez les photos ici…' : 'Glissez-déposez vos photos ou cliquez'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          JPG, PNG, WebP — max 5 Mo par fichier
          {remaining > 0 && ` · ${remaining} photo${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}`}
        </p>
      </div>

      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((err, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              {err}
            </div>
          ))}
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group bg-gray-100">
              {preview.url && (
                <img src={preview.url} alt={preview.name} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <button
                type="button"
                onClick={() => removePreview(index)}
                className="absolute top-1 right-1 bg-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                aria-label="Supprimer"
              >
                <X className="h-3 w-3 text-gray-700" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
