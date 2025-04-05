document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị thông báo
    function showAlert(message, isSuccess = false) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
            isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Chuyển đổi giữa form đăng nhập và đăng ký
    document.getElementById('register-link').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
    });

    document.getElementById('login-link').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });

    // Xử lý đăng nhập
    document.getElementById('login-btn').addEventListener('click', function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            showAlert('Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                showAlert('Đăng nhập thành công!', true);
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            })
            .catch(error => {
                let errorMessage = 'Đăng nhập thất bại';
                switch(error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'Email không tồn tại';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Mật khẩu không đúng';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Email không hợp lệ';
                        break;
                }
                showAlert(errorMessage);
            });
    });

    // Xử lý đăng ký
    document.getElementById('register-btn').addEventListener('click', function() {
        const coupleName = document.getElementById('couple-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        
        if (!coupleName || !email || !password) {
            showAlert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (password.length < 6) {
            showAlert('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Lưu tên cặp đôi vào Firestore
                return db.collection('users').doc(userCredential.user.uid).set({
                    coupleName: coupleName,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            })
            .then(() => {
                showAlert('Đăng ký thành công!', true);
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            })
            .catch(error => {
                let errorMessage = 'Đăng ký thất bại';
                switch(error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'Email đã được sử dụng';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Mật khẩu quá yếu';
                        break;
                }
                showAlert(errorMessage);
            });
    });
});