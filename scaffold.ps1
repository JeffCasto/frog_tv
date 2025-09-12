param(
  [string]$Root = "."
)

# --- helper
function Ensure-Dir($p) {
  $full = Join-Path $Root $p
  if (-not (Test-Path $full)) { New-Item -ItemType Directory -Path $full | Out-Null }
}

function Ensure-File($relPath, $content = "") {
  $full = Join-Path $Root $relPath
  $dir  = Split-Path $full
  Ensure-Dir $dir
  if (-not (Test-Path $full)) { Set-Content -Path $full -Value $content -Encoding UTF8 }
}

# --- directories
$dirs = @(
  "app",
  "assets",
  "assets/images",
  "components",
  "constants",
  "providers",
  "types"
)
$dirs | ForEach-Object { Ensure-Dir $_ }

# --- file contents (simple placeholders)
$reactTSX = @'
import React from "react";

export default function Component() {
  return (<div>TODO: Component</div>);
}
'@

$tsModule = @'
// TODO: module contents
export {};
'@

$gitignore = @'
# Node / Bun / TypeScript
node_modules/
dist/
.out/
.next/
.cache/
bun.lockb
*.log
.DS_Store
.env
.env.*
'@

$appJson = @'
{
  "name": "app",
  "private": true
}
'@

$packageJson = @'
{
  "name": "app",
  "version": "0.0.0",
  "private": true
}
'@

# --- files to create
Ensure-File "app/_layout.tsx" $reactTSX
Ensure-File "app/+not-found.tsx" $reactTSX
Ensure-File "app/achievements.tsx" $reactTSX
Ensure-File "app/index.tsx" $reactTSX

Ensure-File "components/ChatOverlay.tsx" $reactTSX
Ensure-File "components/Fly.tsx" $reactTSX
Ensure-File "components/Frog.tsx" $reactTSX
Ensure-File "components/TV.tsx" $reactTSX

Ensure-File "constants/achievements.ts" $tsModule
Ensure-File "constants/colors.ts" $tsModule
Ensure-File "constants/roomStyles.ts" $tsModule
Ensure-File "constants/tvChannels.ts" $tsModule

Ensure-File "providers/AchievementProvider.tsx" $reactTSX
Ensure-File "providers/ChatProvider.tsx" $reactTSX
Ensure-File "providers/FrogTerrariumProvider.tsx" $reactTSX

Ensure-File "types/chat.ts" $tsModule
Ensure-File "types/terrarium.ts" $tsModule

Ensure-File ".gitignore" $gitignore
Ensure-File "app.json"  $appJson
Ensure-File "bun.lock"  ""         # placeholder; Bun creates its own lockb normally
Ensure-File "package.json" $packageJson

Write-Host "Scaffold complete at $(Resolve-Path $Root)"
