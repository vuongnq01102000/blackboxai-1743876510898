document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'index.html';
        } else {
            loadCategories();
        }
    });

    // Xử lý form thêm danh mục
    document.getElementById('category-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('category-name').value.trim();
        if (!name) {
            alert('Vui lòng nhập tên danh mục!');
            return;
        }

        // Kiểm tra trùng tên
        const existingCategories = Array.from(document.querySelectorAll('#category-table-body tr'))
            .map(tr => tr.querySelector('td:first-child').textContent.toLowerCase());
        
        if (existingCategories.includes(name.toLowerCase())) {
            alert('Danh mục này đã tồn tại!');
            return;
        }

        // Thêm vào Firestore
        db.collection('categories').add({
            name: name,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            document.getElementById('category-name').value = '';
            loadCategories();
        })
        .catch(error => {
            alert('Có lỗi xảy ra: ' + error.message);
        });
    });

    // Tải danh sách danh mục
    function loadCategories() {
        db.collection('categories')
            .orderBy('createdAt', 'desc')
            .get()
            .then(querySnapshot => {
                const tbody = document.getElementById('category-table-body');
                tbody.innerHTML = '';
                
                if (querySnapshot.empty) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="2" class="px-6 py-4 text-center text-gray-500">
                                Chưa có danh mục nào
                            </td>
                        </tr>
                    `;
                    return;
                }
                
                querySnapshot.forEach(doc => {
                    const tr = document.createElement('tr');
                    tr.className = 'hover:bg-gray-50';
                    tr.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${doc.data().name}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button class="text-red-600 hover:text-red-900 delete-btn" data-id="${doc.id}">
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
                        deleteCategory(id);
                    });
                });
            })
            .catch(error => {
                console.error("Lỗi khi tải danh mục:", error);
            });
    }

    // Xóa danh mục
    function deleteCategory(id) {
        if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            db.collection('categories').doc(id).delete()
                .then(() => {
                    loadCategories();
                })
                .catch(error => {
                    alert('Có lỗi xảy ra khi xóa: ' + error.message);
                });
        }
    }
});