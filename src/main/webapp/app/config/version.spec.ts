import { describe, expect, it } from 'vitest';

import { formatVersion } from './version';

describe('formatVersion', () => {
  it('should add a leading v', () => {
    expect(formatVersion('8.0.0')).toBe('v8.0.0');
  });

  it('should keep a leading v', () => {
    expect(formatVersion('v8.0.0')).toBe('v8.0.0');
    expect(formatVersion('V8.0.0')).toBe('V8.0.0');
  });

  it('should return an empty string when the version is not known', () => {
    expect(formatVersion('')).toBe('');
    expect(formatVersion(undefined)).toBe('');
  });
});
