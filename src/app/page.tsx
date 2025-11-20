import { getPhotos } from '@/lib/googleDrive';
import Gallery from '@/components/Gallery';
import Countdown from '@/components/Countdown'; 

export const revalidate = 60; 

export default async function Home() {
  const targetIsoString = "2026-01-07T00:00:00+07:00"; 
  const startIsoString = "2025-11-07T00:00:00+07:00"; 
  
  const targetDate = new Date(targetIsoString);
  const startDate = new Date(startIsoString);
  const now = new Date();
  
  const isLocked = now < targetDate;

  const totalDuration = targetDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  
  let percentage = 0;
  if (totalDuration > 0) {
    percentage = (elapsed / totalDuration) * 100;
  }
  
  if (percentage > 100) percentage = 100;
  if (percentage < 0) percentage = 0;
  
  const percentString = percentage.toFixed(0);

  // --- TAMPILAN TERKUNCI ---
  if (isLocked) {
    return (
      <main 
        className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden relative px-4"
        style={{ backgroundColor: '#000000', color: '#ffffff' }}
      >
        <div className="flex flex-col items-center w-full z-10">
          <h1 className="text-3xl md:text-4xl font-sans font-bold mb-8 tracking-widest flex justify-center items-center" style={{ color: 'white' }}>
            LOADING
            <span className="animate-dots inline-block w-16 text-left"></span>
          </h1>

          <div style={{ width: '320px', margin: '0 auto' }}>
            <div style={{
              width: '100%',
              height: '20px',
              backgroundColor: '#ffffff', 
              borderRadius: '20px',
              padding: '2px',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                width: `${percentage}%`,
                height: '100%',
                backgroundColor: '#00e676', 
                borderRadius: '20px',
                transition: 'width 1s ease-out'
              }}>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '20px', fontWeight: 'bold', fontFamily: 'monospace', color: 'white' }}>
              {percentString}%
            </p>
          </div>
        </div>
        <div className="h-16"></div>
        <div className="z-0 scale-75 md:scale-90 opacity-100 transition-transform">
           <Countdown targetDate={targetIsoString} />
        </div>
        <style>{`
          .animate-dots::after { content: ''; animation: dots 1.5s steps(4, end) infinite; }
          @keyframes dots { 0% { content: ''; } 25% { content: '.'; } 50% { content: '..'; } 75% { content: '...'; } }
        `}</style>
      </main>
    );
  }

  // --- TAMPILAN TERBUKA (ALBUM) - MODUL DARK MODE ---
  const photos = await getPhotos();

  return (
    // UBAH DISINI: bg-black (Hitam)
    <main className="min-h-screen flex flex-col bg-black overflow-x-hidden relative">
      
      <div className="flex-none pt-12 pb-4 text-center z-10 relative px-4">
        {/* UBAH DISINI: text-white (Putih) */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 font-handwriting drop-shadow-lg">
          Album Angkatan
        </h1>
        {/* UBAH DISINI: text-neutral-400 (Abu Terang) */}
        <p className="text-neutral-400 text-sm md:text-lg font-sans tracking-widest uppercase">
           Klik foto untuk memperbesar
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-0 w-full pb-16"> 
        {Array.isArray(photos) && photos.length > 0 ? (
          <div className="w-full">
            <Gallery photos={photos} />
          </div>
        ) : (
          <div className="text-center text-gray-400">
            {/* UBAH DISINI: border-white untuk spinner */}
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Memuat kenangan...</p>
          </div>
        )}
      </div>
    </main>
  );
}