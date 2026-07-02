import "./SkipPageHome.css";

// These imports make Vite bundle the files. Do NOT use /public paths for these assets.
import coffeeCup from "./assets/iced-coffee-cup.png";
import pourDoodle from "./assets/pour-doodle.png";
import coffeeCupBackdrop from "./assets/coffee-cup-backdrop.svg";

const Dot = ({ active = false }) => (
  <span className={active ? "is-active" : ""} aria-hidden="true" />
);

function HeroPattern() {
  return (
    <svg
      className="neha-hero__pattern"
      viewBox="0 0 631 421"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M310 -18c36 0 58 18 51 42-7 24-54 29-57 54-3 25 35 27 31 51" />
        <path d="M367 13c8 17 42 21 43 46 1 17-24 32-47 40-28 10-35 28-17 46 12 12 32 16 42 32" />
        <path d="M455 -23c-10 19 2 37 26 42 27 6 43-5 55 10 13 15 1 35-16 44-18 10-36 11-41 30-6 23 17 31 37 34" />
        <path d="M565 -3c-15 16-4 35 14 42 17 7 37 7 39 25 2 17-19 27-36 31" />
        <path d="M316 105c18-13 42-9 52 8 10 17 3 39-17 48-20 9-13 29 6 39 21 11 23 34 4 50" />
        <path d="M407 86c20 3 29 23 20 39-9 15-29 19-35 34-8 20 9 35 27 35 20 0 35 13 36 31" />
        <path d="M509 86c-10 13-6 32 11 39 17 7 39 8 43 27 4 19-15 31-31 35-17 4-25 23-13 38 12 14 37 15 51 5" />
        <path d="M601 94c-12 15-2 31 14 36 12 4 18 12 15 26" />
        <path d="M300 200c18-5 30 9 28 25-2 16-24 20-30 36-7 18 11 33 28 30 17-3 25 15 16 30" />
        <path d="M364 202c12 14 36 17 41 36 4 16-15 25-30 30-17 6-19 28-2 36 15 7 31-1 41 9" />
        <path d="M443 209c18 7 37 5 47 22 10 17-4 37-20 44-18 8-10 31 8 37 19 6 22 26 6 39" />
        <path d="M538 205c9 18 32 20 39 37 8 18-10 31-24 36-17 6-17 27-1 35 17 9 31 6 41 21" />
        <path d="M603 236c11 7 15 22 7 33-8 12-24 13-31 25" />
      </g>
    </svg>
  );
}

export default function SkipPageHome() {
  return (
    <main className="skip-page-home">
      <section className="neha-hero" aria-labelledby="neha-title">
        <HeroPattern />

        {/* Layer order: background SVG → coffee → pour doodle/straw → white wave mask. */}
        <img
          className="neha-hero__cup-backdrop"
          src={coffeeCupBackdrop}
          alt=""
          aria-hidden="true"
        />

        <div className="neha-hero__copy">
          <h1 id="neha-title" className="neha-logo">
            Neha<span>cano</span>
          </h1>
          <p className="neha-tagline">/ “Neha” + “Americano” /</p>
          <h2>Code your own Coffee</h2>

          <div className="hero-dots" aria-label="Slide 1 of 3">
            <Dot active />
            <Dot />
            <Dot />
          </div>
        </div>

        <img className="neha-hero__coffee" src={coffeeCup} alt="Iced coffee" />
        <img className="neha-doodle" src={pourDoodle} alt="" aria-hidden="true" />
        <span className="neha-straw-line" aria-hidden="true" />

        <svg
          className="neha-wave"
          viewBox="0 0 631 421"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 421C59 392 123 359 203 355C281 350 351 367 424 391C468 406 500 405 531 395C572 382 601 362 631 354V421H0Z" />
        </svg>
      </section>

      <section className="neha-story" aria-labelledby="story-title">
        <div className="neha-story__copy">
          <h2 id="story-title">Coffee is fuel, not a ceremony</h2>

          <p className="story-copy story-copy--intro">
            Nobody likes a know-it-all. And, neither do you. You like coffee because a) it tastes good, and b) it gives you a rush.
            <br />
            Chilld does both. We take care of the nitty-gritties of sourcing. We ensure that you get exceptional coffee
            <br />
            concentrate. After that, you are free to tailor your daily coffee to your liking. Add water, if you are in a hurry for
            <br />
            your presentation. Add syrup, milk, experiment with everyday ingredients in your kitchen, till you have the time.
          </p>

          <p className="story-copy story-copy--oncall">
            If you&apos;ve been on-call all night, add an extra spoon of our cold brew concentrate. If you get jittery, like me, but
            <br />
            enjoy the occasional pick-me-up, add a spoon less. No one&apos;s judging you.
          </p>

          <p className="story-copy story-copy--promise">
            We guarantee that it will taste good; we promise that it won&apos;t eat into your wallet. The only person left full and
            <br />
            satisfied is you.
          </p>

          <p className="story-copy story-copy--quote">“Coffee is too much work” or “this sounds difficult”</p>
          <p className="story-copy story-copy--easy">If you can make lemonade, iced-water, or pet a cat, this is a walk in the park.</p>

          <p className="story-copy story-copy--outro">
            Chilld was built for people who like things their way. From milk choices to sweetness levels, every drink is
            <br />
            designed by you. No complicated menus. Just cold coffee made for your mood, your routine, and your kind of
            <br />
            day.
          </p>

          <div className="story-actions">
            <button type="button" className="story-actions__primary">Buy CHILLD Cold Brew Core</button>
            <button type="button" className="story-actions__secondary">Explore Recipes</button>
          </div>
        </div>
      </section>
    </main>
  );
}
