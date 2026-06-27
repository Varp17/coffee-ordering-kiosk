import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './recipe-details-page.css';

const heroDrink = '/images/georgesso-hero.png';
const rajpresso = '/images/image11_366_1172.png';
const vandyMoodMocha = '/images/image12_366_1172.png';
const kishorapppe = '/images/image13_366_1172.png';
const rishiLatte = '/images/image14_366_1172.png';
const startupIndia = '/images/image2_366_1172.png';
const sideGraffiti = '/images/side-graffiti.svg';

const ingredients = [
  '2 Shots Double Espresso (Dark Roast)',
  '1 Cup Chilled Oat milk',
  '1 tbsp Jaggery syrup',
  'Ice cubes as needed',
  'Cocoa dust',
];

const steps = [
  {
    title: 'Step 1: Brew & Cool',
    copy: 'Prepare double espresso and let it cool slightly. Using a dark roast will cut through the sweetness of the jaggery perfectly.',
  },
  {
    title: 'Step 2: Sweeten',
    copy: 'Stir in jaggery syrup while coffee is warm. Ensure it dissolves completely to avoid settling at the bottom of your glass.',
  },
  {
    title: 'Step 3: Prepare Glass',
    copy: 'Fill a tall glass with large ice cubes. The larger the cubes, the slower they will melt, preserving the strength of your comeback.',
  },
  {
    title: 'Step 4: The Base',
    copy: 'Pour in oat milk first for a marbled effect. Oat milk provides a creamy, neutral base that complements the earthy jaggery.',
  },
  {
    title: 'Step 5: The Pour',
    copy: 'Slowly top with the jaggery espresso. Add a tiny pinch of sea salt on top to elevate the flavors.',
  },
];

const relatedRecipes = [
  {
    title: 'Rajpresso',
    likes: '50 Likes',
    image: rajpresso,
    description: 'A silky-smooth Espresso Martini kissed with rich Cold Coffee concentrate...',
    tags: ['MASCA', 'SWEET'],
  },
  {
    title: 'Vandy Mood Mocha',
    likes: '30 Likes',
    image: vandyMoodMocha,
    description: 'A silky-smooth Nitro Espresso Martini kissed with rich chocolate liqueur...',
    tags: ['MOCHA', 'BITTER'],
  },
  {
    title: 'Kishorapppe',
    likes: '+1K Likes',
    image: kishorapppe,
    description: 'A silky-smooth Nitro Espresso Martini kissed with rich chocolate liqueur...',
    tags: ['CHILLED', 'LEMON'],
  },
  {
    title: 'RishiLatte',
    likes: '250 Likes',
    image: rishiLatte,
    description: 'A silky-smooth Nitro Espresso Martini kissed with chocolate liqueur...',
    tags: ['COLD COFFEE', 'STRONG'],
  },
  {
    title: 'Rajat Brew',
    likes: '82 Likes',
    image: rajpresso,
    description: 'A bold cold-coffee finish for late evenings and early plans...',
    tags: ['ESPRESSO', 'SWEET'],
  },
];

const initialComments = [
  {
    name: 'Alia Bhatt',
    time: '2/4/2026 10:30 Am',
    copy: 'I love it! Best with the jaggery espresso. Add a tiny pinch of sea salt on top to elevate the flavors.',
  },
  {
    name: 'Ranveer Singh',
    time: '2/4/2026 10:30 Am',
    copy: 'This recipe is dam good, I cannot believe that whatever i tried was a shit compared to this amazing drink.',
  },
];

