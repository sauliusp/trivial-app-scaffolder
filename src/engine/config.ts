import { join } from 'path';
import { DirectoryStructureType } from '../types/DirectoryStructureType.js';
import { DirectoryStructureConfig } from '../types/DirectoryStructureConfig.js';
import { getDirname } from '../utils/path_utils.js';

const __dirname = getDirname(import.meta.url);

export class DirectoryConfigFactory {
  constructor(private structureType: DirectoryStructureType) {}

  get config(): DirectoryStructureConfig {
    return {
      type: this.structureType,
      readme: join(
        __dirname,
        'folder_structures',
        this.structureType,
        'README.md'
      ),
      path: join(
        __dirname,
        'folder_structures',
        this.structureType,
        'structure.txt'
      ),
    };
  }

  get readme(): string {
    return this.config.readme;
  }

  get path(): string {
    return this.config.path;
  }
}
