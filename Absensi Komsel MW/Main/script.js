// Inisialisasi variabel global
let counter = attendanceData.length > 0 ? Math.max(...attendanceData.map(item => item.id)) + 1 : 1;
let pendingName = ''; // Untuk menyimpan nama yang akan ditambahkan
let deleteTarget = null; // Untuk menyimpan data yang akan dihapus

// Fungsi untuk menampilkan tanggal saat ini
function updateTanggal() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById('tanggal').textContent = now.toLocaleDateString('id-ID', options);
}

// Fungsi untuk menampilkan hasil pencarian
function showSearchResults(query) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
    
    if (query.length === 0) {
        resultsContainer.style.display = 'none';
        return;
    }
    
    // Filter nama berdasarkan query
    const filteredNames = daftarNama.filter(name => 
        name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Tampilkan hasil pencarian
    if (filteredNames.length > 0) {
        filteredNames.forEach(name => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <span>${name}</span>
                <button class="delete-name-btn" data-name="${name}">×</button>
            `;
            resultItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-name-btn')) {
                    addToAttendance(name);
                    document.getElementById('searchInput').value = '';
                    resultsContainer.style.display = 'none';
                }
            });
            
            // Event listener untuk tombol hapus nama
            const deleteBtn = resultItem.querySelector('.delete-name-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showDeleteNameModal(name);
            });
            
            resultsContainer.appendChild(resultItem);
        });
        resultsContainer.style.display = 'block';
    } else {
        // Jika tidak ada hasil, tampilkan opsi untuk menambahkan nama baru
        const addNewItem = document.createElement('div');
        addNewItem.className = 'search-result-item add-new-item';
        addNewItem.innerHTML = `<strong>Tambah "${query}" ke daftar nama</strong>`;
        addNewItem.addEventListener('click', () => {
            showAddNameModal(query);
        });
        resultsContainer.appendChild(addNewItem);
        resultsContainer.style.display = 'block';
    }
}

// Fungsi untuk menampilkan modal tambah nama baru
function showAddNameModal(prefilledName = '') {
    document.getElementById('newNameInput').value = prefilledName;
    document.getElementById('addNameModal').style.display = 'block';
    document.getElementById('newNameInput').focus();
}

// Fungsi untuk menampilkan modal hapus nama
function showDeleteNameModal(name) {
    pendingName = name;
    document.getElementById('deleteMessage').textContent = `Apakah Anda yakin ingin menghapus nama "${name}" dari daftar?`;
    document.getElementById('deleteModal').style.display = 'block';
}

// Fungsi untuk menampilkan modal hapus data absensi
function showDeleteAttendanceModal(id) {
    const record = attendanceData.find(item => item.id === id);
    if (record) {
        deleteTarget = id;
        document.getElementById('deleteMessage').textContent = `Apakah Anda yakin ingin menghapus absensi ${record.name}?`;
        document.getElementById('deleteModal').style.display = 'block';
    }
}

// Fungsi untuk menambahkan nama ke tabel absensi
function addToAttendance(name) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID');
    const dateString = now.toLocaleDateString('id-ID');
    
    // Buat objek data absensi
    const attendanceRecord = {
        id: counter,
        name: name,
        time: timeString,
        date: dateString,
        timestamp: now.getTime()
    };
    
    // Tambahkan ke array data
    attendanceData.push(attendanceRecord);
    
    // Simpan ke localStorage
    saveAttendanceToStorage();
    
    // Update tabel
    updateAttendanceTable();
    
    // Increment counter
    counter++;
}

// Fungsi untuk menghapus data absensi
function removeFromAttendance(id) {
    const index = attendanceData.findIndex(item => item.id === id);
    if (index > -1) {
        attendanceData.splice(index, 1);
        saveAttendanceToStorage();
        
        // Perbarui nomor urut setelah penghapusan
        updateAttendanceNumbers();
        
        return true;
    }
    return false;
}

// Fungsi untuk memperbarui nomor urut di tabel
function updateAttendanceNumbers() {
    // Update nomor urut berdasarkan urutan dalam array
    attendanceData.forEach((record, index) => {
        record.displayNumber = index + 1;
    });
    
    // Update tampilan tabel
    updateAttendanceTable();
}

// Fungsi untuk menghapus semua data absensi
function clearAllAttendance() {
    if (attendanceData.length > 0) {
        if (confirm('Apakah Anda yakin ingin menghapus semua data absensi?')) {
            attendanceData = [];
            saveAttendanceToStorage();
            updateAttendanceTable();
            counter = 1;
        }
    } else {
        alert('Tidak ada data absensi untuk dihapus.');
    }
}

// Fungsi untuk memperbarui tabel absensi
function updateAttendanceTable() {
    const tableBody = document.getElementById('attendanceBody');
    tableBody.innerHTML = '';
    
    // Tambahkan setiap record ke tabel
    attendanceData.forEach((record, index) => {
        const row = document.createElement('tr');
        row.className = 'new-row'; // Untuk animasi
        
        // Gunakan nomor urut berdasarkan posisi dalam array (bukan ID)
        const cellNo = document.createElement('td');
        cellNo.textContent = index + 1;
        
        const cellName = document.createElement('td');
        cellName.textContent = record.name;
        
        const cellTime = document.createElement('td');
        cellTime.textContent = record.time;
        
        const cellAction = document.createElement('td');
        cellAction.className = 'action-buttons-table';
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Hapus';
        deleteBtn.addEventListener('click', () => {
            showDeleteAttendanceModal(record.id);
        });
        cellAction.appendChild(deleteBtn);
        
        row.appendChild(cellNo);
        row.appendChild(cellName);
        row.appendChild(cellTime);
        row.appendChild(cellAction);
        
        tableBody.appendChild(row);
        
        // Hapus kelas animasi setelah selesai
        setTimeout(() => {
            row.classList.remove('new-row');
        }, 500);
    });
    
    // Update total
    document.getElementById('totalAttendance').textContent = attendanceData.length;
}

// Fungsi untuk menyalin data absensi ke clipboard
function copyAttendanceData() {
    if (attendanceData.length === 0) {
        alert('Tidak ada data absensi untuk disalin.');
        return;
    }
    
    // Format data untuk disalin
    let textToCopy = "DAFTAR ABSENSI KOMSEL MULIA WACANA\n";
    textToCopy += "Tanggal: " + document.getElementById('tanggal').textContent + "\n\n";
    textToCopy += "No.\tNama\t\tWaktu\n";
    
    attendanceData.forEach((record, index) => {
        textToCopy += `${index + 1}\t${record.name}\t${record.time}\n`;
    });
    
    // Salin ke clipboard
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert('Data absensi berhasil disalin ke clipboard!');
        })
        .catch(err => {
            console.error('Gagal menyalin data: ', err);
            alert('Gagal menyalin data. Silakan coba lagi.');
        });
}

// Event listener saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Tampilkan tanggal saat ini
    updateTanggal();
    
    // Event listener untuk input pencarian
    document.getElementById('searchInput').addEventListener('input', function() {
        showSearchResults(this.value);
    });
    
    // Event listener untuk tombol tambah nama baru
    document.getElementById('addNewNameBtn').addEventListener('click', function() {
        showAddNameModal();
    });
    
    // Event listener untuk tombol salin data
    document.getElementById('copyButton').addEventListener('click', copyAttendanceData);
    
    // Event listener untuk tombol hapus semua
    document.getElementById('clearAllBtn').addEventListener('click', clearAllAttendance);
    
    // Event listener untuk modal tambah nama
    document.getElementById('confirmAdd').addEventListener('click', function() {
        const newName = document.getElementById('newNameInput').value.trim();
        if (newName) {
            // Tambahkan nama baru ke daftar
            if (addNewName(newName)) {
                // Tambahkan ke absensi
                addToAttendance(newName);
                // Sembunyikan modal
                document.getElementById('addNameModal').style.display = 'none';
                // Kosongkan input pencarian
                document.getElementById('searchInput').value = '';
                document.getElementById('searchResults').style.display = 'none';
                document.getElementById('newNameInput').value = '';
                
                alert(`Nama "${newName}" berhasil ditambahkan ke daftar!`);
            } else {
                alert('Nama sudah ada dalam daftar atau tidak valid.');
            }
        } else {
            alert('Silakan masukkan nama yang valid.');
        }
    });
    
    // Event listener untuk modal hapus
    document.getElementById('confirmDelete').addEventListener('click', function() {
        if (deleteTarget) {
            // Hapus data absensi
            removeFromAttendance(deleteTarget);
            deleteTarget = null;
        } else if (pendingName) {
            // Hapus nama dari daftar
            if (removeName(pendingName)) {
                alert(`Nama "${pendingName}" berhasil dihapus dari daftar!`);
                // Refresh hasil pencarian
                const currentSearch = document.getElementById('searchInput').value;
                if (currentSearch) {
                    showSearchResults(currentSearch);
                }
            }
            pendingName = '';
        }
        document.getElementById('deleteModal').style.display = 'none';
    });
    
    // Event listener untuk tombol batal
    document.getElementById('cancelAdd').addEventListener('click', function() {
        document.getElementById('addNameModal').style.display = 'none';
        document.getElementById('newNameInput').value = '';
    });
    
    document.getElementById('cancelDelete').addEventListener('click', function() {
        document.getElementById('deleteModal').style.display = 'none';
        deleteTarget = null;
        pendingName = '';
    });
    
    // Event listener untuk tombol close modal
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            document.getElementById('addNameModal').style.display = 'none';
            document.getElementById('deleteModal').style.display = 'none';
            document.getElementById('newNameInput').value = '';
            deleteTarget = null;
            pendingName = '';
        });
    });
    
    // Sembunyikan hasil pencarian saat klik di luar
    document.addEventListener('click', function(e) {
        if (!e.target.matches('#searchInput') && !e.target.matches('.search-result-item') && !e.target.matches('.delete-name-btn')) {
            document.getElementById('searchResults').style.display = 'none';
        }
    });
    
    // Sembunyikan modal saat klik di luar konten modal
    window.addEventListener('click', function(e) {
        if (e.target.matches('#addNameModal')) {
            document.getElementById('addNameModal').style.display = 'none';
            document.getElementById('newNameInput').value = '';
        }
        if (e.target.matches('#deleteModal')) {
            document.getElementById('deleteModal').style.display = 'none';
            deleteTarget = null;
            pendingName = '';
        }
    });
    
    // Muat data absensi yang tersimpan
    updateAttendanceTable();
});