import { google } from 'googleapis';

export async function getPhotos() {
  try {
    if (!process.env.GOOGLE_CLIENT_EMAIL) {
      console.error("❌ Error: GOOGLE_CLIENT_EMAIL belum di-setting");
      return [];
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });
    
    const response = await drive.files.list({
      q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
      // PENTING: Kita tambah 'createdTime' untuk cek tanggal upload
      fields: 'files(id, name, description, createdTime, webContentLink, webViewLink, thumbnailLink)', 
      pageSize: 100,
      orderBy: 'createdTime desc' // Urutkan dari yang paling baru
    });

    const files = response.data.files || [];

    // --- LOGIKA TAYANG TANGGAL 7 (TIME LOCK) ---
    
    // 1. Ambil Waktu Sekarang (WIB / Jakarta)
    // Kita pakai trik ini agar server Vercel (yang pakai jam UTC) tetap ikut jam Indo
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    
    const currentMonth = now.getMonth(); // 0 = Januari, 10 = November
    const currentYear = now.getFullYear();
    const currentDate = now.getDate(); // Tanggal hari ini (1-31)

    // 2. Filter Foto
    const visiblePhotos = files.filter(file => {
      const fileDate = new Date(file.createdTime); // Waktu foto diupload
      
      // Konversi waktu foto ke WIB juga biar adil
      const uploadDateWIB = new Date(fileDate.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
      
      const uploadMonth = uploadDateWIB.getMonth();
      const uploadYear = uploadDateWIB.getFullYear();

      // ATURAN:
      // A. Jika foto dari tahun lalu atau bulan lalu -> BOLEH TAYANG
      if (uploadYear < currentYear || (uploadYear === currentYear && uploadMonth < currentMonth)) {
        return true;
      }

      // B. Jika foto diupload BULAN INI
      if (uploadYear === currentYear && uploadMonth === currentMonth) {
        // Cek apakah hari ini sudah tanggal 7 atau belum?
        if (currentDate >= 7) {
          return true; // Sudah tanggal 7 ke atas, TAYANG
        } else {
          return false; // Masih tanggal 1-6, SEMBUNYIKAN (Rahasia)
        }
      }

      // C. Jika foto dari masa depan (error jam) -> Sembunyikan
      return false;
    });

    return visiblePhotos;

  } catch (error) {
    console.error('❌ Gagal mengambil foto:', error.message);
    return [];
  }
}