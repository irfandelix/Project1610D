"use client"; 

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import PhotoCarousel from './PhotoCarousel'; 

export default function Gallery({ photos }: { photos: any[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPhoto]);

  const handleOpenPhoto = (photo: any) => {
    setSelectedPhoto(photo);
    setIsFlipped(false); 
  };

  const handleClose = () => {
    setSelectedPhoto(null);
    setIsFlipped(false);
  };

  const getHighResUrl = (link: string) => {
    if (!link) return "https://via.placeholder.com/1000?text=Loading...";
    return link.replace('=s220', '=s3000');
  };

  return (
    <>
      {/* 1. CAROUSEL UTAMA */}
      <PhotoCarousel photos={photos} onPhotoClick={handleOpenPhoto} />

      {/* --- TANDA PETUNJUK SWIPE (FIX UKURAN KECIL) --- */}
      <div className="flex justify-center items-center gap-3 -mt-2 mb-10 pointer-events-none select-none opacity-70">
         
         {/* Panah Kiri */}
         {/* Saya kunci pakai style width/height 20px biar gak meledak gede */}
         <svg 
           xmlns="http://www.w3.org/2000/svg" 
           fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
           style={{ width: '20px', height: '20px' }}
           className="text-neutral-400 animate-[bounce-x-left_1s_infinite]"
         >
           <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
         </svg>

         {/* Teks Tengah */}
         <span className="text-[10px] font-sans tracking-[0.2em] text-neutral-500 uppercase">
           Geser / Swipe
         </span>

         {/* Panah Kanan */}
         <svg 
           xmlns="http://www.w3.org/2000/svg" 
           fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
           style={{ width: '20px', height: '20px' }}
           className="text-neutral-400 animate-[bounce-x-right_1s_infinite]"
         >
           <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
         </svg>

      </div>

      <style jsx global>{`
        @keyframes bounce-x-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-5px); } /* Gerak dikit aja */
        }
        @keyframes bounce-x-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); } /* Gerak dikit aja */
        }
        .animate-\[bounce-x-left_1s_infinite\] {
          animation: bounce-x-left 1s infinite;
        }
        .animate-\[bounce-x-right_1s_infinite\] {
          animation: bounce-x-right 1s infinite;
        }
      `}</style>


      {/* 2. POPUP (PORTAL) */}
      {selectedPhoto && mounted && createPortal(
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: '#000000', 
            zIndex: 2147483647, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            perspective: '1500px', 
            userSelect: 'none'
          }}
          onClick={handleClose}
        >
          <div 
            onClick={(e) => {
              e.stopPropagation(); 
              setIsFlipped(!isFlipped);
            }}
            style={{
              position: 'relative',
              maxWidth: '90vw', maxHeight: '85vh',
              transformStyle: 'preserve-3d', 
              transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              cursor: 'pointer'
            }}
          >
            
            {/* === SISI DEPAN (FOTO) === */}
            <div style={{ 
              backfaceVisibility: 'hidden', 
              display: 'block',
              transform: 'rotateY(0deg)' 
            }}>
              <img 
                src={getHighResUrl(selectedPhoto.thumbnailLink)}
                alt="Front"
                referrerPolicy="no-referrer"
                style={{
                  maxHeight: '80vh', maxWidth: '90vw', objectFit: 'contain', display: 'block',
                  border: '8px solid white', borderRadius: '8px', 
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
              />
               <p style={{ position: 'absolute', bottom: '-40px', width: '100%', textAlign: 'center', fontFamily: "'Indie Flower', cursive", color: 'white', opacity: 0.8 }}>
                (Klik gambar untuk membalik)
              </p>
            </div>

            {/* === SISI BELAKANG (PESAN) === */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', 
              backgroundColor: '#fffdf0', padding: '20px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '8px solid white', borderRadius: '8px', overflowY: 'auto'
            }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h3 style={{ fontFamily: "'Indie Flower', cursive", color: '#ef4444', fontSize: 'clamp(20px, 4vw, 32px)', marginBottom: '10px' }}>
                  Rahasia:
                </h3>
                <p style={{ fontFamily: "'Indie Flower', cursive", color: '#333', fontSize: 'clamp(16px, 3vw, 24px)', lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {selectedPhoto.description ? selectedPhoto.description : selectedPhoto.name.replace(/\.[^/.]+$/, "")}
                </p>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                 <span style={{ fontSize: '12px', color: '#999' }}>
                   #{selectedPhoto.id.slice(-4)}
                 </span>
              </div>
            </div>
          </div>
        </div>,
        document.body 
      )}
    </>
  );
}