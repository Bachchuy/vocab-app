type SidebarProps = {
  count: number;
  due: number;
  screen: string;
  onLibrary: () => void;
  onStudy: () => void;
  onDashboard: () => void;
  onSettings: () => void;
  onData: () => void;
};

export function Sidebar({
  count,
  due,
  screen,
  onLibrary,
  onStudy,
  onDashboard,
  onSettings,
  onData,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">V</span>Lexicon
      </div>
      <div className="profile">
        <span className="avatar">HA</span>
        <div>
          <b>Từ điển cá nhân</b>
          <small>{count} mục từ đã lưu</small>
        </div>
      </div>
      <nav>
        <p>Học từ vựng</p>
        <button
          className={screen === "dashboard" ? "active" : ""}
          onClick={onDashboard}
        >
          ⌂ Tổng quan
        </button>
        <button
          className={screen === "library" ? "active" : ""}
          onClick={onLibrary}
        >
          ▤ Thư viện từ
        </button>
        <button
          className={screen === "study" ? "active" : ""}
          onClick={onStudy}
        >
          ◉ Ôn tập đến hạn <b>{due}</b>
        </button>
        <p>Cá nhân hóa</p>
        <button
          className={screen === "settings" ? "active" : ""}
          onClick={onSettings}
        >
          ⚙ Cài đặt AI
        </button>
        <p>Dữ liệu</p>
        <button
          className={screen === "data" ? "active" : ""}
          onClick={onData}
        >
          ⇄ Quản lý dữ liệu
        </button>
      </nav>
      <div className="sidebar-footer">
        ✦{" "}
        <span>
          <b>Học theo ngữ cảnh</b>
          <small>Ghi nhớ theo mục tiêu của bạn</small>
        </span>
      </div>
    </aside>
  );
}
