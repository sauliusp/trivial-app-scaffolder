import { createReadStream } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { join, extname } from "path";
import split2 from "split2";
import { Transform } from "stream";

import { FsOperation } from "../types/FsOperation.js";
import { SanitizedInput } from "../types/SanitizedInput.js";
import { DirectoryStructureConfig } from "../types/DirectoryStructureConfig.js";

export class ScaffolderEngine {
    private currentPathSegments: string[] = [];

    private fsOperationQueue: FsOperation[] = [];

    constructor(private structurePath: DirectoryStructureConfig['path'], private projectDestination: string) {}

    private get currentDepth(): number {
        return this.currentPathSegments.length;
    }

    private get writeDestination(): string {
        return join(this.projectDestination, ...this.currentPathSegments);
    }

    private get readStream(): NodeJS.ReadableStream {
        return createReadStream(this.structurePath, "utf-8");
    }

    private get splitStream(): Transform {
        const stream = split2();

        stream.on('error', this.onSplitStreamError);

        stream.on('data', this.onSplitStreamData);

        return stream;
    }

    private sanitizeInput(input: string): SanitizedInput {
        const splitted = input.trim().split('  ');

        const path = (splitted.pop() as string).replace(/[^a-zA-Z0-9_/.-]/g, '')

        return {
            depth: splitted.length,
            path
        }
    }

    private isFile(path: string) {
        return !!extname(path);
    }

    private onSplitStreamError(error: Error) {
        console.error('\n SPLIT-STREAM-ERROR \n', error + '\n');
    }

    private onSplitStreamData = async (input: string) => {
        const sanitizedInput: SanitizedInput = this.sanitizeInput(input);

        this.currentPathSegments = this.currentPathSegments.slice(0, sanitizedInput.depth);
        this.currentPathSegments.push(sanitizedInput.path);

        this.fsOperationQueue.push({
            type: this.isFile(sanitizedInput.path) ? 'file' : 'directory',
            path: this.writeDestination
        });
    }

    private executeFsOperations = async (operations: FsOperation[]) => {
        for (let operation of operations) {
            if (operation.type === 'directory') {
                await this.createDirectory(operation.path);
            } else {
                await this.createFile(operation.path); 
            }
        }
    }

    private createDirectory = async (destination: string) => {
        try {
            await mkdir(destination, { recursive: true });
        } catch (error) {
            console.error('\n CREATE-DIRECTORY-ERROR \n', error + '\n');
        }
    }

    private createFile = async (destination: string) => {
        try {
            await writeFile(destination, '');
        } catch (error) {
            console.error('\n CREATE-FILE-ERROR \n', error + '\n');
        }
    }

    run() {
        const stream = this.readStream.pipe(this.splitStream)

        stream.on('close', () => {
            this.executeFsOperations(this.fsOperationQueue);
        })
    }
}