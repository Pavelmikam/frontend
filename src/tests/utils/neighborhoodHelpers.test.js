import { describe, it, expect } from 'vitest';
import { getScoreColor, getScoreLabel } from '@/utils/constants';

describe('getScoreColor', () => {
  it('retourne green pour score >= 4.0', () => {
    expect(getScoreColor(4.5)).toBe('green');
    expect(getScoreColor(4.0)).toBe('green');
  });
  it('retourne lime pour score >= 3.0 et < 4.0', () => {
    expect(getScoreColor(3.2)).toBe('lime');
    expect(getScoreColor(3.0)).toBe('lime');
  });
  it('retourne yellow pour score >= 2.0 et < 3.0', () => {
    expect(getScoreColor(2.5)).toBe('yellow');
    expect(getScoreColor(2.0)).toBe('yellow');
  });
  it('retourne red pour score < 2.0', () => {
    expect(getScoreColor(1.5)).toBe('red');
    expect(getScoreColor(1.0)).toBe('red');
  });
  it('retourne gray si score null', () => {
    expect(getScoreColor(null)).toBe('gray');
    expect(getScoreColor(undefined)).toBe('gray');
    expect(getScoreColor(0)).toBe('gray');
  });
});

describe('getScoreLabel', () => {
  it('retourne "Excellent" pour score >= 4.5', () => {
    expect(getScoreLabel(4.8)).toBe('Excellent');
    expect(getScoreLabel(5.0)).toBe('Excellent');
  });
  it('retourne "Bien" pour score >= 3.5', () => {
    expect(getScoreLabel(3.8)).toBe('Bien');
    expect(getScoreLabel(3.5)).toBe('Bien');
  });
  it('retourne "Moyen" pour score >= 2.5', () => {
    expect(getScoreLabel(2.7)).toBe('Moyen');
    expect(getScoreLabel(2.5)).toBe('Moyen');
  });
  it('retourne "Mauvais" pour score >= 1.5', () => {
    expect(getScoreLabel(1.8)).toBe('Mauvais');
    expect(getScoreLabel(1.5)).toBe('Mauvais');
  });
  it('retourne "Très mauvais" pour score < 1.5', () => {
    expect(getScoreLabel(1.0)).toBe('Très mauvais');
  });
  it('retourne "Non évalué" si null', () => {
    expect(getScoreLabel(null)).toBe('Non évalué');
    expect(getScoreLabel(undefined)).toBe('Non évalué');
  });
});
