import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal as TerminalIcon, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { AppContainer, FileNode } from '../types';
import { formatFileSize } from '../data/initialFileSystem';

interface TerminalOverlayProps {
  apps: AppContainer[];
  currentApp?: AppContainer | null;
  onClose: () => void;
}

interface CommandLog {
  command: string;
  output: string;
  isError?: boolean;
}

export const TerminalOverlay: React.FC<TerminalOverlayProps> = ({
  apps,
  currentApp,
  onClose,
}) => {
  const [currentPath, setCurrentPath] = useState<string>(
    currentApp ? currentApp.containerPath : '/var/mobile/Containers/Data/Application'
  );
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandLog[]>([
    {
      command: '',
      output: `Darwin iPhone-de-Elvis 23.4.0 Darwin Kernel Version 23.4.0: Fri Feb  9 21:30:10 PST 2024; root:xnu-10063.101.17~1/RELEASE_ARM64_T8120 iPhone15,2\nFilza Terminal Shell hooked with MCMFilza Engine (UID: 501 / mobile)\nType "help" for a list of available sandbox commands.\n`,
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const parts = cmd.split(' ').filter(Boolean);
    const main = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = '';
    let isError = false;

    switch (main) {
      case 'help':
        output = `Available MobileTerminal commands:
  ls [-la]              List directory contents
  pwd                   Print working directory
  cd <dir>              Change working directory (e.g. "cd ..", "cd Documents")
  cat <file>            Display text file contents
  whoami                Show current user (mobile)
  uname -a              System and kernel release
  stat <file>           Display inode / size / timestamp details
  apps                  List all registered iOS application containers
  df -h                 Display filesystem disk usage
  clear                 Clear terminal screen
  help                  Show this help reference`;
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'pwd':
        output = currentPath;
        break;

      case 'whoami':
        output = 'mobile (uid=501, gid=501, groups=501(mobile), 250(_analyticsusers))';
        break;

      case 'uname':
        output = 'Darwin iPhone15,2 23.4.0 Darwin Kernel Version 23.4.0 (arm64e)';
        break;

      case 'df':
        output = `Filesystem          Size   Used  Avail Capacity iused      ifree %iused  Mounted on
/dev/disk0s1s1      256G    48G   208G    19%  842100 4294125179    0%   /
/dev/disk0s1s2      256G    22G   208G    10%  421000 4294546279    0%   /private/var`;
        break;

      case 'apps':
        output = apps
          .map((a) => `${a.bundleId.padEnd(32)} [${a.name}] (${a.containerUuid})`)
          .join('\n');
        break;

      case 'ls': {
        const isLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
        
        // Find current directory node in the active app container or list apps if at root
        if (currentPath === '/var/mobile/Containers/Data/Application') {
          output = apps
            .map((a) => (isLong ? `drwxr-xr-x  mobile  mobile  4096  ${a.containerUuid} -> ${a.bundleId}` : a.containerUuid))
            .join('\n');
        } else {
          // In an app container
          const matchedApp = apps.find((a) => currentPath.startsWith(a.containerPath));
          if (matchedApp) {
            output = `total ${matchedApp.rootDirectory.children?.length || 4}\n`;
            if (isLong) {
              output += `drwxr-xr-x  mobile  mobile  160  .\ndrwxr-xr-x  mobile  mobile  160  ..\n`;
            }
            const items = matchedApp.rootDirectory.children || [];
            output += items
              .map((item) => {
                if (isLong) {
                  const perm = item.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--';
                  const size = (item.size || item.content?.length || 0).toString().padStart(8);
                  return `${perm}  mobile  mobile  ${size}  ${item.name}`;
                }
                return item.name;
              })
              .join('\n');
          } else {
            output = 'Documents  Library  tmp  StoreKit';
          }
        }
        break;
      }

      case 'cd': {
        const target = args[0];
        if (!target || target === '~' || target === '/') {
          setCurrentPath('/var/mobile/Containers/Data/Application');
        } else if (target === '..') {
          const segs = currentPath.split('/').filter(Boolean);
          if (segs.length > 0) {
            segs.pop();
            setCurrentPath('/' + segs.join('/'));
          }
        } else if (target.startsWith('/')) {
          setCurrentPath(target);
        } else {
          setCurrentPath(`${currentPath.replace(/\/$/, '')}/${target}`);
        }
        output = '';
        break;
      }

      case 'cat': {
        const filename = args[0];
        if (!filename) {
          output = 'cat: missing file operand';
          isError = true;
        } else {
          let foundContent: string | null = null;
          // Search in apps
          for (const app of apps) {
            const check = (node: FileNode) => {
              if (node.name.toLowerCase() === filename.toLowerCase() && node.content) {
                foundContent = node.content;
              }
              node.children?.forEach(check);
            };
            check(app.rootDirectory);
          }
          if (foundContent !== null) {
            output = foundContent;
          } else {
            output = `cat: ${filename}: No such file or directory`;
            isError = true;
          }
        }
        break;
      }

      case 'stat': {
        const filename = args[0];
        if (!filename) {
          output = 'stat: missing file operand';
          isError = true;
        } else {
          output = `  File: ${filename}
  Size: 4096       Blocks: 8          IO Block: 4096   directory
Device: 1,4        Inode: 19842091    Links: 3
Access: (0755/drwxr-xr-x)  Uid: (  501/  mobile)   Gid: (  501/  mobile)
Access: 2024-03-15 15:30:12.000000000 +0000
Modify: 2024-03-15 15:30:12.000000000 +0000
Change: 2024-03-15 15:30:12.000000000 +0000
 Birth: 2024-03-01 10:20:00.000000000 +0000`;
        }
        break;
      }

      default:
        output = `sh: command not found: ${main}. Type "help" for available commands.`;
        isError = true;
    }

    setHistory((prev) => [...prev, { command: cmd, output, isError }]);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className={`bg-[#07080b] border border-[#222836] rounded-2xl flex flex-col shadow-2xl overflow-hidden font-mono ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-4xl h-[75vh]'
        }`}
      >
        {/* Terminal Header */}
        <div className="bg-[#12151d] border-b border-[#202533] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80 cursor-pointer" onClick={() => setIsFullscreen(!isFullscreen)} />
            </div>
            <TerminalIcon className="w-3.5 h-3.5 text-[#33ff80]" />
            <span className="text-xs font-bold text-zinc-200">MobileTerminal — mobile@iPhone</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistory([])}
              title="Limpiar pantalla"
              className="p-1 text-zinc-400 hover:text-zinc-200 rounded hover:bg-[#1e2330]"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 text-zinc-400 hover:text-zinc-200 rounded hover:bg-[#1e2330]"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-red-400 rounded hover:bg-[#1e2330]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Screen */}
        <div 
          className="flex-1 p-4 overflow-y-auto bg-black text-[#33ff80] text-xs leading-relaxed font-mono selection:bg-[#33ff80]/30 selection:text-white"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((item, idx) => (
            <div key={idx} className="mb-2">
              {item.command && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="text-cyan-400">iPhone:~</span>
                  <span className="text-[#33ff80]">mobile$</span>
                  <span className="text-white font-semibold">{item.command}</span>
                </div>
              )}
              {item.output && (
                <pre className={`whitespace-pre-wrap mt-0.5 ${item.isError ? 'text-red-400' : 'text-[#33ff80]'}`}>
                  {item.output}
                </pre>
              )}
            </div>
          ))}

          {/* Active prompt */}
          <form onSubmit={handleCommand} className="flex items-center gap-1.5 mt-1">
            <span className="text-cyan-400 shrink-0">iPhone:~</span>
            <span className="text-[#33ff80] shrink-0">mobile$</span>
            <input
              ref={inputRef}
              type="text"
              id="terminal-active-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none caret-[#33ff80]"
              autoFocus
              spellCheck={false}
            />
          </form>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};
