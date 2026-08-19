import React, { useState, useEffect } from 'react';
import { AppContainer, FileNode, BreadcrumbItem } from './types';
import { INITIAL_APPS } from './data/initialFileSystem';
import { AppListView } from './components/AppListView';
import { FileBrowserView } from './components/FileBrowserView';
import { FileEditorModal } from './components/FileEditorModal';
import { FileDetailsModal } from './components/FileDetailsModal';
import { NewItemModal } from './components/NewItemModal';
import { TerminalOverlay } from './components/TerminalOverlay';
import { Wifi, Battery, RotateCcw, AlertTriangle } from 'lucide-react';

const STORAGE_KEY = 'mifilza_app_containers_v1';

export function App() {
  const [apps, setApps] = useState<AppContainer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved state from localStorage');
    }
    return INITIAL_APPS;
  });

  // Navigation State
  const [selectedApp, setSelectedApp] = useState<AppContainer | null>(null);
  const [currentDirectoryNode, setCurrentDirectoryNode] = useState<FileNode | null>(null);
  const [directoryStack, setDirectoryStack] = useState<FileNode[]>([]);
  
  // Modals & Overlays
  const [editingFile, setEditingFile] = useState<FileNode | null>(null);
  const [inspectingNode, setInspectingNode] = useState<FileNode | null>(null);
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Time state for status bar
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    } catch (e) {
      console.warn('Failed to save state to localStorage', e);
    }
  }, [apps]);

  // Navigate to an App container
  const handleSelectApp = (app: AppContainer) => {
    setSelectedApp(app);
    setCurrentDirectoryNode(app.rootDirectory);
    setDirectoryStack([app.rootDirectory]);
  };

  // Manual Bundle ID input (Objective-C: abrirContenedor)
  const handleOpenManualBundleId = (bundleId: string) => {
    const cleanId = bundleId.trim();
    if (!cleanId) return;

    const matchedApp = apps.find(
      (a) => a.bundleId.toLowerCase() === cleanId.toLowerCase() ||
             a.name.toLowerCase() === cleanId.toLowerCase()
    );

    if (matchedApp) {
      handleSelectApp(matchedApp);
    } else {
      // Prompt user or create simulated container on the fly
      const autoCreate = confirm(
        `Sin contenedor: "${cleanId}" no devolvió ruta.\n\n¿Deseas inicializar un contenedor Sandbox para este Bundle ID?`
      );
      if (autoCreate) {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16).toUpperCase();
        });
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

        const newApp: AppContainer = {
          id: `app-${Date.now()}`,
          bundleId: cleanId,
          name: cleanId.split('.').pop() || cleanId,
          version: '1.0.0',
          developer: 'Custom Installed App',
          containerUuid: uuid,
          containerPath: `/var/mobile/Containers/Data/Application/${uuid}`,
          installedAt: now,
          rootDirectory: {
            id: `dir-${uuid}`,
            name: uuid,
            type: 'directory',
            createdAt: now,
            updatedAt: now,
            permissions: 'rwxr-xr-x',
            children: [
              {
                id: `dir-${uuid}-docs`,
                name: 'Documents',
                type: 'directory',
                createdAt: now,
                updatedAt: now,
                permissions: 'rwxr-xr-x',
                children: [],
              },
              {
                id: `dir-${uuid}-lib`,
                name: 'Library',
                type: 'directory',
                createdAt: now,
                updatedAt: now,
                permissions: 'rwxr-xr-x',
                children: [
                  {
                    id: `dir-${uuid}-prefs`,
                    name: 'Preferences',
                    type: 'directory',
                    createdAt: now,
                    updatedAt: now,
                    permissions: 'rwxr-xr-x',
                    children: [],
                  },
                ],
              },
              {
                id: `dir-${uuid}-tmp`,
                name: 'tmp',
                type: 'directory',
                createdAt: now,
                updatedAt: now,
                permissions: 'rwxrwxrwt',
                children: [],
              },
            ],
          },
        };

        setApps((prev) => [newApp, ...prev]);
        handleSelectApp(newApp);
      }
    }
  };

  // Back to Apps list
  const handleBackToApps = () => {
    setSelectedApp(null);
    setCurrentDirectoryNode(null);
    setDirectoryStack([]);
  };

  // Navigate down into a directory
  const handleNavigateToDir = (dirNode: FileNode) => {
    setCurrentDirectoryNode(dirNode);
    setDirectoryStack((prev) => [...prev, dirNode]);
  };

  // Navigate up one level (..)
  const handleNavigateUp = () => {
    if (directoryStack.length <= 1) {
      handleBackToApps();
      return;
    }
    const newStack = directoryStack.slice(0, -1);
    setDirectoryStack(newStack);
    setCurrentDirectoryNode(newStack[newStack.length - 1]);
  };

  // Navigate via breadcrumb
  const handleNavigateBreadcrumb = (path: string) => {
    const targetIdx = directoryStack.findIndex((item) => item.id === path);
    if (targetIdx !== -1) {
      const newStack = directoryStack.slice(0, targetIdx + 1);
      setDirectoryStack(newStack);
      setCurrentDirectoryNode(newStack[newStack.length - 1]);
    }
  };

  // Helper to recursively update a node in the tree
  const updateAppTree = (
    root: FileNode,
    targetDirId: string,
    mutator: (children: FileNode[]) => FileNode[]
  ): FileNode => {
    if (root.id === targetDirId) {
      return {
        ...root,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        children: mutator(root.children || []),
      };
    }

    if (!root.children) return root;

    return {
      ...root,
      children: root.children.map((child) =>
        child.type === 'directory' ? updateAppTree(child, targetDirId, mutator) : child
      ),
    };
  };

  // Helper to update active app and apps state
  const mutateCurrentApp = (mutator: (children: FileNode[]) => FileNode[]) => {
    if (!selectedApp || !currentDirectoryNode) return;

    const updatedRoot = updateAppTree(selectedApp.rootDirectory, currentDirectoryNode.id, mutator);
    const updatedApp = { ...selectedApp, rootDirectory: updatedRoot };

    setApps((prev) => prev.map((a) => (a.id === selectedApp.id ? updatedApp : a)));
    setSelectedApp(updatedApp);

    // Refresh currentDirectoryNode from updated tree
    const findNode = (node: FileNode, id: string): FileNode | null => {
      if (node.id === id) return node;
      if (!node.children) return null;
      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
      }
      return null;
    };

    const refreshed = findNode(updatedRoot, currentDirectoryNode.id);
    if (refreshed) {
      setCurrentDirectoryNode(refreshed);
    }
  };

  // Create folder
  const handleCreateFolder = (name: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newFolder: FileNode = {
      id: `dir-${Date.now()}`,
      name,
      type: 'directory',
      createdAt: now,
      updatedAt: now,
      permissions: 'rwxr-xr-x',
      children: [],
    };
    mutateCurrentApp((children) => [...children, newFolder]);
  };

  // Create file
  const handleCreateFile = (name: string, content: string = '') => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const ext = name.split('.').pop()?.toLowerCase();
    const mime = ext === 'json' ? 'application/json' : ext === 'plist' ? 'application/x-plist' : 'text/plain';

    const newFile: FileNode = {
      id: `file-${Date.now()}`,
      name,
      type: 'file',
      size: content.length,
      content,
      mimeType: mime,
      isBinary: false,
      createdAt: now,
      updatedAt: now,
      permissions: 'rw-r--r--',
    };
    mutateCurrentApp((children) => [...children, newFile]);
  };

  // Upload file
  const handleUploadFile = (fileData: { name: string; content: string; size: number; isBinary: boolean; mimeType: string }) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newFile: FileNode = {
      id: `file-upload-${Date.now()}`,
      name: fileData.name,
      type: 'file',
      size: fileData.size,
      content: fileData.content,
      isBinary: fileData.isBinary,
      mimeType: fileData.mimeType,
      createdAt: now,
      updatedAt: now,
      permissions: 'rw-r--r--',
    };
    mutateCurrentApp((children) => [...children, newFile]);
  };

  // Save edited file content
  const handleSaveFileContent = (fileId: string, newContent: string) => {
    if (!selectedApp) return;

    const updateFileInTree = (node: FileNode): FileNode => {
      if (node.id === fileId) {
        return {
          ...node,
          content: newContent,
          size: newContent.length,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateFileInTree),
        };
      }
      return node;
    };

    const updatedRoot = updateFileInTree(selectedApp.rootDirectory);
    const updatedApp = { ...selectedApp, rootDirectory: updatedRoot };

    setApps((prev) => prev.map((a) => (a.id === selectedApp.id ? updatedApp : a)));
    setSelectedApp(updatedApp);

    if (editingFile && editingFile.id === fileId) {
      setEditingFile((prev) => (prev ? { ...prev, content: newContent, size: newContent.length } : null));
    }
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    mutateCurrentApp((children) => children.filter((c) => c.id !== nodeId));
  };

  // Delete App container
  const handleDeleteApp = (appId: string) => {
    setApps((prev) => prev.filter((a) => a.id !== appId));
    if (selectedApp?.id === appId) {
      handleBackToApps();
    }
  };

  // Reset to default sample apps
  const handleResetToDefault = () => {
    if (confirm('¿Restablecer el sistema de archivos Sandbox a su estado inicial predeterminado?')) {
      localStorage.removeItem(STORAGE_KEY);
      setApps(INITIAL_APPS);
      handleBackToApps();
    }
  };

  // Build breadcrumbs for current directory
  const breadcrumbs: BreadcrumbItem[] = [
    { name: selectedApp?.name || 'Sandbox Root', path: directoryStack[0]?.id || 'root' },
    ...directoryStack.slice(1).map((node) => ({
      name: node.name,
      path: node.id,
    })),
  ];

  // Calculate current sandbox full path
  const currentPath = selectedApp
    ? `${selectedApp.containerPath}${
        directoryStack.length > 1
          ? '/' + directoryStack.slice(1).map((n) => n.name).join('/')
          : ''
      }`
    : '/var/mobile/Containers/Data/Application';

  return (
    <div className="flex flex-col h-screen w-full bg-[#07080a] text-zinc-100 overflow-hidden font-sans">
      {/* iOS Top Status Bar */}
      <div className="bg-[#0b0c10] border-b border-[#1b1e26] px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-zinc-400 select-none">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-200">9:41</span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-[#33ff80] text-[10px] hidden sm:inline">MCMFilza Unrestricted</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToDefault}
            title="Restablecer Sandbox de fábrica"
            className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Sandbox</span>
          </button>
          <Wifi className="w-3.5 h-3.5 text-zinc-300" />
          <div className="flex items-center gap-1 text-zinc-300">
            <span className="text-[10px]">100%</span>
            <Battery className="w-4 h-4 text-[#33ff80]" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {!selectedApp ? (
          <AppListView
            apps={apps}
            onSelectApp={handleSelectApp}
            onOpenManualBundleId={handleOpenManualBundleId}
            onAddNewApp={() => setShowNewAppModal(true)}
            onOpenTerminal={() => setShowTerminal(true)}
            onDeleteApp={handleDeleteApp}
          />
        ) : (
          <FileBrowserView
            currentPath={currentPath}
            items={currentDirectoryNode?.children || []}
            breadcrumbs={breadcrumbs}
            appBundleId={selectedApp.bundleId}
            appName={selectedApp.name}
            onNavigateToDir={handleNavigateToDir}
            onNavigateUp={handleNavigateUp}
            onNavigateBreadcrumb={handleNavigateBreadcrumb}
            onOpenFile={(file) => setEditingFile(file)}
            onShowDetails={(node) => setInspectingNode(node)}
            onDeleteNode={handleDeleteNode}
            onCreateFolder={handleCreateFolder}
            onCreateFile={handleCreateFile}
            onUploadFile={handleUploadFile}
            onBackToApps={handleBackToApps}
            onOpenTerminal={() => setShowTerminal(true)}
          />
        )}
      </div>

      {/* Modals */}
      {editingFile && (
        <FileEditorModal
          file={editingFile}
          onClose={() => setEditingFile(null)}
          onSave={handleSaveFileContent}
        />
      )}

      {inspectingNode && (
        <FileDetailsModal
          node={inspectingNode}
          fullPath={`${currentPath}/${inspectingNode.name}`}
          onClose={() => setInspectingNode(null)}
        />
      )}

      {showNewAppModal && (
        <NewItemModal
          onClose={() => setShowNewAppModal(false)}
          onAddApp={(newApp) => {
            setApps((prev) => [newApp, ...prev]);
            handleSelectApp(newApp);
          }}
        />
      )}

      {showTerminal && (
        <TerminalOverlay
          apps={apps}
          currentApp={selectedApp}
          onClose={() => setShowTerminal(false)}
        />
      )}

      {alertMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#12151d] border border-[#2b3242] p-4 rounded-2xl max-w-sm w-full font-mono text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Aviso de Sandbox</span>
            </div>
            <p className="text-zinc-300 mb-4">{alertMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setAlertMessage(null)}
                className="px-4 py-1.5 bg-[#33ff80] text-black font-bold rounded-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
