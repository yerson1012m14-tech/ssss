import React, { useState, useRef } from 'react';
import { FileNode, BreadcrumbItem } from '../types';
import { formatFileSize } from '../data/initialFileSystem';
import {
  Folder,
  FolderOpen,
  FileText,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  Image as ImageIcon,
  File,
  CornerLeftUp,
  Search,
  Plus,
  Upload,
  Trash2,
  Info,
  Edit3,
  Download,
  ChevronRight,
  MoreVertical,
  Terminal,
  RefreshCw,
  FolderPlus,
  FilePlus,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'motion/react';

interface FileBrowserViewProps {
  currentPath: string;
  items: FileNode[];
  breadcrumbs: BreadcrumbItem[];
  appBundleId?: string;
  appName?: string;
  onNavigateToDir: (dirNode: FileNode) => void;
  onNavigateUp: () => void;
  onNavigateBreadcrumb: (path: string) => void;
  onOpenFile: (fileNode: FileNode) => void;
  onShowDetails: (node: FileNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onCreateFolder: (name: string) => void;
  onCreateFile: (name: string, content: string) => void;
  onUploadFile: (file: { name: string; content: string; size: number; isBinary: boolean; mimeType: string }) => void;
  onBackToApps: () => void;
  onOpenTerminal: () => void;
}

export const FileBrowserView: React.FC<FileBrowserViewProps> = ({
  currentPath,
  items,
  breadcrumbs,
  appBundleId,
  appName,
  onNavigateToDir,
  onNavigateUp,
  onNavigateBreadcrumb,
  onOpenFile,
  onShowDetails,
  onDeleteNode,
  onCreateFolder,
  onCreateFile,
  onUploadFile,
  onBackToApps,
  onOpenTerminal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Split and sort items: folders first, then files alphabetically (localizedStandardCompare like in Obj-C)
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const directories = filteredItems
    .filter((i) => i.type === 'directory')
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

  const files = filteredItems
    .filter((i) => i.type === 'file')
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

  const isRoot = breadcrumbs.length <= 1;

  const getFileIcon = (file: FileNode) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'plist' || ext === 'json' || ext === 'xml') {
      return <FileCode className="w-5 h-5 text-amber-400" />;
    }
    if (ext === 'sqlite' || ext === 'db' || ext === 'sqlite3') {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    }
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif' || ext === 'svg' || ext === 'webp') {
      return <ImageIcon className="w-5 h-5 text-purple-400" />;
    }
    if (ext === 'zip' || ext === 'tar' || ext === 'gz' || ext === 'ipa') {
      return <FileArchive className="w-5 h-5 text-rose-400" />;
    }
    if (ext === 'log' || ext === 'txt' || ext === 'md' || ext === 'sh') {
      return <FileText className="w-5 h-5 text-sky-400" />;
    }
    return <File className="w-5 h-5 text-zinc-400" />;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const reader = new FileReader();
    const isText = uploadedFile.type.startsWith('text/') || 
                   uploadedFile.name.endsWith('.json') || 
                   uploadedFile.name.endsWith('.plist') || 
                   uploadedFile.name.endsWith('.log') || 
                   uploadedFile.name.endsWith('.txt') ||
                   uploadedFile.name.endsWith('.xml') ||
                   uploadedFile.name.endsWith('.sh');

    if (isText) {
      reader.onload = (event) => {
        const textContent = (event.target?.result as string) || '';
        onUploadFile({
          name: uploadedFile.name,
          content: textContent,
          size: uploadedFile.size,
          isBinary: false,
          mimeType: uploadedFile.type || 'text/plain',
        });
      };
      reader.readAsText(uploadedFile);
    } else {
      reader.onload = (event) => {
        const binaryContent = (event.target?.result as string) || '';
        onUploadFile({
          name: uploadedFile.name,
          content: binaryContent,
          size: uploadedFile.size,
          isBinary: true,
          mimeType: uploadedFile.type || 'application/octet-stream',
        });
      };
      reader.readAsDataURL(uploadedFile);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const handleCreateFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim(), '');
      setNewFileName('');
      setIsCreatingFile(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0d10]">
      {/* Header bar matching Objective-C Navigation Bar */}
      <div className="border-b border-[#20242e] bg-[#12141a]/95 backdrop-blur-md px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onBackToApps}
              id="btn-back-to-apps"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1a1e27] hover:bg-[#252a36] text-[#33ff80] text-xs font-mono font-medium border border-[#2b303d] transition-colors shrink-0"
              title="Volver a lista de Apps"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Apps</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white font-mono truncate">
                  {appName || appBundleId || 'Directorio'}
                </h2>
                {appBundleId && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#202532] text-[#33ff80] truncate hidden md:inline">
                    {appBundleId}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-400 font-mono truncate">
                {currentPath}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload-input"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              id="btn-upload-file"
              title="Subir archivo al contenedor"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#181c25] hover:bg-[#222733] text-zinc-300 hover:text-white border border-[#282e3d] text-xs font-mono transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Subir</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowCreateMenu(!showCreateMenu)}
                id="btn-add-item-menu"
                title="Crear elemento"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#33ff80] hover:bg-[#2be070] text-black text-xs font-semibold font-mono transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Crear</span>
              </button>

              {showCreateMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#181c25] border border-[#2c3343] shadow-2xl py-1 z-30 font-mono text-xs">
                  <button
                    onClick={() => {
                      setIsCreatingFolder(true);
                      setShowCreateMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-zinc-200 hover:bg-[#222836] flex items-center gap-2"
                  >
                    <FolderPlus className="w-4 h-4 text-cyan-400" />
                    <span>Nueva Carpeta</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCreatingFile(true);
                      setShowCreateMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-zinc-200 hover:bg-[#222836] flex items-center gap-2"
                  >
                    <FilePlus className="w-4 h-4 text-[#33ff80]" />
                    <span>Nuevo Archivo</span>
                  </button>
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowCreateMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-zinc-200 hover:bg-[#222836] flex items-center gap-2 border-t border-[#262c3b]"
                  >
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Subir desde PC</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onOpenTerminal}
              id="btn-browser-terminal"
              title="Abrir Terminal en este path"
              className="p-1.5 rounded-lg bg-[#181c25] hover:bg-[#222733] text-[#33ff80] border border-[#282e3d] transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Breadcrumb path bar */}
        <div className="mt-2.5 flex items-center gap-1 overflow-x-auto text-[11px] font-mono text-zinc-400 py-1 scrollbar-none">
          <span className="text-zinc-500 shrink-0">Ruta:</span>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.path}>
              <button
                onClick={() => onNavigateBreadcrumb(crumb.path)}
                className={`hover:text-[#33ff80] transition-colors truncate max-w-[150px] ${
                  idx === breadcrumbs.length - 1 ? 'text-[#33ff80] font-semibold' : 'text-zinc-400'
                }`}
              >
                {crumb.name}
              </button>
              {idx < breadcrumbs.length - 1 && (
                <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Filter input */}
        <div className="mt-2 relative">
          <div className="absolute left-2.5 top-2 text-zinc-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            id="input-filter-files"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar archivos en esta carpeta..."
            className="w-full bg-[#161820] text-zinc-200 placeholder-zinc-600 font-mono text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#242936] focus:outline-none focus:border-[#33ff80]"
          />
        </div>
      </div>

      {/* Modals for new Folder and File inline */}
      {isCreatingFolder && (
        <div className="bg-[#181c25] border-b border-[#2a3040] p-3">
          <form onSubmit={handleCreateFolderSubmit} className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              autoFocus
              id="input-new-folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nombre de la carpeta (ej: MisDescargas)"
              className="flex-1 bg-[#101217] text-white font-mono text-xs px-3 py-1.5 rounded-lg border border-[#333a4d] focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!newFolderName.trim()}
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono rounded-lg transition-colors"
            >
              Crear
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingFolder(false)}
              className="px-2.5 py-1.5 text-zinc-400 hover:text-white text-xs font-mono"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}

      {isCreatingFile && (
        <div className="bg-[#181c25] border-b border-[#2a3040] p-3">
          <form onSubmit={handleCreateFileSubmit} className="flex items-center gap-2">
            <FilePlus className="w-4 h-4 text-[#33ff80] shrink-0" />
            <input
              type="text"
              autoFocus
              id="input-new-file-name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Nombre del archivo (ej: config.plist, test.json, log.txt)"
              className="flex-1 bg-[#101217] text-white font-mono text-xs px-3 py-1.5 rounded-lg border border-[#333a4d] focus:outline-none focus:border-[#33ff80]"
            />
            <button
              type="submit"
              disabled={!newFileName.trim()}
              className="px-3 py-1.5 bg-[#33ff80] hover:bg-[#2be070] text-black font-semibold text-xs font-mono rounded-lg transition-colors"
            >
              Crear
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingFile(false)}
              className="px-2.5 py-1.5 text-zinc-400 hover:text-white text-xs font-mono"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}

      {/* Directory Contents Table (Obj-C FileBrowserVC Style) */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#1b1f28]">
        {/* Parent Directory ".." button (Subir) */}
        {!isRoot && (
          <div
            onClick={onNavigateUp}
            id="row-navigate-up"
            className="flex items-center justify-between px-4 py-3 cursor-pointer bg-[#101218] hover:bg-[#181b24] transition-colors border-b border-[#202532]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1d212b] border border-[#2b3140] flex items-center justify-center text-zinc-400">
                <CornerLeftUp className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono text-sm font-bold text-zinc-300">..</span>
                <p className="text-[10px] font-mono text-zinc-500">subir nivel</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">directorio superior</span>
          </div>
        )}

        {/* Directories list */}
        {directories.map((dir) => (
          <div
            key={dir.id}
            className="group flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.03] transition-colors"
            onClick={() => onNavigateToDir(dir)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Folder className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-xs font-semibold text-cyan-400 truncate block">
                  {dir.name}
                </span>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-zinc-500">
                  <span>carpeta</span>
                  <span>•</span>
                  <span>{dir.children?.length || 0} elementos</span>
                  <span>•</span>
                  <span>{dir.permissions || 'rwxr-xr-x'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowDetails(dir);
                }}
                title="Detalles"
                className="p-1.5 text-zinc-500 hover:text-cyan-300 rounded-lg hover:bg-[#1a1e28] transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`¿Eliminar la carpeta "${dir.name}" y todo su contenido?`)) {
                    onDeleteNode(dir.id);
                  }
                }}
                title="Eliminar"
                className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-[#25181a] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
        ))}

        {/* Files list */}
        {files.map((file) => (
          <div
            key={file.id}
            className="group flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.03] transition-colors"
            onClick={() => onOpenFile(file)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#171a22] border border-[#2a2f3e] flex items-center justify-center shrink-0">
                {getFileIcon(file)}
              </div>
              <div className="min-w-0">
                <span className="font-mono text-xs font-medium text-zinc-100 truncate block group-hover:text-white">
                  {file.name}
                </span>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-zinc-500">
                  <span className="text-zinc-400">{formatFileSize(file.size ?? file.content?.length ?? 0)}</span>
                  <span>•</span>
                  <span>{file.permissions || 'rw-r--r--'}</span>
                  <span>•</span>
                  <span>{file.updatedAt.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowDetails(file);
                }}
                title="Detalles"
                className="p-1.5 text-zinc-500 hover:text-[#33ff80] rounded-lg hover:bg-[#1a1e28] transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`¿Eliminar el archivo "${file.name}"?`)) {
                    onDeleteNode(file.id);
                  }
                }}
                title="Eliminar"
                className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-[#25181a] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-[#33ff80] transition-colors" />
            </div>
          </div>
        ))}

        {/* Empty directory state */}
        {directories.length === 0 && files.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center font-mono">
            <FolderOpen className="w-10 h-10 text-zinc-600 mb-2" />
            <p className="text-xs text-zinc-400">Directorio vacío</p>
            <p className="text-[11px] text-zinc-600 mt-1">
              Usa el botón "Crear" o "Subir" para agregar archivos a este contenedor.
            </p>
          </div>
        )}
      </div>

      {/* Directory summary footer */}
      <div className="border-t border-[#1b1f28] bg-[#0f1116] px-4 py-2 flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <div>
          <span>{directories.length} carpetas, {files.length} archivos</span>
        </div>
        <div>
          <span>
            Total: {formatFileSize(files.reduce((acc, f) => acc + (f.size || f.content?.length || 0), 0))}
          </span>
        </div>
      </div>
    </div>
  );
};
