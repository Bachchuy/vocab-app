!define LEXICON_HOOKS_DIR "${__FILEDIR__}"

!macro LEXICON_CLOSE_APP
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
  ExecWait '"$SYSDIR\WindowsPowerShell\v1.0\powershell.exe" -NoLogo -NoProfile -STA -ExecutionPolicy Bypass -File "$PLUGINSDIR\close-running-lexicon.ps1" -InstallDirectory "$INSTDIR" -ExecutableName "${MAINBINARYNAME}.exe" $R7' $R8

  ${If} $R8 = 1
    ; The user chose Cancel in the close-app confirmation.
    Abort
  ${ElseIf} $R8 != 0
    MessageBox MB_ICONSTOP|MB_OK "Lexicon could not close normally. Close it manually, then run setup again. No process was force-stopped."
    Abort
  ${EndIf}
!macroend

!macro NSIS_HOOK_PREINSTALL
  !insertmacro LEXICON_CLOSE_APP
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  !insertmacro LEXICON_CLOSE_APP
!macroend
