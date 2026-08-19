import React, { useState } from 'react';
import { X, Smartphone, Plus, Sparkles, FolderPlus } from 'lucide-react';
import { AppContainer } from '../types';

interface NewItemModalProps {
  onClose: () => void;
  onAddApp: (newApp: AppContainer) => void;
}

const TEMPLATES = [
  {
    name: 'WhatsApp Messenger',
    bundleId: 'net.whatsapp.WhatsApp',
    developer: 'WhatsApp Inc.',
    version: '24.5.75',
  },
  {
    name: 'TikTok',
    bundleId: 'com.zhiliaoapp.musically',
    developer: 'ByteDance Ltd.',
    version: '33.8.0',
  },
  {
    name: 'Discord',
    bundleId: 'com.hammerandchisel.discord',
    developer: 'Discord Inc.',
    version: '219.0',
  },
  {
    name: 'YouTube',
    bundleId: 'com.google.ios.youtube',
    developer: 'Google LLC',
    version: '19.10.4',
  },
  {
    name: 'RetroArch Emulator',
    bundleId: 'com.libretro.RetroArch',
    developer: 'Libretro',
    version: '1.18.0',
  },
];

export const NewItemModal: React.FC<NewItemModalProps> = ({
  onClose,
  onAddApp,
}) => {
  const [name, setName] = useState('');
  const [bundleId, setBundleId] = useState('');
  const [developer, setDeveloper] = useState('');
  const [version, setVersion] = useState('1.0.0');

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16).toUpperCase();
    });
  };

  const handleApplyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setName(tpl.name);
    setBundleId(tpl.bundleId);
    setDeveloper(tpl.developer);
    setVersion(tpl.version);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleId.trim()) return;

    const finalBundleId = bundleId.trim();
    const finalName = name.trim() || finalBundleId.split('.').pop() || 'Nueva App';
    const finalDev = developer.trim() || 'Desarrollador Desconocido';
    const uuid = generateUUID();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newApp: AppContainer = {
      id: `app-${Date.now()}`,
      bundleId: finalBundleId,
      name: finalName,
      developer: finalDev,
      version: version.trim() || '1.0.0',
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
            children: [
              {
                id: `file-${uuid}-user-data`,
                name: 'AppData.json',
                type: 'file',
                size: 256,
                mimeType: 'application/json',
                createdAt: now,
                updatedAt: now,
                permissions: 'rw-r--r--',
                content: `{\n  "bundleId": "${finalBundleId}",\n  "initialized": true,\n  "firstLaunch": "${now}",\n  "sandboxVersion": 2\n}`,
              },
            ],
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
                children: [
                  {
                    id: `file-${uuid}-plist`,
                    name: `${finalBundleId}.plist`,
                    type: 'file',
                    size: 512,
                    mimeType: 'application/x-plist',
                    createdAt: now,
                    updatedAt: now,
                    permissions: 'rw-r--r--',
                    content: `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n  <key>AppVersion</key>\n  <string>${version}</string>\n  <key>BundleID</key>\n  <string>${finalBundleId}</string>\n</dict>\n</plist>`,
                  },
                ],
              },
              {
                id: `dir-${uuid}-caches`,
                name: 'Caches',
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

    onAddApp(newApp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#10131a] border border-[#262d3d] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden font-mono">
        {/* Header */}
        <div className="bg-[#151922] border-b border-[#242b3b] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#33ff80]/15 border border-[#33ff80]/30 flex items-center justify-center text-[#33ff80]">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Registrar Contenedor de App</h3>
              <p className="text-[10px] text-zinc-400">Crear Sandbox en /var/mobile/Containers/Data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-[#1c2230] hover:bg-[#252e40] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick templates */}
        <div className="px-4 pt-3">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Plantillas rápidas:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.bundleId}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                className="px-2.5 py-1 rounded-lg bg-[#181c25] hover:bg-[#242a38] text-zinc-300 hover:text-white border border-[#282f3f] text-[11px] transition-colors"
              >
                {tpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">
              Bundle Identifier <span className="text-[#33ff80]">*</span>
            </label>
            <input
              type="text"
              required
              id="input-new-app-bundle-id"
              value={bundleId}
              onChange={(e) => setBundleId(e.target.value)}
              placeholder="ej: com.apple.calculator, com.whatsapp"
              className="w-full bg-[#0a0c10] text-white font-mono px-3 py-2 rounded-xl border border-[#242b3b] focus:outline-none focus:border-[#33ff80]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1">Nombre Visible</label>
              <input
                type="text"
                id="input-new-app-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej: Calculator"
                className="w-full bg-[#0a0c10] text-white font-mono px-3 py-2 rounded-xl border border-[#242b3b] focus:outline-none focus:border-[#33ff80]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Versión</label>
              <input
                type="text"
                id="input-new-app-version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full bg-[#0a0c10] text-white font-mono px-3 py-2 rounded-xl border border-[#242b3b] focus:outline-none focus:border-[#33ff80]"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Desarrollador / Vendor</label>
            <input
              type="text"
              id="input-new-app-dev"
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              placeholder="ej: Apple Inc., Meta Platforms"
              className="w-full bg-[#0a0c10] text-white font-mono px-3 py-2 rounded-xl border border-[#242b3b] focus:outline-none focus:border-[#33ff80]"
            />
          </div>

          <div className="p-2.5 bg-[#0a0c10] rounded-xl border border-[#1e2533] text-[11px] text-zinc-400">
            Se generará la estructura estándar de iOS:
            <div className="text-zinc-500 mt-1 pl-2">
              ├── Documents/<br/>
              ├── Library/ (Preferences, Caches)<br/>
              └── tmp/
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#181c25] hover:bg-[#222836] text-zinc-400 hover:text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!bundleId.trim()}
              id="btn-create-app-submit"
              className="px-4 py-2 bg-[#33ff80] hover:bg-[#2be070] text-black rounded-xl text-xs font-bold font-mono transition-colors disabled:opacity-40"
            >
              Registrar App
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
