$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'
$backendEnv = Join-Path $backend '.env'

if (-not (Test-Path (Join-Path $backend 'node_modules'))) {
    Push-Location $backend
    npm ci
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Không cài được dependencies của backend.' }
    Pop-Location
}

if (-not (Test-Path $backendEnv)) {
    Copy-Item (Join-Path $backend '.env.example') $backendEnv
}

Push-Location $backend
npm run db:generate
if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Prisma client chưa được tạo.' }
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Database migration thất bại.' }
npm run db:seed
if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Không nạp được dữ liệu từ vựng ban đầu.' }
Pop-Location

if (-not (Test-Path (Join-Path $frontend 'node_modules'))) {
    Push-Location $frontend
    npm ci
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Không cài được dependencies của frontend.' }
    Pop-Location
}

Start-Process powershell.exe -WorkingDirectory $backend -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', 'npm run start:dev'
Start-Process powershell.exe -WorkingDirectory $frontend -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', 'npm run dev'

Write-Host 'Lexicon V1 is starting.'
Write-Host 'Backend:  http://localhost:3000'
Write-Host 'Frontend: http://localhost:5173'
Write-Host 'Keep the two opened PowerShell windows running while using the app.'
