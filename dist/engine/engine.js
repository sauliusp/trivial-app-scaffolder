import { createReadStream } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { join, extname } from "path";
import split2 from "split2";
export class DirectoryEngine {
    structurePath;
    projectDestination;
    currentPathSegments = [];
    fsOperationQueue = [];
    constructor(structurePath, projectDestination) {
        this.structurePath = structurePath;
        this.projectDestination = projectDestination;
    }
    get writeDestination() {
        return join(this.projectDestination, ...this.currentPathSegments);
    }
    get readStream() {
        return createReadStream(this.structurePath, "utf-8");
    }
    get splitStream() {
        const stream = split2();
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
        return !!extname(path);
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
            await mkdir(destination, { recursive: true });
        }
        catch (error) {
            console.error('\n CREATE-DIRECTORY-ERROR \n', error + '\n');
        }
    };
    createFile = async (destination) => {
        try {
            await writeFile(destination, '');
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
