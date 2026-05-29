import { describe, it, expect } from 'vitest';
import { getPendingProperties, moderateProperty } from '@/api/property.api';
import { mockPendingProperty } from '../mocks/handlers';

describe('property.api — admin', () => {
  describe('getPendingProperties()', () => {
    it('returns properties pending approval', async () => {
      const result = await getPendingProperties();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].is_approved).toBe(false);
    });

    it('returns pagination meta', async () => {
      const result = await getPendingProperties();
      expect(result.meta).toMatchObject({
        current_page: 1,
        total: 1,
      });
    });
  });

  describe('moderateProperty()', () => {
    it('approves a property', async () => {
      const result = await moderateProperty(mockPendingProperty.id, { action: 'approve' });
      expect(result.is_approved).toBe(true);
    });

    it('rejects a property with a reason', async () => {
      const result = await moderateProperty(mockPendingProperty.id, {
        action: 'reject',
        rejection_reason: 'Photos de mauvaise qualité',
      });
      expect(result.is_approved).toBe(false);
      expect(result.rejection_reason).toBe('Photos de mauvaise qualité');
    });

    it('throws 422 when rejecting without a reason', async () => {
      await expect(
        moderateProperty(mockPendingProperty.id, { action: 'reject' })
      ).rejects.toMatchObject({ response: { status: 422 } });
    });
  });
});
