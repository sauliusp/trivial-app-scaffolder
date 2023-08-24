import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function getDirname(importUrl: string): string {
  return dirname(fileURLToPath(importUrl));
}

export function getFilename(importUrl: string): string {
  return fileURLToPath(importUrl);
}
