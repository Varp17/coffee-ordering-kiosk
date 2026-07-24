import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import RecipeMedia from '@/components/RecipeMedia/RecipeMedia';
import { RECIPES } from '@/data/recipes';
import './MobileRecipeDetailsPage.css';

const initialComments = [
  {
    name: 'Aarav Sharma',
    time: '2/4/2026 10:30 AM',
    copy: 'I love it! Best with the jaggery espresso. Add a tiny pinch of sea salt on top to elevate the flavors.',
  },
  {
    name: 'Rohan Mehta',
    time: '2/4/2026 10:30 AM',
    copy: 'This recipe is super refreshing and smooth. Loved making it at home!',
  },
];

function MobileIcon({ name, size = 20, stroke = 'currentColor', fill = 'none' }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill,
    stroke,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  const paths = {
    heart: <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" />,
    chevronLeft: <path d="m15 18-6-6 6-6" />,
    share: <><circle cx="18" cy="5.5" r="2.3" /><circle cx="6" cy="12" r="2.3" /><circle cx="18" cy="18.5" r="2.3" /><path d="m8.1 10.9 7.7-4.2M8.1 13.1l7.7 4.2" /></>,
    print: <><path d="M7.2 8V4.5h9.6V8" /><path d="M6.4 18.5H4.8V10.2h14.4v8.3h-1.6" /><path d="M7.2 14.5h9.6v5H7.2z" /></>,
    check: <path d="M20 6 9 17l-5-5" />,
    clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M5 20a10 10 0 0 1 14 0" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

export default function MobileRecipeDetailPage({ id, location }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(initialComments);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const mobileCarouselRef = useRef(null);

  // Look up current recipe: first check location state (for draft preview), then central list
  const currentRecipe = location?.state?.name
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

  const relatedRecipes = RECIPES.filter((r) => r.id !== currentRecipe.id);
  const likesCount = isLiked ? '1,001 Likes' : currentRecipe.likes || '1,000 Likes';

  // Exact 60fps requestAnimationFrame smooth infinite marquee loop matched from Homepage TrendingMixes
  useEffect(() => {
    const rail = mobileCarouselRef.current;
    if (!rail) return undefined;

    let animId;
    let isPaused = false;

    const step = () => {
      if (!isPaused) {
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

    rail.addEventListener('touchstart', pause, { passive: true });
    rail.addEventListener('touchend', resume, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      rail.removeEventListener('touchstart', pause);
      rail.removeEventListener('touchend', resume);
    };
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    if (!isLiked) {
      toast.success('Added to favorites!');
    }
  };

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const submitComment = () => {
    const trimmed = comment.trim();
    if (!trimmed) return;

    setComments((current) => [
      ...current,
      {
        name: 'You',
        time: new Intl.DateTimeFormat('en-IN', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }).format(new Date()),
        copy: trimmed,
      },
    ]);
    setComment('');
    toast.success('Comment posted successfully!');
  };

  return (
    <main className="mobile-recipe-page">
      {/* ── FLOAT FLOATING HERO HEADER ── */}
      <div className="mobile-recipe-hero-media">
        <RecipeMedia
          recipe={currentRecipe}
          alt={currentRecipe.name}
          className="mobile-recipe-hero-media-element"
          preferVideo
        />
        <div className="mobile-recipe-hero-overlay" />

        {/* FLOATING TOP NAV */}
        <div className="mobile-recipe-floating-nav">
          <button
            className="mobile-recipe-circular-btn"
            type="button"
            onClick={() => navigate('/recipes')}
            aria-label="Back to recipes"
          >
            <MobileIcon name="chevronLeft" size={22} />
          </button>
          
          <div className="mobile-recipe-floating-right">
            <button
              className={`mobile-recipe-circular-btn btn-like ${isLiked ? 'active' : ''}`}
              type="button"
              onClick={handleLike}
              aria-label="Like recipe"
            >
              <MobileIcon
                name="heart"
                size={20}
                fill={isLiked ? '#ef4444' : 'none'}
                stroke={isLiked ? '#ef4444' : '#1f2a44'}
              />
            </button>
            <button
              className="mobile-recipe-circular-btn"
              type="button"
              onClick={handleShare}
              aria-label="Share recipe"
            >
              <MobileIcon name="share" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ── DRAGGABLE BOTTOM SHEET LOOK ── */}
      <section className="mobile-recipe-sheet">
        <div className="mobile-recipe-sheet-handle" />

        {/* CATEGORY / BADGES ROW */}
        <div className="mobile-recipe-meta-badges">
          <span className="badge-item badge-mood">{currentRecipe.mood}</span>
          {currentRecipe.concentrate !== 'custom' && (
            <span className="badge-item badge-base">{currentRecipe.concentrate} Base</span>
          )}
          <span className="badge-item badge-likes">{likesCount}</span>
        </div>

        {/* TITLE & AUTHOR */}
        <h1 className="mobile-recipe-title">{currentRecipe.name}</h1>
        <p className="mobile-recipe-author">Created by {currentRecipe.author}</p>
        <p className="mobile-recipe-disclaimer" style={{ fontSize: '0.75rem', color: '#718096', fontStyle: 'italic', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
          *Note: Images shown are AI-generated and intended for illustrative purposes only.
        </p>

        {/* DESCRIPTION */}
        <div className="mobile-recipe-desc-container">
          <p className="mobile-recipe-desc-text">“{currentRecipe.description}”</p>
        </div>

        {/* TAGS */}
        <div className="mobile-recipe-tags">
          {currentRecipe.tags.map((tag) => (
            <span key={tag} className="mobile-recipe-tag">#{tag}</span>
          ))}
        </div>

        {/* INGREDIENTS INTERACTIVE CHECKLIST */}
        <div className="mobile-recipe-section-card">
          <h2 className="mobile-recipe-sec-title">Ingredients</h2>
          <p className="mobile-recipe-sec-subtitle">Check ingredients you have prepared:</p>
          <div className="mobile-recipe-ingredients-list">
            {currentRecipe.ingredients.map((ing, idx) => (
              <button
                key={ing + idx}
                type="button"
                className={`mobile-recipe-ing-item ${checkedIngredients[idx] ? 'is-checked' : ''}`}
                onClick={() => toggleIngredient(idx)}
              >
                <div className="ing-checkbox">
                  {checkedIngredients[idx] && <MobileIcon name="check" size={14} stroke="#fff" />}
                </div>
                <span className="ing-text">{ing}</span>
              </button>
            ))}
          </div>
        </div>

        {/* INSTRUCTIONS VERTICAL TIMELINE */}
        <div className="mobile-recipe-section-card">
          <h2 className="mobile-recipe-sec-title">Step-by-Step Guide</h2>
          <div className="mobile-recipe-timeline">
            {currentRecipe.steps.map((step, idx) => (
              <div key={step.title + idx} className="mobile-recipe-timeline-item">
                <div className="timeline-node">
                  <div className="timeline-circle">
                    <span>{idx + 1}</span>
                  </div>
                  {idx < currentRecipe.steps.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <h3 className="timeline-step-title">{step.title}</h3>
                  <p className="timeline-step-desc">{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMMENTS */}
        <div className="mobile-recipe-section-card">
          <h2 className="mobile-recipe-sec-title">Comments</h2>
          <div className="mobile-recipe-comment-form">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What do you think of this drink?"
            />
            <button
              type="button"
              className="mobile-recipe-comment-submit"
              disabled={!comment.trim()}
              onClick={submitComment}
            >
              Post Comment
            </button>
          </div>

          <div className="mobile-recipe-comments-list">
            {comments.map((item, index) => (
              <div className="mobile-comment-bubble" key={index}>
                <div className="comment-bubble-header">
                  <strong>{item.name}</strong>
                  <time>{item.time}</time>
                </div>
                <p className="comment-bubble-body">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MORE RECIPES HORIZONTAL SWIPE */}
        <div className="mobile-recipe-section-card no-padding-bottom">
          <h2 className="mobile-recipe-sec-title">More Great Recipes</h2>
          <div ref={mobileCarouselRef} className="mobile-recipe-carousel">
            {relatedRecipes.concat(relatedRecipes).map((recipe, idx) => (
              <Link
                to={`/recipe-details/${recipe.id}`}
                className="mobile-related-card"
                key={`${recipe.id}-${idx}`}
              >
                <div className="mobile-related-card-media">
                  <RecipeMedia recipe={recipe} alt={recipe.name} className="related-img" />
                  <span className="mobile-related-likes">{recipe.likes}</span>
                </div>
                <h3 className="mobile-related-title">{recipe.name}</h3>
                <div className="mobile-related-tags">
                  {recipe.tags.slice(0, 2).map((t) => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
