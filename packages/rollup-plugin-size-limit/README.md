# rollup-plugin-size-limit

A Rollup plugin that enforces bundle size limits during the build process. It checks the size of output files against configurable thresholds and can either warn or throw errors when limits are exceeded.

## Features

- ✅ Enforce maximum bundle sizes
- ✅ Support for chunks and assets
- ✅ Configurable error vs warning behavior
- ✅ Automatic size formatting
- ✅ Compatible with Rollup, Vite, and tsdown
- ✅ Skips source maps and type declarations

## Installation

```bash
pnpm add -D rollup-plugin-size-limit
```

## Usage

### Basic Usage

```javascript
import { sizeLimit } from 'rollup-plugin-size-limit';

export default {
  // ... other config
  plugins: [
    sizeLimit(1024 * 1024), // 1MB limit
  ],
};
```

### Advanced Configuration

```javascript
import { sizeLimit } from 'rollup-plugin-size-limit';

export default {
  // ... other config
  plugins: [
    sizeLimit({
      maxSize: 500 * 1024, // 500KB
      throwError: false, // Warn instead of throwing error
    }),
  ],
};
```

### Options

- `maxSize` (number): Maximum allowed size in bytes
- `throwError` (boolean, optional): Whether to throw an error (default: `true`) or just warn

### Option Formats

- `number`: Sets `maxSize` in bytes, `throwError` defaults to `true`
- `object`: Full configuration with `maxSize` and optional `throwError`
- `boolean`: `false` disables the plugin, `true` requires `maxSize` to be set elsewhere

## Example Output

```
✓ index.js: 245.8 kB / 500 kB
⚠️  vendor.js: 1.2 MB (max: 1 MB)
```

## License

MIT
