import { describe, it, expect, beforeEach } from 'vitest';
import { getAdminReports, handleReport } from '@/api/admin.api';
import { reportProperty, reportMessage } from '@/api/report.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken, mockReport } from '../mocks/handlers';

describe('API admin.getAdminReports', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne la liste paginée des signalements', async () => {
    const r = await getAdminReports();
    expect(r).toHaveProperty('data');
    expect(r).toHaveProperty('meta');
    expect(Array.isArray(r.data)).toBe(true);
  });

  it('chaque signalement a les champs attendus', async () => {
    const r = await getAdminReports();
    const report = r.data[0];
    expect(report).toHaveProperty('id');
    expect(report).toHaveProperty('reason');
    expect(report).toHaveProperty('status');
    expect(report).toHaveProperty('reporter');
    expect(report).toHaveProperty('reportable_type');
    expect(report).toHaveProperty('reportable_id');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getAdminReports()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API admin.handleReport', () => {
  beforeEach(() => saveToken(mockToken));

  it('résout un signalement avec note admin', async () => {
    const r = await handleReport(mockReport.id, { action: 'resolve', admin_note: 'Annonce supprimée.' });
    expect(r).toHaveProperty('data');
    expect(r.data.status).toBe('resolu');
    expect(r.data.admin_note).toBe('Annonce supprimée.');
  });

  it('rejette un signalement avec note admin', async () => {
    const r = await handleReport(mockReport.id, { action: 'reject', admin_note: 'Signalement infondé.' });
    expect(r).toHaveProperty('data');
    expect(r.data.status).toBe('rejete');
  });

  it('marque en cours avec note admin', async () => {
    const r = await handleReport(mockReport.id, { action: 'in_progress', admin_note: 'Enquête en cours.' });
    expect(r.data.status).toBe('en_cours');
  });

  it('retourne 422 si la note admin est absente ou trop courte', async () => {
    await expect(
      handleReport(mockReport.id, { action: 'resolve', admin_note: 'ok' })
    ).rejects.toMatchObject({ response: { status: 422 } });
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(
      handleReport(mockReport.id, { action: 'resolve', admin_note: 'Note suffisante' })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API report.reportProperty (signalement public)', () => {
  beforeEach(() => saveToken(mockToken));

  it('crée un signalement sur une annonce (201)', async () => {
    const r = await reportProperty(1, { reason: 'arnaque_suspectee', description: 'Semble frauduleux.' });
    expect(r).toHaveProperty('data');
    expect(r.data.reportable_type).toContain('Property');
  });

  it('retourne 422 si doublon de signalement', async () => {
    await expect(
      reportProperty(1, { reason: 'arnaque_suspectee', _simulateDuplicate: true })
    ).rejects.toMatchObject({ response: { status: 422 } });
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(
      reportProperty(1, { reason: 'arnaque_suspectee' })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API report.reportMessage (signalement public)', () => {
  beforeEach(() => saveToken(mockToken));

  it('crée un signalement sur un message (201)', async () => {
    const r = await reportMessage(1, { reason: 'comportement_abusif' });
    expect(r).toHaveProperty('data');
    expect(r.data.reportable_type).toContain('Message');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(
      reportMessage(1, { reason: 'comportement_abusif' })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });
});
