import { describe, it, expect, beforeEach } from 'vitest';
import {
  uploadDocument, deleteDocument, getDocumentDownloadUrl, verifyDocument
} from '@/api/rentalRequest.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API rentalDocument.uploadDocument', () => {
  beforeEach(() => saveToken(mockToken));

  it('uploade un document et retourne 201', async () => {
    const file = new File(['fake pdf content'], 'CNI.pdf', { type: 'application/pdf' });
    const r = await uploadDocument(1, file, 'cni');
    const doc = r.data || r;
    expect(doc).toHaveProperty('id');
    expect(doc.type).toBe('cni');
    expect(doc).not.toHaveProperty('file_path');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    const file = new File(['x'], 'test.pdf', { type: 'application/pdf' });
    await expect(uploadDocument(1, file, 'cni')).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API rentalDocument.deleteDocument', () => {
  beforeEach(() => saveToken(mockToken));

  it('supprime un document (204)', async () => {
    await expect(deleteDocument(1, 1)).resolves.not.toThrow();
  });
});

describe('API rentalDocument.getDocumentDownloadUrl', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne une URL de téléchargement signée', async () => {
    const r = await getDocumentDownloadUrl(1);
    expect(r).toHaveProperty('download_url');
    expect(r).toHaveProperty('expires_at');
    expect(r.download_url).toContain('http');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getDocumentDownloadUrl(1)).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API rentalDocument.verifyDocument', () => {
  beforeEach(() => saveToken(mockToken));

  it('marque un document comme vérifié', async () => {
    const r = await verifyDocument(1);
    const doc = r.data || r;
    expect(doc.is_verified).toBe(true);
    expect(doc).toHaveProperty('verified_at');
  });
});
