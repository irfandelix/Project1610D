"use client"; 

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, EffectCreative } from 'swiper/modules'; 
import Image from 'next/image';
import { useState, useRef } from 'react';

interface PhotoCarouselProps {
  photos: any[];
  onPhotoClick: (photo: any) => void;
}

export default function PhotoCarousel({ photos, onPhotoClick }: PhotoCarouselProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const swiperRef = useRef<any>(null);

  const getThumbnailUrl = (link: string) => {
    if (!link) return "https://via.placeholder.com/400?text=Loading...";
    return link.replace('=s220', '=s1000');
  };

  // Logika Duplikasi (Triple) agar loop mulus
  let displayPhotos = photos;
  if (photos.length > 0 && photos.length < 5) {
    displayPhotos = [...photos, ...photos, ...photos]; 
  }

  return (
    <div className="relative w-full py-10 group"> 
      
      {/* TOMBOL KIRI */}
      {/* <button 
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-4 md:left-10 top-1/2 z-50 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button> */}

      {/* TOMBOL KANAN */}
      {/* <button 
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-4 md:right-10 top-1/2 z-50 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button> */}

      <Swiper
        onBeforeInit={(swiper) => { swiperRef.current = swiper; }}
        modules={[Pagination, Navigation, EffectCreative]}
        effect={'creative'}
        slidesPerView={'auto'} 
        centeredSlides={true}
        loop={true} 
        spaceBetween={0}
        creativeEffect={{
          limitProgress: 4, 
          prev: { translate: ['-125%', 0, -300], scale: 0.8, opacity: 0.6 },
          next: { translate: ['125%', 0, -300], scale: 0.8, opacity: 0.6 },
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={false} 
        
        className="mySwiper h-[650px] !pb-12 pt-14 flex items-center no-scrollbar"
      >
        {displayPhotos.map((photo, index) => (
          <SwiperSlide key={`${photo.id}-slide-${index}`} className="!w-auto flex items-center justify-center px-4 mt-4">
            <div 
              // --- PERBAIKAN 1: Hapus semua border dari sini ---
              // Ganti 'p-4' jadi 'p-0' jika kamu tidak ingin padding di sini
              className="relative w-[300px] md:w-[420px] bg-white p-0 pb-14 shadow-2xl cursor-pointer transition-all duration-500 hover:z-20 hover:scale-[1.02]"
              onClick={() => onPhotoClick(photo)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Container Gambar */}
              <div 
                // --- PERBAIKAN 2: Pastikan tidak ada border di sini ---
                className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50" 
              >
                <Image 
                  src={getThumbnailUrl(photo.thumbnailLink)}
                  alt="Foto Kenangan"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-6 text-center">
                <p className="font-handwriting text-3xl font-bold text-gray-800">
                  #{ (index % photos.length) + 1 }
                </p>
                <p className="text-sm text-gray-400 mt-2 font-sans tracking-wide uppercase">
                   {hoveredIndex === index ? "Buka Foto" : "Angkatan 202X"}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        ::-webkit-scrollbar { width: 0px; height: 0px; background: transparent; }
        .swiper-button-prev, .swiper-button-next, .swiper-scrollbar { display: none !important; }
        .swiper-slide { cursor: grab; }
        .swiper-slide:active { cursor: grabbing; }

        /* --- PERBAIKAN 3: Override semua border di elemen Swiper Slide --- */
        .swiper-slide-active .relative,
        .swiper-slide-next .relative,
        .swiper-slide-prev .relative {
          border: none !important;
          box-shadow: none !important; /* Hapus juga bayangannya jika ada di sini */
        }
      `}</style>
    </div>
  );
}