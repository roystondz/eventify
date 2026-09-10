import React from 'react';
import Hero from '../components/home/Hero';
import EventCategories from '../components/home/EventCategories';
import FeaturedPackages from '../components/home/FeaturedPackages';
import ServicesGrid from '../components/home/ServicesGrid';
import EventCalculator from '../components/home/EventCalculator';
import GalleryShowcase from '../components/home/GalleryShowcase';


export default function HomePage() {
  return (
    <div>
      <Hero />
      <EventCategories />
      <FeaturedPackages limit={3} />
      <ServicesGrid limit={4} />
      <EventCalculator />
      <GalleryShowcase isFullPage={false} />

    </div>
  );
}
