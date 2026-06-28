import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBuilderStore } from '@/store/useBuilderStore';
import '../StepLayout.css';

const CATEGORIES = [
  { id: 'dairy', name: 'Dairy-based', emoji: '🥛' },
  { id: 'oat', name: 'Oat Milk-based', emoji: '🌾' },
  { id: 'coconut', name: 'Coconut Milk-based', emoji: '🥥' },
  { id: 'sugar', name: 'Sugar Syrup-based', emoji: '🍯' },
  { id: 'jaggery', name: 'Jaggery Syrup-based', emoji: '🍬' },
  { id: 'coffee50', name: 'Coffee 50:50', emoji: '☕' },
  { id: 'coffee70', name: 'Coffee 70:30', emoji: '☕' },
];

const ITEMS = [...CATEGORIES, ...CATEGORIES];

export default function Step1Category() {
  const { category, setCategory, goNext } = useBuilderStore();
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const itemWidth = 160;
  const gap = 16;
  const step = itemWidth + gap;
  const totalReal = CATEGORIES.length;

  const scrollTo = useCallback((index, smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      left: index * step,
      behavior: smooth ? 'smooth' : 'auto',
    });
    setCurrentIndex(index);
  }, [step]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const next = currentIndex + 1;
    scrollTo(next);
    if (next >= totalReal * 2 - 1) {
      setTimeout(() => {
        scrollTo(0, false);
        setCurrentIndex(0);
        setIsTransitioning(false);
      }, 400);
    } else {
      setTimeout(() => setIsTransitioning(false), 350);
    }
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const prev = currentIndex - 1;
    if (prev < 0) {
      scrollTo(totalReal * 2 - 1, false);
      setCurrentIndex(totalReal * 2 - 1);
      setTimeout(() => {
        scrollTo(totalReal - 1, false);
        setCurrentIndex(totalReal - 1);
        setIsTransitioning(false);
      }, 50);
    } else {
      scrollTo(prev);
      setTimeout(() => setIsTransitioning(false), 350);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const idx = Math.round(el.scrollLeft / step);
      if (idx !== currentIndex) setCurrentIndex(idx);
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [step, currentIndex]);

  useEffect(() => {
    scrollTo(0, false);
  }, [scrollTo]);

  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">📂</span>
        <h2 className="step-layout__title">Choose Category</h2>
        <p className="step-layout__desc">Select a base category to filter available recipes</p>
      </div>

      <div className="carousel-wrapper">
        <div className="carousel-track" ref={scrollRef}>
          {ITEMS.map((cat, index) => (
            <div
              key={`${cat.id}-${index}`}
              className={`carousel-item category-card ${category === cat.id ? 'selected' : ''}`}
              onClick={() => { setCategory(cat.id); setTimeout(() => goNext(), 300); }}
              style={{ minWidth: itemWidth, maxWidth: itemWidth }}
            >
              <span className="category-emoji">{cat.emoji}</span>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>

        <div className="carousel-arrows">
          <button className="carousel-arrow" onClick={handlePrev} aria-label="Previous">
            <ChevronLeft size={20} />
          </button>
          <button className="carousel-arrow" onClick={handleNext} aria-label="Next">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {category && (
        <div className="step-continue" style={{ marginTop: 16 }}>
          <p>Selected: {CATEGORIES.find(c => c.id === category)?.name}</p>
          <p>Click Coffee in the progress bar to browse drinks</p>
        </div>
      )}
    </div>
  );
}