function Icon({ name, size = 22, stroke = 'currentColor' }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  const paths = {
    heart: <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" />,
    user: <><circle cx="12" cy="8" r="3.2" /><path d="M5 20c.7-3.4 3.2-5.2 7-5.2s6.3 1.8 7 5.2" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    bag: <><path d="M5.4 8.5h13.2l-.8 11H6.2l-.8-11Z" /><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" /></>,
    coffee: <><path d="M4.5 8.5h11v6.2a4.1 4.1 0 0 1-4.1 4.1H8.6a4.1 4.1 0 0 1-4.1-4.1V8.5Z" /><path d="M15.5 10.2h1.3a2.7 2.7 0 1 1 0 5.4h-1.3" /><path d="M8 4.5c0 1.3-1.3 1.6-1.3 3" /><path d="M12 4.5c0 1.3-1.3 1.6-1.3 3" /></>,
    share: <><circle cx="18" cy="5.5" r="2.3" /><circle cx="6" cy="12" r="2.3" /><circle cx="18" cy="18.5" r="2.3" /><path d="m8.1 10.9 7.7-4.2M8.1 13.1l7.7 4.2" /></>,
    print: <><path d="M7.2 8V4.5h9.6V8" /><path d="M6.4 18.5H4.8V10.2h14.4v8.3h-1.6" /><path d="M7.2 14.5h9.6v5H7.2z" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    arrowLeft: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    arrowRight: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    arrowUpRight: <><path d="M7 17 17 7" /><path d="M9 7h8v8" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function RecipeDetailPage() {
  const [isLiked, setIsLiked] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(initialComments);
  const carouselRef = useRef(null);

  const likes = isLiked ? '1,001 Likes' : '1,000 Likes';

  const submitComment = () => {
    const trimmed = comment.trim();
    if (!trimmed) return;

    setComments((current) => [
      ...current,
      {
        name: 'You',
        time: new Intl.DateTimeFormat('en-IN', {
          day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
        }).format(new Date()),
        copy: trimmed,
      },
    ]);
    setComment('');
  };

  const handleCommentKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      submitComment();
    }
  };

  const scrollRecipes = (direction) => {
    carouselRef.current?.scrollBy({ left: direction * 360, behavior: 'smooth' });
  };

  return (
    <main className="recipe-page">
      {/* <div className="recipe-promo">Summer Sale 30% OFF is Now Live <Icon name="arrowRight" size={15} /></div> */}

      <header className="recipe-nav-shell">
        <nav className="recipe-nav" aria-label="Main navigation">
          <a className="recipe-logo" href="#top" aria-label="Chilld home">Chilld.</a>

          <div className={`recipe-links ${mobileNavOpen ? 'is-open' : ''}`}>
            {['Home', 'Products', 'Recipes', 'About Us', 'Contact'].map((item) => (
              <a href={`#${item.toLowerCase().replaceAll(' ', '-')}`} key={item} onClick={() => setMobileNavOpen(false)}>{item}</a>
            ))}
          </div>

          <div className="recipe-nav-actions">
            <button className="account-button" type="button" aria-label="Open account menu">
              <Icon name="user" size={17} />
              <span>Arya Kagathara</span>
              <Icon name="chevron" size={15} />
            </button>
            <button className="icon-button basket-button" type="button" aria-label="Basket has 3 items">
              <Icon name="bag" size={19} /><span>3</span>
            </button>
            <button className="create-drink-button" type="button"><Icon name="coffee" size={18} /> Create Your Drink</button>
            <button className="mobile-menu-button" type="button" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle menu">
              <Icon name={mobileNavOpen ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </nav>
      </header>

      <section className="recipe-hero" id="top">
        <img className="recipe-side-graffiti" src={sideGraffiti} alt="" aria-hidden="true" />
        <div className="recipe-container hero-layout">
          <article className="recipe-summary">
            <h1>Georgesso</h1>

            <div className="like-row">
              <div className="like-count"><Icon name="heart" size={19} /><span>{likes}</span></div>
              <button className={`like-button ${isLiked ? 'is-liked' : ''}`} type="button" onClick={() => setIsLiked((liked) => !liked)} aria-pressed={isLiked}>
                <Icon name="heart" size={19} /> {isLiked ? 'Liked' : 'Like'}
              </button>
            </div>

            <div className="description-copy">
              <p className="eyebrow">Description</p>
              <p>A smooth oat milk cold coffee with jaggery sweetness and double espresso for chaotic office days.</p>
            </div>

            <div className="recipe-tags" aria-label="Recipe tags">
              {['OFFICE', 'STRONG', 'SWEET', 'OAT MILK'].map((tag) => <span key={tag}>{tag}</span>)}
            </div>

            <div className="recipe-meta">
              <div className="meta-line"><span>By: Aanya Kapoor</span><div className="meta-icons"><button type="button" aria-label="Share recipe"><Icon name="share" size={18} /></button><button type="button" aria-label="Print recipe"><Icon name="print" size={18} /></button></div></div>
              <div className="meta-line"><span>Mood</span><span>Chill</span></div>
            </div>
          </article>

          <figure className="hero-drink-card">
            <img src={heroDrink} alt="Georgesso coffee in a coupe glass" />
          </figure>
        </div>
      </section>

      <section className="recipe-container cooking-section">
        <aside className="ingredients-panel">
          <h2>Ingredients</h2>
          <ul>{ingredients.map((item) => <li key={item}>{item}</li>)}</ul>
        </aside>

        <article className="directions-panel">
          <h2>Recipe</h2>
          <div className="steps-list">
            {steps.map((step) => (
              <section className="recipe-step" key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </section>
            ))}
          </div>
        </article>
      </section>

      <section className="comments-section recipe-container" id="comments">
        <h2>Comments</h2>
        <div className="comment-form">
          <label htmlFor="recipe-comment">Write Comment</label>
          <textarea id="recipe-comment" value={comment} onChange={(event) => setComment(event.target.value)} onKeyDown={handleCommentKeyDown} placeholder="Share your thoughts..." />
          <div className="comment-form-footer"><span>Press Ctrl/⌘ + Enter to post</span><button type="button" onClick={submitComment} disabled={!comment.trim()}>Post Comment</button></div>
        </div>

        <div className="comment-list">
          {comments.map((item, index) => (
            <article className="recipe-comment" key={`${item.name}-${item.time}-${index}`}>
              <span className="comment-accent" aria-hidden="true" />
              <div className="comment-content"><div className="comment-head"><strong>{item.name}</strong><time>{item.time}</time></div><p>{item.copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="more-recipes-section" id="recipes">
        <div className="recipe-container">
          <div className="section-heading-row"><h2>More great recipes</h2><button type="button" className="view-recipes-button">View all recipes <Icon name="arrowUpRight" size={17} /></button></div>
          <div ref={carouselRef} className="recipe-carousel" tabIndex="0" aria-label="More coffee recipes">
            {relatedRecipes.map((recipe) => (
              <article className="related-recipe-card" key={recipe.title}>
                <div className="related-image"><img src={recipe.image} alt="" /><span className="related-likes">{recipe.likes}</span></div>
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <div className="related-tags">{recipe.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </article>
            ))}
          </div>
          <div className="carousel-buttons"><button type="button" onClick={() => scrollRecipes(-1)} aria-label="Previous recipes"><Icon name="arrowLeft" size={21} /></button><button type="button" onClick={() => scrollRecipes(1)} aria-label="Next recipes"><Icon name="arrowRight" size={21} /></button></div>
        </div>
      </section>

    </main>
  );
}

export default RecipeDetailPage;
