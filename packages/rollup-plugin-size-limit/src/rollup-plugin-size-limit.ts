import type { Plugin } from 'rollup';

import { Buffer } from 'node:buffer';

import bytesFormat from 'bytes';

export interface SizeLimitConfig {
  /** Maximum allowed size in bytes */
  maxSize: number;
  /** Whether to throw an error (true) or just warn (false). Default: true */
  throwError?: boolean;
}

export type SizeLimitOption = number | SizeLimitConfig | boolean;

/**
 * Creates a rollup/tsdown plugin that checks the size of output files
 * @param option - Size check configuration (number for maxSize in bytes, object for detailed config, or boolean to enable/disable)
 * @returns A rollup plugin compatible with tsdown
 */
export function sizeLimit(option: SizeLimitOption): Plugin {
  // Parse the option
  let config: SizeLimitConfig;

  if (typeof option === 'number') {
    config = { maxSize: option, throwError: true };
  } else if (typeof option === 'boolean') {
    // If false, return a no-op plugin
    if (!option) {
      return {
        name: 'size-check-disabled',
      };
    }
    // If true but no size specified, we can't check anything
    throw new Error(
      'Size check enabled but no maxSize specified. Please provide a number or config object.',
    );
  } else if (typeof option === 'object' && option !== null) {
    config = {
      maxSize: option.maxSize,
      throwError: option.throwError ?? true,
    };
  } else {
    // Invalid option type (null, undefined, etc.)
    throw new Error('Invalid size check option');
  }

  const { maxSize, throwError } = config;

  return {
    name: 'size-check',
    writeBundle(_options, bundle) {
      const errors: string[] = [];

      for (const [fileName, output] of Object.entries(bundle)) {
        // Skip source maps and type declarations
        if (fileName.endsWith('.map') || fileName.endsWith('.d.ts')) {
          // eslint-disable-next-line no-continue
          continue;
        }

        // Get the actual code or source for size calculation
        let fileSize = 0;
        if (output.type === 'asset' && typeof output.source === 'string') {
          fileSize = Buffer.byteLength(output.source, 'utf8');
        } else if (output.type === 'chunk') {
          fileSize = Buffer.byteLength(output.code, 'utf8');
        }

        if (fileSize > maxSize) {
          const sizeFormatted = bytesFormat(fileSize);
          const maxSizeFormatted = bytesFormat(maxSize);
          const message = `Bundle size exceeded: ${fileName} is ${sizeFormatted} (max: ${maxSizeFormatted})`;

          if (throwError) {
            errors.push(message);
          } else {
            // Just warn
            console.warn(`⚠️  ${message}`);
          }
        } else {
          const sizeFormatted = bytesFormat(fileSize);
          const maxSizeFormatted = bytesFormat(maxSize);
          // eslint-disable-next-line no-console
          console.log(`✓ ${fileName}: ${sizeFormatted} / ${maxSizeFormatted}`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`\n${errors.join('\n')}`);
      }
    },
  };
}
