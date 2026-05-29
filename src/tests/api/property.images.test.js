import { describe, it, expect } from 'vitest';
import { addPropertyImages, deletePropertyImage, reorderPropertyImages, setPrimaryImage } from '@/api/property.api';
import { mockProperty } from '../mocks/handlers';

const PROPERTY_ID = 1;

describe('property.api — images', () => {
  describe('addPropertyImages()', () => {
    it('uploads images and returns updated property', async () => {
      const files = [new File(['img'], 'photo.jpg', { type: 'image/jpeg' })];
      const result = await addPropertyImages(PROPERTY_ID, files);
      expect(result).toBeDefined();
    });
  });

  describe('deletePropertyImage()', () => {
    it('deletes an image (204)', async () => {
      await expect(deletePropertyImage(PROPERTY_ID, 1)).resolves.not.toThrow();
    });

    it('throws 404 on unknown image', async () => {
      await expect(deletePropertyImage(PROPERTY_ID, 999)).rejects.toMatchObject({
        response: { status: 404 },
      });
    });
  });

  describe('reorderPropertyImages()', () => {
    it('sends reorder request (204)', async () => {
      const ordered = [{ id: 1, order: 0 }, { id: 2, order: 1 }];
      await expect(reorderPropertyImages(PROPERTY_ID, ordered)).resolves.not.toThrow();
    });
  });

  describe('setPrimaryImage()', () => {
    it('sets primary image and returns updated property', async () => {
      const result = await setPrimaryImage(PROPERTY_ID, 1);
      expect(result).toBeDefined();
    });
  });
});
