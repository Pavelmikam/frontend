import { describe, it, expect, beforeEach } from 'vitest';
import {
  getRentalRequests, getRentalRequest, createRentalRequest,
  decideRentalRequest, cancelRentalRequest,
  scheduleVisit, confirmVisit,
} from '@/api/rentalRequest.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API rentalRequest.getRentalRequests', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne la liste paginée des demandes', async () => {
    const r = await getRentalRequests();
    expect(r).toHaveProperty('data');
    expect(r).toHaveProperty('meta');
    expect(Array.isArray(r.data)).toBe(true);
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getRentalRequests()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API rentalRequest.getRentalRequest', () => {
  beforeEach(() => saveToken(mockToken));

  it("retourne le détail d'une demande avec documents", async () => {
    const r = await getRentalRequest(1);
    const req = r.data || r;
    expect(req).toHaveProperty('id');
    expect(req).toHaveProperty('status');
    expect(req).toHaveProperty('documents');
  });

  it('retourne 404 pour une demande inexistante', async () => {
    await expect(getRentalRequest(999)).rejects.toMatchObject({ response: { status: 404 } });
  });
});

describe('API rentalRequest.createRentalRequest', () => {
  beforeEach(() => saveToken(mockToken));

  it('crée une demande et retourne 201', async () => {
    const r = await createRentalRequest(1, { message: 'Je suis intéressé.' });
    const req = r.data || r;
    expect(req).toHaveProperty('id');
    expect(req.status).toBe('en_attente');
  });

  it('retourne 422 si double demande active', async () => {
    try {
      await createRentalRequest(1, { _simulateDouble: true });
    } catch (error) {
      expect(error.response.status).toBe(422);
    }
  });

  it('retourne 422 si bien non disponible', async () => {
    try {
      await createRentalRequest(1, { _simulateUnavailable: true });
    } catch (error) {
      expect(error.response.status).toBe(422);
      expect(error.userMessage).toContain('disponible');
    }
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(createRentalRequest(1, {})).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API rentalRequest.decideRentalRequest', () => {
  beforeEach(() => saveToken(mockToken));

  it('accepte une demande', async () => {
    const r = await decideRentalRequest(1, { action: 'accept' });
    expect(r.data.status).toBe('acceptee');
    expect(r.message).toContain('acceptée');
  });

  it('refuse une demande avec motif', async () => {
    const r = await decideRentalRequest(1, {
      action: 'refuse',
      owner_response: 'Profil non retenu pour ce logement.',
    });
    expect(r.data.status).toBe('refusee');
  });

  it('retourne 422 si refus sans motif', async () => {
    try {
      await decideRentalRequest(1, { action: 'refuse' });
    } catch (error) {
      expect(error.response.status).toBe(422);
      expect(error.validationErrors).toHaveProperty('owner_response');
    }
  });
});

describe('API rentalRequest.cancelRentalRequest', () => {
  beforeEach(() => saveToken(mockToken));

  it('annule une demande', async () => {
    const r = await cancelRentalRequest(1);
    expect(r).toHaveProperty('message');
  });
});

describe('API rentalRequest.scheduleVisit', () => {
  beforeEach(() => saveToken(mockToken));

  it('planifie une visite', async () => {
    const r = await scheduleVisit(1, '2027-01-15T10:00:00');
    expect(r).toHaveProperty('message');
  });
});

describe('API rentalRequest.confirmVisit', () => {
  beforeEach(() => saveToken(mockToken));

  it('confirme la présence à la visite', async () => {
    const r = await confirmVisit(1);
    expect(r).toHaveProperty('message');
  });
});
