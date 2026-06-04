import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Image as ImageIcon, Download, Trash2, CheckCircle, Clock, Upload, Info } from 'lucide-react';
import { getDocumentDownloadUrl } from '@/api/rentalRequest.api';
import { useDocumentMutations } from '@/hooks/useDocumentMutations';
import { DOCUMENT_TYPES, REQUIRED_DOCUMENT_TYPES } from '@/utils/constants';
import Button from '@/components/ui/Button';

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const DocTypeLabel = ({ type }) => {
  const def = DOCUMENT_TYPES.find((d) => d.value === type);
  return <span>{def?.label ?? type}</span>;
};

const DossierLocatif = ({ request, canEdit, isAdmin, rentalRequestId }) => {
  const [selectedType, setSelectedType] = useState('cni');
  const [description, setDescription] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const { upload, delete: deleteMut, verify } = useDocumentMutations(rentalRequestId);

  const documents = request?.documents ?? [];

  const requiredPresent = REQUIRED_DOCUMENT_TYPES.filter((t) =>
    documents.some((d) => d.type === t)
  );
  const dossierComplete = requiredPresent.length === REQUIRED_DOCUMENT_TYPES.length;

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setPendingFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: !canEdit,
  });

  const handleUpload = () => {
    if (!pendingFile) return;
    upload.mutate(
      { file: pendingFile, type: selectedType, description },
      {
        onSuccess: () => {
          setPendingFile(null);
          setDescription('');
        },
      }
    );
  };

  const handleDownload = async (documentId) => {
    setDownloadingId(documentId);
    try {
      const { download_url } = await getDocumentDownloadUrl(documentId);
      window.open(download_url, '_blank');
    } catch {
      // error handled by axiosInstance
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = (docId) => {
    deleteMut.mutate(docId, { onSuccess: () => setDeleteConfirm(null) });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Dossier locatif</h3>
        {dossierComplete ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
            <CheckCircle className="h-3 w-3" /> Complet
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-1">
            <Clock className="h-3 w-3" /> Incomplet ({requiredPresent.length}/{REQUIRED_DOCUMENT_TYPES.length} requis)
          </span>
        )}
      </div>

      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
        <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          Documents recommandés : <strong>Carte Nationale d'Identité</strong> + <strong>Bulletin de salaire</strong>
        </p>
      </div>

      {/* Document list */}
      {documents.length === 0 ? (
        <p className="text-sm text-gray-400 italic mb-4">Aucun document ajouté.</p>
      ) : (
        <div className="space-y-2 mb-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {doc.mime_type === 'application/pdf' ? (
                <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
              ) : (
                <ImageIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{doc.original_name}</p>
                <p className="text-xs text-gray-500">
                  <DocTypeLabel type={doc.type} />
                  {doc.file_size ? ` · ${formatFileSize(doc.file_size)}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {doc.is_verified && (
                  <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Vérifié
                  </span>
                )}

                <button
                  onClick={() => handleDownload(doc.id)}
                  disabled={downloadingId === doc.id}
                  className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-500 hover:text-blue-600"
                  title="Télécharger"
                >
                  <Download className="h-4 w-4" />
                </button>

                {isAdmin && !doc.is_verified && (
                  <button
                    onClick={() => verify.mutate(doc.id)}
                    disabled={verify.isPending}
                    className="text-xs text-blue-600 hover:underline px-2 py-1"
                  >
                    Vérifier
                  </button>
                )}

                {canEdit && (
                  deleteConfirm === doc.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-xs text-red-600 font-medium hover:underline"
                        disabled={deleteMut.isPending}
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(doc.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload section */}
      {canEdit && (
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">Ajouter un document</p>

          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-2">
            <Info className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Un seul document par type. Un nouvel upload remplacera le document existant.
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Type de document</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DOCUMENT_TYPES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : pendingFile
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            {pendingFile ? (
              <div className="flex items-center justify-center gap-2 text-green-700">
                <FileText className="h-5 w-5" />
                <span className="text-sm font-medium">{pendingFile.name}</span>
                <span className="text-xs text-gray-500">({formatFileSize(pendingFile.size)})</span>
              </div>
            ) : (
              <div>
                <Upload className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">
                  {isDragActive ? 'Déposez le fichier ici' : 'Glissez un fichier ou cliquez pour sélectionner'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG · max 10 Mo</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Description <span className="text-gray-400">(optionnel)</span></label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: CNI recto-verso"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!pendingFile || upload.isPending}
            className="w-full flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {upload.isPending ? 'Upload en cours...' : 'Ajouter le document'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DossierLocatif;
