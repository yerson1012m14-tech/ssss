export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  size?: number; // in bytes
  content?: string; // for text/json/plist files
  isBinary?: boolean;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
  permissions?: string; // e.g. "rw-r--r--" (0644)
  children?: FileNode[]; // for directories
}

export interface AppContainer {
  id: string;
  bundleId: string;
  name: string;
  iconName?: string;
  version: string;
  developer: string;
  containerUuid: string;
  containerPath: string;
  rootDirectory: FileNode;
  installedAt: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}
