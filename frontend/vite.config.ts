// Import hàm khai báo cấu hình Vite.
import { defineConfig } from 'vite';
// Import plugin giúp Vite biên dịch JSX/TSX của React.
import react from '@vitejs/plugin-react';

// Export cấu hình để Vite sử dụng khi dev và build.
export default defineConfig({
  // Bật hỗ trợ React trong project.
  plugins: [react()],
  // SheetJS được tải riêng khi xuất Excel; đặt ngưỡng phù hợp với chunk này.
  build: {
    chunkSizeWarningLimit: 600,
  },
  // Cấu hình server phát triển chạy ở cổng 5173.
  server: {
    port: 5173,
    // Tauri/Rust creates binaries under this directory; Vite must not watch them.
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
});
