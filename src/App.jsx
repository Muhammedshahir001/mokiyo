import React, { useState, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AnimatedPromoBanner from './components/AnimatedPromoBanner';
import NewArrivals from './components/NewArrivals';
import WhyMokiyo from './components/WhyMokiyo';
import CapCollection from './components/CapCollection';
import MokiyoProductsShowcase from './components/MokiyoProductsShowcase';
import GlobalBanner from './components/GlobalBanner';
import Footer from './components/Footer';

import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import QuickViewModal from './components/QuickViewModal';
import SearchModal from './components/SearchModal';
import VideoModal from './components/VideoModal';

import { fetchHero, fetchProducts, fetchWhyMokiyo } from './services/api';
import { fallbackProducts, fallbackWhyMokiyo } from './data/mockData';

export default function App() {
  const [heroData, setHeroData] = useState(null);
  const [products, setProducts] = useState(fallbackProducts);
  const [whyMokiyoItems, setWhyMokiyoItems] = useState(fallbackWhyMokiyo);

  // Cart & Wishlist state
  const [cartItems, setCartItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  // Modals & Drawers state
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeQuickView, setActiveQuickView] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  // Load backend data on mount
  useEffect(() => {
    async function loadData() {
      const hero = await fetchHero();
      if (hero) setHeroData(hero);

      const prods = await fetchProducts();
      if (prods && prods.length > 0) setProducts(prods);

      const why = await fetchWhyMokiyo();
      if (why && why.length > 0) setWhyMokiyoItems(why);
    }
    loadData();
  }, []);

  // Cart Handlers
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => (i._id || i.slug) === (product._id || product.slug) && i.selectedSize === product.selectedSize
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (item, qty) => {
    if (qty <= 0) {
      handleRemoveItem(item);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i === item ? { ...i, quantity: qty } : i))
    );
  };

  const handleRemoveItem = (item) => {
    setCartItems((prev) => prev.filter((i) => i !== item));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product) => {
    const id = product._id || product.slug;
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleRemoveFromWishlist = (product) => {
    const id = product._id || product.slug;
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const totalCartCount = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-[#FF4D00] selection:text-white">
      {/* 0. Top Announcement Ticker */}
      <AnnouncementBar />

      {/* 1. Header Navigation Bar (Bluorng Exact Match) */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Animated Promotional Marquee Ribbon (Section 2 from Bluorng Reference) */}
        <AnimatedPromoBanner variant="dark" />

        {/* 4. NEW ARRIVAL Section (4-Column Luxury Apparel Grid) */}
        <NewArrivals
          products={products}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
          onQuickView={(p) => setActiveQuickView(p)}
        />

        {/* 5. WHY MOKIYO Section (Editorial Film Archives) */}
        <WhyMokiyo
          items={whyMokiyoItems}
          onPlayVideo={(video) => setActiveVideo(video)}
        />

        {/* 6. MOKIYO CAP COLLECTION Section (Curated Headwear Capsule) */}
        <CapCollection
          products={products}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
          onQuickView={(p) => setActiveQuickView(p)}
        />

        {/* 7. MOKIYO PRODUCTS Section (Staggered Lookbook Collage) */}
        <MokiyoProductsShowcase
          onQuickView={(p) => setActiveQuickView(p)}
        />

        {/* 8. Global Presence World Banner */}
        <GlobalBanner />
      </main>

      {/* 9. Premium Footer with Pre-Footer Strip, 3D Interactive Bag & Script Logo */}
      <Footer onOpenCart={() => setCartOpen(true)} />

      {/* Interactive Drawers & Modals */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistIds={wishlistIds}
        products={products}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleRemoveFromWishlist}
      />

      <QuickViewModal
        product={activeQuickView}
        isOpen={Boolean(activeQuickView)}
        onClose={() => setActiveQuickView(null)}
        onAddToCart={handleAddToCart}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setActiveQuickView(p)}
      />

      <VideoModal
        videoData={activeVideo}
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
}
