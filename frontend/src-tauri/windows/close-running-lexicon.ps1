param(
  [Parameter(Mandatory = $true)]
  [string] $InstallDirectory,
  [Parameter(Mandatory = $true)]
  [string] $ExecutableName,
  [switch] $Silent,
  [switch] $Elevated,
  [switch] $Confirmed
)

$ErrorActionPreference = 'Stop'
$logPath = Join-Path $env:TEMP 'Lexicon-installer-close.log'

function Start-ElevatedClose {
  $arguments = '-NoLogo -NoProfile -STA -ExecutionPolicy Bypass -File "' + $PSCommandPath +
    '" -InstallDirectory "' + $InstallDirectory + '" -ExecutableName "' + $ExecutableName + '" -Elevated -Confirmed'
  if ($Silent) {
    $arguments += ' -Silent'
  }
  $child = Start-Process -FilePath "$env:WINDIR\System32\WindowsPowerShell\v1.0\powershell.exe" -ArgumentList $arguments -Verb RunAs -Wait -PassThru
  exit $child.ExitCode
}

try {
  $installPath = [IO.Path]::GetFullPath($InstallDirectory).TrimEnd('\') + '\'
  $executablePath = [IO.Path]::GetFullPath((Join-Path $installPath $ExecutableName))
  Set-Content -LiteralPath $logPath -Value "Install directory: $installPath`r`nExecutable path: $executablePath" -Encoding UTF8

  # A fresh install has no executable to stop. During updates/uninstalls only
  # the exact Lexicon executable is relevant; exclude uninstall.exe and setup.
  if (-not (Test-Path -LiteralPath $executablePath -PathType Leaf)) {
    Add-Content -LiteralPath $logPath -Value 'No existing Lexicon executable was found.'
    exit 0
  }

  $candidateProcesses = @(
    Get-Process -Name ([IO.Path]::GetFileNameWithoutExtension($executablePath)) -ErrorAction SilentlyContinue
  )
  $matchingProcesses = @(
    $candidateProcesses | Where-Object {
      try {
        $_.Path -and [StringComparer]::OrdinalIgnoreCase.Equals([IO.Path]::GetFullPath($_.Path), $executablePath)
      } catch {
        $false
      }
    }
  )
  $unresolvedProcesses = @(
    $candidateProcesses | Where-Object {
      try { -not $_.Path } catch { $true }
    }
  )

  Add-Content -LiteralPath $logPath -Value "Candidate process IDs: $(($candidateProcesses.Id) -join ', ')"
  Add-Content -LiteralPath $logPath -Value "Verified install-path process IDs: $(($matchingProcesses.Id) -join ', ')"
  Add-Content -LiteralPath $logPath -Value "Unresolved process IDs: $(($unresolvedProcesses.Id) -join ', ')"

  if ($matchingProcesses.Count -eq 0 -and $unresolvedProcesses.Count -gt 0) {
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

      Add-Content -LiteralPath $logPath -Value "Requesting normal close for PID $($process.Id) ($($process.Path))."
      if (-not $process.CloseMainWindow()) {
        throw "Process $($process.Id) did not accept a normal close request. Close Lexicon manually and retry."
      }
      if (-not $process.WaitForExit(20000)) {
        throw "Process $($process.Id) did not close within 20 seconds. Close Lexicon manually and retry."
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
