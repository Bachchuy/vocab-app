$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'
$backendEnv = Join-Path $backend '.env'
$prismaClient = Join-Path $backend 'node_modules\.prisma\client\query_engine-windows.dll.node'

if (-not (Test-Path (Join-Path $backend 'node_modules'))) {
    Push-Location $backend
    npm ci
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Backend dependency installation failed.' }
    Pop-Location
}

if (-not (Test-Path $backendEnv)) {
    Copy-Item (Join-Path $backend '.env.example') $backendEnv
}

Push-Location $backend
if (-not (Test-Path $prismaClient)) {
    npm run db:generate
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Prisma client generation failed.' }
}
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Database migration failed.' }
npm run db:seed
if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Vocabulary seed failed.' }
Pop-Location

if (-not (Test-Path (Join-Path $frontend 'node_modules'))) {
    Push-Location $frontend
    npm ci
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Frontend dependency installation failed.' }
    Pop-Location
}

$powershell = Join-Path $PSHOME 'powershell.exe'
Start-Process -FilePath $powershell -WorkingDirectory $backend -ArgumentList '-NoExit', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', 'npm run start:dev'
Start-Process -FilePath $powershell -WorkingDirectory $frontend -ArgumentList '-NoExit', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', 'npm run dev'

Write-Host 'Lexicon V1 is starting.'
Write-Host 'Backend:  http://localhost:3000'
Write-Host 'Frontend: http://localhost:5173'
Write-Host 'Keep the two opened PowerShell windows running while using the app.'
