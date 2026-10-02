#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      get_ai_api_key,
      has_ai_api_key,
      save_ai_api_key,
      delete_ai_api_key,
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      app.handle().plugin(tauri_plugin_sql::Builder::default().build())?;
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while building tauri application");
}

const AI_CREDENTIAL_TARGET: &str = "Lexicon/GeminiAPIKey";

#[tauri::command]
fn get_ai_api_key() -> Result<Option<String>, String> {
  #[cfg(windows)]
  { windows_credentials::read(AI_CREDENTIAL_TARGET) }
  #[cfg(not(windows))]
  { Err("Kho bảo mật cho API key hiện chỉ được hỗ trợ trên Windows.".into()) }
}

#[tauri::command]
fn has_ai_api_key() -> Result<bool, String> {
  #[cfg(windows)]
  { windows_credentials::read(AI_CREDENTIAL_TARGET).map(|key| key.is_some()) }
  #[cfg(not(windows))]
  { Err("Kho bảo mật cho API key hiện chỉ được hỗ trợ trên Windows.".into()) }
}

#[tauri::command]
fn save_ai_api_key(key: String) -> Result<(), String> {
  let key = key.trim();
  if key.is_empty() { return Err("API key không được để trống.".into()); }
  if key.len() > 2048 { return Err("API key dài quá giới hạn cho phép.".into()); }
  #[cfg(windows)]
  { windows_credentials::write(AI_CREDENTIAL_TARGET, key) }
  #[cfg(not(windows))]
  { Err("Kho bảo mật cho API key hiện chỉ được hỗ trợ trên Windows.".into()) }
}

#[tauri::command]
fn delete_ai_api_key() -> Result<(), String> {
  #[cfg(windows)]
  { windows_credentials::delete(AI_CREDENTIAL_TARGET) }
  #[cfg(not(windows))]
  { Err("Kho bảo mật cho API key hiện chỉ được hỗ trợ trên Windows.".into()) }
}

#[cfg(windows)]
mod windows_credentials {
  use std::{ffi::c_void, ptr::null_mut, slice, str};
  use windows_sys::Win32::Security::Credentials::{
    CredDeleteW, CredFree, CredReadW, CredWriteW, CREDENTIALW,
    CRED_PERSIST_LOCAL_MACHINE, CRED_TYPE_GENERIC,
  };

  fn wide(value: &str) -> Vec<u16> {
    value.encode_utf16().chain(std::iter::once(0)).collect()
  }

  pub fn read(target: &str) -> Result<Option<String>, String> {
    let target = wide(target);
    let mut credential = null_mut();
    // CredReadW allocates the returned credential; copy its secret before freeing that allocation.
    let ok = unsafe { CredReadW(target.as_ptr(), CRED_TYPE_GENERIC, 0, &mut credential) };
    if ok == 0 {
      let error = unsafe { windows_sys::Win32::Foundation::GetLastError() };
      return if error == 1168 { Ok(None) } else { Err(format!("Không đọc được API key từ Windows Credential Manager (mã {error}).")) };
    }
    // The pointer is valid until CredFree; convert the borrowed bytes into an owned String first.
    let result = unsafe {
      let entry = &*credential;
      if entry.CredentialBlobSize == 0 {
        Err("API key lưu trong Windows Credential Manager không hợp lệ.".to_string())
      } else {
        let bytes = slice::from_raw_parts(entry.CredentialBlob, entry.CredentialBlobSize as usize);
        str::from_utf8(bytes).map(str::to_owned).map_err(|_| "API key lưu trong Windows Credential Manager không hợp lệ.".to_string())
      }
    };
    unsafe { CredFree(credential as *const c_void); }
    result.map(Some)
  }

  pub fn write(target: &str, secret: &str) -> Result<(), String> {
    let mut target = wide(target);
    let mut secret = secret.as_bytes().to_vec();
    let mut credential = CREDENTIALW::default();
    credential.Type = CRED_TYPE_GENERIC;
    credential.TargetName = target.as_mut_ptr();
    credential.CredentialBlobSize = secret.len() as u32;
    credential.CredentialBlob = secret.as_mut_ptr();
    credential.Persist = CRED_PERSIST_LOCAL_MACHINE;
    // CredWriteW borrows these buffers only for the duration of the call; keep both alive until it returns.
    let ok = unsafe { CredWriteW(&credential, 0) };
    secret.fill(0);
    if ok == 0 { return Err("Không lưu được API key vào Windows Credential Manager.".into()); }
    Ok(())
  }

  pub fn delete(target: &str) -> Result<(), String> {
    let target = wide(target);
    let ok = unsafe { CredDeleteW(target.as_ptr(), CRED_TYPE_GENERIC, 0) };
    if ok != 0 { return Ok(()); }
    let error = unsafe { windows_sys::Win32::Foundation::GetLastError() };
    if error == 1168 { Ok(()) } else { Err("Không xóa được API key khỏi Windows Credential Manager.".into()) }
  }
}
