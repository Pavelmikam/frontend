import { useState, useRef, useCallback } from 'react';
import { Paperclip, Send, X, FileText, Image as ImageIcon } from 'lucide-react';
import { useSendMessage } from '@/hooks/useMessages';
import { MESSAGE_ATTACHMENT_MAX_COUNT, MESSAGE_ATTACHMENT_MAX_SIZE, MESSAGE_ATTACHMENT_MIME_TYPES } from '@/utils/constants';

const MessageInput = ({ conversationId, onSent, disabled }) => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const { mutate: sendMsg, isPending } = useSendMessage(conversationId);

  const handleSend = useCallback(() => {
    if (!text.trim() || isPending) return;
    sendMsg(
      { body: text, attachments: files },
      {
        onSuccess: () => {
          setText('');
          setFiles([]);
          setFileError('');
          onSent?.();
        },
      }
    );
  }, [text, files, isPending, sendMsg, onSent]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFilePick = (e) => {
    setFileError('');
    const picked = Array.from(e.target.files ?? []);
    const merged = [...files, ...picked];

    if (merged.length > MESSAGE_ATTACHMENT_MAX_COUNT) {
      setFileError(`Maximum ${MESSAGE_ATTACHMENT_MAX_COUNT} pièces jointes.`);
      return;
    }
    for (const f of picked) {
      if (!MESSAGE_ATTACHMENT_MIME_TYPES.includes(f.type)) {
        setFileError('Format non supporté. JPG, PNG, WebP ou PDF uniquement.');
        return;
      }
      if (f.size > MESSAGE_ATTACHMENT_MAX_SIZE) {
        setFileError('Fichier trop lourd. Maximum 5 Mo par pièce jointe.');
        return;
      }
    }
    setFiles(merged);
    e.target.value = '';
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setFileError('');
  };

  const isImage = (file) => file.type.startsWith('image/');

  return (
    <div className="border-t border-gray-200 bg-white p-3">
      {/* File previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 text-xs"
            >
              {isImage(f)
                ? <ImageIcon className="h-3.5 w-3.5 text-blue-500" />
                : <FileText className="h-3.5 w-3.5 text-red-500" />
              }
              <span className="max-w-[120px] truncate">{f.name}</span>
              <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500 ml-1">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {fileError && (
        <p className="text-xs text-red-500 mb-2">{fileError}</p>
      )}

      <div className="flex items-end gap-2">
        {/* Attach button */}
        <button
          type="button"
          disabled={disabled || files.length >= MESSAGE_ATTACHMENT_MAX_COUNT}
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40 flex-shrink-0"
          title="Ajouter une pièce jointe"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={handleFilePick}
        />

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Votre message… (Entrée pour envoyer, Maj+Entrée pour sauter une ligne)"
            maxLength={2000}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden leading-5 max-h-32 disabled:bg-gray-50"
            style={{ minHeight: '38px' }}
          />
          {text.length > 1800 && (
            <span className={`absolute bottom-1 right-2 text-[10px] ${text.length >= 2000 ? 'text-red-500' : 'text-gray-400'}`}>
              {text.length}/2000
            </span>
          )}
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || isPending || disabled}
          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          title="Envoyer"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
