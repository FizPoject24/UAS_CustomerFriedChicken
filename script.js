  // Load saved profile data and initialize UI
  document.addEventListener('DOMContentLoaded', () => {
    const storedName = localStorage.getItem('customerName');
    const storedPhone = localStorage.getItem('customerPhone');
    const storedAddress = localStorage.getItem('customerAddress');
    const storedProfilePicture = localStorage.getItem('profilePicture');

    if (storedName) document.getElementById('customerName').textContent = storedName;
    if (storedPhone) document.getElementById('customerPhone').textContent = storedPhone;
    if (storedAddress) document.getElementById('customerAddress').textContent = storedAddress;
    if (storedProfilePicture) document.getElementById('profilePicture').src = storedProfilePicture;

    updateHistoryTable();
    updateCancelOptions();
    showSection('home');
});

// Switch sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

// Add a new order
function addOrder() {
    const item = document.getElementById('item').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    const paymentMethod = document.getElementById('paymentMethod').value;

    if (item && quantity > 0 && paymentMethod) {
        const prices = { 'Dada': 13000, 'Paha Atas': 13000, 'Paha Bawah': 11000, 'Sayap': 8000 };
        const price = prices[item] * quantity;
        const date = new Date().toLocaleDateString();

        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push({ date, item, quantity, price, paymentMethod });
        localStorage.setItem('orders', JSON.stringify(orders));

        alert('Pesanan berhasil ditambahkan!');
        updateHistoryTable();
        updateCancelOptions();
    } else {
        alert('Silakan lengkapi formulir.');
    }
}

// Update order history table
function updateHistoryTable() {
    const tableBody = document.getElementById('historyTable');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    tableBody.innerHTML = '';

    if (orders.length > 0) {
        orders.forEach(order => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${order.date}</td>
                <td>${order.item}</td>
                <td>${order.quantity}</td>
                <td>Rp${order.price.toLocaleString('id-ID')}</td>
                <td>${order.paymentMethod}</td>`;
        });
    } else {
        const row = tableBody.insertRow();
        row.className = 'empty-row';
        row.innerHTML = `<td colspan="5">Belum ada pesanan.</td>`;
    }
}

// Update cancel order dropdown
function updateCancelOptions() {
    const orderSelect = document.getElementById('orderSelect');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orderSelect.innerHTML = '';

    if (orders.length > 0) {
        orders.forEach((order, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${order.date} - ${order.item} (${order.quantity})`;
            orderSelect.appendChild(option);
        });
    } else {
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Tidak ada pesanan untuk dibatalkan';
        orderSelect.appendChild(emptyOption);
    }
}

// Cancel an order
function cancelOrder() {
    const orderIndex = document.getElementById('orderSelect').value;
    const cancelReason = document.getElementById('cancelReason').value.trim();
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (orderIndex && cancelReason) {
        orders.splice(orderIndex, 1);
        localStorage.setItem('orders', JSON.stringify(orders));

        alert('Pesanan berhasil dibatalkan.');
        updateHistoryTable();
        updateCancelOptions();
        showSection('histori');
    } else {
        alert('Silakan pilih pesanan dan isi alasan pembatalan.');
    }
}

// Update customer profile
function updateProfile() {
    const newName = document.getElementById('newName').value.trim();
    const newPhone = document.getElementById('newPhone').value.trim();
    const newAddress = document.getElementById('newAddress').value.trim();

    if (newName) localStorage.setItem('customerName', newName);
    if (newPhone) localStorage.setItem('customerPhone', newPhone);
    if (newAddress) localStorage.setItem('customerAddress', newAddress);

    document.getElementById('customerName').textContent = newName || localStorage.getItem('customerName');
    document.getElementById('customerPhone').textContent = newPhone || localStorage.getItem('customerPhone');
    document.getElementById('customerAddress').textContent = newAddress || localStorage.getItem('customerAddress');

    alert('Profil berhasil diperbarui!');
    cancelEditProfile();
}

// Enable edit profile form
function enableEditProfile() {
    document.getElementById('editForm').style.display = 'block';
}

// Cancel editing profile
function cancelEditProfile() {
    document.getElementById('editForm').style.display = 'none';
}

// Change profile picture
function changeProfilePicture() {
    const uploadPicture = document.getElementById('uploadPicture');
    if (uploadPicture.files.length > 0) {
        const reader = new FileReader();
        reader.onload = () => {
            const imageData = reader.result;
            document.getElementById('profilePicture').src = imageData;
            localStorage.setItem('profilePicture', imageData);
        };
        reader.readAsDataURL(uploadPicture.files[0]);
    }
}
