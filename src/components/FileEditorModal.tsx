import React, { useState, useEffect } from 'react';
import { FileNode } from '../types';
import { formatFileSize } from '../data/initialFileSystem';
import { 
  X, 
  Save, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  Maximize2, 
  Minimize2, 
  AlertCircle,
  Eye,
  Code
} from 'lucide-react';

interface FileEditorModalProps {
  file: FileNode;
  onClose: () => void;
  onSave: (fileId: string, newContent: string) => void;
}

export const FileEditorModal: React.FC<FileEditorModalProps> = ({
  file,
  onClose,
  onSave,
}) => {
  const [content, setContent] = useState(file.content || '');
  const [isSaved, setIsSaved] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);

  useEffect(() => {
    setContent(file.content || '');
    setIsSaved(true);
  }, [file]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    onSave(file.id, content);
    setIsSaved(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: file.mimeType || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fileSize = file.size ?? content.length;
  const isLarge = fileSize > 2 * 1024 * 1024;
  const isBinary = file.isBinary;

  const lines = content.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className={`bg-[#0a0c10] border border-[#262c3c] rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-all duration-200 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-4xl h-[85vh]'
        }`}
      >
        {/* Editor Header Bar (iOS Filza Dark Style) */}
        <div className="bg-[#12141a] border-b border-[#202533] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#1a1e28] border border-[#2e3547] flex items-center justify-center text-[#33ff80]">
              <FileCode className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm font-bold text-white truncate">
                  {file.name}
                </h3>
                {!isSaved && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Cambios sin guardar" />
                )}
              </div>
              <p className="text-[10px] font-mono text-zinc-400">
                {formatFileSize(fileSize)} • {isBinary ? 'Binario' : `${lines.length} líneas`} • UTF-8
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setLineNumbers(!lineNumbers)}
              title="Alternar números de línea"
              className={`p-1.5 rounded-lg border text-xs font-mono transition-colors ${
                lineNumbers 
                  ? 'bg-[#202635] text-[#33ff80] border-[#33ff80]/40' 
                  : 'bg-[#161820] text-zinc-400 border-[#242938]'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCopy}
              title="Copiar contenido"
              className="p-1.5 rounded-lg bg-[#161820] hover:bg-[#202635] text-zinc-300 border border-[#242938] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#33ff80]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleDownload}
              title="Descargar archivo"
              className="p-1.5 rounded-lg bg-[#161820] hover:bg-[#202635] text-zinc-300 border border-[#242938] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {!isBinary && (
              <button
                onClick={handleSave}
                disabled={isSaved}
                id="btn-save-file"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#33ff80] hover:bg-[#2be070] text-black font-semibold text-xs font-mono disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar</span>
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              className="p-1.5 rounded-lg bg-[#161820] hover:bg-[#202635] text-zinc-300 border border-[#242938] transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              id="btn-close-editor"
              title="Cerrar visor"
              className="p-1.5 rounded-lg bg-[#161820] hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-[#242938] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 flex overflow-hidden bg-black font-mono">
          {isLarge ? (
            <div className="p-8 text-center m-auto font-mono text-zinc-400">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Archivo demasiado grande</p>
              <p className="text-xs text-zinc-500 mt-1">
                ({formatFileSize(fileSize)}). Por rendimiento no se carga en el editor web.
              </p>
              <button
                onClick={handleDownload}
                className="mt-4 px-4 py-2 rounded-xl bg-[#202635] text-[#33ff80] border border-[#33ff80]/30 text-xs hover:bg-[#2b3347]"
              >
                Descargar para ver localmente
              </button>
            </div>
          ) : isBinary ? (
            <div className="p-8 text-center m-auto font-mono text-zinc-400">
              <Eye className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Archivo binario ({file.mimeType || 'octet-stream'})</p>
              <p className="text-xs text-zinc-500 mt-1">
                Tamaño: {formatFileSize(fileSize)}. Este archivo contiene datos binarios compilados.
              </p>
              {file.content && (
                <div className="mt-4 max-w-xl mx-auto p-3 rounded-lg bg-[#101218] border border-[#222836] text-left text-[11px] text-zinc-400 overflow-x-auto whitespace-pre">
                  {file.content.slice(0, 300)}...
                </div>
              )}
              <button
                onClick={handleDownload}
                className="mt-4 px-4 py-2 rounded-xl bg-[#202635] text-cyan-400 border border-cyan-500/30 text-xs hover:bg-[#2b3347]"
              >
                Descargar archivo
              </button>
            </div>
          ) : (
            <div className="flex-1 flex overflow-hidden">
              {lineNumbers && (
                <div className="w-12 py-3 bg-[#08090d] border-r border-[#1a1e2a] text-zinc-600 select-none text-right pr-3 font-mono text-xs leading-6 overflow-hidden">
                  {lines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
              )}

              <textarea
                value={content}
                onChange={handleContentChange}
                spellCheck={false}
                id="file-content-textarea"
                className="flex-1 bg-black text-[#33ff80] p-3 font-mono text-xs leading-6 resize-none focus:outline-none overflow-y-auto selection:bg-[#33ff80]/20 selection:text-white"
                style={{ tabSize: 2 }}
                placeholder="Escribe aquí el contenido del archivo..."
              />
            </div>
          )}
        </div>

        {/* Editor Status Bar */}
        <div className="bg-[#0f1116] border-t border-[#1e2330] px-4 py-1.5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span>MODO: {isBinary ? 'BINARIO' : 'TEXTO EDITABLE'}</span>
            <span>ENCODING: UTF-8</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={isSaved ? 'text-zinc-500' : 'text-amber-400 font-semibold'}>
              {isSaved ? 'SIN CAMBIOS PENDIENTES' : 'CAMBIOS SIN GUARDAR'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
