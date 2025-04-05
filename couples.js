// Quản lý thông tin cặp đôi
export class CouplesManager {
    constructor() {
        this.couples = [];
        this.currentUser = null;
    }

    // Khởi tạo
    init(userId) {
        this.currentUser = userId;
        return this.loadCouples();
    }

    // Tải danh sách cặp đôi
    loadCouples() {
        return db.collection('couples')
            .where('userId', '==', this.currentUser)
            .orderBy('createdAt')
            .get()
            .then(querySnapshot => {
                this.couples = [];
                querySnapshot.forEach(doc => {
                    this.couples.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                // Nếu chưa có thì tạo mặc định
                if (this.couples.length === 0) {
                    return this.createDefaultCouples();
                }
                return this.couples;
            });
    }

    // Tạo cặp đôi mặc định
    createDefaultCouples() {
        const defaultCouples = [
            { name: 'Cặp 1', userId: this.currentUser, createdAt: new Date() },
            { name: 'Cặp 2', userId: this.currentUser, createdAt: new Date() }
        ];

        const batch = db.batch();
        defaultCouples.forEach(couple => {
            const ref = db.collection('couples').doc();
            batch.set(ref, couple);
            this.couples.push({ id: ref.id, ...couple });
        });

        return batch.commit().then(() => this.couples);
    }

    // Thêm cặp đôi mới
    addCouple(name) {
        return db.collection('couples').add({
            name: name,
            userId: this.currentUser,
            createdAt: new Date()
        }).then(docRef => {
            const newCouple = { id: docRef.id, name, userId: this.currentUser };
            this.couples.push(newCouple);
            return newCouple;
        });
    }

    // Cập nhật tên cặp đôi
    updateCouple(id, newName) {
        return db.collection('couples').doc(id).update({
            name: newName
        }).then(() => {
            const couple = this.couples.find(c => c.id === id);
            if (couple) couple.name = newName;
        });
    }

    // Xóa cặp đôi
    removeCouple(id) {
        return db.collection('couples').doc(id).delete()
            .then(() => {
                this.couples = this.couples.filter(c => c.id !== id);
            });
    }

    // Lấy danh sách tên cặp đôi
    getCoupleNames() {
        return this.couples.map(c => c.name);
    }

    // Lấy thông tin cặp đôi theo ID
    getCoupleById(id) {
        return this.couples.find(c => c.id === id);
    }
}

const couplesManager = new CouplesManager();