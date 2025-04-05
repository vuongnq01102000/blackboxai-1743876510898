import { CouplesManager } from './couples.js';
import { formatCurrency } from './utils.js';

// Khởi tạo và cấu hình
const couplesManager = new CouplesManager();

const moneyFormatter = {
  formatVND: (amount) => formatCurrency(amount)
};

const eventHandlers = {
  setupCoupleManagement: () => {
    document.getElementById('edit-couple-names')?.addEventListener('click', () => {
      const modal = document.getElementById('couple-modal');
      modal?.classList.remove('hidden');
      renderCouplesList();
    });
  }
};

async function loadUserData(userId) {
  try {
    await couplesManager.init(userId);
    updateCoupleNamesUI();
    eventHandlers.setupCoupleManagement();
  } catch (error) {
    console.error('Failed to load user data:', error);
    showErrorToast('Không thể tải dữ liệu người dùng');
  }
}

// Khởi chạy ứng dụng
function initApp() {
  const userId = 'user123'; // Nên thay bằng ID thực từ auth
  loadUserData(userId);
}

document.addEventListener('DOMContentLoaded', initApp);

export default {
  loadUserData,
  formatVND: moneyFormatter.formatVND
};