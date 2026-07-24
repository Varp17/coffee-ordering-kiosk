import { useRef, useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import RecipeMedia from '@/components/RecipeMedia/RecipeMedia';
import { RECIPES } from '@/data/recipes';
import { getNativeDeviceMode } from '@/utils/deviceDetection';
import MobileRecipeDetailPage from './MobileRecipeDetailsPage';
import './recipe-details-page.css';

const sideGraffiti = '/images/side-graffiti.svg';
const SHOW_PROMO = false; // Set to true when we have a promo

const initialComments = [
  {
    name: 'Aarav Sharma',
    time: '2/4/2026 10:30 Am',
    copy: 'I love it! Best with the jaggery espresso. Add a tiny pinch of sea salt on top to elevate the flavors.',
  },
  {
    name: 'Rohan Mehta',
    time: '2/4/2026 10:30 Am',
    copy: 'This recipe is super refreshing and smooth. Loved making it at home!',
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

function RecipeDetailContent({ id, location }) {
  const [isLiked, setIsLiked] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(initialComments);
  const carouselRef = useRef(null);

  // Look up current recipe: first check location state (for draft preview), then central list
  const currentRecipe = location.state?.name
    ? {
        id: id || 'custom-mix',
        name: location.state.name,
        description: location.state.description,
        likes: '0 Likes',
        image: location.state.image,
        tags: location.state.tags || [],
        concentrate: 'custom',
        author: location.state.author || 'Anonymous',
        mood: location.state.mood || 'Chill',
        ingredients: location.state.ingredients || [],
        steps: location.state.recipeText
          ? location.state.recipeText.split('\n\n').map((block, idx) => {
              const lines = block.split('\n');
              return {
                title: lines[0] || `Step ${idx + 1}`,
                copy: lines.slice(1).join(' ') || lines[0] || '',
              };
            })
          : [],
      }
    : (RECIPES.find((r) => r.id === id) || RECIPES[0]);

  const likes = isLiked ? '1,001 Likes' : currentRecipe.likes || '1,000 Likes';

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

  // Get other recipes for bottom carousel
  const relatedRecipes = RECIPES.filter((r) => r.id !== currentRecipe.id);
  const isManuallyScrollingRef = useRef(false);

  // Exact 60fps requestAnimationFrame smooth infinite marquee loop matched from Homepage TrendingMixes
  useEffect(() => {
    const rail = carouselRef.current;
    if (!rail) return undefined;

    let animId;
    let isPaused = false;

    const step = () => {
      if (!isPaused && !isManuallyScrollingRef.current) {
        rail.scrollLeft += 0.8;
        if (rail.scrollLeft >= rail.scrollWidth / 2) {
          rail.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    const pause = () => { isPaused = true; };
    const resume = () => { isPaused = false; };

    rail.addEventListener('mouseenter', pause);
    rail.addEventListener('mouseleave', resume);
    rail.addEventListener('touchstart', pause, { passive: true });
    rail.addEventListener('touchend', resume, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      rail.removeEventListener('mouseenter', pause);
      rail.removeEventListener('mouseleave', resume);
      rail.removeEventListener('touchstart', pause);
      rail.removeEventListener('touchend', resume);
    };
  }, []);

  const scrollNav = (direction) => {
    const rail = carouselRef.current;
    if (!rail) return;

    isManuallyScrollingRef.current = true;

    const scrollAmount = 312;
    let targetScroll = rail.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    const halfWidth = rail.scrollWidth / 2;

    if (targetScroll < 0) {
      rail.scrollLeft = halfWidth + rail.scrollLeft;
      targetScroll = halfWidth + targetScroll;
    } else if (targetScroll >= halfWidth) {
      rail.scrollLeft = rail.scrollLeft - halfWidth;
      targetScroll = targetScroll - halfWidth;
    }

    rail.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });

    setTimeout(() => {
      isManuallyScrollingRef.current = false;
    }, 600);
  };

  return (
    <main className="recipe-page">
      {SHOW_PROMO && (
        <div className="recipe-promo">Summer Sale 30% OFF is Now Live <Icon name="arrowRight" size={15} /></div>
      )}

      {/* ── NAVIGATION HEADER ── */}
      <header className="recipe-nav-shell">
        <nav className="recipe-nav" aria-label="Main navigation">
          <Link className="recipe-logo" to="/" aria-label="Chilld home">Chilld.</Link>

          <div className={`recipe-links ${mobileNavOpen ? 'is-open' : ''}`}>
            <Link to="/" onClick={() => setMobileNavOpen(false)}>Home</Link>
            <Link to="/menu" onClick={() => setMobileNavOpen(false)}>Products</Link>
            <Link to="/recipes" onClick={() => setMobileNavOpen(false)}>Recipes</Link>
            <Link to="/#hard-part" onClick={() => setMobileNavOpen(false)}>About Us</Link>
            <Link to="/location" onClick={() => setMobileNavOpen(false)}>Contact</Link>
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
            {/* <Link className="create-drink-button" to="/build"><Icon name="coffee" size={18} /> Create Your Drink</Link> — kiosk-only */}
            <button className="mobile-menu-button" type="button" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle menu">
              <Icon name={mobileNavOpen ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* ── RECIPE HERO ── */}
      <section className="recipe-hero" id="top">
        <img className="recipe-side-graffiti" src={sideGraffiti} alt="" aria-hidden="true" />
        <div className="recipe-container hero-layout">
          <article className="recipe-summary">
            <h1>{currentRecipe.name}</h1>

            <div className="like-row">
              <div className="like-count"><Icon name="heart" size={19} /><span>{likes}</span></div>
              <button className={`like-button ${isLiked ? 'is-liked' : ''}`} type="button" onClick={() => setIsLiked((liked) => !liked)} aria-pressed={isLiked}>
                <Icon name="heart" size={19} /> {isLiked ? 'Liked' : 'Like'}
              </button>
            </div>

            <div className="description-copy">
              <p className="eyebrow">Description</p>
              <p>{currentRecipe.description}</p>
            </div>

            <div className="recipe-tags" aria-label="Recipe tags">
              {currentRecipe.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>

            <div className="recipe-meta">
              <div className="meta-line"><span>By: {currentRecipe.author}</span><div className="meta-icons"><button type="button" aria-label="Share recipe"><Icon name="share" size={18} /></button><button type="button" aria-label="Print recipe"><Icon name="print" size={18} /></button></div></div>
              <div className="meta-line"><span>Mood</span><span>{currentRecipe.mood}</span></div>
              {currentRecipe.concentrate !== 'custom' && (
                <div className="meta-line">
                  <span>Concentrate Base</span>
                  <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{currentRecipe.concentrate}</span>
                </div>
              )}
            </div>
          </article>

          <figure className="hero-drink-card">
            <RecipeMedia
              recipe={currentRecipe}
              alt={`${currentRecipe.name} coffee`}
              preferVideo
            />
            <figcaption className="recipe-img-disclaimer" style={{ fontSize: '0.78rem', color: '#718096', fontStyle: 'italic', textAlign: 'center', marginTop: '0.5rem' }}>
              *Note: Images shown are AI-generated and intended for illustrative purposes only.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── INGREDIENTS & INSTRUCTIONS ── */}
      <section className="recipe-container cooking-section">
        <aside className="ingredients-panel">
          <h2>Ingredients</h2>
          <ul>{currentRecipe.ingredients.map((item) => <li key={item}>{item}</li>)}</ul>
        </aside>

        <article className="directions-panel">
          <h2>Recipe</h2>
          <div className="steps-list">
            {currentRecipe.steps.map((step, idx) => (
              <section className="recipe-step" key={step.title + idx}>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </section>
            ))}
          </div>
        </article>
      </section>

      {/* ── USER COMMENTS ── */}
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

      {/* ── RELATED RECIPES ── */}
      <section className="lower-flow-trending" id="recipes" aria-labelledby="more-recipes-title">
        <div className="section-heading-row" style={{ maxWidth: '1660px', margin: '0 auto 1rem', padding: '0 2rem' }}>
          <h2 id="more-recipes-title">More great recipes</h2>
          <Link to="/recipes" className="view-recipes-button">View all recipes <Icon name="arrowUpRight" size={17} /></Link>
        </div>

        <div className="lower-flow-trending__container">
          <button
            type="button"
            onClick={() => scrollNav('left')}
            className="trending-nav-btn trending-nav-btn--left"
            aria-label="Scroll left"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div
            ref={carouselRef}
            className="lower-flow-trending__rail"
            aria-label="More coffee recipes"
          >
            <div className="lower-flow-trending__track">
              {relatedRecipes.map((recipe) => (
                <Link key={recipe.id} to={`/recipe-details/${recipe.id}`} className="trending-mix-card">
                  <div className="trending-mix-card__image-wrapper">
                    <div className="trending-mix-card__image">
                      <RecipeMedia recipe={recipe} alt={recipe.name} />
                      <span className="trending-mix-card__likes">{recipe.likes}</span>
                    </div>
                  </div>
                  <div className="trending-mix-card__content">
                    <h3>{recipe.name}</h3>
                    <p>{recipe.description}</p>
                    <div className="trending-mix-card__tags">
                      {recipe.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
              {relatedRecipes.map((recipe) => (
                <Link key={`${recipe.id}-dup`} to={`/recipe-details/${recipe.id}`} className="trending-mix-card" tabIndex={-1} aria-hidden="true">
                  <div className="trending-mix-card__image-wrapper">
                    <div className="trending-mix-card__image">
                      <RecipeMedia recipe={recipe} alt="" />
                      <span className="trending-mix-card__likes">{recipe.likes}</span>
                    </div>
                  </div>
                  <div className="trending-mix-card__content">
                    <h3>{recipe.name}</h3>
                    <p>{recipe.description}</p>
                    <div className="trending-mix-card__tags">
                      {recipe.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollNav('right')}
            className="trending-nav-btn trending-nav-btn--right"
            aria-label="Scroll right"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </section>

    </main>
  );
}

function RecipeDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [deviceMode, setDeviceMode] = useState(() => getNativeDeviceMode());

  useEffect(() => {
    const handleResize = () => {
      setDeviceMode(getNativeDeviceMode());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const recipeKey = location.state?.name ? `${id || 'custom'}-${location.key}` : id || 'default';

  if (deviceMode === 'mobile') {
    return <MobileRecipeDetailPage key={recipeKey} id={id} location={location} />;
  }

  return <RecipeDetailContent key={recipeKey} id={id} location={location} />;
}

export default RecipeDetailPage;
