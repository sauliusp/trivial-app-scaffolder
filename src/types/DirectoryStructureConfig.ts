import { DirectoryStructureType } from './DirectoryStructureType.js';

export interface DirectoryStructureConfig {
  type: DirectoryStructureType;
  readme: string;
  path: string;
}
