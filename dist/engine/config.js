import { join } from "path";
import { getDirname } from "../utils/path_utils.js";
const __dirname = getDirname(import.meta.url);
export class DirectoryConfigFactory {
    structureType;
    constructor(structureType) {
        this.structureType = structureType;
    }
    get config() {
        return {
            type: this.structureType,
            readme: join(__dirname, 'folder_structures', this.structureType, 'README.md'),
            path: join(__dirname, 'folder_structures', this.structureType, 'structure.txt')
        };
    }
    get readme() {
        return this.config.readme;
    }
    get path() {
        return this.config.path;
    }
}
