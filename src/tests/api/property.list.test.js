import { describe, it, expect, beforeEach } from 'vitest';
import { getProperties, getProperty } from '@/api/property.api';
import { mockProperty, mockPaginatedProperties } from '../mocks/handlers';

describe('property.api — listing', () => {
  describe('getProperties()', () => {
    it('returns paginated properties', async () => {
      const result = await getProperties();
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('returns property with correct shape', async () => {
      const result = await getProperties();
      const prop = result.data[0];
      expect(prop).toMatchObject({
        id: mockProperty.id,
        title: mockProperty.title,
        type: mockProperty.type,
        status: mockProperty.status,
        price: mockProperty.price,
        city: mockProperty.city,
      });
    });

    it('includes is_approved flag', async () => {
      const result = await getProperties();
      expect(result.data[0]).toHaveProperty('is_approved', true);
    });
  });

  describe('getProperty(id)', () => {
    it('returns a single property', async () => {
      const result = await getProperty(1);
      expect(result.id).toBe(mockProperty.id);
      expect(result.title).toBe(mockProperty.title);
    });

    it('includes images array', async () => {
      const result = await getProperty(1);
      expect(Array.isArray(result.images)).toBe(true);
      expect(result.images.length).toBeGreaterThan(0);
    });

    it('includes owner info', async () => {
      const result = await getProperty(1);
      expect(result.owner).toBeDefined();
      expect(result.owner.email).toBe('marie@test.cm');
    });

    it('throws on 404', async () => {
      await expect(getProperty(999)).rejects.toMatchObject({
        response: { status: 404 },
      });
    });
  });
});
