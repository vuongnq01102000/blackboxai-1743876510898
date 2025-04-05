// Hàm định dạng tiền tệ
export function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency',
        currency: 'VND' 
    }).format(amount).replace('₫', 'VNĐ');
}

// Hàm kiểm tra dữ liệu
export function validateData(data) {
    return data && Object.keys(data).length > 0;
}

// Hàm format ngày tháng
export function formatDate(date) {
    return new Date(date).toLocaleDateString('vi-VN');
}