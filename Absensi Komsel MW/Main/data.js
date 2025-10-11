// Daftar nama untuk pencarian - akan disimpan ke localStorage jika tersedia
let daftarNama = [];

// Data absensi - akan disimpan ke localStorage
let attendanceData = [];

// Fungsi untuk memuat data nama dari localStorage
function loadNamesFromStorage() {
    const savedNames = localStorage.getItem('daftarNamaAbsensiKomsel');
    if (savedNames) {
        daftarNama = JSON.parse(savedNames);
    } else {
        // Data default jika tidak ada data di localStorage
        daftarNama = [
            // Kelas 7 TCI
            "Chello (7)",
            "Checyl (7)",
            "Keyla (7)",
            "Ester (7)",
            "Rafaela (7)",
            'Diana (7)',
            "Karunia (7)",
            'Monang (7)',
            'Refaldi (7)',
            'Regen (7)',
            // Kelas 7 BE
            "Joel (7)",
            "Jhonatan (7)",
            "Panessa (7)",
            "Gaby (7)",
            "Lidya (7)",
            "Aristo (7)",
            "Gilbert (7)",
            "Martha (7)",
            // Kelas 8 TCI
            'Imanuel (8)',
            'Christin (8)',
            'Daniel (8)',
            'Evelyn (8)',
            'Gavin (8)',
            'Glory (8)',
            'Kevin (8)',
            'Marvel (8)',
            'Nadya (8)',
            'Pierre (8)',
            'Rachell (8)',
            'Samuel (8)',
            'Satria (8)',
            'Travis (8)',
            'Yusup (8)', 
            // Kelas 8 BE
            "Galih (8)",
            "Fitri (8)",
            // Kelas 9 TCI
            "Angel (9)",
            'Jillian (9)',
            "Finnen (9)",
            "Edrick (9)",
            "Septian (9)",
            "Saihotma (9)",
            "Juan (9)", 
            "Orlando (9)",
            "Levi (9)",
            "Tiara (9)",
            "Renata (9)",
            "Yacob (9)",
            "Oliv (9)",
            "Ronald (9)",
            "Mutiara (9)",
            "Michell (9)",
            "Nauval (9)",
            "Jeremi (9)",
            // Kelas 9 BE
            "Putri (8)",
            "Putra (8)",
            "Yobella (8)",
            "Robi (8)",
            "Roy (8)",
            "Giovanni (8)",
            "Injilio (8)",
            "Anggiat (8)",
            "Zion (8)",
            "Gracia (8)",
            "Ramdani (8)",
            "Medicinta (8)",
            "Carissa (8)",
            "Gerald (8)",
            "Giat (8)",
            "Keysha (8)",
            "Anya (8)",
            // Kelas 6 TCI
            "Jocelyn (6)",
            "Junior (6)",
            "Michelle (6)",
            "Glen (6)",
            "Beis (6)",
            "Cinta (6)",
            "Sesil (6)",
            "Januar (6)",
            "Gracela (6)","Sandi (6)",
            // Kelas 6 BE
            "Eguel (6)",
            "Timothy (6)",
            "Agita (6)",
            "Gilbert (6)",
            "Beryl (6)",
            "Helena (6)"
        ]
        // Simpan data default ke localStorage
        saveNamesToStorage();
    }
}

// Fungsi untuk menyimpan data nama ke localStorage
function saveNamesToStorage() {
    localStorage.setItem('daftarNamaAbsensi', JSON.stringify(daftarNama));
}

// Fungsi untuk memuat data absensi dari localStorage
function loadAttendanceFromStorage() {
    const savedAttendance = localStorage.getItem('dataAbsensi');
    if (savedAttendance) {
        attendanceData = JSON.parse(savedAttendance);
    }
}

// Fungsi untuk menyimpan data absensi ke localStorage
function saveAttendanceToStorage() {
    localStorage.setItem('dataAbsensi', JSON.stringify(attendanceData));
}

// Fungsi untuk menambahkan nama baru ke daftar
function addNewName(name) {
    if (name && name.trim() !== '' && !daftarNama.includes(name.trim())) {
        daftarNama.push(name.trim());
        // Urutkan daftar nama
        daftarNama.sort();
        // Simpan ke localStorage
        saveNamesToStorage();
        return true;
    }
    return false;
}

// Fungsi untuk menghapus nama dari daftar
function removeName(name) {
    const index = daftarNama.indexOf(name);
    if (index > -1) {
        daftarNama.splice(index, 1);
        saveNamesToStorage();
        return true;
    }
    return false;
}

// Muat data saat file dijalankan
loadNamesFromStorage();
loadAttendanceFromStorage();