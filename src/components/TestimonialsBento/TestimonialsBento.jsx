import React, { useEffect, useRef, useState } from 'react';
import './TestimonialsBento.css';

const REVIEW_PAIRS = [
  [
    {
      body: 'Meeting se pehle CHILLD leliya. Survived somehow.',
      handle: '@corporatelaunda',
      brand: 'X',
      brandClass: 'social-logo--x',
    },
    {
      body: 'Made my own drink and honestly... this might ruin normal coffee for me now.',
      handle: '@riyaworksallday',
      brand: 'reddit',
      brandClass: 'social-logo--reddit',
    },
  ],
  [
    {
      body: 'Client call at 9, CHILLD at 8:55. Personality restored.',
      handle: '@deadlinebrew',
      brand: 'X',
      brandClass: 'social-logo--x',
    },
    {
      body: 'I thought concentrate would taste flat. It absolutely did not.',
      handle: '@brewthread',
      brand: 'reddit',
      brandClass: 'social-logo--reddit',
    },
  ],
  [
    {
      body: 'Two spoons, milk, ice. Suddenly I am the office coffee person.',
      handle: '@pantryupgrade',
      brand: 'X',
      brandClass: 'social-logo--x',
    },
    {
      body: 'The build-your-own drink thing is dangerously convenient.',
      handle: '@coldbrewcommittee',
      brand: 'reddit',
      brandClass: 'social-logo--reddit',
    },
  ],
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

  useEffect(() => {
    const interval = window.setInterval(() => {
      setReviewIndex((current) => (current + 1) % REVIEW_PAIRS.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  const handleVideoClick = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const reviews = REVIEW_PAIRS[reviewIndex];

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

        <button className="bento-card bento-video" type="button" onClick={handleVideoClick} aria-label="Play or pause coffee video">
          <video
            ref={videoRef}
            src="/Videos/coffeeswirl1.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <span className="bento-video__play" aria-hidden="true" />
        </button>

        <article className="bento-card bento-facebook">
          <p>Finally, a coffee that doesn't taste like my wallet made a bad decision.</p>
          <div className="social-footer">
            <span className="social-handle">@bangalorebuzz</span>
            <span className="social-logo social-logo--facebook">facebook</span>
          </div>
        </article>

        <article className="bento-card bento-ad">
          <img src="/images/image10_366_1172.png" alt="Coffee should look like this. Water should not." />
        </article>

        <SocialCard review={reviews[0]} type="twitter" cycle={reviewIndex} />
        <SocialCard review={reviews[1]} type="reddit" cycle={reviewIndex} />
      </div>
    </section>
  );
}
