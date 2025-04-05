document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'index.html';
        } else {
            loadCategories();
        }
    });

    // Đặt ngày mặc định là hôm nay
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').value = today;

    // Format số tiền khi nhập
    document.getElementById('expense-amount').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value ? parseInt(value) : 0;
        e.target.value = value.toLocaleString('vi-VN');
    });

    // Tải danh mục từ Firestore
    function loadCategories() {
        const categorySelect = document.getElementById('expense-category');
        
        db.collection('categories').orderBy('name').get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const option = document.createElement('option');
                    option.value = doc.data().name;
                    option.textContent = doc.data().name;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Lỗi khi tải danh mục:", error);
            });
    }

    // Xử lý submit form
    document.getElementById('expense-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const date = document.getElementById('expense-date').value;
        const amount = parseInt(document.getElementById('expense-amount').value.replace(/\D/g, ''));
        const couple = document.getElementById('expense-couple').value;
        const category = document.getElementById('expense-category').value;
        const note = document.getElementById('expense-note').value;
        const timestamp = firebase.firestore.Timestamp.fromDate(new Date(date));

        // Validate dữ liệu
        if (!date || !amount || !category) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        // Lưu vào Firestore
        db.collection('expenses').add({
            date: date,
            amount: amount,
            couple: couple,
            category: category,
            note: note,
            timestamp: timestamp
        })
        .then(() => {
            alert('Đã thêm khoản chi thành công!');
            window.location.href = 'dashboard.html';
        })
        .catch(error => {
            alert('Có lỗi xảy ra: ' + error.message);
            console.error("Lỗi khi thêm khoản chi:", error);
        });
    });
});