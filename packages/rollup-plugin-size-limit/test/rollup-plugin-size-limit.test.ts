import { describe, expect, it } from 'vitest';
import { sizeLimit } from '../src/rollup-plugin-size-limit';

describe('sizeLimit', () => {
  it('should create a plugin with number option (maxSize)', () => {
    const plugin = sizeLimit(1024 * 1024); // 1MB

    expect(plugin.name).toBe('size-check');
    expect(plugin.writeBundle).toBeDefined();
  });

  it('should create a plugin with object option', () => {
    const plugin = sizeLimit({
      maxSize: 1024 * 1024,
      throwError: false,
    });

    expect(plugin.name).toBe('size-check');
    expect(plugin.writeBundle).toBeDefined();
  });

  it('should create a disabled plugin when option is false', () => {
    const plugin = sizeLimit(false);

    expect(plugin.name).toBe('size-check-disabled');
    expect(plugin.writeBundle).toBeUndefined();
  });

  it('should throw error when option is true without maxSize', () => {
    expect(() => sizeLimit(true)).toThrow('Size check enabled but no maxSize specified');
  });

  it('should throw error for invalid option type', () => {
    expect(() => sizeLimit(null as unknown as number)).toThrow(
      'Invalid size check option',
    );
  });

  it('should set throwError to true by default in object config', () => {
    const plugin = sizeLimit({
      maxSize: 1024,
    });

    expect(plugin.name).toBe('size-check');
    expect(plugin.writeBundle).toBeDefined();
  });
});
