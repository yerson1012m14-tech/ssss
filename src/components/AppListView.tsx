import React, { useState } from 'react';
import { AppContainer } from '../types';
import { 
  Search, 
  Smartphone, 
  ChevronRight, 
  Plus, 
  FolderLock, 
  Terminal, 
  Cpu, 
  HardDrive,
  ExternalLink,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';

interface AppListViewProps {
  apps: AppContainer[];
  onSelectApp: (app: AppContainer) => void;
  onOpenManualBundleId: (bundleId: string) => void;
  onAddNewApp: () => void;
  onOpenTerminal: () => void;
  onDeleteApp: (appId: string) => void;
}

export const AppListView: React.FC<AppListViewProps> = ({
  apps,
  onSelectApp,
  onOpenManualBundleId,
  onAddNewApp,
  onOpenTerminal,
  onDeleteApp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [manualInput, setManualInput] = useState('');

  const filteredApps = apps.filter(
    (app) =>
      app.bundleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.developer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onOpenManualBundleId(manualInput.trim());
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0d10]">
      {/* iOS App Navigation Header */}
      <div className="border-b border-[#20242e] bg-[#12141a]/90 backdrop-blur-md px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#33ff80]/15 border border-[#33ff80]/30 flex items-center justify-center text-[#33ff80]">
              <FolderLock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">MiFilza</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#20242e] text-[#33ff80] font-mono font-medium">
                  {apps.length}
                </span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-950/80 text-[#33ff80] border border-[#33ff80]/30 font-mono">
                  Sandbox Root
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                MCMFilza Unrestricted Engine (iOS 14.0 - 17.x)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTerminal}
              id="btn-open-terminal"
              title="Open MobileTerminal Shell"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1a1e27] hover:bg-[#252a36] text-zinc-300 hover:text-white border border-[#2b303d] text-xs font-mono transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-[#33ff80]" />
              <span className="hidden sm:inline">Terminal</span>
            </button>
            <button
              onClick={onAddNewApp}
              id="btn-add-app"
              title="Register App Container"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#33ff80] hover:bg-[#2be070] text-black font-semibold text-xs transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva App</span>
            </button>
          </div>
        </div>

        {/* Manual Bundle ID input form (Objective-C TextField simulation) */}
        <form onSubmit={handleManualSubmit} className="mt-3">
          <div className="relative flex items-center">
            <div className="absolute left-3 text-zinc-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="input-bundle-id"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="bundle id manual + enter (ej: com.apple.mobilesafari)"
              className="w-full bg-[#181b22] text-zinc-100 placeholder-zinc-500 font-mono text-xs pl-9 pr-24 py-2.5 rounded-xl border border-[#2c3240] focus:outline-none focus:border-[#33ff80] focus:ring-1 focus:ring-[#33ff80] transition-all"
            />
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="absolute right-1.5 px-2.5 py-1 text-xs font-mono rounded-lg bg-[#272d3b] hover:bg-[#32394a] text-[#33ff80] disabled:opacity-40 disabled:pointer-events-none transition-colors border border-[#3b4356]"
            >
              Explorar ↵
            </button>
          </div>
        </form>

        {/* Filter search if more than 3 apps */}
        {apps.length > 3 && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              id="input-filter-apps"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por nombre o desarrollador..."
              className="w-full bg-[#14161d] text-zinc-300 placeholder-zinc-600 font-mono text-[11px] px-3 py-1.5 rounded-lg border border-[#222733] focus:outline-none focus:border-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 px-2 py-1"
              >
                Limpiar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info status strip */}
      <div className="bg-[#101217] border-b border-[#1b1f28] px-4 py-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#33ff80]" />
          <span>Contenedores en /var/mobile/Containers/Data/Application</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">iOS Sandbox Bypass: ACTIVO</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-300">{filteredApps.length} apps</span>
        </div>
      </div>

      {/* Main Apps Table View */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#1b1f28]">
        {filteredApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#161922] border border-[#282e3d] flex items-center justify-center text-zinc-500 mb-3">
              <Smartphone className="w-7 h-7" />
            </div>
            <p className="text-sm font-mono text-zinc-300 font-medium mb-1">
              No se detectaron aplicaciones
            </p>
            <p className="text-xs font-mono text-zinc-500 max-w-sm mb-4">
              Escribe arriba el bundle ID de una app instalada o crea un nuevo contenedor de prueba.
            </p>
            <button
              onClick={onAddNewApp}
              className="px-4 py-2 rounded-xl bg-[#202531] hover:bg-[#2a3040] text-[#33ff80] border border-[#33ff80]/30 font-mono text-xs transition-colors"
            >
              + Crear Contenedor de Prueba
            </button>
          </div>
        ) : (
          filteredApps.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
              className="group flex items-center justify-between px-4 py-3.5 cursor-pointer transition-colors"
              onClick={() => onSelectApp(app)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#181c25] border border-[#2b3140] flex items-center justify-center text-[#33ff80] shrink-0 group-hover:border-[#33ff80]/50 transition-colors">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#33ff80] truncate">
                      {app.bundleId}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1e232f] text-zinc-400">
                      v{app.version}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-zinc-300 font-medium truncate">
                      {app.name}
                    </span>
                    <span className="text-zinc-600 text-xs">•</span>
                    <span className="text-[11px] text-zinc-500 truncate font-mono">
                      {app.developer}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">
                    UUID: {app.containerUuid}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className="text-[11px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors hidden sm:inline">
                  toca para explorar
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`¿Eliminar contenedor de ${app.bundleId}?`)) {
                      onDeleteApp(app.id);
                    }
                  }}
                  title="Eliminar contenedor"
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-[#25181a] transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-[#33ff80] transition-colors" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer system details */}
      <div className="border-t border-[#1b1f28] bg-[#0f1116] px-4 py-2.5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#33ff80]" /> arm64e
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-cyan-400" /> APFS (Case-sensitive)
          </span>
        </div>
        <div className="text-zinc-400">
          MiFilza Mobile File Manager
        </div>
      </div>
    </div>
  );
};
