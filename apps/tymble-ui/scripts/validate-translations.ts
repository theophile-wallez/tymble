#!/usr/bin/env bun

/**
 * Validates that all translation files have the same keys as the English translation file.
 * Run with: bun run i18n:validate
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const localesDir = join(__dirname, '../src/locales');

// Load translation files
const en = JSON.parse(
  readFileSync(join(localesDir, 'en.json'), 'utf8')
) as Record<string, unknown>;

const fr = JSON.parse(
  readFileSync(join(localesDir, 'fr.json'), 'utf8')
) as Record<string, unknown>;

/**
 * Recursively get all keys from a nested object
 */
function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  let keys: string[] = [];

  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) {
      continue;
    }

    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (typeof value === 'object' && value !== null) {
      keys = keys.concat(getAllKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

const enKeys = new Set(getAllKeys(en));
const frKeys = new Set(getAllKeys(fr));

const missingInFr = [...enKeys].filter((k) => !frKeys.has(k));
const extraInFr = [...frKeys].filter((k) => !enKeys.has(k));

let hasErrors = false;

if (missingInFr.length > 0) {
  console.error('❌ Missing keys in fr.json:');
  for (const key of missingInFr) {
    console.error(`   - ${key}`);
  }
  hasErrors = true;
}

if (extraInFr.length > 0) {
  console.warn('⚠️  Extra keys in fr.json (not in en.json):');
  for (const key of extraInFr) {
    console.warn(`   - ${key}`);
  }
  hasErrors = true;
}

if (hasErrors) {
  console.error('\n❌ Translation files are out of sync!');
  process.exit(1);
}

console.log('✅ Translation files are in sync!');
console.log(`   Total keys: ${enKeys.size}`);
