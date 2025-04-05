// Khởi tạo modal quản lý cặp đôi
function initCoupleModal() {
    // Chỉ tạo modal nếu chưa tồn tại
    if (document.getElementById('couple-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'couple-modal';
    modal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg max-w-md w-full modal-content">
            <h3 class="text-lg font-semibold mb-4">Quản lý cặp đôi</h3>
            <div id="couples-list" class="space-y-2 mb-4 max-h-64 overflow-y-auto"></div>
            
            <div class="flex items-center space-x-2 mt-4">
                <input type="text" id="new-couple-name" class="flex-1 p-2 border rounded" placeholder="Tên cặp đôi mới">
                <button id="add-couple" class="px-4 py-2 bg-green-500 text-white rounded">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            
            <div class="flex justify-end space-x-2 mt-6">
                <button id="cancel-couple" class="px-4 py-2 border rounded">Đóng</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Xử lý sự kiện
    document.getElementById('add-couple').addEventListener('click', () => {
        const name = document.getElementById('new-couple-name').value.trim();
        if (name) {
            couplesManager.addCouple(name)
                .then(() => renderCouplesList())
                .catch(error => alert('Lỗi khi thêm cặp đôi: ' + error.message));
            document.getElementById('new-couple-name').value = '';
        }
    });

    // Render danh sách cặp đôi
    function renderCouplesList() {
        const container = document.getElementById('couples-list');
        container.innerHTML = '';
        
        couplesManager.couples.forEach(couple => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-2 border rounded';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = couple.name;
            input.className = 'flex-1 p-1 border rounded mr-2';
            
            const saveBtn = document.createElement('button');
            saveBtn.className = 'px-2 py-1 bg-blue-500 text-white rounded mr-2';
            saveBtn.innerHTML = '<i class="fas fa-save"></i>';
            saveBtn.addEventListener('click', () => {
                const newName = input.value.trim();
                if (newName && newName !== couple.name) {
                    couplesManager.updateCouple(couple.id, newName)
                        .catch(error => alert('Lỗi khi cập nhật: ' + error.message));
                }
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'px-2 py-1 bg-red-500 text-white rounded';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Xóa cặp đôi ${couple.name}?`)) {
                    couplesManager.removeCouple(couple.id)
                        .then(() => renderCouplesList())
                        .catch(error => alert('Lỗi khi xóa: ' + error.message));
                }
            });
            
            div.appendChild(input);
            div.appendChild(saveBtn);
            div.appendChild(deleteBtn);
            container.appendChild(div);
        });
    }

    document.getElementById('edit-couple-names').addEventListener('click', () => {
        document.getElementById('couple-modal').classList.remove('hidden');
        renderCouplesList();
    });

    document.getElementById('cancel-couple').addEventListener('click', () => {
        document.getElementById('couple-modal').classList.add('hidden');
    });

    // Modal thông tin thanh toán
    const paymentModal = document.createElement('div');
    paymentModal.id = 'payment-modal';
    paymentModal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    paymentModal.innerHTML = `
        <div class="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 class="text-lg font-semibold mb-4">Thông tin thanh toán</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-700 mb-1">Số tài khoản ngân hàng</label>
                    <input type="text" id="bank-account" class="w-full p-2 border rounded" placeholder="Số tài khoản, tên ngân hàng">
                </div>
                <div>
                    <label class="block text-gray-700 mb-1">Mã QR (URL ảnh)</label>
                    <input type="text" id="qr-code" class="w-full p-2 border rounded" placeholder="https://example.com/qr-code.png">
                </div>
            </div>
            <div class="flex justify-end space-x-2 mt-6">
                <button id="cancel-payment" class="px-4 py-2 border rounded">Hủy</button>
                <button id="save-payment" class="px-4 py-2 bg-blue-500 text-white rounded">Lưu</button>
            </div>
        </div>
    `;
    document.body.appendChild(paymentModal);

    // Xử lý sự kiện
    document.getElementById('edit-couple-names').addEventListener('click', () => {
        document.getElementById('couple1-input').value = document.getElementById('couple1-name').textContent;
        document.getElementById('couple2-input').value = document.getElementById('couple2-name').textContent;
        document.getElementById('couple-modal').classList.remove('hidden');
    });

    document.getElementById('edit-payment-info').addEventListener('click', () => {
        document.getElementById('payment-modal').classList.remove('hidden');
    });

    // Các sự kiện đóng modal
    document.getElementById('cancel-couple').addEventListener('click', () => {
        document.getElementById('couple-modal').classList.add('hidden');
    });

    document.getElementById('cancel-payment').addEventListener('click', () => {
        document.getElementById('payment-modal').classList.add('hidden');
    });

    // Lưu thông tin
    document.getElementById('save-couple').addEventListener('click', saveCoupleNames);
    document.getElementById('save-payment').addEventListener('click', savePaymentInfo);
}

// Lưu tên cặp đôi
function saveCoupleNames() {
    const couple1 = document.getElementById('couple1-input').value;
    const couple2 = document.getElementById('couple2-input').value;
    
    if (!couple1 || !couple2) {
        alert('Vui lòng nhập đầy đủ tên cho cả hai cặp');
        return;
    }

    document.getElementById('couple1-name').textContent = couple1;
    document.getElementById('couple2-name').textContent = couple2;
    document.getElementById('couple-modal').classList.add('hidden');
    
    // Cập nhật lên Firestore
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).update({
            coupleName: couple1
        });
    }
}

// Lưu thông tin thanh toán
function savePaymentInfo() {
    const bankAccount = document.getElementById('bank-account').value;
    const qrCode = document.getElementById('qr-code').value;
    
    const paymentInfoDiv = document.getElementById('payment-info');
    paymentInfoDiv.innerHTML = '';
    
    if (bankAccount) {
        paymentInfoDiv.innerHTML += `<p><i class="fas fa-university mr-2"></i> ${bankAccount}</p>`;
    }
    
    if (qrCode) {
        paymentInfoDiv.innerHTML += `<div class="mt-2">
            <p class="mb-1"><i class="fas fa-qrcode mr-2"></i> Mã QR:</p>
            <img src="${qrCode}" alt="Mã QR" class="w-32 h-32 object-contain">
        </div>`;
    } else if (!bankAccount) {
        paymentInfoDiv.innerHTML = '<p>Chưa cập nhật thông tin thanh toán</p>';
    }
    
    document.getElementById('payment-modal').classList.add('hidden');
    
    // Lưu vào localStorage
    localStorage.setItem('paymentInfo', JSON.stringify({ bankAccount, qrCode }));
}

// Tải thông tin thanh toán khi trang tải
function loadPaymentInfo() {
    const paymentInfo = JSON.parse(localStorage.getItem('paymentInfo'));
    if (paymentInfo) {
        const paymentInfoDiv = document.getElementById('payment-info');
        paymentInfoDiv.innerHTML = '';
        
        if (paymentInfo.bankAccount) {
            paymentInfoDiv.innerHTML += `<p><i class="fas fa-university mr-2"></i> ${paymentInfo.bankAccount}</p>`;
        }
        
        if (paymentInfo.qrCode) {
            paymentInfoDiv.innerHTML += `<div class="mt-2">
                <p class="mb-1"><i class="fas fa-qrcode mr-2"></i> Mã QR:</p>
                <img src="${paymentInfo.qrCode}" alt="Mã QR" class="w-32 h-32 object-contain">
            </div>`;
        }
    }
}

// Khởi tạo khi DOM tải xong
document.addEventListener('DOMContentLoaded', () => {
    initEditModals();
    loadPaymentInfo();
});