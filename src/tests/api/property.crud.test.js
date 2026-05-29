import { describe, it, expect } from 'vitest';
import { createProperty, updateProperty, deleteProperty, updatePropertyStatus, getMyProperties } from '@/api/property.api';
import { mockProperty } from '../mocks/handlers';

describe('property.api — CRUD', () => {
  describe('createProperty()', () => {
    it('creates a property and returns its data', async () => {
      const data = {
        title: 'Appartement moderne Bastos',
        type: 'appartement',
        city: 'Yaoundé',
        price: 150000,
        surface: 80,
        rooms: 3,
      };
      const result = await createProperty(data, []);
      expect(result.title).toBe(data.title);
    });

    it('throws 422 when title is missing', async () => {
      await expect(createProperty({}, [])).rejects.toMatchObject({
        response: { status: 422 },
      });
    });
  });

  describe('updateProperty()', () => {
    it('updates an existing property', async () => {
      const result = await updateProperty(1, { title: 'Titre modifié' }, []);
      expect(result.id).toBe(1);
    });

    it('throws 404 on unknown property', async () => {
      await expect(updateProperty(999, { title: 'X' }, [])).rejects.toMatchObject({
        response: { status: 404 },
      });
    });
  });

  describe('deleteProperty()', () => {
    it('deletes a property (204)', async () => {
      await expect(deleteProperty(1)).resolves.not.toThrow();
    });

    it('throws 404 on unknown id', async () => {
      await expect(deleteProperty(999)).rejects.toMatchObject({
        response: { status: 404 },
      });
    });
  });

  describe('updatePropertyStatus()', () => {
    it('updates status and returns updated property', async () => {
      const result = await updatePropertyStatus(1, 'loue');
      expect(result.status).toBe('loue');
    });
  });

  describe('getMyProperties()', () => {
    it('returns the authenticated owner\'s properties', async () => {
      const result = await getMyProperties();
      expect(result.data).toHaveLength(1);
      expect(result.meta).toBeDefined();
    });
  });
});
