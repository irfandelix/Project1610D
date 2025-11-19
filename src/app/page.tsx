import { getPhotos } from '@/lib/googleDrive';
import Gallery from '@/components/Gallery';

export const revalidate = 60; 

export default async function Home() {
  const photos = await getPhotos();

  return (
    // 1. UBAH MAIN JADI FLEX CONTAINER
    // min-h-screen: Tinggi minimal setinggi layar HP
    // flex flex-col: Susunan ke bawah (Kolom)
    <main className="min-h-screen flex flex-col bg-[#f5f5f4] overflow-x-hidden relative">
      
      {/* --- BAGIAN ATAS (JUDUL) --- */}
      {/* pt-12: Jarak dari atas layar */}
      {/* flex-none: Jangan melebar/menyusut, ukurannya tetap segini */}
      <div className="flex-none pt-12 pb-4 text-center z-10 relative px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-2 font-handwriting drop-shadow-sm">
          Album Angkatan
        </h1>
        <p className="text-stone-500 text-sm md:text-lg font-sans tracking-widest uppercase">
           Klik foto untuk memperbesar
        </p>
      </div>

      {/* --- BAGIAN TENGAH (CAROUSEL) --- */}
      {/* flex-1: Ambil SEMUA sisa ruang kosong yang ada */}
      {/* flex items-center: Posisikan isi (carousel) DI TENGAH secara vertikal */}
      <div className="flex-1 flex items-center justify-center relative z-0 w-full pb-16"> 
        
        {Array.isArray(photos) && photos.length > 0 ? (
          // Bungkus Gallery dengan w-full agar carousel bisa lebar
          <div className="w-full">
            <Gallery photos={photos} />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Memuat kenangan...</p>
          </div>
        )}
        
      </div>

    </main>
  );
}