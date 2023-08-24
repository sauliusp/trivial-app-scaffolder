import { fileURLToPath } from 'url';
import { dirname } from 'path';
export function getDirname(importUrl) {
    return dirname(fileURLToPath(importUrl));
}
export function getFilename(importUrl) {
    return fileURLToPath(importUrl);
}
