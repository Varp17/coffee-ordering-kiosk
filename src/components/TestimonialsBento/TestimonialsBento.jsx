import React, { useEffect, useRef, useState } from 'react';
import './TestimonialsBento.css';

const TESTIMONIALS_DATA = [
  {
    x: {
      body: 'Meeting se pehle CHILLD leliya. Survived somehow.',
      handle: '@corporatelaunda',
      brand: 'X',
      brandClass: 'social-logo--x',
    },
    reddit: {
      body: 'Made my own drink and honestly... this might ruin normal coffee for me now.',
      handle: '@riyaworksallday',
      brand: 'reddit',
      brandClass: 'social-logo--reddit',
    },
    facebook: {
      body: "Finally a coffee brand that doesn't judge my weird combinations.",
      handle: '@bangalorebuzz',
      brand: 'facebook',
      brandClass: 'social-logo--facebook',
    },
    google: {
      body: 'Tried their cold brew concentrate. It’s smooth, bold, and has zero bitter aftertaste.',
      handle: 'Khushi P.',
      brand: 'Google Maps',
      brandClass: 'social-logo--google',
    }
  },
  {
    x: {
      body: 'Client call at 9, CHILLD at 8:55. Personality restored.',
      handle: '@deadlinebrew',
      brand: 'X',
      brandClass: 'social-logo--x',
    },
    reddit: {
      body: 'I thought concentrate would taste flat. It absolutely did not.',
      handle: '@brewthread',
      brand: 'reddit',
      brandClass: 'social-logo--reddit',
    },
    facebook: {
      body: 'Best option for quick iced lattes. Just add milk and ice, done in 20 seconds.',
      handle: '@coffeelover_ind',
      brand: 'facebook',
      brandClass: 'social-logo--facebook',
    },
    google: {
      body: 'Perfect for busy mornings! Strong punch and saves so much time.',
      handle: 'Rohan Sharma',
      brand: 'Google Maps',
      brandClass: 'social-logo--google',
    }
  },
  {
    x: {
      body: 'Two spoons, milk, ice. Suddenly I am the office coffee person.',
      handle: '@pantryupgrade',
      brand: 'X',
      brandClass: 'social-logo--x',
    },
    reddit: {
      body: 'The build-your-own drink thing is dangerously convenient.',
      handle: '@coldbrewcommittee',
      brand: 'reddit',
      brandClass: 'social-logo--reddit',
    },
    facebook: {
      body: 'No artificial sugars, pure coffee flavour. Loving the Bold variant.',
      handle: '@healthybrewlife',
      brand: 'facebook',
      brandClass: 'social-logo--facebook',
    },
    google: {
      body: 'Super rich texture. Love making cold brew tonics with this.',
      handle: 'Ananya Roy',
      brand: 'Google Maps',
      brandClass: 'social-logo--google',
    }
  }
];

function SocialCard({ review, type, cycle }) {
  return (
    <article key={`${type}-${cycle}`} className={`bento-card bento-social bento-${type}`}>
      <p className="social-body">{review.body}</p>
      <div className="social-footer">
        <span className="social-handle">{review.handle}</span>
        <span className={`social-logo ${review.brandClass}`}>{review.brand}</span>
      </div>
    </article>
  );
}

export default function TestimonialsBento() {
  const videoRef = useRef(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setReviewIndex((current) => (current + 1) % TESTIMONIALS_DATA.length);
    }, 4000); // 4 seconds transition for better readability

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    // Initial sync
    setIsPlaying(!video.paused);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  const handleVideoClick = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch(err => console.log(err));
    } else {
      videoRef.current.pause();
    }
  };

  const currentReviews = TESTIMONIALS_DATA[reviewIndex];

  return (
    <section className="testimonials-bento-section">
      <h2 className="testimonials-bento-heading">What People Are Saying About CHILLD</h2>

      <div className="testimonials-bento-grid">
        <article className="bento-card bento-left-art">
          <img src="/images/image9_366_1172.png" alt="The Garden Collection coffee drinks" />
        </article>

        <article className="bento-card bento-amazon" aria-label="Amazon rating">
          <strong>amazon</strong>
          <span className="bento-amazon__stars">★★★★★</span>
          <span>5.0 based on 128 reviews</span>
        </article>

        <button
          className={`bento-card bento-video ${isPlaying ? 'is-playing' : 'is-paused'}`}
          type="button"
          onClick={handleVideoClick}
          aria-label="Play or pause coffee video"
        >
          <video
            ref={videoRef}
            src="/Videos/coffeeswirl1.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <span className="bento-video__control-btn" aria-hidden="true" />
        </button>

        <SocialCard review={currentReviews.facebook} type="facebook" cycle={reviewIndex} />

        <article className="bento-card bento-ad">
          <img src="/images/image10_366_1172.png" alt="Coffee should look like this. Water should not." />
        </article>

        <SocialCard review={currentReviews.google} type="google" cycle={reviewIndex} />

        <SocialCard review={currentReviews.x} type="twitter" cycle={reviewIndex} />
        <SocialCard review={currentReviews.reddit} type="reddit" cycle={reviewIndex} />
      </div>
    </section>
  );
}
