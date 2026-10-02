import { useEffect, useState } from "react";
import {
  deleteAiApiKey,
  getAiApiKey,
  hasAiApiKey,
  saveAiApiKey,
} from "../../ai/aiSettings";
import { testAiKey } from "../../ai/aiService";
import { errorText } from "../errorText";

export function AiSettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [configured, setConfigured] = useState(false);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  useEffect(() => {
    void hasAiApiKey()
      .then(setConfigured)
      .catch((error) => {
        setMessage(errorText(error));
        setMessageType("error");
      });
  }, []);

  const testConnection = async () => {
    setWorking(true);
    setMessage("");
    try {
      const key = apiKey.trim() || (await getAiApiKey());
      if (!key)
        throw new Error("Nhập API key trước, hoặc lưu key để kiểm tra.");
      await testAiKey(key);
      setMessage("Kết nối Gemini thành công.");
      setMessageType("success");
    } catch (error) {
      setMessage(errorText(error));
      setMessageType("error");
    } finally {
      setWorking(false);
    }
  };
  const saveKey = async () => {
    if (!apiKey.trim()) {
      setMessage("Hãy dán API key trước khi lưu.");
      setMessageType("error");
      return;
    }
    setWorking(true);
    setMessage("");
    try {
      await saveAiApiKey(apiKey);
      setApiKey("");
      setConfigured(true);
      setMessage("Đã lưu key trên thiết bị này.");
      setMessageType("success");
    } catch (error) {
      setMessage(errorText(error));
      setMessageType("error");
    } finally {
      setWorking(false);
    }
  };
  const removeKey = async () => {
    setWorking(true);
    setMessage("");
    try {
      await deleteAiApiKey();
      setApiKey("");
      setConfigured(false);
      setMessage("Đã xóa API key khỏi thiết bị.");
      setMessageType("success");
    } catch (error) {
      setMessage(errorText(error));
      setMessageType("error");
    } finally {
      setWorking(false);
    }
  };

  return (
    <section className="page ai-settings-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">AI tùy chọn · dùng key của bạn</p>
          <h1>Cài đặt AI</h1>
          <p className="muted">
            Lexicon gọi Google Gemini trực tiếp trên thiết bị của bạn.
          </p>
        </div>
        <span className={`ai-key-status ${configured ? "configured" : ""}`}>
          {configured ? "● Đã cấu hình" : "○ Chưa cấu hình"}
        </span>
      </div>
      <article className="settings-card">
        <div className="settings-card-heading">
          <span className="settings-icon">✦</span>
          <div>
            <h2>Google Gemini</h2>
            <p>
              Không tải model về máy; chỉ gửi yêu cầu khi bạn chủ động bấm gợi
              ý.
            </p>
          </div>
        </div>
        <label className="api-key-field">
          API key
          <input
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder={
              configured
                ? "Đã lưu key · nhập key mới nếu muốn thay"
                : "Dán API key tại đây"
            }
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </label>
        <div className="settings-actions">
          <button
            className="secondary-button"
            onClick={testConnection}
            disabled={working}
          >
            {working ? "Đang kiểm tra…" : "Kiểm tra kết nối"}
          </button>
          <button
            className="primary"
            onClick={saveKey}
            disabled={working || !apiKey.trim()}
          >
            {working ? "Đang lưu…" : "Lưu API key"}
          </button>
          {configured && (
            <button
              className="danger-button"
              onClick={removeKey}
              disabled={working}
            >
              Xóa key
            </button>
          )}
        </div>
        {message && (
          <p className={`settings-message ${messageType}`} role="status">
            {message}
          </p>
        )}
      </article>
      <article className="settings-card setup-guide">
        <h2>Hướng dẫn bật AI</h2>
        <ol>
          <li>
            <span>
              Mở{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
              >
                Google AI Studio
              </a>{" "}
              và đăng nhập Google.
            </span>
          </li>
          <li>
            <span>
              Tạo API key mới, chỉ cấp quyền cho Gemini API nếu màn hình quản lý
              key có lựa chọn này, rồi sao chép key.
            </span>
          </li>
          <li>
            <span>
              Dán key vào ô phía trên, chọn <b>Lưu API key</b>, sau đó bấm{" "}
              <b>Kiểm tra kết nối</b>.
            </span>
          </li>
          <li>
            <span>
              Quay lại thư viện, nhập một từ và bấm <b>Gợi ý bằng AI</b>. Bạn có
              thể sửa nội dung trước khi lưu.
            </span>
          </li>
        </ol>
        <div className="settings-notes">
          <p>
            <b>Chi phí và hạn mức:</b> Lexicon không thu tiền AI. Gemini 3.1
            Flash-Lite hiện có quota Free Tier theo mức giới hạn của Google; hạn
            mức có thể thay đổi. Xem{" "}
            <a
              href="https://ai.google.dev/gemini-api/docs/pricing"
              target="_blank"
              rel="noreferrer"
            >
              giá và hạn mức hiện tại
            </a>{" "}
            cùng mức sử dụng trong Google AI Studio. Free Tier có thể dùng dữ
            liệu gửi tới Google để cải thiện sản phẩm.
          </p>
          <p>
            <b>Quyền riêng tư:</b> từ, nghĩa hiện có và câu ngữ cảnh được gửi
            trực tiếp tới Google để tạo gợi ý. Tránh gửi thông tin nhạy cảm. Xem{" "}
            <a
              href="https://ai.google.dev/gemini-api/terms"
              target="_blank"
              rel="noreferrer"
            >
              điều khoản Gemini API
            </a>
            .
          </p>
          <p>
            <b>Lưu key:</b> bản Windows lưu trong Windows Credential Manager;
            key không gửi về backend Lexicon. Trên thiết bị của mình, key vẫn có
            thể bị truy xuất khi đang dùng app; hãy thu hồi/tạo key mới nếu nghi
            ngờ bị lộ. Khi xóa key, các chức năng từ điển và ôn tập vẫn dùng
            bình thường.
          </p>
        </div>
      </article>
    </section>
  );
}
