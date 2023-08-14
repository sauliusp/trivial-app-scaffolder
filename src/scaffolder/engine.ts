import { createReadStream, createWriteStream } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { join, extname } from "path";
import split2 from "split2";
import { ProjectType } from "../types/ProjectType";
import { Transform } from "stream";

interface SanitizedInput {
    depth: number;
    path: string
}

interface FsOperation {
    type: 'file' | 'directory';
    path: string;
}

class ScaffolderEngine {
    private currentPathSegments: string[] = [];

    private fsOperationQueue: FsOperation[] = [];

    constructor(private projectType: ProjectType, private projectDestination: string) {}

    get projectStructureSource(): Record<ProjectType, string> {
        return {
            [ProjectType.GoogleTypescriptNode]: join(__dirname, '..', 'structures', 'google_typescript_node.txt'),
        }
    }

    get currentDepth(): number {
        return this.currentPathSegments.length;
    }

    get writeDestination(): string {
        return join(this.projectDestination, ...this.currentPathSegments);
    }

    get readStream(): NodeJS.ReadableStream {
        return createReadStream(this.projectStructureSource[this.projectType], "utf-8");
    }

    get splitStream(): Transform {
        const stream = split2();

        stream.on('error', this.onSplitStreamError);

        stream.on('data', this.onSplitStreamData);

        return stream;
    }

    sanitizeInput(input: string): SanitizedInput {
        const splitted = input.trim().split('  ');

        const path = (splitted.pop() as string).replace(/[^a-zA-Z0-9_/.-]/g, '')

        return {
            depth: splitted.length,
            path
        }
    }

    isFile(path: string) {
        return !!extname(path);
    }

    onSplitStreamError(error: Error) {
        console.error('\n SPLIT-STREAM-ERROR \n', error + '\n');
    }

    onSplitStreamData = async (input: string) => {
        const sanitizedInput: SanitizedInput = this.sanitizeInput(input);

        this.currentPathSegments = this.currentPathSegments.slice(0, sanitizedInput.depth);
        this.currentPathSegments.push(sanitizedInput.path);

        this.fsOperationQueue.push({
            type: this.isFile(sanitizedInput.path) ? 'file' : 'directory',
            path: this.writeDestination
        });
    }

    executeFsOperations = async (operations: FsOperation[]) => {
        for (let operation of operations) {
            if (operation.type === 'directory') {
                await this.createDirectory(operation.path);
            } else {
                await this.createFile(operation.path); 
            }
        }
    }

    createDirectory = async (destination: string) => {
        try {
            await mkdir(destination, { recursive: true });
        } catch (error) {
            console.error('\n CREATE-DIRECTORY-ERROR \n', error + '\n');
        }
    }

    createFile = async (destination: string) => {
        try {
            await writeFile(destination, '');
        } catch (error) {
            console.error('\n CREATE-FILE-ERROR \n', error + '\n');
        }
    }

    public run() {
        const stream = this.readStream.pipe(this.splitStream)

        stream.on('close', () => {
            this.executeFsOperations(this.fsOperationQueue);
        })
    }
}

const engine = new ScaffolderEngine(ProjectType.GoogleTypescriptNode, join(__dirname, 'my-new-project'))

engine.run();