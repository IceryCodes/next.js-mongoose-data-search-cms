import { ReactElement, useCallback, useEffect, useState } from 'react';

import Link from 'next/link';

import { GooglePhoto } from '@/domains/google';

import { Button } from './buttons/Button';
import Card from './Card';

interface GooglePhotoCarouselProps {
  title: string;
  photos: GooglePhoto[];
}

const GooglePhotoCarousel = ({ title, photos }: GooglePhotoCarouselProps): ReactElement => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Helper function to extract attribution link and name
  const renderAttribution = useCallback((attribution: string): ReactElement => {
    const match = attribution.match(/<a href="(.*?)">(.*?)<\/a>/);
    const url = match?.[1];
    const name = match?.[2];

    return url && name ? (
      <Link href={url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
        {name}
      </Link>
    ) : (
      <></>
    );
  }, []);

  // Update the index every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [photos.length]);

  if (!photos.length) return <></>;

  return (
    <Card>
      <div className="my-4 flex flex-col gap-y-4">
        <h3 className="text-xl font-semibold">Google照片</h3>
        <div className="relative mx-auto w-full">
          {/* Image container */}
          <div className="relative h-[250px] md:h-[550px] rounded-lg overflow-hidden">
            {photos.map((photo, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.photo_reference}
                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=900&photoreference=${photo.photo_reference}&key=${process.env.NEXT_PRIVATE_GOOGLE_API_KEY}`}
                alt={`${photos[currentIndex].html_attributions[0].match(/<a href="(.*?)">(.*?)<\/a>/)?.[2]}提供之${title}照片`}
                className={`w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  position: index === currentIndex ? 'relative' : 'absolute',
                  zIndex: index === currentIndex ? 1 : 0,
                }}
              />
            ))}

            {/* Attribution overlay */}
            <div className="z-10 absolute bottom-0 bg-black bg-opacity-60 w-full py-2 px-4 text-white text-sm">
              由 {renderAttribution(photos[currentIndex].html_attributions[0])} 提供
            </div>
          </div>

          {/* Navigation buttons */}
          <Button
            element={<>&#10094;</>}
            onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length)}
            className="z-10 absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-xl bg-gray-700 bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 focus:outline-none"
            aria-label="Previous Image"
          />
          <Button
            element={<>&#10095;</>}
            onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)}
            className="z-10 absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xl bg-gray-700 bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 focus:outline-none"
            aria-label="Next Image"
          />

          {/* Image indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {photos.map((_, index) => (
              <Button
                key={index}
                element={<></>}
                onClick={() => setCurrentIndex(index)}
                className={`w-5 h-2 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-400'}`}
                aria-label={`Image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GooglePhotoCarousel;
