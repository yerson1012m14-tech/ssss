import { AppContainer, FileNode } from '../types';

export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export const INITIAL_APPS: AppContainer[] = [
  {
    id: 'app-1',
    bundleId: 'com.apple.mobilesafari',
    name: 'Safari',
    version: '17.4.1',
    developer: 'Apple Inc.',
    containerUuid: '9B2E4A10-7B5D-4F18-912A-6A3828C59A41',
    containerPath: '/var/mobile/Containers/Data/Application/9B2E4A10-7B5D-4F18-912A-6A3828C59A41',
    installedAt: '2024-03-01 10:20:00',
    rootDirectory: {
      id: 'dir-safari-root',
      name: '9B2E4A10-7B5D-4F18-912A-6A3828C59A41',
      type: 'directory',
      createdAt: '2024-03-01 10:20:00',
      updatedAt: '2024-03-15 14:32:00',
      permissions: 'rwxr-xr-x',
      children: [
        {
          id: 'dir-safari-docs',
          name: 'Documents',
          type: 'directory',
          createdAt: '2024-03-01 10:20:00',
          updatedAt: '2024-03-14 09:12:00',
          permissions: 'rwxr-xr-x',
          children: [
            {
              id: 'file-safari-bookmarks',
              name: 'Bookmarks.plist',
              type: 'file',
              size: 4096,
              mimeType: 'application/x-plist',
              createdAt: '2024-03-01 10:21:00',
              updatedAt: '2024-03-14 09:12:00',
              permissions: 'rw-r--r--',
              content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Title</key>
  <string>Favorites</string>
  <key>Children</key>
  <array>
    <dict>
      <key>Title</key>
      <string>Apple Developer</string>
      <key>URL</key>
      <string>https://developer.apple.com</string>
      <key>AddedDate</key>
      <date>2024-03-01T10:22:00Z</date>
    </dict>
    <dict>
      <key>Title</key>
      <string>GitHub</string>
      <key>URL</key>
      <string>https://github.com</string>
      <key>AddedDate</key>
      <date>2024-03-05T18:14:00Z</date>
    </dict>
    <dict>
      <key>Title</key>
      <string>iOS Security Guide</string>
      <key>URL</key>
      <string>https://support.apple.com/guide/security</string>
      <key>AddedDate</key>
      <date>2024-03-12T11:05:00Z</date>
    </dict>
  </array>
</dict>
</plist>`,
            },
            {
              id: 'file-safari-reading',
              name: 'ReadingList.db',
              type: 'file',
              size: 16384,
              isBinary: true,
              mimeType: 'application/x-sqlite3',
              createdAt: '2024-03-01 10:20:00',
              updatedAt: '2024-03-12 16:40:00',
              permissions: 'rw-r--r--',
              content: `SQLite format 3\x00\x10\x00\x01\x01\x00@  \x00\x00\x00\x05\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00`,
            },
            {
              id: 'file-safari-notes',
              name: 'UserSession.json',
              type: 'file',
              size: 512,
              mimeType: 'application/json',
              createdAt: '2024-03-15 14:00:00',
              updatedAt: '2024-03-15 14:32:00',
              permissions: 'rw-r--r--',
              content: `{
  "tabCount": 4,
  "privateMode": false,
  "lastActiveTab": "https://developer.apple.com/documentation",
  "historyRetentionDays": 30,
  "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15",
  "syncCloudTabs": true
}`,
            },
          ],
        },
        {
          id: 'dir-safari-lib',
          name: 'Library',
          type: 'directory',
          createdAt: '2024-03-01 10:20:00',
          updatedAt: '2024-03-15 14:32:00',
          permissions: 'rwxr-xr-x',
          children: [
            {
              id: 'dir-safari-prefs',
              name: 'Preferences',
              type: 'directory',
              createdAt: '2024-03-01 10:20:00',
              updatedAt: '2024-03-15 11:00:00',
              permissions: 'rwxr-xr-x',
              children: [
                {
                  id: 'file-safari-pref-plist',
                  name: 'com.apple.mobilesafari.plist',
                  type: 'file',
                  size: 2048,
                  mimeType: 'application/x-plist',
                  createdAt: '2024-03-01 10:20:00',
                  updatedAt: '2024-03-15 11:00:00',
                  permissions: 'rw-r--r--',
                  content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>WebKitJavaScriptCanOpenWindowsAutomatically</key>
  <false/>
  <key>SafariDoNotTrackEnabled</key>
  <true/>
  <key>SearchEngineString</key>
  <string>Google</string>
  <key>FraudWarning</key>
  <true/>
  <key>WebKitDeveloperExtras</key>
  <true/>
</dict>
</plist>`,
                },
              ],
            },
            {
              id: 'dir-safari-caches',
              name: 'Caches',
              type: 'directory',
              createdAt: '2024-03-01 10:20:00',
              updatedAt: '2024-03-15 14:32:00',
              permissions: 'rwxr-xr-x',
              children: [
                {
                  id: 'file-safari-cache-idx',
                  name: 'Cache.db',
                  type: 'file',
                  size: 145408,
                  isBinary: true,
                  mimeType: 'application/x-sqlite3',
                  createdAt: '2024-03-02 08:10:00',
                  updatedAt: '2024-03-15 14:30:00',
                  permissions: 'rw-r--r--',
                },
                {
                  id: 'file-safari-cache-manifest',
                  name: 'manifest.json',
                  type: 'file',
                  size: 1024,
                  mimeType: 'application/json',
                  createdAt: '2024-03-10 12:00:00',
                  updatedAt: '2024-03-15 14:32:00',
                  permissions: 'rw-r--r--',
                  content: `{
  "cacheVersion": 4,
  "totalObjects": 182,
  "maxSizeBytes": 52428800,
  "lastCleaned": "2024-03-15T03:00:00Z"
}`,
                },
              ],
            },
            {
              id: 'dir-safari-webkit',
              name: 'WebKit',
              type: 'directory',
              createdAt: '2024-03-01 10:20:00',
              updatedAt: '2024-03-15 14:32:00',
              permissions: 'rwxr-xr-x',
              children: [
                {
                  id: 'file-safari-localstorage',
                  name: 'LocalStorage.db',
                  type: 'file',
                  size: 65536,
                  isBinary: true,
                  mimeType: 'application/x-sqlite3',
                  createdAt: '2024-03-01 10:25:00',
                  updatedAt: '2024-03-15 14:32:00',
                  permissions: 'rw-r--r--',
                },
              ],
            },
          ],
        },
        {
          id: 'dir-safari-tmp',
          name: 'tmp',
          type: 'directory',
          createdAt: '2024-03-15 00:00:00',
          updatedAt: '2024-03-15 14:15:00',
          permissions: 'rwxrwxrwt',
          children: [
            {
              id: 'file-safari-download-tmp',
              name: 'preview_asset_1092.tmp',
              type: 'file',
              size: 83200,
              isBinary: true,
              mimeType: 'application/octet-stream',
              createdAt: '2024-03-15 14:15:00',
              updatedAt: '2024-03-15 14:15:00',
              permissions: 'rw-r--r--',
            },
          ],
        },
        {
          id: 'file-safari-itunesmeta',
          name: 'iTunesMetadata.plist',
          type: 'file',
          size: 1540,
          mimeType: 'application/x-plist',
          createdAt: '2024-03-01 10:20:00',
          updatedAt: '2024-03-01 10:20:00',
          permissions: 'r--r--r--',
          content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>bundleDisplayName</key>
  <string>Safari</string>
  <key>bundleShortVersionString</key>
  <string>17.4.1</string>
  <key>softwareVersionBundleId</key>
  <string>com.apple.mobilesafari</string>
  <key>genre</key>
  <string>Productivity</string>
</dict>
</plist>`,
        },
      ],
    },
  },
  {
    id: 'app-2',
    bundleId: 'org.telegram.messenger',
    name: 'Telegram Messenger',
    version: '10.8.2',
    developer: 'Telegram FZ-LLC',
    containerUuid: '3F182901-5231-4CD9-B581-DC92E47A9910',
    containerPath: '/var/mobile/Containers/Data/Application/3F182901-5231-4CD9-B581-DC92E47A9910',
    installedAt: '2024-02-10 18:45:00',
    rootDirectory: {
      id: 'dir-tg-root',
      name: '3F182901-5231-4CD9-B581-DC92E47A9910',
      type: 'directory',
      createdAt: '2024-02-10 18:45:00',
      updatedAt: '2024-03-15 16:00:00',
      permissions: 'rwxr-xr-x',
      children: [
        {
          id: 'dir-tg-docs',
          name: 'Documents',
          type: 'directory',
          createdAt: '2024-02-10 18:45:00',
          updatedAt: '2024-03-15 15:40:00',
          permissions: 'rwxr-xr-x',
          children: [
            {
              id: 'file-tg-user-settings',
              name: 'user_account_sync.json',
              type: 'file',
              size: 1420,
              mimeType: 'application/json',
              createdAt: '2024-02-10 18:50:00',
              updatedAt: '2024-03-15 15:40:00',
              permissions: 'rw-r--r--',
              content: `{
  "userId": 982310481,
  "username": "security_enthusiast",
  "phone": "+1 (555) 019-2834",
  "twoStepVerification": true,
  "passcodeLockEnabled": true,
  "theme": "Night Blue",
  "cloudDataSync": {
    "contacts": true,
    "chats": true,
    "secretChatsCount": 2
  },
  "storageLimitMB": 4096
}`,
            },
            {
              id: 'file-tg-chat-history',
              name: 'tg_local_storage.sqlite',
              type: 'file',
              size: 2621440,
              isBinary: true,
              mimeType: 'application/x-sqlite3',
              createdAt: '2024-02-10 18:45:00',
              updatedAt: '2024-03-15 16:00:00',
              permissions: 'rw-r--r--',
            },
            {
              id: 'file-tg-debug-log',
              name: 'tdlib_mtproto.log',
              type: 'file',
              size: 7850,
              mimeType: 'text/plain',
              createdAt: '2024-03-15 12:00:00',
              updatedAt: '2024-03-15 15:58:00',
              permissions: 'rw-r--r--',
              content: `[2024-03-15 15:50:02.102][TdLib][Info] Connecting to DC 2 (149.154.167.50:443) via MTProto v2.0
[2024-03-15 15:50:02.340][TdLib][Info] Handshake completed with server salt 0x9f82ab11
[2024-03-15 15:50:02.512][TdLib][Info] AuthKey ID: 8819230182410294719 validated
[2024-03-15 15:50:03.010][TdLib][Info] Synced 12 unread messages across 3 channels
[2024-03-15 15:55:00.000][TdLib][Info] Ping-Pong heartbeat acknowledged (latency: 38ms)
[2024-03-15 15:58:00.120][TdLib][Info] Received push notification silent payload`,
            },
          ],
        },
        {
          id: 'dir-tg-lib',
          name: 'Library',
          type: 'directory',
          createdAt: '2024-02-10 18:45:00',
          updatedAt: '2024-03-15 16:00:00',
          permissions: 'rwxr-xr-x',
          children: [
            {
              id: 'dir-tg-prefs',
              name: 'Preferences',
              type: 'directory',
              createdAt: '2024-02-10 18:45:00',
              updatedAt: '2024-03-15 16:00:00',
              permissions: 'rwxr-xr-x',
              children: [
                {
                  id: 'file-tg-prefs',
                  name: 'org.telegram.messenger.plist',
                  type: 'file',
                  size: 2150,
                  mimeType: 'application/x-plist',
                  createdAt: '2024-02-10 18:45:00',
                  updatedAt: '2024-03-15 16:00:00',
                  permissions: 'rw-r--r--',
                  content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>TGAutoDownloadMediaWifi</key>
  <true/>
  <key>TGAutoDownloadMediaCellular</key>
  <false/>
  <key>TGSoundName</key>
  <string>aurora.caf</string>
  <key>TGExperimentalSecretFeatures</key>
  <true/>
</dict>
</plist>`,
                },
              ],
            },
            {
              id: 'dir-tg-caches',
              name: 'Caches',
              type: 'directory',
              createdAt: '2024-02-10 18:45:00',
              updatedAt: '2024-03-15 15:00:00',
              permissions: 'rwxr-xr-x',
              children: [
                {
                  id: 'dir-tg-media',
                  name: 'MediaCache',
                  type: 'directory',
                  createdAt: '2024-02-10 18:55:00',
                  updatedAt: '2024-03-15 14:00:00',
                  permissions: 'rwxr-xr-x',
                  children: [
                    {
                      id: 'file-tg-media-1',
                      name: 'avatar_user_102.jpg',
                      type: 'file',
                      size: 45200,
                      isBinary: true,
                      mimeType: 'image/jpeg',
                      createdAt: '2024-03-10 11:20:00',
                      updatedAt: '2024-03-10 11:20:00',
                      permissions: 'rw-r--r--',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'app-3',
    bundleId: 'com.spotify.client',
    name: 'Spotify Music',
    version: '8.9.12',
    developer: 'Spotify AB',
    containerUuid: 'A8B2C4D1-E6F7-4892-9843-1A2B3C4D5E6F',
    containerPath: '/var/mobile/Containers/Data/Application/A8B2C4D1-E6F7-4892-9843-1A2B3C4D5E6F',
    installedAt: '2024-01-15 08:30:00',
    rootDirectory: {
      id: 'dir-spotify-root',
      name: 'A8B2C4D1-E6F7-4892-9843-1A2B3C4D5E6F',
      type: 'directory',
      createdAt: '2024-01-15 08:30:00',
      updatedAt: '2024-03-14 20:10:00',
      permissions: 'rwxr-xr-x',
      children: [
        {
          id: 'dir-spotify-docs',
          name: 'Documents',
          type: 'directory',
          createdAt: '2024-01-15 08:30:00',
          updatedAt: '2024-03-14 20:10:00',
          permissions: 'rwxr-xr-x',
          children: [
            {
              id: 'file-spotify-playlists',
              name: 'offline_queue.json',
              type: 'file',
              size: 2048,
              mimeType: 'application/json',
              createdAt: '2024-03-10 19:00:00',
              updatedAt: '2024-03-14 20:10:00',
              permissions: 'rw-r--r--',
              content: `{
  "currentPlaying": {
    "trackId": "spotify:track:4cOdK2wGLETKBW3PvgPWqT",
    "trackName": "Never Gonna Give You Up",
    "artist": "Rick Astley",
    "album": "Whenever You Need Somebody",
    "durationMs": 213573,
    "quality": "VERY_HIGH"
  },
  "repeatMode": "OFF",
  "shuffle": true,
  "volumeLevel": 0.85
}`,
            },
          ],
        },
        {
          id: 'dir-spotify-lib',
          name: 'Library',
          type: 'directory',
          createdAt: '2024-01-15 08:30:00',
          updatedAt: '2024-03-14 20:10:00',
          permissions: 'rwxr-xr-x',
          children: [
            {
              id: 'dir-spotify-prefs',
              name: 'Preferences',
              type: 'directory',
              createdAt: '2024-01-15 08:30:00',
              updatedAt: '2024-03-14 20:10:00',
              permissions: 'rwxr-xr-x',
              children: [
                {
                  id: 'file-spotify-plist',
                  name: 'com.spotify.client.plist',
                  type: 'file',
                  size: 1890,
                  mimeType: 'application/x-plist',
                  createdAt: '2024-01-15 08:30:00',
                  updatedAt: '2024-03-14 20:10:00',
                  permissions: 'rw-r--r--',
                  content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>SPStreamAudioQuality</key>
  <integer>3</integer>
  <key>SPCrossfadeDuration</key>
  <integer>5</integer>
  <key>SPOfflineMode</key>
  <false/>
</dict>
</plist>`,
                },
              ],
            },
            {
              id: 'dir-spotify-caches',
              name: 'Caches',
              type: 'directory',
              createdAt: '2024-01-15 08:30:00',
              updatedAt: '2024-03-14 20:10:00',
              permissions: 'rwxr-xr-x',
              children: [
                {
                  id: 'file-spotify-storage-db',
                  name: 'storage.db',
                  type: 'file',
                  size: 5242880,
                  isBinary: true,
                  mimeType: 'application/x-sqlite3',
                  createdAt: '2024-01-15 08:35:00',
                  updatedAt: '2024-03-14 20:10:00',
                  permissions: 'rw-r--r--',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'app-4',
    bundleId: 'com.tigisoftware.Filza',
    name: 'Filza File Manager',
    version: '4.0.1-4',
    developer: 'TIGI Software',
    containerUuid: 'C0FFEE11-1234-4567-89AB-CDEF01234567',
    containerPath: '/var/mobile/Containers/Data/Application/C0FFEE11-1234-4567-89AB-CDEF01234567',
    installedAt: '2024-01-01 00:00:00',
    rootDirectory: {
      id: 'dir-filza-root',
      name: 'C0FFEE11-1234-4567-89AB-CDEF01234567',
      type: 'directory',
      createdAt: '2024-01-01 00:00:00',
      updatedAt: '2024-03-15 16:20:00',
      permissions: 'rwxrwxrwx',
      children: [
        {
          id: 'dir-filza-docs',
          name: 'Documents',
          type: 'directory',
          createdAt: '2024-01-01 00:00:00',
          updatedAt: '2024-03-15 16:20:00',
          permissions: 'rwxrwxrwx',
          children: [
            {
              id: 'file-filza-readme',
              name: 'README_UNRESTRICTED.txt',
              type: 'file',
              size: 780,
              mimeType: 'text/plain',
              createdAt: '2024-01-01 00:00:00',
              updatedAt: '2024-03-15 16:20:00',
              permissions: 'rw-rw-rw-',
              content: `=== MiFilza / Filza iOS Sandbox Manager ===
Engine: MCMFilza Unrestricted Filesystem hooked via dlsym.
Status: Active and operational.

Paths exposed:
/var/mobile/Containers/Data/Application/
/var/mobile/Containers/Shared/AppGroup/
/var/mobile/Library/
/private/var/root/

You can:
- Inspect sandbox files, Plists, JSONs, SQLite databases, and Logs.
- Create new test folders and files directly.
- Edit plist and text configuration files in-place.
- Upload any file from your local machine to test sandbox injection.
- Search and filter files in real time.`,
            },
            {
              id: 'file-filza-scripts',
              name: 'post_install_hook.sh',
              type: 'file',
              size: 340,
              mimeType: 'text/x-shellscript',
              createdAt: '2024-01-01 00:00:00',
              updatedAt: '2024-01-01 00:00:00',
              permissions: 'rwxr-xr-x',
              content: `#!/bin/sh
# MobileHouseArrest sandbox bypass helper
echo "[*] Initializing Filza MCM daemon..."
chmod 755 /var/mobile/Containers/Data/Application
echo "[+] Ready for inspection."`,
            },
          ],
        },
        {
          id: 'dir-filza-lib',
          name: 'Library',
          type: 'directory',
          createdAt: '2024-01-01 00:00:00',
          updatedAt: '2024-03-15 16:20:00',
          permissions: 'rwxrwxrwx',
          children: [
            {
              id: 'dir-filza-prefs',
              name: 'Preferences',
              type: 'directory',
              createdAt: '2024-01-01 00:00:00',
              updatedAt: '2024-03-15 16:20:00',
              permissions: 'rwxrwxrwx',
              children: [
                {
                  id: 'file-filza-plist',
                  name: 'com.tigisoftware.Filza.plist',
                  type: 'file',
                  size: 920,
                  mimeType: 'application/x-plist',
                  createdAt: '2024-01-01 00:00:00',
                  updatedAt: '2024-03-15 16:20:00',
                  permissions: 'rw-rw-rw-',
                  content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>ShowHiddenFiles</key>
  <true/>
  <key>Theme</key>
  <string>DarkTerminal</string>
  <key>DefaultEditorFont</key>
  <string>Menlo</string>
  <key>FontSize</key>
  <integer>12</integer>
  <key>UnrestrictedMode</key>
  <true/>
</dict>
</plist>`,
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'app-5',
    bundleId: 'com.apple.Preferences',
    name: 'Settings (Ajustes)',
    version: '1.0.0',
    developer: 'Apple Inc.',
    containerUuid: 'D8392104-5821-4921-9921-ABAB12345678',
    containerPath: '/var/mobile/Containers/Data/Application/D8392104-5821-4921-9921-ABAB12345678',
    installedAt: '2024-01-01 00:00:00',
    rootDirectory: {
      id: 'dir-settings-root',
      name: 'D8392104-5821-4921-9921-ABAB12345678',
      type: 'directory',
      createdAt: '2024-01-01 00:00:00',
      updatedAt: '2024-03-15 10:00:00',
      permissions: 'rwxr-xr-x',
      children: [
        {
          id: 'dir-settings-docs',
          name: 'Documents',
          type: 'directory',
          createdAt: '2024-01-01 00:00:00',
          updatedAt: '2024-03-15 10:00:00',
          permissions: 'rwxr-xr-x',
          children: [
            {
              id: 'file-settings-sysconfig',
              name: 'system_preferences.json',
              type: 'file',
              size: 1040,
              mimeType: 'application/json',
              createdAt: '2024-01-01 00:00:00',
              updatedAt: '2024-03-15 10:00:00',
              permissions: 'rw-r--r--',
              content: `{
  "deviceName": "iPhone de Elvis",
  "iOSVersion": "17.4.1",
  "buildNumber": "21E236",
  "modelIdentifier": "iPhone15,2",
  "batteryHealthPercentage": 98,
  "developerModeEnabled": true,
  "siriEnabled": false
}`,
            },
          ],
        },
      ],
    },
  },
];
