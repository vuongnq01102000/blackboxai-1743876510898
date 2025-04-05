# Ứng dụng Theo dõi Chi tiêu Chung

Ứng dụng giúp các cặp đôi cùng nhà theo dõi chi tiêu hàng tháng và tính toán cân bằng chi tiêu.

## Tính năng chính

- 📝 Thêm, xem, xóa các khoản chi tiêu
- 👥 Quản lý 2 cặp đôi (có thể đổi tên)
- 🗂️ Quản lý danh mục chi tiêu
- 📊 Tự động tính toán:
  - Tổng chi tiêu tháng
  - Chi tiêu từng cặp
  - Số tiền cần bù trừ
- 📤 Xuất dữ liệu ra Excel
- 🔐 Đăng nhập/đăng ký bằng email

## Cài đặt Firebase

1. Tạo project mới trên [Firebase Console](https://console.firebase.google.com/)
2. Thêm ứng dụng web
3. Sao chép cấu hình Firebase và dán vào file `firebase.js`
4. Bật xác thực Email/Password trong Authentication
5. Bật Firestore Database

## Các trang

- `/index.html` - Trang đăng nhập/đăng ký
- `/dashboard.html` - Bảng điều khiển chính
- `/add-expense.html` - Thêm khoản chi mới
- `/expense-list.html` - Danh sách chi tiêu
- `/categories.html` - Quản lý danh mục

## Công nghệ sử dụng

- Firebase Authentication
- Firestore Database
- Tailwind CSS
- SheetJS (xuất Excel)
- Font Awesome icons

## Hướng dẫn triển khai

1. Clone repository
2. Chỉnh sửa file `firebase.js` với cấu hình của bạn
3. Mở file `index.html` trong trình duyệt

## Tác giả

[Your Name]

## Giấy phép

MIT