param(
  [Parameter(Mandatory = $true)]
  [string] $InstallDirectory,
  [switch] $Silent,
  [switch] $Elevated,
  [switch] $Confirmed
)

$ErrorActionPreference = 'Stop'
$logPath = Join-Path $env:TEMP 'Lexicon-installer-close.log'

function Start-ElevatedClose {
  $arguments = '-NoLogo -NoProfile -STA -ExecutionPolicy Bypass -File "' + $PSCommandPath +
    '" -InstallDirectory "' + $InstallDirectory + '" -Elevated -Confirmed'
  if ($Silent) {
    $arguments += ' -Silent'
  }
  $child = Start-Process -FilePath "$env:WINDIR\System32\WindowsPowerShell\v1.0\powershell.exe" -ArgumentList $arguments -Verb RunAs -Wait -PassThru
  exit $child.ExitCode
}

try {
  $installPath = [IO.Path]::GetFullPath($InstallDirectory).TrimEnd('\') + '\'
  Set-Content -LiteralPath $logPath -Value "Install directory: $installPath" -Encoding UTF8

  # Use executable names to find candidate PIDs, then verify each process path
  # before closing it so another program with a generic name is never stopped.
  $executableNames = @(
    Get-ChildItem -LiteralPath $installPath -Filter '*.exe' -File -ErrorAction Stop |
      ForEach-Object { $_.BaseName } |
      Select-Object -Unique
  )
  if ($executableNames.Count -eq 0) {
    throw "No executable files found in install directory: $installPath"
  }

  $candidateProcesses = @(
    Get-Process -Name $executableNames -ErrorAction SilentlyContinue
  )
  $matchingProcesses = @(
    $candidateProcesses | Where-Object {
      try {
        $_.Path -and [IO.Path]::GetFullPath($_.Path).StartsWith(
          $installPath,
          [StringComparison]::OrdinalIgnoreCase
        )
      } catch {
        $false
      }
    }
  )

  Add-Content -LiteralPath $logPath -Value "Candidate process IDs: $(($candidateProcesses.Id) -join ', ')"
  Add-Content -LiteralPath $logPath -Value "Verified install-path process IDs: $(($matchingProcesses.Id) -join ', ')"

  if ($matchingProcesses.Count -eq 0 -and $candidateProcesses.Count -gt 0) {
    if ($Elevated) {
      throw 'A candidate process exists, but Windows did not expose its executable path even when elevated.'
    }
    if (-not $Confirmed -and -not $Silent) {
      Add-Type -AssemblyName System.Windows.Forms
      $choice = [System.Windows.Forms.MessageBox]::Show(
        "Lexicon appears to be running with elevated permissions. Save your work first. Click OK to allow setup to close it, or Cancel to stop setup.",
        'Lexicon Setup',
        [System.Windows.Forms.MessageBoxButtons]::OKCancel,
        [System.Windows.Forms.MessageBoxIcon]::Warning
      )
      if ($choice -ne [System.Windows.Forms.DialogResult]::OK) {
        Add-Content -LiteralPath $logPath -Value 'User cancelled setup before elevation.'
        exit 1
      }
    }
    Add-Content -LiteralPath $logPath -Value 'Requesting elevation to inspect the candidate process path.'
    Start-ElevatedClose
  }

  if ($matchingProcesses.Count -eq 0) {
    Add-Content -LiteralPath $logPath -Value 'No Lexicon process was found in the install directory.'
    exit 0
  }

  if (-not $Silent -and -not $Confirmed) {
    Add-Type -AssemblyName System.Windows.Forms
    $choice = [System.Windows.Forms.MessageBox]::Show(
      "Lexicon is open. Save your work first. Click OK to close it and continue installing, or Cancel to stop setup.",
      'Lexicon Setup',
      [System.Windows.Forms.MessageBoxButtons]::OKCancel,
      [System.Windows.Forms.MessageBoxIcon]::Warning
    )
    if ($choice -ne [System.Windows.Forms.DialogResult]::OK) {
      Add-Content -LiteralPath $logPath -Value 'User cancelled setup.'
      exit 1
    }
  }

  foreach ($process in $matchingProcesses) {
    try {
      $process.Refresh()
      if ($process.HasExited) {
        continue
      }

      Add-Content -LiteralPath $logPath -Value "Closing PID $($process.Id) ($($process.Path))."
      # Give Tauri time to close normally so pending edits and SQLite writes can finish.
      if (-not $process.CloseMainWindow() -or -not $process.WaitForExit(8000)) {
        $process.Refresh()
        if (-not $process.HasExited) {
          Add-Content -LiteralPath $logPath -Value "Force stopping PID $($process.Id)."
          $process.Kill()
          if (-not $process.WaitForExit(5000)) {
            throw "Process $($process.Id) did not exit after the close request."
          }
        }
      }
    } catch {
      $accessDenied = $_.Exception -is [UnauthorizedAccessException] -or
        (($_.Exception.HResult -band 0xffff) -eq 5)
      if ($accessDenied -and -not $Elevated) {
        Add-Content -LiteralPath $logPath -Value "PID $($process.Id) needs elevation; requesting it."
        Start-ElevatedClose
      }
      throw
    }
  }

  Add-Content -LiteralPath $logPath -Value 'All verified Lexicon processes exited.'
  exit 0
} catch {
  try {
    Add-Content -LiteralPath $logPath -Value "ERROR: $($_.Exception.Message)"
  } catch {
  }
  exit 2
}
