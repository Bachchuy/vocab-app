!define LEXICON_HOOKS_DIR "${__FILEDIR__}"

!macro NSIS_HOOK_PREINSTALL
  ; Close processes running from this install folder, then let Tauri's built-in
  ; Restart Manager check confirm they have exited before replacing files.
  SetOutPath "$PLUGINSDIR"
  File /oname=close-running-lexicon.ps1 "${LEXICON_HOOKS_DIR}\close-running-lexicon.ps1"
  SetOutPath "$INSTDIR"

  StrCpy $R7 ""
  IfSilent lexicon_silent_close 0
  ${If} $PassiveMode = 1
    StrCpy $R7 "-Silent"
  ${EndIf}
  Goto lexicon_run_close_script

  lexicon_silent_close:
    StrCpy $R7 "-Silent"
  lexicon_run_close_script:
  ExecWait '"$SYSDIR\WindowsPowerShell\v1.0\powershell.exe" -NoLogo -NoProfile -STA -ExecutionPolicy Bypass -File "$PLUGINSDIR\close-running-lexicon.ps1" -InstallDirectory "$INSTDIR" $R7' $R8

  ${If} $R8 = 1
    ; The user chose Cancel in the close-app confirmation.
    Abort
  ${ElseIf} $R8 != 0
    MessageBox MB_ICONSTOP|MB_OK "Windows could not close Lexicon. Save your work, close Lexicon manually, and run setup again."
    Abort
  ${EndIf}
!macroend
