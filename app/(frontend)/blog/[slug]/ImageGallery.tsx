'use client'

import Image from 'next/image'
import { useState } from 'react'

interface GalleryImage {
  image: { url?: string; alt?: string }
  caption?: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const validImages = images.filter((img) => img.image?.url)

  if (validImages.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {validImages.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-square overflow-hidden rounded-lg group"
          >
            <Image
              src={item.image.url!}
              alt={item.image.alt || `Gallery image ${index + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm truncate">{item.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-zinc-300"
            onClick={() => setSelectedIndex(null)}
          >
            &times;
          </button>

          {/* Previous button */}
          {selectedIndex > 0 && (
            <button
              className="absolute left-4 text-white text-4xl hover:text-zinc-300 p-4"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex(selectedIndex - 1)
              }}
            >
              &larr;
            </button>
          )}

          <div
            className="max-w-4xl max-h-[80vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={validImages[selectedIndex].image.url!}
              alt={validImages[selectedIndex].image.alt || `Gallery image ${selectedIndex + 1}`}
              width={1200}
              height={800}
              className="max-h-[80vh] w-auto object-contain"
            />
            {validImages[selectedIndex].caption && (
              <p className="text-white text-center mt-4">
                {validImages[selectedIndex].caption}
              </p>
            )}
          </div>

          {/* Next button */}
          {selectedIndex < validImages.length - 1 && (
            <button
              className="absolute right-4 text-white text-4xl hover:text-zinc-300 p-4"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex(selectedIndex + 1)
              }}
            >
              &rarr;
            </button>
          )}

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {selectedIndex + 1} / {validImages.length}
          </div>
        </div>
      )}
    </>
  )
}
