// Load các script theo đúng thứ tự
function loadScripts() {
    const scripts = [
        'firebase.js',
        'couples.js', 
        'edit-modal.js',
        'dashboard.js'
    ];

    function loadScript(index) {
        if (index >= scripts.length) return;

        const script = document.createElement('script');
        script.src = scripts[index];
        script.onload = () => loadScript(index + 1);
        script.onerror = () => console.error(`Lỗi khi tải script: ${scripts[index]}`);
        document.body.appendChild(script);
    }

    loadScript(0);
}

// Khởi động ứng dụng
document.addEventListener('DOMContentLoaded', loadScripts);