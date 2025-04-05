// Danh sách script cần load theo thứ tự
const APP_SCRIPTS = [
  { id: 'firebase', src: 'firebase.js' },
  { id: 'couples', src: 'couples.js' },
  { id: 'edit-modal', src: 'edit-modal.js' }, 
  { id: 'dashboard', src: 'dashboard.js' }
];

// Hàm load script tuần tự
function loadAppScripts() {
  return new Promise((resolve, reject) => {
    const loadScript = (index) => {
      if (index >= APP_SCRIPTS.length) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = APP_SCRIPTS[index].id;
      script.src = APP_SCRIPTS[index].src;
      script.onload = () => {
        console.log(`Đã tải ${APP_SCRIPTS[index].src}`);
        loadScript(index + 1);
      };
      script.onerror = () => {
        console.error(`Lỗi khi tải ${APP_SCRIPTS[index].src}`);
        reject();
      };
      document.body.appendChild(script);
    };

    loadScript(0);
  });
}

// Khởi động ứng dụng
document.addEventListener('DOMContentLoaded', () => {
  loadAppScripts()
    .then(() => {
      console.log('Tất cả script đã được tải thành công');
      // Khởi tạo ứng dụng ở đây
    })
    .catch(() => {
      console.error('Có lỗi xảy ra khi tải script');
    });
});