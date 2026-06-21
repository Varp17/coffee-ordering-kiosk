import { useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Printer,
  Send,
  Share2,
  ThumbsUp,
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import './recipe-details-page.css';

const FALLBACK_RECIPE = {
  id: 'georgesso',
  name: 'Georgesso',
  description: 'A smooth coffee mix with jaggery sweetness and double espresso for chaotic office days.',
  image: '/images/image11_366_1172.png',
  mood: 'Chill',
  author: 'Aanya Kapoor',
  likes: 1000,
  tags: ['OFFICE', 'STRONG', 'SWEET', 'OAT MILK'],
  ingredients: [
    '2 Shots Double Espresso (Dark Roast)',
    '1 Cup Chilled Oat milk',
    '1 tbsp Jaggery syrup',
    'Ice cubes as needed',
    'Cocoa dust',
  ],
  steps: [
    ['Step 1: Brew & Cool', 'Prepare double espresso and let it cool slightly. Using a dark roast will cut through the sweetness of the jaggery perfectly.'],
    ['Step 2: Sweeten', 'Stir in jaggery syrup while coffee is warm. Ensure it dissolves completely to avoid settling at the bottom of your glass.'],
    ['Step 3: Prepare Glass', 'Fill a tall glass with large ice cubes. The larger the cubes, the slower they will melt, preserving the strength of your coffee.'],
    ['Step 4: The Base', 'Pour in oat milk first for a marbled effect. Oat milk provides a creamy, neutral base that complements the earthy jaggery.'],
    ['Step 5: The Pour', 'Slowly top with the jaggery espresso. Add a tiny pinch of sea salt on top to elevate the flavors.'],
  ],
};

const INITIAL_COMMENTS = [
  { id: 1, author: 'Alia Bhatt', time: '3/14/2026 10:30 AM', text: 'I love it! Best with the jaggery espresso. Add a tiny pinch of sea salt on top to elevate the flavors.' },
  { id: 2, author: 'Ranveer Singh', time: '3/14/2026 10:30 AM', text: 'This recipe is damn good, I cannot believe that whatever I tried was a shit compared to this amazing drink.' },
];

/**
 * Render inside MainLayout. Suggested route:
 * <Route path="/recipe-details/:id" element={<RecipeDetailsPage />} />
 */
export default function RecipeDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const railRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(INITIAL_COMMENTS);

  const recipe = useMemo(() => {
    const passedRecipe = location.state;
    if (passedRecipe?.name) return { ...FALLBACK_RECIPE, ...passedRecipe, id: id || 'community-mix' };
    return FALLBACK_RECIPE;
  }, [id, location.state]);

  const relatedRecipes = PRODUCTS.filter((product) => product.category === 'custom').slice(0, 4);

  const addComment = () => {
    const text = comment.trim();
    if (!text) return;
    setComments((current) => [
      ...current,
      { id: Date.now(), author: 'You', time: 'Just now', text },
    ]);
    setComment('');
  };

  const moveRail = (direction) => {
    railRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  return (
    <main className="recipe-details-page">
      <aside className="recipe-details-graffiti" aria-hidden="true">
        <span>COFFEE</span><span>CHILLD</span><span>COFFEE</span>
      </aside>

      <section className="recipe-details-shell recipe-details-hero">
        <div className="recipe-details-hero__copy">
          <p className="recipe-details-hero__eyebrow">COMMUNITY MIX</p>
          <h1>{recipe.name}</h1>
          <div className="recipe-details-like-row">
            <span><Heart size={16} fill="currentColor" /> {recipe.likes + (liked ? 1 : 0).toLocaleString()} Likes</span>
            <button type="button" className={liked ? 'is-liked' : ''} onClick={() => setLiked((current) => !current)}>
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} /> {liked ? 'Liked' : 'Like'}
            </button>
          </div>

          <h2>Description</h2>
          <p className="recipe-details-hero__description">{recipe.description}</p>

          <div className="recipe-details-tags">
            {recipe.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <p className="recipe-details-author">By: <u>{recipe.author}</u></p>
          <div className="recipe-details-share-row">
            <span>Mood</span><strong>{recipe.mood}</strong>
            <button type="button" aria-label="Share recipe"><Share2 size={17} /></button>
            <button type="button" aria-label="Print recipe"><Printer size={17} /></button>
          </div>
        </div>

        <div className="recipe-details-hero__image-card">
          <img src={recipe.image} alt={recipe.name} />
        </div>
      </section>

      <section className="recipe-details-shell recipe-details-method-grid">
        <article className="recipe-details-block recipe-details-ingredients">
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}
          </ul>
        </article>

        <article className="recipe-details-block recipe-details-steps">
          <h2>Recipe</h2>
          {recipe.steps.map(([title, copy]) => (
            <section key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </section>
          ))}
        </article>
      </section>

      <section className="recipe-details-shell recipe-details-comments">
        <div className="recipe-details-section-title">
          <h2>Comments</h2>
          <span>{comments.length} community notes</span>
        </div>

        <div className="recipe-details-comment-compose">
          <label htmlFor="recipe-comment">Write Comment</label>
          <textarea
            id="recipe-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Share your thoughts..."
          />
          <button type="button" onClick={addComment}><Send size={16} /> Post comment</button>
        </div>

        <div className="recipe-details-comment-list">
          {comments.map((item) => (
            <article key={item.id} className="recipe-details-comment">
              <div><strong>{item.author}</strong><time>{item.time}</time></div>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="recipe-details-more">
        <div className="recipe-details-shell">
          <div className="recipe-details-more__heading">
            <div>
              <p>KEEP EXPLORING</p>
              <h2>More great recipes</h2>
            </div>
            <Link to="/menu" className="recipe-details-more__all">View all recipes</Link>
          </div>

          <div className="recipe-details-rail-wrap">
            <div className="recipe-details-rail" ref={railRef}>
              {relatedRecipes.map((product) => (
                <Link className="recipe-details-related-card" key={product.id} to={`/menu/${product.id}`}>
                  <div className="recipe-details-related-card__image">
                    <img src={product.image} alt={product.name} />
                    <span>{product.id === 'p015' ? '+1K Likes' : product.id === 'p013' ? '50 Likes' : product.id === 'p014' ? '30 Likes' : '250 Likes'}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div>{product.tags.slice(0, 2).map((tag) => <small key={tag}>{tag}</small>)}</div>
                </Link>
              ))}
            </div>
            <div className="recipe-details-rail-controls">
              <button type="button" onClick={() => moveRail(-1)} aria-label="Previous recipes"><ChevronLeft size={20} /></button>
              <button type="button" onClick={() => moveRail(1)} aria-label="Next recipes"><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
