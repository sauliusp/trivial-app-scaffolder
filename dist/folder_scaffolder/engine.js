"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const split2_1 = __importDefault(require("split2"));
const ProjectType_1 = require("../types/ProjectType");
class ScaffolderEngine {
    projectType;
    projectDestination;
    currentPathSegments = [];
    fsOperationQueue = [];
    constructor(projectType, projectDestination) {
        this.projectType = projectType;
        this.projectDestination = projectDestination;
    }
    get projectStructureSource() {
        return {
            [ProjectType_1.ProjectType.GoogleTypescriptNode]: (0, path_1.join)(__dirname, '..', 'structures', 'google_typescript_node.txt'),
        };
    }
    get currentDepth() {
        return this.currentPathSegments.length;
    }
    get writeDestination() {
        return (0, path_1.join)(this.projectDestination, ...this.currentPathSegments);
    }
    get readStream() {
        return (0, fs_1.createReadStream)(this.projectStructureSource[this.projectType], "utf-8");
    }
    get splitStream() {
        const stream = (0, split2_1.default)();
        stream.on('error', this.onSplitStreamError);
        stream.on('data', this.onSplitStreamData);
        return stream;
    }
    sanitizeInput(input) {
        const splitted = input.trim().split('  ');
        const path = splitted.pop().replace(/[^a-zA-Z0-9_/.-]/g, '');
        return {
            depth: splitted.length,
            path
        };
    }
    isFile(path) {
        return !!(0, path_1.extname)(path);
    }
    onSplitStreamError(error) {
        console.error('\n SPLIT-STREAM-ERROR \n', error + '\n');
    }
    onSplitStreamData = async (input) => {
        const sanitizedInput = this.sanitizeInput(input);
        this.currentPathSegments = this.currentPathSegments.slice(0, sanitizedInput.depth);
        this.currentPathSegments.push(sanitizedInput.path);
        this.fsOperationQueue.push({
            type: this.isFile(sanitizedInput.path) ? 'file' : 'directory',
            path: this.writeDestination
        });
    };
    executeFsOperations = async (operations) => {
        for (let operation of operations) {
            if (operation.type === 'directory') {
                await this.createDirectory(operation.path);
            }
            else {
                await this.createFile(operation.path);
            }
        }
    };
    createDirectory = async (destination) => {
        try {
            await (0, promises_1.mkdir)(destination, { recursive: true });
        }
        catch (error) {
            console.error('\n CREATE-DIRECTORY-ERROR \n', error + '\n');
        }
    };
    createFile = async (destination) => {
        try {
            await (0, promises_1.writeFile)(destination, '');
        }
        catch (error) {
            console.error('\n CREATE-FILE-ERROR \n', error + '\n');
        }
    };
    run() {
        const stream = this.readStream.pipe(this.splitStream);
        stream.on('close', () => {
            this.executeFsOperations(this.fsOperationQueue);
        });
    }
}
const engine = new ScaffolderEngine(ProjectType_1.ProjectType.GoogleTypescriptNode, (0, path_1.join)(__dirname, 'my-new-project'));
engine.run();
