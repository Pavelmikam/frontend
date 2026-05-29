import { describe, it, expect } from 'vitest';
import { resetPassword } from '@/api/auth.api';

describe('API auth.resetPassword', () => {

  it('retourne un message de succès avec un token valide', async () => {
    const data = await resetPassword({
      token: 'valid_token_abc123',
      email: 'jean@test.cm',
      password: 'NewPassword1',
      password_confirmation: 'NewPassword1',
    });

    expect(data).toHaveProperty('message');
    expect(data.message).toContain('succès');
  });

  it('retourne une erreur 400 avec un token invalide', async () => {
    try {
      await resetPassword({
        token: 'invalid_token',
        email: 'jean@test.cm',
        password: 'NewPassword1',
        password_confirmation: 'NewPassword1',
      });
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.userMessage).toContain('invalide');
    }
  });
});
