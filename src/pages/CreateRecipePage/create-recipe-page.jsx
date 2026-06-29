import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Plus,
  Sparkles,
  Tag,
  Upload,
  X,
} from 'lucide-react';
import './create-recipe-page.css';

const DEFAULT_IMAGE = '/images/image11_366_1172.png';
const DEFAULT_TAGS = ['OFFICE', 'STRONG', 'SWEET', 'OAT MILK'];
const DEFAULT_INGREDIENTS = [
  '2 Shots Double Espresso (Dark Roast)',
  '1 Cup Chilled Oat milk',
  '1 tbsp Jaggery syrup',
];
const DEFAULT_RECIPE = `Step 1: Brew & Cool\nPrepare double espresso and let it cool slightly. Using a dark roast will cut through the sweetness of the jaggery perfectly.\n\nStep 2: Sweeten\nStir in jaggery syrup while coffee is warm. Ensure it dissolves completely to avoid settling at the bottom of your glass.`;

/**
 * Render this page inside MainLayout so the existing Navbar and Footer are shared.
 * Add a route such as: <Route path="/create-recipe" element={<CreateRecipePage />} />
 */
export default function CreateRecipePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(DEFAULT_IMAGE);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState('Chill');
  const [tags, setTags] = useState(DEFAULT_TAGS);
  const [tagInput, setTagInput] = useState('');
  const [ingredients, setIngredients] = useState(DEFAULT_INGREDIENTS);
  const [ingredientInput, setIngredientInput] = useState('');
  const [recipeText, setRecipeText] = useState(DEFAULT_RECIPE);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const setPreviewFromFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus('Please select a PNG, JPG, JPEG, or WEBP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus('Image size must be 5 MB or smaller.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const nextPreview = URL.createObjectURL(file);
    setPreviewUrl(nextPreview);
    setImageSrc(nextPreview);
    setStatus('Image ready to publish.');
  };

  const handleFileChange = (event) => setPreviewFromFile(event.target.files?.[0]);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    setPreviewFromFile(event.dataTransfer.files?.[0]);
  };

  const addTag = () => {
    const nextTag = tagInput.trim().toUpperCase();
    if (!nextTag || tags.includes(nextTag)) return;
    setTags((current) => [...current, nextTag]);
    setTagInput('');
  };

  const addIngredient = () => {
    const nextIngredient = ingredientInput.trim();
    if (!nextIngredient) return;
    setIngredients((current) => [...current, nextIngredient]);
    setIngredientInput('');
  };

  const publishRecipe = () => {
    const safeName = recipeName.trim() || 'Untitled Mix';
    const slug = safeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'untitled-mix';

    setStatus('Your mix is ready. Opening its recipe page…');

    window.setTimeout(() => {
      navigate(`/recipe-details/${slug}`, {
        state: {
          name: safeName,
          description: description.trim() || 'A hand-coded CHILLD community recipe.',
          mood,
          tags,
          ingredients,
          recipeText,
          image: imageSrc,
          author: 'Arya Kagathara',
        },
      });
    }, 500);
  };

  return (
    <main className="create-recipe-page">
      {/* ── HERO HEADER ── */}
      <section className="create-recipe-hero" aria-labelledby="create-recipe-title">
        <div className="create-recipe-hero__graffiti" aria-hidden="true" />
        <div className="create-recipe-shell create-recipe-hero__content">
          <p className="create-recipe-hero__eyebrow">COMMUNITY RECIPE STUDIO</p>
          <h1 id="create-recipe-title">Code Your Vibe</h1>
          <p>Share your recipe with the CHILLD community.</p>
        </div>
      </section>

      <section className="create-recipe-shell create-recipe-workspace" aria-label="Create your coffee recipe">
        {/* ── MEDIA & DETAILS CONFIGURATION ── */}
        <div className="create-recipe-workspace__top">
          <div className="create-recipe-media-column">
            <input
              ref={fileInputRef}
              className="create-recipe-file-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              aria-label="Upload recipe photo"
            />

            <button
              type="button"
              className={`create-recipe-dropzone ${isDragging ? 'is-dragging' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload size={30} strokeWidth={1.8} />
              <strong>Drop File Here or Upload File</strong>
              <span>5 MB File Size Limit (PNG, JPEG, WEBP)</span>
            </button>

            <div className="create-recipe-preview">
              <button
                className="create-recipe-preview__remove"
                type="button"
                aria-label="Remove uploaded image"
                onClick={() => {
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                  setImageSrc(DEFAULT_IMAGE);
                  setStatus('Default drink image restored.');
                }}
              >
                <X size={18} />
              </button>
              <img src={imageSrc} alt="Recipe preview" />
            </div>
          </div>

          <div className="create-recipe-fields">
            <label className="create-recipe-field">
              <span>Give your recipe a name</span>
              <input
                value={recipeName}
                onChange={(event) => setRecipeName(event.target.value)}
                placeholder="Ex. Johpresso"
                maxLength={48}
              />
            </label>

            <label className="create-recipe-field">
              <span>Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Share your thoughts..."
                maxLength={280}
              />
            </label>

            <label className="create-recipe-field">
              <span>Mood Selector</span>
              <span className="create-recipe-select-wrap">
                <select value={mood} onChange={(event) => setMood(event.target.value)}>
                  <option>Chill</option>
                  <option>Focused</option>
                  <option>Cozy</option>
                  <option>Electric</option>
                  <option>Slow Sunday</option>
                </select>
                <ChevronDown size={18} aria-hidden="true" />
              </span>
            </label>

            <div className="create-recipe-field">
              <span>Enter Tags</span>
              <div className="create-recipe-tags-box">
                <div className="create-recipe-tags-list">
                  {tags.map((tag) => (
                    <button
                      type="button"
                      className="create-recipe-tag"
                      key={tag}
                      onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                      title={`Remove ${tag}`}
                    >
                      {tag}
                      <X size={13} />
                    </button>
                  ))}
                </div>
                <div className="create-recipe-tags-entry">
                  <Tag size={15} aria-hidden="true" />
                  <input
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag"
                  />
                  <button type="button" onClick={addTag} aria-label="Add tag">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── INGREDIENTS & STEPS EDITOR ── */}
        <div className="create-recipe-workspace__bottom">
          <section className="create-recipe-editor-card create-recipe-ingredients" aria-labelledby="ingredients-title">
            <div className="create-recipe-editor-card__heading">
              <h2 id="ingredients-title">Ingredients</h2>
              <span>{ingredients.length} items</span>
            </div>
            <ul>
              {ingredients.map((ingredient, index) => (
                <li key={`${ingredient}-${index}`}>
                  <button
                    type="button"
                    onClick={() => setIngredients((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                    aria-label={`Remove ${ingredient}`}
                  >
                    <X size={14} />
                  </button>
                  {ingredient}
                </li>
              ))}
            </ul>
            <div className="create-recipe-ingredients__entry">
              <input
                value={ingredientInput}
                onChange={(event) => setIngredientInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addIngredient();
                  }
                }}
                placeholder="Add an ingredient"
              />
              <button type="button" onClick={addIngredient}>
                <Plus size={16} /> Add
              </button>
            </div>
          </section>

          <section className="create-recipe-editor-card create-recipe-method" aria-labelledby="method-title">
            <div className="create-recipe-editor-card__heading">
              <h2 id="method-title">Recipe</h2>
              <span>Markdown-friendly</span>
            </div>
            <div className="create-recipe-toolbar" aria-hidden="true">
              <span>16</span><b>B</b><i>I</i><u>U</u><span>☷</span><span>☰</span><span>↗</span>
            </div>
            <textarea
              value={recipeText}
              onChange={(event) => setRecipeText(event.target.value)}
              aria-label="Recipe instructions"
            />
          </section>
        </div>

        {/* ── PUBLISH CONTROL ── */}
        <div className="create-recipe-publish-row">
          <p role="status" aria-live="polite">{status}</p>
          <button type="button" className="create-recipe-publish" onClick={publishRecipe}>
            <Sparkles size={17} /> Publish Your Mix
          </button>
        </div>
      </section>
    </main>
  );
}
