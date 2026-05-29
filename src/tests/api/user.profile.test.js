import { describe, it, expect, beforeEach } from 'vitest';
import { getProfile, updateProfile, uploadAvatar, changePassword } from '@/api/user.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API user.getProfile', () => {

  beforeEach(() => {
    saveToken(mockToken);
  });

  it('retourne les données du profil utilisateur', async () => {
    const response = await getProfile();
    const user = response.data || response;

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('role');
    expect(user).not.toHaveProperty('password');
  });
});

describe('API user.updateProfile', () => {

  it('retourne le profil mis à jour', async () => {
    const updates = { name: 'Nouveau Nom', city: 'Douala' };
    const response = await updateProfile(updates);
    const user = response.data || response;

    expect(user.name).toBe('Nouveau Nom');
    expect(user.city).toBe('Douala');
  });
});

describe('API user.uploadAvatar', () => {

  it('retourne les URLs avatar après upload réussi', async () => {
    const file = new File(['fake image data'], 'avatar.jpg', { type: 'image/jpeg' });
    const response = await uploadAvatar(file);
    const user = response.data || response;

    expect(user.avatar_url).not.toBeNull();
    expect(user.avatar_thumb_url).not.toBeNull();
    expect(user.avatar_url).toContain('/storage/avatars/');
  });
});

describe('API user.changePassword', () => {

  it('retourne un message de succès', async () => {
    const data = await changePassword({
      current_password: 'Password1',
      password: 'NewPassword1',
      password_confirmation: 'NewPassword1',
    });

    expect(data).toHaveProperty('message');
    expect(data.message).toContain('succès');
  });

  it("retourne une erreur 422 si l'ancien mot de passe est incorrect", async () => {
    try {
      await changePassword({
        current_password: 'wrong_password',
        password: 'NewPassword1',
        password_confirmation: 'NewPassword1',
      });
    } catch (error) {
      expect(error.response.status).toBe(422);
      expect(error.validationErrors).toHaveProperty('current_password');
    }
  });
});
