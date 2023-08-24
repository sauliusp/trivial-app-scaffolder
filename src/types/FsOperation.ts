export interface FsOperation {
  type: 'file' | 'directory';
  path: string;
}
