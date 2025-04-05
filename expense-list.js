document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'index.html';
        } else {
            initPage();
        }
    });

    // Biến lưu trữ dữ liệu
    let expenses = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let totalItems = 0;
    let currentFilter = {
        month: '0',
        year: new Date().getFullYear().toString(),
        couple: 'all'
    };

    // Khởi tạo trang
    function initPage() {
        setupYearDropdown();
        setupEventListeners();
        loadExpenses();
    }

    // Thiết lập dropdown năm
    function setupYearDropdown() {
        const yearSelect = document.getElementById('year-select');
        const currentYear = new Date().getFullYear();
        
        // Thêm các năm từ 2020 đến năm hiện tại + 1
        for (let year = 2020; year <= currentYear + 1; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
        
        // Chọn năm hiện tại
        yearSelect.value = currentYear;
    }

    // Thiết lập event listeners
    function setupEventListeners() {
        // Bộ lọc
        document.getElementById('month-select').addEventListener('change', function() {
            currentFilter.month = this.value;
            currentPage = 1;
            loadExpenses();
        });
        
        document.getElementById('year-select').addEventListener('change', function() {
            currentFilter.year = this.value;
            currentPage = 1;
            loadExpenses();
        });
        
        document.getElementById('couple-select').addEventListener('change', function() {
            currentFilter.couple = this.value;
            currentPage = 1;
            loadExpenses();
        });

        // Phân trang
        document.getElementById('prev-page').addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                loadExpenses();
            }
        });
        
        document.getElementById('next-page').addEventListener('click', function() {
            if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
                currentPage++;
                loadExpenses();
            }
        });
        
        document.getElementById('prev-page-mobile').addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                loadExpenses();
            }
        });
        
        document.getElementById('next-page-mobile').addEventListener('click', function() {
            if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
                currentPage++;
                loadExpenses();
            }
        });

        // Xuất Excel
        document.getElementById('export-btn').addEventListener('click', exportToExcel);
    }

    // Tải dữ liệu chi tiêu từ Firestore
    function loadExpenses() {
        let query = db.collection('expenses').orderBy('timestamp', 'desc');
        
        // Áp dụng bộ lọc tháng/năm
        if (currentFilter.month !== '0') {
            const month = parseInt(currentFilter.month) - 1;
            const year = parseInt(currentFilter.year);
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);
            
            query = query.where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(startDate))
                         .where('timestamp', '<=', firebase.firestore.Timestamp.fromDate(endDate));
        } else if (currentFilter.year !== 'all') {
            const year = parseInt(currentFilter.year);
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);
            
            query = query.where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(startDate))
                         .where('timestamp', '<=', firebase.firestore.Timestamp.fromDate(endDate));
        }
        
        // Áp dụng bộ lọc cặp đôi
        if (currentFilter.couple !== 'all') {
            query = query.where('couple', '==', currentFilter.couple);
        }
        
        // Lấy tổng số items
        query.get().then((querySnapshot) => {
            totalItems = querySnapshot.size;
            updatePaginationInfo();
            
            // Lấy dữ liệu phân trang
            return query.limit(itemsPerPage).offset((currentPage - 1) * itemsPerPage).get();
        }).then((querySnapshot) => {
            expenses = [];
            querySnapshot.forEach((doc) => {
                expenses.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            renderExpenseTable();
            calculateStats();
        }).catch((error) => {
            console.error("Lỗi khi tải chi tiêu:", error);
        });
    }

    // Render bảng chi tiêu
    function renderExpenseTable() {
        const tbody = document.getElementById('expense-table-body');
        tbody.innerHTML = '';
        
        if (expenses.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    Không có dữ liệu chi tiêu
                </td>
            `;
            tbody.appendChild(tr);
            return;
        }
        
        expenses.forEach((expense) => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50';
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${expense.date}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${expense.category}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${expense.couple}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formatCurrency(expense.amount)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${expense.note || '-'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-red-600 hover:text-red-900 delete-btn" data-id="${expense.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Thêm event listener cho nút xóa
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteExpense(id);
            });
        });
    }

    // Tính toán thống kê
    function calculateStats() {
        const statsSection = document.getElementById('stats-section');
        
        if (expenses.length === 0) {
            statsSection.classList.add('hidden');
            return;
        }
        
        statsSection.classList.remove('hidden');
        
        let total = 0;
        let couple1Total = 0;
        let couple2Total = 0;
        
        expenses.forEach(expense => {
            total += expense.amount;
            if (expense.couple === 'Cặp 1') {
                couple1Total += expense.amount;
            } else {
                couple2Total += expense.amount;
            }
        });
        
        document.getElementById('total-amount').textContent = formatCurrency(total);
        document.getElementById('couple1-amount').textContent = formatCurrency(couple1Total);
        document.getElementById('couple2-amount').textContent = formatCurrency(couple2Total);
    }

    // Cập nhật thông tin phân trang
    function updatePaginationInfo() {
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
        
        document.getElementById('pagination-info').innerHTML = `
            Hiển thị <span class="font-medium">${startItem}</span> đến <span class="font-medium">${endItem}</span> của <span class="font-medium">${totalItems}</span> kết quả
        `;
        
        // Cập nhật nút phân trang
        const pageNumbers = document.getElementById('page-numbers');
        pageNumbers.innerHTML = '';
        
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `relative inline-flex items-center px-4 py-2 border text-sm font-medium ${i === currentPage ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                loadExpenses();
            });
            pageNumbers.appendChild(pageBtn);
        }
        
        // Disable/enable nút prev/next
        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = currentPage === totalPages;
        document.getElementById('prev-page-mobile').disabled = currentPage === 1;
        document.getElementById('next-page-mobile').disabled = currentPage === totalPages;
    }

    // Xóa chi tiêu
    function deleteExpense(id) {
        if (confirm('Bạn có chắc chắn muốn xóa khoản chi này?')) {
            db.collection('expenses').doc(id).delete()
                .then(() => {
                    alert('Đã xóa khoản chi thành công!');
                    loadExpenses();
                })
                .catch(error => {
                    alert('Có lỗi xảy ra khi xóa: ' + error.message);
                });
        }
    }

    // Xuất ra Excel
    function exportToExcel() {
        if (expenses.length === 0) {
            alert('Không có dữ liệu để xuất!');
            return;
        }
        
        // Chuẩn bị dữ liệu
        const data = [
            ['Ngày', 'Danh mục', 'Cặp đôi', 'Số tiền (VNĐ)', 'Ghi chú']
        ];
        
        expenses.forEach(expense => {
            data.push([
                expense.date,
                expense.category,
                expense.couple,
                expense.amount,
                expense.note || ''
            ]);
        });
        
        // Tạo workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Chi tiêu");
        
        // Xuất file
        const fileName = `Chi_tieu_${currentFilter.month}_${currentFilter.year}.xlsx`;
        XLSX.writeFile(wb, fileName);
    }

    // Định dạng tiền tệ
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(amount).replace('₫', 'VNĐ');
    }
});