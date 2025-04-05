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
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded';
    errorDiv.innerHTML = `
        <strong>Lỗi!</strong> ${error.message || 'Không thể tải dữ liệu người dùng'}
        <span class="absolute top-0 right-0 px-2 py-1 cursor-pointer" onclick="this.parentElement.remove()">
            &times;
        </span>
    `;
    document.body.appendChild(errorDiv);
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