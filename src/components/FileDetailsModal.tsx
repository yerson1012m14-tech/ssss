import React from 'react';
import { FileNode } from '../types';
import { formatFileSize } from '../data/initialFileSystem';
import { X, Shield, Calendar, HardDrive, FileText, Folder, Hash } from 'lucide-react';

interface FileDetailsModalProps {
  node: FileNode;
  fullPath: string;
  onClose: () => void;
  onUpdatePermissions?: (newPerms: string) => void;
}

export const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
  node,
  fullPath,
  onClose,
}) => {
  const isDirectory = node.type === 'directory';
  const size = isDirectory
    ? node.children?.reduce((acc, c) => acc + (c.size || c.content?.length || 0), 0) || 0
    : node.size ?? node.content?.length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#10131a] border border-[#262d3d] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden font-mono">
        {/* Header */}
        <div className="bg-[#151922] border-b border-[#242b3b] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDirectory ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30' : 'bg-[#1c2230] text-[#33ff80] border border-[#33ff80]/30'
            }`}>
              {isDirectory ? <Folder className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white truncate max-w-xs">{node.name}</h3>
              <p className="text-[10px] text-zinc-400">Atributos del archivo (stat)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-[#1c2230] hover:bg-[#252e40] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Properties */}
        <div className="p-4 space-y-3 text-xs text-zinc-300">
          <div className="p-3 bg-[#0a0c10] rounded-xl border border-[#1e2533] space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-[#1b202c]">
              <span className="text-zinc-500">Tipo:</span>
              <span className="text-white font-medium">{isDirectory ? 'Directorio (Carpeta)' : (node.mimeType || 'Archivo regular')}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#1b202c]">
              <span className="text-zinc-500">Tamaño:</span>
              <span className="text-[#33ff80] font-semibold">{formatFileSize(size)} ({size} bytes)</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#1b202c]">
              <span className="text-zinc-500">Permisos UNIX:</span>
              <span className="text-cyan-400 font-mono">{node.permissions || (isDirectory ? 'rwxr-xr-x (0755)' : 'rw-r--r-- (0644)')}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#1b202c]">
              <span className="text-zinc-500">Propietario / Grupo:</span>
              <span className="text-zinc-300 font-mono">mobile (501) / mobile (501)</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#1b202c]">
              <span className="text-zinc-500">Creado:</span>
              <span className="text-zinc-300">{node.createdAt}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-500">Modificado:</span>
              <span className="text-zinc-300">{node.updatedAt}</span>
            </div>
          </div>

          <div>
            <span className="text-zinc-500 block mb-1 text-[11px]">Ruta Absoluta Sandbox:</span>
            <div className="p-2.5 bg-[#0a0c10] border border-[#1e2533] rounded-lg text-zinc-300 font-mono text-[11px] break-all select-all">
              {fullPath}
            </div>
          </div>

          <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-[11px] text-[#33ff80]">
            <Shield className="w-4 h-4 shrink-0" />
            <span>Sandbox Access: Lectura y Escritura permitida (MCMFilza bypass)</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#151922] border-t border-[#242b3b] px-4 py-2.5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#222938] hover:bg-[#2d374b] text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
