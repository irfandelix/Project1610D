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

  // LOGIKA KUNCI SCROLL
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

      {/* 2. POPUP (PORTAL) */}
      {/* Kita tulis JSX-nya LANGSUNG di sini agar animasinya tidak putus */}
      {selectedPhoto && mounted && createPortal(
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: '#000000', // Hitam Solid
            zIndex: 2147483647, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            perspective: '1500px', // Kunci efek 3D
            userSelect: 'none'
          }}
          onClick={handleClose}
        >
          {/* CARD CONTAINER (YANG BERPUTAR) */}
          <div 
            onClick={(e) => {
              e.stopPropagation(); 
              setIsFlipped(!isFlipped);
            }}
            style={{
              position: 'relative',
              maxWidth: '90vw', maxHeight: '85vh',
              transformStyle: 'preserve-3d', // PENTING: Menjaga elemen anak tetap 3D
              
              // ANIMASI TRANSISI (Ini yang bikin mulus)
              transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Efek membal sedikit
              
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              cursor: 'pointer'
            }}
          >
            
            {/* === SISI DEPAN (FOTO) === */}
            <div style={{ 
              backfaceVisibility: 'hidden', // Sembunyikan belakang saat depan tampil
              display: 'block',
              // Trik agar tidak kedip:
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
              
              backfaceVisibility: 'hidden', // Sembunyikan depan saat belakang tampil
              transform: 'rotateY(180deg)', // Balik 180 derajat biar pas muter jadi bener
              
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
        document.body // Render ke Body
      )}
    </>
  );
}