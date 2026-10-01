@echo off
cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start-v1.ps1"
if errorlevel 1 (
  echo.
  echo Lexicon could not start. See the error above.
  pause
)