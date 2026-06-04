import { describe, it, expect, beforeEach } from 'vitest';
import {
  createRentalRequest, decideRentalRequest, cancelRentalRequest,
} from '@/api/rentalRequest.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('Workflow demande de location', () => {
  beforeEach(() => saveToken(mockToken));

  it('workflow complet : création → acceptation', async () => {
    const created = await createRentalRequest(1, { message: 'Je suis intéressé.' });
    expect((created.data || created).status).toBe('en_attente');

    const decided = await decideRentalRequest(1, { action: 'accept' });
    expect(decided.data.status).toBe('acceptee');
    expect(decided.message).toContain('acceptée');
  });

  it('workflow : création → refus avec motif', async () => {
    const created = await createRentalRequest(1, {});
    expect((created.data || created).status).toBe('en_attente');

    const decided = await decideRentalRequest(1, {
      action: 'refuse',
      owner_response: 'Profil ne correspond pas à nos critères.',
    });
    expect(decided.data.status).toBe('refusee');
  });

  it('workflow : création → annulation par locataire', async () => {
    const created = await createRentalRequest(1, {});
    expect((created.data || created).status).toBe('en_attente');

    const cancelled = await cancelRentalRequest(1);
    expect(cancelled).toHaveProperty('message');
  });

  it('acceptation retourne un message sur les autres candidatures', async () => {
    const decided = await decideRentalRequest(1, { action: 'accept' });
    expect(decided.message).toContain('autres candidatures');
  });
});
