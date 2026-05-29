import { describe, it, expect } from 'vitest';
import { forgotPassword } from '@/api/auth.api';

describe('API auth.forgotPassword', () => {

  it('retourne un message de succès pour un email valide', async () => {
    const data = await forgotPassword('jean@test.cm');

    expect(data).toHaveProperty('message');
    expect(data.message).toContain('email');
  });

  it('retourne une erreur 422 pour un email inexistant', async () => {
    try {
      await forgotPassword('inexistant@test.cm');
    } catch (error) {
      expect(error.response.status).toBe(422);
      expect(error.validationErrors).toHaveProperty('email');
    }
  });

  it("l'erreur de validation contient un message en français", async () => {
    try {
      await forgotPassword('inexistant@test.cm');
    } catch (error) {
      const emailError = error.validationErrors?.email?.[0];
      expect(emailError).toContain('email');
    }
  });
});
